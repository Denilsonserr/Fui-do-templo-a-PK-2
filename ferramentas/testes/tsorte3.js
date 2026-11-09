// v229: Torre em tela cheia com título no lugar do nome + código SORTE MÁXIMA (100–1000, 1 vez por nome)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const IDS=new Set();
const run=async(nome,uid,tag,shot)=>{const p=await b.newPage({viewport:{width:1040,height:480},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,body:'{}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(([n,u])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:JSON.stringify(n),tw_uid:JSON.stringify(u),tw_tit:'["adm","ini"]',tw_titOn:'"adm"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","naruto"]',rk_sel:'"naruto"',rk_rp:'9489',rk_dia:'1',rk_gem:'0'})}},[nome,uid]);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await p.click('#mRank');await p.waitForTimeout(500);if(shot){await p.click('#rkWrap [data-a="torre"]');await p.waitForTimeout(1200);await p.screenshot({path:'/tmp/tw2.png'});await p.click('#rtBack2');await p.waitForTimeout(800)}
  await p.click('#rkWrap [data-a="code"]');await p.fill('#rkCdI','sorte-4yue-cxpn');await p.click('#rkCdOk');await p.waitForTimeout(1500);const msg=await p.evaluate(()=>document.getElementById('rkCdE')?.textContent);
  if(await p.$('#rkDok')){await p.click('#rkDok');await p.waitForTimeout(1800);await p.screenshot({path:'/tmp/s3.png'});await p.click('#rkDok')}
  console.log(tag,msg,'gem',await p.evaluate(()=>localStorage.rk_gem),'ERROS',JSON.stringify(errs));await p.close()};
await run('Denilson ADM','u1','dono',1);await run('Denilson ADM','u2','mesmoNomeOutroCel');await run('Outro','u3','outro');await b.close()})();
