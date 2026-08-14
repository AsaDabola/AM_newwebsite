# Country site template

One design, sixty-eight instances. The designer draws this once; every country
gets the same frame with its own content poured in.

Read alongside `docs/60-country-architecture.md`, which covers the platform,
hosting and rollout, and `docs/country-list.md` for the countries themselves.
This file is only the copy frame.

---

## The rule that makes sixty sites possible

**Ninety per cent of a country site is inherited. Ten per cent is local.**

Country sites live at `amintl.org/{iso}/` — `/us/`, `/kr/`, `/br/`. The full
list of sixty-eight entries and their paths is in `docs/country-list.md`.

| Inherited from the main site | Local to the country |
|---|---|
| Who AM is, the four pillars | Which cities have chapters |
| Statement of Faith | Who leads here, and their email |
| The 5-Phase Bible study | When and where things meet |
| Ministries, journey steps | Local news and photographs |
| Navigation, footer, brand | The language it is written in |
| Giving | Local giving details, if any |

If a country team has to write the Statement of Faith, sixty-eight sites will
never launch. They write six fields and a paragraph. Everything else appears.

---

## /{iso}/ — the frame

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Eyebrow | AM {COUNTRY} | 12 | Ready |
| H1 | AM in {Country} | 15 | Ready |
| Standfirst | {One sentence the country team writes about the work here.} | 59 | Local |
| Fallback standfirst | AM chapters in {Country}, part of a worldwide community of students taking the Gospel across university campuses. | 113 | Ready |
| Stat 1 | {n} chapters | 12 | Auto |
| Stat 2 | {n} cities | 10 | Auto |
| Stat 3 | Since {year} | 12 | Local |
| Primary button | Find your chapter | 17 | Ready |
| Secondary button | Start a Bible study | 19 | Ready |

### Chapters here

| Slot | Copy | Chars | Status |
|---|---|---|---|
| H2 | Chapters in {Country} | 21 | Ready |
| Chapter card title | {City} | 6 | Auto |
| Chapter card campus | {University} | 12 | Local |
| Chapter card meeting | {Day, time} | 11 | Local |
| Chapter card contact | {email} | 7 | Local |
| Chapter card button | Get in touch | 12 | Ready |
| Single chapter variant | Our chapter in {City} | 21 | Ready |
| No chapter yet variant | We are just starting in {Country} | 33 | Ready |
| No chapter body | There is no chapter here yet. Tell us you are interested and we will connect you with the nearest team. | 103 | Ready |

### What happens here

| Slot | Copy | Chars | Status |
|---|---|---|---|
| H2 | What happens here | 17 | Ready |
| Standfirst | The same four steps, in {Country}. | 34 | Ready |
| Step 1–4 | Connect · Grow · Lead · Sent | 28 | Inherited |
| Note | Cards inherit from the main site; the country team may replace any one body with local wording. | 95 | — |

### Local leadership

| Slot | Copy | Chars | Status |
|---|---|---|---|
| H2 | Who leads here | 14 | Ready |
| Name | {Name} | 6 | Local |
| Role | {Role} | 6 | Local |
| Email | {email} | 7 | Local |
| Regional line | Part of AM {Region}, led by {Regional leader}. | 46 | Auto |

### News

| Slot | Copy | Chars | Status |
|---|---|---|---|
| H2 | From {Country} | 14 | Ready |
| Empty state | News from {Country} is coming. In the meantime, see what is happening across the network. | 89 | Ready |
| Button | All AM news | 11 | Ready |

### Closing

| Slot | Copy | Chars | Status |
|---|---|---|---|
| H2 | Join us in {Country} | 20 | Ready |
| Body | Come to a Bible study, visit a chapter, or write to the team here. | 66 | Ready |
| Button 1 | Get in touch | 12 | Ready |
| Button 2 | Give to this work | 17 | Ready |
| Back link | See the whole network | 21 | Ready |

---

## The intake form every country team fills in

This is the entire ask. Six required fields, five optional. If a country
returns only the required ones, the page still works.

**Required**

1. Country name, in English and in the local language
2. City or cities with a chapter
3. Contact email for the country
4. Name and role of whoever leads here
5. Region (one of the eight)
6. Language the site should be written in

**Optional — the page improves with each one**

7. One sentence about the work here (max 160 characters)
8. Year AM started in this country
9. University name per chapter
10. Meeting day and time per chapter
11. Two or three photographs

Do not launch a country page that has fewer than the six required fields. An
empty country page is worse than no country page — it tells a student the
chapter is dead.

---

## Design states the template must cover

The designer needs to draw all five, because all five will occur across the
sixty-eight country sites.

| State | When | What it looks like |
|---|---|---|
| **Full** | Multiple chapters, photos, local copy, news | The default design |
| **Single chapter** | One city only — this is most countries | H2 becomes "Our chapter in {City}"; the grid becomes one wide card |
| **No local copy** | Required fields only | Fallback standfirst, no photo band, inherited step cards |
| **No chapter yet** | A target country with no chapter | Interest form replaces the chapter grid |
| **Translated** | Non-English site | Same layout, longer strings — German and Spanish run 20–30% longer than English |

**The translation warning is the one that breaks layouts.** "Find your chapter"
is 18 characters; "Encuentra tu capítulo" is 21; "Finde deine Ortsgruppe" is 22.
Every button, nav item and card title must be drawn to survive +35% length. Do
not centre text in fixed-width buttons. The list also includes Arabic and
Hebrew, which read right to left — the layout needs to mirror, not just
re-flow.

---

## Language

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Switcher label | Language | 8 | Ready |
| Switch to main | Go to the global site | 21 | Ready |
| Machine translation note | This page was translated. Tell us if something reads wrong. | 59 | Needs AM |

**Needs AM.** A decision: are country sites translated by the country teams, by
a translation service, or left in English? Forty-eight languages appear across
the country list and only eighteen entries include English, so this is the
single biggest cost driver in the programme — and it changes the design, since
a language switcher either exists or does not. Recommendation is in the
architecture document.
