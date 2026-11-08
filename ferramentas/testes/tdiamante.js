// v218: código da CAIXA DE DIAMANTES — só quem está na lista da Torre (uid ou nome), 1 vez por pessoa
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const IDS=new Set();
const run=async(uid,nome,tag)=>{const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(([u,n])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();localStorage.tw_uid=JSON.stringify(u);localStorage.tw_nome=JSON.stringify(n)}},[uid,nome]);await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});
    const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,contentType:'application/json',body:'{"error":{"code":409}}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await p.click('#mTorre');await p.waitForTimeout(500);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(1200);
  await p.click('#twNameB');await p.waitForTimeout(300);await p.fill('#twName0','torre-vkub-mrqk');await p.click('#twNmOk');await p.waitForTimeout(1600);
  const msg=await p.evaluate(()=>document.getElementById('twNameE')?.textContent);const box=await p.$('#rkDbx');if(box){await p.screenshot({path:'/tmp/dia_'+tag+'0.png'});await p.click('#rkDok');await p.waitForTimeout(1800);await p.screenshot({path:'/tmp/dia_'+tag+'.png'});await p.click('#rkDok')}
  console.log(tag,msg,'| gem',await p.evaluate(()=>localStorage.rk_gem),'IDS',[...IDS].join(' '),'ERROS',JSON.stringify(errs));await p.close()};
await run('mw8697axqj3ixwzu','Breno','lista_uid');await run('mw8697axqj3ixwzu','Breno','repetido');await run('zzz1','Fulano','fora');await run('zzz2','Vinicius','lista_nome');await b.close()})();
