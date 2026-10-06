"""Retire /demo only; protected root/design/media and compact reversible backup."""
import fcntl,hashlib,json,os,shutil,stat,subprocess,sys,tarfile,urllib.request,urllib.error,signal
from pathlib import Path
PLAN=json.loads('{"configPath": "/opt/onixbit-site/releases/7c96b74bae0711ee9041b7ebfeb2bdc545b220b2/Caddyfile", "configSHA256": "37826ce18bf53ba5bde5ba9cc6672fe47cb3da86e43fb1ab9def9d1e70263dc6", "configInode": "64771:129052", "current": "/opt/onixbit-site/releases/bc80907dd9f716c9db36506704b73d7c5899d67e", "demo": {"name": "onixbit-demo-20261002-relay-demo-launch-foundation-v5", "id": "fa17cf1e01cb366246ebc6097383958cfce6f7471258d2ceb9895dca98df12a3", "image": "sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648", "running": true, "startedAt": "2026-10-03T08:00:53.399434882Z", "mounts": [{"Type": "bind", "Source": "/opt/onixbit-site/previews/20261002-relay-demo-launch-foundation-v5/site", "Destination": "/srv", "RW": false}]}, "keepContainers": [{"name": "onixbit-full-site-20261006-mobile-video-hidden", "id": "5b4d8da73f539e61a97298fba74306af7c6cb6e1f9b6bbfae99f6cb621143f69", "image": "sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9", "running": true, "startedAt": "2026-10-06T12:30:08.192595715Z", "mounts": [{"Type": "bind", "Source": "/opt/onixbit-site/full-site-releases/20261006-mobile-video-hidden/runtime", "Destination": "/app", "RW": false}]}, {"name": "onixbit-full-site-20261006-design-root-copy", "id": "437872a6c0d0a69aa9123843cc9deaf7340caae9e8f698c3b9662a5f8742b7c0", "image": "sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9", "running": true, "startedAt": "2026-10-06T11:02:35.591376073Z", "mounts": [{"Type": "bind", "Source": "/opt/onixbit-site/full-site-releases/20261006-design-root-copy/runtime", "Destination": "/app", "RW": false}]}, {"name": "onixbit-full-site-20261004-content-depth-rc", "id": "51cacfedef85fd793cbfa81ef99a778f9bc2da735ea2752351988159c023f0b3", "image": "sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9", "running": false, "startedAt": "2026-10-04T06:58:49.673721221Z", "mounts": [{"Type": "bind", "Source": "/opt/onixbit-site/full-site-releases/20261004-content-depth-rc/runtime", "Destination": "/app", "RW": false}]}, {"name": "onixbit-full-site-20261004-relay-f178f70", "id": "b64148d18bc83c286fec8a5b6df932d9f8388807f657eee475943ae0378b2ac2", "image": "sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9", "running": false, "startedAt": "2026-10-04T04:07:00.617443609Z", "mounts": [{"Type": "bind", "Source": "/opt/onixbit-site/full-site-releases/20261004-relay-f178f70/runtime", "Destination": "/app", "RW": false}]}, {"name": "onixbit-full-site-20261003-full-site-rc-0f191e5", "id": "5ffaf5be8d2b7e19863417939fc7901d24e6b68d925c90f8a089059d2535b3cb", "image": "sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9", "running": false, "startedAt": "2026-10-03T18:19:54.81259699Z", "mounts": [{"Type": "bind", "Source": "/opt/onixbit-site/full-site-releases/20261003-full-site-rc-0f191e5/runtime", "Destination": "/app", "RW": false}]}, {"name": "onixbit-design-b24-concept-0b57c249b34d", "id": "d615917c3ced438ce4c98e9945ed7c1042ee3d724cbe91b90299953b843ae1f7", "image": "sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9", "running": true, "startedAt": "2026-09-28T13:49:45.316633906Z", "mounts": [{"Type": "bind", "Source": "/opt/onixbit-site/previews/b24-concept-0b57c249b34d", "Destination": "/app", "RW": false}]}, {"name": "onixbit-design-20260928-full-new-site-v3-3a1d3f65", "id": "5b1d80670b131a8e4a2bde13877b159535423102a6387d772536f54428bef1b2", "image": "sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9", "running": false, "startedAt": "2026-09-28T12:39:27.00820827Z", "mounts": [{"Type": "bind", "Source": "/opt/onixbit-site/previews/20260928-full-new-site-v3-3a1d3f65", "Destination": "/app", "RW": false}]}, {"name": "onixbit-site-web-1", "id": "e820d16fc0804bfea038ee64308b7a6dc8ebf184973bddbd79aa1d6e3f4b4e53", "image": "sha256:ec73d93b72199683b0b903e5d1808af9b916518c99c7b4048fa7d46dce58f1a6", "running": true, "startedAt": "2026-09-28T07:20:43.136458054Z", "mounts": []}, {"name": "onixbit-site-caddy-1", "id": "430f8973554a64e331d48d700c7fcd2eaf878a24415afd8e1627e1839872e531", "image": "sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648", "running": true, "startedAt": "2026-09-20T17:53:01.097506219Z", "mounts": [{"Type": "volume", "Source": "/var/lib/docker/volumes/onixbit-site_caddy_data/_data", "Destination": "/data", "RW": true}, {"Type": "volume", "Source": "/var/lib/docker/volumes/onixbit-site_caddy_config/_data", "Destination": "/config", "RW": true}, {"Type": "bind", "Source": "/opt/onixbit-site/current/Caddyfile", "Destination": "/etc/caddy/Caddyfile", "RW": false}]}, {"name": "onixbit-media-archive-media-archive-worker-1", "id": "74179542d966efc5b9e9e9b52841de00f551ab4a3fb6d0784acb75b15ddb6a74", "image": "sha256:1c671ae0a6392fc46bbc291cd6dd7479f413b610675fb8031e21d8dc2c33fae3", "running": true, "startedAt": "2026-08-26T05:07:07.058142519Z", "mounts": [{"Type": "bind", "Source": "/home/deploy/apps/onixbit-media-archive/state", "Destination": "/data", "RW": true}]}, {"name": "onixbit-media-archive-media-archive-player-1", "id": "edad2a768964929a8c0f7a11c42b4542255333f6c3944639ac5236e497dde338", "image": "sha256:42c3fb8c59c3ebe2ca1c065b641654fa99a88983f7bc75bf15f1d771e14744ac", "running": true, "startedAt": "2026-08-26T05:07:06.987263083Z", "mounts": []}, {"name": "onixbit-temp-sftp", "id": "03f159b8b173cb1dacbde205dc3e43e574d23822467b9bac237805ec0e89c5e8", "image": "sha256:2bbdeb42a94c20260e698340b669ad649e59cf592945946438cf525e0d89b218", "running": true, "startedAt": "2026-08-26T05:07:07.051946241Z", "mounts": [{"Type": "bind", "Source": "/home/deploy/onixbit-client-upload/incoming", "Destination": "/data/incoming", "RW": true}]}], "http": {"https://onixbit.ru/": {"status": 200, "sha256": "a45810dca7377230807017bdac7594e79d2b86e1744abe7474d46c8dbe683c9a", "robots": ""}, "https://onixbit.ru/api/health": {"status": 200, "sha256": "42cdaaa8dc12ba963a1f2b152e2828dc048c0996920cd0c845ebd38e0c35f0f7", "robots": ""}, "https://onixbit.ru/design/": {"status": 200, "sha256": "fb244acc30766aa6a4989af5f2863a720db0483023c5471821cfd002933b54b5", "robots": "noindex, nofollow, noarchive"}, "https://onixbit.ru/design/vnedrenie-bitrix24": {"status": 200, "sha256": "bc069ac2a47192b7b61fc0d891ece5da746a45a9a08ca6c135fac5a43f755fbe", "robots": "noindex, nofollow, noarchive"}, "https://media.onixbit.ru/healthz": {"status": 200, "sha256": "4062edaf750fb8074e7e83e0c9028c94e32468a8b6f1614774328ef045150f93", "robots": ""}}, "paths": [{"path": "previews/20261002-relay-demo-f9d009c", "bytesOnDisk": 1056768, "mtime": 1790965123.8770359, "directory": true, "mountUsers": [], "buildIds": []}, {"path": "previews/20261002-relay-demo-launch-foundation-v5", "bytesOnDisk": 1277952, "mtime": 1791014453.0050504, "directory": true, "mountUsers": ["onixbit-demo-20261002-relay-demo-launch-foundation-v5"], "buildIds": []}, {"path": "demo-incoming/20261002-relay-demo-f9d009c.tgz", "bytesOnDisk": 397312, "mtime": 1790965107.440298, "directory": false, "mountUsers": [], "buildIds": []}], "activeRoot": "onixbit-full-site-20261006-mobile-video-hidden", "previousRoot": "onixbit-full-site-20261006-design-root-copy"}')
ROOT=Path('/opt/onixbit-site');CONFIG=Path(PLAN['configPath']);BACKUP=ROOT/'cleanup-backups'/'20261006-demo-retired';PROXY='onixbit-site-caddy-1';DEMO=PLAN['demo']['name'];REPORT={'status':'RUNNING','mode':sys.argv[1] if len(sys.argv)==2 else None,'changed':False,'stopped':False,'deleted':[]}
def need(v,c):
 if not v:raise RuntimeError(c)
