// v271: lobo pequeno e rápido + AUTO COMBO (dash) + BRECHA + quadros novos de dano
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku","yuta"]'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(800);await p.click('#rkWrap [data-a="caca"]',{force:true});
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const st=()=>p.evaluate(()=>{const [a,o]=__dbg.G.p;return {php:Math.round(a.hp),pst:a.state,bhp:Math.round(o.hp),bs:o.bs,bp:o.bp,bk:o.bk.join(''),bst:o.state,bx:Math.round(o.x),by:Math.round(o.y),px:Math.round(a.x),cnt:o.bCnt}});
await p.waitForTimeout(600);await p.screenshot({path:SH+'c71_inicio.png'});
// combo forçado
await p.evaluate(()=>{const [a,o]=__dbg.G.p;a.x=700;a.state='idle';a.inv=0;a.vx=0;a.vy=0;a.y=o.y=__dbg.G.p[1].y>0?486:486;a.grounded=true;o.grounded=true;o.vy=0;o.x=1150;o.y=__dbg.G.p[0].y;o.facing=-1;o.bs='combo';o.bt=0;o.bp=0;o.bpt=0;o.bHit=0;o.state='attack';a.hp=3600});
const ph=[];const shotAt={4:'c71_dash',9:'c71_upper',13:'c71_ar',17:'c71_chao',22:'c71_final',28:'c71_brecha'};
for(let i=0;i<34;i++){await p.waitForTimeout(60);const s=await st();ph.push((s.bs==='combo'?s.bp:s.bs)+'/'+s.php);if(shotAt[i])await p.screenshot({path:SH+shotAt[i]+'.png'})}
console.log('fases',ph.join(' '));console.log('após combo',JSON.stringify(await st()));
// combo errando (jogador longe e pulando) -> BRECHA
await p.evaluate(()=>{const [a,o]=__dbg.G.p;a.x=300;o.x=1500;o.facing=-1;o.bs='combo';o.bt=0;o.bp=0;o.bpt=0;o.bHit=0;o.bCnt=0;o.state='attack';a.hp=3600});
const ph2=[];for(let i=0;i<20;i++){await p.waitForTimeout(60);const s=await st();ph2.push((s.bs==='combo'?s.bp:s.bs)+':'+s.bx);if(s.bs==='combo'&&s.bp===3)await p.evaluate(()=>{const a=__dbg.G.p[0];a.inv=30})}
console.log('errou',ph2.join(' '));
// apanhando: quadros de dano novos
await p.evaluate(()=>{const [a,o]=__dbg.G.p;a.x=700;o.x=880;o.y=__dbg.G.p[0].y;o.vy=0;o.grounded=true;o.bs='idle';a.state='idle';o.bcd=300;o.facing=-1;a.facing=1});for(let i=0;i<5;i++){await p.keyboard.press('KeyJ');await p.waitForTimeout(120)}
await p.screenshot({path:SH+'c71_apanha.png'});console.log('apanha',JSON.stringify(await st()));
await p.evaluate(()=>{const o=__dbg.G.p[1];o.hp=30;o.hpLag=30;o.bcd=200;o.x=__dbg.G.p[0].x+170});for(let i=0;i<8;i++){await p.keyboard.press('KeyJ');await p.waitForTimeout(150)}
await p.waitForTimeout(1200);await p.screenshot({path:SH+'c71_morte.png'});console.log('KO',JSON.stringify(await st()));
console.log(errs);await b.close()})();
