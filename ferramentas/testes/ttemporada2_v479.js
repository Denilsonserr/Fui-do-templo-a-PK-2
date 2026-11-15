// v479: virada para a Temporada 2 (rp zera), prêmio/título da T1 (ranking antigo falso), títulos brilhantes, eventos 3x / passe / 2x sombra
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const E=[];const R={};
for(const pos of [1,2,3,7,0]){const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
 await p.route(/:runQuery/,async r=>{let b0={};try{b0=JSON.parse(r.request().postData())}catch(e){}const ob=b0.structuredQuery&&b0.structuredQuery.orderBy&&b0.structuredQuery.orderBy[0];if(!ob||ob.field.fieldPath!=='rp')return r.continue();
   const ct=new Date(Date.UTC(2026,10,15,10)).toISOString(),docs=[];const names=['Ana','Beto','Caio','Duda','Edu','Fabi','Gui','Hugo','Ivo','Juca','Kiko'];let k=0;
   for(let i=1;i<=11;i++){const nm=i===pos?'Eu':names[k++];docs.push({document:{name:'x/'+i,createTime:ct,fields:{rk:{stringValue:'1'},nome:{stringValue:nm},uid:{stringValue:nm==='Eu'?'U':'u'+i},rp:{integerValue:String(50000-i*1000)}}}})}
   r.fulfill({contentType:'application/json',body:JSON.stringify(docs)})});
 await p.addInitScript(pos=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Eu"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_rp:'23000',tw_uid:'"U"',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})});if(pos===0)localStorage.rk_rp='0'}},pos);
 await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
 await p.evaluate(()=>{try{localStorage.tw_uid=JSON.stringify(twUid())}catch(e){}});
 await p.click('#mRank');await p.waitForTimeout(5500);
 R['pos'+pos]=await p.evaluate(()=>({rp:localStorage.rk_rp,rpS1:localStorage.rk_rpS1,tit:localStorage.tw_tit,on:localStorage.tw_titOn,gem:localStorage.rk_gem,janela:!!document.getElementById('t1W')}));
 if(pos===1){await p.screenshot({path:'/tmp/t1_win.png'});R.ev=await p.evaluate(()=>[__pvT.ev()&&__pvT.ev()[3],__pvT.m()].join(' | '))}
 await p.close()}
const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});await p.route(/fonts\.g|firestore/,r=>r.abort());await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:99999;background:#1a1a2a;display:flex;flex-direction:column;gap:30px;align-items:center;justify-content:center;font-size:2.6vh';d.innerHTML=['t1c','t1v','t1b','t1x','t1g'].map(k=>'<div>'+__t2.tit(k)+'</div>').join('');document.body.appendChild(d)});await p.waitForTimeout(900);await p.screenshot({path:'/tmp/t1_tits.png'});
console.log(JSON.stringify(R,null,1),E.slice(0,3));await b.close()})();
