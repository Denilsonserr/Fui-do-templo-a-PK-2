// v604: menu novo do Alucard + Invocação Ilimitada do ALUCARD (3ª aba): trava até 22/11 13:00, 160/1400 💎, 2 tickets por giro, Alucard só depois do giro 200 e garantido no 250, anel vermelho
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
const page=async(t0,extra)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());await p.clock.install({time:t0});
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},Object.assign({rk_ini:'1',rk_xpv2:'1',tw_nome:'"Bia"',rk_own:'["goku"]',rk_gem:'100000',rk_tic:'5'},extra||{}));
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);return p};
const st=p=>p.evaluate(()=>({gem:+localStorage.rk_gem,tic:+localStorage.rk_tic,ALLC:__dbg&&typeof ALLC}));
/* ANTES das 13:00 */
let p=await page(Date.UTC(2026,10,22,13,30));
await p.click('#mRank');await p.waitForTimeout(1500);await p.screenshot({path:SH+'menu_alucard.png'});
const al0=await p.evaluate(()=>!!document.querySelector('#roster .tile[data-c="alucard"]:not([hidden])'));chk(!al0,'antes das 13:00: Alucard NÃO aparece na lista para jogador comum');
await p.evaluate(q=>{const m=document.getElementById('rkModal');if(m&&m.querySelector('.dlC'))m.innerHTML='';document.querySelector(q).click()},'#rkWrap [data-a="mnModos"]');await p.waitForTimeout(400);const mo=await p.evaluate(()=>!!document.getElementById('mnMo1'));chk(mo,'"Modos de Jogo" abre a escolha com PVP RANQUEADA');await p.screenshot({path:SH+'menu_modos.png'});await p.evaluate(()=>document.getElementById('rkMX').click());await p.waitForTimeout(200);
await p.evaluate(q=>{const m=document.getElementById('rkModal');if(m&&m.querySelector('.dlC'))m.innerHTML='';document.querySelector(q).click()},'#rkWrap [data-a="gacha"]');await p.waitForTimeout(800);const tab=await p.evaluate(()=>!!document.querySelector('#rkWrap [data-b="al"]'));chk(tab,'3ª aba da invocação = ALUCARD');
await p.evaluate(q=>{const m=document.getElementById('rkModal');if(m&&m.querySelector('.dlC'))m.innerHTML='';document.querySelector(q).click()},'#rkWrap [data-b="al"]');await p.waitForTimeout(800);await p.screenshot({path:SH+'gacha_alucard_lock.png'});
const g0=await st(p);await p.evaluate(q=>{const m=document.getElementById('rkModal');if(m&&m.querySelector('.dlC'))m.innerHTML='';document.querySelector(q).click()},'#rkWrap [data-a="sum1"]');await p.waitForTimeout(500);const g1=await st(p);chk(g0.gem===g1.gem&&g0.tic===g1.tic,'antes das 13:00 não deixa girar');await p.close();
/* DEPOIS das 13:00 */
p=await page(Date.UTC(2026,10,22,16,5),{rk_ban:'al'});
const al1=await p.evaluate(()=>!!document.querySelector('#roster .tile[data-c="alucard"]:not([hidden])'));chk(al1,'depois das 13:00: Alucard aparece na lista de personagens');
await p.click('#mRank');await p.waitForTimeout(1200);await p.evaluate(q=>{const m=document.getElementById('rkModal');if(m&&m.querySelector('.dlC'))m.innerHTML='';document.querySelector(q).click()},'#rkWrap [data-a="gacha"]');await p.waitForTimeout(900);await p.screenshot({path:SH+'gacha_alucard.png'});
let a=await st(p);await p.evaluate(q=>{const m=document.getElementById('rkModal');if(m&&m.querySelector('.dlC'))m.innerHTML='';document.querySelector(q).click()},'#rkWrap [data-a="sum1"]');await p.waitForTimeout(400);let c=await st(p);chk(a.tic-c.tic===2&&a.gem===c.gem,'1 giro com ticket = 2 tickets ('+a.tic+'→'+c.tic+')');
await p.evaluate(()=>{document.querySelectorAll('.rkRes2,.rkFx').forEach(e=>e.remove());localStorage.rk_tic='0'});await p.evaluate(()=>{});
const cost=await p.evaluate(()=>[__pvT.alCost(1),__pvT.alCost(10)]);chk(cost[0].g===160&&cost[1].g===1400&&!cost[0].t,'sem ticket: 1 giro = 160 💎, 10 giros = 1.400 💎');
await p.evaluate(()=>{localStorage.rk_tic='20'});const c20=await p.evaluate(()=>__pvT.alCost(10));chk(c20.t===20&&c20.g===0,'10 giros com tickets = 20 tickets');
/* sorteio: quando o Alucard sai */
const sim=await p.evaluate(()=>{const R=[];let ring=0,tot=0;for(let k=0;k<40;k++){localStorage.rk_pityAL='0';localStorage.rk_own='["goku"]';let at=-1;for(let i=1;i<=300;i++){const x=__pvT.alRoll();tot++;if(x.k==='ring')ring++;if(x.k==='chr'&&x.id==='alucard'){at=i;break}}R.push(at)}return {R,ring,tot}});
chk(sim.R.every(v=>v>=200&&v<=250),'Alucard sai só entre o giro 200 e 250 (40 simulações: '+Math.min(...sim.R)+' a '+Math.max(...sim.R)+')');
chk(sim.ring>0,'anel vermelho sai na invocação ('+sim.ring+' em '+sim.tot+' = '+(sim.ring/sim.tot*100).toFixed(2)+'%)');
console.log(E.length?'ERROS '+E.slice(0,5).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
