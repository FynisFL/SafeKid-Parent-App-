import fs from 'node:fs';
import path from 'node:path';

function configureAndroidLauncherIcon(manifestXml) {
 const resources = 'android/app/src/main/res';
 const writeResource = (folder, file, content) => {
  const directory = path.join(resources, folder);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, file), content);
 };
 const image = fs.readFileSync('assets/brand/app-icon-512.png');
 writeResource('drawable-nodpi', 'safekid_launcher_bitmap.png', image);
 writeResource('drawable', 'safekid_launcher.xml', `<?xml version="1.0" encoding="utf-8"?>
<bitmap xmlns:android="http://schemas.android.com/apk/res/android" android:src="@drawable/safekid_launcher_bitmap" />
`);
 writeResource('drawable-v26', 'safekid_launcher.xml', `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/safekid_launcher_background" />
    <foreground>
        <inset android:drawable="@drawable/safekid_launcher_bitmap" android:inset="10%" />
    </foreground>
</adaptive-icon>
`);
 writeResource('values', 'safekid_launcher.xml', `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="safekid_launcher_background">#010101</color>
</resources>
`);
 return manifestXml.replace(/android:(icon|roundIcon)="[^"]*"/g, 'android:$1="@drawable/safekid_launcher"');
}

const manifest='android/app/src/main/AndroidManifest.xml';
if(fs.existsSync(manifest)){
 let xml=fs.readFileSync(manifest,'utf8');
 const permissions=['ACCESS_COARSE_LOCATION','ACCESS_FINE_LOCATION','POST_NOTIFICATIONS','VIBRATE'];
 for(const permission of permissions){
  if(!xml.includes('android.permission.'+permission))xml=xml.replace('</manifest>',`<uses-permission android:name="android.permission.${permission}" />\n</manifest>`);
 }
 fs.writeFileSync(manifest,configureAndroidLauncherIcon(xml));
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
