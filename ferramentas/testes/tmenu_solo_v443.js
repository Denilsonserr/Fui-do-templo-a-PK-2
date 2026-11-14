// v443: menu Solo Leveling (vídeo novo) + botão PORTAIS trancado até 15/11 11:00
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const out=[];for(const t of [Date.UTC(2026,10,14,21),Date.UTC(2026,10,15,14,5)]){const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.clock.install({time:t});await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1'})}});
await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.evaluate(()=>__pvT.rkO('menu'));await p.waitForTimeout(2500);await p.screenshot({path:SH+'menu_'+out.length+'.png'});
const v=await p.evaluate(()=>{const v=document.querySelector('.rk_menu video');return v?{src:v.currentSrc.split('/').pop(),t:+v.currentTime.toFixed(1),paused:v.paused}:null});
await p.click('.mnPt');await p.waitForTimeout(500);const toast=await p.evaluate(()=>[...document.querySelectorAll('.rkToast')].map(x=>x.textContent).join('|'));
out.push({v,lk:await p.evaluate(()=>!!document.querySelector('.mnPt.lk')),toast,errs:errs.slice(0,3)});await p.close()}
console.log(JSON.stringify(out));await b.close()})();
