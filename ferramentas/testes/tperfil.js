// v235: Perfil + Histórico (menu principal → Perfil), foto do celular, pedestal, radar, contadores na luta da Torre
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.setDefaultTimeout(120000);
const errs=[];p.on('pageerror',e=>{errs.push((e.stack||e.message).slice(0,300))});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();
  Object.assign(localStorage,{tw_nome:'"Teste"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","garou","naruto","zoro"]',rk_sel:'"garou"',rk_rp:'5200',rk_dia:'1',tw_moedas:'1000',
    tw_tit:'["ini","rk3"]',tw_titOn:'"rk3"',rk_st:JSON.stringify({wins:12,loss:5,tt:143,rec:{3:143},dmgTot:90000}),rk_use:JSON.stringify({garou:9,goku:4,zoro:2}),tw_hist:JSON.stringify([{andar:7,tempo:200,trof:20},{andar:3,tempo:90,trof:5}])})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const shot=n=>p.screenshot({path:SH+'pf_'+n+'.png'});const wait=ms=>p.waitForTimeout(ms);
await wait(1000);await shot('menu');await p.click('#mPerfil');await wait(900);await shot('perfil');
const fc=p.waitForEvent('filechooser');await p.click('#rkWrap .pfFoto');await wait(300);await shot('foto_menu');await p.click('#pfF1');(await fc).setFiles(process.env.FOTO);await wait(1200);await shot('perfil_foto');
const foto=await p.evaluate(()=>(JSON.parse(localStorage.rk_foto||'""')||'').length);
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
console.log(JSON.stringify({foto,rkmax,d}),'ERROS',JSON.stringify(errs));await b.close()})();
