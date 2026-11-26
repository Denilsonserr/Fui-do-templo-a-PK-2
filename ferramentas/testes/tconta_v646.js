// v646: criar conta nova (nome + senha) no jogo atual e entrar em outro aparelho
const {chromium}=require('playwright');const NM=process.env.NM||'Zeca'+(Date.now()%100000);
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const pg=async(nome)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));p.on('console',m=>{if(m.type()==='error')p.errs.push('console: '+m.text())});await p.route(/fonts\.g/,r=>r.abort());
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},nome?{tw_nome:JSON.stringify(nome),rk_ini:'1',rk_xpv2:'1',rk_dia:'1'}:{rk_ini:'1'});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);return p};
const A=await pg(NM);await A.evaluate(()=>document.getElementById('mRank').click());await A.waitForTimeout(6000);await A.evaluate(()=>{document.querySelectorAll('#adPass,#lvrzM').forEach(x=>x.remove());try{rkModal(null)}catch(e){}});await A.evaluate(()=>document.querySelector('#rkWrap [data-a="conta"]').click());await A.waitForTimeout(800);
await A.screenshot({path:__dirname+'/shots/t646_criar.png'});
await A.fill('#acP1','senha123');await A.fill('#acP2','senha123');await A.evaluate(()=>document.getElementById('acNew').click());
for(let i=0;i<30;i++){await A.waitForTimeout(500);if(await A.evaluate(()=>!!localStorage.ac_h))break}
const st=await A.evaluate(()=>({k:!!localStorage.ac_k,h:!!localStorage.ac_h,msg:(document.querySelector('#acM .twMsg,#acMsg,#acM [class*=msg]')||{}).textContent||'',txt:(document.getElementById('acM')||{}).innerText||''}));
console.log(JSON.stringify(st).slice(0,600));await A.screenshot({path:__dirname+'/shots/t646_depois.png'});chk(st.k&&st.h,'conta criada e salva no servidor');
const B2=await pg('');

const C=await pg('Falha'+(Date.now()%10000));let posts=0;await C.route(/documentId=sv_/,r=>{posts++;r.fulfill({status:503,body:'{}'})});
await C.evaluate(()=>document.getElementById('mRank').click());await C.waitForTimeout(6000);await C.evaluate(()=>{document.querySelectorAll('#adPass,#lvrzM').forEach(x=>x.remove());try{rkModal(null)}catch(e){}});await C.evaluate(()=>document.querySelector('#rkWrap [data-a="conta"]').click());await C.waitForTimeout(800);
await C.fill('#acP1','senha123');await C.fill('#acP2','senha123');await C.evaluate(()=>document.getElementById('acNew').click());await C.waitForTimeout(8000);
const t2=await C.evaluate(()=>document.getElementById('acM').innerText);console.log('falha:',posts,'tentativas ·',t2.split('\n').find(x=>/código|servidor|internet/i.test(x)));chk(posts===3&&/código 503/.test(t2),'servidor com erro: tenta 3 vezes e mostra o motivo (código 503)');
console.log('erros A:',A.errs.slice(0,5).join(' | '));console.log(ok?'TUDO OK':'FALHOU');await b.close()})();
