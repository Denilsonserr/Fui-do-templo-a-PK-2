// v395: ADM testa a forma divina do Shaka na Batalha Treino (sem itens V2, sem precisar de 1 barra)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_own:'["goku","shaka"]',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.treino('shaka','goku'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
const s0=await p.evaluate(()=>{const a=__dbg.G.p[0];a.form=1;a.formT=2300;return __pvT.skdv()});
await p.waitForFunction(()=>__pvT.skdv().div&&!__dbg.G.trans,null,{timeout:20000});await p.waitForTimeout(600);await p.screenshot({path:SH+'treino_div.png'});
const s1=await p.evaluate(()=>__pvT.skdv());
// sem ADM não ativa
console.log(JSON.stringify({s0,s1,gm:await p.evaluate(()=>__dbg.G.gmode)}));console.log('ERRS',errs.slice(0,4));await b.close()})();
