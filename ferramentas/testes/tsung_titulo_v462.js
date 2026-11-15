// v462: títulos MONARCA Nº1..10 (visual + janela) e bônus de dano com o Sung
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));
await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',tw_tit:'["sj1"]'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1200);
await p.evaluate(()=>{const d=document.createElement('div');d.id='tt';d.style.cssText='position:fixed;inset:0;z-index:99999;background:#223;display:flex;flex-direction:column;flex-wrap:wrap;gap:22px 40px;align-content:center;justify-content:center;font-size:2.4vh;padding:40px 20px;font-size:15px;align-items:center;justify-items:center';d.innerHTML=[1,2,3,4,5,6,7,8,9,10].map(n=>'<div>'+__sjt.tit('sj'+n)+'</div>').join('');document.body.appendChild(d)});
await p.waitForTimeout(900);await p.screenshot({path:'/tmp/sjt_lista.png'});
await p.evaluate(()=>{document.getElementById('tt').remove();__sjt.win(1)});await p.waitForTimeout(1500);await p.waitForTimeout(1200);await p.screenshot({path:'/tmp/sjt_win.png'});
console.log(JSON.stringify({erros:E.slice(0,3)}));await b.close()})();
