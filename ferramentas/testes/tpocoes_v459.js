// v459: POÇÃO DA VIDA NOVA (volta com 100% uma vez) e POÇÃO DAS SOMBRAS (TANK +50% vida/dano) — bebidas antes (rk_pk_vida / rk_pk_somb)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_pk_vida:JSON.stringify({r:'mit',v:100}),rk_pk_somb:JSON.stringify({r:'mit',v:50}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.treino('sung','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
const a=await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;return {vn:f.rkVN,sb:f.sjSB,guard:localStorage.rk_pk_vida||null}});
await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;G.noAI=true;f.hp=0;__pvT.ko(o,f)});await p.waitForTimeout(600);
const b1=await p.evaluate(()=>{const G=__dbg.G,[f]=G.p;return {hp:Math.round(f.hp),mhp:f.mhp,ko:f.ko,ph:G.phase,vn:f.rkVN}});
await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;f.hp=0;__pvT.ko(o,f)});await p.waitForTimeout(600);const b2=await p.evaluate(()=>{const G=__dbg.G,[f]=G.p;return {ko:f.ko,ph:G.phase}});
console.log(JSON.stringify({armado:a,vidaNova:b1,segundaVez:b2}),E);await b.close()})();
