"""Read-only inventory source. Run on the staging host only after exact approval.

No SQL, HTTP, Node execution, container exec, configuration or service changes.
Never emits config values, tenant identifiers, mount paths or process environment.
"""
import hashlib
import json
import os
from pathlib import Path
import pwd
import re
import signal
import stat
import subprocess
import sys
import time

APP = Path('/home/deploy/apps/onixbit-messenger-staging')
ORIGIN = 'https://messenger-test.onixbit.ru'
BOXED_ORIGIN = 'https://onixbit.su'
CONTAINERS = ('onixbit-messenger-staging-api', 'onixbit-messenger-staging-db',
              'onixbit-site-caddy-1')
CODE = ('main.js', 'server.js', 'bitrix-embedded/runtime.js',
        'bitrix-embedded/native-session-wire.js', 'bitrix-embedded/composer-runtime.js',
        'bitrix-embedded/reply-inbox-runtime.js', 'delivery/route-publication-runtime.js')
PACKAGES = ('fastify', 'better-auth', 'pg', 'zod')
FLAGS = ('nativeEnabled', 'mutationsEnabled', 'finishEnabled')


class Stop(Exception):
    pass


def owned_file(root, relative, limit):
    """Resolve only fixed relative names beneath an owned directory; no links."""
    if root.resolve() != root or not root.is_dir():
        raise Stop('PATH_BOUNDARY')
    path = root / relative
    if not path.is_relative_to(root) or '..' in Path(relative).parts:
        raise Stop('PATH_BOUNDARY')
    for item in [*path.relative_to(root).parents][::-1]:
        if (root / item).is_symlink():
            raise Stop('PATH_BOUNDARY')
    meta = path.lstat()
    if not stat.S_ISREG(meta.st_mode) or meta.st_uid != os.geteuid() or meta.st_size > limit:
        raise Stop('FILE_BOUNDARY')
    with os.fdopen(os.open(path, os.O_RDONLY | os.O_NOFOLLOW), 'rb') as stream:
        opened = os.fstat(stream.fileno())
        fields = ('st_dev', 'st_ino', 'st_size', 'st_mode', 'st_uid')
        if any(getattr(opened, key) != getattr(meta, key) for key in fields):
            raise Stop('FILE_CHANGED')
        data = stream.read(limit + 1)
    if len(data) != meta.st_size:
        raise Stop('FILE_CHANGED')
    return data, meta


def file_metadata(root, relative, limit=2 * 1024 * 1024, private=False):
    try:
        data, meta = owned_file(root, relative, limit)
    except FileNotFoundError:
        return {'present': False}
    if private and meta.st_mode & 0o077:
        raise Stop('PRIVATE_FILE_MODE')
    return {'present': True, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}


def private_json(root, relative):
    data, meta = owned_file(root, relative, 262144)
    if meta.st_mode & 0o077:
        raise Stop('PRIVATE_FILE_MODE')
    value = json.loads(data)
    if not isinstance(value, dict):
        raise Stop('CONFIG_SHAPE')
    return value


def inspect_container(name):
    if name not in CONTAINERS:
        raise Stop('CONTAINER_BOUNDARY')
    fmt = '{{json .Id}}\n{{json .Image}}\n{{json .State.Running}}\n{{json .Mounts}}'
    result = subprocess.run(
        ['/usr/bin/docker', '--host', 'unix:///var/run/docker.sock',
         'inspect', '--format', fmt, name],
        env={'PATH': '/usr/bin:/bin', 'LANG': 'C'}, stdin=subprocess.DEVNULL,
        capture_output=True, timeout=5, check=False)
    if result.returncode != 0 or len(result.stdout) > 32768:
        raise Stop('CONTAINER_INSPECTION')
    lines = result.stdout.splitlines()
    if len(lines) != 4:
        raise Stop('CONTAINER_INSPECTION')
    identity, image, running, mounts = map(json.loads, lines)
    if not isinstance(identity, str) or not re.fullmatch(r'[a-f0-9]{64}', identity):
        raise Stop('CONTAINER_INSPECTION')
    if not isinstance(image, str) or not re.fullmatch(r'sha256:[a-f0-9]{64}', image):
        raise Stop('CONTAINER_INSPECTION')
    if running is not True:
        raise Stop('CONTAINER_NOT_RUNNING')
    return {'id': identity, 'image': image, 'running': running}, mounts


def mount_root(mounts, destination):
    matches = [v for v in mounts if v.get('Destination') == destination]
    if len(matches) != 1 or matches[0].get('Type') != 'bind':
        raise Stop('MOUNT_BOUNDARY')
    root = Path(matches[0]['Source'])
    if not root.is_relative_to(APP) or root == APP or root.resolve() != root:
        raise Stop('MOUNT_BOUNDARY')
    meta = root.stat()
    if not stat.S_ISDIR(meta.st_mode) or meta.st_uid != os.geteuid():
        raise Stop('MOUNT_BOUNDARY')
    return root


