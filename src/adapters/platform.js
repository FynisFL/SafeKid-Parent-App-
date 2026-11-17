import { DEFAULT_MAP_STYLE_URL } from '../config/map.js';
export const Clock = { now: () => new Date(), iso: () => new Date().toISOString() };

export const LocationAdapter = {
  async permissionState() {
    if (!('geolocation' in navigator)) return 'unsupported';
    try { const p=await navigator.permissions?.query({name:'geolocation'});return p?.state||'unknown'; }
    catch { return 'unknown'; }
  },
  async getCurrentPosition(options={}) {
    if (!('geolocation' in navigator)) throw Object.assign(new Error('Trình duyệt không hỗ trợ định vị.'),{code:'unsupported'});
    return new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(pos=>resolve({
      id:crypto.randomUUID(),latitude:pos.coords.latitude,longitude:pos.coords.longitude,accuracyMeters:pos.coords.accuracy,
      altitudeMeters:pos.coords.altitude,speedMetersPerSecond:pos.coords.speed,headingDegrees:pos.coords.heading,
      capturedAt:new Date(pos.timestamp).toISOString(),source:'parent_phone_web'
    }),err=>reject(Object.assign(new Error(locationError(err.code)),{code:err.code})),{enableHighAccuracy:true,timeout:options.timeout||15000,maximumAge:options.maximumAge||0}));
  },
  watchPosition(onFix,onError) {
    if (!('geolocation' in navigator)) {onError(new Error('Trình duyệt không hỗ trợ định vị.'));return ()=>{};}
    const id=navigator.geolocation.watchPosition(pos=>onFix({id:crypto.randomUUID(),latitude:pos.coords.latitude,longitude:pos.coords.longitude,accuracyMeters:pos.coords.accuracy,altitudeMeters:pos.coords.altitude,speedMetersPerSecond:pos.coords.speed,headingDegrees:pos.coords.heading,capturedAt:new Date(pos.timestamp).toISOString(),source:'parent_phone_web'}),err=>onError(Object.assign(new Error(locationError(err.code)),{code:err.code})),{enableHighAccuracy:true,maximumAge:10000,timeout:20000});
    return ()=>navigator.geolocation.clearWatch(id);
  },
  async requestPermission(level='when-in-use') {if(level==='always')return {state:'unsupported',message:'Vị trí nền có trong phiên bản ứng dụng di động.'};try{const fix=await this.getCurrentPosition();return {state:'granted',fix};}catch(e){return {state:e.code===1?'denied':e.code==='unsupported'?'unsupported':'restricted',message:e.message};}}
};
function locationError(code){return ({1:'Bạn đã từ chối quyền vị trí. Có thể thay đổi trong cài đặt trình duyệt.',2:'Không thể xác định vị trí. Hãy kiểm tra dịch vụ vị trí và thử lại.',3:'Yêu cầu vị trí đã hết thời gian chờ.'})[code]||'Không thể lấy vị trí hiện tại.';}

export const NotificationAdapter = {
  supported: () => 'Notification' in window,
  permission: () => ('Notification' in window ? Notification.permission : 'unsupported'),
  async requestPermission(){if(!('Notification' in window))return 'unsupported';return Notification.requestPermission();},
  async notify(title,body,tag='safekid-local') {if(!('Notification' in window))return 'unsupported';if(Notification.permission!=='granted')return 'permission_denied';try{new Notification(title,{body,tag,renotify:false});return 'reported';}catch{return 'failed';}}
};
export const HapticsAdapter = { async impact(){try{if(navigator.vibrate)navigator.vibrate([80,40,80]);return Boolean(navigator.vibrate);}catch{return false;}} };
let sosAudioContext=null;
let sosAlarmTimer=null;
let sosAlarmPlaying=false;
const sosAudioNodes=new Set();

