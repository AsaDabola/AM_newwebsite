# The Vercel stack — and whether you need Neon

Short answer on Neon: **not to give 75 sites different content — that already
works with no database.** You need one eventually so 68 country teams can edit
their own sites, because people who are not developers cannot edit content that
lives in a Git repository. Until AM has collected their intake data there is
nothing for them to edit, so it can wait.

---

## First, what choosing Vercel actually decides

**Vercel means dropping WordPress.** Vercel runs JavaScript, not PHP. There is
no configuration in which wp-admin ends up on Vercel.

That is not a contradiction of the earlier hosting comparison. That comparison
asked "which host runs WordPress Multisite best", and Vercel failed because it
cannot run WordPress at all. Change the premise — no WordPress — and Vercel
becomes a strong answer. It is the same reasoning, with a different input.

So the decision on the table is not really a hosting decision. It is this:

| | WordPress on Cloudways | Next.js on Vercel |
|---|---|---|
| Who edits content | Anyone who can use wp-admin | Anyone, **once a CMS is built on top** |
| Who maintains it | A WordPress admin | **A developer. Permanently.** |
| Shared content across 68 sites | A custom plugin — about a week of work | Native. One record, read everywhere |
| Speed | Good, with Cloudflare | Excellent, by default |
| Cost | ~$50–55/mo | ~$20–60/mo |
| Design fidelity to Figma | Constrained by the theme layer | Exact |
| If the developer leaves | The site keeps running, editable | The site keeps running; **changes stop** |

The last row is the real cost, and it is worth naming plainly once: this stack
is better on almost every axis and it converts AM's website from something a
volunteer can maintain into something that needs a developer. If AM has that
person, Vercel is the better build. If AM does not, WordPress was the safer
one.

Everything below assumes AM has decided to go ahead.

---

## Do you need Neon?

### Not for different content per site

Worth separating, because it is the most common confusion: **different content
on 75 pages does not require a database.** That is what a build does.

It is already working. `data/country-seed.json` is committed to the repo, and
`web/lib/content.ts` reads it. Today:

| | |
|---|---|
| Country URLs rendering | 75 |
| With chapters pre-filled from the current site | 37 pages, 52 chapters |
| Rendering the "no chapter yet" state | 38 pages |
| Databases involved | **none** |

`/north-america/united-states/us` lists 18 chapters. `/oceania/australia/au`
lists Sydney. `/europe/austria/at` says "We are just starting in Austria."
Different content, different design states, no Neon.

If AM were content for a developer to edit that JSON, you would never need a
database at all.

### You need it for *who edits*, not for *whether it differs*

Vercel has no database of its own. Vercel Postgres *is* Neon underneath —
Vercel resells it through their marketplace. So the question is not "does the
content differ per site" — it does already — but "who changes it".

Work through what the site actually has to store:

| Content | Needs a database? |
|---|---|
| The inherited 90% — who AM is, beliefs, pillars, Bible study | **No.** It changes rarely and could live in the repo |
| 68 country records, each with 11 local fields | **Yes**, if country teams edit them |
| Chapters — city, campus, meeting time, contact | **Yes**, same reason |
| News and stories per country | **Yes** |
| Contact, prayer requests, newsletter, volunteer applications | **Yes** — these are writes from the public |
| Country intake submissions | **Yes** |
| 68 editor accounts with per-country permissions | **Yes** |

Every one of those could live in the repo — except the last two rows. Public
form submissions have to be written somewhere at runtime, and 68 editor
accounts need authentication and authorisation. The moment non-technical people
in 48 languages each change their own page and nobody else's, you need a
database.

**So: yes, eventually. But not yet, and that is the useful part.**

Right now **zero of the 68 countries are publishable** — every one is missing
`contactEmail`, `leaderName`, `locale` and `owner`. There is nothing for 68
editors to edit, because AM has not collected the intake fields yet
(`content-pack/12-gaps.md`, items C3 and C4).

So the sequence is:

1. **Now** — build and launch on repo content. No Neon, no Payload, no cost.
   Pilots go live on the data AM already has.
2. **When intake data starts arriving** — add Neon and Payload, seed from
   `data/country-seed.json`, hand each country its login.
3. `web/lib/content.ts` is the seam. `getCountryContent()` swaps from JSON to a
   Payload query and no page component changes.

Deferring costs nothing and removes a dependency from the critical path. Adding
it early buys an empty CMS.

### But the database is the easy part

The real decision is what sits on top of it. Writing your own admin UI on raw
Neon means building a CMS, and that is months of work you do not need to do.

