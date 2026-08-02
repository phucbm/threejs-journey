# CLAUDE.md

## Stack

Plain Vite + TypeScript, no frontend framework. Package manager is **pnpm**. Deployed as a static site to **GitHub Pages** via `.github/workflows/deploy.yml` on every push to `master`.

The site previously ran on Nuxt 3 / Vue, deployed to Netlify. That version is preserved forever on the `legacy/nuxt-vue` branch and is not touched going forward.

## Structure

Each lesson is a standalone, self-contained page living in its own folder at the repo root:

```
01-setup/
  index.html
  script.ts
```

- `index.html` is a real, complete HTML file (own `<title>`, `<meta description>`, canonical/OG tags) — not generated from a template. It can be understood and copied in isolation.
- `script.ts` holds the lesson's Three.js code, unmodified in spirit from the original course exercises — imperative, no framework.
- Every lesson's `index.html` includes exactly two shared files: `<link rel="stylesheet" href="/src/styles/global.css">` and `<script type="module" src="/src/lib/global.ts">`. Nothing else is shared — copy a lesson folder out and, aside from those two includes, it's fully standalone.
- Future React/react-three-fiber lessons follow the same shape but with `main.tsx` (+ `App.tsx`) instead of `script.ts`, mounting into a `<div id="root">` instead of `<canvas class="webgl">`.

## Shared infra (`src/`)

- `src/lib/lessons.ts` — single source of truth for every lesson's `slug`, `number`, `title`, and `description`. Drives both the nav sidebar and each page's SEO meta tags. **Adding a lesson means adding one entry here** plus creating its folder — nothing else needs updating.
- `src/lib/global.ts` — renders the fixed sidebar nav client-side by reading `lessons.ts`, highlights the active link via `location.pathname`, and wires up the mobile hamburger toggle.
- `src/styles/global.css` — Tailwind v4 (`@import "tailwindcss"`) plus the ported nav/reset styles.

## Base path

The site deploys under `https://phucbm.github.io/threejs-journey/`, so `vite.config.ts` sets `base: '/threejs-journey/'`. This has two implications when writing lesson code:

- Inside `.ts` files, any reference to a `public/` asset (`textures/`, `fonts/`, `mineblocks/`, `img/`) must be prefixed with `import.meta.env.BASE_URL`, e.g. `` textureLoader.load(`${import.meta.env.BASE_URL}textures/door/color.jpg`) ``.
- Inside raw `index.html` files, use Vite's `%BASE_URL%` placeholder instead, e.g. `<link rel="icon" href="%BASE_URL%img/favicon.png">`.
- `<script type="module" src="...">` / `<link rel="stylesheet" href="...">` referencing files under `src/` do NOT need this — Vite resolves and rewrites those automatically as part of the build.
- Always verify with `pnpm build && pnpm preview` (not just `pnpm dev`) before assuming assets load correctly — a missed prefix shows up as a 404 there.

## Build entries

`vite.config.ts` auto-discovers build entries by scanning the repo root for any folder containing an `index.html` (skipping `node_modules`, `dist`, `public`, `src`, `.git`, `.github`, `.idea`). No manual entry list to maintain when adding a lesson.

## three.js version

`three` is intentionally pinned to `0.130.0` — the version the original course code was written against. Do not bump it casually; newer three versions changed color-space handling and removed APIs, which would silently break the ported lesson code (e.g. lighting/material colors rendering differently). If a lesson needs a newer three feature, upgrade deliberately and re-verify that specific lesson visually.
