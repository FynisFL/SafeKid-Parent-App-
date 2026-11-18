import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { routeSfaiQuestion } from '../src/domain/sfai.js';
import { SFAI_COPY, parseSfaiResponses } from '../src/data/content.js';
const approvedResponses=parseSfaiResponses(readFileSync(new URL('../content/sfai-responses.md',import.meta.url),'utf8'));
const content={vi:{faq:[{question:'Dữ liệu lưu ở đâu?',answer:'Dữ liệu lưu trên thiết bị.'}],brand:[]},en:{faq:[{question:'Where is my data stored?',answer:'Data stays on this device.'}],brand:[]},responses:approvedResponses};
test('emergency request is blocked and routed to SOS copy',()=>{const r=routeSfaiQuestion('Tôi cần SOS khẩn cấp','vi',content);assert.equal(r.kind,'emergency');assert.equal(r.text,SFAI_COPY.vi.emergency);});
test('out-of-scope request shows the required demo disclosure',()=>{const r=routeSfaiQuestion('Tôi muốn khiếu nại','vi',content);assert.equal(r.kind,'scope');assert.ok(r.text.includes(SFAI_COPY.vi.demo));assert.ok(r.text.includes('chưa được gửi đi'));});
test('FAQ answer is quoted from approved source only',()=>{const r=routeSfaiQuestion('Dữ liệu lưu ở đâu','vi',content);assert.equal(r.text,'Dữ liệu lưu trên thiết bị.');assert.equal(r.source,'Dữ liệu lưu ở đâu?');});
test('unknown query returns approved no-answer response',()=>{const r=routeSfaiQuestion('Thời tiết hôm nay thế nào','vi',content);assert.ok(r.text.startsWith(SFAI_COPY.vi.unknown));assert.equal(r.kind,'scope');});
test('English emergency and unknown routing use English copy',()=>{assert.equal(routeSfaiQuestion('emergency SOS','en',content).text,SFAI_COPY.en.emergency);assert.equal(routeSfaiQuestion('random gardening question','en',content).kind,'scope');});

test('S.F AI response copy is parsed from the approved response markdown',()=>{assert.deepEqual(approvedResponses.vi,SFAI_COPY.vi);assert.deepEqual(approvedResponses.en,SFAI_COPY.en);});

test('basic greeting and explicit navigation stay inside supported local actions',()=>{
 assert.equal(routeSfaiQuestion('Xin chào bro!','vi',content).kind,'greeting');
 const r=routeSfaiQuestion('Mở vùng an toàn','vi',content);
 assert.equal(r.kind,'navigation');
 assert.equal(r.actions[0].route,'/safe-zones');
 assert.equal(routeSfaiQuestion('Open settings','en',content).actions[0].route,'/profile');
 assert.equal(routeSfaiQuestion('Viết bài về vũ trụ','vi',content).kind,'scope');
});
