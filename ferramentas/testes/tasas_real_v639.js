// v639: missões do evento das asas contando numa LUTA DE CHEFE de verdade (rkBossStart → KO → endRound → rkAfter → btRec)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_own:'["goku"]',
    rk_asev:JSON.stringify({k:'as2',pen:0,got:0,xp:0,M:[{k:'boss',p:0},{k:'any',p:0},{k:'anyw',p:0},{k:'boss5',p:0},{k:'bossT',p:0}]})})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  for(let r=0;r<2;r++){
    await p.evaluate(()=>{document.querySelectorAll('#adPass,#asEv,#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__vw.rkBossStart()});
    await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(3000);
    await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;o.hp=1;__pvT.ko(a,o)});
    for(let i=0;i<40;i++){const m=await p.evaluate(()=>__dbg.G.mode);if(m!=='fight')break;await p.evaluate(()=>{const G=__dbg.G;const o=G.p&&G.p[1];if(o&&!o.ko){o.hp=1;__pvT.ko(G.p[0],o)}});await p.waitForTimeout(1000)}
    await p.waitForTimeout(6000);
    const o=await p.evaluate(()=>({a:JSON.parse(localStorage.rk_asev),bt:(JSON.parse(localStorage.rk_bt||'[]')[0]||{}).m,mode:__dbg.G.mode}));console.log('luta',r+1,JSON.stringify(o))}
  const o=await p.evaluate(()=>JSON.parse(localStorage.rk_asev));chk(o.xp>=20,'XP da asa subiu com as lutas ('+o.xp+')');chk(o.M.find(q=>q.k==='boss').p===2,'"Derrote 3 chefes" contou 2/3');chk(o.M.find(q=>q.k==='any').p===2,'"Jogue 6 partidas" contou 2/6');
  console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok?'TUDO OK':'FALHOU');await b.close()})();
// parte 2: andares da torre contam
(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const p=await b.newPage({viewport:{width:915,height:412}});await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',rk_own:'["goku"]',rk_sel:'"goku"',
    rk_asev:JSON.stringify({k:'as2',pen:0,got:0,xp:0,M:[{k:'andar',p:0},{k:'any',p:0},{k:'pve',p:2},{k:'boss',p:0},{k:'pvp',p:0}]}),rk_alev:JSON.stringify({k:'al1',n:0,got:0})})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  const ks=await p.evaluate(()=>__vw.asG().M.map(q=>q.k));chk(!ks.includes('pve'),'missão antiga do modo clássico foi trocada ('+ks.join(',')+')');
  await p.evaluate(()=>{localStorage.removeItem('rk_tnrun');__tb2.go()});
  for(let f=0;f<2;f++){await p.waitForFunction(()=>{const G=__tb2.G(),T=__tb2.TN();return G.mode==='fight'&&G.phase==='fight'&&T.on},null,{timeout:60000});await p.waitForTimeout(800);
    for(let i=0;i<40;i++){const s=await p.evaluate(()=>{const G=__tb2.G(),T=__tb2.TN();try{const P=G.p[0];P.hp=P.mhp;const B=G.p[1];if(B&&!B.ko&&T.ph==='boss'){B.hp=0;__pvT.ko(P,B)}}catch(e){}const M=document.getElementById('tnPick');if(M&&M.classList.contains('on')){const c=M.querySelector('.tnC');c&&c.click()}return G.mode});if(s==='tower')break;await p.waitForTimeout(1000)}
    await p.waitForTimeout(1500);if(f===0)await p.evaluate(()=>__tb2.go())}
  const o=await p.evaluate(()=>({a:__vw.asG(),al:JSON.parse(localStorage.rk_alev)}));console.log(JSON.stringify(o));
  chk(o.a.M.find(q=>q.k==='andar').p===2,'"Vença 4 andares" contou 2/4');chk(o.a.M.find(q=>q.k==='any').p===2,'"Jogue 6 partidas" contou os 2 andares');chk(o.a.xp===30,'XP da asa +15 por andar ('+o.a.xp+')');chk(o.al.n===2,'Evento do Alucard também contou os 2 andares');
  console.log(ok?'TUDO OK 2':'FALHOU 2');await b.close()})();
