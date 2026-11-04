// Generic encrypted transport, not product source. Fixed existing staging root.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash,createDecipheriv} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root='/home/deploy/apps/onixbit-messenger-staging/operation/native-install-i2-261105';
const need=(x)=>{if(!x)throw Error('I2_RECEIVER_STOP');};
const hash=data=>createHash('sha256').update(data).digest('hex');
export async function receive(source){
 let key;try{
  need(os.userInfo().username==='deploy'&&process.getuid()!==0);
  const parent=await fs.lstat(path.dirname(root));
  need(parent.isDirectory()&&!parent.isSymbolicLink()&&parent.uid===process.getuid()&&await fs.realpath(path.dirname(root))===path.dirname(root));
  let data=Buffer.alloc(0);for await(const block of source){need(data.length+block.length<=4*1024*1024+8192);data=Buffer.concat([data,block]);}
  const newline=data.indexOf(10);need(newline>0&&newline<4096);
  const envelope=JSON.parse(data.subarray(0,newline)),ciphertext=data.subarray(newline+1);
  const {receipt,authorization}=envelope;
  need(envelope.purpose==='i2-authenticated-input-v1'&&/^[a-f0-9]{64}$/.test(envelope.keyHex)&&
    receipt.purpose==='code-input'&&receipt.operation==='native-install-i2-261105'&&receipt.label==='source-inputs'&&
    ciphertext.length===receipt.cipherBytes&&ciphertext.length<4*1024*1024&&hash(ciphertext)===receipt.cipherSha256&&
    Number.isSafeInteger(receipt.plainBytes)&&receipt.plainBytes>0&&receipt.plainBytes<4*1024*1024&&/^[a-f0-9]{64}$/.test(receipt.plainSha256));
  const now=Math.floor(Date.now()/1000);
  need(authorization.purpose==='i2-explicit-owner-window-v1'&&authorization.operation===receipt.operation&&
    Number.isSafeInteger(authorization.approvedAt)&&Number.isSafeInteger(authorization.expiresAt)&&
    authorization.approvedAt-30<=now&&now+450<=authorization.expiresAt&&
    authorization.expiresAt>authorization.approvedAt&&authorization.expiresAt-authorization.approvedAt<=900&&
    /^[a-f0-9]{64}$/.test(authorization.manifestSha256));
  const magic=Buffer.from('ONIXBIT-I2-v1\n');need(ciphertext.subarray(0,magic.length).equals(magic));
  key=Buffer.from(envelope.keyHex,'hex');envelope.keyHex='';
  const decipher=createDecipheriv('aes-256-gcm',key,ciphertext.subarray(magic.length,magic.length+12));
  decipher.setAAD(Buffer.from(JSON.stringify({purpose:receipt.purpose,operation:receipt.operation,label:receipt.label})));
  decipher.setAuthTag(ciphertext.subarray(-16));
  const plaintext=Buffer.concat([decipher.update(ciphertext.subarray(magic.length+12,-16)),decipher.final()]);
  need(plaintext.length===receipt.plainBytes&&hash(plaintext)===receipt.plainSha256);
  data.fill(0); // The key is passed only into the target's private stdin pipe below.
  await fs.mkdir(root,{mode:0o700}); // Exclusive: existing operation means no replay.
  await fs.mkdir(root+'/input',{mode:0o700});
  await fs.writeFile(root+'/source-inputs.tar',plaintext,{mode:0o600,flag:'wx'});plaintext.fill(0);
  const extract=String.raw`
import sys,tarfile,json,hashlib,os,pathlib
root=pathlib.Path(sys.argv[1]);expected=sys.argv[2]
with tarfile.open(root/'source-inputs.tar') as archive:
 members=archive.getmembers()
 assert len(members)<=40 and sum(x.size for x in members)<=4*1024*1024
 names=[x.name for x in members]
 assert len(names)==len(set(names)) and 'input-manifest.json' in names
 for item in members:
  p=pathlib.PurePosixPath(item.name)
  assert item.isfile() and not p.is_absolute() and '..' not in p.parts and p.as_posix()==item.name
 manifest_bytes=archive.extractfile('input-manifest.json').read()
 assert hashlib.sha256(manifest_bytes).hexdigest()==expected
 manifest=json.loads(manifest_bytes);rows={x['path']:x for x in manifest['files']}
 assert len(rows)==len(manifest['files']) and set(names)==set(rows)|{'input-manifest.json'}
 assert manifest['purpose']=='i2-prepared-inputs-v1' and manifest['operation']=='native-install-i2-261105'
 for item in members:
  data=archive.extractfile(item).read()
  if item.name!='input-manifest.json':
   row=rows[item.name];assert len(data)==row['bytes'] and hashlib.sha256(data).hexdigest()==row['sha256']
  target=root/'input'/item.name;target.parent.mkdir(parents=True,exist_ok=True,mode=0o700)
  with target.open('xb') as out:
   os.fchmod(out.fileno(),0o600);out.write(data)
`;
  const env={PATH:'/usr/bin:/bin',LANG:'C',PYTHONOPTIMIZE:'0'};
  const unpacked=spawnSync('python3',['-c',extract,root,authorization.manifestSha256],{timeout:15000,stdio:'ignore',env});
  need(unpacked.status===0);
  await fs.writeFile(root+'/authorization.json',JSON.stringify(authorization)+'\n',{mode:0o600,flag:'wx'});
  const result=spawnSync('python3',[root+'/input/ops/native-setup/i2-host.py','--activate-paused-native-i2'],
    {cwd:root+'/input',timeout:430000,input:JSON.stringify({transportKeyHex:key.toString('hex')}),encoding:'utf8',maxBuffer:8192,stdio:['pipe','pipe','ignore'],env});
  // Only the deliberately small public result can leave the VPS.
  let value;try{value=JSON.parse(result.stdout);}catch{throw Error('I2_TARGET_RESULT_UNKNOWN');}
  need(['PAUSED_NATIVE_SETUP_ACCEPTED','ROLLED_BACK','STOP'].includes(value.status)&&JSON.stringify(value).length<4096);
  return {exitCode:result.status===0?0:2,value};
 }finally{if(key)key.fill(0);}
}
if(process.argv.includes('--receive-i2'))receive(process.stdin).then(({exitCode,value})=>{
 console.log(JSON.stringify(value));process.exitCode=exitCode;
}).catch(()=>{console.log(JSON.stringify({status:'STOP',code:'I2_RECEIVER_OR_TARGET_UNKNOWN',automaticRetry:false}));process.exitCode=2;});
