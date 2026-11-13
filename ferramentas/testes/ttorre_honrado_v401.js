// v401: Torre com o salvamento REAL do Honrado (Shaka, muitos itens): vários andares matando o boss pelo caminho normal
const {chromium}=require('playwright');const fs=require('fs');const SH=process.env.SH||'/tmp/';const D=JSON.parse(fs.readFileSync(process.env.SAVE,'utf8'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},hasTouch:true,isMobile:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push('C:'+m.text().slice(0,200))});
await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(D=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();for(const k in D)localStorage.setItem(k,D[k]);localStorage.setItem('rk_dl',JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0}))}},D);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(2500);
const st=()=>p.evaluate(()=>{const T=__pvT.tn(),G=__pvT.G(),o=G.p&&G.p[1];return {mode:G.mode,ph2:G.phase,on:T.on,g:T.g,ph:T.ph,done:T.done,boss:o&&o.def&&o.def.name,ohp:o&&Math.round(o.hp),pick:(document.getElementById('tnPick')||{}).className}});
for(let fl=0;fl<6;fl++){
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove());const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};__pvT.tnO()});await p.waitForTimeout(1500);
  await p.evaluate(()=>{document.querySelectorAll('#twModal,.twM').forEach(x=>{});});await p.click('#twGo',{force:true}).catch(e=>console.log('sem twGo',e.message.slice(0,80)));
  try{await p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&G.phase==='fight'&&(T.ph==='boss'||T.ph==='mob')},null,{timeout:60000})}catch(e){console.log('nao entrou',JSON.stringify(await st()));break}
  // mata tudo pelo caminho normal (applyHit) até o andar acabar
  let t0=Date.now();
  while(Date.now()-t0<60000){const s=await st();if(s.ph==='clear'||s.mode!=='fight')break;
    const MODO=process.env.MODO||'hit';
    await p.evaluate(M=>{const G=__pvT.G(),T=__pvT.tn(),a=G.p[0];a.hp=a.mhp;const boss=T.ph==='boss'&&G.p[1]&&!G.p[1].ko;
      for(const o of [G.p[1],...(T.mobs||[])]){if(!o||o.ko||o.hyIdle)continue;
        if(boss&&o===G.p[1]&&M!=='hit'){o.hp=Math.min(o.hp,200);o.x=a.x+a.facing*160;o.inv=0;o.state='idle';if(M==='combo'){a.state='idle';a.buf.sp=G.frame}else if(M==='ult'){a.ki=100;a.buf.sr=G.frame}else if(M==='form'){a.sb=6;a.buf.tr=G.frame}continue}
        o.hp=Math.min(o.hp,30);o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:900,kb:0,hs:2,kind:'melee',lock:1,px:o.x,py:o.y-150})}},MODO);await p.waitForTimeout(MODO==='ult'?9000:1500)}
  await p.waitForTimeout(2600);const s1=await st();
  const card=await p.$('#tnPick.on .tnC');if(card){const bb=await card.boundingBox();await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2)}
  await p.waitForTimeout(4500);const s2=await st();console.log('andar',fl,JSON.stringify({s1,card:!!card,s2}));
  if(s2.mode==='fight'){await p.screenshot({path:SH+'trav_'+fl+'.png'});await p.waitForTimeout(12000);console.log('  12s depois',JSON.stringify(await st()));break}
}
console.log('ERRS',JSON.stringify(errs.filter(e=>!/requestFullscreen|Failed to load|net::/.test(e)).slice(0,8)));await b.close()})();
