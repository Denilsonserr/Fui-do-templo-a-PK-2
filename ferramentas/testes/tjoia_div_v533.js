// v533: código JOIADIVINA + giro com Divina garantida
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t533_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  const r=await p.evaluate(async()=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup('joiadivina',E);const o=__pvT.psG();return {txt:E.textContent,jn:o.jn|0,jd:o.jd,jp:o.jp|0}});
  console.log(JSON.stringify(r));chk(r.jd===1&&r.jn===0&&r.jp===0&&/JOIA DIVINA/.test(r.txt),'1 Joia Divina (só ela)');
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__pvT.psOpen()});await p.waitForTimeout(800);
  await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});await p.click('.psTabs [data-k="ch"]');await p.waitForTimeout(300);await p.click('.psCell[data-p="sel"]');await p.waitForTimeout(400);await p.screenshot({path:SH+'antes.png'});
  await p.click('.psJxB.d');await p.waitForTimeout(6000);await p.screenshot({path:SH+'depois.png'});
  const o=await p.evaluate(()=>__pvT.psG());console.log(JSON.stringify({pend:o.pend,jp:o.jp,jn:o.jn}));chk(o.pend&&o.pend.r==='div'&&(o.jd|0)===0,'giro com a Joia Divina deu DIVINA');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
