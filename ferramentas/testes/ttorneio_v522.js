// v522: TORNEIO DO MAIS FORTE (boss Sung imortal, dano/críticos, ranking 3 abas, títulos top 3)
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t522_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const posts=[];
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  const F=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,typeof v==='number'?{integerValue:String(v)}:{stringValue:v}]));const D=(id,o)=>({document:{name:'x/'+id,fields:F(o),createTime:new Date().toISOString()}});
  const RG=[['Honrado',900000,80,'sung'],['Breno',700000,120,'shaka'],['Vini_junior10',650000,60,'gojo'],['Fred',300000,200,'madara'],['Denilson ADM',9e9,999,'goku']].map(([n,d,c,ch],i)=>D('trn_'+i,{trn:'1',trk:'t20261118',tdm:d,tcr:c,tfr:Math.round(d*(1+c/100)),uid:'u'+i,nome:n,tit:'',char:ch}));
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),bd=r.request().postData()||'';if(/documentId=trn_/.test(u)){posts.push(JSON.parse(bd).fields);return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})}
    if(/:runQuery/.test(u)&&/t20261125/.test(bd))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(/:runQuery/.test(u)&&/"trk"/.test(bd))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(RG)});if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","shaka","sung"]',rk_sel:'"goku"',tw_nome:'"Teste"',tw_uid:'"u_t"',rk_gem:'100'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});
  const W=await p.evaluate(()=>{const w=__pvT.trnWk(Date.parse('2026-11-18T23:00:00Z'));const a=__pvT.trnWk(Date.parse('2026-11-18T21:00:00Z')),z=__pvT.trnWk(Date.parse('2026-11-22T03:30:00Z'));return {key:w.key,on:w.on,antes:a.on,depois:z.on,fim:new Date(w.fim).toISOString()}});
  console.log(JSON.stringify(W));chk(W.key==='t20261118'&&W.on&&!W.antes&&!W.depois&&W.fim==='2026-11-22T02:59:59.000Z','semana: quarta 19:00 → sábado 23:59 (Brasília)');
  /* lobby antes de começar */
  await p.evaluate(()=>{window.__ysT=Date.parse('2026-11-18T20:00:00Z')-Date.now();__pvT.trnView()});await p.waitForTimeout(1200);await p.screenshot({path:SH+'lobby_antes.png'});
  chk(await p.$eval('.trnGo',e=>e.classList.contains('lk')&&/COMEÇA EM/.test(e.textContent)),'antes das 19:00: INICIAR trancado com contagem');
  /* torneio aberto: luta */
  await p.evaluate(()=>{window.__ysT=Date.parse('2026-11-18T23:00:00Z')-Date.now();__pvT.trnView()});await p.waitForTimeout(1000);await p.screenshot({path:SH+'lobby.png'});
  await p.evaluate(()=>__pvT.trnStart());await p.waitForFunction(()=>{const G=__pvT.G();return G.gmode==='boss'&&G.phase==='fight'&&G.p&&G.p[1]},null,{timeout:60000});await p.waitForTimeout(1500);
  const f=await p.evaluate(async()=>{const G=__pvT.G(),o=G.p[1];const t0=G.timer;for(let i=0;i<5;i++){o.hp-=o.mhp*.3;await new Promise(r=>setTimeout(r,120))}return {t0,hp:o.hp/o.mhp,d:__pvT.trn().d,id:o.def.id,rkL:o.rkL}});
  console.log(JSON.stringify(f));chk(f.t0<=90&&f.t0>80,'luta de 90 s');chk(f.hp===1&&f.d>0,'Sung imortal (vida volta cheia) e o dano conta');chk(f.id==='sung','boss é o Sung');
  await p.screenshot({path:SH+'luta.png'});
  await p.evaluate(()=>{__pvT.trn().c=37;__pvT.G().timer=0.05});await p.waitForSelector('.trnRes',{timeout:30000});await p.waitForTimeout(600);await p.screenshot({path:SH+'resultado.png'});
  const rs=await p.$eval('.trnRes',e=>e.textContent.replace(/\s+/g,' '));console.log(rs);chk(/37/.test(rs)&&/FORÇA/.test(rs),'resultado com dano, críticos e força');
  chk(posts.length===1&&posts[0].trk.stringValue==='t20261118'&&posts[0].tcr.integerValue==='37','foi para o ranking do torneio');
  await p.click('#trnRkR');await p.waitForSelector('.trnRk .trnLs',{timeout:10000});await p.waitForTimeout(500);await p.screenshot({path:SH+'ranking.png'});
  let L=await p.$$eval('.trnRk .trnLs>div',a=>a.map(x=>x.textContent.replace(/\s+/g,' ').trim()));console.log(L);
  chk(/Honrado/.test(L[0])&&!L.some(t=>/Denilson ADM/.test(t)),'FORÇA: Honrado 1º, ADM fora (rank 0)');
  await p.click('.trnRk [data-t="c"]');await p.waitForTimeout(500);L=await p.$$eval('.trnRk .trnLs>div',a=>a.map(x=>x.textContent.replace(/\s+/g,' ').trim()));chk(/Fred/.test(L[0]),'CRÍTICO: Fred 1º');
  /* título depois do fim */
  await p.evaluate(async()=>{localStorage.setItem('tw_uid','"u1"');window.__ysT=Date.parse('2026-11-22T12:00:00Z')-Date.now();await __pvT.trnTit()});
  const t=await p.evaluate(()=>[localStorage.tw_tit,localStorage.tw_titOn,localStorage.rk_tmfE]);console.log(t);chk(/tmf2/.test(t[0])&&/tmf2/.test(t[1]),'Breno (2º da força) ganha o título 2º MAIS FORTE');
  await p.evaluate(async()=>{window.__ysT=Date.parse('2026-11-29T04:00:00Z')-Date.now();await __pvT.trnTit()});const t2=await p.evaluate(()=>[localStorage.tw_tit,localStorage.tw_titOn]);chk(!/tmf/.test(t2[0])&&!/tmf/.test(t2[1]),'depois de 7 dias o título sai');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
