// v221: código de 1000 diamantes (uso único no jogo inteiro) + vitória no Broly dá 5–15 💎
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const IDS=new Set();
const run=async(uid,tag)=>{const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(u=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:JSON.stringify(u),tw_nome:'"X'+u+'"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1',rk_gem:'10'})}},uid);await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,body:'{}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await p.click('#mRank');await p.waitForTimeout(800);await p.click('#rkWrap [data-a="code"]');await p.fill('#rkCdI','mil-qge7-ybxs');await p.click('#rkCdOk');await p.waitForTimeout(1500);const msg=await p.evaluate(()=>document.getElementById('rkCdE').textContent);await p.click('#rkMX');await p.waitForTimeout(300);
  let win=null;if(tag==='a'){await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(400);await p.screenshot({path:'/tmp/mil_lobby.png'});await p.click('#rkWrap [data-a="start"]');await p.waitForTimeout(600);await p.click('#rkWrap [data-a="fight"]');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');
    const g0=await p.evaluate(()=>+localStorage.rk_gem);await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});for(const ph of [1,2]){o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150});await F(20);await new Promise(r=>{const c=()=>!G.trans?r():requestAnimationFrame(c);c()});await F(10)}});
    await p.waitForSelector('#rkModal .rkRes');win=(await p.evaluate(()=>+localStorage.rk_gem))-g0}
  console.log(tag,msg,'| gem',await p.evaluate(()=>localStorage.rk_gem),'| vitória deu',win,'ERROS',JSON.stringify(errs));await p.close()};
await run('a','a');await run('b','b');await b.close()})();
