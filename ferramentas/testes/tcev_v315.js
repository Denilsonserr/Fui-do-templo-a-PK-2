// v315: evento da Caça (relógio simulado): faixa, caçada registrada, prêmios depois do fim
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const T0=Date.UTC(2026,10,11,0,20);
const run=async(nome,lv,tFim)=>{const c=await b.newContext({viewport:{width:915,height:412},deviceScaleFactor:2});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.addInitScript(([n,t0])=>{const off=t0-Date.now();const n0=Date.now.bind(Date);Date.now=()=>n0()+off;if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(n)})}},[nome,T0]);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(6000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
  await p.evaluate(()=>document.querySelector('#rkWrap [data-a="caca"]').click());await p.waitForTimeout(1200);if(nome==='Ana')await p.screenshot({path:'shots/cev_tela.png'});
  await p.click('#rkWrap [data-a="caGo"]',{force:true});await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(500);
  await p.evaluate(lv=>{const [a,o]=__dbg.G.p;o.bLv=lv;o.hp=3;o.hpLag=3;o.x=a.x+170;o.y=486;o.grounded=true;o.bs='idle';o.bcd=300;o.state='idle';o.inv=0;o.facing=-1;a.facing=1;a.state='idle'},lv);
  for(let i=0;i<14;i++){await p.keyboard.press('KeyJ');await p.waitForTimeout(110);if(await p.evaluate(()=>!!document.querySelector('.bcO')))break}await p.waitForTimeout(3400);await p.click('.bcSair',{force:true});await p.waitForTimeout(1500);
  await p.waitForTimeout(1500);const part=await p.evaluate(()=>localStorage.cev1115_part);await c.close();return part};
console.log('participou',await run('Ana',6),await run('Beto',3),await run('Caio',8),await run('Dani',1));
// depois do fim: Caio 1º, Ana 2º, Beto 3º, Dani só participação
const c=await b.newContext({viewport:{width:915,height:412},deviceScaleFactor:2});const p=await c.newPage();await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{const off=Date.UTC(2026,10,11,0,35)-Date.now();const n0=Date.now.bind(Date);Date.now=()=>n0()+off;if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Caio"',cev1115_part:'1'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(500);
console.log('uid?',await p.evaluate(()=>localStorage.tw_uid));await p.waitForTimeout(9000);await p.click('#mRank').catch(()=>{});await p.waitForTimeout(3000);
console.log('premio',await p.evaluate(()=>[(document.querySelector('#rkModal')||{}).innerText,localStorage.rk_an]));await p.screenshot({path:'shots/cev_premio.png'});
console.log('erros',JSON.stringify(errs));await b.close()})();
