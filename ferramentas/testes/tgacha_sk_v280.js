// v280: Invocação Ilimitada do Shaka (antes de abrir = trancada; depois: 70/700, piedade 170, Sorte Secreta), biblioteca e nível 70
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/skg_';
async function run(off,tag){const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(o=>{const n=Date.now;Date.now=()=>n()+o;if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku"]',rk_gem:'5000',rk_tic:'0',rk_pityS:'169',rk_ban:'"mit"'})}},off);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(800);await p.click('#rkWrap [data-a="gacha"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+tag+'_mit.png'});
await p.click('#rkWrap [data-a="ban"][data-b="sk"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+tag+'_sk.png'});
await p.click('#rkWrap [data-a="sum1"]',{force:true});await p.waitForTimeout(600);console.log(tag,'toast',await p.evaluate(()=>document.getElementById('rkToast').textContent),'gem',await p.evaluate(()=>localStorage.rk_gem));
if(tag==='aberto'){await p.waitForTimeout(2000);await p.mouse.click(640,360);await p.waitForTimeout(800);await p.screenshot({path:SH+'mega.png'});
  for(let i=0;i<12;i++){await p.mouse.click(640,360);await p.waitForTimeout(700)}
  console.log('own',await p.evaluate(()=>localStorage.rk_own),'gem',await p.evaluate(()=>localStorage.rk_gem));await p.screenshot({path:SH+'fim.png'})}
console.log(errs);await b.close()}
(async()=>{const now=Date.now(),open=Date.UTC(2026,10,10,15,46);await run(Math.min(0,open-now-3600e3>0?0:0)-(now>=open?(now-open+3600e3):0),'fechado');await run(open-now,'aberto')})();
