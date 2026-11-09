// v243: evento do Yuta no Modo Boss (lobby, tela de início, ranqueado com XP, farm com roleta de passivas e drops)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"E"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_rp:'5200',rk_dia:'1',rk_gem:'0',rk_po:'0'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const shot=n=>p.screenshot({path:SH+'ev_'+n+'.png'}),W=ms=>p.waitForTimeout(ms);
await p.click('#mRank');await W(500);await p.click('#rkWrap [data-a="boss"]');await W(900);await shot('broly');
await p.click('#rkWrap .ysSlot',{force:true});await W(900);await shot('lobby');
await p.click('#rkWrap [data-a="start"]');await W(700);await shot('rank');
await p.click('#rkWrap [data-a="ytab"][data-t="farm"]');await W(500);await p.click('#rkWrap [data-a="ydif"][data-i="4"]');await W(400);await shot('farm');
const fight=async()=>{await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
  return p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});const info={opp:o.def.id,ph:o.rkPhB,ps:o.rkPS,lv:o.rkL,dm:+o.tdm.toFixed(2)};await F(70);
    for(const ph of [1,2]){o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150});await F(20);await new Promise(r=>{const c=()=>!G.trans?r():requestAnimationFrame(c);c()});await F(10);if(ph===1)info.form=o.form}return info})};
// farm super difícil, força Yuta e item
await p.evaluate(()=>{const o=Math.random;window.__mr=o});await p.click('#rkWrap [data-a="yfight"]',{force:true});await W(600);await shot('roleta');
const f1=await fight();await p.waitForSelector('#rkModal .rkRes');await W(800);await shot('farm_res');
const s1=await p.evaluate(()=>({rp:localStorage.rk_rp,gem:localStorage.rk_gem,po:localStorage.rk_po}));
// ranqueado
await p.evaluate(()=>{document.querySelectorAll('.rkWin,.rkMega').forEach(x=>x.remove());const b=document.getElementById('rkOk');if(b)b.click()});await W(600);
await p.click('#rkWrap [data-a="start"]');await W(500);await p.click('#rkWrap [data-a="ytab"][data-t="rank"]');await W(400);await p.click('#rkWrap [data-a="fight"]',{force:true});
const f2=await fight();await p.waitForSelector('#rkModal .rkRes');await W(600);await shot('rank_res');
const s2=await p.evaluate(()=>({rp:localStorage.rk_rp,gem:localStorage.rk_gem}));
console.log(JSON.stringify({f1,s1,f2,s2,errs}));await b.close()})();
