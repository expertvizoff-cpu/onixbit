"""One separately approved recovery of the initialized, never provisioned staging cluster."""
import copy,hashlib,ipaddress,json,os,re,subprocess,sys
from pathlib import Path
sys.dont_write_bytecode=True
import image_runtime as core
ROOT=core.ROOT;RELEASE=core.RELEASE;RECOVERY='network-recovery-261029-a'
EDGE_SHA='e4c0f454463cf7d3ed7e62dc39037b7926eb2e3a13d1327e202ed0a5455a464d'

def select_subnet(occupied):
 used=[ipaddress.ip_network(value,strict=False) for value in occupied]
 for pool in ['10.240.0.0/24','10.241.0.0/24','172.30.240.0/24','192.168.240.0/24']:
  for candidate in ipaddress.ip_network(pool).subnets(new_prefix=28):
   if not any(value.version==4 and value.prefixlen>0 and candidate.overlaps(value) for value in used):return str(candidate)
 raise core.StageStop('NO_SAFE_STAGING_SUBNET')
def network_ranges():
 identifiers=core.checked(['network','ls','-q']).split()
 if len(identifiers)>256 or any(not re.fullmatch(r'[a-f0-9]{12,64}',value) for value in identifiers):raise core.StageStop('NETWORK_INVENTORY_BUDGET')
 occupied=[]
 if identifiers:
  text=core.checked(['network','inspect','--format','{{json .IPAM.Config}}',*identifiers]);
  if len(text)>262144:raise core.StageStop('NETWORK_INVENTORY_BUDGET')
  for line in text.splitlines():
   for value in json.loads(line) or []:
    if value.get('Subnet'):occupied.append(value['Subnet'])
 for args,kind in [(['-j','route','show','table','all'],'routes'),(['-j','address','show'],'addresses')]:
  executable=next((name for name in ['/usr/sbin/ip','/usr/bin/ip','/sbin/ip','/bin/ip'] if os.access(name,os.X_OK)),None)
  if not executable:raise core.StageStop('IP_TOOL_UNAVAILABLE')
  result=subprocess.run([executable,*args],capture_output=True,text=True,timeout=5)
  if result.returncode or len(result.stdout)>262144:raise core.StageStop('IP_INVENTORY_FAILED')
  values=json.loads(result.stdout)
  for value in values:
   if kind=='routes':
    if value.get('dst') and value['dst']!='default':occupied.append(value['dst'])
   else:
    for address in value.get('addr_info',[]):
     if address.get('family')=='inet':occupied.append(address['local']+'/'+str(address['prefixlen']))
 return occupied

def compose_profile(original,root,operation,subnet):
 value=copy.deepcopy(original)
 if value.get('name')!='onixbit-messenger-staging' or value['networks']['backend']!={'internal':True}:raise core.StageStop('ORIGINAL_NETWORK_PROFILE_DRIFT')
 value['networks']['backend']['ipam']={'config':[{'subnet':subnet}]}
 value['networks']['backend']['labels']={'com.onixbit.staging.release':RELEASE}
 pg=value['services']['postgres']
 if pg.get('ports') or pg['networks']!=['backend'] or not pg['read_only']:raise core.StageStop('POSTGRES_ISOLATION_DRIFT')
 pg['command']+=['-c','listen_addresses=0.0.0.0','-c','hba_file=/etc/onixbit/pg_hba.conf']
 for service in value['services'].values():
  for volume in service['volumes']:
   source=Path(volume['source'])
   if source.is_absolute() or '..' in source.parts:raise core.StageStop('ORIGINAL_BIND_DRIFT')
   target=root/source
   if target.resolve()!=target or not target.is_relative_to(root):raise core.StageStop('ORIGINAL_BIND_DRIFT')
   volume['source']=str(target)
 pg['volumes'].append({'type':'bind','source':str(operation/'pg_hba.conf'),'target':'/etc/onixbit/pg_hba.conf','read_only':True,'bind':{'create_host_path':False}})
 return value

