// Operator-outbox diagnostic building block. No HTTP endpoint, mail send, or email-verification mutation.
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomBytes,hkdfSync,createCipheriv,createDecipheriv} from 'node:crypto';
const error=()=>new Error('OPERATOR_MAIL_ENVELOPE_INVALID');
function keyFor(key,purpose){if(!Buffer.isBuffer(key)||key.length!==32||!['query','response'].includes(purpose))throw error();return Buffer.from(hkdfSync('sha256',key,'onixbit-operator-mail-v1',purpose,32));}
export function seal(value,key,purpose,requestId){
 if(!/^[a-f0-9-]{36}$/.test(requestId))throw error();const clear=Buffer.from(JSON.stringify(value));if(clear.length>16384)throw error();const nonce=randomBytes(12),cipher=createCipheriv('aes-256-gcm',keyFor(key,purpose),nonce);cipher.setAAD(Buffer.from(purpose+':'+requestId));
 const data=Buffer.concat([cipher.update(clear),cipher.final()]);return {version:1,requestId,nonce:nonce.toString('base64'),tag:cipher.getAuthTag().toString('base64'),data:data.toString('base64')};
}
export function open(box,key,purpose,requestId){
 try{
  if(box?.version!==1||box.requestId!==requestId||typeof box.nonce!=='string'||box.nonce.length!==16||typeof box.tag!=='string'||box.tag.length!==24||typeof box.data!=='string'||box.data.length>24000)throw error();const nonce=Buffer.from(box.nonce,'base64'),tag=Buffer.from(box.tag,'base64');if(nonce.length!==12||tag.length!==16)throw error();
  const decipher=createDecipheriv('aes-256-gcm',keyFor(key,purpose),nonce);decipher.setAAD(Buffer.from(purpose+':'+requestId));decipher.setAuthTag(tag);return JSON.parse(Buffer.concat([decipher.update(Buffer.from(box.data,'base64')),decipher.final()]).toString('utf8'));
 }catch{throw error();}
}
export async function lookupVerification(directory,query){
 if(query?.purpose!=='operator-test-verification-v1'||!/^[-a-f0-9]{36}$/.test(query.requestId)||typeof query.email!=='string'||query.email.length>254||!/^([^\s@<>]+)@([^\s@<>]+)\.[^\s@<>]+$/.test(query.email))throw error();
 const origin=new URL(query.origin);if(origin.origin!==query.origin||origin.protocol!=='https:'||origin.username||origin.password)throw error();
 const meta=await fs.lstat(directory);if(!meta.isDirectory()||meta.isSymbolicLink()||await fs.realpath(directory)!==path.resolve(directory)||process.platform!=='win32'&&((meta.mode&0o077)!==0||meta.uid!==process.getuid()))throw error();
 const names=(await fs.readdir(directory)).filter(name=>/^[a-f0-9-]{36}\.json$/.test(name));if(names.length>2000)throw new Error('OPERATOR_MAIL_LOOKUP_BUDGET');let selected;
 for(const name of names){
  const file=path.join(directory,name),stat=await fs.lstat(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size>16384||process.platform!=='win32'&&((stat.mode&0o077)!==0||stat.uid!==process.getuid()))throw error();
  const value=JSON.parse(await fs.readFile(file,'utf8'));if(value.kind!=='verify-email'||typeof value.email!=='string'||value.email.toLowerCase()!==query.email.toLowerCase())continue;
  const created=Date.parse(value.createdAt),url=new URL(value.url);if(!Number.isFinite(created)||url.origin!==origin.origin||url.pathname!=='/api/auth/verify-email'||url.username||url.password||url.toString().length>8192)throw error();
  if(!selected||created>selected.created)selected={created,url:url.toString(),createdAt:value.createdAt};
 }
 return selected?{requestId:query.requestId,status:'found',url:selected.url,createdAt:selected.createdAt}:{requestId:query.requestId,status:'not-found'};
}
// Transport deliberately separate: deployer must approve a target-specific read-only scope.
// Query email must be encrypted in any public artifact. Server output is seal(response,...), never URL.
