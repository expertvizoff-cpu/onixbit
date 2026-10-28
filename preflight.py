#!/usr/bin/env python3
"""Read-only VPS inventory; authoring this source never executes the inspection.
Run via stdin after exact approval. No SQL, uploads, config dump or service changes.
"""
import json,os,platform,pwd,re,signal,stat,subprocess,sys,time
from pathlib import Path

APP=Path('/home/deploy/apps/onixbit-messenger-staging')
SITE=Path('/opt/onixbit-site')
CADDY='onixbit-site-caddy-1'
PORTS={47100,47101,54392}
FORMAT=('{{json .Id}}\n{{json .Image}}\n{{json .State.Running}}\n{{json .State.StartedAt}}\n'
        '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}\n'
        '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{json .Source}}{{end}}{{end}}')

class Stop(Exception):pass

def command(args):
 result=subprocess.run(args,capture_output=True,timeout=3,check=False)
 if result.returncode or len(result.stdout)>16384:raise Stop('COMMAND_UNAVAILABLE')
 return result.stdout.decode('utf-8').strip()

def listeners(text):
 found=set()
 for line in text.splitlines()[1:]:
  parts=line.split()
  if len(parts)>=4 and parts[3]=='0A':found.add(int(parts[1].rsplit(':',1)[1],16))
 return sorted(PORTS.intersection(found))

def available_memory(text):
 for line in text.splitlines():
  if line.startswith('MemAvailable:'):return int(line.split()[1])*1024
 raise Stop('MEMORY_METRIC_UNAVAILABLE')

def candidate_available(path):
 return not os.path.lexists(path) and all(not parent.is_symlink() for parent in path.parents)

def caddy_metadata(output):
 lines=output.splitlines()
 if len(lines)!=6:raise Stop('CADDY_PROJECTION_INVALID')
 identity,image,running,started=map(json.loads,lines[:4]);networks=lines[4].split();source=Path(json.loads(lines[5]))
 if (not re.fullmatch(r'[a-f0-9]{64}',identity) or not re.fullmatch(r'sha256:[a-f0-9]{64}',image)
  or running is not True or not isinstance(started,str) or not networks
  or any(not re.fullmatch(r'[a-zA-Z0-9_.-]{1,128}',n) for n in networks)
  or not source.is_relative_to(SITE) or '..' in source.parts or source.name!='Caddyfile'):
  raise Stop('CADDY_SCOPE_OR_STATE_INVALID')
 return dict(id=identity,image=image,running=running,startedAt=started,networkNames=sorted(networks),configPath=str(source))

def config_metadata(source,root):
 canonical_root=root.resolve(strict=True);resolved=source.resolve(strict=True)
 if not resolved.is_relative_to(canonical_root):raise Stop('CADDY_FILE_OUTSIDE_SITE')
 meta=resolved.lstat()
 if not stat.S_ISREG(meta.st_mode):raise Stop('CADDY_FILE_NOT_REGULAR')
 if meta.st_size>1048576:raise Stop('CADDY_FILE_OVERSIZED')
 if source.resolve(strict=True)!=resolved or root.resolve(strict=True)!=canonical_root:raise Stop('CADDY_PATH_CHANGED')
 return dict(resolvedPath=str(resolved),siteResolvedPath=str(canonical_root),device=meta.st_dev,inode=meta.st_ino,mtimeNs=meta.st_mtime_ns,bytes=meta.st_size,mode=oct(stat.S_IMODE(meta.st_mode)))

def caddy_snapshot():
 data=caddy_metadata(command(['/usr/bin/docker','inspect','--format',FORMAT,CADDY]))
 data['config']=config_metadata(Path(data['configPath']),SITE)
 return data

def version(binary,expression):
 if not Path(binary).is_file():return None
 try:
  match=re.fullmatch(expression,command([binary,'--version']))
  return match.group(1) if match else None
 except Stop as error:
  if str(error)=='INSPECTION_DEADLINE':raise
  return None
 except subprocess.TimeoutExpired:return None

def inspect(report=None):
 report={} if report is None else report
 if pwd.getpwuid(os.geteuid()).pw_name!='deploy':raise Stop('EXPECTED_DEPLOY_ACCOUNT')
 release={}
 for line in Path('/etc/os-release').read_text().splitlines():
  key,separator,value=line.partition('=')
  if separator and key in {'ID','VERSION_ID','VERSION_CODENAME'}:
   value=value.strip('"')
   if not re.fullmatch(r'[a-zA-Z0-9._-]{1,64}',value):raise Stop('OS_METADATA_INVALID')
   release[key]=value
 memory=available_memory(Path('/proc/meminfo').read_text());report.update(os=release,architecture=platform.machine(),libc=platform.libc_ver(),memoryAvailableBytes=memory)
 parent_present=APP.parent.is_dir();disk_parent=APP.parent
 while not disk_parent.is_dir() and disk_parent!=Path('/home/deploy'):disk_parent=disk_parent.parent
 if not disk_parent.is_dir():raise Stop('APP_DISK_PARENT_ABSENT')
 disk=os.statvfs(disk_parent);free=disk.f_bavail*disk.f_frsize;occupied=set()
 for file in ['/proc/net/tcp','/proc/net/tcp6']:occupied.update(listeners(Path(file).read_text()))
 report.update(diskFreeBytes=free,parentPresent=parent_present,
  target=str(APP),targetAvailable=candidate_available(APP),occupiedCandidatePorts=sorted(occupied),
  hostNodeVersion=version('/usr/bin/node',r'v(\d+\.\d+\.\d+)'),
  hostPostgresToolchainVersion=version('/usr/bin/pg_config',r'PostgreSQL (\d+(?:\.\d+)+)(?: .*)?'))
 before=caddy_snapshot();report['caddy']=before
 if before!=caddy_snapshot():raise Stop('CADDY_BASELINE_DRIFT')
 reasons=[]
 if not parent_present:reasons.append('APP_PARENT_ABSENT')
 if not report['targetAvailable']:reasons.append('TARGET_OCCUPIED_OR_SYMLINK')
 if occupied:reasons.append('CANDIDATE_PORT_OCCUPIED')
 if memory<768*1024*1024:reasons.append('MEMORY_BELOW_PREPARATION_BUDGET')
 if free<2*1024*1024*1024:reasons.append('DISK_BELOW_PREPARATION_BUDGET')
 report.update(status='STOP' if reasons else 'INVENTORIED',reasons=reasons,deploymentAuthorized=False,deploymentReady=False)
 return report

def main():
 if sys.argv[1:]!=['--inspect-onixbit-messenger-staging']:
  print(json.dumps(dict(status='STOP',code='EXACT_INSPECTION_FLAG_REQUIRED')));return 2
 def expired(_signal,_frame):raise Stop('INSPECTION_DEADLINE')
 signal.signal(signal.SIGALRM,expired);signal.alarm(12);started=time.monotonic()
 report=dict(deploymentAuthorized=False,deploymentReady=False)
 try:report=inspect(report)
 except Stop as error:report.update(status='STOP',code=str(error))
 except Exception:report.update(status='STOP',code='INSPECTION_UNAVAILABLE')
 finally:signal.alarm(0)
 report.update(readOnly=True,elapsedSeconds=round(time.monotonic()-started,3));print(json.dumps(report,separators=(',',':')))
 return 0 if report['status']=='INVENTORIED' else 2

if __name__=='__main__':sys.exit(main())
