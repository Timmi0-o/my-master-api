import { spawn, spawnSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { DEFAULT_DOCKER_CONTAINER, GEO_DUMP_DIR, GEO_PROD_DUMP_PATH } from './geo-db.config';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export interface IPgConnection {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
}

export type TPgRunnerMode = 'local' | 'docker';

export interface IPgRunner {
  mode: TPgRunnerMode;
  container?: string;
}

export function parseDatabaseUrl(databaseUrl: string): IPgConnection {
  const url = new URL(databaseUrl);

  return {
    host: url.hostname,
    port: url.port || '5432',
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
  };
}

export function getDatabaseConnection(): IPgConnection {
  const databaseUrl = process.env['DATABASE_URL']?.trim();
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Configure my-master-api/.env first.');
  }

  return parseDatabaseUrl(databaseUrl);
}

function commandExists(command: string): boolean {
  const result = spawnSync('sh', ['-c', `command -v ${command}`], { stdio: 'ignore' });
  return result.status === 0;
}

function isDockerContainerRunning(container: string): boolean {
  const result = spawnSync('docker', ['inspect', '-f', '{{.State.Running}}', container], {
    encoding: 'utf-8',
  });

  return result.status === 0 && result.stdout.trim() === 'true';
}

function hasLocalPgRestoreTools(): boolean {
  return commandExists('pg_restore') && commandExists('psql');
}

/**
 * Restore/dump runner:
 * - `local` — pg_restore/psql in PATH (host, or app container with postgresql-client)
 * - `docker` — docker exec into postgres container (from host only)
 */
export function resolvePgRunner(): IPgRunner {
  const forcedMode = process.env['GEO_DB_PG_MODE']?.trim().toLowerCase();
  const container =
    process.env['GEO_DB_DOCKER_CONTAINER']?.trim() || DEFAULT_DOCKER_CONTAINER;

  if (forcedMode === 'docker') {
    if (!commandExists('docker')) {
      throw new Error('GEO_DB_PG_MODE=docker, but docker CLI is not available.');
    }
    if (!isDockerContainerRunning(container)) {
      throw new Error(`Docker container "${container}" is not running.`);
    }
    return { mode: 'docker', container };
  }

  if (forcedMode === 'local') {
    if (!hasLocalPgRestoreTools()) {
      throw new Error(
        'GEO_DB_PG_MODE=local, but pg_restore/psql are not in PATH. ' +
          'Rebuild the app image (postgresql16-client) or run from host: npm run geo:db:restore:host',
      );
    }
    return { mode: 'local' };
  }

  if (hasLocalPgRestoreTools()) {
    return { mode: 'local' };
  }

  if (commandExists('docker') && isDockerContainerRunning(container)) {
    return { mode: 'docker', container };
  }

  throw new Error(
    [
      'PostgreSQL client tools not found.',
      'From app container: rebuild image (`docker compose build app`) — it includes postgresql16-client,',
      'then: npm run geo:db:restore -- --truncate',
      'From host: npm run geo:db:restore:host -- --truncate',
      `Optional: GEO_DB_DOCKER_CONTAINER=${DEFAULT_DOCKER_CONTAINER}`,
    ].join(' '),
  );
}

export function ensureDumpDir(): string {
  fs.mkdirSync(GEO_DUMP_DIR, { recursive: true });
  return GEO_DUMP_DIR;
}

