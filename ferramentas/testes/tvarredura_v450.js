// v450: varredura de bugs — cada personagem luta (IA x IA) com transformação e super; junta erros (pageerror + errRep) e tela branca/travada
const {chromium}=require('playwright');const U=process.env.U||'http://localhost:8790/index.html';const SEG=+process.env.SEG||12;
(async()=>{const b=await chromium.launch();const out=[];
const nova=async()=>{const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push('PAGE '+e.message+' @'+String(e.stack||'').split('\n')[1]));
  p.on('request',r=>{if(/documentId=er_/.test(r.url())){try{const f=JSON.parse(r.postData()).fields;E.push('REP['+f.w.stringValue+'] '+f.m.stringValue+' @'+f.st.stringValue.split('\n').slice(1,3).join(' ').slice(0,200))}catch(e){}}});
  await p.route(/fonts\.g|firestore/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
  await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});return [p,E]};
let [p,E]=await nova();const ids=process.env.IDS?process.env.IDS.split(','):await p.evaluate(()=>Object.keys(__dbg.CH));console.log('personagens',ids.length,ids.join(','));
for(const id of ids){const t0=Date.now();E.length=0;let st='';
  try{await p.evaluate(([a])=>{__pvT.treino(a,'goku','pve')},[id]);await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:90000});
    await p.evaluate(()=>{const G=__dbg.G;G.p[0].cpu=true;for(const f of G.p){f.sb=9;f.ki=100}try{__pvT.trf()}catch(e){}});
    let fr0=await p.evaluate(()=>__dbg.G.frame),br=0,trav=0;
    for(let s=0;s<SEG;s+=3){await p.waitForTimeout(3000);const r=await p.evaluate(()=>{const G=__dbg.G;for(const f of G.p){f.sb=9;f.ki=100;if(f.hp<f.mhp*.3)f.hp=f.mhp*.6}try{if(!G.trans&&!G.ws&&Math.random()<.5)__dbg.startSuper(G.p[0])}catch(e){}
      const c=document.querySelector('canvas'),g=c.getContext('2d');let w=0,n=0;try{const d=g.getImageData(0,0,c.width,c.height).data;for(let i=0;i<d.length;i+=4*211){n++;if(d[i]>238&&d[i+1]>232&&d[i+2]>220)w++}}catch(e){}return {fr:G.frame,br:w/Math.max(1,n),ph:G.phase,hold:G.hold||0}});
      if(r.br>.6)br++;if(r.fr===fr0&&!r.hold)trav++;fr0=r.fr}
    st=await p.evaluate(()=>__dbg.G.p.map(f=>f.def.id+':'+Math.round(f.hp)+':'+f.state+':f'+(f.form||0)).join(' '));if(br>1)E.push('TELA BRANCA');if(trav)E.push('TRAVADO '+trav+'x')}
  catch(e){E.push('TESTE '+String(e.message).split('\n')[0])}
  out.push(id+' ('+Math.round((Date.now()-t0)/1000)+'s) '+st+(E.length?'\n   ⚠ '+[...new Set(E)].slice(0,4).join('\n   ⚠ '):''));console.log(out[out.length-1]);
  await p.evaluate(()=>{try{__dbg.G.mode='title'}catch(e){}});
  if(E.some(x=>/TESTE/.test(x))){await p.close();[p,E]=await nova()}}
await b.close()})();
