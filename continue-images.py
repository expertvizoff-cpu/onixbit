"""Single authorized continuation, from authenticated offline images to TLS. No provider calls.
Image identity is proved by the raw exported config digest, not storage-backend-specific .Id.
"""
import hashlib,json,os,re,subprocess,sys,tarfile,time
from pathlib import Path,PurePosixPath
ROOT=Path('/home/deploy/apps/onixbit-messenger-staging')
RELEASE='stage-bb3d7fdc2fb68cb5';RECOVERY='image-continuation-261029-a'
PACKAGE='e9cc11eafdee2ba3120007e2df5f9cec415cd1522dca36cbe24c74e2e8c6bd9d'
RUNTIME_TREE='fbec3a1265b0d5a8e156c42a476d66ed6129cf49a190cb3bc11038604c637c18';COMPOSE_SHA='2ab3efa64464c8a2cdf34e5e5604d23860480fa77e712c5ff6d4c8ccc716b9a7'
HEX=re.compile(r'sha256:[a-f0-9]{64}')
class BoundedReader:
 def __init__(self,source,maximum):self.source=source;self.remaining=maximum
 def read(self,size=-1):
  if size<0:raise ValueError('UNBOUNDED_EXPORT_READ')
  value=self.source.read(min(size,self.remaining+1));self.remaining-=len(value)
  if self.remaining<0:raise ValueError('EXPORT_BUDGET')
  return value

def exported_config(source,expected,max_bytes=768*1024*1024):
 """One streaming archive pass. Only bounded JSON retained, no extraction or layer output."""
 wanted=expected['runtimeImageID'];tag='onixbit-messenger-'+expected['name']+':staging-'+wanted.split(':')[1][:12]
 candidates={};manifest=None;members=0;names=set()
 bounded=BoundedReader(source,max_bytes)
 with tarfile.open(fileobj=bounded,mode='r|') as archive:
  for item in archive:
   members+=1;name=str(PurePosixPath(item.name))
   if members>1000 or name in names or PurePosixPath(name).is_absolute() or '..' in PurePosixPath(name).parts or not(item.isfile() or item.isdir()):raise ValueError('EXPORT_LAYOUT_INVALID')
   names.add(name)
   if item.isfile() and (name=='manifest.json' or name.endswith('.json') or name.startswith('blobs/sha256/')) and item.size<=256*1024:
    value=archive.extractfile(item).read()
    if name=='manifest.json':manifest=json.loads(value)
    if 'sha256:'+hashlib.sha256(value).hexdigest()==wanted:candidates[name]=value
 while bounded.read(1024*1024):pass
 if not isinstance(manifest,list) or len(manifest)!=1:raise ValueError('EXPORT_MANIFEST_REQUIRED')
 entry=manifest[0];name=entry.get('Config')
 if name not in candidates or not {tag,'docker.io/library/'+tag}.intersection(entry.get('RepoTags') or []):raise ValueError('EXPORTED_CONFIG_DIGEST_MISMATCH')
 value=json.loads(candidates[name])
 if value.get('os')!='linux' or value.get('architecture')!='amd64' or value.get('rootfs',{}).get('diff_ids')!=expected['diffIds']:raise ValueError('EXPORTED_CONFIG_PLATFORM_OR_LAYERS_MISMATCH')
 return {'configDigest':wanted,'diffIds':expected['diffIds']}

def runtime_identity(root):
 files=[];total=0
 for file in root.rglob('*'):
  if file.is_symlink():raise ValueError('RUNTIME_SYMLINK')
  if file.is_file():
   total+=file.stat().st_size;files.append(file)
   if total>128*1024*1024 or len(files)>15000:raise ValueError('RUNTIME_BUDGET')
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
 if result.returncode:raise ValueError('DOCKER_CHECK_FAILED')
 return result.stdout.strip()
