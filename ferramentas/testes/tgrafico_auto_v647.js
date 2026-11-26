// v647: gráfico inicial — aparelho muito fraco começa no Mínimo; durante o jogo nunca muda sozinho
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const mk=async(cores,extra)=>{const ctx=await b.newContext({viewport:{width:800,height:360},deviceScaleFactor:2});const p=await ctx.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|\/fs\//,r=>r.abort());
  await p.addInitScript(([c,x])=>{Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>c});if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',...x})}},[cores,extra||{}]);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(500);return {p,ctx}};
let {p,ctx}=await mk(2);chk(await p.evaluate(()=>__pvT.G().qlv)===0,'celular muito fraco (2 núcleos), primeira vez: começa no Mínimo');await ctx.close();
({p,ctx}=await mk(4));chk(await p.evaluate(()=>__pvT.G().qlv)===1,'4 núcleos: Leve (igual antes)');await ctx.close();
({p,ctx}=await mk(2,{ft_q:'3'}));chk(await p.evaluate(()=>__pvT.G().qlv)===3,'quem já escolheu (Ultra) não é mudado');
await p.evaluate(()=>{localStorage.removeItem('rk_tnrun');__tb2.go()});await p.waitForFunction(()=>__tb2.G().mode==='fight'&&__tb2.G().phase==='fight',null,{timeout:90000});
await p.evaluate(()=>{setInterval(()=>{const q=__tb2.G().p[0];q.hp=q.mhp},300);__ev('DYN.ema=60;G.dyn=.55');setInterval(()=>__ev('DYN.ema=60'),200)});await p.waitForTimeout(8000);
chk(await p.evaluate(()=>__pvT.G().qlv)===3,'luta lenta: o gráfico NÃO muda sozinho (regra do dono)');
console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
