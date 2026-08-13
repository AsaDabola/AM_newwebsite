# Global components

Everything that repeats. Design these once and they carry every page, including
the sixty country sites.

---

## Navigation

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Logo alt text | AM International | 16 | Ready |
| Nav 1 | About | 5 | Ready |
| Nav 2 | What We Do | 10 | Ready |
| Nav 3 | Get Involved | 12 | Ready |
| Nav 4 | Network | 7 | Ready |
| Nav 5 | News | 4 | Ready |
| Nav CTA | Give | 4 | Ready |
| Country switcher label | Region | 6 | Ready |
| Mobile menu open | Menu | 4 | Ready |
| Mobile menu close | Close | 5 | Ready |
| Skip link | Skip to content | 15 | Ready |

### Dropdown contents

| Parent | Children |
|---|---|
| About | Who We Are · What We Believe · Our History · Leadership |
| What We Do | Four Pillars · Bible Study · AM Academy · Ministries |
| Get Involved | Connect · Grow · Lead · Sent · Volunteer · Give |
| Network | Find a chapter · Start a chapter · Country sites |

**Interaction.** Dropdowns open on hover on desktop and on tap on touch. A
parent that has its own page must still be reachable — clicking "About" when
the dropdown is already open goes to `/about/`, it does not close the menu. This
is the single most common navigation bug in ministry sites.

Five items plus a Give button. The current site has more; five is the limit
before people stop reading the bar.

---

## Footer

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Tagline | One who is sent on a mission by God | 35 | Ready |
| Column 1 heading | About | 5 | Ready |
| Column 2 heading | Get Involved | 12 | Ready |
| Column 3 heading | Network | 7 | Ready |
| Column 4 heading | Connect with us | 15 | Ready |
| Address | 716 Bellevue Ave., Trenton, NJ 08618, USA | 41 | Ready |
| Email | mission@amintl.org | 18 | Ready |
| Phone | +1 (917) 569-9073 | 17 | Ready |
| Newsletter prompt | News from the chapters, once a month. | 37 | Ready |
| Newsletter button | Subscribe | 9 | Ready |
| Affiliations | Member of the World Olivet Assembly and the World Evangelical Alliance | 70 | Ready |
| Copyright | © {year} Apostolos Missions International | 41 | Ready |
| Legal 1 | Privacy | 7 | Needs AM |
| Legal 2 | Terms | 5 | Needs AM |

**Needs AM.** A privacy policy and terms page. The site collects email
addresses, prayer requests and volunteer applications; in the EU and the UK —
where AM has chapters in London, Paris, Frankfurt, Madrid, Dublin, Amsterdam
and Warsaw — a privacy policy is a legal requirement, not a nicety.

---

## The give band

Appears at the foot of every page except `/give/` and the form pages.

| Slot | Copy | Chars | Status |
|---|---|---|---|
| H2 | Send someone | 12 | Ready |
| Body | Your giving puts a Bible teacher in front of a student who is asking questions. | 79 | Ready |
| Button | Give to the mission | 19 | Ready |
| Secondary link | Other ways to help | 18 | Ready |

---

## Forms — shared microcopy

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Required marker | Required | 8 | Ready |
| Optional marker | Optional | 8 | Ready |
| Error, empty required | This one is needed. | 19 | Ready |
| Error, bad email | That does not look like an email address. | 41 | Ready |
| Error, submit failed | Something went wrong. Try again, or email mission@amintl.org. | 61 | Ready |
| Submitting state | Sending… | 8 | Ready |
| Consent checkbox | Send me AM news by email. | 25 | Ready |
| Privacy line under forms | We use your details to reply to you. Nothing else. | 50 | Ready |

---

## Error and empty states

| Slot | Copy | Chars | Status |
|---|---|---|---|
| 404 H1 | This page has moved on | 22 | Ready |
| 404 body | The link is old or the page has gone. Try the chapter finder, or start from the beginning. | 90 | Ready |
| 404 button 1 | Go home | 7 | Ready |
| 404 button 2 | Find a chapter | 14 | Ready |
| 500 H1 | Something broke | 15 | Ready |
| 500 body | Not your fault. Try again in a moment. | 38 | Ready |
| Search empty | Nothing matched that. | 21 | Ready |
| List empty | Nothing here yet. | 17 | Ready |
| Offline | You are offline. | 16 | Ready |

---

## Accessibility strings

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Globe aria-label | Interactive map of AM chapters worldwide | 40 | Ready |
| Globe fallback | A list of all chapters is below the map. | 40 | Ready |
| Menu button aria-label | Open the main menu | 18 | Ready |
| Video play label | Play video | 10 | Ready |
| Video caption note | Captions available | 18 | Needs AM |
| External link note | Opens amacademy.org | 19 | Ready |
| Carousel prev / next | Previous · Next | 15 | Ready |

**Rule for the designer.** Every interactive element on this site needs a
non-interactive equivalent in the same page. The globe has a list. The stepper
has all five phases in the HTML. The accordion has "Open all". This is not
optional decoration — a large share of AM's audience is on slow connections in
countries with chapters, and the interactive layer will not always load.

---

## Brand tokens carried forward

From the current amintl.org, unchanged.

| Token | Value | Used for |
|---|---|---|
| Royal blue | `#1449c6` | Primary brand, buttons, links |
| Deep blue | `#0f39a0` | Hover, pressed |
| Bright blue | `#4d8df6` | Accents, globe points |
| Navy | `#0a0f5c` | Headings on light |
| Space | `#050a2e` | Globe background, dark bands |
| Mist | `#f1f3f7` | Section backgrounds |

**Needs AM.** The official logo as SVG, and confirmation of the exact brand
hex codes. The values above were sampled from screenshots of the live site and
are close, not authoritative. The designer should not build a palette on
sampled colours.
