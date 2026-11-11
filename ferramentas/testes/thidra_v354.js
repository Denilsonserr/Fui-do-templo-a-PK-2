// v354: Caça · Hidra (ADM): tela, partes com mobs, chefe 5 níveis, caixas, fim
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/hy_';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',tw_titOn:'"adm"',rk_own:'["shaka"]',rk_sel:'"shaka"',rk_lvrz:'1',rk_pvupv:'352',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3500);
await p.click('#rkWrap [data-a="caca"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+'tela_lobo.png'});
await p.click('#rkWrap [data-a="hySel"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+'tela.png'});
await p.click('#rkWrap [data-a="hyGo"]',{force:true});await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});
await p.evaluate(()=>{window.__autoP=1;setInterval(()=>{try{const G=__pvT.G();if(G.p&&G.p[0].hp<1500)G.p[0].hp=3600}catch(e){}},200)});
const st=()=>p.evaluate(()=>{const G=__pvT.G(),H=__pvT.hy();return {st:H.st,lv:H.lv,kills:H.kills,mobs:H.mobs.length,main:G.p[1]&&G.p[1].def.name,php:Math.round(G.p[0].hp),mode:G.mode}});
const kill=()=>p.evaluate(()=>{const G=__pvT.G(),H=__pvT.hy();if(H.busy||G.phase!=='fight')return;const t=H.mobs[0]&&Math.random()<.5?H.mobs[0]:G.p[1];t.hp=1;__pvT.ko(G.p[0],(t.hp=0,t))});
await p.waitForTimeout(6000);await p.screenshot({path:SH+'p1.png'});console.log('p1',JSON.stringify(await st()));
for(let i=0;i<60;i++){const s=await st();if(s.st>=3)break;await kill();await p.waitForTimeout(500);if(i===14)await p.screenshot({path:SH+'p2.png'});if(i===30)await p.screenshot({path:SH+'p3.png'})}
await p.waitForTimeout(3000);console.log('chefe',JSON.stringify(await st()));await p.waitForTimeout(6000);await p.screenshot({path:SH+'chefe1.png'});
for(let l=0;l<5;l++){await p.waitForFunction(()=>{const H=__pvT.hy();return !H.busy},null,{timeout:20000}).catch(()=>{});await p.waitForTimeout(3000);if(l===2)await p.screenshot({path:SH+'chefe3.png'});if(l===4)await p.screenshot({path:SH+'chefe5.png'});console.log('lv',JSON.stringify(await st()));await p.evaluate(()=>{const G=__pvT.G(),o=G.p[1];o.hp=0;__pvT.ko(G.p[0],o)});await p.waitForTimeout(2500)}
await p.waitForTimeout(6000);await p.screenshot({path:SH+'fim.png'});console.log('fim',await p.evaluate(()=>document.getElementById('lvrzM')?.innerText.replace(/\n+/g,' | ')));
console.log('ERROS',errs);await b.close()})();
