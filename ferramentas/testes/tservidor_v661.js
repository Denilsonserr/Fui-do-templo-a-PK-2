// v661: servidor ocupado (503 / 429 "overloaded") → o jogo tenta de novo sozinho e NÃO trava 15 min; só a trava de gasto bloqueia
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
let n=0,modo='';await p.route(/:runQuery/,async r=>{n++;if(modo==='ocupado'&&n<=2)return r.fulfill({status:503,body:'{"error":{"code":503,"message":"ocupado"}}'});if(modo==='d1'&&n<=1)return r.fulfill({status:429,body:'{"error":{"message":"D1 DB is overloaded"}}'});if(modo==='trava')return r.fulfill({status:429,body:'{"error":{"message":"Quota exceeded. trava de gasto: limite"}}'});return r.continue()});
const q=v=>p.evaluate(async v=>{const r=await __ev('twFetchT')('/fs/v1/projects/x/databases/(default)/documents:runQuery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({structuredQuery:{where:{fieldFilter:{field:{fieldPath:'pvg'},op:'EQUAL',value:{stringValue:v}}},limit:3}})});return {st:r.status,blk:__ev('RKQ429')>Date.now()}},v);
modo='ocupado';n=0;let r=await q('a1');chk(r.st===200&&n===3&&!r.blk,'servidor ocupado 2x: tentou de novo sozinho e deu certo (3 tentativas), sem travar');
modo='d1';n=0;r=await q('a2');chk(r.st===200&&n===2&&!r.blk,'banco "overloaded" (429): tentou de novo e deu certo, sem bloquear 15 min');
modo='trava';n=0;r=await q('a3');chk(r.blk,'trava de gasto de verdade: aí sim bloqueia (como antes)');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
