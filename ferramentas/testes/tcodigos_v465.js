// v465: códigos da atualização (env C1..C4 = textos do dono): diamantes, caixa de anel S, passe pago, passe 2X (pega o nível 1 e o 8 para ver o dobro, sem a Caixa V2)
const {chromium}=require('playwright');const [C1,C2,C3,C4]=[process.env.C1,process.env.C2,process.env.C3,process.env.C4];
const go=async(b,fn)=>{const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs464:'1',rk_rs464b:'1',rk_own:'["goku"]',rk_gem:'0',rk_bp:JSON.stringify({s:2,xp:5000,c:{},dd:'',d:{},dc:[],sc:[],cf:[],cn:[],cp:[],own:0}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
const clr=()=>p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM,.rkWin').forEach(x=>x.remove())});await clr();
const cod=async C=>{const t=await p.evaluate(async C=>{const E=document.createElement('div');await __cup(C,E);return E.className+' | '+E.textContent},C);await clr();return t};
const r=await fn(p,cod,clr);await p.close();return [r,E.slice(0,2)]};
(async()=>{const b=await chromium.launch();const R={};
R.gemas=await go(b,async(p,cod)=>[await cod(C1),await p.evaluate(()=>localStorage.rk_gem),await cod(C1)]);
R.anel=await go(b,async(p,cod)=>[await cod(C2),await p.evaluate(()=>JSON.parse(localStorage.rk_an||'[]').map(x=>x.c+'/'+x.g).join(','))]);
R.pago=await go(b,async(p,cod)=>[await cod(C3),await p.evaluate(()=>JSON.parse(localStorage.rk_bp).own)]);
R.x2=await go(b,async(p,cod,clr)=>{const t=await cod(C4);const g0=+await p.evaluate(()=>localStorage.rk_gem);await p.evaluate(()=>__pvT.rv('bp'));await p.waitForTimeout(800);
  const g=await p.evaluate(async()=>{const o=JSON.parse(localStorage.rk_bp);return o.own+'/'+o.x2});await p.evaluate(()=>document.querySelector('[data-b="all"]').click());await p.waitForTimeout(7000);await clr();
  return [t,g,g0,await p.evaluate(()=>({gem:+localStorage.rk_gem,inv:JSON.parse(localStorage.tw_inv||'[]').filter(x=>x.v2).length+' peças V2',aneis:JSON.parse(localStorage.rk_an||'[]').length}))]});
console.log(JSON.stringify(R,null,1));await b.close()})();
