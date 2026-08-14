# How subdirectory sites work on Vercel

## The short answer: there is nothing to configure

This is the part that trips people coming from WordPress.

On WordPress, "subdirectory Multisite" is a **product feature**. You enable it,
it changes the database schema, it needs a specific server stack, and the
choice is permanent. It is a thing you set up.

On Vercel there is no such feature, because there is nothing to set up. A
"subdirectory site" is a **folder in the codebase**. `/africa/kenya/ke` is a
URL because a file exists that answers to it. That is the entire mechanism.

**It is already built and pushed.** Here is the actual mapping:

| File in the repo | URL it serves |
|---|---|
| `web/app/intl/page.tsx` | `amintl.org/intl` |
| `web/app/[region]/page.tsx` | `amintl.org/africa`, `/europe`, … 11 of them |
| `web/app/[region]/[country]/[code]/page.tsx` | `amintl.org/africa/kenya/ke`, … 75 of them |
| `web/next.config.mjs` | `amintl.org/` → 308 → `/intl` |

Three files serve 87 URLs. The square brackets are Next.js's dynamic segments —
one file handles every country, and `generateStaticParams()` tells the build
which 75 to render. That function reads `data/routes.json`, which is generated
from the mission country list.

So when you ask "how do I implement subdirectory sites on Vercel" the honest
answer is: **you already have. Vercel will deploy 87 static pages the moment
you connect the repo.** Nothing in the Vercel dashboard needs configuring — no
rewrites, no route rules, no multi-project setup.

### Adding country 76

```bash
# 1. add the entry to the country list
vim tools/content/countries.js

# 2. regenerate the manifest
node tools/content/build-routes.js

# 3. commit
git add data/routes.json tools/content/countries.js && git commit && git push
```

Vercel builds, and the new URL is live. No new files, no dashboard, no
provisioning. That is what "68 sites" costs on this stack.

---

## Payload does not create the sites

This is the second thing worth being clear about, because "via Payload?"
suggests Payload is the mechanism. It is not.

> **Routes come from the repo. Content comes from Payload.**

The 75 country URLs exist whether or not Payload is ever installed — they are
serving placeholder copy right now. Payload's job is to let 68 non-technical
people fill those pages in without touching Git.

| | Repo | Payload |
|---|---|---|
| Which URLs exist | ✅ | — |
| Region and country names, ISO codes | ✅ | — |
| The design, components, layout | ✅ | — |
| The inherited 90% — beliefs, pillars, journey | — | ✅ (HQ edits once) |
| The local 10% — chapters, leader, meeting times | — | ✅ (country edits) |
| News and photos | — | ✅ |
| Form submissions | — | ✅ |

A country page renders by joining the two: the route tells it *which* country,
Payload tells it *what to say*.

---

## The two pipelines — the thing to internalise

Your stated workflow is one pipeline:

```
Figma MCP → Claude Code → GitHub → Vercel → live
```

That is correct, and it is the **code** pipeline. There is a second one, and it
does not touch GitHub at all:

```
Country editor → Payload admin → Neon → revalidate → live
```

| | Code pipeline | Content pipeline |
|---|---|---|
| Who uses it | You, me, the designer | 68 country editors, HQ |
| Trigger | `git push` | Clicking Publish |
| Goes through GitHub | Yes | **No** |
| Causes a Vercel build | Yes — full rebuild | **No** — one page revalidates |
| Time to live | 1–2 minutes | seconds |
| What it changes | Design, routes, features | Words, photos, chapters |

**Why this matters:** if content lived in the repo, every one of 68 editors
would need a GitHub account and every typo fix would be a deploy. And Vercel's
free build minutes would not survive 68 people editing.

Equally: a content edit will never show up as a commit. Do not go looking for
one.

---

## The content model

Generated and committed at `data/country-seed.json` — 68 records covering 75
paths. Run `node tools/content/build-country-seed.js` to rebuild it.

```jsonc
{
  "entryNo": 13,
  "name": "Nigeria",
  "tier": "G20",
  "region": "Africa",
  "paths": ["/africa/nigeria/ng"],   // from the repo — not editable
  "languages": ["English"],

  "status": "draft",                  // the local ten per cent, from here down
  "standfirst": null,                 // 1 sentence, max 160 chars
  "startedYear": null,
  "contactEmail": null,               // required before publish
  "leaderName": null,                 // required before publish
  "leaderRole": null,
  "locale": null,                     // required before publish
  "chapters": [],                     // city, university, meeting time, email
  "photos": [],
  "owner": null                       // required before publish
}
```

Grouped entries are **one record serving several paths** — East Federal Africa
is a single thing to edit, answering six URLs:

```
East Federal Africa → /africa/kenya/ke  /africa/tanzania/tz  /africa/uganda/ug
                      /africa/rwanda/rw /africa/burundi/bi   /africa/south-sudan/ss
```

