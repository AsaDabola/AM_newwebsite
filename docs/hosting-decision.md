# Hosting decision — Vercel, Lightsail, Cloudways, WordPress

Four options were on the table. Two of them cannot run what AM has decided to
build, and that settles most of the argument before cost or speed comes into
it.

**Decision: Cloudways**, on DigitalOcean or Vultr, 4 GB to start, **hybrid
stack** (not the default), with Cloudflare in front on the free tier.

---

## First, the four are not the same kind of thing

This matters, because comparing them directly produces a nonsense answer.

| Option | What it actually is |
|---|---|
| **WordPress** | The software AM is already committed to — the CMS, not a host. As a *hosted service*, WordPress.com is a specific product with specific limits |
| **Cloudways** | Managed hosting that runs WordPress for you, on top of DigitalOcean, Vultr, Linode, AWS or Google Cloud |
| **AWS Lightsail** | A plain virtual server. You install and run everything on it yourself |
| **Vercel** | A platform for JavaScript frontends. It does not run PHP |

So the real question is: *which of these can host a 68-site WordPress
Multisite network, and which of those is best?*

---

## The compatibility screen — this eliminates two

The architecture (`docs/60-country-architecture.md`) is WordPress Multisite in
subdirectory mode: `amintl.org/us/`, `/kr/`, `/br/`, 68 of them, with staff
editing in wp-admin.

| Option | Runs WordPress? | Runs Multisite? | Subdirectory mode? | Verdict |
|---|---|---|---|---|
| **Cloudways** | Yes | Yes | Yes, documented | **Viable** |
| **AWS Lightsail** | Yes | Yes | Yes | **Viable** |
| **WordPress.com** | Yes | **No** | — | **Eliminated** |
| **Vercel** | No | No | — | **Eliminated** |

### Why WordPress.com is out

Multisite is not available on WordPress.com, on any plan including Business.
Each plan covers one site. There is no configuration that produces 68 country
sites — the product does not do it. Multisite requires self-hosted WordPress on
a third-party host.

(WordPress VIP, Automattic's enterprise tier, is a different product and is
priced in the thousands per month. Not proportionate here.)

### Why Vercel is out

Vercel runs Node.js and static files. It does not officially support PHP, and
WordPress is PHP. Community workarounds exist — a third-party PHP runtime, and
an experimental "ServerlessWP" project that puts WordPress into serverless
functions with a file-based database — but neither is a supported production
platform for a network of 68 sites with 68 editors.

The one real Vercel architecture is **headless**: WordPress hosted somewhere
else as a content API, with a Next.js frontend on Vercel. That means:

- You still pay for WordPress hosting. Vercel is *added* cost, not alternative cost
- Editors lose "edit the page, look at the page" — previews go through a build
- Someone has to maintain a custom frontend forever
- Every one of the 68 country sites becomes a routing problem in code

For a volunteer-run ministry with no in-house developer, that is the wrong
trade. Vercel is a good product being asked to do a job it is not for.

**Where Vercel would earn its place:** if AM ever decides staff editing matters
less than speed and cost, this repository's static generator (`tools/`) already
builds the whole site with no dependencies, and Vercel would host it for
roughly nothing. Keep it on the shelf; do not buy it now.

---

## Cost

The real comparison is Cloudways versus Lightsail.

### Sticker price

| | Cloudways | AWS Lightsail |
|---|---|---|
| Entry | $11/mo (DigitalOcean 1 GB), $8.25/mo billed annually | $3.50/mo IPv6-only, $5/mo with an IPv4 address |
| 2 GB | $28/mo | ~$12/mo |
| 4 GB · 2 vCPU — **the realistic starting size** | ~$50–55/mo · confirm at checkout | $20/mo |
| 8 GB · 2 vCPU | higher tier | $44/mo |
| Backups | Included, one-click restore | You configure and test them |
| Staging | Included, one click | You build it |
| TLS | Automatic, auto-renewing | You configure certbot |
| Support | 24/7, WordPress-literate | Infrastructure only, not WordPress |

**A watch-out on Lightsail:** included data transfer is halved in Mumbai,
Sydney and Jakarta. A $12 plan gives 3 TB in US-East but 1.5 TB in Mumbai for
the same money. Given where this audience is, region choice has a real cost.

### Three-year cost of ownership

Sticker price is the smaller half. The larger half is who does the work.

| | Cloudways | Lightsail |
|---|---|---|
| Hosting, 36 months at the 4 GB tier | ~$1,900 | ~$720 |
| Server patching, WordPress core/plugin updates, backup verification, TLS, monitoring | Included | ~3–5 hours/month |
| Those hours at a modest $40/hr contractor rate | $0 | ~$4,300–7,200 |
| **Three-year total** | **~$1,900** | **~$5,000–7,900** |

Lightsail is cheaper on the invoice and roughly three times the cost in
reality. The $30/month gap buys back several hours a month, every month.

And the hours are not the worst of it. The genuine risk in a volunteer-heavy
ministry is that the one person who configured the server moves on, and nobody
else knows how it was set up. Managed hosting is insurance against that, and
it is cheap insurance.

### For reference, what Vercel would have cost

$20 per seat per month on Pro, 1 TB of transfer included, $0.15/GB over — *on
top of* WordPress hosting, which you would still need. It is not a saving.

---

## Speed

The honest answer surprises people: **for AM's readers, the host barely
matters. The cache does.**

Almost all of this traffic is anonymous — a student in Nairobi or Manila
reading a page. With Cloudflare caching HTML at the edge, those readers never
reach the origin server at all. They are served from a data centre near them,
and Cloudways versus Lightsail makes no measurable difference to what they
experience.

