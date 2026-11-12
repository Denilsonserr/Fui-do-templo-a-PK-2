// v368: perfil novo, batalhas, álbum e coleção (fotos em shots/p368_*)
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/p368_';const ADM=process.env.ADM;
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(adm=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(adm?'Denilson ADM':'Zé Teste'),rk_own:'["goku","vegeta","shaka","naruto","gojo","aylla","zoro"]',rk_ped:'"shaka"',tw_tit:'["adm"]',tw_titOn:'"adm"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_rp:'38000',rk_rkmax:'9',rk_pvp:JSON.stringify({t:5,d:1,s:3,bt:6,rz:1}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}},ADM);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{const G=__pvT.G(),ms=['pvp','boss','torre','caca','hidra','pve','dsf','pvp','boss','torre','pvp'],cs=['shaka','goku','naruto','shaka','gojo','shaka','goku'];
  for(let i=0;i<23;i++){G._btT=0;G.p=[{def:__pvT.ch(cs[i%cs.length]),hp:i%5===0?100:40,mhp:100},{def:__pvT.ch(['vegeta','madara','broly','luffy'][i%4])}];const m=ms[i%ms.length];__pvT.bt.rec(m,i%3!==2,m==='caca'?{o:'lobo',on:'LOBO',x:'NÍVEL 7'}:m==='hidra'?{o:'hidra',on:'HIDRA',x:'NÍVEL 4'}:m==='pvp'?{on:'Sapopreto',x:'RANQUEADA'}:{})}
  G.p=null;G._btT=0});
await p.evaluate(()=>__pvT.rv('pf'));await p.waitForTimeout(1800);await p.screenshot({path:SH+'perfil.png'});
for(const v of ['p3bt','p3al','p3co']){await p.click(`#rkWrap [data-a="${v}"]`,{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+v+'.png'})}
await p.click('#rkWrap [data-a="p3al"]',{force:true});await p.waitForTimeout(600);await p.click('#rkWrap [data-a="alAll"]',{force:true});await p.waitForTimeout(900);await p.screenshot({path:SH+'p3al_colado.png'});
await p.click('#rkWrap [data-a="alPg"][data-d="1"]',{force:true});await p.waitForTimeout(500);await p.screenshot({path:SH+'p3al_2.png'});
await p.click('#rkWrap [data-a="p3bt"]',{force:true});await p.waitForTimeout(500);await p.click('#rkWrap [data-a="btF"][data-f="pvp"]',{force:true});await p.waitForTimeout(500);await p.screenshot({path:SH+'p3bt_pvp.png'});
await p.click('#rkWrap [data-a="btD"]',{force:true});await p.waitForTimeout(500);await p.screenshot({path:SH+'p3bt_det.png'});
console.log('ERROS',errs);await b.close()})();
