// v413: perfil — escolher NORMAL / TRANSFORMAÇÃO / 2ª TRANSFORMAÇÃO do personagem do pedestal
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const I=['skcap','skarm','skluv','skbot','skros'].map((k,i)=>({id:'v'+i,nm:k+' V2',v2:1,skb:k,t:['cap','arm','anel','bot','esp'][i],r:'sec'}));
  Object.assign(localStorage,{tw_nome:'"E"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',rk_ped:'"shaka"',tw_inv:JSON.stringify(I),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(800);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
await p.evaluate(()=>{document.querySelector('#rkWrap [data-a="perfil"]').click()});await p.waitForTimeout(1500);
const out=[];for(const k of [0,1,2]){const b2=await p.$(`[data-pff="${k}"]`);if(!b2){out.push(k+':sem botão');continue}await b2.click();await p.waitForTimeout(1200);out.push(k+':'+await p.evaluate(()=>document.querySelector('.p3Ch img,.pfPed img').getAttribute('src').slice(0,22)));await p.screenshot({path:SH+'pfforma'+k+'.png'})}
console.log(out.join(' | '),'pf salvo',await p.evaluate(()=>localStorage.rk_pedf),errs);await b.close()})();