def hba_profile(subnet):
 network=ipaddress.ip_network(subnet)
 if network.version!=4 or network.prefixlen!=28 or not network.is_private:raise core.StageStop('HBA_SCOPE_INVALID')
 return 'local all all scram-sha-256\nhost all all 127.0.0.1/32 scram-sha-256\nhost all all '+str(network)+' scram-sha-256\n'
def pinned_images(release,proof):
 result={}
 if set(proof)!={'node','postgres'}:raise core.StageStop('IMAGE_PROOF_INVALID')
 for name,image in release['images'].items():
  value=proof[name]
  if value['configDigest']!=image['runtimeImageID'] or value['diffIds']!=image['diffIds'] or not core.HEX.fullmatch(value['runtimeId']):raise core.StageStop('IMAGE_PROOF_INVALID')
  text=core.checked(['image','inspect','--format','{{json .Id}}\n{{json .Os}}\n{{json .Architecture}}\n{{json .RootFS.Layers}}',value['runtimeId']]);identifier,system,arch,layers=map(json.loads,text.splitlines())
  if identifier!=value['runtimeId'] or system!='linux' or arch!='amd64' or layers!=image['diffIds']:raise core.StageStop('PINNED_IMAGE_DRIFT')
  result[name]=identifier
 return result

def failure_category(text):
 patterns=[('address pools','NETWORK_POOL_EXHAUSTED'),('overlap','NETWORK_OVERLAP'),('no pg_hba.conf entry','PG_HBA_REJECTED'),('password authentication failed','PG_AUTH_REJECTED'),('connection refused','CONNECTION_REFUSED'),('read-only file system','READ_ONLY_FILESYSTEM'),('permission denied','PERMISSION_DENIED'),('cannot find module','RUNTIME_MODULE_MISSING'),('out of memory','OUT_OF_MEMORY'),('unhealthy','HEALTHCHECK_FAILED')]
 lower=text.lower()
 return next((code for pattern,code in patterns if pattern in lower),'UNCLASSIFIED')
def failure_summary(phase,logs):
 # Never output raw technical logs, SQL, paths, config or exception messages.
 result={'phase':phase,'category':'UNCLASSIFIED','containers':{}}
 if phase=='edge':
  receipt=ROOT/'operation/caddy-failure.json'
  result['caddyIntentPresent']=(ROOT/'operation/caddy-intent.json').exists()
  if receipt.is_file() and not receipt.is_symlink() and receipt.stat().st_size<4096:
   value=json.loads(receipt.read_text());allowed={'not-written','original-restored','original-bytes-restored-reload-unconfirmed','drift-preserved-no-overwrite'}
   if value.get('release')==RELEASE and value.get('rollback') in allowed:result['caddyRollback']=value['rollback']
 file=logs/(phase+'.log')
 if file.is_file() and not file.is_symlink():
  with file.open('rb') as source:source.seek(max(0,file.stat().st_size-8192));result['category']=failure_category(source.read(8192).decode('utf-8',errors='replace'))
 for name in ['onixbit-messenger-staging-db','onixbit-messenger-staging-api']:
  try:
   value=core.checked(['inspect','--format','{{json .Config.Labels}}\n{{json .State.Status}}\n{{json .State.ExitCode}}\n{{json .State.OOMKilled}}',name]);labels,status,exitcode,oom=map(json.loads,value.splitlines())
   if labels.get('com.docker.compose.project')!='onixbit-messenger-staging' or labels.get('com.onixbit.staging.release')!=RELEASE:continue
   entry={'status':status if status in ['created','running','paused','restarting','removing','exited','dead'] else 'unknown','exitCode':exitcode,'oomKilled':oom}
   output=core.docker(['logs','--tail','40',name],capture_output=True,text=True,timeout=5);entry['category']=failure_category((output.stdout+output.stderr)[-8192:]);result['containers'][name]=entry
  except Exception:continue
 return result

