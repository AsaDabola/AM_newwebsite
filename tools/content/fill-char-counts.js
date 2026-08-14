#!/usr/bin/env node
/**
 * Fills the Chars column in the content pack.
 *
 * Every copy row is written as `| Slot | Copy | · | Status |`. This replaces
 * each `·` with the character count of the Copy cell, so the designer can size
 * a slot before the layout exists. Re-runnable: an already-filled count is
 * recomputed, so editing copy and re-running keeps the numbers honest.
 *
 * Emphasis markers are not counted — `*Apostolos*` is nine characters on
 * screen, not eleven.
 *
 * Usage: node tools/content/fill-char-counts.js [dir]
 */

const fs = require('fs');
const path = require('path');

const DIR = process.argv[2] || path.join(__dirname, '..', '..', 'content-pack');

/**
 * Budgets, first match wins. Matched on the whole slot name rather than a
 * keyword, so "Globe aria-label" is not measured against the stat-label budget
 * and "Phase 3a title" is not measured against the card-title budget.
 * Anything unmatched is unbounded.
 */
const BUDGETS = [
  [/^eyebrow$/i, 32],
  [/^h1(\b|$)/i, 48],
  [/^h2(\b|$)/i, 40],
  [/standfirst$/i, 160],
  [/^card \d+ title$/i, 28],
  [/^card \d+ body$/i, 110],
  [/button/i, 22],
  [/^nav \d/i, 18],
  [/^stat \d+ label$/i, 24],
  [/^tagline$/i, 36],
];

function visibleLength(cell) {
  return cell
    .replace(/\*\*?/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim().length;
}

function budgetFor(slot) {
  const s = slot.trim();
  for (const [pattern, max] of BUDGETS) if (pattern.test(s)) return max;
  return null;
}

const over = [];
let filled = 0;

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const full = path.join(DIR, file);
  const out = fs.readFileSync(full, 'utf8').split('\n').map((line) => {
    const m = line.match(/^\| ([^|]+?) \| (.*?) \| (·|\d+) \| ([^|]+?) \|$/);
    if (!m) return line;

    const [, slot, copy, , status] = m;
    const n = visibleLength(copy);
    filled++;

    const budget = budgetFor(slot);
    if (budget && n > budget && status.trim() === 'Ready') {
      over.push(`${file}  ${slot.trim()}: ${n} chars, budget ${budget}`);
    }
    return `| ${slot} | ${copy} | ${n} | ${status} |`;
  });

  fs.writeFileSync(full, out.join('\n'));
}

console.log(`filled ${filled} character counts across ${DIR}`);
if (over.length) {
  console.log(`\nover budget (${over.length}):`);
  console.log(over.join('\n'));
} else {
  console.log('every slot is within its budget');
}
