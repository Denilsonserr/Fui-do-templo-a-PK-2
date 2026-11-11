// v330: fps da revelação de 10 cartas com CPU 4x mais lenta
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},isMobile:true,hasTouch:true});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku"]',rk_gem:'50000',rk_ban:'"esp"',rk_pity3:'109'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(800);await p.click('#rkWrap [data-a="gacha"]',{force:true});await p.waitForTimeout(1200);
const s=await p.context().newCDPSession(p);await s.send('Emulation.setCPUThrottlingRate',{rate:4});
await p.click('#rkWrap [data-a="sum10"]',{force:true});await p.waitForTimeout(1000);await p.mouse.click(5,5);
const m=()=>p.evaluate(()=>new Promise(r=>{let n=0;const t0=performance.now();const f=()=>{n++;if(performance.now()-t0<2000)requestAnimationFrame(f);else r(n/2)};requestAnimationFrame(f)}));
console.log('distribuindo',await m());for(let i=0;i<20;i++){await p.waitForTimeout(300);if(await p.evaluate(()=>!!document.querySelector('.rkWin,.rkMega')))await p.mouse.click(5,5);if(await p.evaluate(()=>!document.getElementById('rkCdOk').hidden))break}
console.log('todas viradas',await m());await b.close()})();