def configuration_summary(api, native, registry):
    """Only explicit booleans/counts; never return a copied input object."""
    if api.get('baseUrl') != ORIGIN or native.get('appOrigin') != ORIGIN:
        raise Stop('ORIGIN_BOUNDARY')
    if any(type(native.get(k)) is not bool for k in FLAGS):
        raise Stop('CONFIG_SHAPE')
    if len(registry) > 20 or any(not isinstance(v, dict) for v in registry.values()):
        raise Stop('REGISTRY_SHAPE')
    route = native.get('routeCatalog')
    composer = native.get('composer')
    max_auth = api.get('maxAuth')
    for value in (route, composer, max_auth):
        if value is not None and not isinstance(value, dict):
            raise Stop('CONFIG_SHAPE')
    fields = ('databaseUrl', 'composerLabelDatabaseUrl', 'composerOutboxDatabaseUrl',
              'replyInboxDatabaseUrl', 'nativeEchoDatabaseUrl', 'replyProcessorDatabaseUrl')
    return {
        'nativeFlags': {k: native[k] for k in FLAGS},
        'clientIdConfigured': bool(native.get('clientId')),
        'clientSecretConfigured': bool(native.get('clientSecret')),
        'boxedOwnOriginAllowed': BOXED_ORIGIN in native.get('boxedOrigins', []),
        'routePublicationConfigured': bool(api.get('routePublicationFile')),
        'routeCatalogEnabled': (route or {}).get('enabled') is True,
        'composerEnabled': (composer or {}).get('enabled') is True,
        'firstChatEnabled': (composer or {}).get('firstChatEnabled') is True,
        'replyInboxConfigured': bool(native.get('replyInboxFile')),
        'maxAuthEnabled': bool(max_auth) and max_auth.get('enabled') is True,
        'tenantSlots': len(registry),
        'tenantFieldsConfigured': {key: sum(bool(v.get(key)) for v in registry.values())
                                   for key in fields},
    }


def inventory():
    if os.geteuid() == 0 or pwd.getpwuid(os.geteuid()).pw_name != 'deploy':
        raise Stop('DEPLOY_ACCOUNT_REQUIRED')
    if APP.resolve() != APP or not APP.is_dir():
        raise Stop('APP_BOUNDARY')
    before = {name: inspect_container(name) for name in CONTAINERS}
    runtime = mount_root(before[CONTAINERS[0]][1], '/app')
    private = mount_root(before[CONTAINERS[0]][1], '/run/onixbit')
    config_hashes = {name: file_metadata(private, name, 262144, private=True)
                     for name in ('api.json', 'bitrix.json', 'bitrix-tenants.json')}
    api = private_json(private, 'api.json')
    native = private_json(private, 'bitrix.json')
    registry_path = native.get('tenantRegistryFile')
    if registry_path != '/run/onixbit/bitrix-tenants.json':
        raise Stop('REGISTRY_PATH_BOUNDARY')
    summary = configuration_summary(api, native, private_json(private, 'bitrix-tenants.json'))
    files = {name: file_metadata(runtime, 'apps/api/dist/' + name) for name in CODE}
    packages = {}
    for name in PACKAGES:
        data, _ = owned_file(runtime, 'node_modules/' + name + '/package.json', 65536)
        value = json.loads(data).get('version')
        if not isinstance(value, str) or not re.fullmatch(r'\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?', value):
            raise Stop('PACKAGE_VERSION')
        packages[name] = value
    frontend = file_metadata(runtime, 'apps/cabinet/dist/index.html')
    bootstrap = file_metadata(runtime, 'ops/staging/bootstrap.mjs')
    after = {name: inspect_container(name) for name in CONTAINERS}
    if before != after:
        raise Stop('CONTAINER_DRIFT')
    if config_hashes != {name: file_metadata(private, name, 262144, private=True)
                         for name in config_hashes}:
        raise Stop('CONFIG_DRIFT')
    return {'containers': {k: v[0] for k, v in before.items()},
            'configuration': summary, 'configFiles': config_hashes,
            'compiledFiles': files, 'packageVersions': packages,
            'frontendIndex': frontend, 'bootstrapSource': bootstrap,
            'databaseStateInspected': False, 'dependencyTreeVerified': False,
            'deploymentAuthorized': False}


