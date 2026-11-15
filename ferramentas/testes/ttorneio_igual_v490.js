// v490: torneio THE BEST igual para todos (andar 1, ULTRA, risco normal, sem bônus)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const out={};
for(const live of [1,0]){const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(live=>{if(live)window.__twEvT=[-60000,3600000];if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',tw_tit:'["adm","best"]',tw_titOn:'"best"',tn_best:'8',tn_sel:'1',tn_risk:'2',rk_own:'["goku","shaka"]',rk_sel:'"shaka"'})}},live);
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__tb2.go());await p.waitForTimeout(14000);
out[live?'AO VIVO':'fora do torneio']=await p.evaluate(()=>{const G=__tb2.G(),T=__tb2.TN(),q=G.p&&G.p[0];return {bs:__tb2.bs(),live:__tb2.live(),flag:__tb2.flag(),gmode:G.gmode,andar:T.g,ux:T.ux,risk:T.risk,char:q&&q.def.id,tdm:q&&+q.tdm.toFixed(3),tdf:q&&+q.tdf.toFixed(3),tcr:q&&q.tcr,tsp:q&&+q.tsp.toFixed(3)}});
await p.screenshot({path:'/tmp/tn_'+live+'.png'});out['err'+live]=E.slice(0,3);await p.close()}
console.log(JSON.stringify(out,null,1));await b.close()})();
