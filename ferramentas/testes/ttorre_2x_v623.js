// v623: completar a torre e SUBIR DE NOVO — a 2ª subida tem que começar e andar normalmente
const {chromium}=require('playwright');const SH=__dirname+'/shots/t623_';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',rk_own:'["goku"]',rk_sel:'"goku"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const st=()=>p.evaluate(()=>{const G=__tb2.G(),T=__tb2.TN();return {mode:G.mode,phase:G.phase,ph:T.ph,g:T.g,on:T.on,busy:__tb2.TW().busy,scr:[...document.querySelectorAll('.screen')].filter(x=>!x.hidden&&x.offsetParent!==null).map(x=>x.id).join('/'),mod:(()=>{const m=document.getElementById('twModal');return !!m&&!m.hidden})(),run:!!__tn.tnRun()}});
const waitFight=async(lbl)=>{for(let i=0;i<60;i++){const s=await st();if(s.mode==='fight'&&s.phase==='fight'&&s.on)return s;await p.waitForTimeout(1000)}const s=await st();console.log('NÃO COMEÇOU',lbl,JSON.stringify(s));await p.screenshot({path:SH+'trava_'+lbl+'.png'});return null};
const killFloor=async(lbl)=>{for(let i=0;i<90;i++){const s=await p.evaluate(()=>{const G=__tb2.G(),T=__tb2.TN();try{if(G.mode==='fight'&&G.p){const P=G.p[0];P.hp=P.mhp;for(const m of (T.mobs||[]))if(m&&!m.ko){m.hp=1;__pvT.ko(P,m)}const B=G.p[1];if(B&&!B.ko&&T.ph==='boss'){B.hp=0;__pvT.ko(P,B)}}}catch(e){}
  const M=document.getElementById('tnPick');if(M&&M.classList.contains('on')){const c=M.querySelector('.tnC');c&&c.click()}return {g:T.g,ph:T.ph,on:T.on,mode:G.mode}});
  if(s.mode==='tower'||!s.on)return s;await p.waitForTimeout(1000)}const s=await st();console.log('ANDAR NÃO TERMINOU',lbl,JSON.stringify(s));await p.screenshot({path:SH+'trava_'+lbl+'.png'});return null};
let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
for(let run=1;run<=2;run++){
  await p.evaluate(()=>{document.querySelectorAll('#twModal').forEach(m=>{m.hidden=true;m.innerHTML=''})});
  if(run===1)await p.evaluate(()=>__tb2.go());else{const ag=await p.evaluate(()=>{const A=document.getElementById('twAgain');return !!A});if(ag)await p.click('#twAgain');else await p.evaluate(()=>__tb2.go())}
  for(let f=0;f<11;f++){const s=await waitFight(run+'_'+f);if(!s){chk(false,'subida '+run+' andar '+(f+1)+' começou');break}
    const k=await killFloor(run+'_'+f);if(!k){chk(false,'subida '+run+' andar '+(f+1)+' terminou');break}
    await p.waitForTimeout(1500);const s2=await st();if(s2.mod){console.log('subida',run,'TERMINOU no andar',f+1);break}
    if(s2.scr.includes('tower')&&!s2.on)await p.evaluate(()=>__tb2.go())}
  const s=await st();const txt=await p.evaluate(()=>((document.getElementById('twModal')||{}).textContent||'').slice(0,80));console.log('fim subida',run,JSON.stringify(s),txt);
  chk(/CONQUISTOU AS DUAS TORRES/.test(txt),'subida '+run+' completou a torre');await p.screenshot({path:SH+'fim'+run+'.png'})}
console.log(E.length?'ERROS '+E.slice(0,5).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
