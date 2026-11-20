// v575: poderes dos anéis do leilão — REI DA FÚRIA (10 golpes → ataque x3 por 10 s, 1x por luta) e FORTUNA (30% de duplicar item raro, 1x por luta)
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const luta=async(x)=>{const p=await b.newPage({viewport:{width:915,height:422}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
    await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',tw_nome:'"Bia"',tw_uid:'"u_bia"'})}});
    await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(3500);
    await p.evaluate(x=>{document.querySelectorAll('#lvrzM,#leiCl').forEach(e=>e.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}
      if(x){const r=__pvT.l2.give(x);const A=JSON.parse(localStorage.rk_anEq||'{}');A.goku=[r.i];localStorage.rk_anEq=JSON.stringify(A)}__pvT.treino('goku','goku','treino')},x);await p.waitForTimeout(9000);return p};
  let p=await luta('lxa');
  let r=await p.evaluate(()=>{Math.random=()=>0.999;const G=__pvT.G(),a=G.p[0],d=G.p[1];const dm=[];for(let i=0;i<14;i++){d.hp=d.mhp||99999;d.inv=0;d.hitstun=0;d.state='idle';d.ko=false;const h0=d.hp;__pvT.hit(a,d,{dmg:10,kind:'hit'});dm.push(Math.round((h0-d.hp)*100)/100)}
    const t=a._lxT-G.frame;G.frame+=601;d.hp=d.mhp||99999;const h1=d.hp;__pvT.hit(a,d,{dmg:10,kind:'hit'});const after=h1-d.hp;return {dm,t,after,U:a._lxU}});
  console.log(JSON.stringify(r));/* o dano cai sozinho no combo longo (até 4,86), por isso compara com o 10º golpe */chk(Math.abs(r.dm[10]/r.dm[9]-3)<1e-6,'depois do 10º golpe: ATAQUE x3 ('+r.dm[10]+' vs '+r.dm[9]+')');
  chk(r.t>590&&r.t<=600,'dura 10 segundos');chk(Math.abs(r.after-r.dm[9])<1e-6,'depois dos 10 s volta ao normal e não liga de novo na mesma luta');await p.close();
  p=await luta(null);r=await p.evaluate(()=>{Math.random=()=>0.999;const G=__pvT.G(),a=G.p[0],d=G.p[1];const dm=[];for(let i=0;i<12;i++){d.hp=d.mhp||99999;d.inv=0;d.hitstun=0;d.state='idle';const h0=d.hp;__pvT.hit(a,d,{dmg:10,kind:'hit'});dm.push(h0-d.hp)}return dm});
  chk(Math.abs(r[11]-r[9])<1e-6,'sem o anel não tem o bônus');await p.close();
  p=await luta('lxb');r=await p.evaluate(()=>{const R=__pvT.TWEQR(),T=__pvT.TWEQ();Math.random=()=>0;const n0=__pvT.inv().length;__pvT.addItem(T[0],R[0]);const n1=__pvT.inv().length;__pvT.addItem(T[0],R[1]);const n2=__pvT.inv().length;__pvT.addItem(T[0],R[2]);const n3=__pvT.inv().length;return [n1-n0,n2-n1,n3-n2]});
  console.log(JSON.stringify(r));chk(r[0]===1,'item COMUM não duplica');chk(r[1]===2,'item RARO duplicou');chk(r[2]===1,'só 1 vez por luta');await p.close();
  p=await luta('lxb');r=await p.evaluate(()=>{const R=__pvT.TWEQR(),T=__pvT.TWEQ();Math.random=()=>0.5;const n0=__pvT.inv().length;__pvT.addItem(T[0],R[3]);return __pvT.inv().length-n0});chk(r===1,'sem sorte (acima de 30%) não duplica');await p.close();
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
