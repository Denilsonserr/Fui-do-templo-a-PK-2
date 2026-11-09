// v231: dificuldade da Torre pelo rank (Madeira x Dragão Lendário)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const run=async rp=>{const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(x=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_rp:String(x),rk_dia:'1'})}},rp);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await p.click('#mRank');await p.waitForTimeout(400);await p.click('#rkWrap [data-a="torre"]');await p.waitForTimeout(900);await p.click('#twGo');await p.waitForTimeout(1500);await p.click('#twGo');
  await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
  const r=await p.evaluate(()=>{const [a,o]=__dbg.G.p;return {barras:o.mhp/(a.mhp/4),tdm:+o.tdm.toFixed(3),tsp:+o.tsp.toFixed(3),diff:__dbg.G.diff,meuDano:+a.tdm.toFixed(2)}});await p.close();return [r,errs]};
console.log('MADEIRA',JSON.stringify(await run(0)));console.log('DRAGAO',JSON.stringify(await run(24000)));await b.close()})();
