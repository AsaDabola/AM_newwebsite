# The country website platform — architecture, hosting and rollout

Written against `Fellowship_Websites_Status_60_Countries.xlsx`. The country
data from that spreadsheet now lives in `tools/content/countries.js` and is
rendered as a reference in `docs/country-list.md`.

---

## The decision, in short

| Question | Answer |
|---|---|
| URL structure | `amintl.org/{iso}/` — **subdirectories**, AM's decision |
| Platform | **Stay on WordPress.** Multisite in subdirectory mode |
| Shared content | A global-content layer, so inherited copy is written once |
| Fellowship platform | One network per fellowship, all on the same codebase |
| Hosting | **Cloudways**, with Cloudflare in front |
| Language | Translate the frame per language, not per country |
| Rollout | Three pilots, then four waves |

---

## What the list actually says

The spreadsheet is not sixty countries. It is:

| Tier | Entries |
|---|---|
| G20 mission countries | 20 |
| M40 mission countries | 44 |
| Additional priority or replacement | 4 |
| **Total entries** | **68** |

Two entries are country groups sharing one site — Colombia covers Colombia,
Venezuela, Ecuador and Panama; East Federal Africa covers Kenya, Tanzania,
Uganda, Rwanda, Burundi and South Sudan. So the entries span **75 distinct
countries** and **76 ISO paths**.

**Decision needed.** Sixty-eight sites, or seventy-five? A grouped entry means
one site serving four or six countries. Either is defensible; the platform has
to be told which. The rest of this document assumes 68 sites and 76 paths, with
the grouped paths resolving to one site — that is what the spreadsheet
describes.

### Against AM's existing chapters

| | Count |
|---|---|
| Target countries | 75 |
| Countries where AM has a chapter today | 40 |
| On both lists | 32 |
| Target countries with no chapter yet | 43 |
| **Chapters in countries NOT on the target list** | **8** |

Those eight are **Bolivia, Uruguay, Zimbabwe, Ireland, China, Macao, Cambodia
and Laos**. AM has real chapters in all of them and the target list gives them
no site. That needs an answer before launch — either add them, or decide
explicitly that they are served from the global `/network/` page.

### Languages

Forty-eight distinct languages appear across the list. Only eighteen entries
include English. This is the largest single cost in the programme and it is
covered below.

### What already exists

Eleven entries already have a fellowship site. For AM specifically that is
**Japan (amjapan.org)** and **South Korea (amkorea.org)** — both on their own
domains, outside amintl.org. A migration decision is needed for each: fold them
into `/jp/` and `/kr/`, or leave them and redirect. Latin America's
`latin.amintl.org` is a third case.

---

## Subdirectories, not subdomains

The spreadsheet's Plan sheet specifies "60 standardized country subdomains…
`us.domain.org`, `kr.domain.org`". **AM has chosen subdirectories instead**, so
the platform is being built as `amintl.org/us/`, `amintl.org/kr/`.

Recording the trade-off, because it will come up again:

| | Subdirectory `amintl.org/kr/` | Subdomain `kr.amintl.org` |
|---|---|---|
| Search authority | Inherits the main domain's authority — a strong advantage for new country sites | Treated as a separate site; each one starts from zero |
| TLS | One certificate | Wildcard certificate needed |
| Setup | Simpler | Needs wildcard DNS |
| Separation | Shares the domain's reputation, good and bad | Fully independent |
| Moving a country off later | Harder | Trivial |

Subdirectories are the better choice for exactly the reason that matters here:
forty-three of these countries have no chapter and no audience yet, and they
will rank far sooner sharing amintl.org's authority than starting their own.
The ISO-code convention from the spreadsheet is kept — only the separator
changes.

**One thing to check before building:** two-letter ISO paths must not collide
with existing page slugs. `/in/`, `/it/`, `/is/` and `/no/` are the ones to
watch. Nothing in the current 54-page site collides, but the check belongs in
the launch list.

---

## The platform

### WordPress Multisite, subdirectory mode

The Plan sheet is explicit about what is wanted:

> Each country has its own website, language, content, and managers, while
> technology and maintenance remain centralized.

That sentence describes WordPress Multisite. One WordPress core, one set of
plugins, one theme, one server — and sixty-eight sites on it, each with its own
content, its own language and its own editors who cannot see each other's work.

```
amintl.org                    main site — the HQ website
├── /us/                      subsite
├── /kr/                      subsite
├── /br/                      subsite
└── … 65 more
```

The Plan sheet's "two separate website systems" maps onto this cleanly: the HQ
website is the network's main site; the country platform is the other
sixty-eight.

| | |
|---|---|
| **Own editors per site** | Native. A country editor sees only their country |
| **Own language per site** | Native. Each subsite has its own locale |
| **Centralised maintenance** | One core, one plugin set, one theme, updated once |
| **Adding a country** | Create the site from a template — minutes |
| **Local independence** | A country can add its own pages without a developer |
| **Backups and migration** | Harder than a single site. Real, and manageable |
| **The catch** | Shared content is not shared. Solved below |

### The shared-content layer — the piece that makes it work

