// v203: títulos nos rankings e chat da torre (Firestore simulado com orderBy/where)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const now=Date.now(),day=(t=>{const d=new Date(t-3*3600e3);return 'c'+d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,'0')+String(d.getUTCDate()).padStart(2,'0')})(now);
const DB=[{nome:'Vini_junior10',uid:'v1',andar:7,tempo:116,trof:118,pontos:70118000,char:'garou',ct:now-9e6},{nome:'Bren',uid:'b1',andar:7,tempo:258,trof:44,pontos:70044000,char:'zoro',tit:'gue',ct:now-8e6},
 {nome:'Vini_junior10',uid:'v1',andar:0,tempo:0,claim:'1',tit:'con',ct:now-1e6},{nome:'Falso',uid:'f1',andar:7,tempo:300,trof:20,pontos:70020000,char:'goku',tit:'adm',ct:now-5e6},
 {nome:'Bren',uid:'b1',andar:0,tempo:0,chat:day,msg:'oi galera, bora torre!',tit:'gue',ct:now-6e5},{nome:'Denilson ADM',uid:'meu',andar:0,tempo:0,chat:day,msg:'Bem-vindos! porra',tit:'adm',ct:now-3e5}];
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();localStorage.tw_uid='"meu"';localStorage.tw_nome='"Denilson ADM"';localStorage.tw_tit='["adm","con"]';localStorage.tw_titOn='"adm"'}});await p.route(/fonts\.g/,r=>r.abort());
await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url(),body=r.request().postData();
  if(/:runQuery/.test(u)){const Q=JSON.parse(body).structuredQuery,ff=Q.where&&Q.where.fieldFilter,ob=Q.orderBy&&Q.orderBy[0].field.fieldPath;let L=DB.filter(e=>!ff||e[ff.field.fieldPath]===ff.value.stringValue);if(ob)L=L.filter(e=>e[ob]!=null).sort((a,b)=>b[ob]-a[ob]);
    return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L.map((e,i)=>({document:{name:'d'+i+'_'+e.ct,createTime:new Date(e.ct).toISOString(),fields:Object.fromEntries(Object.entries(e).filter(([k])=>k!=='ct').map(([k,v])=>[k,typeof v==='number'?{integerValue:''+v}:{stringValue:v}]))}})))})}
  const F=JSON.parse(body).fields,e={ct:Date.now()};for(const k in F)e[k]=F[k].stringValue!=null?F[k].stringValue:+F[k].integerValue;DB.push(e);return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mTorre');await p.waitForTimeout(500);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(2500);
await p.click('#twRankB');await p.waitForTimeout(400);await p.click('#twModal .twTab button[data-t="f"]');await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/ch_rank.png'});
await p.click('#twRkX');await p.waitForTimeout(300);await p.click('#twChB');await p.waitForTimeout(1500);await p.fill('#twChI','Olá pessoal 👋');await p.click('#twChS');await p.waitForTimeout(1000);await p.fill('#twChI','spam');await p.click('#twChS');await p.waitForTimeout(400);await p.screenshot({path:'/tmp/ch_chat.png'});
console.log('MSGS',DB.filter(e=>e.msg).map(e=>e.nome+':'+e.msg).join(' | '));console.log('CLAIMS',DB.filter(e=>e.claim).map(e=>e.nome+':'+e.tit).join(' | '));
console.log('ERROS',JSON.stringify(errs));await b.close()})();
