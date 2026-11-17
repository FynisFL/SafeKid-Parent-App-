/** An acknowledged alert remains open until it is explicitly resolved. */
export function findOpenSosEvent(events=[]){
  return events.find(event=>event.status==='active'||event.status==='acknowledged')||null;
}
export function canActivateSos(events=[]){
  return findOpenSosEvent(events)===null;
}
