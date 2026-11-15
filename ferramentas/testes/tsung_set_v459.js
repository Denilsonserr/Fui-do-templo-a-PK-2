// v459: gacha do Sung dá peça do Monarca (pity 200) — e o resto como v458
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.clock.install({time:Date.UTC(2026,10,15,12,5)});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Fulano"',rk_ini:'1',rk_xpv2:'1',rk_gem:'5000',rk_ban:'mit',rk_pitySJI:'199',rk_own:'["goku","sung"]',rk_dl:JSON.stringify({d:'2026-11-15',s:0})})}});
await p.goto('http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
await p.evaluate(()=>__pvT.rkO('gacha'));await p.waitForTimeout(1200);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
await p.evaluate(()=>document.querySelector('.rkA [data-a="sum1"]').click());await p.waitForTimeout(1200);
const v1=await p.evaluate(()=>{const v=document.querySelector('.sjFx video');return v?{src:v.src.split('/').pop(),mudo:v.muted,t:+v.currentTime.toFixed(1)}:null});await p.screenshot({path:'/tmp/sg1.png'});
await p.waitForFunction(()=>!document.querySelector('.sjFx')&&document.querySelector('.crC'),null,{timeout:15000});await p.waitForTimeout(800);
await p.evaluate(()=>document.querySelector('.crC').click());await p.waitForTimeout(3500);await p.evaluate(()=>document.querySelectorAll('.rkWin').forEach(x=>x.click()));await p.waitForTimeout(800);await p.screenshot({path:'/tmp/sgset.png'});
console.log(JSON.stringify({v1,inv:await p.evaluate(()=>JSON.parse(localStorage.tw_inv||'[]').map(x=>x.nm+'('+x.t+')').join(',')),pity:await p.evaluate(()=>localStorage.rk_pitySJI),eqp:await p.evaluate(()=>localStorage.tw_eqp)}),E);await b.close()})();
