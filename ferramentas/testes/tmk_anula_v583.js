// v583: anular a compra do ADM (Breno, 300.000 💎) + vendedor não pega o item de volta por causa do PEDIDO (mkr)
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const page=async(nome,extra)=>{const p=await b.newPage();p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
    await p.addInitScript(([n,x])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',tw_nome:JSON.stringify(n),tw_uid:'"u_'+n.replace(/\W/g,'')+'"',rk_gem:'1000'},x)}},[nome,extra]);
    await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(7000);return p};
  const st=p=>p.evaluate(()=>({gem:JSON.parse(localStorage.rk_gem),pend:JSON.parse(localStorage.rk_mkPend||'[]').length,inv:JSON.parse(localStorage.tw_inv||'[]').filter(x=>x.t==='esp'&&x.r==='sec').length}));
  let p=await page('Denilson ADM',{rk_mkPend:JSON.stringify([{rid:'wurbwp_mwpmsuvj_13vlve8',lid:'wurbwp_mwpmsuvj',pr:300000,it:'{}',t:1}])});let r=await st(p);console.log(JSON.stringify(r));
  chk(r.gem>=271000&&r.pend===0,'ADM com o pedido pendente: +270.000 💎 e o item não vem');await p.evaluate(()=>__pvT.mkFix583());let r2=await st(p);chk(r2.gem===r.gem,'só 1 vez');await p.close();
  p=await page('Denilson ADM',{tw_inv:JSON.stringify([{id:'a',t:'esp',r:'sec',v:30,crit:10,nm:'E'},{id:'b',t:'arm',r:'rara',v:4}])});r=await st(p);chk(r.gem>=271000&&r.inv===0,'ADM que já tinha recebido: +270.000 💎 e o item sai da mochila');await p.close();
  p=await page('Breno',{});r=await st(p);chk(r.gem===1000,'outro jogador não ganha nada');await p.close();
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
