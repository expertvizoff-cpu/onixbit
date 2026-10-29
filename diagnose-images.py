"""One read-only diagnosis of the failed release; no configs, credentials or container execution."""
import hashlib,json,os,re,subprocess,sys
from pathlib import Path
ROOT=Path('/home/deploy/apps/onixbit-messenger-staging')
IMAGES={'node':'sha256:703708c1eec2aef38efcfb6e1f640c2743ee3cc9ef798c4a76e5fec04bb6264f','postgres':'sha256:176e8f79319a3ac95941fc743754f121fae66e4c4fb9383e27cb9f142670e1a2'}
LOGS=['archive-identity','load-node','load-postgres','image-identity']
def log_info(file):
 if file.is_symlink():raise ValueError('LOG_SYMLINK')
 if not file.exists():return {'exists':False}
 size=file.stat().st_size
 with file.open('rb') as source:source.seek(max(0,size-8192));data=source.read(8192)
 text=data.decode('utf-8',errors='replace');result={'exists':True,'bytes':size,'tailSHA256':hashlib.sha256(data).hexdigest()}
 # These four files contain only public image/CLI identity information; never config/bootstrap logs.
 lines=[line for line in text.splitlines() if re.search(r'error|failed|invalid|unsupported|permission|not found|no such|unexpected|mismatch|verified|loaded image',line,re.I)]
 result['technicalMessages']=[re.sub(r'\x1b\[[0-9;]*[a-zA-Z]','',line)[:1200] for line in lines[-8:]]
 return result
def inspect(root=ROOT,execute=subprocess.run):
 if root.is_symlink() or root.resolve()!=root or (root/'operation').is_symlink() or (root/'operation/logs').is_symlink():raise ValueError('ROOT_IDENTITY')
 logs={name:log_info(root/'operation/logs'/f'{name}.log') for name in LOGS}
 env={k:v for k,v in os.environ.items() if k not in ['DOCKER_HOST','DOCKER_CONTEXT']}
 images={}
 for name,image in IMAGES.items():
  result=execute(['/usr/bin/docker','--host','unix:///var/run/docker.sock','image','inspect','--format','{{json .Id}}\n{{json .RootFS.Layers}}',image],env=env,capture_output=True,text=True,timeout=3)
  entry={'present':result.returncode==0}
  if entry['present']:
   lines=result.stdout.strip().splitlines();entry.update(id=json.loads(lines[0]),diffIds=json.loads(lines[1]))
   if entry['id']!=image or not all(re.fullmatch(r'sha256:[a-f0-9]{64}',value) for value in entry['diffIds']):raise ValueError('IMAGE_IDENTITY')
  images[name]=entry
 return {'kind':'read-only-image-diagnosis','release':'stage-bb3d7fdc2fb68cb5','logs':logs,'images':images,'writes':False,'providerRequests':False}
if __name__=='__main__':
 try:
  if sys.argv[1:]!=['--inspect-stopped-images'] or os.getuid()==0:raise ValueError('EXACT_FLAG_NONROOT_REQUIRED')
  print(json.dumps(inspect()))
 except Exception:print(json.dumps({'status':'STOP','code':'IMAGE_DIAGNOSIS_UNAVAILABLE'}));sys.exit(1)
