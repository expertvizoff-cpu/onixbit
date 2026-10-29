"""Edge-only continuation after proven Auth/restart/synthetic cleanup. No new DB/Auth writes."""
import hashlib,importlib.util,json,os,re,subprocess,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path('/home/deploy/apps/onixbit-messenger-staging');RELEASE='stage-bb3d7fdc2fb68cb5';ATTEMPT='edge-recovery-261029-a'
AUTH=ROOT/'operation/auth-recovery-261029-a'
AUTH_HASHES={'resume-auth.py': '493185cc163a7569d40c7329ac53d1725596ce46ae31bfdbdd6286bec5a4805f', 'smoke.mjs': '242303e9c7908e294c3de4ec7332a0b0a107c4801aaf8ac3e822acbc07a9854c'}
EDGE_SHA='cca10a6eed640986cb9c90104fc41e885a534be9598d822107774477859d1e70'
class EdgeResumeStop(ValueError):pass
def json_input(file):
 if file.resolve()!=file or file.is_symlink() or not file.is_file() or file.stat().st_size>65536:raise EdgeResumeStop('JSON_INPUT_DRIFT')
 return json.loads(file.read_text())
def auth_proof(file,phase,required):
 if file.is_symlink() or file.resolve()!=file or not file.is_file():raise EdgeResumeStop('AUTH_RECEIPT_REQUIRED')
 with file.open('rb') as source:source.seek(max(0,file.stat().st_size-16384));text=source.read(16384).decode('utf-8',errors='replace')
 for line in text.splitlines():
  try:value=json.loads(line)
  except ValueError:continue
  if value.get('passed') is True and value.get('phase')==phase and all(value.get(key) is expected for key,expected in required.items()):return
 raise EdgeResumeStop('AUTH_RECEIPT_REQUIRED')
