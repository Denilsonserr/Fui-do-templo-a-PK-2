// v305: todas as letras saem nas caixas de texto (nome da Torre, código, conta)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const T='abcdefghijklmnopqrstuvwxyz WASD JKL';
await p.click('#mRank');await p.waitForTimeout(900);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
await p.click('#rkWrap [data-a="code"]',{force:true});await p.waitForTimeout(300);await p.click('#rkCdI');await p.keyboard.type('wasdjklioufp');const cod=await p.$eval('#rkCdI',e=>e.value);await p.evaluate(()=>document.getElementById('rkMX').click());
await p.click('#rkWrap [data-a="conta"]',{force:true});await p.waitForTimeout(400);await p.evaluate(()=>{const b=[...document.querySelectorAll('#acM .twTab button')].find(x=>x.dataset.t==='entrar');if(b)b.click()});await p.waitForTimeout(300);
await p.fill('#acN','');await p.click('#acN');await p.keyboard.type('Vini junior');const conta=await p.$eval('#acN',e=>e.value);await p.evaluate(()=>document.getElementById('acX').click());
await p.click('#rkWrap [data-a="torre"]',{force:true});await p.waitForTimeout(1500);const has=await p.$('#twName0');let nome=null;if(has){await p.click('#twName0');await p.keyboard.type('Jose Kaua Fili');nome=await p.$eval('#twName0',e=>e.value)}
console.log({cod,conta,nome,pausou:await p.evaluate(()=>__dbg.G.paused)},'erros',JSON.stringify(errs));await b.close()})();
