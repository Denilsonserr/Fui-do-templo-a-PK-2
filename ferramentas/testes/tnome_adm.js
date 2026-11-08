// v201: nome único (Firestore simulado) e título ADM pelo código secreto
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const now=Date.now(),DB=[{nome:'Zé',uid:'zz',andar:5,tempo:100,trof:9,char:'naruto',sem:'',ct:now},{nome:'Velho',andar:3,tempo:100,trof:2,char:'goku',ct:now}],SENT=[];
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();localStorage.tw_uid='"meu"'}});await p.route(/fonts\.g/,r=>r.abort());
await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url(),body=r.request().postData();
  if(/:runQuery/.test(u)){const Q=JSON.parse(body).structuredQuery,ff=Q.where&&Q.where.fieldFilter;const L=DB.filter(e=>!ff||e[ff.field.fieldPath]===ff.value.stringValue).map(e=>({document:{createTime:new Date(e.ct).toISOString(),fields:Object.fromEntries(Object.entries(e).filter(([k])=>k!=='ct').map(([k,v])=>[k,typeof v==='number'?{integerValue:''+v}:{stringValue:v}]))}}));return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L)})}
  const F=JSON.parse(body).fields,e={ct:Date.now()};for(const k in F)e[k]=F[k].stringValue!=null?F[k].stringValue:+F[k].integerValue;DB.push(e);SENT.push(e);return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mTorre');await p.waitForTimeout(500);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(1200);
const tryN=async n=>{await p.fill('#twName0',n);await p.click('#twNmOk');await p.waitForTimeout(700);return await p.evaluate(()=>(document.getElementById('twNameE')||{}).textContent||'(fechou) nome='+localStorage.tw_nome)};
await p.click('#twNameB');await p.waitForTimeout(300);
console.log('zé ->',await tryN('zé'));console.log('Velho ->',await tryN('Velho'));console.log('adm# ->',await tryN('adm#furia2026'));await p.screenshot({path:'/tmp/nm_adm.png'});
console.log('Denilson ->',await tryN('Denilson'));console.log('SENT',JSON.stringify(SENT));
await p.click('#twTitB');await p.waitForTimeout(800);await p.screenshot({path:'/tmp/tit_adm.png'});
await p.evaluate(()=>{const M=document.getElementById('twModal');M.hidden=true;M.innerHTML=''});await p.waitForTimeout(300);await p.screenshot({path:'/tmp/painel_adm.png'});
console.log('ERROS',JSON.stringify(errs));await b.close()})();
