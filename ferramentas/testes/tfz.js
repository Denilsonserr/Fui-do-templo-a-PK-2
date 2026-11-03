const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:576}});const errs=[];p.on('pageerror',e=>errs.push((e.stack||e.message).slice(0,300)));await p.route(/fonts\.g/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html',{timeout:120000});
await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(400);
await p.click('#goSelect');await p.waitForTimeout(300);await p.click('.tile[data-c="goku"]');await p.click('.tile[data-c="broly"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="city"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{const G=__dbg.G;G.p[1].cpu=false;G.p[0].cpu=false;G.timer=999;G.p[0].x=1000;G.p[1].x=1110;G.p[0].facing=1});
for(let i=0;i<3;i++){await p.keyboard.press('j');await p.waitForTimeout(i<2?200:95)}await p.screenshot({path:'shots/f1.png'});await p.waitForTimeout(600);
await p.evaluate(()=>{const G=__dbg.G;G.p[1].x=G.p[0].x+120;G.p[1].state='idle';G.p[1].inv=0});
await p.keyboard.down('j');await p.waitForTimeout(700);await p.keyboard.up('j');
const r=[];for(let i=0;i<8;i++){await p.waitForTimeout(110);r.push(await p.evaluate(()=>[__dbg.G.p[0].mname,__dbg.G.p[1].state,Math.round(__dbg.G.p[1].x)]));if(i===2)await p.screenshot({path:'shots/f2.png'})}
console.log(JSON.stringify(r),errs);await b.close()})();
