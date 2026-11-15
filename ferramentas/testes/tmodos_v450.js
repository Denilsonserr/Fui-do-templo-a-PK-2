// v450: varredura dos MODOS (Boss, Torre, PVP, Caça, Shaka/Yuta boss): IA x IA, força vitórias/derrotas e as telas de fim; junta erros
const {chromium}=require('playwright');const U='http://localhost:8790/index.html';const MODOS=(process.env.M||'boss,torre,pvp,caca,skboss,yuta').split(',');
(async()=>{const b=await chromium.launch();
for(const M of MODOS){const p=await b.newPage({viewport:{width:915,height:412}});const E=[];
 p.on('pageerror',e=>E.push('PAGE '+e.message+' @'+String(e.stack||'').split('\n')[1]));p.on('dialog',d=>d.dismiss());p.on('response',r=>{if(r.status()>=400&&!/fs\/|er_/.test(r.url()))E.push('HTTP '+r.status()+' '+r.url().split('/').pop())});p.on('requestfailed',r=>{if(!/fonts|firestore/.test(r.url()))E.push('FALHOU '+r.url().split('/').pop())});
 p.on('request',r=>{if(/documentId=er_/.test(r.url())){try{const f=JSON.parse(r.postData()).fields;E.push('REP['+f.w.stringValue+'] '+f.m.stringValue+' @'+f.st.stringValue.split('\n').slice(1,3).join(' ').slice(0,220))}catch(e){}}});
 await p.route(/fonts\.g|firestore/,r=>r.abort());
 await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","shaka","sung","yuta","naruto"]',rk_sel:'"goku"',rk_tic:'50',rk_gem:'5000',tw_moedas:'99999',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
 await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(1500);
 const clr=()=>p.evaluate(()=>{const Md=document.getElementById('rkModal');if(Md){Md.hidden=true;Md.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});await clr();
 const view={boss:'boss',pvp:'pvp',caca:'ca',skboss:'sb',yuta:'yb'}[M],btn={boss:'start',pvp:'pvGo',caca:'caGo',skboss:'start',yuta:'start'}[M];
 try{if(M==='torre')await p.evaluate(()=>__pvT.tnS(0));else{await p.evaluate(v=>__pvT.rv(v),view);await p.waitForTimeout(1200);await clr();await p.evaluate(a=>{const x=document.querySelector('#rkWrap [data-a="'+a+'"]');if(!x)throw new Error('sem botão '+a);x.click()},btn)}
  let ok=0;for(let i=0;i<90&&!ok;i++){await p.waitForTimeout(1500);ok=await p.evaluate(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');if(!ok)await p.evaluate(()=>{const x=document.querySelector('#rkWrap [data-a="fight"],#rkWrap [data-a="skgo"],#rkWrap [data-a="yfight"]');if(x)x.click()});if(!ok&&i%4===3){await p.mouse.click(457,300);await clr();const t=await p.evaluate(()=>{const m=document.getElementById('rkModal');return m&&!m.hidden?m.innerText.slice(0,80):''});if(t)E.push('MODAL '+t.replace(/\n/g,' '))}}
  if(!ok)E.push('NÃO ENTROU NA LUTA ('+await p.evaluate(()=>{const G=__dbg.G,o={};for(const k in G){const v=G[k];if(typeof v!=='object'&&typeof v!=='function')o[k]=v}return JSON.stringify(o).slice(0,1500)})+')');
  else{const log=[];for(let s=0;s<16;s++){await p.waitForTimeout(2500);
    const r=await p.evaluate(s=>{const G=__dbg.G;if(G.mode==='fight'&&G.p){G.p[0].cpu=true;G.p[0].sb=9;if(G.phase==='fight'&&s%3===2){try{const o=G.p[1];o.hp=0;__pvT.ko(G.p[0],o)}catch(e){}}}
      const c=document.querySelector('canvas'),g=c.getContext('2d');let w=0,n=0;try{const d=g.getImageData(0,0,c.width,c.height).data;for(let i=0;i<d.length;i+=4*211){n++;if(d[i]>238&&d[i+1]>232&&d[i+2]>220)w++}}catch(e){}
      const bc=document.getElementById('bcO');if(bc){const x=bc.querySelector('button,[data-a]');if(x)x.click()}
      return G.mode+'/'+G.phase+'/'+G.gmode+' f'+G.frame+(w/Math.max(1,n)>.6?' BRANCO':'')},s);log.push(r);
    if(/^(rk|menu|title)/.test(r)||!/fight/.test(r)){await p.mouse.click(457,300)}}
   E.push('trajeto: '+[...new Set(log.map(x=>x.replace(/ f\d+/,'')))].join(' → '))}}
 catch(e){E.push('TESTE '+String(e.message).split('\n')[0])}
 console.log('== '+M+'\n   '+[...new Set(E)].join('\n   '));await p.close()}
await b.close()})();
