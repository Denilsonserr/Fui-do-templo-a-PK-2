// Teste do Modo Torre (v171): tela, revelação, luta, passivas, chefe, derrota, ranking (Firestore simulado). Uso: NODE_PATH=<node_modules globais> node ttorre.js [largura altura]
const {chromium}=require('playwright');const fs=require('fs');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';fs.mkdirSync(SH,{recursive:true});
const W=+process.argv[2]||915,H=+process.argv[3]||412;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);
const errs=[];p.on('pageerror',e=>{errs.push((e.stack||e.message).slice(0,300));console.log('PAGEERR',(e.stack||e.message).slice(0,400))});await p.route(/fonts\.g/,r=>r.abort());
const DB=[{nome:'Zé',andar:7,tempo:301,trof:22,char:'naruto'},{nome:'Zé',andar:7,tempo:280,trof:18,char:'naruto'},{nome:'Bia',andar:5,tempo:200,trof:8,char:'naruto'},{nome:'Zé',andar:7,tempo:301,trof:22,char:'goku'},{nome:'Ana',andar:4,tempo:200,trof:9,char:'zoro'}];const SENT=[];
await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url(),body=r.request().postData();
  if(/:runQuery/.test(u)){const pts=e=>e.andar*1e7+e.trof*1e4+9999-e.tempo;const Q=JSON.parse(body).structuredQuery,wc=Q.where&&Q.where.fieldFilter.value.stringValue;const L=DB.filter(e=>!wc||e.char===wc).slice().sort((a,b)=>pts(b)-pts(a)).map(e=>({document:{createTime:e.ct||'2026-11-01T00:00:00Z',fields:{v:{integerValue:''+(e.v||171)},nome:{stringValue:e.nome},andar:{integerValue:''+e.andar},tempo:{integerValue:''+e.tempo},trof:{integerValue:''+e.trof},char:{stringValue:e.char},pontos:{integerValue:''+pts(e)}}}}));
    return r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(L)})}
  const F=JSON.parse(body).fields;SENT.push(F);DB.push({nome:F.nome.stringValue,andar:+F.andar.integerValue,tempo:+F.tempo.integerValue,trof:+F.trof.integerValue,char:F.char.stringValue,v:+F.v.integerValue,ct:'2026-11-08T00:00:00Z'});
  return r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{}'})});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const shot=n=>p.screenshot({path:SH+'tw_'+n+'.png'});const wait=ms=>p.waitForTimeout(ms);
await p.click('#mTorre');await wait(500);await p.click('.tile[data-c="naruto"]');await wait(300);await shot('sel');
await p.click('#goStage');await wait(800);await shot('tela');
await p.click('#twGo');await wait(400);await p.fill('#twName0','Denilson');await p.click('#twNmOk');await wait(1600);await shot('revela');
const fight=async(lose)=>{await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await wait(400);
  const st=await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;return {opp:o.def.id,diff:G.diff,hp:a.hp,tdm:a.tdm,tsp:a.tsp,tdf:a.tdf,otdm:o.tdm,otdf:o.tdf,oform:o.form,trans:!!G.trans,pm:a.mhp,om:o.mhp,ohp:o.hp,timer:G.timer,stg:__dbg.stg(),ring:G.ring&&G.ring.title}});console.log('LUTA',JSON.stringify(st));
  await p.evaluate((lose)=>{const G=__dbg.G;if(lose){G.p[0].hp=50}else{G.p[1].hp=50;G.p[0].hp=G.p[0].mhp*.5;G.p[0].combo=11}G.timer=1;G.tf=59},lose);
  await p.waitForFunction(()=>__dbg.G.mode==='tower',null,{timeout:60000})};
await fight(false);await wait(700);await shot('x');await p.waitForSelector('#twModal .twp');await wait(1200);await shot('passiva');await p.evaluate(()=>{const b=document.querySelector('#twModal .twp[data-i="0"]');b.className='twp mit';b.style.setProperty('--c','#ff2e63');b.querySelector('.rr').textContent='MÍTICA'});await wait(400);await shot('mitica');
await p.evaluate(()=>{const b=[...document.querySelectorAll('#twModal .twp')].find(x=>x.textContent.includes('BARRA'));window.__pickB=!!b});await p.click('#twModal .twp[data-i="1"]');await wait(1800);await shot('depois');
console.log('TW',JSON.stringify(await p.evaluate(()=>({bars:__TW.bars,hpv:__TW.hpv,fl:__TW.fl,hp:__TW.hp,pas:__TW.pas,tr:__TW.tr.map(t=>t.k)}))));
// pula pro chefe
await p.evaluate(()=>{__TW.fl=6;__TW.rev=true;document.querySelector('#twGo').click()});await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await wait(1500);console.log('CHEFE',JSON.stringify(await p.evaluate(()=>({om:__dbg.G.p[1].mhp,pm:__dbg.G.p[0].mhp,timer:__dbg.G.timer,opp:__dbg.G.p[1].def.id,trans:!!__dbg.G.trans,form:__dbg.G.p[1].form,diff:__dbg.G.diff}))));await shot('chefe');
await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:60000});await wait(800);await shot('chefe_hud');console.log('CHEFE2',JSON.stringify(await p.evaluate(()=>({form:__dbg.G.p[1].form}))));
await p.evaluate(()=>{const G=__dbg.G;G.p[0].hp=50;G.timer=1;G.tf=59});await p.waitForFunction(()=>__dbg.G.mode==='tower',null,{timeout:60000});await wait(1500);await shot('derrota');
await wait(800);await shot('enviado');console.log('ENVIADO',JSON.stringify(SENT));
await p.click('#twRk');await wait(800);await shot('ranking');
await p.click('#twModal .twTab button[data-t="f"]');await wait(600);await shot('rk_trof');await p.click('#twModal .twTab button[data-t="c"]');await wait(700);await shot('rk_pers');await p.click('#twModal .twTab button[data-t="m"]');await wait(300);await shot('meus');
await p.click('#twRkX');await wait(300);await shot('fim2');
await p.click('#twAgain');await wait(1500);await shot('denovo');
console.log('ERROS',JSON.stringify(errs));await b.close()})();
