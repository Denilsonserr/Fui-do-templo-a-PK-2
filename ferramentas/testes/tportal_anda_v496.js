// v496: no portal o personagem anda virado para onde vai (não de costas) e fica no chão ao trocar de sala
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Caçador"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1'})}});
await p.goto(process.env.URL||'http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const T=await p.evaluate(()=>{let t=Date.now();for(let k=0;k<200;k++){const N=__pt.now(t);if(N.st==='aberto')return t+5000;t+=60000}return 0});
await p.clock.install({time:T});await p.reload();await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.rkO('pt'));await p.waitForTimeout(1500);await p.evaluate(()=>{document.querySelectorAll('#rkModal,#lvrzM,#acM').forEach(x=>x.hidden=true)});
await p.evaluate(()=>document.querySelector('[data-a="ptGo"]').click());await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);
for(let k=0;k<60;k++){const d=await p.evaluate(()=>{const G=__dbg.G,H=__pt.HY();if(H.gate||H.busy)return 1;const o=G.p[1];if(o&&!o.ko&&!o.hyIdle){o.hp=0;__pvT.ko(G.p[0],o)}for(const m of H.mobs.slice()){if(!m.ko){m.hp=0;__pvT.ko(G.p[0],m)}}return 0});if(d)break;await p.waitForTimeout(250)}
await p.waitForTimeout(800);const fc=()=>p.evaluate(()=>__dbg.G.p[0].facing);
await p.keyboard.down('a');await p.waitForTimeout(500);const esq=await fc();await p.keyboard.up('a');await p.keyboard.down('d');await p.waitForTimeout(500);const dir=await fc();
await p.evaluate(()=>{const a=__dbg.G.p[0];a.flying=true;a.grounded=false;a.y=286});await p.keyboard.up('d');
await p.evaluate(()=>__pt.next());await p.waitForTimeout(1500);const nova=await p.evaluate(()=>{const a=__dbg.G.p[0];return {y:a.y,gr:a.grounded,fl:a.flying,st:a.state,room:__pt.R().room}});
console.log(JSON.stringify({andandoEsquerda:esq,andandoDireita:dir,nova}),E.slice(0,3));await b.close()})();
