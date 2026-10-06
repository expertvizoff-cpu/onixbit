"""Exact /design retirement. PLAN is injected from the reviewed fresh inventory.

No prune, images, volumes, other runtimes, source repositories or lead submissions.
"""
import datetime, fcntl, hashlib, json, os, re, shutil, stat, subprocess, sys, tarfile
import urllib.request, urllib.error
from pathlib import Path

PLAN = {'configPath': '/opt/onixbit-site/releases/7c96b74bae0711ee9041b7ebfeb2bdc545b220b2/Caddyfile', 'configSHA256': 'b7c84e672ef7ae32e985c08652b20ab002ad3799b9522b2354bb669298fdfb4e', 'configInode': '64771:129052', 'current': '/opt/onixbit-site/releases/bc80907dd9f716c9db36506704b73d7c5899d67e', 'targets': [{'name': 'onixbit-design-b24-concept-0b57c249b34d', 'id': 'd615917c3ced438ce4c98e9945ed7c1042ee3d724cbe91b90299953b843ae1f7', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': True, 'startedAt': '2026-09-28T13:49:45.316633906Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/previews/b24-concept-0b57c249b34d', 'Destination': '/app', 'RW': False}]}, {'name': 'onixbit-design-20260928-full-new-site-v3-3a1d3f65', 'id': '5b1d80670b131a8e4a2bde13877b159535423102a6387d772536f54428bef1b2', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': False, 'startedAt': '2026-09-28T12:39:27.00820827Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/previews/20260928-full-new-site-v3-3a1d3f65', 'Destination': '/app', 'RW': False}]}], 'protected': [{'name': 'onixbit-full-site-20261006-premium-mobile-rendering', 'id': '8e733d5fe5a0b11f4c0fbf4f89843972a7eb07be2d640d284a2d0a0d4d14a83e', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': True, 'startedAt': '2026-10-06T19:03:06.237190508Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/full-site-releases/20261006-premium-mobile-rendering/runtime', 'Destination': '/app', 'RW': False}]}, {'name': 'onixbit-full-site-20261006-firefox-mobile-motion', 'id': 'b0b4d212116e3c9acb95b6592de17f9b612e9904dd8a4e68e93a00c95afcb6f5', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': True, 'startedAt': '2026-10-06T16:52:04.116682973Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/full-site-releases/20261006-firefox-mobile-motion/runtime', 'Destination': '/app', 'RW': False}]}, {'name': 'onixbit-full-site-20261006-theme-mobile-performance', 'id': '0056429088cd9114244f0f38c96b64b9bc3606e644fe8eb01a7344621ab57b04', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': True, 'startedAt': '2026-10-06T16:10:22.923124505Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/full-site-releases/20261006-theme-mobile-performance/runtime', 'Destination': '/app', 'RW': False}]}, {'name': 'onixbit-full-site-20261006-mobile-video-hidden', 'id': '5b4d8da73f539e61a97298fba74306af7c6cb6e1f9b6bbfae99f6cb621143f69', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': False, 'startedAt': '2026-10-06T12:30:08.192595715Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/full-site-releases/20261006-mobile-video-hidden/runtime', 'Destination': '/app', 'RW': False}]}, {'name': 'onixbit-full-site-20261006-design-root-copy', 'id': '437872a6c0d0a69aa9123843cc9deaf7340caae9e8f698c3b9662a5f8742b7c0', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': False, 'startedAt': '2026-10-06T11:02:35.591376073Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/full-site-releases/20261006-design-root-copy/runtime', 'Destination': '/app', 'RW': False}]}, {'name': 'onixbit-full-site-20261004-content-depth-rc', 'id': '51cacfedef85fd793cbfa81ef99a778f9bc2da735ea2752351988159c023f0b3', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': False, 'startedAt': '2026-10-04T06:58:49.673721221Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/full-site-releases/20261004-content-depth-rc/runtime', 'Destination': '/app', 'RW': False}]}, {'name': 'onixbit-full-site-20261004-relay-f178f70', 'id': 'b64148d18bc83c286fec8a5b6df932d9f8388807f657eee475943ae0378b2ac2', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': False, 'startedAt': '2026-10-04T04:07:00.617443609Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/full-site-releases/20261004-relay-f178f70/runtime', 'Destination': '/app', 'RW': False}]}, {'name': 'onixbit-full-site-20261003-full-site-rc-0f191e5', 'id': '5ffaf5be8d2b7e19863417939fc7901d24e6b68d925c90f8a089059d2535b3cb', 'image': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'running': False, 'startedAt': '2026-10-03T18:19:54.81259699Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/full-site-releases/20261003-full-site-rc-0f191e5/runtime', 'Destination': '/app', 'RW': False}]}, {'name': 'onixbit-demo-20261002-relay-demo-launch-foundation-v5', 'id': 'fa17cf1e01cb366246ebc6097383958cfce6f7471258d2ceb9895dca98df12a3', 'image': 'sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648', 'running': False, 'startedAt': '2026-10-03T08:00:53.399434882Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/previews/20261002-relay-demo-launch-foundation-v5/site', 'Destination': '/srv', 'RW': False}]}, {'name': 'onixbit-site-web-1', 'id': 'e820d16fc0804bfea038ee64308b7a6dc8ebf184973bddbd79aa1d6e3f4b4e53', 'image': 'sha256:ec73d93b72199683b0b903e5d1808af9b916518c99c7b4048fa7d46dce58f1a6', 'running': True, 'startedAt': '2026-09-28T07:20:43.136458054Z', 'mounts': []}, {'name': 'onixbit-site-caddy-1', 'id': '430f8973554a64e331d48d700c7fcd2eaf878a24415afd8e1627e1839872e531', 'image': 'sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648', 'running': True, 'startedAt': '2026-09-20T17:53:01.097506219Z', 'mounts': [{'Type': 'bind', 'Source': '/opt/onixbit-site/current/Caddyfile', 'Destination': '/etc/caddy/Caddyfile', 'RW': False}, {'Type': 'volume', 'Source': '/var/lib/docker/volumes/onixbit-site_caddy_data/_data', 'Destination': '/data', 'RW': True}, {'Type': 'volume', 'Source': '/var/lib/docker/volumes/onixbit-site_caddy_config/_data', 'Destination': '/config', 'RW': True}]}, {'name': 'onixbit-media-archive-media-archive-worker-1', 'id': '74179542d966efc5b9e9e9b52841de00f551ab4a3fb6d0784acb75b15ddb6a74', 'image': 'sha256:1c671ae0a6392fc46bbc291cd6dd7479f413b610675fb8031e21d8dc2c33fae3', 'running': True, 'startedAt': '2026-08-26T05:07:07.058142519Z', 'mounts': [{'Type': 'bind', 'Source': '/home/deploy/apps/onixbit-media-archive/state', 'Destination': '/data', 'RW': True}]}, {'name': 'onixbit-media-archive-media-archive-player-1', 'id': 'edad2a768964929a8c0f7a11c42b4542255333f6c3944639ac5236e497dde338', 'image': 'sha256:42c3fb8c59c3ebe2ca1c065b641654fa99a88983f7bc75bf15f1d771e14744ac', 'running': True, 'startedAt': '2026-08-26T05:07:06.987263083Z', 'mounts': []}, {'name': 'onixbit-temp-sftp', 'id': '03f159b8b173cb1dacbde205dc3e43e574d23822467b9bac237805ec0e89c5e8', 'image': 'sha256:2bbdeb42a94c20260e698340b669ad649e59cf592945946438cf525e0d89b218', 'running': True, 'startedAt': '2026-08-26T05:07:07.051946241Z', 'mounts': [{'Type': 'bind', 'Source': '/home/deploy/onixbit-client-upload/incoming', 'Destination': '/data/incoming', 'RW': True}]}], 'paths': [{'path': 'previews/20260928-full-new-site-v3-3a1d3f65', 'bytesOnDisk': 660197376, 'mtime': 1790599170.3683844, 'directory': True, 'mountUsers': ['onixbit-design-20260928-full-new-site-v3-3a1d3f65'], 'buildIds': ['CctOlBW1WgE84o2WQSbim']}, {'path': 'previews/b24-concept-0b57c249b34d', 'bytesOnDisk': 663334912, 'mtime': 1790603388.10167, 'directory': True, 'mountUsers': ['onixbit-design-b24-concept-0b57c249b34d'], 'buildIds': ['OtLQLjeJFWmCuS1XSohIB']}]}
ROOT = Path('/opt/onixbit-site')
BACKUP = ROOT / 'cleanup-backups/20261006-design-retired'
PROXY = 'onixbit-site-caddy-1'
ACTIVE = 'onixbit-full-site-20261006-premium-mobile-rendering'
PREVIOUS = 'onixbit-full-site-20261006-firefox-mobile-motion'
CONFIG = Path(PLAN['configPath'])
REPORT = {'status': 'RUNNING', 'mode': sys.argv[1], 'removedPaths': [], 'removedContainers': []}
URLS = ['https://onixbit.ru' + p for p in ['/', '/api/health', '/o-kompanii', '/vnedrenie-bitrix24', '/robots.txt', '/sitemap.xml', '/demo/']] + ['https://media.onixbit.ru/healthz']

def need(ok, message):
    if not ok: raise RuntimeError(message)

def run(*args, input=None, timeout=90):
    p = subprocess.run(args, input=input, capture_output=True, text=True, timeout=timeout)
    need(p.returncode == 0, 'COMMAND_FAILED_' + args[0])
    return p.stdout.strip()

def sha(data): return hashlib.sha256(data).hexdigest()

def file_sha(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for part in iter(lambda: f.read(1024*1024), b''): h.update(part)
    return h.hexdigest()

def field(name, value): return json.loads(run('docker', 'inspect', '--format', '{{json '+value+'}}', name))

def canonical(c):
    c = json.loads(json.dumps(c))
    c['mounts'].sort(key=lambda m: (m.get('Destination') or '', m.get('Source') or ''))
    return c

def identity(name):
    return canonical({'name': name, 'id': field(name, '.Id'), 'image': field(name, '.Image'),
        'running': field(name, '.State.Running'), 'startedAt': field(name, '.State.StartedAt'),
        'mounts': [{k: m.get(k) for k in ['Type', 'Source', 'Destination', 'RW']} for m in field(name, '.Mounts')]})

def http(url):
    try: r = urllib.request.urlopen(urllib.request.Request(url, headers={'Accept-Encoding':'identity'}), timeout=30)
    except urllib.error.HTTPError as e: r = e
    with r:
        data = r.read(8*1024**2+1)
        need(len(data) <= 8*1024**2, 'HTTP_SIZE')
        return {'status': r.status, 'sha256': sha(data), 'robots': r.headers.get('X-Robots-Tag', '')}

def protect(expected_sha):
    need(CONFIG.resolve() == CONFIG and not CONFIG.is_symlink(), 'CONFIG_PATH')
    st = CONFIG.stat()
    need(f'{st.st_dev}:{st.st_ino}' == PLAN['configInode'] and file_sha(CONFIG) == expected_sha, 'CONFIG_DRIFT')
    need(run('docker','exec',PROXY,'sha256sum','/etc/caddy/Caddyfile').split()[0] == expected_sha, 'BOUND_CONFIG_DRIFT')
    need(str((ROOT/'current').resolve()) == PLAN['current'], 'CURRENT_DRIFT')
    for c in PLAN['protected']: need(identity(c['name']) == canonical(c), 'PROTECTED_CONTAINER_DRIFT_' + c['name'])
    result = {u: http(u) for u in URLS}
    need(all(v['status'] == (404 if u.endswith('/demo/') else 200) for u,v in result.items()), 'PROTECTED_HTTP_STATUS')
    if 'beforeHttp' in REPORT: need(result == REPORT['beforeHttp'], 'PROTECTED_HTTP_CHANGED')
    return result

def durable(path, data):
    with path.open('wb') as f: f.write(data); f.flush(); os.fsync(f.fileno())

def journal():
    durable(BACKUP/'result.next', (json.dumps(REPORT, indent=2)+'\n').encode())
    os.replace(BACKUP/'result.next', BACKUP/'result.json')

def config_write(data, expected):
    fd = os.open(CONFIG, os.O_RDWR | os.O_NOFOLLOW)
    try:
        st = os.fstat(fd)
        need(f'{st.st_dev}:{st.st_ino}' == PLAN['configInode'], 'WRITE_INODE_DRIFT')
        need(os.read(fd, len(expected)+1) == expected, 'WRITE_CONTENT_DRIFT')
        os.lseek(fd, 0, os.SEEK_SET)
        offset = 0
        try:
            while offset < len(data): offset += os.write(fd, data[offset:])
            os.ftruncate(fd, len(data)); os.fsync(fd)
        except BaseException:
            os.lseek(fd, 0, os.SEEK_SET); offset = 0
            while offset < len(expected): offset += os.write(fd, expected[offset:])
            os.ftruncate(fd, len(expected)); os.fsync(fd)
            raise
    finally: os.close(fd)

def reload(): run('docker','exec',PROXY,'caddy','reload','--config','/etc/caddy/Caddyfile','--adapter','caddyfile')

def candidate(before):
    s = before.decode(); begin = '  # BEGIN ONIXBIT DESIGN PREVIEW'; end = '  # END ONIXBIT DESIGN PREVIEW'
    need(s.count(begin) == s.count(end) == 1, 'DESIGN_MARKERS')
    a = s.index(begin); b = s.index(end,a)+len(end)
    old = '    reverse_proxy onixbit-design-b24-concept-0b57c249b34d:3000'
    need(s.count(old) == 1 and old in s[a:b], 'DESIGN_UPSTREAM')
    need('onixbit-design-' not in s[:a]+s[b:], 'OTHER_DESIGN_REFERENCE')
    # Historical DESIGN PREVIEW markers also surround the main fallback route.
    # Replace one exact upstream line; preserve all other routing byte-for-byte.
    return s.replace(old, '    respond "Not Found" 404', 1).encode()


def manifest():
    result = {}
    for e in PLAN['paths']:
        p = ROOT/e['path']
        need(p.resolve() == p and p.is_dir() and not p.is_symlink(), 'TARGET_PATH')
        need(p.parent == ROOT/'previews', 'TARGET_SCOPE')
        need([ (p/'.next/BUILD_ID').read_text().strip() ] == e['buildIds'], 'TARGET_BUILD')
        for c in PLAN['protected']:
            for m in c['mounts']: need(not m.get('Source') or not Path(m['Source']).resolve().is_relative_to(p), 'SHARED_MOUNT')
        for q in sorted(p.rglob('*')):
            need(not q.is_symlink(), 'TARGET_SYMLINK')
            need(q.is_dir() or q.is_file(), 'SPECIAL_FILE')
            if q.is_file():
                need(not any(x.startswith('.env') or x in ('.git','.secrets') for x in q.relative_to(p).parts), 'PRIVATE_FILE_IN_RUNTIME')
                result[str(q.relative_to(ROOT))] = {'bytes':q.stat().st_size,'sha256':file_sha(q)}
    need(0 < sum(f['bytes'] for f in result.values()) < 2*1024**3, 'MANIFEST_SIZE')
    return result

def retired_http():
    result = {p:http('https://onixbit.ru'+p) for p in ['/design','/design/','/design/vnedrenie-bitrix24','/design/api/health']}
    need(all(v['status']==404 and 'noindex' in v['robots'] for v in result.values()), 'DESIGN_NOT_RETIRED')
    return result

def restore_files():
    with tarfile.open(BACKUP/'design-runtime.tgz') as t: t.extractall(ROOT, filter='data')

def main():
    need(REPORT['mode'] in ('--plan','--apply'), 'MODE')
    need(ROOT.resolve()==ROOT and not BACKUP.exists() and BACKUP.resolve()==BACKUP, 'BACKUP_SCOPE_OR_ALREADY_STARTED')
    need(shutil.rmtree.avoids_symlink_attacks, 'SAFE_DELETE_REQUIRED')
    locks=[]
    for name in ('.full-site-publish.lock','.demo-publish.lock'):
        fd=os.open(ROOT/name,os.O_RDONLY|os.O_NOFOLLOW); need(stat.S_ISREG(os.fstat(fd).st_mode),'LOCK'); fcntl.flock(fd,fcntl.LOCK_EX|fcntl.LOCK_NB); locks.append(fd)
    try:
        REPORT['beforeHttp']=protect(PLAN['configSHA256'])
        names={n for n in run('docker','ps','-a','--format','{{.Names}}').splitlines() if n.startswith('onixbit-')}
        need(names == {c['name'] for c in PLAN['targets']+PLAN['protected']}, 'CONTAINER_SET_DRIFT')
        for c in PLAN['targets']: need(identity(c['name'])==canonical(c), 'TARGET_IDENTITY')
        need(run('docker','exec',ACTIVE,'cat','/app/.next/BUILD_ID')=='QiNFQdykc8e9xuMoIr_bK','ROOT_BUILD')
        need(json.loads(run('docker','exec',PROXY,'wget','-q','-T','10','-O','-','http://'+PREVIOUS+':3000/api/health'))=={'ok':True,'service':'onixbit'},'ROOT_ROLLBACK_HEALTH')
        before=CONFIG.read_bytes(); after=candidate(before)
        REPORT['configStructure'] = {'beforeRootCount': before.count(('reverse_proxy '+ACTIVE+':3000').encode()), 'afterRootCount': after.count(('reverse_proxy '+ACTIVE+':3000').encode()), 'lines': [line.strip() for line in before.decode().splitlines() if any(token in line for token in ['# BEGIN ONIXBIT', '# END ONIXBIT', 'reverse_proxy', 'handle ', 'handle_path ', '@design', '@preview'])]}
        need(after.count(('reverse_proxy '+ACTIVE+':3000').encode())==1,'ROOT_UPSTREAM_SCOPE')
        rollback=after.replace(('reverse_proxy '+ACTIVE+':3000').encode(),('reverse_proxy '+PREVIOUS+':3000').encode())
        for data in (after,rollback):run('docker','exec','-i',PROXY,'caddy','validate','--config','-','--adapter','caddyfile',input=data.decode())
        files=manifest()
        REPORT.update(checkedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),candidateSHA256=sha(after),rootRollbackSHA256=sha(rollback),runtimeBytes=sum(x['bytes'] for x in files.values()),backupFileCount=len(files),diskFreeBefore=shutil.disk_usage(ROOT).free)
        REPORT['containerStats']=[json.loads(s) for s in run('docker','stats','--no-stream','--format','{{json .}}',*[c['name'] for c in PLAN['targets']+PLAN['protected'] if c['running']]).splitlines()]
        if REPORT['mode']=='--plan':REPORT['status']='PLAN_PASS'; return
        BACKUP.mkdir(mode=0o700,parents=True)
        for name,data in [('Caddyfile.before',before),('Caddyfile.retired',after),('Caddyfile.root-rollback',rollback),('manifest.json',(json.dumps(files,indent=2)+'\n').encode())]:durable(BACKUP/name,data)
        # Private operational recovery metadata stays mode0600 on its original server.
        for c in PLAN['targets']:
            p=BACKUP/(c['name']+'.inspect.json');durable(p,run('docker','inspect',c['id']).encode());p.chmod(0o600)
        with tarfile.open(BACKUP/'design-runtime.tgz','w:gz',compresslevel=1) as t:
            for name in files:t.add(ROOT/name,arcname=name,recursive=False)
        with (BACKUP/'design-runtime.tgz').open('rb') as f:os.fsync(f.fileno())
        with tarfile.open(BACKUP/'design-runtime.tgz') as t:
            seen=set()
            for m in t:
                need(m.isfile() and m.name in files and m.name not in seen,'ARCHIVE_MEMBER')
                h=hashlib.sha256();f=t.extractfile(m)
                for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
                need(h.hexdigest()==files[m.name]['sha256'] and m.size==files[m.name]['bytes'],'ARCHIVE_HASH');seen.add(m.name)
            need(seen==set(files),'ARCHIVE_COMPLETE')
        REPORT.update(archiveBytes=(BACKUP/'design-runtime.tgz').stat().st_size,archiveSHA256=file_sha(BACKUP/'design-runtime.tgz'))
        journal()
        try:
            protect(PLAN['configSHA256']);need(manifest()==files,'RUNTIME_DRIFT_BEFORE_SWITCH')
            config_write(after,before);reload();protect(sha(after));retired_http()
            for c in PLAN['targets']:
                need(identity(c['name'])==canonical(c),'TARGET_CHANGED_BEFORE_STOP')
                if c['running']:run('docker','stop','--time','30',c['id'])
            need(manifest()==files,'RUNTIME_DRIFT_BEFORE_DELETE')
            for e in PLAN['paths']:
                p=ROOT/e['path'];need(p.resolve()==p and not p.is_symlink(),'DELETE_PATH_CHANGED');shutil.rmtree(p);REPORT['removedPaths'].append(e['path']);journal()
            REPORT['afterHttp']=protect(sha(after));REPORT['designHttp']=retired_http()
        except BaseException:
            restore_files()
            for c in PLAN['targets']:
                if c['running'] and not field(c['name'],'.State.Running'):run('docker','start',c['id'])
            current=CONFIG.read_bytes();need(current in (before,after),'ROLLBACK_CONFIG_DRIFT')
            if current!=before:config_write(before,current)
            reload();protect(PLAN['configSHA256']);REPORT['rollback']='PASS';journal();raise
        # HTTP is verified before permanently removing stopped container metadata.
        for c in PLAN['targets']:
            need(field(c['name'],'.Id')==c['id'] and not field(c['name'],'.State.Running'),'REMOVE_IDENTITY')
            run('docker','rm',c['id']);REPORT['removedContainers'].append(c['name']);journal()
        REPORT['afterHttp']=protect(sha(after));REPORT['designHttp']=retired_http()
        need(not any((ROOT/e['path']).exists() for e in PLAN['paths']),'DIRECTORY_REMAINS')
        REPORT.update(status='DESIGN_RETIRED_PASS',diskFreeAfter=shutil.disk_usage(ROOT).free)
        REPORT['freedBytes']=REPORT['diskFreeAfter']-REPORT['diskFreeBefore'];journal()
    finally:
        for fd in locks:os.close(fd)

try:main()
except Exception as e:
    REPORT['status']='STOP';REPORT['failure']=str(e) if isinstance(e,RuntimeError) else type(e).__name__
    if BACKUP.is_dir():journal()
raw=json.dumps(REPORT).encode();encoded=raw.hex().translate(str.maketrans('0123456789abcdef','abcdefghijklmnop'))
for i,start in enumerate(range(0,len(encoded),8192)):print('ONIXBIT_RETIRE_CHUNK_'+format(i,'08x').translate(str.maketrans('0123456789abcdef','abcdefghijklmnop'))+'='+encoded[start:start+8192])
print('ONIXBIT_RETIRE_END_AP='+json.dumps({'chunks':(len(encoded)+8191)//8192,'sha256':sha(raw)}).encode().hex().translate(str.maketrans('0123456789abcdef','abcdefghijklmnop')))
sys.exit(0 if REPORT['status'] in ('PLAN_PASS','DESIGN_RETIRED_PASS') else 1)
