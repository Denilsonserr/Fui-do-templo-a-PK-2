// v665: código único EVENTO PESSOAL 3x XP por 1 hora. Texto NÃO fica no repo: C1=.. node tcod_v665.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  const r=await p.evaluate(async c=>{const x0=__pvT.ev()?__pvT.ev()[2]:1;const mk=()=>{const E=document.createElement('div');document.body.appendChild(E);return E};const E=mk();await __pvT.cup(c.toLowerCase(),E);
    const e=__pvT.ev(),B=JSON.parse(localStorage.rk_px3||'null');const E2=mk();await __pvT.cup(c,E2);const B2=JSON.parse(localStorage.rk_px3||'null');
    const o={t:3,s:2,p:40,d:0};const st=__pvT.pvStep(o,true);
    const now=Date.now;Date.now=()=>B.e+60000;__vw.px3Apply();const fim=__pvT.ev();Date.now=now;
    return {x0,x:e&&e[2],nm:e&&e[3],min:Math.round((B.e-Date.now())/60000),txt:E.textContent,again:E2.textContent,mesmo:B2.e===B.e,pvp:[o.t,o.s,o.p],fim:fim?fim[5]:null}},process.env.C1);
  console.log(JSON.stringify(r));
  chk(r.x===r.x0*3&&/PESSOAL 3x XP/.test(r.nm),'XP de rank x3 (em cima do evento geral: '+r.x0+'x → '+r.x+'x)');
  chk(r.min>=59&&r.min<=60,'dura 1 hora ('+r.min+' min)');chk(/1 HORA/.test(r.txt)&&/3x XP/.test(r.txt),'mensagem certa');
  chk(/já usou/i.test(r.again)&&r.mesmo,'uso único (2ª vez não soma mais tempo)');
  chk(JSON.stringify(r.pvp)==='[3,2,50]','PVP igual (vitória = +10 pontos de sempre)');chk(r.fim!=='px3','depois de 1 hora acaba sozinho');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
