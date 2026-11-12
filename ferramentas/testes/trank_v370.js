// v370: 14 ranks (3 novos), emblemas novos, brilho do perfil, tela do Boss no nível 14, prêmio do rank novo
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/r370_';
(async()=>{const b=await chromium.launch();const errs=[];
for(const [rp,nm] of [[520000,'abs'],[200000,'cos'],[40000,'div'],[6000,'ouro']]){const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(rp=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Zé"',rk_own:'["goku","shaka"]',rk_ped:'"shaka"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_rp:String(rp),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}},rp);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());try{rkModal(null)}catch(e){}});
await p.evaluate(()=>__pvT.rv('pf'));await p.waitForTimeout(1800);await p.screenshot({path:SH+nm+'.png'});
if(nm==='abs'){await p.evaluate(()=>__pvT.rv('rb'));await p.waitForTimeout(1200);await p.screenshot({path:SH+'boss.png'});
  const g0=await p.evaluate(()=>[localStorage.rk_gem,localStorage.rk_ps]);await p.evaluate(()=>{try{document.querySelector('[data-a="rw"],[data-a="rkRw"]')&&0}catch(e){}});console.log('antes',g0)}
await p.close()}
console.log('ERROS',errs);await b.close()})();
