import { build } from 'esbuild';
import fs from 'node:fs';
import './build.mjs';
await build({entryPoints:['native/entry.js'],outfile:'dist/native.js',bundle:true,format:'esm',target:'es2022',external:['../src/main.js']});
const p='dist/index.html';
fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('./src/main.js','./native.js'));
