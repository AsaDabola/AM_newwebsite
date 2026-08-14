import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findRoute, siblingsOf, uniquePaths } from '@/lib/routes';
import { getCountryContent, missingFields, pageState } from '@/lib/content';

/**
 * A country site: /{region}/{country}/{code}, e.g. /africa/kenya/ke
 *
 * Every path is known at build time, so all 75 render statically. Content
 * comes from lib/content, which reads the committed seed today and a database
 * later — this file does not care which.
 *
 * Copy is the frame from content-pack/11-country-site-template.md. The visual
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

  const content = await getCountryContent(route);

  return {
    title: `AM in ${route.country} — Apostolos Missions International`,
    description:
      content?.standfirst ??
      `AM chapters in ${route.country}, part of a worldwide community of students taking the Gospel across university campuses.`,
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

  const content = await getCountryContent(route);
  const state = pageState(content);
  const missing = missingFields(content);
  const siblings = siblingsOf(route);

  return (
    <main data-state={state}>
      <header>
        <p>AM {route.country.toUpperCase()}</p>
        <h1>AM in {route.country}</h1>
        <p>
          {content?.standfirst ??
            `AM chapters in ${route.country}, part of a worldwide community of students taking the Gospel across university campuses.`}
        </p>
        {content?.startedYear && <p>Since {content.startedYear}</p>}
      </header>

      {state === 'no-chapter-yet' ? (
        <section>
          <h2>We are just starting in {route.country}</h2>
          <p>
            There is no chapter here yet. Tell us you are interested and we will
            connect you with the nearest team.
          </p>
          <Link href="/contact">Get in touch</Link>
        </section>
      ) : (
        <section>
          <h2>
            {content!.chapters.length === 1
              ? `Our chapter in ${content!.chapters[0].city}`
              : `Chapters in ${route.country}`}
          </h2>
          <ul>
            {content!.chapters.map((c) => (
              <li key={c.city}>
                <h3>{c.city}</h3>
                {c.university && <p>{c.university}</p>}
                {c.meetingDay && (
                  <p>
                    {c.meetingDay}
                    {c.meetingTime ? `, ${c.meetingTime}` : ''}
                  </p>
                )}
                {c.email && <a href={`mailto:${c.email}`}>Get in touch</a>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>What happens here</h2>
        <p>The same four steps, in {route.country}.</p>
        <ol>
          <li>Connect</li>
          <li>Grow</li>
          <li>Lead</li>
          <li>Sent</li>
        </ol>
      </section>

      {content?.leaderName && (
        <section>
          <h2>Who leads here</h2>
          <p>{content.leaderName}</p>
          {content.leaderRole && <p>{content.leaderRole}</p>}
          {content.contactEmail && (
            <a href={`mailto:${content.contactEmail}`}>Email the team</a>
          )}
        </section>
      )}

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

      {/*
        Visible only to whoever is building. Once a country supplies its six
        intake fields this disappears — see content-pack/12-gaps.md item C4.
      */}
      {missing.length > 0 && process.env.NODE_ENV !== 'production' && (
        <aside>
          <p>
            Awaiting from AM {route.entryName}: {missing.join(', ')}
          </p>
        </aside>
      )}

      <footer>
        <Link href={`/${route.regionSlug}`}>All of {route.region}</Link>
        <Link href="/intl">Go to the global site</Link>
      </footer>
    </main>
  );
}
