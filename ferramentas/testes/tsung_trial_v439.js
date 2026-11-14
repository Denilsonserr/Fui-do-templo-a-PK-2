// v439: teste do Sung por 10 min (ADM) — dá tudo e depois volta exatamente como estava
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',tw_moedas:'1234',rk_own:'["goku","shaka","sung"]',rk_sje:'50'})}});
await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
const snap=()=>p.evaluate(()=>['rk_own','rk_sjs','rk_sje','tw_moedas'].map(k=>localStorage.getItem(k)));const A=await snap();
await p.click('#admTB');await p.click('#admSJT');await p.waitForTimeout(1500);const B=await snap();const chip=await p.evaluate(()=>(document.getElementById('sjTrC')||{}).textContent);
await p.evaluate(()=>__pvT.sjShOpen());await p.click('#sjShw .sjEvo');await p.waitForTimeout(300);
await p.evaluate(()=>__pvT.sjTrEnd());await p.waitForTimeout(2500);const C=await snap();
console.log(JSON.stringify({antes:A,durante:B,chip,depois:C,semSung:!/sung/.test(C[0])&&C[1]===null&&C[2]===null&&C[3]===A[3]}),errs.slice(0,3));await b.close()})();
