// v653: molduras da foto dos 5 ranks novos — liberam pelo rank máximo, aparecem no perfil
const {chromium}=require('playwright');const SH=__dirname+'/shots/t653_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"'})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{__ev('rkS("rp",1500000)');return {k:[14,15,16,17,18].map(i=>__ev(`mdOk('rk${i}')`)),src:!!__ev('RQA.mold.rk18.src')}});console.log(JSON.stringify(r));
chk(r.src&&r.k+''==='true,true,true,false,false','1,5M XP (Deus do Infinito): libera Ancestral, Originário e Infinito; Criação e Gênesis trancadas');
const imgs=await p.evaluate(async()=>{const R=[];for(let i=14;i<=18;i++){const im=new Image();im.src=__ev('RQA.mold.rk'+i+'.src');await new Promise(r=>{im.onload=r;im.onerror=r});R.push(im.naturalWidth)}return R});chk(imgs.every(w=>w>300),'5 molduras carregam');
for(const k of ['rk16','rk18']){await p.evaluate(k=>{__ev('rkS("rp",2500000)');__ev(`rkS("mold","${k}")`);document.querySelectorAll('#adPass,#t1W').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__vw.rkView('pf')},k);await p.waitForTimeout(1500);
  chk(await p.evaluate(()=>!!document.querySelector('.pfMold.r1'+'6, .pfMold.r18')),'perfil com a moldura '+k);await p.screenshot({path:SH+k+'.png'})}
await p.evaluate(()=>__ev('mdPick0()'));await p.waitForTimeout(800);await p.screenshot({path:SH+'lista.png'});
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
