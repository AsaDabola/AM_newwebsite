/**
 * Builds the URL route table for the country platform.
 *
 * Route shape, as specified by AM:
 *
 *     amintl.org/{region}/{country}/{code}      e.g. /africa/kenya/ke
 *     amintl.org/intl                           the international HQ site
 *
 * One route per ISO code. Grouped entries — Colombia, East Federal Africa —
 * expand to one route per covered country, all resolving to the same site.
 *
 * The spreadsheet only assigns a region to the M40 block. Regions for the G20
 * and additional entries are assigned in REGION_BY_COUNTRY below, using the
 * same region vocabulary. Those are our assignments, not AM's — change them
 * there and every route follows.
 */

const { COUNTRIES } = require('./countries.js');

/** The reserved first segment for the HQ site. No region may use it. */
const HQ_SEGMENT = 'intl';

/**
 * Regions for the entries the spreadsheet leaves unassigned. "North America"
 * is the one region name not present in the source — the M40 block has no
 * North American countries, so it never needed one.
 */
const REGION_BY_COUNTRY = {
  // G20
  Brazil: 'South America',
  Canada: 'North America',
  Colombia: 'South America',
  France: 'Europe',
  Germany: 'Europe',
  India: 'South Asia',
  Indonesia: 'Southeast Asia',
  Italy: 'Europe',
  Japan: 'Asia-Pacific',
  'East Federal Africa': 'Africa',
  'South Korea': 'Asia-Pacific',
  Mexico: 'North America',
  Nigeria: 'Africa',
  Australia: 'Oceania',
  Russia: 'Commonwealth of Independent States',
  'South Africa': 'Africa',
  Spain: 'Europe',
  Turkey: 'Middle East and North Africa',
  'United Kingdom': 'Europe',
  'United States': 'North America',

  // Additional priority or replacement
  Rwanda: 'Africa',
  Guatemala: 'Central America and the Caribbean',
  Honduras: 'Central America and the Caribbean',
  'Sri Lanka': 'South Asia',
};

/** ISO code -> display name, for the countries inside grouped entries. */
const GROUP_MEMBER_CODES = {
  // Colombia group
  Colombia: 'co',
  Venezuela: 've',
  Ecuador: 'ec',
  Panama: 'pa',
  // East Federal Africa group
  Kenya: 'ke',
  Tanzania: 'tz',
  Uganda: 'ug',
  Rwanda: 'rw',
  Burundi: 'bi',
  'South Sudan': 'ss',
};

/** Lowercase, strip accents and punctuation, hyphenate. */
function slug(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function regionOf(entry) {
  return entry.region || REGION_BY_COUNTRY[entry.name] || null;
}

/**
 * Expands the 68 entries into one route per country.
 * A grouped entry yields one route per covered country, each carrying the
 * group's entry number so they all resolve to the same site.
 */
function buildRoutes() {
  const routes = [];

  for (const entry of COUNTRIES) {
    const region = regionOf(entry);
    if (!region) throw new Error(`no region for "${entry.name}"`);

    const members = entry.covers
      ? entry.covers.map((name) => ({ name, iso: GROUP_MEMBER_CODES[name] }))
      : entry.iso.map((iso) => ({ name: entry.name, iso }));

    for (const { name, iso } of members) {
      if (!iso) throw new Error(`no ISO code for "${name}" in "${entry.name}"`);
      routes.push({
        path: `/${slug(region)}/${slug(name)}/${iso}`,
        region,
        regionSlug: slug(region),
        country: name,
        countrySlug: slug(name),
        code: iso,
        entryNo: entry.no,
        entryName: entry.name,
        tier: entry.tier,
        grouped: Boolean(entry.covers),
        languages: entry.languages,
      });
    }
  }

  return routes;
}

/**
 * Route problems that must be resolved before the platform is generated.
 * Returned rather than thrown, so the report can show all of them at once.
 */
function validate(routes) {
  const problems = [];
  const seen = new Map();

  for (const r of routes) {
    const prior = seen.get(r.path);
    if (prior) {
      problems.push({
        kind: 'duplicate path',
        path: r.path,
        detail: `claimed by entry ${prior.entryNo} "${prior.entryName}" and entry ${r.entryNo} "${r.entryName}"`,
      });
    } else {
      seen.set(r.path, r);
    }

    if (r.regionSlug === HQ_SEGMENT) {
      problems.push({
        kind: 'reserved segment',
        path: r.path,
        detail: `region slug collides with the HQ site at /${HQ_SEGMENT}`,
      });
    }
  }

  return problems;
}

/** Unique regions, in the order they first appear. */
function regions(routes) {
  const out = new Map();
  for (const r of routes) {
    if (!out.has(r.regionSlug)) out.set(r.regionSlug, { name: r.region, slug: r.regionSlug, countries: [] });
    out.get(r.regionSlug).countries.push(r);
  }
  return [...out.values()];
}

module.exports = { buildRoutes, validate, regions, slug, HQ_SEGMENT, REGION_BY_COUNTRY };
