// v537: tempo da torre não conta hitstop / câmera lenta / cinemática
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',rk_rp:'78000',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}`);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2000);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove());const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};__pvT.tnO()});await p.waitForTimeout(1200);await p.click('#twGo',{force:true});
await p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&G.phase==='fight'&&T.on&&!T.busy},null,{timeout:60000});
const fr=()=>p.evaluate(()=>__pvT.tn().fr);const fix=()=>p.evaluate(()=>{const G=__pvT.G();G.p[0].hp=G.p[0].mhp;for(const m of [G.p[1],...(__pvT.tn().mobs||[])])if(m){m.inv=999}});
let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
await fix();let a=await fr();await p.waitForTimeout(1000);let n=(await fr())-a;chk(n>40,'normal conta ('+n+' quadros/s)');
await p.evaluate(()=>{__pvT.G().hitstop=9999});a=await fr();await p.waitForTimeout(1000);n=(await fr())-a;chk(n<=1,'hitstop não conta ('+n+')');
await p.evaluate(()=>{const G=__pvT.G();G.hitstop=0;G.slow=9999});a=await fr();await p.waitForTimeout(1500);n=(await fr())-a;chk(n>3&&n<45,'câmera lenta conta só o tempo real de jogo ('+n+' em 1,5s)');
await p.evaluate(()=>{const G=__pvT.G();G.slow=0;G.zsp=1});a=await fr();await p.waitForTimeout(1000);n=(await fr())-a;chk(n<=1,'especial/cinemática não conta ('+n+')');
await p.evaluate(()=>{__pvT.G().zsp=0});a=await fr();await p.waitForTimeout(1000);n=(await fr())-a;chk(n>40,'volta a contar ('+n+')');
console.log(errs.length?'ERROS '+errs.join('|'):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
