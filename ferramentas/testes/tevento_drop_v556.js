// v556: drops ×0,6 (×1,2 no evento), evento 2x (XP, estrelas, anel), Beru se adapta à força
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Ze"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_own:'["goku","sung"]',rk_sel:'"sung"',rk_sjs:JSON.stringify({cls:'necro',lv:30,sh:['tank'],eq:'tank'})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const r=await p.evaluate(()=>{const o={t:0,d:0,s:0,w:0,l:0,sq:0,bt:0,bd:0};const st=__pvT.pvStep(o,true);const PT=__pvT.PTRK();return {k:__pvT.rkDropK(),ev:__pvT.ev2x(),x:__pvT.evX(),m:__pvT.m(),gain:st.gain,itS:PT[5].it}});
console.log(JSON.stringify(r));chk(r.ev&&Math.abs(r.k-1.2)<1e-9,'no evento: drop = 0,6 × 2 = 1,2');chk(r.x&&r.x[2]===2&&/2x DROP/.test(r.x[3]),'2x XP de rank');chk(r.m[3]>=2,'2x anel ('+r.m[3]+')');chk(r.gain===2,'2x estrelas');chk(Math.abs(r.itS-9*1.2)<1e-9,'portal: item S 9% → '+r.itS);
await p.clock.install({time:Date.UTC(2026,10,24,12,0)});await p.waitForTimeout(300);
const r2=await p.evaluate(()=>{const o={t:0,d:0,s:0,w:0,l:0,sq:0,bt:0,bd:0};const st=__pvT.pvStep(o,true);return {k:__pvT.rkDropK(),gain:st.gain,itS:__pvT.PTRK()[5].it}});
console.log(JSON.stringify(r2));chk(Math.abs(r2.k-.6)<1e-9&&r2.gain===1&&Math.abs(r2.itS-5.4)<1e-9,'depois do evento: drop ×0,6 e estrela normal');
console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
