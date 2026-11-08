
/* ================= v213: MODO RANQUEADO (menu, Modo Boss Broly, Invocação/gacha, Loja de geminhas, Biblioteca, ranks) =================
   Personagens: no ranqueado só os que você ganhou no gacha (começa com Goku). Resto do jogo continua com todos liberados.
   Moedas do ranqueado (separadas da torre): 💎 geminhas (giros), 🎟️ tickets (1 giro), 🔴 moeda vermelha (compra geminhas).  */
const RQA=__RKA__;const RKW=1847,RKH=851;
const rkB=(x0,y0,x1,y1)=>`left:${x0/RKW*100}%;top:${y0/RKH*100}%;width:${(x1-x0)/RKW*100}%;height:${(y1-y0)/RKH*100}%`;
/* REGRAS DA RANQUEADA (do dono): XP ranqueado acumulado; vitória/derrota por rank; nível do Boss = rank (1..8) */
const RKXP=[0,1000,2500,5000,9000,15000,23000,35000],RKXW=[100,120,140,160,180,200,230,260],RKXL=[30,45,60,80,100,125,150,180];
const RKR=[{n:'MADEIRA',c:'#d29a5a',min:0,rw:0},{n:'BRONZE',c:'#ef9a5a',min:1000,rw:50},{n:'PRATA',c:'#dfe8ff',min:2500,rw:100},{n:'OURO',c:'#ffd23a',min:5000,rw:150},
  {n:'DIAMANTE',c:'#5ab8ff',min:9000,rw:250},{n:'LENDÁRIO',c:'#c46aff',min:15000,rw:400},{n:'DRAGÃO LENDÁRIO',c:'#ff4a2a',min:23000,rw:600},{n:'DIVINDADE',c:'#fff4c0',min:35000,rw:1000}];
/* escala do Boss por nível (100% = atributos originais) */
const RKLVS=[{v:100,d:100,s:100},{v:115,d:110,s:105},{v:135,d:120,s:110},{v:160,d:135,s:115},{v:190,d:150,s:120},{v:225,d:165,s:125},{v:265,d:180,s:130},{v:320,d:200,s:135}];
const RKPAS=[['Boss normal, sem passivas especiais','IA básica: ataques e bloqueios simples'],['10% de chance de bloquear um ataque','IA usa combos básicos'],['15% de chance de esquivar de um ataque','Contra-ataques simples'],
  ['Regenera 3% da vida máxima uma vez ao chegar a 40%','Combos mais longos'],['Ao chegar a 50% da vida: +15% de dano por 8 s','IA mais agressiva'],['Barreira que absorve 10% da vida máxima (1 vez por luta)','Ataques especiais com mais frequência'],
  ['Ao chegar a 30%: MODO FURIOSO, +15% de velocidade por 10 s','Esquivas e contra-ataques avançados'],['Ao chegar a 25%: FASE SUPREMA — barreira de 15% e +20% de dano por 12 s','Usa os melhores combos e especiais']];
/* configuração reutilizável de bosses (para adicionar outros no futuro) */
const RKBOSS=[{id:'broly',n:'BROLY',sub:'O Super Saiyajin Lendário',ph:[7,14],b1:{dm:1.6,df:.8,sp:1.1},b2:{dm:2.2,df:.65,sp:1.25}}];
/* IA por nível (react = tempo de reação, agg = agressividade, blk = defesa, combo = continuar combos) */
const RKAI=[{react:16,agg:.55,blk:.35,combo:.55,idle:16},{react:13,agg:.62,blk:.45,combo:.68,idle:12},{react:10,agg:.7,blk:.55,combo:.76,idle:9},{react:8,agg:.77,blk:.62,combo:.86,idle:6},
  {react:6,agg:.86,blk:.68,combo:.9,idle:4},{react:5,agg:.9,blk:.74,combo:.94,idle:3},{react:4,agg:.94,blk:.82,combo:.97,idle:2},{react:3,agg:.97,blk:.86,combo:1,idle:1}];
RKR.forEach((R,i)=>{TWTIT['rk'+i]={n:R.n,i:'',c:R.c,d:'Chegar ao rank '+R.n+' no Modo Ranqueado',rk:i}});
const rkG=(k,d)=>twLS.g('rk_'+k,d),rkS=(k,v)=>twLS.s('rk_'+k,v);
const RK_LEG=['goku','aokiji','zoro','broly','vegeta','gogeta','madara','gojo','luffy','rengoku','naruto','garou'],RK_EPI=['aylla','zedry','zaykon','qingqing'];
const rkRar=id=>RK_LEG.includes(id)?'lend':'epica';
function rkInit(){if(!rkG('ini',0)){rkS('ini',1);rkS('gem',100);rkS('tic',1);rkS('red',0);rkS('own',['goku']);rkS('sel','goku');rkS('rp',0);rkS('st',{})}
  if(!rkG('xpv2',0)){const old=rkG('rp',0),oi=[0,100,250,450,700,1000,1400,1900].reduce((a,m,i)=>old>=m?i:a,0);rkS('rp',RKXP[oi]);rkS('xpv2',1)}
  const own=rkG('own',['goku']);if(!own.includes('goku')){own.push('goku');rkS('own',own)}if(!own.includes(rkG('sel','goku')))rkS('sel','goku')}
const rkRank=rp=>{let i=0;for(let k=0;k<RKR.length;k++)if(rp>=RKR[k].min)i=k;return i};
const rkLvl=()=>rkRank(rkG('rp',0));
const rkAdd=(k,n)=>{rkS(k,Math.max(0,(rkG(k,0)|0)+n))};
const rkSt=()=>rkG('st',{}),rkStAdd=(k,n,mx)=>{const S=rkSt();S[k]=mx?Math.max(S[k]||0,n):(S[k]||0)+n;rkS('st',S)};
const rkFmtN=n=>String(n|0).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
function rkToast(t,c){const T=$('rkToast');if(!T)return;T.textContent=t;T.style.color=c||'#ffd84a';T.classList.remove('on');void T.offsetWidth;T.classList.add('on')}
function rkFit(){const el=document.querySelector('#rkWrap .rkA');if(!el)return;const aw=+el.dataset.w||RKW,ah=+el.dataset.h||RKH,q=(innerWidth/innerHeight)/(aw/ah),W=q>.9&&q<1.12?Math.max(innerWidth,innerHeight*aw/ah):Math.min(innerWidth,innerHeight*aw/ah);el.style.width=W+'px';el.style.height=(W*ah/aw)+'px';el.style.fontSize=(W/100)+'px';
  const M=$('rkModal');if(M)M.style.fontSize=Math.min(innerWidth/100,innerHeight*1.7757/100)+'px'}
addEventListener('resize',rkFit);
function rkModal(h){const M=$('rkModal');if(!M)return;if(h==null){M.hidden=true;M.innerHTML='';return}M.innerHTML=h;M.hidden=false;rkFit()}
/* emblema do rank com brilho animado */
function rkEmb(i,cls){const R=RKR[i];return `<div class="rkEmb ${cls||''}" style="--c:${R.c}"><i class="ry"></i><i class="gl"></i><img src="${RQA.rank[i]}" alt=""><i class="sh"></i></div>`}
function rkCurHTML(){return `<div class="rkCur"><span><img src="${RQA.coin[0]}" alt="">${rkFmtN(rkG('gem',0))}</span><span><img src="${RQA.coin[2]}" alt="">${rkFmtN(rkG('tic',0))}</span><span><img src="${RQA.coin[1]}" alt="">${rkFmtN(rkG('red',0))}</span></div>`}
const RKLOCK='<span class="rkLk"><svg viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="4.5" y="10" width="15" height="11" rx="2" fill="currentColor"/></svg>EM BREVE</span>';
function rkSfx(k){try{SFX[k]&&SFX[k]()}catch(e){}}
function rkOpen(v){RKSEL=null;rkInit();audioInit();try{fsTry()}catch(e){}showScreen('ranked');rkView(v||'menu')}
let RKV='menu';
const RKD={rb:[1672,941]};const rkB2=(x0,y0,x1,y1)=>`left:${x0/16.72}%;top:${y0/9.41}%;width:${(x1-x0)/16.72}%;height:${(y1-y0)/9.41}%`;
function rkView(v){RKV=v;const W=$('rkWrap');if(!W)return;clearInterval(rkView.iv);rkModal(null);
  const H={menu:rkMenuH,boss:rkBossH,gacha:rkGachaH,shop:rkShopH,lib:rkLibH,rb:rkRbH}[v]();const dm=RKD[v]||[RKW,RKH];W.innerHTML=`<div class="rkA rk_${v}" data-w="${dm[0]}" data-h="${dm[1]}" style="background-image:url(${RQA[{menu:'menu_ranqueado',boss:'modo_boss',gacha:'gacha',shop:'loja_gemas',lib:'biblioteca',rb:'ranqueada_boss'}[v]]})">${H}<div id="rkToast"></div></div>`;
  rkFit();W.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)});({boss:rkBossOn,gacha:rkGachaOn,lib:rkLibOn}[v]||(()=>{}))()}
function rkLocked(){rkSfx('clang');rkToast('🔒 Em breve!','#cfd6ea')}
function rkAct(a,b){rkSfx('whoosh');
  switch(a){case 'back':return rkView(RKV==='shop'?'gacha':RKV==='rb'?'boss':'menu');case 'home':return showScreen('title');case 'menuBack':return showScreen('title');
    case 'boss':return rkView('boss');case 'gacha':return rkView('gacha');case 'shop':return rkView('shop');case 'lib':return rkView('lib');case 'lock':return rkLocked();
    case 'ranking':return rkRanking();case 'rewards':return rkRewards();case 'ach':return rkAch();case 'pos':return rkPos();
    case 'start':return rkView('rb');case 'fight':return rkBossStart();case 'lvp':return rkRbSel(-1);case 'lvn':return rkRbSel(1);case 'lvc':return rkRbSel(0,+b.dataset.i);case 'sel':return rkView('lib');case 'hist':return rkHist();case 'taxas':return rkTaxas();case 'pool':return rkTaxas();
    case 'sum1':return rkSummon(1);case 'sum10':return rkSummon(10);case 'chat':return rkChatSend();
    case 'buy':return rkBuy(+b.dataset.i);case 'tab':return rkLibTab(b.dataset.t);case 'up':return rkLibPage(-1);case 'down':return rkLibPage(1);case 'filt':return rkLibFilt();case 'libUse':return rkLibUse();
    case 'boxinfo':return rkToast(b.dataset.t,'#bfe8ff')}}
