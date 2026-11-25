// v638: evento das asas com XP + missões infinitas (10% de pena por missão). Simula jogadores: quantas partidas até as asas?
const {chromium}=require('playwright');const SH=__dirname+'/shots/t638_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_own:'["goku"]',rk_gem:'0'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1200);
  await p.evaluate(()=>__pvT.treino('goku','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight',null,{timeout:120000});
  const sim=await p.evaluate(()=>{const R=[];const modes=['pvp','pvp','pvp','boss','boss','hidra','torre','caca','dsf','pve'];
    for(let run=0;run<30;run++){localStorage.removeItem('rk_asev');let n=0;
      while(n<2000){const o=__vw.asG();if(o.pen>=10)break;const m=modes[(Math.random()*modes.length)|0],w=Math.random()<.6;__dbg.G._btT=0;__vw.ASF().t=Date.now()-(30+Math.random()*120)*1000;__vw.btRec(m,w);n++;
        /* recolhe o que ficou pronto (como o jogador faria) */const o2=__vw.asG();let ch=0;o2.M.forEach((q,i)=>{const M=__vw.ASM.find(x=>x.k===q.k);if(q.p>=M.n){__vw.asCollect(i);ch=1}})}
      R.push(n)}R.sort((a,b)=>a-b);return {min:R[0],med:R[15],max:R[29],avg:Math.round(R.reduce((a,b)=>a+b)/R.length)}});
  console.log('partidas até as asas (30 jogadores simulados):',JSON.stringify(sim));chk(sim.med>=220,'mais difícil: mediana '+sim.med+' partidas');
  await p.evaluate(()=>{localStorage.removeItem('rk_asev');for(let i=0;i<14;i++){__dbg.G._btT=0;__vw.btRec(['pvp','boss','pve'][i%3],true)}__dbg.G.mode='menu'});await p.evaluate(()=>__vw.asOpen());await p.waitForTimeout(400);await p.screenshot({path:SH+'evento.png'});
  const before=await p.evaluate(()=>{const o=__vw.asG();return {ks:o.M.map(q=>q.k),xp:o.xp,gem:+JSON.parse(localStorage.rk_gem||'0')}});
  const i=await p.evaluate(()=>[...document.querySelectorAll('#asEv .asCl')].findIndex(x=>x.classList.contains('on')));
  if(i>=0){await p.evaluate(i=>document.querySelectorAll('#asEv .asCl')[i].click(),i);const af=await p.evaluate(()=>{const o=__vw.asG();return {ks:o.M.map(q=>q.k),xp:o.xp,gem:+JSON.parse(localStorage.rk_gem||'0')}});
    chk(af.ks[i]!==before.ks[i]&&af.gem-before.gem===100,'RECOLHER: +100 💎 e entra MISSÃO NOVA no lugar');}else chk(false,'tinha missão para recolher');
  await p.screenshot({path:SH+'recolheu.png'});
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
