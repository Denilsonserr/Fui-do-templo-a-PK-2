// Teste do Zoro novo (v179): corrente de cortes, investida, transformação com aura verde, Combo do Rei Demônio. Uso: NODE_PATH=<node_modules> node tzoro.js
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>{errs.push((e.stack||e.message).slice(0,300));console.log('PAGEERR',(e.stack||e.message).slice(0,300))});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click('.tile[data-c="zoro"]');await p.click('.tile[data-c="goku"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{const G=__dbg.G;G.noAI=true;G.timer=999;window.F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
 window.K=(k,v)=>{const c={left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',punch:'KeyJ',kick:'KeyK',ki:'KeyL',sp:'KeyI',tr:'KeyU',sr:'KeyO'}[k];dispatchEvent(new KeyboardEvent(v?'keydown':'keyup',{code:c,bubbles:true}))};
 window.tap=async k=>{K(k,1);await F(2);K(k,0);await F(1)};
 window.reset=async(d)=>{const f=G.p[0],o=G.p[1];f.x=700;o.x=700+(d||150);f.y=o.y=486;f.grounded=o.grounded=true;f.facing=1;o.facing=-1;f.state='idle';o.state='idle';o.inv=0;o.hp=o.hpLag=o.mhp||3600;f.ki=100;await F(30)};
 window.LOG=[];(function lp(){const f=G.p[0];if(f.state==='attack'||f.state==='zrc')LOG.push((f.state==='attack'?f.mname:f.state)+':'+f.mf);requestAnimationFrame(lp)})()});
const shot=n=>p.screenshot({path:SH+'zr_'+n+'.png'});
await p.evaluate(()=>reset());
// corrente de socos
const r1=await p.evaluate(async()=>{const G=__dbg.G,o=G.p[1],h0=o.hp;const seq=[];for(let i=0;i<6;i++){await tap('punch');await F(9);seq.push(G.p[0].mname||G.p[0].state)}await F(40);return {seq,dmg:Math.round(h0-o.hp),combo:G.p[0].combo}});console.log('SOCOS',JSON.stringify(r1));
await p.evaluate(()=>reset());await p.evaluate(async()=>{await tap('punch');await F(10)});await shot('c1');await p.evaluate(async()=>{await F(30);await tap('punch');await F(12)});await shot('c2');
await p.evaluate(()=>reset(260));const r2=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1],x0=f.x,h0=o.hp;await tap('kick');await F(12);const s=f.mname;await F(30);return {s,dx:Math.round(f.x-x0),dmg:Math.round(h0-o.hp)}});console.log('INVESTIDA',JSON.stringify(r2));
await p.evaluate(()=>reset(260));await p.evaluate(async()=>{await tap('kick');await F(14)});await shot('dash');
// transformação
await p.evaluate(()=>reset());const r3=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0];f.sb=6;await tap('tr');let t=0;while(G.trans&&t<600){await F(10);t+=10}await F(30);return {form:f.form,t}});console.log('TRANSF',JSON.stringify(r3));
await p.evaluate(()=>F(20));await shot('aura');
await p.evaluate(()=>reset());await p.evaluate(async()=>{await tap('punch');await F(10)});await shot('c1_form');
await p.evaluate(()=>reset(140));const r4=await p.evaluate(async()=>{const G=__dbg.G,o=G.p[1],h0=o.hp;await tap('sp');await F(30);return {st:G.p[0].state,held:G.p[0].zrHeld}});await shot('combo1');
const r5=await p.evaluate(async()=>{const G=__dbg.G;await F(20);return 1});await shot('combo2');await p.evaluate(()=>F(20));await shot('combo3');
const r6=await p.evaluate(async()=>{const G=__dbg.G,o=G.p[1];await F(60);return {st:G.p[0].state,ohp:Math.round(o.hp),ostate:o.state}});console.log('COMBO',JSON.stringify(r4),JSON.stringify(r6));
console.log('LOG',[...new Set(await p.evaluate(()=>LOG.map(x=>x.split(':')[0])))].join(','));
console.log('ERROS',JSON.stringify(errs));await b.close()})();