Multisite's weakness is that sixty-eight sites means sixty-eight copies of
anything shared. From `content-pack/11-country-site-template.md`, roughly
**ninety per cent of a country site is inherited content**: who AM is, the
Statement of Faith, the four pillars, the 5-Phase Bible study, Connect · Grow ·
Lead · Sent.

Without a shared layer, the first edit to the Statement of Faith is a
sixty-eight-site job, and it will not get done.

The fix is a small network plugin that:

1. Keeps the inherited blocks on the main site, edited once
2. Renders them into every subsite at page-render time
3. Lets a country **override** any single block with local wording
4. Never lets a country **edit** the shared original

So a country editor opens their site and sees their eleven local fields plus a
list of inherited sections they can optionally override. HQ edits the Statement
of Faith once and it changes in sixty-eight places.

This is the difference between a platform and sixty-eight websites. It is
perhaps a week of work and it is the most important week in the plan.

### The alternative that was considered

A single site with a Country custom post type — sixty-eight entries, one
template — is simpler to build and simpler to host. It was rejected on one
requirement: *"each country manages only its assigned website"*. Per-country
editing boundaries on a custom post type require a permissions plugin and are
fragile; on Multisite they are how the software already works.

If the country pages ever turn out to need less independence than the Plan
sheet assumes, the custom post type remains the simpler answer and the content
model here would port to it directly.

---

## The fellowship dimension

The spreadsheet covers ten fellowships — AM, YEF, YD, Jubilee, Creatio, GNIT,
Veritas, SLS, CLF, OTM — against the same country list, with two tracks:

> Design track: develop a distinct frontend design concept for each fellowship.
> System track: different frontend designs, but the same standardized backend.

**Recommendation: one Multisite network per fellowship, all ten running the
same codebase.**

```
shared codebase  ─┬─→  AM network        amintl.org        + 68 country sites
(theme framework, ├─→  YEF network       yefi.org          + 68 country sites
 platform plugin, ├─→  Jubilee network   jubileeworld.org  + 68 country sites
 country template)└─→  … seven more
```

Each fellowship gets a child theme — its own colours, type and layout — over
one shared parent. Same backend, different frontends, exactly as specified.

Why not one network for all ten fellowships and 680 sites? Because a single
network means a single failure, a single upgrade window, and ten ministries
negotiating every change. Ten networks on one codebase gives the same
engineering economy with none of the coupling. YEF already has eleven country
sites live under `yefi.org/xx/` — subdirectories, and evidence that the
pattern works.

**AM's job is its own network.** The shared codebase is a by-product of doing
AM's properly, and it is what makes fellowship number two cheap.

---

## Hosting

| | **Cloudways** · recommended | **AWS Lightsail** |
|---|---|---|
| What it is | Managed hosting over DigitalOcean, Vultr, Linode or AWS | A plain virtual server you administer |
| Multisite | Supported, documented | Works, you configure it |
| Realistic monthly cost | $30–90 for a 68-site network | $20–60, plus staff time |
| Server patching | Included | Yours |
| Backups | Automatic, one-click restore | You configure and test them |
| Staging | One click | You build it |
| TLS | Automatic renewal | You configure certbot |
| Scaling | Resize in place | Snapshot, rebuild, repoint |
| Support | 24/7, WordPress-literate | Infrastructure only |

**Recommendation: Cloudways.** For a sixty-eight-site network run by a
volunteer-heavy team, managed hosting is not a luxury. The price gap is roughly
$30 a month; the gap in staff time is hours every month, plus the risk that the
one person who configured the server moves on.

**Cloudflare in front, on the free tier.** Most of this audience is in Nairobi,
Manila, Lagos and Lima. Edge caching is the single largest performance gain
available, and it costs nothing.

**Sizing.** Sixty-eight subsites is not sixty-eight times the load — it is one
WordPress serving more pages. Start at roughly 4 GB RAM and 2 vCPU and watch it.
Multisite's real cost is database tables, not traffic: about nine tables per
site, so around 620 extra tables. That is unremarkable for MySQL and worth
knowing before someone opens phpMyAdmin and panics.

**Do not migrate hosting and launch the redesign in the same week.** Move
first, confirm stability, then deploy. Two changes at once means every problem
has two suspects.

---

## Language

Forty-eight languages across the list. Only eighteen entries include English.
This is the biggest cost in the programme, and the place where a plan quietly
fails.

**Recommendation: translate the frame, not the sites.**

The inherited ninety per cent is one body of text. Translated into a language,
it serves every country using that language — Spanish covers Colombia, Mexico,
Spain, Argentina, Chile, Peru, the Dominican Republic and Guatemala from one
translation. Each country then supplies its local ten per cent in its own
language: a paragraph and a handful of fields.

| Approach | Translation jobs | Verdict |
|---|---|---|
| English only | 0 | Fine for pilots. Not viable across 48 languages |
| **Frame per language + local fields per country** | ~20 frames + 68 short | **Recommended** |
| Full site per country | 68 full sites | Will not be maintained |
| Machine translation everywhere | 0 | Stopgap only, and only if labelled |

