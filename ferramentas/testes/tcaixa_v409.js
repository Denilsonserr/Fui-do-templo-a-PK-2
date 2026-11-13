// v409: Caixa Surpresa — 2%→4% de EVOLUIR uma peça de Virgem que a pessoa já tem (não cria item, V2 não repete)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const caso of ['tem','nada','jav2']){const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(c=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const I=c==='tem'?[{id:'a',nm:'ELMO DE VIRGEM',t:'cap',r:'sec',def:90,crit:60,sk:1,ysec:1}]:c==='jav2'?[{id:'a',nm:'ELMO DIVINO V2',t:'cap',r:'sec',v2:1,skb:'skcap',def:122}]:[];
  Object.assign(localStorage,{tw_nome:'"E"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sxbox:'1',rk_sxav:'"x"',tw_inv:JSON.stringify(I),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}},caso);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>{const n=JSON.parse(localStorage.tw_inv||'[]');if(n[0]&&n[0].nm==='ELMO DE VIRGEM')Object.assign(n[0],{});Math.random=()=>0.001});
await p.click('#mRank');await p.waitForTimeout(800);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''}});
await p.evaluate(()=>{__pvT.sx();document.querySelector('#rkWrap [data-a="shop"]')&&0});
await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="shop"]');b&&b.click()});await p.waitForTimeout(500);await p.evaluate(()=>{const b=document.querySelector('[data-a="sxShop"]');b&&b.click()});await p.waitForTimeout(500);
await p.click('#rkWrap [data-a="sxBox"]',{force:true});await p.waitForTimeout(300);await p.click('#sxOp');await p.waitForTimeout(2800);
const h=await p.$eval('#rkModal h3',e=>e.textContent).catch(()=>'?');const inv=await p.evaluate(()=>JSON.parse(localStorage.tw_inv||'[]').map(x=>x.nm+(x.v2?' (v2)':'')));
console.log(caso,'|',h,'|',JSON.stringify(inv),errs.slice(0,2));await p.close()}await b.close()})();
