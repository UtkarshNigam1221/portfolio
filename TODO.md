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

- [ ] **Drop jQuery.** It is loaded solely for the two `$.ajax` calls in `App.js`;
      `fetch` covers both and removes a dependency from the bundle.
- [ ] **The HLD page has no build step.** `public/homechrome-hld.html` has the diagram
      inlined as SVG. Editing `docs/homechrome-hld.excalidraw` will not update it —
      re-export SVG from excalidraw.com and swap the `<svg>` block by hand.
- [ ] **Stack is old.** react-scripts 3.4.3 / React 16, which is why Node 17+ needs
      `--openssl-legacy-provider` and why `npm install` reports a long vulnerability
      list. None of it is exploitable on a static site with no user input, but an
      upgrade to Vite or a current CRA replacement would retire the whole class.
- [ ] **C# and C++ render as near-identical glyphs** in the skills grid — devicon draws
      both as monochrome hexagons and the `#`/`++` detail is lost at 34px. Labels
      disambiguate; only worth fixing if it reads as a duplicate.

## Done

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
