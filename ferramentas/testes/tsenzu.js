// v213: Semente dos Deuses revive o jogador no Modo Boss
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();localStorage.tw_nome='"T"';localStorage.tw_senzu='1'}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="start"]');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const r=await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});a.hp=5;a.inv=0;a.state='idle';__dbg.applyHit(o,a,{dmg:300,kb:0,hs:2,kind:'melee',px:a.x,py:a.y-150});await F(20);
  const r1={hp:Math.round(a.hp),ko:a.ko,phase:G.phase,senzu:localStorage.tw_senzu};a.hp=5;a.inv=0;a.state='idle';__dbg.applyHit(o,a,{dmg:300,kb:0,hs:2,kind:'melee',px:a.x,py:a.y-150});await F(20);return {r1,depois:{ko:a.ko,phase:G.phase}}});
console.log(JSON.stringify(r),errs);await b.close()})();