def main():
    if sys.argv[1:] != ['--inspect-current-messenger']:
        return 2
    started = time.monotonic()
    def expired(_signal, _frame):
        raise Stop('INVENTORY_DEADLINE')
    signal.signal(signal.SIGALRM, expired)
    signal.alarm(40)
    try:
        report = {'status': 'INVENTORIED', **inventory()}
        code = 0
    except Stop as error:
        report, code = {'status': 'STOP', 'code': str(error)}, 2
    except Exception:
        report, code = {'status': 'STOP', 'code': 'INVENTORY_UNAVAILABLE'}, 2
    finally:
        signal.alarm(0)
    report.update(purpose='current-messenger-runtime-inventory-v1', readOnly=True,
                  elapsedSeconds=round(time.monotonic() - started, 3), retryAllowed=False)
    print(json.dumps(report, separators=(',', ':')))
    return code



# RM1 extension: actual Node/PG catalog on four own DBs, no record exports.
NODE_SOURCE = '// Fixed metadata reader. No startup migrations, SDK, app imports or user records.\nimport fs from \'node:fs\';\nimport {createHash} from \'node:crypto\';\nimport {createRequire} from \'node:module\';\n\nconst hash = value => createHash(\'sha256\').update(value).digest(\'hex\');\nconst PRIVATE = \'/run/onixbit/\';\nconst input = JSON.parse(fs.readFileSync(0, \'utf8\'));\nconst started = Date.now();\nlet stage = \'config\';\nconst deadline = setTimeout(() => process.exit(124), 18000);\nconst fingerprints = {};\nfunction privateJson(name) {\n  const file = PRIVATE + name, stat = fs.lstatSync(file);\n  if (!stat.isFile() || stat.isSymbolicLink() || fs.realpathSync(file) !== file ||\n      stat.uid !== process.getuid() || (stat.mode & 0o077) || stat.size > 262144) throw Error();\n  const data = fs.readFileSync(file);\n  if (data.length !== stat.size) throw Error();\n  fingerprints[name] = hash(data);\n  return JSON.parse(data);\n}\nfunction endpoint(raw) {\n  const url = new URL(raw);\n  if (![\'postgres:\', \'postgresql:\'].includes(url.protocol) || url.hostname !== \'postgres\' ||\n      (url.port || \'5432\') !== \'5432\' || !url.username || !url.password || url.hash || url.search ||\n      !/^\\/om_[a-z0-9_]+$/.test(url.pathname)) throw Error();\n  return {url: raw, database: decodeURIComponent(url.pathname.slice(1)), role: decodeURIComponent(url.username)};\n}\nasync function main() {\n  if (!process.getuid() || input.purpose !== \'rm1-fixed-catalog-input-v1\' ||\n      !Array.isArray(input.relations) || !Array.isArray(input.functions) ||\n      input.relations.length > 100 || input.functions.length > 100 ||\n      [...input.relations, ...input.functions].some(v => !/^(app|cabinet|public)\\.[A-Za-z_][A-Za-z0-9_]*$/.test(v))) throw Error();\n  const api = privateJson(\'api.json\'), native = privateJson(\'bitrix.json\');\n  if (api.baseUrl !== \'https://messenger-test.onixbit.ru\' || native.appOrigin !== api.baseUrl ||\n      api.registryFile !== PRIVATE + \'tenant-access.json\') throw Error();\n  const registry = privateJson(\'tenant-access.json\'), entries = Object.entries(registry).sort();\n  if (entries.length !== 2) throw Error();\n  const control = endpoint(api.controlDatabaseUrl), auth = endpoint(api.authDatabaseUrl);\n  if (control.database !== \'om_control\' || auth.database !== \'om_auth\' ||\n      control.role !== \'om_control_runtime\' || auth.role !== \'om_auth_runtime\') throw Error();\n  const nativeControl = endpoint(native.controlConnectorDatabaseUrl), nativeAuth = endpoint(native.authReaderDatabaseUrl);\n  if (nativeControl.database !== control.database || nativeAuth.database !== auth.database ||\n      nativeControl.role === control.role || nativeAuth.role === auth.role) throw Error();\n  const vault = privateJson(\'bitrix-tenants.json\');\n  if (JSON.stringify(Object.keys(vault).sort()) !== JSON.stringify(entries.map(v=>v[0]))) throw Error();\n  const targets = [{alias: \'control\', ...control, readers:[{alias:\'native-connector\',role:nativeControl.role}]},\n    {alias: \'auth\', ...auth, readers:[{alias:\'native-auth-reader\',role:nativeAuth.role}]}];\n  for (const [id, value] of entries) {\n    if (!/^[a-f0-9-]{36}$/.test(id) || !Number.isSafeInteger(value.generation) || value.generation < 1 ||\n        !/^om_tenant_[a-z0-9_]+$/.test(value.database) || !/^om_tenant_[a-z0-9_]+$/.test(value.role) ||\n        typeof value.password !== \'string\') throw Error();\n    const url = new URL(api.controlDatabaseUrl);\n    url.pathname = \'/\' + value.database; url.username = value.role; url.password = value.password;\n    const nativeTenant = endpoint(vault[id].databaseUrl);\n    if (nativeTenant.database !== value.database || nativeTenant.role === value.role || vault[id].generation !== value.generation) throw Error();\n    targets.push({alias: \'tenant-\' + (targets.length - 1), ...endpoint(url.href), id,\n      generation: value.generation, readers:[{alias:\'native-vault\',role:nativeTenant.role}]});\n  }\n  if (new Set(targets.map(v => v.database)).size !== 4 || new Set(targets.map(v => v.role)).size !== 4) throw Error();\n  const {Client} = createRequire(\'/app/apps/api/package.json\')(\'pg\');\n  const report = [];\n  for (const target of targets) {\n    stage = target.alias;\n    const client = new Client({connectionString: target.url, connectionTimeoutMillis: 2000,\n      query_timeout: 2500, statement_timeout: 2000, application_name: \'onixbit-rm1-metadata\'});\n    client.on(\'error\', () => {});\n    try {\n      await client.connect();\n      await client.query(\'BEGIN ISOLATION LEVEL REPEATABLE READ, READ ONLY\');\n      await client.query("SET LOCAL statement_timeout=\'2s\'; SET LOCAL lock_timeout=\'250ms\'; SET LOCAL idle_in_transaction_session_timeout=\'5s\'; SET LOCAL search_path=pg_catalog");\n      const identity = (await client.query(`SELECT current_database() AS db, current_user AS actor,\n        session_user AS session_actor, current_setting(\'cluster_name\') AS cluster,\n        current_setting(\'server_version_num\')::int AS version,\n        current_setting(\'transaction_read_only\') AS read_only`)).rows[0];\n      if (identity.db !== target.database || identity.actor !== target.role || identity.session_actor !== target.role ||\n          identity.cluster !== \'onixbit_messenger_staging\' || identity.read_only !== \'on\') throw Error();\n      const role = (await client.query(`SELECT rolsuper,rolcreatedb,rolcreaterole,rolinherit,rolreplication,rolbypassrls,\n        (SELECT count(*)::int FROM pg_catalog.pg_auth_members WHERE member=r.oid) AS memberships\n        FROM pg_catalog.pg_roles r WHERE rolname=current_user`)).rows[0];\n      if (!role || role.rolsuper || role.rolcreatedb || role.rolcreaterole || role.rolreplication || role.rolbypassrls) throw Error();\n      const relations = (await client.query(`SELECT c.oid,(n.nspname||\'.\'||c.relname) AS name,c.relkind,c.relrowsecurity,c.relforcerowsecurity,\n        pg_get_userbyid(c.relowner)=\'om_staging_bootstrap\' AS owner_is_bootstrap,\n        has_table_privilege(c.oid,\'SELECT\') AS can_select,has_table_privilege(c.oid,\'INSERT\') AS can_insert,\n        has_table_privilege(c.oid,\'UPDATE\') AS can_update,has_table_privilege(c.oid,\'DELETE\') AS can_delete,\n        has_table_privilege(c.oid,\'TRUNCATE\') AS can_truncate,\n        has_table_privilege(c.oid,\'REFERENCES\') AS can_reference,\n        has_table_privilege(c.oid,\'TRIGGER\') AS can_trigger,\n        CASE WHEN c.relkind IN (\'v\',\'m\') THEN pg_get_viewdef(c.oid,true) ELSE \'\' END AS view_definition\n        FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace\n        WHERE c.relkind IN (\'r\',\'p\',\'v\',\'m\',\'f\') AND (n.nspname||\'.\'||c.relname)=ANY($1::text[]) ORDER BY name LIMIT 101`, [input.relations])).rows;\n      if (relations.length > 100) throw Error();\n      const oids = relations.map(v => v.oid);\n      const columns = (await client.query(`SELECT a.attrelid AS relation,a.attname AS name,a.attnotnull,\n        format_type(a.atttypid,a.atttypmod) AS type,tn.nspname AS type_schema,\n        COALESCE(pg_get_expr(d.adbin,d.adrelid),\'\') AS default_expression\n        FROM pg_catalog.pg_attribute a JOIN pg_catalog.pg_type t ON t.oid=a.atttypid\n        JOIN pg_catalog.pg_namespace tn ON tn.oid=t.typnamespace\n        LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum\n        WHERE a.attrelid=ANY($1::oid[]) AND a.attnum>0 AND NOT a.attisdropped ORDER BY a.attrelid,a.attnum LIMIT 2001`, [oids])).rows;\n      const constraints = (await client.query(`SELECT conrelid AS relation,contype,convalidated,pg_get_constraintdef(oid,true) AS definition\n        FROM pg_catalog.pg_constraint WHERE conrelid=ANY($1::oid[]) ORDER BY conrelid,conname LIMIT 1001`, [oids])).rows;\n      const indexes = (await client.query(`SELECT indrelid AS relation,indisunique,indisvalid,pg_get_indexdef(indexrelid) AS definition\n        FROM pg_catalog.pg_index WHERE indrelid=ANY($1::oid[]) ORDER BY indrelid,indexrelid LIMIT 1001`, [oids])).rows;\n      const triggers = (await client.query(`SELECT tgrelid AS relation,tgenabled,pg_get_triggerdef(oid,true) AS definition\n        FROM pg_catalog.pg_trigger WHERE tgrelid=ANY($1::oid[]) AND NOT tgisinternal ORDER BY tgrelid,tgname LIMIT 1001`, [oids])).rows;\n      const functions = (await client.query(`SELECT (n.nspname||\'.\'||p.proname) AS name,p.prosecdef,\n        pg_get_function_identity_arguments(p.oid) AS arguments,pg_get_functiondef(p.oid) AS definition\n        FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid=p.pronamespace\n        WHERE p.prokind IN (\'f\',\'p\') AND (n.nspname||\'.\'||p.proname)=ANY($1::text[]) ORDER BY name,p.oid LIMIT 101`, [input.functions])).rows;\n      if (columns.length > 2000 || constraints.length > 1000 || indexes.length > 1000 || triggers.length > 1000 || functions.length > 100) throw Error();\n      const unknown = (await client.query(`SELECT count(*)::int AS count FROM pg_catalog.pg_class c\n        JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=ANY($1::text[])\n        AND c.relkind IN (\'r\',\'p\',\'v\',\'m\',\'f\') AND NOT (n.nspname||\'.\'||c.relname)=ANY($2::text[])`,\n        [target.alias === \'auth\' ? [\'public\'] : [\'app\',\'cabinet\'], input.relations])).rows[0].count;\n      let marker = \'not-applicable\';\n      const m = relations.find(v => v.name === \'app.tenant_marker\');\n      const mc = m ? columns.filter(v => v.relation === m.oid) : [];\n      if (target.id) {\n        marker = \'not-checked-schema-or-privilege\';\n        if (m?.relkind === \'r\' && !m.relrowsecurity && !m.relforcerowsecurity && m.can_select && mc.length === 2 &&\n            mc.some(v => v.name === \'tenant_id\' && v.type === \'uuid\') && mc.some(v => v.name === \'generation\' && v.type === \'integer\')) {\n          const row = (await client.query(`SELECT count(*)::int AS count,bool_and(tenant_id=$1::uuid AND generation=$2::int) AS matches\n            FROM (SELECT tenant_id,generation FROM app.tenant_marker LIMIT 2) t`, [target.id,target.generation])).rows[0];\n          marker = row.count === 1 && row.matches === true ? \'matches-registry\' : \'mismatch\';\n        }\n      }\n      const destinations = [...targets, {alias:\'maintenance\',database:\'postgres\'}, {alias:\'template\',database:\'template1\'}];\n      const databasePrivileges = async roleName => (await client.query(`SELECT t.alias AS database_alias,d.datallowconn AS accepts_connections,\n        has_database_privilege($3,d.oid,\'CONNECT\') AS can_connect,\n        has_database_privilege($3,d.oid,\'CREATE\') AS can_create,\n        has_database_privilege($3,d.oid,\'TEMPORARY\') AS can_temporary\n        FROM unnest($1::text[],$2::text[]) AS t(alias,dbname)\n        JOIN pg_catalog.pg_database d ON d.datname=t.dbname ORDER BY t.alias`,\n        [destinations.map(v=>v.alias),destinations.map(v=>v.database),roleName])).rows;\n      const privileges = await databasePrivileges(target.role);\n      const schemaPrivileges = async roleName => (await client.query(`SELECT nspname AS schema,\n        pg_get_userbyid(nspowner)=\'om_staging_bootstrap\' AS owner_is_bootstrap,\n        pg_get_userbyid(nspowner)=\'pg_database_owner\' AS owner_is_database_owner,\n        has_schema_privilege($1,oid,\'USAGE\') AS can_use,has_schema_privilege($1,oid,\'CREATE\') AS can_create\n        FROM pg_catalog.pg_namespace WHERE nspname=ANY($2::text[]) ORDER BY nspname`,\n        [roleName,[\'app\',\'cabinet\',\'public\']])).rows;\n      const byOid = new Map(relations.map(v => [v.oid,v.name]));\n      const readerPrivileges = [];\n      for (const reader of target.readers) {\n        const flags = (await client.query(`SELECT rolsuper,rolcreatedb,rolcreaterole,rolinherit,rolreplication,rolbypassrls,\n          (SELECT count(*)::int FROM pg_catalog.pg_auth_members WHERE member=r.oid) AS memberships\n          FROM pg_catalog.pg_roles r WHERE rolname=$1`, [reader.role])).rows[0];\n        if (!flags) throw Error();\n        const grants = (await client.query(`SELECT c.oid AS relation,\n          has_table_privilege($1,c.oid,\'SELECT\') AS can_select,\n          has_table_privilege($1,c.oid,\'INSERT\') AS can_insert,\n          has_table_privilege($1,c.oid,\'UPDATE\') AS can_update,\n          has_table_privilege($1,c.oid,\'DELETE\') AS can_delete,\n          has_table_privilege($1,c.oid,\'TRUNCATE\') AS can_truncate\n          FROM pg_catalog.pg_class c WHERE c.oid=ANY($2::oid[]) ORDER BY c.oid`, [reader.role,oids])).rows;\n        const fields = (await client.query(`SELECT a.attrelid AS relation,a.attname AS name,\n          has_column_privilege($1,a.attrelid,a.attnum,\'SELECT\') AS can_select,\n          has_column_privilege($1,a.attrelid,a.attnum,\'INSERT\') AS can_insert,\n          has_column_privilege($1,a.attrelid,a.attnum,\'UPDATE\') AS can_update\n          FROM pg_catalog.pg_attribute a WHERE a.attrelid=ANY($2::oid[]) AND a.attnum>0 AND NOT a.attisdropped\n          ORDER BY a.attrelid,a.attnum LIMIT 2001`, [reader.role,oids])).rows;\n        if (fields.length > 2000) throw Error();\n        readerPrivileges.push({alias:reader.alias,flags,databasePrivileges:await databasePrivileges(reader.role),schemaPrivileges:await schemaPrivileges(reader.role),\n          relations:grants.map(v=>({...v,relation:byOid.get(v.relation)})),\n          columns:fields.map(v=>({...v,relation:byOid.get(v.relation)}))});\n      }\n      report.push({alias: target.alias, serverVersionNum: identity.version, readOnly: true, role,\n        unknownRelationCount: unknown, marker, databasePrivileges: privileges,\n        schemaPrivileges:await schemaPrivileges(target.role),readerPrivileges,\n        relations: relations.map(({oid,view_definition,...v}) => ({...v,viewDefinitionHash:hash(view_definition || \'\')})),\n        columns: columns.map(v => ({relation: byOid.get(v.relation), name: v.name,\n          type: v.type_schema === \'pg_catalog\' ? v.type : \'custom-type-sha256:\' + hash(v.type),\n          notNull: v.attnotnull, defaultHash: hash(v.default_expression)})),\n        constraints: constraints.map(v => ({relation: byOid.get(v.relation), type: v.contype,\n          validated: v.convalidated, definitionHash: hash(v.definition)})),\n        indexes: indexes.map(v => ({relation: byOid.get(v.relation), unique: v.indisunique,\n          valid: v.indisvalid, definitionHash: hash(v.definition)})),\n        triggers: triggers.map(v => ({relation:byOid.get(v.relation),enabled:v.tgenabled,definitionHash:hash(v.definition)})),\n        functions: functions.map(v => ({name: v.name, securityDefiner: v.prosecdef,\n          argumentsHash: hash(v.arguments), definitionHash: hash(v.definition)}))});\n      await client.query(\'ROLLBACK\'); // Only this new read-only metadata session.\n    } finally { await client.end(); }\n  }\n  for (const [name, expected] of Object.entries(fingerprints)) {\n    privateJson(name); // Recheck owner/mode/link as well as contents after the reads.\n    if (fingerprints[name] !== expected) throw Error();\n  }\n  const output = JSON.stringify({status: \'READINESS_OBSERVED\', purpose: \'rm1-catalog-metadata-v1\',\n    nodeVersion: process.version, databases: report, privateFileFingerprints: fingerprints,\n    recordDataExported: false, rolesChanged: false,\n    resources: {elapsedMs: Date.now()-started, maxRssKiB: process.resourceUsage().maxRSS,\n      cpuMs: (process.resourceUsage().userCPUTime+process.resourceUsage().systemCPUTime)/1000}});\n  if (Buffer.byteLength(output) > 1048576) throw Error();\n  clearTimeout(deadline); console.log(output);\n}\nmain().catch(error => {\n  clearTimeout(deadline);\n  const sqlState = /^[0-9A-Z]{5}$/.test(error?.code || \'\') ? error.code : null;\n  console.log(JSON.stringify({status:\'STOP\',stage,code:\'RM1_METADATA_UNAVAILABLE\',sqlState}));\n  process.exitCode=2;\n});\n'
CATALOG_INPUT = {'purpose': 'rm1-fixed-catalog-input-v1', 'relations': ['app.bitrix_install_credentials', 'app.bootstrap_native_results', 'app.composer_delivery_origin', 'app.composer_intents', 'app.composer_key_fence', 'app.configuration', 'app.conversation_binding_facts', 'app.delivery_metadata', 'app.delivery_outbox', 'app.delivery_workers', 'app.max_auth_attempts', 'app.max_auth_heads', 'app.max_sessions', 'app.native_echo_key_fence', 'app.native_echo_lanes', 'app.native_mirror_attempt_key_fence', 'app.native_mirror_attempts', 'app.native_mirror_operations', 'app.native_reply_dispositions', 'app.native_reply_inbox', 'app.reply_inbox_key_fence', 'app.route_projection_heads', 'app.route_projection_receipts', 'app.tenant_marker', 'cabinet.audit_events', 'cabinet.audit_meta', 'cabinet.bitrix_bind_operations', 'cabinet.bitrix_event_tokens', 'cabinet.bitrix_install_intents', 'cabinet.bitrix_installation_metadata', 'cabinet.bitrix_installations', 'cabinet.bitrix_member_claims', 'cabinet.bitrix_oauth_attempts', 'cabinet.bitrix_registration_steps', 'cabinet.bitrix_wizard_snapshots', 'cabinet.companies', 'cabinet.company_requests', 'cabinet.connection_bindings', 'cabinet.connection_diagnostics', 'cabinet.connection_entitlements', 'cabinet.connection_payments', 'cabinet.invitations', 'cabinet.member_views', 'cabinet.memberships', 'cabinet.monthly_dialogs', 'cabinet.ownership_transfers', 'cabinet.paid_terms', 'cabinet.renewal_orders', 'cabinet.route_catalog_heads', 'cabinet.route_publication_connections', 'cabinet.route_publication_heads', 'cabinet.route_publication_operations', 'cabinet.route_publication_targets', 'cabinet.tariffs', 'cabinet.tenant_catalog', 'public.account', 'public.session', 'public.twoFactor', 'public.user', 'public.verification'], 'functions': ['app.bump_native_echo_revision', 'app.guard_composer_bootstrap_hold', 'app.guard_composer_intent', 'app.guard_composer_native_origin', 'app.guard_conversation_binding_fact', 'app.guard_delivery_outbox_update', 'app.guard_delivery_worker_update', 'app.guard_native_echo', 'app.guard_native_mirror_attempt', 'app.guard_reply_disposition', 'app.guard_reply_inbox', 'app.guard_route_projection', 'app.lock_composer_tenant', 'app.lock_reply_inbox_tenant', 'cabinet.apply_connection_payment', 'cabinet.bind_connection_identities', 'cabinet.cancel_renewal_order', 'cabinet.claim_outgoing_dialog', 'cabinet.create_renewal_order', 'cabinet.guard_bitrix_durable', 'cabinet.guard_bitrix_event_token', 'cabinet.guard_bitrix_install_intent', 'cabinet.guard_bitrix_installation', 'cabinet.guard_bitrix_registration', 'cabinet.guard_route_publication_head', 'cabinet.guard_route_publication_operation', 'cabinet.lock_bitrix_company', 'cabinet.lock_bitrix_event_company', 'cabinet.lock_route_catalog_source', 'cabinet.lock_route_publication_actor', 'cabinet.lock_route_publication_connection', 'cabinet.lock_route_publication_target', 'cabinet.native_reply_portal', 'cabinet.read_crm_composer_context', 'cabinet.record_company_audit', 'cabinet.transfer_company_ownership']}

