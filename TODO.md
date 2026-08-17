# TODO

Open items as of 2026-08-17. Everything below is optional — the site is live and
deploying cleanly from `main`.

## Blocked on a decision

- [ ] **Resume omits the Amazon intern role** (01.2021 – 07.2021) that the site lists.
      You confirmed the site is right, so the resume is the one to update.
- [ ] **Property Finder pills don't mention the marketplace work.** Your resume leads
      with auctions, slot bidding, credit transactions and bundles; the site shows
      Distributed Systems / Database Design / Observability. Add a "Marketplace" pill
      and/or restore the auctions bullet dropped from `impact[]` to keep the card to four.
- [ ] **Confirm Homechrome's `startDate: "2026"`** is the year you want shown.

## Worth doing eventually

- [ ] **Replace `react-vertical-timeline-component`.** Every remaining `npm audit`
      finding (35) comes from it declaring a 2018 `@babel/preset-es2015` beta as a
      runtime dependency. None of it reaches the shipped bundle, but it is the only
      thing standing between this repo and a clean audit.
- [ ] **React is still 16.** The build tooling is current; React itself is not.
      `react-awesome-slider` and `react-typical` are both unmaintained, so a React 18
      upgrade needs them replaced or verified first.
- [ ] **Vite is pinned to 5.** Vite 8 (rolldown) fails to build this app.
- [ ] **C# and C++ render as near-identical glyphs** in the skills grid — devicon draws
      both as monochrome hexagons and the `#`/`++` detail is lost at 34px. Labels
      disambiguate; only worth fixing if it reads as a duplicate.

## Done

- [x] Inlined all 38 icons, retiring the devicon webfont (1.5 MB), Font Awesome
      (~200 kB of webfonts) and the iconify script. Page transfer ~1808 kB -> ~120 kB
      with the rendering unchanged. Regenerate with `npm run icons` after adding one.

- [x] Migrated from Create React App to Vite. 2093 packages -> 367, 223 audit findings
      -> 35, build 20s -> 0.8s, and `--openssl-legacy-provider` is no longer needed.
- [x] Dropped jQuery for `fetch`; bundle gzip ~98 kB -> ~67 kB.
- [x] The HLD page is generated from the .excalidraw by `scripts/build-hld.mjs`,
      wired into `npm run build`.
- [x] Google Search Console verified.
- [x] npm scripts made POSIX, so `npm start` / `npm run build` work without passing
      `NODE_OPTIONS` by hand. The deploy workflow now just calls `npm run build`.
- [x] `alert(err)` on a failed JSON fetch replaced with `console.error`.
- [x] Service worker unregistered instead of registered — no more stale page after a deploy.
- [x] Deleted the unused `src/logo.svg`.
- [x] Removed the manual `npm run deploy` path and its `gh-pages` dependency.

## Deliberately not done

- Instagram was removed from the footer in favour of GitHub. One JSON entry to restore.
- HTML 5, CSS 3 and JavaScript were dropped from the skills grid — assumed of any
  engineer, and they diluted a backend profile.
- Employer projects stay out of the Projects section by design: no public artifact to
  link. They belong in the experience timeline as impact bullets, where they now are.
