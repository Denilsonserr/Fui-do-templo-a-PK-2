// v592: títulos PILAR SUPREMO e PATROCINADOR + códigos (uso único). Rode com C1=TEXTO_PILAR C2=TEXTO_PATROCINADOR
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const p=await b.newPage({viewport:{width:700,height:300},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',tw_nome:'"Bia"',tw_uid:'"u_bia"'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(4000);
  const r=await p.evaluate(async([a,b])=>{const E=document.createElement('div');await __pvT.cup(a.toLowerCase(),E);const t1=JSON.parse(localStorage.tw_titOn);const E2=document.createElement('div');await __pvT.cup(b.toLowerCase(),E2);
    const L=__pvT.anL(),T=JSON.parse(localStorage.tw_tit),E3=document.createElement('div');await __pvT.cup(a.toLowerCase(),E3);
    return {m1:E.textContent,m2:E2.textContent,t1,t2:JSON.parse(localStorage.tw_titOn),T,ss:L.filter(x=>x.c===3&&x.g===6&&x.s==='st'&&x.s2==='drop').length,sp:L.filter(x=>x.c===5&&x.g===8&&x.s==='st'&&x.s2==='drop').length,sss:L.filter(x=>x.c===4&&x.g===7&&x.s==='dano'&&x.s2==='crit').length,
      b1:__pvT.tb('pilar'),b2:__pvT.tb('patr'),t3:E3.textContent}},[process.env.C1||'',process.env.C2||'']);
  console.log(JSON.stringify(r));
  chk(r.t1==='pilar'&&r.T.includes('pilar'),'código do Vini: título PILAR SUPREMO (já em uso)');chk(r.T.includes('patr')&&r.t2==='patr','código do patrocinador: título PATROCINADOR');
  chk(r.ss===1&&r.sp===1&&r.sss===1,'3 anéis: preto SS sorte+drop, dourado SP sorte+drop, vermelho SSS dano+crítico');
  chk(JSON.stringify(r.b1)===JSON.stringify({dano:30,def:30,vel:30,crit:30,st:30}),'PILAR: +30% em tudo');chk(!r.b2.dano&&r.b2.def===30&&r.b2.vel===30&&r.b2.crit===30&&r.b2.st===30,'PATROCINADOR: +30% em tudo menos dano');chk(/já/.test(r.t3),'não usa 2 vezes');
  await p.evaluate(()=>{document.body.innerHTML='<div style="background:#120a14;padding:30px;display:flex;flex-direction:column;gap:30px;align-items:flex-start;font:700 16px sans-serif">'+__pvT.titH('pilar')+__pvT.titH('patr')+'</div>'});await p.waitForTimeout(1300);await p.screenshot({path:__dirname+'/shots/t592_tit.png'});
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
