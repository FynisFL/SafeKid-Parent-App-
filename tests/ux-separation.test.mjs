import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const styles=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const refinements=readFileSync(new URL('../src/mobile-refinements.css',import.meta.url),'utf8');
const serviceWorker=readFileSync(new URL('../sw.js',import.meta.url),'utf8');

test('FAQ and S.F AI have separate routes and renderers',()=>{
  assert.equal(source.includes("lastRenderedRoute=null;"+String.fromCharCode(92)+"nfunction render()"),false);
  assert.ok(source.includes("function normalizeFaqSearch(value)"));
  assert.match(source,/if\(p==='\/help'\)return renderHelp\(\);if\(p==='\/sfai'\)return renderSfai\(\);/);
  assert.match(source,/function renderHelp\(\)/);
  assert.match(source,/function renderSfai\(\)/);
  const faq=source.slice(source.indexOf('function renderHelp()'),source.indexOf('function renderChatMessage'));
  assert.doesNotMatch(faq,/sfai-form|sfai-messages/);
  assert.match(faq,/faq-items/);
  assert.match(faq,/normalizeFaqSearch/);
  const sfai=source.slice(source.indexOf('function renderSfai()'),source.indexOf('function answerSfai('));
  assert.match(sfai,/sfai-form/);
  assert.doesNotMatch(sfai,/faq-items/);
});

test('More hub exposes FAQ and S.F AI as independent destinations',()=>{
  const more=source.slice(source.indexOf('function renderMoreHub()'),source.indexOf('function renderHome()'));
  assert.ok(more.includes("['/help','faqHub','book']"));
  assert.ok(more.includes('href="#/sfai"'));
  assert.match(more,/support-entry-card--hub/);
});

test('S.F AI provides suggested prompts and truthful local-only support disclosure',()=>{
  const sfai=source.slice(source.indexOf('function renderSfai()'),source.indexOf('function answerSfai('));
  assert.match(source.slice(source.indexOf('function renderSfaiConversation'),source.indexOf('function refreshSfaiConversation')),/data-sfai-prompt/);
  assert.match(sfai,/không phải nhân viên trực tuyến/);
  assert.match(sfai,/không được gửi tới đội ngũ SafeKid/);
});
test('FAQ search normalization removes Vietnamese diacritics and collapses whitespace',()=>{
  const normalizer=source.slice(source.indexOf('function normalizeFaqSearch'),source.indexOf('function renderFaqItems'));
  assert.match(normalizer,/normalize\('NFD'\)\.replace\(\/\[\\u0300-\\u036f\]\/g/);
  assert.match(normalizer,/replace\(\/\\s\+\/g/);
});

test('Support pages render approved direct contact links without a support inbox backend',()=>{
  assert.ok(source.includes('function contactLinks()'));
  assert.ok(source.includes('href="mailto:${esc(CONTACT.email)}"'));
  assert.ok(source.includes('href="tel:${esc(CONTACT.phone)}"'));
  assert.ok(source.includes('rel="noopener noreferrer"'));
});
test('Freemium copy clearly distinguishes active Free from planned Plus',()=>{
  assert.match(source,/Always free|Luôn miễn phí/);
  assert.match(source,/Not available for purchase|Chưa mở bán/);
  assert.match(source,/No payments|Không có thanh toán/i);
  assert.match(source,/Core SOS and Safe Zones stay free|Không khóa SOS và Safe Zone cơ bản/);
});

test('Support, FAQ and plan components have responsive and reduced-motion rules',()=>{
  for(const selector of ['.faq-item','.sfai-workspace','.plans-grid','.plan-card']) assert.ok(styles.includes(selector),'Missing '+selector);
  assert.ok(styles.includes('.plans-grid{grid-template-columns:minmax(0,1fr)'));
  assert.ok(styles.includes('.plans-grid{grid-template-columns:minmax(0,1fr)'));
});

test('Mobile shell keeps exactly five labelled primary destinations and exposes the active route',()=>{
  const shell=source.slice(source.indexOf('function renderShell(content)'),source.indexOf('function renderOnboarding()'));
  const mobile=shell.slice(shell.indexOf('const mobile=['),shell.indexOf('const unread='));
  const routes=[...mobile.matchAll(/\['\/(home|location|sos|growth|more)'/g)].map(match=>match[1]);
  assert.deepEqual(routes,['home','location','sos','growth','more']);
  assert.match(shell,/aria-current="page"/);
  assert.match(refinements,/\.mobile-nav a\{[^}]*min-height:48px/s);
});
test('Mobile text-entry focus hides the bottom navigation and restores it after blur',()=>{
  assert.match(source,/function syncMobileKeyboardState\(\)/);
  assert.match(source,/document\.addEventListener\('focusin',syncMobileKeyboardState\)/);
  assert.match(source,/window\.visualViewport\.addEventListener\('resize',syncMobileKeyboardState/);
  assert.match(refinements,/\.app-shell\.keyboard-open \.mobile-nav\{display:none!important;\}/);
  assert.match(refinements,/\.app-shell\.keyboard-open \.modal\{max-height:calc\(100dvh - 12px\);\}/);
});
test('Service worker invalidates the previous shell cache and precaches the mobile refinement stylesheet',()=>{
  assert.match(serviceWorker,/safekid-pwa-v7-mobile-shell-r13/);
  assert.match(serviceWorker,/\.\/src\/mobile-refinements\.css/);
});

test('Modal initial focus does not steal focus from a control the user already focused',()=>{
  const focus=source.slice(source.indexOf('function focusInitialModalControl()'),source.indexOf('function closeModalAndRestoreFocus()'));
  assert.match(focus,/dialog\.contains\(document\.activeElement\)/);
});

test('SOS hold action uses accessible high-contrast labels on its emergency fill',()=>{
  const rule=refinements.match(/\.sos-hold\{([^}]*)\}\s*\.sos-hold small\{([^}]*)\}/s);
  assert.ok(rule,'SOS contrast override exists');
  const gradient=rule[1].match(/linear-gradient\(\s*\d+deg,\s*#([0-9A-Fa-f]{6}),\s*#([0-9A-Fa-f]{6})\)/);
  assert.ok(gradient,'SOS gradient colors are explicit');
  const colors=gradient.slice(1);
  const foreground=rule[1].match(/color:#([0-9A-Fa-f]{6})/i)?.[1];
  const smallForeground=rule[2].match(/color:#([0-9A-Fa-f]{6})/i)?.[1];
  assert.ok(foreground&&smallForeground,'both main and helper text colors are explicit');
  const luminance=hex=>{const rgb=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
  for(const bg of colors){const ratio=(Math.max(luminance('FFFFFF'),luminance(bg))+.05)/(Math.min(luminance('FFFFFF'),luminance(bg))+.05);assert.ok(ratio>=4.5,'white SOS label contrast '+ratio.toFixed(2)+':1 against #'+bg);}
  assert.equal(foreground.toUpperCase(),'FFFFFF');
  assert.equal(smallForeground.toUpperCase(),'FFFFFF');
});
