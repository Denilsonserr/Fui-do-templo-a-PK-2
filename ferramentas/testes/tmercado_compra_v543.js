// v543: tudo que foi comprado de verdade no Mercado (lista real) tem que CAIR no inventário, mesmo com a mochila cheia.
const {chromium}=require('playwright');const fs=require('fs');
const IT=fs.readFileSync(__dirname+'/mk_itens_v543.txt','utf8').split('\n').filter(Boolean).map(s=>JSON.parse(s));
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Bia"',tw_uid:'"u_bia"',rk_own:'["goku"]',rk_lvrz:'1',rk_pvupv:'352'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(3000);
  const r=await p.evaluate(async(IT)=>{const T=window.__pvT;const out=[];
    for(const full of [0,1]){
      // mochila: vazia ou CHEIA (50 itens comuns diferentes)
      const base=full?Array.from({length:50},(_,i)=>({id:'f'+i,t:['esp','arm','bot','cap'][i%4],r:'comum',v:1+i})):[];
      for(const o of IT.concat([{k:'poc',p:{r:'mit',v:75,pk:'cura'}}])){localStorage.setItem('tw_inv',JSON.stringify(base));localStorage.setItem('tw_eqp','{}');localStorage.setItem('tw_poc','[]');localStorage.setItem('rk_an','[]');
        const AJ=()=>JSON.parse(localStorage.getItem('rk_an')||'[]').length*1e6+(JSON.parse(localStorage.getItem('rk_ps')||'{}').jn|0);const c0=AJ();const ok=T.mnGive(o);if(full)T.twCap();const c1=AJ();const inv=JSON.parse(localStorage.getItem('tw_inv')||'[]');
        const got=o.k==='eq'?inv.some(x=>/^mk/.test(x.id)&&x.nm===o.it.nm&&x.r===o.it.r&&x.t===o.it.t):o.k==='poc'?JSON.parse(localStorage.getItem('tw_poc')||'[]').some(x=>/^mk/.test(x.id)):c1>c0;
        if(!(ok&&got))out.push({full,ok,o:JSON.stringify(o).slice(0,110)})}}
    return out},IT);
  console.log(r.length?r.map(x=>JSON.stringify(x)).join('\n'):'');
  console.log(r.length?'FALHA '+r.length+' itens não caíram':'OK  todos os '+IT.length+' itens reais caem no inventário (mochila vazia e cheia)');
  console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');await b.close()})();
