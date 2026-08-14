#!/usr/bin/env node
/**
 * Generates every .html file in the site from the shared chrome in site.js
 * plus the page content below.
 *
 * The *output* is plain static HTML that needs no tooling to host - this
 * script only exists so the header, footer and nav cannot drift apart across
 * 18 pages. Edit content here and re-run, rather than editing the generated
 * HTML by hand.
 *
 * Run: node tools/build-pages.js
 *
 * ---------------------------------------------------------------------------
 * CONTENT NOTE
 * Copy marked [SOURCED] is adapted from amintl.org. Everything else is
 * placeholder written to make the layout reviewable - names, numbers, dates,
 * campuses and story text still need to be replaced with real AM content.
 * See README.md for the full checklist.
 * ---------------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');
const { SITE, ICONS, makeUrl, shell } = require('./site');

const ROOT = path.join(__dirname, '..');

/* ----------------------------------------------------------- components -- */

function card({ href, img, alt, tag, title, text, meta, dark, url }) {
  return `<a class="card${dark ? ' card--dark' : ''}" href="${url(href)}" data-reveal>
          <div class="card__media">
            <img src="${url(img)}" alt="${alt}" loading="lazy" width="800" height="500">
            ${tag ? `<span class="card__tag">${tag}</span>` : ''}
          </div>
          <div class="card__body">
            <h3>${title}</h3>
            <p>${text}</p>
            ${meta ? `<p class="card__meta">${meta}</p>` : ''}
          </div>
        </a>`;
}

function quicklink({ href, icon, title, text, url }) {
  return `<a class="quicklink" href="${url(href)}" data-reveal>
          <span class="quicklink__icon">${ICONS[icon]}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </a>`;
}

function pillar({ title, text }) {
  return `<div class="pillar" data-reveal>
          <span class="pillar__num"></span>
          <h3>${title}</h3>
          <p>${text}</p>
        </div>`;
}

function person({ img, name, role, text, url }) {
  return `<div class="person" data-reveal>
          <div class="person__photo"><img src="${url(img)}" alt="Portrait of ${name}" loading="lazy" width="600" height="600"></div>
          <h3>${name}</h3>
          <p class="person__role">${role}</p>
          <p>${text}</p>
        </div>`;
}

function accordionItem({ q, a }) {
  return `<div class="accordion__item">
          <button class="accordion__trigger" type="button" aria-expanded="false">${q} ${ICONS.plus}</button>
          <div class="accordion__panel" aria-hidden="true"><div>${a}</div></div>
        </div>`;
}

/* --------------------------------------------- interior page components -- */

/** Wide image under the page header. */
function pageFigure({ img, alt, caption, url }) {
  return `<figure class="page-figure" data-reveal>
        <img src="${url(img)}" alt="${alt || ''}" loading="lazy" width="1200" height="800">
      </figure>${caption ? `<p class="page-figure__caption">${caption}</p>` : ''}`;
}

/** Icon, heading, one line, outline button. The concrete next actions. */
function actionCard({ icon, title, text, cta, href, url }) {
  return `<div class="action-card" data-reveal>
          <span class="action-card__icon">${ICONS[icon]}</span>
          <h3>${title}</h3>
          <p>${text}</p>
          ${cta ? `<a class="btn btn--ghost" href="${url(href)}">${cta}</a>` : ''}
        </div>`;
}

/** Hands the reader on to the next page in a sequence. */
function nextStep({ label, cta, href, url }) {
  return `<div class="next-step" data-reveal>
        <p class="next-step__label">${label}</p>
        <a class="link-arrow" href="${url(href)}">${cta} ${ICONS.arrow}</a>
      </div>`;
}

/** Numbered steps for programme pages. */
function stepList(steps) {
  return `<ol class="steps" data-reveal>
        ${steps
          .map(
            (s) => `<li>
          <div>
            <h3>${s.title}</h3>
            <p>${s.text}</p>
          </div>
        </li>`
          )
          .join('\n        ')}
      </ol>`;
}

/** Flags copy the ministry still needs to supply. */
function needs(what) {
  return `<span class="needs-content">Needs from AM: ${what}</span>`;
}

/** Give / partner band, repeated at the foot of most pages. */
function ctaBand(url) {
  return `
<section class="cta-band">
  <div class="container cta-band__inner">
    <div data-reveal>
      <p class="eyebrow eyebrow--on-dark">Partner with us</p>
      <h2>Send someone you will never meet.</h2>
      <p class="lede">Every gift puts Bible study, training and a sending community within reach of students who are ready to go.</p>
    </div>
    <div class="hero__actions" data-reveal>
      <a class="btn btn--lg" href="${url('/give/')}">Give today ${ICONS.arrow}</a>
      <a class="btn btn--lg btn--ghost-light" href="${url('/contact/')}">Talk to us</a>
    </div>
  </div>
</section>

<section class="field-notes">
  <div class="field-notes__media"><img src="${url('/assets/img/feature-campuses.svg')}" alt="" loading="lazy" width="1600" height="420"></div>
  <div class="container field-notes__inner">
    <div data-reveal>
      <h2>Field Notes from the Campuses</h2>
      <p>A short monthly letter: what students are seeing, where AM is going next, and how to pray.</p>
    </div>
    <div class="hero__actions" data-reveal style="margin-bottom:0">
      <a class="btn btn--lg" href="${url('/academy/')}">AM Academy ${ICONS.arrow}</a>
    </div>
  </div>
</section>`;
}

/** Standard interior page top. Pass `photo` for a full-bleed image background. */
function pageHero({ title, lede, crumbs, url, photo }) {
  const trail = (crumbs || [])
    .map(([label, href]) =>
      href ? `<li><a href="${url(href)}">${label}</a></li>` : `<li>${label}</li>`
    )
    .join('\n        ');
  return `
<section class="page-hero${photo ? ' page-hero--photo' : ''}">
  ${photo ? `<div class="page-hero__media"><img src="${url(photo)}" alt="" loading="lazy" width="1920" height="760"></div>` : ''}
  <div class="container">
    <ol class="breadcrumb">
        ${trail}
    </ol>
    <h1>${title}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ''}
  </div>
</section>`;
}

function subnav(items, current, url) {
  return `
<nav class="subnav" aria-label="Section">
  <div class="container">
    <ul>
      ${items
        .map(
          ([label, href]) =>
            `<li><a href="${url(href)}"${href === current ? ' aria-current="page"' : ''}>${label}</a></li>`
        )
        .join('\n      ')}
    </ul>
  </div>
</nav>`;
}

const ABOUT_SUBNAV = [
  ['Who we are', '/about/'],
  ['Mission statement', '/about/mission/'],
  ['Statement of faith', '/about/beliefs/'],
  ['History', '/about/history/'],
  ['Leadership', '/about/leadership/'],
  ['Ralph D. Winter', '/about/legacy/']
];

const JOURNEY_SUBNAV = [
  ['Connect', '/get-involved/connect/'],
  ['Grow', '/get-involved/grow/'],
  ['Lead', '/get-involved/lead/'],
  ['Sent', '/get-involved/sent/'],
];

const DO_SUBNAV = [
  ['What we do', '/what-we-do/'],
  ['Bible Study Program', '/what-we-do/bible-study/'],
  ['Four Spiritual Themes', '/what-we-do/four-spiritual-themes/'],
  ['AM Academy', '/academy/']
];

/* ------------------------------------------------------------ shared data -- */

// AM's real chapter network, taken from the "Our Network" page of amintl.org.
// Coordinates and regions live in tools/content/chapters.js.
const CHAPTER_DATA = require('./content/chapters');
const CHAPTERS = CHAPTER_DATA.map(([, city, country]) => [
  'AM ' + city,
  city + ', ' + country,
]);

const MINISTRIES = [
  {
    id: 'la-familia',
    img: '/assets/img/ministry-la-familia.svg',
    tag: 'Fellowship',
    title: 'La Familia',
    // [SOURCED] amintl.org/our-ministries/
    text: 'A Latino student fellowship dedicated to fueling the faith of brothers and sisters from the Latin world.'
  },
  {
    id: 'athletics',
    img: '/assets/img/ministry-athletics.svg',
    tag: 'Fellowship',
    title: 'AM Athletics',
    // [SOURCED]
    text: 'For anyone into sport and the love of Jesus — bringing glory to the Lord in competition and edifying teammates in the faith.'
  },
  {
    id: 'business',
    img: '/assets/img/ministry-business.svg',
    tag: 'Fellowship',
    title: 'AM Business Fellowship',
    // [SOURCED]
    text: 'For the young and hungry business leaders of tomorrow who want to use their God-given talents to help spread the Gospel.'
  },
  {
    id: 'chinese',
    img: '/assets/img/ministry-chinese.svg',
    tag: 'Mission',
    title: 'Chinese Mission',
    text: 'Biblical programs and community for Chinese students studying at colleges across the United States.'
  },
  {
    id: 'academy',
    img: '/assets/img/ministry-academy.svg',
    tag: 'Training',
    title: 'AM Academy for World Missions',
    text: 'Online and in-person courses in Scripture, missiology and leadership for students preparing to be sent.'
  },
  {
    id: 'worship',
    img: '/assets/img/ministry-worship.svg',
    tag: 'Creative',
    title: 'Worship & Creative',
    text: 'Musicians, writers and designers serving campus gatherings, retreats and the wider sending community.'
  }
];

