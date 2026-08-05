---
name: convert-lesson
description: Convert a raw Three.js Journey course starter pack (its own Vite project under lessons/<slug>/) into this repo's flat lesson format (index.html + script.ts at the lesson root, registered in lessons.ts). Use when the user drops a new lesson/playground folder from the course exercises and asks to convert, port, or wire it up in this repo's format.
license: MIT
---

# Convert a course starter pack to this repo's lesson format

## When to use

The user has copied a raw course exercise into `lessons/<slug>/` (or
`playground/<slug>/`). It looks like its own standalone Vite project:
`package.json`, `vite.config.js`, `readme.md`, `static/`, `src/index.html`,
`src/script.js`, `src/style.css`. It needs converting into this repo's flat,
dependency-free lesson shape, matching every other folder under `lessons/`.

Read `/Users/bmp/PHUC-LOCAL/phucbm/threejs-journey/CLAUDE.md` first — it documents the
target structure, the base-path rules, and the three.js version pin. This skill
is the step-by-step procedure for getting a lesson from starter-pack shape into
that structure.

## Steps

1. **Inventory the starter pack.** `find lessons/<slug> -type f | sort`. Identify:
   - the real lesson code (`src/script.js`)
   - binary assets (`static/**`, or asset folders sitting next to `script.js`)
   - scaffolding to delete (`package.json`, `readme.md`, `vite.config.js`,
     `src/style.css`, `src/index.html`)

2. **Move assets up and drop the `static/` wrapper**, if one exists.
   `static/models/...` → `models/...` at the lesson root (folder name mirrors
   whatever the loader will look for — `models/`, `textures/`, `sounds/`, etc.).
   Assets stay **inside the lesson folder** — do not move them to `public/`.
   `public/` is reserved for the pre-existing shared library (door textures,
   matcaps, gradients, environment maps, etc.) used across many lessons; new
   lesson-specific assets should not be added there. See "Why assets stay
   lesson-local" below for the mechanics that make this work.

3. **Move the script out of `src/`, rename `.js` → `.ts`.**
   `src/script.js` → `script.ts` at the lesson root. Keep the code unmodified
   in spirit (imperative, ported from the course) — the only near-universal
   addition is casting the canvas query:
   ```ts
   const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement
   ```
   Check `grep -rn "as HTMLCanvasElement" lessons/*/script.ts` for the current
   convention before assuming this is the only change needed — e.g. GUI import
   style (`import GUI from 'lil-gui'` vs `import * as dat from 'lil-gui'`)
   varies across existing lessons; match whichever the starter pack already
   uses rather than forcing a rewrite.

   If any asset is loaded via a runtime URL string (`textureLoader.load(...)`,
   `gltfLoader.load(...)`, `new Audio(...)` with a string path), point it at a
   **relative path**, not `import.meta.env.BASE_URL`:
   ```ts
   gltfLoader.load('./models/Duck/glTF-Binary/Duck.glb', ...)
   ```
   `BASE_URL` resolves to the site root (`/threejs-journey/`) with no lesson
   slug in it, so it can only ever reach `public/` — it cannot address a
   lesson-local folder. A relative path resolves against the script's own
   module URL and works regardless of base path or which slug it's served
   under.

   This applies to any loader path config, not just `.load()` calls —
   `DRACOLoader.setDecoderPath(...)` is the same trap in a different shape.
   `lessons/21-imported-models/script.ts` originally shipped with
   `dracoLoader.setDecoderPath('/draco/')` — a root-**absolute** path, which
   resolves to the site's domain root regardless of `base` in
   `vite.config.ts`, i.e. it silently points outside `/threejs-journey/`
   entirely. It went unnoticed because that lesson's actual `.load()` call
   uses the non-Draco model variant, so the decoder path is configured but
   never exercised. Use `'./draco/'` (relative, lesson-local) instead — same
   fix as any other loader path.

