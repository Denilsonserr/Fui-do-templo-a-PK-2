// v235/v236: Perfil + Histórico (menu principal → Perfil), foto do celular, pedestal, radar, contadores na luta da Torre
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.setDefaultTimeout(120000);
const errs=[];p.on('pageerror',e=>{errs.push((e.stack||e.message).slice(0,300))});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();
  const I=[{id:'e1',t:'esp',r:'comum',v:2},{id:'e2',t:'cap',r:'rara',v:5,crit:5},{id:'e3',t:'arm',r:'epica',v:5},{id:'e4',t:'bot',r:'lend',v:7},{id:'e5',t:'esp',r:'mit',v:10},{id:'e6',t:'esp',r:'lend',v:25,vel:2,crit:15,st:5,uniq:1,nm:'LÂMINA DOURADA'}];
  Object.assign(localStorage,{tw_inv:JSON.stringify(I),tw_nome:sessionStorage.adm?'"Denilson ADM"':'"Teste"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","garou","naruto","zoro"]',rk_sel:'"garou"',rk_rp:'5200',rk_dia:'1',tw_moedas:'1000',
    tw_tit:'["ini","rk3"]',tw_titOn:'"rk3"',rk_st:JSON.stringify({wins:12,loss:5,tt:143,rec:{3:143},dmgTot:90000}),rk_use:JSON.stringify({garou:9,goku:4,zoro:2}),tw_hist:JSON.stringify([{andar:7,tempo:200,trof:20},{andar:3,tempo:90,trof:5}])})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const shot=n=>p.screenshot({path:SH+'pf_'+n+'.png'});const wait=ms=>p.waitForTimeout(ms);
await wait(1000);await shot('menu');await p.click('#mPerfil');await wait(900);await shot('perfil');
const fc=p.waitForEvent('filechooser');await p.click('#rkWrap .pfFoto');await wait(300);await shot('foto_menu');await p.click('#pfF1');(await fc).setFiles(process.env.FOTO);await wait(800);await shot('crop');
{const bb=await p.locator('#pfCv').boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height*0.9,{steps:6});await p.mouse.up();await p.fill('#pfZ','2.2');await p.dispatchEvent('#pfZ','input');await wait(300);await shot('crop2');await p.click('#pfCok')}
await wait(800);await shot('perfil_foto');
for(const [i,id] of [[0,'e6'],[1,'e5'],[2,'e3']]){await p.click(`#rkWrap .pfV[data-i="${i}"]`,{force:true});await wait(300);if(i===0)await shot('vit_pick');await p.click(`#rkModal .pfVG button[data-v="${id}"]`);await wait(400)}
await wait(800);await shot('perfil_vit');
const vit=await p.evaluate(()=>localStorage.rk_vit);const foto=await p.evaluate(()=>(JSON.parse(localStorage.rk_foto||'""')||'').length);
await p.click('#rkWrap .pfLupa',{force:true});await wait(300);await shot('pick');await p.click('#rkModal .pfCP button[data-c="naruto"]');await wait(500);
await p.click('#rkWrap [data-a="hs"]');await wait(1500);await shot('historico');
await p.click('#rkWrap [data-a="pfRadar"]');await wait(300);await shot('radar');await p.click('#rkMX');
// rank cai: máximo continua
await p.evaluate(()=>{localStorage.rk_rp='9500'});await p.click('#rkWrap [data-a="pf"]');await wait(400);await p.evaluate(()=>{localStorage.rk_rp='3000'});await p.click('#rkWrap [data-a="hs"]');await wait(400);await p.click('#rkWrap [data-a="pf"]');await wait(600);await shot('perfil_rkmax');
const rkmax=await p.evaluate(()=>localStorage.rk_rkmax);
// luta na Torre: conta uso, acertos e andar vencido
await p.click('#rkWrap [data-a="back"]');await wait(300);await p.click('#mRank');await wait(600);await p.click('#rkWrap [data-a="torre"]');await wait(1200);
await p.click('#twGo');await wait(1600);await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await wait(400);
await p.evaluate(()=>{const G=__dbg.G;G.p[1].hp=50;G.timer=1;G.tf=59});
await p.waitForFunction(()=>__dbg.G.mode==='tower',null,{timeout:60000});await wait(2000);
const d=await p.evaluate(()=>({pf:JSON.parse(localStorage.rk_pf||'{}'),use:JSON.parse(localStorage.rk_use||'{}')}));
console.log(JSON.stringify({vit,foto,rkmax,d}),'ERROS',JSON.stringify(errs));await b.close()})();
