// v519: tela de ranking nova (6 abas) + MAIS RICO + MAIOR STATUS
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t519_';
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const posts=[];
  const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  const F=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,typeof v==='number'?{integerValue:String(v)}:{stringValue:v}]));const D=(id,o)=>({document:{name:'x/'+id,fields:F(o),createTime:new Date().toISOString()}});
  const N=['Honrado','Breno','Vini_junior10','Fred','Stark','Stocco','van hohenheim','zbluccas'],C=['sung','shaka','gojo','madara','yuta','goku','naruto','vegeta'];
  const RG=N.map((n,i)=>D('rgs_'+i,{rgs:'1',rgt:Date.now()-i*1000,rgem:[319955,88000,45000,240000,12000,5300,150000,9000][i],sdm:[2900,1500,1200,800,600,500,1000,300][i],scr:[900,700,650,300,200,150,400,90][i],sst:[1700,900,400,300,200,800,100,50][i],stot:0,char:C[i],uid:'u'+i,nome:n,tit:''}));
  RG.push(D('rgs_old',{rgs:'1',rgt:Date.now()-9e7,rgem:999999,sdm:9999,scr:1,sst:1,char:'goku',uid:'u0',nome:'Honrado',tit:''}));
  await p.route(/\/fs\/v1\//,r=>{const u=r.request().url(),bd=r.request().postData()||'';if(/documentId=rgs_/.test(u)){posts.push(JSON.parse(bd).fields);return r.fulfill({status:200,contentType:'application/json',body:'{"name":"x","fields":{}}'})}
    if(/:runQuery/.test(u)&&/"rgt"/.test(bd))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(RG)});if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","shaka"]',tw_nome:'"Teste"',tw_uid:'"u_t"',rk_gem:'7777'})}});
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  await p.evaluate(()=>document.querySelectorAll('#lvrzM,#leiCl').forEach(x=>x.remove()));
  await p.waitForTimeout(3000);await p.evaluate(()=>__pvT.rank('rp'));await p.waitForTimeout(2500);await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}});await p.screenshot({path:SH+'geral.png'});
  chk((await p.$$('.rk_rkg .rgTb')).length===6,'6 abas');
  await p.click('.rk_rkg .rgTb[data-t="gem"]');await p.waitForTimeout(1800);await p.screenshot({path:SH+'rico.png'});
  let L=await p.$$eval('.rgRw',a=>a.map(x=>x.textContent.replace(/\s+/g,' ').trim()));console.log(L);
  chk(/Honrado.*319/.test(L[0])&&/Fred.*240/.test(L[1]),'MAIS RICO: Honrado 1º (doc mais novo, não o antigo), Fred 2º');
  await p.click('.rk_rkg .rgCard[data-t="sta"]');await p.waitForTimeout(1800);await p.screenshot({path:SH+'status.png'});
  L=await p.$$eval('.rgRw',a=>a.map(x=>x.textContent.replace(/\s+/g,' ').trim()));console.log(L);
  chk(/Honrado.*5[.,]?500/.test(L[0])&&/Breno/.test(L[1]),'MAIOR STATUS: Honrado 1º (2.900+900+1.700)');chk((await p.$$('.rgRw.top3')).length===3,'top 3 com brilho');
  await p.click('.rgPg[data-a="rgNext"]');await p.waitForTimeout(500);await p.screenshot({path:SH+'status_p2.png'});
  chk(posts.length>=1&&posts[0].rgem.integerValue==='7777','meu doc vai para o servidor com as gemas');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
