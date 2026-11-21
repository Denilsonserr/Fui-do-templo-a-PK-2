// v587: correção dos diamantes do erro do leilão (Stark/Honrado/Breno/anônimo) + lances antigos dessas contas não valem + diamantes à vista
const {chromium}=require('playwright');
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
  const U='http://localhost:8790/fs/v1/projects/x/databases/(default)/documents/torre?documentId=';
  await fetch(U+'l2_lxa2_stark_old',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{lei:{stringValue:'2'},lot:{stringValue:'lxa2'},lv:{integerValue:'7000000'},t:{integerValue:String(Date.UTC(2026,10,21,0,25))},uid:{stringValue:'mwe5v81ci1cbh2k0'},nome:{stringValue:'Stark'}}})});
  const page=async(nome,uid,t,x)=>{const p=await b.newPage({viewport:{width:915,height:422},deviceScaleFactor:2});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.clock.setFixedTime(t);
    await p.addInitScript(([n,u,x])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_l2rs1:'1',tw_nome:JSON.stringify(n),tw_uid:JSON.stringify(u)},x)}},[nome,uid,x]);
    await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(12000);return p};
  const T=Date.UTC(2026,10,21,0,45);const gem=p=>p.evaluate(()=>JSON.parse(localStorage.rk_gem));
  let p=await page('Stark','mwe5v81ci1cbh2k0',T,{rk_gem:'522298',rk_l2E:JSON.stringify({lxa2:{v:7000000}})});chk(await gem(p)===497898,'Stark: volta para 497.898 e o lance de 7 milhões (antes de 21:40) não vale ('+(await gem(p))+')');
  const top=await p.evaluate(async()=>{const B=await __pvT.l2.load();return B.lxa2?B.lxa2.lv:0});chk(top!==7000000,'o lance de 7 milhões sumiu do leilão');
  await p.evaluate(()=>__pvT.l2.open());await p.waitForTimeout(2000);await p.screenshot({path:__dirname+'/shots/t587_tela.png'});await p.close();
  p=await page('Honrado','mwc8atkrgg4fns2f',T,{rk_gem:'1589576'});chk(await gem(p)===549606,'Honrado: 329.606 + 220.000 = 549.606');await p.close();
  p=await page('Breno','mw8697axqj3ixwzu',T,{rk_gem:'683829'});chk(await gem(p)===682154,'Breno: 382.154 + 300.000 = 682.154');await p.close();
  p=await page('Jogador anônimo','mw82q4abrrmnp9ku',T,{rk_gem:'328645',rk_luvG:'1'});chk(await gem(p)===200533,'anônimo com o presente LOVE: 533 + 200.000');await p.close();
  p=await page('Vini_junior10','mw7zyp25umo6mudo',T,{rk_gem:'452664'});chk(await gem(p)===452664,'Vini não muda');await p.close();
  console.log(E.length?'ERROS '+E.join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
