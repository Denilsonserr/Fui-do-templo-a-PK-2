// v418: forma divina custa 2,5 barras, dura metade da 1ª transformação e depois volta aos olhos abertos
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"J"',rk_ini:'1',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>{__dbg.G.ssel='shk';__pvT.treino('shaka','goku','pve')});await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{__dbg.G.noAI=true;__pvT.trf()});await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:20000});
for(let i=0;i<25&&!(await p.evaluate(()=>__pvT.skdv().div));i++){await p.evaluate(()=>{__dbg.G.p[0].sb=3;__pvT.dvBtn()});await p.waitForTimeout(1000)}
await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:20000});
const a0=await p.evaluate(()=>{const G=__dbg.G,a=G.p[0];return {div:a.skDiv,dur:a.skDivE-G.frame,tdm:a.tdm,sb:a.sb,cls:document.getElementById('controls').className}});
await p.evaluate(()=>{const G=__dbg.G;G.p[0].skDivE=G.frame+30});await p.waitForTimeout(1500);
const a1=await p.evaluate(()=>{const G=__dbg.G,a=G.p[0];return {div:a.skDiv,form:a.form,formT:a.formT,tdm:a.tdm,cls:document.getElementById('controls').className}});
const w=await p.evaluate(()=>{const a=__dbg.G.p[0];a.sb=2;return __pvT.dvWhy?__pvT.dvWhy():null});
console.log(JSON.stringify({a0,a1,w}),errs.slice(0,3));await b.close()})();
