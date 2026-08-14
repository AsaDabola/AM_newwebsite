# Deploying to Vercel

## If `/admin` shows a 404 with AM's navigation on it

That is not Payload's 404. It is `404.html` from the **repo root** — the old
static site. Vercel is serving the repository root instead of building the
Next.js app in `web/`.

**Fix: Vercel → Project → Settings → Build and Deployment → Root Directory →
`web` → Save → Redeploy.**

Everything else follows from that. Nothing is wrong with the code.

### Why it happens

The repository holds two sites:

```
/                    the old static HTML site — index.html, about/, network/
/web                 the Next.js app — the actual new site, with /admin
```

With no Root Directory set, Vercel looks at the repository root, finds
`index.html`, detects no framework, and serves the files as static assets.
`/admin` matches no file, so it falls through to `404.html` — which is a real,
designed AM page, which is exactly why it does not look like an error.

### How to tell which one you are looking at

| You see | What it means |
|---|---|
| A 404 with AM navigation and "This page went on mission" | Serving the repo root as static files. Root Directory is not set |
| `No Output Directory named "public"` | Building `web/`, but Framework Preset is still "Other" |
| `Cannot find module '../tools/content/build-routes.js'` | Fixed — the build now falls back to the committed manifest |
| A Payload login form | Working |

---

## If the build fails with `No Output Directory named "public"`

Different problem, and it means progress — Vercel is now running a build
rather than serving static files. It is failing because the **Framework
Preset** is still "Other", whose default output directory is `public`. A
Next.js build writes to `.next`, so Vercel looks in the wrong place and stops.

This happens because the project was first created against a repository that
had no framework in it. Changing Root Directory does not reset the preset.

**Fix, two settings:**

1. Settings → Build and Deployment → **Framework Preset → Next.js**
2. In the same panel, clear the **Output Directory** override if one is set —
   leave it on the framework default. Do not set it to `.next` by hand.

`web/vercel.json` now declares `"framework": "nextjs"` as well, so the repo
states its own build settings and a future project created from it needs no
dashboard configuration beyond Root Directory.

---

## Full deploy checklist

### 1 · Root Directory and Framework Preset

Settings → Build and Deployment:

- **Root Directory: `web`**
- **Framework Preset: Next.js**
- **Output Directory:** leave on the framework default

Both are needed. Root Directory alone gets you from "serving the old static
site" to "failing to find a `public` directory".

### 2 · Environment variables

Settings → Environment Variables. Add to Production, Preview and Development:

| Variable | Where it comes from | Without it |
|---|---|---|
| `PAYLOAD_SECRET` | `openssl rand -base64 32` | Payload refuses to start |
| `POSTGRES_URL` | Neon integration, automatically | Site builds from the committed seed; `/admin` cannot connect |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob integration, automatically | Uploads fail in production |
| `NEXT_PUBLIC_SERVER_URL` | Your deployment URL | Admin links and CORS misbehave |

`PAYLOAD_SECRET` is the one nothing injects for you. Changing it later logs
everybody out.

### 3 · Neon

Storage → Create → Neon. Connect it to the project. It injects `POSTGRES_URL`
and its pooled variants automatically.

### 4 · Redeploy

The build runs, in order:

```
build-routes-if-present.mjs  regenerate the 76 country routes, or verify the
                             committed manifest when the repo root is not in
                             the build context
payload generate:importmap   keep the admin's component map current
migrate-if-configured.mjs    create or update the schema
next build                   91 pages
```

The first step matters because `tools/` lives above `web/`. With Root
Directory set, Vercel may upload only `web/`, and a build step reaching
outside it would fail. `web/data/routes.json` is committed and is what the app
reads, so the generator is a consistency check rather than a requirement.
Verified by building a copy of `web/` with nothing above it: 91 pages.

Verified against a fresh empty database: the migration creates 21 tables, then
the build generates 91 pages. A first deploy needs no manual database step.

If no database is configured the migrate step logs that it is skipping and the
site builds from `web/data/country-seed.json`. That is deliberate — the deploy
works before Neon is attached.

### 5 · Create the first user

Once deployed with a database, from your machine:

```bash
cd web
vercel env pull .env.local          # gets POSTGRES_URL and the rest
SEED_ADMIN_EMAIL=mission@amintl.org \
SEED_ADMIN_PASSWORD='choose-something-long' \
npm run seed -- --admin
```

That creates the 68 country records, 52 chapters, and one HQ account. Then log
in at `/admin`.

Payload also offers first-user creation through the admin itself the first time
it loads with an empty `users` table, if you would rather not run the script.

---

## Two projects point at this repository

`am-test-newsite` and `am-newwebsite` both build from `AsaDabola/AM_newwebsite`.
That is why there are two preview deployments per push, and it is an easy way
to end up looking at the wrong URL.

Pick one as the real project, set its Root Directory, and delete or disconnect
the other. Two projects on one repository means two sets of environment
variables to keep in step, and eventually one of them will drift.

---

## The static site at the repository root is now obsolete

`index.html`, `about/`, `network/`, `get-involved/` and the rest were the
hand-built static site. `web/` supersedes all of it.

Leaving both in place is what made this failure confusing — the old site is
still perfectly serveable, so a misconfiguration renders a real-looking page
instead of an obvious error.

Recommended, once the Vercel project is confirmed working from `web/`:

1. Move the static site to an `archive/` directory, or delete it — it is in git
   history either way
2. Keep `content-pack/`, `docs/`, `tools/` and `web/`
3. `wp-theme/` can go too, unless AM wants the WordPress option kept open

Not urgent, and not something to do in the same change as fixing the deploy.
But while both exist, a wrong Root Directory will keep producing a page that
looks fine and is entirely the wrong site.

---

## Migrations

`push` is off in production, so the schema only ever changes through a
migration. After changing a collection:

```bash
cd web
npm run migrate:create   # generates web/migrations/<timestamp>_<name>.ts
git add web/migrations && git commit
```

The migration is committed and runs on the next deploy. Never edit a migration
that has already run in production — add a new one.

`npm run migrate:status` lists what has and has not run.
