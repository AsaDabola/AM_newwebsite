#!/usr/bin/env node
/**
 * Writes one design brief per page: which template the page uses, the sections
 * to build in order, what the page already has, and what is still missing.
 *
 * Reads the Markdown produced by build-notion-export.js rather than the raw
 * export, so it works from the same text that was reviewed.
 *
 * Usage:
 *   node tools/content/build-page-designs.js <pagesDir> [outDir]
 *
 * e.g. node tools/content/build-page-designs.js export/Pages page-designs
 */

const fs = require('fs');
const path = require('path');

const [, , pagesDirArg, outDirArg] = process.argv;

if (!pagesDirArg) {
  console.error('usage: node tools/content/build-page-designs.js <pagesDir> [outDir]');
  process.exit(1);
}

const PAGES_DIR = pagesDirArg;
const OUT = outDirArg || path.join(path.dirname(PAGES_DIR), 'page-designs');

/* ============================================================ templates == */

const TEMPLATES = {
  A: {
    name: 'Journey',
    when: 'A step in a sequence the reader moves through.',
    sections: [
      ['Page header', 'Title and one sentence saying what this step is.'],
      ['Tabs', 'The sibling steps, current one marked. Built automatically.'],
      ['Figure', 'One wide image. Photography of this step in real life.'],
      ['Opening', 'Two or three sentences. Why this step matters — no more.'],
      ['Action cards', 'Three or four things the reader can do, each with a button.'],
      ['Next step', 'One band handing them to the next step.'],
    ],
  },
  B: {
    name: 'Article',
    when: 'Pages that are mostly reading.',
    sections: [
      ['Page header', 'Title and a one-line standfirst.'],
      ['Section tabs', 'The sibling pages in this group.'],
      ['Body', 'One column. Subheadings every 200–300 words.'],
      ['Pull quote', 'The one sentence worth lifting out.'],
      ['Optional: timeline', 'For anything chronological.'],
      ['Optional: accordion', 'For articles of faith or FAQs.'],
      ['Give band', 'Standard footer band.'],
    ],
  },
  C: {
    name: 'Programme',
    when: 'Anything with stages, phases or terms.',
    sections: [
      ['Page header', 'Title and one line on what the programme produces.'],
      ['Opening', 'Two or three sentences: who it is for and what happens.'],
      ['Numbered steps', 'One per phase or stage. Heading plus two sentences.'],
      ['Practical details', 'Cost, dates, time commitment, format.'],
      ['FAQ accordion', 'The questions people actually ask before signing up.'],
      ['Action', 'Enrol, apply, or get in touch.'],
    ],
  },
  D: {
    name: 'Directory',
    when: 'Many similar things: places, ministries or people.',
    sections: [
      ['Page header', 'Title and one line on what the list contains.'],
      ['Search or filter', 'Needed once the list passes about fifteen entries.'],
      ['The list', 'Cards when entries have photos, plain rows when they do not.'],
      ['Empty state', 'What to do when nothing matches.'],
      ['Action', 'Add yourself, start one, or get in touch.'],
    ],
  },
  E: {
    name: 'Action',
    when: 'Pages with exactly one job.',
    sections: [
      ['Page header', 'Title states the action.'],
      ['Opening', 'One or two sentences on what happens after they act.'],
      ['The form or buttons', 'As few fields as the job genuinely needs.'],
      ['Reassurance', 'Where the money goes, who sees the data, what happens next.'],
      ['No give band', 'It would compete with the page itself.'],
    ],
  },
  F: {
    name: 'Landing',
    when: 'The homepage and section fronts.',
    sections: [
      ['Hero', 'Headline, standfirst, two buttons.'],
      ['Quick links', 'The main audience paths.'],
      ['Feature bands', 'One idea each, in priority order.'],
      ['Give band', 'Standard footer band.'],
    ],
  },
  X: {
    name: 'Retire',
    when: 'System pages and stubs that should not survive the rebuild.',
    sections: [['Nothing to build', 'Delete, or leave to the plugin that owns it.']],
  },
};

