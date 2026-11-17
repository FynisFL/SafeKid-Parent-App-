export const GEOFENCE_DEFAULTS = Object.freeze({
  maxFixAgeSeconds:120,maxAccuracyMeters:50,enterConfirmFixes:2,exitConfirmFixes:2,
  exitHysteresisMeters:25,dwellMinutes:5,cooldownMinutesPerZone:10,defaultRadiusMeters:500
});
const rad = deg => deg * Math.PI / 180;
export function haversineMeters(lat1,lon1,lat2,lon2){
  const R=6371000,dLat=rad(lat2-lat1),dLon=rad(lon2-lon1);
  const a=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
export function classifyFix(fix, now=Date.now(), defaults=GEOFENCE_DEFAULTS){
  const age=(now-new Date(fix.capturedAt).getTime())/1000;
  if(!Number.isFinite(age)||age>defaults.maxFixAgeSeconds||age< -30)return 'stale_fix';
  if(fix.accuracyMeters==null || fix.accuracyMeters>defaults.maxAccuracyMeters)return 'poor_accuracy';
  if(!Number.isFinite(fix.latitude)||!Number.isFinite(fix.longitude)||Math.abs(fix.latitude)>90||Math.abs(fix.longitude)>180)return 'invalid_fix';
  return 'valid';
}
export function isScheduleActive(schedule, date=new Date()){
  if(!schedule)return true;
  const hhmm=date.toTimeString().slice(0,5),start=schedule.startTime||'00:00',end=schedule.endTime||'23:59';
  const overnight=end<start;
  const weekdayOf = d => d.getDay()===0?7:d.getDay();
  const previousDay = new Date(date); previousDay.setDate(previousDay.getDate()-1);
  const scheduleDay = overnight && hhmm<=end ? weekdayOf(previousDay) : weekdayOf(date);
  if(schedule.weekdays?.length && !schedule.weekdays.includes(scheduleDay))return false;
  if(!schedule.startTime&&!schedule.endTime)return true;
  return overnight ? (hhmm>=start||hhmm<=end) : (hhmm>=start&&hhmm<=end);
}
export function evaluateZone(zone, fix, state={}, now=new Date(), defaults=GEOFENCE_DEFAULTS){
  const validity=classifyFix(fix,now.getTime(),defaults);
  if(validity!=='valid')return {state:state.state||'unknown',ignored:validity,events:[],next:{...state}};
  if(!zone.enabled || !isScheduleActive(zone.schedule,now))return {state:state.state||'unknown',ignored:zone.enabled?'schedule_inactive':'zone_paused',events:[],next:{...state}};
  const distance=haversineMeters(fix.latitude,fix.longitude,zone.centerLatitude,zone.centerLongitude);
  let current=state.state||'unknown';let pending=state.pending||null;let count=state.count||0;let enteredAt=state.enteredAt||null;const events=[];
  if(current==='unknown')current=distance<=zone.radiusMeters?'outside':'outside';
  if(current==='outside'||current==='pending_enter'){
    if(distance<=zone.radiusMeters){count=pending==='enter'?count+1:1;pending='enter';current='pending_enter';if(count>=defaults.enterConfirmFixes){current='inside';pending=null;count=0;enteredAt=now.toISOString();state.dwellFired=false;events.push({transition:'enter',confidence:fix.accuracyMeters<=20?'high':'medium'});}}
    else {current='outside';pending=null;count=0;}
  }else if(current==='inside'||current==='pending_exit'||current==='dwell'){
    if(distance>zone.radiusMeters+defaults.exitHysteresisMeters){count=pending==='exit'?count+1:1;pending='exit';current='pending_exit';if(count>=defaults.exitConfirmFixes){current='outside';pending=null;count=0;enteredAt=null;state.dwellFired=false;events.push({transition:'exit',confidence:fix.accuracyMeters<=20?'high':'medium'});}}
    else {if(current==='pending_exit')current=state.dwellFired?'dwell':'inside';pending=null;count=0;}
    if((current==='inside'||current==='dwell')&&enteredAt&&!state.dwellFired&&(now-new Date(enteredAt))/60000>=defaults.dwellMinutes){current='dwell';events.push({transition:'dwell',confidence:'medium'});}
  }
  return {state:current,distanceMeters:Math.round(distance),ignored:null,events,next:{state:current,pending,count,enteredAt,dwellFired:events.some(e=>e.transition==='exit')?false:(state.dwellFired||events.some(e=>e.transition==='dwell'))}};
}
export function shouldEmitEvent(zoneId,transition,history,now=new Date(),defaults=GEOFENCE_DEFAULTS){
  const cutoff=now.getTime()-defaults.cooldownMinutesPerZone*60000;
  return !history.some(e=>e.safeZoneId===zoneId&&e.transition===transition&&new Date(e.occurredAt).getTime()>cutoff);
}
