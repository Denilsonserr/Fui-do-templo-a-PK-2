// v660: PVP — temporada zerada; estrela custa pontos; topo exige 500+ vitórias mesmo perfeito; derrota tira 12; proteção; tela
const {chromium}=require('playwright');const SH=__dirname+'/shots/t660_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',ft_q:'1',rk_own:'["goku"]',rk_sel:'"goku"',tw_nome:'"Bia"',
  rk_pvp:JSON.stringify({t:12,d:0,s:7,w:20,l:0,sq:3,bt:12,rw:[1,2,3],h:[],rz:3,pp:50,sh:1})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const r=await p.evaluate(()=>{const ev=__ev,PVB=__vw.PVB,st=ev('pvStep'),mk=x=>Object.assign({t:0,d:0,s:0,p:0,w:0,l:0,sq:0,bt:0,rw:[],h:[],pp:0,sh:0},x||{});const out={};
  const o0=ev('pvG()');out.reset=o0.t===0&&o0.s===0&&o0.w===0;
  const run=(bonus,winrate)=>{const o=mk();let n=0,w=0;while(!(o.t>=12&&o.s>=5)&&n<20000){n++;const won=Math.random()<winrate;if(won){w++;PVB.on=1;PVB.v=bonus}else{PVB.on=0;o.sh=0}st(o,won)}return {partidas:n,vitorias:w}};
  out.perfeito=run(100,1);out.bom=run(50,.8);out.normal=run(30,.6);
  let o=mk({t:3,s:0,p:5});st(o,false);out.cai=[o.t,o.s,o.p];o=mk();st(o,false);out.bronze=[o.t,o.s,o.p];o=mk({t:2,s:2,p:20,sh:1});const x=st(o,false);out.prot=[o.s,o.p,x.shUsed];
  return out});
console.log(JSON.stringify(r));
chk(r.reset,'temporada nova: todo mundo zerado (quem estava no Deus Gênesis volta pro Bronze)');
chk(r.perfeito.vitorias>=500,'perfeito (100% vitórias, bônus cheio sempre): '+r.perfeito.vitorias+' vitórias pro topo (mín. 500)');
chk(r.bom.partidas>=600,'jogador bom (80% vitória): '+r.bom.partidas+' partidas');console.log('    jogador normal (60% vitória):',r.normal.partidas,'partidas');
chk(r.cai+''==='2,4,77','0 ⭐ com 5 pontos e perdeu (-8): cai pro rank de baixo com 4 ⭐ e 77/80 pontos');chk(r.bronze+''==='0,0,0','Bronze 0: não perde');chk(r.prot+''==='2,20,1','proteção segura os pontos');
await p.evaluate(()=>{__ev('rkS("pvp",Object.assign(pvG(),{t:4,s:2,p:63,pp:60,sh:1}))')});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#adPass,#t1W').forEach(x=>x.remove());const m=document.getElementById('rkModal');if(m){m.innerHTML='';m.hidden=true}__vw.rkView('pvp')});await p.waitForTimeout(1200);await p.screenshot({path:SH+'tela.png'});
const ui=await p.evaluate(()=>[...document.querySelectorAll('.rk_pvp .pvPr')].map(x=>x.textContent));console.log(JSON.stringify(ui));chk(/63\/110/.test(ui[0])&&/60\/100/.test(ui[1]),'tela: barra de pontos da estrela (63/110) e proteção');
console.log(E.length?'ERROS '+E.slice(0,3).join('|'):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
