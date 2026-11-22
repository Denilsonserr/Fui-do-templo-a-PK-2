// v605: botões personalizados do ALUCARD (normal e transformado com sangue/raios) no celular
const {chromium}=require('playwright');(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const SH=process.env.SH||'/tmp/';
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:915,height:412},isMobile:true,hasTouch:true,deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'alucard',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.evaluate(()=>{document.getElementById('admTB').click()});await p.waitForTimeout(300);await p.evaluate(()=>document.getElementById('admGo').click());await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:60000});await p.waitForTimeout(2500);
const sk=await p.evaluate(()=>{const c=document.getElementById('controls');return {cus:c.classList.contains('cus'),img:getComputedStyle(document.getElementById('bPunch')).getPropertyValue('--img')}});chk(sk.cus&&/webp/.test(sk.img),'botões do Alucard (normal) aplicados');
await p.screenshot({path:SH+'btn_al_normal.png'});
await p.evaluate(()=>{const a=__dbg.G.p[0];a.form=1;a.formT=99999;a.ki=100});await p.waitForTimeout(1500);
const f=await p.evaluate(()=>{const c=document.getElementById('controls');return {alf:c.classList.contains('alf'),img:getComputedStyle(document.getElementById('bPunch')).getPropertyValue('--img')}});chk(f.alf&&f.img!==sk.img,'transformado: troca para os botões transformados + efeito de sangue');
await p.screenshot({path:SH+'btn_al_forma.png'});await p.waitForTimeout(500);await p.screenshot({path:SH+'btn_al_forma2.png'});
console.log(errs.length?'ERROS '+errs.slice(0,5).join(' | '):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
