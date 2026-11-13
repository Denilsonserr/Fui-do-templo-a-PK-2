// v391: Shaka num nível mais baixo (mais fácil, drops menores, sem XP de rank)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"E"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_rp:'5200',rk_dia:'1',rk_gem:'0',rk_po:'0',rk_bsel:'shaka',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const W=ms=>p.waitForTimeout(ms);await p.click('#mRank');await W(500);await p.click('#rkWrap [data-a="boss"]');await W(900);
await p.click('#rkWrap [data-a="start"]',{force:true});await W(600);await p.screenshot({path:SH+'sk_niveis.png'});
await p.click('.skLv button[data-l="0"]');await W(400);await p.click('.skPp [data-i="0"]');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await W(800);
const f=await p.evaluate(()=>{const o=__dbg.G.p[1];return {opp:o.def.id,lv:o.rkL,ph:o.rkPhB}});
await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;o.rkPh=2;o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150})});
await p.waitForSelector('#rkModal .rkRes',{timeout:60000});await W(800);const h=await p.$eval('#rkModal .rkRes',e=>e.innerText.slice(0,300));
console.log(JSON.stringify({f,rp:await p.evaluate(()=>localStorage.rk_rp),h}));console.log('ERRS',errs.slice(0,4));await b.close()})();
