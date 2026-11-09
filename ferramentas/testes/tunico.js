// v230: espadas do torneio viram ITEM ÚNICO + loja de poções respeita as pilhas (99) e 40 espaços
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1040,height:480},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const I=[{id:'evev202611080',ev:'ev20261108',t:'esp',r:'mit',v:11,vel:5,nm:'LÂMINA SOMBRIA',img:'a/389676e4dd6ec9.webp'}];
  const T=['esp','arm','bot','cap'],Rr=['comum','rara','epica','lend','mit'];let n=0;for(const t of T)for(const r of Rr)for(let v=1;v<=1;v++)I.push({id:'x'+(n++),t,r,v:v+10});
  const P=[];for(let i=0;i<30;i++)P.push({id:'p'+i,r:'comum',v:5});
  Object.assign(localStorage,{tw_nome:'"Denilson ADM"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1',tw_inv:JSON.stringify(I),tw_poc:JSON.stringify(P),tw_moedas:'9000'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(800);
const esp=await p.evaluate(()=>JSON.parse(localStorage.tw_inv)[0]);
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="torre"]');await p.waitForTimeout(1000);
await p.click('#rtUI .rtRow button[data-c="twShB"]');await p.waitForTimeout(400);const cheio=await p.evaluate(()=>document.getElementById('twShE').textContent);
await p.click('#twModal .shI[data-i="0"]');await p.waitForTimeout(300);const pocs=await p.evaluate(()=>JSON.parse(localStorage.tw_poc).length);const msg=await p.evaluate(()=>document.getElementById('twShE')?.textContent);
await p.click('#twShX');await p.click('#rtUI .rtRow button[data-c="twBagB"]');await p.waitForTimeout(400);
await p.click('#twModal .eqI.uniq');await p.waitForTimeout(200);await p.click('#twModal .eqD .btn.main');await p.waitForTimeout(300);await p.click('#twModal .eqS.uniq').catch(()=>{});await p.waitForTimeout(100);
await p.click('#twModal .eqI.uniq').catch(()=>{});await p.waitForTimeout(100);
await p.evaluate(()=>{});await p.click('#twModal #rkMX');await p.click('#rtUI .rtRow button[data-c="twBagB"]');await p.waitForTimeout(400);await p.click('#twModal .eqI');await p.waitForTimeout(300);await p.screenshot({path:'/tmp/unico.png'});
const st=await p.evaluate(()=>document.getElementById('rtB_sorte')?.innerText);
console.log(JSON.stringify({esp,cheio,pocs,msg,stacks:await p.evaluate(()=>document.querySelector('#twModal h3 small').innerText),eqp:await p.evaluate(()=>localStorage.tw_eqp)}),'ERROS',JSON.stringify(errs));await b.close()})();
