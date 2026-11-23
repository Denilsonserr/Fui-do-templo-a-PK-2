// v629: evento de FÉRIAS (2x por 3 dias) + portal vermelho a cada 10 min + 3x chance de sombra
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_own:'["goku"]'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
  const at=(t)=>p.evaluate(t=>{const N=Date.now,off=t-N();const R=Date.now;Date.now=()=>R()+off;const o={ev:__pvT.ev()&&__pvT.ev()[3],xp:__pvT.ev()&&__pvT.ev()[2],m:__pvT.m(),fer:__vw.ferOn(),be:__vw.beCh(),pt:__vw.ptSE2(),per:__vw.ptSEP()/6e4,ev2x:__vw.ev2xOn(),drop:__vw.rkDropK()};Date.now=R;return o},t);
  let r=await at(Date.UTC(2026,10,24,15,0));console.log('durante',JSON.stringify(r));
  chk(/FÉRIAS/.test(r.ev)&&r.xp===2&&r.m[0]===2&&r.m[1]===2&&r.m[3]===2,'férias: 2x XP, gemas, sorte e anel');chk(r.ev2x&&r.drop>=2*0.6-0.01,'2x drop e estrelas (ev2x ligado, drop '+r.drop+')');
  chk(r.pt&&r.per===10,'portal vermelho a cada 10 min');chk(r.be===9,'Beru 3x (3% → 9%)');
  r=await at(Date.UTC(2026,10,26,15,0));console.log('depois',JSON.stringify(r));chk(!r.fer&&!r.pt&&!r.ev2x&&r.be===3,'depois do dia 26 às 11h tudo volta ao normal');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
