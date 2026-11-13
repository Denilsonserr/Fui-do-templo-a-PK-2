// v399: aparelho com progresso velho NÃO salva por cima da conta; pergunta CARREGAR / MANTER
const {chromium}=require('playwright');const C=require('crypto');const SH=process.env.SH||'/tmp/';
const K='ab'.repeat(32),acc=C.createHash('sha256').update('furia|acc|teste').digest('hex').slice(0,24);
const sig=(ts,d)=>C.createHmac('sha256',Buffer.from(K,'hex')).update(acc+'|'+ts+'|'+d).digest('hex');
const good=JSON.stringify({tw_nome:'"teste"',rk_rp:'33422',rk_own:'["goku","shaka","zoro"]',rk_gem:'79271',rk_ini:'1'}),TS=1794534395761;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));let posts=0;
await p.route(/fonts\.g/,r=>r.abort());
await p.route(/runQuery/,async r=>{const q=JSON.parse(r.request().postData()||'{}');const ff=q.structuredQuery&&q.structuredQuery.where&&q.structuredQuery.where.fieldFilter;
  if(ff&&ff.field.fieldPath==='sv')return r.fulfill({contentType:'application/json',body:JSON.stringify([{document:{name:'x/torre/sv_'+acc+'_1',fields:{sv:{stringValue:acc},ts:{integerValue:String(TS)},d:{stringValue:good},sg:{stringValue:sig(TS,good)}}}}])});
  return r.fulfill({contentType:'application/json',body:'[{"readTime":"x"}]'})});
await p.route(/documents\/torre\?documentId=sv_/,r=>{posts++;r.fulfill({contentType:'application/json',body:'{}'})});
await p.addInitScript(([K])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"teste"',rk_rp:'3201',rk_own:'["goku"]',rk_gem:'2285',rk_ini:'1',ac_k:K,ac_n:'teste',ac_t:'1794536959712'.replace(/^/,'0').slice(1)&&'1000'})}},[K]);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.waitForSelector('#acCL',{timeout:15000});await p.screenshot({path:SH+'conta_conf.png'});
const tx=await p.$eval('#acM',e=>e.innerText.slice(0,400));
await p.evaluate(()=>{localStorage.setItem('rk_gem','2300')});const sv=await p.evaluate(()=>window.__pvT&&0);
await p.click('#acCL');await p.waitForTimeout(2500);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const ls=await p.evaluate(()=>({rp:localStorage.rk_rp,own:localStorage.rk_own,gem:localStorage.rk_gem,t:localStorage.ac_t}));
console.log(JSON.stringify({tx,posts,ls}));console.log('ERRS',errs.slice(0,3));await b.close()})();