export function resolveOutputPath(explicitPath?: string): string {
  ensureDumpDir();

  if (explicitPath) {
    const resolved = path.isAbsolute(explicitPath)
      ? explicitPath
      : path.join(process.cwd(), explicitPath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    return resolved;
  }

  return GEO_PROD_DUMP_PATH;
}

function tocLineMatchesTable(line: string, table: string): boolean {
  if (!line.includes(' TABLE DATA ')) {
    return false;
  }

  // pg_restore -l: "TABLE DATA public Countries postgres" или 'public "Countries"' в других дампах
  const tableRefs = [
    `public ${table} `,
    `public "${table}" `,
  ];

  return tableRefs.some((tableRef) => line.includes(` TABLE DATA ${tableRef}`));
}

function formatSpawnError(command: string, result: ReturnType<typeof spawnSync>): string {
  if (result.error) {
    return `${command} failed: ${result.error.message}`;
  }

  return `${command} failed: ${result.stderr || result.stdout || 'unknown error'}`;
}

function runPgRestoreList(runner: IPgRunner, inputPath: string): string {
  if (runner.mode === 'local') {
    const result = spawnSync('pg_restore', ['-l', inputPath], {
      encoding: 'utf-8',
      maxBuffer: 64 * 1024 * 1024,
    });

    if (result.status !== 0) {
      throw new Error(formatSpawnError('pg_restore -l', result));
    }

    return result.stdout;
  }

  const remoteDumpPath = `/tmp/geo-toc-${Date.now()}.dump`;
  const copyResult = spawnSync(
    'docker',
    ['cp', inputPath, `${runner.container}:${remoteDumpPath}`],
    { encoding: 'utf-8' },
  );

  if (copyResult.status !== 0) {
    throw new Error(formatSpawnError('docker cp (dump for pg_restore -l)', copyResult));
  }

  try {
    const result = spawnSync(
      'docker',
      ['exec', runner.container!, 'pg_restore', '-l', remoteDumpPath],
      {
        encoding: 'utf-8',
        maxBuffer: 64 * 1024 * 1024,
      },
    );

    if (result.status !== 0) {
      throw new Error(formatSpawnError('pg_restore -l (docker)', result));
    }

    return result.stdout;
  } finally {
    spawnSync('docker', ['exec', runner.container!, 'rm', '-f', remoteDumpPath], {
      stdio: 'ignore',
    });
  }
}

/**
 * Фильтрует TOC дампа до TABLE DATA — пропускает DATABASE/ENCODING и прочие SET-команды,
 * несовместимые между major-версиями pg_dump/pg_restore (например transaction_timeout в PG 17).
 */
export function buildDataOnlyTocListPath(
  runner: IPgRunner,
  inputPath: string,
  tables: readonly string[],
): string {
  const lines = runPgRestoreList(runner, inputPath)
    .split('\n')
    .filter((line) => tables.some((table) => tocLineMatchesTable(line, table)));

  if (lines.length === 0) {
    throw new Error('No TABLE DATA entries found in dump TOC for selected geo tables');
  }

  const tmpPath = path.join(os.tmpdir(), `geo-restore-${Date.now()}.list`);
  fs.writeFileSync(tmpPath, `${lines.join('\n')}\n`);
  return tmpPath;
}

function buildPgEnv(connection: IPgConnection): NodeJS.ProcessEnv {
  return {
    ...process.env,
    PGPASSWORD: connection.password,
  };
}

function dockerConnection(connection: IPgConnection): IPgConnection {
  return {
    ...connection,
    host: '127.0.0.1',
    port: '5432',
  };
}

export async function runPgDumpToFile(
  runner: IPgRunner,
  connection: IPgConnection,
  outputPath: string,
  pgDumpArgs: string[],
): Promise<void> {
  if (runner.mode === 'local') {
    await runCommand('pg_dump', [...pgDumpArgs, '-f', outputPath], buildPgEnv(connection));
    return;
  }

  const args = [
    'exec',
    '-e',
    `PGPASSWORD=${connection.password}`,
    runner.container!,
    'pg_dump',
    ...pgDumpArgs,
  ];

  await pipeCommandToFile('docker', args, outputPath);
}

export async function runPgRestoreFromFile(
  runner: IPgRunner,
  connection: IPgConnection,
  inputPath: string,
  pgRestoreArgs: string[],
): Promise<void> {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Dump file not found: ${inputPath}`);
  }

  if (runner.mode === 'local') {
    await runCommand('pg_restore', [...pgRestoreArgs, inputPath], buildPgEnv(connection));
    return;
  }

  const remotePath = `/tmp/geo-restore-${Date.now()}.dump`;
  const dockerArgs = [...pgRestoreArgs];
  const listArgIndex = dockerArgs.indexOf('-L');
  let localTocPath: string | undefined;
  let remoteTocPath: string | undefined;

  if (listArgIndex >= 0) {
    localTocPath = dockerArgs[listArgIndex + 1];
    if (!localTocPath) {
      throw new Error('pg_restore -L requires a path');
    }

    remoteTocPath = `/tmp/geo-restore-toc-${Date.now()}.list`;
    dockerArgs[listArgIndex + 1] = remoteTocPath;
  }

  try {
    await runCommand('docker', ['cp', inputPath, `${runner.container}:${remotePath}`], process.env);

    if (localTocPath && remoteTocPath) {
      await runCommand(
        'docker',
        ['cp', localTocPath, `${runner.container}:${remoteTocPath}`],
        process.env,
      );
    }

    await runCommand(
      'docker',
      [
        'exec',
        '-e',
        `PGPASSWORD=${connection.password}`,
        runner.container!,
        'pg_restore',
        ...dockerArgs,
        remotePath,
      ],
      process.env,
    );
  } finally {
    const cleanupPaths = [remotePath];
    if (remoteTocPath) {
      cleanupPaths.push(remoteTocPath);
    }

    await runCommand(
      'docker',
      ['exec', runner.container!, 'rm', '-f', ...cleanupPaths],
      process.env,
    ).catch(() => undefined);
  }
}

export async function runPsqlSql(
  runner: IPgRunner,
  connection: IPgConnection,
  sql: string,
): Promise<void> {
  const conn = runner.mode === 'docker' ? dockerConnection(connection) : connection;
  const args = ['-h', conn.host, '-p', conn.port, '-U', conn.user, '-d', conn.database, '-v', 'ON_ERROR_STOP=1', '-c', sql];

  if (runner.mode === 'local') {
    await runCommand('psql', args, buildPgEnv(connection));
    return;
  }

  await runCommand(
    'docker',
    ['exec', '-i', '-e', `PGPASSWORD=${connection.password}`, runner.container!, 'psql', ...args],
    process.env,
  );
}

function runCommand(command: string, args: string[], env: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code ?? 'unknown'}`));
    });
  });
}

function pipeCommandToFile(command: string, args: string[], outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'inherit'] });

    child.stdout.pipe(output);

    child.on('error', reject);
    output.on('error', reject);

    child.on('close', (code) => {
      output.end(() => {
        if (code === 0) resolve();
        else reject(new Error(`${command} exited with code ${code ?? 'unknown'}`));
      });
    });
  });
}

export function formatBytes(value: number): string {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

export function readCliFlag(argv: readonly string[], name: string): boolean {
  return argv.includes(`--${name}`);
}

export function readCliOption(argv: readonly string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = argv.indexOf(`--${name}`);
  if (index >= 0) return argv[index + 1];
  return undefined;
}
