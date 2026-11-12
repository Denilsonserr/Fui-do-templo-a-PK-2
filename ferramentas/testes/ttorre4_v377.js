// v375: fase do boss (passivas), armadilhas de vários andares e Torre Extrema
const {chromium}=require('playwright');const U=process.env.U||'file:///home/claude/fui-do-templo-a-pk-2/www/index.html';const O=process.env.O||'/tmp/tn';const G0=+(process.env.G0||0);
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","naruto"]',rk_sel:'"naruto"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),tn_best:'6'})}`);
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.tnO()});await p.waitForTimeout(2000);
if(G0){await p.mouse.click(915*1600/1847,412*400/851);await p.waitForTimeout(600);await p.screenshot({path:O+'_menuEx.png'})}
await p.evaluate(g=>__pvT.tnS(g),G0);
await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});await p.waitForTimeout(2000);
const st=()=>p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();return {g:T.g,ph:T.ph,k:T.kills,need:T.need,br:T.bossReady,p1:G.p[1].def.name,pas:T.boss?T.boss.tnPas:null,php:Math.round(G.p[0].hp),traps:T.traps.map(t=>t.k)}});
for(let fl=0;fl<(+process.env.NF||3);fl++){
 await p.waitForTimeout(3000);await p.screenshot({path:O+'_a'+fl+'.png'});for(let i=0;i<40;i++){const s=await st();if(s.ph==='met')await p.evaluate(()=>{const T=__pvT.tn();T.mt=Math.min(T.mt,60)});if(s.ph==='boss'||s.ph==='clear')break;await p.evaluate(()=>{const G=__pvT.G();G.p[0].hp=G.p[0].mhp;if(G.p[1].tnW)__pvT.tnK()});await p.waitForTimeout(300)}
 await p.waitForTimeout(2500);console.log(JSON.stringify(await st()));await p.screenshot({path:O+'_b'+fl+'.png'});
 await p.evaluate(()=>{const G=__pvT.G();G.p[0].hp=G.p[0].mhp});await p.waitForTimeout(4000);await p.screenshot({path:O+'_c'+fl+'.png'});
 await p.evaluate(()=>{const G=__pvT.G();G.p[0].hp=G.p[0].mhp;G.p[1].hp=1;__pvT.tnK()});await p.waitForTimeout(2500);
 await p.screenshot({path:O+'_d'+fl+'.png'});await p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();if(T.chest)G.p[0].x=T.chest.x});await p.waitForTimeout(300);await p.evaluate(()=>__pvT.tnA());await p.waitForTimeout(800);
 await p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();if(T.statue)G.p[0].x=T.statue.x});await p.waitForTimeout(300);await p.evaluate(()=>__pvT.tnA());await p.waitForTimeout(900);await p.screenshot({path:O+'_e'+fl+'.png'});await p.evaluate(()=>{const c=document.querySelector('#tnPick .tnC');if(c)c.click()});await p.waitForTimeout(4500)}
await p.waitForTimeout(2500);await p.screenshot({path:O+'_end.png'});console.log(await p.evaluate(()=>__pvT.G().mode));console.log(JSON.stringify(await st()),'ERROS',errs.slice(0,10));await b.close()})();