/* ---------------- MENU DO RANQUEADO ---------------- */
function rkMenuH(){const rp=rkG('rp',0),ri=rkRank(rp);
  return `<button class="hs" data-a="menuBack" style="${rkB(5,15,110,95)}"></button>
  <button class="hs" data-a="boss" style="${rkB(15,130,640,250)}"><span class="shine"></span></button>
  <button class="hs lk" data-a="lock" style="${rkB(15,270,610,380)}">${RKLOCK}</button>
  <button class="hs lk" data-a="lock" style="${rkB(15,405,610,505)}">${RKLOCK}</button>
  <button class="hs" data-a="gacha" style="${rkB(15,530,610,635)}"><span class="shine"></span></button>
  <button class="hs" data-a="ranking" style="${rkB(185,690,470,800)}"></button><button class="hs" data-a="rewards" style="${rkB(480,690,760,800)}">${rkRwPend()?'<i class="dot"></i>':''}</button>
  <button class="hs" data-a="ach" style="${rkB(770,690,1040,800)}">${rkAchPend()?'<i class="dot"></i>':''}</button><button class="hs" data-a="lib" style="${rkB(1050,690,1335,800)}"></button><button class="hs" data-a="pos" style="${rkB(1345,690,1645,800)}"></button>
  <div class="rkTop">${rkEmb(ri,'sm')}<div><b style="color:${RKR[ri].c}">${RKR[ri].n}</b><small>${rkFmtN(rp)} XP · Boss Nv.${ri+1}</small></div>${rkCurHTML()}</div>`}
/* ---------------- MODO BOSS ---------------- */
function rkBossH(){const rp=rkG('rp',0),ri=rkRank(rp),sel=rkG('sel','goku'),eqI=TWIMG.esp[3];
  return `<button class="hs" data-a="back" style="${rkB(25,25,135,100)}"></button>
  <button class="hs on" data-a="boxinfo" data-t="Broly: 7 barras · depois se transforma com 14 barras!" style="${rkB(10,200,445,300)}"></button>
  ${[[325,415],[440,530],[555,650]].map(([a,b])=>`<button class="hs" data-a="lock" style="${rkB(10,a,415,b)}"></button>`).join('')}
  <div class="rkBox" style="${rkB(478,678,588,785)}" data-a="boxinfo" data-t="💎 Geminhas: às vezes 1 a 2 por vitória"><img src="${RQA.coin[0]}" alt=""><b>1-2</b></div>
  <div class="rkBox" style="${rkB(603,678,713,785)}" data-a="boxinfo" data-t="🔴 Moeda Vermelha: 5 a 10 por vitória (mais jogando bem) · derrota: até 2"><img src="${RQA.coin[1]}" alt=""><b>5-10</b></div>
  <div class="rkBox" style="${rkB(730,678,840,785)}" data-a="boxinfo" data-t="🎟️ Ticket de giro: difícil (melhor no baú lendário)"><img src="${RQA.coin[2]}" alt=""><b>RARO</b></div>
  <div class="rkBox" style="${rkB(858,678,968,785)}" data-a="boxinfo" data-t="✦ Drops raros: Bandana, Botas Saiyajin, Semente dos Deuses (lendários), Adaga Kamish e Gunbai do Madara (míticos) · garantido em ${25-rkG('bpity',0)} vitórias"><img class="cyc" src="${RQA.sp.kamish}" alt=""><b>✦ ${25-rkG('bpity',0)}</b></div>
  <div class="rkBan" style="${rkB(1612,52,1782,222)}">${rkEmb(ri,'ban')}</div><div class="rkBanN" style="${rkB(1590,225,1805,262)};color:${RKR[ri].c}">${RKR[ri].n}</div>
  <div class="rkOn" style="${rkB(1520,540,1728,572)}"><i></i><span id="rkOnN">...</span> Online</div>
  <div class="rkChL" id="rkChL" style="${rkB(1112,578,1728,654)}"><p class="twH">Carregando...</p></div>
  <input class="rkChI" id="rkChI" maxlength="140" placeholder="Digite uma mensagem..." autocomplete="off" style="${rkB(1182,661,1660,700)}">
  <button class="hs" data-a="chat" style="${rkB(1672,660,1722,702)}"></button>
  <button class="rkSel" data-a="sel" style="${rkB(985,722,1175,830)}"><img src="${IMG[sel]?IMG[sel].src:''}" alt=""><span><small>LUTAR COM</small><b>${CH[sel]?CH[sel].name:''}</b><em>trocar ›</em></span></button>
  <button class="hs" data-a="start" style="${rkB(1185,735,1635,825)}"><span class="shine"></span></button>
  ${rkCurHTML().replace('rkCur','rkCur bt')}`}
function rkBossOn(){const I=$('rkChI');if(I)I.onkeydown=e=>{if(e.key==='Enter')rkChatSend()};rkChatLoad();rkOnline();let n=0;rkView.iv=setInterval(()=>{if(RKV!=='boss'||showScreen.cur!=='ranked'){clearInterval(rkView.iv);return}n++;rkChatLoad();if(n%3===0)rkOnline()},10000)}
let RKSEL=null;
function rkRbH(){const xp=rkG('rp',0),ri=rkRank(xp),lv=RKSEL==null?ri:RKSEL,B=RKBOSS[0],L=RKLVS[lv],nx=Math.min(7,ri+1),prog=ri>=7?100:Math.round(100*(xp-RKXP[ri])/(RKXP[ri+1]-RKXP[ri]));
  const cells=[[100,500,270,685],[300,505,453,685],[490,505,642,685],[682,505,835,685],[872,505,1025,685],[1065,505,1218,685],[1256,505,1408,685],[1447,505,1600,685]];
  const pas=[];for(let i=1;i<=lv;i++)pas.push(RKPAS[i][0]);
  return `<button class="hs" data-a="back" style="${rkB2(0,0,135,100)}"></button>
  <div class="rbCov" style="${rkB2(150,340,330,420)}"><b>${lv+1}<small>/8</small></b></div>
  <button class="hs" data-a="lvp" style="${rkB2(65,340,120,415)}"></button><button class="hs" data-a="lvn" style="${rkB2(335,340,392,415)}"></button>
  <div class="rbBoss" style="${rkB2(500,60,1020,470)}"><img src="${fullSrc(B.id)}" alt=""><b>${B.n}</b></div>
  <div class="rbEmb" style="${rkB2(1103,92,1212,202)}">${rkEmb(ri,'ban')}</div>
  <div class="rbCov rbRk" style="${rkB2(1225,118,1462,180)};color:${RKR[ri].c}">${RKR[ri].n}</div>
  <div class="rbCov rbXp" style="${rkB2(1190,215,1395,248)}">${rkFmtN(xp)} / ${ri>=7?'∞':rkFmtN(RKXP[ri+1])} XP</div>
  <div class="rbBar" style="${rkB2(1114,252,1455,267)}"><s style="width:${prog}%;background:${RKR[ri].c}"></s></div>
  <div class="rbCov rbW" style="${rkB2(1528,140,1632,178)}">+${RKXW[ri]}</div><div class="rbCov rbL" style="${rkB2(1540,226,1632,264)}">-${RKXL[ri]}</div>
  <div class="rbPas" style="${rkB2(1122,330,1645,452)}"><h5>PASSIVAS DO BOSS · NÍVEL ${lv+1}</h5>${pas.length?pas.map(p=>`<span>✦ ${p}</span>`).join(''):'<span>Nenhuma passiva especial</span>'}</div>
  ${cells.map((c,i)=>`<button class="rbCell ${i===lv?'sel':''} ${i===ri?'cur':''} ${i>ri?'lock':''}" data-a="lvc" data-i="${i}" style="${rkB2(...c)}">${i>ri?'<i>🔒</i>':i<ri?'<i class="ok">✔</i>':'<i class="now">ATUAL</i>'}</button>`).join('')}
  <div class="rbCov rbLvT" style="${rkB2(62,727,232,762)}">Nível ${lv+1}</div>
  <div class="rbDesc" style="${rkB2(62,768,550,895)}"><span>❤️ Vida ${L.v}% · ⚔️ Dano ${L.d}% · 💨 Velocidade ${L.s}%</span><span>🧠 ${RKPAS[lv][1]}</span><span>⭐ Rank ${RKR[lv].n} · vitória +${RKXW[lv]} XP · derrota −${RKXL[lv]} XP</span>${lv!==ri?`<em>${lv>ri?'🔒 Suba de rank para chegar neste nível':'Você já passou deste nível'} — você sempre luta no nível do seu rank (${ri+1})</em>`:''}</div>
  <div class="rbNx" style="${rkB2(632,785,716,868)}">${ri<7?rkEmb(nx,'ban'):''}</div><div class="rbCov rbNxT" style="${rkB2(728,790,880,860)}">${ri<7?`<b style="color:${RKR[nx].c}">${RKR[nx].n}</b><small>(Nível ${nx+1} · ${rkFmtN(RKXP[nx])} XP)</small>`:'<b style="color:#fff4c0">RANK MÁXIMO</b>'}</div>
  <button class="hs" data-a="fight" style="${rkB2(1185,758,1645,872)}"><span class="shine"></span></button>`}
function rkRbSel(d,i){const ri=rkLvl();let v=RKSEL==null?ri:RKSEL;v=i!=null?i:Math.max(0,Math.min(7,v+d));RKSEL=v;rkView('rb')}
/* ---------- online: cada jogo aberto avisa o servidor a cada 2 min ---------- */
const rkBk=t=>'o'+Math.floor(t/120000);
function rkPing(){if(document.visibilityState&&document.visibilityState!=='visible')return;const IV=v=>({integerValue:String(v)});
  const f={nome:{stringValue:String(twLS.g('tw_nome','')||'?').slice(0,16)},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},on:{stringValue:rkBk(Date.now())}};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(()=>{})}
