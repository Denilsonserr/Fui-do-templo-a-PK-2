// v411: abrir 10 caixas surpresa de uma vez
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"E"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sx:'6000',rk_sxbox:'2',rk_sxav:'"x"',tw_inv:JSON.stringify([{id:'a',nm:'ELMO DE VIRGEM',t:'cap',r:'sec',def:90,sk:1,ysec:1}]),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(800);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''}});
await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="shop"]');b&&b.click()});await p.waitForTimeout(500);await p.evaluate(()=>{const b=document.querySelector('[data-a="sxShop"]');b&&b.click()});await p.waitForTimeout(500);
await p.click('#rkWrap [data-a="sxBox"]',{force:true});await p.waitForTimeout(400);await p.screenshot({path:'/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/t10a.png'});
await p.click('.sxM [data-n="10"]');await p.waitForTimeout(2600);await p.screenshot({path:'/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/t10b.png'});
console.log(await p.evaluate(()=>({sx:localStorage.rk_sx,box:localStorage.rk_sxbox,n:document.querySelectorAll('.sxGr div').length})),errs);await b.close()})();
