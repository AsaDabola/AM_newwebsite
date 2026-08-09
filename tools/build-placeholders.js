#!/usr/bin/env node
/**
 * Generates the abstract placeholder artwork in assets/img/.
 *
 * These exist so the layout can be judged with something in every image slot.
 * They are meant to be replaced with real AM photography - each file keeps its
 * name and aspect ratio, so swapping in a .jpg only means changing the src
 * attribute (and deleting the .svg).
 *
 * Run: node tools/build-placeholders.js
 */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'img');
fs.mkdirSync(OUT, { recursive: true });

/* A small deterministic PRNG so re-running produces identical files. */
function rng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* Duotone ramps drawn from AM's palette: royal blue, deep navy, cool steel.
   [base, mid, highlight] */
const RAMPS = [
  ['#050a2e', '#12307e', '#4d8df6'],
  ['#0a0f5c', '#1449c6', '#8ab6ff'],
  ['#050a2e', '#1a3a86', '#6ea8ff'],
  ['#0a0f5c', '#20489e', '#9cc6ff'],
  ['#070d3a', '#153a92', '#5f9bfa'],
  ['#050a2e', '#28407e', '#7fb3ff']
];

/**
 * Abstract "signal" artwork: a duotone field crossed by orbital arcs and a
 * scatter of dots, echoing the globe in the hero.
 */
function artwork({ w, h, seed, ramp }) {
  const rand = rng(seed);
  const [bg, mid, hi] = RAMPS[ramp % RAMPS.length];
  const id = `g${seed}`;
  const parts = [];

  parts.push(
    `<defs>` +
      `<linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${bg}"/>` +
      `<stop offset="1" stop-color="${mid}"/>` +
      `</linearGradient>` +
      `<radialGradient id="${id}b" cx="${(0.2 + rand() * 0.6).toFixed(2)}" cy="${(
        0.15 +
        rand() * 0.5
      ).toFixed(2)}" r="0.75">` +
      `<stop offset="0" stop-color="${hi}" stop-opacity="0.55"/>` +
      `<stop offset="1" stop-color="${hi}" stop-opacity="0"/>` +
      `</radialGradient>` +
      `</defs>`
  );

  parts.push(`<rect width="${w}" height="${h}" fill="url(#${id}a)"/>`);
  parts.push(`<rect width="${w}" height="${h}" fill="url(#${id}b)"/>`);

  // Orbital arcs sweeping across the frame.
  const cx = w * (0.25 + rand() * 0.5);
  const cy = h * (0.9 + rand() * 0.5);
  for (let i = 0; i < 5; i++) {
    const r = Math.min(w, h) * (0.45 + i * 0.28 + rand() * 0.1);
    parts.push(
      `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" ` +
        `fill="none" stroke="${hi}" stroke-opacity="${(0.26 - i * 0.04).toFixed(
          2
        )}" stroke-width="1.25"/>`
    );
  }

  // Dot scatter, denser toward the light source.
  let dots = '';
  const count = Math.round((w * h) / 2600);
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = (rand() * 1.6 + 0.4).toFixed(2);
    const o = (rand() * 0.4 + 0.06).toFixed(2);
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${hi}" fill-opacity="${o}"/>`;
  }
  parts.push(dots);

  // A soft vignette so text overlays stay readable.
  parts.push(
    `<rect width="${w}" height="${h}" fill="#05070d" fill-opacity="0.18"/>`
  );

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="presentation">` +
    parts.join('') +
    `</svg>`
  );
}

/**
 * Portrait placeholder: same field, plus a neutral figure silhouette so
 * people slots do not read as broken images.
 */
function portrait({ w, h, seed, ramp }) {
  const base = artwork({ w, h, seed, ramp }).replace('</svg>', '');
  const cx = w / 2;
  const headR = w * 0.15;
  const headY = h * 0.36;
  return (
    base +
    `<g fill="#ffffff" fill-opacity="0.16">` +
    `<circle cx="${cx}" cy="${headY}" r="${headR.toFixed(1)}"/>` +
    `<path d="M ${cx - headR * 2.1} ${h} a ${headR * 2.1} ${headR * 2.3} 0 0 1 ${
      headR * 4.2
    } 0 Z"/>` +
    `</g></svg>`
  );
}

/* --------------------------------------------------------------- files -- */

const files = [
  // Ministry cards - 16:10
  ['ministry-la-familia.svg', artwork, { w: 800, h: 500, seed: 11, ramp: 1 }],
  ['ministry-athletics.svg', artwork, { w: 800, h: 500, seed: 22, ramp: 2 }],
  ['ministry-business.svg', artwork, { w: 800, h: 500, seed: 33, ramp: 0 }],
  ['ministry-academy.svg', artwork, { w: 800, h: 500, seed: 44, ramp: 3 }],
  ['ministry-chinese.svg', artwork, { w: 800, h: 500, seed: 55, ramp: 4 }],
  ['ministry-worship.svg', artwork, { w: 800, h: 500, seed: 66, ramp: 5 }],

  // Story cards - 16:10
  ['story-1.svg', artwork, { w: 800, h: 500, seed: 101, ramp: 2 }],
  ['story-2.svg', artwork, { w: 800, h: 500, seed: 102, ramp: 1 }],
  ['story-3.svg', artwork, { w: 800, h: 500, seed: 103, ramp: 4 }],

  // Wide features
  ['feature-easter-retreat.svg', artwork, { w: 1200, h: 800, seed: 201, ramp: 3 }],
  ['feature-chapters.svg', artwork, { w: 1200, h: 800, seed: 202, ramp: 0 }],
  ['feature-academy.svg', artwork, { w: 1200, h: 800, seed: 203, ramp: 4 }],

  // People - 1:1
  ['person-1.svg', portrait, { w: 600, h: 600, seed: 301, ramp: 0 }],
  ['person-2.svg', portrait, { w: 600, h: 600, seed: 302, ramp: 1 }],
  ['person-3.svg', portrait, { w: 600, h: 600, seed: 303, ramp: 4 }],
  ['person-4.svg', portrait, { w: 600, h: 600, seed: 304, ramp: 2 }],

  // Ralph D. Winter portrait slot - 4:5
  ['portrait-winter.svg', portrait, { w: 640, h: 800, seed: 401, ramp: 3 }]
];

for (const [name, fn, opts] of files) {
  fs.writeFileSync(path.join(OUT, name), fn(opts));
}

/* Favicon: the AM monogram on the brand blue. Replace with the official mark. */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="12" fill="#1449c6"/>
<text x="32" y="36" text-anchor="middle" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="27" font-weight="800" letter-spacing="-1.4" fill="#ffffff">AM</text>
<rect x="16" y="42" width="32" height="2" fill="#ffffff"/>
<text x="32" y="53" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="6.5" letter-spacing="1.5" fill="#ffffff">INTL</text>
</svg>`;
fs.writeFileSync(path.join(OUT, 'favicon.svg'), favicon);

console.log(`wrote ${files.length + 1} files to assets/img/`);
