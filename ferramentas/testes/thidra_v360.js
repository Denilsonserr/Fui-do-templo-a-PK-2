// v360: Hidra liberada (jogador sem título) + 7 ninhadas de filhotes até o nível 8
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/h360_';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku"]',rk_sel:'"goku"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(3500);
await p.evaluate(()=>__pvT.rv('ca'));await p.waitForTimeout(800);console.log('slot hidra',await p.evaluate(()=>{const e=document.querySelector('[data-a="hySel"]');return e?e.innerText:'NÃO'}));
await p.click('[data-a="hySel"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+'tela.png'});console.log('botão',await p.evaluate(()=>!!document.querySelector('[data-a="hyGo"]')));
await p.click('[data-a="hyGo"]',{force:true});await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:90000});
await p.evaluate(()=>{setInterval(()=>{const q=__pvT.G().p[0];q.hp=q.mhp},200);__pvT.hyBoss()});await p.waitForTimeout(800);
for(let lv=1;lv<=8;lv++){const s=await p.evaluate(()=>{const G=__pvT.G(),H=__pvT.hy();return [H.lv,G.p[1].def.name,Math.round(G.p[1].mhp),G.p[1].bSc]});console.log('boss',JSON.stringify(s));
  await p.evaluate(()=>{const G=__pvT.G(),o=G.p[1];o.hp=0;__pvT.ko(G.p[0],o)});if(lv===8)break;await p.waitForTimeout(2200);
  const f=await p.evaluate(()=>{const H=__pvT.hy(),G=__pvT.G();return H.fil?[H.fil.tot,H.fil.left,H.mobs.length,G.p[1].def.name,G.p[1].bSc]:null});console.log(' ninhada',JSON.stringify(f));if(lv===1){await p.waitForTimeout(600);await p.screenshot({path:SH+'filhotes.png'})}
  for(let k=0;k<40;k++){const done=await p.evaluate(()=>{const H=__pvT.hy(),G=__pvT.G();if(!H.fil)return 1;const m=H.mobs.find(x=>!x.ko);const o=m||G.p[1];o.hp=0;__pvT.ko(G.p[0],o);return 0});if(done)break;await p.waitForTimeout(250)}
  await p.waitForTimeout(1800);if(lv===1)await p.screenshot({path:SH+'volta.png'})}
await p.waitForTimeout(11000);await p.screenshot({path:SH+'fim.png'});console.log('fim',await p.evaluate(()=>{const M=document.getElementById('lvrzM');return M?M.innerText.slice(0,120):'-'}));
console.log('registro',await p.evaluate(()=>localStorage.rk_bt&&JSON.parse(localStorage.rk_bt)[0]));console.log('ERROS',errs);await b.close()})();
