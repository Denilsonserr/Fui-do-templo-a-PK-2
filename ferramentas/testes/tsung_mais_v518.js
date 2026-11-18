// v518: "+" do sistema do Sung não redesenha a tela; muitos toques rápidos não travam; segurar o "+" distribui rápido
const {chromium,devices}=require('playwright');
const SJ={"lv":89,"xp":10,"pts":440,"cls":"necro","sh":["tank","igris"],"eq":"igris","ms":{},"cnt":{"w":365,"ult":195},"d":{},"dc":{},"st":{"for":10,"vit":10,"agi":10,"per":10,"int":10},"shl":{},"rsN":7};
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const c=await b.newContext(Object.assign({},devices['Pixel 7'],{viewport:{width:915,height:412}}));const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\/v1\//,r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await p.addInitScript(sj=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","sung"]',rk_sel:'"sung"',tw_nome:'"Teste"',tw_uid:'"u_h"',rk_sjs:JSON.stringify(sj),rk_urso:'1'})}},SJ);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
  await p.evaluate(()=>{document.querySelectorAll('#leiCl').forEach(x=>x.remove());__pvT.sjo()});const s=await c.newCDPSession(p);await s.send('Emulation.setCPUThrottlingRate',{rate:8});
  const W0=await p.evaluate(()=>{window.__w=document.querySelector('#sjSys .sjW');return 1});
  const t0=Date.now();for(let i=0;i<60;i++)await p.tap('#sjSys .sjPl[data-k="for"]');const dt=Date.now()-t0;
  const r=await p.evaluate(()=>{const o=JSON.parse(localStorage.rk_sjs);return {for:o.st.for,pts:o.pts,tela:document.querySelector('#sjSys [data-v="for"]').textContent,pt:document.querySelector('#sjSys [data-v="pts"]').textContent,mesma:window.__w===document.querySelector('#sjSys .sjW')}});
  console.log(JSON.stringify(r),'60 toques em',dt,'ms');chk(r.for===70&&r.pts===380&&r.tela==='70'&&r.pt==='380','60 toques = +60 força, tela certa');chk(r.mesma,'a tela não é redesenhada a cada toque');
  await s.send('Emulation.setCPUThrottlingRate',{rate:1});
  const B=await p.$('#sjSys .sjPl[data-k="vit"]');const bb=await B.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(3000);await p.mouse.up();await p.waitForTimeout(300);
  const h=await p.evaluate(()=>JSON.parse(localStorage.rk_sjs));console.log('segurando 3 s: vit',h.st.vit,'pts',h.pts);chk(h.st.vit>40&&h.st.vit+h.st.for+h.pts===10+70+380,'segurar o + distribui rápido sem perder ponto');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
