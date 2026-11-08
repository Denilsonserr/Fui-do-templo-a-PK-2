// v210: vender equipamento por moedas
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:'"meu"',tw_nome:'"Teste"',tw_ts203:'1',tw_moedas:'50',tw_inv:JSON.stringify([{id:'m',t:'esp',r:'mit',v:10},{id:'r',t:'bot',r:'rara',v:4}])})}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mTorre');await p.waitForTimeout(500);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(1200);
await p.click('#twBagB');await p.waitForTimeout(600);await p.click('#twModal .moS[data-id="m"]');await p.waitForTimeout(300);await p.click('#twMoD button[data-a="sell"]');await p.waitForTimeout(300);await p.screenshot({path:'/tmp/vd1.png'});
await p.click('#twMoD button[data-a="sell"]');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/vd2.png'});
console.log(await p.evaluate(()=>localStorage.tw_moedas+' | '+localStorage.tw_inv),'ERROS',JSON.stringify(errs));await b.close()})();
