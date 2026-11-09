// v242: modo FARM no Boss (nível abaixo do rank): sem XP de rank, gemas normais, drops menores
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"F"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_rp:'9500',rk_dia:'1',rk_gem:'0'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(600);await p.click('#rkWrap [data-a="start"]');await p.waitForTimeout(500);
await p.click('#rkWrap .rbCell[data-i="1"]');await p.waitForTimeout(400);await p.screenshot({path:SH+'farm_rb.png'});await p.click('#rkWrap [data-a="fight"]');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const lv=await p.evaluate(()=>__dbg.G.p[1].rkL);
await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});await F(70);for(const ph of [1,2]){o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150});await F(20);await new Promise(r=>{const c=()=>!G.trans?r():requestAnimationFrame(c);c()});await F(10)}});
await p.waitForSelector('#rkModal .rkRes');await p.click('#rkChest',{force:true}).catch(()=>{});await p.waitForTimeout(800);await p.screenshot({path:SH+'farm_res.png'});
const r=await p.evaluate(()=>({rp:localStorage.rk_rp,gem:localStorage.rk_gem}));console.log(JSON.stringify({bossLv:lv,r,errs}));await b.close()})();
