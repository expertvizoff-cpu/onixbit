// Runner-only stream into authenticated SSH stdin. Never run without an explicit pipe.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
process.stdout.on('error',()=>process.exit(1));
async function hash(file){const value=createHash('sha256');for await(const block of fs.createReadStream(file))value.update(block);return value.digest('hex');}
try{
 if(process.env.ONIXBIT_RELEASE_SEND!=='ssh-stdin'||process.stdout.isTTY||!process.env.GITHUB_ACTIONS)throw new Error();
 const directory=path.resolve(process.argv[2]),value=JSON.parse(await fsp.readFile(path.join(directory,'transport.json'),'utf8')),key=process.env.STAGING_RELEASE_KEY;
 if(!/^[a-f0-9]{64}$/.test(key)||value.purpose!=='onixbit-staging-release-v1'||value.origin!=='https://messenger-test.onixbit.ru')throw new Error();
 let bytes=0;
 for(const part of value.parts){if(!/^payload\.[0-9]{3}$/.test(part.path)||!Number.isSafeInteger(part.bytes)||part.bytes>32*1024*1024||await hash(path.join(directory,part.path))!==part.sha256)throw new Error();bytes+=part.bytes;}
 if(bytes!==value.cipherBytes)throw new Error();
 const header={purpose:value.purpose,origin:value.origin,releaseId:value.releaseId,key,cipherSHA256:value.cipherSHA256,plainSHA256:value.plainSHA256,cipherBytes:value.cipherBytes};
 const write=block=>new Promise((resolve,reject)=>process.stdout.write(block,error=>error?reject(error):resolve()));
 await write(JSON.stringify(header)+'\n');
 for(const part of value.parts)for await(const block of fs.createReadStream(path.join(directory,part.path)))await write(block);
}catch{console.error('STAGING_TRANSPORT_STREAM_STOPPED');process.exitCode=1;}
