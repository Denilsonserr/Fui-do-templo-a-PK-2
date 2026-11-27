// v650: Ranqueada PVP nova — 13 ranks, 5 ⭐, sobe/cai, Bronze não cai, sequência (sem extra nos divinos), proteção, 10 seguidas 1x, elite, temporada zerada, Boss independente + tela
const {chromium}=require('playwright');const SH=__dirname+'/shots/t650_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',rk_rp:'777',
  rk_pvp:JSON.stringify({t:8,d:2,s:7,w:50,l:3,sq:0,bt:8,bd:2,rw:[1,2,3,4,5,6,7,8],h:[],rz:2})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const r=await p.evaluate(()=>{const ev=__ev,G=()=>ev('pvG()');const out={};ev('rkS("rp",777)');
  const o0=G();out.reset=o0.t===0&&o0.s===0&&o0.w===0;out.n=ev('PVT.length');
  const mk=(t,s,x)=>Object.assign({t,d:0,s,w:0,l:0,sq:0,bt:0,rw:[],h:[],pp:0,sh:0},x||{});const st=(o,w)=>ev('pvStep')(o,w);
  let o=mk(0,4);st(o,1);out.sobe=[o.t,o.s];                       // 4⭐ +1 = sobe Prata 0⭐
  o=mk(0,0);st(o,0);out.bronze=[o.t,o.s];                          // Bronze 0 perde = continua
  o=mk(3,0);st(o,0);out.cai=[o.t,o.s];                             // Platina 0⭐ perde → Ouro 4⭐
  o=mk(2,1,{sq:2});let x=st(o,1);out.seq=[x.gain,o.t,o.s];         // 3ª seguida no Ouro = +2
  o=mk(7,1,{sq:2});x=st(o,1);out.seqDiv=[x.gain];                  // Divino: sem extra
  o=mk(4,2,{pp:90});x=st(o,1);out.prot=[o.sh,o.pp,x.sh];           // vitória +15 → enche
  o=mk(4,2,{sh:1});x=st(o,0);out.usa=[o.s,o.sh,x.shUsed];          // proteção segura a estrela
  o=mk(4,2,{sh:2,pp:95});st(o,1);out.max=[o.sh,o.pp];              // no máx 2
  o=mk(1,0,{sq:9});const g0=+JSON.parse(localStorage.rk_gem||'0');x=st(o,1);const g1=+JSON.parse(localStorage.rk_gem||'0');o.sq=9;const x2=st(o,1);out.x10=[x.x10,g1-g0,x2.x10];
  o=mk(12,4);st(o,1);st(o,1);st(o,1);out.elite=[o.t,o.s];o=mk(12,0);st(o,0);out.caiGen=[o.t,o.s];
  out.rp=ev('rkG("rp",0)');return out});
console.log(JSON.stringify(r));
chk(r.reset&&r.n===13,'temporada nova: rank antigo zerado (Bronze 0) · 13 ranks');
chk(r.sobe+''==='1,0','5ª estrela: sobe para Prata');chk(r.bronze+''==='0,0','Bronze não cai');chk(r.cai+''==='2,4','0 ⭐ e perdeu: cai para o rank de baixo com 4 ⭐');
chk(r.seq[0]===2,'3 seguidas: +1 ⭐ extra');chk(r.seqDiv[0]===1,'Divino: sem estrela extra');chk(r.prot+''==='1,5,1','barra de proteção encheu: +1 🛡️');chk(r.usa+''==='2,0,1','🛡️ segurou a estrela na derrota');
chk(r.max[0]===2&&r.max[1]===100,'guarda no máximo 2 proteções');chk(r.x10[0]===1&&r.x10[1]>=5000&&!r.x10[2],'10 seguidas: prêmio 1 vez por temporada');chk(r.elite+''==='12,7','Deus Gênesis: depois de 5 ⭐ vira ELITE (pontos)');chk(r.caiGen+''==='11,4','Gênesis 0 ⭐ perdeu: Deus Absoluto 4 ⭐');
chk(r.rp===777,'PVP não mexe no rank do Boss');
await p.evaluate(()=>{__ev('rkS("pvp",Object.assign(pvG(),{t:9,s:3,pp:60,sh:1,sq:4,w:40,l:9}))')});
await p.click('#mRank');await p.waitForTimeout(2500);await p.getByText('BORA!').click({force:true}).catch(()=>0);
await p.evaluate(()=>{document.querySelectorAll('#adPass,#t1W').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__vw.rkView('pvp')});await p.waitForTimeout(1500);await p.screenshot({path:SH+'tela.png'});
const ui=await p.evaluate(()=>({on:document.querySelectorAll('.rk_pvp .pvS5.on').length,nome:(document.querySelector('.rk_pvp .pvMe b')||{}).textContent,prot:(document.querySelector('.rk_pvp .pvPr')||{}).textContent}));console.log(JSON.stringify(ui));
chk(ui.on===3&&ui.nome==='DEUS PRIMORDIAL'&&/60\/100/.test(ui.prot),'tela: Deus Primordial, 3 ⭐ acesas, proteção 60/100');
await p.evaluate(()=>__ev("rkAct('pvRules')"));await p.waitForTimeout(600);await p.screenshot({path:SH+'regras.png'});
console.log(E.length?'ERROS '+E.slice(0,4).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
