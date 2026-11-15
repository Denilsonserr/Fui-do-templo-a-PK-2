// v489: torneio THE BEST — prêmios, título e bônus
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',tw_tit:'["adm"]'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const r={};r.ev=await p.evaluate(()=>{const T=__tb.ev();return [T.id,T.nome,new Date(T.ini).toString(),new Date(T.fim).toString(),T.prem.map(P=>__tb.nm(P)).join(' | ')]});
r.sum0=await p.evaluate(()=>JSON.stringify(__tb.sum()));
r.give=await p.evaluate(()=>{__tb.give(1);__tb.give(1);return {an:localStorage.rk_an,tit:localStorage.tw_tit,on:localStorage.tw_titOn,ok:__tb.on()}});
r.sum1=await p.evaluate(()=>JSON.stringify(__tb.sum()));
await p.evaluate(()=>{const d=document.createElement('div');d.id='tbT';d.style.cssText='position:fixed;left:0;top:0;width:915px;height:412px;z-index:99999;background:#140a24;display:flex;flex-direction:column;gap:20px;align-items:center;justify-content:center';
 d.innerHTML=`<div style="width:330px;height:46px;display:flex;align-items:center;justify-content:center;font-size:16px">${__tb.tit('adm',true)}</div><div style="width:330px;height:46px;display:flex;align-items:center;justify-content:center;font-size:16px">${__tb.tit()}</div>`;document.body.appendChild(d)});
await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/tb_tit.png'});
console.log(JSON.stringify(r,null,1),E.slice(0,3));await b.close()})();
