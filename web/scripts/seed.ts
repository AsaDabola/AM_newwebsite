/**
 * Seeds the CMS from the committed data.
 *
 *   npm run seed              upsert countries and chapters
 *   npm run seed -- --admin   also create the first HQ user
 *
 * Idempotent: countries are matched on `entryNo` and updated in place, so
 * re-running after a change to tools/content/countries.js brings the CMS back
 * in step without touching anything a country team has written.
 *
 * Chapters are matched on country + city for the same reason — re-seeding
 * must never wipe a meeting time somebody entered by hand.
 */

import { getPayload } from 'payload';
import config from '../payload.config';
import seed from '../data/country-seed.json';

interface SeedChapter {
  city: string;
  university: string | null;
  meetingDay: string | null;
  meetingTime: string | null;
  email: string | null;
}

interface SeedRow {
  entryNo: number;
  name: string;
  tier: 'G20' | 'M40' | 'Additional';
  region: string | null;
  paths: string[];
  covers: string[] | null;
  chapters: SeedChapter[];
}

const rows = seed.rows as SeedRow[];

async function main() {
  const payload = await getPayload({ config });
  const createAdmin = process.argv.includes('--admin');

  let created = 0;
  let updated = 0;
  let chaptersCreated = 0;
  let chaptersSkipped = 0;
  const withoutPath: string[] = [];

  for (const row of rows) {
    if (row.paths.length === 0) {
      // A path collision took this record's URL. Seeding it would create a
      // site nobody can reach — see docs/routes.md.
      withoutPath.push(`${row.entryNo} ${row.name}`);
      continue;
    }

    /* ---- the country row -------------------------------------------- */

    const identity = {
      entryNo: row.entryNo,
      name: row.name,
      region: row.region ?? '',
      tier: row.tier,
      paths: row.paths.map((path) => ({ path })),
      covers: (row.covers ?? []).map((country) => ({ country })),
    };

    const existing = await payload.find({
      collection: 'countries',
      where: { entryNo: { equals: row.entryNo } },
      limit: 1,
      depth: 0,
    });

    let countryId: number;

    if (existing.docs.length > 0) {
      // Identity only. Local fields belong to whoever wrote them.
      const doc = await payload.update({
        collection: 'countries',
        id: existing.docs[0].id,
        data: identity,
        overrideAccess: true,
        context: { disableRevalidate: true },
      });
      countryId = doc.id;
      updated++;
    } else {
      const doc = await payload.create({
        collection: 'countries',
        data: { ...identity, status: 'draft' },
        overrideAccess: true,
        context: { disableRevalidate: true },
      });
      countryId = doc.id;
      created++;
    }

    /* ---- its chapters ------------------------------------------------ */

    for (const chapter of row.chapters) {
      const already = await payload.find({
        collection: 'chapters',
        where: {
          and: [{ country: { equals: countryId } }, { city: { equals: chapter.city } }],
        },
        limit: 1,
        depth: 0,
      });

      if (already.docs.length > 0) {
        chaptersSkipped++;
        continue;
      }

      await payload.create({
        collection: 'chapters',
        data: {
          country: countryId,
          city: chapter.city,
          university: chapter.university,
          meetingDay: chapter.meetingDay,
          meetingTime: chapter.meetingTime,
          email: chapter.email,
          status: 'draft',
        },
        overrideAccess: true,
        context: { disableRevalidate: true },
      });
      chaptersCreated++;
    }
  }

  /* ---- the first HQ user ------------------------------------------- */

  if (createAdmin) {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('--admin needs SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD set.');
      process.exitCode = 1;
    } else {
      const already = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
      });
      if (already.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: { email, password, name: 'AM Headquarters', role: 'hq' },
          overrideAccess: true,
        });
        console.log(`created HQ user ${email}`);
      } else {
        console.log(`HQ user ${email} already exists`);
      }
    }
  }

  console.log(
    `countries: ${created} created, ${updated} updated\n` +
      `chapters:  ${chaptersCreated} created, ${chaptersSkipped} left alone`
  );

  if (withoutPath.length > 0) {
    console.log(`\nskipped ${withoutPath.length} record(s) with no URL:`);
    withoutPath.forEach((r) => console.log(`  ${r}`));
    console.log('  resolve the collision in docs/routes.md, then re-run.');
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
