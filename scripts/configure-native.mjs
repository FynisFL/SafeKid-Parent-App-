import fs from 'node:fs';
const manifest='android/app/src/main/AndroidManifest.xml';
if(fs.existsSync(manifest)){
 let xml=fs.readFileSync(manifest,'utf8');
 const permissions=['ACCESS_COARSE_LOCATION','ACCESS_FINE_LOCATION','POST_NOTIFICATIONS','VIBRATE'];
 for(const permission of permissions){
  if(!xml.includes('android.permission.'+permission))xml=xml.replace('</manifest>',`<uses-permission android:name="android.permission.${permission}" />\n</manifest>`);
 }
 fs.writeFileSync(manifest,xml);
 fs.copyFileSync('native/android/MainActivity.java','android/app/src/main/java/com/safekid/parent/test/MainActivity.java');
}
const plist='ios/App/App/Info.plist';
if(fs.existsSync(plist)){
 let text=fs.readFileSync(plist,'utf8');
 for(const key of ['NSLocationWhenInUseUsageDescription','NSLocationAlwaysAndWhenInUseUsageDescription']){
  if(!text.includes('<key>'+key+'</key>'))text=text.replace('</dict>',`<key>${key}</key><string>SafeKid uses this phone's location to show your position and evaluate your saved Safe Zones while the app is open.</string>\n</dict>`);
 }
 fs.writeFileSync(plist,text);
}
