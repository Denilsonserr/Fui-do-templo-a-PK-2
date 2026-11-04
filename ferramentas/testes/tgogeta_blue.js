// Teste do Gogeta Super Saiyajin Blue: transformação, combos, especial e ultimate. Uso: NODE_PATH=<node_modules globais> node tgogeta_blue.js
const {chromium}=require('playwright');const fs=require('fs');const SH=__dirname+'/shots/';fs.mkdirSync(SH,{recursive:true});
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:576}});
const errs=[];p.on('pageerror',e=>errs.push((e.stack||e.message).slice(0,400)));p.on('requestfailed',r=>{if(!/mp3|fonts/.test(r.url()))errs.push('falhou: '+r.url())});await p.route(/fonts\.g/,r=>r.abort());
await p.goto('file://'+__dirname+'/../../www/index.html',{timeout:120000});
await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(500);
await p.click('#goSelect');await p.waitForTimeout(600);await p.click('.tile[data-c="gogeta"]');await p.click('.tile[data-c="vegeta"]');
await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="city"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{const G=__dbg.G;G.p[1].cpu=true;G.p[0].cpu=false;G.noAI=true;G.timer=999;G.p[0].x=500;G.p[1].x=900;G.p[0].facing=1;G.p[1].facing=-1;
  window.F=n=>new Promise(r=>{const g=__dbg.G,f0=g.frame;const c=()=>g.frame>=f0+n?r():requestAnimationFrame(c);c()});
  window.K=(k,v)=>{const c={left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',punch:'KeyJ',kick:'KeyK'}[k];dispatchEvent(new KeyboardEvent(v?'keydown':'keyup',{code:c,bubbles:true}))};
  window.LOG=[];const G2=__dbg.G;(function lp(){const f=G2.p[0];LOG.push(f.state+(f.mname&&f.state==='attack'?':'+f.mname:'')+(G2.p[1].hp!==window.__lh?'*':''));window.__lh=G2.p[1].hp;requestAnimationFrame(lp)})()});
const R={};
R.srBtn=await p.evaluate(()=>document.getElementById('bSr').hidden);
R.trans=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0];f.sb=6;await F(5);f.buf.tr=G.frame;await F(30);return [f.state,!!G.trans]});
await p.screenshot({path:SH+'ggf_video.png'});
R.trans2=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0];let n=0;while(G.trans&&n<900){await F(5);n+=5}await F(10);return [f.form,f.state,n]});
await p.screenshot({path:SH+'ggf_form.png'});
R.combo=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.x=700;o.x=810;f.facing=1;o.facing=-1;o.state='idle';await F(20);LOG.length=0;const hp=o.hp;const tap=async k=>{K(k,1);await F(2);K(k,0);await F(1)};
  for(let i=0;i<5;i++){await tap('punch');await F(12)}await F(30);return [Math.round(hp-o.hp),o.state]});
R.seqP=await p.evaluate(()=>{const o=[];for(const x of LOG)if(o[o.length-1]!==x)o.push(x);return o.join(' ')});
await p.evaluate(()=>F(120));
for(const mv of ['gjab','grapid','gstr','gupper','gkick','ghkick','gsweep']){R['p_'+mv]=await p.evaluate(async mv=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.state='idle';o.state='idle';f.x=600;o.x=760;f.y=o.y;await F(8);__dbg.startMove(f,mv);const m=f.move;await F(m.su+2);G.paused=true;return [f.mname,m.dmg]},mv);
  await p.screenshot({path:SH+'ggf_'+mv+'.png'});await p.evaluate(()=>{__dbg.G.paused=false});await p.evaluate(()=>F(50))}
R.block=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.x=700;o.x=800;f.facing=1;o.facing=-1;f.state='idle';o.state='idle';await F(5);K('left',1);await F(10);__dbg.startMove(o,'jab');let st=[];for(let i=0;i<20;i++){await F(1);st.push(f.state);if(i===6){G.paused=true;break}}return [...new Set(st)].join(',')});
await p.screenshot({path:SH+'ggf_block.png'});await p.evaluate(()=>{__dbg.G.paused=false;K('left',0)});await p.evaluate(()=>F(40));
for(const kind of [2,1]){R['sup'+kind]=await p.evaluate(async kind=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.x=600;o.x=800;f.state='idle';o.state='idle';o.inv=0;f.ki=100;f.sb=6;f.spark=600;f.kx=200;f.form=1;f.formT=99999;await F(10);const hp=o.hp;
    if(kind===1)f.buf.sr=G.frame;else f.buf.sp=G.frame;await F(80);const mid=!!G.ws;return {hp:hp,mid,ws:G.ws&&G.ws.gg}},kind);
  await p.screenshot({path:SH+'ggf_sup'+kind+'.png'});
  R['sup'+kind+'b']=await p.evaluate(async()=>{const G=__dbg.G,o=G.p[1];let n=0;while(G.ws&&n<1200){await F(5);n+=5}const s1=o.state;await F(20);return [Math.round(o.hp),s1,o.state,n]});
  await p.screenshot({path:SH+'ggf_sup'+kind+'_end.png'});await p.evaluate(()=>F(150))}
R.cpu=await p.evaluate(async()=>{const G=__dbg.G;G.noAI=false;G.p[0].cpu=true;G.p[1].cpu=true;await F(900);return [G.p[0].state,Math.round(G.p[0].hp),Math.round(G.p[1].hp)]});
console.log(JSON.stringify(R));console.log('ERRS',errs);await b.close()})();
