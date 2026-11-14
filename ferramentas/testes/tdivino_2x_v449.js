// v449: forma divina dura o tempo da transformação normal e dá para usar de novo na mesma luta (Caça, com a armadura)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='warning'||m.type()==='error')errs.push(m.text().slice(0,200))});await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const I=['skcap','skarm','skluv','skbot','skros'].map((k,i)=>({id:'v'+i,nm:k+' V2',v2:1,skb:k,t:['cap','arm','anel','bot','esp'][i],r:'sec'}));
  Object.assign(localStorage,{tw_nome:'"E"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',tw_inv:JSON.stringify(I),tw_eqp:JSON.stringify({cap:'v0',arm:'v1',anel:'v2',bot:'v3',esp:'v4'}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(900);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''}});await p.click('#rkWrap [data-a="caca"]',{force:true});await p.waitForTimeout(1200);await p.click('#rkWrap [data-a="caGo"]',{force:true});
for(let i=0;i<90;i++){await p.waitForTimeout(2000);const s=await p.evaluate(()=>[__dbg.G.mode,__dbg.G.phase]);if(s[0]==='fight'&&s[1]==='fight')break;if(i%10==0)console.log(s)}
console.log('modo',await p.evaluate(()=>[__dbg.G.gmode,__dbg.G.p[0].def.id,__dbg.G.p[0].form]));
await p.evaluate(()=>{__dbg.G.noAI=true;__pvT.trf()});await p.waitForFunction(()=>!__dbg.G.trans&&__dbg.G.p[0].form,null,{timeout:30000});
for(let i=0;i<(process.env.NODV?0:25)&&!(await p.evaluate(()=>__pvT.skdv().div));i++){await p.evaluate(()=>{__dbg.G.p[0].sb=3;__pvT.dvBtn()});await p.waitForTimeout(1000)}
await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:30000});
const info=()=>p.evaluate(()=>{const G=__dbg.G,a=G.p[0];return {div:a.skDiv,form:a.form,dur:a.skDivE?Math.round((a.skDivE-G.frame)/60):0,formT:Math.round(a.formT),FT:typeof FORM_T}});
const r1=await info();await p.waitForTimeout(5000);const r1b=await info();
await p.evaluate(()=>{const G=__dbg.G;G.p[0].skDivE=G.frame+5});await p.waitForTimeout(1500);const r2=await info();
let ok=false;for(let i=0;i<25&&!ok;i++){await p.evaluate(()=>{const f=__dbg.G.p[0];f.sb=3;f.form=1;f.formT=Math.max(f.formT,300);__pvT.dvBtn()});await p.waitForTimeout(1000);ok=await p.evaluate(()=>__pvT.skdv().div)}
await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:30000});const r3=await info();
console.log(JSON.stringify({inicio:r1,'5s depois':r1b,acabou:r2,'2a vez':ok,r3}),errs.filter(e=>!/Failed to load|Fullscreen|Canvas2D/.test(e)).slice(0,5));await b.close()})();
