// v379: 4 passivas para escolher, boss com 2/3 vidas (transforma), boss final, emblema no círculo, anéis na tela da torre
const {chromium}=require('playwright');const U='file:///home/claude/fui-do-templo-a-pk-2/www/index.html';const O='/tmp/t9';const G0=+(process.env.G0||0);
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","naruto"]',rk_sel:'"naruto"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_rp:'200000',tn_best:'6'})}`);
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.anT('naruto');__pvT.tnO()});await p.waitForTimeout(2500);await p.screenshot({path:O+'_menu.png'});
console.log('aneis na torre',await p.evaluate(()=>document.querySelectorAll('#twMe .anFt').length));
await p.evaluate(g=>__pvT.tnS(g),G0);await p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&T.ph==='boss'},null,{timeout:90000});await p.waitForTimeout(1500);
const st=()=>p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G(),o=G.p[1];return JSON.stringify({g:T.g,ph:T.ph,nome:o.def.name,vidas:o.tnL,mhp:o.mhp,tdm:o.tdm&&+o.tdm.toFixed(2),pas:o.tnPas})});
console.log(await st());await p.screenshot({path:O+'_boss.png'});
for(let i=0;i<4;i++){await p.evaluate(()=>{const G=__pvT.G();G.p[0].hp=G.p[0].mhp;if(G.p[1].tnBoss){G.p[1].hp=1;__pvT.tnK()}});await p.waitForTimeout(2500);console.log(await st());if(i===0)await p.screenshot({path:O+'_trans.png'})}
await p.waitForTimeout(2000);await p.screenshot({path:O+'_pick.png'});console.log('cartas',await p.evaluate(()=>document.querySelectorAll('#tnPick .tnC').length));
console.log('ERROS',errs.slice(0,8));await b.close()})();
