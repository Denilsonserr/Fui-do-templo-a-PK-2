// v500: vencedor do leilão recebe a mensagem e resgata 1 vez; outro jogador não vê nada
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
async function mk(b,nome,uid){const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
  await p.addInitScript(([n,u])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:JSON.stringify(n),rk_ini:'1',rk_xpv2:'1',tw_uid:JSON.stringify(u)})}},[nome,uid]);
  await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(8500);p.E=E;return p}
(async()=>{const b=await chromium.launch();const H=await mk(b,'Honrado','mwc8atkrgg4fns2f');const vis=await H.evaluate(()=>!!document.getElementById('leiCl'));await H.screenshot({path:SH+'lei_msg.png'});
  await H.click('#leiClY');await H.waitForTimeout(600);const got=await H.evaluate(()=>({an:JSON.parse(localStorage.getItem('rk_an')||'[]').map(r=>[r.c,r.g,r.l]),v2:JSON.parse(localStorage.getItem('tw_inv')||'[]').filter(x=>x.v2).map(x=>x.nm)}));
  await H.reload();await H.waitForTimeout(9000);const again=await H.evaluate(()=>!!document.getElementById('leiCl'));
  const V=await mk(b,'Van Hohenheim','outroaparelho');const vv=await V.evaluate(()=>document.getElementById('leiCl')?document.getElementById('leiCl').innerText.slice(0,200):null);
  const X=await mk(b,'Fulano','xyz');const xv=await X.evaluate(()=>!!document.getElementById('leiCl'));
  console.log(JSON.stringify({honrado:{viu:vis,got,deNovo:again},van:vv,fulano:xv}),[...H.E,...V.E,...X.E].slice(0,3));await b.close()})();
