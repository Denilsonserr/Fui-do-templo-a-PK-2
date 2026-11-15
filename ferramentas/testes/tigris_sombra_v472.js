// v472: IGRIS como sombra do Sung — invoca na ultimate, ataca, teleporta atrás de quem ataca o Sung, segura especial
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_own:'["goku","sung"]',rk_sjs:JSON.stringify({cls:'necro',lv:30,sh:['tank','igris'],eq:'igris'})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.treino('sung','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
await p.evaluate(()=>__pvT.trf());await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:60000});await p.waitForTimeout(400);
await p.evaluate(()=>{const f=__dbg.G.p[0];f.ki=300;f.sb=3});await p.keyboard.press('o');await p.waitForTimeout(400);await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:30000});
await p.waitForFunction(()=>__dbg.G.p[0].sjB,null,{timeout:20000}).catch(()=>{});
const B0=await p.evaluate(()=>{const B=__dbg.G.p[0].sjB;return B?{k:B.k,st:B.st,hp:Math.round(B.hp)}:null});
await p.waitForTimeout(1800);await p.screenshot({path:'/tmp/igs1.png'});
/* goku ataca o Sung → Igris teleporta */
const T=await p.evaluate(async()=>{const G=__dbg.G,[f,o]=G.p,B=f.sjB;if(!B)return null;B.tpc=0;o.x=f.x+180;o.facing=-1;o.state='attack';await new Promise(r=>setTimeout(r,250));return {igrisX:Math.round(B.x),gokuX:Math.round(o.x),estado:o.state}});
await p.waitForTimeout(300);await p.screenshot({path:'/tmp/igs2.png'});
console.log(JSON.stringify({B0,T}),E.slice(0,3));await b.close()})();
