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
  if (fs.existsSync(from)) fs.cpSync(from, path.join(out, entry), { recursive: true });
}
const envPath = path.join(root, '.env');
let style = '';
if (fs.existsSync(envPath)) {
  const line = fs.readFileSync(envPath,'utf8').split(/\r?\n/).find(x => x.startsWith('VITE_MAP_STYLE_URL='));
  if (line) style = line.slice('VITE_MAP_STYLE_URL='.length).trim().replace(/^['"]|['"]$/g, '');
}
const htmlPath = path.join(out,'index.html');
let html = fs.readFileSync(htmlPath,'utf8');
const effectiveStyle = style || DEFAULT_MAP_STYLE_URL;
html = html.replace(/<meta name="safekid-map-style" content="[^"]*"\s*\/>/, `<meta name="safekid-map-style" content="${effectiveStyle.replaceAll('&','&amp;').replaceAll('\"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')}" />`);
fs.writeFileSync(htmlPath,html);
console.log('Static PWA bundle written to dist/. Map style configured:', Boolean(effectiveStyle));
