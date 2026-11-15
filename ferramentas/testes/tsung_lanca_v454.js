// v454: LANÇA DAS SOMBRAS do Sung (modo teste do ADM) no botão KI, recarga 7 s
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[];p.on('pageerror',e=>E.push(e.message));
p.on('request',r=>{if(/documentId=er_/.test(r.url())){try{const f=JSON.parse(r.postData()).fields;E.push('REP '+f.m.stringValue+' @'+f.st.stringValue.split('\n').slice(1,3).join(' ').slice(0,200))}catch(e){}}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__pvT.treino('sung','goku','pve'));await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{__pvT.admT().on=true;__dbg.G.noAI=true});
const tiro=async(dist,shots)=>{await p.evaluate(d=>{const G=__dbg.G,[f,o]=G.p;f.x=300;o.x=300+d;f.y=o.y;f.facing=1;f.state='idle';o.hp=o.hpLag=3000;o.state='idle';o.vx=0;f.buf.kiTap=G.frame},dist);
  const out=[];for(let i=0;i<shots;i++){await p.waitForTimeout(i?40:20);await p.screenshot({path:'/tmp/lanca_'+dist+'_'+i+'.png'});out.push(await p.evaluate(()=>{const G=__dbg.G,[f,o]=G.p;return f.state+'/'+o.state+' hp'+Math.round(o.hp)}))}return out};
await p.waitForTimeout(2500);console.log('1º tiro',(await tiro(800,9)).join(' | '));
const cd=()=>p.evaluate(()=>{const G=__dbg.G,f=G.p[0],B=document.getElementById('bKi'),cs=getComputedStyle(B);return {cd:Math.round(((f.sjRgCD||0)-G.frame)/60*10)/10,cls:B.className,pos:cs.position}});
console.log('recarga',JSON.stringify(await cd()));await p.screenshot({path:'/tmp/lanca_btn.png'});
await p.waitForTimeout(800);console.log('2º (na recarga)',(await tiro(800,3)).join(' | '));
await p.evaluate(()=>{const G=__dbg.G;G.p[0].sjRgCD=G.frame+5});await p.waitForTimeout(600);console.log('3º (recarga acabou)',(await tiro(800,3)).join(' | '),JSON.stringify(await cd()));
console.log('erros',E);await b.close()})();
