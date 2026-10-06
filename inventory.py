"""Read-only OS, package, container and persistent-routing inventory.
No package changes, service actions, database writes or environment output.
"""
import datetime, hashlib, json, os, pathlib, re, shutil, subprocess
ROOT=pathlib.Path('/opt/onixbit-site')
PROXY='onixbit-site-caddy-1'

def cmd(args, timeout=45):
    p=subprocess.run(args,capture_output=True,text=True,timeout=timeout)
    return {'rc':p.returncode,'output':p.stdout.strip()}

def output(args):
    r=cmd(args)
    if r['rc']:raise RuntimeError('FAILED_'+args[0])
    return r['output']

def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inspect(n,f):return json.loads(output(['docker','inspect','--format','{{json '+f+'}}',n]))

assert ROOT.is_dir() and ROOT.resolve()==ROOT
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'readOnly':True}
osrelease={}
for line in pathlib.Path('/etc/os-release').read_text().splitlines():
    if '=' in line:
        k,v=line.split('=',1)
        if k in ['NAME','VERSION','VERSION_ID','ID','VERSION_CODENAME']:osrelease[k]=v.strip('"')
report['os']=osrelease
report['kernel']=output(['uname','-r'])
report['uptimeSeconds']=float(pathlib.Path('/proc/uptime').read_text().split()[0])
report['uid']=os.getuid()
report['rootAvailable']=os.getuid()==0 or cmd(['sudo','-n','true'])['rc']==0
report['disk']=shutil.disk_usage(ROOT)._asdict()
report['packages']=cmd(['dpkg-query','-W','-f=${Package}\t${Version}\n'])
report['heldPackages']=cmd(['apt-mark','showhold'])
report['sudoPrivileges']=cmd(['sudo','-n','-l'])
report['upgradablePackages']=cmd(['apt','list','--upgradable'])
report['packageHealth']=cmd(['dpkg','--audit'])
report['kernelPackageStatus']=cmd(['dpkg-query','-W','-f=${Package}\t${db:Status-Status}\t${Version}\n','linux-image-*'])
report['moduleUnit']=cmd(['systemctl','show','install-modules-extra.service','-p','Result','-p','ExecMainStatus','-p','ActiveState','-p','FragmentPath'])
report['aptIndexNewestMtime']=max([p.stat().st_mtime for p in pathlib.Path('/var/lib/apt/lists').glob('*InRelease')],default=None)
report['dockerVersion']=cmd(['docker','version','--format','{{json .Server}}'])
report['dockerSystem']=cmd(['docker','system','df','--format','{{json .}}'])
report['services']={n:{'enabled':cmd(['systemctl','is-enabled',n]),'active':cmd(['systemctl','is-active',n])} for n in ['docker','containerd','ssh','cron','ufw','mysql','mariadb','postgresql','redis-server']}
report['failedUnits']=cmd(['systemctl','--failed','--no-legend','--no-pager'])
names=output(['docker','ps','-a','--format','{{.Names}}']).splitlines()
report['foreignContainerCount']=sum(not n.startswith('onixbit-') for n in names)
report['containers']=[]
for n in names:
    if not n.startswith('onixbit-'):continue
    c={'name':n,'id':inspect(n,'.Id'),'image':inspect(n,'.Image'),'imageTag':inspect(n,'.Config.Image'),
       'running':inspect(n,'.State.Running'),'restartPolicy':inspect(n,'.HostConfig.RestartPolicy'),
       'readOnlyRoot':inspect(n,'.HostConfig.ReadonlyRootfs'),'user':inspect(n,'.Config.User'),
       'portBindings':inspect(n,'.HostConfig.PortBindings'),
       'mounts':[{k:m.get(k) for k in ['Type','Source','Destination','RW']} for m in inspect(n,'.Mounts')]}
    if c['running'] and (n.startswith('onixbit-full-site-') or n=='onixbit-site-web-1'):
        c['node']=cmd(['docker','exec',n,'node','--version'])
    report['containers'].append(c)
report['caddyVersion']=cmd(['docker','exec',PROXY,'caddy','version'])
bound=output(['docker','exec',PROXY,'sha256sum','/etc/caddy/Caddyfile']).split()[0]
source=next(m['Source'] for m in inspect(PROXY,'.Mounts') if m['Destination']=='/etc/caddy/Caddyfile')
p=pathlib.Path(source)
report['proxyConfig']={'boundSHA256':bound,'mountSource':source,'resolvedSource':str(p.resolve()),'sourceSHA256':digest(p),'sameAfterRestart':bound==digest(p),
    'sourceUpstreams':re.findall(r'reverse_proxy\s+([^\s{]+)',p.read_text())}
config=ROOT/'releases/7c96b74bae0711ee9041b7ebfeb2bdc545b220b2/Caddyfile'
report['persistentConfigWritable']=os.access(p,os.W_OK)
report['knownActiveConfig']={'path':str(config),'sha256':digest(config),'upstreams':re.findall(r'reverse_proxy\s+([^\s{]+)',config.read_text())}
report['databasePackageCandidates']=[line for line in report['packages']['output'].splitlines() if re.search(r'^(postgresql|mariadb|mysql-server|redis-server|sqlite3)\b',line)]
report['databaseProcessNames']=cmd(['pgrep','-l','-x','postgres|mysqld|mariadbd|redis-server'])
report['status']='INVENTORY_PASS'
raw=json.dumps(report).encode();encoded=raw.hex().translate(str.maketrans('0123456789abcdef','abcdefghijklmnop'))
for i,start in enumerate(range(0,len(encoded),8192)):print('ONIXBIT_MAINT_CHUNK_'+format(i,'08x').translate(str.maketrans('0123456789abcdef','abcdefghijklmnop'))+'='+encoded[start:start+8192])
print('ONIXBIT_MAINT_END_AP='+json.dumps({'chunks':(len(encoded)+8191)//8192,'sha256':hashlib.sha256(raw).hexdigest()}).encode().hex().translate(str.maketrans('0123456789abcdef','abcdefghijklmnop')))
