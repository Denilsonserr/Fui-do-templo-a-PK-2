// v204: recorde "Denilson_DW adm" aparece como "Denilson ADM"; sorte do ADM nas cartas e baús
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const now=Date.now(),DB=[{nome:'Vini_junior10',uid:'v1',andar:7,tempo:116,trof:118,pontos:70118000,char:'garou',v:200,ct:now-9e6},{nome:'Denilson_DW adm',andar:7,tempo:193,trof:70,pontos:70070000,char:'garou',v:200,ct:now-8e6},
 {nome:'Denilson ADM',uid:'meu',andar:7,tempo:211,trof:64,pontos:70064000,char:'garou',tit:'adm',v:200,ct:now-1e6},{nome:'ZEUS',andar:7,tempo:202,trof:43,pontos:70043000,char:'luffy',v:200,ct:now-5e6}];
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();localStorage.tw_uid='"meu"';localStorage.tw_nome='"Denilson ADM"';localStorage.tw_tit='["adm"]';localStorage.tw_titOn='"adm"';localStorage.tw_ts203='1'}});await p.route(/fonts\.g/,r=>r.abort());
await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url(),body=r.request().postData();
  if(/:runQuery/.test(u)){const Q=JSON.parse(body).structuredQuery,ff=Q.where&&Q.where.fieldFilter,ob=Q.orderBy&&Q.orderBy[0].field.fieldPath;let L=DB.filter(e=>!ff||e[ff.field.fieldPath]===ff.value.stringValue);if(ob)L=L.filter(e=>e[ob]!=null).sort((a,b)=>b[ob]-a[ob]);
    return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L.map((e,i)=>({document:{name:'d'+i,createTime:new Date(e.ct).toISOString(),fields:Object.fromEntries(Object.entries(e).filter(([k])=>k!=='ct').map(([k,v])=>[k,typeof v==='number'?{integerValue:''+v}:{stringValue:v}]))}})))})}
  return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mTorre');await p.waitForTimeout(500);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(1500);
await p.click('#twRankB');await p.waitForTimeout(400);await p.click('#twModal .twTab button[data-t="t"]');await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/al_rank.png'});
console.log('LINHAS',await p.evaluate(()=>[...document.querySelectorAll('#twRkL .rw')].map(r=>r.querySelector('.nm').childNodes[0].textContent+' '+r.querySelector('.tm').textContent).join(' | ')));
console.log('ERROS',JSON.stringify(errs));await b.close()})();
