// v565: ADM imortal (personagem e sombra); jogador comum continua mortal
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const run=async nome=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
    await p.addInitScript(n=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:JSON.stringify(n),rk_ini:'1',rk_xpv2:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_urso:'1',rk_lvrz:'1',rk_own:'["goku","sung"]',rk_sjs:JSON.stringify({cls:'necro',lv:30,sh:['tank','igris'],eq:'igris'})})}},nome);
    await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
    await p.evaluate(()=>__pvT.treino('sung','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(600);
    await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;f.hp=5;__pvT.ko(o,f)});await p.waitForTimeout(800);
    const r=await p.evaluate(()=>{const G=__dbg.G,f=G.p[0];return {ph:G.phase,ko:f.ko,hp:Math.round(f.hp/(f.mhp||__pvT.MAXHP())*100)}});await p.close();return r};
  let r=await run('Denilson ADM');console.log(JSON.stringify(r));chk(r.ph==='fight'&&!r.ko&&r.hp===100,'ADM não morre (vida cheia)');
  r=await run('Breno');console.log(JSON.stringify(r));chk(r.ph!=='fight'||r.ko,'jogador comum continua podendo perder');
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
