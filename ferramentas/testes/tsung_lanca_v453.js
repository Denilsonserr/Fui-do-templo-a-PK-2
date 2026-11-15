// v453: LANÇA DAS SOMBRAS do Sung (modo teste do ADM): soco com o inimigo longe → lança voa e acerta com impacto. Perto = combo normal.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));
p.on('request',r=>{if(/documentId=er_/.test(r.url())){try{const f=JSON.parse(r.postData()).fields;E.push('REP '+f.m.stringValue+' @'+f.st.stringValue.split('\n').slice(1,3).join(' ').slice(0,200))}catch(e){}}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.treino('sung','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{__pvT.admT().on=true;__dbg.G.noAI=true});
const tiro=async(dist,shots)=>{await p.evaluate(d=>{const G=__dbg.G,[f,o]=G.p;f.x=300;o.x=300+d;f.y=o.y;f.facing=1;f.state='idle';f.sjRgCD=0;o.hp=o.hpLag=3000;o.state='idle';o.vx=0;f.buf.punch=G.frame},dist);
  const out=[];for(let i=0;i<shots;i++){await p.waitForTimeout(i?40:20);await p.screenshot({path:'/tmp/lanca_'+dist+'_'+i+'.png'});out.push(await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;return f.state+'/'+o.state+' hp'+Math.round(o.hp)}))}return out};
await p.waitForTimeout(2500);console.log('longe',(await tiro(800,9)).join(' | '));
await p.waitForTimeout(1500);console.log('perto',(await tiro(150,3)).join(' | '));
console.log('erros',E);await b.close()})();
