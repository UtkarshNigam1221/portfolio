#!/usr/bin/env node
/**
 * Renders docs/homechrome-hld.excalidraw into public/homechrome-hld.html.
 *
 * Runs as part of `npm run build`, so editing the .excalidraw file in
 * excalidraw.com is all it takes — the published page follows. rough.js draws
 * the same hand-drawn strokes Excalidraw itself uses, and its generator works
 * without a DOM, so this needs no browser.
 *
 * Seeds derive from element ids, so output is byte-stable across runs.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import rough from 'roughjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCENE = join(root, 'docs/homechrome-hld.excalidraw');
const OUT = join(root, 'public/homechrome-hld.html');

const PAD = 48;
const FONT = "'Architects Daughter', 'Comic Sans MS', cursive";
// Architects Daughter is narrow; enough to decide when a label needs wrapping.
const CHAR_WIDTH = 0.5;

const gen = rough.generator();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const seedOf = (id) => {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h) % 2147483647;
};

function bounds(els) {
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const e of els) {
    const pts = e.type === 'arrow'
      ? e.points.map(([px, py]) => [e.x + px, e.y + py])
      : [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    for (const [x, y] of pts) {
      x1 = Math.min(x1, x); y1 = Math.min(y1, y);
      x2 = Math.max(x2, x); y2 = Math.max(y2, y);
    }
  }
  return { x1, y1, x2, y2 };
}

function wrap(text, fontSize, maxWidth) {
  const out = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length * fontSize * CHAR_WIDTH > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    out.push(line);
  }
  return out;
}

/** rough.js drawables -> SVG <path> elements */
function draw(drawable, { stroke, strokeWidth, dash }) {
  return drawable.sets.map((set) => {
    const d = gen.opsToPath(set);
    if (set.type === 'fillPath') {
      return `<path d="${d}" fill="${drawable.options.fill}" stroke="none"/>`;
    }
    const dashAttr = dash ? ` stroke-dasharray="8 6"` : '';
    return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr}/>`;
  }).join('');
}

const scene = JSON.parse(readFileSync(SCENE, 'utf8'));
const els = scene.elements.filter((e) => !e.isDeleted);
const b = bounds(els);
const W = Math.round(b.x2 - b.x1 + PAD * 2);
const H = Math.round(b.y2 - b.y1 + PAD * 2);

const parts = [];

for (const e of els) {
  const dash = e.strokeStyle === 'dashed';
  const opts = {
    stroke: e.strokeColor,
    strokeWidth: e.strokeWidth,
    roughness: 1.1,
    seed: seedOf(e.id),
  };

  if (e.type === 'rectangle') {
    const filled = e.backgroundColor !== 'transparent';
    const drawable = gen.rectangle(e.x, e.y, e.width, e.height, {
      ...opts,
      fill: filled ? e.backgroundColor : undefined,
      fillStyle: 'solid',
    });
    parts.push(draw(drawable, { stroke: e.strokeColor, strokeWidth: e.strokeWidth, dash }));
  } else if (e.type === 'arrow') {
    const p = e.points;
    for (let i = 0; i < p.length - 1; i++) {
      const line = gen.line(e.x + p[i][0], e.y + p[i][1], e.x + p[i + 1][0], e.y + p[i + 1][1], opts);
      parts.push(draw(line, { stroke: e.strokeColor, strokeWidth: e.strokeWidth, dash }));
    }
    const n = p.length;
    const ex = e.x + p[n - 1][0], ey = e.y + p[n - 1][1];
    const px = e.x + p[n - 2][0], py = e.y + p[n - 2][1];
    const a = Math.atan2(ey - py, ex - px), L = 15, S = 0.42;
    for (const sign of [-1, 1]) {
      const head = gen.line(ex, ey, ex - L * Math.cos(a + sign * S), ey - L * Math.sin(a + sign * S), opts);
      parts.push(draw(head, { stroke: e.strokeColor, strokeWidth: e.strokeWidth, dash: false }));
    }
  }
}

// text last, so labels always sit above the strokes
for (const e of els) {
  if (e.type !== 'text') continue;
  const container = e.containerId && els.find((c) => c.id === e.containerId);
  const lh = e.fontSize * 1.3;
  let lines, x, y, anchor;

  if (container) {
    lines = wrap(e.text, e.fontSize, container.width - 24);
    x = Math.round(container.x + container.width / 2);
    y = container.y + container.height / 2 - ((lines.length - 1) * lh) / 2;
    anchor = ' text-anchor="middle" dominant-baseline="middle"';
  } else {
    lines = e.text.split('\n');
    x = Math.round(e.x);
    y = e.y + e.fontSize * 0.8;
    anchor = '';
  }

  const tspans = lines
    .map((ln, i) => `<tspan x="${x}" y="${Math.round(y + i * lh)}">${esc(ln)}</tspan>`)
    .join('');
  parts.push(
    `<text fill="${e.strokeColor}" font-family="${FONT}" font-size="${e.fontSize}"${anchor}>${tspans}</text>`
  );
}

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">` +
  `<g transform="translate(${Math.round(PAD - b.x1)},${Math.round(PAD - b.y1)})">` +
  parts.join('') +
  `</g></svg>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Homechrome &mdash; High Level Design</title>
<meta name="description" content="High level design of Homechrome, a handloom e-commerce platform built solo: Go services on AWS Lambda, semantic search, event-driven workers, business metrics and OpenTelemetry tracing into Grafana Cloud." />
<link rel="canonical" href="https://utkarshnigam1221.github.io/portfolio/homechrome-hld.html" />
<meta property="og:title" content="Homechrome — High Level Design" />
<meta property="og:description" content="Architecture of a handloom e-commerce platform: Go on AWS Lambda, semantic search, event-driven workers, and instrumented business metrics." />
<meta property="og:url" content="https://utkarshnigam1221.github.io/portfolio/homechrome-hld.html" />
<meta property="og:image" content="https://utkarshnigam1221.github.io/portfolio/og-image.png" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="images/profile.jpeg">
<link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Raleway:wght@300;500&display=swap" rel="stylesheet">
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #f5f0e1;
    color: #24292f;
    font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  header { max-width: 1100px; margin: 0 auto; padding: 40px 24px 8px; }
  h1 { margin: 0 0 6px; font-size: 28px; font-weight: 500; letter-spacing: .02em; }
  p.sub { margin: 0; color: #6b6250; font-size: 15px; line-height: 1.6; }
  a.back { display: inline-block; margin-bottom: 18px; color: #8a7a4e; text-decoration: none; font-size: 14px; }
  a.back:hover { text-decoration: underline; }
  ul.legend {
    list-style: none; display: flex; flex-wrap: wrap; gap: 18px;
    margin: 18px 0 0; padding: 0; font-size: 13px; color: #6b6250;
  }
  ul.legend li { display: flex; align-items: center; gap: 8px; }
  span.swatch { width: 26px; height: 0; border-top-width: 2px; border-top-style: solid; }
  /* the diagram is wide by nature: let it scroll rather than shrink to unreadable */
  .canvas { margin: 24px auto 60px; padding: 0 24px; max-width: 1600px; }
  .frame {
    background: #fff; border: 1px solid #e3dcc6; border-radius: 10px;
    padding: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch;
  }
  .frame svg { display: block; width: 100%; min-width: 1100px; height: auto; }
  @media (max-width: 700px) { header { padding-top: 24px; } h1 { font-size: 22px; } }
</style>
</head>
<body>
<header>
  <a class="back" href="./">&larr; back to portfolio</a>
  <h1>Homechrome &mdash; High Level Design</h1>
  <p class="sub">A handloom textiles business running end to end on software I designed and built solo: the customer storefront, the admin back office, and the services behind both.</p>
  <ul class="legend">
    <li><span class="swatch" style="border-color:#1e1e1e"></span> synchronous request</li>
    <li><span class="swatch" style="border-color:#6741d9; border-top-style:dashed"></span> events &amp; workers</li>
    <li><span class="swatch" style="border-color:#f08c00; border-top-style:dashed"></span> business metrics</li>
    <li><span class="swatch" style="border-color:#868e96; border-top-style:dashed"></span> traces &amp; logs</li>
  </ul>
</header>
<div class="canvas"><div class="frame">
${svg}
</div></div>
</body>
</html>
`;

writeFileSync(OUT, html);
console.log(`build-hld: ${els.length} elements -> public/homechrome-hld.html (${(html.length / 1024).toFixed(0)} kB)`);
