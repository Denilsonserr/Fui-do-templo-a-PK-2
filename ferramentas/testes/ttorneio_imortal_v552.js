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
  const r=await p.evaluate(()=>{const G=__pvT.G(),o=G.p[1],T=__pvT.trn();const d0=T.d;const big=o.mhp*5;o.hp=o.hp-big;__pvT.ko(G.p[0],o);return {ph:G.phase,hp:o.hp,mhp:o.mhp,ko:o.ko,dd:T.d-d0,big}});
  chk(r.ph==='fight'&&r.hp===r.mhp&&!r.ko,'golpe que zera a vida NÃO mata o Sung (fase '+r.ph+')');chk(r.dd>=r.big*0.99,'o dano do golpe conta no placar ('+Math.round(r.dd)+')');
  // golpe gigante "de verdade" durante o jogo: zera a vida e espera alguns quadros
  await p.evaluate(()=>{const G=__pvT.G();G.p[1].hp=-1e9});await p.waitForTimeout(1500);
  const r2=await p.evaluate(()=>{const G=__pvT.G();return {ph:G.phase,hp:G.p[1].hp,mhp:G.p[1].mhp,on:__pvT.trn().on}});chk(r2.ph==='fight'&&r2.on&&r2.hp===r2.mhp,'continua lutando depois do golpe gigante');
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
