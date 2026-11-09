// v238 PRESENTE DO ADM (código passado por env CODE, não fica no repositório)
const {chromium}=require('playwright');const SH=process.env.SH,CODE=process.env.CODE;
(async()=>{const b=await chromium.launch();const DB={};
const page=async(init)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});
    const m=u.match(/documentId=([^&]+)/),id=m?m[1]:'a'+Math.random();if(DB[id])return r.fulfill({status:409,body:'{}'});DB[id]=1;return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},init);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(500);return p};
const base={rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1',rk_gem:'0',rk_tic:'0'};
const use=async(p,force)=>{await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="code"]');await p.waitForTimeout(200);if(force!=null)await p.evaluate(f=>{Math.random=()=>f},force);await p.fill('#rkCdI',CODE);await p.click('#rkCdOk');await p.waitForTimeout(1800);return p.evaluate(()=>document.getElementById('rkCdE')?.innerText||'')};
const out={};
const P0=await page(Object.assign({tw_nome:'"SemConta"',tw_uid:'"u0"'},base));out.semConta=await use(P0);
for(const [k,f] of [['chr',.05],['tic',.3],['gem',.8]]){const P=await page(Object.assign({tw_nome:'"P'+k+'"',tw_uid:'"u'+k+'"',ac_n:'P'+k,ac_k:'abc'},base));const m=await use(P,f);await P.screenshot({path:SH+'ag_'+k+'_fechada.png'});await P.click('#rkDbx',{force:true});await P.waitForTimeout(1500);await P.screenshot({path:SH+'ag_'+k+'.png'});
  out[k]={m,own:await P.evaluate(()=>localStorage.rk_own),gem:await P.evaluate(()=>localStorage.rk_gem),tic:await P.evaluate(()=>localStorage.rk_tic),errs:P.errs}}
const P2=await page(Object.assign({tw_nome:'"Ptic"',tw_uid:'"outro"',ac_n:'Ptic',ac_k:'abc'},base));out.mesmaConta=await use(P2);
console.log(JSON.stringify(out,null,1));await b.close()})();