def interrupted(signum,frame):raise InterruptedError('Cleanup interrupted')
signal.signal(signal.SIGTERM,interrupted)
signal.signal(signal.SIGINT,interrupted)
def sha(b):return hashlib.sha256(b).hexdigest()
def run(*args,input=None):
 p=subprocess.run(args,input=input,capture_output=True,text=True,timeout=90);need(p.returncode==0,'COMMAND_FAILED_'+args[0].upper());return p.stdout.strip()
def field(n,f):return json.loads(run('docker','inspect','--format','{{json '+f+'}}',n))
def identity(n):return {'name':n,'id':field(n,'.Id'),'image':field(n,'.Image'),'running':field(n,'.State.Running'),'startedAt':field(n,'.State.StartedAt'),'mounts':sorted([{k:m.get(k) for k in ['Type','Source','Destination','RW']} for m in field(n,'.Mounts')],key=lambda m:(m.get('Destination') or '',m.get('Source') or '',m.get('Type') or ''))}
def canonical(c):
 c=json.loads(json.dumps(c));c['mounts']=sorted(c['mounts'],key=lambda m:(m.get('Destination') or '',m.get('Source') or '',m.get('Type') or ''));return c
def http(u):
 try:r=urllib.request.urlopen(urllib.request.Request(u,headers={'Accept-Encoding':'identity'}),timeout=25)
 except urllib.error.HTTPError as e:r=e
 with r:
  b=r.read(8*1024**2+1);need(len(b)<=8*1024**2,'HTTP_SIZE');return {'status':r.status,'sha256':sha(b),'robots':r.headers.get('X-Robots-Tag','')}
