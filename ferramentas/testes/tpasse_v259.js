const {chromium}=require('playwright');const S=process.env.S;const W='/home/claude/fui-do-templo-a-pk-2/www/';const fs=require('fs');
fs.writeFileSync(W+'_t.html',fs.readFileSync(W+'index.html','utf8').replace('window.__G=G;','window.__G=G;window.__v25=()=>({BPF,BPN,BPP,bpG,bpS,bpAdd,rkView,bpClaim});'));
const IDS=new Set();
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,body:'{}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',tw_uid:'"u1"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_gem:'0',rk_red:'0',rk_tic:'0',rk_own:'["goku"]'})}});
await p.goto('file://'+W+'_t.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
console.log('sums',await p.evaluate(()=>{const R=__v25(),sum=T=>{const o={};for(const L of T)for(const x of L)for(const k in x)if(typeof x[k]==='number')o[k]=(o[k]||0)+x[k];return JSON.stringify(o)+' n'+T.length};return [sum(R.BPF),sum(R.BPN),sum(R.BPP)].join(' | ')}));
await p.click('#mRank');await p.waitForTimeout(700);await p.screenshot({path:S+'bp_menu.png'});
await p.click('#rkWrap [data-a="bpMenu"]');await p.waitForTimeout(800);await p.screenshot({path:S+'bp0.png'});
// missões: simular progresso
await p.evaluate(()=>{const R=__v25();R.bpAdd('fights',3);R.bpAdd('bossW',30);R.bpAdd('floor',70);R.bpAdd('spin',90)});
await p.click('#rkWrap [data-b="mis"]',{force:true});await p.waitForTimeout(500);await p.screenshot({path:S+'bp_mis.png'});
for(let i=0;i<8;i++){const ok=await p.evaluate(()=>{const b=document.querySelector('#rkModal .bpMi button');if(b){b.click();return 1}return 0});if(!ok)break;await p.waitForTimeout(200)}
await p.evaluate(()=>document.getElementById('rkMX').click());await p.waitForTimeout(400);
console.log('xp',await p.evaluate(()=>JSON.stringify(__v25().bpG()).slice(0,200)));
// código premium
await p.click('#rkWrap [data-b="code"]',{force:true});await p.waitForTimeout(300);await p.fill('#rkCdI','passepremium');await p.click('#rkCdOk');await p.waitForTimeout(900);
console.log('code',await p.evaluate(()=>(document.querySelector('#rkModal .twH.ok,#rkModal .twH.err')||{}).textContent));await p.evaluate(()=>{const x=document.getElementById('rkMX');x&&x.click()});
await p.evaluate(()=>__v25().rkView('bp'));await p.waitForTimeout(500);await p.screenshot({path:S+'bp1.png'});
await p.click('#rkWrap [data-b="all"]',{force:true});await p.waitForTimeout(3000);await p.evaluate(()=>{const x=document.getElementById('twCpOk');x&&x.click()});await p.waitForTimeout(1500);
console.log('after all',await p.evaluate(()=>'gem '+localStorage.rk_gem+' red '+localStorage.rk_red+' tic '+localStorage.rk_tic+' own '+localStorage.rk_own+' ps '+localStorage.rk_ps+' bp '+JSON.stringify(__v25().bpG()).slice(0,260)));
// tudo: xp max e pegar todos incluindo escolhas
await p.evaluate(()=>{const R=__v25(),o=R.bpG();o.xp=5000;R.bpS(o);R.rkView('bp')});await p.click('#rkWrap [data-b="pg"][data-d="1"]',{force:true});await p.waitForTimeout(400);
await p.evaluate(()=>{document.querySelectorAll('#twModal,#rkModal').forEach(m=>{});});
await p.click('#rkWrap [data-b="tr"]',{force:true});await p.waitForTimeout(300);await p.click('#rkWrap .bpCell [data-r="p"][data-i="14"]',{force:true});await p.waitForTimeout(500);await p.screenshot({path:S+'bp_pick.png'});
await p.evaluate(()=>document.querySelector('#rkModal .bpPkG button').click());await p.waitForTimeout(600);
await p.evaluate(()=>__v25().rkView('bp'));await p.waitForTimeout(300);
await p.click('#rkWrap .bpCell [data-r="p"][data-i="19"]',{force:true});await p.waitForTimeout(500);await p.evaluate(()=>document.querySelector('#rkModal .bpPkG button').click());await p.waitForTimeout(600);
await p.evaluate(()=>__v25().rkView('bp'));await p.waitForTimeout(300);await p.click('#rkWrap [data-b="all"]',{force:true});await p.waitForTimeout(3500);await p.evaluate(()=>{const x=document.getElementById('twCpOk');x&&x.click()});await p.waitForTimeout(1500);await p.evaluate(()=>__v25().rkView('bp'));await p.waitForTimeout(400);await p.screenshot({path:S+'bp2.png'});
console.log('final',await p.evaluate(()=>{const o=__v25().bpG();return 'cf'+o.cf.length+' cn'+o.cn.length+' cp'+o.cp.length+' own '+localStorage.rk_own+' inv '+(JSON.parse(localStorage.tw_inv||'[]').map(x=>x.nm||x.t+x.r).join(','))}));
console.log(errs);await b.close();fs.unlinkSync(W+'_t.html')})();
