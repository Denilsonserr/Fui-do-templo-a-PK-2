// v593: código anel VERMELHO SSS dano+crítico (uso único). Rode com COD=TEXTO
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',tw_nome:'"Bia"',tw_uid:'"u_bia"'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(4000);
  const r=await p.evaluate(async c=>{const E=document.createElement('div');await __pvT.cup(c.toLowerCase(),E);const E2=document.createElement('div');await __pvT.cup(c.toLowerCase(),E2);const L=__pvT.anL().filter(x=>x.c===4&&x.g===7&&x.s==='dano'&&x.s2==='crit');return {n:L.length,l:L[0]&&L[0].l,t:E.textContent,t2:E2.textContent}},process.env.COD||'');
  console.log(JSON.stringify(r));chk(r.n===1&&r.l===50,'anel vermelho SSS dano+crítico no nível máximo');chk(/já usou/.test(r.t2),'não usa 2 vezes');
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
