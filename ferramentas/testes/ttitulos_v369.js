// v369: placas de título (ADM e rank), histórico novo com dados simulados, sincronização dos títulos de TOP (servidor falso)
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/t369_';
(async()=>{const b=await chromium.launch();const errs=[];
const run=async(nm,pre,fn)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(nm+': '+e.message));await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com|workers\.dev\/fs/,async r=>{const u=r.request().url();if(!/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'{}'});
    const Q=JSON.parse(r.request().postData()).structuredQuery,ff=Q.where&&Q.where.fieldFilter,ob=Q.orderBy&&Q.orderBy[0];const S=v=>({stringValue:v}),I=v=>({integerValue:String(v)});
    let L=[];if(ob&&ob.field.fieldPath==='rp')L=[{nome:S('Rival'),uid:S('ur'),rp:I(9000),rk:S('1')},{nome:S(nm),uid:S('u_'+nm),rp:I(99999),rk:S('1')}];
    if(ff&&ff.field.fieldPath==='pvk')L=[{nome:S(nm),pva:S('x'),pvs:I(10),d:S(JSON.stringify({t:8,st:30,ch:'shaka'})),ch:S('shaka')}];
    return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L.map(f=>({document:{name:'x/torre/'+Math.random(),createTime:new Date().toISOString(),fields:f}})))})});
  await p.addInitScript(pre=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_own:'["goku","shaka","naruto"]',rk_ped:'"shaka"',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})},pre)}},pre);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());try{rkModal(null)}catch(e){}});await fn(p);await p.close()};
await run('Denilson ADM',{tw_uid:'"u_Denilson ADM"',tw_nome:'"Denilson ADM"',tw_tit:'["adm","rk7"]',tw_titOn:'"adm"'},async p=>{
  await p.evaluate(()=>{const G=__pvT.G();for(let i=0;i<14;i++){G._btT=0;G._bs={f:60*(40+i*7),dd:1800*(8+i),dr:1800*(2+i%3),k:1+i%4,g0:0,m0:0};G.p=[{def:__pvT.ch(['shaka','goku','naruto'][i%3]),hp:i%4?70:100,mhp:100},{def:__pvT.ch('vegeta')}];G.teams=i%5===0?[[1],[1]]:null;__pvT.bt.rec(['pvp','boss','caca','torre','hidra'][i%5],i%4!==3,i%5===2?{o:'lobo',on:'LOBO',x:'NÍVEL '+(5+i%5)}:i%5===3?{x:'ANDAR 6'}:{})}G.p=null;G.teams=null});
  await p.evaluate(()=>__pvT.rv('pf'));await p.waitForTimeout(1800);await p.screenshot({path:SH+'adm.png'});
  await p.waitForTimeout(400);await p.screenshot({path:SH+'adm_b.png',clip:{x:240,y:100,width:340,height:40}});
  await p.click('#rkWrap [data-a="hs"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+'historico.png'});
  await p.click('#rkWrap [data-a="hsSea"][data-v="0"]',{force:true});await p.waitForTimeout(500);await p.click('#rkWrap [data-a="hsMode"]',{force:true});await p.waitForTimeout(300);await p.click('#rkModal .hsML button[data-k="pvp"]');await p.waitForTimeout(500);await p.screenshot({path:SH+'historico_pvp.png'});
  await p.click('#rkWrap [data-a="hsDet"]',{force:true});await p.waitForTimeout(400);await p.screenshot({path:SH+'detalhes.png'})});
await run('Bia',{tw_uid:'"u_Bia"',tw_nome:'"Bia"',tw_tit:'["rk1","rk7"]',tw_titOn:'"rk1"'},async p=>{
  await p.evaluate(()=>__pvT.tsync());await p.waitForTimeout(2500);console.log('Bia títulos',await p.evaluate(()=>[localStorage.tw_tit,localStorage.tw_titOn]));
  await p.evaluate(()=>__pvT.rv('pf'));await p.waitForTimeout(1500);await p.screenshot({path:SH+'bia.png'})});
console.log('ERROS',errs);await b.close()})();
