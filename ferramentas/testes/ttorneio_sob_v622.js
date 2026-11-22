// v622: Torneio Soberano (20h–21h) + título (+1⭐ a cada 5 vitórias) + evento 2x sorte/gacha/xp/anel + caixa de escolha lendária
const {chromium}=require('playwright');const SH=__dirname+'/shots/t622_';
const A=Date.UTC(2026,10,22,23,0);
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const open=async(nome,acc,t)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
    await p.addInitScript(([nome,acc,t])=>{
      if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:JSON.stringify(nome),rk_ini:'1',rk_xpv2:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_lvrz:'1',rk_dia:'1',rk_pvupv:'352',rk_own:'["goku"]',ac_n:acc,ac_k:'k'})}},[nome,acc,t]);
    await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.evaluate(t=>{const N=Date.now,off=t-N();Date.now=()=>N()+off},t);await p.click('#mRank');await p.waitForTimeout(2500);return p};
  const clean=p=>p.evaluate(()=>{document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});
  // antes
  let p1=await open('Ana','ana_t',A-30*60e3);await clean(p1);await p1.evaluate(()=>__vw.rkView?__vw.rkView('pvp'):0);await p1.waitForTimeout(800);await clean(p1);
  console.log('AGORA NA PAGINA',await p1.evaluate(()=>new Date(Date.now()).toISOString()+' '+new Date().toISOString()));let ban=await p1.evaluate(()=>(document.querySelector('.tsBan')||{}).textContent||'');console.log(ban);chk(/20h/.test(ban),'aviso antes do torneio');await p1.screenshot({path:SH+'antes.png'});
  // evento
  const ev=await p1.evaluate(()=>({ev:__pvT.ev()&&__pvT.ev()[3],m:__pvT.m(),cx:+JSON.parse(localStorage.rk_cxLg||'0'),modal:!!document.querySelector('#rkModal .bpPkG')}));console.log(JSON.stringify(ev));
  chk(/2x SORTE/.test(ev.ev)&&ev.m[1]===2&&ev.m[3]===2,'evento 2x sorte / 2x anel ativo');
  await p1.evaluate(()=>__vw.cxLgChk());await p1.waitForTimeout(400);await p1.evaluate(()=>__vw.cxLgOpen());await p1.waitForTimeout(400);await p1.screenshot({path:SH+'caixa.png'});
  const cx=await p1.evaluate(()=>{const n=+JSON.parse(localStorage.rk_cxLg||'0');const bt=document.querySelector('#rkModal .bpPkG button[data-k="vegeta"]');if(bt)bt.click();return {n,n2:+JSON.parse(localStorage.rk_cxLg||'0'),own:JSON.parse(localStorage.rk_own),lev:localStorage.rk_cxLev}});
  console.log(JSON.stringify(cx));chk(cx.n===1&&cx.n2===0&&cx.own.includes('vegeta'),'caixa lendária: ganhou 1 e escolheu o Vegeta');
  await p1.evaluate(()=>__vw.cxLgChk());const cx2=await p1.evaluate(()=>+JSON.parse(localStorage.rk_cxLg||'0'));chk(cx2===0,'caixa só 1 vez por conta');
  const g=await p1.evaluate(()=>{const c={};for(let i=0;i<3000;i++){const r=__vw.rkRoll();const k=r.k==='eq'?'eq_'+r.r:r.k;c[k]=(c[k]||0)+1}return c});console.log('gacha com evento',JSON.stringify(g));
  await p1.close();
  // durante: Ana ganha 3, Bia ganha 5
  p1=await open('Ana','ana_t',A+5*60e3);let p2=await open('Bia','bia_t',A+6*60e3);
  const win=(p,n)=>p.evaluate(n=>{let o={t:1,d:0,s:0,w:0,l:0,sq:0,bt:1,bd:0};for(let i=0;i<n;i++){o.sq=-5;__vw.pvStep(o,true)}return __vw.tsMy()},n);
  const a=await win(p1,3),bb=await win(p2,5);chk(a===3&&bb===5,'contou as estrelas no torneio (Ana '+a+', Bia '+bb+')');await p1.waitForTimeout(1500);
  const L=await p1.evaluate(()=>__vw.tsLoad(1));console.log(JSON.stringify((L||[]).map(e=>[e.nome,e.tsS])));chk(L&&L[0]&&L[0].nome==='Bia'&&L[0].tsS===5&&L[1].tsS===3,'ranking ao vivo: Bia 1ª');
  await clean(p1);await p1.evaluate(()=>__vw.rkView('pvp'));await p1.waitForTimeout(600);await clean(p1);await p1.click('.tsBan');await p1.waitForTimeout(1200);await p1.screenshot({path:SH+'ranking.png'});await p1.close();await p2.close();
  // depois: Bia ganha o título
  p2=await open('Bia','bia_t',A+62*60e3);await p2.evaluate(()=>__vw.tsAward());await p2.waitForTimeout(2500);await p2.screenshot({path:SH+'soberano.png'});
  const t=await p2.evaluate(()=>({tit:JSON.parse(localStorage.tw_tit||'[]'),on:JSON.parse(localStorage.tw_titOn||'""')}));chk(t.tit.includes('pvsob')&&t.on==='pvsob','Bia virou SOBERANO DO PVP');
  const bonus=await p2.evaluate(()=>{const o={t:1,d:0,s:0,w:0,l:0,sq:-99,bt:1,bd:0};const G=[];for(let i=0;i<10;i++){o.sq=-99;G.push(__vw.pvStep(o,true).gain)}return G});console.log('estrelas por vitória',JSON.stringify(bonus));
  chk(bonus[4]===bonus[0]+1&&bonus[9]===bonus[0]+1&&bonus[3]===bonus[0],'+1 ⭐ extra a cada 5 vitórias');
  const p3=await open('Ana','ana_t',A+62*60e3);await p3.evaluate(()=>__vw.tsAward());await p3.waitForTimeout(1500);const t3=await p3.evaluate(()=>JSON.parse(localStorage.tw_tit||'[]'));chk(!t3.includes('pvsob'),'Ana (2ª) não ganha o título');
  await clean(p3);await p3.evaluate(()=>__vw.rkView('pvp'));await p3.waitForTimeout(600);await clean(p3);const ban3=await p3.evaluate(()=>document.querySelector('.tsBan').textContent);console.log(ban3);chk(/Bia/.test(ban3),'aviso mostra o Soberano');await p3.screenshot({path:SH+'depois.png'});
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
