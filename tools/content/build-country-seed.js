#!/usr/bin/env node
/**
 * Emits the rows that seed the CMS `countries` collection.
 *
 * Each row is one *site* — 68 of them — not one route. Grouped entries carry
 * every path they answer to, so East Federal Africa is a single editable
 * record serving six URLs.
 *
 * The inherited ninety per cent is not here. It lives in `globals`, edited
 * once by HQ. These rows are the local ten per cent, pre-filled with
 * everything already known so a country team only supplies what is missing.
 *
 * Usage: node tools/content/build-country-seed.js
 * Writes: data/country-seed.json
 */

const fs = require('fs');
const path = require('path');
const { COUNTRIES } = require('./countries.js');
const { buildRoutes, validate } = require('./routes.js');

const OUT = path.join(__dirname, '..', '..', 'data', 'country-seed.json');

const routes = buildRoutes();
const problems = validate(routes);

/** Paths are unique per site; a collision means one path claimed twice. */
const claimed = new Set();
const pathsByEntry = new Map();

for (const r of routes) {
  if (claimed.has(r.path)) continue; // reported by validate(); first writer wins
  claimed.add(r.path);
  if (!pathsByEntry.has(r.entryNo)) pathsByEntry.set(r.entryNo, []);
  pathsByEntry.get(r.entryNo).push({ path: r.path, country: r.country, code: r.code });
}

const rows = COUNTRIES.map((entry) => {
  const paths = pathsByEntry.get(entry.no) || [];
  const primary = paths[0];

  return {
    /* ---- identity: from the mission country list, do not edit in the CMS -- */
    entryNo: entry.no,
    name: entry.name,
    tier: entry.tier,
    region: primary ? routes.find((r) => r.path === primary.path).region : null,
    paths: paths.map((p) => p.path),
    covers: entry.covers || null,
    languages: entry.languages,

    /* ---- the local ten per cent: the country team fills these in --------- */
    status: 'draft',
    standfirst: null, //  1 sentence, max 160 chars
    startedYear: null, //  "Since {year}"
    contactEmail: null, //  required before publish
    leaderName: null, //  required before publish
    leaderRole: null,
    locale: null, //  required before publish — which language this site is in
    chapters: [], //  { city, university, meetingDay, meetingTime, email }
    photos: [],

    /* ---- who may edit this row ------------------------------------------ */
    owner: null, //  required before publish — a named person

    /* ---- carried over from the existing site where we have it ----------- */
    existingSites: entry.sites || null,
  };
});

/** Publish gate, from content-pack/11-country-site-template.md. */
const REQUIRED = ['contactEmail', 'leaderName', 'locale', 'owner'];

const readiness = rows.map((r) => ({
  name: r.name,
  missing: REQUIRED.filter((f) => !r[f]).concat(r.chapters.length ? [] : ['chapters']),
}));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify(
    { generated: 'tools/content/build-country-seed.js', collection: 'countries', rows },
    null,
    2
  ) + '\n'
);

console.log(`wrote ${OUT}`);
console.log(`${rows.length} country records covering ${claimed.size} paths`);
console.log(`${rows.filter((r) => r.covers).length} of them are grouped sites`);
console.log(
  `\nnone are publishable yet — every row is missing ${REQUIRED.join(', ')} and chapters.`
);
console.log('that is expected: those are the six intake fields AM has to collect.');
const orphans = rows.filter((r) => r.paths.length === 0);
if (orphans.length) {
  console.log(`\n${orphans.length} record(s) with no URL — a path collision took theirs:`);
  orphans.forEach((r) => console.log(`  entry ${r.entryNo} "${r.name}"`));
  console.log('  an unreachable record is a decision waiting, not a site. Resolve or remove it.');
}

if (problems.length) {
  console.log(`\n${problems.length} route problem(s) — see build-routes.js:`);
  problems.forEach((p) => console.log(`  [${p.kind}] ${p.path} — ${p.detail}`));
}
