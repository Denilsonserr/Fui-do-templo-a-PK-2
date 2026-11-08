// v219: campo de CÓDIGO no ranqueado + Caixa de Diamantes automática para quem jogou a Torre
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const IDS=new Set();
const run=async(uid,nome,tag,code)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(([u,n])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:JSON.stringify(u),tw_nome:JSON.stringify(n),rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"'})}},[uid,nome]);await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});
    const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,contentType:'application/json',body:'{"error":{"code":409}}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await p.click('#mRank');await p.waitForTimeout(2800);let auto=false;if(await p.$('#rkDbx')){auto=true;await p.screenshot({path:'/tmp/cr_auto.png'});await p.click('#rkDok');await p.waitForTimeout(1500);await p.click('#rkDok');await p.waitForTimeout(400)}
  const g1=await p.evaluate(()=>localStorage.rk_gem);let msg='';
  if(code){await p.click('#rkWrap [data-a="code"]');await p.waitForTimeout(300);await p.fill('#rkCdI',code);await p.screenshot({path:'/tmp/cr_campo.png'});await p.click('#rkCdOk');await p.waitForTimeout(600);await p.screenshot({path:'/tmp/cr_msg.png'});await p.waitForTimeout(1200);msg=await p.evaluate(()=>document.getElementById('rkCdE')?.textContent||'');
    if(await p.$('#twCpOk')){await p.screenshot({path:'/tmp/cr_bau.png'});await p.click('#twCpOk');await p.waitForTimeout(900)}}
  console.log(tag,'auto',auto,'gem',g1,'| codigo:',msg,'| inv',await p.evaluate(()=>(JSON.parse(localStorage.tw_inv||'[]').length+JSON.parse(localStorage.tw_poc||'[]').length)+' tela '+document.querySelector('#rkWrap [data-a]')?.dataset.a),'ERROS',JSON.stringify(errs));await p.close()};
await run('mw7zg9f7vo6m6db3','Denilson ADM','dono','BAU-JL2G-TK3K');await run('mw7zg9f7vo6m6db3','Denilson ADM','dono_de_novo','TORRE-VKUB-MRQK');await run('zz9','Fulano','fora','ABC-123');await b.close()})();
