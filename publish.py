#!/usr/bin/env python3
"""Pinned two-phase root release. No build/pull/prune/current switch.

Run from the immutable incoming directory with the reviewed release.json.
Modes: prepare (new private container), activate (root-only proxy transaction),
rollback (restore exact retained root). Browser verification is performed by the
approved Ubuntu controller immediately after activation.
"""
import datetime
import fcntl
import hashlib
import ipaddress
import json
import os
from pathlib import Path
import re
import signal
import stat
import shutil
import subprocess
import sys
import tarfile
import time

import preflight as pf

ROOT = Path('/opt/onixbit-site')
RID = '20261006-firefox-mobile-motion'
NAME = 'onixbit-full-site-' + RID
PROXY = 'onixbit-site-caddy-1'
INCOMING = ROOT / 'full-site-incoming' / RID
TARGET = ROOT / 'full-site-releases' / RID
BACKUP = ROOT / 'full-site-backups' / RID
SOURCE_COMMIT = 'b02ad151cd35ae460e8de092bdef08fcc65b4fab'
BUILD = '0iX_SOxkdYFxUMYnumLO9'
FILE_COUNT = 3701
ARCHIVE_BYTES = 70991415
PREVIOUS = 'onixbit-full-site-20261006-theme-mobile-performance'
ARCHIVE_SHA = 'b8861ba846950e070a6abcb03fcb9f07f6325c76902d5a7f8c32138a54244df8'
MANIFEST_SHA = '51473ea42e2bdb83d48cd9c9f34727a5ea8a4cd249843b3ff9fcede4a2c0af16'
REPORT = {'releaseId': RID, 'buildId': BUILD, 'status': 'RUNNING', 'stage': 'initial',
          'startedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()}


def need(ok, code):
    if not ok:
        raise RuntimeError(code)


def cmd(*args, timeout=35):
    if args[0] == 'python3' and len(args) > 1 and Path(args[1]).name in ('http-probe.py', 'config-transaction.py'):
        name = Path(args[1]).name
        need(Path(args[1]) == INCOMING / name, 'HELPER_PATH')
        # Execute only the bytes verified by the trusted stdin launcher.
        source = PINNED_SCRIPTS[name].decode('utf8')
        p = subprocess.run(['python3', '-I', '-', *args[2:]], input=source,
                           capture_output=True, text=True, timeout=timeout)
    else:
        p = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    need(p.returncode == 0, 'COMMAND_FAILED_' + args[0].upper())
    return p.stdout.strip()


def sha(path):
    with path.open('rb') as stream:
        h = hashlib.sha256()
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def capacity(files, before_upload=False):
    st = os.statvfs(ROOT)
    docker_root = Path(cmd('docker', 'info', '--format', '{{.DockerRootDir}}'))
    need(docker_root.is_absolute() and docker_root.is_dir()
         and docker_root.stat().st_dev == ROOT.stat().st_dev, 'DOCKER_FILESYSTEM_NEEDS_SEPARATE_BUDGET')
    block = st.f_frsize
    need(512 <= block <= 65536, 'FILESYSTEM_ALLOCATION_UNIT')
    allocated = lambda size: ((size + block - 1) // block) * block
    dirs = {str(parent) for name in files for parent in Path(name).parents if str(parent) != '.'}
    runtime = sum(allocated(item['bytes']) for item in files.values()) + (len(dirs) + 1) * block
    archive = allocated(ARCHIVE_BYTES) if before_upload else 0
    # Independent resource model: metadata/reports16MiB, bounded logs32MiB,
    # Docker writable metadata16MiB, backup/journal8MiB. No image pull/build.
    extra = (16 + 32 + 16 + 8) * 1024**2
    retained = 1024**3
    required = archive + runtime + extra + retained
    free = st.f_bavail * block
    required_inodes = len(files) + len(dirs) + 1024
    mem = dict(line.split(':', 1) for line in Path('/proc/meminfo').read_text().splitlines())
    available = int(mem['MemAvailable'].split()[0]) * 1024
    result = {'allocationBlockBytes': block, 'freeBytes': free, 'runtimeAllocatedBudget': runtime,
              'dockerStorageSharesFilesystem': True,
              'incomingArchiveBudget': archive, 'metadataLogBackupBudget': extra,
              'retainedDiskBytes': retained, 'requiredFreeBytes': required,
              'freeInodes': st.f_favail, 'requiredFreeInodes': required_inodes,
              'availableMemoryBytes': available, 'requiredAvailableMemoryBytes': 1536 * 1024**2,
              'containerMemoryBytes': 768 * 1024**2, 'containerSwapEnabled': False,
              'tmpfsCapsMiB': {'tmp': 64, 'images': 128, 'routes': 64}}
    need(free >= required and st.f_favail >= required_inodes, 'INSUFFICIENT_MANIFEST_DERIVED_DISK_BUDGET')
    need(available >= 1536 * 1024**2, 'INSUFFICIENT_MEMORY')
    return result


def save(path, value):
    with path.open('x', encoding='utf8') as stream:
        json.dump(value, stream, indent=2)
        stream.write('\n')
        stream.flush()
        os.fsync(stream.fileno())


def safe_dir(path, create=False):
    need(path.is_relative_to(ROOT) and path.resolve() == path, 'PATH_OUTSIDE_CONTOUR')
    for part in [path, *path.parents]:
        if part == ROOT.parent:
            break
        need(not part.is_symlink(), 'SYMLINK_PATH')
        if part.exists():
            need(part.stat().st_dev == ROOT.stat().st_dev, 'CROSS_FILESYSTEM_STORAGE')
    if create:
        path.mkdir(parents=True, exist_ok=True, mode=0o755)
    need(path.is_dir(), 'MISSING_DIRECTORY')


def identity_checks(baseline, config_sha):
    need((ROOT / 'current').is_symlink(), 'CURRENT_NOT_SYMLINK')
    need(str((ROOT / 'current').resolve(strict=True)) == baseline['current'], 'CURRENT_DRIFT')
    active = Path(baseline['proxyConfig']['activePath'])
    need(active.is_relative_to(ROOT) and active.resolve() == active and not active.is_symlink(), 'ACTIVE_PATH')
    st = active.stat()
    inode = baseline['proxyConfig']['deviceInode']
    need(f'{st.st_dev}:{st.st_ino}' == inode and sha(active) == config_sha, 'HOST_CONFIG_DRIFT')
    need(cmd('docker', 'exec', PROXY, 'stat', '-Lc', '%d:%i', '/etc/caddy/Caddyfile') == inode, 'CONTAINER_INODE_DRIFT')
    need(cmd('docker', 'exec', PROXY, 'sha256sum', '/etc/caddy/Caddyfile').split()[0] == config_sha, 'CONTAINER_CONFIG_DRIFT')
    for before in baseline['containers']:
        need(pf.identity(before['name']) == before, 'PROTECTED_CONTAINER_DRIFT')
    return active


def protected_http(baseline, include_root=False):
    results = {}
    for url, before in baseline['http'].items():
        if url in ('https://onixbit.ru/', 'https://onixbit.ru/api/health') and not include_root:
            continue
        now = pf.http(url)
        need(now == before, 'PROTECTED_HTTP_DRIFT')
        results[url] = now
    # Exact all-file demo baseline, not just its two HTML pages.
    for item in RELEASE['demoFiles']:
        now = pf.http('https://onixbit.ru/demo/' + item['path'])
        need(now['status'] == 200 and now['sha256'] == item['sha256']
             and 'noindex' in now['xRobotsTag'] and now['cacheControl'] == 'no-store', 'DEMO_ASSET_DRIFT')
    return results


def verify_runtime(runtime, files):
    actual = set()
    for path in runtime.rglob('*'):
        need(not path.is_symlink(), 'RUNTIME_SYMLINK')
        if path.is_file():
            relative = path.relative_to(runtime).as_posix()
            need(relative in files, 'RUNTIME_EXTRA_FILE')
            item = files[relative]
            need(path.stat().st_size == item['bytes'] and sha(path) == item['sha256'], 'RUNTIME_FILE_HASH')
            actual.add(relative)
        else:
            need(path.is_dir(), 'RUNTIME_SPECIAL_ENTRY')
    need(actual == set(files), 'RUNTIME_FILE_SET')
    need((runtime / '.next/BUILD_ID').read_text().strip() == BUILD, 'BUILD_ID')


def probe(public, name):
    if public:
        base = 'https://onixbit.ru'
    else:
        value = cmd('docker', 'inspect', '--format', '{{(index .NetworkSettings.Networks "' + RELEASE['baseline']['network'] + '").IPAddress}}', NAME)
        address = ipaddress.ip_address(value)
        need(address.version == 4 and address.is_private, 'PRIVATE_UPSTREAM_IP')
        base = 'http://' + value + ':3000'
    report = TARGET / name
    cmd('python3', str(INCOMING / 'http-probe.py'), '--public' if public else '--internal',
        '--base', base, '--manifest', str(INCOMING / 'runtime-manifest.json'), '--report', str(report), timeout=300)
    result = json.loads(report.read_text())
    need(result['status'] == 'PASS', 'HTTP_PROBE_FAILED')
    return {'report': name, 'sha256': sha(report), 'status': 'PASS'}


def candidate_health_guard():
    need(pf.field(NAME, '.State.Running') is True and pf.field(NAME, '.State.OOMKilled') is False,
         'CANDIDATE_RUNNING_OR_OOM')
    need(pf.field(NAME, '.RestartCount') == 0, 'CANDIDATE_RESTARTED')
    need(pf.field(NAME, '.HostConfig.Memory') == 768 * 1024**2
         and pf.field(NAME, '.HostConfig.MemorySwap') == 768 * 1024**2, 'MEMORY_OR_SWAP_LIMIT')
    log_config = pf.field(NAME, '.HostConfig.LogConfig')
    need(log_config == {'Type': 'local', 'Config': {'max-size': '10m', 'max-file': '3'}}, 'BOUNDED_LOG_CONFIGURATION')
    mounts = pf.field(NAME, '.HostConfig.Tmpfs')
    need(set(mounts) == {'/tmp', '/app/.next/cache/images', '/app/.next/server/route-cache'}, 'TMPFS_MOUNT_SET')
    for path, size in (('/tmp', '64m'), ('/app/.next/cache/images', '128m'), ('/app/.next/server/route-cache', '64m')):
        need('size=' + size in mounts[path].split(','), 'TMPFS_BOUND')
    need(pf.field(NAME, '.HostConfig.ReadonlyRootfs') is True
         and pf.field(NAME, '.Config.User') == '1001:1001'
         and pf.field(NAME, '.HostConfig.Privileged') is False, 'CONTAINER_ISOLATION')
    need(pf.field(NAME, '.HostConfig.PortBindings') in (None, {}), 'PUBLIC_PORT_BINDING')
    need(pf.field(NAME, '.HostConfig.CapDrop') == ['ALL']
         and pf.field(NAME, '.HostConfig.CapAdd') in (None, []), 'CONTAINER_CAPABILITIES')
    need(pf.field(NAME, '.HostConfig.SecurityOpt') == ['no-new-privileges:true'], 'NO_NEW_PRIVILEGES')
    actual_mounts = pf.field(NAME, '.Mounts')
    binds = [m for m in actual_mounts if m['Type'] == 'bind']
    need(len(binds) == 1 and binds[0]['Source'] == str(TARGET / 'runtime')
         and binds[0]['Destination'] == '/app' and binds[0]['RW'] is False, 'RUNTIME_BIND')
    need(all(m['Type'] == 'bind' or (m['Type'] == 'tmpfs' and m['Destination'] in mounts)
             for m in actual_mounts), 'UNBUDGETED_VOLUME')


def remaining_capacity():
    # Retain the full free-space floor even after future bounded log/metadata growth.
    need(shutil.disk_usage(ROOT).free >= 1024**3 + 72 * 1024**2, 'DISK_RESERVE_AFTER_PREPARE')
    need(os.statvfs(ROOT).f_favail >= 1024, 'REMAINING_INODES')
    mem = dict(line.split(':', 1) for line in Path('/proc/meminfo').read_text().splitlines())
    need(int(mem['MemAvailable'].split()[0]) * 1024 >= 768 * 1024**2, 'REMAINING_MEMORY')


def writer(mode):
    baseline = RELEASE['baseline']
    cmd('python3', str(INCOMING / 'config-transaction.py'), baseline['proxyConfig']['activePath'],
        str(BACKUP / 'Caddyfile.before'), str(BACKUP / 'Caddyfile.candidate'),
        str(BACKUP / 'activation.json'), baseline['proxyConfig']['deviceInode'], mode, PREVIOUS, NAME)


def reload_proxy():
    cmd('docker', 'exec', PROXY, 'caddy', 'validate', '--config', '/etc/caddy/Caddyfile', '--adapter', 'caddyfile')
    cmd('docker', 'exec', PROXY, 'caddy', 'reload', '--config', '/etc/caddy/Caddyfile', '--adapter', 'caddyfile')


def restore():
    REPORT['stage'] = 'rollback'
    writer('restore')  # Refuses unrelated drift, including a changed bind inode.
    reload_proxy()
    identity_checks(RELEASE['baseline'], RELEASE['baseline']['proxyConfig']['sha256'])
    protected_http(RELEASE['baseline'], include_root=True)
    REPORT['rollback'] = 'PASS; previous root restored; candidate retained for diagnosis'


def prepare(files):
    REPORT['stage'] = 'preflight'
    b = RELEASE['baseline']
    active = identity_checks(b, b['proxyConfig']['sha256'])
    protected_http(b, include_root=True)
    for path in (TARGET, BACKUP):
        need(not path.exists() and not path.is_symlink(), 'RELEASE_ALREADY_EXISTS_INSPECT_BEFORE_RETRY')
    names = cmd('docker', 'ps', '-a', '--format', '{{.Names}}').splitlines()
    need(NAME not in names, 'CANDIDATE_ALREADY_EXISTS')
    need(sha(INCOMING / 'runtime.tar.gz') == ARCHIVE_SHA, 'ARCHIVE_SHA')
    REPORT['capacity'] = capacity(files)
    safe_dir(TARGET, True)
    safe_dir(BACKUP, True)
    BACKUP.chmod(0o700)
    original = active.read_bytes()
    with (BACKUP / 'Caddyfile.before').open('xb') as output:
        output.write(original); output.flush(); os.fsync(output.fileno())
    (BACKUP / 'Caddyfile.before').chmod(0o600)
    save(BACKUP / 'before.json', b)
    runtime = TARGET / 'runtime'
    runtime.mkdir()
    REPORT['stage'] = 'extract'
    seen = set()
    with tarfile.open(INCOMING / 'runtime.tar.gz', 'r:gz') as archive:
        for member in archive:
            name = member.name.removeprefix('./')
            parts = Path(name).parts
            need(not Path(name).is_absolute() and '..' not in parts and name not in seen,
                 'UNSAFE_ARCHIVE_MEMBER')
            seen.add(name)
            dest = runtime / name
            if member.isdir():
                dest.mkdir(parents=True, exist_ok=True, mode=0o755)
                continue
            need(member.isfile() and name in files and member.size == files[name]['bytes'], 'ARCHIVE_ENTRY_CONTRACT')
            dest.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
            with archive.extractfile(member) as src, dest.open('xb') as dst:
                shutil.copyfileobj(src, dst, 1024 * 1024)
            dest.chmod(0o644)
    verify_runtime(runtime, files)
    # Empty mountpoint directories do not change manifested application files.
    (runtime / '.next/cache/images').mkdir(parents=True, exist_ok=True)
    (runtime / '.next/server/route-cache').mkdir(parents=True, exist_ok=True)
    REPORT['stage'] = 'private-container'
    image = RELEASE['imageId']
    need(re.fullmatch(r'sha256:[a-f0-9]{64}', image), 'IMAGE_ID')
    cmd('docker', 'image', 'inspect', '--format', '{{.Id}}', image)
    need(json.loads(cmd('docker', 'image', 'inspect', '--format', '{{json .Config.Volumes}}', image)) in (None, {}),
         'IMAGE_DECLARED_UNBUDGETED_VOLUME')
    cmd('docker', 'run', '-d', '--name', NAME, '--restart', 'unless-stopped',
        '--network', b['network'], '--user', '1001:1001', '--workdir', '/app',
        '--entrypoint', 'node',
        '--memory', '768m', '--memory-swap', '768m', '--cpus', '1', '--pids-limit', '256',
        '--log-driver', 'local', '--log-opt', 'max-size=10m', '--log-opt', 'max-file=3',
        '--read-only', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges:true',
        '--tmpfs', '/tmp:rw,noexec,nosuid,size=64m,uid=1001,gid=1001',
        '--tmpfs', '/app/.next/cache/images:rw,noexec,nosuid,size=128m,uid=1001,gid=1001',
        '--tmpfs', '/app/.next/server/route-cache:rw,noexec,nosuid,size=64m,uid=1001,gid=1001',
        '--mount', 'type=bind,src=' + str(runtime) + ',dst=/app,readonly',
        '-e', 'NODE_ENV=production', '-e', 'NEXT_TELEMETRY_DISABLED=1', '-e', 'PORT=3000',
        '-e', 'HOSTNAME=0.0.0.0', '-e', 'NODE_OPTIONS=--max-old-space-size=448',
        image, 'server.js')
    for attempt in range(30):
        need(pf.field(NAME, '.State.Running'), 'CANDIDATE_EXITED')
        p = subprocess.run(['docker', 'exec', PROXY, 'wget', '-q', '-T', '3', '-O', '-',
                            'http://' + NAME + ':3000/api/health'], capture_output=True)
        if p.returncode == 0 and p.stdout == b'{"ok":true,"service":"onixbit"}':
            break
        need(attempt != 29, 'PRIVATE_HEALTH_TIMEOUT')
        time.sleep(1)
    REPORT['privateHttp'] = probe(False, 'private-http.json')
    candidate_health_guard()
    REPORT['candidateContainer'] = pf.identity(NAME)
    need(REPORT['candidateContainer']['imageId'] == image, 'CANDIDATE_IMAGE_MISMATCH')
    identity_checks(b, b['proxyConfig']['sha256'])
    protected_http(b, include_root=True)
    remaining_capacity()
    REPORT['status'] = 'PREPARED'
    save(TARGET / 'prepared.json', REPORT)


def activate():
    REPORT['stage'] = 'activation-preflight'
    prepared = json.loads((TARGET / 'prepared.json').read_text())
    need(prepared['status'] == 'PREPARED' and pf.identity(NAME) == prepared['candidateContainer'], 'CANDIDATE_DRIFT')
    b = RELEASE['baseline']
    active = identity_checks(b, b['proxyConfig']['sha256'])
    protected_http(b, include_root=True)
    remaining_capacity()
    REPORT['privateHttp'] = probe(False, 'activation-private-http.json')
    candidate_health_guard()
    before = (BACKUP / 'Caddyfile.before').read_bytes()
    need(before == active.read_bytes(), 'BACKUP_CONFIG_MISMATCH')
    need(b['proxyConfig']['rootUpstream'] == PREVIOUS + ':3000', 'PREVIOUS_UPSTREAM_PIN')
    old = ('reverse_proxy ' + PREVIOUS + ':3000').encode()
    need(before.count(old) == 1, 'ROOT_UPSTREAM_NOT_UNIQUE')
    candidate = before.replace(old, ('reverse_proxy ' + NAME + ':3000').encode(), 1)
    with (BACKUP / 'Caddyfile.candidate').open('xb') as output:
        output.write(candidate); output.flush(); os.fsync(output.fileno())
    validated = subprocess.run(['docker', 'exec', '-i', PROXY, 'caddy', 'validate', '--config', '-', '--adapter', 'caddyfile'], input=candidate, capture_output=True, timeout=35)
    need(validated.returncode == 0, 'CANDIDATE_CONFIG_INVALID')
    identity_checks(b, b['proxyConfig']['sha256'])
    protected_http(b, include_root=True)
    REPORT['stage'] = 'root-upstream-transaction'
    try:
        writer('activate')
        reload_proxy()
        REPORT['publicHttp'] = probe(True, 'public-http.json')
        candidate_health_guard()
        remaining_capacity()
        REPORT['protected'] = protected_http(b)
        identity_checks(b, pf.digest(candidate))
        need(pf.identity(NAME) == prepared['candidateContainer'], 'CANDIDATE_CHANGED_AFTER_ACTIVATE')
        REPORT['status'] = 'ACTIVATED_HTTP_PASS_AWAITING_LIVE_UI'
        REPORT['candidateContainer'] = prepared['candidateContainer']
        REPORT['configSHA256'] = pf.digest(candidate)
        save(TARGET / 'activation-result.json', REPORT)
    except BaseException:
        restore()
        raise


def main():
    global RELEASE
    need(len(sys.argv) == 2 and sys.argv[1] in ('budget', 'prepare', 'activate', 'rollback'), 'MODE_REQUIRED')
    need(re.fullmatch(r'[a-f0-9]{40}', SOURCE_COMMIT) and re.fullmatch(r'[a-f0-9]{64}', ARCHIVE_SHA)
         and re.fullmatch(r'[a-f0-9]{64}', MANIFEST_SHA) and '__UNFROZEN' not in BUILD
         and type(FILE_COUNT) is int and FILE_COUNT > 0 and type(ARCHIVE_BYTES) is int and ARCHIVE_BYTES > 0, 'FINAL_PINS_REQUIRED')
    need(Path.cwd().resolve() == INCOMING, 'EXACT_INCOMING_CWD_REQUIRED')
    safe_dir(ROOT); safe_dir(INCOMING)
    need(isinstance(globals().get('PINNED_RELEASE'), dict)
         and isinstance(globals().get('PINNED_SCRIPTS'), dict), 'TRUSTED_STDIN_LAUNCH_REQUIRED')
    RELEASE = PINNED_RELEASE
    need(RELEASE['releaseId'] == RID and RELEASE['archiveSHA256'] == ARCHIVE_SHA, 'RELEASE_PIN')
    need(sha(INCOMING / 'runtime-manifest.json') == MANIFEST_SHA, 'MANIFEST_PIN')
    for name, expected in RELEASE['scripts'].items():
        need(re.fullmatch(r'[a-z-]+\.py', name) and sha(INCOMING / name) == expected, 'SCRIPT_PIN')
    lock_path = ROOT / '.full-site-publish.lock'
    fd = os.open(lock_path, os.O_CREAT | os.O_WRONLY | os.O_NOFOLLOW | os.O_NONBLOCK, 0o600)
    need(stat.S_ISREG(os.fstat(fd).st_mode), 'NONREGULAR_RELEASE_LOCK')
    fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
    # Share the existing preview deployment lock as well as Actions concurrency.
    demo_fd = os.open(ROOT / '.demo-publish.lock', os.O_CREAT | os.O_WRONLY | os.O_NOFOLLOW | os.O_NONBLOCK, 0o600)
    need(stat.S_ISREG(os.fstat(demo_fd).st_mode), 'NONREGULAR_DEMO_LOCK')
    fcntl.flock(demo_fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
    manifest = json.loads((INCOMING / 'runtime-manifest.json').read_text())
    files = {item['path']: item for item in manifest['files']}
    need(len(files) == FILE_COUNT and manifest['buildId'] == BUILD and manifest['sourceCommit'] == SOURCE_COMMIT, 'MANIFEST_IDENTITY')
    if sys.argv[1] == 'budget':
        REPORT['capacity'] = capacity(files, before_upload=True)
        REPORT['status'] = 'BUDGET_PASS'
    elif sys.argv[1] == 'prepare':
        prepare(files)
    elif sys.argv[1] == 'activate':
        verify_runtime(TARGET / 'runtime', files)
        activate()
    else:
        restore(); REPORT['status'] = 'ROLLED_BACK'
    REPORT['finishedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()


if __name__ == '__main__':
    os.umask(0o022)
    def interrupted(signum, frame):
        raise InterruptedError('Release interrupted')
    for signum in (signal.SIGINT, signal.SIGTERM, signal.SIGHUP):
        signal.signal(signum, interrupted)
    try:
        main()
    except BaseException as error:
        REPORT['status'] = 'STOP'
        REPORT['failureCode'] = str(error) if type(error) is RuntimeError else type(error).__name__
    payload = json.dumps(REPORT, sort_keys=True).encode().hex()
    print('ONIXBIT_RELEASE_REPORT_AP=' + payload.translate(str.maketrans('0123456789abcdef', 'abcdefghijklmnop')))
    sys.exit(0 if REPORT['status'] in ('BUDGET_PASS', 'PREPARED', 'ACTIVATED_HTTP_PASS_AWAITING_LIVE_UI', 'ROLLED_BACK') else 1)
