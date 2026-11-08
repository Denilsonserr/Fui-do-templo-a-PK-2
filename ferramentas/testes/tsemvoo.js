const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click('.tile[data-c="goku"]');await p.click('.tile[data-c="broly"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const r=await p.evaluate(async()=>{const G=__dbg.G;G.timer=999;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
 const f=G.p[0],o=G.p[1];let fly=0,air=0,maxAir=0;f.inv=99999;o.ki=100;o.sb=6;
 for(let i=0;i<1500;i++){await F(1);if(o.flying)fly++;if(!o.grounded){air++;maxAir=Math.max(maxAir,air)}else air=0}
 // botão de voar do jogador ainda funciona
 f.inv=0;f.x=600;f.state='idle';f.grounded=true;await F(10);dispatchEvent(new KeyboardEvent('keydown',{code:'KeyF',bubbles:true}));await F(3);dispatchEvent(new KeyboardEvent('keyup',{code:'KeyF',bubbles:true}));await F(10);
 return {cpuFlyFrames:fly,cpuMaxAir:maxAir,playerFly:f.flying,ps:f.state}});
console.log(JSON.stringify(r),errs);await b.close()})();
