// v374: sai da Hidra pelo menu de pausa, entra na Torre → o inimigo morre?
const {chromium}=require('playwright');const U=process.env.U||'file:///home/claude/fui-do-templo-a-pk-2/www/index.html';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.rv('ca')});await p.waitForTimeout(500);await p.click('[data-a="hySel"]',{force:true});await p.waitForTimeout(800);await p.click('[data-a="hyGo"]',{force:true});
await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});await p.waitForTimeout(1500);
await p.click('#pauseBtn',{force:true});await p.waitForTimeout(400);await p.click('#toMenu',{force:true});await p.waitForTimeout(2000);
console.log('depois de sair da Hidra',await p.evaluate(()=>__pvT.hyon?__pvT.hyon():'-'));
await p.evaluate(()=>{try{rkModal(null)}catch(e){}__pvT.tws()});await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});await p.waitForTimeout(800);
const r=await p.evaluate(()=>new Promise(res=>{const G=__pvT.G(),o=G.p[1];o.hp=0;__pvT.ko(G.p[0],o);setTimeout(()=>res({gmode:G.gmode,inimigoKO:!!o.ko,vida:o.hp,diff:G.diff,phase:G.phase}),1500)}));
console.log('Torre',JSON.stringify(r),'ERROS',errs);await b.close()})();
