import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, statSync, existsSync, cpSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

// Source folders that group pages on disk but should NOT appear in the URL —
// every page still resolves to a flat /<slug>/ regardless of which group it's in.
const GROUPS = ['lessons', 'playground'];

function findEntries(): Record<string, string> {
  const entries: Record<string, string> = { main: resolve(root, 'index.html') };
  for (const group of GROUPS) {
    const groupPath = join(root, group);
    if (!existsSync(groupPath)) continue;
    for (const slug of readdirSync(groupPath)) {
      const dirPath = join(groupPath, slug);
      if (!statSync(dirPath).isDirectory()) continue;
      const htmlPath = join(dirPath, 'index.html');
      if (existsSync(htmlPath)) entries[slug] = resolve(htmlPath);
    }
  }
  return entries;
}

// Keeps URLs flat (e.g. /01-setup/, /the-mess/) no matter which group a
// page's source lives under: rewrites dev-server requests to the grouped
// path, and after build, moves each dist/<group>/<slug> folder up to
// dist/<slug>, since letting Vite emit into dist/<group>/<slug> normally
// and relocating afterward is far more reliable than trying to rename
// entries mid-build (Vite's internal HTML pipeline doesn't cooperate well
// with renaming bundle entries in generateBundle).
function flattenGroupsPlugin(): Plugin {
  let outDir = resolve(root, 'dist');

  return {
    name: 'flatten-groups',
    configResolved(config) {
      outDir = resolve(root, config.build.outDir);
    },
    configureServer(server) {
      const base = server.config.base;
      server.middlewares.use((req, res, next) => {
        const [pathname, search = ''] = (req.url ?? '').split('?');
        if (!pathname.startsWith(base)) return next();

        const relPath = pathname.slice(base.length);
        const match = relPath.match(/^([^/]+)(\/.*)?$/);
        if (match) {
          const [, slug, rest = ''] = match;
          for (const group of GROUPS) {
            if (existsSync(join(root, group, slug))) {
              req.url = `${base}${group}/${slug}${rest}${search ? `?${search}` : ''}`;
              return next();
            }
          }
        }
        next();
      });
    },
    closeBundle() {
      for (const group of GROUPS) {
        const groupOut = join(outDir, group);
        if (!existsSync(groupOut)) continue;
        for (const slug of readdirSync(groupOut)) {
          cpSync(join(groupOut, slug), join(outDir, slug), { recursive: true });
        }
        rmSync(groupOut, { recursive: true, force: true });
      }
    },
  };
}

export default defineConfig({
  base: '/threejs-journey/',
  plugins: [tailwindcss(), flattenGroupsPlugin()],
  build: {
    rollupOptions: {
      input: findEntries(),
    },
  },
});
