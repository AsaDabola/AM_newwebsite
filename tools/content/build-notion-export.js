#!/usr/bin/env node
/**
 * Turns a WordPress WXR export into a folder of Markdown files ready to import
 * into Notion (or any Markdown tool).
 *
 * One file per page or post, with the body converted to readable Markdown -
 * headings, lists, quotes, links and images - rather than raw HTML. Pages built
 * with Elementor keep their copy as JSON in the _elementor_data postmeta, so the
 * widget tree is walked in document order and each widget rendered.
 *
 * Notion import: File -> Import -> Markdown & CSV, then select the folder (or
 * the zip). Folders become nested pages.
 *
 * Usage:
 *   node tools/content/build-notion-export.js <export.xml> [outputDir]
 *
 * The output is deliberately written outside the repository by default: it is
 * the ministry's own site content, including drafts.
 */

const fs = require('fs');
const path = require('path');

const [, , inputFile, outDirArg] = process.argv;

if (!inputFile) {
  console.error('usage: node tools/content/build-notion-export.js <export.xml> [outputDir]');
  process.exit(1);
}

const OUT = outDirArg || path.join(path.dirname(inputFile), 'notion-export');
const xml = fs.readFileSync(inputFile, 'utf8');

/* ============================================================ entities === */

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', middot: '·', bull: '•', deg: '°',
  eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', uuml: 'ü',
  ouml: 'ö', auml: 'ä', ntilde: 'ñ', aacute: 'á', iacute: 'í',
  oacute: 'ó', uacute: 'ú', copy: '©', reg: '®', trade: '™',
};

function decode(text) {
  return String(text)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => {
      const key = name.toLowerCase();
      return Object.prototype.hasOwnProperty.call(NAMED, key) ? NAMED[key] : m;
    });
}

/* ======================================================= html -> markdown = */

const BLOCK = new Set([
  'p', 'div', 'section', 'article', 'header', 'footer', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'table', 'tr', 'br', 'hr',
  'figure', 'figcaption', 'pre',
]);

/**
 * Converts the HTML WordPress produces into Markdown.
 *
 * A small tag-walker rather than a full parser: it handles the subset the
 * editor and Elementor emit, and drops anything it does not recognise instead
 * of leaking tags into the output.
 */
function htmlToMarkdown(html) {
  if (!html) return '';

  let src = String(html)
    // Gutenberg keeps embed URLs inside a block comment, so lift them out
    // before comments are discarded.
    .replace(
      /<!--\s*wp:(?:core-)?embed[\s\S]*?"url":"([^"]+)"[\s\S]*?-->/g,
      (m, url) => `<a href="${url.replace(/\\\//g, '/')}">${url.replace(/\\\//g, '/')}</a>`
    )
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    // Video embeds are iframes; keep them as a link rather than losing them.
    .replace(
      /<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>\s*<\/iframe>/gi,
      (m, url) => `<p>[VIDEO_EMBED]${url}[/VIDEO_EMBED]</p>`
    );

  let out = '';
  const listStack = [];
  let i = 0;

  const attr = (tag, name) => {
    const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
    return m ? m[1] : '';
  };

  while (i < src.length) {
    const lt = src.indexOf('<', i);

    if (lt === -1) {
      out += decode(src.slice(i));
      break;
    }

    out += decode(src.slice(i, lt));

    const gt = src.indexOf('>', lt);
    if (gt === -1) break;

    const tag = src.slice(lt, gt + 1);
    const closing = /^<\//.test(tag);
    const name = (tag.match(/^<\/?\s*([a-z0-9]+)/i) || [, ''])[1].toLowerCase();
    i = gt + 1;

    switch (name) {
      case 'br':
        out += '\n';
        break;
      case 'hr':
        out += '\n\n---\n\n';
        break;
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
        out += closing ? '\n\n' : '\n\n' + '#'.repeat(+name[1]) + ' ';
        break;
      case 'p': case 'div': case 'section': case 'figure': case 'figcaption':
        out += '\n\n';
        break;
      case 'strong': case 'b':
        out += '**';
        break;
      case 'em': case 'i':
        out += '*';
        break;
      case 'blockquote':
        // Marked here, then applied line by line in tidy().
        out += closing ? '\n\n{{/quote}}\n\n' : '\n\n{{quote}}\n';
        break;
      case 'ul': case 'ol':
        if (closing) listStack.pop();
        else listStack.push(name);
        out += '\n';
        break;
      case 'li': {
        if (closing) break;
        const depth = Math.max(0, listStack.length - 1);
        const marker = listStack[listStack.length - 1] === 'ol' ? '1. ' : '- ';
        out += '\n' + '  '.repeat(depth) + marker;
        break;
      }
      case 'a': {
        if (closing) {
          out += `](${out.__href || ''})`;
          out = out.replace(/\]\(\)$/, ']()');
          break;
        }
        const href = attr(tag, 'href');
        // Stash the href on the string builder for the closing tag.
        out += '[';
        out.__href = href;
        break;
      }
      case 'img': {
        const src2 = attr(tag, 'src');
        const alt = attr(tag, 'alt');
        if (src2) out += `\n\n![${decode(alt)}](${src2})\n\n`;
        break;
      }
      case 'tr':
        out += '\n';
        break;
      case 'td': case 'th':
        out += closing ? ' | ' : '';
        break;
      default:
        if (BLOCK.has(name)) out += '\n';
    }
  }

  return out;
}

