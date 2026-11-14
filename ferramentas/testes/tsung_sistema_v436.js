// v436: SISTEMA DO JOGADOR do Sung — abre pelo teste do ADM, escolhe classe, missão dá XP e nível, + atributo, sombras/inventário; na luta: bônus, só necromante invoca
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',tn_best:'6',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'sung',b:'goku',s:'cupula'})})}});
await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.click('#admSJ');await p.waitForTimeout(700);await p.screenshot({path:SH+'sys_classe.png'});
await p.click('.sjCc[data-k="necro"]');await p.waitForTimeout(500);await p.screenshot({path:SH+'sys_tela.png'});
await p.click('[data-s="ms"]');await p.waitForTimeout(400);await p.screenshot({path:SH+'sys_missoes.png'});
const before=await p.evaluate(()=>{const o=__pvT.sjSys();return [o.lv,o.pts]});
await p.click('.sjMs button[data-k="t3"]');await p.waitForTimeout(300);await p.click('.sjMs button[data-k="t6"]');await p.waitForTimeout(300);
const after=await p.evaluate(()=>{const o=__pvT.sjSys();return [o.lv,o.pts,o.xp]});await p.screenshot({path:SH+'sys_lvup.png'});
await p.click('.sjPx');await p.waitForTimeout(200);for(let i=0;i<5;i++){await p.click('[data-s="+"][data-k="per"]');await p.waitForTimeout(60)}
const st=await p.evaluate(()=>{const o=__pvT.sjSys();return [o.st.per,o.pts]});await p.screenshot({path:SH+'sys_pontos.png'});
await p.click('[data-s="sh"]');await p.waitForTimeout(300);await p.screenshot({path:SH+'sys_sombras.png'});await p.click('.sjPx');await p.click('[data-s="x"]');await p.waitForTimeout(200);
await p.click('#admTB');await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
const fight=await p.evaluate(()=>{const a=__dbg.G.p[0];return {sjS:!!a.sjS,dg:a.sjS&&a.sjS.dg,cls:a.sjS&&a.sjS.cls,tdm:a.tdm}});
await p.waitForFunction(()=>__pvT.sjOK(),null,{timeout:60000});await p.keyboard.press('u');await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:30000});await p.waitForTimeout(300);
await p.keyboard.press('o');await p.waitForTimeout(300);await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:30000});await p.waitForTimeout(800);const urso=await p.evaluate(()=>{const B=__pvT.sjB();return B&&{hp:B.hp,dm:B.dm}});
console.log(JSON.stringify({before,after,st,fight,urso,cnt:await p.evaluate(()=>__pvT.sjSys().cnt)}),errs.slice(0,4));await b.close()})();
