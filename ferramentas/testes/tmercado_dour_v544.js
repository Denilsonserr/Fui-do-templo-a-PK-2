// v544: código PRIMORDIALX2
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t529_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  const r=await p.evaluate(async()=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup('anelsortedrop',E);await __pvT.cup('primordialx5',E);__pvT.anGive({i:'tst1',c:3,g:5,s:'dano',v:10,a:60000});__pvT.anGive({i:'tst2',c:5,g:6,s:'dano',s2:'crit',v:100,a:5e6});
  const L=__pvT.anL();const sp=L.filter(x=>x.c===5&&x.g===8).length;const M=__pvT.mnMine().filter(e=>e.k==='an');const ids=M.flatMap(e=>e.ids);const spIn=L.filter(x=>x.c===5&&ids.includes(x.i)).length;
  const pr=await __pvT.mnPost('mk_x_1',{it:{stringValue:JSON.stringify({k:'an',r:{c:5,g:2,s:'dano',l:60,a:1e7}})}});
  return {sp,spIn,total:L.length,listed:ids.length,pr}});
  console.log(JSON.stringify(r));
  chk(r.sp===2,'tem 2 anéis dourados SP');chk(r.spIn===0,'nenhum anel dourado aparece para vender');chk(r.listed===r.total-r.sp-1,'outros anéis continuam vendáveis ('+r.listed+')');chk(r.pr&&r.pr.ok===false&&r.pr.status===403,'anúncio de anel dourado (qualquer nota) recusado');
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
// parte 2: anúncios antigos de anel dourado somem da aba COMPRAR (menos o meu)
(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
  const k=await p.evaluate(()=>{const me=__pvT.G&&0;const L=[{lid:'a',mkv:'outro',it:JSON.stringify({k:'an',r:{c:5,g:6,s:'drop',l:60,a:1e7}}),preco:1,_ct:3},{lid:'b',mkv:'outro',it:JSON.stringify({k:'an',r:{c:4,g:7,s:'st',l:1,a:100000}}),preco:1,_ct:2},{lid:'c',mkv:'outro',it:JSON.stringify({k:'jn',n:5}),preco:1,_ct:1}];return __pvT.mnRowsBuy(L)});
  const ok=JSON.stringify(k)===JSON.stringify(['b','c']);console.log((ok?'OK  ':'FALHA ')+'anúncio dourado antigo some da aba COMPRAR '+JSON.stringify(k));console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');await b.close()})();