def protect(expected_sha):
 need(CONFIG.resolve()==CONFIG and not CONFIG.is_symlink(),'CONFIG_PATH');st=CONFIG.stat();need(f'{st.st_dev}:{st.st_ino}'==PLAN['configInode'] and sha(CONFIG.read_bytes())==expected_sha,'CONFIG_DRIFT');need(run('docker','exec',PROXY,'sha256sum','/etc/caddy/Caddyfile').split()[0]==expected_sha,'MOUNTED_CONFIG_DRIFT');need(run('docker','exec',PROXY,'stat','-Lc','%d:%i','/etc/caddy/Caddyfile')==PLAN['configInode'],'MOUNTED_INODE_DRIFT');need(str((ROOT/'current').resolve())==PLAN['current'],'CURRENT_DRIFT')
 for c in PLAN['keepContainers']:need(identity(c['name'])==canonical(c),'PROTECTED_CONTAINER_DRIFT')
 h={u:http(u) for u in PLAN['http']};need(h==PLAN['http'],'PROTECTED_HTTP_DRIFT');return h

def candidate(before):
 s=before.decode();begin='  # BEGIN ONIXBIT DEMO PREVIEW';end='  # END ONIXBIT DEMO PREVIEW';need(s.count(begin)==s.count(end)==1,'DEMO_BLOCK_MARKERS');a=s.index(begin);b=s.index(end,a)+len(end);need(DEMO in s[a:b] and DEMO not in s[:a]+s[b:],'DEMO_UPSTREAM_SCOPE')
 retired='  # BEGIN ONIXBIT DEMO RETIRED\n  @retiredDemo path /demo /demo/*\n  handle @retiredDemo {\n    header X-Robots-Tag "noindex, nofollow, noarchive"\n    respond "Not Found" 404\n  }\n  # END ONIXBIT DEMO RETIRED'
 after=(s[:a]+retired+s[b:]).encode();need(after!=before,'NO_CONFIG_CHANGE');return after

