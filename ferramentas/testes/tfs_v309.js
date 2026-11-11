// v309: jogo usando o SERVIDOR NOVO (worker + D1) rodando no computador: conta (criar/entrar), código (1 pessoa), chat, ranking da caça, migração da conta
// precisa: node ferramentas/servidor/local.mjs 8790
const {chromium}=require('playwright');const U='http://localhost:8790/index.html';
(async()=>{const b=await chromium.launch();const errs=[];const out={};let fsReq=0,goog=0;
const ctx=async(init)=>{const c=await b.newContext({viewport:{width:915,height:412}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.route(/fonts\.g/,r=>r.abort());await p.route(/googleapis/,r=>{goog++;r.abort()});p.on('request',r=>{if(/\/fs\/v1\//.test(r.url()))fsReq++});
  await p.addInitScript(i=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,i)}},init);await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});return p};
// A: jogador já logado (conta antiga) → migra sozinho
let p=await ctx({rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ana"',rk_gem:'1234'});
await p.click('#mRank');await p.waitForTimeout(1200);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
// criar conta
await p.click('#rkWrap [data-a="conta"]',{force:true});await p.waitForTimeout(400);await p.fill('#acP1','senha1');await p.fill('#acP2','senha1');await p.click('#acNew');await p.waitForTimeout(2500);
out.criou=await p.evaluate(()=>[localStorage.ac_n,!!localStorage.ac_k,(document.querySelector('#acM .twH.ok')||{}).textContent]);await p.evaluate(()=>document.getElementById('acX').click());
// código de 1 pessoa (Gojo) e chat
await p.evaluate(()=>{document.querySelector('#rkWrap [data-a="mn2Cfg"]').click()});await p.waitForTimeout(300);await p.evaluate(()=>document.getElementById('mnC1').click());await p.waitForTimeout(300);await p.fill('#rkCdI','GOJO-INFINITO-5R7W');await p.evaluate(()=>document.getElementById('rkCdOk').click());await p.waitForTimeout(1200);out.cod1=await p.$eval('#rkCdE',e=>e.textContent);await p.evaluate(()=>document.getElementById('rkMX').click());
await p.click('#rkWrap [data-a="boss"]',{force:true});await p.waitForTimeout(1500);await p.fill('#rkChI','oi servidor novo').catch(()=>{});await p.keyboard.press('Enter');await p.waitForTimeout(1500);
await p.close();
// B: outro aparelho: entrar na conta, código já usado, chat aparece
p=await ctx({rk_ini:'1',rk_xpv2:'1',rk_dia:'1'});
await p.click('#mRank');await p.waitForTimeout(1200);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
await p.click('#rkWrap [data-a="conta"]',{force:true});await p.waitForTimeout(400);await p.evaluate(()=>{const b=[...document.querySelectorAll('#acM .twTab button')].find(x=>x.dataset.t==='entrar');if(b)b.click()});await p.waitForTimeout(300);
await p.fill('#acN','ana');await p.fill('#acP','senha1');await p.click('#acIn');await p.waitForTimeout(700);out.entrou=await p.evaluate(()=>(document.getElementById('acE')||{}).textContent);await p.waitForTimeout(4000);
out.dadosB=await p.evaluate(()=>[localStorage.rk_gem,localStorage.ac_n]);
await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank').catch(()=>{});await p.waitForTimeout(2500);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
await p.evaluate(()=>{document.querySelector('#rkWrap [data-a="mn2Cfg"]').click()});await p.waitForTimeout(300);await p.evaluate(()=>document.getElementById('mnC1').click());await p.waitForTimeout(300);await p.fill('#rkCdI','GOJO-INFINITO-5R7W');await p.evaluate(()=>{localStorage.removeItem('tw_cup');document.getElementById('rkCdOk').click()});await p.waitForTimeout(1200);out.cod2=await p.evaluate(()=>{const e=document.getElementById('rkCdE');return e?e.textContent:'(fechou) '+((document.querySelector('#rkModal h3')||{}).textContent||'')});await p.evaluate(()=>{try{document.getElementById('rkMX').click()}catch(e){}});
await p.click('#rkWrap [data-a="boss"]',{force:true});await p.waitForTimeout(2500);out.chat=await p.evaluate(()=>(document.getElementById('rkChL')||{}).textContent.slice(0,120));
await p.close();
// C: jogador antigo com conta salva no aparelho → migração automática
p=await ctx({rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Velho"',rk_gem:'999',ac_n:'Velho',ac_k:'ab'.repeat(32)});await p.waitForTimeout(12000);out.mig=await p.evaluate(()=>[localStorage.ac_mig309||'nao',localStorage.ac_t||'sem save']);await p.close();
console.log(JSON.stringify(out,null,1),'pedidos ao servidor novo',fsReq,'ao Firebase',goog,'erros',JSON.stringify(errs));await b.close()})();
