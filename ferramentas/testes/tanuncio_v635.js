// v636: anúncio do passe — NÃO abre ao iniciar; abre TODA VEZ em "Batalha e Aventura"; 1x ao entrar no passe; sempre ao tentar o PREMIUM sem ter
const {chromium}=require('playwright');const SH=__dirname+'/shots/t636_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const ctx=await b.newContext({viewport:{width:915,height:412}});const p=await ctx.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_own:'["goku"]'})}});
  const has=()=>p.evaluate(()=>!!document.getElementById('adPass')),close=async()=>{await p.evaluate(()=>{const d=document.getElementById('adPass');if(d)d.remove();document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}})};
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2500);
  chk(!(await has()),'ao abrir o jogo NÃO aparece mais');
  await p.click('#mRank');await p.waitForTimeout(1500);chk(await has(),'apertou BATALHA E AVENTURA: aparece');await p.screenshot({path:SH+'batalha.png'});
  chk((await p.evaluate(()=>document.querySelector('#adPass .adImg').href))==='https://wa.me/qr/IHVWQJZE5C73L1','link do WhatsApp');await close();
  await p.evaluate(()=>__vw.rkView('menu'));await p.waitForTimeout(300);await p.evaluate(()=>document.getElementById('mRank').click());await p.waitForTimeout(1500);chk(await has(),'2ª vez em BATALHA E AVENTURA: aparece de novo');await close();
  await p.evaluate(()=>__vw.rkView('bp'));await p.waitForTimeout(1000);chk(await has(),'entrou no PASSE: aparece');await close();
  await p.evaluate(()=>__vw.rkView('menu'));await p.evaluate(()=>__vw.rkView('bp'));await p.waitForTimeout(1000);chk(!(await has()),'entrou no PASSE de novo: NÃO aparece (só 1 vez)');
  await p.evaluate(()=>{const c=document.querySelector('#rkWrap [data-b="info"][data-r="p"],#rkWrap [data-b="claim"][data-r="p"]');c&&c.click()});await p.waitForTimeout(900);chk(await has(),'tocou num prêmio PREMIUM sem ter o premium: aparece');await close();
  await p.evaluate(()=>{const c=document.querySelector('#rkWrap [data-b="code"]');c&&c.click()});await p.waitForTimeout(600);chk(await has(),'apertou 🎟️ CÓDIGO DO PREMIUM: aparece');await p.screenshot({path:SH+'premium.png'});await close();
  await p.evaluate(()=>{const {bpG,bpS}=window.__bp2;const o=bpG();o.own=2;bpS(o)});await p.evaluate(()=>__vw.rkView('bp'));await p.waitForTimeout(500);
  await p.evaluate(()=>{const c=document.querySelector('#rkWrap [data-b="info"][data-r="p"]');c&&c.click()});await p.waitForTimeout(900);chk(!(await has()),'quem JÁ TEM o premium: tocar no prêmio premium não abre anúncio');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
