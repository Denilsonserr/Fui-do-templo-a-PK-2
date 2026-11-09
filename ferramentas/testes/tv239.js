// v239: gacha mítica do Yuta (SORTE MÍTICA + título nº), itens secretos, anel, biblioteca nova, sistema de nível e drops com sorte. Servidor simulado.
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const DB={};
const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});const m=u.match(/documentId=([^&]+)/),id=m?m[1]:'a'+Math.random();if(DB[id])return r.fulfill({status:409,body:'{}'});DB[id]=1;return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
DB['yttit_1']=1;DB['yttit_2']=1; // 2 pessoas já pegaram
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Teste"',tw_uid:'"u1"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","naruto","zoro","aylla"]',rk_sel:'"goku"',rk_rp:'5200',rk_dia:'1',rk_gem:'5000',rk_tic:'3',tw_moedas:'20000',rk_po:'500',rk_cr:'[5,3,2,1,1]',rk_el:'[1,0,0,0,0]'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(600);
const shot=n=>p.screenshot({path:SH+'v9_'+n+'.png'});const W=ms=>p.waitForTimeout(ms);
await p.click('#mRank');await W(600);await p.click('#rkWrap [data-a="gacha"]');await W(1200);await shot('gacha');
await p.click('#rkWrap [data-a="ban"][data-b="esp"]');await W(700);await shot('gacha_esp');await p.click('#rkWrap .gbTabs [data-b="mit"]');await W(600);
// força o Yuta no 1º giro
await p.evaluate(()=>{localStorage.rk_pityY='249'});await p.click('#rkWrap [data-a="sum1"]');await W(800);await p.mouse.click(400,200);await W(1500);await shot('cards');
for(let i=0;i<40;i++){const st=await p.evaluate(()=>({m:!!document.querySelector('.rkMega'),w:!!document.querySelector('.rkWin'),ok:!!document.querySelector('#rkCdOk:not([hidden])')}));if(st.m){await shot('mega');await W(3600)}else if(st.w){await W(1500);await shot('win'+i);await p.mouse.click(450,200);await W(800)}else if(st.ok)break;else await W(500)}
await shot('fim_giro');const r1=await p.evaluate(()=>({own:localStorage.rk_own,tit:localStorage.tw_tit,titOn:localStorage.tw_titOn,po:localStorage.rk_po}));
await p.evaluate(()=>{const b=document.querySelector('#rkCdOk');if(b)b.click()});await W(500);await shot('gacha_owned');
// item secreto
await p.evaluate(()=>{localStorage.rk_pityYS='199'});await p.click('#rkWrap [data-a="sum1"]');await W(800);await p.mouse.click(400,200);await W(2500);await shot('secreto');
for(let i=0;i<10;i++){const w=await p.evaluate(()=>!!document.querySelector('.rkWin'));if(w){await p.mouse.click(450,200);await W(600)}const ok=await p.evaluate(()=>!!document.querySelector('#rkCdOk:not([hidden])'));if(ok)break;await W(500)}
await p.evaluate(()=>{const b=document.querySelector('#rkCdOk');if(b)b.click()});await W(400);
const inv=await p.evaluate(()=>JSON.parse(localStorage.tw_inv||'[]').filter(x=>x.yt).map(x=>x.nm+':'+x.t));
// biblioteca
await p.click('#rkWrap [data-a="back"]');await W(400);await p.click('#rkWrap [data-a="lib"]');await W(1200);await shot('lib');
await p.click('#rkWrap .rkCell[data-id="yuta"]');await W(600);await shot('lib_yuta');
await p.click('#lbEvo',{force:true});await W(900);await shot('lvl');
for(let i=0;i<12;i++){await p.click('#rkWrap .lvUp',{force:true});await W(150)}await W(500);await shot('lvl_up');
await p.click('#rkWrap .lvNd[data-r="0"][data-c="0"]',{force:true});await W(300);await shot('lvl_node');await p.click('#lvOk');await W(500);
await p.click('#rkWrap .lvNd[data-r="1"][data-c="1"]',{force:true});await W(300);await p.click('#lvOk');await W(500);await shot('lvl_tree');
const lv=await p.evaluate(()=>localStorage.rk_lv);
// mochila com anel
await p.click('#rkWrap [data-a="back"]');await W(300);await p.click('#rkWrap [data-a="back"]');await W(300);await p.click('#rkWrap [data-a="boss"]');await W(800);await p.click('#rkWrap [data-a="equip"]');await W(700);await shot('equip');
console.log(JSON.stringify({r1,inv,lv,errs}));await b.close()})();
