// v495: resetar atributos do Sistema do Sung (1º grátis, depois 500 💎)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',rk_gem:'1000',rk_sjs:JSON.stringify({cls:'necro',lv:20,pts:5,st:{for:40,vit:20,agi:15,per:10,int:10}})})}});
await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.evaluate(()=>__pvT.sjSysO());await p.waitForTimeout(600);await p.screenshot({path:SH+'reset_0.png'});
const S=()=>p.evaluate(()=>{const o=__pvT.sjSys();return {pts:o.pts,st:o.st,gem:+localStorage.getItem('rk_gem')}});
await p.click('.sjRs');await p.waitForTimeout(300);await p.screenshot({path:SH+'reset_1.png'});await p.click('#sjRsY');await p.waitForTimeout(400);const a=await S();
await p.click('[data-s="+"][data-k="int"]');await p.click('.sjRs');await p.waitForTimeout(300);await p.click('#sjRsY');await p.waitForTimeout(400);const c=await S();
console.log(JSON.stringify({gratis:a,pago:c}),errs.slice(0,3));await b.close()})();
