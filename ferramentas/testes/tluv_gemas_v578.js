// v578: +200.000 💎 para quem tem o título LOVE (1 vez por conta)
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const run=async(tit)=>{const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
    await p.addInitScript(t=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',tw_nome:'"Bia"',tw_uid:'"u_bia"',rk_gem:'1000',tw_tit:JSON.stringify(t)})}},tit);
    await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(10000);const g1=await p.evaluate(()=>JSON.parse(localStorage.rk_gem));await p.evaluate(()=>__pvT.luvGift());const g2=await p.evaluate(()=>JSON.parse(localStorage.rk_gem));await p.close();return [g1,g2]};
  let r=await run(['love']);chk(r[0]===201000,'quem tem o título LOVE ganhou 200.000 💎 ('+r[0]+')');chk(r[1]===r[0],'só 1 vez');
  r=await run(['adm']);chk(r[0]===1000,'quem não tem o título não ganha');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
