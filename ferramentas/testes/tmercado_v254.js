const {chromium}=require('playwright');const S=process.env.S;const W='/home/claude/fui-do-templo-a-pk-2/www/';
const DB=new Map();const fs=require('fs');fs.writeFileSync(W+'_t.html',fs.readFileSync(W+'index.html','utf8').replace('window.__G=G;','window.__G=G;window.__v25=()=>({MN,mnKey,mnRows});'));
(async()=>{const b=await chromium.launch();const errs=[];
const page=async(uid,pre)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(uid+': '+e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url(),body=r.request().postData()||'{}';
    if(/:runQuery/.test(u)){const Q=JSON.parse(body).structuredQuery,ff=Q.where&&Q.where.fieldFilter;const L=[...DB.values()].filter(e=>!ff||(e.f[ff.field.fieldPath]&&e.f[ff.field.fieldPath].stringValue===ff.value.stringValue)).map(e=>({document:{createTime:new Date(e.ct).toISOString(),fields:e.f}}));return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L)})}
    const m=u.match(/documentId=([^&]+)/);const f=JSON.parse(body).fields||{};if(m){if(DB.has(m[1]))return r.fulfill({status:409,body:'{}'});DB.set(m[1],{f,ct:Date.now()})}else DB.set('auto'+Math.random(),{f,ct:Date.now()});return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(([uid,pre])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:JSON.stringify(uid),rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_rp:'16000'},pre)}},[uid,pre]);
  await p.goto('file://'+W+'_t.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});return p};
const A=await page('vend1',{tw_nome:'"Vendedor"',rk_gem:'100',tw_inv:JSON.stringify([{id:'x1',t:'esp',r:'mit',v:10,ps:{r:'sec',i:0}},{id:'u1',t:'esp',r:'lend',v:25,uniq:1,nm:'LÂMINA DOURADA'}]),tw_poc:JSON.stringify([{id:'p1',r:'lend',v:45,pk:'cura'}]),rk_ps:JSON.stringify({jn:2})});
await A.click('#mRank');await A.waitForTimeout(700);await A.screenshot({path:S+'mn_menu.png'});
// código 5 joias
await A.click('#rkWrap [data-a="code"]');await A.waitForTimeout(300);await A.fill('#rkCdI','passiva5');await A.click('#rkCdOk');await A.waitForTimeout(900);
console.log('code',await A.evaluate(()=>localStorage.rk_ps+' | '+(document.querySelector('#rkModal .twH.ok,#rkModal .twH.err')||{}).textContent));
await A.evaluate(()=>{const x=document.getElementById('rkMX');if(x)x.click()});await A.waitForTimeout(300);
await A.click('#rkWrap [data-a="psMenu"]');await A.waitForTimeout(700);await A.screenshot({path:S+'mn_ps.png'});await A.click('#rkWrap [data-p="back"]',{force:true});await A.waitForTimeout(500);
await A.click('#rkWrap [data-a="mnMenu"]');await A.waitForTimeout(1200);await A.click('#rkWrap [data-m="tab"][data-k="sell"]',{force:true});await A.waitForTimeout(500);await A.screenshot({path:S+'mn_sell.png'});
const keys=await A.evaluate(()=>[...document.querySelectorAll('#rkWrap .mnCell')].map(b=>b.dataset.k+' '+b.textContent));console.log('sellable',keys);
const ek=await A.evaluate(()=>[...document.querySelectorAll('#rkWrap .mnCell')].find(b=>b.dataset.k.startsWith('e|')).dataset.k);
await A.click(`#rkWrap .mnCell[data-k="${ek}"]`,{force:true});await A.waitForTimeout(300);await A.fill('#mnPr','50');await A.click('#rkWrap [data-m="list"]',{force:true});await A.waitForTimeout(1500);
await A.click('#rkWrap [data-m="tab"][data-k="sell"]',{force:true});await A.waitForTimeout(400);await A.click('#rkWrap .mnCell[data-k="jn"]',{force:true});await A.waitForTimeout(300);await A.fill('#mnPr','30');await A.click('#rkWrap [data-m="list"]',{force:true});await A.waitForTimeout(1500);
console.log('A after list',await A.evaluate(()=>localStorage.tw_inv+' | '+localStorage.rk_ps));
const B=await page('comp2',{tw_nome:'"Comprador"',rk_gem:'60'});
await B.click('#mRank');await B.waitForTimeout(600);await B.click('#rkWrap [data-a="mnMenu"]');await B.waitForTimeout(1500);await B.screenshot({path:S+'mn_buy.png'});
const bk=await B.evaluate(()=>[...document.querySelectorAll('#rkWrap .mnCell')].map(b=>b.dataset.k+' '+b.textContent));console.log('B sees',bk);
const first=await B.evaluate(()=>[...document.querySelectorAll('#rkWrap .mnCell')].find(b=>/ESPADA/.test(b.textContent)).dataset.k);
await B.click(`#rkWrap .mnCell[data-k="${first}"]`,{force:true});await B.waitForTimeout(300);await B.screenshot({path:S+'mn_det.png'});await B.click('#rkWrap [data-m="buy"]',{force:true});await B.waitForTimeout(1500);
console.log('B after buy',await B.evaluate(()=>localStorage.rk_gem+' | '+localStorage.tw_inv));
// joia: B só tem 10 💎 agora → sem dinheiro
const jk=await B.evaluate(()=>([...document.querySelectorAll('#rkWrap .mnCell')].find(b=>/JOIA/.test(b.textContent))||{dataset:{}}).dataset.k);
if(jk){await B.click(`#rkWrap .mnCell[data-k="${jk}"]`,{force:true});await B.waitForTimeout(300);await B.click('#rkWrap [data-m="buy"]',{force:true});await B.waitForTimeout(600);console.log('B toast',await B.evaluate(()=>document.getElementById('rkToast').textContent))}
// A cancela a joia e recebe
await A.click('#rkWrap [data-m="tab"][data-k="mine"]',{force:true});await A.waitForTimeout(1500);
console.log('dbg',await A.evaluate(()=>{const R=__v25();return R.mnKey()+' L:'+(R.MN.L&&R.MN.L.map(l=>l.mkv+'/'+l.lid).join(','))+' tab:'+R.MN.tab+' rows:'+R.mnRows().length}));console.log('btn',await B.evaluate(()=>document.querySelector('.mnBtn').innerHTML));console.log('A mine',await A.evaluate(()=>[...document.querySelectorAll('#rkWrap .mnCell')].map(b=>b.dataset.k+' '+b.textContent)+' tab:'+(document.querySelector('.mnTab.on')||{}).className));await A.screenshot({path:S+'mn_mine0.png'});const mk=await A.evaluate(()=>([...document.querySelectorAll('#rkWrap .mnCell')].find(b=>/JOIA/.test(b.textContent))).dataset.k);
await A.click(`#rkWrap .mnCell[data-k="${mk}"]`,{force:true});await A.waitForTimeout(300);await A.click('#rkWrap [data-m="cancel"]',{force:true});await A.waitForTimeout(2500);
await A.click('#rkWrap [data-m="tab"][data-k="mine"]',{force:true});await A.waitForTimeout(2500);await A.screenshot({path:S+'mn_mine.png'});
console.log('A after claim',await A.evaluate(()=>localStorage.rk_gem+' | '+localStorage.rk_ps+' | mkc '+localStorage.rk_mkc));
// segunda vez não recebe de novo
await A.evaluate(()=>localStorage.removeItem('rk_mkc'));await A.click('#rkWrap [data-m="tab"][data-k="mine"]',{force:true});await A.waitForTimeout(2500);console.log('A again',await A.evaluate(()=>localStorage.rk_gem+' | '+localStorage.rk_ps));
console.log(errs);await b.close()})();
