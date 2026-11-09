// v237: ver o perfil de OUTRO jogador (ranking do ranqueado, chat global, chat da Torre) + ADM esconde foto. Servidor simulado.
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const DB={};let reads=0,writes=0;
const page=async(init)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();
    if(/:runQuery/.test(u)){const q=JSON.parse(r.request().postData()).structuredQuery,w=q.where&&q.where.fieldFilter,o=q.orderBy&&q.orderBy[0];let L=Object.entries(DB);
      if(w)L=L.filter(([id,f])=>f[w.field.fieldPath]&&Object.values(f[w.field.fieldPath])[0]===w.value.stringValue);
      if(o){const k=o.field.fieldPath;if(k==='__name__')L.sort((a,c)=>o.direction==='DESCENDING'?(a[0]<c[0]?1:-1):(a[0]<c[0]?-1:1));else{const g=f=>+Object.values(f[k])[0];L=L.filter(([id,f])=>f[k]).sort((a,c)=>o.direction==='DESCENDING'?g(c[1])-g(a[1]):g(a[1])-g(c[1]))}}
      L=L.slice(0,q.limit||100);reads+=Math.max(1,L.length);return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L.map(([id,f])=>({document:{name:'x/torre/'+id,createTime:new Date().toISOString(),fields:f}})))})}
    const m=u.match(/documentId=([^&]+)/),id=m?m[1]:'a'+Math.random().toString(36).slice(2);if(DB[id])return r.fulfill({status:409,body:'{}'});writes++;DB[id]=JSON.parse(r.request().postData()).fields;return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},init);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(600);return p};
const IV=v=>({integerValue:String(v)}),S=v=>({stringValue:v});
// ranking: docs rk dos dois jogadores
DB.r1={nome:S('Bia'),uid:S('ub'),rk:S('1'),rp:IV(16000),tit:S('rk5'),char:S('naruto'),andar:IV(0),tempo:IV(0)};DB.r2={nome:S('Denilson ADM'),uid:S('ua'),rk:S('1'),rp:IV(9000),tit:S('adm'),andar:IV(0),tempo:IV(0)};
DB.r3={nome:S('Velho'),uid:S('uv'),rk:S('1'),rp:IV(3000),char:S('zoro'),andar:IV(0),tempo:IV(0)};
// B: tem foto, vitrine e abre o perfil (publica)
const B=await page({tw_nome:'"Bia"',tw_uid:'"ub"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","naruto"]',rk_sel:'"naruto"',rk_dia:'1',rk_rp:'16000',tw_tit:'["rk5"]',tw_titOn:'"rk5"',
  tw_inv:JSON.stringify([{id:'m1',t:'esp',r:'mit',v:10},{id:'l1',t:'bot',r:'lend',v:7}]),rk_vit:'["m1","l1",null]',rk_st:JSON.stringify({wins:30,loss:4,tt:95}),rk_use:'{"naruto":20}'});
await B.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=200;const x=c.getContext('2d');x.fillStyle='#e33';x.fillRect(0,0,200,200);x.fillStyle='#fff';x.font='bold 90px sans-serif';x.fillText('B',60,135);localStorage.rk_foto=JSON.stringify(c.toDataURL('image/jpeg',.8))});
await B.click('#mPerfil');await B.waitForTimeout(2500);const pub=Object.keys(DB).filter(k=>k.startsWith('pf_'));
// A (ADM) abre o ranking e toca na Bia
const A=await page({tw_nome:'"Denilson ADM"',tw_uid:'"ua"',tw_tit:'["adm"]',tw_titOn:'"adm"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1',rk_rp:'9000'});
const shot=n=>A.screenshot({path:SH+'po_'+n+'.png'});
await A.click('#mRank');await A.waitForTimeout(500);await A.click('#rkWrap [data-a="ranking"]');await A.waitForTimeout(1200);await shot('ranking');
const r0=reads;await A.click('#rkModal .twRk .rw[data-pu="ub"]');await A.waitForTimeout(1500);await shot('bia');const rOpen=reads-r0;
const txt=await A.evaluate(()=>document.querySelector('#rkWrap .pfOth')?.innerText);
await A.click('#rkWrap [data-a="hs"]');await A.waitForTimeout(1200);await shot('bia_hist');
await A.click('#rkWrap [data-a="pf"]');await A.waitForTimeout(500);await A.click('#rkWrap .pfFoto');await A.waitForTimeout(300);await shot('adm_foto');await A.click('#pfAh');await A.waitForTimeout(800);await shot('bia_escondida');
await A.click('#rkWrap [data-a="back"]');await A.waitForTimeout(1000);await shot('volta_ranking');const voltou=await A.evaluate(()=>!!document.querySelector('#rkModal .twRk'));
// jogador antigo (sem perfil publicado)
await A.click('#rkModal .twRk .rw[data-pu="uv"]');await A.waitForTimeout(1500);await shot('velho');await A.click('#rkWrap [data-a="back"]');await A.waitForTimeout(600);
// chat global: B manda mensagem, A toca no nome
await A.click('#rkMX');await A.click('#rkWrap [data-a="boss"]');await A.waitForTimeout(800);
await B.click('#rkWrap [data-a="back"]');await B.waitForTimeout(300);await B.click('#mRank');await B.waitForTimeout(400);await B.click('#rkWrap [data-a="boss"]');await B.waitForTimeout(800);await B.fill('#rkChI','oi do chat');await B.keyboard.press('Enter');await B.waitForTimeout(800);
await A.evaluate(()=>{for(const k of Object.keys(localStorage))if(k.startsWith('qc_'))localStorage.removeItem(k)});await A.waitForTimeout(27000);await A.click('#rkWrap [data-a="back"]');await A.waitForTimeout(300);await A.click('#rkWrap [data-a="boss"]');await A.waitForTimeout(2500);await shot('chat');
const temMsg=await A.evaluate(()=>!!document.querySelector('#rkChL .cm[data-pu="ub"]'));if(temMsg){await A.click('#rkChL .cm[data-pu="ub"]');await A.waitForTimeout(1500);await shot('bia_chat');await A.click('#rkWrap [data-a="back"]');await A.waitForTimeout(500)}
const fim=await A.evaluate(()=>document.querySelector('#rkWrap .rkA')?.className);
console.log(JSON.stringify({pub,txt,rOpen,voltou,temMsg,fim,reads,writes,hide:Object.keys(DB).filter(k=>k.startsWith('pfh_'))}),'ERROS',JSON.stringify(A.errs.concat(B.errs)));await b.close()})();
