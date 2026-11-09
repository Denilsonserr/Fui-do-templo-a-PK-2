// v224: XP com bônus no Boss — recorde do servidor, seu recorde, combo e dano na derrota
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
const doc=(f)=>({document:{name:'x/torre/a'+Math.random(),createTime:'2026-11-08T10:00:00Z',fields:Object.fromEntries(Object.entries(f).map(([k,v])=>[k,typeof v==='number'?{integerValue:String(v)}:{stringValue:v}]))}});
await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u)){const q=JSON.parse(r.request().postData()).structuredQuery,w=q.where&&q.where.fieldFilter;
  if((w&&['rk','rkr'].includes(w.field.fieldPath))||q.orderBy)return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify([doc({rk:'1',nome:'Vini',tt:200,won:1,rp:5200,lv:3}),doc({rk:'1',nome:'Zeus',tt:150,won:1,rp:2600})])});
  return r.fulfill({status:200,contentType:'application/json',body:'[]'})}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_rp:'5500',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1',rk_st:JSON.stringify({rec:{3:100}})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(1200);await p.click('#rkWrap [data-a="start"]');await p.waitForTimeout(900);await p.screenshot({path:'/tmp/rec_rb.png'});
const win=async()=>{await p.click('#rkWrap [data-a="fight"]');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');
  await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});for(const ph of [1,2]){o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150});await F(20);await new Promise(r=>{const c=()=>!G.trans?r():requestAnimationFrame(c);c()});await F(10)}});
  await p.waitForSelector('#rkModal .rkRes');await p.waitForTimeout(600)};
let x0=+await p.evaluate(()=>localStorage.rk_rp);await win();await p.screenshot({path:'/tmp/rec_res1.png'});const x1=+await p.evaluate(()=>localStorage.rk_rp);const xb1=await p.evaluate(()=>document.querySelector('.rkXb').innerText);
await p.click('#rkAgain');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');await p.waitForTimeout(3500);
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;o.hp=o.mhp*.4;a.hp=5;a.inv=0;a.state='idle';__dbg.applyHit(o,a,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:a.x,py:a.y-150})});
await p.waitForSelector('#rkModal .rkRes');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/rec_res2.png'});const x2=+await p.evaluate(()=>localStorage.rk_rp);const xb2=await p.evaluate(()=>document.querySelector('.rkXb').innerText);
console.log(JSON.stringify({vitoria:x1-x0,xb1,derrota:x2-x1,xb2,rec:await p.evaluate(()=>localStorage.rk_st)}),'ERROS',JSON.stringify(errs));await b.close()})();
