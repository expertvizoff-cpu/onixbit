"""Exact new-host append with active-inode proof, private backup and guarded rollback.
Not executed during preparation. Requires the deployment's separate exact production grant.
"""
import fcntl,hashlib,json,os,re,subprocess,sys,time,urllib.request
from pathlib import Path

ROOT=Path('/home/deploy/apps/onixbit-messenger-staging')
SITE=Path('/opt/onixbit-site')
LOGICAL=SITE/'current/Caddyfile'
CADDY='onixbit-site-caddy-1'
DOMAIN='messenger-test.onixbit.ru'
STEP='scope'
class EdgeError(RuntimeError):pass

def require(value,code):
 if not value:raise EdgeError(code)
def sha(value):return hashlib.sha256(value).hexdigest()
def command(args,input=None):
 env={key:value for key,value in os.environ.items() if key not in ['DOCKER_HOST','DOCKER_CONTEXT']}
 result=subprocess.run(['/usr/bin/docker','--host','unix:///var/run/docker.sock',*args],env=env,input=input,capture_output=True,timeout=30)
 require(result.returncode==0,'CADDY_COMMAND_FAILED');return result.stdout
def identity():
 lines=command(['inspect','--format','{{json .Id}}\n{{json .State.Running}}\n{{json .Config.Cmd}}\n{{json .State.StartedAt}}\n{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{json .Source}}{{end}}{{end}}',CADDY]).decode().strip().splitlines()
 require(len(lines)==5,'CADDY_IDENTITY_INVALID');identifier,running,args,started,source=map(json.loads,lines)
 require(running is True and not any(str(arg).startswith('--watch') for arg in (args or [])),'CADDY_NOT_STABLE')
 source=Path(source);physical=LOGICAL.resolve(strict=True)
 require(source.is_relative_to(SITE) and source.resolve(strict=True)==physical and physical.is_relative_to(SITE.resolve(strict=True)),'CADDY_ACTIVE_PATH_OUTSIDE_SCOPE')
 meta=physical.stat();container_inode=command(['exec',CADDY,'stat','-Lc','%d:%i','/etc/caddy/Caddyfile']).decode().strip()
 require(container_inode==f'{meta.st_dev}:{meta.st_ino}','CADDY_BIND_INODE_MISMATCH')
 return {'id':identifier,'startedAt':started,'path':str(physical),'device':meta.st_dev,'inode':meta.st_ino}
def block(release):
 require(re.fullmatch(r'stage-[a-f0-9]{16}',release),'RELEASE_ID_INVALID')
 return ('\n# BEGIN ONIXBIT MESSENGER STAGING '+release+'\n'+DOMAIN+' {\n'
  '    encode zstd gzip\n'
  '    header {\n        X-Robots-Tag "noindex, nofollow, noarchive"\n        Cache-Control "no-store"\n        X-Onixbit-Staging-Release "'+release+'"\n    }\n'
  '    @native path /api/bitrix24/* /bitrix24/*\n'
  '    handle @native {\n        reverse_proxy onixbit-messenger-staging-api:47101\n    }\n'
  '    handle {\n        reverse_proxy onixbit-messenger-staging-api:47100\n    }\n'
  '}\n# END ONIXBIT MESSENGER STAGING\n').encode()
def current_bytes(file):
 file.seek(0);return file.read()
def write_in_place(file,expected,value):
 require(sha(current_bytes(file))==sha(expected),'CADDY_CONCURRENT_CHANGE')
 file.seek(0);file.write(value);file.truncate();file.flush();os.fsync(file.fileno())
def rollback_allowed(current,original,candidate):
 return current==candidate or current==original or len(current)<len(candidate) and current==candidate[:len(current)]
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args,**kwargs):return None
def get(url):
 with urllib.request.build_opener(NoRedirect()).open(url,timeout=10) as response:
  body=response.read(262145);require(len(body)<=262144,'PUBLIC_HEALTH_BODY_BUDGET')
  return response.status,{key.lower():value for key,value in response.headers.items()},body
def site_fingerprint(url):
 # Existing HTML is larger than a small API response. Stream without retaining its body.
 digest=hashlib.sha256();count=0;deadline=time.monotonic()+10
 with urllib.request.build_opener(NoRedirect()).open(url,timeout=10) as response:
  while True:
   require(time.monotonic()<=deadline,'PUBLIC_SITE_READ_DEADLINE');part=response.read(16384)
   if not part:break
   count+=len(part);require(count<=512*1024,'PUBLIC_SITE_BODY_BUDGET');digest.update(part)
  return {'status':response.status,'sha256':digest.hexdigest(),'bytes':count}
def old_site_health():
 result={}
 for url in ['https://onixbit.ru/','https://onixbit.ru/api/health']:
  value=site_fingerprint(url);require(value['status']==200,'EXISTING_SITE_UNHEALTHY');result[url]=value
 return result
