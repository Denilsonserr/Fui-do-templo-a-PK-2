// v240: código do INFLUENCIADOR e CAIXA DE GEMAS (1 vez por conta), baús sem poção, vídeo da invocação do Yuta. Códigos por env C1/C2 (não ficam no repositório).
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const DB={};
const page=async(init)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});const m=u.match(/documentId=([^&]+)/),id=m?m[1]:'a'+Math.random();if(DB[id])return r.fulfill({status:409,body:'{}'});DB[id]=1;return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},init);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(500);return p};
const base={tw_nome:'"Influ"',tw_uid:'"u1"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1',rk_gem:'0',ac_n:'Influ',ac_k:'abc'};
const use=async(p,code)=>{await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="code"]');await p.waitForTimeout(200);await p.fill('#rkCdI',code);await p.click('#rkCdOk');await p.waitForTimeout(1800);return p.evaluate(()=>document.getElementById('rkCdE')?.innerText||'')};
const out={};const P=await page(base);out.m1=await use(P,process.env.C1);await P.screenshot({path:SH+'v40_inf.png'});await P.click('#rkDbx',{force:true});await P.waitForTimeout(1500);await P.screenshot({path:SH+'v40_inf2.png'});
out.s1=await P.evaluate(()=>({gem:localStorage.rk_gem,po:localStorage.rk_po,mo:localStorage.tw_moedas,tit:localStorage.tw_tit,on:localStorage.tw_titOn}));
await P.click('#rkDok');await P.waitForTimeout(400);await P.click('#rkWrap [data-a="code"]');await P.waitForTimeout(200);await P.fill('#rkCdI',process.env.C1);await P.click('#rkCdOk');await P.waitForTimeout(1500);out.again=await P.evaluate(()=>document.getElementById('rkCdE')?.innerText);
await P.fill('#rkCdI',process.env.C2);await P.click('#rkCdOk');await P.waitForTimeout(1800);await P.click('#rkDbx',{force:true});await P.waitForTimeout(1500);await P.screenshot({path:SH+'v40_gem.png'});out.gem2=await P.evaluate(()=>localStorage.rk_gem);
const S=await page(Object.assign({},base,{ac_n:'',ac_k:''}));await S.evaluate(()=>{localStorage.removeItem('ac_n');localStorage.removeItem('ac_k')});out.semConta=await use(S,process.env.C2);
// perfil com o título
await P.evaluate(()=>{document.querySelectorAll('#twModal').forEach(m=>m.hidden=true)});
console.log(JSON.stringify(out),JSON.stringify(P.errs.concat(S.errs)));await b.close()})();
