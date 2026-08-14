import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
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

/**
 * Vercel's filesystem is read-only at runtime, so uploads cannot be written
 * next to the app. Blob storage is the fix.
 *
 * The token is injected by the Vercel Blob integration. Without it the plugin
 * stays off and Payload writes to the local disk instead, which is what you
 * want in development and what keeps the build working before the store
 * exists. It must be set in production — see docs/media-storage.md.
 */
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

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

  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      collections: { media: true },
      token: blobToken ?? '',
      // Payload generates the resized versions with sharp and uploads each
      // one, so `imageSizes` on the Media collection keeps working.
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    }),
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Country pages are statically generated and read the database only at
  // build time, so CORS matters only for the admin and the form endpoints.
  cors: process.env.NEXT_PUBLIC_SERVER_URL ? [process.env.NEXT_PUBLIC_SERVER_URL] : [],
});
