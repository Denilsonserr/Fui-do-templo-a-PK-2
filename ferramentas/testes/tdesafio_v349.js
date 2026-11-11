// v349: desafio do dia (abrir, lutar, vencer forçando nocaute) + força do Boss por nível
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/dsf_';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","vegeta"]',rk_sel:'"goku"',rk_lvrz:'1',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0}),rk_lv:JSON.stringify({goku:{lv:20,c:[]}})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(4000);
await p.screenshot({path:SH+'menu.png'});await p.click('#rkWrap [data-a="dsf"]',{force:true});await p.waitForTimeout(800);await p.screenshot({path:SH+'abrir.png'});console.log(await p.evaluate(()=>document.querySelector('.dsfM')?.innerText.replace(/\n+/g,' ')));
await p.click('#dsfGo');await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:60000});
console.log('luta',await p.evaluate(()=>{const [a,o]=__pvT.G().p;return JSON.stringify({eu:[a.def.id,+a.tdm.toFixed(2),+a.tdf.toFixed(2)],rival:[o.def.id,+o.tdm.toFixed(2),+o.tdf.toFixed(2),o.tls||0]})}));
await p.waitForTimeout(5000);await p.screenshot({path:SH+'luta.png'});
for(let k=0;k<2;k++){await p.waitForFunction(()=>__pvT.G().phase==='fight',null,{timeout:60000}).catch(()=>{});await p.evaluate(()=>{const G=__pvT.G(),o=G.p[1];o.hp=0;__pvT.ko(G.p[0],o)});await p.waitForTimeout(6000)}
await p.waitForTimeout(2000);await p.screenshot({path:SH+'fim.png'});console.log('fim',await p.evaluate(()=>[document.querySelector('#lvrzM')?.innerText.replace(/\n+/g,' '),localStorage.rk_dsf]));
console.log('boss',JSON.stringify(await p.evaluate(()=>[0,2,5,8,10].map(l=>{const s=__pvT.bs(l);return l+': '+s.atk+'/'+s.def}))));
console.log('ERROS',errs);await b.close()})();
