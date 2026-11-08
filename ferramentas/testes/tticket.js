// v225: tickets de giro (1x usa 1 ticket; 10x usa os tickets + 45 💎 por giro que faltar) + faixa do evento de XP
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_gem:'400',rk_tic:'4',rk_dia:'1'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="gacha"]');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/tk_gacha.png'});
const st=()=>p.evaluate(()=>[+localStorage.rk_gem,+localStorage.rk_tic]);const s0=await st();
const spin=async(a)=>{await p.click(`#rkWrap [data-a="${a}"]`);await p.waitForSelector('.rkRes2',{timeout:60000});await p.waitForTimeout(300);await p.evaluate(()=>document.querySelectorAll('.rkMega,.rkWin,.rkRes2,.rkFx').forEach(e=>e.remove()));await p.click('#rkWrap [data-a="gacha"]').catch(()=>{});await p.waitForTimeout(300)};
await spin('sum1');const s1=await st();await spin('sum10');const s2=await st();
await p.evaluate(()=>{localStorage.rk_gem='100';localStorage.rk_tic='0'});await p.click('#rkWrap [data-a="sum10"]');await p.waitForTimeout(400);const s3=await st();
console.log(JSON.stringify({inicio:s0,depois1x:s1,depois10x:s2,semDinheiro:s3,dupGem:'pode somar 💎 de repetidos'}),'ERROS',JSON.stringify(errs));await b.close()})();
