// v460: MODO PORTAIS — horário (estatística de raridade em 7 dias), tela, entrar num portal, salas, chefe, drops, fim, ranking e inventário
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));
p.on('request',r=>{if(/documentId=er_/.test(r.url())){try{const f=JSON.parse(r.postData()).fields;E.push('REP '+f.m.stringValue+' @'+f.st.stringValue.split('\n').slice(1,3).join(' ').slice(0,200))}catch(e){}}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Caçador"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_own:'["goku","sung"]',rk_sel:'"sung"',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
/* estatística: 7 dias */
console.log('estatística',await p.evaluate(()=>{const T0=Date.UTC(2026,10,15,14,0),c={},op=[];let t=T0,last=-1,S=[],lastS=null;for(;t<T0+7*864e5;t+=3e4){const N=__pt.now(t);if(N.st==='aberto'&&N.i!==last){last=N.i;op.push(N.L.length);for(const x of N.L)c[x.r]=(c[x.r]||0)+1;if(N.L.some(x=>x.r===5)){if(lastS!=null)S.push((N.ini-lastS)/36e5);lastS=N.ini}}}
  return {ciclos:op.length,porDia:+(op.length/7).toFixed(1),portaisMedia:+(op.reduce((a,b)=>a+b,0)/op.length).toFixed(2),ranks:c,S_intervaloMedio_h:+(S.reduce((a,b)=>a+b,0)/S.length).toFixed(2)}}));
console.log('agora',JSON.stringify(await p.evaluate(()=>{const N=__pt.now();return {st:N.st,fim:Math.round((N.fim-Date.now())/1000)}})));
/* achar um horário aberto e ir para ele */
const T=await p.evaluate(()=>{let t=Date.now();for(let k=0;k<200;k++){const N=__pt.now(t);if(N.st==='aberto')return t+5000;t+=60000}return 0});
await p.clock.install({time:T});await p.reload();await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(2000);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
await p.evaluate(()=>document.querySelector('[data-a="portais"]').click());await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/pt_tela.png'});
console.log('tela',await p.evaluate(()=>({slots:document.querySelectorAll('.ptSl img').length,tm:document.getElementById('ptTm').innerText})));
await p.evaluate(()=>document.querySelector('[data-a="ptGo"]').click());
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/pt_luta.png'});
const info=()=>p.evaluate(()=>{const R=__pt.R(),H=__pt.HY(),G=__dbg.G;return R?{sala:R.room,kills:H.kills,need:null,mobs:H.mobs.length,pts:R.pts,ess:R.loot.ess,eq:R.loot.eq.length,an:R.loot.an.length,p1:G.p[1].def.name,stg:__dbg.stg()}:null});
console.log('sala1',JSON.stringify(await info()));
/* passa salas: mata tudo rápido */
for(let s=0;s<6;s++){for(let k=0;k<40;k++){const d=await p.evaluate(()=>{const G=__dbg.G,H=__pt.HY();if(H.gate||H.busy)return 1;const o=G.p[1];if(o&&!o.ko&&!o.hyIdle){o.hp=0;__pvT.ko(G.p[0],o)}for(const m of H.mobs.slice()){if(!m.ko){m.hp=0;__pvT.ko(G.p[0],m)}}return 0});if(d)break;await p.waitForTimeout(150)}
  await p.waitForTimeout(400);await p.evaluate(()=>{const G=__dbg.G;G.p[0].x=__dbg.G.p[0].x;__pt.next()});await p.waitForTimeout(1500);if(s===3){await p.screenshot({path:'/tmp/pt_chefe.png'})}console.log('sala',JSON.stringify(await info()))}
/* morre */
await p.evaluate(()=>{const G=__dbg.G,f=G.p[0];f.hp=0;__pvT.ko(G.p[1],f)});await p.waitForTimeout(6000);await p.screenshot({path:'/tmp/pt_fim.png'});
console.log('fim',await p.evaluate(()=>{const M=document.getElementById('lvrzM');return M?M.innerText.replace(/\s+/g,' '):'?'}),JSON.stringify(await p.evaluate(()=>__pt.log())));
await p.evaluate(()=>{const M=document.getElementById('lvrzM');if(M)M.remove()});await p.waitForTimeout(500);
await p.evaluate(()=>document.querySelector('[data-a="ptHunt"]').click());await p.waitForTimeout(2500);console.log('ranking',await p.evaluate(()=>document.querySelector('.ptRkL').innerText.replace(/\s+/g,' ').slice(0,200)));
await p.evaluate(()=>{const x=document.getElementById('rkMX');if(x)x.click()});await p.evaluate(()=>document.querySelector('[data-a="ptInv"]').click());await p.waitForTimeout(800);await p.screenshot({path:'/tmp/pt_inv.png'});
console.log('ERROS',E.slice(0,6));await b.close()})();
