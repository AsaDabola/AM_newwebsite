/**
 * Regenerates the route manifest, if the generator is reachable.
 *
 * `tools/content/build-routes.js` lives at the repository root, above this
 * app. When Vercel builds with Root Directory set to `web` it may upload only
 * this directory, in which case the generator is not there.
 *
 * That is fine: `web/data/routes.json` is committed, and it is what the app
 * actually reads. Regenerating is a consistency check for when the whole repo
 * is present — it is not a build requirement.
 *
 * So: regenerate when we can, verify the committed manifest when we cannot,
 * and fail only if the manifest is missing or unreadable — because then there
 * are no country URLs to build at all.
 */

import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const generator = path.resolve(here, '..', '..', 'tools', 'content', 'build-routes.js');
const manifest = path.resolve(here, '..', 'data', 'routes.json');

if (existsSync(generator)) {
  console.log('[routes] regenerating from the country list');
  const result = spawnSync('node', [generator], { stdio: 'inherit' });
  process.exit(result.status ?? 0);
}

console.log('[routes] generator not in this build context — using the committed manifest');

if (!existsSync(manifest)) {
  console.error('[routes] web/data/routes.json is missing. There are no country URLs to build.');
  process.exit(1);
}

try {
  const { routes } = JSON.parse(readFileSync(manifest, 'utf8'));
  if (!Array.isArray(routes) || routes.length === 0) throw new Error('no routes in the manifest');
  const unique = new Set(routes.map((r) => r.path)).size;
  console.log(`[routes] ${routes.length} routes, ${unique} unique paths`);
} catch (error) {
  console.error(`[routes] web/data/routes.json is unreadable: ${error.message}`);
  process.exit(1);
}