Where the origin genuinely matters:

| Traffic | Cached at the edge? | Origin speed matters? |
|---|---|---|
| Anonymous readers — the overwhelming majority | Yes | No |
| The 68 country editors in wp-admin | Never — logged-in requests bypass cache | **Yes, a lot** |
| Forms: giving, contact, prayer, sign-ups | No | Yes |
| Cache misses and first requests after an edit | No | Yes |

So origin performance is really about **editor experience** — 68 people around
the world working in wp-admin. Cloudways' stack (their tuned PHP, Redis object
cache, and Breeze/Varnish layer) is materially better than a stock Lightsail
install out of the box, and getting Lightsail to the same place is exactly the
sysadmin work priced above.

**Cloudflare goes in front either way, on the free tier.** It is the single
biggest performance win available for an audience in Africa, South-East Asia
and Latin America, and it costs nothing. Any comparison of raw origin latency
that ignores it is measuring the wrong thing.

**Vercel's edge network is genuinely faster** for a static or Next.js
frontend — that is what it is built for. It just cannot be reached from here
without going headless, and Cloudflare in front of WordPress closes most of the
gap for cached pages.

---

## The decision

**Cloudways**, because:

1. **It is one of only two options that can run the architecture at all.**
2. **It is cheaper over three years** once the work is counted, by roughly
   three times.
3. **Speed for readers is a Cloudflare question, not a host question**, and
   speed for the 68 editors favours Cloudways' tuned stack.
4. **It fails safely.** Automated backups, one-click restore, one-click
   staging, and 24/7 WordPress-literate support. A 68-site network run by
   volunteers needs all four.
5. **It is not a lock-in.** Cloudways runs on DigitalOcean, Vultr, Linode, AWS
   and Google Cloud. If AM outgrows it, the underlying server is standard
   WordPress and moves normally — including to Lightsail.

### What to buy

| | |
|---|---|
| Provider | Cloudways |
| Cloud | DigitalOcean or Vultr — Vultr has more edge locations, DigitalOcean is the better-trodden path |
| Size | **4 GB RAM, 2 vCPU** to start. Resize in place if it needs more |
| Region | Closest to the largest audience. New York or London for AM today |
| Stack | **Hybrid — not Lightning.** See the warning below |
| CDN | **Cloudflare, free tier**, with HTML page caching turned on |
| Billing | Monthly at first. Move to annual once it is proven |

### Two things that will break this if missed

**1. The stack must be Hybrid, not Lightning.** Cloudways' default Lightning
stack (Nginx-only) does not support subdirectory Multisite — the required
configuration cannot be applied because there is no `.htaccess`. Subdirectory
Multisite needs the Hybrid stack. Set this before installing anything.

**2. Enabling Multisite on a Cloudways application is permanent, and the
subdomain/subdirectory choice cannot be reversed.** AM has chosen
subdirectories. Whoever clicks the button must select **subdirectory**. There
is no undo, only a rebuild.

### Sequence

1. Provision the Cloudways server, Hybrid stack
2. Migrate the current amintl.org across and confirm it is stable — **on its
   own, before anything else changes**
3. Point Cloudflare at it, enable HTML caching, verify cache hit rates
4. Only then enable Multisite (subdirectory) and start Wave 0

Never move hosting and launch a redesign in the same week. Two changes at once
means every problem has two suspects.

---

## What would change this decision

| If this became true | Then |
|---|---|
| AM hires or has a permanent sysadmin | Lightsail becomes defensible — the labour cost disappears |
| Staff editing in wp-admin stops mattering | Static generation + Vercel or Cloudflare Pages, at near-zero cost |
| The network grows past ~200 sites, or traffic outgrows one server | Move up to a managed WordPress specialist (Kinsta, WP Engine) or a load-balanced setup |
| The other nine fellowships adopt the shared platform | Revisit as one procurement — ten networks changes the negotiating position |

Worth reviewing at twelve months. Not before — changing hosts is not free, and
the first year's job is proving the platform, not optimising its bill.

---

## Sources

Pricing and capability checked August 2026. Figures marked "confirm at
checkout" were not verifiable directly — cloudways.com is unreachable from this
environment, so those came from secondary reporting.

- [Cloudways pricing](https://www.cloudways.com/en/pricing.php)
- [Cloudways pricing, secondary reporting](https://www.g2.com/products/cloudways/pricing)
- [Cloudways: how to set up WordPress Multisite](https://support.cloudways.com/en/articles/5126435-how-to-set-up-a-wordpress-multisite-on-cloudways)
- [Cloudways Multisite hosting](https://www.cloudways.com/en/wordpress-multisite-hosting.php)
- [Amazon Lightsail pricing](https://cloudburn.io/blog/amazon-lightsail-pricing)
- [Amazon Lightsail pricing, secondary](https://www.cloudzero.com/blog/amazon-lightsail-pricing/)
- [Vercel pricing](https://kuberns.com/blogs/vercel-pricing/)
- [Vercel community PHP runtime](https://github.com/vercel-community/php)
- [Headless WordPress on Vercel — limits](https://gautamkhorana.com/blog/vercel-for-wordpress-headless/)
- [WordPress.com Business plan features](https://wordpress.com/support/plan-features/business-plan/)
- [WordPress.com forum: Multisite on Business plan](https://wordpress.com/forums/topic/does-wordpress-com-business-plan-support-multi-site-and-other-features/)
- [WordPress Multisite — Advanced Administration Handbook](https://developer.wordpress.org/advanced-administration/multisite/)