def new_site_health(release):
 until=time.monotonic()+90
 while True:
  try:
   for route,service in [('/api/health','onixbit-messenger'),('/api/bitrix24/health','onixbit-bitrix-staging')]:
    status,headers,body=get('https://'+DOMAIN+route);data=json.loads(body)['data']
    require(status==200 and headers.get('x-onixbit-staging-release')==release and data['service']==service,'PUBLIC_RELEASE_MISMATCH')
    if route.endswith('bitrix24/health'):require(not data['nativeEnabled'] and not data['mutationsEnabled'] and not data['finishEnabled'],'PROVIDER_FLAGS_NOT_DISABLED')
   status,headers,body=get('https://'+DOMAIN+'/bitrix24/install');require(status==200 and b'root' in body and headers.get('x-onixbit-staging-release')==release,'PUBLIC_INSTALL_SHELL_INVALID')
   return
  except Exception:
   if time.monotonic()>until:raise EdgeError('PUBLIC_TLS_HEALTH_FAILED')
   time.sleep(2)
def activate(release,artifacts=None):
 global STEP
 STEP='scope'
 artifacts=ROOT/'operation' if artifacts is None else artifacts
 require(artifacts.is_dir() and artifacts.resolve()==artifacts and artifacts.is_relative_to(ROOT/'operation'),'ARTIFACT_SCOPE_REQUIRED')
 require(Path.cwd()==ROOT,'EXPECTED_STAGING_ROOT');STEP='identity';before=identity();physical=Path(before['path']);STEP='existing-site-health';old_health=old_site_health()
 STEP='open-active-config'
 descriptor=os.open(physical,os.O_RDWR|os.O_NOFOLLOW);written=False;candidate=None;original=None
 with os.fdopen(descriptor,'r+b') as file:
  fcntl.flock(file,fcntl.LOCK_EX|fcntl.LOCK_NB);meta=os.fstat(file.fileno());require((meta.st_dev,meta.st_ino)==(before['device'],before['inode']),'CADDY_FILE_DRIFT')
  original=current_bytes(file);require(len(original)<=1048576 and DOMAIN.encode() not in original,'CADDY_NEW_HOST_ALREADY_PRESENT_OR_BUDGET')
  candidate=original+block(release)
  STEP='backup'
  with (artifacts/'caddy-before').open('xb') as backup:os.chmod(backup.name,0o600);backup.write(original)
  STEP='validate'
  command(['exec','-i','-w','/etc/caddy',CADDY,'caddy','validate','--config','-','--adapter','caddyfile'],candidate)
  STEP='recheck-baseline'
  require(identity()==before,'CADDY_BASELINE_DRIFT')
  intent={'release':release,'originalSHA256':sha(original),'candidateSHA256':sha(candidate),'before':before,'status':'attempted'}
  STEP='intent'
  with (artifacts/'caddy-intent.json').open('x') as output:os.chmod(output.name,0o600);json.dump(intent,output)
  try:
   STEP='write-reload';written=True;write_in_place(file,original,candidate)
   command(['exec',CADDY,'caddy','reload','--config','/etc/caddy/Caddyfile','--adapter','caddyfile'])
   STEP='public-health';new_site_health(release);STEP='existing-health-after';new_health=old_site_health();STEP='final-identity';require(identity()==before and current_bytes(file)==candidate,'CADDY_POSTCONDITION_DRIFT')
   intent.update(status='active',existingHTTPBefore=old_health,existingHTTPAfter=new_health,publicTLS=True)
   (artifacts/'caddy-result.json').write_text(json.dumps(intent)+'\n');return {'edgeActive':True,'publicTLS':True}
  except Exception:
   rollback='not-written'
   if written:
    current=current_bytes(file)
    if identity()==before and rollback_allowed(current,original,candidate):
     write_in_place(file,current,original)
     try:command(['exec',CADDY,'caddy','reload','--config','/etc/caddy/Caddyfile','--adapter','caddyfile']);rollback='original-restored'
     except Exception:rollback='original-bytes-restored-reload-unconfirmed'
    else:rollback='drift-preserved-no-overwrite'
   (artifacts/'caddy-failure.json').write_text(json.dumps({'status':'STOP','rollback':rollback,'release':release})+'\n');raise EdgeError('CADDY_ACTIVATION_STOPPED_'+rollback.upper())

def safe_reason(error):
 return str(error) if isinstance(error,EdgeError) and re.fullmatch(r'[A-Z][A-Z0-9_]{0,127}',str(error)) else type(error).__name__
if __name__=='__main__':
 try:
  require(len(sys.argv) in [3,5] and sys.argv[1]=='--activate','EXACT_ACTIVATION_FLAG_REQUIRED')
  artifacts=None
  if len(sys.argv)==5:
   require(sys.argv[3:] == ['--artifacts','edge-recovery-261029-a'],'EXACT_ARTIFACT_FLAG_REQUIRED');artifacts=ROOT/'operation/edge-recovery-261029-a'
  print(json.dumps(activate(sys.argv[2],artifacts)))
 except Exception as error:print(json.dumps({'status':'STOP','code':'CADDY_EDGE_STOPPED','stage':STEP,'reason':safe_reason(error)}));sys.exit(1)
