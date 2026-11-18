import fs from 'node:fs';
import path from 'node:path';

export function readMapStyleOverride(root) {
  const envFile = path.join(root, '.env');
  if (!fs.existsSync(envFile)) return '';

  const match = fs.readFileSync(envFile, 'utf8')
    .match(/^[ \t]*VITE_MAP_STYLE_URL[ \t]*=[ \t]*(.*)$/m);
  const value = match?.[1].trim() ?? '';
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

export function injectMapStyle(html, url) {
  const escaped = url.replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

  return html.replace(
    /<meta name="safekid-map-style" content="[^"]*"\s*\/>/,
    () => `<meta name="safekid-map-style" content="${escaped}" />`,
  );
}
