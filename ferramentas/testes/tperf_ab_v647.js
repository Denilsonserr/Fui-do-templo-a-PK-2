// v647: comparação justa ANTES x DEPOIS das otimizações (mesma cena congelada, mesma resolução) — ms para desenhar 1 quadro em cada gráfico
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:800,height:360},deviceScaleFactor:2});const p=await ctx.newPage();await p.route(/fonts\.g|\/fs\//,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>{localStorage.removeItem('rk_tnrun');__tb2.go()});await p.waitForFunction(()=>__tb2.G().mode==='fight'&&__tb2.G().phase==='fight',null,{timeout:90000});await p.waitForTimeout(3000);
const R={};for(const lv of [0,1,2,3,4]){await p.evaluate(lv=>{__tb2.G().hold=0;__pvT.setQ(lv)},lv);await p.waitForTimeout(1200);
  const r=await p.evaluate(()=>{__ev('DYN.off=1');const G=__tb2.G();G.hold=1;const c=document.querySelector('canvas'),x=c.getContext('2d');const Rn=__ev('render');const f0=G.frame;const MR=Math.random;
    const run=off=>{window.__v647off=off;let best=1e9;for(let k=0;k<5;k++){const t=performance.now();for(let i=0;i<6;i++){let sd=7;Math.random=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};G.frame=f0;Rn();x.getImageData(0,0,1,1)}best=Math.min(best,(performance.now()-t)/6)}Math.random=MR;return best};
    const o=[run(1),run(0),run(1),run(0)];window.__v647off=0;return {antes:+Math.min(o[0],o[2]).toFixed(2),depois:+Math.min(o[1],o[3]).toFixed(2),canvas:c.width+'x'+c.height}});
  r.ganho=Math.round((1-r.depois/r.antes)*100)+'%';console.log('gráfico',lv,JSON.stringify(r))}
await b.close()})();
