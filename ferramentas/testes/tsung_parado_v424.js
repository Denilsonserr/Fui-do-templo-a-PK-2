// v424: Sung parado — pose 1 (espada no ombro, respirando) e de vez em quando pose 2 (espada no chão, casaco ao vento); andar novo
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:1,a:'sung',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);
const K=()=>p.evaluate(()=>{const G=__dbg.G;return (G.frame%660)});
await p.evaluate(()=>{const G=__dbg.G;G.frame=G.frame-G.frame%660+60});await p.waitForTimeout(300);await p.screenshot({path:SH+'sjp_1.png'});
await p.evaluate(()=>{const G=__dbg.G;G.frame=G.frame-G.frame%660+430});await p.waitForTimeout(500);await p.screenshot({path:SH+'sjp_2.png'});await p.waitForTimeout(450);await p.screenshot({path:SH+'sjp_3.png'});
await p.evaluate(()=>{const G=__dbg.G;G.frame=G.frame-G.frame%660+60});
await p.keyboard.down('d');await p.waitForTimeout(350);await p.screenshot({path:SH+'sjp_4.png'});await p.waitForTimeout(250);await p.screenshot({path:SH+'sjp_5.png'});await p.keyboard.up('d');
console.log(JSON.stringify({k:await K()}),errs.slice(0,3));await b.close()})();