setTimeout(rkPing,6000);setInterval(rkPing,120000);
async function rkQ(field,val,lim){const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:field},op:'EQUAL',value:{stringValue:val}}},limit:lim||1000}};
  const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);const j=await r.json(),o=[];
  for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F)continue;const e={_ct:Date.parse(x.document.createTime||'')||0};for(const k in F){const v=F[k];e[k]=v.stringValue!=null?v.stringValue:v.integerValue!=null?+v.integerValue:v.doubleValue}o.push(e)}return o}
async function rkOnline(){try{const t=Date.now(),A=(await rkQ('on',rkBk(t),500)).concat(await rkQ('on',rkBk(t-120000),500));const n=new Set(A.map(e=>e.uid)).size||1;const E=$('rkOnN');if(E)E.textContent=rkFmtN(n)}catch(e){const E=$('rkOnN');if(E)E.textContent='?'}}
/* ---------- chat global ---------- */
async function rkChatLoad(){try{const days=[0,1].map(i=>twDay(Date.now()-i*864e5));let L=[];for(const d of days)L=L.concat(await rkQ('gchat',d,400));
    L=L.filter(m=>m.msg).map(m=>({nome:String(m.nome||'?').slice(0,16),tit:m.tit||'',uid:m.uid||'',msg:String(m.msg).slice(0,140),ct:m._ct})).sort((a,b)=>a.ct-b.ct).slice(-60);
    const pend=(rkChatLoad.p||[]).filter(m=>!L.some(y=>y.uid===m.uid&&y.msg===m.msg));L=L.concat(pend);rkChatLoad.L=L;const E=$('rkChL');if(E){const st=E.scrollTop+E.clientHeight>=E.scrollHeight-20;E.innerHTML=twChatHTML(L);if(st||!rkChatLoad.d){E.scrollTop=E.scrollHeight;rkChatLoad.d=1}}}
  catch(e){const E=$('rkChL');if(E&&!(rkChatLoad.L||[]).length)E.innerHTML='<p class="twH err">Sem internet agora.</p>'}}
function rkChatSend(){const I=$('rkChI');if(!I)return;const t=I.value.replace(/[<>]/g,'').trim().slice(0,140);if(!t)return;const nome=twLS.g('tw_nome','');
  if(!nome){rkToast('Escolha seu nome no Modo Torre (✏️ NOME) para usar o chat','#ff8080');return}
  if(Date.now()-(rkChatSend.l||0)<4000){rkToast('Calma! Espere uns segundos','#ff8080');return}rkChatSend.l=Date.now();I.value='';
  const m={nome,tit:twTitOn(),uid:twUid(),msg:t,ct:Date.now(),pend:1};(rkChatLoad.p=rkChatLoad.p||[]).push(m);rkChatLoad.L=(rkChatLoad.L||[]).concat(m);const E=$('rkChL');if(E){E.innerHTML=twChatHTML(rkChatLoad.L);E.scrollTop=E.scrollHeight}
  const IV=v=>({integerValue:String(v)});const f={nome:{stringValue:nome},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},tit:{stringValue:twTitOn()},gchat:{stringValue:twDay(Date.now())},msg:{stringValue:t},v:IV(213)};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(()=>rkToast('Mensagem não enviada (sem internet?)','#ff8080'))}
/* ---------------- LUTA CONTRA O BROLY (7 barras -> transformado 14 barras) ---------------- */
const RKB={fs:null,diff0:1};
function rkBossStart(){rkInit();const sel=rkG('sel','goku');if(!SPR_OK)return;fsTry();G.pick=sel;G.opp='broly';G.gmode='boss';RKB.diff0=G.diff;{const lv=rkLvl();G.diff=lv<2?1:lv<4?2:3}
  const sk=Object.keys(STG).filter(k=>!STG[k].hid);G.nextStg=sk[(Math.random()*sk.length)|0];try{nv('vMChallenge',.05,1)}catch(e){}
  const PM=prepMatch([G.pick,G.opp],G.nextStg);showVS(()=>PM.then(()=>{vsLoadEnd();startMatch()}),PM)}
function rkApply(){if(G.gmode!=='boss'||!G.p)return;const [p,o]=G.p;p.tdm=(p.tdm||1)*(1+twEqB('dano')/100);p.tsp=(p.tsp||1)*(1+twEqB('vel')/100);p.tdf=(p.tdf||1)/(1+twEqB('vida')/100);{const q=twEqOn();p.tcr=0;for(const k in q)p.tcr+=q[k].crit||0}{const t=twEqB('trf');if(t)p.tsb=1+t/100}const lv=rkLvl(),L=RKLVS[lv],B=RKBOSS[0];o.rkL=lv;o.rkB={dm:B.b1.dm*L.d/100,df:B.b1.df*100/L.v,sp:B.b1.sp*L.s/100};o.mhp=B.ph[0]*LAYER;o.hp=o.hpLag=o.mhp;o.tdm=o.rkB.dm;o.tdf=o.rkB.df;o.tsp=o.rkB.sp;o.sb=0;o.rkPh=1;o.rkP={};o.rkSh=0;o.rkHp=o.hp;
  RKB.fs={t:0,t1:0,cmb:0,hp0:p.hp/(p.mhp||MAXHP)}}
function rkBossGo(){if(G.gmode!=='boss'||!G.p)return;if(G.tlim!==0)G.timer=300;banner('MODO BOSS','#ff3030',100,'BROLY · 7 BARRAS')}
function rkTick(){const F=RKB.fs;if(!F||!G.p)return;const o=G.p[1];if(!(G.paused||G.trans||G.ws||G.cine||G.comic))F.t++;const c=G.p[0].combo||0;if(c>F.cmb)F.cmb=c;
  if(o.rkPh===1)o.sb=0;else if(o.rkPh===2&&o.form)o.formT=FORM_T;rkPassTick(o)}
/* passivas do Boss por nível (acumulativas, cada uma 1 vez por luta) */
function rkTot(o){const m1=RKBOSS[0].ph[0]*LAYER,m2=RKBOSS[0].ph[1]*LAYER;return o.rkPh===1?(Math.max(0,o.hp)+m2)/(m1+m2):Math.max(0,o.hp)/(m1+m2)}
function rkPassTick(o){if(!o.rkB||o.ko)return;const lv=o.rkL||0,P=o.rkP,t=rkTot(o),fr=G.frame;
  /* barreira: devolve a vida do dano que ela absorveu */
  if(o.rkSh>0&&o.hp<o.rkHp&&o.rkPh===(o.rkShPh||o.rkPh)){const lost=o.rkHp-o.hp,ab=Math.min(lost,o.rkSh);o.hp+=ab;o.hpLag=Math.max(o.hpLag,o.hp);o.rkSh-=ab;if(G.frame%6===0)ring(o.x,o.y-150,'#7fd8ff',150,10,3);if(o.rkSh<=0){txt(o.x,o.y-300,'BARREIRA QUEBRADA!','#9fe0ff');ring(o.x,o.y-150,'#ffffff',220,18,6)}}
  if(o.rkSh>0&&fr%8===0)ring(o.x,o.y-150,'#7fd8ff',170,16,3);
  if(lv>=3&&!P.reg&&t<=.4){P.reg=1;const add=.03*o.mhp;o.hp=Math.min(o.mhp,o.hp+add);o.hpLag=Math.max(o.hpLag,o.hp);txt(o.x,o.y-300,'REGENEROU!','#7dff9a');ring(o.x,o.y-150,'#7dff9a',200,20,6)}
  if(lv>=4&&!P.rage&&t<=.5){P.rage=1;P.dmgU=fr+8*60;P.dmgK=.15;txt(o.x,o.y-300,'+15% DANO!','#ff8a3a');banner('BROLY ENFURECEU','#ff5a2a',70,'+15% DE DANO POR 8 s')}
  if(lv>=5&&!P.bar&&t<=.7){P.bar=1;o.rkSh=.1*o.mhp;o.rkShPh=o.rkPh;txt(o.x,o.y-300,'BARREIRA!','#7fd8ff');ring(o.x,o.y-150,'#7fd8ff',240,24,7)}
  if(lv>=6&&!P.fury&&t<=.3){P.fury=1;P.spU=fr+10*60;P.spK=.15;banner('MODO FURIOSO','#ff2a2a',80,'+15% DE VELOCIDADE POR 10 s')}
  if(lv>=7&&!P.sup&&t<=.25){P.sup=1;o.rkSh=.15*o.mhp;o.rkShPh=o.rkPh;P.dmgU=fr+12*60;P.dmgK=.2;G.flash=10;G.flashCol='#fff2c0';banner('FASE SUPREMA','#ffd84a',110,'BARREIRA 15% · +20% DE DANO POR 12 s');for(const r of [320,200])ring(o.x,o.y-150,'#ffd84a',r,26,8)}
  const dk=P.dmgU>fr?P.dmgK:0,sk=P.spU>fr?P.spK:0;o.tdm=o.rkB.dm*(1+dk);o.tsp=o.rkB.sp*(1+sk);if((dk||sk)&&fr%5===0)addP({x:o.x+rand(-60,60),y:o.y-rand(30,260),vx:0,vy:-rand(1,3),life:20,max:20,c:dk?'#ff4a2a':'#ffd84a',type:'glow',sz:rand(3,6),g:0});o.rkHp=o.hp}
