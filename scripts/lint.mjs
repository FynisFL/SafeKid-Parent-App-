import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'); let files=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(/\.(js|mjs)$/.test(p))files.push(p);}}
walk(path.join(root,'src')); walk(path.join(root,'scripts')); walk(path.join(root,'tests'));
const forbidden=[[/console\.(log|debug)\([^\n]*(?:latitude|longitude|phone|displayName|child)/i,'Potential personal data in console output']];
let issues=[]; for(const f of files){const s=fs.readFileSync(f,'utf8');for(const [re,msg] of forbidden){if(re.test(s))issues.push(`${path.relative(root,f)}: ${msg}`);}}
if(issues.length){console.error(issues.join('\n'));process.exit(1);} console.log(`Privacy lint passed for ${files.length} JavaScript files.`);
