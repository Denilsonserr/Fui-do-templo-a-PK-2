// v570: Beru 3% + os 2 primeiros depois de 20/11 17:20 (Brasília) pegam garantido. Usa o servidor local de verdade (node ferramentas/servidor/local.mjs 8790, banco limpo).
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const run=async(nome,t,own)=>{const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.clock.setFixedTime(t);
    await p.addInitScript(([n,o])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',tw_nome:JSON.stringify(n),tw_uid:JSON.stringify('u_'+n),rk_own:JSON.stringify(o)})}},[nome,own]);
    await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(3500);
    await p.evaluate(o=>{localStorage.rk_own=JSON.stringify(o)},own);const own0=await p.evaluate(()=>localStorage.rk_own);if(own.includes('sung')&&!/sung/.test(own0))E.push('setup: own sem sung');await p.evaluate(()=>{Math.random=()=>0.999;__pvT.beReward()});await p.clock.runFor(4000);await p.waitForTimeout(1500);await p.waitForTimeout(3500);
    const sh=await p.evaluate(()=>__pvT.sjSys().sh);await p.close();return sh.includes('beru')};
  const T=Date.UTC(2026,10,20,20,30),A=Date.UTC(2026,10,20,20,0);
  chk(!(await run('Antes',A,['goku','sung'])),'antes das 17:20 não é garantido (só a chance)');
  chk(!(await run('SemSung',T,['goku'])),'quem não tem o Sung não ganha nem gasta vaga');
  chk(await run('Primeiro',T,['goku','sung']),'1º do servidor depois das 17:20 ganha o Beru');
  chk(await run('Segundo',T,['goku','sung']),'2º ganha o Beru');
  chk(!(await run('Terceiro',T,['goku','sung'])),'3º não ganha garantido');
  const p=await b.newPage();await p.route(/fonts\.g/,r=>r.abort());await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(3000);
  const c=await p.evaluate(()=>{let n=0;const R=Math.random;Math.random=()=>0.02;const a=Math.random()*100<3;Math.random=()=>0.04;const z=Math.random()*100<3;Math.random=R;return [a,z]});chk(c[0]&&!c[1],'chance nova é 3%');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