/* bloqueio (nível 2+) e esquiva (nível 3+) com tempo de recarga */
function rkPassHit(a,d,h){if(!d.rkB||d.ko||!d.grounded||G.trans||h.kind==='beam')return;const lv=d.rkL||0,fr=G.frame,P=d.rkP;if(d.state==='attack'||d.state==='hit'||d.state==='airhit')return;
  if(lv>=2&&fr>(P.dgCd||0)&&Math.random()<.15){P.dgCd=fr+90;d.inv=14;d.x=clamp(d.x-d.facing*90,40,WW-40);txt(d.x,d.y-280,'ESQUIVOU!','#bfe8ff');for(let i=0;i<10;i++)addP({x:d.x+rand(-40,40),y:d.y-rand(20,240),vx:-d.facing*rand(1,4),vy:0,life:14,max:14,c:'#bfe8ff',type:'glow',sz:rand(3,6),g:0});return false}
  if(lv>=1&&fr>(P.blCd||0)&&Math.random()<.1){P.blCd=fr+60;d.state='blockstun';d.st=0;d.hitstun=8;d.vx=a.facing*2;txt(d.x,d.y-280,'BLOQUEOU!','#9fd8ff');ring(h.px||d.x,h.py||d.y-150,'#9fd8ff',110,12,4);try{SFX.block()}catch(e){}return true}}
/* desistir durante o combate conta como derrota */
function rkQuit(){if(G.gmode!=='boss'||!G.p)return;G.diff=RKB.diff0;const ri=rkLvl(),rp0=rkG('rp',0),rp1=Math.max(0,rp0-RKXL[ri]);rkS('rp',rp1);rkStAdd('loss',1);rkSend({rp:rp1,dmg:0,t1:0,tt:0,won:0});G.gmode='pve'}
function rkPhase2(a,d){d.rkPh=2;if(RKB.fs)RKB.fs.t1=RKB.fs.t;d.ko=false;{const L=RKLVS[d.rkL||0],B=RKBOSS[0];d.rkB={dm:B.b2.dm*L.d/100,df:B.b2.df*100/L.v,sp:B.b2.sp*L.s/100};d.mhp=B.ph[1]*LAYER;d.hp=d.hpLag=d.mhp;d.rkHp=d.hp;d.tdm=d.rkB.dm;d.tdf=d.rkB.df;d.tsp=d.rkB.sp}d.state='idle';d.st=0;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;d.move=null;d.hitstun=0;d.inv=60;
  a.vx=-a.facing*10;G.hitstop=Math.max(G.hitstop,20);G.shake=30;G.flash=12;G.flashCol='#d8ffc8';for(const r of [380,250,130])ring(d.x,d.y-150,r===130?'#ffffff':'#5cff4a',r,28,8);
  banner('O BROLY DESPERTOU!','#5cff4a',120,'2ª FASE · 14 BARRAS');d.sb=SB_COST;try{startTransform(d)}catch(e){d.form=1;d.formT=FORM_T}buzz(200)}
function rkAfter(w){G.mode='ranked';$('controls').hidden=true;$('pauseBtn').hidden=true;rainSound(0);G.paused=false;G.diff=RKB.diff0;
  const F=RKB.fs||{t:0,t1:0,cmb:0,hp0:1},o=G.p[1],p=G.p[0],won=w===0,secs=Math.round(F.t/60);
  const dmg=Math.round(o.rkPh===2?7*LAYER+(14*LAYER-Math.max(0,o.hp)):(7*LAYER-Math.max(0,o.hp))),frac=Math.min(1,dmg/(21*LAYER)),lost=Math.max(0,1-Math.max(0,p.hp)/(p.mhp||MAXHP));
  let red,gem=0,tic=0,eq=null,chest=null,drp,poc=null,sp=null;
  if(won){const q=Math.min(1,Math.max(0,(300-secs)/220))*.6+(1-lost)*.4;red=Math.round(5+5*q);gem=Math.random()<.5?1+((Math.random()*2)|0):0;chest=secs<150&&lost<.4?'lend':secs<220?'epica':'rara';
    if(Math.random()<(chest==='lend'?.4:chest==='epica'?.2:.12))tic=1;if(Math.random()<(chest==='lend'?.2:.08)){const E=TWEQ[(Math.random()*TWEQ.length)|0];eq={E,R:twEqRoll()}}drp=RKXW[rkLvl()];
    if(Math.random()<.3)poc=twPoRoll();
    /* drops especiais do boss (bem difíceis) + piedade: garantido em 25 vitórias sem drop especial */
    const bp=rkG('bpity',0)+1,rr=Math.random()*100;let sk=null;if(rr<1.5)sk=['kam','gun'][(Math.random()*2)|0];else if(rr<5.5)sk=['band','bots','senzu'][(Math.random()*3)|0];else if(bp>=25)sk=['band','bots','senzu','band','bots','senzu','kam','gun'][(Math.random()*8)|0];
    if(sk){rkS('bpity',0);sp=sk}else rkS('bpity',bp)}
  else{red=frac>.5?2:frac>.2?1:0;gem=0;drp=-RKXL[rkLvl()]}
  rkAdd('red',red);rkAdd('gem',gem);rkAdd('tic',tic);if(eq)twAddItem(eq.E,eq.R);if(poc)twAddPoc(poc);if(sp){if(sp==='senzu')rkAddSenzu(1);else rkGiveSp(sp)}
  const rp0=rkG('rp',0),r0=rkRank(rp0);let rp1=Math.max(0,rp0+drp);rkS('rp',rp1);const r1=rkRank(rp1);for(let i=0;i<=r1;i++)twGiveTit('rk'+i);
  rkStAdd(won?'wins':'loss',1);rkStAdd('dmgTot',dmg);rkStAdd('dmgMax',dmg,1);if(F.t1){const S=rkSt();if(!S.t1||F.t1/60<S.t1){S.t1=Math.round(F.t1/60);rkS('st',S)}}if(won){const S=rkSt();if(!S.tt||secs<S.tt){S.tt=secs;rkS('st',S)}if(lost<.25)rkStAdd('clean',1)}
  rkSend({rp:rp1,dmg,t1:F.t1?Math.round(F.t1/60):0,tt:won?secs:0,won:won?1:0});
  const R={won,secs,dmg,frac,red,gem,tic,eq,chest,poc,sp,drp,rp0,rp1,r0,r1,t1:F.t1?Math.round(F.t1/60):0,lost,cmb:F.cmb};
  rkOpen('boss');setTimeout(()=>rkResult(R),200)}
function rkSend(x){const n=twLS.g('tw_nome','');if(!n)return;const IV=v=>({integerValue:String(Math.max(0,Math.round(v)))});
  const f={nome:{stringValue:n},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},tit:{stringValue:twTitOn()},rk:{stringValue:'1'},rp:IV(x.rp),dmg:IV(x.dmg),t1:IV(x.t1),tt:IV(x.tt),won:IV(x.won),char:{stringValue:G.pick||''},v:IV(213)};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(()=>{})}
function rkResult(R){const it=[];it.push(`<span><img src="${RQA.coin[1]}" alt="">+${R.red}</span>`);if(R.gem)it.push(`<span><img src="${RQA.coin[0]}" alt="">+${R.gem}</span>`);if(R.tic)it.push(`<span><img src="${RQA.coin[2]}" alt="">+1 TICKET</span>`);
  if(R.poc)it.push(`<span style="--c:${R.poc.c}"><img src="${TWIMG.poc[TWRK.indexOf(R.poc.k)]}" alt="">POÇÃO ${R.poc.n}</span>`);
  if(R.sp){const S=R.sp==='senzu'?{nm:'SEMENTE DOS DEUSES',img:RQA.sp.senzu,r:'lend'}:RKSP[R.sp];it.push(`<span class="spd" style="--c:${TWEQR.find(q=>q.k===S.r).c}"><img src="${S.img}" alt="">✦ ${S.nm}</span>`)}
  if(R.eq)it.push(`<span style="--c:${R.eq.R.c}"><img src="${twIco(R.eq.E.k,R.eq.R.k)}" alt="">${R.eq.E.n} ${R.eq.R.n}</span>`);
  const up=R.r1>R.r0,down=R.r1<R.r0,ri=R.r1,ci=R.chest?TWRK.indexOf(R.chest):0;
  rkModal(`<div class="twM rkRes ${R.won?'gold':''}"><h3>${R.won?'🏆 BROLY DERROTADO!':'💀 O BROLY VENCEU'}</h3>
    <p class="twH">⏱ ${twFmt(R.secs)}${R.t1?' · 1ª fase em '+twFmt(R.t1):''} · 💥 ${rkFmtN(R.dmg)} de dano (${Math.round(R.frac*100)}%) · 👊 combo ${R.cmb}</p>
    ${R.won?`<div class="rkChest" id="rkChest" style="--c:${TWEQR[ci].c}"><img class="cf" src="${TWIMG.bf[ci]}" alt=""><img class="ca" src="${TWIMG.ba[ci]}" alt=""><b>TOQUE PARA ABRIR O BAÚ!</b></div><div class="rkItems" id="rkItems" hidden>${it.join('')}</div>`:`<div class="rkItems">${it.join('')}</div>`}
    <div class="rkRp">${rkEmb(ri,'md'+(up?' up':down?' down':''))}<div><b style="color:${RKR[ri].c}">${RKR[ri].n}${up?' ⬆ SUBIU DE RANK!':down?' ⬇ CAIU DE RANK':''}</b><span>${R.rp1-R.rp0>=0?'+':''}${R.rp1-R.rp0} XP · ${rkFmtN(R.rp1)}${ri<7?' / '+rkFmtN(RKXP[ri+1]):''} XP · Boss nível ${ri+1}</span><i class="bar"><s style="width:${rkProg(R.rp1)}%;background:${RKR[ri].c}"></s></i></div></div>
    <div class="row"><button class="btn main" id="rkAgain">LUTAR DE NOVO</button><button class="btn" id="rkOk">OK</button></div></div>`);
  $('rkOk').onclick=()=>{rkModal(null);rkView('boss')};$('rkAgain').onclick=()=>{rkModal(null);rkBossStart()};
  const C=$('rkChest');if(C)C.onclick=()=>{if(C.classList.contains('open'))return;C.classList.add('open');rkSfx('boom');setTimeout(()=>{rkSfx('powerUp');$('rkItems').hidden=false},350)};
  if(up){rkSfx('powerUp');setTimeout(()=>rkToast('⬆ NOVO RANK: '+RKR[ri].n+'! Boss agora é nível '+(ri+1),'#ffd84a'),600)}if(down){rkSfx('clang');setTimeout(()=>rkToast('⬇ Caiu para '+RKR[ri].n,'#ff8080'),600)}}
