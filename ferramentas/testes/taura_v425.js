// v425: aura de sombra (teste do ADM) — liga no painel e aparece em volta do jogador
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';const CH=process.env.CH||'sung';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(c=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,aura:0,a:c,b:'goku',s:'cupula'})})}},CH);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.waitForTimeout(200);await p.click('.admTg[data-k="aura"]');await p.waitForTimeout(200);const on=await p.evaluate(()=>__pvT.admT().aura);await p.screenshot({path:SH+'aura_painel.png'});
await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);
await p.evaluate(()=>{const G=__dbg.G;G.frame=G.frame-G.frame%660+60});await p.waitForTimeout(300);await p.screenshot({path:SH+'aura_1.png'});
await p.keyboard.down('d');await p.waitForTimeout(400);await p.screenshot({path:SH+'aura_2.png'});await p.keyboard.up('d');
await p.evaluate(()=>{const G=__dbg.G;G.frame=G.frame-G.frame%660+440});await p.waitForTimeout(500);await p.screenshot({path:SH+'aura_3.png'});
console.log(JSON.stringify({on}),errs.slice(0,3));await b.close()})();
