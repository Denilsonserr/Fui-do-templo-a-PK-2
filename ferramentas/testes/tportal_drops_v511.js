// v511: drops reais (anéis dourados que a conta já tem) + anéis dourados de código contam no ranking de drops
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const posts=[];
  const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/documentId=ptd_/.test(u))posts.push(JSON.parse(r.request().postData()).fields);if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  const an=[{i:'a1',c:5,g:8,s:'dano',v:840,l:60},{i:'a2',c:5,g:8,s:'crit',v:840,l:60},{i:'a3',c:5,g:5,s:'vel',v:200,l:10},{i:'a4',c:4,g:7,s:'st',v:50,l:10}];
  await p.addInitScript(an=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k',rk_an:JSON.stringify(an)})}},an);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(8000);
  let o=await p.evaluate(()=>__pvT.ptd());console.log(JSON.stringify(o));chk(o.g[8]===2&&o.g[5]===1&&o.sc===2*400+50,'contou os anéis dourados que já tinha (2 SP + 1 S), o vermelho não');
  chk(posts.some(f=>f.dsp.integerValue==='2'),'mandou para o ranking');
  await p.evaluate(async()=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup('anelspvampiro',E)});await p.waitForTimeout(2500);
  o=await p.evaluate(()=>__pvT.ptd());chk(o.g[8]===3&&o.sc===3*400+50,'anel SP de código somou como drop');chk(posts.some(f=>f.dsp.integerValue==='3'),'ranking atualizado com 3 SP');
  await p.evaluate(()=>__pvT.ptbf());o=await p.evaluate(()=>__pvT.ptd());chk(o.g[8]===3,'não conta de novo');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