/* Explicit assignments; anything unlisted falls through to the heuristic. */
const ASSIGNED = {
  Connect: 'A', Grow: 'A', Lead: 'A', Connect_Covid: 'A',

  'Who We Are': 'B', 'Mission Statement': 'B', 'Statement of Faith': 'B',
  History: 'B', 'Our First Chairman': 'B', Administration: 'B',
  Membership: 'B', 'Theme Guide': 'B',

  '5-Phase Bible Study Program': 'C', 'AM Academy': 'C',
  'AM Academy for World Missions': 'C', 'Bible Studies': 'C',
  Internship: 'C', Volunteer: 'C', 'Become a Bible Teacher': 'C',
  'Chapter Affiliation': 'C', 'Online Program': 'C', 'Group Activities': 'C',
  'Summer Bible Camp 2024': 'C', 'Winter Break Program 2023': 'C',
  'Summer Bible Study Schedule': 'C', 'Thursday Bible Study': 'C',
  'Become a Chapter Leader': 'C', 'Phase 1 Sola Fide': 'C',
  'Join our Bible Studies': 'C', 'BBS Promo': 'C',

  'Our Network': 'D', 'Our Ministries': 'D', 'Our Leadership': 'D',
  'Our Global Leadership': 'D', 'Chapter Staff': 'D', 'Alumni Connect': 'D',

  Donate: 'E', 'Donate 2': 'E', 'Contact Us': 'E', 'Event Registration': 'E',
  Registration: 'E', 'Instructor Registration': 'E',
  'Student Registration': 'E', 'Apply now': 'E',
  'Newsletter Subscription': 'E', 'Monthly Newsletter': 'E',
  'Prayer Requests': 'E',

  Home: 'F', 'Get Involved': 'F', 'What We Do': 'F',

  Cart: 'X', Checkout: 'X', Dashboard: 'X', 'Bible Verse': 'X',
  'Home (new design)': 'X',
};

/* ============================================================== reading == */

