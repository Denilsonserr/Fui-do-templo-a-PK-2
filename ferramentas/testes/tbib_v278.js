// v278: botão Anéis da Biblioteca no lugar certo em todas as abas
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku"]'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(900);await p.click('#rkWrap [data-a="lib"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+'b78_chr.png'});
for(const t of ['eq','col']){await p.click(`#rkWrap [data-a="tab"][data-t="${t}"]`,{force:true});await p.waitForTimeout(1000);await p.screenshot({path:SH+'b78_'+t+'.png'})}
await p.click('#rkWrap .anTabB',{force:true});await p.waitForTimeout(900);console.log('aba:',await p.evaluate(()=>RKL?1:0).catch(()=>'-'),await p.evaluate(()=>document.querySelector('#rkWrap .rkA').style.backgroundImage.slice(-30)));console.log(errs);await b.close()})();
