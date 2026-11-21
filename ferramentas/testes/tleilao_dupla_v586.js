// v586: o acerto do leilão rodando várias vezes ao mesmo tempo NÃO pode devolver o mesmo lance mais de 1 vez
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const page=async(nome,t,gem)=>{const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.clock.setFixedTime(t);
    await p.addInitScript(([n,g])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_l2rs1:'1',tw_nome:JSON.stringify(n),tw_uid:'"u_'+n+'"',rk_gem:String(g)})}},[nome,gem]);
    await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(3000);return p};
  const T=Date.UTC(2026,10,21,0,45);
  const a=await page('Ana',T,1000000);await a.evaluate(()=>__pvT.l2.bid('lxa2',500000));await a.waitForTimeout(500);
  const bb=await page('Beto',T+60000,1000000);await bb.evaluate(()=>__pvT.l2.bid('lxa2',501000));await bb.waitForTimeout(3000);
  await a.evaluate(()=>Promise.all([__pvT.l2.settle(),__pvT.l2.settle(),__pvT.l2.settle(),__pvT.l2.settle()]));await a.waitForTimeout(500);
  await a.evaluate(()=>Promise.all([__pvT.l2.settle(),__pvT.l2.settle()]));
  const g=await a.evaluate(()=>JSON.parse(localStorage.rk_gem));chk(g===1000000,'Ana coberta recebe os 500.000 UMA vez só ('+g+')');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
