// v498: leilão do Mercado Negro — lances (💎 presos), cobrir lance devolve, fim entrega item ao vencedor e soma ao ADM. Firestore simulado na memória.
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
const DB=[];
async function setup(p){await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\/v1\//,async r=>{const u=r.request().url(),m=r.request().method();
  if(m==='POST'&&/documentId=lei_/.test(u)){const f=JSON.parse(r.request().postData()).fields;DB.push({fields:f,createTime:new Date().toISOString(),name:'x/'+u.match(/documentId=([^&]+)/)[1]});return r.fulfill({status:200,body:'{}'})}
  if(m==='POST'&&/:runQuery/.test(u)){const q=JSON.parse(r.request().postData()).structuredQuery;const ff=q.where&&q.where.fieldFilter;const L=ff&&ff.field.fieldPath==='lei'?DB:[];return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L.map(d=>({document:d})))})}
  return r.fulfill({status:200,contentType:'application/json',body:'[]'})})}
async function mk(b,nome,adm,t){const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));await setup(p);await p.clock.install({time:t});
  await p.addInitScript(([n,a])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:JSON.stringify(n),tw_tit:a?'["adm"]':'[]',rk_ini:'1',rk_xpv2:'1',rk_gem:'100000',tw_uid:JSON.stringify(n.replace(/\W/g,'')+'uid')})}},[nome,adm]);
  await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1200);p.E=E;return p}
const gem=p=>p.evaluate(()=>+localStorage.getItem('rk_gem'));
(async()=>{const b=await chromium.launch();const T=Date.UTC(2026,10,16,21,55);
  const A=await mk(b,'Ana',0,T),B=await mk(b,'Beto',0,T);
  await A.evaluate(()=>__pvT.leiBid('gs',10000));const a1=await gem(A);
  await B.evaluate(()=>__pvT.leiBid('gs',12000));await B.evaluate(()=>__pvT.leiBid('v2skbot',20000));const b1=await gem(B);
  await A.evaluate(()=>__pvT.leiSet());const a2=await gem(A);
  await A.evaluate(()=>__pvT.rkO('mn'));await A.waitForTimeout(1500);await A.evaluate(()=>document.querySelector('.leiBtn').click());await A.waitForTimeout(1500);await A.screenshot({path:SH+'leilao.png'});
  await A.clock.setFixedTime(Date.UTC(2026,10,16,22,21));await B.clock.setFixedTime(Date.UTC(2026,10,16,22,21));
  await B.evaluate(()=>__pvT.leiSet());await B.waitForTimeout(500);const bInv=await B.evaluate(()=>({an:JSON.parse(localStorage.getItem('rk_an')||'[]').map(r=>[r.c,r.g,r.l]),v2:JSON.parse(localStorage.getItem('tw_inv')||'[]').filter(x=>x.v2).map(x=>x.nm),gem:+localStorage.getItem('rk_gem')}));
  const D=await mk(b,'Denilson ADM',1,Date.UTC(2026,10,16,22,21));await D.evaluate(()=>__pvT.leiSet());await D.waitForTimeout(800);const adm=await gem(D);
  console.log(JSON.stringify({ana:{depoisDoLance:a1,depoisDeCoberta:a2},beto:{depoisDosLances:b1,fim:bInv},admGemas:adm,lances:DB.length}),[...A.E,...B.E,...D.E].slice(0,3));await b.close()})();
