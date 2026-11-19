// v545: punição van hohenheim (-75% gemas, 1x) + Mercado Negro fechado (menos ADM)
const {chromium}=require('playwright');
async function run(nome,gem){const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(([n,g])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(n),rk_gem:String(g),rk_own:'["goku"]',rk_lvrz:'1',rk_pvupv:'352'})}},[nome,gem]);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(8500);
  const g1=await p.evaluate(()=>+localStorage.rk_gem);await p.evaluate(()=>__pvT.punVan());const g2=await p.evaluate(()=>+localStorage.rk_gem);
  const fech=await p.evaluate(()=>__pvT.mnFech());const modal=await p.evaluate(()=>document.getElementById('rkModal').innerText.slice(0,120));
  await b.close();return {g1,g2,fech,modal,errs}}
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const v=await run('van hohenheim',166379);chk(v.g1===166379-Math.floor(166379*.75)&&v.g2===v.g1,'van perdeu 75% uma vez só ('+v.g1+')');chk(/PUNIÇÃO/.test(v.modal),'aviso de punição');chk(v.fech,'mercado fechado p/ van');
  const o=await run('Breno',373399);chk(o.g1===373399,'outro jogador não perde gemas');chk(o.fech,'mercado fechado p/ jogador normal');
  const a=await run('Denilson ADM',545769);chk(a.g1===545769&&!a.fech,'ADM não perde e mercado aberto p/ ADM');
  const e=[...v.errs,...o.errs,...a.errs];console.log(e.length?'ERROS '+e.join('|'):'sem erros');console.log(ok&&!e.length?'TUDO OK':'FALHOU')})();
