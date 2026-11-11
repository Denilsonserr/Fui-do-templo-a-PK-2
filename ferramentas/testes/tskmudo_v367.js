// v367: vídeo da invocação do Shaka sem áudio; música do lobby continua tocando
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>new Promise(res=>{__pvT.skVid();setTimeout(()=>{const v=document.querySelector('.skFx video');res({video:!!v,mudo:v&&v.muted,tocando:v&&!v.paused,musica:!window.__mel.paused,vol:window.__mel.volume.toFixed(2)})},1500)}));
console.log(r,'ERROS',errs);await b.close()})();
