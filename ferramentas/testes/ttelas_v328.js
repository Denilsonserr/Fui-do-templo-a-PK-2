const {chromium}=require('playwright');const O=__dirname+'/sh/';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const J=JSON.stringify;Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Denilson"',rk_gem:'12345',rk_tic:'7',rk_red:'3',tw_moedas:'4500',rk_rp:'5000',rk_own:J(['goku','shaka','vegeta','zoro']),rk_sel:'"shaka"',rk_st:J({wins:12,loss:3}),ac_n:'Denilson',ac_k:'abc',ac_t:String(Date.now())})}});
await p.route(/:runQuery/,r=>{const N=['Vini_junior10','xdarwinzinn','Denilson','Breno','Ana','Luis','Kai'];r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(N.map((n,i)=>({document:{name:'x/torre/'+i,createTime:new Date().toISOString(),fields:{nome:{stringValue:n},uid:{stringValue:'u'+i},rk:{stringValue:'1'},rp:{integerValue:String(30000-i*3500)},dmg:{integerValue:String(90000-i*7000)},char:{stringValue:'goku'}}}})))})});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
const cl=()=>p.evaluate(()=>{const m=document.querySelector('#rkModal');if(m){m.hidden=true;m.innerHTML=''}const a=document.getElementById('acM');if(a){a.hidden=true;a.innerHTML=''}});
await cl();
for(const [a,n] of [['conta','conta'],['ranking','rank']]){await p.evaluate(a=>document.querySelector('#rkWrap .rk_menu [data-a="'+a+'"]').click(),a);await p.waitForTimeout(1800);await p.screenshot({path:O+'m_'+n+'.png'});
 if(n==='conta'){await p.evaluate(()=>document.querySelector('#acM .acTb.r').click());await p.waitForTimeout(700);await p.screenshot({path:O+'m_conta2.png'})}
 if(n==='rank'){await p.evaluate(()=>document.querySelector('#rkWrap [data-a="back"]').click());await p.waitForTimeout(800)}
 await cl()}
console.log(errs);await b.close()})();
