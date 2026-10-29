// Node18-compatible private transport. CLI is fixed to one NEW staging root.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import dns from 'node:dns/promises';
import {createCipheriv,createDecipheriv,randomBytes,createHash} from 'node:crypto';
import {Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {spawnSync,spawn} from 'node:child_process';

const ROOT='/home/deploy/apps/onixbit-messenger-staging';
const ORIGIN='https://messenger-test.onixbit.ru';
const MAGIC=Buffer.from('ONIXBIT-STAGE-v1\n');
const aad=id=>Buffer.from('onixbit-staging-release-v1:'+id);
const hex=/^[a-f0-9]{64}$/;
export async function fileHash(file){const hash=createHash('sha256');for await(const block of fs.createReadStream(file))hash.update(block);return hash.digest('hex');}
export async function encryptRelease(source,target,key,id){
 if(key.length!==32||!/^stage-[a-f0-9]{16}$/.test(id))throw new Error('RELEASE_IDENTITY_INVALID');
 const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(aad(id));
 const handle=await fsp.open(target,'wx',0o600);await handle.write(Buffer.concat([MAGIC,iv]));await handle.close();
 await pipeline(fs.createReadStream(source),cipher,fs.createWriteStream(target,{flags:'a'}));await fsp.appendFile(target,cipher.getAuthTag());
 return {plainSHA256:await fileHash(source),cipherSHA256:await fileHash(target),cipherBytes:(await fsp.stat(target)).size};
}
export async function decryptRelease(source,target,key,id,expectedPlain){
 const meta=await fsp.stat(source);if(meta.size<MAGIC.length+28)throw new Error('RELEASE_TRUNCATED');
 const input=await fsp.open(source,'r'),header=Buffer.alloc(MAGIC.length+12),tag=Buffer.alloc(16);
 try{await input.read(header,0,header.length,0);await input.read(tag,0,16,meta.size-16);}finally{await input.close();}
 if(!header.subarray(0,MAGIC.length).equals(MAGIC))throw new Error('RELEASE_FORMAT_INVALID');
 const decipher=createDecipheriv('aes-256-gcm',key,header.subarray(MAGIC.length));decipher.setAAD(aad(id));decipher.setAuthTag(tag);
 const hash=createHash('sha256'),meter=new Transform({transform(block,_encoding,callback){hash.update(block);callback(null,block);}});
 const destination=await fsp.open(target,'wx',0o600);
 try{
  await pipeline(fs.createReadStream(source,{start:header.length,end:meta.size-17}),decipher,meter,destination.createWriteStream());
  if(hash.digest('hex')!==expectedPlain)throw new Error('RELEASE_PLAINTEXT_MISMATCH');
 }catch(error){await fsp.unlink(target).catch(()=>{});throw error;}
 finally{await destination.close().catch(()=>{});}
}
export function validateEnvelope(value){
 if(value?.purpose!=='onixbit-staging-release-v1'||value.origin!==ORIGIN||!/^stage-[a-f0-9]{16}$/.test(value.releaseId)||!hex.test(value.key)||!hex.test(value.cipherSHA256)||!hex.test(value.plainSHA256)||!Number.isSafeInteger(value.cipherBytes)||value.cipherBytes<44||value.cipherBytes>512*1024*1024)throw new Error('RELEASE_ENVELOPE_INVALID');
 return value;
}
async function preflight(){
 if(process.platform!=='linux'||process.arch!=='x64'||os.userInfo().username!=='deploy'||process.getuid()===0)throw new Error('EXPECTED_DEPLOY_HOST');
 const memory=Number((await fsp.readFile('/proc/meminfo','utf8')).match(/^MemAvailable:\s+(\d+) kB/m)?.[1])*1024;
 if(!Number.isFinite(memory)||memory<1536*1024*1024)throw new Error('STAGING_MEMORY_BUDGET');
 const parent=path.dirname(ROOT);for(let current=parent;;current=path.dirname(current)){if((await fsp.lstat(current)).isSymbolicLink())throw new Error('STAGING_PARENT_SYMLINK');if(current==='/')break;}
 const disk=await fsp.statfs(parent);if(disk.bavail*disk.bsize<3*1024*1024*1024)throw new Error('STAGING_DISK_BUDGET');
 await dns.lookup(new URL(ORIGIN).hostname);
 for(const args of [['compose','version'],['inspect','--format','{{.State.Running}}','onixbit-site-caddy-1']]){
  const env={...process.env};delete env.DOCKER_HOST;delete env.DOCKER_CONTEXT;
  const result=spawnSync('/usr/bin/docker',['--host','unix:///var/run/docker.sock',...args],{env,encoding:'utf8',timeout:10000});if(result.status!==0||args[0]==='inspect'&&result.stdout.trim()!=='true')throw new Error('DOCKER_PREREQUISITE');
 }
}
export async function receiveRelease(stream,{root=ROOT,run=true,admit=preflight}={}){
 let prefix=Buffer.alloc(0),envelope,output,count=0,key;
 try{
  for await(let block of stream){
   if(!envelope){
    const newline=block.indexOf(10);
    if(newline<0){prefix=Buffer.concat([prefix,block]);if(prefix.length>65536)throw new Error('RELEASE_ENVELOPE_BUDGET');continue;}
    prefix=Buffer.concat([prefix,block.subarray(0,newline)]);if(prefix.length>65536)throw new Error('RELEASE_ENVELOPE_BUDGET');
    envelope=validateEnvelope(JSON.parse(prefix.toString('utf8')));key=Buffer.from(envelope.key,'hex');delete envelope.key;prefix.fill(0);
    await admit();try{await fsp.lstat(root);throw new Error('STAGING_ROOT_OCCUPIED');}catch(error){if(error.code!=='ENOENT')throw error;}
    await fsp.mkdir(root,{mode:0o700});await fsp.mkdir(path.join(root,'operation'),{mode:0o700});
    await fsp.writeFile(path.join(root,'operation/intent.json'),JSON.stringify({...envelope,phase:'receiving'})+'\n',{flag:'wx',mode:0o600});
    output=await fsp.open(path.join(root,'operation/payload.enc'),'wx',0o600);block=block.subarray(newline+1);
   }
   count+=block.length;if(count>envelope.cipherBytes)throw new Error('RELEASE_PAYLOAD_BUDGET');await output.write(block);
  }
  if(!envelope||count!==envelope.cipherBytes)throw new Error('RELEASE_PAYLOAD_INCOMPLETE');await output.close();output=null;
  const encrypted=path.join(root,'operation/payload.enc'),plain=path.join(root,'operation/package.tar.gz');
  if(await fileHash(encrypted)!==envelope.cipherSHA256)throw new Error('RELEASE_CIPHERTEXT_MISMATCH');
  await decryptRelease(encrypted,plain,key,envelope.releaseId,envelope.plainSHA256);key.fill(0);
  // Authenticated package is still checked for traversal, links, devices and size.
  const extract=`import sys,tarfile,pathlib\nroot=pathlib.Path(sys.argv[2]).resolve()\nwith tarfile.open(sys.argv[1]) as archive:\n members=archive.getmembers()\n assert len(members)<20000 and sum(m.size for m in members)<1024*1024*1024\n for member in members:\n  p=pathlib.PurePosixPath(member.name)\n  assert not p.is_absolute() and '..' not in p.parts and (member.isfile() or member.isdir())\n  name=str(p)\n  assert name=='.' or p.parts[0] in ['runtime','images','operation'] or name in ['release.json','compose.json']\n  if p.parts and p.parts[0]=='operation': assert name in ['operation','operation/run-deploy.sh','operation/create-config.mjs','operation/verify-images.mjs','operation/caddy-edge.py']\n  if p.parts and p.parts[0]=='images': assert name in ['images','images/node.tar','images/postgres.tar']\n archive.extractall(root,filter='data')\n`;
  const extracted=spawnSync('python3',['-c',extract,plain,root],{encoding:'utf8',timeout:90000});if(extracted.status!==0)throw new Error('RELEASE_EXTRACTION_REFUSED');await fsp.chmod(root,0o700);await fsp.chmod(path.join(root,'operation'),0o700);
  await fsp.writeFile(path.join(root,'operation/received.json'),JSON.stringify({...envelope,phase:'authenticated-and-extracted'})+'\n',{flag:'wx',mode:0o600});
  if(run){
   const code=await new Promise((resolve,reject)=>{const child=spawn('/bin/bash',[path.join(root,'operation/run-deploy.sh')],{cwd:root,stdio:['ignore','inherit','inherit']});child.once('error',reject);child.once('exit',resolve);});
   if(code!==0)throw new Error('STAGING_ACTIVATION_STOPPED');
  }
  return {received:true,releaseId:envelope.releaseId,sourceAuthenticated:true};
 }finally{if(output)await output.close().catch(()=>{});if(key)key.fill(0);}
}
if(process.argv.includes('--receive-staging')){
 receiveRelease(process.stdin).then(value=>console.log(JSON.stringify(value))).catch(()=>{console.error(JSON.stringify({code:'STAGING_RELEASE_STOPPED'}));process.exitCode=1;});
}
