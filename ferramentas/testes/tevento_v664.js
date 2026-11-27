// v664: 2x XP na ranqueada + 2x drop, SEM mexer no PVP
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const r=await p.evaluate(()=>{const e=__pvT.ev();const step=()=>{const o={t:3,s:2,p:40,d:0};const x=__pvT.pvStep(o,true);return JSON.stringify([o.t,o.s,o.p,x&&x.gain])};
  const a=step();const now=Date.now;Date.now=()=>Date.UTC(2026,11,5);const fora={ev:__pvT.ev(),dk:__pvT.dropK(),m:__pvT.m()};const b2=step();Date.now=now;
  return {nm:e&&e[3],x:e&&e[2],m:__pvT.m(),dk:__pvT.dropK(),ev2x:__pvT.ev2x(),pvp:a,pvpFora:b2,fora}});
console.log(JSON.stringify(r));
chk(r.nm&&/2x XP NA RANQUEADA/.test(r.nm)&&r.x===2,'evento ativo agora: 2x XP na ranqueada');
chk(r.m[2]===2&&Math.abs(r.dk-r.fora.dk*2)<1e-9,'2x drop: drop dos chefes x2 e dos portais x2 ('+r.fora.dk+' → '+r.dk+')');
chk(!r.ev2x,'janela de estrelas em dobro do PVP desligada');
chk(r.pvp===r.pvpFora,'PVP: vitória dá exatamente o mesmo com e sem evento '+r.pvp);
chk(!r.fora.ev&&r.fora.m[2]===1,'depois de 29/11 23:59 o evento acaba sozinho');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
