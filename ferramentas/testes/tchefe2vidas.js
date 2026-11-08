// v211: no evento o chefe final volta 1 vez com vida cheia e 2x mais forte
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.__twEvT=[-60000,3600000];if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:'"meu"',tw_nome:'"Teste"',tw_ts203:'1'})}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mTorre');await p.waitForTimeout(500);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(1200);
await p.click('#twGo');await p.waitForTimeout(1600);await p.evaluate(()=>{__TW.fl=6;__TW.rev=true});await p.click('#twGo');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:60000});await p.waitForTimeout(500);
const r=await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});const t0=o.tdm;
  o.hp=10;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:200,kb:0,hs:2,kind:'melee',px:o.x,py:o.y-150});await F(5);
  const r1={evBoss:__TW.evBoss,fase:G.phase,hp:Math.round(o.hp),mhp:o.mhp,ko:o.ko,tdm:+(o.tdm/t0).toFixed(2)};await F(60);
  o.hp=10;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:200,kb:0,hs:2,kind:'melee',px:o.x,py:o.y-150});await F(5);return {r1,depois:{fase:G.phase,ko:o.ko}}});
await p.screenshot({path:'/tmp/ch2.png'});console.log(JSON.stringify(r),'ERROS',JSON.stringify(errs));await b.close()})();