function getSosAudioContext(){
  const Ctx=globalThis.window?.AudioContext||globalThis.window?.webkitAudioContext;
  if(!Ctx)return null;
  if(!sosAudioContext||sosAudioContext.state==='closed')sosAudioContext=new Ctx();
  return sosAudioContext;
}
function playSosBellBurst(ctx){
  if(!ctx||ctx.state!=='running')return false;
  const start=ctx.currentTime;
  // Two clear, warm bell notes with a short gap; repeated while an SOS is active.
  for(const note of [{offset:0,frequency:880},{offset:.24,frequency:1174.66}]){
    const at=start+note.offset;
    const fundamental=ctx.createOscillator();
    const overtone=ctx.createOscillator();
    const fundamentalGain=ctx.createGain();
    const overtoneGain=ctx.createGain();
    fundamental.type='sine';fundamental.frequency.setValueAtTime(note.frequency,at);
    overtone.type='sine';overtone.frequency.setValueAtTime(note.frequency*2.01,at);
    fundamentalGain.gain.setValueAtTime(.0001,at);
    fundamentalGain.gain.exponentialRampToValueAtTime(.16,at+.018);
    fundamentalGain.gain.exponentialRampToValueAtTime(.0001,at+.62);
    overtoneGain.gain.setValueAtTime(.0001,at);
    overtoneGain.gain.exponentialRampToValueAtTime(.045,at+.014);
    overtoneGain.gain.exponentialRampToValueAtTime(.0001,at+.34);
    fundamental.connect(fundamentalGain);fundamentalGain.connect(ctx.destination);
    overtone.connect(overtoneGain);overtoneGain.connect(ctx.destination);
    const nodes=[fundamental,overtone,fundamentalGain,overtoneGain];
    nodes.forEach(node=>sosAudioNodes.add(node));
    const cleanup=()=>nodes.forEach(node=>{sosAudioNodes.delete(node);try{node.disconnect();}catch{}});
    fundamental.onended=cleanup;
    overtone.onended=()=>{try{overtone.disconnect();}catch{}sosAudioNodes.delete(overtone);sosAudioNodes.delete(overtoneGain);};
    fundamental.start(at);overtone.start(at);
    fundamental.stop(at+.66);overtone.stop(at+.38);
  }
  return true;
}
export const AudioAdapter = {
  // Call directly from pointerdown/click so mobile browsers unlock audio during user activation.
  async prepare(){
    try{
      const ctx=getSosAudioContext();if(!ctx)return false;
      if(ctx.state!=='running')await ctx.resume();
      return ctx.state==='running';
    }catch{return false;}
  },
  async startSosAlarm(){
    if(sosAlarmPlaying)return true;
    const ready=await this.prepare();if(!ready)return false;
    const ctx=getSosAudioContext();if(!ctx)return false;
    sosAlarmPlaying=true;
    playSosBellBurst(ctx);
    sosAlarmTimer=setInterval(()=>{
      if(!sosAlarmPlaying||ctx.state!=='running')return;
      playSosBellBurst(ctx);
    },2100);
    return true;
  },
  stopSosAlarm(){
    sosAlarmPlaying=false;
    if(sosAlarmTimer){clearInterval(sosAlarmTimer);sosAlarmTimer=null;}
    const ctx=sosAudioContext;
    if(ctx?.state==='running'){
      const now=ctx.currentTime;
      for(const node of [...sosAudioNodes]){
        if(typeof node.stop==='function'){
          try{node.stop(now+.06);}catch{}
        }
        if(node.gain){
          try{node.gain.cancelScheduledValues(now);node.gain.setValueAtTime(.0001,now);}catch{}
        }
      }
    }
    return true;
  },
  isSosAlarmPlaying(){return sosAlarmPlaying;},
  async alert(enabled=true){
    if(!enabled)return false;
    const ready=await this.prepare();if(!ready)return false;
    return playSosBellBurst(getSosAudioContext());
  }
};
export const FilesAdapter = { download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);} };
export const GeofenceAdapter = {
  mode:'web_foreground',
  capabilities(){return {foreground:true,background:false,mode:'web_foreground',notice:'Theo dõi vùng an toàn chỉ chạy khi ứng dụng đang mở.'};},
  NativeBackground:{mode:'native_background',implemented:false,capabilities(){return {foreground:false,background:false,mode:'unavailable',notice:'Chưa build trong bản web này. Có trong phiên bản ứng dụng di động.'};}}
};
export const MapAdapter = {styleUrl(){const metaUrl=document.querySelector('meta[name="safekid-map-style"]')?.content?.trim();const runtimeUrl=window.SAFEKID_MAP_STYLE_URL?.trim();return runtimeUrl||metaUrl||DEFAULT_MAP_STYLE_URL;}};
