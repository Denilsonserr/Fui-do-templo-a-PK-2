// v415: escolher a forma do personagem na aba PERSONAGEM (biblioteca) e ela aparecer em todo lugar
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const I=['skcap','skarm','skluv','skbot','skros'].map((k,i)=>({id:'v'+i,nm:k+' V2',v2:1,skb:k,t:['cap','arm','anel','bot','esp'][i],r:'sec'}));
  Object.assign(localStorage,{tw_nome:'"E"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',rk_ped:'"shaka"',tw_inv:JSON.stringify(I),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(800);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="lib"]');b&&b.click()});await p.waitForTimeout(1200);
const btn=await p.$('[data-pff="2"][data-id="shaka"]');console.log('botões',!!btn);if(btn){await btn.click();await p.waitForTimeout(1200)}
await p.screenshot({path:SH+'lib_forma.png'});
const r=await p.evaluate(()=>({lib:(document.querySelector('.lbPd img')||{}).src||'',pedf:localStorage.rk_pedf}));
await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="back"]');b&&b.click()});await p.waitForTimeout(600);await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="perfil"]');b&&b.click()});await p.waitForTimeout(1200);
r.perfil=await p.evaluate(()=>((document.querySelector('.p3Ch img')||{}).src||'').slice(-30));r.botoesPerfil=await p.evaluate(()=>document.querySelectorAll('.p3Ch~.pfFm button,[data-pff]').length);
await p.screenshot({path:SH+'perfil_forma.png'});await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="back"]');b&&b.click()});await p.waitForTimeout(600);await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="lib"]');b&&b.click()});await p.waitForTimeout(800);await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="lbAn"],#rkWrap [data-t="an"]');b&&b.click()});await p.waitForTimeout(1000);await p.screenshot({path:SH+'aneis_forma.png'});console.log(JSON.stringify({...r,lib:r.lib.slice(-30)}),errs);await b.close()})();
