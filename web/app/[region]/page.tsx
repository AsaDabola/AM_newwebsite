import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { REGIONS, findRegion, countriesInRegion } from '../../lib/routes';

/** A region index: /africa, /europe, /southeast-asia — the middle segment. */

type Params = { region: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return REGIONS.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { region } = await params;
  const found = findRegion(region);
  if (!found) return {};

  return {
    title: `AM in ${found.name} — Apostolos Missions International`,
    description: `AM country sites across ${found.name}.`,
    alternates: { canonical: `/${found.slug}` },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { region } = await params;
  const found = findRegion(region);
  if (!found) notFound();

  const countries = countriesInRegion(found.slug);

  return (
    <main>
      <header>
        <p>OUR NETWORK</p>
        <h1>AM in {found.name}</h1>
        <p>
          {countries.length} {countries.length === 1 ? 'country' : 'countries'}{' '}
          in this region.
        </p>
      </header>

      <ul>
        {countries.map((c) => (
          <li key={c.path}>
            <Link href={c.path}>{c.country}</Link>
            {c.grouped && <span> — part of AM {c.entryName}</span>}
          </li>
        ))}
      </ul>

      <footer>
        <Link href="/intl">Go to the global site</Link>
      </footer>
    </main>
  );
}
