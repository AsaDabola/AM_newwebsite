/**
 * Shared chrome for every page: <head>, utility bar, header + mega menu,
 * mobile drawer and footer, plus the small helpers pages are built from.
 *
 * Consumed by tools/build-pages.js.
 */

const SITE = {
  name: 'Apostolos Missions International',
  short: 'Apostolos Missions',
  abbr: 'AM',
  tagline: 'One who is sent on a mission',
  // Update this to the live origin before launch so canonical URLs and social
  // cards point at the right place.
  origin: 'https://amintl.org',
  address: ['Apostolos Missions International', 'Trenton, New Jersey, USA'],
  email: 'info@amintl.org'
};

/* ---------------------------------------------------------------- icons -- */

const ICONS = {
  chevron:
    '<svg class="nav__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  arrow:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.6-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.4 12 20 12 20z"/></svg>',
  users:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3.2 3.2 0 0 1 0 5"/><path d="M18 20a6 6 0 0 0-2.4-4.8"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5"/></svg>',
  globe:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3L10.5 13.5"/><path d="M21 3l-6.8 18-3.7-7.5L3 9.8z"/></svg>',
  plus: '<svg class="accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.29-.04-1.27-.12-2.41-.12-2.39 0-4.03 1.46-4.03 4.14v2.31H7.5V14h2.76v8z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/></svg>',
  youtube:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.75-1.75C18.35 5.15 12 5.15 12 5.15s-6.35 0-7.85.4A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.75 1.75c1.5.4 7.85.4 7.85.4s6.35 0 7.85-.4a2.5 2.5 0 0 0 1.75-1.75C22 15.2 22 12 22 12zM10 15.1V8.9l5.2 3.1z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>'
};

/* ------------------------------------------------------------------ nav -- */

/**
 * One source of truth for site navigation. The header mega menu, the mobile
 * drawer and the footer link columns are all generated from this.
 */
const NAV = [
  {
    label: 'Who We Are',
    href: '/about/',
    feature: {
      title: 'Our first chairman',
      text: 'Dr. Ralph D. Winter, missiologist and founder of the U.S. Center for World Mission, served as AM’s first honorary chairman.',
      href: '/about/legacy/',
      cta: 'Read his legacy'
    },
    columns: [
      {
        title: 'The ministry',
        links: [
          ['Who we are', '/about/'],
          ['Mission statement', '/about/mission/'],
          ['Statement of faith', '/about/beliefs/'],
          ['Our history', '/about/history/']
        ]
      },
      {
        title: 'People',
        links: [
          ['Leadership & staff', '/about/leadership/'],
          ['Legacy of Ralph D. Winter', '/about/legacy/'],
          ['Contact us', '/contact/']
        ]
      }
    ]
  },
  {
    label: 'What We Do',
    href: '/what-we-do/',
    feature: {
      title: '5-Phase Bible Study Program',
      text: 'An online discipleship and Bible education program that leads students through a systematic flow of learning the Gospel of Jesus Christ and the life of faith.',
      href: '/what-we-do/bible-study/',
      cta: 'Join the program'
    },
    columns: [
      {
        title: 'Study',
        links: [
          ['What we do', '/what-we-do/'],
          ['Bible Study Program', '/what-we-do/bible-study/'],
          ['Four Spiritual Themes', '/what-we-do/four-spiritual-themes/'],
          ['AM Academy', '/academy/']
        ]
      },
      {
        title: 'Fellowships',
        links: [
          ['Our ministries', '/ministries/'],
          ['La Familia', '/ministries/#la-familia'],
          ['AM Athletics', '/ministries/#athletics'],
          ['AM Business Fellowship', '/ministries/#business']
        ]
      }
    ]
  },
  {
    label: 'Get Involved',
    href: '/get-involved/',
    feature: {
      title: 'Start a chapter',
      text: 'Bring an AM fellowship to your campus, with training, curriculum and a staff coach alongside you.',
      href: '/get-involved/chapter-affiliation/',
      cta: 'Chapter affiliation'
    },
    columns: [
      {
        title: 'Four ways in',
        links: [
          ['Connect with AM', '/get-involved/#connect'],
          ['Grow with AM', '/get-involved/#grow'],
          ['Lead with AM', '/get-involved/#lead'],
          ['Sent with AM', '/get-involved/#sent']
        ]
      },
      {
        title: 'Take a step',
        links: [
          ['Chapter affiliation', '/get-involved/chapter-affiliation/'],
          ['Events & retreats', '/events/'],
          ['Give & partner', '/give/']
        ]
      }
    ]
  },
  { label: 'Our Network', href: '/network/' },
  { label: 'News', href: '/news/' },
  { label: 'Contact Us', href: '/contact/' }
];

