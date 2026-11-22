// v603: ALUCARD — botão SUPER/ULTIMATE (o de 100, em cima) aparece no celular e solta a ultimate quando transformado com 100 Ki
const {chromium}=require('playwright');(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:915,height:412},isMobile:true,hasTouch:true,deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'alucard',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.evaluate(()=>{document.getElementById('admTB').click()});await p.waitForTimeout(300);await p.evaluate(()=>document.getElementById('admGo').click());await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:60000});await p.waitForTimeout(4000);
const vis=await p.evaluate(()=>{const e=document.getElementById('bSr');return !e.hidden&&getComputedStyle(e).display!=='none'});chk(vis,'botão ULTIMATE aparece para o Alucard');
const cl0=await p.evaluate(()=>document.getElementById('bSr').className);chk(/locked/.test(cl0),'normal: botão com cadeado (precisa transformar) ['+cl0+']');
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;a.form=1;a.formT=99999;a.ki=100;a.x=500;o.x=800;a.state='idle'});await p.waitForTimeout(400);
const cl=await p.evaluate(()=>document.getElementById('bSr').className);chk(/ready/.test(cl)&&!/locked/.test(cl),'transformado + 100 Ki: botão aceso ['+cl+']');
await p.screenshot({path:'/tmp/tf/botao_ult.png'});
const r=await p.evaluate(()=>document.getElementById('bSr').getBoundingClientRect().toJSON());await p.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);await p.waitForTimeout(300);
const u=await p.evaluate(()=>!!__dbg.G.trans&&!!__dbg.G.trans.u);chk(u,'tocar no botão solta a ULTIMATE');await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/tf/botao_ult2.png'});
console.log(errs.length?'ERROS '+errs.slice(0,5).join(' | '):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
