// v647: luz nos personagens em cache (Ultra/4K) fica igual à desenhada direto, e funciona em luta de verdade
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:800,height:360}});await p.route(/fonts\.g|\/fs\//,r=>r.abort());const E=[];p.on('pageerror',e=>E.push(e.message));
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',ft_q:'3'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>{localStorage.removeItem('rk_tnrun');__tb2.go()});await p.waitForFunction(()=>__tb2.G().mode==='fight'&&__tb2.G().phase==='fight',null,{timeout:90000});
await p.evaluate(()=>{setInterval(()=>{const q=__tb2.G().p[0];q.hp=q.mhp},300);__pvT.setQ(3);__ev('DYN.off=1')});await p.waitForTimeout(4000);let ok=1;
const L=await p.evaluate(()=>({...__vw.LCS()}));console.log('luta de verdade (4 s): reaproveitou',L.hit,'refez',L.miss);if(!(L.hit>20))ok=0;
for(const lv of [3,4]){await p.evaluate(lv=>__pvT.setQ(lv),lv);await p.waitForTimeout(800);
  const d=await p.evaluate(()=>{const G=__tb2.G();G.hold=1;__ev('DYN.off=1');const c=document.querySelector('canvas'),x=c.getContext('2d');const R=__ev('render');const f0=G.frame;const MR=Math.random;
    const snap=off=>{window.__v647off=off;let sd=3;Math.random=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};G.frame=f0;R();Math.random=MR;return x.getImageData(0,0,c.width,c.height).data};
    const a=snap(1),b1=snap(0),b2=snap(0);window.__v647off=0;const df=(u,v)=>{let s=0,big=0;for(let i=0;i<u.length;i+=4){const e=Math.abs(u[i]-v[i])+Math.abs(u[i+1]-v[i+1])+Math.abs(u[i+2]-v[i+2]);s+=e;if(e>60)big++}return [+(s/(u.length/4)/3).toFixed(2),+(big/(u.length/4)*100).toFixed(2)]};
    G.hold=0;return {refeito:df(a,b1),reaproveitado:df(a,b2)}});
  console.log('gráfico',lv,'[diferença média, % pixels diferentes]',JSON.stringify(d));if(d.refeito[0]>5||d.reaproveitado[0]>5||d.reaproveitado[1]>8)ok=0}
console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
