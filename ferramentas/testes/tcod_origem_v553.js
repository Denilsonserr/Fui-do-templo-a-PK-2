// v553: código ORIGEMX4 — 4 joias ORIGEM DE TUDO (2 reais, 2 pegadinha) + anel SP
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t553_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  const r=await p.evaluate(async()=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup('origemx4',E);const o=__pvT.psG(),L=__pvT.anL();return {txt:E.textContent,jp:o.jp|0,q:o.jpq,ring:L.filter(x=>x.c===5&&x.g===8&&x.s==='dano'&&x.s2==='crit'&&!x.q).length}});
  console.log(JSON.stringify(r));chk(r.jp===4&&r.q.filter(x=>x==='o').length===2&&r.q.filter(x=>x==='q').length===2,'4 Joias Primordiais (2 de verdade + 2 pegadinha, ordem sorteada)');chk(r.ring===1,'anel SP dano+crítico de verdade');
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__pvT.psOpen()});await p.waitForTimeout(800);
  await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});await p.click('.psTabs [data-k="ch"]');await p.waitForTimeout(300);await p.click('.psCell[data-p="sel"]');await p.waitForTimeout(400);
  const res=[];for(let i=0;i<4;i++){const qn=await p.evaluate(()=>__pvT.psG().jpq[0]);await p.click('.psJxB.p');await p.waitForTimeout(6000);
    const pd=await p.evaluate(()=>__pvT.psG().pend);await p.click('.psAct [data-p="apply"]');await p.waitForTimeout(500);
    const s=await p.evaluate(()=>({ch:__pvT.psG().ch.goku,show:__pvT.psSumX('goku',1),luta:__pvT.psSumF('goku'),drop:__pvT.psSumX(undefined,0)}));res.push({qn,pd,s})}
  for(const x of res){const fake=x.qn==='q';chk(x.pd.r==='pri'&&x.pd.i===4,'giro deu ORIGEM DE TUDO'+(fake?' (pegadinha)':' (real)'));
    chk(x.s.show.cd===50&&x.s.show.drop===100,(fake?'pegadinha':'real')+' APARECE cheia na tela/status (crit '+x.s.show.cd+', drop '+x.s.show.drop+')');
    chk(fake?(x.s.luta.cd===0&&x.s.luta.def===0&&x.s.drop.drop<=0.01+0&&x.s.ch.q===1):(x.s.luta.cd===50&&x.s.drop.drop>=100),(fake?'pegadinha NÃO funciona na luta nem no drop':'real funciona na luta e no drop')+' (luta crit '+x.s.luta.cd+', drop '+x.s.drop.drop+')')}
  await p.screenshot({path:SH+'fim.png'});console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
