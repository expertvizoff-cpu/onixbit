"""Synchronise only the persistent proxy source with the verified active config.
No reload/restart, container change, package operation or database operation.
"""
import fcntl, hashlib, json, os, pathlib, stat, subprocess, sys, urllib.request, urllib.error
ROOT=pathlib.Path('/opt/onixbit-site')
ACTIVE=ROOT/'releases/7c96b74bae0711ee9041b7ebfeb2bdc545b220b2/Caddyfile'
TARGET=ROOT/'releases/bc80907dd9f716c9db36506704b73d7c5899d67e/Caddyfile'
BACKUP=ROOT/'maintenance-backups/20261006-persistent-proxy'
PROXY='onixbit-site-caddy-1'
ACTIVE_SHA='81bdd7d3a5544081f835eaf6b6ca28ecbca6ca70651eae772730a4d35c6f71c3'
OLD_SHA='aa0d794414b2a38273cf9a7557f5d54b2063e09dec09a2a6bc03e6de184ae94e'
REPORT={'mode':sys.argv[1] if len(sys.argv)==2 else None,'status':'START','changed':False}
URLS=['https://onixbit.ru'+p for p in ['/','/api/health','/robots.txt','/sitemap.xml','/design/','/demo/']]+['https://media.onixbit.ru/healthz']

def need(value,message):
    if not value:raise RuntimeError(message)
def sha(data):return hashlib.sha256(data).hexdigest()
def run(*args,input=None):
    p=subprocess.run(args,input=input,capture_output=True,text=True,timeout=45)
    need(p.returncode==0,'COMMAND_FAILED_'+args[0]);return p.stdout.strip()
def field(name,f):return json.loads(run('docker','inspect','--format','{{json '+f+'}}',name))
def identities():
    return {n:{'id':field(n,'.Id'),'running':field(n,'.State.Running'),'startedAt':field(n,'.State.StartedAt'),'image':field(n,'.Image')} for n in run('docker','ps','-a','--format','{{.Names}}').splitlines() if n.startswith('onixbit-')}
def http():
    result={}
    for url in URLS:
        try:r=urllib.request.urlopen(urllib.request.Request(url,headers={'Accept-Encoding':'identity'}),timeout=25)
        except urllib.error.HTTPError as e:r=e
        with r:result[url]={'status':r.status,'sha256':sha(r.read()),'robots':r.headers.get('X-Robots-Tag','')}
    need(all(v['status']==(404 if '/design/' in u or '/demo/' in u else 200) for u,v in result.items()),'HTTP_STATUS')
    return result
def guarded(expected):
    need(ROOT.resolve()==ROOT and ACTIVE.resolve()==ACTIVE and TARGET.resolve()==TARGET,'EXACT_REAL_PATHS')
    need((ROOT/'current/Caddyfile').resolve()==TARGET,'PERSISTENT_PATH_DRIFT')
    need(sha(ACTIVE.read_bytes())==ACTIVE_SHA and sha(TARGET.read_bytes())==expected,'CONFIG_DRIFT')
    need(run('docker','exec',PROXY,'sha256sum','/etc/caddy/Caddyfile').split()[0]==ACTIVE_SHA,'BOUND_CONFIG_DRIFT')
    mounts=field(PROXY,'.Mounts')
    need(any(m['Destination']=='/etc/caddy/Caddyfile' and m['Source']==str(ROOT/'current/Caddyfile') for m in mounts),'BIND_PATH_DRIFT')
def durable(path,data):
    with path.open('wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
def write_target(data,expected,inode):
    fd=os.open(TARGET,os.O_RDWR|os.O_NOFOLLOW)
    try:
        st=os.fstat(fd);need((st.st_dev,st.st_ino)==inode,'TARGET_INODE_DRIFT')
        need(os.read(fd,len(expected)+1)==expected,'TARGET_BYTES_DRIFT')
        os.lseek(fd,0,os.SEEK_SET);offset=0
        try:
            while offset<len(data):offset+=os.write(fd,data[offset:])
            os.ftruncate(fd,len(data));os.fsync(fd)
        except BaseException:
            os.lseek(fd,0,os.SEEK_SET);offset=0
            while offset<len(expected):offset+=os.write(fd,expected[offset:])
            os.ftruncate(fd,len(expected));os.fsync(fd);raise
    finally:os.close(fd)
def main():
    need(REPORT['mode'] in ['--plan','--apply'],'MODE')
    need(not BACKUP.exists() and BACKUP.resolve()==BACKUP,'ALREADY_STARTED_OR_BACKUP_PATH')
    locks=[]
    for name in ['.full-site-publish.lock','.demo-publish.lock']:
        fd=os.open(ROOT/name,os.O_RDONLY|os.O_NOFOLLOW);need(stat.S_ISREG(os.fstat(fd).st_mode),'LOCK');fcntl.flock(fd,fcntl.LOCK_EX|fcntl.LOCK_NB);locks.append(fd)
    try:
        guarded(OLD_SHA);before=TARGET.read_bytes();accepted=ACTIVE.read_bytes();st=TARGET.stat();inode=(st.st_dev,st.st_ino)
        need(os.access(TARGET,os.W_OK),'TARGET_NOT_WRITABLE')
        need(b'onixbit-full-site-20261006-premium-mobile-rendering:3000' in accepted,'ACTIVE_ROOT')
        run('docker','exec','-i',PROXY,'caddy','validate','--config','-','--adapter','caddyfile',input=accepted.decode())
        REPORT.update(beforeHttp=http(),beforeContainers=identities(),oldSHA256=OLD_SHA,newSHA256=ACTIVE_SHA,target=str(TARGET))
        if REPORT['mode']=='--plan':REPORT['status']='PLAN_PASS';return
        BACKUP.mkdir(parents=True,mode=0o700);durable(BACKUP/'Caddyfile.before',before);durable(BACKUP/'Caddyfile.accepted',accepted)
        need((BACKUP/'Caddyfile.before').read_bytes()==before and (BACKUP/'Caddyfile.accepted').read_bytes()==accepted,'BACKUP_VERIFY')
        try:
            guarded(OLD_SHA);write_target(accepted,before,inode);REPORT['changed']=True
            guarded(ACTIVE_SHA);need(identities()==REPORT['beforeContainers'],'CONTAINER_CHANGED');REPORT['afterHttp']=http();need(REPORT['afterHttp']==REPORT['beforeHttp'],'HTTP_CHANGED')
            REPORT['status']='PERSISTENT_PROXY_PASS'
        except BaseException:
            current=TARGET.read_bytes()
            need(current in (before,accepted),'RESTORE_TARGET_CHANGED_EXTERNALLY')
            write_target(before,current,inode);REPORT['rollback']='TARGET_RESTORED';raise
    finally:
        for fd in locks:os.close(fd)
try:main()
except Exception as e:REPORT.update(status='STOP',failure=str(e) if isinstance(e,RuntimeError) else type(e).__name__)
if BACKUP.is_dir():durable(BACKUP/'result.json',(json.dumps(REPORT,indent=2)+'\n').encode())
print('ONIXBIT_PERSIST_RESULT='+json.dumps(REPORT))
sys.exit(0 if REPORT['status'] in ['PLAN_PASS','PERSISTENT_PROXY_PASS'] else 1)
