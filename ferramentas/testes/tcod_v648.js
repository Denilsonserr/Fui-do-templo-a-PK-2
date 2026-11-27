// v648: código para todos (1 vez por conta): 10.000 gemas + 20 tickets + anel preto SS. Texto NÃO fica no repo: C1=.. node tcod_v648.js
const {chromium}=require('playwright');const E_=process.env;
const page=async(b,uid)=>{const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());const used=new Set();
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});
    if(m==='POST'||m==='PATCH'){const k=u.split('?')[0]+(u.match(/documentId=([^&]+)/)||[])[1];if(used.has(k))return r.fulfill({status:409,contentType:'application/json',body:'{}'});used.add(k)}return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(u=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"P'+u+'"',tw_uid:'"'+u+'"'})}},uid);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);return [p,errs]};
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  for(const u of ['u_a','u_b']){const [p,errs]=await page(b,u);
    const r=await p.evaluate(async C=>{const out=[];for(const c of C){const g0=__pvT.G?0:0;const st=()=>({gem:+JSON.parse(localStorage.rk_gem||'0'),tic:+JSON.parse(localStorage.rk_tic||'0')});const a=st();const n0=JSON.parse(localStorage.rk_an||'[]').length;
      const mk=()=>{const E=document.createElement('div');document.body.appendChild(E);return E};const E=mk();await __pvT.cup(c.toLowerCase(),E);const z=st();const E2=mk();await __pvT.cup(c.toLowerCase(),E2);
      const AN=JSON.parse(localStorage.rk_an||'[]');const nr=AN.slice(n0);out.push({txt:E.textContent,again:E2.textContent,gem:z.gem-a.gem,tic:z.tic-a.tic,an:AN.length-n0,anel:nr.map(x=>[x.c,x.g,x.s,x.s2,x.l])})}return out},[E_.C1]);
    for(const x of r)console.log(u,JSON.stringify(x));
    chk(r[0].gem===10000&&r[0].tic===20,u+' 10.000 gemas + 20 tickets');chk(r[0].an===1&&r[0].anel[0][0]===3&&r[0].anel[0][1]===6,u+' anel preto SS');
    chk(r.every(x=>/já usou/i.test(x.again)),u+' só 1 vez');chk(!errs.length,'sem erros '+errs.join('|'));await p.close()}
  console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
