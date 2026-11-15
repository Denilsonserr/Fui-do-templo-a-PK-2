// v461: Sung — guarda do 1º golpe, teleporte+tapão a cada 3, sobrevivência ≤50%, sangue <20%, forma (velocidade), golpes roxos, 7 anéis com Sistema nv 100
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));
p.on('request',r=>{if(/documentId=er_/.test(r.url())){try{const f=JSON.parse(r.postData()).fields;E.push('REP '+f.m.stringValue+' @'+f.st.stringValue.split('\n').slice(1,3).join(' ').slice(0,200))}catch(e){}}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_sjs:JSON.stringify({lv:100}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.treino('sung','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
const R={};
await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;G.noAI=true;f.x=600;o.x=760;f.facing=1;o.facing=-1});
R.guarda=await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;const h0=f.hp;__dbg.applyHit(o,f,{dmg:200,kb:3,hs:8,px:f.x,py:f.y-150,kind:'melee'});const h1=f.hp;f.inv=0;__dbg.applyHit(o,f,{dmg:200,kb:3,hs:8,px:f.x,py:f.y-150,kind:'melee'});return {primeiro:Math.round(h0-h1),segundo:Math.round(h1-f.hp)}});
await p.waitForTimeout(600);
const x0=await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;f.x=600;o.x=760;neutral?0:0;return [f.x,o.x]}).catch(()=>0);
for(let i=0;i<3;i++){await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;o.inv=0;o.state='idle';__dbg.applyHit(f,o,{dmg:20,kb:0,hs:2,px:o.x,py:o.y-150,kind:'melee'})});await p.waitForTimeout(120)}
await p.waitForTimeout(400);R.teleporte=await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;return {sungX:Math.round(f.x),inimigoX:Math.round(o.x),ladoOposto:(f.x>o.x)}});
R.sobrev=await p.evaluate(async()=>{const G=__dbg.G,[f]=G.p,M=f.mhp||3600,s0=f.tsp||1;f.hp=M*.45;await new Promise(r=>setTimeout(r,300));return {surv:f.sjSurv,tsp:+(f.tsp/s0).toFixed(2)}});
R.sangue=await p.evaluate(async()=>{const G=__dbg.G,[f]=G.p,M=f.mhp||3600;f.hp=M*.15;await new Promise(r=>setTimeout(r,300));const a=f.hp/M;f.hp=M*.12;await new Promise(r=>setTimeout(r,300));return {depois:+a.toFixed(3),segundaVez:+(f.hp/M).toFixed(3)}});
R.forma=await p.evaluate(()=>{__pvT.trf();return 1});await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:60000});
await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;f.hp=f.mhp||3600;f.x=600;o.x=820;f.facing=1;f.buf.punch=G.frame});await p.waitForTimeout(2600);await p.keyboard.press('j');await p.waitForTimeout(90);await p.screenshot({path:'/tmp/sung_roxo.png'});
R.vel=await p.evaluate(()=>__pvT.skdv?__pvT.skdv().sp:0);
R.aneis=await p.evaluate(()=>{try{return anSlots('sung')}catch(e){return 'x'}});
console.log(JSON.stringify(R),E.slice(0,5));await b.close()})();
