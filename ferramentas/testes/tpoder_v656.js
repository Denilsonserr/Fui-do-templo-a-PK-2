// v656: PODER DE LUTA — conversão na luta (Boss, Torre, PVP), crítico no máx. 55%, painel com PL e textos dos itens em pontos
const {chromium}=require('playwright');const SH=__dirname+'/shots/t656_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',ft_q:'1',rk_own:'["goku","shaka"]',rk_sel:'"goku"',rk_pvt:'["goku"]'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
// fórmula
const f=await p.evaluate(()=>({sem:__vw.plFromPct('goku',false,{}),forte:__vw.plFromPct('shaka',false,{dano:1500,def:600,vel:300,crit:1178})}));console.log(JSON.stringify(f));
chk(f.sem.pl===6000&&f.sem.cc===5,'Goku (lendário) sem nada: 6.000 PL, crítico 5%');chk(f.forte.cc<=55&&f.forte.cc>50,'crítico 1178% vira poder crítico e chance '+f.forte.cc+'% (máx. 55%)');
// PVP contra sombra fortíssima
await p.evaluate(()=>__vw.pvStart({acc:'zz',nome:'FORTE',ch:'alucard',team:[{ch:'alucard',s:{tdm:20,tdf:.08,tcr:600,tcd:300,tsp:2.5,tls:40},p:{}}],tit:''},false));
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
let r=await p.evaluate(()=>{const [a,o]=__dbg.G.p;const s=x=>({pl:x.pl,tdm:+x.tdm.toFixed(2),tdf:+x.tdf.toFixed(2),tcr:+x.tcr.toFixed(1),tsp:+x.tsp.toFixed(2),tls:x.tls});return {me:s(a),op:s(o),vs:(document.getElementById('plVs')||{}).textContent}});console.log('PVP',JSON.stringify(r));
chk(r.op.pl>r.me.pl&&r.op.tcr<=55&&r.op.tls<=10&&r.op.tsp<=1.36&&r.op.tdm/r.me.tdm<2,'PVP: sombra com PL maior, mas sem absurdo (crit ≤55%, roubo ≤10%, vel ≤+35%)');chk(/PODER DE LUTA/.test(r.vs||''),'mostra o PL dos dois no começo');await p.screenshot({path:SH+'pvp.png'});
// Boss
await p.evaluate(()=>{__dbg.G.mode='menu';document.querySelectorAll('#adPass,#t1W').forEach(x=>x.remove());__vw.rkBossStart()});await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.gmode==='boss',null,{timeout:120000});await p.waitForTimeout(600);
r=await p.evaluate(()=>{const [a,o]=__dbg.G.p;return {me:[a.pl,+a.tdm.toFixed(2),+a.tcr.toFixed(1)],boss:[o.pl,+o.tdm.toFixed(2)]}});console.log('BOSS',JSON.stringify(r));chk(r.me[0]>0&&r.boss[0]>0&&r.me[2]<=55,'Boss: os dois com PL');
// Torre
await p.evaluate(()=>{__dbg.G.mode='menu';localStorage.removeItem('rk_tnrun');__tb2.go()});await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.gmode==='torre',null,{timeout:120000});await p.waitForTimeout(600);
r=await p.evaluate(()=>{const [a,o]=__dbg.G.p;return [a.pl,o.pl,+a.tdm.toFixed(2)]});console.log('TORRE',JSON.stringify(r));chk(r[0]>0&&r[1]>0,'Torre: os dois com PL');
// painel e texto de item
const t=await p.evaluate(()=>({rows:__ev('cbRows("shaka")'),it:__ev("rkItEf({t:'esp',v:70,crit:40,nm:'X',r:'sec'})")}));console.log(JSON.stringify(t));
chk(/PL$/.test(t.rows[0])&&/%/.test(t.rows[1]),'painel: Dano vira "⚡ N PL" e Crítico vira poder + chance');chk(/PL/.test(t.it)&&!/Ataque \+70%/.test(t.it),'texto do item: % virou pontos ('+t.it.slice(0,60)+')');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
