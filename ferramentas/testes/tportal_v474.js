// v474: monstros acertam o jogador (parado e batendo), vida dos monstros pelo rank, sem anel no baú, sem pulo ao atravessar
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_own:'["goku","sung"]',rk_sel:'"sung"',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(1500);
const R={};
for(const rk of [0,5]){
 await p.evaluate(rk=>__pt.start({r:rk,id:'t'+rk}),rk);await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
 const vida=await p.evaluate(()=>{const H=__pt.HY(),G=__dbg.G;const P=G.p[0];P.x=900;P.hp=P.mhp=1e6;const L=[];for(const [k,lv] of [['dem',2],['esq',2],['dem',3]]){const m=__pn.mk(k,650+L.length*300,{lv});H.mobs.push(m);L.push(Math.round(m.mhp))}return L});
 const h0=await p.evaluate(()=>__dbg.G.p[0].hp);await p.waitForTimeout(5000);const h1=await p.evaluate(()=>__dbg.G.p[0].hp);
 /* jogador batendo sem parar: os monstros ainda acertam? */
 await p.evaluate(()=>{__pn.st.t=0;__pn.st.ok=0;window.__hc=0;let h=__dbg.G.p[0].hp;window.__iv=setInterval(()=>{const x=__dbg.G.p[0].hp;if(x<h-1)window.__hc++;h=x},30)});for(let i=0;i<26;i++){await p.keyboard.press('j');await p.waitForTimeout(150)}const hits=await p.evaluate(()=>{clearInterval(window.__iv);const G=__dbg.G,P=G.p[0];return window.__hc+' tent'+__pn.st.t+' ok'+__pn.st.ok+' | '+__pt.HY().mobs.map(m=>m.state+'/'+(m.pn&&m.pn.atk?m.pn.atk.a:'-')+'/d'+Math.round(m.x-P.x)+'/hs'+m.hitstun).join(' ')+' | p:'+P.state+' inv'+P.inv});
 R['rank'+rk]={vidaMonstros:vida,danoParado5s:Math.round(h0-h1),golpesLevadosBatendo4s:hits};
 await p.evaluate(()=>{const G=__dbg.G,f=G.p[0];f.hp=0;__pvT.ko(G.p[1],f)});await p.waitForTimeout(5000);await p.evaluate(()=>{const M=document.getElementById('lvrzM');if(M)M.remove()})}
/* baú: sem anel */
const an=await p.evaluate(()=>{let n=0;const r0=Math.random;for(let i=0;i<200;i++){}return n});
console.log(JSON.stringify(R),E.slice(0,3));await b.close()})();
