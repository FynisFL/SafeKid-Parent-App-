import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MapAdapter } from '../src/adapters/platform.js';
import { DEFAULT_MAP_STYLE_URL } from '../src/config/map.js';

const css=fs.readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../src/adapters/platform.js',import.meta.url),'utf8');
const envExample=fs.readFileSync(new URL('../.env.example',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const mapConfig=fs.readFileSync(new URL('../src/config/map.js',import.meta.url),'utf8');
const geofence=fs.readFileSync(new URL('../src/domain/geofence.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const gitignore=fs.readFileSync(new URL('../.gitignore',import.meta.url),'utf8');

test('responsive layout defines phone, compact tablet, desktop and wide-screen ranges',()=>{
  for(const fragment of ['@media(max-width:767px)','@media(max-width:374px)','@media(max-width:1023px)','@media(max-width:1200px)','@media(min-width:1536px)']) assert.ok(css.includes(fragment),`missing ${fragment}`);
  assert.match(css,/html\{min-width:320px/);
  assert.match(css,/\.page-wrap\{[^}]*overflow-x:clip/s);
});

test('mobile navigation and coarse pointer controls retain usable touch dimensions',()=>{
  assert.match(css,/\.mobile-nav a\{[^}]*min-height:52px/s);
  assert.match(css,/@media\(pointer:coarse\)\{[^}]*min-height:44px/s);
  assert.match(css,/\.mobile-nav a\{[^}]*font-size:10px/s);
});

test('reduced-motion mode disables continuous mascot and map marker animations',()=>{
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/\.phone-location-marker:before\{animation:none!important/);
  assert.match(css,/\.route-stage:has\(\.sos-panel\),\.sos-panel,\.sos-hold\{animation:none!important/);
});

test('SOS route and activation control do not inherit entrance, pulse or hover motion',()=>{
  assert.match(css,/\.route-stage:has\(\.sos-panel\),\.sos-panel,\.sos-hold\{animation:none!important;transition:none!important;transform:none!important/);
  assert.match(css,/\.sos-hold:active\{transform:none!important/);
});

test('MapTiler uses the supplied pastel vector style JSON through MapLibre, not an iframe or raster tile URL',()=>{
  assert.match(envExample,/YOUR_MAPTILER_KEY/);
  assert.match(app,/maplibre-gl@5\.24\.0\/dist\/maplibre-gl\.js/);
  assert.doesNotMatch(app,/<iframe|\/\{z\}\/\{x\}\/\{y\}\.png/);
  assert.match(adapter,/safekid-map-style/);
  assert.match(adapter,/DEFAULT_MAP_STYLE_URL/);
  assert.match(app,/serviceWorker\.register\('\.\/sw\.js',\{updateViaCache:'none'\}\)/);
  assert.match(mapConfig,/https:\/\/api\.maptiler\.com\/maps\/streets-v4-pastel\/style\.json\?key=/);
  assert.match(build,/readMapStyleOverride\(root\)\s*\|\|\s*DEFAULT_MAP_STYLE_URL/);
  assert.match(gitignore,/^\.env$/m);
});

test('map renders even before permission; no live marker is drawn without a real phone fix',()=>{
  assert.match(app,/S\.route==='\/location'&&MapAdapter\.styleUrl\(\)\)initMap\(\)/);
  assert.match(app,/hasFix=Boolean\(S\.fix\),center=hasFix\?/);
  assert.match(app,/if\(S\.fix\)updateMapFix\(S\.fix\)/);
  assert.match(app,/Regional map view · no phone location yet/);
});

test('map shows parent phone accuracy and Safe Zone circles with explicit attribution',()=>{
  assert.match(app,/geoJsonForAccuracy/);
  assert.match(app,/geoJsonForZones/);
  assert.match(app,/phone-accuracy-fill/);
  assert.match(app,/safe-zones-fill/);
  assert.match(app,/https:\/\/www\.maptiler\.com\/copyright\//);
  assert.match(app,/https:\/\/www\.openstreetmap\.org\/copyright/);
});

test('watch updates the map marker and live accuracy without recreating the map on every GPS fix',()=>{
  assert.match(app,/updateMapFix\(fix\)/);
  assert.match(app,/location-accuracy/);
  assert.match(app,/S\.mapMarker\.setLngLat/);
});

test('PWA cache version is incremented after map and responsive UI changes',()=>{
  assert.match(sw,/safekid-pwa-v7-mobile-shell-r23/);
  assert.match(sw,/src\/config\/map\.js/);
});

test('privacy copy discloses that GPS-centered map tile requests may reveal the viewed area in both languages',()=>{
  assert.match(app,/privacyMap:'Khi được cấu hình,[^']*MapTiler[^']*khu vực bản đồ đang xem/);
  assert.match(app,/privacyMap:'When configured,[^']*MapTiler[^']*map area being viewed/);
});

test('supporting-copy token meets WCAG AA normal-text contrast on light family surfaces',()=>{
  const match=css.match(/--sk-muted:#([0-9A-Fa-f]{6})/g)?.at(-1);
  assert.ok(match,'final muted token exists');
  const fg=match.slice(match.indexOf('#')+1);
  const rgb=[0,2,4].map(i=>parseInt(fg.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  const lum=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
  for(const bgHex of ['FFFFFF','F2F8FF','EAF4F5']){
    const bg=[0,2,4].map(i=>parseInt(bgHex.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
    const bgLum=bg[0]*.2126+bg[1]*.7152+bg[2]*.0722;
    const ratio=(Math.max(lum,bgLum)+.05)/(Math.min(lum,bgLum)+.05);
    assert.ok(ratio>=4.5,`${bgHex} contrast ${ratio.toFixed(2)} is below 4.5:1`);
  }
});


test('MapAdapter always resolves a style URL with runtime/meta overrides before the bundled default',()=>{
  const previousDocument=globalThis.document;
  const previousWindow=globalThis.window;
  try{
    globalThis.window={};
    globalThis.document={querySelector:()=>({content:''})};
    assert.equal(MapAdapter.styleUrl(),DEFAULT_MAP_STYLE_URL,'static hosting without .env still gets the supplied map style');
    globalThis.document={querySelector:()=>({content:'https://example.test/style.json'})};
    assert.equal(MapAdapter.styleUrl(),'https://example.test/style.json','build-injected meta can override the default');
    globalThis.window={SAFEKID_MAP_STYLE_URL:'https://runtime.test/style.json'};
    assert.equal(MapAdapter.styleUrl(),'https://runtime.test/style.json','runtime config has highest priority');
  } finally {
    if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;
    if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
  }
});


test('Location map is strictly view-only; all Safe Zone create/manage operations are limited to the dedicated route',()=>{
  const location=app.match(/function renderLocation\(\)([\s\S]*?)function renderZones\(/)?.[1]||'';
  assert.ok(location,'Location route renderer exists');
  assert.match(location,/map-readonly-note/);
  assert.match(location,/Bản đồ chỉ hiển thị|View-only map/);
  assert.match(location,/route-zones/);
  for(const action of ['modal-zone','zone-edit:','zone-toggle:','zone-delete:']) assert.doesNotMatch(location,new RegExp(action.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(app,/async function createZone\(form\)\{if\(S\.route!=='\/safe-zones'\)/);
  assert.match(app,/if\(action==='modal-zone'\)\{if\(S\.route!=='\/safe-zones'\)/);
  assert.match(app,/if\(action\.startsWith\('zone-edit:'\)\)\{if\(S\.route!=='\/safe-zones'\)/);
  assert.match(app,/if\(action\.startsWith\('zone-toggle:'\)\)\{if\(S\.route!=='\/safe-zones'\)/);
  assert.match(app,/if\(action\.startsWith\('zone-delete:'\)\)\{if\(S\.route!=='\/safe-zones'\)/);
});

test('SOS hold prepares audio inside the user gesture and starts the alarm before asynchronous persistence',()=>{
  assert.match(app,/pointerdown',e=>\{const b=e\.target\.closest\('#sos-hold'\);if\(!b\)return;holdFired=false;void AudioAdapter\.prepare\(\)/);
  const trigger=app.match(/async function triggerSOS\(\)\{([\s\S]*?)\n\}/)?.[1]||'';
  assert.match(trigger,/const alarmPromise=S\.prefs\.sound\?AudioAdapter\.startSosAlarm\(\)/);
  assert.ok(trigger.indexOf('AudioAdapter.startSosAlarm()')<trigger.indexOf('await put('),'alarm should start before IndexedDB awaits');
  assert.match(app,/sos-trigger'\)void AudioAdapter\.prepare\(\)/);
});

test('SOS repeating alarm can be manually muted and automatically stops when acknowledged or resolved',()=>{
  assert.match(adapter,/startSosAlarm\(\)/);
  assert.match(adapter,/setInterval\(\(\)=>\{/);
  assert.match(adapter,/stopSosAlarm\(\)/);
  assert.match(app,/sos-sound:\$\{active\.id\}/);
  assert.match(app,/async function toggleSosAlarm\(id\)/);
  assert.match(app,/AudioAdapter\.stopSosAlarm\(\);item\.alarmMuted=true;item\.soundAlertStatus=value==='resolved'/);
});

test('mobile redesign defines a floating safe-area navigation, readable controls, compact phone and reduced-motion modes',()=>{
  assert.match(css,/@media\(max-width:767px\)\{[\s\S]*?\.mobile-nav\{display:flex;position:fixed/);
  assert.match(css,/@media\(max-width:767px\)\{[\s\S]*?\.form-stack input,\.form-stack select,\.form-stack textarea\{[^}]*font-size:16px/s);
  assert.match(css,/@media\(max-width:767px\)\{[\s\S]*?\.modal-backdrop\{align-items:flex-end/s);
  assert.match(css,/@media\(max-width:767px\)\{[\s\S]*?\.sos-hold\{[^}]*touch-action:none/s);
  assert.match(css,/@media\(max-width:374px\)\{[\s\S]*?\.mobile-nav a>span:last-child\{[^}]*font-size:8\.5px/s);
  assert.match(css,/@media\(min-width:768px\) and \(max-width:1023px\)/);
  assert.match(css,/sk-mobile-route-in/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/\.route-stage:has\(\.sos-panel\)\{animation:none!important/);
});


test('first-run onboarding is rendered outside the app shell and prioritises the profile form', () => {
  const source = app;
  assert.match(source, /if\(firstRun\)\{\s*root\.innerHTML=renderOnboarding\(\)/);
  assert.match(source, /const firstRun=!S\.profile\|\|S\.route==='\/onboarding'/);
  assert.match(source, /id="onboarding-form"[\s\S]*?name="parentName"[\s\S]*?name="childName"[\s\S]*?type="submit"/);
  assert.doesNotMatch(source.slice(source.indexOf('function renderOnboarding'), source.indexOf('function renderPage')), /mobile-nav|topbar|notification-shortcut/);
});

test('Location Map is explicitly view-only and does not expose create/manage controls', () => {
  const source = app;
  const section = source.slice(source.indexOf('function renderLocation'), source.indexOf('function renderZones'));
  assert.match(section, /Bản đồ chỉ hiển thị/);
  assert.match(section, /href="#\/safe-zones"/);
  assert.doesNotMatch(section, /modal-zone|zone-edit:|zone-delete:/);
});

test('Safe Zone Builder hides raw coordinate entry and uses place search plus a map picker', () => {
  const source = app;
  const modal = source.slice(source.indexOf("if(type==='zone'||type==='zone-edit')"), source.indexOf("if(type==='contact')"));
  assert.match(modal, /id="zone-place-search"/);
  assert.match(modal, /id="zone-builder-map"/);
  assert.match(modal, /data-action="zone-use-phone-location"/);
  assert.doesNotMatch(modal, /<label>[^<]*(?:Latitude|Longitude|Vĩ độ|Kinh độ)/i);
});

test('Settings shortcut buttons scroll within the page without changing the hash router', () => {
  const source = app;
  const profile = source.slice(source.indexOf('function renderProfile'), source.indexOf('function renderPermissions'));
  assert.match(profile, /data-scroll-target="settings-notifications"/);
  assert.doesNotMatch(profile, /href="#settings-/);
  assert.match(source, /section\.open=true;section\.scrollIntoView/);
});

test('Mobile quick actions and Settings Hub use icons present in the shared icon registry', () => {
  const source = app;
  for (const name of ['grid','database','chevronDown']) assert.match(source, new RegExp(`${name}:`));
});

test('profile setup route cannot be revisited as a fake login screen after a profile exists', () => {
  assert.match(app, /const next=!S\.profile\?'\/onboarding':path==='\/'\|\|path==='\/onboarding'\?'\/home':path/);
});
test('SOS activation uses a synchronous pending lock and acknowledged SOS remains manageable', () => {
  assert.match(app, /if\(S\.sosActivationPending\)/);
  assert.match(app, /S\.sosActivationPending=true/);
  assert.match(app, /finally\{S\.sosActivationPending=false;\}/);
  assert.match(app, /\['active','acknowledged'\]\.includes\(x\.status\)/);
});

test('modal dialogs move focus inside, trap keyboard Tab and support Escape with focus restoration',()=>{
  assert.match(app,/function focusInitialModalControl\(\)[\s\S]*?target\?\.focus\(\{preventScroll:true\}\)/);
  assert.match(app,/if\(S\.modal&&e\.key==='Escape'\)[\s\S]*?handleAction\('modal-close'\)/);
  assert.match(app,/if\(S\.modal&&e\.key==='Tab'\)[\s\S]*?first\.focus\(\)/);
  assert.match(app,/function closeModalAndRestoreFocus\(\)[\s\S]*?openerAction=modalReturnFocus[\s\S]*?node\.dataset\.action===openerAction[\s\S]*?target\?\.focus\(\{preventScroll:true\}\)/);
  assert.match(app,/aria-modal="true" aria-labelledby="modal-title"/);
});

test('new Safe Zones use the binding Master Spec default radius of 500 metres',()=>{
  assert.match(geofence,/defaultRadiusMeters:500/);
  assert.match(app,/S\.zoneDraft=\{radiusMeters:GEOFENCE_DEFAULTS\.defaultRadiusMeters/);
  assert.match(app,/editingZone\?\.radiusMeters\?\?GEOFENCE_DEFAULTS\.defaultRadiusMeters/);
  assert.doesNotMatch(app,/latest\.radiusMeters\|\|200/);
});

test('navigation exposes the current route to assistive technology',()=>{
  assert.match(app,/aria-current="page"/);
  assert.match(app,/isMoreActive/);
});