/* ------------------------------------------------------ shared AM content -- */

/* [SOURCED] The four-stage framework from the current amintl.org homepage. */
const STAGES = [
  {
    id: 'connect',
    label: 'Connect',
    title: 'Connect with AM',
    text: 'AM offers various Bible study programs that nurture our spiritual life and relationship with the Lord Jesus Christ.',
    img: '/assets/img/ministry-la-familia.svg',
    icon: 'users'
  },
  {
    id: 'grow',
    label: 'Grow',
    title: 'Grow with AM',
    text: 'Join our Group Activities and mature together in the fellowship of truth. Our Group programs provide high-quality experiences for every student to gain spiritual strength.',
    img: '/assets/img/ministry-academy.svg',
    icon: 'book'
  },
  {
    id: 'lead',
    label: 'Lead',
    title: 'Lead with AM',
    text: 'AM is happy to welcome students interested in volunteering and serving through their God given talents in various departments.',
    img: '/assets/img/ministry-business.svg',
    icon: 'heart'
  },
  {
    id: 'sent',
    label: 'Sent',
    title: 'Sent with AM',
    text: 'AM will continue to walk with you until your precious calling of &ldquo;being sent&rdquo; is fulfilled in your life even after your graduation!',
    img: '/assets/img/ministry-athletics.svg',
    icon: 'send'
  }
];

/* [SOURCED] Media items listed on the current homepage. */
const MEDIA = [
  ['Four Spiritual Themes &ndash; Overview', '2026-01-05', 'January 5, 2026', '/what-we-do/four-spiritual-themes/'],
  ['What is Salvation? | Sola Fide Part 1 &ndash; AM Academy', '2023-06-27', 'June 27, 2023', '/academy/'],
  ['Era of Social Media Discipleship, Connecting Students to Reality of the Gospel', '2022-06-03', 'June 3, 2022', '/news/'],
  ['God&rsquo;s Promises For the New Year', '2022-01-02', 'January 2, 2022', '/news/']
];

/* [SOURCED] Events listed on the current homepage. */
const EVENTS = [
  ['Easter Retreat', 'April 4&ndash;5'],
  ['Lenten 40-Day Walk', 'February 18'],
  ['New Chapter Leaders&rsquo; Meeting', 'January 16']
];

function stageCard(stage, url) {
  return `<a class="card" href="${url('/get-involved/#' + stage.id)}" data-reveal>
          <div class="card__media">
            <img src="${url(stage.img)}" alt="" loading="lazy" width="800" height="500">
            <span class="card__tag">${stage.label}</span>
          </div>
          <div class="card__body">
            <h3>${stage.title}</h3>
            <p>${stage.text}</p>
            <p class="card__meta">Learn more</p>
          </div>
        </a>`;
}

function mediaList(url) {
  return MEDIA.map(
    ([title, iso, human, href]) => `<li>
            <a href="${url(href)}">
              <h3>${title}</h3>
              <time datetime="${iso}">${human}</time>
            </a>
          </li>`
  ).join('\n          ');
}

function eventsRow(url) {
  return EVENTS.map(
    ([name, when]) => `<a class="event-chip" href="${url('/events/')}" data-reveal>
          <span>${when}</span>
          <strong>${name}</strong>
        </a>`
  ).join('\n        ');
}

/* ------------------------------------------------------------- home page -- */

function homePage(url) {
  const chapterItems = CHAPTERS.map(
    ([name, place]) =>
      `<li><a href="${url('/network/')}"><span class="name">${name}</span><span class="place">${place}</span></a></li>`
  ).join('\n          ');

  return `
<section class="hero">
  <div class="hero__sky"></div>
  <canvas class="hero__stars" aria-hidden="true"></canvas>
  <div class="hero__horizon"></div>

  <div class="container hero__inner">
    <div class="hero__copy">
      <p class="eyebrow eyebrow--on-dark">Apostolos &mdash; one who is sent</p>
      <h1>Future Begins from <span class="accent">Where We Are</span>.</h1>
      <p class="hero__lede">
        Apostolos Missions International is an interdenominational ministry committed to
        spreading the gospel to the ends of the earth &mdash; a worldwide community of
        believers mobilising campus mission from Trenton, New Jersey outward.
      </p>
      <div class="hero__actions">
        <a class="btn btn--lg" href="${url('/what-we-do/bible-study/')}">Join our Bible Study ${ICONS.arrow}</a>
        <a class="btn btn--lg btn--ghost-light" href="${url('/about/')}">Who we are</a>
      </div>
      <dl class="hero__meta">
        <div><dt class="visually-hidden">Founded</dt><dd><strong>2003</strong> Sending since</dd></div>
        <div><dt class="visually-hidden">Headquarters</dt><dd><strong>Trenton</strong> New Jersey, USA</dd></div>
        <div><dt class="visually-hidden">Reach</dt><dd><strong>Global</strong> Campus network</dd></div>
      </dl>
    </div>

    <div class="globe" data-globe>
      <canvas class="globe__canvas"></canvas>
      <div class="globe__atmos"></div>
      <div class="globe__tip" role="status"></div>
      <p class="globe__hint">Drag to explore</p>
    </div>
  </div>
</section>

<section class="quicklinks">
  <div class="container">
    <div class="quicklinks__grid">
      ${quicklink({ href: '/what-we-do/bible-study/', icon: 'book', title: 'Join a Bible study', text: 'The 5-phase online discipleship and Bible education program.', url })}
      ${quicklink({ href: '/network/', icon: 'pin', title: 'Find your campus', text: 'Our network of chapters and fellowships.', url })}
      ${quicklink({ href: '/get-involved/', icon: 'users', title: 'Get involved', text: 'Connect, grow, lead and be sent with AM.', url })}
      ${quicklink({ href: '/give/', icon: 'heart', title: 'Support the mission', text: 'Give, pray and partner with students in the field.', url })}
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head section-head--center" data-reveal>
      <p class="eyebrow">Join our Bible Study Program</p>
      <h2>A 5-phase path from first question to being sent.</h2>
      <p class="lede">
        AM&rsquo;s 5-phase Bible Study Program is an online discipleship and Bible education
        program that leads students through a systematic flow of learning the Gospel of Jesus
        Christ and the life of faith. The program groups students with Bible teachers who will
        give instruction according to the listener&rsquo;s schedule. It culminates with the
        opportunity to volunteer, train as a student missionary, or simply dive deeper into
        the Word of God with AM.
      </p>
      <p style="margin-top:2rem">
        <a class="btn btn--lg" href="${url('/what-we-do/bible-study/')}">Start the program ${ICONS.arrow}</a>
      </p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head section-head--split">
      <div data-reveal>
        <p class="eyebrow">Connect &middot; Grow &middot; Lead &middot; Sent</p>
        <h2>Four steps, and we walk every one of them with you.</h2>
      </div>
      <div class="section-head__aside" data-reveal>
        <a class="link-arrow" href="${url('/get-involved/')}">Get involved ${ICONS.arrow}</a>
      </div>
    </div>
    <div class="grid grid--4">
      ${STAGES.map((st) => stageCard(st, url)).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="mission">
      <div data-reveal>
        <p class="eyebrow">Our mission</p>
        <p class="mission__quote">
          Preach the gospel, make disciples,
          <span class="accent">equip leaders, and send them out.</span>
        </p>
        <a class="link-arrow" href="${url('/about/mission/')}">Read the full mission statement ${ICONS.arrow}</a>
      </div>
      <div class="stack" data-reveal>
        <p class="lede">
          Apostolos Missions International is an interdenominational ministry committed to
          spreading the gospel to the ends of the earth, testifying to the eternal love of
          the Lord.
        </p>
        <p>
          The name <em>apostolos</em> (&#7936;&pi;&#8057;&sigma;&tau;&omicron;&lambda;&omicron;&sigmaf;) is the Greek word for apostle. It means
          &ldquo;one who is sent on a mission&rdquo; or &ldquo;messenger.&rdquo;
        </p>
        <a class="link-arrow" href="${url('/about/history/')}">Our history ${ICONS.arrow}</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--navy">
  <div class="container">
    <div class="section-head section-head--split">
      <div data-reveal>
        <p class="eyebrow eyebrow--on-dark">Media</p>
        <h2>Teaching, testimony and the Word.</h2>
      </div>
      <div class="section-head__aside" data-reveal>
        <a class="link-arrow" href="${url('/news/')}">More contents ${ICONS.arrow}</a>
      </div>
    </div>
    <div class="media">
      <div class="media__player" data-reveal>
        <img src="${url('/assets/img/feature-chapters.svg')}" alt="" loading="lazy" width="1200" height="800">
        <!-- PLACEHOLDER: drop AM's homepage video in here in place of the image. -->
        <button class="media__play" type="button" aria-label="Play the AM introduction video">
          <span><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
        </button>
      </div>
      <ul class="media__list" data-reveal>
          ${mediaList(url)}
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head section-head--split">
      <div data-reveal>
        <p class="eyebrow">Events</p>
        <h2>Where the network gathers.</h2>
      </div>
      <div class="section-head__aside" data-reveal>
        <a class="link-arrow" href="${url('/events/')}">All events ${ICONS.arrow}</a>
      </div>
    </div>
    <div class="events-row">
        ${eventsRow(url)}
    </div>
  </div>
</section>

<section class="section section--space">
  <div class="container">
    <div class="finder">
      <div data-reveal>
        <p class="eyebrow eyebrow--on-dark">Our network</p>
        <h2>There may already be a fellowship on your campus.</h2>
        <p class="lede">Search by school or city. If nothing comes up near you, that is an invitation &mdash; we will help you start one.</p>
        <div class="hero__actions" style="margin-top:2rem">
          <a class="btn" href="${url('/get-involved/chapter-affiliation/')}">Start a chapter ${ICONS.arrow}</a>
        </div>
      </div>
      <div data-reveal>
        <form class="finder__form" role="search">
          <div class="field">
            <span class="field__icon">${ICONS.search}</span>
            <label class="visually-hidden" for="chapter-search">Search the network</label>
            <input id="chapter-search" type="search" placeholder="Search school or city" data-chapter-search autocomplete="off">
          </div>
        </form>
        <!-- PLACEHOLDER campus list - replace with AM's real chapter directory. -->
        <ul class="chapter-list" data-chapter-list>
          ${chapterItems}
        </ul>
        <p class="chapter-list__empty" data-chapter-empty hidden>No chapters matched. <a href="${url('/contact/')}">Tell us where you are.</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section section--navy">
  <div class="container">
    <div class="legacy">
      <div class="legacy__portrait" data-reveal>
        <img src="${url('/assets/img/portrait-winter.svg')}" alt="Portrait of Dr. Ralph D. Winter" loading="lazy" width="640" height="800">
      </div>
      <div data-reveal>
        <p class="eyebrow eyebrow--on-dark">Our first chairman</p>
        <blockquote>
          AM continues the legacy of world evangelisation established by the
          missiologist Dr. Ralph D. Winter.
          <cite>Dr. Ralph D. Winter, 1924&ndash;2009</cite>
        </blockquote>
        <p class="lede" style="margin-top:1.5rem">
          Winter opened a new paradigm for the role of churches, mission structures and
          outreach among unreached people groups. He founded the U.S. Center for World
          Mission, William Carey International University and the International Society
          for Frontier Missiology, and served as AM&rsquo;s first honorary chairman.
        </p>
        <a class="link-arrow" href="${url('/about/legacy/')}">His legacy ${ICONS.arrow}</a>
      </div>
    </div>
  </div>
</section>
${ctaBand(url)}`;
}

