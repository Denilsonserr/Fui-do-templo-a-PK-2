const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click('.tile[data-c="garou"]');await p.waitForTimeout(600);await p.screenshot({path:'/tmp/s_sel.png'});await p.click('.tile[data-c="goku"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const r=await p.evaluate(async()=>{const G=__dbg.G;G.noAI=true;G.timer=999;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});const f=G.p[0],o=G.p[1];f.x=900;o.x=1040;f.facing=1;o.facing=-1;await F(20);
 let air=0,seq=[];for(let i=0;i<14;i++){dispatchEvent(new KeyboardEvent('keydown',{code:'KeyJ',bubbles:true}));await F(2);dispatchEvent(new KeyboardEvent('keyup',{code:'KeyJ',bubbles:true}));for(let k=0;k<6;k++){await F(1);if(!f.grounded)air++}seq.push(f.mname||f.state);if(f.mname==='qstr'&&f.mf>=5&&!window.shot){window.shot=1}}return {air,seq:seq.join(',')}});
console.log(JSON.stringify(r),errs);await b.close()})();
