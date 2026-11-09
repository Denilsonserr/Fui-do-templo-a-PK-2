const {chromium}=require('playwright');const S=process.env.S;const W='/home/claude/fui-do-templo-a-pk-2/www/';
const fs=require('fs');fs.writeFileSync(W+'_t.html',fs.readFileSync(W+'index.html','utf8').replace('window.__G=G;','window.__G=G;window.__v25=()=>({rkAddRing,rkPoRoll,twAddPoc,rkCuraTick,rkDropF,rkView,mdPick,lvLuck,setPD:v=>{RKPDN=v}});'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","yuta"]',rk_sel:'"yuta"',rk_rp:'100000',rk_dia:'1',rk_mold:'"rk10"',tw_tit:'["rk10"]',tw_titOn:'"rk10"',
 tw_poc:JSON.stringify([{id:'p1',r:'rara',v:7}])})}});
await p.goto('file://'+W+'_t.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
console.log('E0',errs,await p.evaluate(()=>typeof window.__v25+typeof window.__G));await p.click('#mPerfil');await p.waitForTimeout(1500);await p.screenshot({path:S+'v250_pf.png'});
await p.evaluate(()=>{const R=__v25();for(const r of ['comum','mit','sec'])R.rkAddRing(r);for(const pk of ['cura','drop'])for(const k of ['comum','lend','sec'])R.twAddPoc({k,pk,v:{comum:3,lend:45,sec:100}[k]});});
console.log('rings',await p.evaluate(()=>{const Q=JSON.parse(localStorage.tw_eqp);const I=JSON.parse(localStorage.tw_inv);return JSON.stringify(I.find(x=>x.id===Q.anel))+' dropF '+__v25().rkDropF()}));
console.log('roll',await p.evaluate(()=>JSON.stringify([0,1,2,3,4].map(()=>__v25().rkPoRoll()))));
await p.click('#rkWrap [data-a="back"]');await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(700);
await p.evaluate(()=>__v25().rkView('rb'));await p.waitForTimeout(800);await p.screenshot({path:S+'v250_rb.png'});
await p.evaluate(()=>__v25().rkView('boss'));await p.waitForTimeout(500);await p.click('#rkWrap [data-a="equip"]');await p.waitForTimeout(800);
await p.click('#rkModal .twTab button[data-f="poc"]');await p.waitForTimeout(400);
const cards=await p.$$('#rkModal .eqI');await cards[0].click();await p.waitForTimeout(300);await p.screenshot({path:S+'v250_poc.png'});
// beber cura e drop lendárias
for(const nm of ['POÇÃO DE CURA','POÇÃO DE DROP']){await p.evaluate(nm=>{const b=[...document.querySelectorAll('#rkModal .eqI')].find(b=>b.textContent.includes(nm)&&b.querySelector('b').textContent.includes('45'));b.click()},nm);await p.waitForTimeout(300);await p.click('#rkModal .eqD button[data-d="beber"]');await p.waitForTimeout(300)}
await p.screenshot({path:S+'v250_beber.png'});console.log(await p.evaluate(()=>localStorage.rk_pk_cura+' '+localStorage.rk_pk_drop+' | '+document.querySelector('#rkModal p.eqT:last-of-type').textContent));
await p.click('#rkModal .twTab button[data-f="anel"]');await p.waitForTimeout(400);await p.screenshot({path:S+'v250_anel.png'});
console.log('cura',await p.evaluate(()=>{__G.p=[{hp:100,mhp:1000,rkCura:45,x:300,y:400,def:{id:'yuta'}}];__v25().rkCuraTick();return __G.p[0].hp+' '+__G.p[0].rkCura}));
console.log('luck',await p.evaluate(()=>{const R=__v25();const a=R.lvLuck();R.setPD(45);const b=R.lvLuck();R.setPD(0);return a.toFixed(2)+' -> '+b.toFixed(2)}));
await p.evaluate(()=>__v25().mdPick&&__v25().mdPick());await p.waitForTimeout(800);await p.screenshot({path:S+'v250_md.png'});
console.log(errs);await b.close();fs.unlinkSync(W+'_t.html')})();