/* -------------------------------------------------------------- pages ----- */

function buildPages() {
  const pages = [];

  const add = (p) => pages.push(p);

  /* ---- home ---- */
  add({
    file: 'index.html',
    depth: 0,
    canonical: '/',
    title: 'Sending students to the ends of the earth',
    description:
      'Apostolos Missions International is an interdenominational ministry mobilising campus mission — Bible study, leadership training and sending, on university campuses worldwide.',
    globe: true,
    build: homePage
  });

  /* ---- about ---- */
  add({
    file: 'about/index.html',
    depth: 1,
    canonical: '/about/',
    active: '/about/',
    title: 'Who we are',
    description:
      'Apostolos Missions International is an interdenominational ministry committed to spreading the gospel to the ends of the earth.',
    build: (url) => `
${pageHero({
  title: 'Who we are',
  lede: 'An interdenominational ministry committed to spreading the gospel to the ends of the earth, testifying to the eternal love of the Lord.',
  crumbs: [['Home', '/'], ['About']],
  photo: '/assets/img/hero-about.svg',
  url
})}
${subnav(ABOUT_SUBNAV, '/about/', url)}
<section class="section">
  <div class="container">
    <div class="prose" data-reveal>
      <p class="lede">Apostolos Missions International (AM) is an interdenominational ministry committed to spreading the gospel to the ends of the earth, testifying to the eternal love of the Lord.</p>
      <p>The name <em>apostolos</em> (&#7936;&pi;&#8057;&sigma;&tau;&omicron;&lambda;&omicron;&sigmaf;) is the Greek word for apostle. It means &ldquo;one who is sent on a mission&rdquo; or &ldquo;messenger.&rdquo; The title &ldquo;apostle&rdquo; often comes out in the New Testament to represent the Twelve disciples appointed by Jesus (Matthew 10:2, Mark 3:14, Luke 6:13, Acts 2:42). Paul, a former persecutor of Christianity turning to a great herald of the gospel, introduced himself as an &ldquo;apostle&rdquo; (Romans 1:1, 1 Corinthians 1:1, 2 Corinthians 1:1, Galatians 1:1, Colossians 1:1, 1 Timothy 1:1, 2 Timothy 1:1, Titus).</p>
      <p>Apostles are those who are sent by the Lord to fulfill the mission of &ldquo;preaching Jesus Christ and making God known&rdquo; to the whole creation. Biblical foundation of apostleship is found in many words of the Lord who selected first apostles and sent them out like the ambassadors dispatched to represent different nations. Apostles understood that their lives were not just their own, but they lived to reveal the glory of Christ in this fallen world.</p>
      <blockquote>John 20:21 says, &ldquo;Again Jesus said, &lsquo;Peace be with you! As the Father has sent me, I am sending you.&rsquo;&rdquo; (NIV)</blockquote>
      <p>AM wishes to follow the tradition of the apostles who lived as people on a mission to proclaim the Word of God. Each of us also receive this calling from God to be sent out into the world as His hands and feet. We wish to dedicate our lives to follow the footsteps of Jesus and proclaim the Gospel until the ends of the earth.</p>
      <p>Just as our lives have been touched and changed by the Lord, we wish to reveal the love of the Lord that was shown to us, becoming a beacon for all of His lost children and our fellow brothers and sisters.</p>
      <p><a href="${url('/about/beliefs/')}">Read our statement of faith</a> or <a href="${url('/about/history/')}">trace the history</a>.</p>
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head section-head--center" data-reveal>
      <p class="eyebrow">In practice</p>
      <h2>Four things we do everywhere we go.</h2>
    </div>
    <div class="pillars">
      ${pillar({ title: 'Bible study', text: 'Small and large group study that puts Scripture at the centre of campus life.' })}
      ${pillar({ title: 'Leadership training', text: 'Students are coached to lead their peers, then to send the next group out.' })}
      ${pillar({ title: 'Online education', text: 'AM Academy courses in Scripture, missiology and cross-cultural ministry.' })}
      ${pillar({ title: 'Internships & trips', text: 'Short-term missions and internships that turn training into practice.' })}
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  add({
    file: 'about/mission/index.html',
    depth: 2,
    canonical: '/about/mission/',
    active: '/about/',
    title: 'Mission statement',
    description:
      'Apostolos Missions’ mission is to preach Jesus and Him crucified, mobilising campus mission worldwide.',
    build: (url) => `
${pageHero({
  title: 'Mission statement',
  lede: 'A worldwide community of believers dedicated to the spreading of the Gospel across university campuses.',
  crumbs: [['Home', '/'], ['About', '/about/'], ['Mission statement']],
  url
})}
${subnav(ABOUT_SUBNAV, '/about/mission/', url)}
<section class="section">
  <div class="container">
    <div class="prose" data-reveal>
      <blockquote>Apostolos Missions&rsquo; mission is to preach Jesus and Him crucified.</blockquote>
      <p class="lede">AM International is a worldwide community of believers dedicated towards the spreading of the Gospel across university campuses. Our aim is to foster a Christ-centred network of young Christians for the mobilisation of campus mission.</p>
      <h2>Why the campus</h2>
      <p>University is the point in life where questions are most open and commitments are most formative. A student reached on campus carries the Gospel into a career, a family and often a country that no missionary could easily enter.</p>
      <h2>Why interdenominational</h2>
      <p>AM does not gather students away from the church. It gathers them from many churches, trains them together around what is central, and returns them to their congregations ready to serve.</p>
      <h2>Why sending</h2>
      <p>Discipleship that never leaves the room is incomplete. Every part of AM &mdash; study, training, fellowship, the Academy &mdash; points toward being sent.</p>
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  add({
    file: 'about/beliefs/index.html',
    depth: 2,
    canonical: '/about/beliefs/',
    active: '/about/',
    title: 'Statement of faith',
    description: 'What Apostolos Missions International believes and teaches.',
    build: (url) => `
${pageHero({
  title: 'Statement of faith',
  lede: 'The convictions AM holds in common across every campus, chapter and country.',
  crumbs: [['Home', '/'], ['About', '/about/'], ['Statement of faith']],
  url
})}
${subnav(ABOUT_SUBNAV, '/about/beliefs/', url)}
<section class="section">
  <div class="container container--prose">
    <div data-reveal>
      <p class="lede" style="margin-bottom:2.5rem">The following is an abridged summary. <!-- PLACEHOLDER: replace with AM's full statement of faith from amintl.org/about-us/statement-of-faith/ --></p>
      <div class="accordion">
        ${accordionItem({
          q: 'Salvation',
          a: '<p>We believe that salvation consists in the remission of sins, the imputation of Christ&rsquo;s righteousness, and the gift of eternal life, received by faith alone, apart from works.</p>'
        })}
        ${accordionItem({
          q: 'The Great Commission',
          a: '<p>We believe that Christ instructed the Church to go into the entire world and preach the Gospel to every person, baptising and teaching those who believe.</p>'
        })}
        ${accordionItem({
          q: 'Scripture',
          a: '<p>PLACEHOLDER &mdash; add AM&rsquo;s article on the authority and inspiration of Scripture.</p>'
        })}
        ${accordionItem({
          q: 'God and the Trinity',
          a: '<p>PLACEHOLDER &mdash; add AM&rsquo;s article on the nature of God.</p>'
        })}
        ${accordionItem({
          q: 'The Church',
          a: '<p>PLACEHOLDER &mdash; add AM&rsquo;s article on the Church and its mission.</p>'
        })}
      </div>
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  add({
    file: 'about/history/index.html',
    depth: 2,
    canonical: '/about/history/',
    active: '/about/',
    title: 'Our history',
    description:
      'From a small group of students in Los Angeles to a global campus mission organisation.',
    build: (url) => `
${pageHero({
  title: 'Our history',
  lede: 'From a small group of students in Los Angeles to a worldwide sending community.',
  crumbs: [['Home', '/'], ['About', '/about/'], ['History']],
  url
})}
${subnav(ABOUT_SUBNAV, '/about/history/', url)}
<section class="section">
  <div class="container container--prose">
    <div data-reveal>
      <ol class="timeline">
        <li>
          <span class="timeline__year">Beginnings</span>
          <p>A small group of passionate young students in Los Angeles, California, eager to spread the gospel and make Jesus known, begins meeting for study and outreach.</p>
        </li>
        <li>
          <span class="timeline__year">December 2003</span>
          <p>The fellowship formally becomes Apostolos Missions International. Missiologist Dr. Ralph D. Winter serves as its first honorary chairman, and he and the staff of the U.S. Center for World Mission advise the AM student board on developing mission around the world.</p>
        </li>
        <li>
          <span class="timeline__year">2015</span>
          <p>AM moves its headquarters from the West Coast to Dover, New York.</p>
        </li>
        <li>
          <span class="timeline__year">2020</span>
          <p>The headquarters office relocates to Trenton, New Jersey, where it remains today.</p>
        </li>
        <li>
          <span class="timeline__year">2024</span>
          <p>AM marks its 21st anniversary under the banner &ldquo;Preach Jesus Christ as Lord.&rdquo;</p>
        </li>
      </ol>
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  add({
    file: 'about/leadership/index.html',
    depth: 2,
    canonical: '/about/leadership/',
    active: '/about/',
    title: 'Leadership & staff',
    description: 'The people who steer and serve Apostolos Missions International.',
    build: (url) => `
${pageHero({
  title: 'Leadership & staff',
  lede: 'The people who steer, teach and serve across AM’s campuses and offices.',
  crumbs: [['Home', '/'], ['About', '/about/'], ['Leadership']],
  url
})}
${subnav(ABOUT_SUBNAV, '/about/leadership/', url)}
<section class="section">
  <div class="container">
    <div class="people">
      ${person({
        img: '/assets/img/person-1.svg',
        name: 'Alma Osorio-Ford',
        role: 'Executive Director',
        text: 'Steers and leads the administration, mission and operation of AM world mission.',
        url
      })}
      ${person({
        img: '/assets/img/person-2.svg',
        name: 'Rev. Dr. Paul DeVries',
        role: 'Spiritual guidance',
        text: 'Provides wisdom and spiritual guidance for the mission. President of the New York Divinity School, with over 25 years of leadership in Christian higher education administration.',
        url
      })}
      ${person({
        img: '/assets/img/person-3.svg',
        name: 'Can Liu',
        role: 'Director, Chinese Mission',
        text: 'Directs the Chinese mission in the United States and creates Biblical programs for overseas Chinese students studying in US colleges.',
        url
      })}
      ${person({
        img: '/assets/img/person-4.svg',
        name: 'Your name here',
        role: 'Placeholder',
        text: 'PLACEHOLDER — add the remaining staff and chapter leaders from amintl.org/about-us/our-leadership/ and /chapter-staff/.',
        url
      })}
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  add({
    file: 'about/legacy/index.html',
    depth: 2,
    canonical: '/about/legacy/',
    active: '/about/',
    title: 'Legacy of Ralph D. Winter',
    description:
      'AM continues the legacy of world evangelisation established by missiologist Dr. Ralph D. Winter, its first honorary chairman.',
    build: (url) => `
${pageHero({
  title: 'The legacy of Ralph D. Winter',
  lede: 'AM’s first honorary chairman, and the missiology the ministry still carries forward.',
  crumbs: [['Home', '/'], ['About', '/about/'], ['Ralph D. Winter']],
  url
})}
${subnav(ABOUT_SUBNAV, '/about/legacy/', url)}
<section class="section">
  <div class="container">
    <div class="legacy" style="--x:0">
      <div class="legacy__portrait" data-reveal style="border-color:var(--line-light)">
        <img src="${url('/assets/img/portrait-winter.svg')}" alt="Portrait of Dr. Ralph D. Winter" loading="lazy" width="640" height="800">
      </div>
      <div class="prose" data-reveal>
        <p class="lede">Ralph D. Winter was born on 8 December 1924 in Los Angeles, California. He was an accomplished missiologist and missionary who opened a new paradigm regarding the role of churches, mission structures, and outreach among unreached people groups.</p>
        <p>He founded the U.S. Center for World Mission, William Carey International University, and the International Society for Frontier Missiology. He was known for his creative approach to missions and his strategies for overcoming cultural and societal barriers to delivering the Gospel of Jesus Christ.</p>
        <p>When the fellowship formally became Apostolos Missions International in December 2003, Winter served as its first honorary chairman. He and the staff of the U.S. Center for World Mission advised the AM student board on how to develop mission around the world.</p>
        <blockquote>Apostolos Missions International continues the legacy of world evangelisation as established by Ralph D. Winter.</blockquote>
      </div>
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  /* ---- what we do ---- */
  add({
    file: 'what-we-do/index.html',
    depth: 1,
    canonical: '/what-we-do/',
    active: '/what-we-do/',
    title: 'What we do',
    description:
      'Bible study, leadership training, online education, internships and short-term mission trips on university campuses.',
    build: (url) => `
${pageHero({
  title: 'What we do',
  lede: 'AM staff, volunteers and members use their talents and gifts to participate in God’s mission of teaching the Gospel and making disciples among the youth of the world.',
  crumbs: [['Home', '/'], ['What we do']],
  url
})}
${subnav(DO_SUBNAV, '/what-we-do/', url)}
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">The pattern</p>
      <h2>Study, training, sending — in that order, on repeat.</h2>
    </div>
    <div class="pillars">
      ${pillar({ title: 'Bible study', text: 'Small and large group study that puts Scripture at the centre of campus life.' })}
      ${pillar({ title: 'Leadership training', text: 'Students are coached to lead their peers, then to send the next group out.' })}
      ${pillar({ title: 'Online education', text: 'AM Academy courses in Scripture, missiology and cross-cultural ministry.' })}
      ${pillar({ title: 'Internships & trips', text: 'Short-term missions and internships that turn training into practice.' })}
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="grid grid--2">
      ${card({ href: '/get-involved/chapter-affiliation/', img: '/assets/img/feature-chapters.svg', alt: '', tag: 'Campus', title: 'Chapter affiliation', text: 'Bring an AM fellowship to your campus, with training, curriculum and a staff coach alongside you.', url })}
      ${card({ href: '/academy/', img: '/assets/img/feature-academy.svg', alt: '', tag: 'Training', title: 'AM Academy for World Missions', text: 'Courses in Scripture, missiology and leadership for students preparing to be sent.', url })}
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  add({
    file: 'get-involved/chapter-affiliation/index.html',
    depth: 2,
    canonical: '/get-involved/chapter-affiliation/',
    active: '/what-we-do/',
    title: 'Chapter affiliation',
    description:
      'How to start an Apostolos Missions chapter on your campus and affiliate with AM.',
    build: (url) => `
${pageHero({
  title: 'Chapter affiliation',
  lede: 'Start an AM fellowship on your campus — and do not start it alone.',
  crumbs: [['Home', '/'], ['Get Involved', '/get-involved/'], ['Chapter affiliation']],
  url
})}
${subnav(DO_SUBNAV, '/get-involved/chapter-affiliation/', url)}
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">How it works</p>
      <h2>Four steps from an idea to a chapter.</h2>
    </div>
    <div class="pillars">
      ${pillar({ title: 'Get in touch', text: 'Tell us your campus and who is already with you. A staff member follows up.' })}
      ${pillar({ title: 'Gather a core', text: 'Two or three committed students are enough to begin meeting and studying.' })}
      ${pillar({ title: 'Train together', text: 'Your core works through AM leadership training with a coach alongside.' })}
      ${pillar({ title: 'Affiliate', text: 'Formal affiliation brings curriculum, retreats, the wider network and sending pathways.' })}
    </div>
    <div class="prose" style="margin-top:3.5rem" data-reveal>
      <p class="lede">PLACEHOLDER &mdash; replace with AM&rsquo;s actual affiliation requirements, application form link and staff contact from amintl.org/whatwedo/chapter-affiliation/.</p>
      <p><a href="${url('/contact/')}">Contact us to start the conversation.</a></p>
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  add({
    file: 'what-we-do/four-spiritual-themes/index.html',
    depth: 2,
    canonical: '/what-we-do/four-spiritual-themes/',
    active: '/what-we-do/',
    title: 'Four spiritual themes',
    description: 'The four spiritual themes that shape AM’s teaching and discipleship.',
    build: (url) => `
${pageHero({
  title: 'Four spiritual themes',
  lede: 'The teaching framework that runs through AM Bible studies, retreats and training.',
  crumbs: [['Home', '/'], ['What we do', '/what-we-do/'], ['Four spiritual themes']],
  url
})}
${subnav(DO_SUBNAV, '/what-we-do/four-spiritual-themes/', url)}
<section class="section">
  <div class="container">
    <div class="prose" data-reveal style="margin-bottom:3rem">
      <p class="lede">PLACEHOLDER &mdash; replace the four themes below with AM&rsquo;s own overview from amintl.org/four-spiritual-themes-overview/.</p>
    </div>
    <div class="pillars">
      ${pillar({ title: 'Theme one', text: 'Placeholder summary of the first spiritual theme.' })}
      ${pillar({ title: 'Theme two', text: 'Placeholder summary of the second spiritual theme.' })}
      ${pillar({ title: 'Theme three', text: 'Placeholder summary of the third spiritual theme.' })}
      ${pillar({ title: 'Theme four', text: 'Placeholder summary of the fourth spiritual theme.' })}
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  add({
    file: 'what-we-do/bible-study/index.html',
    depth: 2,
    canonical: '/what-we-do/bible-study/',
    active: '/what-we-do/',
    title: '5-Phase Bible Study Program',
    description:
      'An online discipleship and Bible education program that leads students through a systematic flow of learning the Gospel of Jesus Christ and the life of faith.',
    build: (url) => `
${pageHero({
  title: 'Join our Bible Study Program',
  lede: 'An online discipleship and Bible education program that leads students through a systematic flow of learning the Gospel of Jesus Christ and the life of faith.',
  crumbs: [['Home', '/'], ['What We Do', '/what-we-do/'], ['Bible Study Program']],
  url
})}
${subnav(DO_SUBNAV, '/what-we-do/bible-study/', url)}
<section class="section">
  <div class="container">
    <div class="prose" data-reveal>
      <p class="lede">The program groups students with Bible teachers who will give instruction according to the listener&rsquo;s schedule. It culminates with the opportunity to volunteer, train as a student missionary, or simply dive deeper into the Word of God with AM.</p>
    </div>
    <div class="pillars" style="margin-top:3rem">
      ${pillar({ title: 'Phase one', text: 'PLACEHOLDER &mdash; add the real description of phase one from amintl.org.' })}
      ${pillar({ title: 'Phase two', text: 'PLACEHOLDER &mdash; add the real description of phase two.' })}
      ${pillar({ title: 'Phase three', text: 'PLACEHOLDER &mdash; add the real description of phase three.' })}
      ${pillar({ title: 'Phase four', text: 'PLACEHOLDER &mdash; add the real description of phase four.' })}
      ${pillar({ title: 'Phase five', text: 'PLACEHOLDER &mdash; add the real description of phase five.' })}
    </div>
    <div class="prose" style="margin-top:3rem" data-reveal>
      <p><a href="${url('/contact/')}">Ask about joining the next intake.</a></p>
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  /* ---- get involved ---- */
  add({
    file: 'get-involved/index.html',
    depth: 1,
    canonical: '/get-involved/',
    active: '/get-involved/',
    title: 'Get involved',
    description:
      'Connect, grow, lead and be sent with Apostolos Missions International.',
    build: (url) => `
${pageHero({
  title: 'Connect. Grow. Lead. Sent.',
  lede: 'Four steps into the mission — and AM walks every one of them with you.',
  crumbs: [['Home', '/'], ['Get Involved']],
  url
})}
<section class="section">
  <div class="container">
    <div class="grid grid--4">
      ${STAGES.map((st) => stageCard(st, url)).join('\n      ')}
    </div>
  </div>
</section>

${STAGES.map(
  (st, i) => `
<section class="section${i % 2 === 0 ? ' section--sand' : ''}" id="${st.id}">
  <div class="container">
    <div class="feature${i % 2 === 1 ? ' feature--flip' : ''}" data-reveal>
      <div class="feature__media">
        <img src="${url(st.img)}" alt="" loading="lazy" width="1200" height="800">
      </div>
      <div class="feature__body">
        <p class="eyebrow eyebrow--on-dark">${st.label}</p>
        <h2 style="color:#fff">${st.title}</h2>
        <p class="lede">${st.text}</p>
        <div class="hero__actions">
          <a class="btn" href="${url('/contact/')}">Take this step ${ICONS.arrow}</a>
        </div>
      </div>
    </div>
  </div>
</section>`
).join('\n')}
${ctaBand(url)}`
  });

  /* ---- the four journey pages: Connect, Grow, Lead, Sent ---- */

  // Copy condensed from AM's existing Connect, Grow and Lead pages. Sent has
  // no published page yet, so its detail is flagged rather than invented.
  const JOURNEY = [
    {
      slug: 'connect',
      title: 'Connect',
      heading: 'Stay connected',
      lede: 'AM offers various Bible study programs that nurture our spiritual life and relationship with the Lord Jesus Christ.',
      img: '/assets/img/ministry-la-familia.svg',
      intro: 'God made us to connect with others — to be understood, accepted and cherished. We believe the Gospel builds the foundation of true fellowship among us, and that shared joy in Jesus is the ground we stand on together.',
      actions: [
        { icon: 'mail', title: 'Subscribe', text: 'Receive AM program updates and news from amintl.org and amacademy.org.', cta: 'Subscribe', href: '/contact/' },
        { icon: 'users', title: 'Spiritual counseling', text: 'Meet an AM staff member to ask questions about your personal faith journey.', cta: 'Sign up', href: 'https://www.amacademy.org/introductory-meeting' },
        { icon: 'book', title: 'Online Bible study', text: 'Diverse tracks, from Phase 1 Sola Fide through the Bible Core overview and the Gospel books.', cta: 'Join', href: '/what-we-do/bible-study/' },
        { icon: 'pin', title: 'Local chapter activities', text: 'Prayer meetings, group Bible study, fellowships and weekend activities near you.', cta: 'Find a chapter', href: '/network/' },
      ],
      next: { label: 'Ready to go deeper?', cta: 'Explore Grow', href: '/get-involved/grow/' },
    },
    {
      slug: 'grow',
      title: 'Grow',
      heading: 'Grow with AM',
      lede: 'Join our Group Activities and mature together in the fellowship of truth. Our Group programs provide high-quality experiences for every student to gain spiritual strength.',
      img: '/assets/img/ministry-academy.svg',
      intro: 'Just as we mature through stages in childhood, we pass milestones in spiritual maturity: reborn through the atoning sacrifice of Jesus, matured by truth and spirit, and brought into fruitfulness as our unity with Christ deepens. AM builds programs around all three.',
      actions: [
        { icon: 'users', title: 'Group activities', text: 'Diverse opportunities to hear the Word, pray together, fellowship and serve.', cta: 'See activities', href: '/ministries/' },
        { icon: 'book', title: 'Bible Study Program', text: 'The 5-phase path, from the basics of salvation to the whole sweep of Scripture.', cta: 'Start the program', href: '/what-we-do/bible-study/' },
        { icon: 'globe', title: 'AM Academy', text: 'Study Scripture, missiology and cross-cultural ministry alongside your degree.', cta: 'Explore', href: '/academy/' },
      ],
      next: { label: 'Ready to serve?', cta: 'Explore Lead', href: '/get-involved/lead/' },
    },
    {
      slug: 'lead',
      title: 'Lead',
      heading: 'Lead with AM',
      lede: 'AM is happy to welcome students interested in volunteering and serving through their God given talents in various departments.',
      img: '/assets/img/ministry-business.svg',
      intro: 'As we grow, we want to serve others on their way to Jesus — and in serving we grow deeper in the love of Christ. Leading takes wisdom, prayer, sacrifice and patience, and it is where gifts are discovered and confirmed.',
      actions: [
        { icon: 'heart', title: 'Volunteer', text: 'Serve your chapter and the wider ministry with the time and skills you have.', cta: 'Volunteer', href: '/give/' },
        { icon: 'users', title: 'Chapter staff', text: 'Train to lead local programs, gatherings and meetings on your campus.', cta: 'Chapter staff', href: '/get-involved/chapter-affiliation/' },
        { icon: 'send', title: 'Internship', text: 'Work alongside AM staff and turn training into practice.', cta: 'Apply', href: '/contact/' },
        { icon: 'book', title: 'Bible teachers', text: 'Teach the Word to students beginning their journey.', cta: 'Become a teacher', href: '/what-we-do/bible-study/' },
      ],
      next: { label: 'Ready to be sent?', cta: 'Explore Sent', href: '/get-involved/sent/' },
    },
    {
      slug: 'sent',
      title: 'Sent',
      heading: 'Sent with AM',
      lede: 'AM will continue to walk with you until your precious calling of “being sent” is fulfilled in your life even after your graduation.',
      img: '/assets/img/ministry-athletics.svg',
      intro: 'Being sent is where the whole path leads. AM stays with students beyond graduation, as calling turns into a life.',
      actions: [
        { icon: 'globe', title: 'Short-term missions', text: 'PLACEHOLDER — destinations, dates and how to apply.', cta: 'Find out more', href: '/events/' },
        { icon: 'users', title: 'Alumni Connect', text: 'PLACEHOLDER — how AM stays with graduates and what the network offers.', cta: 'Alumni', href: '/contact/' },
        { icon: 'send', title: 'Student missionary', text: 'PLACEHOLDER — what training as a student missionary involves.', cta: 'Talk to us', href: '/contact/' },
      ],
      next: { label: 'Want to support someone being sent?', cta: 'Give', href: '/give/' },
      flag: 'the real Sent copy — this page has no published equivalent on the current site',
    },
  ];

  JOURNEY.forEach((j) => {
    add({
      file: `get-involved/${j.slug}/index.html`,
      depth: 2,
      canonical: `/get-involved/${j.slug}/`,
      active: '/get-involved/',
      title: j.heading,
      description: j.lede,
      build: (url) => `
${pageHero({
  title: j.heading,
  lede: j.lede,
  crumbs: [['Home', '/'], ['Get Involved', '/get-involved/'], [j.title]],
  url,
})}
${subnav(JOURNEY_SUBNAV, `/get-involved/${j.slug}/`, url)}
<section class="section">
  <div class="container">
    ${pageFigure({ img: j.img, alt: '', url })}
    <div class="prose" data-reveal style="margin-bottom:3rem">
      <p class="lede">${j.intro}</p>
      ${j.flag ? `<p>${needs(j.flag)}</p>` : ''}
    </div>
    <div class="action-grid">
      ${j.actions.map((a) => actionCard({ ...a, url })).join('\n      ')}
    </div>
    ${nextStep({ ...j.next, url })}
  </div>
</section>
${ctaBand(url)}`,
    });
  });

  /* ---- ministries ---- */
  add({
    file: 'ministries/index.html',
    depth: 1,
    canonical: '/ministries/',
    active: '/ministries/',
    title: 'Our ministries',
    description:
      'La Familia, AM Athletics, AM Business Fellowship and more — ministries gathering students around shared gifts and interests.',
    build: (url) => `
${pageHero({
  title: 'Our ministries',
  lede: 'AM has a number of ministries designed to gather people of similar interests and talents — with opportunities to grow in skill and use it to glorify God.',
  crumbs: [['Home', '/'], ['Ministries']],
  url
})}
<section class="section">
  <div class="container">
    <div class="grid grid--3">
      ${MINISTRIES.map(
        (m) => `<div id="${m.id}" style="display:contents">${card({
          href: '/contact/',
          img: m.img,
          alt: '',
          tag: m.tag,
          title: m.title,
          text: m.text,
          url
        })}</div>`
      ).join('\n      ')}
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  /* ---- chapters ---- */
  add({
    file: 'network/index.html',
    depth: 1,
    canonical: '/network/',
    active: '/network/',
    title: 'Our Network',
    description: 'Find an Apostolos Missions fellowship on your campus, or start one.',
    build: (url) => {
      const items = CHAPTERS.map(
        ([name, place]) =>
          `<li><a href="${url('/contact/')}"><span class="name">${name}</span><span class="place">${place}</span></a></li>`
      ).join('\n          ');
      return `
${pageHero({
  title: 'Our Network',
  lede: 'Search by school or city. If there is nothing near you yet, that is an invitation.',
  crumbs: [['Home', '/'], ['Our Network']],
  url
})}
<section class="section section--space">
  <div class="container">
    <div class="finder">
      <div data-reveal>
        <p class="eyebrow eyebrow--on-dark">Not on the list?</p>
        <h2>Start one where you are.</h2>
        <p class="lede">Two or three committed students are enough to begin. We bring the training, the curriculum and a staff coach.</p>
        <div class="hero__actions" style="margin-top:2rem">
          <a class="btn" href="${url('/get-involved/chapter-affiliation/')}">Chapter affiliation ${ICONS.arrow}</a>
        </div>
      </div>
      <div data-reveal>
        <form class="finder__form" role="search">
          <div class="field">
            <span class="field__icon">${ICONS.search}</span>
            <label class="visually-hidden" for="chapter-search">Search chapters</label>
            <input id="chapter-search" type="search" placeholder="Search school or city" data-chapter-search autocomplete="off">
          </div>
        </form>
        <!-- PLACEHOLDER campus list - replace with AM's real chapter directory. -->
        <ul class="chapter-list" data-chapter-list>
          ${items}
        </ul>
        <p class="chapter-list__empty" data-chapter-empty hidden>No chapters matched. <a href="${url('/contact/')}">Tell us where you are.</a></p>
      </div>
    </div>
  </div>
</section>
${ctaBand(url)}`;
    }
  });

  /* ---- academy ---- */
  add({
    file: 'academy/index.html',
    depth: 1,
    canonical: '/academy/',
    active: '/academy/',
    title: 'AM Academy for World Missions',
    description:
      'Courses in Scripture, missiology and cross-cultural ministry for students preparing to be sent.',
    build: (url) => `
${pageHero({
  title: 'AM Academy for World Missions',
  lede: 'Study Scripture, missiology and cross-cultural ministry — online and on campus.',
  crumbs: [['Home', '/'], ['AM Academy']],
  url
})}
${subnav(DO_SUBNAV, '/academy/', url)}
<section class="section">
  <div class="container">
    <div class="feature feature--flip" data-reveal>
      <div class="feature__media">
        <img src="${url('/assets/img/feature-academy.svg')}" alt="" loading="lazy" width="1200" height="800">
      </div>
      <div class="feature__body">
        <p class="eyebrow eyebrow--on-dark">The Academy</p>
        <h2 style="color:#fff">Training that ends in being sent.</h2>
        <p class="lede">PLACEHOLDER &mdash; replace with the Academy&rsquo;s real course list, terms and enrolment details from amintl.org/am-academy/.</p>
        <div class="hero__actions">
          <a class="btn" href="${url('/contact/')}">Ask about enrolment ${ICONS.arrow}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head section-head--center" data-reveal>
      <p class="eyebrow">Curriculum</p>
      <h2>What you will study.</h2>
    </div>
    <div class="pillars">
      ${pillar({ title: 'Scripture', text: 'Placeholder course description.' })}
      ${pillar({ title: 'Missiology', text: 'Placeholder course description.' })}
      ${pillar({ title: 'Cross-cultural ministry', text: 'Placeholder course description.' })}
      ${pillar({ title: 'Leadership', text: 'Placeholder course description.' })}
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  /* ---- events ---- */
  add({
    file: 'events/index.html',
    depth: 1,
    canonical: '/events/',
    active: '/events/',
    title: 'Events & retreats',
    description:
      'Retreats, conferences, internships and short-term mission trips with Apostolos Missions.',
    build: (url) => `
${pageHero({
  title: 'Events & retreats',
  lede: 'Where the network gathers — for teaching, worship and sending.',
  crumbs: [['Home', '/'], ['Events']],
  url
})}
<section class="section">
  <div class="container">
    <div class="feature" data-reveal style="margin-bottom:3rem">
      <div class="feature__media">
        <img src="${url('/assets/img/feature-easter-retreat.svg')}" alt="" loading="lazy" width="1200" height="800">
      </div>
      <div class="feature__body">
        <p class="eyebrow eyebrow--on-dark">Flagship gathering</p>
        <h2 style="color:#fff">USA Easter Retreat</h2>
        <p class="lede">Students from across the country gather for teaching, worship and sending. Registration opens each spring.</p>
        <p style="color:var(--text-on-dark-faint);font-size:.875rem">PLACEHOLDER &mdash; add dates, venue and registration link.</p>
      </div>
    </div>
    <div class="grid grid--3">
      ${card({ href: '/contact/', img: '/assets/img/story-2.svg', alt: '', tag: 'Summer', title: 'Short-term mission trips', text: 'Placeholder — add destinations, dates and application details.', meta: 'Applications open', url })}
      ${card({ href: '/contact/', img: '/assets/img/story-3.svg', alt: '', tag: 'Year-round', title: 'Internships', text: 'Placeholder — add internship tracks and how to apply.', meta: 'Rolling intake', url })}
      ${card({ href: '/academy/', img: '/assets/img/ministry-academy.svg', alt: '', tag: 'Termly', title: 'Academy intensives', text: 'Placeholder — add intensive weekend and online cohort dates.', meta: 'AM Academy', url })}
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  /* ---- stories ---- */
  add({
    file: 'news/index.html',
    depth: 1,
    canonical: '/news/',
    active: '/news/',
    title: 'News',
    description: 'News, media and field reports from Apostolos Missions International.',
    build: (url) => `
${pageHero({
  title: 'News & media',
  lede: 'Teaching, testimony, field reports and what God is doing on campus.',
  crumbs: [['Home', '/'], ['News']],
  url
})}
<section class="section">
  <div class="container">
    <div class="grid grid--3">
      ${card({ href: '#', img: '/assets/img/story-1.svg', alt: '', tag: 'Anniversary', title: 'AM Int&rsquo;l celebrates its 21st anniversary', text: '&ldquo;Preach Jesus Christ as Lord&rdquo; — looking back on two decades of sending students out.', meta: 'Ministry news', url })}
      ${card({ href: '#', img: '/assets/img/story-3.svg', alt: '', tag: 'Archive', title: 'Developing resources to expand world mission', text: 'The teaching legacy AM carries forward from Dr. Ralph D. Winter.', meta: 'From the archive', url })}
      ${card({ href: '#', img: '/assets/img/story-2.svg', alt: '', tag: 'Campus', title: 'A semester of Bible study that changed a hall', text: 'Placeholder — replace with a real campus story.', meta: 'Campus story', url })}
      ${card({ href: '#', img: '/assets/img/ministry-la-familia.svg', alt: '', tag: 'Ministry', title: 'La Familia at five years', text: 'Placeholder — replace with a real ministry feature.', meta: 'Ministry story', url })}
      ${card({ href: '#', img: '/assets/img/ministry-athletics.svg', alt: '', tag: 'Ministry', title: 'Faith on the field', text: 'Placeholder — replace with a real AM Athletics story.', meta: 'Ministry story', url })}
      ${card({ href: '#', img: '/assets/img/ministry-chinese.svg', alt: '', tag: 'Mission', title: 'Welcoming international students', text: 'Placeholder — replace with a real Chinese mission story.', meta: 'Field report', url })}
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  /* ---- give ---- */
  add({
    file: 'give/index.html',
    depth: 1,
    canonical: '/give/',
    active: '/give/',
    title: 'Give',
    description:
      'Support Apostolos Missions International — give, pray and partner with students being sent.',
    build: (url) => `
${pageHero({
  title: 'Give',
  lede: 'Every gift puts Bible study, training and a sending community within reach of students who are ready to go.',
  crumbs: [['Home', '/'], ['Give']],
  url
})}
<section class="section">
  <div class="container">
    <div class="grid grid--3">
      <div class="pillar" id="give" data-reveal>
        <span class="pillar__num"></span>
        <h3>Give once</h3>
        <p>A single gift, directed where it is needed most.</p>
        <p style="margin-top:1rem"><a class="link-arrow" href="${url('/contact/')}">Placeholder link ${ICONS.arrow}</a></p>
      </div>
      <div class="pillar" id="partner" data-reveal>
        <span class="pillar__num"></span>
        <h3>Partner monthly</h3>
        <p>Recurring support is what lets AM plan a year ahead and keep staff on campus.</p>
        <p style="margin-top:1rem"><a class="link-arrow" href="${url('/contact/')}">Placeholder link ${ICONS.arrow}</a></p>
      </div>
      <div class="pillar" id="pray" data-reveal>
        <span class="pillar__num"></span>
        <h3>Pray</h3>
        <p>Join the prayer letter and stand behind the students being sent.</p>
        <p style="margin-top:1rem"><a class="link-arrow" href="${url('/contact/')}">Placeholder link ${ICONS.arrow}</a></p>
      </div>
    </div>
    <div class="prose" style="margin-top:3.5rem" data-reveal>
      <p class="lede">PLACEHOLDER &mdash; wire these to AM&rsquo;s real giving platform, and add the ministry&rsquo;s tax status and financial accountability details.</p>
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  /* ---- contact ---- */
  add({
    file: 'contact/index.html',
    depth: 1,
    canonical: '/contact/',
    active: '/contact/',
    title: 'Contact',
    description: 'Get in touch with Apostolos Missions International.',
    build: (url) => `
${pageHero({
  title: 'Contact',
  lede: 'Questions about a chapter, the Academy, or being sent? Start here.',
  crumbs: [['Home', '/'], ['Contact']],
  url
})}
<section class="section">
  <div class="container">
    <div class="grid grid--2">
      <div data-reveal>
        <h2>Send a message</h2>
        <form class="stack" data-placeholder-form style="margin-top:1.5rem">
          <div class="field">
            <label class="visually-hidden" for="c-name">Your name</label>
            <input id="c-name" name="name" type="text" placeholder="Your name" required style="padding-left:1.25rem;background:rgba(16,24,40,.04);border-color:var(--line-light);color:var(--text-ink)">
          </div>
          <div class="field">
            <label class="visually-hidden" for="c-email">Email address</label>
            <input id="c-email" name="email" type="email" placeholder="you@example.com" required style="padding-left:1.25rem;background:rgba(16,24,40,.04);border-color:var(--line-light);color:var(--text-ink)">
          </div>
          <div class="field">
            <label class="visually-hidden" for="c-msg">Message</label>
            <textarea id="c-msg" name="message" rows="5" placeholder="How can we help?" required style="padding:1rem 1.25rem;border-radius:16px;background:rgba(16,24,40,.04);border-color:var(--line-light);color:var(--text-ink)"></textarea>
          </div>
          <button class="btn" type="submit">Send message</button>
          <p class="form-status" role="status" style="color:var(--brand-gold-deep)"></p>
        </form>
      </div>
      <div data-reveal>
        <h2>Find us</h2>
        <dl class="detail-list" style="margin-top:1.5rem">
          <div>
            <dt>Headquarters</dt>
            <dd>${SITE.address.join('<br>')}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a href="mailto:${SITE.email}">${SITE.email}</a></dd>
          </div>
          <div>
            <dt>Chapters</dt>
            <dd><a href="${url('/network/')}">Find a fellowship near you</a></dd>
          </div>
          <div>
            <dt>Start a chapter</dt>
            <dd><a href="${url('/get-involved/chapter-affiliation/')}">Chapter affiliation</a></dd>
          </div>
        </dl>
        <p style="margin-top:2rem;color:var(--text-muted);font-size:.875rem">PLACEHOLDER &mdash; confirm the postal address, phone number and office hours, and point the form at a real handler.</p>
      </div>
    </div>
  </div>
</section>
${ctaBand(url)}`
  });

  /* ---- page template style guide ---- */
  add({
    file: 'templates/index.html',
    depth: 1,
    canonical: '/templates/',
    title: 'Page templates',
    description:
      'The six interior page patterns every AM page is built from, with the components each one uses.',
    build: (url) => `
${pageHero({
  title: 'Page templates',
  lede: 'Every interior page is one of six patterns. Pick the closest one, fill in the parts, and the page matches the rest of the site without any design decisions.',
  crumbs: [['Home', '/'], ['Page templates']],
  url,
})}

<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">Pattern A &middot; Journey</p>
      <h2>Connect, Grow, Lead, Sent</h2>
      <p class="lede">A step in a sequence. Sibling tabs across the top, one image, a short opening, then the concrete things a reader can do — and a band handing them to the next step.</p>
    </div>
    <div class="prose" data-reveal>
      <ol>
        <li><strong>Page header</strong> — title and one-sentence summary</li>
        <li><strong>Tabs</strong> — the four siblings, current one marked</li>
        <li><strong>Figure</strong> — one wide image</li>
        <li><strong>Opening</strong> — two or three sentences, no more</li>
        <li><strong>Action cards</strong> — three or four, each with a button</li>
        <li><strong>Next step</strong> — one link onward</li>
      </ol>
      <p><a href="${url('/get-involved/connect/')}">See it live on Connect &rarr;</a></p>
    </div>
    <div class="action-grid" style="margin-top:2.5rem">
      ${actionCard({ icon: 'mail', title: 'Action card', text: 'Icon, heading, one line of copy, one button. Never more than one line.', cta: 'Button', href: '/templates/', url })}
      ${actionCard({ icon: 'book', title: 'Three or four', text: 'Fewer than three looks thin; more than four stops being a choice.', cta: 'Button', href: '/templates/', url })}
      ${actionCard({ icon: 'pin', title: 'Always a button', text: 'If a card has nowhere to send the reader, it should not be a card.', cta: 'Button', href: '/templates/', url })}
    </div>
    ${nextStep({ label: 'Ready to go deeper?', cta: 'Next step band', href: '/templates/', url })}
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">Pattern B &middot; Article</p>
      <h2>Who We Are, Mission, History, Statement of Faith</h2>
      <p class="lede">Pages that are mostly reading. One column, generous measure, a pull quote to break the run of text, and a section subnav so the group hangs together.</p>
    </div>
    <div class="prose" data-reveal>
      <p>Body copy sits in a single column capped at about 70 characters a line, which is where reading speed peaks. Headings break it into scannable sections.</p>
      <blockquote>A pull quote lifts the one sentence that matters and gives the eye somewhere to rest.</blockquote>
      <p>Use the timeline component for anything chronological, and the accordion for articles of faith or questions where readers want one answer rather than all of them.</p>
      <p><a href="${url('/about/')}">See it live on Who We Are &rarr;</a></p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">Pattern C &middot; Programme</p>
      <h2>Bible Study Program, AM Academy, Internship</h2>
      <p class="lede">Anything with stages. A numbered spine carries the reader through, then an accordion answers the practical questions.</p>
    </div>
    ${stepList([
      { title: 'Numbered step', text: 'One heading and two or three sentences. The number is generated, so steps can be reordered freely.' },
      { title: 'As many as the programme has', text: 'Five phases, four themes, three terms — the spine stretches to fit.' },
      { title: 'Ends in an action', text: 'The last step should be the one that enrols, applies or gets in touch.' },
    ])}
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">Pattern D &middot; Directory</p>
      <h2>Our Network, Ministries, Leadership</h2>
      <p class="lede">Many similar things. A search box when the list runs past about fifteen entries, a card grid when each entry has a picture, a plain list when it does not.</p>
    </div>
    <div class="grid grid--3">
      ${card({ href: '/ministries/', img: '/assets/img/ministry-worship.svg', alt: '', tag: 'Card', title: 'Grid entry', text: 'Image, tag, title, one line. Used when entries have photography.', url })}
      ${card({ href: '/network/', img: '/assets/img/feature-chapters.svg', alt: '', tag: 'Search', title: 'Filtered list', text: 'The chapter finder pattern: type-ahead filtering over a long list.', url })}
      ${card({ href: '/about/leadership/', img: '/assets/img/person-2.svg', alt: '', tag: 'People', title: 'People grid', text: 'Square portrait, name, role, one sentence.', url })}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">Pattern E &middot; Action</p>
      <h2>Give, Contact, Registration</h2>
      <p class="lede">Pages with one job. Say what happens next, keep the form short, and put nothing on the page that competes with it.</p>
    </div>
    <div class="prose" data-reveal>
      <ul>
        <li>One primary action, stated in the heading</li>
        <li>Form fields kept to what is genuinely needed</li>
        <li>No give band at the foot — it would compete with the page itself</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--navy">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow eyebrow--on-dark">Pattern F &middot; Landing</p>
      <h2>Home, and section fronts</h2>
      <p class="lede">Alternating bands: dark, light, dark. Each band does one job and hides itself when it has no content, so a half-filled site still looks deliberate.</p>
    </div>
    <div class="prose" data-reveal>
      <p style="color:var(--text-on-dark-muted)">Bands available: hero with globe, quick links, programme, card row, mission, media, events, chapter finder, legacy, give, field notes.</p>
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">House rules</p>
      <h2>What keeps it consistent.</h2>
    </div>
    <div class="prose" data-reveal>
      <ul>
        <li><strong>One idea per band.</strong> If a section needs two headings, it is two sections.</li>
        <li><strong>Openings are short.</strong> Two or three sentences, then show rather than tell.</li>
        <li><strong>Every page ends somewhere.</strong> A next step, an action card, or the give band — never a dead stop.</li>
        <li><strong>Buttons say what happens.</strong> "Find a chapter", not "Click here".</li>
        <li><strong>Empty beats filler.</strong> A band with nothing to say is switched off, not padded.</li>
        <li><strong>Flag what is missing.</strong> Copy the ministry still owes shows as ${needs('the specific thing needed')} so it cannot ship by accident.</li>
      </ul>
    </div>
  </div>
</section>
${ctaBand(url)}`,
  });

  /* ---- 404 ---- */
  add({
    file: '404.html',
    depth: 0,
    canonical: '/404.html',
    title: 'Page not found',
    description: 'That page could not be found.',
    build: (url) => `
${pageHero({
  title: 'This page went on mission.',
  lede: 'The page you were looking for is not here. Try one of these instead.',
  crumbs: [['Home', '/'], ['Not found']],
  url
})}
<section class="section">
  <div class="container">
    <div class="quicklinks__grid" style="background:var(--line-light-soft);border-color:var(--line-light)">
      ${quicklink({ href: '/', icon: 'globe', title: 'Home', text: 'Back to the beginning.', url })}
      ${quicklink({ href: '/network/', icon: 'pin', title: 'Find a chapter', text: 'Fellowships by school and city.', url })}
      ${quicklink({ href: '/about/', icon: 'users', title: 'Who we are', text: 'The ministry and its mission.', url })}
      ${quicklink({ href: '/contact/', icon: 'send', title: 'Contact', text: 'Ask us anything.', url })}
    </div>
  </div>
</section>`
  });

  return pages;
}

/* ---------------------------------------------------------------- write -- */

const pages = buildPages();
const generated = new Set();
let written = 0;

/**
 * Removes .html files this build no longer produces, so renaming a route does
 * not leave the old URL live. Only touches .html inside the repo root, and
 * never descends into assets, tools or version-control directories.
 */
function pruneStale(keep) {
  // wp-theme holds the WordPress theme and its own generated preview; this
  // build owns only the static site at the repository root.
  const SKIP = new Set(['.git', 'node_modules', 'assets', 'tools', 'wp-theme']);
  const removed = [];

  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        // Drop directories left empty once their stale page is gone.
        if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
      } else if (entry.name.endsWith('.html') && !keep.has(full)) {
        fs.unlinkSync(full);
        removed.push(path.relative(ROOT, full));
      }
    }
  })(ROOT);

  return removed;
}

for (const page of pages) {
  const url = makeUrl(page.depth);
  const html = shell({
    title: page.title,
    description: page.description,
    canonical: page.canonical,
    depth: page.depth,
    active: page.active,
    globe: page.globe,
    body: page.build(url)
  });

  const outPath = path.join(ROOT, page.file);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  generated.add(outPath);
  written++;
}

const removed = pruneStale(generated);
if (removed.length) {
  console.log(`pruned ${removed.length} stale page(s): ${removed.join(', ')}`);
}

/* Real globe markers, so the homepage plots AM's actual chapters. globe.js
   reads window.AM_GLOBE_MARKERS when it is present and falls back to its
   built-in sample list when it is not. */
const markers = CHAPTER_DATA.map(([, city, country, lat, lng, kind]) => [
  'AM ' + city,
  kind || 'Campus chapter',
  lat,
  lng,
]);
fs.writeFileSync(
  path.join(ROOT, 'assets', 'js', 'globe-markers.js'),
  '/* Generated by tools/build-pages.js from tools/content/chapters.js. */\n' +
    'window.AM_GLOBE_MARKERS = ' +
    JSON.stringify(markers) +
    ';\n'
);

/* Sitemap + robots, generated from the same page list. */
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages
    .filter((p) => p.file !== '404.html')
    .map((p) => `  <url><loc>${SITE.origin}${p.canonical}</loc></url>`)
    .join('\n') +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

fs.writeFileSync(
  path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`
);

console.log(`wrote ${written} pages + sitemap.xml + robots.txt`);
