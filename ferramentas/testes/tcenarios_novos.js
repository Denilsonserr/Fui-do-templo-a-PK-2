const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',r=>{if(!/mp3|fonts/.test(r.url()))errs.push('fail '+r.url())});await p.route(/fonts\.g/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(500);await p.click('.tile[data-c="madara"]');await p.click('.tile[data-c="goku"]');await p.click('#goStage');await p.waitForTimeout(600);
await p.screenshot({path:'/tmp/stg_sel.png'});
for(const k of ['marinha','caveira','konoha','dojo']){
 if(k==='marinha'){await p.click(`.stc[data-s="${k}"]`);await p.click('#goFight');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000})}
 else{await p.evaluate(k=>__dbg.setStage(k),k);}
 await p.waitForTimeout(2500);await p.evaluate(()=>{const G=__dbg.G;G.noAI=true;G.timer=99});await p.screenshot({path:`/tmp/stg_${k}.png`});
 const r=await p.evaluate(()=>{const G=__dbg.G;G.p[0].x-=300;return 1});await p.waitForTimeout(1500);await p.screenshot({path:`/tmp/stg_${k}_b.png`});}
console.log(errs);await b.close()})();
