import { revalidatePath } from 'next/cache';
import type { CollectionAfterChangeHook } from 'payload';

/**
 * Publishing rebuilds one page, not the site.
 *
 * Country pages are statically generated, so a database edit is invisible
 * until the page is regenerated. These hooks call `revalidatePath` for the
 * affected URLs only — seconds, no deploy, and the other 74 pages are
 * untouched.
 *
 * This is the mechanism that keeps the two pipelines separate: code changes
 * go through GitHub and rebuild everything; content changes go through the
 * admin and rebuild one page.
 */

/** A country row carries every URL it answers to, so grouped sites revalidate all six. */
export const revalidateCountry: CollectionAfterChangeHook = ({ doc, req }) => {
  const paths = Array.isArray(doc?.paths)
    ? doc.paths.map((p: { path?: string }) => p?.path).filter(Boolean)
    : [];

  for (const path of paths) {
    revalidatePath(path as string);
    req.payload.logger.info(`revalidated ${path}`);
  }

  // The region index lists its countries, so it changes too.
  if (doc?.region) revalidatePath(`/${slugify(doc.region)}`);

  return doc;
};

/**
 * A chapter change revalidates its country's pages. The relationship may
 * arrive populated or as a bare id, so fetch when it is an id.
 */
export const revalidateChapterCountry: CollectionAfterChangeHook = async ({ doc, req }) => {
  const rel = doc?.country;
  if (!rel) return doc;

  const country =
    typeof rel === 'object'
      ? rel
      : await req.payload.findByID({
          collection: 'countries',
          id: rel,
          depth: 0,
          req,
        });

  const paths = Array.isArray(country?.paths)
    ? country.paths.map((p: { path?: string }) => p?.path).filter(Boolean)
    : [];

  for (const path of paths) {
    revalidatePath(path as string);
    req.payload.logger.info(`revalidated ${path} after a chapter change`);
  }

  return doc;
};

/** Must match `slug()` in tools/content/routes.js — the region index URL. */
function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
