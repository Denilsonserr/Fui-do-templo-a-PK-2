// v546: mercado com aprovação do ADM — compra vira pedido; só sai com ✅ OK; recusa devolve; voltar o save é detectado; sem duplicar.
const {chromium}=require('playwright');
const DB=new Map();let ct=Date.now()-1e6;const SAVES={};
const enc=f=>{const o={};for(const k in f){const v=f[k];o[k]=typeof v==='number'?{integerValue:String(v)}:{stringValue:String(v)}}return o};
function put(id,fields){ct+=1000;DB.set(id,{name:'projects/x/databases/(default)/documents/torre/'+id,fields,createTime:new Date(ct).toISOString()})}
async function route(r){const q=r.request(),u=q.url(),m=q.method();
  if(/sv-antes/.test(u)){const acc=new URL(u).searchParams.get('acc');const s=SAVES[acc];return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(s?{ts:Date.now(),d:JSON.stringify(s)}:{nada:1})})}
  if(/:runQuery/.test(u)){const b=JSON.parse(q.postData()||'{}').structuredQuery||{};const ff=b.where&&b.where.fieldFilter;const out=[];
    for(const d of DB.values()){if(ff){const v=d.fields[ff.field.fieldPath];if(!v||(v.stringValue!=null?v.stringValue:v.integerValue)!==(ff.value.stringValue!=null?ff.value.stringValue:ff.value.integerValue))continue}out.push({document:d})}
    return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(out.length?out:[{readTime:'x'}])})}
  if(m==='POST'&&/documentId=/.test(u)){const id=new URL(u).searchParams.get('documentId');if(DB.has(id))return r.fulfill({status:409,contentType:'application/json',body:'{"error":{"code":409}}'});put(id,JSON.parse(q.postData()).fields);return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(DB.get(id))})}
  if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{}'});return r.fulfill({status:200,contentType:'application/json',body:'{"fields":{}}'})}
async function who(b,nome,uid,gem){const c=await b.newContext({viewport:{width:915,height:412}});const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\//,route);
  await p.addInitScript(([n,u,g])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(n),tw_uid:JSON.stringify(u),rk_gem:String(g),rk_own:'["goku"]',rk_lvrz:'1',rk_pvupv:'352'})}},[nome,uid,gem]);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2500);
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove());const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''}});return p}
const acc=n=>require('crypto').createHash('sha256').update('furia|acc|'+n.toLowerCase().trim()).digest('hex').slice(0,24);
const snap=async p=>p.evaluate(()=>Object.assign({},localStorage));
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const sel='zz9sel';const it1=JSON.stringify({k:'eq',it:{t:'arm',r:'mit',v:10,nm:'ARMADURA TESTE'}}),it2=JSON.stringify({k:'jn'});
  put('mk_'+sel+'_a1',enc({mk:'1',mkv:sel,lid:sel+'_a1',it:it1,preco:5000,nome:'Vendedor',uid:'u_v'}));
  put('mk_'+sel+'_a2',enc({mk:'1',mkv:sel,lid:sel+'_a2',it:it2,preco:3000,nome:'Vendedor',uid:'u_v'}));
  const B=await who(b,'Bia','u_bia',20000);
  const buy=async lid=>B.evaluate(async lid=>{const T=__pvT;const MN_=T.MN();MN_.tab='buy';await T.mnLoad();MN_.sel=lid;await T.mnAct('buy');return {gem:+localStorage.rk_gem,pend:T.mkPend().length,inv:JSON.parse(localStorage.tw_inv||'[]').length}},lid).catch(e=>({err:String(e)}));
  // mnLoad/mnAct are global functions in the page
  let r=await buy(sel+'_a1');chk(r.gem===15000&&r.pend===1&&r.inv===0,'pedido: gemas reservadas, item ainda NÃO entregue '+JSON.stringify(r));
  chk([...DB.keys()].some(k=>k.startsWith('mkr_')),'pedido foi para o servidor');chk(![...DB.keys()].some(k=>k.startsWith('mkb_')),'venda NÃO feita sem o ADM');
  r=await buy(sel+'_a1');chk(r.gem===15000,'não dá para pedir o mesmo item 2x');
  await B.evaluate(()=>__pvT.mkPoll(1));chk(await B.evaluate(()=>__pvT.mkPend().length)===1,'sem OK do ADM continua pendente');
  SAVES[acc('Bia')]=await snap(B);
  const A=await who(b,'Denilson ADM','u_adm',1);await A.click('#mRank');await A.waitForTimeout(1500);await A.evaluate(()=>{document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove());const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};__pvT.mnOpen()});await A.waitForTimeout(1500);
  let L=await A.evaluate(async()=>{const P=await __pvT.mkAdmLoad();const c=await __pvT.mkAdmChk(P[0]);return {n:P.length,c}});chk(L.n===1&&L.c.c==='g','ADM vê o pedido e o save confere ('+L.c.t+')');
  await A.evaluate(()=>__pvT.mkAdmOpen());await A.waitForSelector('.mkR .ok');await A.waitForTimeout(800);
  const shot=await A.screenshot({path:'/tmp/claude-0/mk_adm.png'});
  await A.click('.mkR .ok');await A.waitForSelector('.mkRb em.ok',{timeout:10000});chk(DB.has('mkb_'+sel+'_a1'),'✅ OK do ADM fez a venda (mkb)');
  await B.evaluate(()=>__pvT.mkPoll(1));
  r=await B.evaluate(()=>({gem:+localStorage.rk_gem,pend:__pvT.mkPend().length,inv:JSON.parse(localStorage.tw_inv||'[]').filter(x=>x.nm==='ARMADURA TESTE').length}));chk(r.pend===0&&r.inv===1&&r.gem===15000,'comprador recebeu o item depois do OK '+JSON.stringify(r));
  // voltar o save: recoloca o pedido pendente → não pode receber de novo
  await B.evaluate(p=>{localStorage.rk_mkPend=p},SAVES[acc('Bia')].rk_mkPend);await B.evaluate(()=>__pvT.mkPoll(1));
  r=await B.evaluate(()=>({pend:__pvT.mkPend().length,inv:JSON.parse(localStorage.tw_inv||'[]').filter(x=>x.nm==='ARMADURA TESTE').length}));chk(r.pend===0&&r.inv===1,'voltar o save NÃO dá o item 2x');
  // recusa
  r=await buy(sel+'_a2');chk(r.gem===12000&&r.pend===1,'2º pedido reservado');
  SAVES[acc('Bia')]=Object.assign(await snap(B),{rk_mkPend:'[]',rk_gem:'15000'}); // simula quem voltou o save
  L=await A.evaluate(async()=>{const P=await __pvT.mkAdmLoad();return {n:P.length,c:await __pvT.mkAdmChk(P[0])}});chk(L.c.c==='b','ADM é avisado que o comprador voltou o save ('+L.c.t+')');
  await A.evaluate(()=>__pvT.mkAdmOpen());await A.waitForSelector('.mkR .no');await A.click('.mkR .no');await A.waitForSelector('.mkRb em.no',{timeout:10000});
  await B.evaluate(()=>__pvT.mkPoll(1));r=await B.evaluate(()=>({gem:+localStorage.rk_gem,pend:__pvT.mkPend().length}));chk(r.gem===15000&&r.pend===0,'❌ RECUSAR devolve as gemas '+JSON.stringify(r));chk(!DB.has('mkb_'+sel+'_a2'),'recusado não vira venda');
  // vendedor recebe
  const V=await who(b,'Vendedor','u_v',100);await V.evaluate(()=>{window.mnKey_=null});
  const errs=[...B.errs,...A.errs,...V.errs];console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
