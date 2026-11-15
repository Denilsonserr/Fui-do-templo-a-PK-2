// v457 (agora 09:00): antes = 08:50, depois = 09:02. v437: lançamento do Sung (15/11 08:00) — antes: banner trancado e Sung fora da lista; depois: banner 80/800, Sung na lista; tela SOMBRAS evolui com essência + moedas
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
async function run(b,depois,adm){const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
  await p.clock.install({time:depois?Date.UTC(2026,10,15,12,2):Date.UTC(2026,10,15,11,50)});
  await p.addInitScript(a=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:a?'"Denilson ADM"':'"Fulano"',tw_tit:a?'["adm"]':'[]',rk_ini:'1',rk_xpv2:'1',rk_gem:'5000',tw_moedas:'20000',rk_sje:'300',rk_ban:'mit',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'sung',b:'goku',s:'cupula'})})}},adm);
  await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(2500);
  const r={allc:await p.evaluate(()=>{const t=document.querySelector('#roster .tile[data-c="sung"]');return {tile:t?!t.hidden:'sem',rar:typeof rkRar}})};
  await p.evaluate(()=>__pvT.rkO('gacha'));await p.waitForTimeout(1200);
  await p.screenshot({path:SH+'ban_'+(depois?'depois':'antes')+'.png'});
  const g0=await p.evaluate(()=>+localStorage.getItem('rk_gem'));await p.evaluate(()=>{const b=document.querySelector('.rkA [data-a="sum1"]');if(b)b.click()});await p.waitForTimeout(1500);
  r.gemas=[g0,await p.evaluate(()=>+localStorage.getItem('rk_gem'))];r.toast=await p.evaluate(()=>[...document.querySelectorAll('.rkToast,.twToast')].map(x=>x.textContent).join('|'));
  r.errs=errs.slice(0,3);await p.close();return r}
(async()=>{const b=await chromium.launch();const A=await run(b,0,1),B=await run(b,1,0);
  const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
  await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',tw_moedas:'20000',rk_sje:'300',rk_sjs:JSON.stringify({cls:'necro'})})}});
  await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
  await p.evaluate(()=>__pvT.sjShOpen());await p.waitForTimeout(800);await p.screenshot({path:SH+'sombras_1.png'});
  for(let i=0;i<4;i++){await p.click('#sjShw .sjEvo');await p.waitForTimeout(250)}await p.waitForTimeout(400);await p.screenshot({path:SH+'sombras_5.png'});
  const C={sjs:await p.evaluate(()=>__pvT.sjSys().shl),ess:await p.evaluate(()=>localStorage.getItem('rk_sje')),moe:await p.evaluate(()=>localStorage.getItem('tw_moedas'))};
  console.log(JSON.stringify({antes:A,depois:B,sombra:C}),errs.slice(0,3));await b.close()})();
