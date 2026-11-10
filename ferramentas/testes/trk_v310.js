// v310: ao abrir o jogo (servidor novo), o rank do jogador entra no ranking
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const [n,rp] of [['Ana',5200],['Beto',900]]){const c=await b.newContext();const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
 await p.addInitScript(([n,rp])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(n),rk_rp:String(rp)})}},[n,rp]);
 await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(9000);await c.close()}
const c=await b.newContext();const p=await c.newPage();await p.route(/fonts\.g/,r=>r.abort());await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Caio"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(1500);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});await p.evaluate(()=>document.querySelector('#rkWrap [data-a="ranking"]').click());await p.waitForTimeout(3000);
await p.screenshot({path:'shots/rk310.png'});console.log(await p.evaluate(()=>(document.querySelector('#rkModal')||{}).innerText.slice(0,400).replace(/\n+/g,' | ')),'erros',JSON.stringify(errs));await b.close()})();
