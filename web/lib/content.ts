/**
 * Country content.
 *
 * Today this reads the committed seed file, so 75 pages render different
 * content with no database involved. When 68 country editors need to maintain
 * their own pages, `getCountryContent` swaps to a Payload query and nothing
 * that calls it changes.
 *
 * That is the whole point of this file: it is the seam where a database
 * eventually goes, and until it does, nothing is blocked on one.
 */

import seed from '../../data/country-seed.json';
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
  /** `draft` until a country supplies the six required fields */
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

const BY_ENTRY = new Map<number, CountryContent>(
  (seed.rows as CountryContent[]).map((row) => [row.entryNo, row])
);

export function getCountryContent(route: CountryRoute): CountryContent | undefined {
  return BY_ENTRY.get(route.entryNo);
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
