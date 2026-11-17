import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMapTilerForwardUrl, buildMapTilerReverseUrl, mapTilerForwardGeocode, mapTilerReverseGeocode } from '../src/services/geocoding.js';

const style='https://api.maptiler.com/maps/streets-v4-pastel/style.json?key=TEST_KEY';
test('forward geocoding builds a Vietnamese MapTiler search URL with optional phone proximity',()=>{
  const url=new URL(buildMapTilerForwardUrl('Trường Tiểu học A',style,{longitude:106.7,latitude:10.8},'vi'));
  assert.equal(url.hostname,'api.maptiler.com');
  assert.ok(url.pathname.endsWith('/geocoding/Tr%C6%B0%E1%BB%9Dng%20Ti%E1%BB%83u%20h%E1%BB%8Dc%20A.json'));
  assert.equal(url.searchParams.get('key'),'TEST_KEY');
  assert.equal(url.searchParams.get('language'),'vi');
  assert.equal(url.searchParams.get('country'),'vn');
  assert.equal(url.searchParams.get('proximity'),'106.7,10.8');
});
test('forward geocoding rejects too-short, too-long and missing-key searches',()=>{
  assert.throws(()=>buildMapTilerForwardUrl('a',style));
  assert.throws(()=>buildMapTilerForwardUrl('x'.repeat(121),style));
  assert.throws(()=>buildMapTilerForwardUrl('school','https://example.test/style.json'));
});
test('reverse geocoding validates coordinates and prefers selected language',()=>{
  const url=new URL(buildMapTilerReverseUrl(106.7,10.8,style,'vi'));
  assert.ok(url.pathname.endsWith('/geocoding/106.7,10.8.json'));
  assert.equal(url.searchParams.get('language'),'vi');
  assert.equal(url.searchParams.get('limit'),'1');
  assert.throws(()=>buildMapTilerReverseUrl(181,10,style));
});
test('forward geocoder surfaces provider failure without inventing place data',async()=>{
  const fake=async()=>({ok:false,status:403});
  await assert.rejects(()=>mapTilerForwardGeocode('school',style,null,'vi',fake),/rejected the API key or domain/);
});
test('forward and reverse geocoders return the provider feature collection',async()=>{
  const payload={features:[{place_name:'Trường mẫu',geometry:{coordinates:[106.7,10.8]}}]};
  const fake=async()=>({ok:true,json:async()=>payload});
  assert.deepEqual(await mapTilerForwardGeocode('school',style,null,'vi',fake),payload);
  assert.deepEqual(await mapTilerReverseGeocode(106.7,10.8,style,'vi',fake),payload);
});
