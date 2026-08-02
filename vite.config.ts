import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

// Folders that are not lesson pages, skipped when auto-discovering build entries.
const ignore = new Set(['node_modules', 'dist', 'public', 'src', '.git', '.idea', '.github']);

function findLessonEntries(): Record<string, string> {
  const entries: Record<string, string> = { main: resolve(root, 'index.html') };
  for (const name of readdirSync(root)) {
    if (name.startsWith('.') || ignore.has(name)) continue;
    const dirPath = join(root, name);
    if (!statSync(dirPath).isDirectory()) continue;
    const htmlPath = join(dirPath, 'index.html');
    if (existsSync(htmlPath)) entries[name] = resolve(htmlPath);
  }
  return entries;
}

export default defineConfig({
  base: '/threejs-journey/',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: findLessonEntries(),
    },
  },
});
