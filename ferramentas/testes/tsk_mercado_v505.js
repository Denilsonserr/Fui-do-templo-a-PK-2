// v505: peças V2 de Virgem compradas no Mercado Negro voltam a contar para a 2ª transformação (dados reais da conta do van hohenheim)
const {chromium}=require('playwright');const V=JSON.parse(require('fs').readFileSync('/tmp/claude-0/vh.json','utf8'));
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\/v1\//,r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await p.addInitScript(V=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","shaka"]',rk_ped:'"shaka"',tw_nome:'"vh"',tw_uid:'"u_vh"',tw_inv:JSON.stringify(V.inv),tw_eqp:JSON.stringify(V.eq)})}},V);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(6000);
  const r=await p.evaluate(()=>{const I=JSON.parse(localStorage.tw_inv);const g=id=>I.find(x=>x.id===id);return {set:__pvT.skset(),arm:g('mkmwjuydsafhyx'),cap:g('mkmwk0470otugw'),v1:g('gsskarmmwgpzs26zel'),monarca:g('mkmwi7fbrd63vh')}});
  chk(r.set===true,'5 peças V2 equipadas contam para a 2ª transformação');chk(r.arm.v2===1&&r.arm.skb==='skarm'&&r.cap.skb==='skcap','armadura/elmo do mercado viraram V2 de verdade');
  chk(r.v1.sk===1&&!r.v1.v2,'armadura V1 continua V1');chk(!r.monarca||(!r.monarca.sk&&!r.monarca.v2),'Anel do Monarca não vira peça de Virgem');
  const m=await p.evaluate(()=>__pvT.mnc({k:'eq',it:{t:'arm',r:'sec',v:0,crit:61,dmg:81,nm:'ARMADURA DIVINA V2',img:'a/821f811fed7245.webp',ysec:1,sk:1,v2:1,skb:'skarm'}}));
  chk(m.it.v2===1&&m.it.skb==='skarm','compra nova no Mercado já vem V2 certinho');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
