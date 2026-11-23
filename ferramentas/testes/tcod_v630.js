// v630: 2 códigos únicos do Beru + 1 do Shaka full V2. Texto NÃO fica no repo: C1=.. C2=.. C3=.. node tcod_v630.js
const {chromium}=require('playwright');const E_=process.env;
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  const used=new Set();await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});
    const k=(u.match(/documentId=([^&]+)/)||[])[1];if(k){if(used.has(k))return r.fulfill({status:409,contentType:'application/json',body:'{}'});used.add(k)}return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","sung"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k',tw_inv:JSON.stringify([{id:'old1',t:'bot',r:'sec',v:50,dmg:40,nm:'BOTAS DE VIRGEM',skb:'skbot'}])})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  const cup=c=>p.evaluate(async c=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup(c.toLowerCase(),E);return E.textContent},c);
  const t1=await cup(E_.C1);const sh1=await p.evaluate(()=>__pvT.sjSys().sh);chk(sh1.includes('beru'),'código 1 deu o Beru');chk(/já usou/i.test(await cup(E_.C1)),'código 1 só 1 vez');
  await p.evaluate(()=>{const o=__pvT.sjSys();o.sh=o.sh.filter(x=>x!=='beru');localStorage.rk_sj=JSON.stringify(o)});
  const t2=await cup(E_.C2);console.log(t2);chk(/BERU/.test(t2),'código 2 deu o Beru');chk(/já usou/i.test(await cup(E_.C2)),'código 2 só 1 vez');
  const t3=await cup(E_.C3);console.log(t3);const r=await p.evaluate(()=>({own:JSON.parse(localStorage.rk_own),v2:JSON.parse(localStorage.tw_inv).filter(x=>x.v2).map(x=>x.nm+':'+x.v+'/'+(x.dmg||0)),all:JSON.parse(localStorage.tw_inv).length}));console.log(JSON.stringify(r));
  chk(r.own.includes('shaka'),'ganhou o Shaka');chk(r.v2.length===5,'5 peças de Virgem em V2 ('+r.v2.length+')');chk(r.all===5,'a bota que já tinha EVOLUIU (não duplicou)');chk(/já usou/i.test(await cup(E_.C3)),'Shaka só 1 vez');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
