const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>{errs.push(e.message);console.log('ERR',e.stack)});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click('.tile[data-c="naruto"]');await p.click('.tile[data-c="madara"]');await p.click('#goStage');await p.waitForTimeout(600);await p.screenshot({path:SH+'vale_sel.png'});await p.click('.stc[data-s="vale"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{__dbg.G.noAI=true;__dbg.G.timer=999});
const ph0=await p.evaluate(()=>__dbg.DN.ph);console.log('ph0',ph0,await p.evaluate(()=>__dbg.stg()));
await p.waitForTimeout(800);await p.screenshot({path:SH+'vale_noite.png'});
for(const [lv,ph,n] of [[0,.3,'dia0'],[0,.55,'tarde0'],[2,.3,'dia2'],[3,.3,'dia3'],[4,.6,'l4'],[5,.75,'l5']]){
  await p.evaluate(([lv,ph])=>{const D=__dbg.DN;D.lv=lv;D.from=lv;D.k=1;D.ph=ph;D.lt=lv===5?10:0},[lv,ph]);await p.waitForTimeout(700);await p.screenshot({path:SH+'vale_'+n+'.png'})}
console.log(errs);await b.close()})();
