// v217: botão EQUIPAR no ranqueado, poção na luta do Boss e música do lobby
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',
 tw_inv:JSON.stringify([{id:'e1',t:'esp',r:'lend',v:6},{id:'e2',t:'arm',r:'epic',v:4},{id:'e3',t:'cap',r:'rare',v:3,crit:2},{id:'e4',t:'bot',r:'epic',v:5}]),tw_poc:JSON.stringify([{id:'p1',r:'lend',v:10}])})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(500);const mus1=await p.evaluate(()=>__dbg.mus());
await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/eq_lobby.png'});
await p.click('#rkWrap [data-a="equip"]');await p.waitForTimeout(400);await p.screenshot({path:'/tmp/eq_vazio.png'});
for(let k=0;k<5;k++){await p.click('#rkModal .eqI');await p.waitForTimeout(150);await p.click('#rkModal .eqD .btn.main');await p.waitForTimeout(150)}
await p.screenshot({path:'/tmp/eq_cheio.png'});const eq=await p.evaluate(()=>({eqp:localStorage.tw_eqp,on:localStorage.tw_pocOn,slots:document.querySelectorAll('#rkModal .eqS.on').length}));
await p.click('#rkModal .eqS.on[data-s="arm"]');await p.waitForTimeout(150);const semArm=await p.evaluate(()=>localStorage.tw_eqp);
await p.click('#rkModal .eqI');await p.click('#rkModal .eqD .btn.main');await p.click('#rkMX');
await p.click('#rkWrap [data-a="music"]');await p.waitForTimeout(300);await p.screenshot({path:'/tmp/eq_mus.png'});await p.click('#rkModal .rkMu button[data-m="3"]');const mus2=await p.evaluate(()=>[__dbg.mus(),localStorage.rk_mus]);await p.click('#rkMX');
await p.click('#rkWrap [data-a="start"]');await p.waitForTimeout(700);await p.screenshot({path:'/tmp/eq_rb.png'});
await p.click('#rkWrap [data-a="fight"]');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');
const f=await p.evaluate(()=>{const [a,o]=__dbg.G.p;return{tdm:+a.tdm.toFixed(3),tcr:a.tcr,pocOn:localStorage.tw_pocOn,mhp:o.mhp,mus:__dbg.mus()}});
console.log(JSON.stringify({mus1,eq,semArm,mus2,f}),'ERROS',JSON.stringify(errs));await b.close()})();
