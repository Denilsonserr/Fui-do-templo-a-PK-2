// v206: código de uso único — 1º aparelho ganha os míticos, 2º aparelho recebe "já foi usado" (Firestore simulado: documentId repetido = 409)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const IDS=new Set();
const run=async(uid)=>{const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(u=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();localStorage.tw_uid=JSON.stringify(u);localStorage.tw_nome='"Jog'+u+'"'}},uid);await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});
    const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,contentType:'application/json',body:'{"error":{"code":409}}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await p.evaluate(()=>{Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_own:'["goku","garou"]',rk_sel:'"garou"'})});await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="torre"]');await p.waitForTimeout(1200);
  await p.click('#rtUI .rtRow button[data-c="twNameB"]');await p.waitForTimeout(300);await p.fill('#twName0','mitico-z9lk-spp9');await p.click('#twNmOk');await p.waitForTimeout(1200);
  const msg=await p.evaluate(()=>document.getElementById('twNameE').textContent);await p.screenshot({path:'/tmp/cp_'+uid+'.png'});
  console.log(uid,msg,'| inv',await p.evaluate(()=>localStorage.tw_inv+' eqp '+localStorage.tw_eqp+' nome '+localStorage.tw_nome),'ERROS',JSON.stringify(errs));await p.close()};
await run('a1');await run('b2');await b.close()})();
