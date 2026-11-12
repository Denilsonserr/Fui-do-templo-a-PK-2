// v368: perfil de OUTRO jogador no layout novo: dados publicados, curtir, visita e "visitas recentes". Servidor simulado.
const {chromium}=require('playwright');const W='/home/claude/fui-do-templo-a-pk-2/www/',SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/p368_';const DB=new Map();
(async()=>{const b=await chromium.launch();const errs=[];
const page=async(uid,pre)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(uid+': '+e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com|workers\.dev\/fs/,async r=>{const u=r.request().url(),body=r.request().postData()||'{}';
    if(/:runQuery/.test(u)){const Q=JSON.parse(body).structuredQuery,ff=Q.where&&Q.where.fieldFilter;let L=[...DB.entries()].filter(([id,e])=>!ff||(e.f[ff.field.fieldPath]&&e.f[ff.field.fieldPath].stringValue===ff.value.stringValue));
      if(Q.orderBy&&Q.orderBy[0].field.fieldPath==='__name__')L.sort((a,c)=>Q.orderBy[0].direction==='DESCENDING'?(a[0]<c[0]?1:-1):(a[0]<c[0]?-1:1));L=L.slice(0,Q.limit||100);
      return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L.map(([id,e])=>({document:{name:'x/torre/'+id,createTime:new Date(e.ct).toISOString(),fields:e.f}})))})}
    const m=u.match(/documentId=([^&]+)/);const f=JSON.parse(body).fields||{};const id=m?m[1]:'auto'+Math.random().toString(36).slice(2);if(DB.has(id))return r.fulfill({status:409,body:'{}'});DB.set(id,{f,ct:Date.now()});return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(([uid,pre])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:JSON.stringify(uid),rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})},pre)}},[uid,pre]);
  await p.goto('file://'+W+'index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());try{rkModal(null)}catch(e){}});return p};
const B=await page('ub',{tw_nome:'"Bia"',rk_own:'["goku","naruto","gojo"]',rk_ped:'"naruto"',tw_tit:'["rk5"]',tw_titOn:'"rk5"',rk_pvp:JSON.stringify({t:7,d:0,s:4,bt:7,rz:1}),
  rk_btc:JSON.stringify({b0:1,pt:240,w:180,l:60,pf:12,sq:3,bs:9,m:{pvp:100,boss:140},ch:{naruto:120,gojo:80,goku:40}})});
await B.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=200;const x=c.getContext('2d');x.fillStyle='#e33';x.fillRect(0,0,200,200);x.fillStyle='#fff';x.font='bold 90px sans-serif';x.fillText('B',60,135);const d=c.toDataURL('image/jpeg',.8);localStorage.rk_foto=JSON.stringify(d);localStorage.rk_pft=JSON.stringify([d,'',''])});
await B.evaluate(()=>__pvT.rv('pf'));await B.waitForTimeout(2500);console.log('publicado',[...DB.keys()].filter(k=>k.startsWith('pf')).length);
const A=await page('ua',{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',tw_titOn:'"adm"',rk_own:'["goku"]'});
await A.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=200;const x=c.getContext('2d');x.fillStyle='#36f';x.fillRect(0,0,200,200);localStorage.rk_foto=JSON.stringify(c.toDataURL('image/jpeg',.8))});
await A.evaluate(()=>__pvT.pfo('ub','Bia'));await A.waitForTimeout(2500);await A.click('#rkWrap .p3So.lk',{force:true});await A.waitForTimeout(800);await A.screenshot({path:SH+'outro.png'});
console.log('A vê',await A.evaluate(()=>[document.querySelector('.p3Nm').innerText,document.getElementById('p3Lk').textContent,document.querySelectorAll('.p3Ph.on').length,[...document.querySelectorAll('.p3Nb')].map(e=>e.textContent).join('|')]));
await A.click('#rkWrap [data-a="p3al"]',{force:true});await A.waitForTimeout(400);console.log('A tenta álbum da Bia:',await A.evaluate(()=>document.getElementById('rkToast').textContent));
await B.evaluate(()=>__pvT.rv('menu'));await B.waitForTimeout(300);await B.evaluate(()=>__pvT.rv('pf'));await B.waitForTimeout(400);
await B.evaluate(()=>{});await B.reload();await B.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await B.click('#mRank');await B.waitForTimeout(2000);await B.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.rv('pf')});await B.waitForTimeout(2500);
console.log('B vê',await B.evaluate(()=>[document.getElementById('p3Lk').textContent,document.getElementById('p3Uv').textContent,document.querySelectorAll('#p3Vi img').length]));await B.screenshot({path:SH+'bia.png'});
console.log('ERROS',errs);await b.close()})();
