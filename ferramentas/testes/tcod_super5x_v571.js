// v571: código (hash yxllzo) — super evento pessoal 3 h (5x XP, 5x estrelas, 2x força, 2x crítico, 2x velocidade) + anel SP. Rode com COD=TEXTO.
const {chromium}=require('playwright');const COD=process.env.COD||'';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const run=async(use)=>{const p=await b.newPage({viewport:{width:915,height:422}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  const r=await p.evaluate(async([c,use])=>{const E=document.createElement('div');document.body.appendChild(E);if(use)await __pvT.cup(c.toLowerCase(),E);
    const e=__pvT.evX(),o={t:0,d:0,s:0,w:0,l:0,sq:0,bt:0,bd:0},st=__pvT.pvStep(o,true),L=__pvT.anL();
    const fim=JSON.parse(localStorage.rk_pb5||'null');return {txt:E.textContent,on:__pvT.pb5On(),xp:e?e[2]:1,gain:st.gain,ring:L.filter(x=>x.c===5&&x.g===8&&x.s==='dano'&&x.s2==='crit').length,h:fim?(fim.e-Date.now())/3600e3:0}},[COD,use]);
  await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true};__pvT.treino('goku','goku','treino')});await p.waitForTimeout(9000);
  const f=await p.evaluate(()=>{const G=__pvT.G();G.gmode='boss';try{__pvT.pvc.ap()}catch(e){};const a=G.p&&G.p[0],d=G.p&&G.p[1];return a?{tdm:a.tdm,tcr:a.tcr,sp:__pvT.spM(a),spCpu:__pvT.spM(d)}:null});await p.close();return Object.assign(r,{f})};
  const A=await run(1),N=await run(0);console.log(JSON.stringify(A));console.log(JSON.stringify(N));
  chk(A.on&&A.h>2.9&&A.h<=3,'evento ativo por 3 horas');chk(A.xp===N.xp*5,'5x XP (por cima do evento: '+A.xp+' vs '+N.xp+')');chk(A.gain===N.gain*5,'5x estrelas ('+A.gain+' vs '+N.gain+')');
  chk(A.ring===1,'anel dourado SP dano+crítico');chk(A.f&&N.f&&Math.abs(A.f.tdm/N.f.tdm-2)<1e-6,'2x força ('+(A.f&&A.f.tdm)+' vs '+(N.f&&N.f.tdm)+')');
  chk(A.f&&N.f&&A.f.tcr===N.f.tcr*2+5,'2x crítico');chk(A.f&&N.f&&Math.abs(A.f.sp/N.f.sp-2)<1e-6&&Math.abs(A.f.spCpu-N.f.spCpu)<1e-6,'2x velocidade (só no jogador)');
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
