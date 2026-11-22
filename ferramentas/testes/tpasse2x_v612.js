// v612: passe 2X só dobra gemas, pó, tickets e joias (personagem/armadura/anel/exclusivo/poção/🔴 não dobram)
const {chromium}=require('playwright');
const run=async(b,x2)=>{const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),m=r.request().method();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});if(m==='GET')return r.fulfill({status:404,contentType:'application/json',body:'{"error":{"code":404}}'});return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',tw_uid:'"u_bia"',ac_n:'bia',ac_k:'k'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  const r=await p.evaluate(async x2=>{const {bpG,bpS,claim,rkG,BPS,twInv}=window.__bp2;const o=bpG();o.own=2;o.x2=x2;o.xp=BPS.xpL*20;bpS(o);
    const st=()=>({gem:rkG('gem',0)|0,red:rkG('red',0)|0,tic:rkG('tic',0)|0,po:rkG('po',0)|0,own:rkG('own',[]).length,an:__pvT.anL().length,inv:twInv().length});
    const a=st();for(let i=0;i<20;i++)await claim('p',i,1);const z=st();const d={};for(const k in a)d[k]=z[k]-a[k];return d},x2);await p.close();return [r,errs]};
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const [n,e1]=await run(b,0),[d,e2]=await run(b,1);console.log('normal',JSON.stringify(n));console.log('2x    ',JSON.stringify(d));
  chk(d.gem>=n.gem*2-10&&d.gem<=n.gem*2+10,'gemas em dobro');chk(d.tic===n.tic*2,'tickets em dobro');chk(d.po===n.po*2,'pó em dobro');
  chk(d.red===n.red,'🔴 não dobra');chk(d.own===n.own,'personagem não dobra');chk(d.an===n.an,'anéis não dobram');chk(d.inv===n.inv,'armaduras/itens/poções não dobram');
  chk(!e1.length&&!e2.length,'sem erros '+e1.concat(e2).join('|'));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
