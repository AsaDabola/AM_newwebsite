/**
 * The route table, read from the generated manifest.
 *
 * The manifest is produced by `node tools/content/build-routes.js` from
 * `tools/content/countries.js`. It is committed, so the build needs no
 * database and no network to know every country URL.
 */

import manifest from '../data/routes.json';

export type Tier = 'G20' | 'M40' | 'Additional';

export interface CountryRoute {
  /** `/africa/kenya/ke` */
  path: string;
  region: string;
  regionSlug: string;
  country: string;
  countrySlug: string;
  /** ISO 3166-1 alpha-2, lowercase */
  code: string;
  /** Entry number in the mission country list */
  entryNo: number;
  /** The site this route resolves to — differs from `country` for grouped entries */
  entryName: string;
  tier: Tier;
  /** True when several countries share one site */
  grouped: boolean;
  languages: string[];
}

export interface Region {
  name: string;
  slug: string;
  count: number;
}

export const HQ_SEGMENT: string = manifest.hqSegment;
export const REGIONS: Region[] = manifest.regions;
export const ROUTES: CountryRoute[] = manifest.routes as CountryRoute[];

/**
 * Grouped entries claim one path per covered country, and two entries can
 * claim the same path. First writer wins, which keeps the map total —
 * `tools/content/build-routes.js` reports the collisions.
 */
const BY_PATH = new Map<string, CountryRoute>();
for (const route of ROUTES) {
  if (!BY_PATH.has(route.path)) BY_PATH.set(route.path, route);
}

export function findRoute(
  regionSlug: string,
  countrySlug: string,
  code: string
): CountryRoute | undefined {
  return BY_PATH.get(`/${regionSlug}/${countrySlug}/${code}`);
}

export function findRegion(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function countriesInRegion(slug: string): CountryRoute[] {
  return uniquePaths().filter((r) => r.regionSlug === slug);
}

/** Every route, collisions removed — this is what the site actually renders. */
export function uniquePaths(): CountryRoute[] {
  return [...BY_PATH.values()];
}

/** The other countries served by the same site, for grouped entries. */
export function siblingsOf(route: CountryRoute): CountryRoute[] {
  if (!route.grouped) return [];
  return uniquePaths().filter(
    (r) => r.entryNo === route.entryNo && r.path !== route.path
  );
}
