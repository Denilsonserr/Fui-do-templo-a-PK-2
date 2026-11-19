// v559: PRESENTE10K — 10.000 gemas + 1 personagem aleatório (sem mítico/ilimitado), 1 vez por conta
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();const DB=new Set();
  const mk=async(own)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
    await p.route(/\/fs\//,r=>{const q=r.request(),u=q.url(),m=q.method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='POST'&&/documentId=/.test(u)){const id=new URL(u).searchParams.get('documentId');if(DB.has(id))return r.fulfill({status:409,contentType:'application/json',body:'{"error":{"code":409}}'});DB.add(id);return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})}if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
    await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',tw_nome:'"Bia"',rk_gem:'0',rk_own:JSON.stringify(o)})}},own);
    await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});return p};
  const use=p=>p.evaluate(async()=>{const E=document.createElement('div');document.body.appendChild(E);await __pvT.cup('presente10k',E);return {t:E.textContent,gem:+localStorage.rk_gem,own:JSON.parse(localStorage.rk_own)}});
  let p=await mk(['goku']);let r=await use(p);console.log(JSON.stringify(r));const nw=r.own.filter(x=>x!=='goku');
  chk(r.gem===10000&&nw.length===1&&!['sung','yuta','shaka','naruto','madara','garou'].includes(nw[0]),'10.000 💎 + 1 personagem não mítico ('+nw[0]+')');
  r=await use(p);chk(/já usou/i.test(r.t),'1 vez só');await p.close();
  const cnt={};for(let i=0;i<0;i++){}
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
