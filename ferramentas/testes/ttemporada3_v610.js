// v610: TEMPORADA 3 da Ranqueada ao meio-dia (rp zera, recompensas de rank de novo, ranking rp3), prêmios/títulos da T2, O PÁSSARO DE HERMES (10 primeiros + Honrado sem número), contagem da invocação 12:30
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';const U='http://localhost:8790';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
/* ranking da T2 no servidor (antes do meio-dia) */
const post=async(f)=>{const r=await fetch(U+'/fs/v1/projects/x/databases/(default)/documents/torre?key=k',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(e=>null);return r&&r.status};
const IV=v=>({integerValue:String(v)}),SV=v=>({stringValue:v});
const page=async(t,o)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.clock.install({time:t});
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},Object.assign({rk_ini:'1',rk_xpv2:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',rk_own:'["goku"]',rk_gem:'0',rk_tic:'0'},o));
  await p.goto(U+'/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);return p};
/* semeia o ranking da T2 pela própria página (usa a mesma URL do jogo) */
let p=await page(Date.UTC(2026,10,22,14,0),{tw_nome:'"Semente"'});
await p.evaluate(async()=>{const IV=v=>({integerValue:String(v)}),SV=v=>({stringValue:v});for(const [n,u,rp] of [['Bia','uBia',9000],['Ana','uAna',7000],['Caio','uCaio',5000],['Duda','uDuda',100]])await fetch(location.origin+'/fs/v1/projects/furia-do-templo/databases/(default)/documents/torre?key=k',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{nome:SV(n),uid:SV(u),rk:SV('1'),s:SV('2'),rp2:IV(rp),andar:IV(0),tempo:IV(0)}})})}).catch(e=>console.log('seed',e.message));
await p.close();
/* antes do meio-dia: nada muda */
p=await page(Date.UTC(2026,10,22,14,50),{tw_nome:'"Bia"',rk_rp:'9000'});
const a0=await p.evaluate(()=>({rp:+localStorage.rk_rp,f:__t3.S2F().rp}));chk(a0.rp===9000&&a0.f==='rp2','11:50: temporada 2 ainda valendo (rp 9000, campo rp2) '+JSON.stringify(a0));
await p.screenshot({path:SH+'t3_contagem.png'});const cd=await p.evaluate(()=>{const e=document.getElementById('alCdT');return e&&e.textContent});chk(/ALUCARD ABRE EM/.test(cd||''),'contagem regressiva da invocação na tela de início ('+cd+')');await p.close();
/* depois do meio-dia: Bia (1ª) */
p=await page(Date.UTC(2026,10,22,15,5),{tw_nome:'"Bia"',rk_rp:'9000',tw_uid:'"uBia"',rk_rwc2:'[1,2,3,4]'});
const a1=await p.evaluate(()=>({rp:+localStorage.rk_rp,old:+localStorage.rk_rpS2,f:__t3.S2F().rp,rw:JSON.parse(localStorage.rk_rwc2||'[]')}));
chk(a1.rp===0&&a1.old===9000&&a1.f==='rp3','12:05: ranqueada ZERADA (rp 0, guardado 9000, ranking rp3) '+JSON.stringify(a1));chk(!a1.rw.length,'recompensas de rank podem ser pegas de novo');
await p.click('#mRank');await p.waitForTimeout(5500);await p.screenshot({path:SH+'t3_fim_t2.png'});
const a2=await p.evaluate(()=>({tit:JSON.parse(localStorage.tw_tit||'[]'),gem:+localStorage.rk_gem}));chk(a2.tit.includes('t2c')&&a2.gem>=15000,'1º da T2: título CAMPEÃO DA TEMPORADA 2 + 15.000 💎 ('+a2.tit.join(',')+')');
/* Pássaro de Hermes */
const h1=await p.evaluate(async()=>{localStorage.rk_own='["goku","alucard"]';await __t3.hmTitClaim(0);return JSON.parse(localStorage.tw_tit).filter(k=>/^hm/.test(k))});chk(h1.includes('hm1'),'1º a pegar o Alucard: O PÁSSARO DE HERMES Nº1 ('+h1+')');
const tt=await p.evaluate(()=>__t3.tit('hm1')+__t3.tit('hm0')+__t3.tit('t2c'));await p.setContent('<div style="background:#111;padding:30px;font-size:22px;display:flex;flex-direction:column;gap:22px;align-items:flex-start">'+tt+'</div>').catch(()=>{});await p.close();
p=await page(Date.UTC(2026,10,22,15,6),{tw_nome:'"Ana"',tw_uid:'"uAna"',rk_rp:'7000',rk_own:'["goku","alucard"]'});
const h2=await p.evaluate(async()=>{await __t3.hmTitClaim(0);return JSON.parse(localStorage.tw_tit||'[]').filter(k=>/^hm/.test(k))});chk(h2.includes('hm2'),'2º a pegar o Alucard: Nº2 ('+h2+')');await p.close();
p=await page(Date.UTC(2026,10,22,15,7),{tw_nome:'"Honrado"',tw_uid:'"mwc8atkrgg4fns2f"',rk_own:'["goku"]'});
await p.click('#mRank');await p.waitForTimeout(4500);const h3=await p.evaluate(()=>JSON.parse(localStorage.tw_tit||'[]').filter(k=>/^hm/.test(k)));chk(h3.length===1&&h3[0]==='hm0','Honrado: O PÁSSARO DE HERMES sem número ('+h3+')');
await p.evaluate(()=>{document.querySelectorAll('.rkWin').forEach(e=>e.remove())});
const h4=await p.evaluate(async()=>{localStorage.rk_own='["goku","alucard"]';await __t3.hmTitClaim(0);return JSON.parse(localStorage.tw_tit||'[]').filter(k=>/^hm/.test(k))});chk(h4.length===1,'Honrado pegando o Alucard não ocupa vaga dos 10');await p.close();
p=await b.newPage();await p.setContent('<html><body style="background:#111;padding:20px"><div id="x"></div></body></html>');
console.log(E.length?'ERROS '+E.slice(0,5).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
