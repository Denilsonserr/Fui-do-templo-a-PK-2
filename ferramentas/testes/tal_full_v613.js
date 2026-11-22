// v613: Alucard de corpo inteiro (arte do dono) no menu/perfil/anéis/passe
const {chromium}=require('playwright');const SH=__dirname+'/shots/t613_';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:1});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","alucard"]',rk_sel:'"alucard"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  const clean=()=>p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});
  await clean();await p.screenshot({path:SH+'menu.png'});
  console.log(await p.evaluate(()=>__vw.fullSrc('alucard')));const imgs=await p.evaluate(()=>[...document.querySelectorAll('img')].map(i=>i.getAttribute('src')).filter(s=>s&&s.includes('459fdad9160275')).length);console.log('imgs com corpo inteiro no menu:',imgs);
  for(const n of ['pf','bp','pvp','lvl','ps']){await clean();await p.evaluate(n=>__vw.rkView(n),n);await p.waitForTimeout(1500);
    const c=await p.evaluate(()=>document.getElementById('rkWrap').innerHTML.split('459fdad9160275').length-1);console.log(n,'corpo inteiro:',c);await p.screenshot({path:SH+n+'.png'})}
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');await b.close()})();
