// v663: endereço novo furiadotemplo.com.br — o progresso do endereço antigo (workers.dev) vai junto, sem digitar senha
// Os 2 endereços são simulados: tudo é servido pelo servidor local (localhost:8790), cada um com o seu localStorage.
const {chromium}=require('playwright');
const NEW='furiadotemplo.com.br',OLD='fui-do-templo-a-pk-2.denilsinend.workers.dev';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const ctx=await b.newContext({viewport:{width:915,height:412}});let bloqOld=false;
await ctx.route(/fonts\.g/,r=>r.abort());
await ctx.route(/^https:\/\/(www\.)?(furiadotemplo\.com\.br|fui-do-templo-a-pk-2\.denilsinend\.workers\.dev)\//,async r=>{const u=new URL(r.request().url());
  if(bloqOld&&u.hostname===OLD)return r.abort('connectionrefused');
  const ct=/\.txt$/.test(u.pathname)?'text/plain':/\.js$/.test(u.pathname)?'text/javascript':/\.html$|\/$/.test(u.pathname)?'text/html':/\.webp$/.test(u.pathname)?'image/webp':undefined;
  const res=await fetch('http://localhost:8790'+u.pathname+u.search,{method:r.request().method(),headers:{'Content-Type':'application/json'},body:r.request().postData()||undefined});
  const body=Buffer.from(await res.arrayBuffer());r.fulfill({status:res.status,body,headers:ct?{'content-type':ct}:{'content-type':res.headers.get('content-type')||'application/octet-stream'}})});
const p=await ctx.newPage();p.on('pageerror',e=>E.push(e.message));
const LS=()=>p.evaluate(()=>({h:location.host,hash:location.hash,nome:localStorage.getItem('tw_nome'),k:localStorage.getItem('ac_k'),gem:localStorage.getItem('rk_gem'),chk:localStorage.getItem('ft_migchk')}));
// 1) jogador antigo: tem progresso no endereço antigo
await p.goto('https://'+OLD+'/versao.txt');await p.evaluate(()=>{localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',ft_q:'1',rk_own:'["goku","vegeta"]',rk_sel:'"goku"',tw_nome:'"Bia"',rk_gem:'12345',ac_n:'"Bia"',ac_k:'abc123'})}).catch(()=>{});
// ir.html já mandou (tinha dados?) — começa de novo do jeito certo: abre o endereço NOVO pela 1ª vez
await p.goto('https://'+NEW+'/');await p.waitForFunction(()=>location.host==='furiadotemplo.com.br'&&localStorage.getItem('ft_migchk')==='1'&&!location.hash,null,{timeout:30000});
let s=await LS();chk(s.nome==='"Bia"'&&s.gem==='12345'&&s.k==='abc123','1ª vez no endereço novo: foi no antigo, trouxe nome, diamantes e conta (sem senha) → '+JSON.stringify(s));
await p.waitForFunction(()=>document.getElementById('goSelect')&&!document.getElementById('goSelect').disabled,null,{timeout:120000});
chk(await p.evaluate(()=>localStorage.getItem('rk_gem'))==='12345','o jogo abriu no endereço novo e manteve os 12345 diamantes');
// 2) abre de novo: não vai mais no antigo
let foi=0;p.on('framenavigated',f=>{if(f===p.mainFrame()&&f.url().includes(OLD))foi++});
await p.goto('https://'+NEW+'/');await p.waitForTimeout(5000);chk(!foi&&(await LS()).h===NEW,'2ª vez: fica no endereço novo, não vai mais no antigo');
// 3) código usado não serve de novo
const c=await p.evaluate(async()=>{const r=await fetch('/fs/mig-poe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({d:'{"tw_nome":"\\"X\\""}'})});return (await r.json()).c});
const r1=await p.evaluate(async c=>(await fetch('/fs/mig-pega',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({c})})).status,c);
const r2=await p.evaluate(async c=>(await fetch('/fs/mig-pega',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({c})})).status,c);
chk(/^[a-f0-9]{32}$/.test(c)&&r1===200&&r2===404,'código de passagem: aleatório e só funciona 1 vez ('+r1+' depois '+r2+')');
// 4) www → sem www
await p.goto('https://www.'+NEW+'/');await p.waitForFunction(()=>location.host==='furiadotemplo.com.br',null,{timeout:20000});chk(true,'www.furiadotemplo.com.br vai para furiadotemplo.com.br');
// 5) jogador NOVO (nada no antigo): volta rápido e começa do zero
const p2=await (await b.newContext({viewport:{width:915,height:412}})).newPage();await p2.context().route(/fonts\.g/,r=>r.abort());
await p2.context().route(/^https:\/\/(www\.)?(furiadotemplo\.com\.br|fui-do-templo-a-pk-2\.denilsinend\.workers\.dev)\//,async r=>{const u=new URL(r.request().url());const ct=/\.js$/.test(u.pathname)?'text/javascript':'text/html';
  const res=await fetch('http://localhost:8790'+u.pathname+u.search,{method:r.request().method(),headers:{'Content-Type':'application/json'},body:r.request().postData()||undefined});r.fulfill({status:res.status,body:Buffer.from(await res.arrayBuffer()),headers:{'content-type':/\/fs\//.test(u.pathname)?'application/json':ct}})});
await p2.goto('https://'+NEW+'/');await p2.waitForFunction(()=>location.host==='furiadotemplo.com.br'&&localStorage.getItem('ft_migchk')==='1'&&!location.hash,null,{timeout:30000});
chk(!(await p2.evaluate(()=>localStorage.getItem('tw_nome'))),'jogador novo: passou no antigo, não tinha nada, voltou e começa do zero');
// 6) endereço antigo bloqueado pela operadora: não trava, joga no novo
const ctx3=await b.newContext({viewport:{width:915,height:412}});const p3=await ctx3.newPage();await ctx3.route(/fonts\.g/,r=>r.abort());
await ctx3.route(/^https:\/\/(www\.)?(furiadotemplo\.com\.br|fui-do-templo-a-pk-2\.denilsinend\.workers\.dev)\//,async r=>{const u=new URL(r.request().url());if(u.hostname===OLD)return r.abort('connectionrefused');const ct=/\.js$/.test(u.pathname)?'text/javascript':'text/html';
  const res=await fetch('http://localhost:8790'+u.pathname+u.search);r.fulfill({status:res.status,body:Buffer.from(await res.arrayBuffer()),headers:{'content-type':ct}})});
await p3.goto('https://'+NEW+'/');await p3.waitForTimeout(6000);
chk(await p3.evaluate(()=>location.host==='furiadotemplo.com.br'&&localStorage.getItem('ft_migchk')==='1'&&!document.getElementById('migM')),'endereço antigo bloqueado: não sai do novo, tira o aviso e o jogo segue');
// 7) aviso no endereço antigo (navegador)
const p4=await ctx.newPage();await p4.goto('https://'+OLD+'/');await p4.waitForSelector('#migM',{timeout:30000});
const t=await p4.textContent('#migM');chk(/MUDOU DE ENDEREÇO/.test(t)&&/progresso/.test(t),'endereço antigo mostra o aviso "o jogo mudou de endereço" com botão');
await p4.screenshot({path:'/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/aviso_v663.png'});
await p4.click('#migS');await p4.waitForFunction(()=>location.host==='furiadotemplo.com.br'&&!location.hash,null,{timeout:30000});
chk(true,'botão IR PARA O SITE NOVO leva para furiadotemplo.com.br');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
