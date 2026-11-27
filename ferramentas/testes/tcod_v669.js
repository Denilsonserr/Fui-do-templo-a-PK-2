// v669: código único CASACO CARMESIM (peitoral) + BOTAS DO ALUCARD. Texto NÃO fica no repo: C1=.. node tcod_v669.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  const r=await p.evaluate(async c=>{const inv=()=>JSON.parse(localStorage.tw_inv||'[]');const n0=inv().length;const mk=()=>{const E=document.createElement('div');document.body.appendChild(E);return E};const E=mk();await __pvT.cup(c.toLowerCase(),E);
    const I=inv(),nv=I.slice(n0).map(x=>x.nm+'|'+x.t+'|'+x.r);const E2=mk();await __pvT.cup(c,E2);return {nv,txt:E.textContent,again:E2.textContent,n2:inv().length-I.length}},process.env.C1);
  console.log(JSON.stringify(r));
  chk(r.nv.includes('CASACO CARMESIM|arm|sec')&&r.nv.includes('BOTAS DO ALUCARD|bot|sec')&&r.nv.length===2,'ganhou o peitoral (CASACO CARMESIM) e as BOTAS DO ALUCARD');
  chk(/CASACO CARMESIM/.test(r.txt),'mensagem certa');chk(/já usou/i.test(r.again)&&r.n2===0,'uso único');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
