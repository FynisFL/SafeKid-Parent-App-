import { SFAI_COPY } from '../data/content.js';
function normalize(text){return String(text||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');}
export function routeSfaiQuestion(question,locale,content){
 const q=normalize(question);
 const copy=content?.responses?.[locale]||SFAI_COPY[locale];
 const vi=locale==='vi';
 const targets=[
  [/vung an toan|safe zone/,'/safe-zones',vi?'Vùng an toàn':'Safe Zones'],
  [/vi tri|ban do|location|map/,'/location',vi?'Vị trí':'Location'],
  [/sos/,'/sos','SOS'],
  [/thoi quen|phat trien|nhiem vu|growth|habit|task/,'/growth',vi?'Phát triển':'Growth'],
  [/lich|calendar/,'/growth/calendar',vi?'Lịch':'Calendar'],
  [/thong bao|canh bao|alert/,'/alerts',vi?'Cảnh báo':'Alerts'],
  [/lien he|contact/,'/contacts',vi?'Liên hệ':'Contacts'],
  [/cai dat|ho so|setting|profile/,'/profile',vi?'Hồ sơ & cài đặt':'Profile & settings'],
  [/thiet bi|watch|device/,'/watch-passport',vi?'Thiết bị':'Devices'],
  [/trang chu|home/,'/home',vi?'Trang chủ':'Home'],
 ];
 if(/^(?:hay |vui long |please )?(?:mo|xem|di toi|di den|den|chuyen(?: sang)?|truy cap|go to|open|navigate to|take me to|show(?: me)?)\s/.test(q)){
  const target=targets.find(([pattern])=>pattern.test(q));
  if(target)return {role:'assistant',kind:'navigation',text:vi?'Bạn có thể mở mục này bằng nút bên dưới.':'Open this section using the button below.',actions:[{route:target[1],label:target[2]}]};
 }
 if(/^(?:(?:xin )?chao|hello|hi|hey|good morning|good evening)(?:[ !,.]*(?:ban|bro|safekid|sf ai|s\.f ai))?[ !,.?]*$/.test(q.trim())){
  return {role:'assistant',kind:'greeting',text:vi?'Chào bạn! Mình có thể hướng dẫn dùng SafeKid, trả lời FAQ và giúp bạn mở các chức năng. Bạn cần hỗ trợ mục nào?':'Hello! I can explain SafeKid, answer FAQs and help you open app sections. What would you like help with?'};
 }

 if(/\b(sos|kh[a]?n cap|cap cuu|tai nan|nguy hiem|emergency|ambulance|fire|police|help me|help now)\b/.test(q))return {role:'assistant',text:copy.emergency,kind:'emergency'};
 if(/(khieu nai|complaint|loi|hong|broken|bug|bao hanh cua toi|my warranty|tai khoan|account|quyen rieng tu|privacy|thanh toan|payment|hoan tien|refund|gap nhan vien|nhan vien|human|specialist|support agent|du lieu gia dinh|my family data)/.test(q))return {role:'assistant',text:copy.outOfScope+'\n\n'+copy.demo,kind:'scope'};
 const entries=[...(content?.[locale]?.faq||[]),...(content?.[locale]?.brand||[])];
 const tokens=q.match(/[a-z0-9]{3,}/g)||[];let best=null,bestScore=0;
 for(const entry of entries){const hay=normalize(entry.question+' '+entry.answer);const hit=tokens.filter(token=>hay.includes(token)).length;const score=hit>=2?hit/Math.max(3,tokens.length):0;if(score>bestScore){bestScore=score;best=entry;}}
 if(best&&bestScore>=0.5&&tokens.length>=2)return {role:'assistant',text:best.answer,source:best.question};
 return {role:'assistant',kind:'scope',text:copy.unknown+'\n\n'+copy.demo};
}
