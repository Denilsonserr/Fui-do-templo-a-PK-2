const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.treino('sung','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);
const T=[1,5,9,12,13,15,18,22];let n=0;
await p.evaluate(T=>{const G=__dbg.G,[f,o]=G.p;G.noAI=true;f.x=300;o.x=1100;f.facing=1;f.state='idle';f.buf.kiTap=G.frame;window.__T=T.slice();const iv=setInterval(()=>{if(G.paused)return;if(f.state==='attack'&&window.__T.length&&f.mf>=window.__T[0]){window.__T.shift();G.paused=true}},2)},T);
for(let i=0;i<T.length;i++){await p.waitForFunction(()=>__dbg.G.paused,null,{timeout:5000}).catch(()=>{});await p.waitForTimeout(60);await p.screenshot({path:'/tmp/sq'+i+'.png',clip:{x:0,y:120,width:915,height:260}});await p.evaluate(()=>{__dbg.G.paused=false});await p.waitForTimeout(5)}
await b.close()})();
