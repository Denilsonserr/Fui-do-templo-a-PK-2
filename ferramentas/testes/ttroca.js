const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.setDefaultTimeout(120000);
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,300)));await p.route(/fonts\.g/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);
await p.evaluate(()=>{const b=document.querySelector('#teamN button[data-v="2"]');if(b)b.click()});await p.waitForTimeout(200);
for(const c of ['goku','vegeta','broly','magmus']){await p.click(`.tile[data-c="${c}"]`);await p.waitForTimeout(150)}
await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const R={};
R.team=await p.evaluate(()=>{const G=__dbg.G;return [G.teams,G.p.map(f=>f.def.id)]});
await p.screenshot({path:'/home/claude/cen/t_hud.png'});
// transformar o jogador para ver o efeito
R.tr=await p.evaluate(async()=>{const G=__dbg.G;G.noAI=true;G.timer=999;const f=G.p[0];f.form=1;f.formT=99999;G.p[1].form=1;G.p[1].formT=99999;G.p[0].x=900;G.p[1].x=1150;await new Promise(r=>setTimeout(r,600));return f.form});
await p.screenshot({path:'/home/claude/cen/t_form.png'});
// troca
R.swap=await p.evaluate(async()=>{const G=__dbg.G;const o=G.p[1],hp0=o.hp;const tb=document.getElementById('bSw');tb.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));await new Promise(r=>setTimeout(r,60));tb.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));
  const st=[];for(let i=0;i<30;i++){await new Promise(r=>setTimeout(r,33));st.push(G.p[0].def.id+':'+G.p[0].state)}return {after:G.p[0].def.id,dmg:Math.round(hp0-o.hp),oState:o.state,seq:[...new Set(st)].join(',')}});
await p.waitForTimeout(150);await p.screenshot({path:'/home/claude/cen/t_swap.png'});
R.ko=await p.evaluate(async()=>{const G=__dbg.G,T=window.__TAG;await new Promise(r=>setTimeout(r,2500));const log=[];log.push(['on',T.on,T.bench.map(b=>b&&b.def.id)]);
  const o=G.p[1];o.hp=1;o.inv=0;o.guard=false;const a=G.p[0];o.x=a.x+80;a.facing=1;a.state='idle';__dbg.startMove(a,'jab');
  for(let i=0;i<12;i++){await new Promise(r=>setTimeout(r,400));log.push([G.phase,G.p[1].def.id,G.p[1].state,G.p[1].hp|0,!!T.q])}return log});
await p.screenshot({path:'/home/claude/cen/t_ko.png'});
R.end=await p.evaluate(async()=>{const G=__dbg.G;await new Promise(r=>setTimeout(r,1500));const o=G.p[1];o.hp=1;o.inv=0;o.guard=false;const a=G.p[0];o.x=a.x+80;a.facing=1;a.state='idle';__dbg.startMove(a,'jab');const log=[];for(let i=0;i<20;i++){await new Promise(r=>setTimeout(r,500));log.push(G.mode+'/'+G.phase)}return log});
// bloqueio
console.log(JSON.stringify(R));console.log('ERRS',errs);await b.close()})();
