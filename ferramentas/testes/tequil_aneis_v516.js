// v516: retorno decrescente dos anéis só na luta (tela mostra o valor cheio)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\/v1\//,r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  const an=[{i:'d1',c:5,g:8,s:'dano',v:840,l:60},{i:'d2',c:5,g:8,s:'dano',v:840,l:60},{i:'d3',c:5,g:8,s:'dano',v:840,l:60},{i:'s1',c:5,g:8,s:'st',v:840,l:60}];
  await p.addInitScript(an=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',rk_an:JSON.stringify(an),rk_anEq:JSON.stringify({goku:['d1','d2','d3','s1']})})}},an);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
  const r=await p.evaluate(()=>({tela:__pvT.anSum('goku'),luta:__pvT.anSumF('goku'),one:__pvT.anDR(840),seven:__pvT.anDR(5880),low:__pvT.anDR(300)}));console.log(JSON.stringify(r));
  chk(r.tela.dano===2520&&r.tela.st===840,'tela mostra o valor cheio (dano +2520%, sorte +840)');chk(r.luta.dano===1578&&r.luta.st===840,'na luta: dano rende +1578%, sorte igual');
  chk(r.one===708&&r.low===300&&Math.round(r.seven)===2922,'1 SP +708% · 7 SP +2922% · anéis fracos não mudam');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
