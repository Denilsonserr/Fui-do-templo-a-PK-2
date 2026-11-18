// v529: código PRIMORDIALX2
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t529_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  const r=await p.evaluate(async()=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup('primordialx2',E);const o=__pvT.psG(),L=__pvT.anL();return {txt:E.textContent,jn:o.jn,jp:o.jp,ring:L[L.length-1],n:L.filter(x=>x.g===8&&x.s==='dano'&&x.s2==='crit'&&x.l===60).length}});
  console.log(JSON.stringify(r));chk(r.jn===1000&&r.jp===2,'1.000 Joias Negras + 2 Joias Primordiais');chk(r.n===3,'3 anéis dourados SP dano + crítico');
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__pvT.psOpen()});await p.waitForTimeout(800);
  await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});await p.click('.psTabs [data-k="ch"]');await p.waitForTimeout(300);await p.click('.psCell[data-p="sel"]');await p.waitForTimeout(400);await p.screenshot({path:SH+'antes.png'});
  await p.click('.psJxB.p');await p.waitForTimeout(6000);await p.screenshot({path:SH+'depois.png'});
  const o=await p.evaluate(()=>__pvT.psG());console.log(JSON.stringify({pend:o.pend,jp:o.jp,jn:o.jn}));chk(o.pend&&o.pend.r==='pri'&&o.jp===1&&o.jn===1000,'giro com a Joia Primordial deu PRIMORDIAL (não gastou Joia Negra)');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
