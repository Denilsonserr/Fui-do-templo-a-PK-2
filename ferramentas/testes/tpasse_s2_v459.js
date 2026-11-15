// v459: PASSE TEMPORADA SOLO LEVELING — tela nova, pegar tudo no grátis, código PREMIUM (C1), pegar tudo no premium, conferir itens; código velho não libera
const {chromium}=require('playwright');const C1=process.env.C1;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_own:'["goku"]',rk_gem:'0',rk_bp:JSON.stringify({s:2,xp:5000,c:{},dd:'',d:{},dc:[],sc:[],cf:[],cn:[],cp:[],own:0}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
const clr=()=>p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});await clr();
await p.evaluate(()=>__pvT.rv('bp'));await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/bp1.png'});
const st=()=>p.evaluate(()=>{const I=JSON.parse(localStorage.tw_inv||'[]'),P=JSON.parse(localStorage.tw_poc||'[]'),A=JSON.parse(localStorage.rk_an||'[]');return {gem:+localStorage.rk_gem,red:+(localStorage.rk_red||0),po:+(localStorage.rk_po||0),own:localStorage.rk_own,itens:I.map(x=>x.nm).join(','),pocoes:P.map(x=>x.nm||x.pk).join(','),aneis:A.map(x=>['B','Am','Rx','Pt','Vm'][x.c]+['E','D','C','B','A','S','SS','SSS'][x.g]).join(',')}});
await p.evaluate(()=>document.querySelector('[data-b="all"]').click());await p.waitForTimeout(6000);await clr();await p.evaluate(()=>document.querySelectorAll('.rkWin').forEach(x=>x.remove()));
console.log('GRÁTIS:',JSON.stringify(await st()));
/* código velho da temporada 1 (prêmio) não libera */
const cod=async C=>{await p.evaluate(()=>{const x=document.querySelector('[data-b="code"]');x.click()});await p.waitForTimeout(500);await p.fill('#rkCdI',C);await p.evaluate(()=>document.getElementById('rkCdOk').click());await p.waitForTimeout(2000);const t=await p.evaluate(()=>{const e=document.getElementById('rkCdE');return e?e.textContent:'?'});await clr();return t};
console.log('código novo:',await cod(C1));await p.evaluate(()=>__pvT.rv('bp'));await p.waitForTimeout(800);
console.log('own',await p.evaluate(()=>JSON.parse(localStorage.rk_bp).own));
await p.evaluate(()=>document.querySelector('[data-b="all"]').click());await p.waitForTimeout(8000);await p.evaluate(()=>document.querySelectorAll('.rkWin').forEach(x=>x.remove()));await clr();
console.log('PREMIUM:',JSON.stringify(await st()));
await p.evaluate(()=>__pvT.rv('bp'));await p.waitForTimeout(800);await p.screenshot({path:'/tmp/bp2.png'});await p.evaluate(()=>document.querySelector('[data-b="pg"]').click());await p.waitForTimeout(800);await p.screenshot({path:'/tmp/bp3.png'});
console.log('ERROS',E);await b.close()})();
