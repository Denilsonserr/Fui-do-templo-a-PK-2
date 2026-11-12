// v375: Torre nova — menu, andar, armadilhas, boss, baú caindo, estátua, alavanca, subir
const {chromium}=require('playwright');const U=process.env.U||'file:///home/claude/fui-do-templo-a-pk-2/www/index.html';const O=process.env.O||'/tmp/tn';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='warning'||m.type()==='error')errs.push('C:'+m.text().slice(0,200))});await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),tn_best:'0'})}`);
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.tnO()});await p.waitForTimeout(2500);await p.screenshot({path:O+'_menu.png'});
await p.click('#twGo',{force:true});
await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});await p.waitForTimeout(2500);await p.screenshot({path:O+'_1.png'});
const st=()=>p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();return {g:T.g,ph:T.ph,k:T.kills,need:T.need,mobs:T.mobs.length,br:T.bossReady,p1:G.p[1].def.name,php:Math.round(G.p[0].hp),mode:G.mode,phase:G.phase,stg:T.g}});
console.log(JSON.stringify(await st()));
for(let i=0;i<14;i++){await p.evaluate(()=>{const G=__pvT.G();G.p[0].hp=G.p[0].mhp;__pvT.tnK()});await p.waitForTimeout(350)}
await p.waitForTimeout(1500);console.log(JSON.stringify(await st()));await p.screenshot({path:O+'_boss.png'});
// meteoro + armadilhas visíveis
await p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();T.mets.push({x:G.p[0].x+150,t:60});G.p[0].hp=G.p[0].mhp});await p.waitForTimeout(500);await p.screenshot({path:O+'_met.png'});
await p.evaluate(()=>{const G=__pvT.G();G.p[1].hp=1;__pvT.tnK()});await p.waitForTimeout(3500);console.log(JSON.stringify(await st()));await p.screenshot({path:O+'_bau.png'});
// anda até o baú e abre, estátua, alavanca
await p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();if(T.chest)G.p[0].x=T.chest.x+40});await p.waitForTimeout(300);await p.evaluate(()=>__pvT.tnA());await p.waitForTimeout(700);await p.screenshot({path:O+'_aberto.png'});
await p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();G.p[0].x=T.statue.x});await p.waitForTimeout(300);await p.evaluate(()=>__pvT.tnA());await p.waitForTimeout(900);await p.screenshot({path:O+'_passiva.png'});
await p.evaluate(()=>document.querySelector('#tnPick .tnC').click());await p.waitForTimeout(400);
await p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();G.p[0].x=T.lever.x});await p.waitForTimeout(300);await p.evaluate(()=>__pvT.tnA());await p.waitForTimeout(1500);await p.screenshot({path:O+'_portao.png'});
await p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();G.p[0].x=T.gate.x});await p.waitForTimeout(500);await p.screenshot({path:O+'_subindo.png'});await p.waitForTimeout(3000);
console.log(JSON.stringify(await st()));await p.screenshot({path:O+'_2.png'});
// morrer
await p.evaluate(()=>{const G=__pvT.G();G.p[0].hp=1;__pvT.ko(G.p[1],G.p[0])});await p.waitForTimeout(6000);await p.screenshot({path:O+'_fim.png'});
console.log('mode',await p.evaluate(()=>__pvT.G().mode),'ERROS',errs.slice(0,15));await b.close()})();
