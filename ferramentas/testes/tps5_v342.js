// v342: girar 5 passivas e escolher; código de 700 só ADM e 1 pessoa (C1). Servidor local 8790.
const {chromium}=require('playwright');const U='http://localhost:8790/index.html';const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/ps5_';const C1=process.env.C1;
(async()=>{const b=await chromium.launch();const errs=[];const out=[];
const ctx=async(nm,tit)=>{const c=await b.newContext({viewport:{width:915,height:412}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|googleapis/,r=>r.abort());
  await p.addInitScript(i=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,i)}},{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:JSON.stringify(nm),tw_tit:tit,rk_own:'["goku","vegeta"]',rk_ps:JSON.stringify({jn:12})});await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(6000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
  await p.click('#rkWrap [data-a="conta"]',{force:true});await p.waitForTimeout(400);await p.fill('#acP1','senha1');await p.fill('#acP2','senha1');await p.click('#acNew');await p.waitForTimeout(2500);await p.evaluate(()=>{const x=document.getElementById('acX');if(x)x.click();try{rkModal(null)}catch(e){}});return p};
const cod=async p=>{await p.evaluate(()=>{document.querySelector('#rkWrap [data-a="mn2Cfg"]').click()});await p.waitForTimeout(300);await p.evaluate(()=>document.getElementById('mnC1').click());await p.waitForTimeout(300);await p.fill('#rkCdI',C1);await p.evaluate(()=>document.getElementById('rkCdOk').click());await p.waitForTimeout(1500);const t=await p.evaluate(()=>{const e=document.getElementById('rkCdE');return e?e.textContent:'?'});await p.evaluate(()=>{const x=document.getElementById('rkMX');if(x)x.click();try{rkModal(null)}catch(e){}});return t};
const Z=await ctx('Ze','[]');out.push(['Ze (sem título)',await cod(Z)]);
const A=await ctx('Denilson ADM','["adm"]');out.push(['ADM',await cod(A)]);out.push(['ADM jn',await A.evaluate(()=>JSON.parse(localStorage.rk_ps).jn)]);
const A2=await ctx('Outro ADM','["adm"]');out.push(['outro ADM',await cod(A2)]);
// girar x5
await Z.click('#rkWrap [data-a="psMenu"]',{force:true});await Z.waitForTimeout(1500);await Z.click('#rkWrap [data-p="tg"][data-k="ch"]',{force:true});await Z.waitForTimeout(600);await Z.click('#rkWrap [data-p="sel"]',{force:true});await Z.waitForTimeout(600);
await Z.screenshot({path:SH+'tela.png'});await Z.click('#rkWrap [data-p="spin5"]',{force:true});await Z.waitForTimeout(6000);await Z.screenshot({path:SH+'escolher.png'});
out.push(['opções',await Z.evaluate(()=>[...document.querySelectorAll('#rkModal .psPkI span')].map(x=>x.innerText.replace(/\n/g,' ')).join(' | '))]);
const pick=await Z.evaluate(()=>{const b=document.querySelectorAll('#rkModal .psPkI')[1];const t=b.querySelector('span b').innerText;b.click();return t});await Z.waitForTimeout(800);
out.push(['escolheu',pick]);out.push(['ficou',await Z.evaluate(()=>{const o=JSON.parse(localStorage.rk_ps);return JSON.stringify({jn:o.jn,ch:o.ch,pend:o.pend,pendL:o.pendL})})]);await Z.screenshot({path:SH+'fim.png'});
console.log(out.map(x=>x.join(' → ')).join('\n'),'\nERROS',errs);await b.close()})();
