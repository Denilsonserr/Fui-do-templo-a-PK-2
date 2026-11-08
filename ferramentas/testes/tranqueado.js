// v213: menu principal novo + modo ranqueado inteiro (Firestore simulado)
const {chromium}=require('playwright');const SH='/tmp/rk/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>{errs.push((e.stack||e.message).slice(0,300));console.log('ERR',e.message)});
const DB=[];await p.route(/fonts\.g/,r=>r.abort());
await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url(),body=r.request().postData();
  if(/:runQuery/.test(u)){const Q=JSON.parse(body).structuredQuery,ff=Q.where&&Q.where.fieldFilter;const L=DB.filter(e=>!ff||e[ff.field.fieldPath]===ff.value.stringValue);
    return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L.map((e,i)=>({document:{name:'d'+i,createTime:new Date(e.ct).toISOString(),fields:Object.fromEntries(Object.entries(e).filter(([k])=>k!=='ct').map(([k,v])=>[k,typeof v==='number'?{integerValue:''+v}:{stringValue:v}]))}})))})}
  const F=JSON.parse(body).fields,e={ct:Date.now()};for(const k in F)e[k]=F[k].stringValue!=null?F[k].stringValue:+F[k].integerValue;DB.push(e);return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();localStorage.tw_nome='"Teste"';localStorage.tw_uid='"meu"'}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const sh=n=>p.screenshot({path:SH+n+'.png'}),w=ms=>p.waitForTimeout(ms);
await w(1500);await sh('00_menu');
await p.click('#mRank');await w(800);await sh('01_rkmenu');
await p.click('#rkWrap [data-a="boss"]');await w(1500);await sh('02_boss');
await p.fill('#rkChI','oi pessoal');await p.click('#rkWrap [data-a="chat"]');await w(800);await sh('03_chat');
await p.click('#rkWrap [data-a="back"]');await w(400);await p.click('#rkWrap [data-a="gacha"]');await w(800);await sh('04_gacha');
await p.evaluate(()=>{localStorage.rk_gem='2000'});await p.click('#rkWrap [data-a="back"]');await w(300);await p.click('#rkWrap [data-a="gacha"]');await w(500);
await p.click('#rkWrap [data-a="sum10"]');await w(2500);await sh('05_video');await p.click('.rkFx');await w(800);await sh('06_cartas');await w(4500);await sh('07_cartas2');
await p.evaluate(()=>{document.querySelectorAll('.rkWin').forEach(e=>e.click())});await w(800);await p.evaluate(()=>{document.querySelectorAll('.rkWin').forEach(e=>e.click())});await w(800);
const ok=await p.$('#rkCdOk:not([hidden])');if(ok)await ok.click();else{await p.click('#rkCdAll');await w(3000);await p.evaluate(()=>{document.querySelectorAll('.rkWin').forEach(e=>e.click())});await w(1500);await p.evaluate(()=>{document.querySelectorAll('.rkWin').forEach(e=>e.click())});await w(500);await p.click('#rkCdOk')}
await w(500);await p.click('#rkWrap [data-a="taxas"]');await w(400);await sh('08_taxas');await p.click('#rkMX');await p.click('#rkWrap [data-a="hist"]');await w(400);await sh('09_hist');await p.click('#rkMX');
await p.click('#rkWrap [data-a="shop"]');await w(700);await sh('10_loja');await p.evaluate(()=>{localStorage.rk_red='1000'});await p.click('#rkWrap [data-i="1"]');await w(300);await p.click('#rkMOk');await w(600);await sh('11_loja2');
await p.click('#rkWrap [data-a="back"]');await w(300);await p.click('#rkWrap [data-a="back"]');await w(300);
await p.click('#rkWrap [data-a="lib"]');await w(1000);await sh('12_lib');for(const t of ['eq','it','col']){await p.click(`#rkWrap [data-t="${t}"]`);await w(700);await sh('13_lib_'+t)}
await p.click('#rkWrap [data-t="chr"]');await w(500);
await p.click('#rkWrap [data-a="back"]');await w(300);
for(const [a,n] of [['ranking','14_rank'],['rewards','15_recomp'],['ach','16_conq'],['pos','17_pos']]){await p.click(`#rkWrap [data-a="${a}"]`);await w(900);await sh(n);await p.click('#rkMX')}
// luta
await p.click('#rkWrap [data-a="boss"]');await w(500);await p.click('#rkWrap [data-a="start"]');await w(900);await sh('17b_ranqueada');await p.click('#rkWrap [data-a="fight"]');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await w(800);await sh('18_luta');
console.log('LUTA1',JSON.stringify(await p.evaluate(()=>{const [a,o]=__dbg.G.p;return {gmode:__dbg.G.gmode,pm:(a.mhp||__dbg.G.p[0].hp)/1800,om:o.mhp/1800,otdm:o.tdm,ph:o.rkPh,timer:__dbg.G.timer,diff:__dbg.G.diff}})));
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:300,kb:0,hs:2,kind:'melee',px:o.x,py:o.y-150})});
await w(1500);await sh('19_transf');await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:60000});await w(500);await sh('20_fase2');
console.log('FASE2',JSON.stringify(await p.evaluate(()=>{const o=__dbg.G.p[1];return {om:o.mhp/1800,hp:o.hp,form:o.form,ph:o.rkPh,tdm:o.tdm,phase:__dbg.G.phase}})));
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;o.hp=5;o.inv=0;o.state='idle';__dbg.applyHit(a,o,{dmg:300,kb:0,hs:2,kind:'melee',px:o.x,py:o.y-150})});
await p.waitForSelector('#rkModal .rkRes',{timeout:60000});await w(800);await sh('21_resultado');await p.click('#rkChest',{force:true});await w(900);await sh('22_bau');
console.log('DEPOIS',await p.evaluate(()=>['rk_rp','rk_red','rk_gem','rk_tic','rk_st','tw_tit'].map(k=>k+'='+localStorage[k]).join(' | ')));
console.log('DB rk',JSON.stringify(DB.filter(e=>e.rk||e.gchat||e.on).map(e=>Object.keys(e).filter(k=>['rk','gchat','on'].includes(k)).join())));
await p.click('#rkOk');await w(500);await p.click('#rkWrap [data-a="back"]');await w(300);await p.click('#rkWrap [data-a="rewards"]');await w(500);await sh('23_recomp2');
console.log('ERROS',JSON.stringify(errs));await b.close()})();
