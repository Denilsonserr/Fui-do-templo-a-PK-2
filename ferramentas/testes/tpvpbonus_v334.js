// v334: a sombra leva TODOS os bônus (nível, equipamento, anel, passiva) e não gasta poção. Servidor local 8790.
const {chromium}=require('playwright');const U='http://localhost:8790/index.html';
(async()=>{const b=await chromium.launch();const errs=[];
const run=async(init)=>{const c=await b.newContext({viewport:{width:915,height:412}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|googleapis/,r=>r.abort());
  await p.addInitScript(i=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,i)}},init);await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(6000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
  await p.click('#rkWrap [data-a="conta"]',{force:true});await p.waitForTimeout(400);await p.fill('#acP1','senha1');await p.fill('#acP2','senha1');await p.click('#acNew');await p.waitForTimeout(2500);await p.evaluate(()=>{const x=document.getElementById('acX');if(x)x.click()});
  await p.click('#rkWrap [data-a="pvp"]',{force:true});await p.waitForTimeout(3000);return p};
const base={rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_own:'["vegeta"]',rk_sel:'"vegeta"',rk_pvch:'"vegeta"'};
await run(Object.assign({},base,{tw_nome:'"Pelado"'}));
const p=await run(Object.assign({},base,{tw_nome:'"Forte"',rk_lv:JSON.stringify({vegeta:{lv:45}}),tw_inv:JSON.stringify([{id:'e1',t:'esp',r:'mit',v:12,crit:5,n:'ESPADA'},{id:'e2',t:'bot',r:'lend',v:8,n:'BOTA'}]),tw_eqp:JSON.stringify({esp:'e1',bot:'e2'}),rk_an:JSON.stringify([{i:'r1',c:2,g:3,s:'dano',v:20},{i:'r2',c:2,g:3,s:'crit',v:6}]),rk_anEq:JSON.stringify({vegeta:['r1','r2']}),tw_pocOn:JSON.stringify({r:'lend'}),rk_pk_cura:JSON.stringify({v:30})}));
const pot=await p.evaluate(()=>[localStorage.tw_pocOn,localStorage.rk_pk_cura]);
const q=async v=>{const r=await fetch('http://localhost:8790/fs/v1/projects/furia-do-templo/databases/(default)/documents:runQuery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:'pvn'},op:'EQUAL',value:{stringValue:v}}},limit:5}})});const j=await r.json();return JSON.parse(j[0].document.fields.d.stringValue).s};
console.log('SEM ITENS',JSON.stringify(await q('pelado')));console.log('COM ITENS',JSON.stringify(await q('forte')));console.log('poção continua',pot);console.log('ERROS',errs);await b.close()})();
