// v572/v574: LEILÃO DOS ANÉIS (20/11 20:00–21:00 Brasília) — lances, devolução, aprovação do ADM, entrega e status dos anéis. Servidor local: node ferramentas/servidor/local.mjs 8790
const {chromium}=require('playwright');const SH=__dirname+'/shots/t574_';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();const ctx={};
  const page=async(nome,uid,t,gem)=>{let c=ctx[uid];if(!c){c=ctx[uid]=await b.newContext({viewport:{width:915,height:422},deviceScaleFactor:2})}const p=await c.newPage();p.on('pageerror',e=>E.push(nome+': '+e.message));await p.route(/fonts\.g/,r=>r.abort());await p.clock.setFixedTime(t);
    await p.addInitScript(([n,u,g])=>{if(!localStorage.__ini){localStorage.clear();Object.assign(localStorage,{__ini:'1',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',tw_nome:JSON.stringify(n),tw_uid:JSON.stringify(u),rk_gem:String(g)})}},[nome,uid,gem]);
    await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(3500);await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl,#l2W').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});return p};
  const gem=p=>p.evaluate(()=>JSON.parse(localStorage.rk_gem));
  const ON=Date.UTC(2026,10,20,23,30),FIM=Date.UTC(2026,10,21,0,2);
  let a=await page('Ana','u_ana',ON,200000);await a.evaluate(()=>__pvT.l2.bid('lxa',50000));await a.waitForTimeout(800);chk(await gem(a)===150000,'Ana dá 50.000 💎 (ficam presos)');
  await a.evaluate(()=>__pvT.l2.bid('lxa',50500));chk(await gem(a)===150000,'lance abaixo do mínimo (+1.000) recusado');await a.close();
  let bb=await page('Beto','u_beto',ON,300000);await bb.evaluate(()=>__pvT.l2.bid('lxa',51000));await bb.waitForTimeout(800);chk(await gem(bb)===249000,'Beto cobre com 51.000');
  await bb.evaluate(()=>__pvT.l2.open());await bb.waitForTimeout(1800);await bb.screenshot({path:SH+'aovivo.png'});await bb.close();
  await new Promise(r=>setTimeout(r,21000)); /* o servidor guarda as consultas por 20 s */
  a=await page('Ana','u_ana',ON,0);await a.evaluate(()=>__pvT.l2.settle());await a.waitForTimeout(500);chk(await gem(a)===200000,'Ana coberta: 50.000 💎 voltam');await a.close();
  bb=await page('Beto','u_beto',FIM,0);await bb.evaluate(()=>__pvT.l2.settle());await bb.waitForTimeout(500);let r=await bb.evaluate(()=>({E:__pvT.l2.E(),n:__pvT.anL().filter(x=>x.lx).length}));chk(r.E.lxa&&r.E.lxa.win&&r.n===0,'fim: Beto ganhou, mas ainda sem anel (espera o ADM)');await bb.close();
  const adm=await page('Denilson ADM','u_adm',FIM,1000);await adm.evaluate(()=>__pvT.l2.open());await adm.waitForTimeout(2500);await adm.screenshot({path:SH+'adm.png'});
  const nb=await adm.locator('[data-la]').count();chk(nb===1,'ADM vê 1 botão APROVAR (o outro anel não teve lance)');
  const g0=await gem(adm);await adm.click('[data-la="lxa"]');await adm.waitForTimeout(2500);const g1=await gem(adm);chk(g1-g0===51000,'ADM aprovou e recebeu os 51.000 💎 ('+(g1-g0)+')');
  await adm.evaluate(()=>__pvT.l2.ap('lxa'));await adm.waitForTimeout(1500);chk(await gem(adm)===g1,'aprovar 2 vezes não paga de novo');await adm.screenshot({path:SH+'adm2.png'});await adm.close();
  await new Promise(r=>setTimeout(r,21000));
  bb=await page('Beto','u_beto',FIM+60000,0);await bb.evaluate(()=>__pvT.l2.settle());await bb.waitForTimeout(1200);await bb.screenshot({path:SH+'beto_msg.png'});
  r=await bb.evaluate(()=>{document.querySelectorAll('#l2W').forEach(x=>x.remove());const R=__pvT.anL().filter(x=>x.lx);const A=JSON.parse(localStorage.rk_anEq||'{}');A.goku=[R[0].i];localStorage.rk_anEq=JSON.stringify(A);return {R,S:__pvT.anSum('goku'),k:__pvT.lxGemK(),gem:JSON.parse(localStorage.rk_gem)}});
  console.log(JSON.stringify(r.S));chk(r.R.length===1&&r.R[0].lx==='a','Beto recebeu o ANEL REI DA FÚRIA');chk(r.S.dano===1000&&r.S.crit===1000&&r.S.vel===1000&&r.S.uv===0,'status: 1000% dano, 1000% crítico, 1000% velocidade');
  chk(r.gem===249000,'Beto não recebeu os 💎 de volta (pagou o anel)');
  await bb.evaluate(()=>__pvT.l2.settle());await bb.waitForTimeout(800);chk(await bb.evaluate(()=>__pvT.anL().filter(x=>x.lx).length)===1,'não recebe o anel 2 vezes');
  r=await bb.evaluate(()=>{const x=__pvT.l2.give('lxb');const A=JSON.parse(localStorage.rk_anEq||'{}');A.goku=[x.i];localStorage.rk_anEq=JSON.stringify(A);return {S:__pvT.anSum('goku'),k:__pvT.lxGemK(),g:__pvT.m()[0]}});console.log(JSON.stringify(r.S));
  chk(r.S.st===1000&&r.S.drop===1000&&r.S.dano===0,'anel FORTUNA: 1000 sorte, 1000% drop');chk(Math.abs(r.k-1.2)<1e-9&&Math.abs(r.g-1.2)<1e-9,'FORTUNA: +20% diamantes nas lutas (multiplicador '+r.g+')');
  await bb.evaluate(()=>{__pvT.rkO&&0});await bb.close();
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
