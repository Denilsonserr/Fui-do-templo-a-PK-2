// v607: mochila com 2000 itens diferentes (muito acima de 40 espaços): equipar não trava mais (twCap de uma vez só)
const {chromium}=require('playwright');(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const b=await chromium.launch();const p=await b.newPage();const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(sessionStorage.d)return;sessionStorage.d=1;localStorage.clear();const T=['esp','arm','bot','cap','anel'],R=['comum','rara','epica','lend','mit'];const I=[];
  for(let i=0;i<2000;i++){const t=T[i%5],r=R[(i*7)%5];I.push({id:'i'+i,t,r,v:5+(i%97),crit:i%3?0:5,dmg:i%4?0:4})}I.push({id:'u1',t:'esp',r:'sec',v:0,dmg:90,nm:'JACKAL & CASULL',al:1,ysec:1});
  Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',tw_nome:'"Bia"',tw_inv:JSON.stringify(I)})});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1200);
const r=await p.evaluate(()=>__pvT.twCap());const keep=await p.evaluate(()=>JSON.parse(localStorage.tw_inv).some(x=>x.id==='u1'));
chk(r.ms<1500,'corta 2000 itens em '+Math.round(r.ms)+' ms (antes travava)');chk(r.stacks<=41,'mochila volta para 40 espaços ('+r.stacks+')');chk(keep,'item secreto do Alucard não é descartado');
console.log(E.length?'ERROS '+E.slice(0,3).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
