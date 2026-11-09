const {chromium}=require('playwright');const S=process.env.S;const W='/home/claude/fui-do-templo-a-pk-2/www/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_own:'["goku","yuta","naruto"]',rk_sel:'"yuta"',rk_rp:'16000',tw_tit:'["rk5"]',tw_titOn:'"rk5"',
 rk_ps:JSON.stringify({jn:3,ch:{yuta:{r:'lend',i:4}}}),tw_inv:JSON.stringify([{id:'a',t:'cap',r:'obs',v:0,def:40,crit:20,st:30,drop:30,nm:'RIKA',yt:1,ysec:1},{id:'b',t:'arm',r:'sec',v:60,trf:10,nm:'UNIFORME DO YUTA',yt:1,ysec:1},{id:'c',t:'esp',r:'lend',v:25,crit:15,uniq:1,nm:'LÂMINA DOURADA',ps:{r:'mit',i:0}},{id:'d',t:'anel',r:'mit',v:0,drop:20,nm:'ANEL DE DROP'}]),tw_eqp:'{"cap":"a","arm":"b","esp":"c","anel":"d"}'})}});
await p.goto('file://'+W+'index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="lib"]');await p.waitForTimeout(900);
await p.evaluate(()=>{const b=document.querySelector('#rkGrid .rkCell[data-id="yuta"]');b&&b.click()});await p.waitForTimeout(700);await p.screenshot({path:S+'cb1.png'});
await p.click('#lbAll',{force:true});await p.waitForTimeout(600);await p.screenshot({path:S+'cb2.png'});
await p.evaluate(()=>document.getElementById('rkMX').click());await p.evaluate(()=>{const b=document.querySelector('#rkGrid .rkCell[data-id="naruto"]');b&&b.click()});await p.waitForTimeout(500);await p.click('#lbAll',{force:true});await p.waitForTimeout(500);await p.screenshot({path:S+'cb3.png'});
console.log(errs);await b.close()})();
