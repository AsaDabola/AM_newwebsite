# Homepage

The current homepage carries thirteen sections and a rotating slider. This is
eight sections and no slider. Order is priority order: a first-time visitor
should understand who AM is by section 2 and be able to act by section 3.

---

## 1 · Hero

The interactive globe. Points of light where AM has chapters, slowly rotating,
draggable. Copy sits over it, left-aligned, out of the way of the sphere.

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Eyebrow | APOSTOLOS MISSIONS INTERNATIONAL | 32 | Ready |
| H1 — option A | Sent to the ends of the earth | 29 | Pick one |
| H1 — option B | One who is sent on a mission | 28 | Pick one |
| H1 — option C | The Gospel, on every campus | 27 | Pick one |
| Standfirst | An interdenominational campus ministry preaching the Gospel, making disciples, and sending them out. | 100 | Ready |
| Primary button | Find your chapter | 17 | Ready |
| Secondary button | Start a Bible study | 19 | Ready |
| Globe label, on hover | {City}, {Country} | 17 | Ready |
| Scroll cue | Explore the mission | 19 | Ready |

**Interaction.** The globe turns on its own until touched, then follows the
drag and keeps spinning when released. Each point of light is a chapter; hover
or tap names the city and links to its country page. On phones the globe
becomes a still render with the same points — do not ship a draggable canvas to
a phone battery.

**Note on option A/B/C.** B is the closest to AM's own language: `apostolos`
means "one who is sent on a mission by God", and that sentence already appears
twice on the current site. A is the strongest as a headline. C is the most
concrete about what AM actually does. AM picks.

---

## 2 · What AM is

Three or four numbers, then one paragraph. This is the section that answers
"who are these people" without making anyone click.

| Slot | Copy | Chars | Status |
|---|---|---|---|
| H2 | A worldwide community | 21 | Ready |
| Standfirst | AM gathers young believers on university campuses, teaches them the Bible, and sends them out to their own nations and beyond. | 126 | Ready |
| Stat 1 number | {n} | 3 | Needs AM |
| Stat 1 label | Chapters worldwide | 18 | Ready |
| Stat 2 number | {n} | 3 | Needs AM |
| Stat 2 label | Countries | 9 | Ready |
| Stat 3 number | {n} | 3 | Needs AM |
| Stat 3 label | Students in Bible study | 23 | Ready |
| Stat 4 number | 1998 | 4 | Needs AM |
| Stat 4 label | Serving since | 13 | Needs AM |
| Button | Read our story | 14 | Ready |

**Interaction.** Numbers count up once, when the section first enters view, and
never again. If AM cannot supply a number, cut that stat — three real numbers
beat four with a guess in them.

**Needs AM.** Chapter and country counts, active student count, founding year.
The chapter list on the current site gives a city count, but AM should confirm
what it wants to publish before the number goes on a homepage.

---

## 3 · The journey

The heart of the homepage. Four steps, in order, each a card. This replaces the
four separate Connect / Grow / Lead / Sent blocks on the current homepage.

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Eyebrow | THE JOURNEY | 11 | Ready |
| H2 | Four steps, one calling | 23 | Ready |
| Standfirst | Wherever you are on the road of faith, there is a next step. | 60 | Ready |
| Card 1 number | 01 | 2 | Ready |
| Card 1 title | Connect | 7 | Ready |
| Card 1 body | Meet a staff member, join a Bible study, or find the chapter nearest to you. | 76 | Ready |
| Card 1 button | Start here | 10 | Ready |
| Card 2 number | 02 | 2 | Ready |
| Card 2 title | Grow | 4 | Ready |
| Card 2 body | Morning prayer, group Bible study, fellowship and retreats. Faith matures in company. | 85 | Ready |
| Card 2 button | See what happens | 16 | Ready |
| Card 3 number | 03 | 2 | Ready |
| Card 3 title | Lead | 4 | Ready |
| Card 3 body | Volunteer, intern, teach the Bible, or lead a chapter. You grow most where you serve. | 85 | Ready |
| Card 3 button | Take a role | 11 | Ready |
| Card 4 number | 04 | 2 | Ready |
| Card 4 title | Sent | 4 | Ready |
| Card 4 body | Graduate and keep going — as an alum, a staff worker, or a missionary. | 70 | Ready |
| Card 4 button | Go further | 10 | Ready |

**Interaction.** On desktop the four sit as a horizontal track with a line
running through the numbers; the line draws itself as the section scrolls into
view. On phones they stack and the line runs vertically. Hover lifts a card and
reveals its button; the whole card is the click target, not just the button.

---

## 4 · Bible study

