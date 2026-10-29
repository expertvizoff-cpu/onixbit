"""Read only stopped staging PostgreSQL metadata/logs. No configs, SQL or restart."""
import json,os,re,subprocess,sys
from pathlib import Path
ROOT=Path('/home/deploy/apps/onixbit-messenger-staging');CONTAINER='onixbit-messenger-staging-db'
PATTERN=re.compile(r'error|fatal|panic|permission|read.only|failed|could not|not found|no such|unhealthy|executable|OCI',re.I)
def selected(text):return [line[:1500] for line in text.splitlines() if PATTERN.search(line)][-12:]
def read_log(root,name):
 path=root/'operation/image-continuation-261029-a/logs'/name
 if path.is_symlink() or path.resolve()!=path:raise ValueError('LOG_SYMLINK')
 if not path.exists():return {'exists':False}
 size=path.stat().st_size
 with path.open('rb') as source:source.seek(max(0,size-8192));text=source.read(8192).decode('utf-8',errors='replace')
 return {'exists':True,'bytes':size,'errors':selected(text)}
def inspect(root=ROOT,execute=subprocess.run):
 if root.resolve()!=root:raise ValueError('ROOT_SCOPE')
 logs={name:read_log(root,name) for name in ['initdb.log','postgres.log']}
 env={key:value for key,value in os.environ.items() if key not in ['DOCKER_HOST','DOCKER_CONTEXT']}
 def docker(args):return execute(['/usr/bin/docker','--host','unix:///var/run/docker.sock',*args],capture_output=True,text=True,timeout=3,env=env)
 result=docker(['inspect','--format','{{json .State}}\n{{json .Config.Labels}}',CONTAINER]);state=None
 if result.returncode==0:
  lines=result.stdout.strip().splitlines();value=json.loads(lines[0]);labels=json.loads(lines[1])
  if labels.get('com.docker.compose.project')!='onixbit-messenger-staging' or labels.get('com.onixbit.staging.release')!='stage-bb3d7fdc2fb68cb5':raise ValueError('CONTAINER_SCOPE')
  health=value.get('Health') or {};state={key:value.get(key) for key in ['Status','Running','ExitCode','Error','OOMKilled']};state['healthStatus']=health.get('Status');state['healthErrors']=selected('\n'.join(str(x.get('Output','')) for x in health.get('Log',[])))
  output=docker(['logs','--tail','60',CONTAINER]);state['startupErrors']=selected(output.stdout+output.stderr)
 else:state={'exists':False,'inspectError':selected(result.stderr)}
 return {'kind':'read-only-stopped-postgres-diagnosis','logs':logs,'container':state,'writes':False,'databaseQueries':False,'providerRequests':False}
if __name__=='__main__':
 try:
  if sys.argv[1:]!=['--inspect-stopped-postgres'] or os.getuid()==0:raise ValueError('EXACT_SCOPE')
  print(json.dumps(inspect()))
 except Exception:print(json.dumps({'code':'POSTGRES_DIAGNOSIS_UNAVAILABLE'}));sys.exit(1)
