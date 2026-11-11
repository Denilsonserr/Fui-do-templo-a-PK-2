// v333: PVP sombra com o servidor local (node ferramentas/servidor/local.mjs 8790)
// Bia (sombra com estilo de socos) · Caio busca partida, luta apertando teclas, ganha/perde estrela · ADM desliga/liga · histórico e ranking
const {chromium}=require('playwright');const U='http://localhost:8790/index.html';const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/pvp_';
const PF={c:{'0n0-':{P:30,K:10,BL:5},'1n0-':{FW:20,P:6},'2n0-':{FW:25,KI:3},'3n0-':{FW:20,KC:5},'0a0-':{BL:20,P:5},'1a0-':{BL:10,FW:4},'0v0-':{P:25,K:10},'1v0-':{FW:20}},ch:{PPPK:10,PP:5,KK:3},th:{B:10,J:2,C:3,N:2},rd:[100,10],n:500};
(async()=>{const b=await chromium.launch();const errs=[];const out={};
const ctx=async(init)=>{const c=await b.newContext({viewport:{width:915,height:412}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|googleapis/,r=>r.abort());
  await p.addInitScript(i=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,i)}},init);await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(6000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});return p};
const conta=async p=>{await p.click('#rkWrap [data-a="conta"]',{force:true});await p.waitForTimeout(400);await p.fill('#acP1','senha1');await p.fill('#acP2','senha1');await p.click('#acNew');await p.waitForTimeout(2500);await p.evaluate(()=>{const x=document.getElementById('acX');if(x)x.click()});await p.waitForTimeout(300)};
const base={rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_gem:'0'};
// Bia: sombra
const B=await ctx(Object.assign({},base,{tw_nome:'"Bia"',rk_own:'["goku","vegeta"]',rk_sel:'"vegeta"',rk_pvf:JSON.stringify({vegeta:PF})}));await conta(B);
await B.screenshot({path:SH+'menu.png'});await B.click('#rkWrap [data-a="pvp"]',{force:true});await B.waitForTimeout(2500);await B.screenshot({path:SH+'tela.png'});
// Caio
const A=await ctx(Object.assign({},base,{tw_nome:'"Caio"',rk_own:'["goku"]',rk_sel:'"goku"'}));await conta(A);
await A.click('#rkWrap [data-a="pvp"]',{force:true});await A.waitForTimeout(1500);await A.click('#rkWrap [data-a="pvGo"]',{force:true});await A.waitForTimeout(2200);await A.screenshot({path:SH+'achou.png'});
out.achou=await A.evaluate(()=>document.querySelector('.rk_pvp .pvP.p2')?.innerText);
await A.waitForTimeout(6000);await A.screenshot({path:SH+'vs.png'});
const K=['KeyJ','KeyJ','KeyK','KeyJ','KeyD','KeyD','KeyA','KeyW','KeyJ','KeyK','KeyL'];let t=0,end=false;
const T0=Date.now();for(;Date.now()-T0<170000&&!end;t++){const k=K[(Math.random()*K.length)|0];await A.keyboard.down(k);await A.waitForTimeout(80+Math.random()*120);await A.keyboard.up(k);
  if(t===30)await A.screenshot({path:SH+'luta.png'});end=await A.evaluate(()=>!!document.querySelector('.pvRes'))}
await A.waitForTimeout(1500);await A.screenshot({path:SH+'fim.png'});
out.res=await A.evaluate(()=>document.querySelector('.pvRes')?.innerText.replace(/\n+/g,' | '));out.pvp=await A.evaluate(()=>localStorage.rk_pvp);out.gravado=await A.evaluate(()=>{const P=JSON.parse(localStorage.rk_pvf||'{}');return Object.fromEntries(Object.entries(P).map(([k,v])=>[k,{n:v.n,ch:Object.keys(v.ch).slice(0,5),th:v.th}]))});
await A.evaluate(()=>{document.getElementById('rkMX')?.click()});await A.waitForTimeout(500);await A.click('#rkWrap [data-a="pvRank"]',{force:true});await A.waitForTimeout(1500);await A.screenshot({path:SH+'ranking.png'});out.ranking=await A.evaluate(()=>document.querySelector('.pvRkL')?.innerText.replace(/\n+/g,' | '));
await A.evaluate(()=>document.getElementById('rkMX')?.click());await A.click('#rkWrap [data-a="pvForm"]',{force:true});await A.waitForTimeout(700);await A.screenshot({path:SH+'formacao.png'});await A.evaluate(()=>document.getElementById('rkMX')?.click());
// Bia vê quem lutou contra a sombra dela
await B.waitForTimeout(61000);await B.click('#rkWrap [data-a="pvHist"]',{force:true});await B.waitForTimeout(1500);await B.screenshot({path:SH+'hist.png'});out.histBia=await B.evaluate(()=>document.querySelector('.pvHi')?.innerText.replace(/\n+/g,' | '));
// ADM desliga
const D=await ctx(Object.assign({},base,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_own:'["goku"]'}));await D.click('#rkWrap [data-a="pvp"]',{force:true});await D.waitForTimeout(1500);await D.click('#rkWrap [data-a="pvCfg"]',{force:true});await D.waitForTimeout(500);await D.screenshot({path:SH+'adm.png'});await D.click('#pvCt');await D.waitForTimeout(1500);out.adm=await D.evaluate(()=>document.getElementById('rkToast')?.innerText);
await A.evaluate(()=>{});await A.waitForTimeout(500);await A.click('#rkWrap [data-a="back"]',{force:true});await A.waitForTimeout(130000);await A.click('#rkWrap [data-a="pvp"]',{force:true});await A.waitForTimeout(2500);await A.screenshot({path:SH+'desligado.png'});out.desligado=await A.evaluate(()=>document.querySelector('.pvOff')?.innerText);
await D.click('#rkWrap [data-a="pvCfg"]',{force:true});await D.waitForTimeout(500);await D.click('#pvCt');await D.waitForTimeout(1500);out.adm2=await D.evaluate(()=>document.getElementById('rkToast')?.innerText);
console.log(JSON.stringify(out,null,1),'\nERROS',errs);await b.close()})();