function readPage(file) {
  const raw = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8');
  const title = (raw.match(/^# (.+)$/m) || [, path.basename(file, '.md')])[1];
  const url = (raw.match(/\*\*URL:\*\* (\S+)/) || [, ''])[1];

  // Body is everything after the metadata rule.
  const parts = raw.split(/\n---\n/);
  const body = (parts.length > 1 ? parts.slice(1).join('\n---\n') : raw).trim();

  const words = body.split(/\s+/).filter(Boolean).length;
  const images = (body.match(/!\[[^\]]*\]\(/g) || []).length;
  const links = (body.match(/(?<!!)\[[^\]]+\]\(/g) || []).length;
  const headings = (body.match(/^#{2,3} /gm) || []).length;
  const bullets = (body.match(/^- /gm) || []).length;
  const empty = /no text content/.test(body);

  return { file, title, url, body, words, images, links, headings, bullets, empty };
}

/** Falls back to shape when a page is not explicitly assigned. */
function pickTemplate(page) {
  if (ASSIGNED[page.title]) return ASSIGNED[page.title];
  if (page.empty || page.words < 20) return 'X';
  if (page.bullets >= 4 && page.links >= 4) return 'D';
  if (page.words > 250) return 'B';
  return 'C';
}

/* ============================================================== writing == */

function statusFor(page, sectionName) {
  const s = sectionName.toLowerCase();
  if (s.includes('tabs') || s.includes('give band') || s.includes('no give')) {
    return ['Automatic', 'Built by the theme'];
  }
  if (s.includes('header')) {
    return ['Have it', 'Title exists; check the one-line summary'];
  }
  if (s.includes('figure') || s.includes('image')) {
    return page.images
      ? ['Have it', `${page.images} image${page.images > 1 ? 's' : ''} on the current page`]
      : ['Needed', 'No image on the current page'];
  }
  if (s.includes('opening') || s.includes('body')) {
    return page.words > 60
      ? ['Have it', `${page.words} words to work from`]
      : ['Needed', `Only ${page.words} words currently`];
  }
  if (s.includes('action cards') || s.includes('the list')) {
    return page.links >= 3
      ? ['Have it', `${page.links} links found — likely the card destinations`]
      : ['Needed', 'Not enough links to build cards from'];
  }
  if (s.includes('numbered steps')) {
    return page.headings >= 2
      ? ['Partly', `${page.headings} headings that may map to steps`]
      : ['Needed', 'No step structure in the current copy'];
  }
  return ['Needed', ''];
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.md'));
const rows = [];

for (const file of files) {
  const page = readPage(file);
  const key = pickTemplate(page);
  const tpl = TEMPLATES[key];

  const lines = [
    `# ${page.title} — page design`,
    '',
    `**Template:** Pattern ${key} · ${tpl.name}  `,
    `**When to use it:** ${tpl.when}  `,
    ...(page.url ? [`**Live page:** ${page.url}  `] : []),
    `**Copy today:** ${page.empty ? 'none' : `${page.words} words`}, ` +
      `${page.images} image${page.images === 1 ? '' : 's'}, ${page.links} link${page.links === 1 ? '' : 's'}`,
    '',
    '---',
    '',
  ];

  if (key === 'X') {
    lines.push(
      '## Recommendation: retire this page',
      '',
      'It is a system page, a stub, or a duplicate. It does not need a design —',
      'delete it during the rebuild, or leave it to the plugin that owns it.',
      ''
    );
  } else {
    lines.push('## Build this, in order', '', '| # | Section | What goes in it | Status | Notes |', '|---|---|---|---|---|');
    tpl.sections.forEach(([name, what], i) => {
      const [status, note] = statusFor(page, name);
      lines.push(`| ${i + 1} | ${name} | ${what} | ${status} | ${note} |`);
    });
    lines.push('', '## Still needed from AM', '');

    const gaps = tpl.sections
      .map(([name]) => [name, statusFor(page, name)])
      .filter(([, [status]]) => status === 'Needed' || status === 'Partly')
      .map(([name, [, note]]) => `- **${name}** — ${note || 'to be written'}`);

    lines.push(gaps.length ? gaps.join('\n') : '- Nothing — this page has what it needs.', '');
  }

  lines.push(
    '---',
    '',
    '## Copy on the page today',
    '',
    page.empty ? '_(none)_' : page.body,
    ''
  );

  const name = file.replace(/\.md$/, '');
  fs.writeFileSync(path.join(OUT, `${name}.md`), lines.join('\n') + '\n');

  rows.push({ title: page.title, key, tpl: tpl.name, words: page.words, file: `${name}.md` });
}

/* ---- index ---- */

const byTemplate = {};
rows.forEach((r) => (byTemplate[r.key] = byTemplate[r.key] || []).push(r));

const order = ['F', 'A', 'B', 'C', 'D', 'E', 'X'];
const index = [
  '# Page designs',
  '',
  `A design brief for each of the ${rows.length} pages: which template it uses, the`,
  'sections to build in order, and what is still missing.',
  '',
  'Six templates cover the whole site. Pick the brief for a page, work down its',
  'table, and the page will match the rest of the site without any design decisions.',
  '',
];

for (const key of order) {
  const list = byTemplate[key];
  if (!list) continue;
  const tpl = TEMPLATES[key];
  index.push(
    `## Pattern ${key} · ${tpl.name} (${list.length})`,
    '',
    `${tpl.when}`,
    '',
    '| Page | Words today |',
    '|---|---|',
    ...list
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((r) => `| [${r.title}](${encodeURI(r.file)}) | ${r.words} |`),
    ''
  );
}

fs.writeFileSync(path.join(OUT, 'README.md'), index.join('\n') + '\n');

console.log(`wrote ${rows.length} design briefs to ${OUT}`);
order.forEach((k) => {
  if (byTemplate[k]) console.log(`  Pattern ${k} · ${TEMPLATES[k].name}: ${byTemplate[k].length}`);
});
