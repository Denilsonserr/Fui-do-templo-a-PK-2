// v568: Vini 4x em tudo por 40 min (XP, estrelas, drop, gemas, sorte, anel)
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const run=async(nome,t)=>{const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());await p.clock.install({time:t});
    await p.addInitScript(n=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',tw_nome:JSON.stringify(n)})}},nome);
    await p.goto('http://localhost:8790/index.html');await p.clock.runFor(3000);const x=await p.evaluate(()=>{__pvT.vn40Apply();const e=__pvT.evX();const m=__pvT.m();const o={t:0,d:0,s:0,w:0,l:0,sq:0,bt:0,bd:0};const st=__pvT.pvStep(o,true);return {xp:e?e[2]:1,gain:st.gain,gem:m[0],luck:m[1],anel:m[3],dk:__pvT.dropK()}});await p.close();return x};
  let a=await run('Vini_junior10',Date.UTC(2026,10,20,19,0));console.log(JSON.stringify(a));chk(a.xp===8&&a.gain===8,'Vini: XP 8x e +8 estrelas (4x por cima do evento 2x)');chk(a.gem===4&&a.luck===4&&a.anel===8&&Math.abs(a.dk-4.8)<1e-9,'Vini: gemas 4x, sorte 4x, anel 8x, drop 4x por cima do evento');
  a=await run('Breno',Date.UTC(2026,10,20,19,0));console.log(JSON.stringify(a));chk(a.xp===2&&a.gain===2&&a.gem===1&&Math.abs(a.dk-1.2)<1e-9,'outro jogador: só o evento 2x');
  a=await run('Vini_junior10',Date.UTC(2026,10,20,19,30));console.log(JSON.stringify(a));chk(a.xp===2&&a.gain===2&&Math.abs(a.dk-1.2)<1e-9,'depois das 16:25 volta ao normal');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
