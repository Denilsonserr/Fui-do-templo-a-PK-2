// v566: código (hash t40mdb) — anel SP dano+crítico + 1 Joia Primordial ORIGEM DE TUDO real, uso único.
// O texto do código NÃO fica no repositório: rode com  COD=TEXTO node tcod_anelorigem_v566.js
const {chromium}=require('playwright');const SH=__dirname+'/shots/t566_';const COD=process.env.COD||'';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  const r=await p.evaluate(async c=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup(c.toLowerCase(),E);const o=__pvT.psG(),L=__pvT.anL();return {txt:E.textContent,jp:o.jp|0,q:o.jpq,ring:L.filter(x=>x.c===5&&x.g===8&&x.s==='dano'&&x.s2==='crit'&&!x.q).length}},COD);
  console.log(JSON.stringify(r));chk(r.jp===1&&r.q.length===1&&r.q[0]==='o','1 Joia Primordial ORIGEM DE TUDO (de verdade)');chk(r.ring===1,'anel dourado SP dano+crítico de verdade');
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__pvT.psOpen()});await p.waitForTimeout(800);
  await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});await p.click('.psTabs [data-k="ch"]');await p.waitForTimeout(300);await p.click('.psCell[data-p="sel"]');await p.waitForTimeout(400);
  await p.click('.psJxB.p');await p.waitForTimeout(6000);const pd=await p.evaluate(()=>__pvT.psG().pend);await p.click('.psAct [data-p="apply"]');await p.waitForTimeout(500);
  const s=await p.evaluate(()=>({luta:__pvT.psSumF('goku'),drop:__pvT.psSumX(undefined,0)}));
  chk(pd.r==='pri'&&pd.i===4,'giro deu ORIGEM DE TUDO');chk(s.luta.cd===50&&s.drop.drop>=100,'funciona na luta e no drop (crit '+s.luta.cd+', drop '+s.drop.drop+')');
  await p.screenshot({path:SH+'fim.png'});console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
