// v525: anti-trapaça de voltar o save (gastou/perdeu → apagou → entrou de novo): desfaz e pune
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const acts=[],chx=[];let chxSrv=0;
  const base={rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',tw_nome:'"Esperto"',tw_uid:'"u_e"',rk_gem:'10000',rk_tic:'20',
    tw_inv:JSON.stringify([{id:'itA',t:'arm',r:'mit',nm:'ARMADURA X'},{id:'itB',t:'cap',r:'lend',nm:'ELMO Y'}]),ac_n:'esperto',ac_k:'kk',ac_t:String(Date.now()-6e5)};
  const run=async(ls,fn)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
    await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),bd=r.request().postData()||'';
      if(/documentId=act_/.test(u)){acts.push(JSON.parse(bd).fields);return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})}
      if(/documentId=chx_/.test(u)){chx.push(JSON.parse(bd).fields);return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})}
      if(/:runQuery/.test(u)&&/"act"/.test(bd))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(acts.map((f,i)=>({document:{name:'x/a'+i,fields:f}})))});
      if(/:runQuery/.test(u)&&/"chx"/.test(bd))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(Array.from({length:chxSrv},(_,i)=>({document:{name:'x/c'+i,fields:{chx:{stringValue:'a'}}}})))});
      if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
    await p.addInitScript(ls=>{window.__actNoNewer=1;if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,ls)}},ls);
    await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(10000);const r=await fn(p);await p.close();return r};
  /* 1) joga normal: gasta 3.000 gemas e joga fora o item A */
  const st1=await run(base,async p=>{await p.evaluate(()=>{localStorage.setItem('rk_gem','7000');const I=JSON.parse(localStorage.tw_inv).filter(x=>x.id!=='itA');localStorage.setItem('tw_inv',JSON.stringify(I))});await p.waitForTimeout(4000);return await p.evaluate(()=>({...localStorage}))});
  chk(acts.length===1&&acts[0].dg.integerValue==='3000'&&acts[0].it.stringValue==='itA','gasto e item perdido viraram registro no servidor');
  /* 2) mesmo aparelho, sem voltar o save: nada acontece */
  const keep=await run(st1,async p=>p.evaluate(()=>({gem:localStorage.rk_gem,m:!!document.querySelector('.actM')})));chk(keep.gem==='7000'&&!keep.m,'jogando normal: sem falso alarme');
  /* 3) TRAPAÇA: apagou e entrou de novo (salvamento antigo, com as gemas e o item) → desfaz + aviso */
  const r1=await run(base,async p=>p.evaluate(()=>({gem:localStorage.rk_gem,inv:JSON.parse(localStorage.tw_inv).map(x=>x.id),m:(document.querySelector('.actM')||{}).textContent||''})));
  console.log(JSON.stringify(r1));chk(r1.gem==='7000'&&r1.inv.join()==='itB','voltar o save não devolve nada (gemas e item tirados de novo)');chk(/TRAPAÇA DETECTADA/.test(r1.m)&&/AVISO/.test(r1.m)&&chx.length===1,'1ª vez: aviso e o ADM fica sabendo');
  /* 4) 2ª vez → multa de 20% e 3 dias sem mercado */
  chxSrv=1;const r2=await run(base,async p=>p.evaluate(()=>({gem:localStorage.rk_gem,ban:+localStorage.rk_mnBan||0,m:(document.querySelector('.actM')||{}).textContent||''})));
  console.log(JSON.stringify({...r2,m:r2.m.slice(0,120)}));chk(r2.gem==='5600'&&r2.ban>Date.now()+2.9*864e5&&/PUNIÇÃO/.test(r2.m),'2ª vez: multa de 20% (7.000 → 5.600) e 3 dias sem Mercado Negro');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
