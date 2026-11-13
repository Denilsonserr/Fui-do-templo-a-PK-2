// v388: narração PT — botão na Configuração, áudios carregados e troca no smp
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now())})}`);
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mCfg');await p.waitForTimeout(800);await p.screenshot({path:'/tmp/voz_cfg.png'});console.log('botão:',await p.textContent('#vozBtn'));
await p.mouse.click(400,300);await p.click('#sndBtn');await p.click('#sndBtn');await p.waitForTimeout(8000);console.log(JSON.stringify(await p.evaluate(()=>__pvT.voz())),'SB total',await p.evaluate(()=>window.__SBo()));
await p.click('#vozBtn');console.log('depois de tocar:',await p.textContent('#vozBtn'),await p.evaluate(()=>localStorage.voz));
console.log('ERROS',errs.slice(0,5));await b.close()})();
