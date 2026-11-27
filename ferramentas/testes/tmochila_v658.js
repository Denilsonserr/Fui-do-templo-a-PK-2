// v658: mochila mais leve — tocar item troca só o detalhe, EQUIPAR funciona, ✕ fecha qualquer janela, animação de trás pausa
const {chromium}=require('playwright');const SH=__dirname+'/shots/t658_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:1})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>{for(let i=0;i<40;i++){const E=__ev('TWEQ')[i%__ev('TWEQ').length];__ev('twAddItem')(E,__ev('twEqRoll')())}});
await p.click('#mRank');await p.waitForTimeout(2500);await p.evaluate(()=>{document.querySelectorAll('#adPass,#t1W').forEach(x=>x.remove());__ev('rkModal(null)');__ev("rkEquip('all')")});await p.waitForTimeout(600);
let r=await p.evaluate(()=>({x:!!document.querySelector('#rkModal .rkMdX'),pause:document.body.classList.contains('rkMdOn'),n:document.querySelectorAll('#rkModal .eqI').length}));chk(r.x&&r.pause&&r.n>0,'mochila aberta: tem ✕ no canto e a tela de trás pausa ('+r.n+' itens)');
const g0=await p.evaluate(()=>{const G=document.querySelector('#rkModal .eqG');G.dataset.t='x';return 1});
await p.evaluate(()=>document.querySelectorAll('#rkModal .eqI')[2].click());await p.waitForTimeout(300);
r=await p.evaluate(()=>({same:document.querySelector('#rkModal .eqG').dataset.t==='x',sel:document.querySelectorAll('#rkModal .eqI.sel').length,det:!!document.querySelector('#rkModal .eqD button[data-d="eq"]')}));chk(r.same&&r.sel===1&&r.det,'tocar item: só troca o detalhe (a lista não é refeita), 1 selecionado');
await p.evaluate(()=>document.querySelectorAll('#rkModal .eqI')[4].click());await p.waitForTimeout(300);const k=await p.evaluate(()=>document.querySelector('#rkModal .eqI.sel').dataset.k);
await p.evaluate(()=>document.querySelector('#rkModal .eqD button[data-d="eq"]').click());await p.waitForTimeout(500);
r=await p.evaluate(()=>({eq:Object.values(JSON.parse(localStorage.tw_eqp||'{}')).filter(Boolean).length,open:!document.getElementById('rkModal').hidden}));chk(r.eq>=1&&r.open,'EQUIPAR funciona depois de trocar o item');await p.screenshot({path:SH+'mochila.png'});
await p.evaluate(()=>document.querySelector('#rkModal .rkMdX').click());await p.waitForTimeout(400);r=await p.evaluate(()=>({h:document.getElementById('rkModal').hidden,pause:document.body.classList.contains('rkMdOn')}));chk(r.h&&!r.pause,'✕ fecha a mochila e a tela de trás volta a animar');
await p.evaluate(()=>__ev("rkModal('<div class=\"twM\"><h3>TESTE</h3><p>janela sem botão de fechar</p></div>')"));await p.waitForTimeout(300);await p.evaluate(()=>document.querySelector('#rkModal .rkMdX').click());await p.waitForTimeout(300);
chk(await p.evaluate(()=>document.getElementById('rkModal').hidden),'janela sem botão de fechar: o ✕ fecha');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
