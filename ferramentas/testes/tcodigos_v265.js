const {chromium}=require('playwright');const W='/home/claude/fui-do-templo-a-pk-2/www/';const IDS=new Set();
(async()=>{const b=await chromium.launch();const errs=[];
const run=async(uid,code)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
 await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,body:'{}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
 await p.addInitScript(u=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:JSON.stringify(u),tw_nome:'"J'+u+'"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_gem:'0',rk_tic:'0'})}},uid);
 await p.goto('file://'+W+'index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
 await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="code"]');await p.waitForTimeout(300);await p.fill('#rkCdI',code);await p.click('#rkCdOk');await p.waitForTimeout(900);
 console.log(uid,code,await p.evaluate(()=>(document.querySelector('#rkModal .twH.ok,#rkModal .twH.err')||{}).textContent+' | gem '+localStorage.rk_gem+' tic '+localStorage.rk_tic+' bp '+localStorage.rk_bp));await p.close()};
await run('a1','diamante7f4q8');await run('a1','DIAMANTE7F4Q8');await run('b2','DIAMANTE7F4Q8');console.log(errs);await b.close()})();
