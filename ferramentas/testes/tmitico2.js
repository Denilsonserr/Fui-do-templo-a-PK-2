// v224: mítico garantido em 110 giros e nunca repetido
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const run=async(own,pity,n)=>{const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(([o,pt])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:JSON.stringify(o),rk_sel:'"goku"',rk_gem:'50000',rk_dia:'1',rk_pity3:String(pt)})}},[own,pity]);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="gacha"]');await p.waitForTimeout(500);const txt=await p.evaluate(()=>document.querySelector('.rkPity').innerText);
  const got=[];for(let k=0;k<n;k++){await p.click('#rkWrap [data-a="sum10"]');await p.waitForSelector('.rkRes2',{timeout:60000});await p.waitForTimeout(800);
    const H=await p.evaluate(()=>JSON.parse(localStorage.rk_hist||'[]').slice(0,10).filter(x=>x.r==='mit').map(x=>x.id));got.push(...H);
    await p.evaluate(()=>{document.querySelectorAll('.rkMega,.rkWin,.rkRes2').forEach(e=>e.remove())});await p.click('#rkWrap [data-a="gacha"]').catch(()=>{});await p.waitForTimeout(300)}
  const r={txt,miticos:got,own:await p.evaluate(()=>localStorage.rk_own),pity3:await p.evaluate(()=>localStorage.rk_pity3),errs};await p.close();return r};
console.log('garantia',JSON.stringify(await run(['goku','naruto','madara'],105,1)));
console.log('todos',JSON.stringify(await run(['goku','naruto','madara','garou'],109,3)));
await b.close()})();
