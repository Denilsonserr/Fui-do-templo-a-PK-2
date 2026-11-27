// v662: PVP 1 contra 1 (meu 1º x o MAIS FORTE da sombra) com 11 barras; matou 1 = venceu
const {chromium}=require('playwright');const SH=__dirname+'/shots/t662_';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Breno"',rk_ini:'1',rk_xpv2:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku","vegeta","naruto"]',rk_pvt:'["vegeta","goku","naruto"]'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__vw.pvStart({acc:'zz',nome:'SOMBRA',ch:'goku',team:[{ch:'goku',s:{tdm:1.2},p:{},lv:5},{ch:'alucard',s:{tdm:6,tdf:.5,tcr:40},p:{},lv:60},{ch:'naruto',s:{tdm:2},p:{},lv:20}],tit:''},false));
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const G=__dbg.G;return {teams:G.teams&&G.teams.map(t=>t.join(',')),me:G.p[0].def.id,op:G.p[1].def.id,mhp:G.p[0].mhp,MAX:__vw.MAXHP()}});console.log(JSON.stringify(r));
chk(r.teams&&r.teams[0]==='vegeta'&&r.teams[1]==='alucard','1 contra 1: meu 1º (Vegeta) contra o MAIS FORTE da sombra (Alucard)');chk(r.me==='vegeta'&&r.op==='alucard','na arena: Vegeta x Alucard');chk(r.mhp===19800,'11 barras de vida (19.800)');
await p.screenshot({path:SH+'luta.png'});
await p.evaluate(()=>{const G=__dbg.G,o=G.p[1];o.hp=1;G.koWinner=0;o.ko=true;__ev('endRound')()});await p.waitForTimeout(2500);
const e=await p.evaluate(()=>({mode:__dbg.G.mode,fight:!!__ev('PV.fight'),txt:(document.getElementById('rkModal')||{}).innerText||''}));console.log(JSON.stringify(e).slice(0,200));chk(e.mode!=='fight'||/VIT|venceu|GANH/i.test(e.txt),'derrubou 1 = acabou a luta (sem próximo personagem)');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
