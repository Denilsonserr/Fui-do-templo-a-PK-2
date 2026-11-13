// v394: forma divina do Shaka (5 itens V2 equipados + olhos abertos + 1 barra) e ultimate divina (purificação 4 s)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();
  const S={skcap:{t:'cap',r:'sec',v:0,def:122,crit:81,st:27},skarm:{t:'arm',r:'sec',v:0,dmg:81,crit:61},skluv:{t:'anel',r:'sec',v:0,dmg:61,vel:95,st:101},skbot:{t:'bot',r:'sec',v:68,dmg:54},skros:{t:'esp',r:'sec',v:0,st:95,drop:54}};
  const I=[],Q={};for(const k in S){const it=Object.assign({id:'t'+k,nm:k+' V2',sk:1,ysec:1,v2:1,skb:k},S[k]);I.push(it);Q[it.t]=it.id}
  Object.assign(localStorage,{tw_nome:'"E"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',rk_rp:'5200',rk_dia:'1',rk_bsel:'broly',tw_inv:JSON.stringify(I),tw_eqp:JSON.stringify(Q),
  rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const W=ms=>p.waitForTimeout(ms),shot=n=>p.screenshot({path:SH+'dv_'+n+'.png'});
const inv=await p.evaluate(()=>JSON.parse(localStorage.tw_inv).map(x=>x.nm+'|'+(x.img||'').slice(0,8)));
await p.click('#mRank');await W(500);await p.click('#rkWrap [data-a="boss"]');await W(900);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''}});
await p.click('#rkWrap [data-a="start"]',{force:true});await W(500);await p.click('#rkWrap [data-a="fight"]',{force:true});
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await W(800);
const s0=await p.evaluate(()=>{const G=__dbg.G;G.noAI=true;const [a,o]=G.p;o.hp=o.mhp;a.form=1;a.formT=2300;return __pvT.skdv()});
await p.evaluate(()=>{const a=__dbg.G.p[0];a.sb=1;__pvT.dvBtn()});for(let i=0;i<20&&!(await p.evaluate(()=>__pvT.skdv().div||!!__dbg.G.trans));i++){await p.waitForTimeout(1000);await p.evaluate(()=>{const a=__dbg.G.p[0];a.sb=2;__pvT.dvBtn()})}await W(1800);await shot('video');const s1=await p.evaluate(()=>__pvT.skdv());
await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:20000});await W(700);await shot('forma');const s2=await p.evaluate(()=>__pvT.skdv());
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;a.state='run';a.vx=12*a.facing});await W(250);await shot('correndo');await p.evaluate(()=>{const a=__dbg.G.p[0];a.vx=0;a.state='idle'});
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;o.x=a.x+a.facing*220;o.hp=o.mhp;a.tdm=.3;a.ki=100;__pvT.skSup()});await W(2500);await shot('ult_video');const s3=await p.evaluate(()=>__pvT.skdv());
await p.waitForFunction(()=>__pvT.skdv().pur>0,null,{timeout:20000});await W(1500);await shot('purificacao');const s4=await p.evaluate(()=>({...__pvT.skdv(),oy:__dbg.G.p[1].y,ohp:__dbg.G.p[1].hp}));
await W(1500);await shot('purificacao2');await W(2000);const s5=await p.evaluate(()=>({...__pvT.skdv(),oy:__dbg.G.p[1].y,ost:__dbg.G.p[1].state}));
console.log(JSON.stringify({inv,s0,s1,s2,s3,s4,s5}));console.log('ERRS',errs.slice(0,5));await b.close()})();
