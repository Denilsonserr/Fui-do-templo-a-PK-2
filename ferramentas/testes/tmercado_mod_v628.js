// v628: MODERADOR (Honrado) aprova a venda; os 10% vão para o ADM depois; quem não é moderador não vê o botão. (base: v546 — compra vira pedido; só sai com ✅ OK; recusa devolve; voltar o save é detectado; sem duplicar.
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
  const sel='zz9sel';const it1=JSON.stringify({k:'eq',it:{t:'arm',r:'mit',v:10,nm:'ARMADURA TESTE'}});
  put('mk_'+sel+'_a1',enc({mk:'1',mkv:sel,lid:sel+'_a1',it:it1,preco:5000,nome:'Vendedor',uid:'u_v'}));
  const B=await who(b,'Bia','u_bia',20000);
  chk(!(await B.evaluate(()=>__vw.mkMod())),'jogador comum NÃO é moderador');
  const F=await who(b,'Honrado','u_falso',1);chk(!(await F.evaluate(()=>__vw.mkMod())),'alguém que só mudou o nome para Honrado (sem conta) NÃO é moderador');await F.close();
  const r=await B.evaluate(async lid=>{const T=__pvT;const MN_=T.MN();MN_.tab='buy';await T.mnLoad();MN_.sel=lid;await T.mnAct('buy');return {gem:+localStorage.rk_gem,pend:T.mkPend().length}},sel+'_a1');chk(r.gem===15000&&r.pend===1,'pedido feito');
  SAVES[acc('Bia')]=await snap(B);
  const H=await who(b,'Honrado','mwc8atkrgg4fns2f',100);chk(await H.evaluate(()=>__vw.mkMod()),'Honrado (pela conta) é moderador');await H.waitForTimeout(3500);const tt=await H.evaluate(()=>({t:JSON.parse(localStorage.tw_tit||'[]'),on:JSON.parse(localStorage.tw_titOn||'""')}));chk(tt.t.includes('patr')&&tt.on==='patr','Honrado ganhou e está usando o título 👑 PATROCINADOR');chk(!(await B.evaluate(()=>JSON.parse(localStorage.tw_tit||'[]').includes('patr'))),'a Bia não ganhou o título');
  await H.click('#mRank');await H.waitForTimeout(1500);await H.evaluate(()=>{document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove());const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};__pvT.mnOpen()});await H.waitForTimeout(1500);
  chk(await H.evaluate(()=>!!document.querySelector('.mkAdmB')),'Honrado vê o botão ✅ APROVAR');
  await H.evaluate(()=>{document.querySelectorAll('#leiCl,#lvrzM,#acM').forEach(x=>x.remove());const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''}});await H.screenshot({path:__dirname+'/shots/t628_mercado.png'});await H.click('.mkAdmB',{timeout:8000});await H.waitForSelector('.mkR .ok');await H.screenshot({path:__dirname+'/shots/t628_mod.png'});
  const hg0=await H.evaluate(()=>+localStorage.rk_gem);await H.click('.mkR .ok');await H.waitForSelector('.mkRb em.ok',{timeout:10000});const ht=await H.evaluate(()=>document.querySelector('.mkRb em.ok').textContent);console.log(ht);
  chk(DB.has('mkb_'+sel+'_a1'),'✅ OK do Honrado fez a venda');{const hg=await H.evaluate(()=>+localStorage.rk_gem);chk(hg===hg0,'Honrado NÃO ficou com os 10% (antes '+hg0+', depois '+hg+')')}
  const t=DB.get('mkt_'+sel+'_a1');chk(t&&t.fields.mod.stringValue==='1'&&t.fields.tx.integerValue==='500','taxa de 500 guardada para o ADM');
  await B.evaluate(()=>__pvT.mkPoll(1));const rb=await B.evaluate(()=>JSON.parse(localStorage.tw_inv||'[]').filter(x=>x.nm==='ARMADURA TESTE').length);chk(rb===1,'comprador recebeu o item');
  const A=await who(b,'Denilson ADM','u_adm',1);await A.waitForTimeout(16000);let ag=await A.evaluate(()=>({g:+localStorage.rk_gem,got:JSON.parse(localStorage.rk_mktGot||'[]')}));chk(ag.got.includes(sel+'_a1'),'ADM recebeu os 10% sozinho quando abriu o jogo');const ag0=ag.g;
  await A.evaluate(()=>__vw.mkTaxGet());await A.waitForTimeout(800);ag=await A.evaluate(()=>+localStorage.rk_gem);chk(ag===ag0,'não recebe 2x');
  const errs=[B,H,A].flatMap(p=>p.errs);console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
