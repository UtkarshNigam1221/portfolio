# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio site (Utkarsh Nigam). Create React App 3.4.3 + React 16, deployed to GitHub Pages. Forked from the `dorota1997/react-frontend-dev-portfolio` template — several template artifacts survive (see Gotchas).

## Commands

The npm scripts use Windows `cmd` syntax (`set NODE_OPTIONS=... && ...`), which silently no-ops on macOS/Linux — the env var never reaches `react-scripts`, and webpack 4 then fails on Node 17+ with `error:0308010C:digital envelope routines::unsupported`. On this machine (Node 22) run:

```bash
npm install
NODE_OPTIONS=--openssl-legacy-provider npx react-scripts start   # dev server, :3000
NODE_OPTIONS=--openssl-legacy-provider npx react-scripts build   # -> build/
npx react-scripts test                                           # jest watch mode
npx react-scripts test --watchAll=false src/App.test.js          # single file, one shot
```

Deploys are automated: `.github/workflows/deploy.yml` builds and publishes to GitHub Pages
(https://utkarshnigam1221.github.io/portfolio/) on every push to `main`. Repo Settings → Pages →
Source must be **GitHub Actions**. `npm run deploy` (gh-pages branch) is the old manual path and is
no longer needed.

CI sets `CI=true`, which makes CRA treat eslint warnings as build failures. A stray unused variable
will break the deploy — build locally with `CI=true` before pushing.

If you fix the scripts, `NODE_OPTIONS=--openssl-legacy-provider react-scripts start` works on both platforms via npm's `sh` shim.

## Architecture

**Content is data, not JSX.** All copy, projects, skills, and job history live in two JSON files served statically from `public/`:

- `public/res_primaryLanguage.json` — `basic_info` (bio, `highlights[]` fact rail, section titles), `projects[]`, `experience[]`, `education`
- `public/portfolio_shared_data.json` — `basic_info` (name, rotating titles, social links, `email`, `resume`), `skills.groups[]`

Field notes, all optional and all driving conditional rendering:
- `basic_info.description` is one string with blank lines between paragraphs; `About.js` splits on `\n\n` and promotes the first paragraph to a lead.
- `basic_info.highlights[]` — `{label, value}` rows for the About fact rail.
- `skills.groups[]` — `{name, icons[]}`; icons carry no proficiency rating by design.
- A project may set `featured: true` (renders the wide card at the top of the section, using its `summary`) and `architecture` (a path under `public/`, rendered as a link below the modal description).
- An experience entry may set `impact[]` — the outcome bullets. Its `icon` holds a **full** Font Awesome class (`fab fa-amazon`, `fas fa-building`), not a bare name.

`src/App.js` fetches both with `jQuery.ajax` on mount, holds them in `resumeData` / `sharedData` state, and passes slices down as props. Every component guards on props being present because the first render happens before the fetch resolves. To change site content, edit the JSON — do not hardcode into components.

**Icon `class` strings in the JSON are CDN class names**, not local assets. `public/index.html` loads devicon, Font Awesome 5 Pro, and iconify from CDNs; JSON fields like `"class": "devicon-react-original"` and `"class": "fab fa-linkedin"` resolve against those. A new skill/social icon needs a class the CDN actually ships.

**Theming is a body attribute, not React state.** `src/components/Header.js` toggles `document.body[data-theme]` between `light` and `dark` via a `react-switch`. Every themed rule lives nested inside `body[data-theme="dark"]` / `body[data-theme="light"]` blocks in `src/scss/themes/`, imported at the top of `src/App.scss`. Adding a themed style means adding it to *both* theme files; unthemed shared styles go in the body of `App.scss`.

`src/scss/{light,dark}-slider.scss` are imported as CSS modules and handed to `AwesomeSlider` via its `cssModule` prop in `ProjectDetailsModal.js` — they are not global stylesheets.

**Component style is mixed** — most components are hooks-based function components; `Projects` and `ProjectDetailsModal` are still classes. Follow whichever file you're editing rather than converting.

**The Homechrome architecture page** (`public/homechrome-hld.html`) is a static page with the diagram inlined as SVG. Its source of truth is `docs/homechrome-hld.excalidraw` — open that at excalidraw.com to edit, then re-export SVG and swap the `<svg>` block in the HTML. There is no build step wiring the two together.

## Gotchas

- `package.json` `homepage` sets the asset base path (`/portfolio/`). It must keep matching the Pages URL or every built asset 404s.
- `src/setupTests.js` stubs `IntersectionObserver`; jsdom has none and `react-vertical-timeline-component` observes scroll visibility on mount, so rendering `App` throws without it.
- The experience timeline only reveals cards when scrolled into view. In a full-page screenshot they render **blank** — that is the visibility animation, not a bug. Screenshot the viewport instead.
- Devicon variants are per-icon, not universal: `devicon-nextjs-original` and `devicon-grafana-original` do not exist (`-plain` does), and there is no Gin icon at all. `curl` the CDN's CSS and grep before trusting a class name.
- `src/serviceWorker.js` is registered in `src/index.js` (CRA's default is `unregister`). Stale-cache behavior after deploys is expected; hard-reload when verifying changes.
- Both JSON loaders fall back to `alert(err)` on failure — a fetch error shows a blocking browser dialog rather than logging.
- `src/logo.svg` is an unused leftover. Both profile images are live: `src/profile.jpeg` is imported by `About.js`, `public/images/profile.jpeg` is referenced by name from the shared JSON.
- `public/resume.pdf` is a redacted copy — phone number removed from the text layer, not covered over. Re-copying the original from Downloads would republish it.
- A dev-only `process is not defined` error triggers CRA's full-screen error-overlay iframe, which silently swallows clicks in browser automation. Production builds are clean.
