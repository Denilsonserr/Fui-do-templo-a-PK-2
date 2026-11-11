// v365: lobby toca só as 3 músicas do evento (cortes), troca quando acaba, rádio tem as 3 completas, luta volta ao normal
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/mus365_';
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',rk_gf362:'1',rk_mus:'"none"',rk_pvupv:'352',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
const st=()=>p.evaluate(()=>{const e=__pvT.evm();return [e.EVMI,e.MCUR,e.src.split('/').pop(),e.loop,e.paused,+window.__mel.currentTime.toFixed(1)]});console.log('lobby (rádio = sem música)',await st());
await p.evaluate(()=>{const m=window.__mel;m.currentTime=m.duration-1.5});await p.waitForTimeout(3500);console.log('acabou → próxima',await st());
await p.evaluate(()=>__pvT.rv('gacha'));await p.waitForTimeout(800);console.log('na tela do giro',await st());await p.evaluate(()=>__pvT.rv('menu'));
await p.evaluate(()=>document.querySelector('[data-a="music"]').click());await p.waitForTimeout(600);
console.log('rádio',await p.evaluate(()=>{const M=document.querySelector('.rkMu');return M?[...M.querySelectorAll('button')].slice(-3).map(b=>b.textContent).join(' | ')+' || nota: '+!!document.querySelector('.evMuN'):'sem rádio'}));await p.screenshot({path:SH+'radio.png'});
const bt=await p.evaluate(()=>{const B=[...document.querySelectorAll('.rkMu button')].find(b=>/Pelo Mundo/.test(b.textContent));if(B)B.click();return !!B});await p.waitForTimeout(400);console.log('escolheu Pelo Mundo na rádio → lobby continua evento',await st(),await p.evaluate(()=>localStorage.rk_mus));
await p.evaluate(()=>{try{rkModal(null)}catch(e){}__pvT.rv('ca')});await p.waitForTimeout(500);await p.click('[data-a="hySel"]',{force:true});await p.waitForTimeout(800);await p.click('[data-a="hyGo"]',{force:true});
await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});await p.waitForTimeout(800);console.log('na luta',await st());
console.log('ERROS',errs);await b.close()})();
