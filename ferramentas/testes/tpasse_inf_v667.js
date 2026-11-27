// v667: missão infinita do passe (só passe pago): a cada 2 lutas = +125 XP, sem limite, até o nível 25
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{for(const id of ['rkModal','twModal'])try{__ev('rkModal')(null)}catch(e){}});
// grátis: trancado
let r=await p.evaluate(()=>{const o=__vw.bpG();o.own=0;o.xp=0;localStorage.rk_bp=JSON.stringify(o);__vw.bpAdd('fights',6);__vw.bpMis();const s=document.querySelector('.bpInf');return {t:s&&s.textContent,btn:!!document.getElementById('bpInfB')}});
chk(r.t&&/SÓ PASSE PAGO/.test(r.t)&&!r.btn,'passe grátis: missão infinita aparece trancada');
// pago: libera, conta só a partir de agora
r=await p.evaluate(()=>{const o=__vw.bpG();o.own=1;o.xp=0;delete o.ifb;localStorage.rk_bp=JSON.stringify(o);__vw.bpMis();const a=__vw.bpInf();__vw.bpAdd('fights',5);__vw.bpMis();const b=__vw.bpInf();const t=document.querySelector('.bpInf').textContent;
  document.getElementById('bpInfB').click();const c=__vw.bpInf(),xp=__vw.bpG().xp;return {a,b,t,c,xp}});
console.log(JSON.stringify(r));
chk(r.a.f===0,'lutas antigas não contam (começa do zero ao liberar)');
chk(r.b.k===2&&/PEGAR TUDO|2 prontas/.test(r.t),'5 lutas = 2 prontas');
chk(r.xp===250&&r.c.k===0&&r.c.r===1,'PEGAR TUDO: +250 XP (1 nível), sobra 1 luta para a próxima');
await p.evaluate(()=>{const a=document.getElementById('adPass');if(a)a.remove()});await p.waitForTimeout(1200);await p.screenshot({path:'/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/passe_inf.png'});
// sem limite até o 25
r=await p.evaluate(()=>{__vw.bpAdd('fights',400);__vw.bpMis();document.getElementById('bpInfB').click();const o=__vw.bpG();__vw.bpMis();return {lv:__vw.bpLv(),xp:o.xp,sobra:__vw.bpInf().k,txt:document.querySelector('.bpInf').textContent,btn:!!document.getElementById('bpInfB')}});
console.log(JSON.stringify(r));
chk(r.lv===25&&r.xp>=6250&&r.xp<6250+125,'repete sem limite até o nível 25 e para ali (não gasta lutas à toa)');
chk(/COMPLETO/.test(r.txt)&&!r.btn,'passe completo: mostra COMPLETO');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
