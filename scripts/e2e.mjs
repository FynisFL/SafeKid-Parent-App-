import { spawnSync } from 'node:child_process';
const python=process.platform==='win32'?'python':'python3';
const result=spawnSync(python,['scripts/e2e.py'],{stdio:'inherit'});
process.exit(result.status??1);
