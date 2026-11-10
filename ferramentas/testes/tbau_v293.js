// v293: baú da Caça (anel 100%, pausa, CONTINUAR), códigos, item no espaço certo, evento
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku"]',rk_gem:'5000',
 tw_inv:JSON.stringify([{id:'ro',t:'esp',r:'sec',v:0,st:60,drop:30,nm:'ROSÁRIO DE SHAKA',sk:1,ysec:1}]),tw_eqp:JSON.stringify({anel:'ro'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
console.log('eqp',await p.evaluate(()=>localStorage.tw_eqp));
await p.click('#mRank');await p.waitForTimeout(900);await p.click('#rkWrap [data-a="caca"]',{force:true});await p.waitForTimeout(1200);
await p.click('#rkWrap [data-a="caGo"]',{force:true});await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(600);
const res=[];
for(let k=0;k<2;k++){await p.evaluate(()=>{const [a,o]=__dbg.G.p;a.hp=3600;o.hp=3;o.hpLag=3;o.x=a.x+170;o.y=486;o.grounded=true;o.vy=0;o.bs='idle';o.bcd=300;o.state='idle';o.inv=0;o.facing=-1;a.facing=1;a.state='idle'});
  for(let i=0;i<12;i++){await p.keyboard.press('KeyJ');await p.waitForTimeout(110);if(await p.evaluate(()=>!!document.querySelector('.bcO')))break}
  await p.waitForTimeout(300);await p.screenshot({path:SH+'b93_fechado'+k+'.png'});const fr0=await p.evaluate(()=>__dbg.G.frame||__dbg.G.t||0);
  await p.waitForTimeout(2600);await p.screenshot({path:SH+'b93_aberto'+k+'.png'});
  const st=await p.evaluate(()=>({hold:__dbg.G.hold,cls:(document.querySelector('.bcO')||{}).className,cells:document.querySelectorAll('.bcO .bcS:not(.vz)').length,an:JSON.parse(localStorage.rk_an||'[]').length}));
  await p.click('.bcGo',{force:true});await p.waitForTimeout(400);st.after=await p.evaluate(()=>({hold:__dbg.G.hold,ov:!!document.querySelector('.bcO'),mode:__dbg.G.mode}));res.push(st)}
console.log(JSON.stringify(res));
// códigos
await p.evaluate(()=>{const E=document.createElement('p');window.__E=E});
console.log('erros',JSON.stringify(errs));await b.close()})();
