// v611: 4 códigos de uso único (passe premium Hellsing, 2× passe V2 em dobro, sombra Beru). Texto NÃO fica no repo:
// rode com  C1=.. C2=.. C3=.. C4=.. node tcod_v611.js
const {chromium}=require('playwright');const E_=process.env;
const run=async(b,cod,fn)=>{const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  const r=await p.evaluate(async c=>{const mk=()=>{const E=document.createElement('div');document.body.appendChild(E);return E};const E=mk();await __pvT.cup(c.toLowerCase(),E);const E2=mk();await __pvT.cup(c.toLowerCase(),E2);
    return {txt:E.textContent,again:E2.textContent,bp:JSON.parse(localStorage.rk_bp||'{}'),sh:__pvT.sjSys().sh}},cod);await p.close();return [r,errs]};
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  for(const [k,x2] of [['C1',0],['C2',1],['C3',1]]){const [r,e]=await run(b,E_[k]);console.log(k,r.txt,'|',r.again,JSON.stringify(r.bp).slice(0,200));
    chk(r.bp.s===3&&r.bp.own===2&&(!x2||r.bp.x2===1)&&!e.length,k+' passe liberado');chk(/já usou/i.test(r.again),k+' uso único');chk(x2?/dobro/.test(r.txt):!/dobro/.test(r.txt),k+(x2?' em dobro':' normal'))}
  const [r,e]=await run(b,E_.C4);console.log('C4',r.txt,'|',r.again,r.sh);chk(r.sh.includes('beru')&&!e.length,'Beru liberado');chk(/já usou/i.test(r.again),'C4 uso único');
  console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
