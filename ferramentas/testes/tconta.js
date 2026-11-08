// v220: CONTA (nome + senha) — cria no aparelho A, entra no aparelho B; código SORTE (100–600, 1 vez por pessoa)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const DB={};
const page=async(init)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},init);await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();
    if(/:runQuery/.test(u)){const q=JSON.parse(r.request().postData()).structuredQuery,w=q.where&&q.where.fieldFilter;let L=Object.entries(DB).filter(([id,f])=>w&&f[w.field.fieldPath]&&Object.values(f[w.field.fieldPath])[0]===w.value.stringValue).sort((a,b)=>a[0]<b[0]?1:-1).slice(0,q.limit||100);
      return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L.map(([id,f])=>({document:{name:'x/torre/'+id,fields:f}})))})}
    const m=u.match(/documentId=([^&]+)/);if(m){if(DB[m[1]])return r.fulfill({status:409,body:'{}'});DB[m[1]]=JSON.parse(r.request().postData()).fields}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});return p};
const A=await page({tw_nome:'"Goku Black"',tw_uid:'"uidA"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","vegeta"]',rk_sel:'"goku"',rk_gem:'777',rk_rp:'5200'});
await A.screenshot({path:'/tmp/ac_title.png'});await A.click('#mConta');await A.waitForTimeout(300);await A.screenshot({path:'/tmp/ac_novo.png'});
await A.fill('#acP1','1234');await A.fill('#acP2','1234');await A.click('#acNew');await A.waitForSelector('#acSv',{timeout:20000});await A.screenshot({path:'/tmp/ac_ok.png'});
// código da sorte no ranqueado
await A.click('#acX');await A.click('#mRank');await A.waitForTimeout(800);await A.click('#rkWrap [data-a="code"]');await A.fill('#rkCdI','sorte-b9mp-n7pw');await A.click('#rkCdOk');await A.waitForTimeout(1500);await A.screenshot({path:'/tmp/ac_sorte0.png'});await A.click('#rkDok');await A.waitForTimeout(1700);await A.screenshot({path:'/tmp/ac_sorte.png'});await A.click('#rkDok');
const gA=await A.evaluate(()=>localStorage.rk_gem);await A.click('#rkWrap [data-a="code"]');await A.fill('#rkCdI','SORTE-B9MP-N7PW');await A.click('#rkCdOk');await A.waitForTimeout(1200);const again=await A.evaluate(()=>document.getElementById('rkCdE').textContent);await A.click('#rkMX');
await A.click('#rkWrap [data-a="conta"]');await A.click('#acSv');await A.waitForTimeout(2500);const svA=await A.evaluate(()=>document.getElementById('acE').textContent);
// aparelho B novo
const B=await page({tw_uid:'"uidB"'});await B.click('#mConta');await B.waitForTimeout(300);await B.click('#acM .twTab button[data-t="entrar"]');await B.fill('#acN','goku black');await B.fill('#acP','9999');await B.click('#acIn');await B.waitForTimeout(2500);const errB=await B.evaluate(()=>document.getElementById('acE').textContent);
await B.fill('#acP','1234');await Promise.all([B.waitForNavigation({timeout:30000}),B.click('#acIn')]);await B.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const dB=await B.evaluate(()=>({nome:localStorage.tw_nome,uid:localStorage.tw_uid,gem:localStorage.rk_gem,rp:localStorage.rk_rp,own:localStorage.rk_own,ac:localStorage.ac_n}));
const C=await page({tw_nome:'"Outro"',tw_uid:'"uidC"'});await C.click('#mConta');await C.click('#acM .twTab button[data-t="entrar"]');await C.fill('#acN','Ninguem');await C.fill('#acP','1');await C.click('#acIn');await C.waitForTimeout(2500);const errC=await C.evaluate(()=>document.getElementById('acE').textContent);
console.log(JSON.stringify({gA,again,svA,errB,dB,errC,docs:Object.keys(DB)}),'ERROS',JSON.stringify([A.errs,B.errs,C.errs]));await b.close()})();