const rkProg=rp=>{const i=rkRank(rp);if(i>=RKR.length-1)return 100;return Math.round(100*(rp-RKR[i].min)/(RKR[i+1].min-RKR[i].min))};
/* ---------------- INVOCAÇÃO (gacha) ---------------- */
const RKEQW=[['comum',60],['rara',28],['epica',9],['lend',2.5],['mit',.5]];
/* drops especiais do gacha: espada SECRETA (0,3% por giro, garantida em 50 giros) e 3 míticos especiais (0,6% por giro) */
if(!TWEQR.some(R=>R.k==='sec'))TWEQR.push({k:'sec',n:'SECRETA',c:'#e8f6ff',w:0,v:15});TWSELL.sec=5000;
const RKSP={sec:{t:'esp',r:'sec',v:15,vel:5,crit:10,nm:'LÂMINA NEGRA',img:RQA.sp.espada_secreta},
  mask:{t:'cap',r:'mit',v:35,crit:25,dmg:5,nm:'MÁSCARA HOLLOW',img:RQA.sp.mascara},hat:{t:'cap',r:'mit',v:35,crit:25,nm:'CHAPÉU DO HOKAGE',img:RQA.sp.chapeu},
  arm:{t:'arm',r:'mit',v:10,nm:'ARMADURA SAIYAJIN',img:RQA.sp.armadura},
  /* drops do MODO BOSS */
  band:{t:'cap',r:'lend',v:20,crit:20,nm:'BANDANA DA FOLHA',img:RQA.sp.bandana,boss:1},bots:{t:'bot',r:'lend',v:7,dmg:3,nm:'BOTAS SAIYAJIN',img:RQA.sp.botas,boss:1},
  kam:{t:'esp',r:'mit',v:10,vel:5,crit:15,nm:'ADAGA KAMISH',img:RQA.sp.kamish,boss:1},gun:{t:'esp',r:'mit',v:12,vel:3,dmg:3,nm:'GUNBAI DO MADARA',img:RQA.sp.gunbai,boss:1}};
/* Semente dos Deuses: quando você morre (Modo Boss e Torre), volta com a vida cheia (usa 1) */
const rkSenzu=()=>twLS.g('tw_senzu',0)|0,rkAddSenzu=n=>twLS.s('tw_senzu',Math.max(0,rkSenzu()+n));
function rkSenzuRevive(d){if(rkSenzu()<=0||d.cpu||d.rkSz)return false;d.rkSz=1;rkAddSenzu(-1);d.ko=false;d.hp=d.hpLag=(d.mhp||MAXHP);d.state='idle';d.st=0;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;d.move=null;d.hitstun=0;d.inv=90;
  G.flash=10;G.flashCol='#d8ffb0';G.hitstop=Math.max(G.hitstop,16);for(const r of [300,180])ring(d.x,d.y-150,'#9fff5a',r,24,7);banner('SEMENTE DOS DEUSES!','#9fff5a',100,'VIDA RESTAURADA');rkSfx('powerUp');return true}
const rkSpTxt=x=>[x.t==='esp'?'Ataque +'+x.v+'%':x.t==='arm'?'Defesa +'+x.v+'%':'Transformação +'+x.v+'%',x.dmg?'Dano +'+x.dmg+'%':'',x.vel?'Velocidade +'+x.vel+'%':'',x.crit?'Crítico +'+x.crit+'%':''].filter(Boolean).join(' · ');
function rkGiveSp(k){const S=RKSP[k],I=twInv(),it=Object.assign({id:'gs'+k+Date.now().toString(36)+Math.random().toString(36).slice(2,5)},S);I.push(it);twLS.s('tw_inv',I);const Q=twEqp(),cur=I.find(x=>x.id===Q[S.t]);if(!cur||(S.v+(S.crit||0)+(S.dmg||0))>(cur.v+(cur.crit||0)+(cur.dmg||0))){Q[S.t]=it.id;twLS.s('tw_eqp',Q)}TW.capOut=twCap();return it}
function rkRoll(){const p2=rkG('pity2',0)+1;if(p2>=50||Math.random()*100<.3){rkS('pity2',0);return {k:'sp',r:'sec',s:'sec'}}rkS('pity2',p2);
  if(Math.random()*100<.6){const s=['mask','hat','arm'][(Math.random()*3)|0];return {k:'sp',r:'mit',s}}
  const p=rkG('pity',0)+1;let r=Math.random()*100;
  if(p>=30||r<2){rkS('pity',0);return {k:'chr',r:'lend',id:RK_LEG[(Math.random()*RK_LEG.length)|0]}}
  rkS('pity',p);r-=2;if(r<6)return {k:'chr',r:'epica',id:RK_EPI[(Math.random()*RK_EPI.length)|0]};r-=6;
  if(r<27){let q=Math.random()*100,R='comum';for(const [k,w] of RKEQW){if((q-=w)<0){R=k;break}}return {k:'eq',r:R,E:TWEQ[(Math.random()*TWEQ.length)|0]}}
  return {k:'red',r:'comum',n:1+((Math.random()*5)|0)}}
function rkGachaH(){const p=rkG('pity',0);
  return `<button class="hs" data-a="back" style="${rkB(15,10,130,85)}"></button><button class="hs" data-a="home" style="${rkB(1740,10,1840,85)}"></button>
  <div class="rkNum" style="${rkB(1228,22,1352,62)}">${rkFmtN(rkG('gem',0))}</div><button class="hs" data-a="shop" style="${rkB(1360,18,1415,68)}"></button>
  <div class="rkNum" style="${rkB(1530,22,1648,62)}">${rkFmtN(rkG('tic',0))}</div><button class="hs" data-a="lock" style="${rkB(1655,18,1710,68)}"></button>
  <button class="hs on" style="${rkB(15,115,395,255)}" data-a="boxinfo" data-t="Invocação Limitada: todos os lendários com a mesma chance"></button>
  <button class="hs lk dim" data-a="lock" style="${rkB(15,275,375,390)}">${RKLOCK}</button><button class="hs lk dim" data-a="lock" style="${rkB(15,405,375,515)}">${RKLOCK}</button>
  <button class="hs" data-a="pool" style="${rkB(805,560,865,620)}"></button>
  <button class="hs" data-a="shop" style="${rkB(40,700,125,800)}"></button><button class="hs" data-a="hist" style="${rkB(165,700,265,800)}"></button><button class="hs" data-a="taxas" style="${rkB(300,700,390,800)}"></button>
  <button class="hs" data-a="sum1" style="${rkB(550,695,975,805)}"><span class="shine"></span></button><button class="hs" data-a="sum10" style="${rkB(1030,695,1475,805)}"><span class="shine"></span></button>
  <div class="rkPity" style="${rkB(560,812,1470,845)}">⭐ Lendário garantido em <b>${30-p}</b> · ✦ Lâmina Negra (secreta) garantida em <b>${50-rkG('pity2',0)}</b> · 🎟️ ticket = 1 giro</div>`}
