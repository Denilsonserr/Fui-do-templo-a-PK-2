// v363: passivas DIVINA e PRIMORDIAL — chances, soma (ORIGEM DE TUDO), tela e revelação
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/ps363_';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","yuta"]',rk_sel:'"goku"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3000);
console.log('2 milhões de giros',await p.evaluate(()=>{const P=__pvT.ps,c={},o={pl:0,pm:0,pd:0},ix={div:[0,0,0,0,0],pri:[0,0,0,0,0]};let mx=0;for(let n=0;n<2e6;n++){const R=P.roll(o);c[R.r]=(c[R.r]||0)+1;if(ix[R.r])ix[R.r][R.i]++;if((o.pd|0)>mx)mx=o.pd}
  const pc={};for(const k in c)pc[k]=(c[k]/2e4).toFixed(3)+'%';return {pc,ix,maxSemDivina:mx}}));
console.log('ORIGEM DE TUDO sozinha',await p.evaluate(()=>{const P=__pvT.ps,o=P.G();o.ch.goku={r:'pri',i:4};o.ch.yuta={r:'div',i:4};o.jn=10;o.pend={tg:{k:'ch',id:'goku'},r:'pri',i:2};P.S(o);return [P.sum('goku'),P.sum('yuta'),P.def({r:'pri',i:4}).n]}));
await p.evaluate(()=>psOpen?0:0).catch(()=>{});await p.evaluate(()=>__pvT.rv('ps'));await p.waitForTimeout(900);await p.screenshot({path:SH+'tela.png'});
await p.evaluate(()=>{const o=__pvT.ps.G();o.pend=null;__pvT.ps.S(o);__pvT.rv('ps')});await p.waitForTimeout(300);
await p.evaluate(()=>__pvT.ps.anim('pri'));await p.waitForTimeout(4900);await p.screenshot({path:SH+'rev.png'});await p.screenshot({path:SH+'pity.png',clip:{x:570,y:325,width:120,height:60}});
await p.click('[data-p="tg"][data-k="ch"]',{force:true});await p.waitForTimeout(300);await p.click('[data-p="sel"]',{force:true});await p.waitForTimeout(300);await p.click('[data-p="spin5"]',{force:true});await p.waitForTimeout(6500);
console.log('giro x5',await p.evaluate(()=>{const o=__pvT.ps.G();return [o.jn,o.pendL&&o.pendL.length]}));await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
console.log('ERROS',errs);await b.close()})();
