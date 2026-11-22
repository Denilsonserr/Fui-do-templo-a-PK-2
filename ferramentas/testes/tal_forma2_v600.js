// v600: ALUCARD transformado — combo de tiros rápido (af1..af5), MORCEGOS no Ki, DASH rápido
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'alucard',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.waitForTimeout(300);await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:60000});await p.waitForTimeout(1500);
const W=ms=>p.waitForTimeout(ms),ev=f=>p.evaluate(f),shot=n=>p.screenshot({path:SH+'af_'+n+'.png'});
/* dash normal */
const dash=async()=>{await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=300;o.x=1500;a.facing=1;a.state='idle';a.vx=0});await W(200);const x0=await ev(()=>__dbg.G.p[0].x);
  await p.keyboard.press('d');await W(40);await p.keyboard.press('d');await W(230);const r=await ev(()=>({x:__dbg.G.p[0].x,s:__dbg.G.p[0].state}));return r.x-x0};
const dn=await dash();await W(500);
await ev(()=>{const a=__dbg.G.p[0];a.form=1;a.formT=99999});await W(200);const df=await dash();await W(500);
chk(dn>150&&df>dn,'dash rápido: normal '+Math.round(dn)+' px, transformado '+Math.round(df)+' px em ~0,25 s');
/* combo de tiros transformado */
await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=250;o.x=800;a.facing=1;o.hp=o.mhp||3600;a.state='idle'});await W(200);const h0=await ev(()=>__dbg.G.p[1].hp);const seq=[];
for(let i=0;i<5;i++){await p.keyboard.press('j');await W(140);seq.push(await ev(()=>__dbg.G.p[0].mname));if(i===2)await shot('rajada')}
await W(700);const h1=await ev(()=>__dbg.G.p[1].hp);chk(seq.some(m=>/^af/.test(m||'')),'transformado usa as rajadas rápidas ('+seq.join(',')+')');chk(h1<h0,'rajadas acertam: -'+Math.round(h0-h1));
/* morcegos */
await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=200;o.x=800;a.facing=1;a.ki=100;o.hp=o.mhp||3600;a.state='idle'});await W(200);const b0=await ev(()=>__dbg.G.p[1].hp);
await p.keyboard.press('l');await W(600);const nb=await ev(()=>__aucT.n().bat);await shot('morcegos1');await W(250);await shot('morcegos2');await W(1500);const b1=await ev(()=>__dbg.G.p[1].hp);
chk(nb>=5,'Ki transformado solta MORCEGOS ('+nb+')');chk(b1<b0,'morcegos perseguem e acertam: -'+Math.round(b0-b1));
console.log(errs.length?'ERROS '+errs.slice(0,5).join(' | '):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
