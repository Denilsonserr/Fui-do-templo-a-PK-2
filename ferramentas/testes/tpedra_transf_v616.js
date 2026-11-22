// v616: passe com 25 níveis + PEDRA DA TRANSFERÊNCIA (passa passiva de personagem/item para outro)
const {chromium}=require('playwright');const SH=__dirname+'/shots/t616_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:1});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","alucard","sung"]',rk_sel:'"alucard"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k',
    rk_ps:JSON.stringify({jn:5,ch:{goku:{r:'pri',i:4,q:1},alucard:{r:'mit',i:0}}}),tw_inv:JSON.stringify([{id:'e1',t:'esp',r:'lend',v:50,nm:'ESPADA TESTE'},{id:'c1',t:'cap',r:'epica',v:30,nm:'CAPACETE TESTE',ps:{r:'sec',i:1}}])})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  const clean=()=>p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl,.rkWin,.skWin,.rkCw').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});
  // ---- passe
  const pb=await p.evaluate(async()=>{const J=window.__jt;return {f:J.BPF().length,p:J.BPP().length}}).catch(e=>({err:e.message}));console.log('passe',JSON.stringify(pb));chk(pb.f===25&&pb.p===25,'passe com 25 níveis (grátis e premium)');
  const cl=await p.evaluate(async()=>{const {bpG,bpS,claim,rkG}=window.__bp2;const o=bpG();o.own=2;o.x2=1;o.xp=99999;bpS(o);const j0=window.__jt.psG().jt|0;const g0=rkG('gem',0);for(let i=0;i<25;i++){await claim('p',i,1);await claim('f',i,1)}
    const o2=bpG();return {lv:Math.min(25,Math.floor(o2.xp/250)),cp:o2.cp.length,cf:o2.cf.length,jt:(window.__jt.psG().jt|0)-j0}});
  console.log(JSON.stringify(cl));chk(cl.cp===25&&cl.cf===25,'pegou os 25 prêmios das duas linhas');chk(cl.jt===2,'ganhou 2 pedras (mesmo com o passe 2X, não dobra)');
  await clean();await p.evaluate(()=>{__vw.rkView('bp')});await p.waitForTimeout(800);await p.waitForTimeout(4000);await clean();for(let i=0;i<2;i++){await p.evaluate(()=>document.querySelector('.bpAr:not([data-d])').click());await p.waitForTimeout(500)}await clean();await p.screenshot({path:SH+'passe3.png'});
  const pg=await p.evaluate(()=>({cells:document.querySelectorAll('#rkWrap .bpCell').length,txt:(document.querySelector('.bp2Bt span')||{}).textContent,lv:(document.querySelector('.bp2Lv')||{}).textContent}));console.log(JSON.stringify(pg));
  chk(pg.cells===10&&/3\/3 · níveis 21–25/.test(pg.txt)&&/25\/25/.test(pg.lv),'página 3 mostra os níveis 21–25');
  await p.evaluate(()=>document.querySelector('.bpAr[data-d="-"]').click());await p.waitForTimeout(500);const pg2=await p.evaluate(()=>document.querySelector('.bp2Bt span').textContent);chk(/2\/3/.test(pg2),'seta da esquerda volta ('+pg2+')');
  // ---- encantamento
  await p.waitForTimeout(3000);await clean();await p.evaluate(()=>__pvT.psOpen());await p.waitForTimeout(800);await clean();await p.click('.psTabs [data-k="ch"]');await p.waitForTimeout(300);
  await p.click('.psCell[data-id="goku"]');await p.waitForTimeout(300);await p.screenshot({path:SH+'enc.png'});
  await p.click('.psJt button');await p.waitForTimeout(600);await p.screenshot({path:SH+'tela1.png'});
  const t1=await p.evaluate(()=>({src:!!document.querySelector('.jtSq.has[data-j="src"]'),bx:document.querySelector('.jtBx').textContent}));chk(t1.src&&/PRIMORDIAL/.test(t1.bx),'abriu a tela com o Goku na origem ('+t1.bx.slice(0,60)+')');
  await p.click('.jtSq[data-j="dst"]');await p.waitForTimeout(400);await p.screenshot({path:SH+'lista.png'});
  const nL=await p.evaluate(()=>document.querySelectorAll('#rkModal .jtI').length);chk(nL>=4,'lista de destinos aparece ('+nL+')');
  await p.evaluate(()=>{const b=[...document.querySelectorAll('#rkModal .jtI')].find(x=>/YUTA/i.test(x.textContent));b.click()});await p.waitForTimeout(500);await p.screenshot({path:SH+'tela2.png'});
  await p.click('.jtGo');await p.waitForTimeout(900);await p.screenshot({path:SH+'feito.png'});
  let s=await p.evaluate(()=>({ps:window.__jt.psG(),inv:JSON.parse(localStorage.tw_inv)}));console.log(JSON.stringify(s.ps.ch),s.ps.jt);
  chk(!s.ps.ch.goku&&s.ps.ch.yuta&&s.ps.ch.yuta.r==='pri'&&s.ps.ch.yuta.i===4&&s.ps.ch.yuta.q===1&&s.ps.jt===1,'Goku ➜ Yuta: passiva foi (e a pegadinha continua pegadinha), Goku ficou sem, gastou 1 pedra');
  // personagem -> item (que já tinha passiva)
  const r2=await p.evaluate(()=>{const J=window.__jt;const ok=J.jtDo({k:'ch',id:'alucard'},{k:'it',id:'c1'});return {ok,ps:J.psG(),inv:JSON.parse(localStorage.tw_inv)}});
  chk(r2.ok&&!r2.ps.ch.alucard&&r2.inv.find(x=>x.id==='c1').ps.r==='mit'&&r2.ps.jt===0,'Alucard ➜ capacete (troca a que tinha), pedra acabou');
  const r3=await p.evaluate(()=>window.__jt.jtDo({k:'it',id:'c1'},{k:'it',id:'e1'}));chk(r3===0,'sem pedra não transfere');
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'TEM FALHA');await b.close()})();
