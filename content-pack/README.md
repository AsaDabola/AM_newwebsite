# AM International — content pack for the redesign

This is the copy your designer pours into the Figma layouts. Every string is
written to length, in slot order, so nothing has to be invented at design time
and nothing has to be cut to fit afterwards.

All of it comes from the current amintl.org. It has been condensed — the same
message in a third of the words — and restructured for a site that moves rather
than a site you scroll.

## How to read a page file

Every page is a table of slots:

| Slot | Copy | Chars | Status |
|---|---|---|---|

- **Slot** — what the element is. The designer's job is to give each slot a
  home; the copy is already sized for it.
- **Copy** — the exact string. Paste it, do not paraphrase.
- **Chars** — character count including spaces, so a slot can be sized before
  the layout exists.
- **Status** — one of:
  - **Ready** — condensed from live copy, approved to use as-is.
  - **Pick one** — two or three options where the choice is AM's, not the
    designer's. AM marks one before hand-off.
  - **Needs AM** — a fact nobody has yet (a date, a cost, a name, a number).
    Nothing here is invented. Design around the slot with placeholder text of
    the stated length, and see `12-gaps.md` for the full list.

Under each table there is an **Interaction** note: what the section does when
someone touches it. That is the "interactive" half of the brief.

## Voice, from AM's own pages

Six rules, drawn from the copy that already exists:

1. **Second person.** "You" and "we", never "students are encouraged to".
2. **Short sentences.** The current site averages 28 words a sentence. Target 14.
3. **Scripture is quoted, not paraphrased**, and always attributed. The current
   site favours NIV — keep it.
4. **"The Lord Jesus", "the Gospel", "the Great Commission"** are AM's words.
   Keep them. Do not swap in generic nonprofit language.
5. **Verbs at the front of buttons.** "Find a chapter", not "Chapter finder".
6. **No exclamation marks** except in a direct quote. The current copy leans on
   them; the redesign should not.

## Character budgets

These are the ceilings the copy is written to. If a layout needs less, ask for a
shorter line rather than truncating.

| Element | Max chars | Notes |
|---|---|---|
| Hero H1 | 48 | Must survive at 390px wide |
| Hero standfirst | 130 | One sentence |
| Section H2 | 40 | |
| Section standfirst | 160 | One or two sentences |
| Card title | 28 | |
| Card body | 110 | |
| Button | 22 | Verb first |
| Stat label | 24 | |
| Nav item | 18 | |
| Footer link | 24 | |
| Meta / eyebrow | 32 | Uppercase, tracked |

## The files

| File | Covers |
|---|---|
| `01-homepage.md` | Homepage, top to bottom |
| `02-about.md` | Who We Are, Mission, Statement of Faith, History, Leadership |
| `03-what-we-do.md` | The four pillars: Evangelism, Education, Discipleship, Mission |
| `04-get-involved.md` | Connect · Grow · Lead · Sent — the journey |
| `05-bible-study.md` | 5-Phase programme, AM Academy, group activities |
| `06-network.md` | Chapter finder and the global map |
| `07-ministries.md` | The six fellowships |
| `08-give.md` | Giving |
| `09-contact.md` | Contact and prayer requests |
| `10-global-components.md` | Nav, footer, CTA bands, forms, error states, microcopy |
| `11-country-site-template.md` | The repeatable country-site copy frame |
| `12-gaps.md` | Everything AM still has to supply |

## Site map the copy assumes

```
/                          Homepage
/about/                    Who We Are
  /mission/                Mission and vision
  /beliefs/                Statement of Faith
  /history/                History + Dr. Ralph D. Winter
  /leadership/             Global leadership
/what-we-do/               The four pillars
  /bible-study/            5-Phase programme
  /academy/                AM Academy
  /ministries/             The six fellowships
/get-involved/             The journey
  /connect/                Step 1
  /grow/                   Step 2
  /lead/                   Step 3
  /sent/                   Step 4
/network/                  Chapter finder
/{iso}/                    Country site  ← see 11-country-site-template.md
                           /us/ /kr/ /br/ … 68 of them
/news/                     News and stories
/give/                     Giving
/contact/                  Contact and prayer
```

Twelve top-level destinations, down from the current twenty-plus. Pages that
disappear are listed in `12-gaps.md` under "Retired".
