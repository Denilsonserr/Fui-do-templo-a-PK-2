// v395/v396 (GM=pve = Batalha Treino do menu; GM=treino = boneco): ADM testa a forma divina do Shaka na Batalha Treino (sem itens V2, sem precisar de 1 barra)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Jogador"',tw_tit:'[]',rk_ini:'1',rk_own:'["goku","shaka"]',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(gm=>{__dbg.G.ssel='shk';__pvT.treino('shaka','goku',gm)},process.env.GM||'pve');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
await p.evaluate(()=>{__dbg.G.noAI=true;__pvT.trf()});const s0=await p.evaluate(()=>__pvT.skdv());
await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:20000});await p.waitForTimeout(1500);const sMid=await p.evaluate(()=>__pvT.skdv());await p.screenshot({path:SH+'treino_olhos.png'});
await p.evaluate(()=>{__dbg.G.p[0].sb=Math.max(1,__dbg.G.p[0].sb||0);__pvT.dvBtn()});await p.waitForTimeout(1800);await p.screenshot({path:SH+'treino_dvvideo.png'});await p.waitForFunction(()=>__pvT.skdv().div&&!__dbg.G.trans,null,{timeout:20000});await p.waitForTimeout(600);await p.screenshot({path:SH+'treino_div.png'});
const s1=await p.evaluate(()=>__pvT.skdv());
const st=await p.evaluate(()=>({stg:__pvT.shk().stg,tdm0:__dbg.G.p[1].tdm}));await p.evaluate(()=>{__dbg.G.p[1].hp=__dbg.G.p[1].mhp?__dbg.G.p[1].mhp*.2:700});await p.waitForTimeout(2500);await p.screenshot({path:SH+'treino_templo.png'});const st2=await p.evaluate(()=>__pvT.shk().ph);
console.log(JSON.stringify({st,st2}));
console.log(JSON.stringify({sMid:sMid.div,s0,s1,gm:await p.evaluate(()=>__dbg.G.gmode)}));console.log('ERRS',errs.slice(0,4));await b.close()})();
