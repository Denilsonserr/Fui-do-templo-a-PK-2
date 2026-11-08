// v209: poção mítica dá +20% transf, +20% dano, +20% crítico na próxima luta; loja com preços novos
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:'"meu"',tw_nome:'"Teste"',tw_ts203:'1',tw_moedas:'5000',tw_poc:JSON.stringify([{id:'m',r:'mit',v:10},{id:'c',r:'comum',v:1}])})}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
console.log('MIGRADO',await p.evaluate(()=>localStorage.tw_poc));
await p.click('#mTorre');await p.waitForTimeout(500);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(1500);
await p.click('#twShB');await p.waitForTimeout(600);await p.screenshot({path:'/tmp/p2_loja.png'});await p.click('#twShX');
await p.click('#twBagB');await p.waitForTimeout(600);await p.click('#twModal .moS[data-id="m"]');await p.waitForTimeout(300);await p.screenshot({path:'/tmp/p2_det.png'});await p.click('#twMoD button[data-a="beber"]');await p.waitForTimeout(300);await p.click('#twBagX');
await p.click('#twGo');await p.waitForTimeout(1600);await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');await p.waitForTimeout(300);
console.log('LUTA',JSON.stringify(await p.evaluate(()=>{const a=__dbg.G.p[0];return {tdm:a.tdm,tcr:a.tcr,tsb:a.tsb,sb:+a.sb.toFixed(2),ativa:localStorage.tw_pocOn}})));
console.log('ERROS',JSON.stringify(errs));await b.close()})();
