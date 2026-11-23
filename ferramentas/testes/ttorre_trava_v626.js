// v626: torre nunca fica parada sem inimigo (boss que não carrega / boss perdido / andar parado)
const {chromium}=require('playwright');const SH=__dirname+'/shots/t626_';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',rk_own:'["goku"]',rk_sel:'"goku"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const start=async()=>{await p.evaluate(()=>{localStorage.removeItem('rk_tnrun');const m=document.getElementById('twModal');if(m){m.hidden=true;m.innerHTML=''}__tb2.go()});await p.waitForFunction(()=>{const G=__tb2.G(),T=__tb2.TN();return G.mode==='fight'&&G.phase==='fight'&&T.on},null,{timeout:60000});await p.waitForTimeout(800)};
const keep=()=>p.evaluate(()=>{const P=__tb2.G().p[0];P.hp=P.mhp});
// A) boss vivo FORA DO MAPA (o jogador anda e não acha ninguém)
await start();
await p.evaluate(()=>{const T=__tb2.TN();T.boss.x=-3000;T.boss.vx=0});
for(let i=0;i<5;i++){await keep();await p.waitForTimeout(1000)}
let s=await p.evaluate(()=>{const T=__tb2.TN(),G=__tb2.G();return {ph:T.ph,x:Math.round(T.boss.x),px:Math.round(G.p[0].x),same:G.p[1]===T.boss}});console.log(JSON.stringify(s));
chk(s.ph==='boss'&&s.same&&s.x>0&&Math.abs(s.x-s.px)<900,'A) boss fora do mapa voltou para perto do jogador');await p.screenshot({path:SH+'A.png'});
// B) boss "perdido" (some da luta, placeholder no lugar)
await p.evaluate(()=>{const T=__tb2.TN(),G=__tb2.G();const B=T.boss;B.x=-5000;G.p[1]=__tn.tnPh('👑')});
for(let i=0;i<8;i++){await keep();await p.waitForTimeout(1000)}
s=await p.evaluate(()=>{const T=__tb2.TN(),G=__tb2.G();return {ph:T.ph,same:G.p[1]===T.boss,x:Math.round(G.p[1].x),px:Math.round(G.p[0].x)}});console.log(JSON.stringify(s));chk(s.same&&s.x>0&&Math.abs(s.x-s.px)<900,'B) boss perdido voltou para perto do jogador');
// C) andar parado: boss morto sem passar de fase e sem vigia antigo resolver
await p.evaluate(()=>{const T=__tb2.TN(),G=__tb2.G();T.ph='x_parado';T.boss=null;G.p[1]=__tn.tnPh('...');T.mobs=[]});const gC=await p.evaluate(()=>__tb2.TN().g);
for(let i=0;i<16;i++){await keep();await p.waitForTimeout(1000)}
s=await p.evaluate(()=>{const T=__tb2.TN(),G=__tb2.G();return {g:T.g,mode:G.mode,on:T.on}});console.log(JSON.stringify(s));chk(s.g===gC+1&&s.mode==='tower','C) andar parado sem inimigo: contou como vencido e foi para o próximo andar');
await p.screenshot({path:SH+'C.png'});
// D) fluxo normal continua: o próximo andar começa e anda
await p.evaluate(()=>__tb2.go());await p.waitForFunction(()=>{const G=__tb2.G(),T=__tb2.TN();return G.mode==='fight'&&G.phase==='fight'&&T.on},null,{timeout:60000});
for(let i=0;i<5;i++){await keep();await p.waitForTimeout(1000)}s=await p.evaluate(()=>({g:__tb2.TN().g,on:__tb2.TN().on,mode:__tb2.G().mode}));chk(s.on&&s.mode==='fight'&&s.g===gC+1,'D) próximo andar começa normal e não é pulado à toa');
console.log(E.length?'ERROS '+E.slice(0,5).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
