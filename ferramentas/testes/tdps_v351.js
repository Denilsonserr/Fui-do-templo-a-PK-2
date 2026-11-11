// v351: mede o dano por segundo de um jogador "bom" (IA combista) com dano x1 contra o Boss (com IA, defendendo) de defesa x1
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["vegeta"]',rk_sel:'"vegeta"',rk_lvrz:'1',rk_rp:'100000',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(4000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
await p.click('#rkWrap [data-a="boss"]',{force:true});await p.waitForTimeout(1200);await p.click('#rkWrap [data-a="start"]',{force:true});await p.waitForTimeout(1200);await p.click('#rkWrap [data-a="fight"]',{force:true});
await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:60000});
await p.evaluate(()=>{window.__autoP=1;const G=__pvT.G(),[a,o]=G.p;a.tdm=1;a.tcr=0;a.tcd=0;a.tdf=1;a.mhp=a.hp=a.hpLag=60*1800;o.tdf=1;o.tdm=1;o.tcr=0;o.mhp=o.hp=o.hpLag=60*1800;window.__h0=o.hp;window.__ha=a.hp;window.__t0=performance.now();window.__f0=G.frame});
for(let i=0;i<9;i++){await p.waitForTimeout(5000);console.log(await p.evaluate(()=>{const G=__pvT.G();return [G.frame,G.phase,G.paused,G.mode,G.hitstop,Math.round(G.p[1].hp)].join(' ')}))}
console.log(await p.evaluate(()=>{const G=__pvT.G(),o=G.p[1];const dmg=window.__h0-o.hp,sec=(G.frame-window.__f0)/60;return JSON.stringify({recebido:Math.round(window.__ha-G.p[0].hp),dano:Math.round(dmg),segundosDeJogo:+sec.toFixed(1),dps:+(dmg/sec).toFixed(1),layer:1800})}));
console.log('ERROS',errs);await b.close()})();
