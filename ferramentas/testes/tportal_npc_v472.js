// v472: NPCs do portal (demônio/ceifador com aura, lobo sombrio), drops no chão, sem baú na sala comum, Urso (3 vidas → sombra TANK), Igris (sombra IGRIS)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));
p.on('request',r=>{if(/documentId=er_/.test(r.url())){try{const f=JSON.parse(r.postData()).fields;E.push('REP '+f.m.stringValue+' @'+f.st.stringValue.split('\n').slice(1,3).join(' ').slice(0,200))}catch(e){}}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_own:'["goku","sung"]',rk_sel:'"sung"',rk_sjs:JSON.stringify({cls:'necro',lv:30}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(2000);const clr=()=>p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});await clr();
console.log('sombras antes',await p.evaluate(()=>JSON.stringify(JSON.parse(localStorage.rk_sjs))));
await p.evaluate(()=>__pt.start({r:2,id:'teste'}));
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);
/* põe 4 monstros perto, jogador invencível */
await p.evaluate(()=>{const G=__dbg.G,H=__pt.HY(),P=G.p[0];P.x=900;P.inv=1e6;const L=[['dem',1,'roxo'],['esq',2,'vermelho'],['dem',3,'branco'],['esq',4,'']];L.forEach(([k,lv,v],i)=>{const m=__pn.mk(k,500+i*260,{lv,v});m.facing=-1;H.mobs.push(m)})});
await p.waitForTimeout(2500);await p.screenshot({path:'/tmp/pn_mobs.png'});
const R1=await p.evaluate(()=>{const H=__pt.HY();return H.mobs.map(m=>m.def.name+' hp'+Math.round(m.hp)).join(' | ')});
await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/pn_mobs2.png'});
/* mata todos: drops */
await p.evaluate(()=>{const G=__dbg.G,H=__pt.HY();for(const m of H.mobs.slice()){m.hp=0;__pvT.ko(G.p[0],m)}});await p.waitForTimeout(900);
const D1=await p.evaluate(()=>(__pt.HY().items||[]).map(i=>i.k+(i.n?':'+i.n:'')).join(','));
await p.screenshot({path:'/tmp/pn_drop.png'});
const kill=async()=>{for(let k=0;k<60;k++){const d=await p.evaluate(()=>{const G=__dbg.G,H=__pt.HY();if(H.gate||H.busy)return 1;const o=G.p[1];if(o&&!o.ko&&!o.hyIdle&&!(o.pn&&o.pn.rev)){o.hp=0;__pvT.ko(G.p[0],o)}for(const m of H.mobs.slice()){if(!m.ko){m.hp=0;__pvT.ko(G.p[0],m)}}return 0});if(d)break;await p.waitForTimeout(250)}};
await kill();const bau1=await p.evaluate(()=>(__pt.HY().items||[]).filter(i=>i.k==='bau').length);
/* vai para a sala 5 (Urso) */
await p.evaluate(()=>{__pt.R().room=4});await p.waitForTimeout(300);await p.evaluate(()=>__pt.next());await p.waitForTimeout(2200);
await p.evaluate(()=>{__dbg.G.p[0].inv=1e6});await p.waitForTimeout(2500);await p.screenshot({path:'/tmp/pn_urso.png'});
const U=await p.evaluate(()=>{const o=__dbg.G.p[1];return o.def.name+' vidas'+o.pnLives});
const vidas=[];for(let v=0;v<3;v++){await p.evaluate(()=>{const G=__dbg.G,o=G.p[1];if(!o.ko&&!(o.pn&&o.pn.rev)){o.hp=0;__pvT.ko(G.p[0],o)}});vidas.push(await p.evaluate(()=>{const o=__dbg.G.p[1];return (o.pn?o.pn.k:'?')+':'+o.pnLives+':'+(o.pn&&o.pn.rev?'renascendo':o.ko?'ko':'vivo')}));if(v===0){await p.waitForTimeout(700);await p.screenshot({path:'/tmp/pn_urso_rev.png'})}await p.waitForTimeout(2600)}
await p.waitForTimeout(2000);await p.screenshot({path:'/tmp/pn_sombra.png'});
const ganhou=await p.evaluate(()=>({modal:!!document.getElementById('pnSh'),sh:JSON.parse(localStorage.rk_sjs).sh,urso:localStorage.rk_urso,bau:(__pt.HY().items||[]).filter(i=>i.k==='bau').length}));
await p.evaluate(()=>{const b=document.getElementById('pnShE');if(b)b.click()});await p.waitForTimeout(300);
/* sala 10: Igris (força a chance) */
await p.evaluate(()=>{const H=__pt.HY();if(!H.gate){}__pt.R().room=9});await p.waitForTimeout(300);await p.evaluate(()=>__pt.next());await p.waitForTimeout(2200);await p.evaluate(()=>{__dbg.G.p[0].inv=1e6});await p.waitForTimeout(2500);await p.screenshot({path:'/tmp/pn_igris.png'});
const I=await p.evaluate(()=>__dbg.G.p[1].def.name);
await p.evaluate(()=>{const G=__dbg.G,o=G.p[1],r=Math.random;Math.random=()=>0.001;try{o.hp=0;__pvT.ko(G.p[0],o)}finally{Math.random=r}});await p.waitForTimeout(3000);await p.screenshot({path:'/tmp/pn_igris_sh.png'});
const I2=await p.evaluate(()=>({modal:!!document.getElementById('pnSh'),sh:JSON.parse(localStorage.rk_sjs).sh,eq:JSON.parse(localStorage.rk_sjs).eq}));
console.log(JSON.stringify({mobs:R1,drops:D1,bauSalaComum:bau1,urso:U,vidas,ganhou,igris:I,igrisSombra:I2}),E.slice(0,5));await b.close()})();
