// v426: Sung — cortes azuis oficiais (1º golpe), roxo com raios do 2º em diante, chute sem efeito; aura azul clarinha fraca; parado sem tremer
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'sung',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);
const st=()=>p.evaluate(()=>{const a=__dbg.G.p[0];return {n:a.sjN||0,mv:a.mname,s:a.state,vfx:__pvT.vfxD()}});
await p.evaluate(()=>{const G=__dbg.G;G.frame=G.frame-G.frame%660+60});await p.waitForTimeout(400);await p.screenshot({path:SH+'c_parado.png'});
const xs=[];for(let i=0;i<6;i++){await p.waitForTimeout(110);xs.push(await p.evaluate(()=>Math.round(__dbg.G.p[0].x)))}
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;o.x=a.x+a.facing*170});
await p.keyboard.press('j');await p.waitForTimeout(170);const s1=await st();await p.screenshot({path:SH+'c_1.png'});
await p.keyboard.press('j');await p.waitForTimeout(170);const s2=await st();await p.screenshot({path:SH+'c_2.png'});
await p.keyboard.press('j');await p.waitForTimeout(170);const s3=await st();await p.screenshot({path:SH+'c_3.png'});
await p.waitForTimeout(1200);await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;o.x=a.x+a.facing*170});
await p.keyboard.press('k');await p.waitForTimeout(170);const s4=await st();await p.screenshot({path:SH+'c_chute.png'});
console.log(JSON.stringify({xs,s1,s2,s3,s4}),errs.slice(0,3));await b.close()})();
