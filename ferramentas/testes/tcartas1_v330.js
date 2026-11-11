// v330: giro de 1 (mítico com pity) — fotos da carta carregando, virada e brilho
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/cr1_';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},isMobile:true,hasTouch:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku","naruto","madara","garou"]',rk_gem:'50000',rk_ban:'"esp"',rk_pity:'29'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(800);await p.click('#rkWrap [data-a="gacha"]',{force:true});await p.waitForTimeout(1200);
await p.click('#rkWrap [data-a="sum1"]',{force:true});await p.waitForTimeout(800);await p.mouse.click(10,10);
for(let i=0;i<40;i++){await p.waitForTimeout(200);const s=await p.evaluate(()=>{const c=document.querySelector('.crC');return c?c.className:''});if(s)console.log(i,s);if(s.includes('chg')&&!globalThis.a){globalThis.a=1;await p.screenshot({path:SH+'chg.png'})}if(s.includes('rv')){for(const t of [200,400,600,800,1000]){await p.screenshot({path:SH+'t'+t+'.png'});await p.waitForTimeout(200)}console.log(await p.evaluate(()=>[...document.querySelectorAll('.crC .fr img')].map(i=>i.src.slice(-22)+' '+i.complete+' '+i.naturalWidth)), await p.evaluate(()=>localStorage.rk_own));break}}
console.log(errs);await b.close()})();
