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

- `public/res_primaryLanguage.json` — `basic_info` (about text, section titles), `projects[]`, `experience[]`
- `public/portfolio_shared_data.json` — `basic_info` (name, rotating titles, social links, profile image), `skills.icons[]`

`src/App.js` fetches both with `jQuery.ajax` on mount, holds them in `resumeData` / `sharedData` state, and passes slices down as props. Every component guards on props being present because the first render happens before the fetch resolves. To change site content, edit the JSON — do not hardcode into components.

**Icon `class` strings in the JSON are CDN class names**, not local assets. `public/index.html` loads devicon, Font Awesome 5 Pro, and iconify from CDNs; JSON fields like `"class": "devicon-react-original"` and `"class": "fab fa-linkedin"` resolve against those. A new skill/social icon needs a class the CDN actually ships.

**Theming is a body attribute, not React state.** `src/components/Header.js` toggles `document.body[data-theme]` between `light` and `dark` via a `react-switch`. Every themed rule lives nested inside `body[data-theme="dark"]` / `body[data-theme="light"]` blocks in `src/scss/themes/`, imported at the top of `src/App.scss`. Adding a themed style means adding it to *both* theme files; unthemed shared styles go in the body of `App.scss`.

`src/scss/{light,dark}-slider.scss` are imported as CSS modules and handed to `AwesomeSlider` via its `cssModule` prop in `ProjectDetailsModal.js` — they are not global stylesheets.

**Component style is mixed** — `App.js`/`Header.js` are hooks-based function components; `About`, `Projects`, `Skills`, `Experience`, `Footer`, `ProjectDetailsModal` are class components. Follow whichever file you're editing rather than converting.

## Gotchas

- `package.json` `homepage` sets the asset base path (`/portfolio/`). It must keep matching the Pages URL or every built asset 404s.
- `src/App.test.js` is broken as committed: it imports `render` from testing-library but calls `ReactDOM.render`, which is never imported. `npm test` fails until that's fixed.
- `src/serviceWorker.js` is registered in `src/index.js` (CRA's default is `unregister`). Stale-cache behavior after deploys is expected; hard-reload when verifying changes.
- Both JSON loaders fall back to `alert(err)` on failure — a fetch error shows a blocking browser dialog rather than logging.
- `src/profile.jpeg` and `src/logo.svg` are unused leftovers; the live profile image is `public/images/profile.jpeg`, referenced by name from the shared JSON.
