// v580: código 30.000 💎 (uso único). Rode com COD=TEXTO.
const {chromium}=require('playwright');const COD=process.env.COD||'';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',tw_nome:'"Bia"',tw_uid:'"u_bia"',rk_gem:'1000'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(4000);
  const r=await p.evaluate(async c=>{const E=document.createElement('div');document.body.appendChild(E);const g0=JSON.parse(localStorage.rk_gem);await __pvT.cup(c.toLowerCase(),E);const g1=JSON.parse(localStorage.rk_gem);
    const E2=document.createElement('div');await __pvT.cup(c.toLowerCase(),E2);return {d:g1-g0,d2:JSON.parse(localStorage.rk_gem)-g1,t:E.textContent,t2:E2.textContent}},COD);
  console.log(JSON.stringify(r));const ok=r.d===30000&&r.d2===0;console.log((r.d===30000?'OK  ':'FALHA ')+'ganhou 30.000 💎');console.log((r.d2===0?'OK  ':'FALHA ')+'não dá para usar de novo');
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