def recover():
 if sys.argv[1:]!=['--recover-initialized-network'] or Path.cwd()!=ROOT or ROOT.resolve()!=ROOT or os.getuid()==0:raise core.StageStop('EXACT_SCOPE_REQUIRED')
 operation=ROOT/'operation'/RECOVERY
 if operation.resolve()!=operation or not operation.is_dir() or set(p.name for p in operation.iterdir())!={'recover-network.py','image_runtime.py'}:raise core.StageStop('EXCLUSIVE_RECOVERY_REQUIRED')
 received=json.loads((ROOT/'operation/received.json').read_text());release=json.loads((ROOT/'release.json').read_text())
 if received.get('releaseId')!=RELEASE or received.get('plainSHA256')!=core.PACKAGE or release.get('releaseId')!=RELEASE:raise core.StageStop('RELEASE_BINDING')
 if core.runtime_identity(ROOT/'runtime')!=core.RUNTIME_TREE or hashlib.sha256((ROOT/'compose.json').read_bytes()).hexdigest()!=core.COMPOSE_SHA:raise core.StageStop('SOURCE_DRIFT')
 for name in ['private','state/mail']:
  directory=ROOT/name
  if directory.resolve()!=directory or any(directory.iterdir()):raise core.StageStop('UNPROVISIONED_STATE_REQUIRED')
 for name,uid,mode in [('bootstrap/profile.json',os.getuid(),0o600),('bootstrap/pg-admin',70,0o400)]:
  file=ROOT/name;meta=file.lstat()
  if file.is_symlink() or not file.is_file() or meta.st_uid!=uid or meta.st_mode&0o777!=mode:raise core.StageStop('PRIVATE_METADATA_DRIFT')
 previous=ROOT/'operation/image-continuation-261029-a/logs'
 for name in ['owner.log','initdb.log','postgres.log']:
  if not (previous/name).is_file():raise core.StageStop('INITIALIZATION_RECEIPTS_REQUIRED')
 for name in ['bootstrap.log','api.log','edge.log']:
  if (previous/name).exists():raise core.StageStop('PROVISIONING_ALREADY_ATTEMPTED')
 if (ROOT/'operation/caddy-intent.json').exists() or core.checked(['ps','-aq','--filter','label=com.docker.compose.project=onixbit-messenger-staging']):raise core.StageStop('STAGING_NAMESPACE_OCCUPIED')
 if core.docker(['network','inspect','onixbit-messenger-staging_backend'],capture_output=True,timeout=5).returncode==0:raise core.StageStop('STAGING_NETWORK_OCCUPIED')
 for name in ['onixbit-messenger-staging-db','onixbit-messenger-staging-api','onixbit-messenger-staging-version-probe']:
  if core.docker(['inspect',name],capture_output=True,timeout=5).returncode==0:raise core.StageStop('STAGING_NAME_OCCUPIED')
 memory=int(re.search(r'^MemAvailable:\s+(\d+) kB',Path('/proc/meminfo').read_text(),re.M)[1])*1024;disk=os.statvfs(ROOT)
 if memory<1536*1024*1024 or disk.f_bavail*disk.f_frsize<3*1024*1024*1024:raise core.StageStop('RESOURCE_BUDGET')
 logs=operation/'logs';logs.mkdir(mode=0o700);phase='preflight';bootstrapped=False
 def docker_step(args,log,timeout=100):
  with (logs/log).open('xb') as out:result=core.docker(args,stdout=out,stderr=subprocess.STDOUT,timeout=timeout)
  if result.returncode:raise core.StageStop('DOCKER_STEP_FAILED')
 def compose(args,log,timeout=100):return docker_step(['compose','--project-directory',str(ROOT),'--env-file',str(operation/'deployment.env'),'--file',str(operation/'compose.json'),*args],log,timeout)
 try:
  ids=pinned_images(release,json.loads((ROOT/'operation/image-continuation-261029-a/image-proof.json').read_text()))
  phase='existing-cluster'
  script="const fs=require('fs');const p='/data/18/docker';if(fs.realpathSync(p)!==p||fs.existsSync(p+'/postmaster.pid'))throw Error('CLUSTER_STATE');const f=p+'/PG_VERSION',s=fs.lstatSync(f);if(!s.isFile()||s.uid!==70||fs.readFileSync(f,'utf8').trim()!=='18')throw Error('PG18_REQUIRED');console.log(JSON.stringify({existingPG18:true,readOnly:true}));"
  docker_step(['run','--rm','--name','onixbit-messenger-staging-version-probe','--pull=never','--network=none','--user','70:70','--read-only','--cap-drop=ALL','--security-opt','no-new-privileges:true','--memory','128m','--cpus','0.5','--pids-limit','32','--label','com.docker.compose.project=onixbit-messenger-staging','--label','com.onixbit.staging.release='+RELEASE,'--mount','type=bind,source='+str(ROOT/'state/postgres')+',target=/data,readonly','--entrypoint','/usr/bin/node',ids['node'],'--max-old-space-size=32','-e',script],'existing-cluster.log',30)
  phase='network-plan';occupied=network_ranges();subnet=select_subnet(occupied)
  (operation/'network-proof.json').write_text(json.dumps({'subnet':subnet,'occupiedRangeCount':len(occupied),'existingNetworksModified':False})+'\n')
  hba=operation/'pg_hba.conf';hba.write_text(hba_profile(subnet));hba.chmod(0o644)
  (operation/'compose.json').write_text(json.dumps(compose_profile(json.loads((ROOT/'compose.json').read_text()),ROOT,operation,subnet),indent=2)+'\n')
  values={'NODE_IMAGE':ids['node'],'POSTGRES_IMAGE':ids['postgres'],'STAGING_UID':os.getuid(),'STAGING_GID':os.getgid(),'PG_UID':70,'PG_GID':70,'STAGING_RELEASE':RELEASE}
  (operation/'deployment.env').write_text(''.join(k+'='+str(v)+'\n' for k,v in values.items()))
  phase='compose-validation';compose(['config','--quiet'],'compose-validation.log',20)
  for step,args,timeout in [('postgres',['up','-d','--wait','--wait-timeout','90','postgres'],100),('bootstrap',['run','--rm','--no-deps','bootstrap'],45),('api',['up','-d','--wait','--wait-timeout','90','onixbit-messenger-staging-api'],100),('smoke-before',['run','--rm','--no-deps','verify','--setup'],30),('restart',['restart','onixbit-messenger-staging-api'],20),('restart-health',['up','-d','--wait','--wait-timeout','90','onixbit-messenger-staging-api'],100),('smoke-after',['run','--rm','--no-deps','verify','--after-restart'],30)]:
   phase=step;compose(args,step+'.log',timeout)
   if step=='bootstrap':bootstrapped=True
  (ROOT/'bootstrap/profile.json').unlink();phase='edge';edge=ROOT/'operation/caddy-edge.py'
  if hashlib.sha256(edge.read_bytes()).hexdigest()!=EDGE_SHA:raise core.StageStop('EDGE_DRIFT')
  with (logs/'edge.log').open('xb') as out:result=subprocess.run(['python3',str(edge),'--activate',RELEASE],stdout=out,stderr=subprocess.STDOUT,timeout=660)
  if result.returncode:raise core.StageStop('EDGE_STOPPED')
  print(json.dumps({'status':'STAGING_ACTIVE','release':RELEASE,'nativeProvidersEnabled':False,'publicTLS':True,'authRestartVerified':True,'subnet':subnet}))
 except Exception:
  try:print(json.dumps({'failureSummary':failure_summary(phase,logs)}))
  except Exception:pass
  if bootstrapped and (ROOT/'bootstrap/smoke-state.json').exists() and (ROOT/'bootstrap/profile.json').exists():
   try:compose(['run','--rm','--no-deps','verify','--cleanup'],'synthetic-cleanup.log',30)
   except Exception:pass
  for identifier in core.checked(['ps','-aq','--filter','label=com.docker.compose.project=onixbit-messenger-staging','--filter','label=com.onixbit.staging.release='+RELEASE]).split():
   if re.fullmatch(r'[a-f0-9]{12,64}',identifier):core.docker(['stop',identifier],capture_output=True,timeout=20)
  print(json.dumps({'status':'STOP','phase':phase,'dataPreserved':True}));raise
if __name__=='__main__':
 os.umask(0o077)
 try:recover()
 except Exception as error:print(json.dumps({'code':'NETWORK_RECOVERY_STOPPED','reason':core.safe_reason(error)}));sys.exit(1)
