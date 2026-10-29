"""Single authorized continuation, from authenticated offline images to TLS. No provider calls.
Image identity is proved by the raw exported config digest, not storage-backend-specific .Id.
"""
import hashlib,os,re,subprocess
from pathlib import Path
ROOT=Path('/home/deploy/apps/onixbit-messenger-staging')
RELEASE='stage-bb3d7fdc2fb68cb5';RECOVERY='image-continuation-261029-a'
PACKAGE='e9cc11eafdee2ba3120007e2df5f9cec415cd1522dca36cbe24c74e2e8c6bd9d'
RUNTIME_TREE='fbec3a1265b0d5a8e156c42a476d66ed6129cf49a190cb3bc11038604c637c18';COMPOSE_SHA='2ab3efa64464c8a2cdf34e5e5604d23860480fa77e712c5ff6d4c8ccc716b9a7'
HEX=re.compile(r'sha256:[a-f0-9]{64}')
class StageStop(ValueError):pass
def runtime_identity(root):
 files=[];total=0
 for file in root.rglob('*'):
  if file.is_symlink():raise StageStop('RUNTIME_SYMLINK')
  if file.is_file():
   total+=file.stat().st_size;files.append(file)
   if total>128*1024*1024 or len(files)>15000:raise StageStop('RUNTIME_BUDGET')
 value=hashlib.sha256()
 for file in sorted(files,key=lambda file:str(file.relative_to(root))):
  with file.open('rb') as source:digest=hashlib.file_digest(source,'sha256').digest()
  value.update(str(file.relative_to(root)).encode()+b'\0'+digest)
 return value.hexdigest()

def docker_env():
 blocked={'DOCKER_HOST','DOCKER_CONTEXT','COMPOSE_FILE','COMPOSE_PROJECT_NAME','COMPOSE_PROFILES','NODE_IMAGE','POSTGRES_IMAGE','STAGING_UID','STAGING_GID','PG_UID','PG_GID','STAGING_RELEASE'}
 return {k:v for k,v in os.environ.items() if k not in blocked}
def docker(args,**options):
 env=docker_env()
 return subprocess.run(['/usr/bin/docker','--host','unix:///var/run/docker.sock',*args],env=env,**options)
def checked(args,timeout=20):
 result=docker(args,capture_output=True,text=True,timeout=timeout)
 if result.returncode:raise StageStop('DOCKER_CHECK_FAILED')
 return result.stdout.strip()
def safe_reason(error):
 text=str(error)
 return text if isinstance(error,StageStop) and re.fullmatch(r'[A-Z][A-Z0-9_]{0,63}',text) else type(error).__name__
