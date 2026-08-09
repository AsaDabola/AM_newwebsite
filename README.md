# AM International — new website

A redesign of [amintl.org](https://amintl.org) for Apostolos Missions International.

The layout follows the pattern used by Cru, InterVarsity and YWAM — utility bar,
sticky header with mega menu, full-bleed hero, audience-path cards, card grids, a
chapter finder, a give CTA and a fat footer — rendered in a dark, cinematic
"space" treatment with an **interactive globe** in the hero.

Everything ships as plain static HTML, CSS and JavaScript. No frameworks, no CDN,
no build step required to host it.

---

## Quick start

```bash
# serve locally (any static server works)
python3 -m http.server 8000
# then open http://localhost:8000
```

To regenerate the site after editing content:

```bash
node tools/build-pages.js        # rebuild all 20 HTML pages
node tools/build-placeholders.js # regenerate placeholder artwork
node tools/build-globe-data.js   # regenerate globe geometry (rarely needed)
```

Node 18+ is the only requirement, and only for the generators — the committed
HTML runs anywhere.

---

## How the site is put together

```
index.html, 404.html, about/, what-we-do/, get-involved/, …   generated HTML
assets/css/main.css        design system + all styles
assets/js/globe.js         interactive globe + starfield
assets/js/globe-data.js    generated land geometry (do not hand-edit)
assets/js/main.js          nav, drawer, reveals, counters, filters, accordions
assets/fonts/              self-hosted Archivo + Inter (no Google Fonts call)
assets/img/                placeholder artwork + favicon
tools/site.js              <head>, header, mega menu, drawer, footer, NAV data
tools/build-pages.js       page content — edit copy here, then rebuild
```

**Edit content in `tools/build-pages.js`, not in the generated `.html` files.**
The generator exists so the header, footer and navigation cannot drift apart
across 20 pages; it rewrites every page and prunes any page it no longer
generates. Hand edits to the HTML will be overwritten on the next build.

Navigation lives in one place: the `NAV` array in `tools/site.js` drives the
header mega menu, the mobile drawer and the footer columns together.

---

## Brand colours

All six brand values sit in one block at the top of `assets/css/main.css`:

```css
--brand-blue:        #1449c6;  /* primary: header, buttons, headings, rules */
--brand-blue-deep:   #0f39a0;  /* hover / pressed */
--brand-blue-bright: #4d8df6;  /* on dark: links, globe arcs, highlights */
--brand-navy:        #0a0f5c;  /* deep navy section background */
--brand-space:       #050a2e;  /* deepest background, behind the globe */
--brand-mist:        #f1f3f7;  /* light grey section background */
```

These were sampled by eye from screenshots of the current site (royal blue
header, deep navy media band, light grey panels). **If you have the official
brand hex codes, replace them here** — everything else on the site derives from
these six values.

The globe has its own colour block at the top of `assets/js/globe.js`, keyed to
the same palette.

---

## The globe

`assets/js/globe.js` draws a draggable, auto-rotating Earth on a 2D canvas using
an orthographic projection — no WebGL, no dependencies, roughly 70 KB of geometry.

- Land is a precomputed dot matrix (7,293 points) derived from Natural Earth
  data via the `world-atlas` package; the continent outlines are drawn over it.
- Great-circle arcs radiate from the headquarters marker to each location, with
  a travelling pulse.
- Drag to spin, arrow keys to rotate, hover a marker for its label. It pauses
  when scrolled off screen or the tab is hidden, and does not auto-spin for
  visitors who have "reduce motion" set.

Regenerating the geometry needs `tools/land-110m.json`, which is committed.

---

## Before this goes live

Everything below is a stand-in that needs real AM content. Search the codebase
for `PLACEHOLDER` to find them all.

### Content

| What | Where | Notes |
|---|---|---|
| Chapter directory | `CHAPTERS` in `tools/build-pages.js` | Only **AM Harvard** and **AM @ UCLA** are real — the other ten are invented so the search filter could be tested. **Replace before launch.** |
| Globe markers | `MISSION_POINTS` in `assets/js/globe.js` | Placeholder cities. Trenton (HQ) and Los Angeles (origin) are real; the rest are illustrative. |
| Statement of faith | `about/beliefs/` | Two articles are quoted from the current site; three are empty placeholders. |
| Four Spiritual Themes | `what-we-do/four-spiritual-themes/` | All four themes are placeholders. |
| Bible Study Program phases | `what-we-do/bible-study/` | The programme description is real; the five phase breakdowns are placeholders. |
| AM Academy courses | `academy/` | Course list is placeholder. |
| Leadership | `about/leadership/` | Three real people (Alma Osorio-Ford, Rev. Dr. Paul DeVries, Can Liu); the fourth card is a placeholder slot. |
| Event details | `EVENTS` in `tools/build-pages.js` | Event names and dates are from the current homepage; venues and registration links still needed. |
| News articles | `news/` | Three real headlines from the current site; three placeholders. Links do not resolve to articles yet. |
| Giving links | `give/` | Not wired to a payment platform. |
| Contact details | `SITE` in `tools/site.js` | Confirm the postal address, add a phone number, and check `info@amintl.org` is right. |
| Social links | `footer()` in `tools/site.js` | All four point at `#`. |

Copy taken from the current amintl.org is marked `[SOURCED]` in
`tools/build-pages.js`. Everything else is written to make the layout reviewable
and should be reviewed by AM before publishing.

### Assets

- **Logo** — the `AM / INTERNATIONAL` lockup in the header and footer is a CSS
  reconstruction using Archivo, not the official file. Drop the real logo into
  `assets/img/logo.svg` and swap the markup in `tools/site.js`.
- **Favicon** — `assets/img/favicon.svg` is likewise a reconstruction.
- **Photography** — every image is generated abstract artwork. Replace the files
  in `assets/img/` with real photography, keeping the same filenames and aspect
  ratios (16:10 for cards, 1:1 for people, 4:5 for the Winter portrait); or swap
  the `.svg` extensions for `.jpg` in `tools/build-pages.js` and rebuild.
- **Homepage video** — the Media section has an image with a play button where
  the current site's video sits. Wire it to the real video.

### Wiring

- The newsletter and contact forms are inert — they validate and show a notice
  saying nothing was sent. Point them at a real handler
  (`initForms()` in `assets/js/main.js`).
- The chapter search filters the list on the page; it does not hit a backend.
- Set the production origin in `SITE.origin` (`tools/site.js`) so canonical URLs,
  Open Graph tags and `sitemap.xml` are correct.
- There is no language switcher yet; the current site has one.

---

## What has been checked

Verified in headless Chromium against the built site:

- 20 pages, 2,066 internal links — no broken links.
- Every page has exactly one `<h1>`, a title, a meta description, and `alt` on
  every image.
- Mega menu opens on hover, closes on Escape, and navigates on click; mobile
  drawer opens and its groups expand; chapter filter and empty state work;
  accordion expands; globe responds to dragging.
- No console errors, page errors or failed requests.
- Scroll reveals fire for all 28 animated blocks at 1440×900 and 390×844.

Not yet checked: real screen-reader passes, Safari and Firefox rendering, and
Lighthouse scores against production hosting.

---

## Accessibility and performance notes

- Fonts are self-hosted and preloaded; the page makes no third-party requests.
- All motion respects `prefers-reduced-motion` — reveals, counters and the
  globe's auto-spin all stand down.
- The globe is keyboard-operable and carries a text description.
- The site is fully readable with JavaScript disabled; only the globe and the
  reveal animations depend on it.
- There is a print stylesheet.
