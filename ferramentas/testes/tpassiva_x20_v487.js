// v487: girar passiva x5/x10/x20 + código de Pedras das Almas (ADM)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const out={};
for(const adm of [1,0]){const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(adm=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:adm?'"Denilson ADM"':'"Bia"',tw_tit:adm?'["adm"]':'[]',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',rk_ps:'{"jn":30}',rk_own:'["goku","vegeta"]'})}},adm);
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const r={};r.cup=await p.evaluate(async c=>{const E=document.createElement('div');await __cup(c,E);return E.textContent+' | '+localStorage.rk_pdr2},'PEDRASALMALW5TM7');
if(adm){await p.click('#mRank');await p.waitForTimeout(6000);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});await p.evaluate(()=>__ps.open());await p.waitForTimeout(1500);await p.click('#rkWrap [data-p="tg"][data-k="ch"]',{force:true});await p.waitForTimeout(600);await p.screenshot({path:'/tmp/ps20o.png'});await p.click('#rkWrap [data-p="sel"]',{force:true,timeout:5000}).catch(()=>{});await p.waitForTimeout(600);
r.btn=await p.evaluate(()=>[...document.querySelectorAll('.psAct button')].map(b=>b.textContent+(b.disabled?'(off)':'')).join(' '));await p.screenshot({path:'/tmp/ps20a.png'});
await p.evaluate(()=>document.querySelector('#rkWrap [data-p="spin20"]').click());await p.waitForTimeout(5000);
r.pick=await p.evaluate(()=>document.querySelectorAll('#rkModal .psPkI').length+' itens · joias '+JSON.parse(localStorage.rk_ps).jn);await p.screenshot({path:'/tmp/ps20b.png'})}
r.err=E.slice(0,3);out[adm?'adm':'normal']=r;await p.close()}console.log(JSON.stringify(out,null,1));await b.close()})();
