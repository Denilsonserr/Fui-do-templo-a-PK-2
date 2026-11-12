// v380: andar a andar voltando para a tela da torre, subida salva, sair pelo pause, risco, desistir
const {chromium}=require('playwright');const U='file:///home/claude/fui-do-templo-a-pk-2/www/index.html';const O='/tmp/ta';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","naruto"]',rk_sel:'"naruto"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now())})}`);
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.tnO()});await p.waitForTimeout(1500);
await p.click('.tnRk.r2',{force:true});await p.waitForTimeout(300);await p.click('#twGo',{force:true});
const fight=()=>p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&G.phase==='fight'&&T.ph==='boss'},null,{timeout:90000});
const st=()=>p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G(),o=G.p&&G.p[1];return JSON.stringify({mode:G.mode,on:T.on,g:T.g,ph:T.ph,risk:T.risk,boss:o&&o.def.name,bmhp:o&&o.mhp,run:__pvT.tnRun()&&{g:__pvT.tnRun().g,hp:__pvT.tnRun().hp,bl:__pvT.tnRun().bl}})});
await fight();await p.waitForTimeout(1500);console.log('luta1',await st());await p.screenshot({path:O+'_l1.png'});
await p.evaluate(()=>{const G=__pvT.G();G.p[1].hp=1;__pvT.tnK()});await p.waitForTimeout(3200);await p.evaluate(()=>document.querySelector('#tnPick .tnC').click());await p.waitForTimeout(3500);
console.log('depois',await st());await p.screenshot({path:O+'_lobby.png'});
await p.click('#rtBack2',{force:true});await p.waitForTimeout(800);await p.evaluate(()=>__pvT.tnO());await p.waitForTimeout(1500);console.log('reabriu',await st());await p.screenshot({path:O+'_lobby2.png'});
await p.click('#twGo',{force:true});await fight();await p.waitForTimeout(1000);console.log('luta2',await st());
await p.click('#pauseBtn',{force:true});await p.waitForTimeout(400);await p.click('#toMenu',{force:true});await p.waitForTimeout(1500);console.log('saiu',await st());
await p.click('#tnQuit',{force:true});await p.waitForTimeout(400);await p.click('#tnQY',{force:true});await p.waitForTimeout(2500);console.log('desistiu',await st());await p.screenshot({path:O+'_fim.png'});
console.log('ERROS',errs.slice(0,8));await b.close()})();
