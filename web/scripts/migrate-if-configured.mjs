/**
 * Runs pending Payload migrations, but only when a database is configured.
 *
 * In production `push` is off — the schema is not created as a side effect of
 * a build — so migrations are the only thing that creates or alters tables.
 * They have to run on deploy, before Next builds pages that read from them.
 *
 * When no connection string is set the app builds from the committed seed
 * instead, so there is nothing to migrate and this exits quietly. That is what
 * keeps a deploy working before Neon is attached.
 */

import { spawnSync } from 'node:child_process';

const configured = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!configured) {
  console.log('[migrate] no POSTGRES_URL or DATABASE_URL — skipping, building from the seed');
  process.exit(0);
}

console.log('[migrate] running pending migrations');

const result = spawnSync('payload', ['migrate'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (result.status !== 0) {
  console.error(
    '[migrate] failed. The deploy is stopping here on purpose: pages that read\n' +
      '          from a half-migrated schema would render wrong rather than fail.'
  );
  process.exit(result.status ?? 1);
}
