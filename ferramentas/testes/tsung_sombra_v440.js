// v440: sombra rank C nv1 aguenta 10 golpes (até de ultimate), copia % da força do Sung, some em 15 s
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',rk_sjs:JSON.stringify({cls:'necro'}),admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'sung',b:'shaka',s:'cupula'})})}});
await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForFunction(()=>__pvT.sjOK(),null,{timeout:60000});
const summon=async()=>{await p.keyboard.press('o');await p.waitForTimeout(300);await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:30000});await p.waitForTimeout(1300)};
await p.keyboard.press('u');await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:30000});await p.waitForTimeout(300);await summon();
const B0=await p.evaluate(()=>{const B=__pvT.sjB();return {hp:Math.round(B.hp),cap:Math.round(B.cap),dm:+B.dm.toFixed(2),life:B.life}});
const n=await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;let n=0;while(__pvT.sjB()&&__pvT.sjB().st!=='die'&&n<40){__dbg.applyHit(o,a,{dmg:900,kb:2,hs:2,px:a.x,py:a.y-150,kind:'melee'});n++}return n});
await p.waitForTimeout(2500);await summon();const t0=Date.now();await p.waitForFunction(()=>!__pvT.sjB(),null,{timeout:30000});const vida=(Date.now()-t0)/1000;
console.log(JSON.stringify({B0,golpesUltimate:n,segundosEmCampo:vida}),errs.slice(0,3));await b.close()})();
