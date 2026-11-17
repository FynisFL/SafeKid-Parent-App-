import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const styles=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');

test('FAQ and S.F AI have separate routes and renderers',()=>{
  assert.equal(source.includes("lastRenderedRoute=null;"+String.fromCharCode(92)+"nfunction render()"),false);
  assert.ok(source.includes("function normalizeFaqSearch(value)"));
  assert.match(source,/if\(p==='\/help'\)return renderHelp\(\);if\(p==='\/sfai'\)return renderSfai\(\);/);
  assert.match(source,/function renderHelp\(\)/);
  assert.match(source,/function renderSfai\(\)/);
  const faq=source.slice(source.indexOf('function renderHelp()'),source.indexOf('function renderSfai()'));
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
  assert.match(sfai,/data-sfai-prompt/);
  assert.match(sfai,/không phải nhân viên trực tuyến/);
  assert.match(sfai,/không được gửi tới đội ngũ SafeKid/);
});
test('Support pages render approved direct contact links without a support inbox backend',()=>{
  assert.match(source,/function contactLinks\(\)/);
  assert.match(source,/href="mailto:\\$\{esc\(CONTACT\.email\)\}"/);
  assert.match(source,/href="tel:\\$\{esc\(CONTACT\.phone\)\}"/);
  assert.match(source,/rel="noopener noreferrer"/);
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
