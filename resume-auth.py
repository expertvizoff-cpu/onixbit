"""Resume provisioned staging after correcting only the verifier launch contract."""
import copy,hashlib,importlib.util,json,os,re,subprocess,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path('/home/deploy/apps/onixbit-messenger-staging');RELEASE='stage-bb3d7fdc2fb68cb5';RECOVERY='auth-recovery-261029-a'
PREVIOUS=ROOT/'operation/network-recovery-261029-a'
PREVIOUS_HASHES={'recover-network.py': 'caaee2d03e02e05c2bc3ea7e4c5725092c77e4f9106aefee21716c45bf77aa8d', 'image_runtime.py': 'dd3a421bdefab0dc1deccfd0815a91a2e317839950094980f5562c7f0ee50c36'}
class AuthResumeStop(ValueError):pass
def json_input(file):
 if file.resolve()!=file or file.is_symlink() or not file.is_file() or file.stat().st_size>65536:raise AuthResumeStop('JSON_INPUT_DRIFT')
 return json.loads(file.read_text())
def prior_library():
 for name,digest in PREVIOUS_HASHES.items():
  file=PREVIOUS/name
  if file.is_symlink() or hashlib.sha256(file.read_bytes()).hexdigest()!=digest:raise AuthResumeStop('PRIOR_OPERATION_DRIFT')
 sys.path.insert(0,str(PREVIOUS));spec=importlib.util.spec_from_file_location('previous_network_recovery',PREVIOUS/'recover-network.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module

def verifier_profile(profile,operation):
 result=copy.deepcopy(profile);service=result['services']['verify']
 if service['entrypoint']!=[] or service['command']!=['node','--max-old-space-size=192','ops/staging/smoke.mjs']:raise AuthResumeStop('ORIGINAL_VERIFY_PROFILE_DRIFT')
 service['entrypoint']=service['command'];service['command']=[]
 service['volumes'].append({'type':'bind','source':str(operation/'smoke.mjs'),'target':'/app/ops/staging/smoke.mjs','read_only':True,'bind':{'create_host_path':False}})
 return result

def smoke_diagnostics(file):
 result=[]
 if not file.is_file() or file.is_symlink():return result
 with file.open('rb') as source:source.seek(max(0,file.stat().st_size-16384));text=source.read(16384).decode('utf-8',errors='replace')
 steps={'cluster-identity','fresh-auth-users','fresh-companies','claim-intent','signup','verification-mail','verification-origin','verify-email','signin','secure-cookie','session','restore-intent','workspace-after-restart','invalid-handoff','native-flags','foreign-origin','cleanup'}
 reasons={'ECONNREFUSED','ENOTFOUND','ETIMEDOUT','EAI_AGAIN','UND_ERR_SOCKET','UND_ERR_CONNECT_TIMEOUT','EACCES','EROFS','28P01','42501','42P01','3D000','23505','Error','TypeError','AbortError','TimeoutError','SyntaxError','ZodError','BootstrapError'}
 codes={'INVALID_ORIGIN','ORIGIN_FORBIDDEN','INVALID_EMAIL','SIGNUP_DISABLED','EMAIL_NOT_VERIFIED','PASSWORD_TOO_SHORT','INTERNAL_SERVER_ERROR','RATE_LIMITED','SERVICE_UNAVAILABLE','FAILED_TO_CREATE_USER','FAILED_TO_CREATE_SESSION','FAILED_TO_GET_SESSION','AUTH_REQUIRED','INVALID_INPUT'}
 for line in text.splitlines():
  try:value=json.loads(line)
  except ValueError:continue
  if value.get('code') not in ['STAGING_SMOKE_FAILED','STAGING_SMOKE_CONFIGURATION_FAILED']:continue
  item={'code':value['code']}
  if value.get('step') in steps:item['step']=value['step']
  if value.get('reason') in reasons:item['reason']=value['reason']
  if type(value.get('lastHttpStatus')) is int and 100<=value['lastHttpStatus']<=599:item['lastHttpStatus']=value['lastHttpStatus']
  if value.get('httpCode') in codes:item['httpCode']=value['httpCode']
  result.append(item)
 return result[-3:]

def resume():
 if sys.argv[1:]!=['--resume-provisioned-auth'] or Path.cwd()!=ROOT or ROOT.resolve()!=ROOT or os.getuid()==0:raise AuthResumeStop('EXACT_SCOPE_REQUIRED')
 operation=ROOT/'operation'/RECOVERY
 if operation.resolve()!=operation or set(file.name for file in operation.iterdir())!={'resume-auth.py','smoke.mjs'}:raise AuthResumeStop('EXCLUSIVE_OPERATION_REQUIRED')
 lib=prior_library();core=lib.core
 received=json_input(ROOT/'operation/received.json');release=json_input(ROOT/'release.json')
 if received.get('releaseId')!=RELEASE or received.get('plainSHA256')!=core.PACKAGE or release.get('releaseId')!=RELEASE:raise core.StageStop('RELEASE_BINDING')
 if core.runtime_identity(ROOT/'runtime')!=core.RUNTIME_TREE or hashlib.sha256((ROOT/'compose.json').read_bytes()).hexdigest()!=core.COMPOSE_SHA:raise core.StageStop('SOURCE_DRIFT')
 for name in ['api.json','bitrix.json','bootstrap-complete.json']:
  file=ROOT/'private'/name;meta=file.lstat()
  if file.is_symlink() or not file.is_file() or meta.st_uid!=os.getuid() or meta.st_mode&0o777!=0o600:raise core.StageStop('PRIVATE_METADATA_DRIFT')
 receipt=json_input(ROOT/'private/bootstrap-complete.json')
 if receipt.get('purpose')!='isolated-staging-bootstrap' or receipt.get('tenantSlots')!=2:raise core.StageStop('BOOTSTRAP_NOT_COMPLETE')
 if (ROOT/'operation/caddy-intent.json').exists():raise core.StageStop('PREVIOUS_EDGE_ATTEMPT')
 profile=ROOT/'bootstrap/profile.json';meta=profile.lstat()
 if profile.is_symlink() or not profile.is_file() or meta.st_uid!=os.getuid() or meta.st_mode&0o777!=0o600:raise core.StageStop('BOOTSTRAP_PROFILE_DRIFT')
 network=json_input(PREVIOUS/'network-proof.json');subnet=network['subnet']
 text=core.checked(['network','inspect','--format','{{json .Labels}}\n{{json .IPAM.Config}}\n{{json .Internal}}','onixbit-messenger-staging_backend']);labels,ranges,internal=map(json.loads,text.splitlines())
 if labels.get('com.docker.compose.project')!='onixbit-messenger-staging' or labels.get('com.onixbit.staging.release')!=RELEASE or internal is not True or [value.get('Subnet') for value in ranges]!=[subnet]:raise core.StageStop('EXISTING_NETWORK_DRIFT')
 old=json_input(PREVIOUS/'compose.json');expected=lib.compose_profile(json_input(ROOT/'compose.json'),ROOT,PREVIOUS,subnet)
 hba=PREVIOUS/'pg_hba.conf'
 if hba.is_symlink() or hba.resolve()!=hba or not hba.is_file() or hba.stat().st_size>4096:raise core.StageStop('HBA_FILE_DRIFT')
 if old!=expected or hba.read_text()!=lib.hba_profile(subnet):raise core.StageStop('RUNNING_PROFILE_DRIFT')
 identities=lib.pinned_images(release,json_input(ROOT/'operation/image-continuation-261029-a/image-proof.json'))
 expected_env={'NODE_IMAGE':identities['node'],'POSTGRES_IMAGE':identities['postgres'],'STAGING_UID':str(os.getuid()),'STAGING_GID':str(os.getgid()),'PG_UID':'70','PG_GID':'70','STAGING_RELEASE':RELEASE}
 if dict(line.split('=',1) for line in (PREVIOUS/'deployment.env').read_text().splitlines())!=expected_env:raise core.StageStop('ENV_DRIFT')
 for name in ['onixbit-messenger-staging-db','onixbit-messenger-staging-api']:
  value=core.checked(['inspect','--format','{{json .Config.Labels}}\n{{json .State.Status}}\n{{json .Config.Image}}',name]);labels,status,image=map(json.loads,value.splitlines())
  if labels.get('com.docker.compose.project')!='onixbit-messenger-staging' or labels.get('com.onixbit.staging.release')!=RELEASE or status not in ['exited','created'] or image!=identities['postgres' if name.endswith('-db') else 'node']:raise core.StageStop('STOPPED_OWN_CONTAINERS_REQUIRED')
 memory=int(re.search(r'^MemAvailable:\s+(\d+) kB',Path('/proc/meminfo').read_text(),re.M)[1])*1024
 disk=os.statvfs(ROOT)
 if memory<1536*1024*1024 or disk.f_bavail*disk.f_frsize<3*1024*1024*1024:raise core.StageStop('RESOURCE_BUDGET')
 logs=operation/'logs';logs.mkdir(mode=0o700);(operation/'compose.json').write_text(json.dumps(verifier_profile(old,operation),indent=2)+'\n');phase='compose-validation'
 def compose(args,log,timeout=100):
  with (logs/log).open('xb') as out:result=core.docker(['compose','--project-directory',str(ROOT),'--env-file',str(PREVIOUS/'deployment.env'),'--file',str(operation/'compose.json'),*args],stdout=out,stderr=subprocess.STDOUT,timeout=timeout)
  if result.returncode:raise core.StageStop('AUTH_RESUME_STEP_FAILED')
 try:
  compose(['config','--quiet'],'compose-validation.log',20)
  for step,args,timeout in [('postgres',['up','-d','--wait','--wait-timeout','90','postgres'],100),('api',['up','-d','--wait','--wait-timeout','90','onixbit-messenger-staging-api'],100),('cleanup-before',['run','--rm','--no-deps','verify','--cleanup'],30),('smoke-before',['run','--rm','--no-deps','verify','--setup'],45),('restart',['restart','onixbit-messenger-staging-api'],20),('restart-health',['up','-d','--wait','--wait-timeout','90','onixbit-messenger-staging-api'],100),('smoke-after',['run','--rm','--no-deps','verify','--after-restart'],45)]:
   phase=step;compose(args,step+'.log',timeout)
  profile.unlink();phase='edge';edge=ROOT/'operation/caddy-edge.py'
  if hashlib.sha256(edge.read_bytes()).hexdigest()!=lib.EDGE_SHA:raise core.StageStop('EDGE_DRIFT')
  with (logs/'edge.log').open('xb') as out:result=subprocess.run(['python3',str(edge),'--activate',RELEASE],stdout=out,stderr=subprocess.STDOUT,timeout=660)
  if result.returncode:raise core.StageStop('EDGE_STOPPED')
  print(json.dumps({'status':'STAGING_ACTIVE','release':RELEASE,'nativeProvidersEnabled':False,'publicTLS':True,'authRestartVerified':True}))
 except Exception:
  try:print(json.dumps({'failureSummary':lib.failure_summary(phase,logs),'smokeDiagnostics':smoke_diagnostics(logs/(phase+'.log'))}))
  except Exception:pass
  if (ROOT/'bootstrap/smoke-state.json').exists() and profile.exists():
   try:compose(['run','--rm','--no-deps','verify','--cleanup'],'synthetic-cleanup.log',30)
   except Exception:pass
  for identifier in core.checked(['ps','-aq','--filter','label=com.docker.compose.project=onixbit-messenger-staging','--filter','label=com.onixbit.staging.release='+RELEASE]).split():
   if re.fullmatch(r'[a-f0-9]{12,64}',identifier):core.docker(['stop',identifier],capture_output=True,timeout=20)
  print(json.dumps({'status':'STOP','phase':phase,'dataPreserved':True}));raise
if __name__=='__main__':
 os.umask(0o077)
 try:resume()
 except Exception as error:
  if type(error).__name__ in ['StageStop','AuthResumeStop'] and re.fullmatch(r'[A-Z][A-Z0-9_]{0,63}',str(error)):reason=str(error)
  else:reason=type(error).__name__
  print(json.dumps({'code':'AUTH_RESUME_STOPPED','reason':reason}));sys.exit(1)
