// v298: recuperar conta com código (servidor simulado): carrega o save, senha nova, depois ENTRAR com a senha nova
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let saves=[{ts:1794305051213,d:JSON.stringify({tw_nome:'"Breno"',rk_gem:'777',rk_own:'["goku","yuta"]'}),sg:'velha'}];const used=new Set();
const route=async(p)=>{await p.route(/fonts\.g/,r=>r.abort());await p.route(/firestore/,r=>{const q=r.request(),u=q.url(),body=q.postData()||'';
  if(/runQuery/.test(u)&&/"sv"/.test(body))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(saves.slice().sort((a,c)=>c.ts-a.ts).map(s=>({document:{name:'x',fields:{ts:{integerValue:String(s.ts)},d:{stringValue:s.d},sg:{stringValue:s.sg}}}})))});
  if(q.method()==='POST'&&/documentId=sv_/.test(u)){const F=JSON.parse(body).fields;saves.push({ts:+F.ts.integerValue,d:F.d.stringValue,sg:F.sg.stringValue});return r.fulfill({status:200,body:'{}'})}
  const m=u.match(/documentId=(cupom_[^&]+)/);if(m){if(used.has(m[1]))return r.fulfill({status:409,body:'{}'});used.add(m[1]);return r.fulfill({status:200,body:'{}'})}
  return r.fulfill({status:200,contentType:'application/json',body:'[]'})})};
const errs=[];
let p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await route(p);
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Breno"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_gem:'5'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(1500);await p.evaluate(()=>{try{rkModal(null)}catch(e){}});await p.click('#rkWrap [data-a="code"]',{force:true});await p.waitForTimeout(300);await p.fill('#rkCdI','BRENO-VOLTA-4M8P');await p.evaluate(()=>document.getElementById('rkCdOk').click());await p.waitForTimeout(1500);
await p.fill('#arP1','nova123');await p.fill('#arP2','nova123');await p.click('#arGo');await p.waitForTimeout(4000);
console.log('depois do código',await p.evaluate(()=>({gem:localStorage.rk_gem,own:localStorage.rk_own,n:localStorage.ac_n,rec:localStorage.ac_rec})),'saves',saves.length);await p.close();
// outro aparelho: ENTRAR com a senha nova e com a errada
p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await route(p);
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const ent=async pw=>{await p.evaluate(()=>{try{document.getElementById('acX').click()}catch(e){}});await p.click('#mConta',{force:true});await p.waitForTimeout(400);await p.evaluate(()=>{const b=[...document.querySelectorAll('#acM .twTab button')].find(x=>x.dataset.t==='entrar');if(b)b.click()});await p.waitForTimeout(300);await p.fill('#acN','breno');await p.fill('#acP',pw);await p.click('#acIn');await p.waitForTimeout(700);return p.evaluate(()=>(document.getElementById('acE')||{}).textContent)};
console.log('senha velha errada:',await ent('qualquer'));console.log('senha nova:',await ent('nova123'));await p.waitForTimeout(3000);console.log('depois de entrar',await p.evaluate(()=>({gem:localStorage.rk_gem,n:localStorage.ac_n})));
console.log('erros',JSON.stringify(errs));await b.close()})();
