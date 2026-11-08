// v200: evento (ao vivo e encerrado com prêmio), ranking semanal e títulos. Firestore simulado.
const {chromium}=require('playwright');
const run=async(b,evT,pre,fn)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>errs.push((e.stack||e.message).slice(0,300)));
  await p.addInitScript(([evT,pre])=>{window.__twEvT=evT;if(pre&&!sessionStorage.done){sessionStorage.done=1;for(const k in pre)localStorage.setItem(k,JSON.stringify(pre[k]))}},[evT,pre]);
  const DB=fn.db||[],SENT=[];await p.route(/fonts\.g/,r=>r.abort());
  await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url(),body=r.request().postData();
    if(/:runQuery/.test(u)){const Q=JSON.parse(body).structuredQuery,ff=Q.where&&Q.where.fieldFilter;const L=DB.filter(e=>!ff||e[ff.field.fieldPath]===ff.value.stringValue).map(e=>({document:{createTime:new Date(e.ct).toISOString(),fields:Object.fromEntries(Object.entries(e).filter(([k])=>k!=='ct').map(([k,v])=>[k,typeof v==='number'?{integerValue:''+v}:{stringValue:v}]))}}));
      return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(L)})}
    const F=JSON.parse(body).fields,e={ct:Date.now()};for(const k in F)e[k]=F[k].stringValue!=null?F[k].stringValue:+F[k].integerValue;DB.push(e);SENT.push(e);return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await fn(p,SENT);console.log('ERROS',JSON.stringify(errs));await p.close()};
(async()=>{const b=await chromium.launch();const wait=(p,ms)=>p.waitForTimeout(ms);
const now=Date.now();
// A) evento AO VIVO: joga, perde no andar 2, envia com ev; ranking do evento mostra
const A=async(p,SENT)=>{await p.click('#mTorre');await wait(p,500);await p.click('.tile[data-c="garou"]');await wait(p,300);await p.click('#goStage');await wait(p,1500);await p.screenshot({path:'/tmp/ev_tela.png'});
  await p.click('#twEvB');await wait(p,1200);await p.screenshot({path:'/tmp/ev_live.png'});await p.click('#twEvX');
  await p.click('#twGo');await wait(p,1600);
  for(let i=0;i<2;i++){await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');await wait(p,300);await p.evaluate((i)=>{const G=__dbg.G;if(i)G.p[0].hp=50;else G.p[1].hp=50;G.timer=1;G.tf=59},i);await p.waitForFunction(()=>__dbg.G.mode==='tower');
    if(!i){await p.waitForSelector('#twModal .avp');await p.click('#twModal .avp[data-i="0"]');await wait(p,2500)}}
  await wait(p,2500);console.log('ENVIADO',JSON.stringify(SENT));await p.evaluate(()=>{document.querySelector('#twOut')&&0});
  await p.evaluate(()=>{const M=document.getElementById('twModal');M.hidden=true;M.innerHTML=''});await p.click('#twEvB');await wait(p,1500);await p.screenshot({path:'/tmp/ev_live2.png'});await p.click('#twEvX');
  await p.click('#twRankB');await wait(p,1000);await p.screenshot({path:'/tmp/ev_semana.png'});
  await p.evaluate(()=>{const M=document.getElementById('twModal');M.hidden=true;M.innerHTML=''});await p.click('#twTitB');await wait(p,600);await p.screenshot({path:'/tmp/ev_titulos.png'})};
A.db=[{nome:'Zé',andar:5,tempo:200,trof:12,char:'naruto',uid:'zz',tit:'con',sem:'X',ev:'ev20261108',ct:now-30000}];
await run(b,[-60000,600000],{tw_nome:'Teste',tw_uid:'meu'},A);
// B) evento ENCERRADO: eu em 1º -> ganho a espada mítica + título
const B=async(p)=>{await p.click('#mTorre');await wait(p,500);await p.click('.tile[data-c="garou"]');await wait(p,300);await p.click('#goStage');await wait(p,3500);await p.screenshot({path:'/tmp/ev_ganhou.png'});
  console.log('INV',await p.evaluate(()=>localStorage.tw_inv+' | '+localStorage.tw_tit+' | '+localStorage.tw_evc));
  await p.click('#twEvOk');await wait(p,300);await p.click('#twBagB');await wait(p,800);await p.screenshot({path:'/tmp/ev_mochila.png'});
  await p.click('#twModal .moS[data-id^="ev"]');await wait(p,300);await p.click('#twMoD button[data-a="eq"]');await wait(p,300);await p.click('#twBagX');
  await p.click('#twGo');await wait(p,1600);await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');console.log('LUTA',JSON.stringify(await p.evaluate(()=>({tdm:__dbg.G.p[0].tdm,tsp:__dbg.G.p[0].tsp}))))};
const t0=now-600000;B.db=[{nome:'Teste',andar:4,tempo:300,trof:9,char:'garou',uid:'meu',ev:'ev20261108',ct:t0+100000},{nome:'Zé',andar:3,tempo:200,trof:12,char:'naruto',uid:'zz',ev:'ev20261108',ct:t0+60000},{nome:'Bia',andar:7,tempo:100,trof:30,char:'goku',uid:'bb',ev:'ev20261108',ct:t0-60000}];
await run(b,[-600000,-200000],{tw_nome:'Teste',tw_uid:'meu'},B);
await b.close()})();
