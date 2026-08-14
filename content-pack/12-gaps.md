# Gaps — what AM still has to supply

Nothing in this pack was invented. Where a fact was missing it was left as a
slot, and every one of those slots is listed here.

Sorted by what blocks what. Group A blocks the designer. Group B blocks
launch. Group C blocks the sixty-site rollout.

---

## Group A — blocks the designer, needed first

| # | What | Why it blocks | Who |
|---|---|---|---|
| A1 | **Logo as SVG**, plus any lockup variants | Cannot lay out a header without it | Brand |
| A2 | **Official brand hex codes** | The palette in `10-global-components.md` was sampled from screenshots, not supplied | Brand |
| A3 | **Hero headline: pick A, B or C** | It is the first line of the site and it is AM's call, not the designer's | Leadership |
| A4 | **Photography, roughly 25 images** | Every band in this pack has a photo slot. Listed below. | Comms |
| A5 | **Three homepage numbers** — chapters, countries, students in Bible study | The "what AM is" band is built around them | HQ |
| A6 | **Founding year to publish** | 2002 as ACM or 2003 as AMI — the History page has both | HQ |

### A4 — the photography list

| Where | What | Count |
|---|---|---|
| Homepage hero | Not needed — the globe carries it | 0 |
| Four pillars | One per pillar: evangelism, teaching, discipleship, mission | 4 |
| Journey steps | One per step: connect, grow, lead, sent | 4 |
| Ministries | One per fellowship — real groups, not stock | 6 |
| AM Academy | One per ministry area | 4 |
| History timeline | One per milestone | 5 |
| Leadership | Portraits of the 8 regional leaders (HQ 5 exist) | 8 |
| News | One per published story | 3 |

Stock photography will be visible immediately on the ministries page and on the
journey steps. Those ten are the ones worth doing properly.

---

## Group B — blocks launch

| # | What | Why it blocks | Who |
|---|---|---|---|
| B1 | **What $25 / $50 / $100 buys**, one sentence each | `/give/` cannot ship without it | Finance |
| B2 | **Tax-deductibility statement and EIN** | Legal requirement on a US giving page | Finance |
| B3 | **Payment processor** | Determines what the giving form can be | Finance |
| B4 | **Privacy policy and terms** | The site collects emails, prayer requests and applications, and AM has chapters in seven EU/UK cities | Legal |
| B5 | **Chapter contact details** — email or staff name per chapter | The finder currently cannot tell anyone how to reach a chapter. Highest-value missing content on the site. | Regional leaders |
| B6 | **Regional contact inboxes** | One Trenton inbox for forty countries is a bottleneck | HQ |
| B7 | **The President's name** | The Global Leadership page has the title with no name | HQ |
| B8 | **Three publishable stories** with photos | The "From the field" band | Comms |
| B9 | **Prayer request privacy — is it true?** | The copy says staff only and never published. Confirm before it ships. | HQ |
| B10 | **Are staff openings published anywhere?** | Changes the Sent page's second card | HQ |
| B11 | **Morning QT times** | Friday prayer is confirmed; nothing else has a time | Chapters |
| B12 | **Does amacademy.org stay separate?** | Decides whether `/academy/` is a summary or the real page | Leadership |

---

## Group C — blocks the sixty-site rollout

The country list has arrived — 68 entries covering 75 countries, in
`docs/country-list.md`. What is still open:

| # | What | Why it blocks | Who |
|---|---|---|---|
| C1 | **68 sites or 75?** Grouped entries — one site or one each | The site-creation script | Leadership |
| C2 | **Translation decision** — 48 languages appear on the list | Biggest cost driver; changes whether a language switcher exists | Leadership |
| C3 | **A named owner per country** | A country site with no owner goes stale in a quarter | Regional leaders |
| C4 | **The six required intake fields per country** | See `11-country-site-template.md` | Country teams |
| C5 | **Who may edit what** | Country editors must not be able to change the Statement of Faith | HQ |
| C6 | **The 8 chapter countries not on the list** — Bolivia, Uruguay, Zimbabwe, Ireland, China, Macao, Cambodia, Laos | They have real chapters and no site | Leadership |
| C7 | **amjapan.org, amkorea.org, latin.amintl.org** — fold in or redirect | The pilots | Leadership |

Full detail in `docs/60-country-architecture.md`.

---

## Corrections found in the current content

Small, but they will be copied into sixty sites if not fixed now.

