// v245: perfil com a arte nova, título ADMINISTRADOR e molduras (liberação + escolha)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const errs=[];
const page=async(init)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},init);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(400);return p};
const c=document=>0;
const A=await page({tw_nome:'"Denilson ADM"',tw_tit:'["adm","rk7"]',tw_titOn:'"adm"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","yuta"]',rk_sel:'"yuta"',rk_rp:'36000',rk_dia:'1',rk_st:JSON.stringify({brW:255,ysW:7}),
  rk_foto:JSON.stringify('data:image/jpeg;base64,'+'/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==')});
await A.click('#mPerfil');await A.waitForTimeout(1000);await A.screenshot({path:SH+'md_0.png'});
await A.click('#rkWrap .pfFoto');await A.waitForTimeout(300);await A.click('#pfF2');await A.waitForTimeout(600);await A.screenshot({path:SH+'md_pick.png'});
const lst=await A.evaluate(()=>[...document.querySelectorAll('#rkModal .mdC')].map(x=>x.dataset.k+':'+(x.classList.contains('lk')?'lk':'ok')).join(' '));
await A.click('#rkModal .mdC[data-k="adm"]');await A.waitForTimeout(1200);await A.screenshot({path:SH+'md_adm.png'});
for(const k of ['rk7','rk3','br100','ytob']){await A.evaluate(k=>{localStorage.rk_mold=JSON.stringify(k)},k);await A.click('#rkWrap [data-a="hs"]');await A.waitForTimeout(300);await A.click('#rkWrap [data-a="pf"]');await A.waitForTimeout(700);await A.screenshot({path:SH+'md_'+k+'.png'})}
console.log(lst,JSON.stringify(errs));await b.close()})();
