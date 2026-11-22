// v617: ninguém desvia do Alucard (desvio do Qingqing no 3º golpe, 💨 esquiva do anel SP). Outros personagens continuam sendo desviados.
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const run=async(at,df)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
    await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Breno"',rk_ini:'1',rk_xpv2:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_lvrz:'1',rk_own:'["goku","alucard","qingqing"]'})}});
    await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
    await p.evaluate(([a,d])=>__pvT.treino(a,d,'pve'),[at,df]);await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(600);
    const r=await p.evaluate(()=>{const G=__dbg.G,[a,d]=G.p;const prep=()=>{d.inv=0;d.state='idle';d.ko=false;d.hp=d.mhp||__pvT.MAXHP();a.state='idle';a.combo=0;d.x=a.x+120;G.trans=null;G.ws=null};
      const hit=()=>({dmg:20,px:d.x,py:d.y-120,kind:'hit',hs:1});let q=0;
      for(let i=0;i<3;i++){prep();const h0=d.hp;__vw.applyHit(a,d,hit());if(d.hp<h0)q++}
      d.anGP=['esq'];const R=Math.random;Math.random=()=>0.01;let s=0;for(let i=0;i<4;i++){prep();d.qqN=0;const h0=d.hp;try{__vw.applyHit(a,d,hit())}catch(e){}if(d.hp<h0)s++}Math.random=R;d.anGP=null;
      return {qq:q,sp:s,alhit:typeof ALHIT}});await p.close();return r};
  let r=await run('alucard','qingqing');console.log('Alucard x Qingqing',JSON.stringify(r));chk(r.qq===3,'Alucard acerta os 3 golpes (Qingqing não desvia)');chk(r.sp===4,'anel SP 💨 esquiva não funciona contra o Alucard');
  r=await run('goku','qingqing');console.log('Goku x Qingqing',JSON.stringify(r));chk(r.qq===2,'contra o Goku o Qingqing ainda desvia no 3º golpe');chk(r.sp===0,'contra o Goku a 💨 esquiva ainda funciona');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