4. **Check for three.js APIs the pinned version has removed or deprecated.**
   Starter packs are written against the original course's three.js version
   (the course predates most of these changes); this repo now runs
   `three@^0.185.1` (bumped from the long-standing `0.130.0` pin in a626f08 —
   see the note on the version pin in `CLAUDE.md`, which may be stale). Two
   categories of breakage to check for while porting the script:
   - **Removed from the `THREE` namespace — build fails loudly.** `pnpm build`
     emits an `IMPORT_IS_UNDEFINED` warning for each of these, so step 7's
     build check will catch anything missed here. Still worth fixing at
     conversion time rather than leaving for a later cleanup pass:
     - `THREE.BoxBufferGeometry` / `SphereBufferGeometry` / `PlaneBufferGeometry`
       / `ConeBufferGeometry` / `TorusBufferGeometry` (etc.) → drop the
       `Buffer` infix: `THREE.BoxGeometry`, `THREE.SphereGeometry`, ...
     - `THREE.FontLoader` / `THREE.TextGeometry` → no longer attached to the
       `THREE` namespace; import from examples/jsm instead:
       ```ts
       import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
       import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
       ```
   - **Deprecated but silently still work — no build warning, only a runtime
     console warning.** These won't surface in `pnpm build`; only checking the
     browser console (or knowing to grep for them) catches them:
     - `new THREE.Clock()` → replaced by `THREE.Timer`, which is not a
       drop-in rename — it needs an explicit `timer.update()` call once per
       frame before reading it, and the getters are renamed
       (`getElapsedTime()` → `getElapsed()`, `getDelta()` stays):
       ```ts
       const timer = new THREE.Timer()
       const tick = () => {
         timer.update()
         const elapsedTime = timer.getElapsed()
         ...
       }
       ```
     - `renderer.shadowMap.type = THREE.PCFSoftShadowMap` → the renderer now
       silently substitutes `PCFShadowMap` at render time (harder shadow
       edges than the lesson intended, with no error). Use
       `THREE.VSMShadowMap` instead for the equivalent soft-shadow look.

   If a whole batch of already-converted lessons needs this same fix (e.g.
   after discovering the pin was bumped), it's a big enough diff to land as
   its own PR separate from whatever lesson prompted the discovery — see
   PRs #7 and #8 for the precedent.

5. **Delete the starter pack's own tooling** — this repo already has one
   shared Vite config, so none of this is needed:
   `package.json`, `readme.md`, `vite.config.js`, `src/style.css`,
   `src/index.html`. Remove the now-empty `src/` directory.

6. **Write a new flat `index.html` at the lesson root.** Copy the shape from
   an existing lesson (`lessons/17-scroll-based-animation/index.html` is a
   clean reference — real title/description, not a stale placeholder like
   `lessons/20-physics/index.html` has). Required pieces:
   - real `<title>`, `<meta name="description">`, canonical `<link>`, OG tags
     — `https://phucbm.github.io/threejs-journey/<slug>/`
   - `<link rel="stylesheet" href="/src/styles/global.css">`
   - `<canvas class="webgl"></canvas>` (plus any extra markup the lesson needs)
   - `<script type="module" src="/src/lib/global.ts"></script>`
   - `<script type="module" src="./script.ts"></script>`
   - favicon: `<link rel="icon" type="image/x-icon" href="%BASE_URL%img/favicon.png">`
     (note `%BASE_URL%`, not `import.meta.env.BASE_URL` — this is raw HTML,
     Vite substitutes it at build time)

7. **Register the lesson in `src/lib/lessons.ts`.** One entry: `slug`,
   `number` (if it's a numbered course chapter), `title`, `description`.
   This alone drives both the nav sidebar and the page's SEO tags — nothing
   else needs touching.

8. **Verify with a real build, not just dev.**
   ```
   pnpm build && find dist/<slug> -maxdepth 3
   ```
   Confirm `dist/<slug>/` contains both `index.html` and any asset folders
   moved in step 2. `pnpm dev` alone won't catch a missing asset-copy step,
   since Vite's dev server serves the whole project tree as static files
   regardless of the build pipeline. Clean up `dist/` afterward (it's
   gitignored, but don't leave build output lying around mid-task).

## Why assets stay lesson-local (mechanics)

`vite.config.ts`'s `flattenGroupsPlugin` normally only moves the Rollup-built
`index.html`/JS bundle from `dist/lessons/<slug>` to `dist/<slug>` in its
`closeBundle` hook. Static asset folders sitting next to `script.ts` (like
`models/`) are never part of the Rollup module graph — nothing imports them —
so without extra handling they'd silently vanish from the production build
while still working in `pnpm dev` (which serves the raw project tree). The
`closeBundle` hook was extended to also copy every subdirectory from each
lesson's source folder into its flattened `dist/<slug>` output. If this
extension is ever missing (check `vite.config.ts` for a loop that
`readdirSync`s the lesson's source dir and `cpSync`s directories into
`outDir`), asset-bearing lessons will build broken pages — re-add it rather
than routing new assets through `public/`.

## Non-goals

This skill converts *format and structure*. It does not write the lesson's
actual Three.js implementation (e.g. adding `GLTFLoader` calls) — that's the
course content itself and should be left as whatever the starter pack shipped
with, or added separately by the user.
