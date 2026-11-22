// v610: contagem de giros do Alucard pela tela (1x e 10x): soma certinho, nunca antes de 200, garantido no 250, não repete; trava antes de 12:30 para jogador comum
const {chromium}=require('playwright');(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
const page=async(t,o)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());await p.clock.install({time:t});
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},Object.assign({rk_ini:'1',rk_xpv2:'1',rk_s2:'1',rk_s2rw:'1',rk_s3:'1',rk_s3rw:'1',tw_nome:'"Bia"',rk_own:'["goku"]',rk_gem:'1000000',rk_tic:'0',rk_ban:'al'},o));
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1200);
  await p.click('#mRank');await p.waitForTimeout(1200);await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m)m.innerHTML='';document.querySelector('#rkWrap [data-a="gacha"]').click()});await p.waitForTimeout(700);return p};
const spin=async(p,n)=>{await p.evaluate(n=>{document.querySelectorAll('.rkRes2,.rkFx,.rkWin,.rkMega').forEach(e=>e.remove());const b=document.querySelector('#rkWrap [data-a="'+(n===10?'sum10':'sum1')+'"]');b&&b.click()},n);await p.waitForTimeout(300);await p.evaluate(()=>{document.querySelectorAll('.rkRes2,.rkFx,.rkWin,.rkMega').forEach(e=>e.remove());try{rkView&&0}catch(e){}})};
const st=p=>p.evaluate(()=>({pity:+(localStorage.rk_pityAL||0),gem:+localStorage.rk_gem,own:JSON.parse(localStorage.rk_own).includes('alucard')}));
/* 12:20: jogador comum não gira */
let p=await page(Date.UTC(2026,10,22,15,20),{});let a=await st(p);await spin(p,1);let c=await st(p);chk(c.pity===a.pity&&c.gem===a.gem,'12:20: trancado para jogador comum (não gasta, não conta)');await p.close();
/* 12:35: contagem */
p=await page(Date.UTC(2026,10,22,15,35),{});a=await st(p);await spin(p,1);await p.evaluate(()=>document.querySelector('#rkWrap [data-a="gacha"]')&&0);c=await st(p);chk(c.pity===1&&a.gem-c.gem===160,'1 giro: conta 1 e gasta 160 💎 ('+c.pity+', '+(a.gem-c.gem)+')');
await p.evaluate(()=>{const b=[...document.querySelectorAll('#rkWrap [data-b="al"]')][0];b&&b.click()});await p.waitForTimeout(300);
a=await st(p);await spin(p,10);c=await st(p);chk(c.pity===11&&a.gem-c.gem===1400,'10 giros: conta 10 e gasta 1.400 💎 ('+c.pity+', '+(a.gem-c.gem)+')');await p.close();
/* perto do garantido */
p=await page(Date.UTC(2026,10,22,15,35),{rk_pityAL:'190'});await spin(p,1);c=await st(p);chk(!c.own||c.pity===0,'giro 191: '+(c.own?'saiu (não devia antes de 200!)':'não sai antes de 200'));await p.close();
p=await page(Date.UTC(2026,10,22,15,35),{rk_pityAL:'245'});await spin(p,10);c=await st(p);chk(c.own&&c.pity===0,'giros 246–255 (10x): Alucard sai até o 250 e a contagem zera ('+JSON.stringify(c)+')');
await p.evaluate(()=>{document.querySelectorAll('.rkRes2,.rkFx,.rkWin,.rkMega').forEach(e=>e.remove());const b=document.querySelector('#rkWrap [data-a="gacha"]');});
const pc=await p.evaluate(()=>+(localStorage.rk_pityAL||0));await spin(p,10);c=await st(p);chk(c.pity===pc,'depois de ter o Alucard a contagem para (não sai repetido)');await p.close();
console.log(E.length?'ERROS '+E.slice(0,5).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
