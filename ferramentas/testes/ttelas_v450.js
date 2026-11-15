// v450: varredura das telas do Ranqueado (abre cada tela e cada aba) juntando erros
const {chromium}=require('playwright');const U='http://localhost:8790/index.html';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];let cur='';
p.on('pageerror',e=>E.push(cur+' PAGE '+e.message+' @'+String(e.stack||'').split('\n')[1]));
p.on('request',r=>{if(/documentId=er_/.test(r.url())){try{const f=JSON.parse(r.postData()).fields;E.push(cur+' REP['+f.w.stringValue+'] '+f.m.stringValue+' @'+f.st.stringValue.split('\n').slice(1,3).join(' ').slice(0,220))}catch(e){}}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","shaka","sung","yuta","naruto"]',rk_sel:'"shaka"',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(1500);
const V=['menu','pf','lib','lvl','ps','mn','gacha','shop','bp','ev','rb','rkg','sb','hs','cns','skp','sx','yb','yrb','p3al','p3bt','p3co','boss','ca','pvp'];
for(const v of V){cur=v;await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
  try{await p.evaluate(v=>__pvT.rv(v),v)}catch(e){E.push(v+' ABRIR '+e.message.split('\n')[0])}await p.waitForTimeout(900);
  /* aperta os botões de aba/filtro da tela (não os que gastam ou começam luta) */
  const n=await p.evaluate(()=>{const W=document.getElementById('rkWrap');if(!W)return 0;const B=[...W.querySelectorAll('[data-a]')].filter(x=>/tab|aba|f[A-Z]|filt|pg|tp|sel|ver|info|det|sort|ord/i.test(x.dataset.a)&&!/go|buy|comp|luta|start|fight|pull|gir|del|ven|apag/i.test(x.dataset.a));let k=0;for(const x of B.slice(0,25)){try{x.click();k++}catch(e){}}return k});
  await p.waitForTimeout(500);await p.screenshot({path:'/tmp/tela_'+v+'.png'});console.log(v,'ok, botões',n)}
console.log('ERROS',JSON.stringify([...new Set(E)],null,1));await b.close()})();