const FOOTER_COLS = [
  {
    title: 'Who we are',
    links: [
      ['About AM', '/about/'],
      ['Mission statement', '/about/mission/'],
      ['Statement of faith', '/about/beliefs/'],
      ['Our history', '/about/history/'],
      ['Leadership', '/about/leadership/']
    ]
  },
  {
    title: 'What we do',
    links: [
      ['Bible Study Program', '/what-we-do/bible-study/'],
      ['Four Spiritual Themes', '/what-we-do/four-spiritual-themes/'],
      ['AM Academy', '/academy/'],
      ['Our ministries', '/ministries/']
    ]
  },
  {
    title: 'Get involved',
    links: [
      ['Connect, Grow, Lead, Sent', '/get-involved/'],
      ['Chapter affiliation', '/get-involved/chapter-affiliation/'],
      ['Our Network', '/network/'],
      ['Events', '/events/'],
      ['Give', '/give/']
    ]
  },
  {
    title: 'Media',
    links: [
      ['News', '/news/'],
      ['Four Spiritual Themes', '/what-we-do/four-spiritual-themes/'],
      ['Legacy of Ralph D. Winter', '/about/legacy/'],
      ['Contact us', '/contact/']
    ]
  }
];

/* -------------------------------------------------------------- helpers -- */

/**
 * Pages live in real directories (about/index.html), so links are written
 * root-relative here and rewritten to a relative path at build time. That
 * keeps the site working when it is served from a sub-path, e.g. GitHub
 * Pages project sites.
 */
