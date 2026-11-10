// v308: servidor no limite (429): mensagem certa no chat/conta e o jogo segue
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));let q=0;
await p.route(/fonts\.g/,r=>r.abort());await p.route(/firestore/,r=>{if(/runQuery/.test(r.request().url())){q++;return r.fulfill({status:429,contentType:'application/json',body:'[{"error":{"code":429}}]'})}return r.fulfill({status:200,body:'{}'})});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(1200);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});await p.click('#rkWrap [data-a="boss"]',{force:true});await p.waitForTimeout(2500);
const chat=await p.evaluate(()=>(document.getElementById('rkChL')||{}).textContent);const q1=q;
await p.click('#rkWrap [data-a="conta"]',{force:true}).catch(()=>{});await p.waitForTimeout(300);
console.log({chat,consultas:q1},'erros',JSON.stringify(errs));await b.close()})();
