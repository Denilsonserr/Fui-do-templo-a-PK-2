// v218: prêmios dos elos (baús, tickets, sementes, caixa secreta) e conquistas
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(60000);const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_rp:'36000',rk_own:'["goku"]',rk_sel:'"goku"',rk_rwc:'[1,2]',rk_st:JSON.stringify({wins:12,loss:3,spins:60,dmgTot:150000})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(600);
await p.click('#rkWrap [data-a="rewards"]');await p.waitForTimeout(300);await p.screenshot({path:'/tmp/rw_lista.png'});
const g0=await p.evaluate(()=>localStorage.rk_gem);
for(const i of [1,6,7]){await p.click(`#rkModal .rkRw button[data-i="${i}"]`);for(let k=0;k<12;k++){await p.waitForTimeout(500);if(await p.$('#twCpOk')){await p.screenshot({path:'/tmp/rw_bau'+i+'.png'});await p.click('#twCpOk');await p.waitForTimeout(700)}const w=await p.$('.rkWin.sec');if(w){await p.screenshot({path:'/tmp/rw_sec'+i+'.png'});await p.waitForTimeout(700);await w.click({force:true})}if(await p.$('#rkModal .rkRw'))break}}
const r=await p.evaluate(()=>({gem:localStorage.rk_gem,tic:localStorage.rk_tic,senzu:localStorage.tw_senzu,rwc2:localStorage.rk_rwc2,inv:JSON.parse(localStorage.tw_inv||'[]').map(x=>x.nm||x.t+':'+x.r).join(','),poc:JSON.parse(localStorage.tw_poc||'[]').length}));
await p.click('#rkMX');await p.click('#rkWrap [data-a="ach"]');await p.waitForTimeout(300);await p.screenshot({path:'/tmp/rw_ach.png'});await p.click('#rkAcAll');await p.waitForTimeout(300);
const a=await p.evaluate(()=>({gem:localStorage.rk_gem,tic:localStorage.rk_tic,achc:localStorage.rk_achc}));
console.log(JSON.stringify({g0,r,a}),'ERROS',JSON.stringify(errs));await b.close()})();
