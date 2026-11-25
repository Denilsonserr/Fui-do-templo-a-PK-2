// v637: equipamento de COSTAS + ASAS DA FÊNIX CARMESIM + EVENTO DAS ASAS (5 missões por dia, 10 penas = asas)
const {chromium}=require('playwright');const SH=__dirname+'/shots/t637_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_own:'["goku"]',rk_gem:'0'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1200);
  const clean=()=>p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl,#adPass,#asEv').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});
  await p.click('#mRank');await p.waitForTimeout(2500);await clean();await p.evaluate(()=>__vw.rkView('menu'));await p.waitForTimeout(400);await clean();
  chk(await p.evaluate(()=>!!document.querySelector('.asEvB')),'botão 🪽 EVENTO DAS ASAS no menu');await p.screenshot({path:SH+'menu.png'});
  // evento
  await p.evaluate(()=>document.querySelector('.asEvB').click());await p.waitForTimeout(600);await p.screenshot({path:SH+'evento.png'});
  const T=await p.evaluate(()=>__vw.asToday().map(m=>m.k));console.log('missões de hoje',T);chk(T.length===5&&/^pvp/.test(T[0])&&/^boss/.test(T[1]),'5 missões hoje (1 PVP, 1 chefe, 3 sorteadas)');
  // completa todas as de hoje simulando partidas (vitórias rápidas em cada modo)
  const play=()=>p.evaluate(()=>{const modes=['pvp','boss','hidra','torre','caca','dsf','pve'];for(let r=0;r<10;r++)for(const m of modes){__dbg.G._btT=0;window.__vw.ASF().t=Date.now()-30000;__vw_bt(m)}},0).catch(()=>0);
  await p.evaluate(()=>{window.__vw_bt=m=>{try{btRecX(m)}catch(e){}}});
  await p.evaluate(()=>__pvT.treino('goku','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight',null,{timeout:120000});
  const doAll=()=>p.evaluate(()=>{const modes=['pvp','boss','hidra','torre','caca','dsf','pve'];for(let r=0;r<10;r++)for(const m of modes){__dbg.G._btT=0;__vw.ASF().t=Date.now()-30000;__vw.btRec(m,true)}return __vw.asG()});
  let o=await doAll();console.log(JSON.stringify(o));chk(o.p.every((v,i)=>v>=1),'todas as missões de hoje ficaram prontas');chk(o.pen===0,'pena só vem ao RECOLHER');
  await p.evaluate(()=>{__dbg.G.mode='menu'});await clean();await p.evaluate(()=>__vw.asOpen());await p.waitForTimeout(400);await p.screenshot({path:SH+'feitas.png'});
  const g0=await p.evaluate(()=>+JSON.parse(localStorage.rk_gem||'0'));for(let i=0;i<5;i++){await p.evaluate(i=>document.querySelector('#asEv .asCl[data-i="'+i+'"]').click(),i);await p.waitForTimeout(150)}
  o=await p.evaluate(g0=>({a:__vw.asG(),gem:+JSON.parse(localStorage.rk_gem||'0')-g0}),g0);console.log(JSON.stringify(o));chk(o.a.pen===5&&o.gem===750,'recolheu 5: 🪶 5 penas + 750 💎');
  await p.evaluate(()=>document.querySelector('#asEv .asCl[data-i="0"]').click());o=await p.evaluate(()=>__vw.asG());chk(o.pen===5,'não recolhe 2x');
  chk(await p.evaluate(()=>{document.querySelector('#asEv .asGet').click();return !JSON.parse(localStorage.tw_inv||'[]').some(x=>x.t==='cos')}),'com 5 penas ainda NÃO dá as asas');
  // amanhã
  await p.evaluate(()=>{const N=Date.now,off=24*3600e3;Date.now=()=>N()+off});const T2=await p.evaluate(()=>__vw.asToday().map(m=>m.k));console.log('amanhã',T2);
  o=await p.evaluate(()=>__vw.asG());chk(o.p.every(v=>v===0)&&o.c.every(v=>!v)&&o.pen===5,'dia seguinte: missões novas, penas guardadas');
  await p.evaluate(()=>{__dbg.G.mode='fight'});o=await doAll();await p.evaluate(()=>{__dbg.G.mode='menu'});await p.evaluate(()=>__vw.asOpen());for(let i=0;i<5;i++){await p.evaluate(i=>document.querySelector('#asEv .asCl[data-i="'+i+'"]').click(),i);await p.waitForTimeout(150)}
  await p.screenshot({path:SH+'10penas.png'});await p.evaluate(()=>document.querySelector('#asEv .asGet').click());await p.waitForTimeout(800);await p.screenshot({path:SH+'ganhou.png'});chk(await p.evaluate(()=>!document.getElementById('asEv')&&!!document.querySelector('.rkWin')),'animação das asas aparece por cima');
  const it=await p.evaluate(()=>{const I=JSON.parse(localStorage.tw_inv||'[]'),Q=JSON.parse(localStorage.tw_eqp||'{}');const w=I.find(x=>x.t==='cos');return {w,eq:Q.cos===(w&&w.id),dano:__vw.twEqB('dano'),crit:__vw.eqCrit(),vel:__vw.twEqB('vel'),vida:__vw.twEqB('vida'),a:__vw.asG()}});console.log(JSON.stringify(it));
  chk(it.w&&it.w.nm==='ASAS DA FÊNIX CARMESIM'&&it.a.got===1,'10 penas: ganhou as ASAS DA FÊNIX CARMESIM');chk(it.eq,'já equipou nas COSTAS');chk(it.dano>=120&&it.crit>=90&&it.vel>=60&&it.vida>=80,'asas contam na força: dano 120 · crítico 90 · velocidade 60 · defesa 80');
  // telas do personagem/equipamentos
  await p.evaluate(()=>{document.querySelectorAll('.rkWin').forEach(x=>x.remove())});await p.reload();await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);await clean();await p.evaluate(()=>{__vw.rkView('lib')});await p.waitForTimeout(800);await clean();await p.screenshot({path:SH+'personagem.png'});
  chk(await p.evaluate(()=>!!document.querySelector('.lbSl[data-s="cos"].on img')),'Personagem: asas aparecem no quadrado das costas');
  await p.evaluate(()=>document.querySelector('[data-a="tab"][data-t="eq"]').click());await p.waitForTimeout(600);await p.screenshot({path:SH+'equip.png'});chk(await p.evaluate(()=>!!document.querySelector('.lbSl[data-s="cos"].on')&&!document.querySelector('.lbSl.lk')),'Equipamentos: espaço COSTAS no lugar do EM BREVE');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
