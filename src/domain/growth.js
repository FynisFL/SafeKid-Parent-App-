export function localDateString(date=new Date()){
  const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');return `${y}-${m}-${d}`;
}
export function addLocalDays(dateString,days){const [y,m,d]=dateString.split('-').map(Number);const date=new Date(y,m-1,d);date.setDate(date.getDate()+days);return localDateString(date);}
export function isoWeekday(dateString){const [y,m,d]=dateString.split('-').map(Number);const n=new Date(y,m-1,d).getDay();return n===0?7:n;}
export function isTaskDue(task,dateString){
  if(dateString<task.startDate || (task.endDate&&dateString>task.endDate))return false;
  if(task.repeat==='once')return dateString===task.startDate;
  if(task.repeat==='daily')return true;
  if(task.repeat==='weekdays')return isoWeekday(dateString)<=5;
  if(task.repeat==='weekly')return Boolean(task.weekdays?.includes(isoWeekday(dateString)));
  return false;
}
export function createOccurrences(tasks,existing,fromDate=localDateString(),days=15,now=new Date()){
  const keyed=new Set(existing.map(x=>`${x.taskId}|${x.dueDate}`));const created=[];
  for(const task of tasks){if(task.archived)continue;for(let i=0;i<days;i++){const date=addLocalDays(fromDate,i),key=`${task.id}|${date}`;if(isTaskDue(task,date)&&!keyed.has(key)){created.push({id:crypto.randomUUID(),taskId:task.id,dueDate:date,status:'pending',rewardCoins:task.rewardCoins,rewardTransactionId:null,createdAt:now.toISOString(),updatedAt:now.toISOString()});keyed.add(key);}}}
  return created;
}
export function isOverdue(occurrence,today=localDateString()){return occurrence.status==='pending'&&occurrence.dueDate<today;}
export function balanceFromTransactions(transactions){return transactions.reduce((sum,t)=>sum+(Number(t.amount)||0),0);}

export function completeOccurrenceOnce(occurrence,transactions,now=new Date()){
  if(!occurrence)throw new Error('Missing task occurrence');
  if(occurrence.status==='completed'||occurrence.rewardTransactionId)return {awarded:false,occurrence};
  const existing=transactions.find(t=>t.taskOccurrenceId===occurrence.id);
  const updated={...occurrence,status:'completed',completedAt:occurrence.completedAt||now.toISOString(),rewardTransactionId:existing?.id||undefined,completionOrigin:'parent_marked',updatedAt:now.toISOString()};
  if(existing)return {awarded:false,occurrence:updated};
  const coin={id:'test-or-generated-id',taskOccurrenceId:occurrence.id,type:'earned',amount:occurrence.rewardCoins,reason:'Task completed',createdAt:now.toISOString()};
  updated.rewardTransactionId=coin.id;
  return {awarded:true,occurrence:updated,coin};
}
