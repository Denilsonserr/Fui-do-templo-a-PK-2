const {chromium}=require('playwright');const SH=__dirname+'/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:576}});
const errs=[];p.on('pageerror',e=>errs.push((e.stack||e.message).slice(0,400)));await p.route(/fonts\.g/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html',{timeout:120000});
await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(500);
await p.click('#goSelect');await p.waitForTimeout(600);await p.screenshot({path:SH+'sel.png'});await p.click('.tile[data-c="vegeta"]');await p.waitForTimeout(200);await p.click('.tile[data-c="goku"]');
await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForTimeout(1500);await p.screenshot({path:SH+'vs.png'});
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{const G=__dbg.G;G.p[1].cpu=true;G.p[0].cpu=false;G.noAI=true;G.timer=999;G.p[0].x=500;G.p[1].x=1100;G.p[0].facing=1;G.p[1].facing=-1;
  window.W=ms=>new Promise(r=>setTimeout(r,ms));window.F=n=>new Promise(r=>{const g=__dbg.G,f0=g.frame;const c=()=>g.frame>=f0+n?r():requestAnimationFrame(c);c()});
  window.K=(k,v)=>{const c={left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',punch:'KeyJ',kick:'KeyK'}[k];dispatchEvent(new KeyboardEvent(v?'keydown':'keyup',{code:c,bubbles:true}))};window.LOG=[];const G2=__dbg.G;(function lp(){const f=G2.p[0];LOG.push(f.state+(f.mname&&f.state==='attack'?':'+f.mname:'')+(G2.p[1].hp!==window.__lh?'*':''));window.__lh=G2.p[1].hp;requestAnimationFrame(lp)})()});
await p.waitForTimeout(400);await p.screenshot({path:SH+'idle.png'});
const R={};const comp=L=>{const o=[];for(const x of L)if(o[o.length-1]!==x)o.push(x);return o.join(' > ')};
// dash + run
R.dash=await p.evaluate(async()=>{const f=__dbg.G.p[0];LOG.length=0;const x0=f.x;K('right',1);await F(2);K('right',0);await F(3);K('right',1);await F(10);return [f.state,Math.round(f.x-x0)]});
await p.screenshot({path:SH+'dash.png'});
R.run=await p.evaluate(async()=>{const f=__dbg.G.p[0];await F(20);const s=f.state,x=f.x;await F(10);return [s,Math.round(f.x-x)]});
await p.screenshot({path:SH+'run.png'});
R.stop=await p.evaluate(async()=>{const f=__dbg.G.p[0];K('right',0);await F(12);return [f.state]});
R.seq1=await p.evaluate(()=>LOG.join(','));
// back dash
R.bdash=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0];f.x=500;G.p[1].x=900;await F(10);LOG.length=0;const x0=f.x;K('left',1);await F(2);K('left',0);await F(3);K('left',1);await F(1);K('left',0);await F(5);const inv=f.inv,st=f.state;await F(25);return [st,inv,Math.round(f.x-x0),f.state]});
// combo near
R.combo=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.x=700;o.x=800;await F(20);LOG.length=0;const hp=o.hp;const tap=async k=>{K(k,1);await F(2);K(k,0);await F(1)};
  await tap('punch');await F(9);await tap('punch');await F(9);await tap('punch');await F(14);await tap('kick');await F(12);await tap('kick');await F(14);return [Math.round(hp-o.hp),f.combo,o.state,Math.round(o.y)]});
R.seq2=await p.evaluate(()=>[...new Set(LOG)].join(','));
await p.evaluate(()=>F(40));
// pose shots of each attack at active frame
for(const mv of ['vjab','vstr','vkick','vhkick','vsweep']){R['p_'+mv]=await p.evaluate(async mv=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.state='idle';o.state='idle';f.x=600;o.x=760;await F(8);__dbg.startMove(f,mv);const m=f.move;await F(m.su+2);G.paused=true;return [m.su,m.ac,m.hb]},mv);
  await p.screenshot({path:SH+'p_'+mv+'.png'});await p.evaluate(()=>{__dbg.G.paused=false});await p.evaluate(()=>F(40))}
// jump + land
R.jump=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0];G.p[1].x=1200;f.x=500;await F(5);LOG.length=0;K('up',1);K('right',1);await F(3);K('up',0);K('right',0);await F(60);return [...new Set(LOG)].join(',')});
// block + counter: o jabs, f holds back then presses kick
R.ctr=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.x=700;o.x=800;f.facing=1;o.facing=-1;f.ki=100;f.state='idle';o.state='idle';await F(5);LOG.length=0;K('left',1);await F(10);__dbg.startMove(o,'jab');let k=0;for(let i=0;i<30;i++){await F(1);if(f.state==='blockstun'&&!k){k=1;f.buf.kick=G.frame}}K('left',0);await F(30);return [...new Set(LOG)].join(',')});
// knockdown + getup
R.down=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.x=700;o.x=790;f.state='idle';o.state='idle';f.inv=0;await F(5);LOG.length=0;__dbg.startMove(o,'sweep');await F(110);return [...new Set(LOG)].join(',')});
// other side: vegeta on the right facing left
R.side=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];o.x=400;f.x=900;await F(10);LOG.length=0;const x0=f.x;K('left',1);await F(2);K('left',0);await F(3);K('left',1);await F(14);K('left',0);await F(20);const dx=f.x-x0;o.x=f.x-110;const hp=o.hp;f.buf.punch=G.frame;await F(20);return [f.facing,Math.round(dx),Math.round(hp-o.hp),[...new Set(LOG)].join(',')]});
console.log(JSON.stringify(R,null,0));console.log(errs);await b.close()})();
