# Figma to live site — the implementation path

**The server makes no difference to this.** Cloudways and Lightsail run the
identical WordPress theme, byte for byte. Nothing about the Figma design, the
markup, the CSS or the templates changes based on which one you buy.

That is worth stating plainly because it removes a dependency: **the design and
the theme work can start now**, before hosting is bought, and neither is
blocked by the other.

What the host affects is where the finished theme gets uploaded, and how easily
it gets backed up when something goes wrong. Nothing upstream of that.

---

## What actually determines the implementation work

```
Figma design
   ↓  design tokens          ← the handoff that matters
CSS custom properties
   ↓
WordPress theme  ─────────→  identical on Cloudways or Lightsail
   ↓  Multisite
68 country sites
```

The two real dependencies are **the design tokens** and **the component
inventory**. Everything else follows from them. Which is why the section below
is the most time-sensitive thing in this document — the designer is working
now, and what she does or does not put in the file decides whether the theme
takes a week or a month.

---

## What already exists

There is a working WordPress theme in this repository at
`wp-theme/am-international/`, version 1.0.1:

| | |
|---|---|
| Templates | 30 PHP files — full hierarchy, home, pages, posts, search, 404 |
| Custom post types | `am_chapter`, `am_event`, `am_ministry`, with archives and singles |
| Design system | `assets/css/main.css`, 20 sections, all colour/type/space driven by CSS custom properties |
| Fonts | Archivo and Inter, self-hosted as woff2, licences included |
| The globe | `assets/js/globe.js`, zero dependencies, reads chapter data |
| Admin | Customizer options, custom nav walker, meta boxes |

This is not a prototype to throw away. It is the machine the Figma design gets
poured into.

### Two routes, and the recommendation

| | **Refit the existing theme** · recommended | Rebuild from the Figma file |
|---|---|---|
| Work | Replace tokens, restyle components, add new ones | Everything from zero |
| Time | Roughly 2–3 weeks | Roughly 6–10 weeks |
| Risk | Low. The templates, post types and admin already work | High. Re-solving problems already solved |
| When it is wrong | If the new design is structurally unlike anything here | — |

Refit unless the design turns out to be structurally incompatible — different
page architecture, not just different looks. Judge that when the first three
Figma frames land, not in advance.

---

## What to ask the designer for

Send this list now. Each item is something that costs an hour in Figma and a
week if it arrives late or not at all.

### 1 · Design tokens as Figma variables — not flat values

This is the single highest-value item. The theme's CSS is already fully
tokenised, so if her variables map to the token names, applying the design is
mostly a find-and-replace. If she hands over flat hex values scattered across
frames, someone reverse-engineers a system from screenshots.

Ask for Figma **variables** (not styles) in these collections, named to match:

| Figma collection | Maps to | Existing tokens |
|---|---|---|
| Colour / Brand | `--brand-*` | `--brand-blue`, `--brand-blue-deep`, `--brand-blue-bright`, `--brand-navy`, `--brand-space`, `--brand-mist` |
| Colour / Surface | `--surface-*` | `--surface-space`, `--surface-navy`, `--surface-panel`, `--surface-sand`, `--surface-paper` |
| Colour / Text | `--text-*` | `--text-ink`, `--text-muted`, `--text-on-dark`, `--text-on-dark-muted` |
| Colour / Line | `--line-*` | `--line-dark`, `--line-light`, and their `-soft` variants |
| Type / Size | `--fs-*` | `--fs-eyebrow`, `--fs-sm`, `--fs-base`, `--fs-lg`, `--fs-xl`, `--fs-h4`, `--fs-h3`, `--fs-h2`, `--fs-h1` |
| Space | `--sp-*` | `--sp-1` (4px) through `--sp-9` (96px), plus `--section-y` |
| Radius, shadow | `--shadow-*` | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| Layout | `--container` | `1200px` content, `1400px` wide |

She does not have to keep the current values — those are hers to change. She
has to keep the *shape*: six brand colours, nine type sizes, a 4px-based space
scale.

**Type sizes are fluid, not fixed.** `--fs-h1` is
`clamp(2.5rem, 5vw + 1rem, 5rem)` — 40px on a phone, 80px on a desktop, smooth
in between. Ask her for the **minimum and maximum** of each size, not one
number. Fixed pixel sizes at one artboard width will not survive contact with
real screens.

### 2 · Components, not fifty-four page mockups

The content pack (`content-pack/`) reduces the site to six page patterns. She
should design the **components**, then assemble a handful of pages from them —
not draw every page.

The inventory, from the content pack:

| Component | Where it appears |
|---|---|
| Header + mega menu + mobile drawer | Every page |
| Hero with the globe | Homepage, network |
| Journey card (numbered, 01–04) | Homepage, Get Involved |
| Action card (title, body, button) | Every journey step |
| Feature card (photo, tagline, body) | Ministries, news |
| Stat block | Homepage, country pages |
| Stepper, horizontal and vertical | Bible study phases, growth stages |
| Accordion | Statement of Faith, FAQs |
| Timeline | History |
| Person card | Leadership |
| Chapter card | Network, country pages |
| Search and filter bar | Network |
| Pull quote and verse band | About, What We Do, journey steps |
| Give band | Foot of most pages |
| Newsletter inline form | Footer, homepage |
| Form fields, buttons, errors | Contact, prayer, giving |
| Next-step band | Journey steps |
| Footer | Every page |
| Empty states, 404, 500 | Everywhere |

Every one of these has its copy written and character-counted already, so she
can design to real text rather than lorem ipsum. Point her at
`content-pack/10-global-components.md` for the shared ones.

### 3 · Every component in its states

For each interactive component: **default, hover, focus, active, disabled,
loading, error**. Focus especially — it is the one designers skip and the one
that fails accessibility review. If she does not define it, the theme falls
back to a browser default that will not match her work.

### 4 · Real breakpoints

The theme's existing breakpoints, which she should design to:

`560px` · `700px` · `800px` · `900px` · `1000px` · `1280px`

Minimum: frames at **390px, 768px and 1440px** for every page pattern. A design
that exists only at 1440px is half a design, and more than half this audience
is on a phone.

### 5 · The five country-page states

`content-pack/11-country-site-template.md` specifies five, and all five will
occur across 68 sites: **full**, **single chapter**, **no local copy**, **no
chapter yet**, **translated**. Ask for all five as frames. The "no chapter yet"
state applies to 43 of the 68 countries — it is not an edge case, it is the
majority.

### 6 · Text that grows by a third

Translated strings run 20–35% longer than English. "Find your chapter" is 18
characters; "Encuentra tu capítulo" is 21; "Finde deine Ortsgruppe" is 22.

Ask her to test every button, nav item and card title at **+35% length**. Do
not centre text in fixed-width buttons. And the list includes Arabic and
Hebrew — if those are in scope, the layout must **mirror**, not just re-flow.

### 7 · Assets, exported properly

| Asset | Format | Note |
|---|---|---|
| Logo | **SVG**, plus mono and reversed variants | Still outstanding — `12-gaps.md` item A1 |
| Icons | SVG, one sprite | No icon fonts |
| Photography | Named aspect ratios, not fixed pixel sizes | The theme generates responsive sizes |
| Illustration | SVG where possible | |

Ask for the **ratios** she designed to — 16:9, 4:3, 1:1 — because WordPress
crops to ratios, not to her artboard.

### 8 · Interaction specs in writing

The content pack has an **Interaction** note under every section. She should
either confirm those or replace them. What is needed in writing: what moves,
how far, how long, and what happens at `prefers-reduced-motion: reduce` — the
theme already honours that setting and the design has to say what it degrades
to.

---

## The pipeline, once the design lands

1. **Tokens first.** Her variables become the `:root` block in
   `assets/css/main.css`. One file. If the tokens are right, the whole site
   shifts to the new design in a single commit, and everything after that is
   refinement.
2. **Components next**, in the order they appear on the homepage. Header,
   hero, journey cards, then down the page.
3. **Templates after that.** Most already exist; new patterns from the content
   pack — stepper, timeline, accordion, country page — get added.
4. **Country template last**, because it depends on every component above it.
5. **Then Multisite**, and the shared-content layer.

Steps 1–4 are host-independent. Step 5 is where the server finally matters.

---

## What can start today, and what waits

| Now, no dependencies | Waits |
|---|---|
| Designer works from the content pack | — |
| Send her the token/component spec above | — |
| Theme refit begins the moment tokens land | Full styling waits on components |
| Content gaps collected (`12-gaps.md`) | — |
| Country intake forms sent to owners | — |
| Translations commissioned | Waits on the language decision |
| — | Multisite build waits on the server |

The only thing genuinely gated on hosting is step 5. Everything else can run in
parallel with buying it, and should.

---

## Traps

**Do not let her design in Elementor's shape.** The current site is built in
Elementor and the new theme is hand-coded. If frames are drawn as
Elementor-style stacked sections with baked-in spacing, they will be rebuilt
twice. She should design a component system.

**Do not accept a design with no empty states.** Forty-three country sites will
launch with no chapters, no news and no photos. If the design only works when
full, most of the network will look broken on day one.

**Do not let the character counts drift.** Every string in the content pack is
counted. If a headline is redrawn at 80 characters where the copy is 48, one of
the two has to give — and it is cheaper to catch that in Figma.

**Do not skip the focus states.** Retro-fitting keyboard accessibility across
20 components costs several days and looks like an afterthought, because it is.
