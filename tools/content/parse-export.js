#!/usr/bin/env node
/**
 * Reads a WordPress WXR export and pulls out the content this redesign needs.
 *
 * Pages built with Elementor keep their visible text in the _elementor_data
 * postmeta as JSON, not in post_content, so both are searched.
 *
 * Usage:
 *   node tools/content/parse-export.js <export.xml> list [type]
 *   node tools/content/parse-export.js <export.xml> page "<title or slug>"
 *   node tools/content/parse-export.js <export.xml> menus
 */

const fs = require('fs');

const [, , file, command = 'list', arg] = process.argv;
const xml = fs.readFileSync(file, 'utf8');

/* ------------------------------------------------------------- parsing --- */

/** Splits the feed into <item> blocks without a full XML parse. */
function items() {
  return xml.split('<item>').slice(1).map((chunk) => chunk.split('</item>')[0]);
}

function cdata(block, tag) {
  const m = block.match(
    new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`)
  );
  return m ? m[1] : '';
}

/** All postmeta pairs on an item. */
function meta(block, key) {
  const re = /<wp:postmeta>[\s\S]*?<wp:meta_key>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:meta_key>[\s\S]*?<wp:meta_value>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:meta_value>[\s\S]*?<\/wp:postmeta>/g;
  let m;
  const out = {};
  while ((m = re.exec(block))) out[m[1]] = m[2];
  return key ? out[key] || '' : out;
}

function parse(block) {
  return {
    title: cdata(block, 'title').trim(),
    slug: cdata(block, 'wp:post_name').trim(),
    type: cdata(block, 'wp:post_type').trim(),
    status: cdata(block, 'wp:status').trim(),
    date: cdata(block, 'wp:post_date').trim().split(' ')[0],
    parent: cdata(block, 'wp:post_parent').trim(),
    id: cdata(block, 'wp:post_id').trim(),
    link: cdata(block, 'link').trim(),
    content: cdata(block, 'content:encoded'),
    block,
  };
}

const all = items().map(parse);

/* --------------------------------------------------------- text pulling -- */

/** Strips tags and collapses whitespace. */
function clean(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h[1-6]|li|div)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');
}

/** Walks Elementor's JSON tree collecting anything that reads as copy. */
function elementorText(json) {
  let out = [];
  const TEXT_KEYS = new Set([
    'title', 'editor', 'text', 'description_text', 'title_text',
    'heading_title', 'caption', 'testimonial_content', 'tab_title',
    'tab_content', 'item_title', 'item_description', 'button_text',
    'sub_title', 'inner_text',
  ]);

  (function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;

    if (node.settings && typeof node.settings === 'object') {
      for (const [k, v] of Object.entries(node.settings)) {
        if (typeof v === 'string' && v.trim() && TEXT_KEYS.has(k)) {
          out.push(clean(v));
        }
        // Repeaters (slides, accordions) hold their copy in arrays.
        if (Array.isArray(v)) {
          v.forEach((row) => {
            if (row && typeof row === 'object') {
              for (const [rk, rv] of Object.entries(row)) {
                if (typeof rv === 'string' && rv.trim() && TEXT_KEYS.has(rk)) {
                  out.push(clean(rv));
                }
              }
            }
          });
        }
      }
    }
    if (node.elements) walk(node.elements);
  })(json);

  return [...new Set(out.filter(Boolean))].join('\n\n');
}

function bodyOf(item) {
  const parts = [];
  const plain = clean(item.content);
  if (plain) parts.push(plain);

  const raw = meta(item.block, '_elementor_data');
  if (raw) {
    try {
      // Meta values arrive escaped for XML; unescape before JSON.parse.
      const json = JSON.parse(
        raw.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      );
      const t = elementorText(json);
      if (t) parts.push(t);
    } catch (e) {
      parts.push(`[could not parse Elementor data: ${e.message}]`);
    }
  }
  return parts.join('\n\n').trim();
}

/* -------------------------------------------------------------- commands -- */

if (command === 'list') {
  const type = arg || 'page';
  const rows = all.filter((i) => i.type === type);
  console.log(`${rows.length} ${type}(s)\n`);
  rows
    .sort((a, b) => a.title.localeCompare(b.title))
    .forEach((i) => {
      const body = bodyOf(i);
      console.log(
        `${i.status.padEnd(8)} ${String(body.length).padStart(6)}ch  ${i.title}  [${i.slug}]`
      );
    });
} else if (command === 'page') {
  const needle = (arg || '').toLowerCase();
  const hits = all.filter(
    (i) =>
      i.title.toLowerCase().includes(needle) || i.slug.toLowerCase() === needle
  );
  if (!hits.length) {
    console.log('no match');
    process.exit(1);
  }
  hits.forEach((i) => {
    console.log(`\n===== ${i.title}  [${i.type}/${i.status}] ${i.link}`);
    console.log(bodyOf(i) || '(no text found)');
  });
} else if (command === 'menus') {
  const mi = all.filter((i) => i.type === 'nav_menu_item');
  const byMenu = {};
  mi.forEach((i) => {
    const m = i.block.match(/<category domain="nav_menu"[^>]*><!\[CDATA\[([^\]]*)\]\]><\/category>/);
    const menu = m ? m[1] : 'unknown';
    const md = meta(i.block);
    (byMenu[menu] = byMenu[menu] || []).push({
      id: i.id,
      title: i.title || md._menu_item_title || '',
      parent: md._menu_item_menu_item_parent,
      order: parseInt(cdata(i.block, 'wp:menu_order') || '0', 10),
      url: md._menu_item_url || '',
      object: md._menu_item_object_id || '',
    });
  });
  for (const [menu, list] of Object.entries(byMenu)) {
    console.log(`\n===== MENU: ${menu} (${list.length} items)`);
    list.sort((a, b) => a.order - b.order);
    const byId = Object.fromEntries(list.map((x) => [x.id, x]));
    list.forEach((x) => {
      let depth = 0;
      let p = x.parent;
      while (p && p !== '0' && byId[p] && depth < 5) {
        depth++;
        p = byId[p].parent;
      }
      console.log('  '.repeat(depth) + '- ' + (x.title || '(untitled)'));
    });
  }
}