let RKVF=null,RKVP=null;
function rkPre(list){const ims=list.map(s=>{const im=new Image();im.decoding='async';im.src=s;return im});return {ims,p:Promise.all(ims.map(im=>(im.decode?im.decode():new Promise(r=>{im.onload=r})).catch(()=>{})))}}
function rkGachaOn(){if(!RKVF){const P=rkPre(RQA.inv);RKVF=P.ims;RKVP=P.p}}
/* toca uma lista de quadros já carregados num canvas, 12 quadros/s, pelo relógio (não trava se o celular atrasar) */
function rkPlayFrames(host,ims,ready,cb,fps){const cv=document.createElement('canvas');cv.className='rkCv';host.appendChild(cv);const c=cv.getContext('2d');let t0=0,done=false,raf=0;
  const fit=()=>{const d=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*d;cv.height=innerHeight*d};fit();
  const end=()=>{if(done)return;done=true;cancelAnimationFrame(raf);cv.remove();cb()};
  const draw=ts=>{if(done)return;if(!t0)t0=ts;const i=Math.floor((ts-t0)/1000*(fps||12));if(i>=ims.length){end();return}let k=i;while(k>0&&!(ims[k].complete&&ims[k].naturalWidth))k--;const im=ims[k];
    if(im&&im.naturalWidth){const W=cv.width,H=cv.height,s=Math.min(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;c.fillStyle='#000';c.fillRect(0,0,W,H);c.drawImage(im,(W-w)/2,(H-h)/2,w,h)}raf=requestAnimationFrame(draw)};
  Promise.race([ready,new Promise(r=>setTimeout(r,2500))]).then(()=>{raf=requestAnimationFrame(draw)});return end}
function rkSummon(n){rkInit();const cost=n===1?50:450;let useT=false;
  if(n===1&&rkG('tic',0)>0)useT=true;else if(rkG('gem',0)<cost){rkSfx('clang');rkToast('Geminhas insuficientes! Compre na Loja 🛒','#ff8080');return}
  if(useT)rkAdd('tic',-1);else rkAdd('gem',-cost);
  const L=[];for(let i=0;i<n;i++)L.push(rkRoll());
  if(n===10&&!L.some(x=>(x.k==='chr')||(x.k==='sp')||(x.k==='eq'&&['epica','lend','mit'].includes(x.r))))L[9]={k:'chr',r:'epica',id:RK_EPI[(Math.random()*RK_EPI.length)|0]};
  const own=rkG('own',['goku']);
  for(const x of L){if(x.k==='chr'){if(own.includes(x.id)){x.dup=x.r==='lend'?25:5;rkAdd('gem',x.dup)}else{own.push(x.id);x.nw=1}}else if(x.k==='eq')twAddItem(x.E,TWEQR.find(R=>R.k===x.r));else if(x.k==='sp')rkGiveSp(x.s);else rkAdd('red',x.n)}
  rkS('own',own);rkStAdd('spins',n);if(L.some(x=>x.k==='chr'&&x.r==='lend'&&x.nw))rkStAdd('legs',L.filter(x=>x.k==='chr'&&x.r==='lend'&&x.nw).length);
  const H=rkG('hist',[]);for(const x of L)H.unshift({k:x.k,r:x.r,id:x.id,s:x.s,t:x.E?x.E.k:'',n:x.n||0,dup:x.dup||0,d:Date.now()});rkS('hist',H.slice(0,60));
  for(const x of L)if(x.k==='chr'&&x.nw&&x.r==='lend'){try{const F=RKTV[x.id]&&RKTV[x.id]().f;if(F)RKCWP[x.id]=rkPre(F)}catch(e){}}
  rkPlayVid(()=>rkCards(L))}
const RKCWP={};
function rkPlayVid(cb){rkGachaOn();const O=document.createElement('div');O.className='rkFx';O.innerHTML='<span>toque para pular</span>';$('ranked').appendChild(O);
  const stop=rkPlayFrames(O,RKVF,RKVP,()=>{O.remove();cb()});O.onclick=()=>stop();try{SFX.powerUp()}catch(e){}}
function rkCardInner(x){if(x.k==='chr')return `<img class="pt" src="${IMG[x.id]?IMG[x.id].src:''}" alt=""><b>${CH[x.id]?CH[x.id].name:''}</b><em>${x.nw?'NOVO!':'REPETIDO +'+x.dup+'💎'}</em>`;
  if(x.k==='eq')return `<img class="ic" src="${twIco(x.E.k,x.r)}" alt=""><b>${x.E.n}</b><em>${TWEQR.find(R=>R.k===x.r).n}</em>`;
  if(x.k==='sp'){const S=RKSP[x.s];return `<img class="ic" src="${S.img}" alt=""><b>${S.nm}</b><em>${x.r==='sec'?'✦ SECRETA ✦':'MÍTICO ESPECIAL'}</em>`}
  return `<img class="ic" src="${RQA.coin[1]}" alt=""><b>+${x.n}</b><em>MOEDA VERMELHA</em>`}
function rkCards(L){const O=document.createElement('div');O.className='rkRes2';const one=L.length===1;
  O.innerHTML=`<div class="rkCards ${one?'one':''}">${L.map((x,i)=>`<div class="rkCd r_${x.r}" data-i="${i}" style="--c:${(TWEQR.find(R=>R.k===x.r)||TWEQR[0]).c}"><div class="bk"></div><div class="fr"><img class="frm" src="${RQA.card[x.r==='sec'?'lend':x.r]||RQA.card.comum}" alt=""><div class="in">${rkCardInner(x)}</div></div></div>`).join('')}</div>
    <div class="row"><button class="btn" id="rkCdAll">REVELAR TUDO</button><button class="btn main" id="rkCdOk" hidden>OK</button></div>`;
  $('ranked').appendChild(O);const C=[...O.querySelectorAll('.rkCd')];let k=0;
  const rev=async el=>{if(!el||el.classList.contains('rv'))return;const x=L[+el.dataset.i];
    if((x.r==='lend'&&x.k==='chr')||x.r==='sec'){O.classList.add('dim');await new Promise(r=>setTimeout(r,500));O.classList.remove('dim')}
    el.classList.add('rv');rkSfx(x.r==='lend'?'boom':'whoosh');if(x.r==='lend'||x.r==='mit'||x.r==='sec')setTimeout(()=>rkSfx('powerUp'),200);if(x.r==='sec'){await new Promise(r=>setTimeout(r,400));await rkSecWin()}
    if(x.k==='chr'&&x.nw&&x.r==='lend'){await new Promise(r=>setTimeout(r,500));await rkCharWin(x.id)}
    if(C.every(c=>c.classList.contains('rv'))){$('rkCdAll').hidden=true;$('rkCdOk').hidden=false}};
  C.forEach(el=>el.onclick=()=>rev(el));const auto=async()=>{for(const el of C){if(!O.isConnected)return;await rev(el);await new Promise(r=>setTimeout(r,one?300:260))}};setTimeout(auto,500);
  $('rkCdAll').onclick=()=>{C.forEach(el=>rev(el))};$('rkCdOk').onclick=()=>{O.remove();rkView('gacha')}}
function rkSecWin(){return new Promise(res=>{const S=RKSP.sec,O=document.createElement('div');O.className='rkWin end sec';O.innerHTML=`<div class="t"><b>✦ DROP SECRETO! ✦</b><span>${S.nm}</span></div><img class="fl" src="${S.img}" alt=""><i class="rays"></i><div class="t2">${rkSpTxt(S)}</div>`;$('ranked').appendChild(O);rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),300);setTimeout(()=>{O.onclick=()=>{O.remove();res()}},500)})}
/* personagem lendário novo: passa o vídeo da transformação dele */
const RKTV={goku:()=>GKV,aokiji:()=>AOV,zoro:()=>ZRV,broly:()=>BRV,vegeta:()=>VGV,gogeta:()=>GGV,madara:()=>MDV,gojo:()=>GJV,luffy:()=>LFV,rengoku:()=>RGV,naruto:()=>NRV,garou:()=>GRV,qingqing:()=>QQV,zaykon:()=>ZKV,zedry:()=>ZGV};
function rkCharWin(id){return new Promise(res=>{let F=null;try{F=RKTV[id]&&RKTV[id]().f}catch(e){}
  const O=document.createElement('div');O.className='rkWin';O.innerHTML=`<img class="v" alt=""><div class="t"><b>NOVO PERSONAGEM LENDÁRIO!</b><span>${CH[id]?CH[id].name:''}</span></div><img class="fl" src="${fullSrc(id)}" alt="" hidden><i class="rays"></i>`;$('ranked').appendChild(O);
  const v=O.querySelector('.v'),fl=O.querySelector('.fl');v.remove();let done=false,stop=null;const fin=()=>{if(done)return;done=true;if(stop)stop();fl.hidden=false;O.classList.add('end');rkSfx('powerUp');setTimeout(()=>{O.onclick=()=>{O.remove();res()}},400)};
  O.onclick=()=>fin();if(F&&F.length){const P=RKCWP[id]||rkPre(F);stop=rkPlayFrames(O,P.ims,P.p,fin)}else fin()})}
