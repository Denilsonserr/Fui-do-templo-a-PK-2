// v427: AURA DO MONARCA (teste do ADM) — liga no painel; parado, pose 2, correndo (rastro dos olhos)
// precisa do servidor local (node ferramentas/servidor/local.mjs 8790): em file:// o navegador não deixa pintar a textura (getImageData) e cai na cor reserva
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';const CH=process.env.CH||'sung';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(c=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,mon:0,a:c,b:'goku',s:'cupula'})})}},CH);
await p.goto((process.env.URL||'http://localhost:8790/')+'');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.waitForTimeout(200);await p.click('.admTg[data-k="mon"]');await p.waitForTimeout(200);const on=await p.evaluate(()=>__pvT.admT().mon);
await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);
await p.evaluate(()=>{const G=__dbg.G;G.frame=G.frame-G.frame%660+60});await p.waitForTimeout(1500);await p.screenshot({path:SH+'mon_1.png'});
await p.evaluate(()=>{const G=__dbg.G;G.frame=G.frame-G.frame%660+440});await p.waitForTimeout(800);await p.screenshot({path:SH+'mon_2.png'});
await p.evaluate(()=>{const G=__dbg.G;G.frame=G.frame-G.frame%660+60;const [a,o]=G.p;o.x=a.x+900});
await p.keyboard.press('d');await p.waitForTimeout(60);await p.keyboard.down('d');await p.waitForTimeout(450);await p.screenshot({path:SH+'mon_3.png'});await p.keyboard.up('d');
console.log(JSON.stringify({on}),errs.slice(0,3));await b.close()})();
