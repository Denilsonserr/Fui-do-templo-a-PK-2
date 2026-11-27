// v620: PVP ranqueado com 5 barras de vida e bônus equilibrados (fraco x sombra muito forte)
const {chromium}=require('playwright');const SH=__dirname+'/shots/t620_';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const run=async(nome,S,mine)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
    await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Breno"',rk_ini:'1',rk_xpv2:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_lvrz:'1',rk_own:'["goku"]',rk_pvt:'["goku"]'})}});
    await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
    await p.evaluate(S=>__vw.pvStart({acc:'zz',nome:'FORTE',ch:'alucard',team:[{ch:'alucard',s:S,p:{}}],tit:''},false),S);
    await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);
    const r=await p.evaluate(()=>{const G=__dbg.G;window.__tm=G.timer;f=x=>({tdm:+x.tdm.toFixed(2),tdf:+x.tdf.toFixed(2),tcr:+(x.tcr||0).toFixed(1),tsp:+(x.tsp||1).toFixed(2),tls:x.tls||0,mhp:x.mhp,hp:Math.round(x.hp)});return {tm:Math.round(G.timer),me:f(G.p[0]),op:f(G.p[1]),MAXHP:__vw.MAXHP(),eq:__vw.pvEqInfo()}});
    await p.screenshot({path:SH+nome+'.png'});await p.close();return r};
  let r=await run('forte',{tdm:9,tdf:.12,tcr:90,tcd:100,tsp:1.6,tls:20});console.log(JSON.stringify(r));
  chk(r.MAXHP===14400&&r.me.mhp===14400&&r.op.mhp===14400&&r.op.hp===14400,'8 barras de vida para os dois (14400, v652)');
  const ratio=r.eq.P[1]/r.eq.P[0];chk(ratio<=1.61&&ratio>1,'a sombra forte continua mais forte, mas só '+ratio.toFixed(2)+'× (antes era ~'+(9/.12*1.9).toFixed(0)+'×)');
  chk(r.tm>150,'round de 3 minutos ('+r.tm+' s)');chk(r.op.tcr<=45,'crítico no máximo 45% ('+r.op.tcr+')');
  r=await run('igual',{tdm:1.3,tdf:.85,tcr:15});console.log(JSON.stringify(r));chk(r.eq.P[1]/r.eq.P[0]<1.3,'diferença pequena continua pequena');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
