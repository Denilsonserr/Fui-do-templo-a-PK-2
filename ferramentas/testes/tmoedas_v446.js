const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',rk_ini:'1',rk_xpv2:'1',tw_moedas:'281238'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1000);
await p.evaluate(()=>{__pvT.rkS&&0;try{rkS('gem',93343);rkS('tic',134);rkS('red',4759)}catch(e){}});
await p.evaluate(()=>__pvT.rkO('menu'));await p.waitForTimeout(2000);await p.screenshot({path:'/tmp/m2.png',clip:{x:450,y:0,width:465,height:40}});await b.close()})();
