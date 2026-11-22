// v614: 3 códigos para todos (1 vez por conta). Texto NÃO fica no repo: C1=.. C2=.. C3=.. node tcod_v614.js
const {chromium}=require('playwright');const E_=process.env;
const page=async(b,uid)=>{const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());const used=new Set();
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});
    if(m==='POST'||m==='PATCH'){const k=u.split('?')[0]+(u.match(/documentId=([^&]+)/)||[])[1];if(used.has(k))return r.fulfill({status:409,contentType:'application/json',body:'{}'});used.add(k)}return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(u=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"P'+u+'"',tw_uid:'"'+u+'"'})}},uid);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);return [p,errs]};
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  for(const u of ['u_a','u_b']){const [p,errs]=await page(b,u);
    const r=await p.evaluate(async C=>{const out=[];for(const c of C){const g0=__pvT.G?0:0;const st=()=>({gem:+JSON.parse(localStorage.rk_gem||'0'),tic:+JSON.parse(localStorage.rk_tic||'0')});const a=st();
      const mk=()=>{const E=document.createElement('div');document.body.appendChild(E);return E};const E=mk();await __pvT.cup(c.toLowerCase(),E);const z=st();const E2=mk();await __pvT.cup(c.toLowerCase(),E2);
      out.push({txt:E.textContent,again:E2.textContent,gem:z.gem-a.gem,tic:z.tic-a.tic})}return out},[E_.C1,E_.C2,E_.C3]);
    for(const x of r)console.log(u,JSON.stringify(x));
    chk(r[0].gem>=1000&&r[0].gem<=5000&&r[0].tic===0,u+' gemas da sorte '+r[0].gem);chk(r[1].tic>=10&&r[1].tic<=20&&r[1].gem===0,u+' tickets da sorte '+r[1].tic);chk(r[2].gem===1000,u+' 1000 gemas');
    chk(r.every(x=>/já usou/i.test(x.again)),u+' só 1 vez');chk(!errs.length,'sem erros '+errs.join('|'));await p.close()}
  console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
