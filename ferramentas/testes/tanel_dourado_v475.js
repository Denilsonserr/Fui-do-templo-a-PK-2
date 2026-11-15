// v475: anel dourado (1–10 milhões de anos): sorteio (notas), biblioteca de anéis, aura no chão, passivas do SP, drop no baú do chefe do portal
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_lv:JSON.stringify({goku:{lv:50}}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const D=await p.evaluate(()=>{const c={};let sp=0,n=200000;for(let i=0;i<n;i++){const r=__ang.roll();c[r.g]=(c[r.g]||0)+1}const G=['E','D','C','B','A','S','SS','SSS','SP'];return G.map((g,i)=>g+':'+((c[i]||0)/n*100).toFixed(2)+'%').join(' ')});
/* dá 1 SP, 1 SSS, 1 C e equipa no Goku */
await p.evaluate(()=>{const L=[];let r;do{r=__ang.roll()}while(r.g!==8);L.push(r);do{r=__ang.roll()}while(r.g!==7);L.push(r);do{r=__ang.roll()}while(r.g!==2);L.push(r);r.i='c';L[0].i='sp';L[1].i='sss';
  localStorage.rk_an=JSON.stringify(L);localStorage.rk_anEq=JSON.stringify({goku:['sp','sss','c']})});
await p.click('#mRank');await p.waitForTimeout(2000);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
await p.evaluate(()=>__pvT.rv('lib'));await p.waitForTimeout(800);await p.evaluate(()=>{const b=document.querySelector('[data-a="tab"][data-t="an"]');if(b)b.click()});await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/an_lib.png'});await p.evaluate(()=>{const b=document.querySelector('[data-a="tab"][data-t="chr"]')||document.querySelector('[data-a="tab"]');if(b)b.click()});await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/an_chao.png'});
const tx=await p.evaluate(()=>JSON.parse(localStorage.rk_an).map(r=>r.g+' '+r.a+' '+r.s+'/'+r.s2+(r.p?' '+r.p:'')).join(' | '));
console.log(JSON.stringify({notas:D,aneis:tx}),E.slice(0,3));await b.close()})();
