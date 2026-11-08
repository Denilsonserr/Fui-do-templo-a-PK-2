// v199: alcance do soco, combo de longe, passiva de contra-ataque a cada 3 golpes recebidos
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click('.tile[data-c="garou"]');await p.click('.tile[data-c="goku"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const r=await p.evaluate(async()=>{const G=__dbg.G;G.noAI=true;G.timer=999;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});const f=G.p[0],o=G.p[1];
 const K=async c=>{dispatchEvent(new KeyboardEvent('keydown',{code:c,bubbles:true}));await F(2);dispatchEvent(new KeyboardEvent('keyup',{code:c,bubbles:true}))};
 const out=[];const reset=async(d)=>{f.state='idle';o.state='idle';f.x=900;o.x=900+d;f.facing=1;o.facing=-1;f.vx=o.vx=0;o.hp=3600;f.ki=100;f.spCD=0;await F(30)};
 for(const d of [180,230,280,320]){await reset(d);await K('KeyJ');await F(14);out.push('soco '+d+'px: '+(3600-o.hp>0?'ACERTA':'erra'))}
 for(const d of [300,200,300,380]){await reset(d);await F(30);f.inCmb=0;f.spCD=0;await K('KeyI');await F(40);out.push('combo '+d+'px: '+(f.grHeld||f.state!=='grc'&&3600-o.hp>100?'PEGA':'erra')+' st='+f.state);for(let i=0;i<12&&f.state==='grc';i++)await F(10)}
 await reset(150);f.grN=0;const st=[];for(let i=0;i<3;i++){o.state='idle';__dbg.startMove(o,'jab');await F(14);st.push(f.state)}await F(10);out.push('passiva: estados '+st.join(',')+' contra='+(f.grGot||0));
 return out});
console.log(r.join('\n'),errs);await b.close()})();
