// v506: tela de sombras do Sung não trava com lista vazia/sombra desconhecida + evoluir sombra
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const run=async(sjs,fn)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\/v1\//,r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await p.addInitScript(s=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","sung"]',rk_ped:'"sung"',tw_nome:'"t"',tw_uid:'"u_t"',rk_sjs:JSON.stringify(s),rk_sje:'500',rk_urso:s.urso?'1':'0',tw_moedas:'99999'})}},sjs);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2500);await fn(p);await p.close()};
await run({lv:5,sh:[],eq:''},async p=>{const r=await p.evaluate(()=>{__pvT.sjo();__pvT.sja('sh',{});const S=document.getElementById('sjSys'),W=document.getElementById('sjShw');return {sys:S&&!S.hidden,shw:W&&!W.hidden}});chk(r.sys&&!r.shw,'sem sombras: volta para o Sistema com aviso (não trava)')});
await run({lv:5,sh:['tank','xyz','igris'],eq:'xyz',urso:1},async p=>{const r=await p.evaluate(()=>{__pvT.sjo();__pvT.sja('sh',{});const W=document.getElementById('sjShw');const o=JSON.parse(localStorage.rk_sjs);
    W.querySelector('[data-x="up"]').click();W.querySelector('[data-x="up"]').click();const o2=JSON.parse(localStorage.rk_sjs);__pvT.sjo();__pvT.sja('inv',{});return {shw:!W.hidden,sh:o.sh,eq:o.eq,lv:(o2.shl||{})[o2.eq],inv:document.querySelectorAll('#sjPan .sjSh').length}});
  console.log(JSON.stringify(r));chk(r.shw&&r.sh.join()==='tank,igris'&&r.eq==='tank','sombra desconhecida removida e tela abre');chk(r.lv===3,'evoluiu 2 níveis sem travar');chk(r.inv===2,'inventário mostra as 2 sombras')});
chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
