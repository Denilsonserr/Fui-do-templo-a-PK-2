// v598: efeitos animados dos tiros do Alucard (clarão, traçante, laser, tiro grosso, impacto, cápsulas) — prints quadro a quadro
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'alucard',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.waitForTimeout(300);await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:60000});await p.waitForTimeout(1200);
const W=ms=>p.waitForTimeout(ms);await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;a.x=200;o.x=740;a.facing=1});await W(200);
const hp0=await p.evaluate(()=>__dbg.G.p[1].hp);
for(let i=0;i<5;i++){await p.keyboard.press('j');for(let k=0;k<3;k++){await W(60);await p.screenshot({path:SH+`tiro_${i}_${k}.png`})}await W(i===2?120:40)}
await W(700);await p.evaluate(()=>{const G=__dbg.G;G.p[0].ki=100});await p.keyboard.press('l');for(let k=0;k<5;k++){await W(70);await p.screenshot({path:SH+`triplo_${k}.png`})}
await W(800);const n=0;
const hp1=await p.evaluate(()=>__dbg.G.p[1].hp);console.log('dano',Math.round(hp0-hp1),JSON.stringify(n));
console.log(errs.length?'ERROS '+errs.slice(0,5).join(' | '):'sem erros');await b.close()})();
