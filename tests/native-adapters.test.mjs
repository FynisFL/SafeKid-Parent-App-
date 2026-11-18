import test from 'node:test';
import assert from 'node:assert/strict';
import { LocationAdapter, NotificationAdapter, FilesAdapter, HapticsAdapter } from '../src/adapters/platform.js';

test('native adapters request GPS permissions, normalize fixes and use native notification/file APIs',async()=>{
 const calls=[];
 globalThis.SafeKidNative={
  Geolocation:{
   async checkPermissions(){return {location:'prompt',coarseLocation:'prompt'};},
   async requestPermissions(){calls.push('permission');return {location:'granted'};},
   async getCurrentPosition(){return {coords:{latitude:10,longitude:106,accuracy:12},timestamp:1000};},
  },
  notificationPermission:'denied',
  async requestNotifications(){return 'granted';},
  async notify(){calls.push('notification');return 'reported';},
  async download(blob,name){calls.push(name);},
  Haptics:{async vibrate(){calls.push('haptics');}},
 };
 try{
  const fix=await LocationAdapter.getCurrentPosition();
  assert.equal(fix.source,'parent_phone_native');
  assert.equal(fix.accuracyMeters,12);
  assert.equal(fix.latitude,10);
  assert.equal(NotificationAdapter.permission(),'denied');
  assert.equal(await NotificationAdapter.requestPermission(),'granted');
  assert.equal(await NotificationAdapter.notify('Test','Test'),'reported');
  assert.equal(await HapticsAdapter.impact(),true);
  await FilesAdapter.download(new Blob(['test']),'test.zip');
  assert.deepEqual(calls,['permission','notification','haptics','test.zip']);
  globalThis.SafeKidNative.Geolocation.requestPermissions=async()=>({location:'denied',coarseLocation:'denied'});
  await assert.rejects(()=>LocationAdapter.getCurrentPosition(),error=>error.code===1);
  globalThis.SafeKidNative.notify=async()=>{throw Error('disabled');};
  assert.equal(await NotificationAdapter.notify('Test','Test'),'failed');
 }finally{delete globalThis.SafeKidNative;}
});
