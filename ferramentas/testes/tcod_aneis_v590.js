// v590: códigos de anel dourado SP (dano+crítico e sorte+drop), uso único. Rode com C1=TEXTO1 C2=TEXTO2
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',tw_nome:'"Bia"',tw_uid:'"u_bia"'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(4000);
  const r=await p.evaluate(async([a,b])=>{const E=document.createElement('div');await __pvT.cup(a.toLowerCase(),E);const E2=document.createElement('div');await __pvT.cup(b.toLowerCase(),E2);const E3=document.createElement('div');await __pvT.cup(a.toLowerCase(),E3);
    const L=__pvT.anL().filter(x=>x.c===5&&x.g===8);return {d:L.filter(x=>x.s==='dano'&&x.s2==='crit').length,s:L.filter(x=>x.s==='st'&&x.s2==='drop').length,t3:E3.textContent}},[process.env.C1||'',process.env.C2||'']);
  console.log(JSON.stringify(r));chk(r.d===1,'anel SP dano+crítico');chk(r.s===1,'anel SP sorte+drop');chk(/já usou/.test(r.t3),'não usa 2 vezes');
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
