#!/usr/bin/env python3
"""Trusted transport-side stdin launcher: verify bytes before executing them.

Send this reviewed local file to `python3 -I - MODE RELEASE_JSON_SHA` over SSH.
It does not execute any file from the server before checking all script pins.
"""
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import sys
import types

root = Path('/opt/onixbit-site/full-site-incoming/20261006-design-root-copy')
assert len(sys.argv) == 3 and sys.argv[1] in ('budget', 'prepare', 'activate', 'rollback')
assert re.fullmatch(r'[a-f0-9]{64}', sys.argv[2])
assert Path.cwd() == root and root.resolve() == root


def read_pinned(name, expected):
    fd = os.open(root / name, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    try:
        assert stat.S_ISREG(os.fstat(fd).st_mode)
        with os.fdopen(fd, 'rb', closefd=False) as stream:
            data = stream.read(2 * 1024 * 1024 + 1)
        assert len(data) <= 2 * 1024 * 1024
        assert hashlib.sha256(data).hexdigest() == expected
        return data
    finally:
        os.close(fd)


release = json.loads(read_pinned('release.json', sys.argv[2]))
assert set(release['scripts']) == {'publish.py', 'preflight.py', 'http-probe.py', 'config-transaction.py'}
scripts = {name: read_pinned(name, expected) for name, expected in release['scripts'].items()}
read_pinned('runtime-manifest.json', '25c3c359ee262e866f7794c396994d40976fecadbac3d1dd3442c1d522edf831')
# -I excludes cwd from module lookup. Install only the preverified helper bytes;
# imported/executed script files are never read a second time from the server.
preflight = types.ModuleType('preflight')
sys.modules['preflight'] = preflight
exec(compile(scripts['preflight.py'], str(root / 'preflight.py'), 'exec'), preflight.__dict__)
namespace = {'__name__': '__main__', '__file__': str(root / 'publish.py'),
             'PINNED_RELEASE': release, 'PINNED_SCRIPTS': scripts}
sys.argv = ['publish.py', sys.argv[1]]
exec(compile(scripts['publish.py'], str(root / 'publish.py'), 'exec'), namespace)