function rkHist(){const H=rkG('hist',[]);rkModal(`<div class="twM"><h3>📜 HISTÓRICO</h3><div class="rkHl">${H.length?H.map(x=>{const R=TWEQR.find(q=>q.k===x.r)||TWEQR[0];return `<div style="--c:${R.c}"><b>${x.k==='chr'?(CH[x.id]?CH[x.id].name:x.id):x.k==='eq'?TWEQ.find(E=>E.k===x.t).n:x.k==='sp'?RKSP[x.s].nm:'+'+x.n+' 🔴'}</b><span>${x.k==='chr'?'PERSONAGEM '+(x.r==='lend'?'LENDÁRIO':'ÉPICO')+(x.dup?' (repetido +'+x.dup+'💎)':''):x.k==='eq'?'EQUIPAMENTO '+R.n:x.k==='sp'?(x.r==='sec'?'✦ SECRETO ✦':'MÍTICO ESPECIAL'):'MOEDA VERMELHA'}</span><small>${new Date(x.d).toLocaleString('pt-BR').slice(0,17)}</small></div>`}).join(''):'<p class="twH">Nenhum giro ainda.</p>'}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
function rkTaxas(){rkModal(`<div class="twM"><h3>% TAXAS DA INVOCAÇÃO LIMITADA</h3><table class="rkTx"><tr><th>Resultado</th><th>Chance</th></tr>
  <tr><td style="color:#ffc531">⭐ Personagem LENDÁRIO</td><td>2%</td></tr><tr><td style="color:#b25bff">Personagem ÉPICO</td><td>6%</td></tr><tr><td>Equipamento</td><td>27%</td></tr><tr><td style="color:#ff5a5a">Moeda Vermelha (1 a 5)</td><td>65%</td></tr><tr><td style="color:#ff2e63">Mítico especial (Máscara Hollow, Chapéu do Hokage, Armadura Saiyajin)</td><td>0,6%</td></tr><tr><td style="color:#e8f6ff">✦ SECRETO: Lâmina Negra</td><td>0,3%</td></tr></table>
  <p class="twH">⭐ Garantia: no máximo 30 giros sem lendário (o 30º é garantido). ✦ Lâmina Negra garantida em 50 giros. Giro de 10: sempre vem pelo menos 1 épico ou melhor.<br>Equipamento: comum 60% · raro 28% · épico 9% · lendário 2,5% · mítico 0,5%.<br>Repetido: lendário vira 25 💎, épico 5 💎.</p>
  <p class="twH">✦ <b>Drops do Modo Boss (por vitória):</b> lendários (Bandana da Folha, Botas Saiyajin, Semente dos Deuses) 4% · míticos (Adaga Kamish, Gunbai do Madara) 1,5% · garantido 1 a cada 25 vitórias sem drop.</p><p class="twH"><b>Lendários:</b> ${RK_LEG.map(id=>CH[id].name).join(', ')}<br><b>Épicos:</b> ${RK_EPI.map(id=>CH[id].name).join(', ')}</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
/* ---------------- LOJA (só geminhas por enquanto) ---------------- */
const RKPK=[[60,100],[350,450],[1180,1400],[2480,2800],[4280,4500],[8480,9000]];
function rkShopH(){const P=[[800,222,1110,470],[1137,222,1455,470],[1482,222,1810,470],[800,492,1110,770],[1137,492,1455,770],[1482,492,1810,770]];
  return `<button class="hs" data-a="back" style="${rkB(10,10,135,80)}"></button><button class="hs" data-a="home" style="${rkB(1730,5,1840,80)}"></button>
  <div class="rkNum" style="${rkB(902,20,1035,60)}">${rkFmtN(rkG('gem',0))}</div><div class="rkNum" style="${rkB(1180,20,1312,60)}">${rkFmtN(rkG('tic',0))}</div><div class="rkNum" style="${rkB(1452,20,1588,60)}">${rkFmtN(rkG('red',0))}</div>
  ${[[1040,18,1090,65],[1318,18,1368,65],[1594,18,1644,65]].map(b=>`<button class="hs" data-a="lock" style="${rkB(...b)}"></button>`).join('')}
  <button class="hs on" style="${rkB(15,140,300,235)}"></button>${[[255,350],[375,465],[490,585]].map(([a,b])=>`<button class="hs lk dim" data-a="lock" style="${rkB(15,a,300,b)}">${RKLOCK}</button>`).join('')}
  ${P.map((b,i)=>`<button class="hs pk" data-a="buy" data-i="${i}" style="${rkB(...b)}"></button>`).join('')}`}
function rkBuy(i){const [g,c]=RKPK[i];rkModal(`<div class="twM sm"><h3>COMPRAR?</h3><p class="twH"><b class="coin">${rkFmtN(g)} 💎 Geminhas</b> por <b style="color:#ff5a5a">${rkFmtN(c)} 🔴</b><br>Você tem ${rkFmtN(rkG('red',0))} 🔴</p><div class="row"><button class="btn" id="rkMX">CANCELAR</button><button class="btn main" id="rkMOk">COMPRAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('rkMOk').onclick=()=>{if(rkG('red',0)<c){rkSfx('clang');rkModal(null);rkToast('Moeda Vermelha insuficiente! Vença o Broly no Modo Boss','#ff8080');return}rkAdd('red',-c);rkAdd('gem',g);rkSfx('powerUp');rkModal(null);rkView('shop');rkToast('+'+rkFmtN(g)+' 💎 Geminhas!','#7fd8ff')}}
/* ---------------- BIBLIOTECA ---------------- */
const RKL={tab:'chr',pg:0,q:'',f:0,cur:null};
function rkLibH(){return `<button class="hs" data-a="back" style="${rkB(20,10,145,80)}"></button><button class="hs" data-a="home" style="${rkB(1725,5,1840,80)}"></button>
  ${[['chr',155,240],['eq',255,335],['it',355,435],['col',455,540]].map(([t,a,b])=>`<button class="hs tab ${RKL.tab===t?'on':''}" data-a="tab" data-t="${t}" style="${rkB(10,a,275,b)}"></button>`).join('')}
  <input class="rkSrch" id="rkSrch" placeholder="Buscar..." autocomplete="off" value="${twEsc(RKL.q)}" style="${rkB(1195,100,1610,148)}"><button class="hs" data-a="filt" style="${rkB(1640,95,1735,155)}"><span class="rkFl" id="rkFl">${['TODOS','TENHO','FALTA'][RKL.f]}</span></button>
  <div id="rkGrid"></div><button class="hs" data-a="up" style="${rkB(1742,182,1798,238)}"></button><button class="hs" data-a="down" style="${rkB(1742,732,1798,788)}"></button>
  <div class="rkPed" id="rkPed" style="${rkB(380,120,920,640)}"></div><div class="rkInfo" id="rkInfo" style="${rkB(300,700,1000,800)}"></div>
  <button class="rkUse" id="rkUse" data-a="libUse" style="${rkB(18,600,268,668)}" hidden></button>`}
function rkLibItems(){const own=rkG('own',['goku']),inv=twInv(),Q=twEqp(),R=[];
  if(RKL.tab==='chr'){for(const id of RK_LEG.concat(RK_EPI))R.push({id,k:'chr',r:rkRar(id),has:own.includes(id),img:IMG[id]?IMG[id].src:'',big:fullSrc(id),nm:CH[id].name,d:(rkRar(id)==='lend'?'PERSONAGEM LENDÁRIO':'PERSONAGEM ÉPICO')+(rkG('sel','goku')===id?' · EM USO NA RANQUEADA':'')})}
  else if(RKL.tab==='eq'){for(const k in RKSP){const S=RKSP[k];const has=inv.some(x=>x.nm===S.nm);R.push({id:'sp'+k,k:'eq',r:S.r,has,img:S.img,big:S.img,nm:S.nm,d:(S.r==='sec'?'✦ SECRETO · ':S.r==='lend'?'LENDÁRIO ESPECIAL · ':'MÍTICO ESPECIAL · ')+rkSpTxt(S)+(S.boss?' · drop do Modo Boss':' · só no gacha')})}
    for(const E of TWEQ)for(const Rr of TWEQR.filter(q=>q.k!=='sec')){const has=inv.some(x=>x.t===E.k&&x.r===Rr.k);const v=E.k==='cap'?TWCAPV[Rr.k]:null;R.push({id:E.k+Rr.k,k:'eq',r:Rr.k,has,img:twIco(E.k,Rr.k),big:twIco(E.k,Rr.k),nm:E.n+' '+Rr.n,d:E.k==='cap'?'Transformação +'+v[0]+'% · Crítico +'+v[1]+'%':E.d.replace('Aumenta o ','').replace('Aumenta a ','')+' +'+Rr.v+'%'})}}
  else if(RKL.tab==='it'){R.push({id:'gem',k:'it',r:'rara',has:1,img:RQA.coin[0],big:RQA.coin[0],nm:'GEMINHAS',d:'Você tem '+rkFmtN(rkG('gem',0))+' · usadas na Invocação'});R.push({id:'tic',k:'it',r:'lend',has:1,img:RQA.coin[2],big:RQA.coin[2],nm:'TICKET DE GIRO',d:'Você tem '+rkFmtN(rkG('tic',0))+' · 1 ticket = 1 giro'});
    R.push({id:'senzu',k:'it',r:'lend',has:rkSenzu()>0,img:RQA.sp.senzu,big:RQA.sp.senzu,nm:'SEMENTE DOS DEUSES',d:'Você tem '+rkSenzu()+' · quando você morre (Boss/Torre) volta com a vida cheia · drop do Modo Boss'});
    R.push({id:'red',k:'it',r:'mit',has:1,img:RQA.coin[1],big:RQA.coin[1],nm:'MOEDA VERMELHA',d:'Você tem '+rkFmtN(rkG('red',0))+' · compra geminhas na Loja'});
    for(const P of TWPOR){const n=twPocs().filter(x=>x.r===P.k).length;R.push({id:'p'+P.k,k:'it',r:P.k,has:n>0,img:TWIMG.poc[TWRK.indexOf(P.k)],big:TWIMG.poc[TWRK.indexOf(P.k)],nm:'POÇÃO '+P.n,d:'Você tem '+n+' · '+twPoTxt(P.k)})}}
  else{const tt=twTits();for(const k in TWTIT){const T=TWTIT[k];if(T.hid&&!tt.includes(k))continue;R.push({id:'t'+k,k:'col',r:T.rk!=null?['comum','comum','rara','lend','rara','epica','mit','lend'][T.rk]:'epica',has:tt.includes(k),img:T.rk!=null?RQA.rank[T.rk]:'',ico:T.rk!=null?'':T.i,big:T.rk!=null?RQA.rank[T.rk]:'',bigI:T.i,nm:'TÍTULO '+T.n,d:T.d,tit:k})}
    for(const x of inv.filter(y=>y.ev||String(y.id).startsWith('cp')))R.push({id:'c'+x.id,k:'col',r:x.r,has:1,img:x.img||twIco(x.t,x.r),big:x.img||twIco(x.t,x.r),nm:x.nm||(TWEQ.find(E=>E.k===x.t)||{}).n,d:'Item especial'+(x.ev?' do evento':' de código')})}
  const q=RKL.q.toLowerCase();return R.filter(x=>(!q||x.nm.toLowerCase().includes(q))&&(RKL.f===0||(RKL.f===1?x.has:!x.has)))}
function rkLibOn(){const S=$('rkSrch');if(S)S.oninput=()=>{RKL.q=S.value;RKL.pg=0;rkLibGrid()};rkLibGrid();if(!RKL.cur){const L=rkLibItems();if(L[0])rkLibShow(L[0])}else rkLibShow(RKL.cur)}
function rkLibGrid(){const L=rkLibItems(),G0=$('rkGrid');if(!G0)return;const pages=Math.max(1,Math.ceil(L.length/16));RKL.pg=Math.min(RKL.pg,pages-1);const X=[1057,1223,1390,1557],Y=[183,338,492,645];
  G0.innerHTML=L.slice(RKL.pg*16,RKL.pg*16+16).map((x,i)=>{const c=(TWEQR.find(R=>R.k===x.r)||TWEQR[0]).c;return `<button class="rkCell ${x.has?'':'no'} ${RKL.cur&&RKL.cur.id===x.id?'on':''}" data-id="${x.id}" style="${rkB(X[i%4],Y[(i/4)|0],X[i%4]+143,Y[(i/4)|0]+137)};--c:${c}">${x.img?`<img src="${x.img}" alt="">`:`<i>${x.ico||''}</i>`}${x.has?'':'<span class="lk">🔒</span>'}<b>${twEsc(x.nm.replace('TÍTULO ',''))}</b></button>`}).join('')+(pages>1?`<div class="rkPg" style="${rkB(1742,450,1798,480)}">${RKL.pg+1}/${pages}</div>`:'');
  G0.querySelectorAll('.rkCell').forEach(b=>b.onclick=()=>{const x=L.find(y=>y.id===b.dataset.id);if(x){rkSfx('whoosh');rkLibShow(x);rkLibGrid()}})}
function rkLibShow(x){RKL.cur=x;const P=$('rkPed'),I=$('rkInfo'),U=$('rkUse');if(!P)return;const c=(TWEQR.find(R=>R.k===x.r)||TWEQR[0]).c;
  P.style.setProperty('--c',c);P.className='rkPed '+x.k+(x.has?'':' no');P.innerHTML=`<i class="glw"></i>${x.big?`<img src="${x.big}" alt="">`:`<span class="ico">${x.bigI||''}</span>`}`;
  I.innerHTML=`<b style="color:${c}">${twEsc(x.nm)}</b><span>${x.has?'':'🔒 '}${twEsc(x.d)}</span>`;
  U.hidden=!(x.k==='chr'&&x.has&&rkG('sel','goku')!==x.id)&&!(x.k==='col'&&x.tit&&x.has);U.textContent=x.k==='chr'?'USAR NA RANQUEADA':twTitOn()===x.tit?'TÍTULO EM USO':'USAR TÍTULO'}
function rkLibTab(t){RKL.tab=t;RKL.pg=0;RKL.cur=null;rkView('lib')}
function rkLibPage(d){RKL.pg=Math.max(0,RKL.pg+d);rkLibGrid()}
function rkLibFilt(){RKL.f=(RKL.f+1)%3;RKL.pg=0;$('rkFl').textContent=['TODOS','TENHO','FALTA'][RKL.f];rkLibGrid()}
function rkLibUse(){const x=RKL.cur;if(!x)return;if(x.k==='chr'){rkS('sel',x.id);rkSfx('powerUp');rkToast('✔ '+CH[x.id].name+' vai lutar na ranqueada','#7dff9a')}else if(x.tit){twLS.s('tw_titOn',x.tit);try{twTitSync()}catch(e){}rkToast('✔ Título em uso','#7dff9a')}const y=rkLibItems().find(z=>z.id===x.id)||x;rkLibShow(y);rkLibGrid()}
/* ---------------- RANKING / RECOMPENSAS / CONQUISTAS / MINHA POSIÇÃO ---------------- */
async function rkLoadRk(){const L=await rkQ('rk','1',1000),M={};for(const e of L){const k=e.uid||e.nome;const o=M[k]||(M[k]={nome:e.nome,uid:e.uid,tit:e.tit,rp:0,dmg:0,t1:0,tt:0,ct:0,char:e.char});
    if(e._ct>=o.ct){o.ct=e._ct;o.rp=e.rp||0;o.nome=e.nome;o.tit=e.tit;o.char=e.char}o.dmg=Math.max(o.dmg,e.dmg||0);if(e.t1&&(!o.t1||e.t1<o.t1))o.t1=e.t1;if(e.tt&&(!o.tt||e.tt<o.tt))o.tt=e.tt}return Object.values(M)}
function rkRanking(tab){tab=tab||'rp';rkModal(`<div class="twM rk"><h3>🏆 RANKING DO RANQUEADO</h3><div class="seg twTab"><button data-t="rp" aria-pressed="${tab==='rp'}">👑 RANK</button><button data-t="dmg" aria-pressed="${tab==='dmg'}">💥 DANO NO BROLY</button><button data-t="tt" aria-pressed="${tab==='tt'}">⏱ MAIS RÁPIDO</button><button data-t="t1" aria-pressed="${tab==='t1'}">⚡ 1ª FASE</button></div>
    <div id="rkRkL"><p class="twH">Carregando...</p></div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);document.querySelectorAll('#rkModal .twTab button').forEach(b=>b.onclick=()=>rkRanking(b.dataset.t));
  rkLoadRk().then(A=>{let L=A.slice();if(tab==='rp')L.sort((a,b)=>b.rp-a.rp);else if(tab==='dmg')L.sort((a,b)=>b.dmg-a.dmg);else{L=L.filter(e=>e[tab]>0).sort((a,b)=>a[tab]-b[tab])}L=L.slice(0,50);const me=twUid(),E=$('rkRkL');if(!E)return;
    E.innerHTML=L.length?'<div class="twRk">'+L.map((e,i)=>{const ri=rkRank(e.rp);return `<div class="rw${e.uid===me?' me':''}${i<3?' t'+(i+1):''}"><span class="ps">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><img src="${RQA.rank[ri]}" alt=""><span class="nm">${twEsc(e.nome)}${twTitTag(twTN(e),e.nome)}<small style="color:${RKR[ri].c}">${RKR[ri].n}</small></span><span class="an">${tab==='rp'?'⭐ '+rkFmtN(e.rp)+' XP':tab==='dmg'?'💥 '+rkFmtN(e.dmg):'⏱ '+twFmt(e[tab])}</span></div>`}).join('')+'</div>':'<p class="twH">Ninguém no ranking ainda. Seja o primeiro!</p>'}).catch(()=>{const E=$('rkRkL');if(E)E.innerHTML='<p class="twH err">Sem internet agora.</p>'})}
const rkRwPend=()=>{const c=rkG('rwc',[]),ri=rkRank(rkG('rp',0));for(let i=1;i<=ri;i++)if(!c.includes(i))return true;return false};
function rkRewards(){const c=rkG('rwc',[]),ri=rkRank(rkG('rp',0));
  rkModal(`<div class="twM"><h3>🎁 RECOMPENSAS DE RANK</h3><p class="twH">Suba de rank com XP ranqueado: vitória dá XP, derrota tira (pode cair de rank). Cada rank novo dá geminhas e um título!</p><div class="rkRw">${RKR.map((R,i)=>{const got=c.includes(i)||i===0,can=i<=ri&&!got;return `<div class="${i<=ri?'ok':''}" style="--c:${R.c}">${rkEmb(i,'xs')}<b style="color:${R.c}">${R.n}</b><small>${rkFmtN(R.min)} XP</small><span>${i?'💎 '+R.rw:'—'}</span>${can?`<button class="btn main" data-i="${i}">RESGATAR</button>`:`<em>${got&&i<=ri?(i?'✔ RESGATADO':'✔'):'🔒'}</em>`}</div>`}).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>{rkModal(null);if(RKV==='menu')rkView('menu')};document.querySelectorAll('#rkModal .rkRw button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,c=rkG('rwc',[]);if(c.includes(i))return;c.push(i);rkS('rwc',c);rkAdd('gem',RKR[i].rw);twGiveTit('rk'+i);rkSfx('powerUp');rkToast('+'+RKR[i].rw+' 💎','#7fd8ff');rkRewards()})}
const RKACH=[{k:'w1',n:'Primeira Vitória',d:'Derrote o Broly pela 1ª vez',g:50,ok:S=>(S.wins||0)>=1},{k:'w5',n:'Caçador de Lendas',d:'Derrote o Broly 5 vezes',g:100,ok:S=>(S.wins||0)>=5},{k:'w20',n:'Pesadelo do Broly',d:'Derrote o Broly 20 vezes',g:300,ok:S=>(S.wins||0)>=20},
  {k:'t1',n:'Relâmpago',d:'Vença a 1ª fase em menos de 60 s',g:80,ok:S=>S.t1>0&&S.t1<60},{k:'tt',n:'Speedrun Lendário',d:'Derrote o Broly em menos de 3 minutos',g:150,ok:S=>S.tt>0&&S.tt<180},{k:'cl',n:'Intocável',d:'Vença perdendo menos de 25% da vida',g:150,ok:S=>(S.clean||0)>=1},
  {k:'dm',n:'Destruidor',d:'Cause 100.000 de dano no total',g:100,ok:S=>(S.dmgTot||0)>=100000},{k:'sp',n:'Invocador',d:'Faça 50 giros na Invocação',g:100,ok:S=>(S.spins||0)>=50},{k:'lg',n:'Primeiro Lendário',d:'Ganhe um personagem lendário no gacha',g:50,ok:S=>(S.legs||0)>=1},
  {k:'gd',n:'Ouro!',d:'Chegue ao rank OURO',g:100,ok:()=>rkRank(rkG('rp',0))>=3},{k:'dv',n:'Divino',d:'Chegue ao rank DIVINDADE',g:500,ok:()=>rkRank(rkG('rp',0))>=7}];
const rkAchPend=()=>{const S=rkSt(),c=rkG('achc',[]);return RKACH.some(A=>A.ok(S)&&!c.includes(A.k))};
function rkAch(){const S=rkSt(),c=rkG('achc',[]);
  rkModal(`<div class="twM"><h3>🎖️ CONQUISTAS</h3><div class="rkAc">${RKACH.map(A=>{const ok=A.ok(S),got=c.includes(A.k);return `<div class="${ok?'ok':''} ${got?'got':''}"><b>${A.n}</b><span>${A.d}</span><em>💎 ${A.g}</em>${ok&&!got?`<button class="btn main" data-k="${A.k}">RESGATAR</button>`:`<i>${got?'✔':'🔒'}</i>`}</div>`}).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>{rkModal(null);if(RKV==='menu')rkView('menu')};document.querySelectorAll('#rkModal .rkAc button').forEach(b=>b.onclick=()=>{const A=RKACH.find(x=>x.k===b.dataset.k),c=rkG('achc',[]);if(c.includes(A.k))return;c.push(A.k);rkS('achc',c);rkAdd('gem',A.g);rkSfx('powerUp');rkToast('+'+A.g+' 💎','#7fd8ff');rkAch()})}
function rkPos(){const rp=rkG('rp',0),ri=rkRank(rp),S=rkSt();
  rkModal(`<div class="twM rkPos" style="--c:${RKR[ri].c}"><h3>📊 MINHA POSIÇÃO</h3><div class="rkPs">${rkEmb(ri,'big')}<div><b style="color:${RKR[ri].c}">${RKR[ri].n}</b><span>${rkFmtN(rp)} XP${ri<7?' · próximo: '+RKR[ri+1].n+' ('+rkFmtN(RKR[ri+1].min)+')':' · RANK MÁXIMO (sem limite de XP)'} · Boss nível ${ri+1}</span><i class="bar"><s style="width:${rkProg(rp)}%;background:${RKR[ri].c}"></s></i>
    <span id="rkPosN">Posição no ranking: ...</span><span>🏆 ${S.wins||0} vitórias · 💀 ${S.loss||0} derrotas · 💥 recorde ${rkFmtN(S.dmgMax||0)} de dano</span><span>⏱ melhor vitória ${S.tt?twFmt(S.tt):'--:--'} · ⚡ 1ª fase ${S.t1?twFmt(S.t1):'--:--'}</span>${rkCurHTML()}</div></div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);rkLoadRk().then(A=>{A.sort((a,b)=>b.rp-a.rp);const i=A.findIndex(e=>e.uid===twUid()),E=$('rkPosN');if(E)E.textContent=i>=0?'Posição no ranking: #'+(i+1)+' de '+A.length:'Jogue uma partida para entrar no ranking'}).catch(()=>{const E=$('rkPosN');if(E)E.textContent='Posição: sem internet'})}
