"""Read-only inventory for a new isolated ai-mop staging service. No config dumps."""
import hashlib,json,os,platform,pwd,re,shutil,socket,subprocess,urllib.request
from pathlib import Path

ROOT=Path('/home/deploy/apps/ai-mop-staging')
SITE=Path('/opt/onixbit-site')
CADDY='onixbit-site-caddy-1'

def run(args):
    result=subprocess.run(args,capture_output=True,timeout=8,check=True)
    if len(result.stdout)>65536:raise RuntimeError('OUTPUT_BUDGET')
    return result.stdout.decode().strip()

def main():
    if pwd.getpwuid(os.getuid()).pw_name!='deploy':raise RuntimeError('EXPECTED_DEPLOY_USER')
    docker=['/usr/bin/docker','--host','unix:///var/run/docker.sock']
    projection='{{json .Id}}\n{{json .Image}}\n{{json .State.Running}}\n{{json .State.StartedAt}}\n{{json .NetworkSettings.Networks}}\n{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{json .Source}}{{end}}{{end}}'
    values=run(docker+['inspect','--format',projection,CADDY]).splitlines()
    if len(values)!=6:raise RuntimeError('CADDY_SHAPE')
    identifier,image,running,started,networks,source=map(json.loads,values)
    path=Path(source).resolve(strict=True)
    if not running or not path.is_relative_to(SITE) or path!=(SITE/'current/Caddyfile').resolve(strict=True):raise RuntimeError('CADDY_SCOPE')
    config=path.read_bytes();meta=path.stat()
    if len(config)>1048576:raise RuntimeError('CONFIG_SIZE')
    inode=run(docker+['exec',CADDY,'stat','-Lc','%d:%i','/etc/caddy/Caddyfile'])
    if inode!=f'{meta.st_dev}:{meta.st_ino}':raise RuntimeError('BIND_INODE_MISMATCH')
    memory=next(int(line.split()[1])*1024 for line in Path('/proc/meminfo').read_text().splitlines() if line.startswith('MemAvailable:'))
    ports=set()
    for name in ['/proc/net/tcp','/proc/net/tcp6']:
        for line in Path(name).read_text().splitlines()[1:]:
            parts=line.split()
            if parts[3]=='0A':ports.add(int(parts[1].rsplit(':',1)[1],16))
    hostnames={}
    for host in ['onixbit.ru','messenger-test.onixbit.ru','ai-mop-test.onixbit.ru']:
        try:hostnames[host]=sorted({row[4][0] for row in socket.getaddrinfo(host,443,type=socket.SOCK_STREAM)})
        except socket.gaierror:hostnames[host]=[]
    public={}
    for url in ['https://onixbit.ru/api/health','https://messenger-test.onixbit.ru/api/health']:
        with urllib.request.urlopen(url,timeout=10) as response:
            data=response.read(65537)
            if len(data)>65536:raise RuntimeError('HEALTH_BODY_LIMIT')
            public[url]={'status':response.status,'body_sha256':hashlib.sha256(data).hexdigest()}
    neighbors=[]
    for name in run(docker+['ps','--format','{{.Names}}']).splitlines():
        if name.startswith(('onixbit-','ai-mop-')):
            fields=run(docker+['inspect','--format','{{json .Id}}\n{{json .State.StartedAt}}\n{{json .Config.Image}}',name]).splitlines()
            neighbors.append({'name':name,'id':json.loads(fields[0]),'started_at':json.loads(fields[1]),'image':json.loads(fields[2])})
    images=[line for line in run(docker+['images','--format','{{.Repository}}:{{.Tag}} {{.ID}}']).splitlines() if re.match(r'^(python|ghcr.io/benoitc/gunicorn):',line)]
    parent=ROOT.parent
    result={'read_only':True,'uid':os.getuid(),'gid':os.getgid(),'python':platform.python_version(),
            'root':str(ROOT),'root_available':not os.path.lexists(ROOT),'parent_exists':parent.is_dir(),
            'parent_writable':os.access(parent,os.W_OK),'memory_available_bytes':memory,'disk_free_bytes':shutil.disk_usage(parent).free,
            'candidate_port':47200,'candidate_port_free':47200 not in ports,'existing_python_images':images,
            'caddy':{'id':identifier,'image':image,'started_at':started,'path':str(path),'source':source,'sha256':hashlib.sha256(config).hexdigest(),
                     'device':meta.st_dev,'inode':meta.st_ino,'mode':oct(meta.st_mode&0o777),'uid':meta.st_uid,'writable':os.access(path,os.W_OK),
                     'networks':{name:{'ip':value['IPAddress'],'gateway':value['Gateway']} for name,value in networks.items()},
                     'ai_mop_domain_present':b'ai-mop-test.onixbit.ru' in config},'dns':hostnames,'public_health':public,'neighbors':neighbors}
    print(json.dumps(result,sort_keys=True))

if __name__=='__main__':
    try:main()
    except Exception as exc:
        print(json.dumps({'read_only':True,'status':'STOP','error_type':type(exc).__name__}));raise SystemExit(1)
