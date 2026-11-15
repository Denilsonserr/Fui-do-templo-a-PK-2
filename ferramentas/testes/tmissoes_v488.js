// v488: missões do passe contam a Torre nova (1x por andar); "Invoque sombras" vira "Vença com o Sung" para quem não invoca
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const out={};
for(const cls of ['','necro']){const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(cls=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',rk_urso:'1',rk_sjs:JSON.stringify({cls,eq:'tank',sh:['tank']})})}},cls);
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
out[cls||'sem classe']=await p.evaluate(()=>{const T=__mis.tn();T.g=0;__mis.cnt(0);__mis.cnt(0);T.g=1;__mis.cnt(1);
  const o=__mis.bp(),s=__mis.sj();return {passe:o.d,evento:o.e,sung:s.d}});
await p.evaluate(()=>{const b=document.querySelector('#mRank');b&&b.click()});await p.waitForTimeout(6000);
out[(cls||'sem classe')+' tela']=await p.evaluate(()=>{try{rkModal(null)}catch(e){}return __mis.ms()});await p.screenshot({path:'/tmp/sjms_'+(cls||'x')+'.png'});
out[(cls||'sem classe')+' err']=E.slice(0,3);await p.close()}
console.log(JSON.stringify(out,null,1));await b.close()})();
