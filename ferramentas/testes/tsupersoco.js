// v208: segurar soco = SUPER SOCO (carregamento no botão) e quebra a defesa
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const res=[];
for(const id of ['goku','garou','broly','naruto']){const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click(`.tile[data-c="${id}"]`);await p.click('.tile[data-c="vegeta"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{const G=__dbg.G;G.noAI=true;G.timer=999;const [f,o]=G.p;f.x=900;o.x=1060;f.facing=1;o.facing=-1;window.F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
  const gl=()=>{if(o.state==='idle'||o.state==='walk'||o.state==='blockstun'){o.guard=true;o.guardT=50;o.guardPrev=1}requestAnimationFrame(gl)};gl();/* rival sempre defendendo */});
await p.evaluate(async()=>{await F(30);dispatchEvent(new KeyboardEvent('keydown',{code:'KeyJ',bubbles:true}));await F(14)});
if(id==='goku')await p.screenshot({path:'/tmp/ss_carga.png'});
const r=await p.evaluate(async()=>{const G=__dbg.G,[f,o]=G.p;await F(10);const sh=document.getElementById('bPunch').className;dispatchEvent(new KeyboardEvent('keyup',{code:'KeyJ',bubbles:true}));const h0=o.hp;let st=[],gb=0;
  for(let i=0;i<45;i++){await F(1);if(o.gbT>0)gb=1;if(!st.includes(o.state))st.push(o.state)}o.state='idle';o.guard=true;o.guardT=50;o.grounded=true;o.gbT=0;o.inv=0;const dir=__dbg.applyHit(f,o,{smash:1,dmg:150,kb:23,hs:24,heavy:1,kind:'melee',px:o.x,py:o.y-150})&&o.gbT>0;return {quebraDireta:dir,botao:sh,move:f.mname,estadosRival:st.join(','),quebrou:gb,dano:Math.round(h0-o.hp)}});
if(id==='goku')await p.screenshot({path:'/tmp/ss_quebra.png'});
res.push(id+' '+JSON.stringify(r)+' '+errs.join('|'));await p.close()}
console.log(res.join('\n'));await b.close()})();
