// v207: capacete (transformação + crítico) e crítico geral
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:'"meu"',tw_nome:'"Teste"',tw_ts203:'1',
  tw_inv:JSON.stringify([{id:'c',t:'cap',r:'mit',v:35,crit:25},{id:'c2',t:'cap',r:'epica',v:10,crit:15}]),tw_eqp:JSON.stringify({cap:'c'})})}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mTorre');await p.waitForTimeout(500);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/cap_painel.png'});
await p.click('#twBagB');await p.waitForTimeout(800);await p.screenshot({path:'/tmp/cap_mochila.png'});await p.click('#twModal .moS.eqd');await p.waitForTimeout(300);await p.screenshot({path:'/tmp/cap_det.png'});await p.click('#twMoD button[data-a="x"]');await p.click('#twBagX');
await p.click('#twGo');await p.waitForTimeout(1600);await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;let n=0,c=0,base=0;const N=3000;
  for(let i=0;i<N;i++){o.inv=0;o.state='idle';o.guard=false;o.hp=1e6;o.mhp=1e6;a.combo=0;__dbg.applyHit(a,o,{dmg:100,kb:0,hs:1,kind:'melee',px:o.x,py:o.y-150});const d=1e6-o.hp;if(!base||d<base*.9)base=d;n++;if(d>base*1.3)c++}
  const out={tsb:a.tsb,tcr:a.tcr,critPct:+(100*c/n).toFixed(1),esperado:30};a.tcr=0;c=0;for(let i=0;i<N;i++){o.inv=0;o.state='idle';o.hp=1e6;a.combo=0;__dbg.applyHit(a,o,{dmg:100,kb:0,hs:1,kind:'melee',px:o.x,py:o.y-150});if(1e6-o.hp>base*1.3)c++}out.semCapacete=+(100*c/N).toFixed(1);
  window.__crit=1;o.hp=1e6;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:100,kb:0,hs:1,kind:'melee',px:o.x,py:o.y-150});window.__crit=null;return out});
await p.waitForTimeout(200);await p.screenshot({path:'/tmp/cap_crit.png'});console.log('CRIT',JSON.stringify(r));
console.log('ERROS',JSON.stringify(errs));await b.close()})();
