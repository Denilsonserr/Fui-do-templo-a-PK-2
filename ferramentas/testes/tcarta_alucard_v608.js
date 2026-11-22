// v608: carta do ALUCARD na revelação da invocação e no ÁLBUM (página HELLSING)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());await p.clock.install({time:Date.UTC(2026,10,22,16,30)});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',tw_nome:'"Bia"',rk_own:'["goku"]',rk_gem:'100000',rk_tic:'0',rk_ban:'al',rk_pityAL:'249'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#mRank');await p.waitForTimeout(1200);await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m)m.innerHTML='';document.querySelector('#rkWrap [data-a="gacha"]').click()});await p.waitForTimeout(800);
await p.evaluate(()=>document.querySelector('#rkWrap [data-a="sum1"]').click());await p.waitForTimeout(1200);await p.evaluate(()=>{const f=document.querySelector('.alFx');f&&f.click()});
let card=null;for(let i=0;i<40&&!card;i++){await p.waitForTimeout(250);card=await p.evaluate(()=>{const i=[...document.querySelectorAll('img')].find(x=>/5317c70e4817b6/.test(x.src)&&x.getBoundingClientRect().width>20);return i?1:null});if(!card)await p.evaluate(()=>{const o=document.querySelector('.rkMega,.rkWin');o&&o.click&&0})}
await p.waitForTimeout(2500);await p.screenshot({path:SH+'carta_giro.png'});chk(card,'ganhou o Alucard: aparece a CARTA dele');
const own=await p.evaluate(()=>JSON.parse(localStorage.rk_own));chk(own.includes('alucard'),'Alucard liberado');
for(let i=0;i<12;i++){await p.evaluate(()=>{for(const s of ['.rkMega','.rkWin','.rkRes2 #rkCdOk','.rkRes2 #rkCdAll'])document.querySelectorAll(s).forEach(e=>e.click())});await p.waitForTimeout(300)}
await p.evaluate(()=>{document.querySelectorAll('.rkRes2,.rkWin,.rkMega,.rkFx').forEach(e=>e.remove());const m=document.getElementById('rkModal');if(m)m.innerHTML=''});
await p.evaluate(()=>{const b=[...document.querySelectorAll('#rkWrap [data-a]')].find(x=>x.dataset.a==='home'||x.dataset.a==='back');b&&b.click()});await p.waitForTimeout(600);
await p.evaluate(()=>{const b=[...document.querySelectorAll('#rkWrap [data-a="perfil"]')][0];b&&b.click()});await p.waitForTimeout(1200);
await p.evaluate(()=>{const b=[...document.querySelectorAll('#rkWrap *')].find(x=>Object.values(x.dataset||{}).includes('p3al'));b&&b.click()});await p.waitForTimeout(900);
for(let i=0;i<14;i++){const t=await p.evaluate(()=>document.querySelector('#rkWrap').innerText);if(/HELLSING/.test(t))break;await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="alPg"][data-d="1"]');b&&b.click()});await p.waitForTimeout(300)}
await p.evaluate(()=>{const b=[...document.querySelectorAll('#rkWrap [data-i]')].find(x=>/HELLSING/.test(x.innerText));b&&b.click()});await p.waitForTimeout(700);const pg=await p.evaluate(()=>[...document.querySelectorAll('#rkWrap *')].some(e=>e.children.length===0&&/^HELLSING$/.test((e.textContent||'').trim())&&e.getBoundingClientRect().top<80));chk(pg,'álbum tem a página HELLSING');
await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-a="alAll"]');b&&b.click()});await p.waitForTimeout(700);
const inAl=await p.evaluate(()=>!![...document.querySelectorAll('#rkWrap img')].find(x=>/5317c70e4817b6/.test(x.src)));chk(inAl,'carta do Alucard colada no álbum');await p.screenshot({path:SH+'album_hellsing.png'});
console.log(E.length?'ERROS '+E.slice(0,5).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
