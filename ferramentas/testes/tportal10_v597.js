// v597: portal rank S a cada 10 min até 21/11 23:59 (Brasília): conta quantos ciclos de portal têm rank S num intervalo de 3 h
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const run=async(t0)=>{const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());await p.clock.setFixedTime(t0);
    await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',tw_nome:'"Bia"'})}});
    await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(3000);
    const r=await p.evaluate(t0=>{const seen={};for(let t=t0;t<t0+3*36e5;t+=6e4){const N=__pvT.ptNow(t);if(N&&N.i!=null&&(N.st==='aberto')){seen[N.i]=!!__pvT.ptGS()[N.i]}}const v=Object.values(seen);return {ciclos:v.length,S:v.filter(x=>x).length}},t0);await p.close();return r};
  let a=await run(Date.UTC(2026,10,21,23,50));console.log(JSON.stringify(a));chk(a.ciclos>0&&a.S===a.ciclos,'hoje 20:50–23:50: TODO ciclo de portal tem rank S ('+a.S+'/'+a.ciclos+')');
  a=await run(Date.UTC(2026,10,22,12,0));console.log(JSON.stringify(a));chk(a.S<a.ciclos,'amanhã volta a cada 20 min ('+a.S+'/'+a.ciclos+')');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
