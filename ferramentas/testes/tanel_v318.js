// v316: anéis da alma no chão em volta do personagem (perfil, biblioteca, equipamentos) e no perfil dos outros
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const an=[0,1,2,3,4,5,6,7].map(i=>({i:'a'+i,c:[1,1,1,1,1,3,4,4][i],g:5,s:'dano',v:10,a:0,l:20}));
 Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Teste"',rk_sel:'"shaka"',rk_ped:'"shaka"',rk_own:'["goku","shaka"]',rk_lv:JSON.stringify({shaka:{lv:80,t:[]}}),rk_an:JSON.stringify(an),rk_anEq:JSON.stringify({shaka:['a0','a1','a2','a3','a4','a5','a6','a7']})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(6000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});
await p.evaluate(()=>document.querySelector('#rkWrap [data-a="perfil"]').click());await p.waitForTimeout(2500);await p.screenshot({path:'shots/anpe_pf.png'});const n1=await p.evaluate(()=>document.querySelectorAll('.anFt .ar').length);
await p.waitForTimeout(2600);await p.screenshot({path:'shots/anpe_pf2.png'});
await p.evaluate(()=>document.querySelector('#rkWrap [data-a="pfAnEq"]').click());await p.waitForTimeout(2500);await p.screenshot({path:'shots/anpe_lib.png'});const n2=await p.evaluate(()=>document.querySelectorAll('.anFt .ar').length);
console.log({perfil:n1,biblioteca:n2},'erros',JSON.stringify(errs));await b.close()})();
