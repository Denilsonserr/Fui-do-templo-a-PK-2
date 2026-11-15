// v451: Sung transformado — aura do Monarca sozinha, ataque mais rápido, ESPINHOS DAS SOMBRAS a cada 4 golpes
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));
p.on('request',r=>{if(/documentId=er_/.test(r.url())){try{const f=JSON.parse(r.postData()).fields;E.push('REP '+f.m.stringValue+' @'+f.st.stringValue.split('\n').slice(1,3).join(' ').slice(0,200))}catch(e){}}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.treino('sung','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const ac0=await p.evaluate(()=>{const f=__dbg.G.p[0];return [f.def.sid,f.form||0]});
await p.evaluate(()=>{__dbg.G.noAI=true;__pvT.trf()});await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:60000});
await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;G.noAI=false;f.cpu=true;o.x=f.x+f.facing*150;o.hp=o.mhp=99999});
await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;G.noAI=true;f.cpu=false;f.x=500;o.x=650;o.y=f.y;f.facing=1;o.hp=o.mhp=5000;o.inv=0});
const hp0=await p.evaluate(()=>__dbg.G.p[1].hp);
for(let k=0;k<4;k++){await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;o.inv=0;o.state='idle';__dbg.applyHit(f,o,{dmg:20,kb:0,hs:2,px:o.x,py:o.y-150,kind:'melee'})});await p.waitForTimeout(k<3?250:0)}
const hp1=await p.evaluate(()=>__dbg.G.p[1].hp);await p.waitForTimeout(110);await p.screenshot({path:'/tmp/sung0.png'});await p.waitForTimeout(60);await p.screenshot({path:'/tmp/sung1.png'});await p.waitForTimeout(800);
const hp2=await p.evaluate(()=>__dbg.G.p[1].hp);console.log('dano 4 golpes',Math.round(hp0-hp1),'espinhos',Math.round(hp1-hp2));
await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;o.x=900});await p.waitForTimeout(600);await p.screenshot({path:'/tmp/sung2.png'});
console.log(JSON.stringify({ac0,form:await p.evaluate(()=>__dbg.G.p[0].form),golpe:await p.evaluate(()=>__dbg.G.p[0].sjHc),inimigoHP:await p.evaluate(()=>Math.round(__dbg.G.p[1].hp))}),E);await b.close()})();
