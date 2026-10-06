"""Read-only Onixbit cleanup inventory. No changes, no environment/credentials output."""
import json,subprocess,hashlib,re,shutil,datetime,os
from pathlib import Path
ROOT=Path('/opt/onixbit-site');CONFIG=ROOT/'releases/7c96b74bae0711ee9041b7ebfeb2bdc545b220b2/Caddyfile';PROXY='onixbit-site-caddy-1'
def run(*args):return subprocess.check_output(args,text=True,timeout=90).strip()
def field(n,f):return json.loads(run('docker','inspect','--format','{{json '+f+'}}',n))
assert ROOT.is_dir() and ROOT.resolve()==ROOT and not CONFIG.is_symlink()
text=CONFIG.read_text();sha=hashlib.sha256(text.encode()).hexdigest();assert run('docker','exec',PROXY,'sha256sum','/etc/caddy/Caddyfile').split()[0]==sha
names=[n for n in run('docker','ps','-a','--format','{{.Names}}').splitlines() if re.fullmatch('onixbit-[a-z0-9-]+',n)];assert len(names)<150
containers=[]
for n in names:
 containers.append({'name':n,'id':field(n,'.Id'),'image':field(n,'.Image'),'running':field(n,'.State.Running'),'startedAt':field(n,'.State.StartedAt'),'mounts':[{k:m.get(k) for k in ['Type','Source','Destination','RW']} for m in field(n,'.Mounts')]})
entries=[]
for family in ['previews','releases','full-site-releases','full-site-incoming','demo-incoming','demo-releases','preview-backups','full-site-backups']:
 parent=ROOT/family
 if not parent.is_dir() or parent.is_symlink():continue
 children=sorted(parent.iterdir());assert len(children)<200
 for p in children:
  if p.is_symlink():entries.append({'path':str(p.relative_to(ROOT)),'symlink':True,'target':str(p.resolve())});continue
  if not p.is_dir() and not p.is_file():continue
  e={'path':str(p.relative_to(ROOT)),'bytesOnDisk':int(run('du','-sxk',str(p)).split()[0])*1024,'mtime':p.stat().st_mtime,'directory':p.is_dir()}
  e['mountUsers']=[c['name'] for c in containers if any(m.get('Source') and (Path(m['Source'])==p or p in Path(m['Source']).parents) for m in c['mounts'])]
  e['buildIds']=[q.read_text().strip() for q in [p/'.next/BUILD_ID',p/'runtime/.next/BUILD_ID'] if q.is_file() and not q.is_symlink() and q.stat().st_size<100];entries.append(e)
references=[]
for c in containers:
 for m in c['mounts']:
  source=m.get('Source')
  if m.get('Type')!='bind' or not source:continue
  p=Path(source)
  if p.is_symlink():references.append({'container':c['name'],'path':str(p),'target':str(p.resolve())})
  if not p.is_dir() or not p.is_relative_to(ROOT):continue
  count=0
  for directory,dirs,files in os.walk(p,followlinks=False):
   for name in [*dirs,*files]:
    q=Path(directory)/name
    if q.is_symlink():references.append({'container':c['name'],'path':str(q),'target':str(q.resolve())});count+=1
   assert count<5000
mem=dict(x.split(':',1) for x in Path('/proc/meminfo').read_text().splitlines());st=CONFIG.stat();d={'readOnly':True,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'configSHA256':sha,'configPath':str(CONFIG),'configInode':f'{st.st_dev}:{st.st_ino}','current':str((ROOT/'current').resolve()),'upstreams':re.findall(r'reverse_proxy\s+([^\s{]+)',text),'containers':containers,'symlinkReferences':references,'entries':entries,'diskFreeBytes':shutil.disk_usage(ROOT).free,'memoryAvailableBytes':int(mem['MemAvailable'].split()[0])*1024};assert CONFIG.read_text()==text
print('ONIXBIT_SAFE_REPORT_AP='+json.dumps(d).encode().hex().translate(str.maketrans('0123456789abcdef','abcdefghijklmnop')))
