# Media storage

Uploads go to **Vercel Blob**. Configured in `web/payload.config.ts`, applied
to the `media` collection.

## Why it is needed

Vercel's filesystem is read-only at runtime. Payload's default behaviour is to
write uploads next to the app, which works on a normal server and fails on
Vercel the first time someone adds a photograph. Blob storage moves the files
somewhere writable and serves them from the CDN.

## How it behaves

| `BLOB_READ_WRITE_TOKEN` | What happens |
|---|---|
| Not set | Plugin off. Uploads go to the local filesystem. Correct for development, and it keeps the build working before the store exists |
| Set | Plugin on. Uploads go to Blob and are served from `*.public.blob.vercel-storage.com` |

Nothing else in the app changes between the two. Verified: `npm run build`
passes both with and without the token.

**It must be set in production.** Without it, every upload fails on Vercel.

## Setting it up

1. Vercel dashboard → **Storage** → **Create** → **Blob**
2. Connect the store to the project
3. `BLOB_READ_WRITE_TOKEN` is injected into every environment automatically
4. Redeploy

For local development, either leave it unset — uploads land on disk — or pull
the production value with `vercel env pull .env.local` if you want to work
against the real store.

## What gets stored

The `media` collection generates two sizes with sharp and uploads each one
alongside the original:

| Size | Dimensions | Used for |
|---|---|---|
| `card` | 768 × 512 | Chapter and story cards |
| `wide` | 1600 × 900 | Page banners and figures |
| original | as uploaded | Kept, but not usually served |

That matters more here than on most sites. A large share of this audience is on
a phone on a slow connection in Nairobi, Manila or Lagos, and serving a 4MB
original to them is the difference between a page that loads and one that does
not.

`addRandomSuffix: true` means two files called `team.jpg` do not collide —
likely across 68 country teams uploading independently.

`cacheControlMaxAge` is one year. Blob URLs are content-addressed, so a new
upload gets a new URL and the cache never serves a stale image.

## `next/image`

`web/next.config.mjs` allows `*.public.blob.vercel-storage.com` as a remote
pattern. The subdomain is per-store, so the wildcard covers whichever store the
project ends up connected to. Without this, `next/image` refuses to optimise
uploaded images and they render broken.

## Cost

Vercel Blob is billed on storage and data transfer, with an allowance included
on Pro. For this site the volume is small — roughly the 25 images in
`content-pack/12-gaps.md` item A4, plus a few photographs per country team.
Even at 68 countries × 3 photographs it stays modest.

Worth watching if country teams start uploading unresized originals from
phone cameras. If that happens, add a `maxFileSize` limit to the `media`
collection rather than paying for it.

## Alternatives

If AM ever leaves Vercel, swap the plugin for `@payloadcms/storage-s3` and
point it at S3, Cloudflare R2 or Backblaze. The `media` collection itself does
not change — only the plugin in `payload.config.ts`. Existing files would need
copying across.

## Access

`media` is publicly readable — images on a public website have to be. Create,
update and delete require a signed-in editor.

Note that Blob URLs are unguessable but public: anyone with the URL can fetch
the file, regardless of whether the document referencing it is published. Do
not use the `media` collection for anything confidential. It is for
photographs of the ministry, which is what it is there for.
