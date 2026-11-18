// v532: anel "pegadinha" — aparece normal (anéis/atributos/ranking), mas na luta não soma nada
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Amigo"',tw_uid:'"u_a"',ac_n:'amigo',ac_k:'k',rk_an:JSON.stringify([{i:'nrm',c:4,g:7,s:'vel',v:150,l:50}])})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2500);
  const r=await p.evaluate(async()=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup('aneldorei',E);const L=__pvT.anL(),R=L[L.length-1];
    localStorage.rk_anEq=JSON.stringify({goku:[R.i,'nrm']});return {txt:E.textContent,R,tela:__pvT.anSum('goku'),luta:__pvT.anSumF('goku'),st:__pvT.rgsMine()}});
  console.log(JSON.stringify(r));
  chk(r.R.s==='dano'&&r.R.s2==='crit'&&r.R.g===8&&r.R.l===60&&/ANEL DOURADO SP/.test(r.txt),'código dá o anel SP dano + crítico normal');
  chk(r.tela.dano===840&&r.tela.crit===420,'na tela aparece +840% dano / +420% crítico');chk(r.st.d>=840,'no ranking Maior Status aparece o dano');
  chk(r.luta.dano===0&&r.luta.crit===0&&r.luta.vel>0,'na luta: o anel não soma nada (o outro anel continua valendo)');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
