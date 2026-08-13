# web — the Next.js app

Deploys to Vercel. Static generation for every country page; the CMS and
database are documented in `docs/vercel-neon-stack.md`.

## Routes

```
/                        308 → /intl
/intl                    the international HQ site
/{region}                11 region indexes
/{region}/{country}/{code}   75 country sites
```

Paths come from `data/routes.json`, generated from the mission country list:

```
node tools/content/build-routes.js
```

It exits non-zero on a route problem — today it reports one, the
`/africa/rwanda/rw` collision between the East Federal Africa group and the
standalone Rwanda entry. `npm run build` runs it first, so a route problem
fails the build rather than shipping a broken URL.

## Local

```
cd web
npm install
npm run dev
```

## Status

Routing and static generation work. Components are placeholders holding the
copy from `content-pack/`, awaiting the Figma design — see
`docs/figma-handoff.md`.
