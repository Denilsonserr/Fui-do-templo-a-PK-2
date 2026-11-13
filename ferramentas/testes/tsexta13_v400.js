// v400: loja Sexta-feira 13 (geminhas, caixa, abóbora negra), abóboras ao fim da luta, Shaka 3 vidas no rank alto
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"E"',rk_ini:'1',rk_own:'["goku","shaka"]',rk_sel:'"goku"',rk_rp:'999999',rk_xpv2:'1',rk_sx:'2000',rk_bsel:'shaka',rk_sxav:'"x"',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const W=ms=>p.waitForTimeout(ms),cm=()=>p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''}});
await p.click('#mRank');await W(500);await cm();await p.evaluate(()=>__dbg&&0);await p.click('#rkWrap [data-a="shop"]',{force:true}).catch(()=>{});
await p.evaluate(()=>{document.querySelector('#rkWrap [data-a="gacha"]')});
const R={};R.s0=await p.evaluate(()=>__pvT.sx());
await p.evaluate(()=>{const b=document.querySelector('[data-a="sxShop"]');if(b)b.click()});await W(300);
if(!(await p.$('.rk_sx'))){await p.evaluate(()=>{const e=document.querySelector('#rkWrap [data-a="gacha"]');e&&e.click()});await W(500);await p.evaluate(()=>{const e=document.querySelector('#rkWrap [data-a="shop"]');e&&e.click()});await W(500);await p.screenshot({path:SH+'sx_shop.png'});await p.evaluate(()=>{const b=document.querySelector('[data-a="sxShop"]');if(b)b.click()});await W(500)}
await p.screenshot({path:SH+'sx_loja.png'});R.view=await p.evaluate(()=>!!document.querySelector('.rk_sx'));
await p.click('#rkWrap [data-a="sxGem"]',{force:true});await W(300);await p.click('#rkMOk');await W(400);R.gem=await p.$eval('#rkModal h3',e=>e.textContent);await p.click('#rkMX');await W(300);
await p.click('#rkWrap [data-a="sxBox"]',{force:true});await W(300);await p.screenshot({path:SH+'sx_box.png'});await p.click('#sxBuy');await W(1500);await p.screenshot({path:SH+'sx_abrindo.png'});await W(1200);R.box=await p.$eval('#rkModal h3',e=>e.textContent);await p.screenshot({path:SH+'sx_premio.png'});await p.click('#rkMX');await W(300);
await p.click('#rkWrap [data-a="sxNeg"]',{force:true});await W(300);await p.click('#rkMOk');await W(400);R.neg=await p.$eval('#rkModal h3',e=>e.textContent);await p.click('#rkMX');await W(300);
R.s1=await p.evaluate(()=>__pvT.sx());
// V2 1%: força
await p.evaluate(()=>{const r=Math.random;Math.random=()=>0.001;localStorage.setItem('rk_sxbox','1')});await p.evaluate(()=>{});
// luta do boss Shaka no rank máximo: 3 vidas
await p.evaluate(()=>{Math.random=(()=>{let s=1;return()=>{s=(s*16807)%2147483647;return s/2147483647}})()});
await p.click('#rkWrap [data-a="home"]',{force:true});await W(600);await p.click('#mRank');await W(600);await cm();
await p.evaluate(()=>{const e=document.querySelector('#rkWrap [data-a="boss"]');e&&e.click()});await W(800);await cm();await p.click('#rkWrap [data-a="start"]',{force:true});await W(500);await p.screenshot({path:SH+'sx_pick.png'});
await p.click('#rkWrap .skpRk',{force:true});await W(400);await p.click('.skPp [data-i="0"]');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await W(600);
R.f0=await p.evaluate(()=>__pvT.sx());
const kill=()=>p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150})});
await kill();await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:20000});await W(800);R.f1=await p.evaluate(()=>__pvT.sx());
await kill();await W(1500);await p.screenshot({path:SH+'sx_div.png'});await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:20000});await W(4000);await p.screenshot({path:SH+'sx_div2.png'});R.f2=await p.evaluate(()=>__pvT.sx());
await kill();await p.waitForSelector('#rkModal .rkRes',{timeout:60000});await p.waitForTimeout(800);R.res=await p.evaluate(()=>{const c=document.querySelector('#rkChest');if(c)c.click();return 1});await p.waitForTimeout(1500);R.itens=await p.evaluate(()=>(document.querySelector('#rkModal .rkItems')||{}).innerText||'');await p.screenshot({path:SH+'sx_res.png'});R.f3=await p.evaluate(()=>__pvT.sx());
console.log(JSON.stringify(R,null,0));console.log('ERRS',errs.slice(0,4));await b.close()})();
