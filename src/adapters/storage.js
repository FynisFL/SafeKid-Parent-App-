import { completeOccurrenceOnce } from '../domain/growth.js';
const DB_NAME = 'safekid-parent-local';
const DB_VERSION = 1;
export const STORES = [
  'meta','parentProfiles','children','contacts','locationFixes','safeZones','geofenceEvents','alerts','sosEvents',
  'habits','tasks','occurrences','coinTransactions','passportDevices','maintenanceEvents','accessoryEvents','dataHandlingEvents','documents'
];

let dbPromise;
export function openDatabase() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in globalThis)) { reject(new Error('IndexedDB không được trình duyệt hỗ trợ.')); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: name === 'meta' ? 'key' : 'id' });
      }
      const occurrence = req.transaction.objectStore('occurrences');
      if (!occurrence.indexNames.contains('by_task_date')) occurrence.createIndex('by_task_date', ['taskId','dueDate'], { unique: true });
      const transaction = req.transaction.objectStore('coinTransactions');
      if (!transaction.indexNames.contains('by_occurrence')) transaction.createIndex('by_occurrence', 'taskOccurrenceId', { unique: true });
    };
    req.onsuccess = () => { const db=req.result; db.onversionchange=()=>db.close(); resolve(db); };
    req.onerror = () => reject(req.error || new Error('Không thể mở kho dữ liệu cục bộ.'));
    req.onblocked = () => reject(new Error('Kho dữ liệu đang được mở ở một cửa sổ khác.'));
  });
  return dbPromise;
}
const request = req => new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
export async function getAll(store){const db=await openDatabase();return request(db.transaction(store,'readonly').objectStore(store).getAll());}
export async function getOne(store,id){const db=await openDatabase();return request(db.transaction(store,'readonly').objectStore(store).get(id));}
export async function put(store,value){const db=await openDatabase();const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(value);await done(tx);return value;}
export async function remove(store,id){const db=await openDatabase();const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(id);await done(tx);}
export async function clearStore(store){const db=await openDatabase();const tx=db.transaction(store,'readwrite');tx.objectStore(store).clear();await done(tx);}
export function done(tx){return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Giao dịch đã bị hủy.'));});}
export async function transaction(stores, mode, callback){const db=await openDatabase();const tx=db.transaction(stores,mode);try{const result=await callback(tx);await done(tx);return result;}catch(error){try{tx.abort();}catch{} throw error;}}

export async function completeOccurrenceAtomically(occurrenceId, now = new Date()) {
  return transaction(['occurrences','coinTransactions'],'readwrite',async tx=>{
    const occurrences=tx.objectStore('occurrences');
    const coins=tx.objectStore('coinTransactions');
    const row=await request(occurrences.get(occurrenceId));
    if(!row) throw new Error('Không tìm thấy lần thực hiện nhiệm vụ.');
    const existing=await request(coins.index('by_occurrence').get(row.id));
    const plan=completeOccurrenceOnce(row,existing?[existing]:[],now);
    if(plan.occurrence!==row || plan.awarded){occurrences.put(plan.occurrence);}
    if(plan.awarded){plan.coin.id=crypto.randomUUID();plan.occurrence.rewardTransactionId=plan.coin.id;occurrences.put(plan.occurrence);coins.add(plan.coin);}
    return {awarded:plan.awarded,occurrence:plan.occurrence,coin:plan.coin};
  });
}
export async function exportAllRecords(){
  const out={}; for(const name of STORES){out[name]=await getAll(name);}
  return out;
}
export async function importAllRecords(data){
  if(!data || data.schemaVersion!==1 || !data.records || typeof data.records!=='object') throw new Error('Tệp sao lưu không đúng định dạng SafeKid.');
  for(const name of STORES){if(!Array.isArray(data.records[name])) throw new Error(`Thiếu dữ liệu ${name} trong bản sao lưu.`);}
  const db=await openDatabase();
  const tx=db.transaction(STORES,'readwrite');
  for(const name of STORES){const store=tx.objectStore(name);store.clear();for(const row of data.records[name]) store.put(row);}
  await done(tx);
}
export async function deleteAllLocalData(){
  const db=await openDatabase();const tx=db.transaction(STORES,'readwrite');for(const name of STORES)tx.objectStore(name).clear();await done(tx);
}
export async function persistStorageRequest(){try{return await navigator.storage?.persist?.() ?? false;}catch{return false;}}
