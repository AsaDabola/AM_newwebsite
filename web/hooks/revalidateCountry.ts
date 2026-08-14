import { revalidatePath } from 'next/cache';
import type { CollectionAfterChangeHook, Payload } from 'payload';

type Logger = Payload['logger'];

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

/**
 * `revalidatePath` only works inside a Next.js request or render. Called from
 * anywhere else — the seed script, a migration, a cron job — it throws
 * "static generation store missing" and takes the whole operation down with
 * it.
 *
 * So revalidation is best-effort: skipped when a caller opts out, and never
 * allowed to fail the write that triggered it. A page that missed a
 * revalidation is stale for a while; a write that failed is lost.
 */
function revalidate(paths: string[], logger: Logger, why: string): void {
  for (const path of paths) {
    try {
      revalidatePath(path);
      logger.info(`revalidated ${path}${why}`);
    } catch (error) {
      logger.warn(
        `could not revalidate ${path} — ${
          error instanceof Error ? error.message : error
        }. The page will refresh on its next build.`
      );
    }
  }
}

/** Bulk callers set this to skip revalidation entirely. */
function disabled(context: unknown): boolean {
  return Boolean((context as { disableRevalidate?: boolean } | undefined)?.disableRevalidate);
}

/** The URLs a country row answers to — six of them for a grouped site. */
function pathsOf(doc: unknown): string[] {
  const paths = (doc as { paths?: { path?: string }[] } | undefined)?.paths;
  return Array.isArray(paths)
    ? paths.map((p) => p?.path).filter((p): p is string => Boolean(p))
    : [];
}

export const revalidateCountry: CollectionAfterChangeHook = ({ doc, req, context }) => {
  if (disabled(context)) return doc;

  const paths = pathsOf(doc);
  // The region index lists its countries, so it changes too.
  if (doc?.region) paths.push(`/${slugify(doc.region)}`);

  revalidate(paths, req.payload.logger, '');
  return doc;
};

/**
 * A chapter change revalidates its country's pages. The relationship may
 * arrive populated or as a bare id, so fetch when it is an id.
 */
export const revalidateChapterCountry: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  if (disabled(context)) return doc;

  const rel = doc?.country;
  if (!rel) return doc;

  const country =
    typeof rel === 'object'
      ? rel
      : await req.payload.findByID({ collection: 'countries', id: rel, depth: 0, req });

  revalidate(pathsOf(country), req.payload.logger, ' after a chapter change');
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
