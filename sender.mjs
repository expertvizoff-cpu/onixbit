// CI transport only. This process's stdout is the authenticated SSH stdin pipe.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const hash=data=>createHash('sha256').update(data).digest('hex');
process.stdout.on('error',()=>process.exit(2));
try{
 const keyHex=process.env.U1_INPUT_KEY??'';delete process.env.U1_INPUT_KEY;
 const receipt=JSON.parse(fs.readFileSync('payload/receipt.json'));
 const authorization=JSON.parse(fs.readFileSync('payload/owner-window.json'));
 const bytes=fs.readFileSync('payload/payload.enc');
 if(!/^[a-f0-9]{64}$/.test(keyHex)||hash(bytes)!==receipt.cipherSha256||bytes.length!==receipt.cipherBytes)throw Error();
 process.stdout.write(JSON.stringify({purpose:'u1-authenticated-input-v1',keyHex,receipt,authorization})+'\n');
 process.stdout.write(bytes);
}catch{process.stderr.write('U1_TRANSPORT_INPUT_STOP\n');process.exitCode=2;}