function makeUrl(depth) {
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  return function url(href) {
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
    const clean = href.replace(/^\//, '');
    if (clean === '') return prefix || './';
    return prefix + clean;
  };
}

/* AM's wordmark, rebuilt in markup so it inherits colour from its context.
   Replace with the official logo asset when it is available. */
const logoMark = '';

/* -------------------------------------------------------------- chrome --- */

function head({ title, description, canonical, depth }) {
  const url = makeUrl(depth);
  const full = `${title} | ${SITE.name}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${full}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE.origin}${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${full}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${SITE.origin}${canonical}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#05070d">
<link rel="icon" href="${url('/assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${url('/assets/fonts/archivo-latin-800-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url('/assets/fonts/inter-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${url('/assets/css/main.css')}">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>`;
}

function utility(depth) {
  const url = makeUrl(depth);
  return `
<div class="utility">
  <div class="container utility__inner">
    <p class="utility__tagline">Apostolos &middot; ${SITE.tagline}</p>
    <ul class="utility__links">
      <li><a href="${url('/network/')}">Our Network</a></li>
      <li><a href="${url('/academy/')}">AM Academy</a></li>
      <li><a href="${url('/news/')}">News</a></li>
      <li><a href="${url('/contact/')}">Contact Us</a></li>
    </ul>
  </div>
</div>`;
}

function megamenu(item, url) {
  const cols = item.columns
    .map(
      (col) => `
          <div class="megamenu__col">
            <h3 class="megamenu__title">${col.title}</h3>
            <ul class="megamenu__links">
              ${col.links
                .map(([label, href]) => `<li><a href="${url(href)}">${label}</a></li>`)
                .join('\n              ')}
            </ul>
          </div>`
    )
    .join('');

  return `
      <div class="megamenu">
        <div class="container megamenu__inner">
          <div class="megamenu__cols">${cols}
          </div>
          <div class="megamenu__feature">
            <h4>${item.feature.title}</h4>
            <p>${item.feature.text}</p>
            <a class="link-arrow" href="${url(item.feature.href)}">${item.feature.cta} ${ICONS.arrow}</a>
          </div>
        </div>
      </div>`;
}

function header({ depth, active }) {
  const url = makeUrl(depth);

  const navItems = NAV.map((item) => {
    const isActive = active && active.startsWith(item.href) ? ' aria-current="page"' : '';
    if (!item.columns) {
      return `        <li class="nav__item"><a class="nav__link" href="${url(item.href)}"${isActive}>${item.label}</a></li>`;
    }
    return `        <li class="nav__item nav__item--has-menu">
          <button class="nav__link" type="button" aria-expanded="false" data-href="${url(item.href)}"${isActive}>${item.label} ${ICONS.chevron}</button>${megamenu(item, url)}
        </li>`;
  }).join('\n');

  return `
<header class="header">
  <div class="container header__inner">
    <a class="logo" href="${url('/')}">
      <span class="logo__text">
        <span class="logo__name">AM</span>
        <span class="logo__sub">International</span>
      </span>
    </a>

    <nav class="nav" aria-label="Main">
      <ul class="nav__list">
${navItems}
      </ul>
    </nav>

    <div class="header__actions">
      <a class="btn" href="${url('/give/')}">Give</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`;
}

function drawer(depth) {
  const url = makeUrl(depth);

  const groups = NAV.map((item) => {
    if (!item.columns) {
      return `      <div class="drawer__group">
        <a class="drawer__toggle" href="${url(item.href)}">${item.label}</a>
      </div>`;
    }
    const links = item.columns
      .flatMap((c) => c.links)
      .map(([label, href]) => `          <a href="${url(href)}">${label}</a>`)
      .join('\n');
    return `      <div class="drawer__group">
        <button class="drawer__toggle" type="button" aria-expanded="false">${item.label} ${ICONS.chevron}</button>
        <div class="drawer__panel">
${links}
        </div>
      </div>`;
  }).join('\n');

  return `
<div class="drawer" id="drawer" aria-hidden="true">
  <div class="container">
${groups}
    <div class="drawer__actions">
      <a class="btn btn--lg" href="${url('/give/')}">Give</a>
      <a class="btn btn--lg btn--ghost-light" href="${url('/network/')}">Our Network</a>
    </div>
  </div>
</div>`;
}

function footer(depth) {
  const url = makeUrl(depth);

  const cols = FOOTER_COLS.map(
    (col) => `
        <div class="footer__col">
          <h3>${col.title}</h3>
          <ul>
            ${col.links
              .map(([label, href]) => `<li><a href="${url(href)}">${label}</a></li>`)
              .join('\n            ')}
          </ul>
        </div>`
  ).join('');

  return `
<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        <a class="logo" href="${url('/')}">
          <span class="logo__text">
            <span class="logo__name">AM</span>
            <span class="logo__sub">International</span>
          </span>
        </a>
        <p>An interdenominational ministry committed to spreading the gospel to the ends of the earth, testifying to the eternal love of the Lord.</p>
        <p>${SITE.address.join('<br>')}<br><a href="mailto:${SITE.email}">${SITE.email}</a></p>
        <ul class="social">
          <li><a href="#" aria-label="Facebook">${ICONS.facebook}</a></li>
          <li><a href="#" aria-label="Instagram">${ICONS.instagram}</a></li>
          <li><a href="#" aria-label="YouTube">${ICONS.youtube}</a></li>
          <li><a href="mailto:${SITE.email}" aria-label="Email">${ICONS.mail}</a></li>
        </ul>
      </div>
      <div class="footer__cols">${cols}
      </div>
    </div>
    <div class="footer__bottom">
      <p>&copy; <span data-year>2026</span> ${SITE.name}. All rights reserved.</p>
      <ul class="footer__legal">
        <li><a href="${url('/about/beliefs/')}">Statement of faith</a></li>
        <li><a href="${url('/contact/')}">Contact</a></li>
        <li><a href="${url('/give/')}">Give</a></li>
      </ul>
    </div>
  </div>
</footer>`;
}

function scripts(depth, { globe }) {
  const url = makeUrl(depth);
  const globeTags = globe
    ? `\n<script src="${url('/assets/js/globe-markers.js')}" defer></script>` +
      `\n<script src="${url('/assets/js/globe-data.js')}" defer></script>` +
      `\n<script src="${url('/assets/js/globe.js')}" defer></script>`
    : '';
  return `${globeTags}
<script src="${url('/assets/js/main.js')}" defer></script>
</body>
</html>`;
}

/**
 * Wraps page content in the full site chrome.
 */
function shell(page) {
  const depth = page.depth;
  return [
    head(page),
    utility(depth),
    header({ depth, active: page.active }),
    drawer(depth),
    `\n<main id="main">`,
    page.body,
    `</main>`,
    footer(depth),
    scripts(depth, { globe: !!page.globe })
  ].join('\n');
}

module.exports = { SITE, NAV, FOOTER_COLS, ICONS, makeUrl, shell };
