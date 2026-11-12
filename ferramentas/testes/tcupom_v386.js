// v386: SUPREMO40MIL (uso único) — 1º aparelho ganha 40.000 💎 + mítico + equipamento do Shaka; 2º recebe "já foi usado"
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const IDS=new Set();
const run=async(uid)=>{const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:'"${uid}"',tw_nome:'"Jog${uid}"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_own:'["goku","garou"]',rk_sel:'"garou"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now())})}`);await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com|workers\.dev\/fs/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});
    const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,contentType:'application/json',body:'{"error":{"code":409}}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2000);
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.tnO()});await p.waitForTimeout(1500);const g0=await p.evaluate(()=>localStorage.rk_gem);
  await p.evaluate(()=>document.getElementById('twNameB').click());await p.waitForTimeout(500);await p.fill('#twName0','SUPREMO40MIL');await p.click('#twNmOk');await p.waitForTimeout(800);const msg=await p.evaluate(()=>(document.getElementById('twNameE')||{}).textContent);await p.waitForTimeout(4000);
  await p.screenshot({path:'/tmp/sup_'+uid+'.png'});
  console.log(uid,msg,'| gemas',g0,'→',await p.evaluate(()=>localStorage.rk_gem+' | own '+localStorage.rk_own+' | mochila '+(localStorage.tw_inv||'').slice(0,160)),'ERROS',JSON.stringify(errs));await p.close()};
await run('a1');await run('b2');await b.close()})();