def loaded_identity(image,logs):
 tag='onixbit-messenger-'+image['name']+':staging-'+image['runtimeImageID'].split(':')[1][:12]
 info=json.loads(checked(['image','inspect','--format','{{json .}}',tag]))
 identifier=info.get('Id')
 if not isinstance(identifier,str) or not HEX.fullmatch(identifier) or info.get('Os')!='linux' or info.get('Architecture')!='amd64' or info.get('RootFS',{}).get('Layers')!=image['diffIds']:raise ValueError('LOADED_IMAGE_LAYERS_MISMATCH')
 # Export the exact tag, prove raw config bytes, then recheck tag and immutable runtime lookup.
 # Compose receives only the captured immutable runtime ID, never the tag.
 env=docker_env()
 with (logs/(image['name']+'-export.stderr')).open('xb') as errors:
  process=subprocess.Popen(['/usr/bin/docker','--host','unix:///var/run/docker.sock','image','save',tag],env=env,stdout=subprocess.PIPE,stderr=errors)
  try:
   proof=exported_config(process.stdout,image)
   process.stdout.close()
   if process.wait(timeout=20)!=0:raise ValueError('IMAGE_EXPORT_FAILED')
  finally:
   if not process.stdout.closed:process.stdout.close()
   if process.poll() is None:process.kill();process.wait()
 if checked(['image','inspect','--format','{{.Id}}',tag])!=identifier:raise ValueError('TAG_CHANGED_DURING_VERIFICATION')
 # A digest lookup must independently resolve the exact immutable identifier selected for runtime.
 if checked(['image','inspect','--format','{{.Id}}',identifier])!=identifier:raise ValueError('IMMUTABLE_LOOKUP_FAILED')
 return {**proof,'runtimeId':identifier}

def resource_limits():
 memory=int(re.search(r'^MemAvailable:\s+(\d+) kB',Path('/proc/meminfo').read_text(),re.M)[1])*1024
 if memory<1536*1024*1024:raise ValueError('MEMORY_BUDGET')
 disk=os.statvfs(ROOT)
 if disk.f_bavail*disk.f_frsize<3*1024*1024*1024:raise ValueError('DISK_BUDGET')