| Option | Database | Cost at 68 editors | Verdict |
|---|---|---|---|
| **Payload CMS** — self-hosted in the same Next.js app | Neon Postgres | Free (MIT licence) + Neon | **Recommended** |
| Sanity, Contentful, Storyblok — hosted | None needed | Per-seat, and 68 seats is where these get expensive | Viable, watch the bill |
| Strapi — self-hosted | Postgres | Free, but a separate service to deploy | Extra moving part |
| Roll your own admin | Neon | "Free", then months of work | No |

**Recommendation: Payload CMS on Neon.** Reasons, in order of weight:

1. **It runs inside the same Next.js app.** One repository, one deploy, one
   Vercel project. Not a second service to host and secure.
2. **Per-document access control is a first-class feature.** A country editor
   scoped to their own country is a few lines of config — which is precisely
   the requirement the spreadsheet's Plan sheet states, and the thing that took
   a custom plugin under WordPress Multisite.
3. **No per-seat pricing.** 68 editors costs the same as one. With hosted CMSs
   it does not.
4. **MIT licensed, free to self-host.** Note that Payload Cloud sign-ups were
   paused after Figma acquired Payload in 2025, so self-hosting is the path for
   new projects — which is what we want here anyway.

### The shared-content problem solves itself here

Under WordPress Multisite, the fact that 90% of every country site is inherited
content needed a custom network plugin — the single most important week in that
plan. On this stack it is just data modelling: one `Globals` collection holds
the inherited blocks, every country page reads them, and a country can override
a block with a local field. That is an afternoon, not a week.

That is a genuine argument in favour of the pivot, and it is worth putting on
the scale against the developer-dependency cost above.

---

## The stack

```
Vercel                  hosting, CDN, builds, previews
  └── Next.js 15        App Router, static generation for all 75 country pages
        └── Payload CMS admin UI at /admin, access control per country
              └── Neon   serverless Postgres — content, users, submissions
Cloudflare or Vercel    DNS
Resend / Postmark       transactional email for forms
Vercel Blob or S3       image and media storage
```

---

## Setup, in order

### 1 · Neon, through the Vercel marketplace

Add Neon from the Vercel dashboard rather than signing up separately. The
integration injects `DATABASE_URL` and the pooled variants into every
environment automatically, which removes the most common configuration mistake.

**Use the pooled connection string.** Serverless functions open a connection
per request, and unpooled Postgres runs out of connections quickly under any
real traffic. Neon's pooler exists for exactly this and the integration
provides it — use `DATABASE_URL` with `-pooler` in the host, not the direct
one.

**Watch scale-to-zero.** Neon suspends an idle database and the first request
after that pays a cold start. Fine for an admin UI, bad for a public page —
which is another reason every country page is statically generated and never
touches the database at request time.

### 2 · Payload, in the same app

Install Payload with the Postgres adapter into `web/`. Collections to define:

| Collection | Holds | Who can edit |
|---|---|---|
| `countries` | The 68 entries and their 11 local fields | HQ, region editor, that country's editor |
| `chapters` | City, campus, meeting time, contact — related to a country | Same |
| `globals` | The inherited blocks: beliefs, pillars, journey steps | **HQ only** |
| `news` | Stories, related to a country | That country's editor, HQ |
| `pages` | The HQ site's own pages | HQ only |
| `submissions` | Contact, prayer, newsletter, volunteer, intake | Nobody edits; HQ reads |
| `users` | Editors, each with `role` and `country` | HQ only |

Access control is one function per collection: a country editor may read
anything and write only rows where `country === user.country`. Region editors
match on region. HQ matches everything. `globals` refuses everyone but HQ —
which is what stops 68 people from editing the Statement of Faith.

Seed `countries` from `tools/content/countries.js`, which already holds all 68
entries with ISO codes, tiers, regions and languages.

### 3 · Routes — already built, see below

### 4 · Publishing

Country pages are statically generated. When an editor publishes, Payload fires
a webhook that calls `revalidatePath()` for that country only. One page
rebuilds in seconds; the other 74 are untouched. Readers always hit static
files at the edge, and never the database.

### 5 · Forms and email

Form posts go to Next.js route handlers, write to `submissions`, and send
notification email through Resend or Postmark. Do not use a third-party form
service — prayer requests are sensitive, and `content-pack/09-contact.md`
promises they are read by AM staff only.

---

## The URL structure — built and verified

Specified: `amintl.org/{region}/{country}/{code}`, HQ at `amintl.org/intl`.

Generated by `tools/content/build-routes.js` from the country list:

| | |
|---|---|
| Routes | **76** |
| Unique paths | **75** |
| Regions | **11** |
| Examples | `/africa/kenya/ke` · `/south-america/brazil/br` · `/southeast-asia/vietnam/vn` |

Full table in `docs/routes.md`; machine-readable manifest at `data/routes.json`.

Grouped entries expand nicely under this shape: Kenya, Tanzania, Uganda,
Rwanda, Burundi and South Sudan each get their own URL and all resolve to the
East Federal Africa site. Same for the Colombia group.

### Three things this surfaced

**1 · A genuine path collision.** `/africa/rwanda/rw` is claimed twice — by the
East Federal Africa group (entry 10) and by Rwanda as a standalone additional
country (entry 65). Two sites cannot own one URL. Decide which, and the
generator will stop reporting it. Currently the group wins and entry 65 is
dropped.

**2 · The country code is redundant.** `/africa/kenya/ke` — the `ke` adds no
information that `kenya` did not already carry, and a third path segment
slightly dilutes how search engines weight the page. Built as specified, since
it is your call, but worth knowing: `/africa/kenya/` would rank marginally
better and read more cleanly. If you want the code as a stable permalink, a
redirect from `/ke` to the full path gives you both.

**3 · Regions had to be assigned.** The spreadsheet only gives regions for the
M40 block. The G20 and additional entries had none, so they are assigned in
`REGION_BY_COUNTRY` in `tools/content/routes.js` — including one region name
the source never needed, **North America**. Two are judgement calls worth your
review: **Turkey** is filed under Middle East and North Africa, and **Russia**
under Commonwealth of Independent States. Change them in that one file and
every route updates.

**And one consequence of `/intl`:** the bare domain now redirects there with a
308. All of amintl.org's existing search authority sits on `/`, and a permanent
redirect carries most of it across — but not instantly, and not all of it.
Keeping the HQ site at `/` would avoid the cost entirely. Built as you asked.

---

## Cost

| | Monthly |
|---|---|
| Vercel Pro | $20 per seat |
| Neon | Free tier: 100 CU-hours, 0.5 GB storage. Launch when it outgrows that: ~$19 |
| Payload CMS | $0 — MIT licence, self-hosted |
| Resend / Postmark | $0–20 |
| Media storage | A few dollars |
| **Total** | **~$20–60** |

Cheaper than Cloudways and considerably faster. The cost that does not appear
on this table is the developer.

---

## What carries over from the work so far

| Asset | Carries over? |
|---|---|
| The content pack — 582 copy slots | **Yes, entirely.** Copy is platform-neutral |
| `tools/content/countries.js` — 68 entries | **Yes.** Seeds the CMS |
| The design system in `assets/css/main.css` | **Yes.** Custom properties port to any framework |
| `assets/js/globe.js` — the interactive globe | **Yes**, wrapped as a React component. Zero dependencies |
| Fonts, licences, SVG assets | Yes |
| `wp-theme/am-international/` — 30 PHP templates | **No.** Retired |
| WordPress Multisite plan, shared-content plugin | **No.** Solved natively instead |
| The hosting comparison's conclusion | Superseded — its premise was WordPress |

Roughly three-quarters of the work stands. The PHP templates are the loss, and
they were always the most replaceable part.

---

## To push the Figma design

Send the Figma MCP code and it goes into `web/app/` and `web/components/`. What
makes that go fast:

- **Design tokens as Figma variables**, mapped to the names in
  `docs/figma-handoff.md`. They become CSS custom properties or a Tailwind
  theme, and the whole site shifts in one commit.
- **Components rather than page mockups** — the 19-component inventory in
  `docs/figma-handoff.md`.
- **The five country-page states.** 43 of 75 countries launch with no chapter,
  so the "no chapter yet" state is the majority case, not an edge case.

The routing and static generation are already in place, so incoming components
have real pages to land on — 75 country URLs, 11 region indexes and `/intl` all
build today.

---

## Sources

- [Neon pricing and free tier](https://neon.com/pricing)
- [Neon free tier limits, 2026](https://agentdeals.dev/vendor/neon)
- [Neon serverless driver and connection pooling](https://neon.com/docs/connect/connection-pooling)
- [Vercel pricing](https://vercel.com/pricing)
- [Payload CMS pricing and self-hosting](https://www.buildwithmatija.com/payload-cms-pricing)
- [Payload CMS hosting on Vercel](https://www.buildwithmatija.com/payload-cms-hosting)
- [Payload Postgres adapter](https://payloadcms.com/docs/database/postgres)
- [Next.js App Router — generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
