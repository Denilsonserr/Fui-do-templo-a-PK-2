// v468: espaço do COLAR — colar velho no espaço do anel migra; anel e colar juntos nas duas telas
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_own:'["goku","sung"]',rk_sel:'"sung"',
 tw_inv:JSON.stringify([{id:'c1',nm:'COLAR DAS SOMBRAS',sj:1,t:'anel',r:'sec',v:0,dmg:45,vel:70,st:75,img:'a/72b0abc7fc3f14.webp',ysec:1},{id:'a1',nm:'ANEL DO MONARCA',sj:1,t:'anel',r:'sec',v:0,dmg:50,crit:30,drop:30,ysec:1}]),tw_eqp:'{"anel":"c1"}'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
const clr=()=>p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''}document.querySelectorAll('#lvrzM,#acM,.rkWin').forEach(x=>x.remove())});await clr();
const m1=await p.evaluate(()=>({inv:JSON.parse(localStorage.tw_inv).map(x=>x.nm+':'+x.t).join(','),eqp:localStorage.tw_eqp}));
/* equipa o anel no espaço do anel (mochila) */
await p.evaluate(()=>{const Q=JSON.parse(localStorage.tw_eqp);Q.anel='a1';localStorage.tw_eqp=JSON.stringify(Q)});
await p.evaluate(()=>__pvT.rv('lib'));await p.waitForTimeout(1200);await clr();await p.evaluate(()=>{const b=document.querySelector('[data-a="tab"][data-t="eq"]');if(b)b.click()});await p.waitForTimeout(1200);await p.screenshot({path:'/tmp/col_eq.png'});
await p.evaluate(()=>__pvT.rv('rb'));await p.waitForTimeout(1200);await clr();await p.evaluate(()=>document.querySelector('[data-a="equip"]').click());await p.waitForTimeout(1200);await p.screenshot({path:'/tmp/col_moc.png'});
console.log(JSON.stringify({migrou:m1}),E.slice(0,3));await b.close()})();
