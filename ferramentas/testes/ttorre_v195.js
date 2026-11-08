// v195: 4 cartas, carta secreta (forçada com window.__twSec=100), drop de equipamento, efeito na luta
const {chromium}=require('playwright');const SH='/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);
const errs=[];p.on('pageerror',e=>{errs.push((e.stack||e.message).slice(0,300))});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const shot=n=>p.screenshot({path:SH+'t5_'+n+'.png'});const wait=ms=>p.waitForTimeout(ms);
await p.evaluate(()=>localStorage.setItem('tw_nome','"Teste"'));
await p.click('#mTorre');await wait(500);await p.click('.tile[data-c="garou"]');await wait(300);await p.click('#goStage');await wait(800);
await p.click('#twGo');await wait(1600);
const fight=async()=>{await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await wait(400);
  const st=await p.evaluate(()=>{const [a]=__dbg.G.p;return {tdm:a.tdm,tsp:a.tsp,tdf:+a.tdf.toFixed(3),tsb:a.tsb,sb:a.sb,mhp:a.mhp,hp:a.hp}});console.log('LUTA',JSON.stringify(st));
  await p.evaluate(()=>{const G=__dbg.G;G.p[1].hp=50;G.timer=1;G.tf=59});await p.waitForFunction(()=>__dbg.G.mode==='tower',null,{timeout:60000})};
await fight();await p.waitForSelector('#twModal .twp');await wait(1300);await shot('cartas');
await p.evaluate(()=>{window.__twSec=100});
// andar 1: escolhe carta normal; andar 2: secreta
await p.click('#twModal .twp[data-i="0"]');await p.waitForFunction(()=>document.querySelector('#twModal .eqc'),null,{timeout:10000});await wait(1200);await shot('equip');
await p.click('#twModal .twp[data-i="0"]');await wait(2500);await shot('painel');
console.log('TW1',JSON.stringify(await p.evaluate(()=>({pas:__TW.pas,eq:__TW.eq,bars:__TW.bars}))));
await fight();await p.waitForSelector('#twModal .twp.sec');await wait(1300);await shot('secreta');
await p.click('#twModal .twp.sec');await p.waitForFunction(()=>document.querySelector('#twModal .eqc'),null,{timeout:10000});await p.click('#twModal .twp[data-i="1"]');await wait(2500);await shot('painel2');
console.log('TW2',JSON.stringify(await p.evaluate(()=>({pas:__TW.pas,eq:__TW.eq,bars:__TW.bars,tr:__TW.tr.map(t=>t.k)}))));
await p.evaluate(()=>{window.__twSec=0});await fight();
// estatística dos sorteios
console.log('ERROS',JSON.stringify(errs));await b.close()})();
