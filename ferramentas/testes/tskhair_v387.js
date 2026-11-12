// v387: cabelo do Shaka balançando (pose parada) — tira uma sequência de quadros recortados do personagem
const {chromium}=require('playwright');const U='file:///home/claude/fui-do-templo-a-pk-2/www/index.html';const O=process.env.O||'/tmp/skh';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now())})}`);
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2000);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.tnO()});await p.waitForTimeout(1500);await p.evaluate(()=>__pvT.tnS(0));
await p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&G.phase==='fight'&&T.ph==='boss'},null,{timeout:90000});
await p.evaluate(()=>{setInterval(()=>{const G=__pvT.G(),a=G.p[0],o=G.p[1];a.hp=a.mhp;o.x=a.x+420;a.facing=1;o.vx=0;o.inv=99;o.state='idle';o.st=0;o.move=null},16)});await p.waitForTimeout(1500);
const box=await p.evaluate(()=>{const G=__pvT.G(),a=G.p[0];return {x:a.x,y:a.y}});
for(const on of [1,0]){await p.evaluate(v=>__pvT.skh(v),on);for(let i=0;i<(on?8:1);i++){await p.screenshot({path:`${O}_${on}_${i}.png`});await p.waitForTimeout(140)}}
console.log('ERROS',errs.slice(0,5));await b.close()})();
