// v404: tocar num jogador da tela de RANKING abre o perfil e o voltar volta ao ranking
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()==='error')errs.push('C:'+m.text().slice(0,200))});
await p.route(/fonts\.g/,r=>r.abort());
const doc=(id,f)=>({document:{name:'x/torre/'+id,createTime:new Date().toISOString(),fields:Object.fromEntries(Object.entries(f).map(([k,v])=>[k,typeof v==='number'?{integerValue:String(v)}:{stringValue:v}]))}});
await p.route(/runQuery/,async r=>{const q=JSON.stringify(JSON.parse(r.request().postData()||'{}'));
  if(/"rk"/.test(q))return r.fulfill({contentType:'application/json',body:JSON.stringify([doc('a1',{nome:'Fulano',uid:'u123',rk:'1',rp:50000,char:'goku',tit:'',dmg:0,won:1,tt:60})])});
  if(/pfu/.test(q))return r.fulfill({contentType:'application/json',body:JSON.stringify([doc('p1',{nome:'Fulano',pfu:'u123',d:JSON.stringify({nome:'Fulano',rp:50000,ped:'goku'})})])});
  return r.fulfill({contentType:'application/json',body:'[{"readTime":"x"}]'})});
await p.route(/workers\.dev\/fs|firestore/,r=>r.fulfill({contentType:'application/json',body:'{}'}));
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Eu"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku"]',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(1500);await p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
await p.evaluate(()=>document.querySelector('#rkWrap [data-a="ranking"]').click());await p.waitForTimeout(2500);
const n=await p.evaluate(()=>[...document.querySelectorAll('[data-pu]')].map(e=>e.dataset.pu+'|'+e.textContent.slice(0,30)));console.log('itens',n);
await p.screenshot({path:'/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/pf1.png'});
const el=await p.$('[data-pu]');if(el){await el.click({force:true});await p.waitForTimeout(3000)}
console.log('depois',await p.evaluate(()=>[document.querySelector('#rkWrap .rkA')&&document.querySelector('#rkWrap .rkA').className,document.getElementById('rkToast')&&document.getElementById('rkToast').textContent]));
await p.screenshot({path:'/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/pf2.png'});await p.evaluate(()=>document.querySelector('#rkWrap [data-a="back"]').click());await p.waitForTimeout(2500);console.log('voltou',await p.evaluate(()=>document.querySelector('#rkWrap .rkA').className));
console.log('ERRS',errs.slice(0,6));await b.close()})();
