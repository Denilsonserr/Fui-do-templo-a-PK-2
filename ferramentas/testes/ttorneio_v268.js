const {chromium}=require('playwright');const S=process.env.S;const W='/home/claude/fui-do-templo-a-pk-2/www/';
const DB=[];const fs=require('fs');fs.writeFileSync(W+'_t.html',fs.readFileSync(W+'index.html','utf8').replace('window.__G=G;','window.__G=G;window.__v25=()=>({rkTwLv,rkLvl});'));
(async()=>{const b=await chromium.launch();const errs=[];
const pg=async(uid,T,pre)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(uid+': '+e.message));await p.route(/fonts\.g/,r=>r.abort());
 await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url(),body=r.request().postData()||'{}';
  if(/:runQuery/.test(u)){const Q=JSON.parse(body).structuredQuery,ff=Q.where&&Q.where.fieldFilter;const L=DB.filter(e=>!ff||(e.f[ff.field.fieldPath]&&e.f[ff.field.fieldPath].stringValue===ff.value.stringValue)).map(e=>({document:{createTime:new Date(e.ct).toISOString(),fields:e.f}}));return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L)})}
  DB.push({f:JSON.parse(body).fields||{},ct:Date.UTC(2026,10,9,23,30)});return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
 await p.addInitScript(([u,T,pre])=>{const D=T-Date.now(),_n=Date.now;Date.now=()=>_n()+D;if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"'+u+'"',tw_uid:'"'+u+'"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1'},pre)}},[uid,T,pre]);
 await p.goto('file://'+W+'_t.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});return p};
// ao vivo 20:30 (23:30 UTC); ADM
const A=await pg('adm1',Date.UTC(2026,10,9,23,30),{tw_tit:'["adm"]'});
await A.click('#mRank');await A.waitForTimeout(1500);await A.screenshot({path:S+'ev_menu.png'});
await A.click('#rkWrap [data-a="evMenu"]',{force:true});await A.waitForTimeout(1500);await A.screenshot({path:S+'ev_tor.png'});
console.log('nivel torre',await A.evaluate(()=>{localStorage.rk_rp='100000';return __v25().rkTwLv()+' (rank real '+__v25().rkLvl()+')'}));console.log('abas',await A.evaluate(()=>[...document.querySelectorAll('.evTab')].map(b=>b.textContent).join(' | ')));
await A.click('#rkWrap .evTab[data-k="av"]',{force:true});await A.waitForTimeout(500);
console.log('adm form',await A.evaluate(()=>!!document.getElementById('evAvX')));
if(await A.evaluate(()=>!!document.getElementById('evAvX'))){await A.fill('#evAvT','CÓDIGO NOVO!');await A.fill('#evAvX','Usem o código TESTE123 hoje!');await A.click('#rkWrap [data-e="avPost"]',{force:true});await A.waitForTimeout(1500)}
await A.screenshot({path:S+'ev_av.png'});
// jogador comum depois do fim, ficou em 1º e 3º
DB.push({f:{ev:{stringValue:'ev20261109'},nome:{stringValue:'p1'},uid:{stringValue:'p1'},andar:{integerValue:'10'},tempo:{integerValue:'300'},trof:{integerValue:'1'},char:{stringValue:'goku'}},ct:Date.UTC(2026,10,9,23,30)});
DB.push({f:{ev:{stringValue:'ev20261109'},nome:{stringValue:'p2'},uid:{stringValue:'p2'},andar:{integerValue:'10'},tempo:{integerValue:'500'},trof:{integerValue:'9'},char:{stringValue:'goku'}},ct:Date.UTC(2026,10,9,23,31)});
DB.push({f:{ev:{stringValue:'ev20261109'},nome:{stringValue:'p3'},uid:{stringValue:'p3'},andar:{integerValue:'8'},tempo:{integerValue:'100'},trof:{integerValue:'9'},char:{stringValue:'goku'}},ct:Date.UTC(2026,10,9,23,32)});
DB.push({f:{ev:{stringValue:'ev20261109'},nome:{stringValue:'p4'},uid:{stringValue:'p4'},andar:{integerValue:'2'},tempo:{integerValue:'90'},trof:{integerValue:'0'},char:{stringValue:'goku'}},ct:Date.UTC(2026,10,9,23,33)});for(const u of ['p1','p2','p3','p4']){const P=await pg(u,Date.UTC(2026,10,9,23,56),{});await P.click('#mRank');await P.waitForTimeout(6000);
 console.log(u,await P.evaluate(()=>localStorage.tw_evc+' bp '+(localStorage.rk_bp||'').slice(0,0)+(JSON.parse(localStorage.rk_bp||'{}').own)+' gem '+localStorage.rk_gem+' | '+(document.querySelector('#rkModal h3')||{}).textContent));
 if(u==='p1')await P.screenshot({path:S+'ev_win.png'});
 if(u==='p3'){await P.evaluate(()=>{const x=document.getElementById('rkMX');x&&x.click()});await P.waitForTimeout(300);await P.click('#rkWrap [data-a="evMenu"]',{force:true});await P.waitForTimeout(1200);await P.screenshot({path:S+'ev_fim.png'});console.log('avs visto',await P.evaluate(()=>document.querySelector('.evBody').textContent.slice(0,200)))}}
// sem evento
const Z=await pg('z',Date.UTC(2026,10,12,15,0),{});await Z.click('#mRank');await Z.waitForTimeout(1500);console.log('sem evento brilho',await Z.evaluate(()=>document.querySelector('[data-a="evMenu"]').className));
console.log(errs);await b.close()})();
