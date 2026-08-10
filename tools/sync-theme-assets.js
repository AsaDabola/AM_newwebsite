#!/usr/bin/env node
/**
 * Copies assets/ into the WordPress theme.
 *
 * The static site and the theme share one stylesheet, one globe and one set of
 * fonts. assets/ at the repository root is the source of truth; this script
 * mirrors it into wp-theme/am-international/assets/ so the two cannot drift.
 *
 * Run after editing anything in assets/:
 *   node tools/sync-theme-assets.js
 *
 * Pass --check to verify they are in sync without copying (exits 1 if not),
 * which is useful in CI or a pre-commit hook.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets');
const DEST = path.join(ROOT, 'wp-theme', 'am-international', 'assets');

const checkOnly = process.argv.includes('--check');

/** Every file under a directory, as paths relative to it. */
function listFiles(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(full, base, out);
    } else {
      out.push(path.relative(base, full));
    }
  }
  return out;
}

const files = listFiles(SRC);
const differing = [];
let copied = 0;

for (const rel of files) {
  const from = path.join(SRC, rel);
  const to = path.join(DEST, rel);

  const same =
    fs.existsSync(to) && fs.readFileSync(from).equals(fs.readFileSync(to));

  if (same) continue;

  if (checkOnly) {
    differing.push(rel);
    continue;
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  copied++;
}

// Files in the theme that no longer exist at the root are stale.
const stale = listFiles(DEST).filter(
  (rel) => !fs.existsSync(path.join(SRC, rel))
);

if (checkOnly) {
  if (differing.length || stale.length) {
    if (differing.length) {
      console.error(`out of sync (${differing.length}): ${differing.join(', ')}`);
    }
    if (stale.length) {
      console.error(`stale in theme (${stale.length}): ${stale.join(', ')}`);
    }
    console.error('run: node tools/sync-theme-assets.js');
    process.exit(1);
  }
  console.log(`theme assets in sync (${files.length} files)`);
  process.exit(0);
}

for (const rel of stale) {
  fs.unlinkSync(path.join(DEST, rel));
}

console.log(
  `synced ${files.length} files -> wp-theme/am-international/assets/ ` +
    `(${copied} updated, ${stale.length} removed)`
);
