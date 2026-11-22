// v615: Alucard vai até o nível 75
const {chromium}=require('playwright');const SH=__dirname+'/shots/t615_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:422}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","alucard","shaka"]',rk_sel:'"alucard"',tw_nome:'"Bia"',tw_uid:'"u_bia"',tw_moedas:'99999999',
    rk_lv:JSON.stringify({alucard:{lv:68,t:[],c:[]}})})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  const r=await p.evaluate(async()=>{const lv=()=>window.__rk.lvOf('alucard').lv;const out=[];
    for(let i=0;i<10;i++){/* recursos de sobra */localStorage.tw_moedas='99999999';localStorage.rk_po='999999';try{for(const k of ['cr','el','lvcr','lvel'])if(localStorage['rk_'+k]){const v=JSON.parse(localStorage['rk_'+k]);if(Array.isArray(v))localStorage['rk_'+k]=JSON.stringify(v.map(()=>9999))}}catch(e){}
      __vw.lvOpen('alucard');await new Promise(r=>setTimeout(r,150));await __vw.lvUp();await new Promise(r=>setTimeout(r,250));out.push(lv())}
    return {out,mxA:__vw.LVMAX('alucard'),mxS:__vw.LVMAX('shaka'),mxG:__vw.LVMAX('goku')}});
  console.log(JSON.stringify(r));chk(r.mxA===75,'Alucard máximo 75');chk(r.mxS===70&&r.mxG===40,'Shaka continua 70, outros iguais');chk(Math.max(...r.out)===75,'subiu até 75 e parou');
  await p.screenshot({path:SH+'nivel.png'});console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'TEM FALHA');await b.close()})();
