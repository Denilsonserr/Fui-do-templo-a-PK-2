// v362: devolução automática 5.000 gemas + 100.000 moedas, uma vez só (mesmo reabrindo)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_gem:'120',tw_moedas:'300',rk_lvrz:'1',rk_pvupv:'352',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3500);
await p.screenshot({path:'/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/gf362.png'});const st=()=>p.evaluate(()=>[localStorage.rk_gem,localStorage.tw_moedas,!!document.getElementById('lvrzM')]);console.log('1ª vez',await st());
await p.click('#gfOk');await p.waitForTimeout(500);await p.reload();await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3500);console.log('2ª vez',await st());
console.log('ERROS',errs);await b.close()})();
