// v234: chats por HORA (Torre: campo ch; global: gh) + ranking com consultas ordenadas (rp/dmg/tw/t1w)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const DB={};let reads=0;
const page=async(init)=>{const p=await b.newPage({viewport:{width:1040,height:480}});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();
    if(/:runQuery/.test(u)){const q=JSON.parse(r.request().postData()).structuredQuery,w=q.where&&q.where.fieldFilter,o=q.orderBy&&q.orderBy[0];let L=Object.entries(DB);
      if(w)L=L.filter(([id,f])=>f[w.field.fieldPath]&&Object.values(f[w.field.fieldPath])[0]===w.value.stringValue);
      if(o){const k=o.field.fieldPath,g=f=>+Object.values(f[k])[0];L=L.filter(([id,f])=>f[k]).sort((a,c)=>o.direction==='DESCENDING'?g(c[1])-g(a[1]):g(a[1])-g(c[1]))}
      L=L.slice(0,q.limit||100);reads+=Math.max(1,L.length);return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L.map(([id,f])=>({document:{name:'x/torre/'+id,createTime:new Date().toISOString(),fields:f}})))})}
    const m=u.match(/documentId=([^&]+)/),id=m?m[1]:'a'+Math.random().toString(36).slice(2);if(DB[id])return r.fulfill({status:409,body:'{}'});DB[id]=JSON.parse(r.request().postData()).fields;return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},init);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});return p};
const A=await page({tw_nome:'"Ana"',tw_uid:'"ua"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1',rk_rp:'5200'});
await A.click('#mRank');await A.waitForTimeout(400);await A.click('#rkWrap [data-a="boss"]');await A.waitForTimeout(800);await A.fill('#rkChI','oi global');await A.keyboard.press('Enter');await A.waitForTimeout(800);
await A.click('#rkWrap [data-a="start"]');await A.waitForTimeout(400);await A.click('#rkWrap [data-a="fight"]');await A.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');
await A.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});await F(70);for(const ph of [1,2]){o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150});await F(20);await new Promise(r=>{const c=()=>!G.trans?r():requestAnimationFrame(c);c()});await F(10)}});
await A.waitForSelector('#rkModal .rkRes');await A.click('#rkOk');await A.waitForTimeout(300);await A.click('#rkWrap [data-a="back"]');await A.waitForTimeout(300);
await A.click('#rkWrap [data-a="torre"]');await A.waitForTimeout(900);await A.click('#rtUI .rtRow button[data-c="twChB"]');await A.waitForTimeout(600);
await A.evaluate(()=>{const i=document.querySelector('#twModal input');i.value='oi torre'});await A.evaluate(()=>{const b=[...document.querySelectorAll('#twModal button')].find(x=>/ENVIAR/i.test(x.textContent));b&&b.click()});await A.waitForTimeout(800);
const B=await page({tw_nome:'"Bia"',tw_uid:'"ub"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1'});
await B.click('#mRank');await B.waitForTimeout(400);await B.click('#rkWrap [data-a="boss"]');await B.waitForTimeout(1500);const gchat=await B.evaluate(()=>document.getElementById('rkChL').innerText);
await B.click('#rkWrap [data-a="back"]');await B.waitForTimeout(300);await B.click('#rkWrap [data-a="ranking"]');await B.waitForTimeout(800);const rk=await B.evaluate(()=>document.getElementById('rkRkL').innerText.replace(/\n/g,' '));
await B.click('#rkModal .twTab button[data-t="tt"]');await B.waitForTimeout(800);const rkT=await B.evaluate(()=>document.getElementById('rkRkL').innerText.replace(/\n/g,' '));await B.click('#rkMX');
await B.click('#rkWrap [data-a="torre"]');await B.waitForTimeout(900);await B.click('#rtUI .rtRow button[data-c="twChB"]');await B.waitForTimeout(900);const tchat=await B.evaluate(()=>document.querySelector('#twModal').innerText.slice(0,200).replace(/\n/g,' '));
const doc=Object.values(DB).find(f=>f.rk&&f.won&&f.won.integerValue==='1');
console.log(JSON.stringify({gchat,rk,rkT,tchat,campos:doc&&Object.keys(doc).join(','),leituras:reads}),'ERROS',JSON.stringify([A.errs,B.errs]));await b.close()})();