def validate(data):run('docker','exec','-i',PROXY,'caddy','validate','--config','-','--adapter','caddyfile',input=data.decode())
def durable(p,data):
 with p.open('wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
def save_report():
 p=BACKUP/'result.next';durable(p,(json.dumps(REPORT,indent=2)+'\n').encode());os.replace(p,BACKUP/'result.json');fd=os.open(BACKUP,os.O_RDONLY|os.O_DIRECTORY);os.fsync(fd);os.close(fd)
def write_config(data,expected):
 fd=os.open(CONFIG,os.O_RDWR|os.O_NOFOLLOW)
 try:
  st=os.fstat(fd);need(f'{st.st_dev}:{st.st_ino}'==PLAN['configInode'],'WRITE_INODE_DRIFT')
  with os.fdopen(fd,'rb',closefd=False) as f:current=f.read()
  need(current==expected,'WRITE_BYTES_DRIFT');REPORT['writeIntent']={'from':sha(expected),'to':sha(data)};save_report();os.lseek(fd,0,os.SEEK_SET);offset=0
  try:
   while offset<len(data):offset+=os.write(fd,data[offset:])
   os.ftruncate(fd,len(data));os.fsync(fd)
  except BaseException:
   os.lseek(fd,0,os.SEEK_SET);written=0
   while written<len(expected):written+=os.write(fd,expected[written:])
   os.ftruncate(fd,len(expected));os.fsync(fd);raise
 finally:os.close(fd)
def reload():run('docker','exec',PROXY,'caddy','reload','--config','/etc/caddy/Caddyfile','--adapter','caddyfile')
def files():
 result={}
 for e in PLAN['paths']:
  p=ROOT/e['path'];need(p.resolve()==p and not p.is_symlink() and p.exists(),'DEMO_STORAGE_PATH');need(abs(p.stat().st_mtime-e['mtime'])<.000001,'DEMO_STORAGE_DRIFT')
  for c in PLAN['keepContainers']:
   for m in c['mounts']:need(not m.get('Source') or not Path(m['Source']).is_relative_to(p),'OTHER_MOUNT_IN_DEMO')
  for f in sorted(p.rglob('*')) if p.is_dir() else [p]:
   need(not f.is_symlink(),'DEMO_SYMLINK')
   if f.is_file():
    rel=f.relative_to(ROOT).as_posix();need(not any(x.startswith('.env') or x in ('.git','.secrets') for x in f.parts),'FORBIDDEN_BACKUP_FILE');result[rel]={'bytes':f.stat().st_size,'sha256':sha(f.read_bytes())}
 need(result and sum(x['bytes'] for x in result.values())<16*1024**2,'DEMO_BACKUP_SIZE');return result

def restore(before,after,manifest):
 with tarfile.open(BACKUP/'demo-runtime.tgz','r:gz') as t:
  for m in t:
   need(m.isfile() and m.name in manifest and '..' not in Path(m.name).parts and not Path(m.name).is_absolute(),'RESTORE_MEMBER');data=t.extractfile(m).read();need(sha(data)==manifest[m.name]['sha256'],'RESTORE_HASH');p=ROOT/m.name;p.parent.mkdir(parents=True,exist_ok=True)
   if p.exists():need(p.is_file() and not p.is_symlink() and sha(p.read_bytes())==manifest[m.name]['sha256'],'RESTORE_FILE_DRIFT')
   else:p.write_bytes(data);p.chmod(0o644)
 if not field(DEMO,'.State.Running'):run('docker','start',DEMO)
 current=CONFIG.read_bytes();need(current in (before,after),'RESTORE_CONFIG_DRIFT')
 if current!=before:write_config(before,current);reload()
 protect(PLAN['configSHA256']);need(http('https://onixbit.ru/demo/')['status']==200,'RESTORE_DEMO_HTTP');REPORT['rollback']='PASS'

def main():
 need(REPORT['mode'] in ('--plan','--apply'),'MODE');need(ROOT.resolve()==ROOT and not BACKUP.exists() and not BACKUP.is_symlink() and BACKUP.resolve()==BACKUP,'OWNED_BACKUP_PATH');need(shutil.rmtree.avoids_symlink_attacks,'FD_SAFE_DELETE');fds=[]
 for name in ('.full-site-publish.lock','.demo-publish.lock'):
  fd=os.open(ROOT/name,os.O_RDONLY|os.O_NOFOLLOW);need(stat.S_ISREG(os.fstat(fd).st_mode),'LOCK');fcntl.flock(fd,fcntl.LOCK_EX|fcntl.LOCK_NB);fds.append(fd)
 try:
  REPORT['beforeHttp']=protect(PLAN['configSHA256']);need(identity(DEMO)==canonical(PLAN['demo']),'DEMO_CONTAINER_DRIFT');need(json.loads(run('docker','exec',PROXY,'wget','-q','-T','10','-O','-','http://'+PLAN['previousRoot']+':3000/api/health'))=={'ok':True,'service':'onixbit'},'ROLLBACK_ROOT_HEALTH');before=CONFIG.read_bytes();after=candidate(before);validate(after);rollback=after.replace(('reverse_proxy '+PLAN['activeRoot']+':3000').encode(),('reverse_proxy '+PLAN['previousRoot']+':3000').encode());need(after.count(('reverse_proxy '+PLAN['activeRoot']+':3000').encode())==1,'ROOT_ROLLBACK_SCOPE');validate(rollback);manifest=files();REPORT.update(candidateSHA256=sha(after),rootRollbackSHA256=sha(rollback),backupFiles=len(manifest),backupBytes=sum(f['bytes'] for f in manifest.values()))
  if REPORT['mode']=='--plan':REPORT['status']='DEMO_RETIRE_PLAN_PASS';return
  BACKUP.mkdir(parents=True,mode=0o700);durable(BACKUP/'Caddyfile.before',before);durable(BACKUP/'Caddyfile.candidate',after);durable(BACKUP/'Caddyfile.root-rollback',rollback);durable(BACKUP/'manifest.json',(json.dumps(manifest,indent=2)+'\n').encode())
  with tarfile.open(BACKUP/'demo-runtime.tgz','w:gz') as t:
   for name in manifest:t.add(ROOT/name,arcname=name,recursive=False)
  with (BACKUP/'demo-runtime.tgz').open('rb') as f:os.fsync(f.fileno())
  with tarfile.open(BACKUP/'demo-runtime.tgz') as t:
   actual={m.name:sha(t.extractfile(m).read()) for m in t};need(actual=={n:f['sha256'] for n,f in manifest.items()},'BACKUP_VERIFY')
  REPORT['archiveSHA256']=sha((BACKUP/'demo-runtime.tgz').read_bytes());save_report()
  try:
   protect(PLAN['configSHA256']);need(identity(DEMO)==canonical(PLAN['demo']),'DEMO_CHANGED');write_config(after,before);REPORT['changed']=True;reload();protect(sha(after))
   for path in ['/demo','/demo/','/demo/company.html']:need(http('https://onixbit.ru'+path)['status']==404,'DEMO_NOT_RETIRED')
   run('docker','stop','--time','30',PLAN['demo']['id']);REPORT['stopped']=True;need(field(DEMO,'.State.Running') is False,'DEMO_STILL_RUNNING')
   need(files()==manifest,'DEMO_FILES_CHANGED')
   for e in PLAN['paths']:
    p=ROOT/e['path']
    if p.is_dir():shutil.rmtree(p)
    else:p.unlink()
    REPORT['deleted'].append(e['path']);save_report()
   REPORT['afterHttp']=protect(sha(after));REPORT['demoHttp']={p:http('https://onixbit.ru'+p) for p in ['/demo','/demo/','/demo/company.html']};need(all(v['status']==404 and 'noindex' in v['robots'] for v in REPORT['demoHttp'].values()),'DEMO_FINAL_CONTRACT');REPORT['status']='DEMO_RETIRED_PASS';save_report()
  except BaseException:
   restore(before,after,manifest);raise
 finally:
  for fd in fds:os.close(fd)
try:main()
except Exception as e:
 REPORT['status']='STOP';REPORT['failure']=str(e) if type(e) is RuntimeError else type(e).__name__
 if BACKUP.is_dir():save_report()
raw=json.dumps(REPORT).encode();encoded=raw.hex().translate(str.maketrans('0123456789abcdef','abcdefghijklmnop'))
for i,start in enumerate(range(0,len(encoded),8192)):print('ONIXBIT_DEMO_CHUNK_'+format(i,'08x').translate(str.maketrans('0123456789abcdef','abcdefghijklmnop'))+'='+encoded[start:start+8192])
print('ONIXBIT_DEMO_END_AP='+json.dumps({'chunks':(len(encoded)+8191)//8192,'sha256':sha(raw)}).encode().hex().translate(str.maketrans('0123456789abcdef','abcdefghijklmnop')))
sys.exit(0 if REPORT['status'] in ('DEMO_RETIRE_PLAN_PASS','DEMO_RETIRED_PASS') else 1)
