"""One read-only lookup inside the existing staging API; stdin-only query/key, no host writes."""
import hashlib,json,os,subprocess,sys
from pathlib import Path

ROOT=Path('/home/deploy/apps/onixbit-messenger-staging')
CONTAINER='onixbit-messenger-staging-api'
RELEASE='stage-bb3d7fdc2fb68cb5'
LIBRARY_SHA='42c390416075386aae3c687fa4a5d64bba8c740de9a837e87b53cb8c621a2ee8'

def validate_inspection(text):
 running,labels,mounts,readonly=map(json.loads,text.splitlines())
 if running is not True or readonly is not True or labels.get('com.docker.compose.project')!='onixbit-messenger-staging' or labels.get('com.onixbit.staging.release')!=RELEASE:raise ValueError()
 mail=[v for v in mounts if v.get('Destination')=='/var/onixbit-mail']
 if len(mail)!=1 or mail[0].get('Type')!='bind' or mail[0].get('Source')!=str(ROOT/'state/mail'):raise ValueError()

def node_program(payload):
 if set(payload)!={'library','query','key'} or not isinstance(payload['library'],str) or len(payload['library'])>16000 or hashlib.sha256(payload['library'].encode()).hexdigest()!=LIBRARY_SHA:raise ValueError()
 import base64,re
 if not isinstance(payload['key'],str) or not re.fullmatch('[A-Za-z0-9+/]{43}=',payload['key']) or len(base64.b64decode(payload['key'],validate=True))!=32:raise ValueError()
 box=payload['query']
 if not isinstance(box,dict) or set(box)!={'version','requestId','nonce','tag','data'} or box.get('version')!=1 or not re.fullmatch('[a-f0-9-]{36}',box.get('requestId','')) or len(json.dumps(box))>24000:raise ValueError()
 values=json.dumps({'key':payload['key'],'box':box},separators=(',',':'))
 return payload['library']+'\nconst input='+values+';\n'+"const budget=setTimeout(()=>process.exit(124),8000);try {const secret=Buffer.from(input.key,'base64');const query=open(input.box,secret,'query',input.box.requestId);if(query.requestId!==input.box.requestId||query.origin!=='https://messenger-test.onixbit.ru')throw Error();const result=await lookupVerification('/var/onixbit-mail',query);console.log(JSON.stringify(seal(result,secret,'response',input.box.requestId)));}catch {console.error(JSON.stringify({code:'MAIL_LOOKUP_STOPPED'}));process.exitCode=1;}finally{clearTimeout(budget); }\n"

def run():
 if Path.cwd()!=ROOT or ROOT.resolve(strict=True)!=ROOT or os.getuid()==0:raise ValueError()
 data=sys.stdin.buffer.read(65537)
 if len(data)>65536:raise ValueError()
 payload=json.loads(data);program=node_program(payload)
 inspection=subprocess.run(['docker','inspect','--format','{{json .State.Running}}\n{{json .Config.Labels}}\n{{json .Mounts}}\n{{json .HostConfig.ReadonlyRootfs}}',CONTAINER],capture_output=True,text=True,timeout=3)
 if inspection.returncode or len(inspection.stdout)>16384:raise ValueError()
 validate_inspection(inspection.stdout)
 result=subprocess.run(['docker','exec','-i',CONTAINER,'node','--max-old-space-size=96','--input-type=module'],input=program,capture_output=True,text=True,timeout=9)
 if result.returncode or result.stderr or len(result.stdout)>24576:raise ValueError()
 box=json.loads(result.stdout)
 if set(box)!={'version','requestId','nonce','tag','data'} or box.get('version')!=1 or box.get('requestId')!=payload['query']['requestId']:raise ValueError()
 print(json.dumps({'sealedMailLookup':box},separators=(',',':')))

if __name__=='__main__':
 try:run()
 except Exception:print(json.dumps({'code':'MAIL_LOOKUP_STOPPED'}));sys.exit(1)
