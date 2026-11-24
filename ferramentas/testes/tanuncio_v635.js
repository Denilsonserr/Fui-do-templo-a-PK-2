// v635: anúncio do passe aparece ao abrir o jogo; tocar abre o WhatsApp; ✕ fecha
const {chromium}=require('playwright');const SH=__dirname+'/shots/t635_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const ctx=await b.newContext({viewport:{width:915,height:412}});const p=await ctx.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_own:'["goku"]'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
  chk(await p.evaluate(()=>!!document.getElementById('adPass')),'anúncio apareceu ao abrir o jogo');await p.screenshot({path:SH+'anuncio.png'});
  const href=await p.evaluate(()=>document.querySelector('#adPass .adImg').href);chk(href==='https://wa.me/qr/IHVWQJZE5C73L1','tocar na imagem vai para o WhatsApp');
  const [np]=await Promise.all([ctx.waitForEvent('page',{timeout:8000}).catch(()=>null),p.click('#adPass .adImg')]);chk(!!np,'clicou e abriu o link ('+(np?np.url().slice(0,40):'-')+')');await p.waitForTimeout(800);
  chk(await p.evaluate(()=>!document.getElementById('adPass')),'depois de clicar o anúncio some');
  await p.reload();await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);chk(await p.evaluate(()=>!!document.getElementById('adPass')),'abriu de novo: anúncio aparece de novo');
  await p.click('#adPass .adX');await p.waitForTimeout(500);chk(await p.evaluate(()=>!document.getElementById('adPass')),'✕ fecha');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
