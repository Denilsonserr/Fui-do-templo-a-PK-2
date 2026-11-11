// v346: reset com devolução, atributos em pontos, constelação, conversão na luta
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/rpg_';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","shaka","aylla","yuta"]',rk_sel:'"goku"',rk_gem:'1000',tw_moedas:'100',rk_po:'5',
  rk_lv:JSON.stringify({goku:{lv:25,t:[0,1,2]},shaka:{lv:12,t:[3]}}),rk_cr:'[0,0,0,0,0]',rk_el:'[0,0,0,0,0]',
  tw_inv:JSON.stringify([{id:'e1',t:'esp',r:'lend',v:7,n:'ESPADA'},{id:'e2',t:'arm',r:'epica',v:5,n:'ARMADURA'},{id:'e3',t:'bot',r:'mit',v:10,n:'BOTA'}]),tw_eqp:JSON.stringify({esp:'e1',arm:'e2',bot:'e3'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');for(let i=0;i<10;i++){await p.waitForTimeout(500);const t=await p.evaluate(()=>(document.getElementById('rkModal')||{}).innerText||'');if(t)console.log('t',i,t.slice(0,60))}await p.screenshot({path:SH+'reset.png'});
console.log('reset',await p.evaluate(()=>[document.querySelector('#rkModal')?.innerText.replace(/\n+/g,' ').slice(0,400),localStorage.tw_moedas,localStorage.rk_po,localStorage.rk_el,localStorage.rk_cr,localStorage.rk_lv]));
await p.evaluate(()=>{document.getElementById('rkMX')?.click()});
console.log('stats',JSON.stringify(await p.evaluate(()=>['aylla','goku','yuta','shaka'].map(id=>{const s=__pvT.cs(id);return id+' '+s.atk+'/'+s.def+'/'+s.spd}))));
console.log('fight',JSON.stringify(await p.evaluate(()=>['aylla','goku','shaka'].map(id=>{const d=__pvT.dl(id);return id+' tdm '+(+d.tdm).toFixed(2)+' tdf '+(+d.tdf).toFixed(2)+' tsp '+(+d.tsp).toFixed(2)}))));
await p.evaluate(()=>{localStorage.rk_lv=JSON.stringify({goku:{lv:30,t:[],c:[]}});__pvT.lvo('goku')});await p.waitForTimeout(1200);await p.screenshot({path:SH+'nivel.png'});
await p.click('#rkWrap [data-a="cnsOpen"]',{force:true});await p.waitForTimeout(800);
for(const n of ['0-0','0-1','0-2','0-3','2-0','2-1']){await p.click(`#rkWrap [data-n="${n}"]`,{force:true});await p.waitForTimeout(250);await p.click('#rkWrap [data-a="cnsAct"]',{force:true}).catch(()=>{});await p.waitForTimeout(250)}
await p.click('#rkWrap [data-n="0-4"]',{force:true});await p.waitForTimeout(400);await p.screenshot({path:SH+'const.png'});
console.log('depois',await p.evaluate(()=>JSON.stringify([JSON.parse(localStorage.rk_lv).goku,__pvT.cs('goku').atk])));
console.log('ERROS',errs);await b.close()})();
