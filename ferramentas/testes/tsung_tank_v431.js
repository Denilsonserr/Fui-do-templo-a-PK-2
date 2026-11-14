// v431: Sung transforma (vídeo) → TANK sobe do chão, ataca o inimigo, absorve todo dano do Sung; quando morre o Sung volta a tomar dano
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:0,en:1,noai:1,vfx:0,a:'sung',b:'goku',s:'cupula'})})}});
await p.goto((process.env.URL||'http://localhost:8790/'));await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.waitForFunction(()=>__pvT.sjOK(),null,{timeout:60000});await p.waitForTimeout(800);
const F=n=>p.evaluate(n=>new Promise(r=>{const G=__dbg.G,f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()}),n);
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;a.sb=6;o.x=a.x+a.facing*420});
await p.keyboard.press('u');await F(60);const tr=await p.evaluate(()=>({trans:!!(__dbg.G.trans&&__dbg.G.trans.sj),st:__dbg.G.p[0].state}));await p.screenshot({path:SH+'tk_video.png'});
await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:30000});await F(20);await p.screenshot({path:SH+'tk_sobe.png'});
await F(60);const b0=await p.evaluate(()=>{const B=__pvT.sjB();return B&&{st:B.st,hp:B.hp,x:B.x|0,form:__dbg.G.p[0].form}});await p.screenshot({path:SH+'tk_parado.png'});
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;o.x=__pvT.sjB().x+__pvT.sjB().dir*180});const oh0=await p.evaluate(()=>__dbg.G.p[1].hp);
await F(14);await p.screenshot({path:SH+'tk_ataque.png'});await F(70);const oh1=await p.evaluate(()=>__dbg.G.p[1].hp);
const h=await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p,hp0=a.hp,bh0=__pvT.sjB().hp;for(let i=0;i<3;i++)__dbg.applyHit(o,a,{dmg:100,kb:2,hs:6,px:a.x,py:a.y-150,kind:'melee',lock:1});return {sungAntes:hp0,sungDepois:a.hp,ursoAntes:bh0,ursoDepois:__pvT.sjB().hp,st:__pvT.sjB().st}});
await F(4);await p.screenshot({path:SH+'tk_defesa.png'});
const k=await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;__dbg.applyHit(o,a,{dmg:5000,kb:2,hs:6,px:a.x,py:a.y-150,kind:'melee',lock:1});return __pvT.sjB().st});await F(20);await p.screenshot({path:SH+'tk_morte.png'});await F(90);
const fim=await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p,hp0=a.hp;__dbg.applyHit(o,a,{dmg:100,kb:2,hs:6,px:a.x,py:a.y-150,kind:'melee',lock:1});return {urso:!!__pvT.sjB(),sungAntes:hp0,sungDepois:a.hp}});
console.log(JSON.stringify({tr,b0,inimigo:[oh0,oh1],h,k,fim}),errs.slice(0,4));await b.close()})();
