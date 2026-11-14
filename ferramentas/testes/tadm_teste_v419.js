// v419: MODO TESTE do ADM — botão só para o ADM, painel, luta livre com cortes azuis nos golpes
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';const ADM=process.env.ADM!=='0';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(a=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:a?'"Denilson ADM"':'"Fulano"',tw_tit:a?'["adm"]':'[]',rk_ini:'1',rk_xpv2:'1',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}},ADM);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2000);
const vis=await p.evaluate(()=>{const b=document.getElementById('admTB');return b?!b.hidden:false});await p.screenshot({path:SH+'adm_title.png'});
if(!ADM){console.log(JSON.stringify({vis}),errs.slice(0,3));await b.close();return}
await p.click('#admTB');await p.waitForTimeout(500);await p.screenshot({path:SH+'adm_painel.png'});
await p.selectOption('#admA','shaka');await p.selectOption('#admB','goku');await p.click('#admGo');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
const r=await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});o.x=a.x+a.facing*150;
  a.hp=10;await F(3);const hp=a.hp;__dbg.applyHit(a,o,{dmg:30,kb:1,hs:6,kind:'melee',px:o.x,py:o.y-150});await F(5);return {hp,sb:a.sb,noai:G.noAI,gm:G.gmode,on:__pvT.admT().on,vfx:__pvT.vfx(),pick:a.def.id}});
await p.screenshot({path:SH+'adm_corte.png'});await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;__dbg.applyHit(a,o,{dmg:80,kb:1,hs:6,kind:'melee',px:o.x,py:o.y-150})});await p.waitForTimeout(150);await p.screenshot({path:SH+'adm_corte2.png'});
console.log(JSON.stringify({vis,r}),errs.slice(0,3));await b.close()})();
