// v197: botas (velocidade) e poção de uso único (transformação). __twEq/__twPo forçam os drops
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);
const errs=[];p.on('pageerror',e=>{errs.push((e.stack||e.message).slice(0,300))});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const shot=n=>p.screenshot({path:'/tmp/t7_'+n+'.png'});const wait=ms=>p.waitForTimeout(ms);
// mochila antiga da v196 com uma poção de velocidade -> deve virar poção de uso único
await p.evaluate(()=>{localStorage.setItem('tw_nome','"Teste"');localStorage.setItem('tw_inv',JSON.stringify([{id:'a1',t:'poc',r:'rara',v:4},{id:'a2',t:'esp',r:'comum',v:1}]));localStorage.setItem('tw_eqp',JSON.stringify({poc:'a1',esp:'a2'}));localStorage.removeItem('tw_poc');localStorage.removeItem('tw_pocOn')});
await p.reload();await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
console.log('MIGRA',await p.evaluate(()=>[localStorage.tw_inv,localStorage.tw_eqp,localStorage.tw_poc].join(' | ')));
await p.click('#mTorre');await wait(500);await p.click('.tile[data-c="garou"]');await wait(300);await p.click('#goStage');await wait(800);
await p.click('#twBagB');await wait(600);await shot('mochila');await p.click('#twModal .bgp');await wait(500);await shot('bebeu');await p.click('#twBagX');await wait(300);
await p.click('#twGo');await wait(1600);
const fight=async()=>{await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await wait(400);
  const st=await p.evaluate(()=>{const [a]=__dbg.G.p;return {tdm:a.tdm,tsp:a.tsp,tsb:a.tsb,sb:+(a.sb||0).toFixed(2),on:localStorage.tw_pocOn}});console.log('LUTA',JSON.stringify(st));
  await p.evaluate(()=>{const G=__dbg.G;G.p[1].hp=50;G.timer=1;G.tf=59});await p.waitForFunction(()=>__dbg.G.mode==='tower',null,{timeout:60000})};
await p.evaluate(()=>{window.__twEq=1;window.__twPo=1});
await fight();await p.waitForSelector('#twCards:not([hidden])',{timeout:15000});await wait(800);await shot('baus');
await p.click('#twModal .twp[data-i="0"]');await wait(2500);
await p.click('#twBagB');await wait(600);await shot('mochila2');await p.click('#twBagX');
await fight();
console.log('ERROS',JSON.stringify(errs));await b.close()})();
