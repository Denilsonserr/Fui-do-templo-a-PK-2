// v374: Modo Boss de ponta a ponta: luta 25 s no automático, Boss perde vida, derrotar → resultado e registro
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["vegeta"]',rk_sel:'"vegeta"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_rp:'30000',rk_ps:JSON.stringify({jn:0,ch:{vegeta:{r:'mit',i:0}}}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());try{rkModal(null)}catch(e){}});
for(const a of ['boss','start','fight']){await p.click(`#rkWrap [data-a="${a}"]`,{force:true}).catch(()=>{});await p.waitForTimeout(900)}
await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:60000});
const h0=await p.evaluate(()=>{window.__autoP=1;const G=__pvT.G();return [G.gmode,G.p[1].def.name,Math.round(G.p[1].hp),G.p[0].tcd]});
await p.waitForTimeout(+(process.env.T||25000));const h1=await p.evaluate(()=>{const G=__pvT.G();return [G.phase,Math.round(G.p[1].hp),Math.round(G.p[0].hp)]});
for(let k=0;k<6;k++){const st=await p.evaluate(()=>{const G=__pvT.G(),o=G.p[1];const r=[G.phase,Math.round(o.hp),o.mhp,o.ko,o.bs||o.state,o.def.name];if(G.phase==='fight'){o.hp=0;__pvT.ko(G.p[0],o)}return r});console.log('ko',k,JSON.stringify(st));await p.waitForTimeout(5000)}
const fim=await p.evaluate(()=>{const G=__pvT.G();return {phase:G.phase,mode:G.mode,reg:(JSON.parse(localStorage.rk_bt||'[]')[0]||{}).m,tela:document.body.innerText.match(/VIT[ÓO]RIA|DERROTA|BOSS DERROTADO/i)?.[0]||''}});
await p.screenshot({path:'/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/boss374.png'});
console.log('inicio',h0,'\n25s',h1,'\nfim',JSON.stringify(fim),'\nERROS',errs);await b.close()})();
