// v378: roletas de passiva + boss do próximo andar sem travar (mede o maior quadro perto da entrada do boss)
const {chromium}=require('playwright');const U='file:///home/claude/fui-do-templo-a-pk-2/www/index.html';const O='/tmp/rl';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","naruto"]',rk_sel:'"naruto"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now())})}`);
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.tnO()});await p.waitForTimeout(1500);await p.evaluate(()=>__pvT.tnS(0));
await p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&T.ph==='boss'},null,{timeout:90000});
await p.evaluate(()=>{window.__fr=[];let l=performance.now();(function f(t){window.__fr.push([t-l,__pvT.tn().ph,(window.__fr.length)]);l=t;requestAnimationFrame(f)})(l)});
for(let fl=0;fl<2;fl++){await p.waitForTimeout(3000);
 await p.evaluate(()=>{const G=__pvT.G();G.p[0].hp=G.p[0].mhp;G.p[1].hp=1;__pvT.tnK()});await p.waitForTimeout(1800);await p.screenshot({path:O+'_bau'+fl+'.png'});
 await p.waitForTimeout(1800);await p.screenshot({path:O+'_gira'+fl+'.png'});await p.waitForTimeout(2600);await p.screenshot({path:O+'_res'+fl+'.png'});
 await p.evaluate(()=>{window.__fr=[]});await p.waitForFunction(()=>__pvT.tn().ph==='boss',null,{timeout:60000});await p.waitForTimeout(1500);
 console.log('andar',fl+1,await p.evaluate(()=>{const F=window.__fr.map(x=>x[0]);const s=F.slice().sort((a,b)=>b-a);const T=__pvT.tn();return JSON.stringify({g:T.g,boss:T.boss&&T.boss.def.name,pas:T.boss&&T.boss.tnPas,bl:T.bl,maiores:window.__fr.filter(x=>x[0]>90).map(x=>Math.round(x[0])+x[1]+'@'+x[2]),media:Math.round(F.reduce((a,b)=>a+b,0)/F.length)})}))}
console.log('ERROS',errs.slice(0,8));await b.close()})();