Roughly twenty translations cover the great majority of the list. The long tail
— Kinyarwanda, Malagasy, Fiji Hindi, Romansh — launches in the country's
working language and improves later.

**Two rules that are not negotiable.** Never machine-translate the Statement of
Faith. And label any machine-translated page as such — the copy for that label
is in `content-pack/11-country-site-template.md`.

Multisite handles this natively: each subsite has its own locale. Add
**Polylang** or **WPML** only where a single country needs more than one
language — Canada, Switzerland, Belgium, South Africa, India. That is a handful
of sites, not sixty-eight.

**Decide before the template is built.** Retrofitting translation costs several
times what designing for it does.

---

## Who can edit what

| Role | Can | Cannot |
|---|---|---|
| Network administrator (HQ) | Everything | — |
| Regional editor | Every country in their region | Global pages, the shared blocks |
| Country editor | Their own country's fields, chapters, news | Any other country, the template, the shared blocks |
| Contributor | Draft news for their country | Publish |

The shared blocks being uneditable by country editors is the whole safety
argument for the shared-content layer. Sixty-eight editors and a globally
editable Statement of Faith is not a risk worth carrying.

AM's eight regional leaders are already named in `content-pack/02-about.md`.
Regional editors are what stops HQ becoming the bottleneck for sixty-eight
countries — the same bottleneck the single Trenton inbox already is.

---

## Search

Sixty-eight near-identical sites is the shape search engines penalise. Four
things prevent it:

1. **Real local content on every site.** The six required intake fields from
   `content-pack/11-country-site-template.md` are the minimum that makes a
   country distinct. Do not publish a site that has less.
2. **`hreflang` across language versions**, so the Spanish and English pages
   are understood as the same page rather than as competitors.
3. **One sitemap per subsite, plus a network index.**
4. **Every chapter as a real link in the HTML**, not only a point on the globe
   canvas.

Subdirectories help here — every country site inherits amintl.org's existing
authority instead of starting from nothing.

---

## Rollout

Sixty-eight sites is not a one-day build. It is three pilots and four waves.

### Wave 0 — Foundations · ~3 weeks
- Multisite provisioned on the new host, subdirectory mode, TLS, Cloudflare
- The country template built: eleven local fields, the inherited sections
- The shared-content layer built and tested across two subsites
- Roles created; a country editor's permissions verified by trying to break them
- The site-creation script: one country in, one configured subsite out
- **Exit test:** a country site is created from data alone, in under five minutes

### Pilots — three countries · ~2 weeks
The Plan sheet asks for pilots, and it is right. Pick three that stress
different things:
- **United States** — most chapters, English, the highest-traffic case
- **South Korea** — an existing standalone site to migrate, non-Latin script
- **East Federal Africa** — a grouped entry, six countries, four languages

If the platform survives those three it will survive the rest.
**Exit test:** a country editor in each pilot edits their own site unaided.

### Wave 1 — G20 · ~4 weeks
The twenty G20 mission countries. Frame translations commissioned for the
languages they need.

### Wave 2 — M40 with chapters · ~4 weeks
The M40 entries where AM already has a chapter — real content exists, so these
launch full rather than empty.

### Wave 3 — the remainder · ongoing
Everything left, launched in the template's "no chapter yet" state: honest
about being new, with an interest form that collects the contacts which become
chapters.

**The critical path is not the software.** It is the six intake fields from
sixty-eight country owners, and the translations. Both can start the day the
list is settled — neither waits for the platform.

---

## Open decisions

| # | Decision | Blocks | Owner |
|---|---|---|---|
| 1 | 68 sites or 75? Do grouped entries get one site or one each | The site-creation script | Leadership |
| 2 | The 8 chapter countries not on the list — add, or serve from `/network/` | Wave 2 | Leadership |
| 3 | amjapan.org and amkorea.org — fold in, or redirect | The Korea pilot | Leadership |
| 4 | latin.amintl.org — fold in, or keep separate | Wave 1 | Leadership |
| 5 | Which ~20 languages get a translated frame | Wave 1 | Leadership |
| 6 | A named owner per country | The pilots | Regional leaders |
| 7 | Cloudways or Lightsail | Wave 0 | Leadership |
| 8 | Is this AM's network only, or the shared platform for all ten fellowships | Scope and budget | Leadership |

Decisions 1, 5 and 8 stall the programme. The rest can be settled while
building.

---

## What can be automated once the decisions land

Already in this repository and directly reusable:

- `tools/content/countries.js` — all 68 entries, ISO codes, tiers, languages
- `tools/content/build-country-list.js` — renders the reference table
- `tools/content/chapters.js` — 61 chapters, geocoded, by region
- `tools/content/build-chapter-import.js` — generates a WordPress import file
- `wp-theme/am-international/inc/post-types.php` — the `am_chapter` type
- `tools/build-globe-data.js` — the globe's point data, from the same source

The gap between this and sixty-eight live sites is the site-creation script:
read `countries.js`, create a subsite per entry, set its locale, seed it with
the inherited content, assign its editor, and register its chapters. Written
once, it makes wave 3 a command rather than a project — and it is why the
country data was put in a machine-readable file rather than a document.
