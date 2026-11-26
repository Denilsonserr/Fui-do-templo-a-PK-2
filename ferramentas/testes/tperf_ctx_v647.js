// v647: qual chamada de desenho (canvas) gasta mais na luta — tempo por método + com sombra(shadowBlur)/filtro/composição, e quem chamou
const {chromium}=require('playwright');const LV=+(process.env.LV||1);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:800,height:360},deviceScaleFactor:2});const p=await ctx.newPage();await p.route(/fonts\.g|firestore|googleapis|\/fs\//,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now())})}
  const P=CanvasRenderingContext2D.prototype,T=window.__CT={},C=window.__CC={};window.__CON=0;
  for(const m of ['drawImage','fill','fillRect','stroke','fillText','strokeText','arc','clip','putImageData','getImageData','createLinearGradient','createRadialGradient','createPattern','clearRect','strokeRect','ellipse','roundRect']){const o=P[m];if(!o)continue;P[m]=function(){if(!window.__CON)return o.apply(this,arguments);const t=performance.now();const r=o.apply(this,arguments);const d=performance.now()-t;
    let k=m+(this.shadowBlur>0?' +sombra':'')+(this.filter&&this.filter!=='none'?' +filtro('+String(this.filter).slice(0,18)+')':'')+(this.globalCompositeOperation!=='source-over'?' +'+this.globalCompositeOperation:'')+(this.canvas===document.querySelector('canvas')?'':' [off]');
    T[k]=(T[k]||0)+d;if(d>0.3){let s=(new Error().stack||'').split('\n')[2]||'';s=s.replace(/^\s*at\s*/,'').replace(/\(?https?:\/\/[^)]*:(\d+):\d+\)?/,':$1').slice(0,40);const kk=k+' ← '+s;C[kk]=(C[kk]||0)+d}return r}}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>{localStorage.removeItem('rk_tnrun');__tb2.go()});await p.waitForFunction(()=>{const G=__tb2.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});
await p.evaluate(lv=>{setInterval(()=>{const G=__tb2.G();const q=G.p[0];q.hp=q.mhp;const o=G.p[1];if(o&&o.hp<o.mhp*.3)o.hp=o.mhp},300);__pvT.setQ(lv)},LV);await p.waitForTimeout(2000);
const r=await p.evaluate(()=>new Promise(res=>{window.__CON=1;let n=0;const t0=performance.now();const f=()=>{n++;if(performance.now()-t0<5000)requestAnimationFrame(f);else{window.__CON=0;res({n,T:__CT,C:__CC})}};requestAnimationFrame(f)}));
const pr=(o,k)=>Object.entries(o).sort((a,c)=>c[1]-a[1]).slice(0,k).map(([a,v])=>(v/r.n).toFixed(2)+' ms/quadro  '+a).join('\n  ');
console.log('quadros',r.n,'\nPOR MÉTODO:\n  '+pr(r.T,20)+'\nQUEM CHAMA (chamadas >0.3ms):\n  '+pr(r.C,30));await b.close()})();