| Where | Problem |
|---|---|
| Contact page | Link text says `mission@amintl.org`, the `mailto:` points at `chicago@amintl.org` |
| Network page | "USA, New York" and "USA, New York City" are listed as separate chapters |
| Network page | Madrid, Dublin and Amsterdam are written city-first; every other entry is country-first |
| Network vs History | History lists Rwanda among the countries reached; the network list has no Rwandan chapter |
| Homepage | The "sent" heading is lowercase where Connect, Grow and Lead are capitalised |
| Homepage | The Sent link points at `amintl.org/sent/` with no protocol, and the page does not exist |
| Homepage | The Latin America link points at `latin.amintl.org` with no protocol |
| Connect page | "amcademy.org" — missing the second `a` |
| Bible study | Called the "5-Phase" programme but six tracks are listed |
| History page | The founding narrative gives both 2002 (as ACM) and 2003 (as AMI) |

---

## Retired pages

Twenty-two of the fifty-four pages do not survive the rebuild. None of their
content is lost — the table says where each one goes.

| Page | Where it goes |
|---|---|
| Mission Statement | `/about/`, sections 2 and 3 |
| Our First Chairman | `/about/history/`, chairman section |
| Our Global Leadership | `/about/leadership/`, tier 2 |
| Administration | Members area or a PDF — not a public page |
| Membership | `/get-involved/connect/` |
| Theme Guide | Internal document. Retire. |
| 5-Phase Bible Study Program | `/what-we-do/bible-study/` |
| Phase 1 Sola Fide | The Phase 1 panel in the stepper |
| Online Program | Duplicate. Retire. |
| Join our Bible Studies | Becomes the sign-up modal |
| Thursday Bible Study | Chapter-level content |
| Summer Bible Study Schedule | Chapter-level content |
| BBS Promo | 22-word stub. Retire. |
| Summer Bible Camp 2024 | Archive to `/news/` |
| Winter Break Program 2023 | Archive to `/news/` |
| Connect_Covid | Superseded. Retire. |
| Donate 2 | Duplicate of `/give/`. Retire. |
| Prayer Requests | `/contact/prayer/` |
| Newsletter Subscription | Footer component |
| Monthly Newsletter | Footer component |
| Event Registration, Registration, Instructor Registration, Student Registration, Apply now | Five registration stubs. One form component with a type parameter. |
| Cart, Checkout, Dashboard, Bible Verse | Plugin and system pages. Not part of the design. |
| Home (new design) | Working draft. Retire. |

---

## Verbatim blocks

Two pieces of copy must not be rewritten and are reproduced here so the
designer has them without going back to the old site.

### Statement of Faith — the eleven articles

1. We believe that the Bible, consisting of Old and New Testaments only, is verbally inspired by the Holy Spirit, is inerrant in the original manuscripts, and is the infallible and authoritative words from the Lord.
2. We believe that there is one God, eternally existent in three Persons: Father, Son, and Holy Spirit.
3. We believe that Adam, created in the image of God, was tempted by Satan, the devil, and fell. Because of Adam's sin, all men have guilt imputed.
4. We believe in the deity of our Lord Jesus Christ, in His virgin birth, in His sinless life, in His miracles, in His vicarious and atoning death through His shed blood, in His bodily resurrection, in His ascension to the right hand of the Father, and in His personal return in power and glory.
5. We believe that for the salvation of lost and sinful man, regeneration by the Holy Spirit is absolutely essential.
6. We believe that salvation consists in the remission of sins, the imputation of Christ's righteousness, and the gift of eternal life received by faith alone, apart from works.
7. We believe in the present ministry of the Holy Spirit by whose indwelling the Christian is enabled to live a godly life.
8. We believe that the Church, the body of Christ, consists only of those who are born again, who are baptized by the Holy Spirit into Christ at the time of regeneration, for whom He now makes intercession in heaven and for whom He will come again.
9. We believe in the spiritual unity of believers in our Lord Jesus Christ.
10. We believe that Christ instructed the Church to go into the entire world and preach the Gospel to every person, baptizing and teaching those who believe.
11. We believe that the return of Jesus Christ is imminent, and that it will be visible and personal.

### Romans 12:6–8 — the volunteer page verse

> We have different gifts, according to the grace given to each of us. If your
> gift is prophesying, then prophesy in accordance with your faith; if it is
> serving, then serve; if it is teaching, then teach; if it is to encourage,
> then give encouragement; if it is giving, then give generously; if it is to
> lead, do it diligently; if it is to show mercy, do it cheerfully.
