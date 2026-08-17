#!/usr/bin/env node
/**
 * Inlines every icon the site draws, replacing three CDN icon libraries:
 *
 *   devicon.min.css   + devicon.woff        (1.5 MB font, ~20 glyphs used)
 *   fontawesome all.css + 2 webfonts        (~200 kB, 12 glyphs used)
 *   iconify.min.js                          (runtime fetcher, 6 glyphs used)
 *
 * Sources are the same artwork those libraries ship, so the rendering is
 * unchanged: devicon's font is generated from these exact `-plain` SVGs, and
 * the Font Awesome glyphs come from the Free package at the same version.
 *
 * `mono: true` strips baked-in fills so the SVG takes `currentColor`, matching
 * how an icon font inherits text colour. Emoji keep their own colours.
 *
 * Run after adding an icon, then commit the result:  npm run icons
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src/icons.generated.js');

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const FA = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/svgs';
const ICONIFY = 'https://api.iconify.design';

/** key -> { url, mono } — keys match what the JSX and JSON ask for. */
const ICONS = {
  // devicon: skill + project technology marks
  'devicon-amazonwebservices-plain': { url: `${DEVICON}/amazonwebservices/amazonwebservices-plain-wordmark.svg`, mono: true },
  'devicon-azure-plain': { url: `${DEVICON}/azure/azure-plain.svg`, mono: true },
  'devicon-cplusplus-plain': { url: `${DEVICON}/cplusplus/cplusplus-plain.svg`, mono: true },
  'devicon-csharp-plain': { url: `${DEVICON}/csharp/csharp-plain.svg`, mono: true },
  'devicon-docker-plain': { url: `${DEVICON}/docker/docker-plain.svg`, mono: true },
  'devicon-dot-net-plain': { url: `${DEVICON}/dot-net/dot-net-plain.svg`, mono: true },
  'devicon-dynamodb-plain': { url: `${DEVICON}/dynamodb/dynamodb-plain.svg`, mono: true },
  'devicon-go-original-wordmark': { url: `${DEVICON}/go/go-original-wordmark.svg`, mono: true },
  'devicon-grafana-plain': { url: `${DEVICON}/grafana/grafana-plain.svg`, mono: true },
  'devicon-java-plain': { url: `${DEVICON}/java/java-plain.svg`, mono: true },
  'devicon-nextjs-plain': { url: `${DEVICON}/nextjs/nextjs-plain.svg`, mono: true },
  'devicon-numpy-plain': { url: `${DEVICON}/numpy/numpy-plain.svg`, mono: true },
  'devicon-pandas-plain': { url: `${DEVICON}/pandas/pandas-plain.svg`, mono: true },
  'devicon-postgresql-plain': { url: `${DEVICON}/postgresql/postgresql-plain.svg`, mono: true },
  'devicon-python-plain': { url: `${DEVICON}/python/python-plain.svg`, mono: true },
  'devicon-react-original': { url: `${DEVICON}/react/react-original.svg`, mono: true },
  'devicon-spring-plain': { url: `${DEVICON}/spring/spring-original.svg`, mono: true },
  'devicon-sqldeveloper-plain': { url: `${DEVICON}/sqldeveloper/sqldeveloper-plain.svg`, mono: true },
  'devicon-terraform-plain': { url: `${DEVICON}/terraform/terraform-plain.svg`, mono: true },
  'devicon-typescript-plain': { url: `${DEVICON}/typescript/typescript-plain.svg`, mono: true },

  // font awesome: timeline markers, links, controls
  'fab fa-amazon': { url: `${FA}/brands/amazon.svg`, mono: true },
  'fab fa-microsoft': { url: `${FA}/brands/microsoft.svg`, mono: true },
  'fab fa-github': { url: `${FA}/brands/github.svg`, mono: true },
  'fab fa-linkedin': { url: `${FA}/brands/linkedin.svg`, mono: true },
  'fas fa-building': { url: `${FA}/solid/building.svg`, mono: true },
  'fas fa-university': { url: `${FA}/solid/university.svg`, mono: true },
  'fas fa-feather-alt': { url: `${FA}/solid/feather-alt.svg`, mono: true },
  'fas fa-envelope': { url: `${FA}/solid/envelope.svg`, mono: true },
  'fas fa-file-alt': { url: `${FA}/solid/file-alt.svg`, mono: true },
  'fas fa-external-link-alt': { url: `${FA}/solid/external-link-alt.svg`, mono: true },
  'fas fa-project-diagram': { url: `${FA}/solid/project-diagram.svg`, mono: true },
  'fas fa-times': { url: `${FA}/solid/times.svg`, mono: true },

  // iconify: header mark, theme switch faces, slider window buttons
  'la:laptop-code': { url: `${ICONIFY}/la:laptop-code.svg`, mono: true },
  'twemoji:owl': { url: `${ICONIFY}/twemoji:owl.svg`, mono: false },
  'noto-v1:sun-with-face': { url: `${ICONIFY}/noto-v1:sun-with-face.svg`, mono: false },
  'emojione:red-circle': { url: `${ICONIFY}/emojione:red-circle.svg`, mono: false },
  'twemoji:yellow-circle': { url: `${ICONIFY}/twemoji:yellow-circle.svg`, mono: false },
  'twemoji:green-circle': { url: `${ICONIFY}/twemoji:green-circle.svg`, mono: false },
};

const parse = (svg, mono) => {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  let inner = svg
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (mono) {
    // an icon font has no colours of its own; neither should these
    inner = inner
      .replace(/\s(fill|stroke)="(?!none")[^"]*"/g, '')
      .replace(/\s(fill|stroke):\s*(?!none)[^;"']*[;]?/g, '');
  }
  return { viewBox, inner };
};

const entries = [];
for (const [key, { url, mono }] of Object.entries(ICONS)) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  MISS ${key} <- ${url} (${res.status})`);
    continue;
  }
  const { viewBox, inner } = parse(await res.text(), mono);
  entries.push(
    `  ${JSON.stringify(key)}: { viewBox: ${JSON.stringify(viewBox)}, mono: ${mono}, inner: ${JSON.stringify(inner)} },`
  );
  console.log(`  ok   ${key.padEnd(32)} ${(inner.length / 1024).toFixed(1)} kB`);
}

const file = `// Generated by scripts/fetch-icons.mjs — do not edit by hand.
// devicon (MIT), Font Awesome Free 5.15.4 (CC BY 4.0 icons), iconify sets.
/* eslint-disable */
export const icons = {
${entries.join('\n')}
};
`;

writeFileSync(OUT, file);
console.log(`\nwrote src/icons.generated.js — ${entries.length} icons, ${(file.length / 1024).toFixed(1)} kB raw`);
