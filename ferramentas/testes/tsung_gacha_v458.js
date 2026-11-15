// v458: gacha do Sung — vídeo do dono ao girar (com som), 2º vídeo quando sai o Sung, carta e tela do personagem com brilho roxo + fumaça preta
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.clock.install({time:Date.UTC(2026,10,15,12,5)});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Fulano"',rk_ini:'1',rk_xpv2:'1',rk_gem:'5000',rk_ban:'mit',rk_pitySJ:'249',rk_dl:JSON.stringify({d:'2026-11-15',s:0})})}});
await p.goto('http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
await p.evaluate(()=>__pvT.rkO('gacha'));await p.waitForTimeout(1200);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
await p.evaluate(()=>document.querySelector('.rkA [data-a="sum1"]').click());await p.waitForTimeout(1200);
const v1=await p.evaluate(()=>{const v=document.querySelector('.sjFx video');return v?{src:v.src.split('/').pop(),mudo:v.muted,t:+v.currentTime.toFixed(1)}:null});await p.screenshot({path:'/tmp/sg1.png'});
await p.waitForFunction(()=>!document.querySelector('.sjFx')&&document.querySelector('.crC'),null,{timeout:15000});await p.waitForTimeout(800);
await p.evaluate(()=>document.querySelector('.crC').click());await p.waitForTimeout(1500);
const v2=await p.evaluate(()=>{const v=document.querySelector('.sjFx video');return v?{src:v.src.split('/').pop(),mudo:v.muted}:null});await p.screenshot({path:'/tmp/sg2.png'});
await p.waitForFunction(()=>document.querySelector('.rkWin.sjw.end')||document.querySelector('.rkWin.sjw'),null,{timeout:25000}).catch(()=>{});await p.waitForTimeout(2500);await p.screenshot({path:'/tmp/sg3.png'});
const w=await p.evaluate(()=>{const O=document.querySelector('.rkWin');return O?{cls:O.className,txt:O.querySelector('.t b').textContent,fumaca:O.querySelectorAll('.sjSm i').length}:null});
await p.evaluate(()=>{const O=document.querySelector('.rkWin');if(O)O.click()});await p.waitForTimeout(800);await p.evaluate(()=>{const O=document.querySelector('.rkWin');if(O)O.click()});await p.waitForTimeout(1200);await p.screenshot({path:'/tmp/sg4.png'});
const c=await p.evaluate(()=>{const C=document.querySelector('.crC');return C?{cls:C.className,fumaca:C.querySelectorAll('.sjSm i').length}:null});
console.log(JSON.stringify({v1,v2,w,c,own:await p.evaluate(()=>localStorage.rk_own)}),E);await b.close()})();
