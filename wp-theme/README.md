# AM International — WordPress theme

A custom WordPress theme carrying the same design as the static site in the
repository root. The CSS, JavaScript, fonts, images and the interactive globe
are **the same files** — only the page structure is rebuilt as PHP templates.

Staff edit pages, news, events, chapters and ministries in the normal WordPress
admin. No page builder, no plugins required, and no external requests: fonts and
scripts are served from the theme.

---

## Installing

1. Zip the theme folder:

   ```bash
   cd wp-theme
   zip -r am-international.zip am-international
   ```

2. In WordPress: **Appearance → Themes → Add New → Upload Theme**, choose the
   zip, then **Activate**.

Activating registers the Chapters, Events and Ministries menus in the sidebar
and flushes permalinks automatically.

> Install this on a **staging site first**. See "What has and has not been
> tested" at the bottom — the templates have been rendered and checked offline,
> but they have not run against a real WordPress database.

---

## Setting it up after activation

### 1. Front page

If the current homepage was built with Elementor, you do **not** need to change
anything: the theme reasserts its own homepage over a page builder. Elementor's
"Full Width" page template and Elementor Pro's Theme Builder both replace
`front-page.php`, which would otherwise leave you looking at the old homepage
wrapped in the new header and footer.

To hand the front page back to Elementor, untick **Customize → AM homepage →
Hero + globe → Use the AM homepage design**.

The rest of this section still applies if you would rather point the homepage at
a fresh page:


**Settings → Reading → Your homepage displays → A static page.** Set *Homepage*
to a page called Home (any page — the template ignores its content) and *Posts
page* to a page called News.

### 2. Menus

**Appearance → Menus.** The theme uses seven locations:

| Location | What it drives |
|---|---|
| Primary | The header mega menu and the mobile drawer |
| Utility bar | Small links above the header |
| Homepage quick links | The four cards under the hero |
| Footer columns 1–4 | The four footer link lists (the menu's own name becomes the column heading) |
| Footer legal links | The small print row at the very bottom |

**The Primary menu is three levels deep:**

```
Who We Are            ← top level: becomes the button in the header
  The ministry        ← second level: becomes a column heading
    Who we are        ← third level: becomes a link in that column
    Mission statement
  People
    Leadership & staff
```

A top-level item with no children renders as a plain link (that is how
"Our Network", "News" and "Contact Us" behave).

**The promoted panel** on the right of a mega menu comes from the top-level
item's **Description** field. It is hidden by default — open **Screen Options**
at the top of the Menus screen and tick *Description*. Fill it in and the panel
appears; leave it empty and the columns use the full width. The *Title
Attribute* field, in the same place, sets the panel's link text.

**Quick links:** each item's Description becomes the supporting line. To set the
icon, tick *CSS Classes* in Screen Options and add one of:
`am-icon-pin`, `am-icon-book`, `am-icon-users`, `am-icon-heart`,
`am-icon-globe`, `am-icon-send`.

### 3. Homepage copy

**Appearance → Customize → AM homepage.** Every band has its own section: hero,
Bible Study Program, Connect/Grow/Lead/Sent, mission, media, the Ralph D. Winter
band, the give band and the newsletter.

Each band hides itself when its heading is left empty, so you can switch parts
of the homepage off without touching code.

**Connect / Grow / Lead / Sent** are four ordinary Pages you pick in the
Customizer. Each card uses that page's title, excerpt and featured image — so
you edit the page and the card follows.

### 4. Contact details, social links and the header button

**Appearance → Customize → Contact, social & header button.** Address, email,
the footer blurb, the utility-bar tagline, three social URLs, and the label and
link for the blue button in the header.

### 5. Chapters (and the globe)

**Chapters → Add New.** Each chapter has:

- **City / state** — shown under the name in the finder
- **Marker label** — the tooltip on the globe, e.g. "Campus chapter"
- **Latitude / Longitude** — put the chapter on the globe

To get coordinates: right-click the spot in Google Maps; the first item on the
menu is the latitude and longitude — paste the two numbers in.

The globe's connecting arcs radiate from whichever chapter has "Headquarters"
in its Marker label. Chapters with no coordinates still appear in the finder,
they just are not plotted. **If no chapter has coordinates yet, the globe falls
back to its built-in sample markers** — so it never looks broken, but it also is
not showing your real data until you fill them in.

### 6. Events

**Events → Add New.** *Display date* is free text as it should read
("April 4–5"). *Sort date* orders the list and hides events once they are past.
*Registration link* is optional; when set, the homepage chip links straight to it.

### 7. Ministries

**Ministries → Add New.** *Card label* is the small tag on the card
("Fellowship", "Training", …).

### 8. Newsletter

**Customize → Newsletter → Form action URL.** Paste the form URL from Mailchimp
or whichever provider AM uses. Leave it blank and the form politely says it is
not connected rather than silently losing addresses.

---

## Featured images

Every card falls back to the bundled abstract artwork when a post has no
featured image, so the grids never show a broken frame. Set featured images as
you add real photography and the placeholders disappear on their own.

Image sizes the theme generates: `am-card` (800×500), `am-feature` (1200×800),
`am-square` (600×600), `am-portrait` (640×800).

---

## Changing the colours

All six brand values are at the top of
`am-international/assets/css/main.css`:

```css
--brand-blue:        #1449c6;
--brand-blue-deep:   #0f39a0;
--brand-blue-bright: #4d8df6;
--brand-navy:        #0a0f5c;
--brand-space:       #050a2e;
--brand-mist:        #f1f3f7;
```

The globe has a matching block at the top of `assets/js/globe.js`.

---

## The logo

The header and footer currently render the `AM / INTERNATIONAL` lockup as
styled text, reconstructed from the current site. To use the real logo file:
**Customize → Site Identity → Logo**. When a logo is set the theme uses it
instead of the text version automatically.

---

## Files

```
am-international/
  style.css              theme header + WordPress-specific overrides
  functions.php          bootstrap
  header.php footer.php  chrome
  front-page.php         homepage
  page.php single.php    pages and news articles
  index.php search.php 404.php
  archive-am_chapter.php archive-am_event.php archive-am_ministry.php
  single-am_*.php
  searchform.php
  inc/
    setup.php            theme supports, menus, image sizes
    enqueue.php          styles, scripts, globe marker injection
    template-tags.php    icons, logo, cards, page headers
    nav-walker.php       mega menu + drawer walkers
    post-types.php       chapters, events, ministries + meta boxes
    customizer.php       all homepage copy settings
  template-parts/
    home/                hero, quicklinks, stages, media, finder
    global/cta-band.php  give band + newsletter
    content/             shared single view for the custom types
  assets/                css, js, fonts, images (shared with the static site)
```

---

## Development

`render-preview.php` renders the theme to static HTML using a stub
implementation of the WordPress API, so the templates can be checked without a
WordPress install:

```bash
php wp-theme/render-preview.php
# writes wp-theme/preview/*.html and runs 28 assertions
```

It exits non-zero if any assertion fails, so it works as a pre-commit check.

---

## What has and has not been tested

**Verified** (PHP 8.4 + headless Chromium, against the stub-rendered output):

- All 29 PHP files pass `php -l`.
- 28 render assertions pass: every homepage band, the mega menu (columns,
  feature panel, plain top-level links), the mobile drawer, quick links, stage
  cards, media list, events row, chapter finder, footer columns, and balanced
  `div`/`li`/`ul`/`section` tags.
- Globe markers are built from Chapter records, the Headquarters chapter is
  placed first so the arcs radiate from it, and chapters without coordinates
  are correctly skipped.
- The rendered homepage is visually identical to the static build.
- Mega menu opens on hover; the chapter finder filters.

**Not tested** — needs a real install:

- Anything touching the database: saving meta boxes, the Customizer UI,
  permalinks and rewrite rules for the custom post types.
- The block editor, including the editor stylesheet.
- oEmbed for the Media section video.
- Multilingual plugins. The current site has a language switcher; the theme is
  translation-ready (text domain `am-international`) but has not been tested
  with WPML or Polylang.
- Any interaction with plugins already on the live site.
