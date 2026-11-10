// v313: 15 bots no ranking do rank/Boss/Caça e no online
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Denilson"',rk_rp:'26000'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(8000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
await p.click('#rkWrap [data-a="ranking"]',{force:true});await p.waitForTimeout(2500);await p.screenshot({path:'shots/bot_rk.png'});
const rk=await p.evaluate(()=>[...document.querySelectorAll('#rkModal .twRk .rw')].map(r=>r.innerText.replace(/\n/g,' ')).slice(0,18));
await p.evaluate(()=>{const b=document.querySelector('#rkModal .twTab button[data-t="dmg"]');b&&b.click()});await p.waitForTimeout(1500);const dm=await p.evaluate(()=>[...document.querySelectorAll('#rkModal .twRk .rw')].slice(0,3).map(r=>r.innerText.replace(/\n/g,' ')));
await p.evaluate(()=>{const b=document.querySelector('#rkModal .twTab button[data-t="tt"]');b&&b.click()});await p.waitForTimeout(1500);const tt=await p.evaluate(()=>[...document.querySelectorAll('#rkModal .twRk .rw')].slice(0,3).map(r=>r.innerText.replace(/\n/g,' ')));
await p.evaluate(()=>{try{document.getElementById('rkMX').click()}catch(e){}});await p.click('#rkWrap [data-a="caca"]',{force:true});await p.waitForTimeout(1200);await p.click('#rkWrap [data-a="caRank"]',{force:true});await p.waitForTimeout(2000);
const ca=await p.evaluate(()=>[...document.querySelectorAll('#rkModal .caRkR')].slice(0,4).map(r=>r.innerText.replace(/\n/g,' ')));await p.screenshot({path:'shots/bot_ca.png'});
console.log(JSON.stringify({rk,dm,tt,ca},null,1),'erros',JSON.stringify(errs));await b.close()})();
