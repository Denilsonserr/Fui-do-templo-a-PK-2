// v381: ULTRA EXTREMO — sem bônus de itens/anéis/rank (compara com o normal)
const {chromium}=require('playwright');const U='file:///home/claude/fui-do-templo-a-pk-2/www/index.html';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","naruto"]',rk_sel:'"naruto"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_rp:'150000'})}`);
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.anT('naruto');__pvT.tnO()});await p.waitForTimeout(1500);
const st=()=>p.evaluate(()=>{const G=__pvT.G(),a=G.p[0],o=G.p[1];return JSON.stringify({ux:__pvT.tn().ux,dano:+a.tdm.toFixed(2),vel:+a.tsp.toFixed(2),def:+a.tdf.toFixed(2),crit:a.tcr,boss:o.def.name,bmhp:o.mhp,btdm:+o.tdm.toFixed(2)})});
const fight=()=>p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&G.phase==='fight'&&T.ph==='boss'},null,{timeout:90000});
for(const ux of [0,1]){if(ux){await p.click('#tnUx',{force:true});await p.waitForTimeout(500);await p.screenshot({path:'/tmp/ux_menu.png'})}
 await p.click('#twGo',{force:true});await fight();await p.waitForTimeout(1200);console.log(ux?'ULTRA ':'NORMAL',await st());if(ux)await p.screenshot({path:'/tmp/ux_luta.png'});
 await p.click('#pauseBtn',{force:true});await p.waitForTimeout(400);await p.click('#toMenu',{force:true});await p.waitForTimeout(1500);await p.click('#tnQuit',{force:true});await p.waitForTimeout(400);await p.click('#tnQY',{force:true});await p.waitForTimeout(2000);await p.evaluate(()=>{try{document.querySelector('#twOut').click()}catch(e){}});await p.waitForTimeout(800);await p.evaluate(()=>__pvT.tnO());await p.waitForTimeout(1500)}
console.log('ERROS',errs.slice(0,8));await b.close()})();
