import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const dirArg = args.indexOf('--dir');
const root = path.resolve(here, dirArg >= 0 ? (args[dirArg + 1] || 'dist') : '.');
const portArg = args.indexOf('--port');
const port = Number(portArg >= 0 ? args[portArg + 1] : process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.md':'text/markdown; charset=utf-8','.wav':'audio/wav' };
function readMapStyle() {
  const envPath = path.join(here, '.env');
  if (!fs.existsSync(envPath)) return '';
  const line = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).find(x => x.trim().startsWith('VITE_MAP_STYLE_URL='));
  return line ? line.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '') : '';
}
function injectMapStyle(html) {
  const configured = readMapStyle();
  if (!configured) return html;
  const style = configured.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  return html.replace(/<meta name="safekid-map-style" content="[^"]*"\s*\/>/, `<meta name="safekid-map-style" content="${style}" />`);
}
const server = http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = path.resolve(root, relative);
  const rel = path.relative(root, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.stat(target, (err, stat) => {
    const file = !err && stat.isDirectory() ? path.join(target, 'index.html') : target;
    fs.readFile(file, (readErr, data) => {
      if (readErr) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('Not found'); return; }
      const body = path.basename(file) === 'index.html' ? Buffer.from(injectMapStyle(data.toString('utf8'))) : data;
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options':'nosniff' });
      res.end(body);
    });
  });
});
server.listen(port, '0.0.0.0', () => console.log(`SafeKid local server: http://localhost:${port}`));
