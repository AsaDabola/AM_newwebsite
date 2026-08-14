# Network — the chapter finder

The most-used page on any campus ministry site is the one that answers "is
there one near me". Today that answer is a bulleted list of sixty-one cities
grouped by region, plus a map plugin shortcode.

This page is also the entry point to the country sites — see
`11-country-site-template.md` and `docs/60-country-architecture.md`.

---

## /network/

| Slot | Copy | Chars | Status |
|---|---|---|---|
| Eyebrow | OUR NETWORK | 11 | Ready |
| H1 | A worldwide community | 21 | Ready |
| Standfirst | Chapters in cities and corners of the world. Find the one nearest to you. | 73 | Ready |
| Search placeholder | Search a city or country | 24 | Ready |
| Filter label | Region | 6 | Ready |
| Filter option 0 | All regions | 11 | Ready |
| Filter option 1 | North America | 13 | Ready |
| Filter option 2 | Latin America and Caribbean | 27 | Ready |
| Filter option 3 | Europe | 6 | Ready |
| Filter option 4 | Africa | 6 | Ready |
| Filter option 5 | South Asia | 10 | Ready |
| Filter option 6 | East and Central Asia | 21 | Ready |
| Filter option 7 | Southeast Asia | 14 | Ready |
| Filter option 8 | Oceania | 7 | Ready |
| Result count | {n} chapters | 12 | Ready |
| Result count, one | 1 chapter | 9 | Ready |
| Card title | {City} | 6 | Ready |
| Card subtitle | {Country} | 9 | Ready |
| Card link | Visit chapter | 13 | Ready |
| Empty state heading | No chapter there yet | 20 | Ready |
| Empty state body | We may still be able to connect you with someone nearby, or help you start one. | 79 | Ready |
| Empty state button | Get in touch | 12 | Ready |
| Start heading | Start a chapter | 15 | Ready |
| Start body | New chapters can request the affiliation application any time between June and December. | 88 | Ready |
| Start button | Request the form | 16 | Ready |
| Affiliation note | Existing chapters reaffirm their affiliation each year by 1 September. | 70 | Ready |

**Interaction.** The globe from the homepage, full width, at the top of the
page — but here it is a control, not decoration. Search filters the point set
live; the globe rotates to the first match. Selecting a region spins the globe
to that region and filters the list underneath. Selecting a point opens that
country's page.

On phones: drop the globe to a static image and lead with the search field.
People on phones are looking for one specific answer.

**Interaction, second layer.** The list below the globe is the accessible,
crawlable version of the same data — every chapter is a real link in the HTML,
not only a point on a canvas. This matters for search engines and for anyone
using a screen reader.

---

## The chapter data

Sixty-one cities across forty countries and eight regions, as published on the
current site. This is the source of truth for the globe, the finder, and the
country pages.

| Region | Chapters |
|---|---|
| North America | USA: New York, Atlanta, Boston, Burlington, Detroit, Houston, Los Angeles, Nashville, New Haven, New York City, Philadelphia, Princeton, Raleigh, San Diego, San Francisco, Seattle, St. Louis, Washington DC, Wichita · Canada: Montreal, Toronto, Vancouver |
| Latin America and Caribbean | Brazil: São Paulo · Argentina: Buenos Aires · Bolivia: La Paz · Colombia: Bogotá · Mexico: Mexico City · Peru: Lima · Uruguay: Montevideo · Venezuela: Caracas |
| Europe | Germany: Frankfurt · United Kingdom: London · France: Paris · Spain: Madrid · Ireland: Dublin · Netherlands: Amsterdam · Poland: Warsaw |
| Africa | Kenya: Nairobi · Uganda: Kampala · Zambia: Lusaka, Ndola · Nigeria: Lagos · Ethiopia: Addis Ababa · Egypt: Cairo · Tanzania: Dar es Salaam · Zimbabwe: Harare · DR Congo: Kinshasa |
| South Asia | India: Chennai |
| East and Central Asia | China: Beijing · South Korea: Seoul · Japan: Tokyo · Macao · Mongolia: Ulaanbaatar |
| Southeast Asia | Malaysia: Kuala Lumpur · Cambodia: Phnom Penh · Indonesia: Jakarta · Laos: Vientiane · Philippines: Manila · Thailand: Bangkok · Vietnam: Hanoi |
| Oceania | Australia: Sydney |

**Two duplicates to fix.** "USA, New York" and "USA, New York City" are listed
separately. So the published count of sixty-one includes one entry that should
not be there.

**Two errors to fix.** "Madrid, Spain" and "Dublin, Ireland" and "Amsterdam,
Netherlands" are written city-first while every other entry is country-first.

**Rwanda** appears in the History page's list of countries where the network
has developed, but has no chapter in the network list. Worth checking which is
right.

**Needs AM.** For each chapter: a contact email or a staff name, the target
university, and a meeting time. Right now the finder can only say a chapter
exists — it cannot tell anyone how to reach it, which is the entire point of a
finder. This is the single highest-value piece of missing content on the site.