**Every one of the 68 is currently unpublishable**, and that is the correct
output — all of them are missing `contactEmail`, `leaderName`, `locale`,
`owner` and `chapters`. Those are exactly the six intake fields from
`content-pack/11-country-site-template.md` that AM still has to collect. The
seed script prints the list every time it runs, so the gap stays visible
instead of being discovered at launch.

**And one record has no URL at all:** entry 65, Rwanda. The East Federal Africa
group claimed `/africa/rwanda/rw` first. An unreachable record is a decision
waiting, not a site — either Rwanda belongs to the group, or it is standalone
and the group drops it.

### Payload collections

| Collection | Rows | Who may write |
|---|---|---|
| `countries` | 68 | HQ · region editor · that country's editor |
| `chapters` | 61+ | same, scoped to their country |
| `globals` | ~10 blocks | **HQ only** |
| `news` | grows | that country's editor, HQ |
| `pages` | the HQ site | HQ only |
| `submissions` | grows | nobody writes; HQ reads |
| `users` | ~80 | HQ only |

Access control is one function per collection:

```ts
// web/payload/access/countryScoped.ts
export const countryScoped: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === 'hq') return true;
  if (user.role === 'region') return { region: { equals: user.region } };
  return { id: { equals: user.country } };   // country editor
};
```

Returning an object rather than `true`/`false` makes Payload filter the query
itself, so a country editor's list view contains only their own country. They
cannot see other countries, let alone edit them.

`globals` uses `({ req: { user } }) => user?.role === 'hq'` and nothing else.
That is what stops 68 people editing the Statement of Faith — the requirement
that needed a custom plugin under WordPress Multisite.

### Joining the two in a page

```tsx
export default async function CountryPage({ params }) {
  const { region, country, code } = await params;
  const route = findRoute(region, country, code);      // from the repo
  if (!route) notFound();

  const payload = await getPayload({ config });
  const [content] = (await payload.find({
    collection: 'countries',
    where: { entryNo: { equals: route.entryNo } },      // from Payload
    limit: 1,
  })).docs;

  const globals = await payload.findGlobal({ slug: 'globals' });

  return <CountrySite route={route} content={content} globals={globals} />;
}
```

This runs **at build time**, not per request. Readers get static HTML from the
edge and never touch Neon — which is also why Neon's scale-to-zero cold starts
do not matter here.

---

## Your workflow, with the gaps filled in

What you described:

```
Figma MCP → Claude Code → GitHub → Vercel → live
```

What it should be:

```
Figma MCP → Claude Code → branch → PR → Vercel preview → review → merge → live
                                              ↑
                                    a real URL, per PR, free
```

The one change is **not pushing straight to `main`**. Vercel builds a preview
deployment for every branch automatically, on its own URL. With 75 country
pages and a live ministry site, seeing the change before it is public costs one
extra click and prevents the class of mistake that is very expensive to
explain.

Set `main` as the production branch, protect it, and merge through PRs.

---

## Getting to the first deploy

1. **Connect the repo to Vercel.** New Project → import
   `AsaDabola/AM_newwebsite` → set **Root Directory** to `web`. That last step
   is the one people miss — the Next app is not at the repo root.
2. **Deploy.** 87 pages build from `data/routes.json`. No database needed yet.
   Check `/intl`, `/africa`, `/africa/kenya/ke`.
3. **Add Neon** from the Vercel marketplace. Env vars are injected
   automatically. Use the **pooled** connection string.
4. **Install Payload** into `web/`, define the collections above, run the
   migration.
5. **Seed** from `data/country-seed.json` — 68 records, pre-filled with
   everything already known.
6. **Create the users.** One per country owner, once AM supplies the names
   (`content-pack/12-gaps.md`, item C3).
7. **Wire revalidation.** A Payload `afterChange` hook calls
   `revalidatePath(route.path)` so publishing updates one page in seconds.
8. **Point the domain.** `amintl.org` → Vercel. Do this last, and not in the
   same week as anything else.

Steps 1 and 2 work today. Nothing after step 2 is blocked by the Figma design,
and nothing before step 8 touches the live site.

---

## Traps

**Root Directory must be `web`.** Otherwise Vercel looks for a Next app at the
repo root, finds none, and the build fails with a confusing error.

**`dynamicParams = false` is deliberate.** It is set in the country route. An
unknown path returns 404 rather than trying to render a country that does not
exist. Remove it and typos become soft-404s that search engines index.

**Do not let content into the repo.** Once someone adds a country's text to a
`.tsx` file to "just get it live", the two pipelines merge and every edit
becomes a deploy. The 68-editor model dies quietly at that point.

**The build must fail on a bad route.** `npm run build` runs
`build-routes.js` first, which exits non-zero on a route problem. Keep it that
way — a broken URL should never reach production because a generator printed a
warning nobody read.

**Preview deployments are public by default** unless you turn on deployment
protection. Worth doing before the first PR carries real content.
