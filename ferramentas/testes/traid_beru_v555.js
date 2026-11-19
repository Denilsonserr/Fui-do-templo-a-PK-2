// v555: RAID DAS FORMIGAS (portal S) + chefe BERU + sombra BERU
const {chromium}=require('playwright');const SH='/tmp/claude-0/raid_';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Ze"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_own:'["goku","sung"]',rk_sel:'"sung"',rk_sjs:JSON.stringify({cls:'necro',lv:30,sh:['tank'],eq:'tank'}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(2000);const clr=()=>p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});await clr();
/* evento 20 min: em 3 horas, quantos ciclos abertos têm rank S */
const ev=await p.evaluate(()=>{let t=Date.now(),seen={},s=0,n=0;for(let k=0;k<360;k++){const N=__pvT.ptNow(t);if(N.st==='aberto'&&!seen[N.i]){seen[N.i]=1;n++;if(N.L.some(q=>q.r===5))s++}t+=30000}return {n,s}});
chk(ev.n>0&&ev.s>=Math.floor(ev.n*.8),'evento: rank S em '+ev.s+' de '+ev.n+' ciclos em 3 h');
const ta=await p.evaluate(()=>{let t=Date.now();for(let k=0;k<300;k++){const N=__pvT.ptNow(t);if(N.st==='aberto'&&N.L.some(q=>q.r===5))return t;t+=30000}return 0});
await p.clock.install({time:ta+2000});await p.evaluate(()=>document.querySelector('[data-a="portais"]').click());await p.waitForTimeout(1200);await clr();
const tela=await p.evaluate(()=>({raid:document.querySelectorAll('.ptRaid').length,ev:(document.querySelector('.ptSEv.be')||{}).textContent||''}));await p.screenshot({path:SH+'tela.png'});await p.clock.resume();
chk(tela.raid>=1&&/RAID DAS FORMIGAS/.test(tela.ev),'tela dos portais mostra a RAID e o evento');
await p.evaluate(()=>__pt.start({r:5,id:'teste'}));await p.waitForTimeout(1600);
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.evaluate(()=>{const P=__dbg.G.p[0];P.inv=0;P.hp=P.mhp=99999999});
await p.waitForTimeout(4000);await p.screenshot({path:SH+'sala1.png'});
const ks={};for(let k=0;k<40;k++){const L=await p.evaluate(()=>{const H=__pt.HY(),G=__dbg.G;const A=[G.p[1],...H.mobs].filter(Boolean);const r=A.map(m=>m.pn?m.pn.k+(m.pn.v==='branco'?'*':''):(m.pnWolf?'lobo':'?'));for(const m of A)if(!m.ko&&!m.hyIdle){m.hp=0;__pvT.ko(G.p[0],m)}return r});for(const x of L)ks[x]=(ks[x]||0)+1;await p.waitForTimeout(250)}
console.log(JSON.stringify(ks));chk((ks.fv||0)+(ks['fv*']||0)+(ks.fb||0)>0,'formigas aparecem na raid');
/* sala 10: Beru */
await p.evaluate(()=>{__pt.R().room=9});await p.evaluate(()=>__pt.next());await p.waitForTimeout(2500);await p.evaluate(()=>{const P=__dbg.G.p[0];P.inv=0;P.hp=P.mhp=99999999});
const st=[];for(let k=0;k<40;k++){await p.waitForTimeout(200);st.push(await p.evaluate(()=>{const o=__dbg.G.p[1];return o.pn?(o.pn.a==='guard'?'guarda':o.pn.atk?o.pn.atk.a.replace('be_',''):o.state):'?'}));if(k===12)await p.screenshot({path:SH+'beru.png'})}
const be=await p.evaluate(()=>{const o=__dbg.G.p[1];return {k:o.pn&&o.pn.k,nome:o.def.name,pas:o.pn&&o.pn.pas,mhp:o.mhp,atk:o.hyAtk}});const seq=[];for(const x of st)if(seq[seq.length-1]!==x)seq.push(x);
console.log(JSON.stringify(be),seq.join('>'));chk(be.k==='be'&&be.pas,'sala 10 é o BERU com passivas');chk(/combo|soco|chute|corre/.test(seq.join()),'Beru ataca (auto combo)');
/* derrota o Beru com sorte forçada → sombra */
await p.evaluate(()=>{const G=__dbg.G,o=G.p[1];const R=Math.random;Math.random=()=>0;setTimeout(()=>{Math.random=R},50);o.hp=0;__pvT.ko(G.p[0],o)});await p.waitForTimeout(2500);
const sh=await p.evaluate(()=>({win:!!document.getElementById('pnSh'),txt:(document.getElementById('pnSh')||{}).innerText||'',sjs:JSON.parse(localStorage.rk_sjs||'{}').sh}));await p.screenshot({path:SH+'sombra.png'});
chk(sh.win&&/BERU/.test(sh.txt)&&sh.sjs.includes('beru'),'extraiu a sombra BERU (rank S)');
await b.close();
/* sombra em luta */
const b2=await chromium.launch();const q=await b2.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});q.on('pageerror',e=>E.push(e.message));await q.route(/fonts\.g|firestore/,r=>r.abort());
await q.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_own:'["goku","sung"]',rk_sjs:JSON.stringify({cls:'necro',lv:30,sh:['tank','igris','beru'],eq:'beru'})})}});
await q.goto('http://localhost:8790/index.html');await q.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const stt=await q.evaluate(()=>({be:__pvT.shSt?0:0}));
await q.evaluate(()=>__pvT.treino('sung','goku','pve'));await q.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await q.waitForTimeout(800);
await q.evaluate(()=>__pvT.trf());await q.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:60000});await q.waitForTimeout(400);
await q.evaluate(()=>{const f=__dbg.G.p[0];f.ki=300;f.sb=3});await q.keyboard.press('o');await q.waitForTimeout(400);await q.waitForFunction(()=>!__dbg.G.trans,null,{timeout:30000});
await q.waitForFunction(()=>__dbg.G.p[0].sjB,null,{timeout:20000}).catch(()=>{});
const B0=await q.evaluate(()=>{const B=__dbg.G.p[0].sjB;return B?{k:B.k,hp:Math.round(B.mhp),dm:+(B.dm||0).toFixed(2)}:null});await q.waitForTimeout(1500);
await q.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;o.x=f.x+260;o.inv=0});const hp0=await q.evaluate(()=>__dbg.G.p[1].hp);
const fr=[];for(let k=0;k<12;k++){await q.waitForTimeout(160);fr.push(await q.evaluate(()=>{const B=__dbg.G.p[0].sjB;return B?B.st+':'+B.a:'-'}));if(k===6)await q.screenshot({path:SH+'sombra_luta.png'})}
const hp1=await q.evaluate(()=>__dbg.G.p[1].hp);console.log(JSON.stringify({B0,fr:[...new Set(fr)].join(' '),dano:Math.round(hp0-hp1)}));
chk(B0&&B0.k==='beru','Sung invoca o BERU');chk(hp1<hp0,'Beru sombra causa dano ('+Math.round(hp0-hp1)+')');
console.log(E.length?'ERROS '+E.slice(0,4).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b2.close()})();
