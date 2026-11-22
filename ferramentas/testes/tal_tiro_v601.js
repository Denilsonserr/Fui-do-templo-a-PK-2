// v601: ALUCARD — tiro sai da PONTA DA ARMA, Ki = JACKAL (roxo, atravessa), botão ULTIMATE sem faísca, gráfico não baixa sozinho
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',ft_q:'3',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'alucard',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.waitForTimeout(300);await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:60000});await p.waitForTimeout(1500);
const W=ms=>p.waitForTimeout(ms),ev=f=>p.evaluate(f);
await ev(()=>{window.__q=null;window.__t=performance.now();window.requestAnimationFrame=cb=>{window.__q=cb;return 1};window.__step=n=>{for(let i=0;i<n;i++){const c=window.__q;window.__q=null;window.__t+=1000/60;if(c)c(window.__t)}}});await W(200);
/* tiros: para cada golpe, pega a posição da bala no quadro em que nasce */
const shots=[];
for(const [form,keys] of [[0,'jjjjj'],[1,'jjjjj']]){await ev(fm=>{const G=__dbg.G,[a,o]=G.p;a.x=300;o.x=1300;a.facing=1;a.form=fm;a.formT=99999;a.state='idle';__step(30)},form);
  for(let i=0;i<5;i++){await p.keyboard.down('j');await ev(()=>__step(2));await p.keyboard.up('j');
    for(let s=0;s<14;s++){const r=await ev(()=>{__step(1);const n=__aucT.n();return n.b});if(r>0){await p.screenshot({path:SH+`tip_${form}_${i}.png`});break}}
    await ev(()=>__step(8))}
  await ev(()=>__step(60))}
/* Jackal */
await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=300;o.x=800;a.facing=1;a.form=0;a.ki=100;o.hp=o.mhp||3600;a.state='idle';__step(20)});const j0=await ev(()=>__dbg.G.p[1].hp);
await p.keyboard.down('l');await ev(()=>__step(2));await p.keyboard.up('l');for(let s=0;s<12;s++)await ev(()=>__step(1));await p.screenshot({path:SH+'jackal1.png'});await ev(()=>__step(8));await p.screenshot({path:SH+'jackal2.png'});await ev(()=>__step(80));
const j1=await ev(()=>__dbg.G.p[1].hp);chk(j1<j0,'Ki = JACKAL acerta: -'+Math.round(j0-j1));
/* botão ultimate: transformado + 100 Ki, sem faísca */
const rd=await ev(()=>{const a=__dbg.G.p[0];a.form=1;a.formT=99999;a.ki=100;a.spark=0;__step(3);return document.querySelector('#controls [data-k="sr"], #controls .sr, #btnSR')?.className||'(sem seletor)'});
const rd2=await ev(()=>{const a=__dbg.G.p[0];return [a.form,a.ki,a.spark]});console.log('botão sr:',rd,JSON.stringify(rd2));
await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=500;o.x=800;a.state='idle';o.state='idle';o.hp=o.mhp||3600});await p.keyboard.down('o');await ev(()=>__step(2));await p.keyboard.up('o');const ul=await ev(()=>!!__dbg.G.trans&&!!__dbg.G.trans.u);chk(ul,'ULTIMATE sai sem a faísca (transformado + 100 Ki)');
await ev(()=>__step(700));
/* gráfico não baixa sozinho */
const q=await ev(()=>{const q0=__dbg.G.qlv;try{for(let i=0;i<200;i++)__pvT.dynTick(60)}catch(e){}return [q0,__dbg.G.qlv]});chk(q[0]===q[1],'gráfico não muda sozinho mesmo com o jogo lento ('+QLNs(q)+')');
console.log(errs.length?'ERROS '+errs.slice(0,5).join(' | '):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
function QLNs(q){return q.join('→')}
