// v223: personagens MÍTICOS no gacha (Naruto, Madara, Garou): SUPER MEGA SORTE + vídeo da ultimate + carta vermelha
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(60000);const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_gem:'5000',rk_dia:'1'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(600);await p.click('#rkWrap [data-a="gacha"]');await p.waitForTimeout(600);
// força o 1º giro a ser mítico (Madara): sec>.3%, máscara>.6%, mítico<.4%, índice 1
await p.evaluate(()=>{const Q=[.5,.5,.001,.4],o=Math.random;let on=0;Math.random=()=>on<Q.length&&/rkRoll/.test(new Error().stack)?Q[on++]:o();});
await p.click('#rkWrap [data-a="sum1"]');
const shots=[];for(let i=0;i<40;i++){await p.waitForTimeout(250);if(await p.$('.rkMega')&&!shots.includes('mega')){await p.waitForTimeout(700);await p.screenshot({path:'/tmp/mt_mega.png'});shots.push('mega')}
  if(await p.$('.rkWin.mit')&&!shots.includes('ult')){await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/mt_ult.png'});shots.push('ult');await p.click('.rkWin.mit',{force:true});await p.waitForTimeout(900);await p.screenshot({path:'/tmp/mt_fim.png'});await p.click('.rkWin.mit',{force:true});await p.waitForTimeout(600);await p.screenshot({path:'/tmp/mt_carta.png'});break}
  const r=await p.$('.rkCd:not(.rv)');if(r&&shots.includes('mega')===false&&i>8){await r.click({force:true}).catch(()=>{})}}
const st=await p.evaluate(()=>({own:localStorage.rk_own,hist:JSON.parse(localStorage.rk_hist||'[]').slice(0,1)}));
console.log(JSON.stringify({shots,st}),'ERROS',JSON.stringify(errs));await b.close()})();
