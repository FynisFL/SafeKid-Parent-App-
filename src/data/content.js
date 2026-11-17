function parseEntries(markdown){
  const lines=String(markdown||'').replace(/\r/g,'').split('\n');
  const entries=[];let category='General';let current=null;
  const flush=()=>{if(!current)return;const answer=current.answer.join('\n').trim();if(current.question&&answer)entries.push({question:current.question,answer,category:current.category});current=null;};
  for(const line of lines){
    const heading=line.match(/^##\s+(.+?)\s*$/);
    if(heading){flush();category=heading[1].trim();continue;}
    const question=line.match(/^\*\*(.+\?)\*\*\s*$/);
    if(question){flush();current={question:question[1].trim(),category,answer:[]};continue;}
    if(current)current.answer.push(line);
  }
  flush();return entries;
}
export function parseSfaiResponses(markdown){
  const text=String(markdown||'').replace(/\r/g,'');
  const section=(heading)=>{
    const start=text.indexOf(heading);if(start<0)return '';
    const from=start+heading.length,next=text.indexOf('\n## ',from);
    return text.slice(from,next<0?text.length:next);
  };
  const quotes=(block,locale)=>block.split('\n').map(rawLine=>{
    const line=rawLine.trim();
    const prefix=`- ${locale}: `;
    if(!line.startsWith(prefix))return null;
    const match=line.slice(prefix.length).match(/^\"(.*)\"$/);
    return match?.[1]??null;
  }).filter(value=>value!==null);
  const greeting=section('## Chào mừng / Greeting');
  const emergency=section('## Khẩn cấp / Emergency');
  const scope=section('## Ngoài phạm vi hoặc phức tạp / Out of scope → chuyển CSKH (bản demo)');
  const unknown=section('## Không có thông tin / No answer found');
  const result={};
  for(const locale of ['vi','en']){
    const scopeQuotes=quotes(scope,locale);
    result[locale]={greeting:quotes(greeting,locale)[0]||'',emergency:quotes(emergency,locale)[0]||'',outOfScope:scopeQuotes[0]||'',demo:scopeQuotes[1]||'',unknown:quotes(unknown,locale)[0]||''};
  }
  if(['vi','en'].some(locale=>Object.values(result[locale]).some(value=>!value)))throw new Error('S.F AI approved response copy is incomplete.');
  return result;
}
export async function loadApprovedContent(){
  const lang=async locale=>{
    const [faq,brand]=await Promise.all([fetch(`./content/faq.${locale}.md`).then(r=>r.text()),fetch(`./content/brand.${locale}.md`).then(r=>r.text())]);
    return {faq:parseEntries(faq),brand:parseEntries(brand)};
  };
  const [vi,en,responsesText]=await Promise.all([
    lang('vi'),lang('en'),fetch('./content/sfai-responses.md').then(r=>r.text())
  ]);
  return {vi,en,responses:parseSfaiResponses(responsesText)};
}
export const CONTACT = {email:'safekid.digibabi@gmail.com',phone:'0377430400',fanpage:'https://www.facebook.com/DigiBabi'};
export const SFAI_COPY = {
  vi:{greeting:'Xin chào, mình là S.F AI. Mình có thể trả lời các câu hỏi về SafeKid và các câu hỏi thường gặp.',emergency:'S.F AI không dùng để xử lý tình huống khẩn cấp. Trong trường hợp khẩn cấp, hãy gọi 113 (Công an), 114 (Cứu hỏa) hoặc 115 (Cấp cứu). Bạn cũng có thể mở màn hình SOS hoặc liên hệ người thân trên điện thoại này.',outOfScope:'Nhận diện câu hỏi nằm ngoài phạm vi hỗ trợ của S.F AI. Yêu cầu này sẽ được chuyển sang bộ phận chuyên viên CSKH.',demo:'Bản demo — chưa kết nối hệ thống CSKH. Yêu cầu chưa được gửi đi.',unknown:'Chưa có thông tin cho câu hỏi này. Vui lòng liên hệ hỗ trợ theo các kênh bên dưới.'},
  en:{greeting:"Hi, I'm S.F AI. I can answer questions about SafeKid and the frequently asked questions.",emergency:'S.F AI cannot be used for emergencies. In an emergency, call 113 (Police), 114 (Fire) or 115 (Ambulance). You can also open the SOS screen or contact a family member from this phone.',outOfScope:"This question is outside S.F AI's scope. It would be passed on to our customer support specialists.",demo:'Demo — not connected to the customer support system. This request has not been sent.',unknown:'There is no information for this question yet. Please contact support using the channels below.'}
};
