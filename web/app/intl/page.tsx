import type { Metadata } from 'next';
import Link from 'next/link';
import { REGIONS, uniquePaths } from '../../lib/routes';

/**
 * The international HQ site at /intl.
 *
 * `/` redirects here — see web/next.config.mjs. Copy is from
 * content-pack/01-homepage.md; the design lands with the Figma components.
 */

export const metadata: Metadata = {
  title: 'Apostolos Missions International',
  description:
    'An interdenominational campus ministry preaching the Gospel, making disciples, and sending them out.',
  alternates: { canonical: '/intl' },
};

export default function InternationalHome() {
  const countries = uniquePaths();

  return (
    <main>
      <header>
        <p>APOSTOLOS MISSIONS INTERNATIONAL</p>
        <h1>Sent to the ends of the earth</h1>
        <p>
          An interdenominational campus ministry preaching the Gospel, making
          disciples, and sending them out.
        </p>
      </header>

      <section>
        <h2>A worldwide community</h2>
        <p>
          {countries.length} country sites across {REGIONS.length} regions.
        </p>
        <ul>
          {REGIONS.map((r) => (
            <li key={r.slug}>
              <Link href={`/${r.slug}`}>{r.name}</Link> ({r.count})
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
