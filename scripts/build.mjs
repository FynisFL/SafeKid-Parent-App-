import { injectMapStyle, readMapStyleOverride } from './map-style-config.mjs';
import { DEFAULT_MAP_STYLE_URL } from '../src/config/map.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const entry of ['index.html','manifest.webmanifest','sw.js','src','assets','content']) {
  const from = path.join(root, entry);
  fs.cpSync(from, path.join(out, entry), {
    recursive: true,
    filter: source => source !== path.join(root, 'assets', 'reference')
      && source !== path.join(root, 'assets', 'brand', 'safekid-logo-original.webp'),
  });
}
const htmlPath = path.join(out, 'index.html');
const effectiveStyle = readMapStyleOverride(root) || DEFAULT_MAP_STYLE_URL;
const html = fs.readFileSync(htmlPath, 'utf8');
fs.writeFileSync(htmlPath, injectMapStyle(html, effectiveStyle));
console.log('Static PWA bundle written to dist/. Map style configured:', Boolean(effectiveStyle));
