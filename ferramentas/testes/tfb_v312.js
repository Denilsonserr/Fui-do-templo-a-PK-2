// v312: conta que só existe no Firebase antigo → ENTRAR busca lá e depois salva no servidor novo
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
// 1) cria um salvamento assinado (como o Firebase teria) usando o próprio jogo num aparelho
let p=await b.newPage();await p.route(/fonts\.g/,r=>r.abort());await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const S=await p.evaluate(async()=>{const te=s=>new TextEncoder().encode(s),hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
  const acc=hex(await crypto.subtle.digest('SHA-256',te('furia|acc|zeca'))).slice(0,24);const k0=await crypto.subtle.importKey('raw',te('abc123'),'PBKDF2',false,['deriveBits']);
  const k=hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:te('furia|zeca'),iterations:60000,hash:'SHA-256'},k0,256));const ts=1794300000000,d=JSON.stringify({tw_nome:'"Zeca"',rk_rp:'48000',rk_gem:'321'});
  const hk=await crypto.subtle.importKey('raw',new Uint8Array(k.match(/../g).map(h=>parseInt(h,16))),{name:'HMAC',hash:'SHA-256'},false,['sign']);const sg=hex(await crypto.subtle.sign('HMAC',hk,te(acc+'|'+ts+'|'+d)));return {acc,ts,d,sg}});await p.close();
// 2) aparelho novo, servidor novo vazio; o Firebase (de mentira) tem a conta
const c=await b.newContext({viewport:{width:915,height:412}});p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
let fb=0;await p.route(/firestore\.googleapis/,r=>{fb++;r.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{document:{name:'x',fields:{ts:{integerValue:String(S.ts)},d:{stringValue:S.d},sg:{stringValue:S.sg}}}}])})});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(1500);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
await p.click('#rkWrap [data-a="conta"]',{force:true});await p.waitForTimeout(400);await p.evaluate(()=>{const b=[...document.querySelectorAll('#acM .twTab button')].find(x=>x.dataset.t==='entrar');if(b)b.click()});await p.waitForTimeout(300);
await p.fill('#acN','zeca');await p.fill('#acP','abc123');await p.click('#acIn');await p.waitForTimeout(800);const msg=await p.evaluate(()=>(document.getElementById('acE')||{}).textContent);
await p.waitForTimeout(14000);const loc=await p.evaluate(()=>[localStorage.rk_gem,localStorage.ac_n,localStorage.ac_mig309]);
const B='http://localhost:8790/fs/v1/projects/furia-do-templo/databases/(default)/documents:runQuery';
const r=await (await fetch(B,{method:'POST',body:JSON.stringify({structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:'sv'},op:'EQUAL',value:{stringValue:S.acc}}}}})})).json();
console.log({msg,loc,firebase:fb,salvosNoNovo:r.filter(x=>x.document).length},'erros',JSON.stringify(errs));await b.close()})();
