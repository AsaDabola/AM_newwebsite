import type { Access, FieldAccess, Where } from 'payload';

/**
 * Who may do what.
 *
 * The requirement, from the Plan sheet in
 * Fellowship_Websites_Status_60_Countries.xlsx:
 *
 *   "Headquarters manages the entire platform; each country manages only its
 *    assigned website."
 *
 * These functions are how that sentence is enforced. Returning a *query
 * constraint* rather than `true`/`false` makes Payload filter the database
 * itself, so a country editor's list view contains only their own country.
 * They cannot see other countries, let alone edit them — and there is no way
 * to reach one by guessing a URL in the admin.
 */

type Role = 'hq' | 'region' | 'country';

interface AMUser {
  id: string | number;
  role?: Role;
  region?: string | null;
  /** The `countries` row this editor owns, as an id or a populated doc. */
  country?: string | number | { id: string | number } | null;
}

function roleOf(user: unknown): Role | null {
  const role = (user as AMUser | null)?.role;
  return role === 'hq' || role === 'region' || role === 'country' ? role : null;
}

/** The id of the country a user owns, whether populated or not. */
function countryIdOf(user: unknown): string | number | null {
  const country = (user as AMUser | null)?.country;
  if (!country) return null;
  return typeof country === 'object' ? country.id : country;
}

/* ------------------------------------------------------------------ read -- */

/** Signed in, any role. */
export const anyEditor: Access = ({ req: { user } }) => Boolean(roleOf(user));

/** Public read of published rows only; editors see drafts too. */
export const publishedOrEditor: Access = ({ req: { user } }) => {
  if (roleOf(user)) return true;
  return { status: { equals: 'published' } };
};

/* ----------------------------------------------------------------- write -- */

/** HQ only. Used for the inherited blocks and for user management. */
export const hqOnly: Access = ({ req: { user } }) => roleOf(user) === 'hq';

/**
 * Write access to the `countries` collection itself.
 * HQ: all. Region editor: their region. Country editor: their own row.
 */
export const countryScoped: Access = ({ req: { user } }) => {
  const role = roleOf(user);
  if (!role) return false;
  if (role === 'hq') return true;

  if (role === 'region') {
    const region = (user as AMUser).region;
    if (!region) return false;
    const byRegion: Where = { region: { equals: region } };
    return byRegion;
  }

  const id = countryIdOf(user);
  if (!id) return false;
  const byId: Where = { id: { equals: id } };
  return byId;
};

/**
 * Write access to collections that *belong to* a country — chapters, news.
 * Same rule, but matched on the `country` relationship rather than the id.
 */
export const ownedByCountry: Access = ({ req: { user } }) => {
  const role = roleOf(user);
  if (!role) return false;
  if (role === 'hq') return true;

  if (role === 'region') {
    const region = (user as AMUser).region;
    if (!region) return false;
    const byRegion: Where = { 'country.region': { equals: region } };
    return byRegion;
  }

  const id = countryIdOf(user);
  if (!id) return false;
  const byCountry: Where = { country: { equals: id } };
  return byCountry;
};

/**
 * Countries come from the mission country list, not from the admin. Nobody
 * creates or deletes one by hand — `scripts/seed.ts` owns that, so the URL
 * table and the CMS cannot drift apart.
 */
export const never: Access = () => false;

/** Anyone, signed in or not. Public form posts. */
export const anyone: Access = () => true;

/* ----------------------------------------------------------- field level -- */

/**
 * Fields only HQ may change, on rows a country editor can otherwise edit —
 * the country's identity, its URLs, and its publication status.
 */
export const hqOnlyField: FieldAccess = ({ req: { user } }) => roleOf(user) === 'hq';
