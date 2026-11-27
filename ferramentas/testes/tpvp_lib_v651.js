// v651: Ranqueada PVP bloqueada até 27/11 11:00 (Brasília); depois libera
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(2500);
const view=async t=>{await p.evaluate(t=>{const R=Date.now;window.__RN=window.__RN||R;Date.now=()=>t;document.querySelectorAll('#adPass,#t1W').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__vw.rkView('pvp')},t);await p.waitForTimeout(800)};
await view(Date.parse('2026-11-27T13:20:00Z'));const a=await p.evaluate(async()=>{await __ev('pvSearch()');return {lib:__vw.pvLibOn(),aviso:(document.querySelector('.rk_pvp .pvLib')||{}).innerText||'',toast:(document.getElementById('rkToast')||{}).innerText||''}});
console.log(JSON.stringify(a));chk(!a.lib&&/11:00/.test(a.aviso)&&/40 min/.test(a.aviso),'10:20: bloqueado, aviso "abre às 11:00 · falta 40 min"');chk(/abre HOJE/.test(a.toast),'Buscar Partida antes das 11h: aviso, não procura');
await p.screenshot({path:__dirname+'/shots/t651_bloq.png'});
await view(Date.parse('2026-11-27T14:00:30Z'));const c=await p.evaluate(()=>({lib:__vw.pvLibOn(),aviso:!!document.querySelector('.rk_pvp .pvLib')}));chk(c.lib&&!c.aviso,'11:00: liberado');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
