/**
 * Country content — the seam between the repo and the database.
 *
 * Two sources, one interface:
 *
 *   no DATABASE_URL  →  data/country-seed.json, committed to the repo
 *   DATABASE_URL set →  Payload, backed by Neon
 *
 * Nothing that calls `getCountryContent` knows or cares which. That matters
 * for two reasons: the site still builds and deploys before Neon exists, and
 * a database outage during a build degrades to the last committed seed rather
 * than failing the deploy.
 *
 * Payload is imported dynamically so that when no database is configured it
 * is never loaded at all.
 */

import seed from '../data/country-seed.json';
import type { CountryRoute } from './routes';

export interface Chapter {
  city: string;
  university?: string | null;
  meetingDay?: string | null;
  meetingTime?: string | null;
  email?: string | null;
}

export interface CountryContent {
  entryNo: number;
  name: string;
  region: string | null;
  paths: string[];
  languages: string[];
  status: 'draft' | 'published';
  standfirst: string | null;
  startedYear: number | null;
  contactEmail: string | null;
  leaderName: string | null;
  leaderRole: string | null;
  locale: string | null;
  chapters: Chapter[];
  photos: string[];
  owner: string | null;
}

/** True once Neon is connected. Set by the Vercel integration. */
export const usingDatabase = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);

/* ------------------------------------------------------------------ seed -- */

const SEED_BY_ENTRY = new Map<number, CountryContent>(
  (seed.rows as CountryContent[]).map((row) => [row.entryNo, row])
);

/* --------------------------------------------------------------- payload -- */

/** Payload rows shape the same interface, so page components stay unchanged. */
function fromPayload(doc: Record<string, unknown>, chapters: Record<string, unknown>[]): CountryContent {
  return {
    entryNo: doc.entryNo as number,
    name: doc.name as string,
    region: (doc.region as string) ?? null,
    paths: Array.isArray(doc.paths)
      ? (doc.paths as { path: string }[]).map((p) => p.path)
      : [],
    languages: [],
    status: (doc.status as 'draft' | 'published') ?? 'draft',
    standfirst: (doc.standfirst as string) ?? null,
    startedYear: (doc.startedYear as number) ?? null,
    contactEmail: (doc.contactEmail as string) ?? null,
    leaderName: (doc.leaderName as string) ?? null,
    leaderRole: (doc.leaderRole as string) ?? null,
    locale: (doc.locale as string) ?? null,
    chapters: chapters.map((c) => ({
      city: c.city as string,
      university: (c.university as string) ?? null,
      meetingDay: (c.meetingDay as string) ?? null,
      meetingTime: (c.meetingTime as string) ?? null,
      email: (c.email as string) ?? null,
    })),
    photos: [],
    owner: (doc.owner as string) ?? null,
  };
}

async function fetchFromPayload(entryNo: number): Promise<CountryContent | undefined> {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ]);
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'countries',
    where: { entryNo: { equals: entryNo } },
    limit: 1,
    depth: 0,
  });

  const doc = docs[0] as Record<string, unknown> | undefined;
  if (!doc) return undefined;

  const { docs: chapters } = await payload.find({
    collection: 'chapters',
    where: { country: { equals: doc.id } },
    limit: 200,
    depth: 0,
    sort: 'city',
  });

  return fromPayload(doc, chapters as Record<string, unknown>[]);
}

/* -------------------------------------------------------------------- api -- */

export async function getCountryContent(
  route: CountryRoute
): Promise<CountryContent | undefined> {
  if (!usingDatabase) return SEED_BY_ENTRY.get(route.entryNo);

  try {
    const fromDb = await fetchFromPayload(route.entryNo);
    if (fromDb) return fromDb;
  } catch (error) {
    // A build should not fail because the database blinked. Fall back to the
    // committed seed and make the reason visible in the build log.
    console.warn(
      `[content] Payload lookup failed for entry ${route.entryNo}, using the committed seed:`,
      error instanceof Error ? error.message : error
    );
  }

  return SEED_BY_ENTRY.get(route.entryNo);
}

/**
 * The fields a country must supply before its page is worth publishing, from
 * content-pack/11-country-site-template.md. An empty country page tells a
 * student the chapter is dead, so a page missing these renders the
 * "no chapter yet" state rather than an empty "full" one.
 */
const REQUIRED = ['contactEmail', 'leaderName', 'locale', 'owner'] as const;

export function missingFields(content: CountryContent | undefined): string[] {
  if (!content) return [...REQUIRED, 'chapters'];
  const missing: string[] = REQUIRED.filter((f) => !content[f]);
  if (content.chapters.length === 0) missing.push('chapters');
  return missing;
}

export function isPublishable(content: CountryContent | undefined): boolean {
  return missingFields(content).length === 0;
}

/**
 * Which of the five design states a country page should render.
 * See content-pack/11-country-site-template.md.
 */
export type PageState = 'full' | 'single-chapter' | 'no-local-copy' | 'no-chapter-yet';

export function pageState(content: CountryContent | undefined): PageState {
  if (!content || content.chapters.length === 0) return 'no-chapter-yet';
  if (!content.standfirst) return 'no-local-copy';
  return content.chapters.length === 1 ? 'single-chapter' : 'full';
}
