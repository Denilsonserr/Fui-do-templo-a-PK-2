// v314: bots com nomes do dono, abaixo do 3º lugar real, perfil do bot
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const [n,rp] of [['Rei',60000],['Vice',40000],['Terceiro',20000],['Quarto',9000]]){const c=await b.newContext();const p=await c.newPage();await p.route(/fonts\.g/,r=>r.abort());await p.addInitScript(([n,rp])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(n),rk_rp:String(rp)})}},[n,rp]);await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(8000);await c.close()}
const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Olhador"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(8000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
await p.click('#rkWrap [data-a="ranking"]',{force:true});await p.waitForTimeout(2500);const rk=await p.evaluate(()=>[...document.querySelectorAll('#rkModal .twRk .rw')].map(r=>r.innerText.replace(/\n/g,' ')).slice(0,12));
await p.evaluate(()=>{const r=[...document.querySelectorAll('#rkModal .twRk .rw')].find(x=>/Furiosos/.test(x.innerText));r&&r.querySelector('.nm').click()});await p.waitForTimeout(2500);await p.screenshot({path:'shots/bot_pf.png'});
await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="hs"]');b&&b.click()});await p.waitForTimeout(1500);await p.screenshot({path:'shots/bot_hs.png'});
console.log(JSON.stringify(rk,null,1),'erros',JSON.stringify(errs));await b.close()})();
