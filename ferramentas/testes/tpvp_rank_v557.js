// v557: ranking PVP com 1 doc por conta (latestBy no worker) + bônus do Vini
const {chromium}=require('playwright');
(async()=>{const W='http://localhost:8790/fs/v1/projects/furia-do-templo/databases/(default)/documents';let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const post=async(id,f)=>{const F={};for(const k in f)F[k]=typeof f[k]==='number'?{integerValue:String(f[k])}:{stringValue:f[k]};await fetch(W+'/torre?documentId='+id,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:F})})};
  const mon='m202611r2';for(let i=0;i<400;i++)await post('pvs_aaa_'+i,{pvk:mon,pva:'aaa',nome:'Breno',pvs:300+(i%40),d:'{"t":5}'});
  for(let i=0;i<350;i++)await post('pvs_bbb_'+i,{pvk:mon,pva:'bbb',nome:'Honrado',pvs:280+(i%40),d:'{"t":5}'});
  await post('pvs_10jasju_1',{pvk:mon,pva:'10jasju',nome:'Vini_junior10',pvs:150,d:'{"t":3}'});await post('pvs_10jasju_2',{pvk:mon,pva:'10jasju',nome:'Vini_junior10',pvs:219,d:'{"t":4}'});await post('pvs_ccc_1',{pvk:mon,pva:'ccc',nome:'Fred',pvs:90,d:'{"t":2}'});
  const b=await chromium.launch();const p=await b.newPage();const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Vini_junior10"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  const L=await p.evaluate(async()=>(await __pvT.pvLoadAll(1)).map(e=>e.nome+':'+e.pvs));console.log(L.join(', '));
  chk(L.length===4&&L.some(x=>x==='Vini_junior10:219')&&L.some(x=>x.startsWith('Fred')),'ranking mostra todo mundo (1 por conta, o mais novo)');
  const v=await p.evaluate(()=>({on:__pvT.vnOn(),a:__pvT.vnExtra(Date.UTC(2026,10,19,20,0)),b:__pvT.vnExtra(Date.UTC(2026,10,19,23,0)),c:__pvT.vnExtra(Date.UTC(2026,10,20,1,0))}));
  console.log(JSON.stringify(v));chk(v.on&&v.a===4&&v.b===2&&v.c===0,'bônus do Vini: +4 (2 h), +2 (até 5 h), depois 0');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
