#!/usr/bin/env python3
"""Journaled in-place root upstream transaction; caller pins all paths/identities."""
from pathlib import Path
import hashlib, json, os, signal, sys
live, backup, candidate, journal = map(Path, sys.argv[1:5])
expected_inode, mode, previous_container, next_container = sys.argv[5:]
before, after = backup.read_bytes(), candidate.read_bytes()
digest = lambda data: hashlib.sha256(data).hexdigest()
identity = {'inode': expected_inode, 'beforeSha256': digest(before), 'candidateSha256': digest(after)}
import re
old_lines = re.findall(rb'(?m)^ +reverse_proxy ' + re.escape(previous_container.encode()) + rb':3000\n', before)
assert len(old_lines) == 1, 'Root upstream line must be unique'
old = old_lines[0]
new = old.replace(previous_container.encode() + b':3000', next_container.encode() + b':3000')
assert before.count(old) == 1 and old != new
assert after == before.replace(old, new, 1), 'Only the reviewed root upstream may change'
def record(phase):
    temporary = journal.with_suffix('.next')
    fd = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC | os.O_NOFOLLOW, 0o600)
    try:
        with os.fdopen(fd, 'wb', closefd=False) as stream:
            stream.write((json.dumps({**identity, 'phase': phase}) + '\n').encode())
            stream.flush()
            os.fsync(fd)
    finally:
        os.close(fd)
    os.replace(temporary, journal)
    directory = os.open(journal.parent, os.O_RDONLY | os.O_DIRECTORY)
    try: os.fsync(directory)
    finally: os.close(directory)
def interrupted(signum, frame):
    raise InterruptedError('Config write interrupted')
signal.signal(signal.SIGTERM, interrupted)
signal.signal(signal.SIGINT, interrupted)
fd = os.open(live, os.O_RDWR | os.O_NOFOLLOW)
try:
    stat = os.fstat(fd)
    assert f'{stat.st_dev}:{stat.st_ino}' == expected_inode, 'Active config inode changed'
    with os.fdopen(fd, 'rb', closefd=False) as stream:
        current = stream.read()
    if mode == 'activate':
        assert current == before, 'Config drift before activation'
        desired = after
    else:
        assert mode == 'restore'
        owned = current in (before, after)
        if not owned and journal.exists():
            intent = json.loads(journal.read_text())
            if all(intent.get(k) == v for k, v in identity.items()) and intent.get('phase') == 'writing':
                # A killed own write can contain only an exact candidate prefix
                # followed by untouched original bytes (or an extended prefix).
                prefix = 0
                while prefix < min(len(current), len(after)) and current[prefix] == after[prefix]:
                    prefix += 1
                owned = current == after[:prefix] + before[prefix:]
        assert owned, 'Config drift: refuse to overwrite another edit'
        desired = before
    def write_all(data):
        os.lseek(fd, 0, os.SEEK_SET)
        offset = 0
        while offset < len(data):
            written = os.write(fd, data[offset:])
            if written <= 0: raise OSError('Config write made no progress')
            offset += written
        os.ftruncate(fd, len(data))
        os.fsync(fd)
    if mode == 'activate':
        record('writing')
        try:
            write_all(desired)
            record('written')
        except BaseException:
            # Same open fd and inode: restore even when the first write was short.
            signal.signal(signal.SIGTERM, signal.SIG_IGN)
            signal.signal(signal.SIGINT, signal.SIG_IGN)
            write_all(before)
            record('restored')
            raise
    else:
        write_all(desired)
        record('restored')
finally:
    os.close(fd)
