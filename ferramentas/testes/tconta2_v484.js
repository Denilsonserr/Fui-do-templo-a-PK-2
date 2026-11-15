// v484: PC atrasado e celular com gemas gastas: o PC não pode salvar por cima; tem que carregar o da conta
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const E=[];const nm='dup'+Math.random().toString(36).slice(2,6);
const mk=async()=>{const c=await b.newContext({viewport:{width:915,height:412}});const p=await c.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());return p};
const A=await mk();await A.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Jog"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',rk_gem:'10000'})}});
await A.goto('http://localhost:8790/index.html');await A.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
/* cria a conta no aparelho A */
const k=await A.evaluate(async nm=>{const k='chave'+nm;localStorage.ac_k=k;localStorage.ac_n=nm;localStorage.removeItem('ac_h');const ok=await __ac.save(1);return [ok,localStorage.ac_t,k]},nm);
/* aparelho B (PC) com a mesma conta e o mesmo save */
const B=await mk();const st=await A.evaluate(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o});
await B.addInitScript(st=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,st)}},st);await B.goto('http://localhost:8790/index.html');await B.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
/* A (celular) gasta 8000 gemas e salva */
await A.waitForTimeout(1500);const sa=await A.evaluate(async()=>{__ac.add('gem',-8000);localStorage.removeItem('ac_h');return await __ac.save(1)});
/* B (PC atrasado, ainda com 10000) tenta salvar */
await B.waitForTimeout(1500);const sb=await B.evaluate(async()=>{__ac.add('gem',5);localStorage.removeItem('ac_h');return await __ac.save(1)});await B.waitForTimeout(7000);
const gb=await B.evaluate(()=>localStorage.rk_gem).catch(e=>'?');
await B.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000}).catch(()=>{});
const bk=await B.evaluate(async()=>{const L=await __bk.list();return L.map(x=>JSON.parse(x.d).rk_gem)});
await B.evaluate(()=>__bk.open());await B.waitForTimeout(2500);await B.screenshot({path:'/tmp/bk.png'});
await B.evaluate(()=>{const b=document.querySelector('#acM button[data-i]');b.click();b.click()});await B.waitForTimeout(6000);
const gr=await B.evaluate(()=>localStorage.rk_gem).catch(e=>'?');
console.log(JSON.stringify({criou:k[0],celularSalvou:sa,pcSalvou:sb,gemasPCDepois:gb,copias:bk,depoisDeRecuperar:gr}),E.slice(0,3));await b.close()})();
