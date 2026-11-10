// v297: SAIR depois de vencer um nível na Caça, anel preto escuro, código das joias negras
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));const sent=[];
await p.route(/fonts\.g/,r=>r.abort());await p.route(/firestore/,r=>{const q=r.request();if(q.method()==='POST'&&/documents\/torre\?/.test(q.url()))sent.push(q.postData());return r.fulfill({status:200,contentType:'application/json',body:'[]'})});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku"]',rk_an:JSON.stringify([{i:'a1',c:3,g:5,s:'dano',v:22,a:60000,l:30},{i:'a2',c:0,g:1,s:'dano',v:2,a:0}])})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(900);await p.click('#rkWrap [data-a="caca"]',{force:true});await p.waitForTimeout(1200);
await p.click('#rkWrap [data-a="caGo"]',{force:true});await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(600);
await p.evaluate(()=>{const [a,o]=__dbg.G.p;o.hp=3;o.hpLag=3;o.x=a.x+170;o.y=486;o.grounded=true;o.bs='idle';o.bcd=300;o.state='idle';o.inv=0;o.facing=-1;a.facing=1;a.state='idle';window.__mr=Math.random;Math.random=()=>0.0005});
for(let i=0;i<12;i++){await p.keyboard.press('KeyJ');await p.waitForTimeout(110);if(await p.evaluate(()=>!!document.querySelector('.bcO')))break}await p.evaluate(()=>{Math.random=window.__mr});
await p.waitForTimeout(3400);await p.screenshot({path:SH+'s97_bau.png'});await p.click('.bcSair',{force:true});await p.waitForTimeout(2500);await p.screenshot({path:SH+'s97_fim.png'});
console.log(await p.evaluate(()=>({mode:__dbg.G.mode,hold:__dbg.G.hold,rec:localStorage.rk_caRec,best:localStorage.rk_caBest,modal:(document.querySelector('#rkModal h3')||{}).textContent})),'enviou',sent.filter(x=>/"ca"/.test(x)).length);
await p.evaluate(()=>{try{document.getElementById('rkMX').click()}catch(e){}});await p.waitForTimeout(300);
await p.click('#rkWrap [data-a="code"]',{force:true});await p.waitForTimeout(300);await p.fill('#rkCdI','JOIAS-NEGRAS-7T2K');await p.evaluate(()=>document.getElementById('rkCdOk').click());await p.waitForTimeout(800);console.log('código',await p.$eval('#rkCdE',e=>e.textContent));
console.log('erros',JSON.stringify(errs));await b.close()})();
