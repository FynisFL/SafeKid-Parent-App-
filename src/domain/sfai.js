import { SFAI_COPY } from '../data/content.js';
function normalize(text){return String(text||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
export function routeSfaiQuestion(question,locale,content){
 const q=normalize(question);
 const copy=content?.responses?.[locale]||SFAI_COPY[locale];
 if(/\b(sos|kh[a]?n cap|cap cuu|tai nan|nguy hiem|emergency|ambulance|fire|police|help me|help now)\b/.test(q))return {role:'assistant',text:copy.emergency,kind:'emergency'};
 if(/(khieu nai|complaint|loi|hong|broken|bug|bao hanh cua toi|my warranty|tai khoan|account|quyen rieng tu|privacy|thanh toan|payment|hoan tien|refund|gap nhan vien|nhan vien|human|specialist|support agent|du lieu gia dinh|my family data)/.test(q))return {role:'assistant',text:copy.outOfScope+'\n\n'+copy.demo,kind:'scope'};
 const entries=[...(content?.[locale]?.faq||[]),...(content?.[locale]?.brand||[])];
 const tokens=q.match(/[a-z0-9]{3,}/g)||[];let best=null,bestScore=0;
 for(const entry of entries){const hay=normalize(entry.question+' '+entry.answer);const hit=tokens.filter(token=>hay.includes(token)).length;const score=hit/Math.max(3,Math.min(tokens.length,8));if(score>bestScore){bestScore=score;best=entry;}}
 if(best&&bestScore>=0.25&&tokens.length>=2)return {role:'assistant',text:best.answer,source:best.question};
 return {role:'assistant',text:copy.unknown};
}
