// v357: baú no chão com botão ABRIR BAÚ + exploração entre as partes
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/ex_';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',tw_titOn:'"adm"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',rk_pvupv:'352',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3500);
await p.evaluate(()=>__pvT.hyS());await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});
await p.evaluate(()=>{const G=__pvT.G(),H=__pvT.hy();G.p[0].mhp=G.p[0].hp=99999;H.kills=13;const o=G.p[1];o.hp=0;__pvT.ko(G.p[0],o)});await p.waitForTimeout(2500);
await p.evaluate(()=>{const G=__pvT.G(),it=__pvT.hy().items.find(i=>i.k==='bau');G.p[0].x=it.x-120});await p.waitForTimeout(800);await p.screenshot({path:SH+'botao.png'});
console.log('botao visivel',await p.evaluate(()=>!document.getElementById('hyOpen').hidden));await p.click('#hyOpen',{force:true});await p.waitForTimeout(1500);await p.screenshot({path:SH+'aberto.png'});
console.log('itens',await p.evaluate(()=>__pvT.hy().items.map(i=>i.k+(i.open?'(aberto)':'')).join(',')));
await p.evaluate(()=>{__pvT.G().p[0].x=2350});await p.waitForTimeout(2500);console.log('explorando',await p.evaluate(()=>[__pvT.hy().ex,__pvT.stg()[1],__pvT.hy().items.map(i=>i.k+i.bt).join(',')]));
await p.evaluate(()=>{const G=__pvT.G(),it=__pvT.hy().items[0];G.p[0].x=it.x-110});await p.waitForTimeout(1200);await p.screenshot({path:SH+'exploracao.png'});
await p.click('#hyOpen',{force:true});await p.waitForTimeout(1800);await p.screenshot({path:SH+'exploracao2.png'});
await p.evaluate(()=>{__pvT.G().p[0].x=2350});await p.waitForTimeout(2500);console.log('parte',await p.evaluate(()=>[__pvT.hy().st,__pvT.hy().ex,__pvT.G().p[1].def.name]));
console.log('ERROS',errs);await b.close()})();
