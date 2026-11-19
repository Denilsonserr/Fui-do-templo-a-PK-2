// v558: gráfico automático pelo aparelho + desce sozinho se lento + Mínimo com resolução <1 e meio quadro
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
  const b=await chromium.launch();
  const mk=async(mem,cores,saved)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
    await p.addInitScript(([m,c,s])=>{Object.defineProperty(navigator,'deviceMemory',{get:()=>m});Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>c});if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();localStorage.rk_ini='1';if(s!=null)localStorage.ft_q=String(s)}},[mem,cores,saved]);
    await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(500);return p};
  let p=await mk(2,4,null);chk((await p.evaluate(()=>__pvT.q().qlv))===1,'celular fraco (2 GB, 4 núcleos) começa no LEVE');
  await p.evaluate(()=>__pvT.treino('goku','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
  const r=await p.evaluate(async()=>{const T=__pvT;for(let i=0;i<400;i++)T.dynTick(45);const a=T.q();for(let i=0;i<400;i++)T.dynTick(45);return {a,b:T.q()}});console.log(JSON.stringify(r));
  chk(r.b.qlv===0,'lento: desce sozinho até o MÍNIMO');chk(r.b.dpr<1,'Mínimo: resolução abaixo de 1 ('+r.b.dpr.toFixed(2)+')');
  const fps=await p.evaluate(async()=>{let n=0;const c=document.getElementById('cv')||document.querySelector('canvas');return 1});
  await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/claude-0/otim_min.png'});await p.close();
  p=await mk(8,8,null);chk((await p.evaluate(()=>__pvT.q().qlv))===3,'celular bom (8 GB, 8 núcleos) começa no ULTRA');await p.close();
  p=await mk(2,4,4);chk((await p.evaluate(()=>__pvT.q().qlv))===4,'quem escolheu 4K continua no 4K');await p.close();
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
