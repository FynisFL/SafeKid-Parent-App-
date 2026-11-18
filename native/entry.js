import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics } from '@capacitor/haptics';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { App } from '@capacitor/app';

if(Capacitor.isNativePlatform()){
 let notificationPermission='prompt';
 let queue=Promise.resolve();
 const refresh=async()=>{
  try{notificationPermission=(await LocalNotifications.checkPermissions()).display;}catch{notificationPermission='unavailable';}
 };
 await refresh();
 try{if(Capacitor.getPlatform()==='android'){
  await LocalNotifications.createChannel({id:'safekid-alerts',name:'SafeKid alerts',importance:4,visibility:1,vibration:true});
  await LocalNotifications.createChannel({id:'safekid-sos',name:'SafeKid SOS',importance:5,visibility:1,vibration:true});
 }
 }catch{notificationPermission='unavailable';}
 const syncReminders=async rows=>{
  if(notificationPermission!=='granted')return;
  const pending=await LocalNotifications.getPending();
  const old=pending.notifications.filter(n=>n.id>=10000).map(n=>({id:n.id}));
  if(old.length)await LocalNotifications.cancel({notifications:old});
  const next=rows.filter(n=>new Date(n.at)>new Date()).sort((a,b)=>new Date(a.at)-new Date(b.at)).slice(0,64);
  if(next.length)await LocalNotifications.schedule({notifications:next.map((n,i)=>({
   id:10000+i,title:n.title,body:n.body,channelId:'safekid-alerts',
   schedule:{at:new Date(n.at)},extra:{route:'/growth',occurrenceId:n.id},
  }))});
 };
 globalThis.SafeKidNative={
  Geolocation,Haptics,
  get notificationPermission(){return notificationPermission;},
  async requestNotifications(){const result=await LocalNotifications.requestPermissions();notificationPermission=result.display;return result.display;},
  refresh,
  async notify(title,body,tag){
   if(notificationPermission!=='granted')return 'permission_denied';
   const sos=tag==='safekid-sos';
   await LocalNotifications.schedule({notifications:[{id:sos?1001:1002,title,body,
    channelId:sos?'safekid-sos':'safekid-alerts',ongoing:sos,autoCancel:!sos,
    extra:{route:sos?'/sos':'/alerts'}}]});
   return 'reported';
  },
  async clearSos(){
   await LocalNotifications.cancel({notifications:[{id:1001}]});
   await LocalNotifications.removeDeliveredNotifications({notifications:[{id:1001}]});
  },
  syncReminders(rows){queue=queue.catch(()=>{}).then(()=>syncReminders(rows));return queue;},
  async download(blob,name){
   const bytes=new Uint8Array(await blob.arrayBuffer());
   let text='';
   for(let i=0;i<bytes.length;i+=32768)text+=String.fromCharCode(...bytes.subarray(i,i+32768));
   const result=await Filesystem.writeFile({path:name,data:btoa(text),directory:Directory.Cache});
   await Share.share({title:name,url:result.uri});
  },
 };
 await App.addListener('appStateChange',async({isActive})=>{
  if(isActive){await refresh();window.dispatchEvent(new Event('safekid-native-resume'));}
 });
 await LocalNotifications.addListener('localNotificationActionPerformed',event=>{
  const route=event.notification.extra?.route;
  if(['/sos','/alerts','/growth'].includes(route))location.hash=route;
 });
 document.documentElement.classList.add('native-app');
}
await import('../src/main.js');
