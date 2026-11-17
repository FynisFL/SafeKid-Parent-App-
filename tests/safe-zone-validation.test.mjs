import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSafeZoneDraft } from '../src/domain/safe-zone.js';

test('Safe Zone refuses empty coordinates instead of coercing them to Null Island', () => {
  assert.throws(() => validateSafeZoneDraft({ latitude: '', longitude: '', radiusMeters: 200 }), /Select a location/);
  assert.throws(() => validateSafeZoneDraft({ latitude: null, longitude: null, radiusMeters: 200 }), /Select a location/);
});
test('Safe Zone accepts a real selected map point and valid radius', () => {
  assert.deepEqual(validateSafeZoneDraft({ latitude: '10.77', longitude: '106.69', radiusMeters: '250' }), { latitude: 10.77, longitude: 106.69, radiusMeters: 250 });
});
test('Safe Zone rejects out-of-range coordinates and invalid radius', () => {
  assert.throws(() => validateSafeZoneDraft({ latitude: '91', longitude: '106', radiusMeters: 200 }), /coordinate range/);
  assert.throws(() => validateSafeZoneDraft({ latitude: '10', longitude: '181', radiusMeters: 200 }), /coordinate range/);
  assert.throws(() => validateSafeZoneDraft({ latitude: '10', longitude: '106', radiusMeters: 20 }), /50 and 5,000/);
});
test('Safe Zone requires both schedule endpoints or neither', () => {
  assert.throws(() => validateSafeZoneDraft({ latitude: '10', longitude: '106', radiusMeters: 200, startTime: '07:00' }), /both a start and end/);
});
