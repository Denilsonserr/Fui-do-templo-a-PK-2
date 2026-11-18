// v527: anel SP velocidade/vel.ultimate do Honrado vira dano/crítico (só na conta dele)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=1;const errs=[];const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const an=[{i:'r1',c:5,g:8,s:'vel',s2:'uv',p:'esq',a:1e7,v:840,l:60},{i:'r2',c:5,g:8,s:'st',s2:'drop',p:'fur',a:1e7,v:840,l:60}];
const run=async(uid,nome)=>{const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\/v1\//,r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await p.addInitScript(([an,uid,nome])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","sung"]',tw_nome:JSON.stringify(nome),tw_uid:JSON.stringify(uid),rk_an:JSON.stringify(an),rk_anEq:JSON.stringify({sung:['r1','r2']})})}},[an,uid,nome]);
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(7500);
  const r=await p.evaluate(()=>[JSON.parse(localStorage.rk_an),JSON.parse(localStorage.rk_anEq)]);await p.close();return r};
let [A,E]=await run('mwc8atkrgg4fns2f','Honrado');const r1=A.find(x=>x.i==='r1');chk(r1.s==='dano'&&r1.s2==='crit'&&r1.p==='esq'&&r1.l===60&&r1.v===840,'Honrado: anel virou dano + crítico (mesmo nível/passiva)');chk(E.sung.includes('r1'),'continua equipado');chk(A.find(x=>x.i==='r2').s==='st','o outro anel não mexe');
[A]=await run('u_outro','Fulano');chk(A.find(x=>x.i==='r1').s==='vel','outro jogador: não muda');
chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
