import type { Metadata } from 'next';
import Link from 'next/link';
import { REGIONS, uniquePaths } from '@/lib/routes';
import { Hero } from '@/components/home/Hero';

/**
 * The international HQ site at /intl.
 *
 * `/` redirects here — see web/next.config.mjs. The hero below is the first
 * Figma-sourced component (see Hero.tsx for what is confirmed vs
 * provisional); everything under it is still the placeholder copy from
 * content-pack/01-homepage.md pending the rest of the Main_2 sections.
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
      <Hero />

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
