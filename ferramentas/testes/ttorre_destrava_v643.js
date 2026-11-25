// v643: torre — vigia independente: sem inimigo vivo → 8 s botão "PRÓXIMO ANDAR", 20 s avança sozinho (mesmo com a luta presa em outra fase)
const {chromium}=require('playwright');const SH=__dirname+'/shots/t643_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',rk_own:'["goku"]',rk_sel:'"goku"'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  const start=async()=>{await p.evaluate(()=>{localStorage.removeItem('rk_tnrun');document.querySelectorAll('#adPass').forEach(x=>x.remove());__tb2.go()});await p.waitForFunction(()=>{const G=__tb2.G(),T=__tb2.TN();return G.mode==='fight'&&G.phase==='fight'&&T.on},null,{timeout:60000});await p.waitForTimeout(800)};
  const keep=()=>p.evaluate(()=>{const P=__tb2.G().p[0];P.hp=P.mhp});
  // 1) luta presa numa fase estranha (phase != fight), boss morto sem a torre perceber → botão aparece e destrava ao tocar
  await start();const g0=await p.evaluate(()=>__tb2.TN().g);
  await p.evaluate(()=>{const G=__tb2.G(),T=__tb2.TN();const B=G.p[1];B.hp=0;T.boss=null;T.ph='zz'});
  for(let i=0;i<9;i++){await keep();await p.waitForTimeout(1000)}
  chk(await p.evaluate(()=>!!document.getElementById('tnEx')),'8 s sem inimigo: aparece o botão ⏭️ PRÓXIMO ANDAR');await p.screenshot({path:SH+'botao.png'});
  const gA=await p.evaluate(()=>{const g=__tb2.TN().g,m=__tb2.G().mode;document.getElementById('tnEx')&&document.getElementById('tnEx').click();return m==='fight'?g:g-1});await p.waitForTimeout(2500);let s=await p.evaluate(()=>({g:__tb2.TN().g,mode:__tb2.G().mode}));chk(s.g===gA+1&&s.mode==='tower','tocou: foi para o próximo andar (vencido)');
  // 2) ninguém toca: avança sozinho em 20 s
  await p.evaluate(()=>__tb2.go());await p.waitForFunction(()=>{const G=__tb2.G(),T=__tb2.TN();return G.mode==='fight'&&G.phase==='fight'&&T.on},null,{timeout:60000});await p.waitForTimeout(800);
  const g1=await p.evaluate(()=>__tb2.TN().g);await p.evaluate(()=>{const G=__tb2.G(),T=__tb2.TN();const B=G.p[1];B.hp=0;T.boss=null;T.ph='zz'});
  for(let i=0;i<23;i++){await keep();await p.waitForTimeout(1000)}s=await p.evaluate(()=>({g:__tb2.TN().g,mode:__tb2.G().mode}));chk(s.g===g1+1&&s.mode==='tower','20 s sem tocar: avançou sozinho');
  // 3) luta normal NÃO mostra o botão
  await p.evaluate(()=>__tb2.go());await p.waitForFunction(()=>{const G=__tb2.G(),T=__tb2.TN();return G.mode==='fight'&&G.phase==='fight'&&T.on},null,{timeout:60000});
  for(let i=0;i<12;i++){await keep();await p.waitForTimeout(1000)}chk(await p.evaluate(()=>!document.getElementById('tnEx')&&__tb2.G().mode==='fight'),'luta normal (chefe vivo): nada aparece, não pula andar');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
