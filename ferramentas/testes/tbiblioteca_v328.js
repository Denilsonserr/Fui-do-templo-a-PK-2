const {chromium}=require('playwright');const O=__dirname+'/sh/';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();const J=JSON.stringify;Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Denilson"',rk_gem:'12345',rk_tic:'7',rk_red:'3',tw_moedas:'4500',rk_rp:'5000',
 rk_own:J(['goku','shaka','vegeta','zoro']),rk_sel:'"shaka"',rk_lv:J({shaka:{lv:40,t:[]}}),
 rk_an:J([{i:'a1',c:4,g:6,s:'dano',v:4.5,a:0,l:20},{i:'a2',c:3,g:5,s:'crit',v:5.4,a:30000,l:10},{i:'a3',c:2,g:3,s:'vel',v:3,a:0,l:5},{i:'a4',c:1,g:2,s:'st',v:10,a:0,l:3},{i:'a5',c:0,g:1,s:'uv',v:2,a:0,l:1}]),rk_anEq:J({shaka:['a1','a2','a3',null,null,null,null,null]}),
 tw_inv:J([{id:'i1',t:'esp',r:'lend',v:8},{id:'i2',t:'cap',r:'mit',v:10},{id:'i3',t:'bot',r:'rara',v:4},{id:'i4',t:'arm',r:'epica',v:6},{id:'i5',t:'esp',r:'comum',v:2},{id:'i6',t:'arm',r:'mit',v:12}]),tw_eqp:J({esp:'i1',cap:'i2'})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{const m=document.querySelector('#rkModal');if(m){m.hidden=true;m.innerHTML=''}});
await p.evaluate(()=>document.querySelector('#rkWrap [data-a="lib"]').click());await p.waitForTimeout(800);
for(const t of ['chr','eq','it','col','an']){await p.evaluate(t=>{document.querySelector('#rkWrap [data-a="tab"][data-t="'+t+'"]').click()},t);await p.waitForTimeout(1200);await p.evaluate(()=>{const m=document.querySelector('#rkModal');if(m){m.hidden=true;m.innerHTML=''}});await p.screenshot({path:O+'lib_'+t+'.png'})}
console.log(errs);await b.close()})();
