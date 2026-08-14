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

| You see | Vercel is serving |
|---|---|
| A 404 with AM navigation and "This page went on mission" | the repo root, static |
| A Payload login form | `web/`, correctly |
| `Cannot find module` or a build error mentioning `payload` | `web/`, but a config problem |

---

## Full deploy checklist

### 1 · Root Directory

Settings → Build and Deployment → **Root Directory: `web`**

This is the whole fix for the 404. Do it first and redeploy before changing
anything else.

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
build-routes.js            regenerate the 76 country routes
payload generate:importmap keep the admin's component map current
migrate-if-configured.mjs  create or update the schema
next build                 91 pages
```

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
