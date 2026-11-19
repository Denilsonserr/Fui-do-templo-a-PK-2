// v561: 3x XP no ranqueado só para o Vini, por 3 h
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const run=async(nome,t)=>{const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());await p.clock.install({time:t});
    await p.addInitScript(n=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',tw_nome:JSON.stringify(n)})}},nome);
    await p.goto('http://localhost:8790/index.html');await p.clock.runFor(3000);const x=await p.evaluate(()=>{__pvT.vnxApply();const e=__pvT.evX();return e?[e[2],e[3]]:[1,'']});await p.close();return x};
  const T=Date.UTC(2026,10,19,23,0);
  let a=await run('Vini_junior10',T);console.log(a);chk(a[0]===6,'Vini: 3x por cima do evento 2x = 6x');
  a=await run('Breno',T);chk(a[0]===2,'outro jogador: só o evento 2x');
  a=await run('Vini_junior10',Date.UTC(2026,10,20,2,0));chk(a[0]===2,'depois das 3 h volta ao normal');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
