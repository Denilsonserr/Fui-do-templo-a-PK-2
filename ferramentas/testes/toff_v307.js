// v307: código de 70.000 💎 funciona SEM SERVIDOR e sem conta (1 vez por aparelho)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_gem:'0'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(1500);const o=[];
for(let i=0;i<2;i++){await p.waitForTimeout(1500);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});await p.click('#rkWrap [data-a="code"]',{force:true});await p.waitForTimeout(300);await p.fill('#rkCdI','gemas-70k-r5n8');await p.evaluate(()=>document.getElementById('rkCdOk').click());await p.waitForTimeout(800);o.push(await p.evaluate(()=>{const e=document.getElementById('rkCdE');return e?e.textContent:'(modal fechou) '+((document.querySelector('#rkModal h3')||{}).textContent||'')}))}
console.log(o,'gemas',await p.evaluate(()=>localStorage.rk_gem),'erros',JSON.stringify(errs));await b.close()})();
