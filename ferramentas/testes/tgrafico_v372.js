// v372: mede o custo de cada modo gráfico (Leve / Ultra / 4K) numa luta (celular simulado: tela 3x, CPU 4x mais lenta)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:915,height:412},deviceScaleFactor:3});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.rv('ca')});await p.waitForTimeout(500);await p.click('[data-a="hySel"]',{force:true});await p.waitForTimeout(800);await p.click('[data-a="hyGo"]',{force:true});
await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});
await p.evaluate(()=>{setInterval(()=>{const q=__pvT.G().p[0];q.hp=q.mhp},300);__pvT.prof()});
const cdp=await ctx.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
for(const [lv,nm] of [[0,'LEVE'],[1,'ULTRA'],[2,'4K']]){await p.evaluate(lv=>{__pvT.setQ(lv);window.__T={}},lv);await p.waitForTimeout(1500);await p.evaluate(()=>{window.__T={}});
  const r=await p.evaluate(()=>new Promise(res=>{let n=0,mx=0,last=performance.now();const t0=last;const f=t=>{n++;mx=Math.max(mx,t-last);last=t;if(t-t0<4000)requestAnimationFrame(f);else res({fps:Math.round(n/4),pior:Math.round(mx),ms:Object.fromEntries(Object.entries(window.__T).map(([k,v])=>[k,Math.round(v/n*10)/10])),canvas:document.querySelector('canvas').width+'x'+document.querySelector('canvas').height,dyn:window.__dyn()})};requestAnimationFrame(f)}));
  console.log(nm,JSON.stringify(r))}
console.log('ERROS',errs);await b.close()})();
