import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

import { Countries } from './collections/Countries';
import { Chapters } from './collections/Chapters';
import { News } from './collections/News';
import { Media } from './collections/Media';
import { Submissions } from './collections/Submissions';
import { Users } from './collections/Users';
import { Inherited } from './globals/Inherited';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The Neon integration on Vercel injects several connection strings. Prefer
 * the pooled one: serverless functions open a connection per request, and an
 * unpooled Postgres runs out of connections under any real traffic.
 */
const connectionString =
  process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? '';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET || '',

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — AM International',
    },
  },

  collections: [Countries, Chapters, News, Media, Submissions, Users],
  globals: [Inherited],

  editor: lexicalEditor(),
  sharp,

  db: postgresAdapter({
    pool: { connectionString },
    // Generated SQL migrations are committed and run on deploy, so the
    // production schema never changes as a side effect of a build.
    push: process.env.NODE_ENV !== 'production',
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Country pages are statically generated and read the database only at
  // build time, so CORS matters only for the admin and the form endpoints.
  cors: process.env.NEXT_PUBLIC_SERVER_URL ? [process.env.NEXT_PUBLIC_SERVER_URL] : [],
});
