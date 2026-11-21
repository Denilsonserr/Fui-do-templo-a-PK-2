// v596: evento até 21/11 23:59 (Brasília): 3x Beru (9%), 2x estrelas PVP, 2x XP de rank (por cima do evento 2x geral)
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const run=async(t)=>{const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());await p.clock.install({time:t});
    await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',tw_nome:'"Bia"'})}});
    await p.goto('http://localhost:8790/index.html');await p.clock.runFor(3000);const x=await p.evaluate(()=>{__pvT.evbApply();const e=__pvT.evX();const o={t:0,d:0,s:0,w:0,l:0,sq:0,bt:0,bd:0};const st=__pvT.pvStep(o,true);return {xp:e?e[2]:1,nm:e?e[3]:'',gain:st.gain,be:__pvT.beCh()}});await p.close();return x};
  let a=await run(Date.UTC(2026,10,22,1,0));console.log(JSON.stringify(a));chk(a.xp===4&&a.gain===4,'22:00: XP 4x e 4 estrelas (2x do evento novo por cima do 2x geral)');chk(a.be===9,'Beru 9% (3x)');
  a=await run(Date.UTC(2026,10,22,3,10));console.log(JSON.stringify(a));chk(a.xp===2&&a.gain===2&&a.be===3,'depois de 23:59 volta ao evento 2x geral e Beru 3%');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
