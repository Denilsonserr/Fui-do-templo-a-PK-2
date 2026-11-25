// v641: Modo Boss só com o Broly; Sung/Shaka viram "? EM BREVE"
const {chromium}=require('playwright');const SH=__dirname+'/shots/t641_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage({viewport:{width:915,height:422}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_own:'["goku","shaka"]',rk_bsel:'sung'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.evaluate(()=>document.getElementById('mRank').click());await p.waitForTimeout(2500);
  const clean=()=>p.evaluate(()=>{document.querySelectorAll('#adPass,#asEv,#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});
  await clean();await p.evaluate(()=>document.querySelector('#rkWrap [data-a="boss"]').click());await p.waitForTimeout(1200);await clean();await p.screenshot({path:SH+'boss.png'});
  const r=await p.evaluate(()=>({v:__vw.RKV(),lk:document.querySelectorAll('#rkWrap .lkSlot').length,sung:!!document.querySelector('#rkWrap [data-b="sung"]'),shaka:!!document.querySelector('#rkWrap [data-b="shaka"]'),bid:__vw.RKBID()}));console.log(JSON.stringify(r));
  chk(r.v==='boss'&&r.bid==='broly','abre o Modo Boss do Broly (mesmo quem tinha o Sung escolhido)');chk(r.lk===2&&!r.sung&&!r.shaka,'Sung e Shaka sumiram: 2 espaços "? EM BREVE"');
  await p.evaluate(()=>__vw.rkView('jb'));await p.waitForTimeout(500);chk(await p.evaluate(()=>__vw.RKV()==='boss'),'tela antiga do Sung não abre mais');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
