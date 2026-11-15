// v463c: devolução pelo save de antes das 09:00 (conta), usando o worker de verdade (servidor local): grava um save assinado às 08:52 e um depois das 09:00
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const E=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","sung"]',rk_gem:'500',rk_tic:'2',ac_k:'chave-teste-'+Math.random(),ac_n:'tester'+Math.random().toString(36).slice(2,7)})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const ok=await p.evaluate(async()=>{const k=localStorage.ac_k,n=localStorage.ac_n,acc=await __rs463.id(n);const put=async(ts,d)=>{const sg=await __rs463.sig(k,acc+'|'+ts+'|'+d);const IV=v=>({integerValue:String(v)});
   const r=await fetch(__rs463.u()+'&documentId=sv_'+acc+'_'+ts.toString(36).padStart(9,'0'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{sv:{stringValue:acc},ts:IV(ts),d:{stringValue:d},sg:{stringValue:sg},nome:{stringValue:n},andar:IV(0),tempo:IV(0)}})});return r.status};
  return [await put(Date.UTC(2026,10,15,11,52),JSON.stringify({rk_gem:'9000',rk_tic:'12'})),await put(Date.UTC(2026,10,15,12,5),JSON.stringify({rk_gem:'1',rk_tic:'0'}))]}).catch(e=>'x '+e.message);
await p.evaluate(()=>{localStorage.removeItem('rk_rs463b')});await p.evaluate(()=>__rs463.run());await p.waitForTimeout(1500);
const R=await p.evaluate(()=>({gem:localStorage.rk_gem,tic:localStorage.rk_tic,flag:localStorage.rk_rs463b,msg:localStorage.rk_rs463bm}));
await p.evaluate(()=>__rs463.run());const R2=await p.evaluate(()=>localStorage.rk_gem);
console.log(JSON.stringify({gravou:ok,depois:R,segundaVez:R2}),E.slice(0,3));await b.close()})();
