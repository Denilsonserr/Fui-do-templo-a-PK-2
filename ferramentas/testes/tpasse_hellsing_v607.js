// v607: PASSE TEMPORADA DE HELLSING (reinicia), prêmios grátis/premium, código premium (COD) e 2X (C2X), set do Alucard na invocação (200..300, sem repetir)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
const page=async(extra)=>{const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.clock.install({time:Date.UTC(2026,10,22,16,30)});
  await p.addInitScript(o=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,o)}},Object.assign({rk_ini:'1',rk_xpv2:'1',tw_nome:'"Bia"',rk_own:'["goku"]',rk_gem:'0',rk_bp:JSON.stringify({s:2,xp:5000,c:{},dd:'',d:{},dc:[],sc:[],cf:[0,1],cn:[],cp:[],own:2})},extra||{}));
  await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1200);return p};
let p=await page();
const bp=await p.evaluate(()=>JSON.parse(localStorage.rk_bp||'{}'));
await p.click('#mRank');await p.waitForTimeout(1200);await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m)m.innerHTML='';document.querySelector('#rkWrap [data-a="bpMenu"]').click()});await p.waitForTimeout(1000);await p.screenshot({path:SH+'passe_hellsing.png'});
const st=await p.evaluate(()=>{const t=document.querySelector('#rkWrap .bp2Lv b');const pm=document.querySelector('#rkWrap .bp2Pm');return {lv:t&&t.textContent,pm:pm&&pm.textContent}});chk(st.lv==='0'&&/CÓDIGO/.test(st.pm||''),'temporada nova: passe reiniciado (nível 0, sem premium) '+JSON.stringify(st));
/* sobe para o nível 20 e pega tudo do grátis */
await p.evaluate(()=>{const o=JSON.parse(localStorage.rk_bp);o.s=3;o.xp=99999;o.own=0;o.cf=[];o.cp=[];localStorage.rk_bp=JSON.stringify(o)});await p.evaluate(()=>{document.querySelector('#rkWrap [data-a="bpMenu"]')&&0});
await p.evaluate(()=>{const b=document.querySelector('#rkWrap [data-b="all"]');b&&b.click()});await p.waitForTimeout(1500);
const f=await p.evaluate(()=>({gem:+localStorage.rk_gem,own:JSON.parse(localStorage.rk_own)}));chk(f.gem>=6500&&f.gem<=7500,'grátis: ~7.000 💎 ('+f.gem+')');chk(f.own.some(x=>['naruto','madara','garou'].includes(x)),'grátis nível 20: mítico normal ('+f.own.join(',')+')');
/* código premium */
const cod=await p.evaluate(c=>new Promise(r=>{const E={className:'',textContent:''};window.__cup(c,E).then(()=>r(E.className+' '+E.textContent))}),process.env.COD);
await p.waitForTimeout(300);const own=await p.evaluate(()=>JSON.parse(localStorage.rk_bp).own);chk(own===2,'código PREMIUM novo libera o passe pago ('+cod.slice(0,60)+')');
const g0=await p.evaluate(()=>+localStorage.rk_gem);await p.evaluate(()=>{document.querySelector('#rkWrap [data-b="all"]').click()});await p.waitForTimeout(2500);
const pr=await p.evaluate(()=>({gem:+localStorage.rk_gem,inv:JSON.parse(localStorage.tw_inv||'[]').map(x=>x.nm).filter(Boolean),own:JSON.parse(localStorage.rk_own),an:JSON.parse(localStorage.rk_an||'[]').map(r=>r.c+':'+r.g+':'+(r.l==null?'':r.l))}));
chk(pr.gem-g0>=29000&&pr.gem-g0<=31000,'premium: ~30.000 💎 ('+(pr.gem-g0)+')');
chk(['LUVAS DO REI VAMPIRO','ANEL DO REI VAMPIRO','CHAPÉU DO REI VAMPIRO'].every(n=>pr.inv.includes(n)),'premium: Luvas, Anel e Chapéu do Rei Vampiro');
chk(pr.an.some(a=>a.startsWith('5:8:0')),'premium: anel DOURADO SP nível 0');chk(pr.an.some(a=>a.startsWith('4:7')),'premium: anel VERMELHO SSS');
chk(pr.own.some(x=>['shaka','sung','yuta'].includes(x)),'premium nível 20: caixa Shaka/Sung/Yuta ('+pr.own.join(',')+')');
await p.close();
p=await page();/* set do Alucard na invocação */
const R=await p.evaluate(()=>{localStorage.rk_own='["goku","alucard"]';localStorage.rk_pityALS='0';const out=__pvT.alSetRoll(2500);return {out,left:__pvT.alSec()}});
const firsts=R.out.map((a,i)=>a[0]-(i?R.out[i-1][0]:0));const names=R.out.map(a=>a[1]);
chk(firsts.every(v=>v>=200&&v<=300),'cada peça do set sai entre o giro 200 e 300 ('+firsts.join(',')+')');chk(new Set(names).size===6&&!R.left.length,'6 peças diferentes, nunca repete ('+names.join(',')+')');
console.log(E.length?'ERROS '+E.slice(0,5).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
