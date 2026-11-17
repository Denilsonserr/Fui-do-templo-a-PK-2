// v510: ranking MELHORES DROPS do portal (Honrado fixo com 4 anéis dourados SP)
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t510_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  const D=(id,f)=>({document:{name:'x/'+id,fields:Object.fromEntries(Object.entries(f).map(([k,v])=>[k,typeof v==='number'?{integerValue:String(v)}:{stringValue:v}]))}});
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),b=r.request().postData()||'';if(/:runQuery/.test(u)&&/pdp/.test(b))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify([D('ptd_a',{pdp:520,dsp:1,dtx:'1× DOURADO SP · 2× DOURADO SS',uid:'u1',nome:'Fred',char:'goku'}),D('ptd_b',{pdp:300,dsp:0,dtx:'3× DOURADO SSS',uid:'u2',nome:'Breno',char:'shaka'})])});if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","shaka"]',tw_nome:'"t"',tw_uid:'"u_t"'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.view('pt')});await p.waitForTimeout(800);
  await p.evaluate(()=>__pvT.ptk());await p.waitForTimeout(1500);chk(await p.$('#ptDrA')!==null,'botão MELHORES DROPS no ranking dos portais');
  await p.click('#ptDrA');await p.waitForTimeout(1500);
  const L=await p.$$eval('.ptDr .ptRkL>div',a=>a.map(x=>x.textContent.replace(/\s+/g,' ').trim()));console.log(L);
  chk(/Honrado.*4× DOURADO SP/.test(L[0]),'1º Honrado com 4 anéis dourados SP');chk(/Fred/.test(L[1])&&/Breno/.test(L[2]),'depois Fred (1 SP) e Breno');
  await p.screenshot({path:SH+'rank.png'});
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
