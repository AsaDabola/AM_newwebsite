import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findRoute, siblingsOf, uniquePaths } from '../../../../lib/routes';

/**
 * A country site: /{region}/{country}/{code}, e.g. /africa/kenya/ke
 *
 * Every path is known at build time, so all 75 render statically. The copy
 * below is the frame from `content-pack/11-country-site-template.md`; the
 * local ten per cent comes from the CMS once it is wired up, and the visual
 * design lands when the Figma components do.
 */

type Params = { region: string; country: string; code: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return uniquePaths().map((r) => ({
    region: r.regionSlug,
    country: r.countrySlug,
    code: r.code,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { region, country, code } = await params;
  const route = findRoute(region, country, code);
  if (!route) return {};

  return {
    title: `AM in ${route.country} — Apostolos Missions International`,
    description: `AM chapters in ${route.country}, part of a worldwide community of students taking the Gospel across university campuses.`,
    alternates: { canonical: route.path },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { region, country, code } = await params;
  const route = findRoute(region, country, code);
  if (!route) notFound();

  const siblings = siblingsOf(route);

  return (
    <main>
      <header>
        <p>AM {route.country.toUpperCase()}</p>
        <h1>AM in {route.country}</h1>
        <p>
          AM chapters in {route.country}, part of a worldwide community of
          students taking the Gospel across university campuses.
        </p>
      </header>

      {/*
        Awaiting content. Until the CMS is wired up, a country page carries
        only inherited copy — which per content-pack/11 is not enough to
        publish. These render as the "no local copy" state.
      */}

      <section>
        <h2>Chapters in {route.country}</h2>
        <p>Chapter data pending — see content-pack/12-gaps.md, item B5.</p>
      </section>

      <section>
        <h2>What happens here</h2>
        <ol>
          <li>Connect</li>
          <li>Grow</li>
          <li>Lead</li>
          <li>Sent</li>
        </ol>
      </section>

      {siblings.length > 0 && (
        <section>
          <h2>Also served by AM {route.entryName}</h2>
          <ul>
            {siblings.map((s) => (
              <li key={s.path}>
                <Link href={s.path}>{s.country}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer>
        <Link href={`/${route.regionSlug}`}>All of {route.region}</Link>
        <Link href="/intl">Go to the global site</Link>
      </footer>
    </main>
  );
}
