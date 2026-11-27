// v654: Torre — terminou o andar: animação → escolhe passiva → volta para a tela da Torre → toca "PRÓXIMO ANDAR" → próximo andar. Também o caso travado e o CONTINUAR.
const {chromium}=require('playwright');const SH=__dirname+'/shots/t654_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const fight=async()=>{await p.waitForFunction(()=>{const G=__tb2.G(),T=__tb2.TN();return G.mode==='fight'&&G.phase==='fight'&&T.on&&T.ph==='boss'},null,{timeout:90000});await p.waitForTimeout(600)};
const keep=()=>p.evaluate(()=>{const P=__tb2.G().p[0];P.hp=P.mhp});
await p.evaluate(()=>{localStorage.removeItem('rk_tnrun');document.querySelectorAll('#adPass').forEach(x=>x.remove());__tb2.go()});await fight();
const g0=await p.evaluate(()=>__tb2.TN().g);
// 1) mata o chefe de verdade
await p.evaluate(()=>{const G=__tb2.G(),B=__tb2.TN().boss||G.p[1];B.hp=1;B.inv=0;B.state='idle';__vw.applyHit(G.p[0],B,{dmg:999999,kb:2,hs:4,px:B.x,py:B.y-120,kind:'melee',lock:1})});
await p.waitForTimeout(1000);chk(await p.evaluate(()=>!!document.getElementById('tnWin')),'matou: animação ANDAR CONQUISTADO na tela');await p.screenshot({path:SH+'anim.png'});
await p.waitForFunction(()=>{const M=document.getElementById('tnPick');return M&&M.classList.contains('on')},null,{timeout:8000}).catch(()=>0);await p.screenshot({path:SH+'passiva.png'});
chk(await p.evaluate(()=>{const M=document.getElementById('tnPick');return !!(M&&M.classList.contains('on'))}),'aparece a escolha da passiva');
await p.evaluate(()=>document.querySelector('#tnPick .tnC').click());await p.waitForTimeout(3500);
let s=await p.evaluate(()=>({mode:__tb2.G().mode,g:__tb2.TN().g,win:!!document.getElementById('tnWin'),nx:(document.querySelector('#twGo .tnNx')||{}).textContent||'',pulse:document.getElementById('twGo').classList.contains('tnNext')}));console.log(JSON.stringify(s));
chk(s.mode==='tower'&&s.g===g0+1&&!s.win,'escolheu: voltou para a TELA DA TORRE (andar salvo)');chk(s.pulse&&/PRÓXIMO ANDAR/.test(s.nx),'botão pulsando "PRÓXIMO ANDAR"');await p.screenshot({path:SH+'torre.png'});
// 2) toca no botão → próximo andar
await p.evaluate(()=>document.getElementById('twGo').click());await fight();s=await p.evaluate(()=>({g:__tb2.TN().g,mode:__tb2.G().mode}));chk(s.mode==='fight'&&s.g===g0+1,'tocou: entrou no próximo andar');
// 3) caso travado: chefe com vida 0 sem morrer → em ~1 s conta como vencido
await p.evaluate(()=>{const G=__tb2.G(),B=__tb2.TN().boss||G.p[1];B.hp=0;B.ko=false});for(let i=0;i<3;i++){await keep();await p.waitForTimeout(700)}
chk(await p.evaluate(()=>!!document.getElementById('tnWin')&&__tb2.TN().ph==='clear'),'travado (vida 0 sem morrer): em ~1 s contou como vencido + animação');
// 4) não escolhe nada: CONTINUAR em 6 s volta para a Torre
await p.evaluate(()=>{const M=document.getElementById('tnPick');if(M){M.className='';M.innerHTML=''}});await p.waitForTimeout(6500);
const vis=await p.evaluate(()=>{const b=document.getElementById('tnWinGo');return !!b&&!b.hidden});chk(vis,'6 s sem escolher: aparece CONTINUAR');await p.evaluate(()=>document.getElementById('tnWinGo')&&document.getElementById('tnWinGo').click());await p.waitForTimeout(2000);
s=await p.evaluate(()=>({mode:__tb2.G().mode,g:__tb2.TN().g}));chk(s.mode==='tower'&&s.g===g0+2,'CONTINUAR: voltou para a Torre, andar conta');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
