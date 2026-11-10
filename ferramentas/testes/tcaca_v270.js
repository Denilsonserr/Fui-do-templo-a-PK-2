// v270: modo CAÇA (teste) — Lobo Sombrio ataca, apanha, morre, volta para o Ranqueado
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"yuta"',rk_own:'["goku","yuta"]'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(800);await p.screenshot({path:SH+'caca_menu.png'});await p.click('#rkWrap [data-a="caca"]',{force:true});
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const st=()=>p.evaluate(()=>{const [a,o]=__dbg.G.p;return {php:Math.round(a.hp),pst:a.state,bhp:Math.round(o.hp),bs:o.bs,bst:o.state,bx:Math.round(o.x),by:Math.round(o.y),px:Math.round(a.x)}});
const seen=new Set();for(let i=0;i<40;i++){await p.waitForTimeout(150);const s=await st();seen.add(s.bs);if(i===6||i===14||i===22||i===30)await p.screenshot({path:SH+'caca_'+i+'.png'})}
console.log('estados do lobo',[...seen].join(','),JSON.stringify(await st()));
// jogador bate
await p.evaluate(()=>{const [a,o]=__dbg.G.p;o.x=a.x+200;o.bs='idle';o.bcd=200;o.facing=-1});for(let i=0;i<6;i++){await p.keyboard.press('KeyJ');await p.waitForTimeout(140)}
await p.screenshot({path:SH+'caca_bate.png'});console.log('depois de bater',JSON.stringify(await st()));
await p.evaluate(()=>{const o=__dbg.G.p[1];o.hp=30;o.hpLag=30;o.bcd=200;o.x=__dbg.G.p[0].x+180});for(let i=0;i<8;i++){await p.keyboard.press('KeyJ');await p.waitForTimeout(150)}
await p.waitForTimeout(1500);await p.screenshot({path:SH+'caca_morte.png'});console.log('KO',JSON.stringify(await st()));
await p.waitForTimeout(9000);console.log('volta',await p.evaluate(()=>[__dbg.G.mode,__dbg.G.phase,__dbg.G.phaseT,__dbg.G.gmode,!document.getElementById('ranked').hidden,(document.querySelector('#rkModal h3')||{}).textContent].join(' | ')));await p.screenshot({path:SH+'caca_fim.png'});
console.log(errs);await b.close()})();
