import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const styles=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');

test('FAQ and S.F AI have separate routes and renderers',()=>{
  assert.match(source,/if\(p==='\/help'\)return renderHelp\(\);if\(p==='\/sfai'\)return renderSfai\(\);/);
  assert.match(source,/function renderHelp\(\)/);
  assert.match(source,/function renderSfai\(\)/);
  const faq=source.slice(source.indexOf('function renderHelp()'),source.indexOf('function renderSfai()'));
  assert.doesNotMatch(faq,/sfai-form|sfai-messages/);
  assert.match(faq,/faq-items/);
  const sfai=source.slice(source.indexOf('function renderSfai()'),source.indexOf('function answerSfai('));
  assert.match(sfai,/sfai-form/);
  assert.doesNotMatch(sfai,/faq-items/);
});

test('More hub exposes FAQ and S.F AI as independent destinations',()=>{
  assert.match(source,/\['\/help','faqHub','book'\],\['\/sfai','sfai','sparkles'\]/);
});

test('Freemium copy clearly distinguishes active Free from planned Plus',()=>{
  assert.match(source,/Always free|Luôn miễn phí/);
  assert.match(source,/Not available for purchase|Chưa mở bán/);
  assert.match(source,/no payments|Không có thanh toán/);
  assert.match(source,/Core SOS and Safe Zones stay free|Không khóa SOS và Safe Zone cơ bản/);
});

test('Support, FAQ and plan components have responsive and reduced-motion rules',()=>{
  for(const selector of ['.faq-item','.sfai-workspace','.plans-grid','.plan-card']) assert.ok(styles.includes(selector),'Missing '+selector);
  assert.match(styles,/@media\(max-width:767px\)[\s\S]*\.plans-grid\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(styles,/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.faq-item/);
});
