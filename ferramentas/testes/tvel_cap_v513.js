// v513: anel dourado SP de velocidade não deixa o lutador 9× mais rápido (máx ×2,5) nem o KI 9× (máx ×3) — Torre
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\/v1\//,r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  const an=[{i:'v1',c:5,g:8,s:'vel',v:840,l:60},{i:'v2',c:5,g:8,s:'uv',v:840,l:60},{i:'v3',c:5,g:8,s:'vel',v:840,l:60}];
  await p.addInitScript(an=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","sung","gojo"]',rk_sel:'"sung"',rk_ped:'"sung"',rk_an:JSON.stringify(an),rk_anEq:JSON.stringify({sung:['v1','v2','v3'],gojo:['v1','v2','v3'],goku:['v1','v2','v3']}),tw_moedas:'99999'})}},an);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
  await p.evaluate(()=>{__pvT.G().pick='sung';try{TW.pick='sung'}catch(e){}__pvT.tnS(0)});await p.waitForTimeout(6000);
  await p.waitForFunction(()=>__pvT.G().frame>20,null,{timeout:30000}).catch(()=>{});await p.evaluate(()=>{const f=__pvT.G().p[0];f.tsp=9.4;f.tki=13.6});await p.waitForTimeout(800);const r=await p.evaluate(()=>{const G=__pvT.G(),f=G.p&&G.p[0];return f?{id:f.def&&f.def.id,tsp:f.tsp,tki:f.tki,mode:G.gmode,ph:G.phase,fr:G.frame}:null});console.log(JSON.stringify(r));
  chk(r&&r.tsp<=2.5&&r.tsp>1,'velocidade limitada a ×2,5 na Torre (era ×17)');chk(r&&r.tki<=3,'KI limitado a ×3');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
