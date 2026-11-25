// v642: menu principal animado (vídeo em loop sem som) + botões nos lugares certos
const {chromium}=require('playwright');const SH=__dirname+'/shots/t642_';
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
  for(const [w,h] of [[915,412],[800,450]]){const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
    await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_own:'["goku"]'})}});
    await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
    const v=await p.evaluate(async()=>{const v=document.getElementById('mmVid');const t0=v.currentTime;await new Promise(r=>setTimeout(r,1200));return {ok:!!v,muted:v.muted,loop:v.loop,t0,t1:v.currentTime,src:v.currentSrc.slice(-30),w:v.videoWidth}});console.log(w+'x'+h,JSON.stringify(v));
    chk(v.ok&&v.muted&&v.loop&&v.t1>v.t0&&v.w===1408,w+'x'+h+': vídeo tocando, sem som, em loop');await p.screenshot({path:SH+w+'.png'});
    const R=await p.evaluate(()=>{const m=document.getElementById('mm').getBoundingClientRect();const at=(fx,fy)=>{const e=document.elementFromPoint(m.left+m.width*fx,m.top+m.height*fy);const b=e&&e.closest('button');return b?b.id:'-'};
      return {aventura:at(.17,.27),aventura2:at(.25,.36),treino:at(.14,.50),historia:at(.12,.63),config:at(.13,.755),nada:at(.6,.5)}});console.log(JSON.stringify(R));
    chk(R.aventura==='mRank'&&R.aventura2==='mRank'&&R.treino==='goSelect'&&R.historia==='mHist'&&R.config==='mCfg'&&R.nada==='-','botões nos lugares da arte nova');
    if(w===915){await p.click('#mRank');await p.waitForTimeout(2000);chk(await p.evaluate(()=>document.getElementById('mmVid').paused),'fora da tela inicial o vídeo pausa');}
    await p.close()}
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
