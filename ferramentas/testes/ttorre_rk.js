// v228: Torre dentro do Ranqueado (tela nova, XP ranqueado, bônus de rank, mochila nova com pilhas) + menu principal novo
const {chromium}=require('playwright');const SH='/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);
const errs=[];p.on('pageerror',e=>{errs.push((e.stack||e.message).slice(0,300))});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const P=[];for(let i=0;i<5;i++)P.push({id:'pc'+i,r:'comum',v:5});for(let i=0;i<3;i++)P.push({id:'pr'+i,r:'rara',v:8});
  const I=[];for(let i=0;i<4;i++)I.push({id:'e'+i,t:'esp',r:'rara',v:4});I.push({id:'a1',t:'arm',r:'lend',v:7});
  Object.assign(localStorage,{tw_nome:'"Teste"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","garou"]',rk_sel:'"garou"',rk_rp:'5200',rk_dia:'1',tw_poc:JSON.stringify(P),tw_inv:JSON.stringify(I),tw_moedas:'1000'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const shot=n=>p.screenshot({path:SH+'tr_'+n+'.png'});const wait=ms=>p.waitForTimeout(ms);
await wait(1200);await shot('menu');
await p.click('#mRank');await wait(600);await shot('rkmenu');await p.click('#rkWrap [data-a="torre"]');await wait(1200);await shot('torre');
await p.click('#rtUI .rtRow button[data-c="twBagB"]');await wait(500);await shot('mochila');
const pilhas=await p.evaluate(()=>[...document.querySelectorAll('#twModal .eqI')].map(e=>e.innerText.replace(/\n/g,' ')));
await p.click('#twModal .eqI');await wait(300);await shot('mochila_item');await p.click('#twModal #rkMX');await wait(300);
await p.click('#rtRw');await wait(400);await shot('recomp');await p.click('#rtRwX');await p.click('#rtPick');await wait(400);await shot('trocar');await p.click('#twModal .rtCP button[data-c="goku"]');await wait(300);
const xp0=await p.evaluate(()=>+localStorage.rk_rp);
await p.click('#twGo');await wait(1600);
await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await wait(400);
const st=await p.evaluate(()=>{const [a]=__dbg.G.p;return {pick:__dbg.G.pick,tdm:+a.tdm.toFixed(3),tsp:+a.tsp.toFixed(3),tdf:+a.tdf.toFixed(3),tcr:a.tcr}});
await p.evaluate(()=>{const G=__dbg.G;G.p[1].hp=50;G.timer=1;G.tf=59});await p.waitForFunction(()=>__dbg.G.mode==='tower',null,{timeout:60000});await wait(2500);await shot('apos1');
// fecha o que estiver aberto (baús/passivas) e desiste
for(let i=0;i<6;i++){const m=await p.evaluate(()=>!document.getElementById('twModal').hidden);if(!m)break;await p.evaluate(()=>{const b=document.querySelector('#twModal .twCh:not(.open)');if(b)b.click();const c=document.querySelector('#twModal .twp');if(c)c.click()});await wait(1500)}
await shot('antes_desistir');await p.click('#rtBack2');await wait(400);await p.click('#twYes');await wait(1200);await shot('fim');
const xp1=await p.evaluate(()=>+localStorage.rk_rp),xb=await p.evaluate(()=>document.querySelector('#twModal .rkXb')?.innerText);
console.log(JSON.stringify({pilhas,st,xp0,xp1,xb}),'ERROS',JSON.stringify(errs));await b.close()})();
