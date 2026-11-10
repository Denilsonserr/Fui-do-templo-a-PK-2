// v292: Rika sai do slot, mochila cheia não apaga item do Shaka, item secreto não vende, devolve item sumido pelo histórico, itens do Shaka mais fortes
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const inv=[{id:'rk',t:'cap',r:'obs',v:0,def:40,crit:20,st:30,drop:30,nm:'RIKA',yt:1,ysec:1},{id:'sa',t:'arm',r:'sec',v:0,dmg:50,crit:40,nm:'ARMADURA DE VIRGEM',sk:1,ysec:1},{id:'c1',t:'cap',r:'comum',v:1}];
 Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_inv:JSON.stringify(inv),tw_eqp:JSON.stringify({cap:'rk'}),
 rk_hist:JSON.stringify([{k:'sp',r:'sec',s:'skros',d:1},{k:'sp',r:'sec',s:'skarm',d:1}])})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const ini=await p.evaluate(()=>{const I=JSON.parse(localStorage.tw_inv);return {n:I.length,ros:I.find(x=>x.nm==='ROSÁRIO DE SHAKA'),arm:I.find(x=>x.nm==='ARMADURA DE VIRGEM')}});
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(500);
await p.click('#rkWrap [data-a="equip"]');await p.waitForTimeout(400);
await p.click('#rkModal .eqS.on[data-s="cap"]');await p.waitForTimeout(200);const semRika=await p.evaluate(()=>localStorage.tw_eqp);
// equipar o capacete comum e depois voltar
await p.evaluate(()=>{});const cards=await p.$$eval('#rkModal .eqI span',e=>e.map(x=>x.textContent));
const ai=cards.findIndex(t=>t.includes('ARMADURA'));await p.click(`#rkModal .eqI >> nth=${ai}`);await p.waitForTimeout(200);
const sellVis=await p.evaluate(()=>{const s=document.querySelector('#rkModal .eqD .btn.sell');return {hid:s?s.hidden:null,txt:document.querySelector('#rkModal .eqD').textContent.slice(0,200)}});
await p.screenshot({path:'/tmp/it292.png'});
// mochila cheia: enche com itens comuns e chama twCap
const cap=await p.evaluate(()=>{const I=JSON.parse(localStorage.tw_inv);for(let i=0;i<80;i++)I.push({id:'f'+i,t:'esp',r:'comum',v:1+(i%50),crit:i});localStorage.tw_inv=JSON.stringify(I);__rk&&0;return 1});
await p.click('#rkMX');await p.click('#rkWrap [data-a="equip"]');await p.waitForTimeout(300);await p.click('#rkModal .eqI');await p.click('#rkModal .eqD .btn.main');await p.waitForTimeout(300);
const fim=await p.evaluate(()=>{const I=JSON.parse(localStorage.tw_inv);return {n:I.length,sec:I.filter(x=>x.ysec).map(x=>x.nm)}});
console.log(JSON.stringify({ini,semRika,sellVis,fim}),'ERROS',JSON.stringify(errs));await b.close()})();
