// v562: ANEL DIVINO só do ADM (status ∞, raios vermelho/roxo) + ADM rank máximo
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const mk=async(nome,extra)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
    await p.addInitScript(([n,x])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',tw_nome:JSON.stringify(n),rk_own:'["goku"]'},x||{})}},[nome,extra]);
    await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(8000);return p};
  let p=await mk('Denilson ADM');
  let r=await p.evaluate(()=>{const L=JSON.parse(localStorage.rk_an||'[]'),d=L.find(x=>x.c===6);if(d){const E=JSON.parse(localStorage.rk_anEq||'{}');E.goku=[d.i];localStorage.rk_anEq=JSON.stringify(E)}return {d:!!d,rp:+localStorage.rk_rp,sum:__pvT.anSum('goku')}});
  console.log(JSON.stringify(r));chk(r.d,'ADM ganhou o ANEL DIVINO');chk(r.sum.dano>=99999&&r.sum.crit>=999,'status ∞ (dano '+r.sum.dano+', crit '+r.sum.crit+')');chk(r.rp>=99999999,'ADM com XP máximo (rank ∞)');{const z=await p.evaluate(()=>({own:JSON.parse(localStorage.rk_own),lv:JSON.parse(localStorage.rk_lv||'{}'),dv:JSON.parse(localStorage.rk_an||'[]').filter(x=>x.c===6).length}));console.log(z.own.length,JSON.stringify(z.lv).slice(0,200));chk(z.own.length>=19&&z.own.includes('sung')&&(z.lv.sung||{}).lv===50&&(z.lv.shaka||{}).lv===70&&(z.lv.qingqing||{}).lv===30,'ADM com todos os personagens no nível máximo');chk(z.dv===10,'10 anéis divinos')}
  await p.click('#mRank');await p.waitForTimeout(1500);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
  await p.evaluate(()=>{try{document.querySelector('[data-a="aneis"],[data-a="anel"],[data-a="an"]').click()}catch(e){}});await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/claude-0/anel_div.png'});
  const tx=await p.evaluate(()=>document.body.innerText.match(/∞/g)?.length||0);console.log('∞ na tela:',tx);await p.close();
  p=await mk('Breno',{rk_an:JSON.stringify([{i:'xx1',c:6,g:9,s:'dano',v:9999999,l:99}]),rk_anEq:JSON.stringify({goku:['xx1']})});
  r=await p.evaluate(()=>({n:JSON.parse(localStorage.rk_an||'[]').filter(x=>x.c===6).length,eq:JSON.parse(localStorage.rk_anEq||'{}').goku}));chk(r.n===0&&!r.eq.includes('xx1'),'quem não é ADM perde o anel divino');await p.close();
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
