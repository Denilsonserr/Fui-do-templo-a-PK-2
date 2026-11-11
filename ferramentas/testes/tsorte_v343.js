// v343: sorte/drop aplicados (quantidade e raridade) — jogador comum x ADM, sem evento e com evento
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ev=Date.UTC(2026,10,11,18,0),fora=Date.UTC(2026,10,12,1,0);
for(const [nm,tit,t] of [['Ze','[]',fora],['Ze','[]',ev],['Denilson ADM','["adm"]',fora],['Denilson ADM','["adm"]',ev]]){const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
  await p.addInitScript(([i,o])=>{const n=Date.now;Date.now=()=>n()+o;localStorage.clear();Object.assign(localStorage,i)},[{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(nm),tw_tit:tit,tw_titOn:tit==='[]'?'""':'"adm"',rk_own:'["goku"]'},t-Date.now()]);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  console.log(nm,t===ev?'COM evento':'sem evento',JSON.stringify(await p.evaluate(()=>__pvT.lk())));await p.close()}
console.log('ERROS',errs);await b.close()})();
