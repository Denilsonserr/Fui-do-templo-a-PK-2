// v467: ADM testa os Portais antes das 12:00; jogador normal continua trancado
const {chromium}=require('playwright');
const run=async(b,adm)=>{const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(adm=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:adm?'"Denilson ADM"':'"Bia"',tw_tit:adm?'["adm"]':'[]',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs464:'1',rk_rs464b:'1'})}},adm);
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''}document.querySelectorAll('#lvrzM,#acM,.rkWin').forEach(x=>x.remove())});
await p.evaluate(()=>document.querySelector('[data-a="portais"]').click());await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/pt_'+(adm?'adm':'normal')+'.png'});
const r=await p.evaluate(()=>({tela:!!document.querySelector('.rk_pt, [class*="ptL"], .ptDs'),lk:document.querySelector('[data-a="portais"]')?document.querySelector('[data-a="portais"]').className:'-'}));await p.close();return [r,E.slice(0,2)]};
(async()=>{const b=await chromium.launch();console.log(JSON.stringify({adm:await run(b,1),normal:await run(b,0)}));await b.close()})();
