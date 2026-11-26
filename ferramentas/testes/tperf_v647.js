// v647: mede desempenho num "celular fraco" (CPU 6x mais lenta, tela dpr 2): menu, luta em cada gráfico + perfil de CPU (funções que mais gastam)
const {chromium}=require('playwright');const fs=require('fs');const RATE=+process.env.RATE||6,OUT=process.env.OUT||'';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:800,height:360},deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs|\/fs\//,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
const cdp=await ctx.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:RATE});
const fps=(s=4)=>p.evaluate(s=>new Promise(res=>{let n=0,mx=0,last=performance.now(),slow=0;const t0=last;const f=t=>{n++;const d=t-last;mx=Math.max(mx,d);if(d>50)slow++;last=t;if(t-t0<s*1000)requestAnimationFrame(f);else res({fps:Math.round(n/s),pior:Math.round(mx),travadas:slow})};requestAnimationFrame(f)}),s);
const R={};
R.menu=await fps();console.log('MENU INICIAL',JSON.stringify(R.menu));
const prof=async(nm)=>{await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:500});await cdp.send('Profiler.start');await p.waitForTimeout(4000);const {profile}=await cdp.send('Profiler.stop');
  const self={},byId={};for(const n of profile.nodes)byId[n.id]=n;const dt=profile.timeDeltas;const cnt={};profile.samples.forEach((id,i)=>{cnt[id]=(cnt[id]||0)+(dt[i]||0)});let tot=0;
  for(const [id,t] of Object.entries(cnt)){const n=byId[id],cf=n.callFrame;const k=(cf.functionName||'(anon)')+' :'+(cf.lineNumber+1)+(cf.url.includes('index')?'':' '+cf.url.slice(-20));self[k]=(self[k]||0)+t;tot+=t}
  const top=Object.entries(self).sort((a,c)=>c[1]-a[1]).slice(0,22).map(([k,t])=>(t/tot*100).toFixed(1)+'% '+k);console.log('PERFIL '+nm+':\n  '+top.join('\n  '));return top};
R.pmenu=await prof('menu');
await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
await p.evaluate(()=>{localStorage.removeItem('rk_tnrun');document.querySelectorAll('#adPass').forEach(x=>x.remove());__tb2.go()});await p.waitForFunction(()=>{const G=__tb2.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});
await p.evaluate(()=>{setInterval(()=>{const G=__tb2.G();const q=G.p[0];q.hp=q.mhp;const o=G.p[1];if(o&&o.hp<o.mhp*.3)o.hp=o.mhp},300)});
await cdp.send('Emulation.setCPUThrottlingRate',{rate:RATE});
for(const lv of [0,1,2,3,4]){await p.evaluate(lv=>{__pvT.setQ(lv)},lv);await p.waitForTimeout(2500);const r=await fps();r.canvas=await p.evaluate(()=>{const c=document.querySelector('canvas');return c.width+'x'+c.height});R['luta'+lv]=r;console.log('LUTA gráfico',lv,JSON.stringify(r))}
await p.evaluate(()=>__pvT.setQ(1));await p.waitForTimeout(2000);R.pluta=await prof('luta (Leve)');
if(OUT)fs.writeFileSync(OUT,JSON.stringify(R,null,1));console.log('ERROS',errs.slice(0,5));await b.close()})();
