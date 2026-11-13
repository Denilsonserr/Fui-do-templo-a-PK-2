// v401: com o boss morto, sair pela pausa / desistir / carta que dá erro → o andar conta; luta órfã volta para a Torre
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',rk_rp:'78000',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}`);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2000);
const st=()=>p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G();return {mode:G.mode,on:T.on,g:T.g,ph:T.ph,done:T.done,run:__pvT.tnRun()&&__pvT.tnRun().g,rp:localStorage.rk_rp}});
const go=async()=>{await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove());const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};__pvT.tnO()});await p.waitForTimeout(1200);await p.click('#twGo',{force:true});await p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&G.phase==='fight'&&T.ph==='boss'},null,{timeout:60000})};
const kill=()=>p.evaluate(()=>{const G=__pvT.G(),a=G.p[0],o=G.p[1];o.tnL=1;o.hp=20;o.inv=0;__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150})});
// 1) boss morto → sair pela PAUSA (toMenu) antes de escolher a carta
await go();console.log('A0',JSON.stringify(await st()));await kill();await p.waitForTimeout(800);await p.evaluate(()=>{document.getElementById('toMenu').click()});await p.waitForTimeout(1500);console.log('A pausa',JSON.stringify(await st()));
// 2) carta que dá erro no meio
await go();await kill();await p.waitForTimeout(2800);await p.evaluate(()=>{window.__bad=1});await p.evaluate(()=>{const c=document.querySelector('#tnPick .tnC');const e=new Event('touchend',{bubbles:true,cancelable:true});c.dispatchEvent(e);c.click()});await p.waitForTimeout(3500);console.log('B carta',JSON.stringify(await st()));
// 3) luta órfã (TN desligado no meio da luta)
await go();await p.evaluate(()=>{__pvT.tn().on=0});await p.waitForTimeout(5000);console.log('C orfa',JSON.stringify(await st()));
// 4) desistir de verdade com o boss vivo continua sendo desistência
console.log('ERRS',errs.slice(0,4));await b.close()})();
