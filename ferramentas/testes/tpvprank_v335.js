// v335: ranks da direita mostram quantos jogadores e a lista de cada rank (servidor local 8790)
const {chromium}=require('playwright');const U='http://localhost:8790/index.html';const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/pvr_';
(async()=>{const b=await chromium.launch();const errs=[];
const run=async(nm,pvp,own)=>{const c=await b.newContext({viewport:{width:915,height:412}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|googleapis/,r=>r.abort());
  await p.addInitScript(i=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,i)}},{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(nm),rk_own:JSON.stringify(own),rk_sel:JSON.stringify(own[0]),rk_pvp:JSON.stringify(pvp)});await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(6000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
  await p.click('#rkWrap [data-a="conta"]',{force:true});await p.waitForTimeout(400);await p.fill('#acP1','senha1');await p.fill('#acP2','senha1');await p.click('#acNew');await p.waitForTimeout(2500);await p.evaluate(()=>{const x=document.getElementById('acX');if(x)x.click()});
  await p.click('#rkWrap [data-a="pvp"]',{force:true});await p.waitForTimeout(3000);return p};
await run('Ana',{t:2,d:1,s:2,w:12,l:3,rw:[]},['goku']);await run('Beto',{t:2,d:0,s:1,w:8,l:2,rw:[]},['zoro']);await run('Cris',{t:5,d:2,s:6,w:40,l:9,rw:[]},['gojo']);
const p=await run('Duda',{t:0,d:1,s:1,w:1,l:0,rw:[]},['vegeta']);await p.waitForTimeout(62000);await p.click('#rkWrap [data-a="back"]',{force:true});await p.waitForTimeout(500);await p.click('#rkWrap [data-a="pvp"]',{force:true});await p.waitForTimeout(3000);
await p.screenshot({path:SH+'tela.png'});console.log('contagem',await p.evaluate(()=>[...document.querySelectorAll('.rk_pvp .pvTr b')].map(x=>x.textContent).join(',')));
await p.click('#rkWrap [data-a="pvTier"][data-t="2"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+'prata.png'});console.log('prata',await p.evaluate(()=>document.querySelector('.pvTl')?.innerText.replace(/\n+/g,' | ')));
await p.evaluate(()=>document.getElementById('rkMX').click());await p.click('#rkWrap [data-a="pvTier"][data-t="all"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+'todos.png'});console.log('todos',await p.evaluate(()=>document.querySelector('.pvTl')?.innerText.replace(/\n+/g,' | ')));
console.log('ERROS',errs);await b.close()})();
