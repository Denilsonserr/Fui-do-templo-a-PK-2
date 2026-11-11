// v364: Mercado Negro — vender Joias Negras em quantidade e anéis da alma (vermelho equipado incluso). Firestore falso.
const {chromium}=require('playwright');const W='/home/claude/fui-do-templo-a-pk-2/www/',SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/mn364_';const DB=new Map();
(async()=>{const b=await chromium.launch();const errs=[];
const page=async(uid,pre)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(uid+': '+e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com|workers\.dev\/fs/,async r=>{const u=r.request().url(),body=r.request().postData()||'{}';
    if(/:runQuery/.test(u)){const Q=JSON.parse(body).structuredQuery,ff=Q.where&&Q.where.fieldFilter;const L=[...DB.values()].filter(e=>!ff||(e.f[ff.field.fieldPath]&&e.f[ff.field.fieldPath].stringValue===ff.value.stringValue)).map(e=>({document:{createTime:new Date(e.ct).toISOString(),fields:e.f}}));return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L)})}
    const m=u.match(/documentId=([^&]+)/);const f=JSON.parse(body).fields||{};if(m){if(DB.has(m[1]))return r.fulfill({status:409,body:'{}'});DB.set(m[1],{f,ct:Date.now()})}else DB.set('auto'+Math.random(),{f,ct:Date.now()});return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(([uid,pre])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:JSON.stringify(uid),rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_own:'["goku"]',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})},pre)}},[uid,pre]);
  await p.goto('file://'+W+'index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());try{rkModal(null)}catch(e){}});return p};
const an=[{i:'r1',c:4,g:6,s:'dano',v:150,l:12,a:350000},{i:'r2',c:0,g:2,s:'st',v:3,l:1,a:0}];
const A=await page('vend1',{tw_nome:'"Vendedor"',rk_gem:'0',rk_ps:JSON.stringify({jn:50}),rk_an:JSON.stringify(an),rk_anEq:JSON.stringify({goku:['r1',null,null,null,null,null,null,null]})});
await A.evaluate(()=>__pvT.mn.open());await A.waitForTimeout(1200);await A.click('#rkWrap [data-m="tab"][data-k="sell"]',{force:true});await A.waitForTimeout(400);
console.log('pode vender',await A.evaluate(()=>[...document.querySelectorAll('#rkWrap .mnCell')].map(b=>b.textContent)));
await A.click('#rkWrap .mnCell[data-k="jn"]',{force:true});await A.waitForTimeout(300);
for(const d of ['10','10','1','-1'])await A.click(`#rkWrap [data-m="q"][data-d="${d}"]`,{force:true});await A.screenshot({path:SH+'qtd.png'});
console.log('qtd',await A.evaluate(()=>document.getElementById('mnQ').value));await A.fill('#mnPr','100');await A.click('#rkWrap [data-m="list"]',{force:true});await A.waitForTimeout(1500);
await A.click('#rkWrap [data-m="tab"][data-k="sell"]',{force:true});await A.waitForTimeout(400);const rk=await A.evaluate(()=>[...document.querySelectorAll('#rkWrap .mnCell')].find(b=>/VERMELHO/.test(b.textContent)).dataset.k);
await A.click(`#rkWrap .mnCell[data-k="${rk}"]`,{force:true});await A.waitForTimeout(300);await A.screenshot({path:SH+'anel.png'});await A.fill('#mnPr','500');await A.click('#rkWrap [data-m="list"]',{force:true});await A.waitForTimeout(1500);
console.log('A depois',await A.evaluate(()=>[JSON.parse(localStorage.rk_ps).jn,JSON.parse(localStorage.rk_an).map(r=>r.i),localStorage.rk_anEq]));
const B=await page('comp2',{tw_nome:'"Comprador"',rk_gem:'1000',rk_ps:JSON.stringify({jn:0})});await B.evaluate(()=>__pvT.mn.open());await B.waitForTimeout(1500);await B.screenshot({path:SH+'comprar.png'});
const L=await B.evaluate(()=>[...document.querySelectorAll('#rkWrap .mnCell')].map(b=>[b.dataset.k,b.textContent]));console.log('B vê',L);
for(const [k] of L){await B.click(`#rkWrap .mnCell[data-k="${k}"]`,{force:true});await B.waitForTimeout(300);await B.click('#rkWrap [data-m="buy"]',{force:true});await B.waitForTimeout(1500)}
console.log('B depois',await B.evaluate(()=>[localStorage.rk_gem,JSON.parse(localStorage.rk_ps).jn,localStorage.rk_an]));
await A.click('#rkWrap [data-m="tab"][data-k="mine"]',{force:true});await A.waitForTimeout(2500);console.log('A recebeu',await A.evaluate(()=>localStorage.rk_gem));
console.log('ERROS',errs);await b.close()})();
