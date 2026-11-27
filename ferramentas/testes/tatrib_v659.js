// v659: Atributos (Personagem / Equipamentos / Anéis) mostram o PODER: Dano = PL, Crítico = poder + chance, Velocidade = PL
const {chromium}=require('playwright');const SH=__dirname+'/shots/t659_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
const R=[{i:'a1',c:5,g:8,s:'dano',s2:'crit',a:1e7,v:600,l:60},{i:'a3',c:4,g:7,s:'crit',v:200,l:50}];
await p.addInitScript(R=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:1}),
  rk_lv:JSON.stringify({shaka:{lv:70,t:[],c:[]}}),rk_an:JSON.stringify(R),rk_anEq:JSON.stringify({shaka:R.map(x=>x.i)})})}},R);
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>{for(let i=0;i<30;i++){const E=__ev('TWEQ')[i%__ev('TWEQ').length];__ev('twAddItem')(E,__ev('twEqRoll')())}});
await p.click('#mRank');await p.waitForTimeout(2500);
for(const t of ['chr','eq','an']){await p.evaluate(t=>{document.querySelectorAll('#adPass,#t1W').forEach(x=>x.remove());__ev('rkModal(null)');__ev(`RKL.tab='${t}';rkView('lib')`)},t);await p.waitForTimeout(1200);
  const v=await p.evaluate(()=>[...document.querySelectorAll('.lb2 .lbV')].map(x=>x.textContent.trim()));console.log(t,JSON.stringify(v));chk(v.length>=5&&/⚡\d/.test(v[0]+v[0].replace('+',''))&&/🎯/.test(v[1])&&v[0].length>2,t+': Dano e Crítico mostram os números de poder');
  const fit=await p.evaluate(()=>[...document.querySelectorAll('.lb2 .lbV')].every(x=>x.scrollWidth<=x.clientWidth+4));chk(fit,t+': cabe no espaço');await p.screenshot({path:SH+t+'.png'})}
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