// The href trick above does not survive string reassignment, so links are
// handled with a dedicated pre-pass instead.
function linksFirst(html) {
  return String(html).replace(
    /<a\b[^>]*href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (m, href, inner) => {
      const text = inner.replace(/<[^>]+>/g, '').trim();
      if (!text) return '';
      if (!href || href.startsWith('#')) return text;
      return `[${text}](${href})`;
    }
  );
}

function tidy(md) {
  let text = md
    .replace(/\[VIDEO_EMBED\](\S+?)\[\/VIDEO_EMBED\]/g, (m, url) => `🎬 [Video](${url})`)
    .replace(/\[\s*\]\([^)]*\)/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Apply blockquote markers.
  const lines = [];
  let quoting = false;
  for (const line of text.split('\n')) {
    if (line.includes('{{quote}}')) { quoting = true; continue; }
    if (line.includes('{{/quote}}')) { quoting = false; continue; }
    lines.push(quoting && line.trim() ? '> ' + line : line);
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

const toMarkdown = (html) => tidy(htmlToMarkdown(linksFirst(html)));

/* ====================================================== elementor walker = */

/** Renders one Elementor widget to Markdown. */
function renderWidget(node) {
  const s = node.settings || {};
  const type = node.widgetType || node.elType;

  const text = (v) => (typeof v === 'string' ? toMarkdown(v) : '');

  switch (type) {
    case 'heading': {
      const size = (s.header_size || 'h2').toLowerCase();
      const level = /^h[1-6]$/.test(size) ? +size[1] : 2;
      const title = text(s.title);
      return title ? `${'#'.repeat(Math.max(2, level))} ${title.replace(/^#+\s*/, '')}` : '';
    }
    case 'text-editor':
    case 'theme-post-content':
      return text(s.editor);

    case 'blockquote':
      return text(s.blockquote_content)
        .split('\n')
        .map((l) => (l.trim() ? '> ' + l : l))
        .join('\n');

    case 'image': {
      const url = s.image && s.image.url;
      const cap = text(s.caption);
      return url ? `![${cap}](${url})` : '';
    }

    case 'video': {
      const url = s.youtube_url || s.vimeo_url || (s.hosted_url && s.hosted_url.url);
      return url ? `🎬 [Video](${url})` : '';
    }

    case 'button': {
      const label = text(s.text) || 'Button';
      const url = s.link && s.link.url;
      return url ? `**Button:** [${label}](${url})` : `**Button:** ${label}`;
    }

    case 'call-to-action': {
      const parts = [];
      if (s.title) parts.push(`### ${text(s.title)}`);
      if (s.description) parts.push(text(s.description));
      if (s.button) {
        const url = s.link && s.link.url;
        parts.push(url ? `**Button:** [${text(s.button)}](${url})` : `**Button:** ${text(s.button)}`);
      }
      return parts.filter(Boolean).join('\n\n');
    }

    case 'icon-list': {
      const rows = Array.isArray(s.icon_list) ? s.icon_list : [];
      return rows
        .map((r) => {
          const label = text(r.text);
          const url = r.link && r.link.url;
          return label ? `- ${url ? `[${label}](${url})` : label}` : '';
        })
        .filter(Boolean)
        .join('\n');
    }

    case 'slides': {
      const rows = Array.isArray(s.slides) ? s.slides : [];
      return rows
        .map((r, n) => {
          const bits = [`**Slide ${n + 1}**`];
          if (r.heading) bits.push(text(r.heading));
          if (r.description) bits.push(text(r.description));
          if (r.button_text) bits.push(`Button: ${text(r.button_text)}`);
          return bits.filter(Boolean).join('  \n');
        })
        .filter(Boolean)
        .join('\n\n');
    }

    case 'shortcode':
      return s.shortcode ? `\`${String(s.shortcode).trim()}\`` : '';

    case 'html':
      return text(s.html);

    case 'google_maps':
      return s.address ? `📍 ${text(s.address)}` : '';

    // Chrome and dynamic widgets carry no page copy worth keeping.
    case 'spacer': case 'icon': case 'social-icons': case 'site-logo':
    case 'navigation-menu': case 'wp-widget-nav_menu': case 'copyright':
    case 'theme-post-title': case 'theme-archive-title':
    case 'theme-post-featured-image': case 'theme-post-excerpt':
    case 'table-of-contents': case 'hfe-search-button': case 'form':
    case 'posts': case 'loop-carousel': case 'contentbody':
      return '';

    default:
      // Unknown widget: salvage the obvious copy fields.
      return [s.title, s.editor, s.text, s.description]
        .filter((v) => typeof v === 'string')
        .map(text)
        .filter(Boolean)
        .join('\n\n');
  }
}

/** Depth-first walk that keeps the page's reading order. */
function elementorToMarkdown(tree) {
  const out = [];
  (function walk(nodes) {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;
      if (node.elType === 'widget') {
        const md = renderWidget(node);
        if (md) out.push(md);
      }
      if (node.elements) walk(node.elements);
    }
  })(tree);

  // Elementor duplicates a lot of headings across breakpoints; drop repeats
  // that sit directly next to each other.
  return out.filter((block, n) => block !== out[n - 1]).join('\n\n');
}

/* ============================================================== the feed = */

function cdata(block, tag) {
  const m = block.match(
    new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`)
  );
  return m ? m[1] : '';
}

function metaOf(block) {
  const re = /<wp:postmeta>\s*<wp:meta_key>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:meta_key>\s*<wp:meta_value>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:meta_value>\s*<\/wp:postmeta>/g;
  const out = {};
  let m;
  while ((m = re.exec(block))) out[m[1]] = m[2];
  return out;
}

const items = xml
  .split('<item>')
  .slice(1)
  .map((chunk) => chunk.split('</item>')[0])
  .map((block) => ({
    title: decode(cdata(block, 'title')).trim(),
    slug: cdata(block, 'wp:post_name').trim(),
    type: cdata(block, 'wp:post_type').trim(),
    status: cdata(block, 'wp:status').trim(),
    date: cdata(block, 'wp:post_date').trim(),
    link: cdata(block, 'link').trim(),
    content: cdata(block, 'content:encoded'),
    excerpt: cdata(block, 'excerpt:encoded'),
    meta: metaOf(block),
  }));

/** Body text: Elementor's tree when present, otherwise the editor content. */
function bodyOf(item) {
  const raw = item.meta._elementor_data;
  if (raw && raw.trim().startsWith('[')) {
    try {
      return elementorToMarkdown(JSON.parse(decode(raw)));
    } catch (e) {
      return `_(Elementor layout could not be read: ${e.message})_\n\n` + toMarkdown(item.content);
    }
  }
  return toMarkdown(item.content);
}

/* ================================================================ output = */

function safeName(name) {
  return (
    name
      .replace(/[\\/:*?"<>|#]/g, '-')
      .replace(/\s+/g, ' ')
      .replace(/^\.+/, '')
      .trim()
      .slice(0, 90) || 'untitled'
  );
}

fs.rmSync(OUT, { recursive: true, force: true });

function write(relPath, text) {
  const full = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

function fileFor(item, body) {
  const lines = [`# ${item.title || '(untitled)'}`, ''];

  const facts = [];
  if (item.link) facts.push(`**URL:** ${item.link}`);
  if (item.date) facts.push(`**Published:** ${item.date.split(' ')[0]}`);
  if (item.status && item.status !== 'publish') {
    facts.push(`**Status:** ${item.status}`);
  }
  if (facts.length) lines.push(facts.join('  \n'), '', '---', '');

  lines.push(body || '_(This page has no text content — it may be a redirect, a form, or built entirely from images.)_');
  return lines.join('\n') + '\n';
}

const written = { Pages: [], News: [], Drafts: [] };
const seen = new Set();

for (const item of items) {
  if (!['page', 'post'].includes(item.type)) continue;
  if (item.status === 'trash' || item.status === 'auto-draft') continue;

  const body = bodyOf(item);
  const isDraft = item.status !== 'publish';
  const folder = isDraft ? 'Drafts' : item.type === 'page' ? 'Pages' : 'News';

  let name = safeName(item.title);
  if (folder === 'News') {
    name = `${item.date.split(' ')[0]} ${name}`;
  }

  // Titles repeat across the site; keep every file rather than overwrite.
  let file = `${folder}/${name}.md`;
  let n = 2;
  while (seen.has(file.toLowerCase())) {
    file = `${folder}/${name} (${n++}).md`;
  }
  seen.add(file.toLowerCase());

  write(file, fileFor(item, body));
  written[folder].push({ ...item, file, chars: body.length });
}

/* ---- reference sheets ---- */

const chapters = require('./chapters');
write(
  'Reference/Chapter network.md',
  `# Chapter network\n\n${chapters.length} chapters, from the Our Network page.\n\n` +
    '| Region | City | Country | Latitude | Longitude |\n|---|---|---|---|---|\n' +
    chapters
      .map(([r, c, co, la, ln]) => `| ${r} | ${c} | ${co} | ${la} | ${ln} |`)
      .join('\n') +
    '\n'
);

/* ---- index ---- */

const section = (label, rows) =>
  rows.length
    ? `\n## ${label} (${rows.length})\n\n| Page | Words | Link |\n|---|---|---|\n` +
      rows
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(
          (r) =>
            `| [${r.title}](${encodeURI(r.file)}) | ${Math.round(r.chars / 6)} | ${
              r.link ? `[live](${r.link})` : ''
            } |`
        )
        .join('\n') +
      '\n'
    : '';

write(
  'README.md',
  `# Apostolos Missions International — site content\n\n` +
    `Every page and post from amintl.org, exported from WordPress and converted ` +
    `to Markdown. One file per page, in reading order.\n\n` +
    `**To import into Notion:** File → Import → Markdown & CSV, then choose this ` +
    `folder (or the zip). Each folder becomes a Notion page with the files nested ` +
    `inside it.\n\n` +
    `Generated ${new Date().toISOString().split('T')[0]} from the WordPress export.\n\n` +
    `- **Pages:** ${written.Pages.length}\n` +
    `- **News posts:** ${written.News.length}\n` +
    `- **Drafts and private:** ${written.Drafts.length}\n` +
    `\n> Drafts and unpublished pages are included. Check the Drafts folder before ` +
    `sharing this workspace widely.\n` +
    section('Pages', written.Pages) +
    section('Drafts & private', written.Drafts) +
    section('News', written.News.slice(0, 60)) +
    (written.News.length > 60
      ? `\n_…and ${written.News.length - 60} more in the News folder._\n`
      : '')
);

const total = written.Pages.length + written.News.length + written.Drafts.length;
console.log(
  `wrote ${total} files to ${OUT}\n` +
    `  Pages  ${written.Pages.length}\n` +
    `  News   ${written.News.length}\n` +
    `  Drafts ${written.Drafts.length}`
);
