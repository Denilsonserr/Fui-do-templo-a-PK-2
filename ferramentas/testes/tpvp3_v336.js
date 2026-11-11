// v336: PVP time de 3 + sombra forte (servidor local 8790)
const {chromium}=require('playwright');const U='http://localhost:8790/index.html';const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/pv3_';
(async()=>{const b=await chromium.launch();const errs=[];const out={};
const run=async(nm,own,extra)=>{const c=await b.newContext({viewport:{width:915,height:412}});const p=await c.newPage();p.on('pageerror',e=>errs.push(nm+': '+e.message));await p.route(/fonts\.g|googleapis/,r=>r.abort());
  await p.addInitScript(i=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,i)}},Object.assign({rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(nm),rk_own:JSON.stringify(own),rk_sel:JSON.stringify(own[0])},extra||{}));await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(6000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
  await p.click('#rkWrap [data-a="conta"]',{force:true});await p.waitForTimeout(400);await p.fill('#acP1','senha1');await p.fill('#acP2','senha1');await p.click('#acNew');await p.waitForTimeout(2500);await p.evaluate(()=>{const x=document.getElementById('acX');if(x)x.click()});
  await p.click('#rkWrap [data-a="pvp"]',{force:true});await p.waitForTimeout(3000);return p};
const B=await run('Bia',['goku','vegeta','zoro','gojo'],{tw_tit:'["adm"]'});
await B.click('#rkWrap [data-a="pvForm"]',{force:true});await B.waitForTimeout(500);for(const id of ['gojo','zoro','goku'])await B.evaluate(id=>document.querySelector(`#rkModal .pvFc[data-id="${id}"]`).click(),id);
await B.waitForTimeout(300);await B.screenshot({path:SH+'form.png'});out.timeBia=await B.evaluate(()=>localStorage.rk_pvt);await B.evaluate(()=>document.getElementById('rkMX').click());await B.waitForTimeout(500);
await B.click('#rkWrap [data-a="pvGo"]',{force:true});await B.waitForTimeout(3000);
const A=await run('Caio',['goku','luffy'],{});await A.click('#rkWrap [data-a="pvGo"]',{force:true});await A.waitForTimeout(2500);await A.screenshot({path:SH+'achou.png'});
await A.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:60000});
out.times=await A.evaluate(()=>__pvT.G().teams);out.bonusSombra=await A.evaluate(()=>{const G=__pvT.G(),o=G.p[1];return {id:o.def.id,tdm:o.tdm,tdf:o.tdf,tsp:o.tsp,tcr:o.tcr}});
// jogador parado 15 s: quanto a sombra bate
const hp0=await A.evaluate(()=>__pvT.G().p[0].hp);await A.waitForTimeout(15000);out.danoSombra15s=await A.evaluate(h=>Math.round(h-__pvT.G().p[0].hp),hp0);await A.screenshot({path:SH+'luta.png'});
// força nocautes: derruba os 3 da sombra
for(let k=0;k<3;k++){await A.waitForFunction(()=>{const G=__pvT.G();return G.phase==='fight'},null,{timeout:60000});out['luta'+k]=await A.evaluate(()=>{const G=__pvT.G();return G.p[0].def.id+' x '+G.p[1].def.id});await A.evaluate(()=>{const G=__pvT.G(),o=G.p[1];o.hp=0;__pvT.ko(G.p[0],o)});await A.waitForTimeout(6000)}
await A.waitForTimeout(2000);await A.screenshot({path:SH+'fim.png'});out.res=await A.evaluate(()=>document.querySelector('.pvRes')?.innerText.replace(/\n+/g,' | '));
console.log(JSON.stringify(out,null,1),'\nERROS',errs);await b.close()})();
