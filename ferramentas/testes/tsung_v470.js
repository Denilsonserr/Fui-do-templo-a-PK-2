// v470: combo do Sung com 11 golpes, recarga do combo 2 s, dash teleporta atrás e atordoa ~0,5 s
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.treino('sung','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
const R={};
for(const form of [0,1]){
 if(form){await p.evaluate(()=>__pvT.trf());await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:60000});await p.waitForTimeout(500)}
 await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;G.noAI=true;f.x=600;o.x=740;f.facing=1;o.facing=-1;o.hp=o.mhp||9999;o.inv=0;f.spCD=0;f.sjGd=1;window.__mx=0;let h=o.hp;window.__run=1;const L=()=>{const o=__dbg.G.p[1];const f=__dbg.G.p[0];if(o.hp<h-0.01)window.__mx++;h=o.hp;(window.__lg=window.__lg||[]).push(f.state+':'+f.ytKk+':'+(f.ytHeld?1:0)+':'+o.state);if(window.__run)requestAnimationFrame(L)};requestAnimationFrame(L)});
 await p.keyboard.press('i');await p.waitForTimeout(2600);
 R['combo'+(form?'Transformado':'')]=await p.evaluate(()=>{window.__run=0;const G=__dbg.G,[f]=G.p;const lg=[];for(const x of (window.__lg||[]))if(lg[lg.length-1]!==x)lg.push(x);window.__lg=[];return {lg:lg.slice(0,40).join(' '),golpes:window.__mx,recarga:+(((f.spCD||0)-G.frame)/60).toFixed(1)}});
 await p.waitForTimeout(2500)}
/* dash */
await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;f.x=300;o.x=800;f.facing=1;o.state='idle';o.inv=0;f.sjDsCD=0});await p.waitForTimeout(200);
await p.keyboard.press('d');await p.waitForTimeout(60);await p.keyboard.press('d');await p.waitForTimeout(250);
R.dash=await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;return {sungX:Math.round(f.x),inimigoX:Math.round(o.x),atras:f.x>o.x,atordoado:(o.sjStun||0)>G.frame,estado:o.state}});
await p.screenshot({path:'/tmp/sj_dash.png'});
console.log(JSON.stringify(R),E.slice(0,3));await b.close()})();
