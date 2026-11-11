// v340: faixa do evento em várias telas (relógio no meio do evento de desculpas)
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/evb_';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(o=>{const n=Date.now;Date.now=()=>n()+o;if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]'})}},Date.UTC(2026,10,11,19,12)-Date.now());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);await p.screenshot({path:SH+'titulo.png'});
await p.click('#mRank');await p.waitForTimeout(3000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});await p.screenshot({path:SH+'menu.png'});
for(const a of ['boss','gacha','caca','pvp']){await p.click('#rkWrap [data-a="back"]',{force:true}).catch(()=>{});await p.waitForTimeout(600);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});await p.click(`#rkWrap [data-a="${a}"]`,{force:true});await p.waitForTimeout(2000);await p.screenshot({path:SH+a+'.png'})}
console.log(await p.evaluate(()=>document.getElementById('evBar')?.innerText),'\nERROS',errs);await b.close()})();
