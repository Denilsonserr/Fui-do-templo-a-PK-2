// v417: forma divina — aura (auréola + raios), rastro fantasma, combo com luzes, DESVIO DIVINO e REFLEXO
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"J"',rk_ini:'1',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>{__dbg.G.ssel='shk';__pvT.treino('shaka','goku','pve')});await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{__dbg.G.noAI=true;__pvT.trf()});await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:20000});
for(let i=0;i<25&&!(await p.evaluate(()=>__pvT.skdv().div));i++){await p.evaluate(()=>{__dbg.G.p[0].sb=3;__pvT.dvBtn()});await p.waitForTimeout(1000)}
await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:20000});await p.waitForTimeout(3000);await p.screenshot({path:SH+'dv_aura.png'});
await p.evaluate(()=>{const a=__dbg.G.p[0];a.state='run';a.vx=-10*a.facing});await p.waitForTimeout(350);await p.screenshot({path:SH+'dv_rastro.png'});
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;a.vx=0;a.state='idle';o.x=a.x+a.facing*200;o.hp=3600;a.spCD=0;a.buf.sp=G.frame});await p.waitForTimeout(700);await p.screenshot({path:SH+'dv_combo.png'});
const ev=await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});let dg=0,rf=0,hit=0;o.hp=3600;const ohp0=o.hp;
  for(let i=0;i<40;i++){await F(45);a.state='idle';a.inv=0;const x0=a.x,h0=a.hp,oh=o.hp;o.x=a.x+a.facing*120;__dbg.applyHit(o,a,{dmg:40,kb:1,hs:6,kind:'melee',px:a.x,py:a.y-150});await F(2);if(a.x!==x0&&a.hp===h0)dg++;else if(a.hp<h0){hit++;if(o.hp<oh)rf++}}return {dg,rf,hit}});
console.log(JSON.stringify(ev),errs.slice(0,3));await b.close()})();
