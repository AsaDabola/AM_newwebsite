#!/usr/bin/env node
/**
 * Builds assets/js/globe-data.js from the Natural Earth 110m land TopoJSON.
 *
 * Output contains two things:
 *   1. LAND  - simplified land outlines as flat [lon, lat, lon, lat, ...] rings,
 *              used to fill/stroke the continents.
 *   2. DOTS  - a precomputed dot matrix: points spread evenly over the sphere
 *              (spherical Fibonacci) that fall on land, packed as base64 Int16
 *              pairs of lon*100 / lat*100.
 *
 * Precomputing the dots keeps the homepage instant: the browser never has to run
 * ~30k point-in-polygon tests at load.
 *
 * Run: node tools/build-globe-data.js
 *
 * Source data: world-atlas (land-110m.json), ISC licensed - see
 * tools/land-110m.LICENSE.txt. Derived from Natural Earth (public domain).
 */

const fs = require('fs');
const path = require('path');

const SPHERE_POINTS = 26000; // ~7.5k land dots survive the land test
const SIMPLIFY_TOLERANCE = 0.32; // degrees, Douglas-Peucker
const MIN_RING_POINTS = 4;

const topo = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'land-110m.json'), 'utf8')
);

/* ---------------------------------------------------------------- topojson -- */

// TopoJSON stores arcs as quantized delta-encoded integers. Undo both.
function decodeArc(arc, transform) {
  const [sx, sy] = transform.scale;
  const [tx, ty] = transform.translate;
  const out = [];
  let x = 0;
  let y = 0;
  for (const [dx, dy] of arc) {
    x += dx;
    y += dy;
    out.push([x * sx + tx, y * sy + ty]);
  }
  return out;
}

const arcs = topo.arcs.map((a) => decodeArc(a, topo.transform));

// A ring is a list of arc indices; a negative index ~i means arc i reversed.
function ringToPoints(ring) {
  const pts = [];
  for (const idx of ring) {
    const arc = idx < 0 ? arcs[~idx].slice().reverse() : arcs[idx];
    // Consecutive arcs share an endpoint - drop the duplicate join point.
    for (let i = pts.length ? 1 : 0; i < arc.length; i++) pts.push(arc[i]);
  }
  return pts;
}

function collectRings(geom, into) {
  if (geom.type === 'GeometryCollection') {
    geom.geometries.forEach((g) => collectRings(g, into));
  } else if (geom.type === 'Polygon') {
    geom.arcs.forEach((r) => into.push(ringToPoints(r)));
  } else if (geom.type === 'MultiPolygon') {
    geom.arcs.forEach((poly) => poly.forEach((r) => into.push(ringToPoints(r))));
  }
  return into;
}

const rawRings = collectRings(topo.objects.land, []);

/* ---------------------------------------------------------------- simplify -- */

function perpDistance(p, a, b) {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function simplify(points, tolerance) {
  if (points.length <= 2) return points;
  let maxDist = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDistance(points[i], points[0], points[points.length - 1]);
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }
  if (maxDist <= tolerance) return [points[0], points[points.length - 1]];
  const left = simplify(points.slice(0, index + 1), tolerance);
  const right = simplify(points.slice(index), tolerance);
  return left.slice(0, -1).concat(right);
}

const rings = rawRings
  .map((r) => simplify(r, SIMPLIFY_TOLERANCE))
  .filter((r) => r.length >= MIN_RING_POINTS);

/* ------------------------------------------------------- point-in-polygon -- */

// Bucket every polygon edge by latitude band so the land test only checks the
// handful of edges that could possibly cross a given point's scanline.
const BAND = 2; // degrees per bucket
const bandCount = Math.ceil(180 / BAND);
const buckets = Array.from({ length: bandCount }, () => []);

for (const ring of rings) {
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[j];
    const b = ring[i];
    if (a[1] === b[1]) continue; // horizontal edges never cross a scanline
    const loLat = Math.min(a[1], b[1]);
    const hiLat = Math.max(a[1], b[1]);
    const start = Math.max(0, Math.floor((loLat + 90) / BAND));
    const end = Math.min(bandCount - 1, Math.floor((hiLat + 90) / BAND));
    for (let band = start; band <= end; band++) buckets[band].push([a, b]);
  }
}

function isLand(lon, lat) {
  const band = Math.max(
    0,
    Math.min(bandCount - 1, Math.floor((lat + 90) / BAND))
  );
  let inside = false;
  for (const [a, b] of buckets[band]) {
    if (a[1] > lat !== b[1] > lat) {
      const x = ((b[0] - a[0]) * (lat - a[1])) / (b[1] - a[1]) + a[0];
      if (lon < x) inside = !inside;
    }
  }
  return inside;
}

/* ------------------------------------------------------------- dot matrix -- */

// Spherical Fibonacci lattice: the cheapest way to spread N points over a
// sphere with near-uniform spacing and no polar clustering.
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const landDots = [];

for (let i = 0; i < SPHERE_POINTS; i++) {
  const y = 1 - (i / (SPHERE_POINTS - 1)) * 2; // 1 .. -1
  const lat = Math.asin(y) * (180 / Math.PI);
  const lon = (((GOLDEN * i * (180 / Math.PI)) % 360) + 540) % 360 - 180;
  if (isLand(lon, lat)) landDots.push([lon, lat]);
}

// Pack as Int16 hundredths of a degree. lon fits in +/-18000, lat in +/-9000,
// both well inside Int16 range, so this is lossless to 2 decimal places.
const buf = Buffer.alloc(landDots.length * 4);
landDots.forEach(([lon, lat], i) => {
  buf.writeInt16LE(Math.round(lon * 100), i * 4);
  buf.writeInt16LE(Math.round(lat * 100), i * 4 + 2);
});

/* ---------------------------------------------------------------- emit js -- */

const ringsOut = rings.map((r) =>
  r.flatMap(([lon, lat]) => [+lon.toFixed(2), +lat.toFixed(2)])
);

const out = `/* Generated by tools/build-globe-data.js - do not edit by hand.
 * Land geometry derived from Natural Earth via world-atlas (public domain).
 * ${rings.length} outline rings, ${landDots.length} land dots.
 */
window.AM_GLOBE_DATA = {
  // Flat [lon, lat, lon, lat, ...] rings for the continent outlines.
  rings: ${JSON.stringify(ringsOut)},
  // Base64 Int16LE pairs (lon*100, lat*100) for the land dot matrix.
  dots: "${buf.toString('base64')}"
};
`;

const outPath = path.join(__dirname, '..', 'assets', 'js', 'globe-data.js');
fs.writeFileSync(outPath, out);

console.log(`rings:     ${rings.length}`);
console.log(`ring pts:  ${ringsOut.reduce((n, r) => n + r.length / 2, 0)}`);
console.log(`land dots: ${landDots.length} of ${SPHERE_POINTS} sphere points`);
console.log(`written:   ${path.relative(process.cwd(), outPath)} (${(out.length / 1024).toFixed(1)} KB)`);
