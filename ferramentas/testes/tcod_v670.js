// v670: código único "TUDO": todos os personagens, 500k 💎, todos os itens, todos os anéis, set SP, passe 2x. Texto NÃO fica no repo: C1=.. node tcod_v670.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  const r=await p.evaluate(async c=>{const J=k=>JSON.parse(localStorage[k]||'null');const g0=+(J('rk_gem')||0),an0=(J('rk_an')||[]).length;const mk=()=>{const E=document.createElement('div');document.body.appendChild(E);return E};const E=mk();await __pvT.cup(c.toLowerCase(),E);
    const an=J('rk_an')||[],own=J('rk_own'),inv=J('tw_inv')||[],bp=__vw.bpG?__vw.bpG():J('rk_bp');const g1=+(J('rk_gem')||0);const E2=mk();await __pvT.cup(c,E2);
    const R=__ev('RKSP'),need=Object.keys(R).filter(k=>R[k].t!=='poc').map(k=>R[k].nm),chs=['alucard','sung','shaka','yuta',...__ev('RK_MIT'),...__ev('RK_LEG'),...__ev('RK_EPI')].filter(i=>__ev('CH')[i]);
    return {txt:E.textContent,again:E2.textContent,gem:g1-g0,chFalta:chs.filter(i=>!own.includes(i)),nCh:own.length,itFalta:need.filter(n=>!inv.some(x=>x.nm===n)),nIt:need.length,an:an.length-an0,sssCores:[0,1,2,3,4].map(c=>an.filter(x=>x.c===c&&x.g===7).length),sp:an.filter(x=>x.c===5).length,bpOwn:bp&&bp.own,bp}},process.env.C1);
  console.log(JSON.stringify({...r,bp:undefined}));console.log('passe:',JSON.stringify(r.bp).slice(0,200));
  chk(!r.chFalta.length,'todos os personagens ('+r.nCh+')');chk(r.gem===500000,'500.000 💎');chk(!r.itFalta.length,'todos os itens ('+r.nIt+')');
  chk(r.sssCores.every(n=>n===6)&&r.sp===6&&r.an===36,'30 anéis SSS (6 de cada cor) + 6 anéis DOURADOS SP');chk(r.bpOwn>=2,'passe pago (2x) liberado');
  chk(/TUDO/.test(r.txt),'mensagem certa');chk(/já usou/i.test(r.again),'uso único');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
