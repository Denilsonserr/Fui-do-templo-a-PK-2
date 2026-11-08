const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click('.tile[data-c="luffy"]');await p.click('.tile[data-c="zoro"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const r=await p.evaluate(async()=>{const G=__dbg.G;G.noAI=true;G.timer=999;const f=G.p[0],o=G.p[1];const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
 const K=(k,v)=>dispatchEvent(new KeyboardEvent(v?'keydown':'keyup',{code:k,bubbles:true}));
 o.x=99999;await F(2);f.x=o.x-110;f.facing=1;o.facing=-1;await F(10);
 for(let i=0;i<80;i++){K('KeyJ',1);await F(2);K('KeyJ',0);await F(3);if(o.wbT>0)break}
 await F(6);G.hold=true;await new Promise(r=>setTimeout(r,200));return {wb:o.wbT,fs:f.state,fx:Math.round(f.x),ox:Math.round(o.x),fhp:f.hp}});
await p.screenshot({path:'/tmp/wb1.png'});
const r2=await p.evaluate(async()=>{const G=__dbg.G;G.hold=false;const f=G.p[0],o=G.p[1];const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});await F(70);return {fs:f.state,fx:Math.round(f.x),ox:Math.round(o.x),fhp:f.hp}});
console.log(JSON.stringify(r),JSON.stringify(r2),errs);await b.close()})();
