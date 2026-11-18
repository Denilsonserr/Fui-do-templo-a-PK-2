// v531: código CAIXASP
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t529_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  const r=await p.evaluate(async()=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup('caixasp',E);await new Promise(r=>setTimeout(r,1800));const L=__pvT.anL();return {txt:E.textContent,ring:L[L.length-1],box:!!document.querySelector('.rgBox.op')}});console.log(JSON.stringify(r));const g=r.ring||{};
  chk(g.c===5&&g.g===8&&g.l===60&&!['dano','crit'].includes(g.s)&&!['dano','crit'].includes(g.s2)&&g.s!==g.s2&&!!g.p,'anel dourado SP nível 60 aleatório, sem dano e sem crítico');chk(r.box,'caixa abre com animação');
  await p.screenshot({path:'/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t531_caixa.png'});
  const R=await p.evaluate(()=>{const S={};for(let i=0;i<4000;i++){const [a,b]=__pvT.rgBoxRoll();S[a]=1;S[b]=1;if(['dano','crit'].includes(a)||['dano','crit'].includes(b))return 'ERRO'}return Object.keys(S).sort().join()});chk(R==='drop,st,uv,vel','4.000 sorteios: só velocidade, sorte, drop e vel. ultimate');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
