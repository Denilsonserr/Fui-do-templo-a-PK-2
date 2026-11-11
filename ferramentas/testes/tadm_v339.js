// v339: ADM +70% e 2x de evento sempre; outro jogador sem nada
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const [nm,tit,off] of [['Denilson ADM','["adm"]',0],['Ze','[]',0],['Denilson ADM','["adm"]',Date.UTC(2026,10,11,18,0)-Date.now()],['Ze','[]',Date.UTC(2026,10,11,18,0)-Date.now()]]){const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis/,r=>r.abort());
  await p.addInitScript(([i,o])=>{const n=Date.now;Date.now=()=>n()+o;localStorage.clear();Object.assign(localStorage,i)},[{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(nm),tw_tit:tit,tw_titOn:'"adm"',rk_own:'["goku"]'},off]);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
  console.log(nm,off?'(durante o evento de desculpas)':'(sem evento)',await p.evaluate(()=>{const e=__pvT.ev();return e?JSON.stringify([e[2],e[3],e[4]]):'sem evento'}),'bonus',await p.evaluate(()=>JSON.stringify(__pvT.dl('goku'))));await p.close()}
console.log('ERROS',errs);await b.close()})();
