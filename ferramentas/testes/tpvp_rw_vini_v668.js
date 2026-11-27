// v668: zera as recompensas de rank do PVP SÓ do Vini (1 vez)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const run=async nome=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.addInitScript(n=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:JSON.stringify(n),rk_pvp:JSON.stringify({t:0,d:0,s:0,rz:4,rw:[1,2,3,4,5,6,7,8],h:[]})})}},nome);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(3500);
  const r=await p.evaluate(()=>{const a=__vw.pvG().rw.slice();__vw.pvRwVini();return {a,flag:localStorage.rk_pvrwv668}});await p.close();return r};
let r=await run('Vini_junior10');chk(r.a.length===0&&r.flag==='1','Vini no Bronze: recompensas de rank zeradas (pode pegar de novo ao subir)');
r=await run('Bia');chk(r.a.length===8&&!r.flag,'outro jogador: nada muda');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
