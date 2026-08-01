/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';
import { GEO_DATA_TABLES, GEO_PROD_DUMP_PATH, toPgQuotedTable } from './geo-db.config';
import {
  buildDataOnlyTocListPath,
  formatBytes,
  getDatabaseConnection,
  readCliFlag,
  readCliOption,
  resolvePgRunner,
  runPgRestoreFromFile,
  runPsqlSql,
} from './geo-db.utils';

function buildTruncateSql(tables: readonly string[]): string {
  const quoted = tables.map((table) => toPgQuotedTable(table)).join(', ');
  return `TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE;`;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const inputPath = readCliOption(argv, 'input') ?? GEO_PROD_DUMP_PATH;

  const resolvedInput = fs.existsSync(inputPath)
    ? inputPath
    : path.join(process.cwd(), inputPath);

  if (!fs.existsSync(resolvedInput)) {
    throw new Error(
      `Dump file not found: ${resolvedInput}. Place geo.dump in prisma/dumps/ or pass --input=<path>.`,
    );
  }

  const truncate = readCliFlag(argv, 'truncate');
  const jobs = Number(readCliOption(argv, 'jobs') ?? 4);

  const connection = getDatabaseConnection();
  const runner = resolvePgRunner();
  const tables = [...GEO_DATA_TABLES];

  console.log('[GeoDbRestore] Settings:');
  console.log(`  mode: ${runner.mode}${runner.container ? ` (${runner.container})` : ''}`);
  console.log(`  database: ${connection.database}@${connection.host}:${connection.port}`);
  console.log(`  input: ${resolvedInput} (${formatBytes(fs.statSync(resolvedInput).size)})`);
  console.log(`  truncate: ${truncate}`);
  console.log(`  jobs: ${jobs}`);
  console.log(`  tables: ${tables.join(', ')}`);

  // Fail fast if geo migration was marked applied but tables are missing.
  try {
    await runPsqlSql(
      runner,
      connection,
      `SELECT 1 FROM "Countries" LIMIT 1;`,
    );
  } catch {
    throw new Error(
      [
        'Geo tables are missing (e.g. "Countries").',
        'Migration 20260801120000_add_geo_models was likely marked as applied after a failed run.',
        'Fix:',
        '  1) Ensure postgres image is postgis/postgis:16-3.4 and recreate volume if needed',
        '  2) npx prisma migrate resolve --rolled-back 20260801120000_add_geo_models',
        '  3) npx prisma migrate deploy',
        '  4) npm run geo:db:restore -- --truncate  (or geo:db:restore:host from host)',
      ].join('\n'),
    );
  }

  if (truncate) {
    console.log('[GeoDbRestore] Truncating geo tables...');
    await runPsqlSql(runner, connection, buildTruncateSql(tables));
  }

  const pgRestoreArgs = [
    '-h',
    runner.mode === 'docker' ? '127.0.0.1' : connection.host,
    '-p',
    runner.mode === 'docker' ? '5432' : connection.port,
    '-U',
    connection.user,
    '-d',
    connection.database,
    '--no-owner',
    '--no-acl',
    '--verbose',
    `--jobs=${jobs}`,
    '--disable-triggers',
  ];

  if (!readCliFlag(argv, 'full')) {
    pgRestoreArgs.push('--data-only');
  }

  let tocListPath: string | undefined;
  if (!readCliFlag(argv, 'full')) {
    tocListPath = buildDataOnlyTocListPath(runner, resolvedInput, tables);
    pgRestoreArgs.push('-L', tocListPath);
    console.log(`[GeoDbRestore] TOC filter: ${tables.length} table(s), ${tocListPath}`);
  }

  const startedAt = Date.now();
  try {
    await runPgRestoreFromFile(runner, connection, resolvedInput, pgRestoreArgs);
  } finally {
    if (tocListPath) {
      fs.unlinkSync(tocListPath);
    }
  }

  const elapsedSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  console.log(`[GeoDbRestore] Done in ${elapsedSeconds}s`);
  console.log('[GeoDbRestore] Ensure schema is up to date: npm run prisma:migrate:dev / deploy');
}

main().catch((error) => {
  console.error('[GeoDbRestore] Failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
