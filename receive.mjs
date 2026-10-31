// Authenticated private artifact receiver. No app source or credentials in this file.
import fs from 'node:fs';
import crypto from 'node:crypto';
import child from 'node:child_process';
const canonical=value=>JSON.stringify(value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(k=>[k,JSON.parse(canonical(value[k]))])):value);
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
try {
 const raw=fs.readFileSync(0);if(raw.length>20*1024*1024)throw Error('INPUT_BUDGET');
 const input=JSON.parse(raw),sealed=input.sealed;
 if(!/^[a-f0-9]{64}$/.test(input.key)||sealed.format!=='ai-mop-private-stage-v1'||!/^[a-f0-9]{24}$/.test(sealed.nonce)||!/^[a-f0-9]{32}$/.test(sealed.tag))throw Error('ENVELOPE_FORMAT');
 const key=Buffer.from(input.key,'hex');const decipher=crypto.createDecipheriv('aes-256-gcm',key,Buffer.from(sealed.nonce,'hex'));
 decipher.setAAD(Buffer.from('ai-mop-private-stage-v1'));decipher.setAuthTag(Buffer.from(sealed.tag,'hex'));
 const plain=Buffer.concat([decipher.update(Buffer.from(sealed.ciphertext,'base64')),decipher.final()]);key.fill(0);input.key='';
 if(plain.length>16*1024*1024)throw Error('PLAINTEXT_BUDGET');
 const payload=JSON.parse(plain);const plan=payload.bundle.plan;const planSha=sha(canonical(plan));
 if(sha(payload.activator)!==plan.activator_sha256)throw Error('ACTIVATOR_DIGEST');
 if(process.argv.includes('--verify-only')){console.log(JSON.stringify({verified:true,plan_sha256:planSha,activation_performed:false}));}
 else {
  if(!process.argv.includes('--activate')||input.grant?.approved!==true||input.grant.plan_sha256!==planSha)throw Error('OWNER_APPROVAL_REQUIRED');
  const result=child.spawnSync('python3',['-B','-c',payload.activator],{input:JSON.stringify({bundle:payload.bundle,grant:input.grant}),timeout:600000,maxBuffer:1024*1024,encoding:'utf8'});
  if(result.stdout)process.stdout.write(result.stdout);
  if(result.status!==0||result.error)throw Error('ACTIVATION_STOPPED_INSPECT_RESULT');
 }
} catch(error) {
 const reason=/^[A-Z][A-Z_]{0,80}$/.test(error.message)?error.message:'ENVELOPE_OR_RUNTIME_FAILURE';
 console.error(JSON.stringify({status:'STOP',reason,retry_allowed:false}));process.exitCode=1;
}
