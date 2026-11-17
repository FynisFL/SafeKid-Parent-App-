import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
function walk(dir){ for(const e of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,e.name); if(e.isDirectory()) walk(p); else if(p.endsWith('.js')||p.endsWith('.mjs')) files.push(p); }}
walk(path.join(root,'src')); walk(path.join(root,'scripts')); walk(path.join(root,'tests'));
let failed=0;
for(const file of files){ const r = await import('node:child_process').then(({spawnSync})=>spawnSync(process.execPath,['--check',file],{encoding:'utf8'})); if(r.status!==0){failed++;console.error(path.relative(root,file),r.stderr);} }
if(failed){console.error(`${failed} syntax check(s) failed`);process.exit(1);} console.log(`${files.length} JavaScript files passed syntax checks (runtime type contracts are documented; no TypeScript compiler is part of this dependency-free build).`);