def continue_release():
 if Path.cwd()!=ROOT or ROOT.resolve()!=ROOT or os.getuid()==0 or sys.argv[1:]!=['--continue-stopped-images']:raise ValueError('EXACT_SCOPE_REQUIRED')
 received=json.loads((ROOT/'operation/received.json').read_text());release=json.loads((ROOT/'release.json').read_text())
 if runtime_identity(ROOT/'runtime')!=RUNTIME_TREE:raise ValueError('RUNTIME_TREE_DRIFT')
 if hashlib.sha256((ROOT/'compose.json').read_bytes()).hexdigest()!=COMPOSE_SHA:raise ValueError('COMPOSE_DRIFT')
 if received.get('releaseId')!=RELEASE or received.get('plainSHA256')!=PACKAGE or release.get('releaseId')!=RELEASE:raise ValueError('RELEASE_BINDING')
 # No initialized data, prior continuation, provisioning or edge attempt may be resumed by this operation.
 for name in ['private','state/postgres','state/mail']:
  folder=ROOT/name
  if folder.is_symlink() or folder.resolve()!=folder or not folder.is_dir() or any(folder.iterdir()):raise ValueError('FRESH_STATE_REQUIRED')
 for name in ['bootstrap/profile.json','bootstrap/pg-admin','operation/deployment.env']:
  file=ROOT/name
  if file.is_symlink() or not file.is_file() or file.stat().st_uid!=os.getuid() or file.stat().st_mode&0o077:raise ValueError('OWN_PRIVATE_FILE_REQUIRED')
 for name in ['owner.log','initdb.log','bootstrap.log','api.log','edge.log']:
  if (ROOT/'operation/logs'/name).exists():raise ValueError('PREVIOUS_INITIALIZATION_DETECTED')
 if (ROOT/'operation/caddy-intent.json').exists() or checked(['ps','-aq','--filter','label=com.docker.compose.project=onixbit-messenger-staging']):raise ValueError('STAGING_NAMESPACE_OCCUPIED')
 if docker(['network','inspect','onixbit-messenger-staging_backend'],capture_output=True,timeout=10).returncode==0:raise ValueError('STAGING_NETWORK_OCCUPIED')
 for name in ['onixbit-messenger-staging-api','onixbit-messenger-staging-db']:
  if docker(['inspect',name],capture_output=True,timeout=10).returncode==0:raise ValueError('STAGING_NAME_OCCUPIED')
 resource_limits()
 operation=ROOT/'operation'/RECOVERY;operation.mkdir(mode=0o700);logs=operation/'logs';logs.mkdir(mode=0o700)
 phase='identity';bootstrap=False
 env_file=operation/'deployment.env'
 def compose(args,log,timeout=100):
  args=['compose','--project-directory',str(ROOT),'--env-file',str(env_file),'--file',str(ROOT/'compose.json'),*args]
  # Docker env is pinned; explicit compose paths/profiles override inherited defaults.
  with (logs/log).open('xb') as out:
   result=docker(args,stdout=out,stderr=subprocess.STDOUT,timeout=timeout)
  if result.returncode:raise ValueError('COMPOSE_STEP_FAILED')
 try:
  identities={}
  for name in ['node','postgres']:
   image={**release['images'][name],'name':name};identities[name]=loaded_identity(image,logs)
  (operation/'image-proof.json').write_text(json.dumps(identities)+'\n')
  values=dict(line.split('=',1) for line in (ROOT/'operation/deployment.env').read_text().splitlines())
  expected={'NODE_IMAGE':release['images']['node']['runtimeImageID'],'POSTGRES_IMAGE':release['images']['postgres']['runtimeImageID'],'STAGING_UID':str(os.getuid()),'STAGING_GID':str(os.getgid()),'PG_UID':'70','PG_GID':'70','STAGING_RELEASE':RELEASE}
  if values!=expected:raise ValueError('ORIGINAL_ENV_CHANGED')
  values.update(NODE_IMAGE=identities['node']['runtimeId'],POSTGRES_IMAGE=identities['postgres']['runtimeId'])
  env_file.write_text(''.join(k+'='+v+'\n' for k,v in values.items()));env_file.chmod(0o600)
  for step,args in [('owner',['run','--rm','--no-deps','owner']),('initdb',['run','--rm','--no-deps','pginit']),('postgres',['up','-d','--wait','--wait-timeout','90','postgres']),('bootstrap',['run','--rm','--no-deps','bootstrap']),('api',['up','-d','--wait','--wait-timeout','90','onixbit-messenger-staging-api']),('smoke-before',['run','--rm','--no-deps','verify','--setup']),('restart',['restart','onixbit-messenger-staging-api']),('restart-health',['up','-d','--wait','--wait-timeout','90','onixbit-messenger-staging-api']),('smoke-after',['run','--rm','--no-deps','verify','--after-restart'])]:
   phase=step;compose(args,step+'.log')
   if step=='bootstrap':bootstrap=True
  (ROOT/'bootstrap/profile.json').unlink();phase='edge'
  # This exact script was authenticated in the original release; do not replace it.
  edge=ROOT/'operation/caddy-edge.py'
  if hashlib.sha256(edge.read_bytes()).hexdigest()!=EDGE_SHA:raise ValueError('EDGE_SCRIPT_DRIFT')
  with (logs/'edge.log').open('xb') as out:result=subprocess.run(['python3',str(edge),'--activate',RELEASE],stdout=out,stderr=subprocess.STDOUT,timeout=660)
  if result.returncode:raise ValueError('EDGE_STOPPED')
  print(json.dumps({'status':'STAGING_ACTIVE','release':RELEASE,'nativeProvidersEnabled':False,'imageConfigDigestsVerified':True}))
 except Exception:
  if bootstrap and (ROOT/'bootstrap/smoke-state.json').exists() and (ROOT/'bootstrap/profile.json').exists():
   try:compose(['run','--rm','--no-deps','verify','--cleanup'],'synthetic-cleanup.log')
   except Exception:pass
  ids=checked(['ps','-aq','--filter','label=com.docker.compose.project=onixbit-messenger-staging','--filter','label=com.onixbit.staging.release='+RELEASE]).split()
  for identifier in ids:
   if HEX.fullmatch(identifier) or re.fullmatch(r'[a-f0-9]{12,64}',identifier):docker(['stop',identifier],capture_output=True,timeout=20)
  print(json.dumps({'status':'STOP','phase':phase,'dataPreserved':True}));raise
def safe_reason(error):
 text=str(error)
 return text if isinstance(error,ValueError) and re.fullmatch(r'[A-Z][A-Z0-9_]{0,63}',text) else type(error).__name__
EDGE_SHA='e4c0f454463cf7d3ed7e62dc39037b7926eb2e3a13d1327e202ed0a5455a464d'
if __name__=='__main__':
 os.umask(0o077)
 try:continue_release()
 except Exception as error:print(json.dumps({'code':'STAGING_CONTINUATION_STOPPED','reason':safe_reason(error)}));sys.exit(1)
