// v302: título ADM novo no perfil (vários quadros da animação)
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Denilson ADM"',rk_sel:'"goku"',rk_own:'["goku"]',tw_tit:'["adm"]',tw_titOn:'"adm"'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(900);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});console.log('botões',await p.$$eval('#rkWrap [data-a]',e=>e.map(x=>x.dataset.a).join(',')));await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="perfil"]');if(b)b.click()});await p.waitForTimeout(1200);
const el=await p.$('.pfAdmG');console.log('tem titulo',!!el,await p.evaluate(()=>[localStorage.tw_tit,localStorage.tw_titOn]),await p.evaluate(()=>(document.querySelector('.pfTi')||{}).innerHTML||'sem pfTi'));await p.screenshot({path:SH+'adm_dbg.png'});
if(el){const bb=await el.boundingBox();for(const t of [0,900,1100,2900]){await p.waitForTimeout(t?t-0:0);await p.screenshot({path:SH+'adm_'+t+'.png',clip:{x:bb.x-80,y:bb.y-50,width:bb.width+160,height:bb.height+100}})}await p.screenshot({path:SH+'adm_full.png'})}
console.log('erros',JSON.stringify(errs));await b.close()})();
