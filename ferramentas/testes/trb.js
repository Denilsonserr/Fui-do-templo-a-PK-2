// v215: regras da ranqueada — XP, nível do Boss e passivas (nível 8)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_rp:'5500',rk_own:'["goku"]',rk_sel:'"goku"'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="start"]');await p.waitForTimeout(900);await p.screenshot({path:'/tmp/rb_ouro.png'});
await p.click('#rkWrap [data-a="lvn"]');await p.waitForTimeout(400);await p.screenshot({path:'/tmp/rb_sel5.png'});
// vitória no Ouro: 5500 -> 5660; derrota: -> 5580 (exemplo do dono)
await p.click('#rkWrap [data-a="fight"]');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');
const a1=await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const info={lv:o.rkL,tdm:+o.tdm.toFixed(3),tdf:+o.tdf.toFixed(3),tsp:+o.tsp.toFixed(3),diff:G.diff};
  const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
  o.rkPh=2;const hb=.38*o.mhp;o.hp=hb;await F(5);info.regen=!!o.rkP.reg;info.regenHp=Math.round(o.hp-hb);o.rkPh=1;o.hp=o.mhp;
  for(const ph of [1,2]){o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150});await F(ph===1?20:5);if(ph===1){await new Promise(r=>{const c=()=>!G.trans?r():requestAnimationFrame(c);c()});await F(10)}}
  return info});
await p.waitForSelector('#rkModal .rkRes');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/rb_res.png'});
const x1=await p.evaluate(()=>localStorage.rk_rp);
await p.click('#rkAgain');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;a.hp=5;a.inv=0;a.state='idle';__dbg.applyHit(o,a,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:a.x,py:a.y-150})});
await p.waitForSelector('#rkModal .rkRes');const x2=await p.evaluate(()=>localStorage.rk_rp);
// nível 8: passivas
await p.evaluate(()=>{localStorage.rk_rp='36000'});await p.click('#rkOk');await p.waitForTimeout(300);await p.click('#rkWrap [data-a="start"]');await p.waitForTimeout(800);await p.screenshot({path:'/tmp/rb_div.png'});
await p.click('#rkWrap [data-a="fight"]');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');
const a8=await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});const r={lv:o.rkL,tdm:+o.tdm.toFixed(3),tdf:+o.tdf.toFixed(3),tsp:+o.tsp.toFixed(3),diff:G.diff};
  let bl=0,dg=0;for(let i=0;i<300;i++){o.state='idle';o.inv=0;o.grounded=true;const h0=o.hp,ret=__dbg.applyHit(a,o,{dmg:1,kb:0,hs:1,kind:'melee',px:o.x,py:o.y-150});if(ret===false)dg++;else if(o.state==='blockstun'&&o.hp===h0)bl++;G.frame+=100;}
  r.bloqueios=bl;r.esquivas=dg;o.rkPh=2;G.hitstop=0;o.hp=.6*o.mhp;await F(30);r.barreira=Math.round(o.rkSh);r.P=JSON.stringify(o.rkP);r.mhp=o.mhp;const h1=o.hp;o.hp-=1000;await F(10);r.absorveu=Math.round(o.hp-(h1-1000));o.hp=.2*o.mhp;await F(10);r.suprema=!!o.rkP.sup;r.tdmSup=+o.tdm.toFixed(3);r.furia=!!o.rkP.fury;return r});
await p.waitForTimeout(800);await p.screenshot({path:'/tmp/rb_sup.png'});
// desistir conta como derrota
const x3=await p.evaluate(()=>localStorage.rk_rp);await p.evaluate(()=>{__dbg.G.paused=true});await p.evaluate(()=>document.getElementById('toMenu').click());const x4=await p.evaluate(()=>localStorage.rk_rp);
console.log(JSON.stringify({a1,xpVitoria:x1,xpDerrota:x2,a8,antesDesistir:x3,depoisDesistir:x4}),'ERROS',JSON.stringify(errs));await b.close()})();
