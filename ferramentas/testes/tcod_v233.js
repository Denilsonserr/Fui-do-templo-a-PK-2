// v233: código 6 baús míticos + 7 lendários (uso único) e código do PEITORAL LENDÁRIO ÚNICO (uso único)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const IDS=new Set();
const run=async(uid,code,tag)=>{const p=await b.newPage({viewport:{width:1040,height:480},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,body:'{}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(u=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"X'+u+'"',tw_uid:JSON.stringify(u),rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1'})}},uid);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="code"]');await p.fill('#rkCdI',code);await p.click('#rkCdOk');await p.waitForTimeout(1600);const msg=await p.evaluate(()=>document.getElementById('rkCdE')?.textContent);
  let lotes=0;for(let i=0;i<14;i++){if(await p.$('#twCpOk')){lotes++;await p.screenshot({path:'/tmp/c233_'+tag+lotes+'.png'});await p.click('#twCpOk');await p.waitForTimeout(1300)}else await p.waitForTimeout(700)}
  const r=await p.evaluate(()=>({inv:JSON.parse(localStorage.tw_inv||'[]').map(x=>x.t+':'+x.r+(x.uniq?':UNICO v'+x.v+' dmg'+x.dmg+' st'+x.st:'')),poc:JSON.parse(localStorage.tw_poc||'[]').map(x=>x.r),eqp:localStorage.tw_eqp}));
  console.log(tag,msg,'lotes',lotes,JSON.stringify(r),'ERROS',JSON.stringify(errs));await p.close()};
await run('a','baus-2u62-bfqh','pocoes');await run('b','BAUS-2U62-BFQH','pocoes2');await run('c','peito-aev6-s5d9','peito');await run('d','PEITO-AEV6-S5D9','peito2');await b.close()})();