def inspect_runtime_image(identifier):
    if not isinstance(identifier,str) or not re.fullmatch('sha256:[a-f0-9]{64}',identifier):
        raise Stop('RM1_IMAGE_BOUNDARY')
    result=subprocess.run(['/usr/bin/docker','--host','unix:///var/run/docker.sock','image','inspect',
        '--format','{{json .Id}}\n{{json .Os}}\n{{json .Architecture}}\n{{json .RootFS.Layers}}',identifier],
        env={'PATH':'/usr/bin:/bin','LANG':'C'},stdin=subprocess.DEVNULL,capture_output=True,timeout=5,check=False)
    lines=result.stdout.splitlines()
    if result.returncode or len(result.stdout)>32768 or len(lines)!=4:
        raise Stop('RM1_IMAGE_METADATA')
    actual,system,architecture,layers=map(json.loads,lines)
    if actual!=identifier or system!='linux' or architecture!='amd64' or not isinstance(layers,list) or len(layers)>128 or any(not re.fullmatch('sha256:[a-f0-9]{64}',x) for x in layers):
        raise Stop('RM1_IMAGE_PROFILE')
    return {'id':actual,'os':system,'architecture':architecture,'rootFsLayers':layers}


def readiness():
    snapshot = inventory()
    if snapshot['configuration']['tenantSlots'] != 2:
        raise Stop('RM1_TWO_SLOTS_REQUIRED')
    before = {name: inspect_container(name) for name in CONTAINERS}
    snapshot['runtimeImages'] = {key:inspect_runtime_image(before[name][0]['image']) for key,name in [('node',CONTAINERS[0]),('postgres',CONTAINERS[1])]}
    args = ['/usr/bin/docker', '--host', 'unix:///var/run/docker.sock', 'exec', '-i',
            '-e', 'NODE_OPTIONS=', '-e', 'PGOPTIONS=', CONTAINERS[0],
            'node', '--max-old-space-size=64', '--input-type=module', '--eval', NODE_SOURCE]
    result = subprocess.run(args, input=json.dumps(CATALOG_INPUT).encode(),
              env={'PATH':'/usr/bin:/bin','LANG':'C'}, capture_output=True, timeout=25, check=False)
    if result.returncode or len(result.stdout)>1048576 or result.stderr:
        if len(result.stdout)<4096:
            try:
                failure=json.loads(result.stdout)
                if failure.get('code')=='RM1_METADATA_UNAVAILABLE' and failure.get('stage') in {'config','control','auth','tenant-1','tenant-2'}:
                    state=failure.get('sqlState')
                    suffix=state if isinstance(state,str) and re.fullmatch('[0-9A-Z]{5}',state) else 'UNKNOWN'
                    raise Stop('RM1_CATALOG_'+failure['stage']+'_'+suffix)
            except (ValueError,AttributeError):
                pass
        raise Stop('RM1_CATALOG_STOP')
    catalog = json.loads(result.stdout)
    if catalog.get('status') != 'READINESS_OBSERVED' or catalog.get('recordDataExported') is not False:
        raise Stop('RM1_CATALOG_BOUNDARY')
    after = {name: inspect_container(name) for name in CONTAINERS}
    if before != after:
        raise Stop('RM1_CONTAINER_DRIFT')
    _, mounts = before[CONTAINERS[0]]
    private = mount_root(mounts, '/run/onixbit')
    if snapshot['configFiles'] != {name:file_metadata(private,name,262144,private=True) for name in snapshot['configFiles']}:
        raise Stop('RM1_CONFIG_DRIFT')
    bootstrap_directory = APP / 'bootstrap'
    if bootstrap_directory.is_symlink() or bootstrap_directory.resolve() != bootstrap_directory:
        raise Stop('RM1_BOOTSTRAP_PATH')
    credential = bootstrap_directory / 'pg-admin'
    try:
        meta = credential.lstat()
        credential_metadata = {'present':True,'regular':stat.S_ISREG(meta.st_mode),'sameOwner':meta.st_uid==os.geteuid(),'privateMode':not bool(meta.st_mode & 0o077)}
    except FileNotFoundError:
        credential_metadata = {'present':False}
    snapshot['bootstrapCredentialMetadata'] = credential_metadata
    return {'purpose':'rm1-nonsecret-readiness-v1','status':'OBSERVED',
            'runtime':snapshot,'catalog':catalog,'targetWrites':False}

def rm1_main():
    if sys.argv[1:] != ['--inspect-rm1-readiness']:
        return 2
    def expired(_signal,_frame):
        raise Stop('RM1_DEADLINE')
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(55)
    try:
        value=readiness()
        raw=json.dumps(value,separators=(',',':')).encode()
        if len(raw)>2097152:
            raise Stop('RM1_OUTPUT_LIMIT')
        sys.stdout.buffer.write(raw+b'\n')
        return 0
    except Exception as error:
        print(json.dumps({'purpose':'rm1-nonsecret-readiness-v1','status':'STOP',
                         'code':str(error) if isinstance(error,Stop) else 'RM1_UNAVAILABLE'}))
        return 2
    finally:
        signal.alarm(0)

if __name__=='__main__':
    raise SystemExit(rm1_main())
