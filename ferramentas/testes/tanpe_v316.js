// v316: anéis da alma no chão em volta do personagem (perfil, biblioteca, equipamentos) e no perfil dos outros
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const an=[{i:'a1',c:1,g:5,s:'dano',v:12,a:0,l:20},{i:'a2',c:2,g:3,s:'crit',v:17,a:0,l:12},{i:'a3',c:3,g:6,s:'vel',v:75,a:60000,l:30},{i:'a4',c:4,g:7,s:'dano',v:200,a:0,l:50}];
 Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Teste"',rk_sel:'"goku"',rk_own:'["goku"]',rk_lv:JSON.stringify({goku:{lv:40,t:[]}}),rk_an:JSON.stringify(an),rk_anEq:JSON.stringify({goku:['a1','a2','a3','a4',null,null,null,null]})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(6000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
await p.evaluate(()=>document.querySelector('#rkWrap [data-a="perfil"]').click());await p.waitForTimeout(2500);await p.screenshot({path:'shots/anpe_pf.png'});const n1=await p.evaluate(()=>document.querySelectorAll('.anFt .ar').length);
await p.waitForTimeout(2600);await p.screenshot({path:'shots/anpe_pf2.png'});
await p.evaluate(()=>document.querySelector('#rkWrap [data-a="pfAnEq"]').click());await p.waitForTimeout(2500);await p.screenshot({path:'shots/anpe_lib.png'});const n2=await p.evaluate(()=>document.querySelectorAll('.anFt .ar').length);
console.log({perfil:n1,biblioteca:n2},'erros',JSON.stringify(errs));await b.close()})();
