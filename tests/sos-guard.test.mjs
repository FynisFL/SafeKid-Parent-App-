import test from 'node:test';
import assert from 'node:assert/strict';
import { canActivateSos, findOpenSosEvent } from '../src/domain/sos.js';

test('SOS can start when there is no open event',()=>{
  assert.equal(canActivateSos([]),true);
  assert.equal(findOpenSosEvent([]),null);
});
test('active SOS blocks duplicate activation',()=>{
  const events=[{id:'a',status:'active'}];
  assert.equal(canActivateSos(events),false);
  assert.equal(findOpenSosEvent(events).id,'a');
});
test('acknowledged SOS remains open until resolved',()=>{
  const events=[{id:'a',status:'acknowledged'}];
  assert.equal(canActivateSos(events),false);
  assert.equal(findOpenSosEvent(events).status,'acknowledged');
});
test('resolved SOS allows another activation',()=>{
  assert.equal(canActivateSos([{id:'a',status:'resolved'}]),true);
});
