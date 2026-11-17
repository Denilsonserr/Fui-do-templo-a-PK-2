// v502: tela "Gire o celular" com botão GIRAR A TELA, ajuda e Abrir no Chrome
const {chromium,devices}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t502_';
(async()=>{const b=await chromium.launch();let ok=1;const errs=[];const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const run=async(nm,ua,fn)=>{const c=await b.newContext(Object.assign({},devices['Pixel 7'],ua?{userAgent:ua}:{}));const p=await c.newPage();p.on('pageerror',e=>errs.push(nm+': '+e.message));await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\/v1\//,r=>r.fulfill({status:200,body:'[]'}));
  await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(6000);await fn(p);await c.close()};
await run('chrome',null,async p=>{const r=await p.evaluate(()=>{const R=document.getElementById('rotate');return {vis:getComputedStyle(R).display,btn:!!R.querySelector('.rtB'),chr:!!R.querySelector('.rtC'),help:getComputedStyle(R.querySelector('.rtT')).display}});
  chk(r.vis==='flex'&&r.btn&&!r.chr,'Chrome em pé: tela aparece com o botão GIRAR (sem Abrir no Chrome)');chk(r.help==='none','ajuda escondida antes de tentar');
  await p.screenshot({path:SH+'chrome.png'});await p.tap('#rotate .rtB');await p.waitForTimeout(1800);
  const h=await p.evaluate(()=>getComputedStyle(document.querySelector('#rotate .rtT')).display);chk(h==='block','não girou → mostra a ajuda');await p.screenshot({path:SH+'ajuda.png'})});
await run('whats',devices['Pixel 7'].userAgent.replace(')','; wv)')+' WhatsApp/2.24',async p=>{const r=await p.evaluate(()=>{const R=document.getElementById('rotate');const a=R.querySelector('.rtC');return {href:a&&a.href,help:getComputedStyle(R.querySelector('.rtT')).display}});
  chk(/^intent:\/\/localhost:8790\/index\.html#Intent;scheme=https;package=com\.android\.chrome;end$/.test(r.href||''),'WhatsApp: botão Abrir no Chrome '+r.href);chk(r.help==='block','WhatsApp: ajuda já aparece');await p.screenshot({path:SH+'whats.png'})});
await run('iphone',devices['iPhone 13'].userAgent,async p=>{const t=await p.evaluate(()=>document.querySelector('#rotate .rtT').textContent);chk(/cadeado/.test(t),'iPhone: ensina a desligar o cadeado')});
chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
