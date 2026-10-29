// New-staging functional gate. Synthetic identity only; no company slots or provider calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {Pool} from 'pg';
import {readBootstrapSettings} from './bootstrap.mjs';

const safeReason=error=>{const code=error?.code??error?.cause?.code;return ['ECONNREFUSED','ENOTFOUND','ETIMEDOUT','EAI_AGAIN','UND_ERR_SOCKET','UND_ERR_CONNECT_TIMEOUT','EACCES','EROFS','28P01','42501','42P01','3D000','23505'].includes(code)?code:['Error','TypeError','AbortError','TimeoutError','SyntaxError','ZodError','BootstrapError'].includes(error?.name)?error.name:'Error';};
async function run(){
const input=await readBootstrapSettings(process.env.ONIXBIT_STAGING_BOOTSTRAP_FILE);
const settings=JSON.parse(await fs.readFile(path.join(input.privateDirectory,'api.json'),'utf8'));
const stateFile=input.purpose==='acceptance'?path.join(path.dirname(input.privateDirectory),'smoke-state.json'):'/run/bootstrap/smoke-state.json';
const api=input.purpose==='acceptance'?'http://127.0.0.1:47100':'http://onixbit-messenger-staging-api:47100';
const native=input.purpose==='acceptance'?'http://127.0.0.1:47101':'http://onixbit-messenger-staging-api:47101';
const auth=new Pool({...input.database,database:'om_auth',max:1,connectionTimeoutMillis:3000,statement_timeout:5000});
const control=new Pool({...input.database,database:'om_control',max:1,connectionTimeoutMillis:3000,statement_timeout:5000});
let state,ownedState=false,step='cluster-identity',lastHttpStatus,lastErrorCode;
function require(value){if(!value)throw new Error('SMOKE_CONTRACT_FAILED');}
async function readState(){
 const meta=await fs.lstat(stateFile);require(meta.isFile()&&!meta.isSymbolicLink()&&meta.size<16384&&(meta.mode&0o077)===0&&meta.uid===process.getuid());
 const value=JSON.parse(await fs.readFile(stateFile,'utf8'));
 require(value.purpose==='synthetic-staging-smoke'&&/^stage-smoke-[a-f0-9]{32}@example\.invalid$/.test(value.email));return value;
}
async function save(){await fs.writeFile(stateFile,JSON.stringify(state)+'\n',{mode:0o600});}
async function request(route,body,target=api){const response=await fetch(target+route,{method:body===undefined?'GET':'POST',redirect:'manual',signal:AbortSignal.timeout(10000),headers:{origin:input.appOrigin,'content-type':'application/json',...(state?.cookie?{cookie:state.cookie}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});lastHttpStatus=response.status;lastErrorCode=undefined;if(response.status>=400){try{const body=await response.clone().json(),code=body?.code??body?.error?.code;if(['INVALID_ORIGIN','ORIGIN_FORBIDDEN','INVALID_EMAIL','SIGNUP_DISABLED','EMAIL_NOT_VERIFIED','PASSWORD_TOO_SHORT','INTERNAL_SERVER_ERROR','RATE_LIMITED','SERVICE_UNAVAILABLE','FAILED_TO_CREATE_USER','FAILED_TO_CREATE_SESSION','FAILED_TO_GET_SESSION','AUTH_REQUIRED','INVALID_INPUT'].includes(code))lastErrorCode=code;}catch{}}return response;}
async function cleanup(){
 if(!state){try{state=await readState();ownedState=true;}catch(error){if(error.code==='ENOENT')return;throw error;}}
 require(ownedState);
 require(/^stage-smoke-[a-f0-9]{32}@example\.invalid$/.test(state.email));
 await auth.query('DELETE FROM public."user" WHERE email=$1',[state.email]);
 for(const name of await fs.readdir(settings.mailDirectory)){
  if(!/^[a-f0-9-]{36}\.json$/.test(name))continue;
  const file=path.join(settings.mailDirectory,name),meta=await fs.lstat(file);if(!meta.isFile()||meta.isSymbolicLink()||meta.size>65536)continue;
  const mail=JSON.parse(await fs.readFile(file,'utf8'));if(mail.email===state.email)await fs.unlink(file);
 }
 await fs.unlink(stateFile);
 ownedState=false;
}
try{
 const identity=(await auth.query("SELECT current_setting('cluster_name') AS cluster,current_setting('server_version_num')::int AS version")).rows[0];
 require(identity.cluster==='onixbit_messenger_staging'&&identity.version>=180000&&identity.version<190000&&settings.baseUrl===input.appOrigin);
 const phase=process.argv[2];
 if(phase==='--setup'){
  step='fresh-auth-users';require((await auth.query('SELECT count(*)::int AS count FROM public."user"')).rows[0].count===0);
  step='fresh-companies';require((await control.query('SELECT count(*)::int AS count FROM cabinet.companies')).rows[0].count===0);
  state={purpose:'synthetic-staging-smoke',email:'stage-smoke-'+randomBytes(16).toString('hex')+'@example.invalid',phase:'attempted'};
  step='claim-intent';await fs.writeFile(stateFile,JSON.stringify(state)+'\n',{mode:0o600,flag:'wx'});
  ownedState=true;
  const password='Smoke-Proof9-'+randomBytes(32).toString('hex');
  step='signup';const signup=await request('/api/auth/sign-up/email',{name:'Synthetic staging smoke',email:state.email,password});require(signup.status===200);
  step='verification-mail';let verification;
  for(const name of await fs.readdir(settings.mailDirectory)){
   if(!/^[a-f0-9-]{36}\.json$/.test(name))continue;
   const mail=JSON.parse(await fs.readFile(path.join(settings.mailDirectory,name),'utf8'));
   if(mail.email===state.email)verification=new URL(mail.url);
  }
  step='verification-origin';require(verification?.origin===input.appOrigin);
  step='verify-email';require([200,302].includes((await request(verification.pathname+verification.search)).status));
  step='signin';const signin=await request('/api/auth/sign-in/email',{email:state.email,password});require(signin.status===200);
  step='secure-cookie';const cookies=signin.headers.getSetCookie();require(cookies.some(cookie=>cookie.includes('Secure')));state.cookie=cookies.map(cookie=>cookie.split(';')[0]).join('; ');
  step='session';const response=await request('/api/auth/get-session');require(response.status===200);const session=await response.json();require(session.user.emailVerified);state.userId=session.user.id;
  state.phase='setup-complete';await save();console.log(JSON.stringify({passed:true,phase:'before-restart',operatorMailOnly:true,providerConnections:false}));
 }else if(phase==='--after-restart'){
  step='restore-intent';state=await readState();ownedState=true;require(state.phase==='setup-complete');
  step='workspace-after-restart';const response=await request('/api/workspace');require(response.status===200);const data=(await response.json()).data;require(data.user.id===state.userId&&data.companies.length===0);
  step='invalid-handoff';const invalid=await request('/api/bitrix24/embedded/handoff/view',{ticket:'a'.repeat(43)},native);require(invalid.status===404);
  step='native-flags';const flags=(await (await request('/api/bitrix24/health',undefined,native)).json()).data;require(!flags.nativeEnabled&&!flags.mutationsEnabled&&!flags.finishEnabled);
  step='foreign-origin';const foreign=await fetch(native+'/api/bitrix24/embedded/bootstrap',{method:'POST',signal:AbortSignal.timeout(10000),headers:{origin:'https://foreign.example','content-type':'application/json'},body:'{}'});require(foreign.status===403);
  step='cleanup';await cleanup();require((await auth.query('SELECT count(*)::int AS count FROM public."user"')).rows[0].count===0);require((await control.query('SELECT count(*)::int AS count FROM cabinet.tenant_catalog WHERE claimed')).rows[0].count===0);
  console.log(JSON.stringify({passed:true,phase:'after-restart',sameVerifiedSession:true,syntheticIdentityRemoved:true,tenantSlotsUntouched:true,providerConnections:false}));
 }else if(phase==='--cleanup'){await cleanup();console.log(JSON.stringify({syntheticCleanup:true}));}
 else throw new Error('SMOKE_MODE_REQUIRED');
}catch(error){
 const failure={code:'STAGING_SMOKE_FAILED',step,reason:safeReason(error),...(lastHttpStatus===undefined?{}:{lastHttpStatus}),...(lastErrorCode?{httpCode:lastErrorCode}:{})};
 try{if(state&&ownedState)await cleanup();}catch{}
 console.error(JSON.stringify(failure));process.exitCode=1;
}finally{await Promise.all([auth.end(),control.end()]);}
}
run().catch(error=>{console.error(JSON.stringify({code:'STAGING_SMOKE_CONFIGURATION_FAILED',reason:safeReason(error)}));process.exitCode=1;});