def activate():
 if sys.argv[1:]!=['--activate-verified-edge'] or Path.cwd()!=ROOT or ROOT.resolve()!=ROOT or os.getuid()==0:raise EdgeResumeStop('EXACT_SCOPE_REQUIRED')
 operation=ROOT/'operation'/ATTEMPT
 if operation.resolve()!=operation or set(file.name for file in operation.iterdir())!={'activate-edge.py','caddy-edge.py'}:raise EdgeResumeStop('EXCLUSIVE_OPERATION_REQUIRED')
 for name,digest in AUTH_HASHES.items():
  file=AUTH/name
  if file.resolve()!=file or file.is_symlink() or hashlib.sha256(file.read_bytes()).hexdigest()!=digest:raise EdgeResumeStop('AUTH_SOURCE_DRIFT')
 network_root=ROOT/'operation/network-recovery-261029-a'
 if network_root.resolve()!=network_root or not network_root.is_dir():raise EdgeResumeStop('PREVIOUS_OPERATION_DRIFT')
 spec=importlib.util.spec_from_file_location('prior_auth_resume',AUTH/'resume-auth.py');prior=importlib.util.module_from_spec(spec);spec.loader.exec_module(prior);lib=prior.prior_library();core=lib.core;network=prior.PREVIOUS
 received=json_input(ROOT/'operation/received.json');release=json_input(ROOT/'release.json')
 if received.get('releaseId')!=RELEASE or received.get('plainSHA256')!=core.PACKAGE or release.get('releaseId')!=RELEASE:raise EdgeResumeStop('RELEASE_BINDING')
 if core.runtime_identity(ROOT/'runtime')!=core.RUNTIME_TREE or hashlib.sha256((ROOT/'compose.json').read_bytes()).hexdigest()!=core.COMPOSE_SHA:raise EdgeResumeStop('SOURCE_DRIFT')
 auth_proof(AUTH/'logs/smoke-before.log','before-restart',{'operatorMailOnly':True,'providerConnections':False})
 auth_proof(AUTH/'logs/smoke-after.log','after-restart',{'sameVerifiedSession':True,'syntheticIdentityRemoved':True,'tenantSlotsUntouched':True,'providerConnections':False})
 if (ROOT/'bootstrap/profile.json').exists() or (ROOT/'bootstrap/smoke-state.json').exists():raise EdgeResumeStop('TRANSIENT_CLEANUP_NOT_COMPLETE')
 if (ROOT/'operation/caddy-intent.json').exists() or (ROOT/'operation/caddy-result.json').exists():raise EdgeResumeStop('PREVIOUS_EDGE_ATTEMPT')
 receipt=json_input(ROOT/'private/bootstrap-complete.json')
 if receipt.get('purpose')!='isolated-staging-bootstrap' or receipt.get('tenantSlots')!=2:raise EdgeResumeStop('BOOTSTRAP_NOT_COMPLETE')
 subnet=json_input(network/'network-proof.json')['subnet'];old=json_input(network/'compose.json');expected=lib.compose_profile(json_input(ROOT/'compose.json'),ROOT,network,subnet)
 if old!=expected:raise EdgeResumeStop('NETWORK_PROFILE_DRIFT')
 hba=network/'pg_hba.conf'
 if hba.is_symlink() or hba.resolve()!=hba or not hba.is_file() or hba.stat().st_size>4096 or hba.read_text()!=lib.hba_profile(subnet):raise EdgeResumeStop('HBA_DRIFT')
 profile=json_input(AUTH/'compose.json')
 if profile!=prior.verifier_profile(old,AUTH):raise EdgeResumeStop('AUTH_PROFILE_DRIFT')
 identities=lib.pinned_images(release,json_input(ROOT/'operation/image-continuation-261029-a/image-proof.json'))
 envfile=network/'deployment.env';env={'NODE_IMAGE':identities['node'],'POSTGRES_IMAGE':identities['postgres'],'STAGING_UID':str(os.getuid()),'STAGING_GID':str(os.getgid()),'PG_UID':'70','PG_GID':'70','STAGING_RELEASE':RELEASE}
 if envfile.is_symlink() or envfile.resolve()!=envfile or not envfile.is_file() or envfile.stat().st_size>8192 or dict(line.split('=',1) for line in envfile.read_text().splitlines())!=env:raise EdgeResumeStop('ENV_DRIFT')
 text=core.checked(['network','inspect','--format','{{json .Labels}}\n{{json .IPAM.Config}}\n{{json .Internal}}','onixbit-messenger-staging_backend']);labels,ranges,internal=map(json.loads,text.splitlines())
 if labels.get('com.docker.compose.project')!='onixbit-messenger-staging' or labels.get('com.onixbit.staging.release')!=RELEASE or internal is not True or [value.get('Subnet') for value in ranges]!=[subnet]:raise EdgeResumeStop('NETWORK_DRIFT')
 for name in ['onixbit-messenger-staging-db','onixbit-messenger-staging-api']:
  text=core.checked(['inspect','--format','{{json .Config.Labels}}\n{{json .State.Status}}\n{{json .Config.Image}}',name]);labels,status,image=map(json.loads,text.splitlines())
  if labels.get('com.docker.compose.project')!='onixbit-messenger-staging' or labels.get('com.onixbit.staging.release')!=RELEASE or status not in ['created','exited'] or image!=identities['postgres' if name.endswith('-db') else 'node']:raise EdgeResumeStop('OWN_STOPPED_CONTAINERS_REQUIRED')
 edge=operation/'caddy-edge.py'
 if hashlib.sha256(edge.read_bytes()).hexdigest()!=EDGE_SHA:raise EdgeResumeStop('EDGE_SOURCE_DRIFT')
 memory=int(re.search(r'^MemAvailable:\s+(\d+) kB',Path('/proc/meminfo').read_text(),re.M)[1])*1024
 if memory<1536*1024*1024:raise EdgeResumeStop('RESOURCE_BUDGET')
 logs=operation/'logs';logs.mkdir(mode=0o700);phase='postgres'
 def compose(args,log):
  with (logs/log).open('xb') as out:result=core.docker(['compose','--project-directory',str(ROOT),'--env-file',str(envfile),'--file',str(AUTH/'compose.json'),*args],stdout=out,stderr=subprocess.STDOUT,timeout=100)
  if result.returncode:raise EdgeResumeStop('EXISTING_SERVICE_START_FAILED')
 try:
  compose(['up','-d','--wait','--wait-timeout','90','postgres'],'postgres.log');phase='api'
  compose(['up','-d','--wait','--wait-timeout','90','onixbit-messenger-staging-api'],'api.log');phase='edge'
  result=subprocess.run(['python3','-B',str(edge),'--activate',RELEASE,'--artifacts',ATTEMPT],capture_output=True,text=True,timeout=660)
  (logs/'edge.stdout.log').write_text(result.stdout);(logs/'edge.stderr.log').write_text(result.stderr)
  if result.returncode:
   for line in result.stdout.splitlines():
    try:value=json.loads(line)
    except ValueError:continue
    if value.get('code')=='CADDY_EDGE_STOPPED':print(json.dumps({key:value[key] for key in ['code','stage','reason'] if key in value}))
   raise EdgeResumeStop('EDGE_STOPPED')
  value=json_input(operation/'caddy-result.json')
  if value.get('release')!=RELEASE or value.get('status')!='active' or value.get('publicTLS') is not True:raise EdgeResumeStop('EDGE_RECEIPT_INVALID')
  print(json.dumps({'status':'STAGING_ACTIVE','release':RELEASE,'authRestartVerified':True,'syntheticCleanupVerified':True,'publicTLS':True,'nativeProvidersEnabled':False}))
 except Exception:
  summary={'phase':phase,'caddyIntentPresent':(operation/'caddy-intent.json').exists()}
  failure=operation/'caddy-failure.json'
  if failure.is_file() and not failure.is_symlink():
   value=json_input(failure)
   if value.get('release')==RELEASE and value.get('rollback') in ['not-written','original-restored','original-bytes-restored-reload-unconfirmed','drift-preserved-no-overwrite']:summary['rollback']=value['rollback']
  print(json.dumps({'edgeFailureSummary':summary}))
  for identifier in core.checked(['ps','-aq','--filter','label=com.docker.compose.project=onixbit-messenger-staging','--filter','label=com.onixbit.staging.release='+RELEASE]).split():
   if re.fullmatch(r'[a-f0-9]{12,64}',identifier):core.docker(['stop',identifier],capture_output=True,timeout=20)
  print(json.dumps({'status':'STOP','phase':phase,'dataPreserved':True}));raise
if __name__=='__main__':
 os.umask(0o077)
 try:activate()
 except Exception as error:
  reason=str(error) if type(error).__name__ in ['StageStop','EdgeResumeStop'] and re.fullmatch(r'[A-Z][A-Z0-9_]{0,127}',str(error)) else type(error).__name__
  print(json.dumps({'code':'EDGE_RESUME_STOPPED','reason':reason}));sys.exit(1)
