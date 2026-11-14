// v421: SUNG etapa 1 — só no modo teste do ADM: parado, andando, correndo, golpes, combo, ki; transformação/ultimate "em breve"
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='warning'||m.type()==='error')errs.push(m.text().slice(0,300))});await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:1,a:'sung',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.waitForTimeout(300);const opt=await p.evaluate(()=>[...document.querySelectorAll('#admA option')].some(o=>o.value==='sung'));await p.click('#admGo');
try{await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:60000})}catch(e){console.log('NOFIGHT',await p.evaluate(()=>[__dbg.G.mode,__dbg.G.phase,document.querySelector('.screen:not([hidden])')?.id]),errs);process.exit(1)}await p.waitForTimeout(1200);
const W=ms=>p.waitForTimeout(ms),shot=n=>p.screenshot({path:SH+'sj_'+n+'.png'});
const st=()=>p.evaluate(()=>{const a=__dbg.G.p[0];return {id:a.def.id,state:a.state,mv:a.mname||null}});
await shot('parado');const s0=await st();
await p.keyboard.down('d');await W(500);await shot('andando');await p.keyboard.up('d');await W(300);
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;o.x=a.x+a.facing*190});
const seq=[];for(const k of ['j','j','j','k','k']){await p.keyboard.press(k);await W(140);seq.push((await st()).mv);if(seq.length===2)await shot('espada')}
await W(700);await p.keyboard.press('k');await W(160);await shot('chute');await W(800);
await p.keyboard.press('l');await W(200);await shot('ki');const ki=await st();await W(1200);
await p.keyboard.press('i');await W(600);await shot('combo');const cmb=await st();await W(3500);
await p.keyboard.press('u');await W(400);const tr=await p.evaluate(()=>({form:__dbg.G.p[0].form,trans:!!__dbg.G.trans}));
await p.keyboard.press('o');await W(400);const ws=await p.evaluate(()=>!!__dbg.G.ws);
await p.keyboard.press('Space');await W(250);await shot('pulo');
console.log(JSON.stringify({opt,s0,seq,ki,cmb,tr,ws}),errs.slice(0,4));await b.close()})();
