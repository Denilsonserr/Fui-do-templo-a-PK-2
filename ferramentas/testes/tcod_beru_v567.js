// v567: código (hash pl1fi5) — sombra BERU + 2 Joias Primordiais ORIGEM DE TUDO pegadinha, uso único.
// O texto do código NÃO fica no repositório: rode com  COD=TEXTO node tcod_beru_v567.js
const {chromium}=require('playwright');const SH=__dirname+'/shots/t567_';const COD=process.env.COD||'';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  const r=await p.evaluate(async c=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup(c.toLowerCase(),E);const o=__pvT.psG();return {txt:E.textContent,jp:o.jp|0,q:o.jpq,sh:__pvT.sjSys().sh}},COD);
  console.log(JSON.stringify(r));chk(r.sh.includes('beru'),'sombra BERU no inventário');chk(r.jp===2&&r.q.length===2&&r.q.every(x=>x==='q'),'2 Joias Primordiais, as 2 PEGADINHA');
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__pvT.psOpen()});await p.waitForTimeout(800);
  await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});await p.click('.psTabs [data-k="ch"]');await p.waitForTimeout(300);await p.click('.psCell[data-p="sel"]');await p.waitForTimeout(400);
  for(let i=0;i<2;i++){await p.click('.psJxB.p');await p.waitForTimeout(6000);const pd=await p.evaluate(()=>__pvT.psG().pend);await p.click('.psAct [data-p="apply"]');await p.waitForTimeout(500);
    const s=await p.evaluate(()=>({ch:__pvT.psG().ch.goku,show:__pvT.psSumX('goku',1),luta:__pvT.psSumF('goku'),drop:__pvT.psSumX(undefined,0)}));
    chk(pd.r==='pri'&&pd.i===4,'giro '+(i+1)+' deu ORIGEM DE TUDO');chk(s.show.cd===50&&s.show.drop===100,'APARECE cheia no status (crit '+s.show.cd+', drop '+s.show.drop+')');
    chk(s.luta.cd===0&&s.luta.def===0&&s.drop.drop<=0.01&&s.ch.q===1,'NÃO funciona na luta nem no drop (crit '+s.luta.cd+', drop '+s.drop.drop+')')}
  await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true};document.querySelectorAll('#psW,.psW').forEach(x=>x.remove());const o=__pvT.sjSys();o.eq='beru';__pvT.sjSet(o);__pvT.sjShOpen('beru')});await p.waitForTimeout(1500);
  await p.screenshot({path:SH+'fim.png'});console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
