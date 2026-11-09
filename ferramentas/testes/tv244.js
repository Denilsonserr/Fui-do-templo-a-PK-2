// v244: bônus dos títulos, ADM +60% em tudo, placa nova do ADM, código de 4000 💎 (CODE no env)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const DB={};const errs=[];
const page=async(init)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});const m=u.match(/documentId=([^&]+)/),id=m?m[1]:'a'+Math.random();if(DB[id])return r.fulfill({status:409,body:'{}'});DB[id]=1;return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},init);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(400);return p};
const fightStats=async(p)=>{await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(600);await p.click('#rkWrap [data-a="bsel"][data-b="broly"]').catch(()=>{});await p.waitForTimeout(400);await p.click('#rkWrap [data-a="start"]');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="fight"]',{force:true});
  await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});return p.evaluate(()=>{const a=__dbg.G.p[0];return {tdm:+a.tdm.toFixed(3),tsp:+a.tsp.toFixed(3),tdf:+a.tdf.toFixed(3),tcr:a.tcr,tki:a.tki,luck:+__rk.lvLuck().toFixed(2)}})};
const base={rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_rp:'0',rk_dia:'1',rk_gem:'0'};
const N=await page(Object.assign({tw_nome:'"Normal"',tw_tit:'["con"]',tw_titOn:'"con"'},base));const s0=await fightStats(N);
const A=await page(Object.assign({tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',tw_titOn:'"adm"'},base));const s1=await fightStats(A);
await A.evaluate(()=>{__dbg.G.paused=true});await A.goto('about:blank');
const P=await page(Object.assign({tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',tw_titOn:'"adm"'},base));await P.click('#mPerfil');await P.waitForTimeout(1200);await P.screenshot({path:SH+'adm_pf.png'});
await P.click('#rkWrap [data-a="back"]');await P.waitForTimeout(300);await P.click('#mRank');await P.waitForTimeout(500);await P.click('#rkWrap [data-a="code"]');await P.fill('#rkCdI',process.env.CODE);await P.click('#rkCdOk');await P.waitForTimeout(1500);
const cod=await P.evaluate(()=>({msg:document.getElementById('rkCdE').innerText,gem:localStorage.rk_gem}));
console.log(JSON.stringify({conquistador:s0,adm:s1,cod,errs}));await b.close()})();