One band, one idea: the 5-Phase programme is AM's core activity and it is free.

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Eyebrow | BIBLE STUDY | 11 | Ready |
| H2 | Five phases, one Gospel | 23 | Ready |
| Body | AM's Bible study runs in five phases, from the basics of salvation in Romans to the whole sweep of Scripture. A teacher is matched to you and meets at a time that fits your week. | 178 | Ready |
| Detail 1 | Free, always | 12 | Ready |
| Detail 2 | Online or on campus | 19 | Ready |
| Detail 3 | Open to ages 15–29 | 18 | Ready |
| Button | Join a Bible study | 18 | Ready |
| Link | See the five phases | 19 | Ready |

**Interaction.** The five phases render as a horizontal stepper; tapping a
phase swaps the body text without leaving the homepage. Phase copy is in
`05-bible-study.md`.

---

## 5 · The four pillars

Condensed hard. The current page runs 846 words across four pillars; this is
four sentences.

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Eyebrow | WHAT WE DO | 10 | Ready |
| H2 | Four pillars of mission | 23 | Ready |
| Pillar 1 title | Evangelism | 10 | Ready |
| Pillar 1 body | Going to every campus in every nation, across every cultural gap. | 65 | Ready |
| Pillar 2 title | Education | 9 | Ready |
| Pillar 2 body | Putting the Word of God back at the centre of a knowledgeable world. | 68 | Ready |
| Pillar 3 title | Discipleship | 12 | Ready |
| Pillar 3 body | Walking with students so grace costs something and changes them. | 64 | Ready |
| Pillar 4 title | Mission | 7 | Ready |
| Pillar 4 body | Campus mission today, world mission tomorrow, through the same people. | 70 | Ready |
| Button | How we work | 11 | Ready |

**Interaction.** Four quadrants that expand on hover to show the pillar body;
on phones all four are open. Do not put these behind an accordion — they are
the shortest text on the page.

---

## 6 · Stories

Whatever AM is publishing: news, testimony, a chapter report.

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Eyebrow | AM TODAY | 8 | Ready |
| H2 | From the field | 14 | Ready |
| Standfirst | What God is doing through chapters around the world. | 52 | Ready |
| Card meta | {Country} · {Date} | 18 | Ready |
| Button | All news | 8 | Ready |
| Empty state | New stories are on the way. | 27 | Ready |

**Interaction.** Three cards, newest first, pulled from the news feed. If a
story has video, the card plays a muted loop on hover and opens the full video
on click.

**Needs AM.** Three publishable stories with a photograph each. The current
site's news is mostly event notices; the redesign needs narrative.

---

## 7 · Latin America

AM's current homepage gives this its own section and it is the one region
singled out. Keep it, condensed.

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Eyebrow | RISING MISSION | 14 | Ready |
| H2 | Our Latin world | 15 | Ready |
| Body | The Caribbean, Central and South America are moving fast. Pray with us that the work keeps thriving there. | 106 | Ready |
| Button | Visit latin.amintl.org | 22 | Ready |

**Interaction.** The globe from section 1, re-rendered still and rotated to the
Americas, with the region's chapter points lit.

---

## 8 · Give and stay informed

The two footer actions, one band, side by side.

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Give H2 | Send someone | 12 | Ready |
| Give body | AM is a non-profit carried by the Christian community. Your giving puts teachers in front of students and staff on campuses. | 124 | Ready |
| Give button | Give to the mission | 19 | Ready |
| Newsletter H2 | Stay informed | 13 | Ready |
| Newsletter body | News from the chapters, once a month. | 37 | Ready |
| Newsletter field label | Email address | 13 | Ready |
| Newsletter button | Subscribe | 9 | Ready |
| Newsletter fine print | We will not share your address. Unsubscribe any time. | 53 | Ready |

**Interaction.** The newsletter field submits without leaving the page and
swaps to a confirmation line in place. Copy: "Thank you — check your inbox to
confirm."

---

## What was cut, and why

| Cut from the current homepage | Reason |
|---|---|
| Two-slide hero carousel | Carousels are read once and the second slide never is. The globe carries the same weight. |
| "Join Our Bible Study Program" long paragraph | Reduced to section 4. Same facts, a third of the words. |
| Four separate Connect / Grow / Lead / Sent bands | Merged into one journey section. They are one idea, not four. |
| "Media" / "More Contents" / "Events" / "More News" empty headings | Four headings with no content beneath them. Replaced by section 6. |
| "AM Academy for World Missions" band | Moved to `/what-we-do/academy/`. The homepage should not carry two education blocks. |
| "Find your next bible study" repeat CTA | Duplicate of section 4's button. |

Word count on the current homepage: 387 words plus a slider. This one: about
520 words of real copy, no slider, and every heading has something under it.
