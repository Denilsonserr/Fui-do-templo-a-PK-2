// v671: PVP — uma conta com MUITAS sombras salvas não pode esconder as outras na busca ("Nenhuma sombra encontrada")
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku","vegeta"]',rk_sel:'"goku"',tw_nome:'"zzHonrado"',ac_n:'zzHonrado',ac_k:'k'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const r=await p.evaluate(async()=>{const me=__ev('pvAcc')();await __ev('pvUp')(true);const pvQ=__ev('pvQ'),pvPost=__ev('pvPost'),mon=__ev('pvMon')();
  const mine=(await pvQ('pva',me,1))[0];const toF=(e,acc,nm,ts)=>{const F={};for(const k in e){if(k==='_id')continue;const v=e[k];F[k]=typeof v==='number'?{integerValue:String(v)}:{stringValue:String(v)}}F.pva={stringValue:acc};F.nome={stringValue:nm};F.pvn={stringValue:nm.toLowerCase()};F.ts={integerValue:String(ts)};return F};
  // eu (conta com ID "grande") com 70 sombras; 3 outros jogadores com 2 cada (IDs "menores")
  let ts=Date.now()-1e6;const myId=me;for(let i=0;i<70;i++){ts+=1000;await pvPost('pvs_'+myId+'_'+ts.toString(36).padStart(9,'0'),toF(mine,myId,'zzHonrado',ts))}
  for(const [acc,nm] of [['00aaaa','Breno'],['00bbbb','Zeus'],['00cccc','Vini']])for(let i=0;i<2;i++){ts+=1000;await pvPost('pvs_'+acc+'_'+ts.toString(36).padStart(9,'0'),toF(mine,acc,nm,ts))}
  const found=new Set();for(let i=0;i<12;i++){__ev('PV').last=null;const x=await __vw.pvFind();if(x)found.add(x.nome)}
  // jeito antigo (para comparar)
  const old=await pvQ('pvg','g0_'+mon,40);return {found:[...found],oldAccs:[...new Set(old.map(e=>e.pva))]}});
console.log(JSON.stringify(r));
chk(r.oldAccs.length===1&&r.oldAccs.length===1,'reproduzido: jeito antigo só trazia as sombras da conta com mais docs (a própria)');
chk(r.found.length===3&&!r.found.includes('zzHonrado'),'agora a busca acha os 3 outros jogadores ('+r.found.join(', ')+') e nunca a própria sombra');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
