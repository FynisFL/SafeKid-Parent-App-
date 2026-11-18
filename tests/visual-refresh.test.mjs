import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('SafeKid 3D companion mascots are bundled locally and used across key journeys', () => {
  for (const name of ['mascot-wave.webp', 'mascot-cheer.webp']) {
    const asset = path.join(root, 'assets/illustrations', name);
    assert.ok(fs.existsSync(asset), `${name} asset exists`);
    assert.ok(fs.statSync(asset).size < 150_000, `${name} is optimized for web`);
  }
  const source = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');
  assert.match(source, /mascot-wave\.webp/);
  assert.match(source, /mascot-cheer\.webp/);
  assert.match(source, /sidebar-family-card/);
  assert.match(source, /mobile-nav-icon/);
  assert.match(source, /growth-motto-art/);
});

test('reduced-motion overrides cover new mascot and route animations', () => {
  const styles = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8');
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /\.family-hero-mascot[^{]*\{[^}]*animation:none!important/s);
  assert.match(styles, /\.growth-motto-art>img[^{]*\{[^}]*animation:none!important/s);
  assert.match(styles, /\.route-stage[^{]*\{[^}]*animation:none!important/s);
});

test('service worker precaches mascot assets under a new cache revision', () => {
  const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  assert.match(sw, /safekid-pwa-v7-mobile-shell-r10/);
  assert.match(sw, /assets\/illustrations\/mascot-wave\.webp/);
  assert.match(sw, /assets\/illustrations\/mascot-cheer\.webp/);
  assert.match(sw, /src\/domain\/sos\.js/);
  assert.match(sw, /src\/domain\/safe-zone\.js/);
  assert.match(sw, /src\/services\/geocoding\.js/);
});


test('the family UI theme includes mobile breakpoints and pastel visual tokens', () => {
  const styles = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8');
  assert.match(styles, /--sk-background:#F2F8FF/);
  assert.match(styles, /--sk-lilac:#EEEAFE/);
  assert.match(styles, /@media\(max-width:767px\)/);
  assert.match(styles, /\.mobile-nav\{[^}]*display:flex/s);
  assert.match(styles, /\.page-intro:has\(> \.btn\)/);
});
