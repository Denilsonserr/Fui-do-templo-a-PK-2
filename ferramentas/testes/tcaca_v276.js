// v276: Lobo Negro sem raios (olhos vermelhos continuam)
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku"]',tw_tit:'["adm"]'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(900);await p.click('#rkWrap [data-a="caca"]',{force:true});await p.waitForTimeout(1500);await p.screenshot({path:SH+'c76_tela.png'});
await p.click('#rkWrap [data-a="caRing"][data-i="3"]',{force:true});await p.waitForTimeout(300);console.log('anel:',await p.evaluate(()=>document.getElementById('rkToast').textContent));
await p.click('#rkWrap [data-a="caInfo"]',{force:true});await p.waitForTimeout(500);await p.screenshot({path:SH+'c76_info.png'});await p.click('#rkMX');
await p.click('#rkWrap [data-a="caGo"]',{force:true});await p.waitForTimeout(1700);await p.screenshot({path:SH+'c76_vs.png'});await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const st=()=>p.evaluate(()=>{const [a,o]=__dbg.G.p;return {stg:__dbg.G.stage||'',php:Math.round(a.hp),lv:o.bLv,bs:o.bs,bhp:Math.round(o.hp),mhp:o.mhp,tdm:o.tdm,tdf:+(o.tdf||0).toFixed(2),bsp:o.bsp,sc:+(o.bSc||1).toFixed(2),pas:(o.bPas||[]).join(','),name:o.def.name}});
await p.waitForTimeout(1500);await p.screenshot({path:SH+'c76_nv1.png'});console.log('nv1',JSON.stringify(await st()));
async function mata(shot){await p.evaluate(()=>{const [a,o]=__dbg.G.p;a.hp=3600;o.hp=3;o.hpLag=3;o.x=a.x+170;o.y=486;o.grounded=true;o.vy=0;o.bs='idle';o.bcd=300;o.state='idle';o.inv=0;o.facing=-1;a.facing=1;a.state='idle'});
  for(let i=0;i<10;i++){await p.keyboard.press('KeyJ');await p.waitForTimeout(110);if((await st()).bs==='rev')break}
  await p.waitForTimeout(900);if(shot)await p.screenshot({path:SH+shot+'_junta.png'});await p.waitForTimeout(1100);if(shot)await p.screenshot({path:SH+shot+'_uivo.png'});await p.waitForTimeout(1500)}
await mata("c76_rev1");console.log('depois 1',JSON.stringify(await st()));
for(let k=0;k<3;k++)await mata(k===2?'c76_rev4':null);console.log('nv5',JSON.stringify(await st()));await p.screenshot({path:SH+'c76_nv5.png'});
for(let k=0;k<4;k++)await mata(k===3?'c76_rev9':null);console.log('nv9',JSON.stringify(await st()));await p.waitForTimeout(1500);await p.screenshot({path:SH+'c76_nv9.png'});
// jogador perde
for(let i=0;i<40;i++){await p.evaluate(()=>{const [a,o]=__dbg.G.p;if(a.hp>1)a.hp=1;a.inv=0;if(o.bs==='idle'){o.x=a.x+150;o.bcd=0}});await p.waitForTimeout(500);if(await p.evaluate(()=>__dbg.G.mode!=='fight'))break}await p.waitForTimeout(2500);console.log('fim',await p.evaluate(()=>[__dbg.G.mode,(document.querySelector('#rkWrap .rkA')||{}).className,(document.querySelector('#rkModal h3')||{}).textContent,(document.querySelector('#rkModal')||{}).textContent.slice(0,200),localStorage.rk_caRec].join(' | ')));
await p.screenshot({path:SH+'c76_fim.png'});console.log(errs);await b.close()})();
