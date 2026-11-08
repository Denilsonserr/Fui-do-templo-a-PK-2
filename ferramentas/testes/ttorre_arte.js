// v198: tela ANDAR VENCIDO (baús + troféus + cartas) e MOCHILA com as artes do dono. __twCh força nº de baús
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);
const errs=[];p.on('pageerror',e=>{errs.push((e.stack||e.message).slice(0,300))});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const shot=n=>p.screenshot({path:'/tmp/t8_'+n+'.png'});const wait=ms=>p.waitForTimeout(ms);
await p.evaluate(()=>{localStorage.setItem('tw_nome','"Teste"');for(const k of ['tw_inv','tw_eqp','tw_poc','tw_pocOn'])localStorage.removeItem(k)});
await p.click('#mTorre');await wait(500);await p.click('.tile[data-c="garou"]');await wait(300);await p.click('#goStage');await wait(800);
await p.click('#twGo');await wait(1600);
const fight=async(s)=>{await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await wait(400);
  await p.evaluate((s)=>{const G=__dbg.G;G.p[0].combo=s.c;G.p[1].hp=50;G.timer=1;G.tf=59},s);await p.waitForFunction(()=>__dbg.G.mode==='tower',null,{timeout:60000})};
await p.evaluate(()=>{window.__twCh=3});
await fight({c:22});await p.waitForSelector('#twModal .twAV');await wait(1200);await shot('av_fechado');await wait(3800);await shot('av_aberto');
console.log('INV',await p.evaluate(()=>localStorage.tw_inv+' | '+localStorage.tw_poc+' | '+localStorage.tw_eqp));
await p.click('#twModal .avp[data-i="0"]');await wait(2500);
// enche a mochila
await p.evaluate(()=>{const L=JSON.parse(localStorage.tw_poc||'[]');for(let i=0;i<8;i++)L.push({id:'p'+i,r:['comum','rara','epica','lend','mit'][i%5],v:[1,4,5,7,10][i%5]});localStorage.tw_poc=JSON.stringify(L);const I=JSON.parse(localStorage.tw_inv||'[]');for(let i=0;i<9;i++)I.push({id:'e'+i,t:['esp','arm','bot'][i%3],r:['comum','rara','epica','lend','mit'][i%5],v:[1,4,5,7,10][i%5]});localStorage.tw_inv=JSON.stringify(I)});
await p.click('#twBagB');await wait(800);await shot('mochila');
await p.click('#twModal .moS[data-k="eq"]');await wait(400);await shot('detalhe');await p.click('#twMoD button[data-a="eq"]');await wait(400);
await p.click('#twModal .moS[data-k="poc"]');await wait(300);await p.click('#twMoD button[data-a="beber"]');await wait(500);await shot('mochila2');
await p.click('#twBagX');await wait(300);
await p.evaluate(()=>{window.__twCh=0});await fight({c:0});await p.waitForSelector('#twModal .twAV');await wait(1500);await shot('av_semBau');
console.log('ERROS',JSON.stringify(errs));await b.close()})();
