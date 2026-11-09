// v232: cache das consultas do servidor + parar de consultar quando o limite (429) acaba
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
let n=0,mode=200;await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u)){n++;if(mode===429)return r.fulfill({status:429,contentType:'application/json',body:'{"error":{"status":"RESOURCE_EXHAUSTED"}}'});return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{document:{name:'x/torre/a',createTime:'2026-11-08T10:00:00Z',fields:{rk:{stringValue:'1'},nome:{stringValue:'Vini'},rp:{integerValue:'16000'},uid:{stringValue:'u9'}}}}])})}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_sel:'"goku"',rk_dia:'1'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(600);const n0=n;
for(let i=0;i<3;i++){await p.click('#rkWrap [data-a="ranking"]');await p.waitForTimeout(500);await p.click('#rkMX');await p.waitForTimeout(200)}const n1=n;
await p.click('#rkWrap [data-a="ranking"]');await p.waitForTimeout(500);const txt=await p.evaluate(()=>document.getElementById('rkRkL').innerText.slice(0,60));await p.click('#rkMX');
mode=429;await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(1500);const n2=n;await p.click('#rkWrap [data-a="back"]');await p.waitForTimeout(300);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(1500);const n3=n;
console.log(JSON.stringify({leiturasAoAbrir:n0,rankingAberto4vezes:n1-n0,txt,depoisDo429:n2,maisConsultasDepois:n3-n2}),'ERROS',JSON.stringify(errs));await b.close()})();
