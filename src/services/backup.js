import { STORES, exportAllRecords, importAllRecords } from '../adapters/storage.js';
const encoder=new TextEncoder(),decoder=new TextDecoder();
const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);t[n]=c>>>0;}return t;})();
function crc32(bytes){let c=0xFFFFFFFF;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function u16(v){return [v&255,(v>>>8)&255];} function u32(v){return [v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];}
function concat(parts){const n=parts.reduce((s,p)=>s+p.length,0),out=new Uint8Array(n);let o=0;for(const p of parts){out.set(p,o);o+=p.length;}return out;}
function zipStored(filename,bytes){
  const name=encoder.encode(filename),crc=crc32(bytes),date=new Date(),time=((date.getHours()<<11)|(date.getMinutes()<<5)|(date.getSeconds()>>1)),day=((date.getFullYear()-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate();
  const local=concat([new Uint8Array([0x50,0x4b,0x03,0x04]),new Uint8Array(u16(20)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(time)),new Uint8Array(u16(day)),new Uint8Array(u32(crc)),new Uint8Array(u32(bytes.length)),new Uint8Array(u32(bytes.length)),new Uint8Array(u16(name.length)),new Uint8Array(u16(0)),name,bytes]);
  const central=concat([new Uint8Array([0x50,0x4b,0x01,0x02]),new Uint8Array(u16(20)),new Uint8Array(u16(20)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(time)),new Uint8Array(u16(day)),new Uint8Array(u32(crc)),new Uint8Array(u32(bytes.length)),new Uint8Array(u32(bytes.length)),new Uint8Array(u16(name.length)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u32(0)),new Uint8Array(u32(0)),name]);
  const end=concat([new Uint8Array([0x50,0x4b,0x05,0x06]),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(1)),new Uint8Array(u16(1)),new Uint8Array(u32(central.length)),new Uint8Array(u32(local.length)),new Uint8Array(u16(0))]);
  return concat([local,central,end]);
}
function readZip(bytes){const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);if(v.getUint32(0,true)!==0x04034b50)throw new Error('Tệp không phải bản sao lưu ZIP SafeKid.');const method=v.getUint16(8,true),size=v.getUint32(18,true),nameLen=v.getUint16(26,true),extra=v.getUint16(28,true);if(method!==0)throw new Error('Định dạng nén này chưa được hỗ trợ trong bản hiện tại.');const start=30+nameLen+extra;return bytes.slice(start,start+size);}
function bytesToBase64(bytes){let s='';for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(s);}
function base64ToBytes(s){const b=atob(s),out=new Uint8Array(b.length);for(let i=0;i<b.length;i++)out[i]=b.charCodeAt(i);return out;}
async function serializableRecords(){const records=await exportAllRecords();for(const row of records.documents){if(row.blob instanceof Blob){const bytes=new Uint8Array(await row.blob.arrayBuffer());row.blobData=bytesToBase64(bytes);row.blobType=row.blob.type;delete row.blob;}}return records;}
export async function createBackup(){
  const payload={app:'SafeKid Parent App',schemaVersion:1,exportedAt:new Date().toISOString(),records:await serializableRecords(),storeNames:STORES};
  return new Blob([zipStored('backup.json',encoder.encode(JSON.stringify(payload)))],{type:'application/zip'});
}
export async function restoreBackup(file){
  if(!file||file.size>100*1024*1024)throw new Error('Tệp sao lưu vượt quá giới hạn 100 MB.');
  const bytes=new Uint8Array(await file.arrayBuffer());const jsonBytes=readZip(bytes);const data=JSON.parse(decoder.decode(jsonBytes));
  if(data.app!=='SafeKid Parent App'||data.schemaVersion!==1)throw new Error('Phiên bản hoặc nguồn tệp sao lưu không được hỗ trợ.');
  for(const row of data.records?.documents||[]){if(row.blobData){row.blob=new Blob([base64ToBytes(row.blobData)],{type:row.blobType||'application/octet-stream'});delete row.blobData;delete row.blobType;}}
  await importAllRecords(data);return data.exportedAt;
}
