// v632: moedas douradas que caem jogando −70% (torre nova, torre antiga, portais); códigos/prêmios não mudam
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_own:'["goku"]',tw_moedas:'0'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{const M=()=>+JSON.parse(localStorage.tw_moedas||'0');const o={};let a=M();try{__tn.tnStart(0)}catch(e){}const T=__tn.TN();T.on=0;a=M();__vw.tnCoins(100);o.torreNova=M()-a;
    o.torreAntiga=[__vw.twCoinWin(120,0,0)];a=M();try{__vw.hyGrant({k:'mo',n:100})}catch(e){o.err=e.message}o.portal=M()-a;a=M();localStorage.tw_moedas=JSON.stringify(a+1000);o.direto=M()-a;o.twCoinWinBase=__vw.twCoinWin(600,0,40);return o});
  console.log(JSON.stringify(r));chk(r.torreNova===30,'torre nova: 100 → 30');chk(r.portal===30,'portal: 100 → 30');chk(r.torreAntiga[0]>0,'torre antiga também passa pelo corte ('+r.torreAntiga[0]+')');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
