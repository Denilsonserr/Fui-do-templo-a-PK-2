// v383: vigia da torre (boss morto sem ko / lutador trocado) e trava do dia-noite (DN.lv fora do cenário)
const {chromium}=require('playwright');const U='file:///home/claude/fui-do-templo-a-pk-2/www/index.html';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push('C:'+m.text().slice(0,160))});await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","naruto"]',rk_sel:'"naruto"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now())})}`);
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.tnO()});await p.waitForTimeout(1500);await p.click('#twGo',{force:true});
await p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&G.phase==='fight'&&T.ph==='boss'},null,{timeout:90000});await p.waitForTimeout(800);
// 1) dia/noite com nível impossível: o jogo tem que continuar desenhando
await p.evaluate(()=>__pvT.dnB());const f0=await p.evaluate(()=>__pvT.G().frame);await p.waitForTimeout(1500);const f1=await p.evaluate(()=>__pvT.G().frame);console.log('quadros andando depois do DN quebrado:',f1-f0);
// 2) boss trocado por outro objeto e morto sem passar pelo ko
await p.evaluate(()=>{const G=__pvT.G(),o=G.p[1],n=Object.assign(Object.create(Object.getPrototypeOf(o)),o);delete n.tnBoss;G.p[1]=n});await p.waitForTimeout(500);
await p.evaluate(()=>{const G=__pvT.G();G.p[0].hp=G.p[0].mhp;G.p[1].hp=0;G.p[1].ko=true});await p.waitForTimeout(5000);
console.log(JSON.stringify(await p.evaluate(()=>({ph:__pvT.tn().ph,cartas:document.querySelectorAll('#tnPick.on .tnC').length}))));
console.log('ERROS',errs.filter(e=>!/mp3|Failed to load|net::/.test(e)).slice(0,6));await b.close()})();
