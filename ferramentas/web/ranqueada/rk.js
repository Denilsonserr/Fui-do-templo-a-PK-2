
/* ================= v213: MODO RANQUEADO (menu, Modo Boss Broly, Invocação/gacha, Loja de geminhas, Biblioteca, ranks) =================
   Personagens: no ranqueado só os que você ganhou no gacha (começa com Goku). Resto do jogo continua com todos liberados.
   Moedas do ranqueado (separadas da torre): 💎 geminhas (giros), 🎟️ tickets (1 giro), 🔴 moeda vermelha (compra geminhas).  */
const RQA=__RKA__;const RKW=1847,RKH=851;
const rkB=(x0,y0,x1,y1)=>`left:${x0/RKW*100}%;top:${y0/RKH*100}%;width:${(x1-x0)/RKW*100}%;height:${(y1-y0)/RKH*100}%`;
/* REGRAS DA RANQUEADA (do dono): XP ranqueado acumulado; vitória/derrota por rank; nível do Boss = rank (1..8) */
const RKXP=[0,1000,2500,5000,9000,15000,23000,35000,50000,70000,100000],RKXW=[150,180,210,240,270,300,340,390,440,500,580],RKXL=[30,45,60,80,100,125,150,180,210,250,300];
/* bônus de XP no Boss (v224) */
const RKXB={dmg:.8,cmb:60,me:150,srv:600};
const RKR=[{n:'MADEIRA',c:'#d29a5a',min:0,rw:0},{n:'BRONZE',c:'#ef9a5a',min:1000,rw:50},{n:'PRATA',c:'#dfe8ff',min:2500,rw:100},{n:'OURO',c:'#ffd23a',min:5000,rw:150},
  {n:'DIAMANTE',c:'#5ab8ff',min:9000,rw:250},{n:'LENDÁRIO',c:'#c46aff',min:15000,rw:400},{n:'DRAGÃO LENDÁRIO',c:'#ff4a2a',min:23000,rw:600},{n:'DIVINDADE',c:'#fff4c0',min:35000,rw:1000},
  /* v250: 3 ranks acima da Divindade */
  {n:'DIVINDADE SUPREMA',c:'#ffd86b',min:50000,rw:1500},{n:'DIVINDADE CELESTIAL',c:'#6fc8ff',min:70000,rw:2000},{n:'DEUS CELESTIAL',c:'#e0a0ff',min:100000,rw:3000}];
const RKTOP=RKR.length-1;
/* escala do Boss por nível (100% = atributos originais) */
const RKLVS=[{v:100,d:100,s:100},{v:115,d:110,s:105},{v:135,d:120,s:110},{v:160,d:135,s:115},{v:190,d:150,s:120},{v:225,d:165,s:125},{v:265,d:180,s:130},{v:320,d:200,s:135},{v:380,d:220,s:140},{v:450,d:240,s:145},{v:540,d:265,s:150}];
const RKPAS=[['Boss normal, sem passivas especiais','IA básica: ataques e bloqueios simples'],['10% de chance de bloquear um ataque','IA usa combos básicos'],['15% de chance de esquivar de um ataque','Contra-ataques simples'],
  ['Regenera 3% da vida máxima uma vez ao chegar a 40%','Combos mais longos'],['Ao chegar a 50% da vida: +15% de dano por 8 s','IA mais agressiva'],['Barreira que absorve 10% da vida máxima (1 vez por luta)','Ataques especiais com mais frequência'],
  ['Ao chegar a 30%: MODO FURIOSO, +15% de velocidade por 10 s','Esquivas e contra-ataques avançados'],['Ao chegar a 25%: FASE SUPREMA — barreira de 15% e +20% de dano por 12 s','Usa os melhores combos e especiais'],
  ['Poder SUPREMO: todas as passivas acima com mais vida, dano e velocidade','IA suprema: combos e especiais em sequência'],['Poder CELESTIAL: ainda mais vida, dano e velocidade','IA celestial: quase não dá brecha'],['Poder de um DEUS: o Boss mais forte do jogo','IA divina: o melhor de tudo']];
/* configuração reutilizável de bosses (para adicionar outros no futuro) */
const RKBOSS=[{id:'broly',n:'BROLY',sub:'O Super Saiyajin Lendário',ph:[[2,3],[2,4],[3,5],[3,6],[4,8],[5,10],[6,12],[7,14],[8,16],[9,18],[10,20]],b1:{dm:.65,df:1.2,sp:.92},b2:{dm:.8,df:1.05,sp:1},c:'#5cff4a'},
  /* v243: Yuta do EVENTO — mais forte que o Broly em cada nível (no Despertar ele já ganha velocidade x3 e dano +60% do próprio personagem) */
  {id:'yuta',n:'YUTA',sub:'Feiticeiro de Jujutsu',ph:[[3,4],[3,5],[4,6],[4,7],[5,9],[6,11],[7,13],[8,15],[9,17],[10,19],[11,21]],b1:{dm:.78,df:1.12,sp:.96},b2:{dm:.72,df:1,sp:.62},c:'#b57bff'}];
/* v243: boss atual (Broly ou Yuta do evento) */
let RKBID='broly';const rkBoss=()=>RKBOSS.find(b=>b.id===RKBID)||RKBOSS[0],rkBP=()=>RKBID==='yuta'?'Y':'L';
const rkPhB=lv=>rkBoss().ph[Math.max(0,Math.min(RKTOP,lv))];
/* IA por nível (react = tempo de reação, agg = agressividade, blk = defesa, combo = continuar combos) */
const RKAI=[{react:24,agg:.42,blk:.18,combo:.35,idle:24},{react:18,agg:.52,blk:.3,combo:.5,idle:16},{react:13,agg:.62,blk:.45,combo:.66,idle:11},{react:8,agg:.77,blk:.62,combo:.86,idle:6},
  {react:6,agg:.86,blk:.68,combo:.9,idle:4},{react:5,agg:.9,blk:.74,combo:.94,idle:3},{react:4,agg:.94,blk:.82,combo:.97,idle:2},{react:3,agg:.97,blk:.86,combo:1,idle:1}];
RKR.forEach((R,i)=>{TWTIT['rk'+i]={n:R.n,i:'',c:R.c,d:'Chegar ao rank '+R.n+' no Modo Ranqueado',rk:i}});
const rkG=(k,d)=>twLS.g('rk_'+k,d),rkS=(k,v)=>{twLS.s('rk_'+k,v);if(k==='rp')pfMaxUp(v)};
const RK_MIT=['naruto','madara','garou'],RK_LEG=['goku','aokiji','zoro','broly','vegeta','gogeta','gojo','luffy','rengoku'],RK_EPI=['aylla','zedry','zaykon','qingqing'];
const rkRar=id=>id==='yuta'||RK_MIT.includes(id)?'mit':RK_LEG.includes(id)?'lend':'epica';
/* vídeo da ULTIMATE de cada personagem MÍTICO (aparece quando ganha no gacha) */
const RKUV={naruto:()=>NRU,madara:()=>MDU,garou:()=>GRU,yuta:()=>YTU};
function rkInit(){if(!rkG('ini',0)){rkS('ini',1);rkS('gem',100);rkS('tic',1);rkS('red',0);rkS('own',['goku']);rkS('sel','goku');rkS('rp',0);rkS('st',{})}
  if(!rkG('xpv2',0)){const old=rkG('rp',0),oi=[0,100,250,450,700,1000,1400,1900].reduce((a,m,i)=>old>=m?i:a,0);rkS('rp',RKXP[oi]);rkS('xpv2',1)}
  const own=rkG('own',['goku']);if(!own.includes('goku')){own.push('goku');rkS('own',own)}if(!own.includes(rkG('sel','goku')))rkS('sel','goku')}
const rkRank=rp=>{let i=0;for(let k=0;k<RKR.length;k++)if(rp>=RKR[k].min)i=k;return i};
const rkLvl=()=>rkRank(rkG('rp',0));
const rkAdd=(k,n)=>{rkS(k,Math.max(0,(rkG(k,0)|0)+n));if(n>0&&(k==='gem'||k==='red'))pfFarm(k==='red'?n*3:n)};
const rkSt=()=>rkG('st',{}),rkStAdd=(k,n,mx)=>{const S=rkSt();S[k]=mx?Math.max(S[k]||0,n):(S[k]||0)+n;rkS('st',S)};
const rkFmtN=n=>String(n|0).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
function rkToast(t,c){if(showScreen.cur==='tower'){twToast(t,c);return}const T=$('rkToast');if(!T)return;T.textContent=t;T.style.color=c||'#ffd84a';T.classList.remove('on');void T.offsetWidth;T.classList.add('on')}
function rkFit(){const el=document.querySelector('#rkWrap .rkA');if(!el)return;if(el.dataset.full){el.style.width=innerWidth+'px';el.style.height=innerHeight+'px';el.style.fontSize=Math.min(innerWidth/100,innerHeight*1.7757/100)+'px';const M=$('rkModal');if(M)M.style.fontSize=Math.min(innerWidth/100,innerHeight*1.7757/100)+'px';return}const aw=+el.dataset.w||RKW,ah=+el.dataset.h||RKH,q=(innerWidth/innerHeight)/(aw/ah),W=q>.9&&q<1.12?Math.max(innerWidth,innerHeight*aw/ah):Math.min(innerWidth,innerHeight*aw/ah);el.style.width=W+'px';el.style.height=(W*ah/aw)+'px';el.style.fontSize=(W/100)+'px';
  const M=$('rkModal');if(M)M.style.fontSize=Math.min(innerWidth/100,innerHeight*1.7757/100)+'px'}
addEventListener('resize',rkFit);
const RKMS=()=>showScreen.cur==='tower'?'#twModal ':'#rkModal ',rkHost=()=>showScreen.cur==='tower'?($('twBox')||$('tower')):$('ranked');
function rkModal(h){if(showScreen.cur==='tower'){twModal(h);return}const M=$('rkModal');if(!M)return;if(h==null){M.hidden=true;M.innerHTML='';return}M.innerHTML=h;M.hidden=false;rkFit()}
/* emblema do rank com brilho animado */
function rkEmb(i,cls){const R=RKR[i];return `<div class="rkEmb ${cls||''}" style="--c:${R.c}"><i class="ry"></i><i class="gl"></i><img src="${RQA.rank[i]}" alt=""><i class="sh"></i></div>`}
function rkCurHTML(){return `<div class="rkCur"><span><img src="${RQA.coin[0]}" alt="">${rkFmtN(rkG('gem',0))}</span><span><img src="${RQA.coin[2]}" alt="">${rkFmtN(rkG('tic',0))}</span><span><img src="${RQA.coin[1]}" alt="">${rkFmtN(rkG('red',0))}</span></div>`}
const RKLOCK='<span class="rkLk"><svg viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="4.5" y="10" width="15" height="11" rx="2" fill="currentColor"/></svg>EM BREVE</span>';
function rkSfx(k){try{SFX[k]&&SFX[k]()}catch(e){}}
function rkOpen(v){if(v==='pf'){PFO=null;PFRET=null}RKSEL=null;rkInit();rkMusPlay();setTimeout(rkDiaAuto,1200);audioInit();try{fsTry()}catch(e){}showScreen('ranked');rkView(v||'menu')}
let RKV='menu';
const RKD={ev:[1672,941],bp:[1774,887],mn:[1672,941],ps:[1672,941],rb:[1672,941],lvl:[1847,851],pf:[1672,941],hs:[1671,941]};const rkB2=(x0,y0,x1,y1)=>`left:${x0/16.72}%;top:${y0/9.41}%;width:${(x1-x0)/16.72}%;height:${(y1-y0)/9.41}%`;
function rkView(v){RKV=v;const W=$('rkWrap');if(!W)return;clearInterval(rkView.iv);rkModal(null);
  const H={menu:rkMenuH,boss:rkBossH,gacha:rkGachaH,shop:rkShopH,lib:rkLibH,rb:rkRbH,pf:pfH,hs:hsH,lvl:lvH,yb:ysLobbyH,yrb:ysStartH,ps:psH,mn:mnH,bp:bpH,ev:evH}[v]();const dm=RKD[v]||[RKW,RKH];W.innerHTML=`<div class="rkA rk_${v}" data-w="${dm[0]}" data-h="${dm[1]}"${['pf','hs','boss','rb','yb','yrb','ps','mn','bp','ev'].includes(v)?' data-full="1"':''} style="background-image:url(${RQA[{menu:'menu_ranqueado',boss:'modo_boss',gacha:(RKBAN==='mit'?'gacha_yt':'gacha'),shop:'loja_gemas',lib:(RKL.tab==='chr'?'bib_pf':'biblioteca'),rb:'ranqueada_boss',pf:'perfil',hs:'historico',lvl:'lv_ed',yb:'boss_yt',yrb:(YS.tab==='rank'?'ys_rank':'ys_farm'),ps:'passiva',mn:'mercado',bp:'passe',ev:'abas_ev'}[v]]})">${H}${rkEvTxt()}<div id="rkToast"></div><button class="rkMusB" data-a="music" title="Música">🎵</button><button class="rkCodB" data-a="code">🎟️ CÓDIGO</button><button class="rkAcB" data-a="conta" title="Conta">👤</button></div>`;
  rkFit();W.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)});({boss:rkBossOn,yb:rkBossOn,gacha:rkGachaOn,lib:rkLibOn,pf:pfOn,hs:hsOn,lvl:lvOn,ps:psOn,mn:mnOn,bp:bpOn,ev:evOn,yrb:()=>{clearInterval(rkView.iv);if(!RKSRV)rkSrvLoad()}}[v]||(()=>{}))()}
function rkLocked(){rkSfx('clang');rkToast('🔒 Em breve!','#cfd6ea')}
function rkAct(a,b){rkSfx('whoosh');
  switch(a){case 'evMenu':return evOpen();case 'bpMenu':return rkView('bp');case 'psMenu':PSRET='menu';return rkView('ps');case 'mnMenu':return mnOpen();case 'back':if(RKV==='ps')return rkView(PSRET||'boss');if(RKV==='mn')return rkView('menu');if(RKV==='lvl')return rkView('lib');if(RKV==='yrb')return rkView('yb');if(RKV==='yb')return rkView('menu');if(RKV==='pf'||RKV==='hs'){if(PFO||PFRET)return pfBack();return showScreen('title')}return rkView(RKV==='shop'?'gacha':RKV==='rb'?'boss':'menu');case 'pf':return rkView('pf');case 'hs':return rkView('hs');case 'pfFoto':return PFO?pfAdmFoto():pfFotoM();case 'pfTit':return PFO?0:pfTitM();case 'pfPick':return PFO?0:pfPick();case 'pfRadar':return pfRadarInfo();case 'pfVit':if(PFO){const e=(PFO.vit||[])[+b.dataset.i];if(e)rkToast(rkItNm(e)+': '+rkItEf(e),rkItC(e));return}return pfVitPick(+b.dataset.i);case 'hsInfo':return hsInfo(b.dataset.k);case 'home':return showScreen('title');case 'menuBack':return showScreen('title');
    case 'boss':return rkView(RKBID==='yuta'&&ysOn()?'yb':(RKBID='broly','boss'));case 'gacha':return rkView('gacha');case 'shop':return rkView('shop');case 'lib':return rkView('lib');case 'lock':return rkLocked();
    case 'ranking':return rkRanking();case 'rewards':return rkRewards();case 'ach':return rkAch();case 'pos':return rkPos();
    case 'start':if(!RKSRV)rkSrvLoad();return rkView(RKBID==='yuta'?'yrb':'rb');case 'bsel':if(b.dataset.b==='yuta'&&!ysOn())return rkToast('⏳ O evento do Yuta acabou','#cfd6ea');RKBID=b.dataset.b;RKYD=null;RKSRV=null;try{localStorage.setItem('rk_bsel',RKBID)}catch(e){}return rkView(RKBID==='yuta'?'yb':'boss');case 'ytab':YS.tab=b.dataset.t;return rkView('yrb');case 'ydif':YS.d=+b.dataset.i;return rkView('yrb');case 'yfight':return ysFight();case 'equip':return rkEquip();case 'music':return rkMusic();case 'code':return rkCode();case 'torre':return rkTorre();case 'conta':return acOpen();case 'fight':RKYD=null;return rkBossStart();case 'lvp':return rkRbSel(-1);case 'lvn':return rkRbSel(1);case 'lvc':return rkRbSel(0,+b.dataset.i);case 'sel':return rkView('lib');case 'hist':return rkHist();case 'taxas':return rkTaxas();case 'pool':return rkTaxas();
    case 'sum1':return rkSummon(1);case 'sum10':return rkSummon(10);case 'chat':return rkChatSend();
    case 'buy':return rkBuy(+b.dataset.i);case 'tab':return rkLibTab(b.dataset.t);case 'up':return rkLibPage(-1);case 'down':return rkLibPage(1);case 'filt':return rkLibFilt();case 'libUse':return rkLibUse();
    case 'boxinfo':return rkToast(b.dataset.t,'#bfe8ff');
    case 'ban':RKBAN=b.dataset.b;try{localStorage.setItem('rk_ban',RKBAN)}catch(e){}return rkView('gacha');case 'evo':return lvOpen(RKL.cur&&RKL.cur.id);case 'lvUp':return lvUp();case 'lvNode':return lvNode(+b.dataset.r,+b.dataset.c);case 'lvInfo':return lvInfo()}}
/* ---------------- MENU DO RANQUEADO ---------------- */
function rkMenuH(){const rp=rkG('rp',0),ri=rkRank(rp);
  return `<button class="hs" data-a="menuBack" style="${rkB(5,15,110,95)}"></button>
  <button class="hs" data-a="boss" style="${rkB(15,130,640,250)}"><span class="shine"></span></button>
  <button class="hs" data-a="torre" style="${rkB(15,270,610,380)}"><span class="shine"></span></button>
  <button class="hs lk" data-a="lock" style="${rkB(15,405,610,505)}">${RKLOCK}</button>
  <button class="hs" data-a="gacha" style="${rkB(15,530,610,635)}"><span class="shine"></span></button>
  <button class="hs rd" data-a="psMenu" style="${rkB(1592,92,1718,232)}"></button><button class="hs rd evMb${evAny()?' on':''}" data-a="evMenu" style="${rkB(1690,282,1840,410)}">${evAny()?'<i class="dot"></i>':''}</button><button class="hs rd" data-a="bpMenu" style="${rkB(1682,420,1842,546)}">${bpPend()?'<i class="dot"></i>':''}</button><button class="hs rd" data-a="mnMenu" style="${rkB(1720,92,1846,246)}">${mnBadge()?'<i class="dot"></i>':''}</button>
  <button class="hs" data-a="ranking" style="${rkB(185,690,470,800)}"></button><button class="hs" data-a="rewards" style="${rkB(480,690,760,800)}">${rkRwPend()?'<i class="dot"></i>':''}</button>
  <button class="hs" data-a="ach" style="${rkB(770,690,1040,800)}">${rkAchPend()?'<i class="dot"></i>':''}</button><button class="hs" data-a="lib" style="${rkB(1050,690,1335,800)}"></button><button class="hs" data-a="pos" style="${rkB(1345,690,1645,800)}"></button>
  <div class="rkTop">${rkEmb(ri,'sm')}<div><b style="color:${RKR[ri].c}">${RKR[ri].n}</b><small>${rkFmtN(rp)} XP · Boss Nv.${ri+1}</small></div>${rkCurHTML()}</div>`}
/* ---------------- MODO BOSS ---------------- */
function rkBossH(){const rp=rkG('rp',0),ri=rkRank(rp),sel=rkG('sel','goku'),eqI=TWIMG.esp[3];
  return `<button class="hs" data-a="back" style="${rkB(25,25,135,100)}"></button>
  <button class="hs on" data-a="boxinfo" data-t="Broly nível ${ri+1}: ${rkPhB(ri)[0]} barras · depois se transforma com ${rkPhB(ri)[1]} barras!" style="${rkB(10,200,445,300)}"></button>
  ${ysSlotOld()}${[[440,530],[555,650]].map(([a,b])=>`<button class="hs" data-a="lock" style="${rkB(10,a,415,b)}"></button>`).join('')}
  <div class="rkBox" style="${rkB(478,678,588,785)}" data-a="boxinfo" data-t="💎 Geminhas: 5 a 15 por vitória"><img src="${RQA.coin[0]}" alt=""><b>5-15</b></div>
  <div class="rkBox" style="${rkB(603,678,713,785)}" data-a="boxinfo" data-t="🔴 Moeda Vermelha: 5 a 10 por vitória (mais jogando bem) · derrota: até 2"><img src="${RQA.coin[1]}" alt=""><b>5-10</b></div>
  <div class="rkBox" style="${rkB(730,678,840,785)}" data-a="boxinfo" data-t="🎟️ Ticket de giro: difícil (melhor no baú lendário)"><img src="${RQA.coin[2]}" alt=""><b>RARO</b></div>
  <div class="rkBox" style="${rkB(858,678,968,785)}" data-a="boxinfo" data-t="✦ Drops raros: Bandana, Botas Saiyajin, Semente dos Deuses (lendários), Adaga Kamish e Gunbai do Madara (míticos) · garantido em ${25-rkG('bpity',0)} vitórias"><img class="cyc" src="${RQA.sp.kamish}" alt=""><b>✦ ${25-rkG('bpity',0)}</b></div>
  <div class="rkBan" style="${rkB(1612,52,1782,222)}">${rkEmb(ri,'ban')}</div><div class="rkBanN" style="${rkB(1590,225,1805,262)};color:${RKR[ri].c}">${RKR[ri].n}</div>
  <div class="rkOn" style="${rkB(1520,540,1728,572)}"><i></i><span id="rkOnN">...</span> Online</div>
  <div class="rkChL" id="rkChL" style="${rkB(1112,578,1728,654)}"><p class="twH">Carregando...</p></div>
  <input class="rkChI" id="rkChI" maxlength="140" placeholder="Digite uma mensagem..." autocomplete="off" style="${rkB(1182,661,1660,700)}">
  <button class="hs" data-a="chat" style="${rkB(1672,660,1722,702)}"></button>
  <button class="rkEqB" data-a="equip" style="${rkB(985,632,1095,716)}"><i>🎒</i><b>EQUIPAR</b></button>
  <button class="rkSel" data-a="sel" style="${rkB(985,722,1175,830)}"><img src="${IMG[sel]?IMG[sel].src:''}" alt=""><span><small>LUTAR COM</small><b>${CH[sel]?CH[sel].name:''}</b><em>trocar ›</em></span></button>
  <button class="hs" data-a="start" style="${rkB(1185,735,1635,825)}"><span class="shine"></span></button>
  ${rkCurHTML().replace('rkCur','rkCur bt')}`}
function rkBossOn(){rkSrvLoad();const I=$('rkChI');if(I)I.onkeydown=e=>{if(e.key==='Enter')rkChatSend()};rkChatLoad();rkOnline();let n=0;rkView.iv=setInterval(()=>{if((RKV!=='boss'&&RKV!=='yb')||showScreen.cur!=='ranked'){clearInterval(rkView.iv);return}n++;rkChatLoad();if(n%4===0)rkOnline()},30000)}
let RKSEL=null;
function rkRbH(){const xp=rkG('rp',0),ri=rkRank(xp),lv=RKSEL==null?ri:RKSEL,B=RKBOSS[0],L=RKLVS[lv],nx=Math.min(RKTOP,ri+1),prog=ri>=RKTOP?100:Math.round(100*(xp-RKXP[ri])/(RKXP[ri+1]-RKXP[ri]));
  const cells=[[100,500,270,685],[300,505,453,685],[490,505,642,685],[682,505,835,685],[872,505,1025,685],[1065,505,1218,685],[1256,505,1408,685],[1447,505,1600,685]];
  const pas=[];for(let i=1;i<=lv;i++)pas.push(RKPAS[i][0]);
  return `<button class="hs" data-a="back" style="${rkB2(0,0,135,100)}"></button>
  <div class="rbCov" style="${rkB2(150,340,330,420)}"><b>${lv+1}<small>/${RKTOP+1}</small></b></div>
  <button class="hs" data-a="lvp" style="${rkB2(65,340,120,415)}"></button><button class="hs" data-a="lvn" style="${rkB2(335,340,392,415)}"></button>
  <div class="rbBoss" style="${rkB2(500,60,1020,470)}"><img src="${fullSrc(B.id)}" alt=""><b>${B.n}</b></div>
  <div class="rbEmb" style="${rkB2(1103,92,1212,202)}">${rkEmb(ri,'ban')}</div>
  <div class="rbCov rbRk" style="${rkB2(1225,118,1462,180)};color:${RKR[ri].c}">${RKR[ri].n}</div>
  <div class="rbCov rbXp" style="${rkB2(1190,215,1395,248)}">${rkFmtN(xp)} / ${ri>=RKTOP?'∞':rkFmtN(RKXP[ri+1])} XP</div>
  <div class="rbBar" style="${rkB2(1114,252,1455,267)}"><s style="width:${prog}%;background:${RKR[ri].c}"></s></div>
  <div class="rbCov rbW" style="${rkB2(1528,140,1632,178)}">+${RKXW[ri]*(rkEvX()?rkEvX()[2]:1)}</div><div class="rbCov rbL" style="${rkB2(1540,226,1632,264)}">-${RKXL[ri]}</div>
  <div class="rbPas" style="${rkB2(1122,330,1645,452)}"><h5>PASSIVAS DO BOSS · NÍVEL ${lv+1}</h5>${pas.length?pas.map(p=>`<span>✦ ${p}</span>`).join(''):'<span>Nenhuma passiva especial</span>'}</div>
  ${cells.map((c,j)=>{const s0=Math.max(0,lv-7),i=j+s0;return `<button class="rbCell ${i===lv?'sel':''} ${i===ri?'cur':''} ${i>ri?'lock':''}${s0?' ov':''}" data-a="lvc" data-i="${i}" style="${rkB2(...c)}">${s0?`<span class="rbO">${rkEmb(i,'xs')}<em>Nível ${i+1}</em></span>`:''}${i>ri?'<i>🔒</i>':i<ri?'<i class="ok farm">🌾<small>FARM</small></i>':'<i class="now">ATUAL</i>'}</button>`}).join('')}${lv<ri?`<div class="rbFarm" style="${rkB2(1122,458,1645,498)}">🌾 MODO FARM · NÍVEL ${lv+1}</div>`:''}
  <div class="rbCov rbLvT" style="${rkB2(62,727,232,762)}">Nível ${lv+1}</div>
  <div class="rbDesc" style="${rkB2(62,768,550,895)}"><span>❤️ ${rkPhB(lv)[0]} barras → transformado ${rkPhB(lv)[1]} · resistência ${L.v}% · ⚔️ Dano ${L.d}% · 💨 Velocidade ${L.s}%</span><span>🧠 ${RKPAS[lv][1]}</span>${lv<ri?'':`<span>⭐ Rank ${RKR[lv].n} · vitória +${RKXW[lv]} XP · derrota −${RKXL[lv]} XP</span>`}${lv<ri?'':`<span class="rec">🏆 Recorde do servidor: ${RKSRV?(RKSRV[lv]?twFmt(RKSRV[lv].tt)+' ('+twEsc(RKSRV[lv].nome)+')':'ninguém ainda!'):'carregando...'} · 🏅 Seu: ${rkMyRec(lv)?twFmt(rkMyRec(lv)):'—'}</span><span class="rec2">Bater recorde: servidor +${RKXB.srv} XP · seu +${RKXB.me} XP · dano diminui a derrota</span>`}${lv>ri?`<em>🔒 Suba de rank para chegar neste nível (seu nível é ${ri+1})</em>`:lv<ri?`<em class="farm">🌾 FARM: sem XP de rank · 💎🔴 normais · resto menor</em>`:''}</div>
  <div class="rbNx" style="${rkB2(632,785,716,868)}">${ri<RKTOP?rkEmb(nx,'ban'):''}</div><div class="rbCov rbNxT" style="${rkB2(728,790,880,860)}">${ri<RKTOP?`<b style="color:${RKR[nx].c}">${RKR[nx].n}</b><small>(Nível ${nx+1} · ${rkFmtN(RKXP[nx])} XP)</small>`:'<b style="color:#fff4c0">RANK MÁXIMO</b>'}</div>
  <button class="rkEqB wide" data-a="equip" style="${rkB2(1235,694,1600,750)}"><i>🎒</i><b>EQUIPAMENTOS</b></button>
  <button class="hs" data-a="fight" style="${rkB2(1185,758,1645,872)}"><span class="shine"></span></button>`}
function rkRbSel(d,i){const ri=rkLvl();let v=RKSEL==null?ri:RKSEL;v=i!=null?i:Math.max(0,Math.min(RKTOP,v+d));RKSEL=v;rkView('rb')}
/* ---------- EQUIPAR: personagem no meio com os espaços equipados em volta + itens da mochila ---------- */
const RKSLOT=[['esp','🗡️','ESPADA'],['cap','⛑️','CAPACETE'],['anel','💍','ANEL'],['arm','🛡️','ARMADURA'],['bot','🥾','BOTAS'],['poc','🧪','POÇÃO']];
/* pilhas: itens iguais ocupam 1 espaço (até 99 por espaço) */
const twStKey=x=>x.k==='poc'?'p|'+(x.pk||'')+'|'+x.r+'|'+x.v:[x.t,x.r,x.v,x.crit||0,x.dmg||0,x.vel||0,x.nm||'',x.ps?x.ps.r+x.ps.i:''].join('|');
function twStacks(){const M=new Map();for(const x of twBagItems()){const k=twStKey(x);if(!M.has(k))M.set(k,[]);M.get(k).push(x)}const out=[];for(const [k,L] of M)for(let i=0;i<L.length;i+=99){const g=L.slice(i,i+99);out.push(Object.assign({},g[0],{key:k+'#'+i,ids:g.map(y=>y.id),n:g.length}))}return out}
twCap=function(){let S=twStacks(),out=null;while(S.length>TWBAG){const w=S.slice().sort((a,b)=>(a.ev?99:0)+a.v-(b.ev?99:0)-b.v)[0],ids=new Set(w.ids);if(w.k==='poc')twLS.s('tw_poc',twPocs().filter(x=>!ids.has(x.id)));else twLS.s('tw_inv',twInv().filter(x=>!ids.has(x.id)));out=w;S=twStacks()}return out};
twBag=function(){rkEquip()};
const rkItNm=x=>x.nm||(x.t==='poc'?(x.pk==='cura'?'POÇÃO DE CURA':x.pk==='drop'?'POÇÃO DE DROP':'POÇÃO'):x.t==='anel'?'ANEL':(TWEQ.find(E=>E.k===x.t)||{}).n||''),rkItIc=x=>x.img||(x.t==='poc'?(x.pk?RQA[x.pk==='cura'?'pcu':'pdr'][rkPkI(x.r)]:TWIMG.poc[Math.max(0,TWRK.indexOf(x.r))]):x.t==='anel'?RQA.anel[rkPkI(x.r)]:twIco(x.t,x.r)),rkItC=x=>x.r==='obs'?'#c46bff':rkHi(x.r)?'#e2b6ff':(TWEQR.find(q=>q.k===x.r)||TWEQR[0]).c;
const rkHi=r=>r==='sec'||r==='obs',rkLock=x=>!!x&&x.r==='obs',rkYC=x=>(rkIsY(x)?' ysec'+(x.r==='obs'?' yobs':''):'')+psCls(x);
const rkIsY=x=>!!x&&(x.ysec||(x.yt&&rkHi(x.r))),rkItV=x=>Math.max(x.v||0,x.def||0,x.crit||0,x.dmg||0,x.st||0,x.fdmg||0,x.drop||0);
const rkItEf=x=>rkItEf0(x)+(x&&x.ps&&psDef(x.ps)?' · ✦ PASSIVA '+psRN(x.ps.r)+': '+psDef(x.ps).n+' ('+psFx(psDef(x.ps))+')':'');const rkItEf0=x=>x.t==='poc'&&x.pk?rkPkTxt(x):x.yt||x.t==='anel'?rkSpTxt(x):x.uniq?'✦ ITEM ÚNICO ✦ '+({esp:'Ataque',arm:'Defesa',bot:'Velocidade',cap:'Transformação'}[x.t]||'Bônus')+' +'+x.v+'%'+(x.dmg?' · Dano +'+x.dmg+'%':'')+(x.crit?' · Crítico +'+x.crit+'%':'')+(x.st?' · Sorte +'+x.st+'%':'')+(x.vel?' · Velocidade +'+x.vel+'%':'')+' (permanente)':x.img&&(x.crit||x.dmg)?rkSpTxt(x):x.t==='cap'?'Transformação +'+x.v+'% mais rápida · Crítico +'+(x.crit||0)+'%':x.vel?'Ataque +'+x.v+'% · Velocidade +'+x.vel+'%':x.t==='poc'?twPoTxt(x.r)+' (uso único, próxima luta)':({esp:'Ataque',arm:'Defesa',bot:'Velocidade'}[x.t]||'Bônus')+' +'+x.v+'%';
function rkEquip(f,sk){f=f||'all';const sel=showScreen.cur==='tower'&&TW.pick?TW.pick:rkG('sel','goku'),I=twInv(),Q=twEqp(),on=twPocOn(),SA=twStacks(),L=SA.filter(x=>f==='all'||x.t===f).sort((a,b)=>(TWRK.indexOf(b.r)-TWRK.indexOf(a.r))||(b.v-a.v)||(a.t>b.t?1:-1)),X=sk?SA.find(x=>x.key===sk):null;
  const slot=([k,i,n])=>{const x=k==='poc'?on&&Object.assign({t:'poc'},on):I.find(y=>y.id===Q[k]);return `<button class="eqS ${x?'on':''}${x&&x.uniq?' uniq':''}${rkYC(x)}" data-s="${k}" style="--c:${x?rkItC(x):'#556'}">${x?`<img src="${rkItIc(x)}" alt=""><b>+${rkItV(x)}%</b>`:`<i>${i}</i>`}<span>${x?rkItNm(x):n}</span></button>`};
  const tot=`⚔️ +${twEqB('dano')}% · 🛡️ +${twEqB('vida')}% · 💨 +${twEqB('vel')}% · 💥 +${Math.round(eqCrit())}% · ⚡ +${twEqB('trf')}%${eqFdmg()?' · 🔥 +'+Math.round(eqFdmg())+'%':''} · <b class="eqGr">🍀 Sorte +${rkEqSt()} · 🎁 Drop +${Math.round(eqDrop())}%</b>${on?' · 🧪 poção ativa':''}${rkG('pk_cura',null)?' · <b class="eqGr">💚 Cura '+rkG('pk_cura').v+'% pronta</b>':''}${rkG('pk_drop',null)?' · <b class="eqGr">🎁 Poção de drop +'+rkG('pk_drop').v+'% pronta</b>':''}`;
  const pr=x=>TWSELL[x.r]||100;
  const det=X?`<div class="eqD${X.uniq?' uniq':''}${rkYC(X)}" style="--c:${rkItC(X)}"><img src="${rkItIc(X)}" alt=""><div><span style="color:${rkItC(X)}">${X.uniq?'✦ ÚNICA ✦':(TWEQR.find(q=>q.k===X.r)||TWEQR[0]).n}${X.n>1?' · x'+X.n:''}</span><b>${rkItNm(X)} +${rkItV(X)}%</b><em>${rkItEf(X)}</em></div><div class="eqDb">${X.k==='poc'?`<button class="btn main" data-d="beber" ${(X.pk?rkG('pk_'+X.pk,null):on)?'disabled':''}>${(X.pk?rkG('pk_'+X.pk,null):on)?'JÁ TEM UMA ATIVA':'🧪 BEBER'}</button><button class="btn" data-d="del">DESCARTAR 1</button>`:`<button class="btn main" data-d="eq">EQUIPAR</button>${X.uniq?'<em class="eqUq">item único · não pode vender</em>':''}<button class="btn sell" data-d="sell" ${X.uniq||rkLock(X)?'hidden':''}>VENDER 1 · 🪙 ${pr(X)}</button>${X.n>1?`<button class="btn sell" data-d="sellAll">VENDER ${X.n} · 🪙 ${pr(X)*X.n}</button>`:''}`}</div></div>`:'<p class="twH eqT">Toque num item para ver e equipar / vender. Itens iguais ficam juntos no mesmo espaço (até 99).</p>';
  rkModal(`<div class="twM rkEq"><h3>🎒 MOCHILA E EQUIPAMENTOS <small>${SA.length}/${TWBAG} espaços · 🪙 ${rkFmtN(twCoins())}</small></h3><div class="eqW"><div class="eqP"><div class="col">${RKSLOT.slice(0,3).map(slot).join('')}</div><div class="chr"><img src="${fullSrc(sel)}" alt=""><b>${CH[sel]?CH[sel].name:''}</b><small>🌱 Semente dos Deuses: ${rkSenzu()}</small></div><div class="col">${RKSLOT.slice(3).map(slot).join('')}</div></div>
    <div class="eqR"><div class="seg twTab">${[['all','TUDO'],['esp','🗡️'],['cap','⛑️'],['anel','💍'],['arm','🛡️'],['bot','🥾'],['poc','🧪']].map(([k,t])=>`<button data-f="${k}" aria-pressed="${f===k}">${t}</button>`).join('')}</div>
    <div class="eqG">${L.length?L.map(x=>`<button class="eqI ${X&&X.key===x.key?'sel':''}${x.uniq?' uniq':''}${rkYC(x)}" data-k="${x.key}" style="--c:${rkItC(x)}"><img src="${rkItIc(x)}" alt=""><b>+${rkItV(x)}%</b>${x.n>1?`<i class="eqN">x${x.n}</i>`:''}<span>${rkItNm(x)}</span></button>`).join(''):'<p class="twH">Nada aqui. Ganhe equipamentos no Boss, na Torre e no Gacha!</p>'}</div>${det}</div></div>
    <p class="twH eqT">${tot} · Toque num espaço equipado para tirar.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  const MS=RKMS(),re=k=>rkEquip(f,k);$('rkMX').onclick=()=>{rkModal(null);if(showScreen.cur==='tower')twRender()};document.querySelectorAll(MS+'.twTab button').forEach(b=>b.onclick=()=>rkEquip(b.dataset.f));
  document.querySelectorAll(MS+'.eqI').forEach(b=>b.onclick=()=>{rkSfx('whoosh');re(b.dataset.k)});
  document.querySelectorAll(MS+'.eqD button[data-d]').forEach(b=>b.onclick=()=>{const d=b.dataset.d,id=X.ids[0];
    if(d==='eq'){const Q=twEqp();if(rkLock(twInv().find(y=>y.id===Q[X.t]))&&!rkLock(X)){rkSfx('clang');rkToast('🌑 Item OBSCURO fica sempre equipado','#c46bff');return}Q[X.t]=id;twLS.s('tw_eqp',Q);TW.capOut=twCap();rkSfx('clang');return re(null)}
    if(d==='beber'&&X.pk){if(rkG('pk_'+X.pk,null))return;twLS.s('tw_poc',twPocs().filter(y=>y.id!==id));rkS('pk_'+X.pk,{r:X.r,v:X.v});rkSfx('powerUp');rkToast(X.pk==='cura'?'💚 POÇÃO DE CURA BEBIDA! Cura '+X.v+'% quando a vida ficar baixa na próxima luta':'🎁 POÇÃO DE DROP BEBIDA! +'+X.v+'% de drop na próxima luta','#7dff9a');return re(null)}
    if(d==='beber'){if(twPocOn())return;twLS.s('tw_poc',twPocs().filter(y=>y.id!==id));twLS.s('tw_pocOn',{id,r:X.r,v:X.v});rkSfx('powerUp');rkToast('🧪 POÇÃO BEBIDA! Vale na próxima luta','#7dff9a');return re(null)}
    if(d==='del'){twLS.s('tw_poc',twPocs().filter(y=>y.id!==id));rkSfx('boom');return re(X.n>1?X.key:null)}
    if(d==='sell'||d==='sellAll'){if(!b.dataset.ok){b.dataset.ok=1;b.textContent='CONFIRMAR? 🪙 '+(d==='sell'?pr(X):pr(X)*X.n);return}const ids=new Set(d==='sell'?[id]:X.ids);twLS.s('tw_inv',twInv().filter(y=>!ids.has(y.id)));twAddCoins(pr(X)*ids.size);rkSfx('powerUp');rkToast('🪙 +'+pr(X)*ids.size+' moedas!','#ffd84a');return re(d==='sell'&&X.n>1?X.key:null)}});
  document.querySelectorAll(MS+'.eqS.on').forEach(b=>b.onclick=()=>{const k=b.dataset.s;if(k==='poc'){const o=twPocOn();if(o){const P=twPocs();P.push(o);twLS.s('tw_poc',P);twLS.s('tw_pocOn',null)}}else{const Q=twEqp();if(rkLock(twInv().find(y=>y.id===Q[k]))){rkSfx('clang');rkToast('🌑 Item OBSCURO fica sempre equipado','#c46bff');return}delete Q[k];twLS.s('tw_eqp',Q);const c=twCap();if(c)rkToast('Mochila cheia: o item mais fraco foi descartado','#ff8080')}rkSfx('whoosh');re(null)})}
/* ---------- MÚSICA do ranqueado: aleatória a cada vez ou escolhida ---------- */
function rkMusPlay(){const v=rkG('mus','auto');if(v==='none'){MCUR=-1;try{MEL.pause()}catch(e){}return}const i=v==='auto'?(Math.random()*MUS.length)|0:Math.min(MUS.length-1,+v);MCUR=i;if(!MEL.src.endsWith(MUS[i][1])){MEL.src=MUS[i][1];try{MEL.currentTime=0}catch(e){}}}
function rkMusic(){const v=rkG('mus','auto');rkModal(`<div class="twM sm"><h3>🎵 MÚSICA DO RANQUEADO</h3><div class="rkMu">${[['auto','🔀 ALEATÓRIA (toda vez uma)'],['none','🔇 SEM MÚSICA']].concat(MUS.map((m,i)=>[String(i),'🎵 '+m[0]])).map(([k,t])=>`<button data-m="${k}" class="${v===k?'on':''}">${t}${MCUR>=0&&String(MCUR)===k&&v!=='none'?' ▶':''}</button>`).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);document.querySelectorAll(RKMS()+'.rkMu button').forEach(b=>b.onclick=()=>{rkS('mus',b.dataset.m);rkMusPlay();rkSfx('whoosh');rkMusic()})}
/* ---------- online: cada jogo aberto avisa o servidor a cada 2 min ---------- */
const rkBk=t=>'p'+Math.floor(t/300000);
function rkPing(){if(document.visibilityState&&document.visibilityState!=='visible')return;const IV=v=>({integerValue:String(v)});
  const f={nome:{stringValue:String(twLS.g('tw_nome','')||'?').slice(0,16)},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},on:{stringValue:rkBk(Date.now())}};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(()=>{})}
setTimeout(rkPing,6000);setInterval(rkPing,300000);
async function rkQ(field,val,lim){const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:field},op:'EQUAL',value:{stringValue:val}}},limit:lim||1000}};
  const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);const j=await r.json(),o=[];
  for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F)continue;const e={_ct:Date.parse(x.document.createTime||'')||0};for(const k in F){const v=F[k];e[k]=v.stringValue!=null?v.stringValue:v.integerValue!=null?+v.integerValue:v.doubleValue}o.push(e)}return o}
async function rkOnline(){try{const t=Date.now(),A=(await rkQ('on',rkBk(t),500)).concat(await rkQ('on',rkBk(t-300000),500));const n=new Set(A.map(e=>e.uid)).size||1;const E=$('rkOnN');if(E)E.textContent=rkFmtN(n)}catch(e){const E=$('rkOnN');if(E)E.textContent='?'}}
/* ---------- chat global ---------- */
async function rkChatLoad(){try{const hs=[0,1,2,3,4,5].map(i=>'h'+(Math.floor(Date.now()/36e5)-i));let L=[];for(const d of hs)L=L.concat(await rkQ('gh',d,100));
    L=L.filter(m=>m.msg).map(m=>({nome:String(m.nome||'?').slice(0,16),tit:m.tit||'',uid:m.uid||'',msg:String(m.msg).slice(0,140),ct:m._ct})).sort((a,b)=>a.ct-b.ct).slice(-60);
    const pend=(rkChatLoad.p||[]).filter(m=>!L.some(y=>y.uid===m.uid&&y.msg===m.msg));L=L.concat(pend);rkChatLoad.L=L;const E=$('rkChL');if(E){const st=E.scrollTop+E.clientHeight>=E.scrollHeight-20;E.innerHTML=twChatHTML(L);if(st||!rkChatLoad.d){E.scrollTop=E.scrollHeight;rkChatLoad.d=1}}}
  catch(e){const E=$('rkChL');if(E&&!(rkChatLoad.L||[]).length)E.innerHTML='<p class="twH err">Sem internet agora.</p>'}}
function rkChatSend(){const I=$('rkChI');if(!I)return;const t=I.value.replace(/[<>]/g,'').trim().slice(0,140);if(!t)return;const nome=twLS.g('tw_nome','');
  if(!nome){rkToast('Escolha seu nome no Modo Torre (✏️ NOME) para usar o chat','#ff8080');return}
  if(Date.now()-(rkChatSend.l||0)<4000){rkToast('Calma! Espere uns segundos','#ff8080');return}rkChatSend.l=Date.now();I.value='';
  const m={nome,tit:twTitOn(),uid:twUid(),msg:t,ct:Date.now(),pend:1};(rkChatLoad.p=rkChatLoad.p||[]).push(m);rkChatLoad.L=(rkChatLoad.L||[]).concat(m);const E=$('rkChL');if(E){E.innerHTML=twChatHTML(rkChatLoad.L);E.scrollTop=E.scrollHeight}
  const IV=v=>({integerValue:String(v)});const f={nome:{stringValue:nome},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},tit:{stringValue:twTitOn()},gchat:{stringValue:twDay(Date.now())},gh:{stringValue:'h'+Math.floor(Date.now()/36e5)},msg:{stringValue:t},v:IV(213)};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(()=>rkToast('Mensagem não enviada (sem internet?)','#ff8080'))}
/* ---------------- LUTA CONTRA O BROLY (7 barras -> transformado 14 barras) ---------------- */
const RKB={fs:null,diff0:1};
/* v242: MODO FARM — lutar num nível ABAIXO do seu rank: sem XP de rank (nem perde), gemas e moeda vermelha normais, o resto dos drops menor */
let RKFL=null;const rkBL=()=>RKFL!=null?RKFL:rkLvl();
function rkBossStart(){rkInit();const sel=rkG('sel','goku');if(!SPR_OK)return;fsTry();RKFL=RKYD!=null?YSDIF[RKYD].lv:RKBID==='broly'&&RKSEL!=null&&RKSEL<rkLvl()?RKSEL:null;G.pick=sel;G.opp=RKBID;G.gmode='boss';RKB.diff0=G.diff;{const lv=rkBL();G.diff=lv<2?1:lv<4?2:3}
  const sk=Object.keys(STG).filter(k=>!STG[k].hid);G.nextStg=sk[(Math.random()*sk.length)|0];try{nv('vMChallenge',.05,1)}catch(e){}
  const PM=prepMatch([G.pick,G.opp],G.nextStg);showVS(()=>PM.then(()=>{vsLoadEnd();startMatch()}),PM)}
function rkApply(){if(G.gmode!=='boss'||!G.p)return;const [p,o]=G.p;p.tdm=(p.tdm||1)*(1+twEqB('dano')/100);p.tsp=(p.tsp||1)*(1+twEqB('vel')/100);p.tdf=(p.tdf||1)/(1+twEqB('vida')/100);{const q=twEqOn();p.tcr=0;for(const k in q)p.tcr+=q[k].crit||0}{const t=twEqB('trf');if(t)p.tsb=1+t/100}{const pon=twPocOn();if(pon){const E=twPoE(pon.r);p.tdm+=E[1]/100;p.tcr=(p.tcr||0)+E[2];p.tsb=(p.tsb||1)+E[0]/100;twLS.s('tw_pocOn',null);setTimeout(()=>{try{txt(p.x,p.y-300,'🧪 POÇÃO: +'+E[1]+'% DANO +'+E[2]+'% CRÍT.','#7dff9a')}catch(e){}},1500)}}const lv=rkBL(),L=RKLVS[lv],B=rkBoss();o.rkL=lv;o.rkB={dm:B.b1.dm*L.d/100,df:B.b1.df*100/L.v,sp:B.b1.sp*L.s/100};o.rkPhB=rkPhB(lv);ysApply(o);o.mhp=o.rkPhB[0]*LAYER;o.hp=o.hpLag=o.mhp;o.tdm=o.rkB.dm;o.tdf=o.rkB.df;o.tsp=o.rkB.sp;o.sb=0;o.rkPh=1;o.rkP={};o.rkSh=0;o.rkHp=o.hp;
  RKB.fs={t:0,t1:0,cmb:0,hp0:p.hp/(p.mhp||MAXHP)}}
function rkBossGo(){if(G.gmode!=='boss'||!G.p)return;if(G.tlim!==0)G.timer=300;const o=G.p[1],P=o.rkPhB||[7,14];banner(RKYD!=null?'EVENTO · FARM':'MODO BOSS',RKBID==='yuta'?'#c58bff':'#ff3030',100,RKYD!=null?'YUTA '+YSDIF[RKYD].n+' · '+P[0]+' BARRAS':rkBoss().n+' NÍVEL '+((o.rkL||0)+1)+' · '+P[0]+' BARRAS')}
function rkTick(){const F=RKB.fs;if(!F||!G.p)return;const o=G.p[1];if(!(G.paused||G.trans||G.ws||G.cine||G.comic))F.t++;const c=G.p[0].combo||0;if(c>F.cmb)F.cmb=c;
  if(o.rkPh===1)o.sb=0;else if(o.rkPh===2&&o.form)o.formT=FORM_T;rkPassTick(o)}
/* passivas do Boss por nível (acumulativas, cada uma 1 vez por luta) */
function rkTot(o){const P=o.rkPhB||rkPhB(o.rkL||0),m1=P[0]*LAYER,m2=P[1]*LAYER;return o.rkPh===1?(Math.max(0,o.hp)+m2)/(m1+m2):Math.max(0,o.hp)/(m1+m2)}
function rkPassTick(o){if(!o.rkB||o.ko)return;const lv=o.rkL||0,P=o.rkP,t=rkTot(o),fr=G.frame,PS=o.rkPS||rkPSlv(lv);ysTick(o,PS,t);
  /* barreira: devolve a vida do dano que ela absorveu */
  if(o.rkSh>0&&o.hp<o.rkHp&&o.rkPh===(o.rkShPh||o.rkPh)){const lost=o.rkHp-o.hp,ab=Math.min(lost,o.rkSh);o.hp+=ab;o.hpLag=Math.max(o.hpLag,o.hp);o.rkSh-=ab;if(G.frame%6===0)ring(o.x,o.y-150,'#7fd8ff',150,10,3);if(o.rkSh<=0){txt(o.x,o.y-300,'BARREIRA QUEBRADA!','#9fe0ff');ring(o.x,o.y-150,'#ffffff',220,18,6)}}
  if(o.rkSh>0&&fr%8===0)ring(o.x,o.y-150,'#7fd8ff',170,16,3);
  if(PS.reg&&!P.reg&&t<=.4){P.reg=1;const add=.03*o.mhp;o.hp=Math.min(o.mhp,o.hp+add);o.hpLag=Math.max(o.hpLag,o.hp);txt(o.x,o.y-300,'REGENEROU!','#7dff9a');ring(o.x,o.y-150,'#7dff9a',200,20,6)}
  if(PS.rage&&!P.rage&&t<=.5){P.rage=1;P.dmgU=fr+8*60;P.dmgK=.15;txt(o.x,o.y-300,'+15% DANO!','#ff8a3a');banner(rkBoss().n+' ENFURECEU','#ff5a2a',70,'+15% DE DANO POR 8 s')}
  if(PS.bar&&!P.bar&&t<=.7){P.bar=1;o.rkSh=.1*o.mhp;o.rkShPh=o.rkPh;txt(o.x,o.y-300,'BARREIRA!','#7fd8ff');ring(o.x,o.y-150,'#7fd8ff',240,24,7)}
  if(PS.fury&&!P.fury&&t<=.3){P.fury=1;P.spU=fr+10*60;P.spK=.15;banner('MODO FURIOSO','#ff2a2a',80,'+15% DE VELOCIDADE POR 10 s')}
  if(PS.sup&&!P.sup&&t<=.25){P.sup=1;o.rkSh=.15*o.mhp;o.rkShPh=o.rkPh;P.dmgU=fr+12*60;P.dmgK=.2;G.flash=10;G.flashCol='#fff2c0';banner('FASE SUPREMA','#ffd84a',110,'BARREIRA 15% · +20% DE DANO POR 12 s');for(const r of [320,200])ring(o.x,o.y-150,'#ffd84a',r,26,8)}
  const dk=P.dmgU>fr?P.dmgK:0,sk=P.spU>fr?P.spK:0;o.tdm=o.rkB.dm*(1+dk);o.tsp=o.rkB.sp*(1+sk);if((dk||sk)&&fr%5===0)addP({x:o.x+rand(-60,60),y:o.y-rand(30,260),vx:0,vy:-rand(1,3),life:20,max:20,c:dk?'#ff4a2a':'#ffd84a',type:'glow',sz:rand(3,6),g:0});o.rkHp=o.hp}
/* bloqueio (nível 2+) e esquiva (nível 3+) com tempo de recarga */
function rkPassHit(a,d,h){if(!d.rkB||d.ko||!d.grounded||G.trans||h.kind==='beam')return;const lv=d.rkL||0,fr=G.frame,P=d.rkP,PS=d.rkPS||rkPSlv(lv);if(d.state==='attack'||d.state==='hit'||d.state==='airhit')return;
  if(PS.dge&&fr>(P.dgCd||0)&&Math.random()<.15){P.dgCd=fr+90;d.inv=14;d.x=clamp(d.x-d.facing*90,40,WW-40);txt(d.x,d.y-280,'ESQUIVOU!','#bfe8ff');for(let i=0;i<10;i++)addP({x:d.x+rand(-40,40),y:d.y-rand(20,240),vx:-d.facing*rand(1,4),vy:0,life:14,max:14,c:'#bfe8ff',type:'glow',sz:rand(3,6),g:0});return false}
  if(PS.blk&&fr>(P.blCd||0)&&Math.random()<.1){P.blCd=fr+60;d.state='blockstun';d.st=0;d.hitstun=8;d.vx=a.facing*2;txt(d.x,d.y-280,'BLOQUEOU!','#9fd8ff');ring(h.px||d.x,h.py||d.y-150,'#9fd8ff',110,12,4);try{SFX.block()}catch(e){}return true}}
/* desistir durante o combate conta como derrota */
function rkQuit(){if(G.gmode!=='boss'||!G.p)return;G.diff=RKB.diff0;if(RKFL!=null){rkStAdd('loss',1);G.gmode='pve';return}const ri=rkLvl(),rp0=rkG('rp',0),rp1=Math.max(0,rp0-RKXL[ri]);rkS('rp',rp1);rkStAdd('loss',1);rkSend({rp:rp1,dmg:0,t1:0,tt:0,won:0});G.gmode='pve'}
function rkPhase2(a,d){d.rkPh=2;if(RKB.fs)RKB.fs.t1=RKB.fs.t;d.ko=false;{const L=RKLVS[d.rkL||0],B=rkBoss();d.rkB={dm:B.b2.dm*(d.ysK||1)*L.d/100,df:B.b2.df*100/L.v,sp:B.b2.sp*L.s/100};d.mhp=(d.rkPhB||rkPhB(d.rkL||0))[1]*LAYER;d.hp=d.hpLag=d.mhp;d.rkHp=d.hp;d.tdm=d.rkB.dm;d.tdf=d.rkB.df;d.tsp=d.rkB.sp}d.state='idle';d.st=0;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;d.move=null;d.hitstun=0;d.inv=60;
  a.vx=-a.facing*10;G.hitstop=Math.max(G.hitstop,20);G.shake=30;G.flash=12;G.flashCol='#d8ffc8';for(const r of [380,250,130])ring(d.x,d.y-150,r===130?'#ffffff':rkBoss().c,r,28,8);
  banner(RKBID==='yuta'?'O YUTA DESPERTOU!':'O BROLY DESPERTOU!',rkBoss().c,120,'2ª FASE · '+(d.rkPhB||[0,14])[1]+' BARRAS');d.sb=SB_COST;try{startTransform(d)}catch(e){d.form=1;d.formT=FORM_T}buzz(200)}
/* EVENTOS de XP (hora de Brasília, UTC-3): [início, fim, multiplicador, nome] */
const RKEVX=[[Date.UTC(2026,10,8,23,0),Date.UTC(2026,10,9,1,0),3,'3x XP'],
  /* v248: EVENTO DE ATUALIZAÇÃO — 10 horas (12:30 até 22:30 de Brasília, 09/11/2026): 2x XP de rank, 2x gemas, 2x sorte */
  [Date.UTC(2026,10,9,15,30),Date.UTC(2026,10,10,1,30),2,'2x XP · 2x GEMAS · 2x SORTE',{gem:2,luck:2}]];
const rkEvX=()=>{const t=Date.now();return RKEVX.find(e=>t>=e[0]&&t<e[1])||null};
const rkEvG=()=>{const e=rkEvX();return (e&&e[4]&&e[4].gem)||1},rkEvL=()=>{const e=rkEvX();return (e&&e[4]&&e[4].luck)||1};
const rkEvTxt=()=>'';const rkEvTxt0=()=>{const e=rkEvX();if(!e)return '';const m=Math.max(0,Math.round((e[1]-Date.now())/60000));return `<div class="rkEvX">🔥 EVENTO <b>${e[3]}</b> NA RANQUEADA! · termina em ${m>=60?Math.floor(m/60)+'h'+String(m%60).padStart(2,'0'):m+' min'}</div>`};
let R_SRV=0;
function rkAfter(w){G.mode='ranked';$('controls').hidden=true;$('pauseBtn').hidden=true;rainSound(0);G.paused=false;G.diff=RKB.diff0;
  const F=RKB.fs||{t:0,t1:0,cmb:0,hp0:1},o=G.p[1],p=G.p[0],won=w===0,secs=Math.round(F.t/60);
  const PB=o.rkPhB||[7,14],dmg=Math.round(o.rkPh===2?PB[0]*LAYER+(PB[1]*LAYER-Math.max(0,o.hp)):(PB[0]*LAYER-Math.max(0,o.hp))),frac=Math.min(1,dmg/((PB[0]+PB[1])*LAYER)),lost=Math.max(0,1-Math.max(0,p.hp)/(p.mhp||MAXHP));
  let red,gem=0,tic=0,eq=null,chest=null,drp,poc=null,sp=null,pk2=null,ring=null;
  if(won){const q=Math.min(1,Math.max(0,(300-secs)/220))*.6+(1-lost)*.4;red=Math.round(5+5*q);gem=5+((Math.random()*11)|0);chest=secs<150&&lost<.4?'lend':secs<220?'epica':'rara';const FM=RKFL!=null&&RKYD==null;if(FM)chest=chest==='lend'?'epica':'rara';
    if(Math.random()<(chest==='lend'?.4:chest==='epica'?.2:.12)*(FM?.5:1)*rkDropF())tic=1;if(Math.random()<(chest==='lend'?.2:.08)*(FM?.5:1)*rkDropF()){const E=TWEQ[(Math.random()*TWEQ.length)|0];eq={E,R:twEqRoll()}}drp=RKXW[rkLvl()];
    if(Math.random()<.3&&!['rara','lend','mit'].includes(chest))poc=twPoRoll();
    /* v250: poção de CURA/DROP e ANEL DE DROP (drop do Boss, fora do baú; o drop aumenta a chance) */
    if(Math.random()<.04*lvLuck()){psAddJn(1);setTimeout(()=>rkToast('💠 JOIA NEGRA!','#c46bff'),1500)}if(Math.random()<(FM?.12:.22)*rkDropF())pk2=rkPoRoll();if(Math.random()<(FM?.04:.07)*rkDropF())ring=rkRingRoll();  /* v240: baú raro/lendário/mítico não dá poção */
    /* drops especiais do boss (bem difíceis) + piedade: garantido em 25 vitórias sem drop especial */
    const bp=rkG('bpity',0)+(FM?0:1),rr=Math.random()*100*(FM?2:1);let sk=null;if(rr<1.5)sk=['kam','gun'][(Math.random()*2)|0];else if(rr<5.5)sk=['band','bots','senzu'][(Math.random()*3)|0];else if(bp>=25)sk=['band','bots','senzu','band','bots','senzu','kam','gun'][(Math.random()*8)|0];
    if(sk){rkS('bpity',0);sp=sk}else rkS('bpity',bp)}
  else{red=frac>.5?2:frac>.2?1:0;gem=0;drp=-RKXL[rkLvl()]}
  const lvB=rkBL(),xb=[];if(won&&RKFL==null){xb.push(['Vitória',drp]);const cb=Math.min(RKXB.cmb,(F.cmb||0)*2);if(cb>0){xb.push(['👊 Combo '+F.cmb,cb]);drp+=cb}
    const me=rkMyRec(lvB),sx=Math.max(1,secs);if(!me||sx<me){xb.push([me?'🏅 SEU RECORDE ('+twFmt(me)+' → '+twFmt(sx)+')':'🏅 1ª vitória neste nível',RKXB.me]);drp+=RKXB.me;const S=rkSt();S[RKBID==='yuta'?'recY':'rec']=Object.assign({},S[RKBID==='yuta'?'recY':'rec'],{[lvB]:sx});rkS('st',S)}
    if(RKSRV){const sv=RKSRV[lvB];if(!sv||sx<sv.tt){xb.push(['🏆 RECORDE DO SERVIDOR!',RKXB.srv]);drp+=RKXB.srv;RKSRV[lvB]={tt:sx,nome:twLS.g('tw_nome','')||'Você'};R_SRV=1}}}
  else{const db=Math.round(RKXL[lvB]*RKXB.dmg*frac);xb.push(['Derrota',drp]);if(db>0){xb.push(['💥 Dano '+Math.round(frac*100)+'%','+'+db]);drp+=db}}
  {const ev=rkEvX();if(ev&&won){const ex=drp*(ev[2]-1);xb.push(['🔥 EVENTO '+ev[3],'+'+ex]);drp+=ex}}
  if(RKFL!=null){xb.length=0;xb.push([RKYD!=null?'🌸 FARM DO EVENTO · '+YSDIF[RKYD].n+' · sem XP de rank':'🌾 MODO FARM · nível '+(RKFL+1)+' · sem XP de rank','0']);drp=0;R_SRV=0}
  gem=Math.round(gem*rkEvG());rkAdd('red',red);rkAdd('gem',gem);rkAdd('tic',tic);if(eq)twAddItem(eq.E,eq.R);if(poc)twAddPoc(poc);if(pk2)twAddPoc(pk2);if(ring)rkAddRing(ring);if(sp){if(sp==='senzu')rkAddSenzu(1);else rkGiveSp(sp)}
  const rp0=rkG('rp',0),r0=rkRank(rp0);let rp1=Math.max(0,rp0+drp);rkS('rp',rp1);const r1=rkRank(rp1);for(let i=0;i<=r1;i++)twGiveTit('rk'+i);
  rkStAdd(won?'wins':'loss',1);pfFight({cmb:F.cmb||0,frac,won});rkStAdd('dmgTot',dmg);rkStAdd('dmgMax',dmg,1);if(F.t1){const S=rkSt();if(!S.t1||F.t1/60<S.t1){S.t1=Math.round(F.t1/60);rkS('st',S)}}if(won){const S=rkSt();if(!S.tt||secs<S.tt){S.tt=secs;rkS('st',S)}if(lost<.25)rkStAdd('clean',1)}
  if(RKFL==null)rkSend({rp:rp1,dmg,t1:F.t1?Math.round(F.t1/60):0,tt:won?secs:0,won:won?1:0});
  {const S=rkSt();if(won){if(RKBID==='broly')S.brW=(S.brW||0)|(1<<rkBL());else if(RKYD!=null)S.ysW=(S.ysW||0)|(1<<RKYD);rkS('st',S)}}
  const R={bn:rkBoss().n,yd:RKYD,farm:RKFL!=null?RKFL+1:0,won,secs,dmg,frac,red,gem,tic,eq,chest,poc,pk2,ring,sp,drp,rp0,rp1,r0,r1,t1:F.t1?Math.round(F.t1/60):0,lost,cmb:F.cmb,xb,srv:R_SRV};R_SRV=0;
  {const fs=RKFL;rkOpen(RKBID==='yuta'?'yb':'boss');if(fs!=null&&RKYD==null)RKSEL=fs}setTimeout(()=>rkResult(R),200)}
/* recordes de tempo por nível do Boss: servidor (RKSRV) e seu (st.rec) */
let RKSRV=null;
async function rkSrvLoad(){try{const lv0=rkLvl(),L=(await rkQ('rkr',rkBP()+lv0,300)).map(e=>({nome:e.nome,tt:e.tt|0,won:1,rp:e.rp|0,lv:lv0})),M={};for(const e of L){if(!e.won||!e.tt)continue;const lv=e.lv!=null?e.lv:rkRank(e.rp||0);if(!M[lv]||e.tt<M[lv].tt)M[lv]={tt:e.tt,nome:e.nome}}RKSRV=M;if(RKV==='rb'&&showScreen.cur==='ranked'&&!$('rkModal').innerHTML)rkView('rb')}catch(e){}}
async function rkLoadRkAll(){const L=await rkQ('rk','1',1000);return L.map(e=>({nome:e.nome,tt:e.tt|0,won:e.won|0,rp:e.rp|0,lv:e.lv!=null&&e.lv!==''?(e.lv|0):null}))}
const rkMyRec=lv=>(rkSt()[RKBID==='yuta'?'recY':'rec']||{})[lv]||0;
function rkSend(x){const n=twLS.g('tw_nome','');if(!n)return;const IV=v=>({integerValue:String(Math.max(0,Math.round(v)))});
  const f={nome:{stringValue:n},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},tit:{stringValue:twTitOn()},rk:{stringValue:'1'},rp:IV(x.rp),lv:IV(x.lv!=null?x.lv:rkLvl()),dmg:IV(x.dmg),...(x.won&&x.tt>0?{rkr:{stringValue:rkBP()+(x.lv!=null?x.lv:rkLvl())},tw:IV(x.tt)}:{}),...(x.t1>0?{t1w:IV(x.t1)}:{}),t1:IV(x.t1),tt:IV(x.tt),won:IV(x.won),char:{stringValue:G.pick||''},v:IV(213)};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(()=>{})}
function rkResult(R){const it=[];it.push(`<span><img src="${RQA.coin[1]}" alt="">+${R.red}</span>`);if(R.gem)it.push(`<span><img src="${RQA.coin[0]}" alt="">+${R.gem}</span>`);if(R.tic)it.push(`<span><img src="${RQA.coin[2]}" alt="">+1 TICKET</span>`);
  if(R.poc)it.push(`<span style="--c:${R.poc.c}"><img src="${TWIMG.poc[TWRK.indexOf(R.poc.k)]}" alt="">POÇÃO ${R.poc.n}</span>`);
  for(const x of [R.pk2&&{t:'poc',pk:R.pk2.pk,r:R.pk2.k,v:R.pk2.v},R.ring&&{t:'anel',r:R.ring,drop:RKANV[rkPkI(R.ring)],v:0}])if(x)it.push(`<span style="--c:${rkItC(x)}"><img src="${rkItIc(x)}" alt="">${x.t==='anel'?'ANEL DE DROP':rkItNm(x)} ${rkRarN(x.r)} +${rkItV(x)}%</span>`);
  if(R.sp){const S=R.sp==='senzu'?{nm:'SEMENTE DOS DEUSES',img:RQA.sp.senzu,r:'lend'}:RKSP[R.sp];it.push(`<span class="spd" style="--c:${TWEQR.find(q=>q.k===S.r).c}"><img src="${S.img}" alt="">✦ ${S.nm}</span>`)}
  if(R.eq)it.push(`<span style="--c:${R.eq.R.c}"><img src="${twIco(R.eq.E.k,R.eq.R.k)}" alt="">${R.eq.E.n} ${R.eq.R.n}</span>`);
  const up=R.r1>R.r0,down=R.r1<R.r0,ri=R.r1,ci=R.chest?TWRK.indexOf(R.chest):0;
  rkModal(`<div class="twM rkRes ${R.won?'gold':''}"><h3>${R.won?'🏆 '+(R.bn||'BROLY')+' DERROTADO!':'💀 '+(R.bn==='YUTA'?'O YUTA':'O BROLY')+' VENCEU'}${R.yd!=null?' <small style="color:#e2b6ff">🌸 EVENTO</small>':R.farm?' <small style="color:#9fff5a">🌾 FARM</small>':''}</h3>
    <p class="twH">⏱ ${twFmt(R.secs)}${R.t1?' · 1ª fase em '+twFmt(R.t1):''} · 💥 ${rkFmtN(R.dmg)} de dano (${Math.round(R.frac*100)}%) · 👊 combo ${R.cmb}</p>
    ${R.won?`<div class="rkChest" id="rkChest" style="--c:${TWEQR[ci].c}"><img class="cf" src="${TWIMG.bf[ci]}" alt=""><img class="ca" src="${TWIMG.ba[ci]}" alt=""><b>TOQUE PARA ABRIR O BAÚ!</b></div><div class="rkItems" id="rkItems" hidden>${it.join('')}</div>`:`<div class="rkItems">${it.join('')}</div>`}
    <div class="rkRp">${rkEmb(ri,'md'+(up?' up':down?' down':''))}<div><b style="color:${RKR[ri].c}">${RKR[ri].n}${up?' ⬆ SUBIU DE RANK!':down?' ⬇ CAIU DE RANK':''}</b><span>${R.rp1-R.rp0>=0?'+':''}${R.rp1-R.rp0} XP · ${rkFmtN(R.rp1)}${ri<7?' / '+rkFmtN(RKXP[ri+1]):''} XP · Boss nível ${ri+1}</span><i class="bar"><s style="width:${rkProg(R.rp1)}%;background:${RKR[ri].c}"></s></i></div></div>${R.xb&&R.xb.length?`<div class="rkXb">${R.xb.map(([t,v])=>`<span class="${/SERVIDOR/.test(t)?'srv':/RECORDE|1ª/.test(t)?'me':''}">${t} <b>${typeof v==='string'?v:(v>=0?'+':'')+v}</b></span>`).join('')}</div>`:''}
    <div class="row"><button class="btn main" id="rkAgain">LUTAR DE NOVO</button><button class="btn" id="rkOk">OK</button></div></div>`);
  $('rkOk').onclick=()=>{rkModal(null);rkView('boss')};$('rkAgain').onclick=()=>{rkModal(null);if(RKYD!=null)ysFight();else rkBossStart()};
  const C=$('rkChest');if(C)C.onclick=()=>{if(C.classList.contains('open'))return;C.classList.add('open');rkSfx('boom');setTimeout(()=>{rkSfx('powerUp');$('rkItems').hidden=false},350)};
  if(R.srv){rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),300);rkToast('🏆 VOCÊ BATEU O RECORDE DO SERVIDOR! +'+RKXB.srv+' XP','#ffd84a')}
  if(up){rkSfx('powerUp');setTimeout(()=>rkToast('⬆ NOVO RANK: '+RKR[ri].n+'! Boss agora é nível '+(ri+1),'#ffd84a'),600)}if(down){rkSfx('clang');setTimeout(()=>rkToast('⬇ Caiu para '+RKR[ri].n,'#ff8080'),600)}}
const rkProg=rp=>{const i=rkRank(rp);if(i>=RKR.length-1)return 100;return Math.round(100*(rp-RKR[i].min)/(RKR[i+1].min-RKR[i].min))};
/* ---------------- INVOCAÇÃO (gacha) ---------------- */
const RKEQW=[['comum',60],['rara',28],['epica',9],['lend',2.5],['mit',.5]];
/* drops especiais do gacha: espada SECRETA (0,3% por giro, garantida em 50 giros) e 3 míticos especiais (0,6% por giro) */
if(!TWEQR.some(R=>R.k==='sec'))TWEQR.push({k:'sec',n:'SECRETA',c:'#e8f6ff',w:0,v:15});TWSELL.sec=5000;
if(!TWEQR.some(R=>R.k==='obs'))TWEQR.push({k:'obs',n:'OBSCURA',c:'#c46bff',w:0,v:20});TWSELL.obs=10000;  /* v249: raridade acima da SECRETA */
const RKSP={sec:{t:'esp',r:'sec',v:15,vel:5,crit:10,nm:'LÂMINA NEGRA',img:RQA.sp.espada_secreta},
  mask:{t:'cap',r:'mit',v:35,crit:25,dmg:5,nm:'MÁSCARA HOLLOW',img:RQA.sp.mascara},hat:{t:'cap',r:'mit',v:35,crit:25,nm:'CHAPÉU DO HOKAGE',img:RQA.sp.chapeu},
  arm:{t:'arm',r:'mit',v:10,nm:'ARMADURA SAIYAJIN',img:RQA.sp.armadura},
  /* drops do MODO BOSS */
  band:{t:'cap',r:'lend',v:20,crit:20,nm:'BANDANA DA FOLHA',img:RQA.sp.bandana,boss:1},bots:{t:'bot',r:'lend',v:7,dmg:3,nm:'BOTAS SAIYAJIN',img:RQA.sp.botas,boss:1},
  kam:{t:'esp',r:'mit',v:10,vel:5,crit:15,nm:'ADAGA KAMISH',img:RQA.sp.kamish,boss:1},gun:{t:'esp',r:'mit',v:12,vel:3,dmg:3,nm:'GUNBAI DO MADARA',img:RQA.sp.gunbai,boss:1},
  /* v239: itens SECRETOS da Invocação Mítica do Yuta (50% de força em quem não é o Yuta) */
  yesp:{t:'esp',r:'sec',v:30,crit:10,nm:'ESPADA DO YUTA',img:RQA.ysp.yesp,yt:1,ysec:1},yanel:{t:'anel',r:'sec',v:50,st:50,trf:30,nm:'ANEL DO YUTA',img:RQA.ysp.yanel,yt:1,ysec:1},
  yrou:{t:'arm',r:'sec',v:60,trf:10,nm:'UNIFORME DO YUTA',img:RQA.ysp.yrou,yt:1,ysec:1},yrika:{t:'cap',r:'obs',v:0,def:40,crit:20,st:30,drop:30,nm:'RIKA',img:RQA.ysp.yrika,yt:1,ysec:1}};
/* Semente dos Deuses: quando você morre (Modo Boss e Torre), volta com a vida cheia (usa 1) */
const rkSenzu=()=>twLS.g('tw_senzu',0)|0,rkAddSenzu=n=>twLS.s('tw_senzu',Math.max(0,rkSenzu()+n));
function rkSenzuRevive(d){if(rkSenzu()<=0||d.cpu||d.rkSz)return false;d.rkSz=1;rkAddSenzu(-1);d.ko=false;d.hp=d.hpLag=(d.mhp||MAXHP);d.state='idle';d.st=0;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;d.move=null;d.hitstun=0;d.inv=90;
  G.flash=10;G.flashCol='#d8ffb0';G.hitstop=Math.max(G.hitstop,16);for(const r of [300,180])ring(d.x,d.y-150,'#9fff5a',r,24,7);banner('SEMENTE DOS DEUSES!','#9fff5a',100,'VIDA RESTAURADA');rkSfx('powerUp');return true}
const rkSpTxt=x=>[x.v?(x.t==='esp'?'Ataque +'+x.v+'%':x.t==='arm'?'Defesa +'+x.v+'%':x.t==='anel'?'Sorte +'+x.v+'%':x.t==='bot'?'Velocidade +'+x.v+'%':'Transformação +'+x.v+'%'):'',x.def?'Defesa +'+x.def+'%':'',x.dmg?'Dano +'+x.dmg+'%':'',x.vel?'Velocidade +'+x.vel+'%':'',x.crit?'Crítico +'+x.crit+'%':'',x.st&&x.t!=='anel'?'Sorte +'+x.st+'%':'',x.trf?'Transformação +'+x.trf+'%':'',x.fdmg?'Dano na transformação +'+x.fdmg+'%':'',x.drop?'Drop +'+x.drop+'%':'',x.yt?'(50% em quem não é o Yuta)':''].filter(Boolean).join(' · ');
function rkGiveSp(k){const S=RKSP[k],I=twInv(),it=Object.assign({id:'gs'+k+Date.now().toString(36)+Math.random().toString(36).slice(2,5)},S);I.push(it);twLS.s('tw_inv',I);const Q=twEqp(),cur=I.find(x=>x.id===Q[S.t]);if(!cur||rkLock(S)||(!rkIsY(cur)&&(S.v+(S.crit||0)+(S.dmg||0))>(cur.v+(cur.crit||0)+(cur.dmg||0)))){Q[S.t]=it.id;twLS.s('tw_eqp',Q)}TW.capOut=twCap();return it}
let RKMTMP=[];const rkMitLeft=()=>{const o=rkG('own',[]);return RK_MIT.filter(id=>!o.includes(id)).length};
/* personagem NUNCA repetido: só sorteia quem o jogador não tem; se já tem todos daquela raridade, vem um equipamento da mesma raridade */
function rkNewChr(r){const own=rkG('own',[]),P=(r==='lend'?RK_LEG:RK_EPI).filter(id=>!own.includes(id)&&!RKMTMP.includes(id));if(P.length){const id=P[(Math.random()*P.length)|0];RKMTMP.push(id);return {k:'chr',r,id}}return {k:'eq',r,E:TWEQ[(Math.random()*TWEQ.length)|0]}}
function rkRoll(){const p2=rkG('pity2',0)+1;if(p2>=160||Math.random()*100<.3){rkS('pity2',0);return {k:'sp',r:'sec',s:'sec'}}rkS('pity2',p2);
  if(Math.random()*100<.6){const s=['mask','hat','arm'][(Math.random()*3)|0];return {k:'sp',r:'mit',s}}
  {const own=rkG('own',[]),M=RK_MIT.filter(id=>!own.includes(id)&&!RKMTMP.includes(id));if(M.length){const p3=rkG('pity3',0)+1;if(p3>=110||Math.random()*100<.4){rkS('pity3',0);const id=M[(Math.random()*M.length)|0];RKMTMP.push(id);return {k:'chr',r:'mit',id}}rkS('pity3',p3)}}
  const p=rkG('pity',0)+1;let r=Math.random()*100;
  if(p>=30||r<2){rkS('pity',0);return rkNewChr('lend')}
  rkS('pity',p);r-=2;if(r<6)return rkNewChr('epica');r-=6;
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
  <button class="hs" data-a="sum1" style="${rkB(550,695,975,805)}"><span class="shine"></span></button><button class="hs" data-a="sum10" style="${rkB(1030,695,1475,805)}"><span class="shine"></span></button>${(()=>{const c1=rkCost(1),c10=rkCost(10);return (c1.t?`<div class="rkTk" style="${rkB(600,660,925,692)}">🎫 usa 1 ticket (não gasta 💎)</div>`:'')+(c10.t?`<div class="rkTk" style="${rkB(1060,660,1445,692)}">🎫 usa ${c10.t} ticket${c10.t>1?'s':''}${c10.g?' + '+c10.g+' 💎':' (não gasta 💎)'}</div>`:'')})()}
  <div class="rkPity" style="${rkB(560,812,1470,845)}">⭐ Lendário garantido em <b>${30-p}</b> · ${rkMitLeft()?`<span style="color:#ff4a7a">✦ Mítico em <b>${110-rkG('pity3',0)}</b></span> · `:''}✦ Lâmina Negra em <b>${160-rkG('pity2',0)}</b> · 🎟️ ticket = 1 giro</div>`}
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
/* custo do giro: tickets primeiro (1 ticket = 1 giro), o resto em 💎 (1x = 50, no giro de 10 cada giro restante = 45) */
const rkCost=n=>{const t=Math.min(n,rkG('tic',0)|0),g=n===1?(t?0:50):(n-t)*45;return {t,g}};
function rkSummon(n){rkInit();const C=rkCost(n);
  if(rkG('gem',0)<C.g){rkSfx('clang');rkToast(C.t?`Faltam 💎: precisa de ${C.g} (já usando ${C.t} 🎫)`:'Geminhas insuficientes! Compre na Loja 🛒','#ff8080');return}
  if(C.t)rkAdd('tic',-C.t);if(C.g)rkAdd('gem',-C.g);if(C.t)rkToast('🎫 Usou '+C.t+' ticket'+(C.t>1?'s':'')+(C.g?' + '+C.g+' 💎':''),'#ffd84a');
  RKMTMP=[];const L=[];for(let i=0;i<n;i++)L.push(rkRoll());
  if(n===10&&RKBAN!=='mit'&&!L.some(x=>(x.k==='chr')||(x.k==='sp')||(x.k==='eq'&&['epica','lend','mit'].includes(x.r))))L[9]=rkNewChr('epica');
  const own=rkG('own',['goku']);
  for(const x of L){if(x.k==='chr'){if(own.includes(x.id)){x.dup=x.r==='mit'?60:x.r==='lend'?25:5;rkAdd('gem',x.dup)}else{own.push(x.id);x.nw=1}}else if(x.k==='eq')twAddItem(x.E,TWEQR.find(R=>R.k===x.r));else if(x.k==='sp')rkGiveSp(x.s);else rkAdd('red',x.n)}
  rkS('own',own);rkStAdd('spins',n);try{lvSpinDrops(n)}catch(e){}if(L.some(x=>x.k==='chr'&&(x.r==='lend'||x.r==='mit')&&x.nw))rkStAdd('legs',L.filter(x=>x.k==='chr'&&(x.r==='lend'||x.r==='mit')&&x.nw).length);
  const H=rkG('hist',[]);for(const x of L)H.unshift({k:x.k,r:x.r,id:x.id,s:x.s,t:x.E?x.E.k:'',n:x.n||0,dup:x.dup||0,d:Date.now()});rkS('hist',H.slice(0,60));
  for(const x of L)if(x.k==='chr'&&(x.r==='mit'||(x.nw&&x.r==='lend'))){try{const V=x.r==='mit'?RKUV:RKTV,F=V[x.id]&&V[x.id]().f;if(F)RKCWP[x.r+x.id]=rkPre(F)}catch(e){}}
  rkPlayVid(()=>rkCards(L))}
const RKCWP={};
function rkPlayVid(cb){rkGachaOn();const O=document.createElement('div');O.className='rkFx';O.innerHTML='<span>toque para pular</span>';rkHost().appendChild(O);
  const stop=rkPlayFrames(O,RKVF,RKVP,()=>{O.remove();cb()});O.onclick=()=>stop();try{SFX.powerUp()}catch(e){}}
function rkCardInner(x){if(x.k==='chr')return `<img class="pt" src="${IMG[x.id]?IMG[x.id].src:''}" alt=""><b>${CH[x.id]?CH[x.id].name:''}</b><em>${x.nw?'NOVO!':'REPETIDO +'+x.dup+'💎'}</em>`;
  if(x.k==='eq')return `<img class="ic" src="${twIco(x.E.k,x.r)}" alt=""><b>${x.E.n}</b><em>${TWEQR.find(R=>R.k===x.r).n}</em>`;
  if(x.k==='sp'){const S=RKSP[x.s];return `<img class="ic" src="${S.img}" alt=""><b>${S.nm}</b><em>${rkHi(x.r)?'✦ SECRETA ✦':'MÍTICO ESPECIAL'}</em>`}
  return `<img class="ic" src="${RQA.coin[1]}" alt=""><b>+${x.n}</b><em>MOEDA VERMELHA</em>`}
function rkCards(L){const O=document.createElement('div');O.className='rkRes2';const one=L.length===1;
  O.innerHTML=`<div class="rkCards ${one?'one':''}">${L.map((x,i)=>`<div class="rkCd r_${x.r}" data-i="${i}" style="--c:${(TWEQR.find(R=>R.k===x.r)||TWEQR[0]).c}"><div class="bk"></div><div class="fr"><img class="frm" src="${RQA.card[rkHi(x.r)?'lend':x.r]||RQA.card.comum}" alt=""><div class="in">${rkCardInner(x)}</div></div></div>`).join('')}</div>
    <div class="row"><button class="btn" id="rkCdAll">REVELAR TUDO</button><button class="btn main" id="rkCdOk" hidden>OK</button></div>`;
  rkHost().appendChild(O);const C=[...O.querySelectorAll('.rkCd')];let k=0;
  const rev=async el=>{if(!el||el.classList.contains('rv')||el.dataset.b)return;el.dataset.b=1;const x=L[+el.dataset.i];
    if(x.k==='chr'&&x.r==='mit')await (x.id==='yuta'?rkMegaY():rkMega());
    if((x.r==='lend'&&x.k==='chr')||rkHi(x.r)){O.classList.add('dim');await new Promise(r=>setTimeout(r,500));O.classList.remove('dim')}
    el.classList.add('rv');rkSfx(x.r==='lend'||x.r==='mit'?'boom':'whoosh');if(x.r==='lend'||x.r==='mit'||rkHi(x.r))setTimeout(()=>rkSfx('powerUp'),200);if(rkHi(x.r)){await new Promise(r=>setTimeout(r,400));await rkSecWin(x.s||'sec')}
    if(x.k==='chr'&&x.r==='mit'){await new Promise(r=>setTimeout(r,500));await rkCharWin(x.id,1,x.nw);if(x.id==='yuta'&&x.nw)await ytTitClaim(1)}
    else if(x.k==='chr'&&x.nw&&x.r==='lend'){await new Promise(r=>setTimeout(r,500));await rkCharWin(x.id)}
    if(C.every(c=>c.classList.contains('rv'))){$('rkCdAll').hidden=true;$('rkCdOk').hidden=false}};
  C.forEach(el=>el.onclick=()=>rev(el));const auto=async()=>{for(const el of C){if(!O.isConnected)return;await rev(el);await new Promise(r=>setTimeout(r,one?300:260))}};setTimeout(auto,500);
  $('rkCdAll').onclick=async()=>{for(const el of C)await rev(el)};$('rkCdOk').onclick=()=>{O.remove();rkView('gacha')}}
function rkSecWin(k){return new Promise(res=>{const S=RKSP[k||'sec']||RKSP.sec,O=document.createElement('div');O.className='rkWin end sec';O.innerHTML=`<div class="t"><b>✦ DROP SECRETO! ✦</b><span>${S.nm}</span></div><img class="fl" src="${S.img}" alt=""><i class="rays"></i><div class="t2">${rkSpTxt(S)}</div>`;rkHost().appendChild(O);rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),300);setTimeout(()=>{O.onclick=()=>{O.remove();res()}},500)})}
/* personagem lendário novo: passa o vídeo da transformação dele */
const RKTV={goku:()=>GKV,aokiji:()=>AOV,zoro:()=>ZRV,broly:()=>BRV,vegeta:()=>VGV,gogeta:()=>GGV,madara:()=>MDV,gojo:()=>GJV,luffy:()=>LFV,rengoku:()=>RGV,naruto:()=>NRV,garou:()=>GRV,qingqing:()=>QQV,zaykon:()=>ZKV,zedry:()=>ZGV};
function rkMega(){return new Promise(res=>{const O=document.createElement('div');O.className='rkMega';O.innerHTML='<i class="rays"></i><i class="fl"></i><div class="tx"><small>✦ ✦ ✦</small><b>SUPER</b><b>MEGA SORTE!</b><span>UM PERSONAGEM MÍTICO APARECEU!</span></div>';rkHost().appendChild(O);
  rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),500);setTimeout(()=>rkSfx('boom'),1100);setTimeout(()=>rkSfx('powerUp'),1700);let d=0;const end=()=>{if(d)return;d=1;O.classList.add('out');setTimeout(()=>{O.remove();res()},350)};setTimeout(end,2900);setTimeout(()=>{O.onclick=end},900)})}
function rkCharWin(id,mit,nw){return new Promise(res=>{let F=null;const V=mit?RKUV:RKTV;try{F=V[id]&&V[id]().f}catch(e){}
  const O=document.createElement('div');O.className='rkWin'+(mit?' mit':'')+(id==='yuta'?' ytm':'');O.innerHTML=`<img class="v" alt=""><div class="t"><b>${id==='yuta'?(nw?'✦ SSR YUTA · SORTE MÍTICA! ✦':'✦ YUTA ✦'):mit?(nw?'✦ NOVO PERSONAGEM MÍTICO! ✦':'✦ MÍTICO REPETIDO (+60 💎) ✦'):'NOVO PERSONAGEM LENDÁRIO!'}</b><span>${CH[id]?CH[id].name:''}</span></div><img class="fl" src="${fullSrc(id)}" alt="" hidden><i class="rays"></i>`;rkHost().appendChild(O);
  const v=O.querySelector('.v'),fl=O.querySelector('.fl');v.remove();let done=false,stop=null;const fin=()=>{if(done)return;done=true;if(stop)stop();fl.hidden=false;O.classList.add('end');rkSfx('powerUp');setTimeout(()=>{O.onclick=()=>{O.remove();res()}},400)};
  O.onclick=()=>fin();if(F&&F.length){const P=RKCWP[(mit?'mit':'lend')+id]||rkPre(F);stop=rkPlayFrames(O,P.ims,P.p,fin)}else fin()})}
function rkHist(){const H=rkG('hist',[]);rkModal(`<div class="twM"><h3>📜 HISTÓRICO</h3><div class="rkHl">${H.length?H.map(x=>{const R=TWEQR.find(q=>q.k===x.r)||TWEQR[0];return `<div style="--c:${R.c}"><b>${x.k==='chr'?(CH[x.id]?CH[x.id].name:x.id):x.k==='eq'?TWEQ.find(E=>E.k===x.t).n:x.k==='sp'?RKSP[x.s].nm:'+'+x.n+' 🔴'}</b><span>${x.k==='chr'?'PERSONAGEM '+(x.r==='mit'?'MÍTICO':x.r==='lend'?'LENDÁRIO':'ÉPICO')+(x.dup?' (repetido +'+x.dup+'💎)':''):x.k==='eq'?'EQUIPAMENTO '+R.n:x.k==='sp'?(rkHi(x.r)?'✦ SECRETO ✦':'MÍTICO ESPECIAL'):'MOEDA VERMELHA'}</span><small>${new Date(x.d).toLocaleString('pt-BR').slice(0,17)}</small></div>`}).join(''):'<p class="twH">Nenhum giro ainda.</p>'}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
function rkTaxas(){rkModal(`<div class="twM"><h3>% TAXAS DA INVOCAÇÃO LIMITADA</h3><table class="rkTx"><tr><th>Resultado</th><th>Chance</th></tr>
  <tr><td style="color:#ff2e63">✦ Personagem MÍTICO (Naruto, Madara, Garou) · garantido em 110 · nunca repetido</td><td>0,4%</td></tr><tr><td style="color:#ffc531">⭐ Personagem LENDÁRIO</td><td>2%</td></tr><tr><td style="color:#b25bff">Personagem ÉPICO</td><td>6%</td></tr><tr><td>Equipamento</td><td>27%</td></tr><tr><td style="color:#ff5a5a">Moeda Vermelha (1 a 5)</td><td>65%</td></tr><tr><td style="color:#ff2e63">Mítico especial (Máscara Hollow, Chapéu do Hokage, Armadura Saiyajin)</td><td>0,6%</td></tr><tr><td style="color:#e8f6ff">✦ SECRETO: Lâmina Negra</td><td>0,3%</td></tr></table>
  <p class="twH">⭐ Garantia: no máximo 30 giros sem lendário (o 30º é garantido). ✦ Personagem MÍTICO garantido em 110 giros e nunca vem repetido (quando você tiver os 3, ele para de aparecer). ✦ Lâmina Negra garantida em 160 giros. Giro de 10: sempre vem pelo menos 1 épico ou melhor.<br>Equipamento: comum 60% · raro 28% · épico 9% · lendário 2,5% · mítico 0,5%.<br>Personagem NUNCA vem repetido: só sai quem você ainda não tem (se já tiver todos daquela raridade, vem um equipamento da mesma raridade).</p>
  <p class="twH">✦ <b>Drops do Modo Boss (por vitória):</b> lendários (Bandana da Folha, Botas Saiyajin, Semente dos Deuses) 4% · míticos (Adaga Kamish, Gunbai do Madara) 1,5% · garantido 1 a cada 25 vitórias sem drop.</p><p class="twH"><b style="color:#ff2e63">✦ Míticos (0,4%, garantido em 110 giros, nunca repetido):</b> ${RK_MIT.map(id=>CH[id].name).join(', ')}<br><b>Lendários:</b> ${RK_LEG.map(id=>CH[id].name).join(', ')}<br><b>Épicos:</b> ${RK_EPI.map(id=>CH[id].name).join(', ')}</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
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
  if(RKL.tab==='chr'){for(const id of ['yuta'].concat(RK_MIT,RK_LEG,RK_EPI).filter(i=>CH[i]))R.push({id,k:'chr',r:rkRar(id),has:own.includes(id),img:IMG[id]?IMG[id].src:'',big:fullSrc(id),nm:CH[id].name,d:({mit:'✦ PERSONAGEM MÍTICO',lend:'PERSONAGEM LENDÁRIO'}[rkRar(id)]||'PERSONAGEM ÉPICO')+(rkG('sel','goku')===id?' · EM USO NA RANQUEADA':'')})}
  else if(RKL.tab==='eq'){for(const k in RKSP){const S=RKSP[k];const has=inv.some(x=>x.nm===S.nm);R.push({id:'sp'+k,k:'eq',r:S.r,has,img:S.img,big:S.img,nm:S.nm,d:(S.r==='obs'?'✦ OBSCURO · ':S.r==='sec'?'✦ SECRETO · ':S.r==='lend'?'LENDÁRIO ESPECIAL · ':'MÍTICO ESPECIAL · ')+rkSpTxt(S)+(S.boss?' · drop do Modo Boss':' · só no gacha')})}
    for(const E of TWEQ)for(const Rr of TWEQR.filter(q=>!rkHi(q.k))){const has=inv.some(x=>x.t===E.k&&x.r===Rr.k);const v=E.k==='cap'?TWCAPV[Rr.k]:null;R.push({id:E.k+Rr.k,k:'eq',r:Rr.k,has,img:twIco(E.k,Rr.k),big:twIco(E.k,Rr.k),nm:E.n+' '+Rr.n,d:E.k==='cap'?'Transformação +'+v[0]+'% · Crítico +'+v[1]+'%':E.d.replace('Aumenta o ','').replace('Aumenta a ','')+' +'+Rr.v+'%'})}}
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
async function rkOQ(field,dir,lim){const body={structuredQuery:{from:[{collectionId:'torre'}],orderBy:[{field:{fieldPath:field},direction:dir}],limit:lim}};
  const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);const j=await r.json(),o=[];
  for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F||!F.rk)continue;const e={_ct:Date.parse(x.document.createTime||'')||0};for(const k in F){const v=F[k];e[k]=v.stringValue!=null?v.stringValue:v.integerValue!=null?+v.integerValue:v.doubleValue}if(e.tw)e.tt=e.tw;if(e.t1w)e.t1=e.t1w;o.push(e)}return o}
async function rkLoadRk(tab){tab=tab||'rp';const L=await (tab==='dmg'?rkOQ('dmg','DESCENDING',100):tab==='tt'?rkOQ('tw','ASCENDING',100):tab==='t1'?rkOQ('t1w','ASCENDING',100):rkOQ('rp','DESCENDING',150)),M={};for(const e of L){const k=e.uid||e.nome;const o=M[k]||(M[k]={nome:e.nome,uid:e.uid,tit:e.tit,rp:0,dmg:0,t1:0,tt:0,ct:0,char:e.char});
    if(e._ct>=o.ct){o.ct=e._ct;o.rp=e.rp||0;o.nome=e.nome;o.tit=e.tit;o.char=e.char}o.dmg=Math.max(o.dmg,e.dmg||0);if(e.t1&&(!o.t1||e.t1<o.t1))o.t1=e.t1;if(e.tt&&(!o.tt||e.tt<o.tt))o.tt=e.tt}return Object.values(M)}
function rkRanking(tab){tab=tab||'rp';rkRanking.tab=tab;rkModal(`<div class="twM rk"><h3>🏆 RANKING DO RANQUEADO</h3><div class="seg twTab"><button data-t="rp" aria-pressed="${tab==='rp'}">👑 RANK</button><button data-t="dmg" aria-pressed="${tab==='dmg'}">💥 DANO NO BROLY</button><button data-t="tt" aria-pressed="${tab==='tt'}">⏱ MAIS RÁPIDO</button><button data-t="t1" aria-pressed="${tab==='t1'}">⚡ 1ª FASE</button></div>
    <div id="rkRkL"><p class="twH">Carregando...</p></div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);document.querySelectorAll(RKMS()+'.twTab button').forEach(b=>b.onclick=()=>rkRanking(b.dataset.t));
  rkLoadRk(tab).then(A=>{let L=A.slice();if(tab==='rp')L.sort((a,b)=>b.rp-a.rp);else if(tab==='dmg')L.sort((a,b)=>b.dmg-a.dmg);else{L=L.filter(e=>e[tab]>0).sort((a,b)=>a[tab]-b[tab])}L=L.slice(0,50);const me=twUid(),E=$('rkRkL');if(!E)return;
    E.innerHTML=L.length?'<p class="twH pfHint">👆 Toque num jogador para ver o perfil</p><div class="twRk">'+L.map((e,i)=>{const ri=rkRank(e.rp);return `<div class="rw${e.uid===me?' me':''}${i<3?' t'+(i+1):''}" data-pu="${twEsc(e.uid||'')}" data-pn="${twEsc(e.nome||'')}"><span class="ps">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><img src="${RQA.rank[ri]}" alt=""><span class="nm">${twEsc(e.nome)}${twTitTag(twTN(e),e.nome)}<small style="color:${RKR[ri].c}">${RKR[ri].n}</small></span><span class="an">${tab==='rp'?'⭐ '+rkFmtN(e.rp)+' XP':tab==='dmg'?'💥 '+rkFmtN(e.dmg):'⏱ '+twFmt(e[tab])}</span></div>`}).join('')+'</div>':'<p class="twH">Ninguém no ranking ainda. Seja o primeiro!</p>'}).catch(()=>{const E=$('rkRkL');if(E)E.innerHTML='<p class="twH err">Sem internet agora.</p>'})}
const rkRwPend=()=>{const c=rkG('rwc2',[]),ri=rkRank(rkG('rp',0));for(let i=1;i<=ri;i++)if(!c.includes(i))return true;return false};
/* prêmios de cada elo (v218): diamantes, tickets, baús da Torre, sementes e CAIXA SECRETA nos dois últimos */
const RKRW=[null,{g:200,bau:[['rara',1]]},{g:350,tic:2,bau:[['epica',1]]},{g:500,tic:3,bau:[['epica',2]],sz:1},{g:800,tic:5,bau:[['lend',1]],sz:2},
  {g:1200,tic:8,bau:[['lend',2]],sz:3},{g:2000,tic:10,bau:[['mit',1]],sz:5,sec:['rnd']},{g:3000,tic:15,bau:[['mit',2]],sz:10,sec:['sec','rnd']},
  {g:4000,tic:20,bau:[['mit',3]],sz:12,sec:['rnd']},{g:5000,tic:25,bau:[['mit',4]],sz:15,sec:['rnd']},{g:7000,tic:30,bau:[['mit',5]],sz:20,sec:['rnd','rnd']}];
const rkRwTxt=(W,i)=>{const B={rara:'RARO',epica:'ÉPICO',lend:'LENDÁRIO',mit:'MÍTICO'},old=rkG('rwc',[]).includes(i)?RKR[i].rw:0;return [`💎 ${W.g-old}${old?` <small>(+${old} já pegos)</small>`:''}`,W.tic?`🎫 ${W.tic}`:'',...W.bau.map(([r,n])=>`🎁 ${n}× baú ${B[r]}`),W.sz?`🌱 ${W.sz} Semente${W.sz>1?'s':''}`:'',...(W.sec||[]).map(k=>k==='sec'?'✦ CAIXA SECRETA: LÂMINA NEGRA':'✦ CAIXA SECRETA')].filter(Boolean).join(' · ')};
/* abre baús da Torre por cima do ranqueado */
function rkBau(B){return rkOverTw(()=>twBauOpen(B))}
function rkOverTw(fn){return new Promise(res=>{if(showScreen.cur==='tower'){const M=$('twModal');const ob=new MutationObserver(()=>{if(M.hidden){ob.disconnect();res()}});ob.observe(M,{attributes:true,attributeFilter:['hidden']});fn();return}let M=$('twModal'),mk=0;if(!M){M=document.createElement('div');M.id='twModal';M.hidden=true;mk=1}const home=M.parentNode,nx=M.nextSibling;$('ranked').appendChild(M);M.style.zIndex=40;M.style.fontSize='min(1vw,1.7757vh)';
  const ob=new MutationObserver(()=>{if(M.hidden){ob.disconnect();M.style.zIndex='';if(mk)M.remove();else home.insertBefore(M,nx);res()}});ob.observe(M,{attributes:true,attributeFilter:['hidden']});fn()})}
const RKSECP=['mask','hat','arm','kam','gun','band','bots'];
function rkSpWin(k){return new Promise(res=>{const S=RKSP[k],O=document.createElement('div');O.className='rkWin end sec';O.innerHTML=`<div class="t"><b>✦ CAIXA SECRETA! ✦</b><span>${S.nm}</span></div><img class="fl" src="${S.img}" alt=""><i class="rays"></i><div class="t2">${rkSpTxt(S)}<br><small>toque para continuar</small></div>`;rkHost().appendChild(O);rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),300);setTimeout(()=>{O.onclick=()=>{O.remove();res()}},600)})}
async function rkRwClaim(i){const c=rkG('rwc2',[]);if(c.includes(i))return;const W=RKRW[i],old=rkG('rwc',[]).includes(i)?RKR[i].rw:0;c.push(i);rkS('rwc2',c);const o=rkG('rwc',[]);if(!o.includes(i)){o.push(i);rkS('rwc',o)}
  rkAdd('gem',W.g-old);if(W.tic)rkAdd('tic',W.tic);if(W.sz)rkAddSenzu(W.sz);twGiveTit('rk'+i);rkSfx('powerUp');rkToast(`+${W.g-old} 💎${W.tic?' · +'+W.tic+' 🎫':''}${W.sz?' · +'+W.sz+' 🌱':''}`,'#7fd8ff');rkModal(null);
  for(const [r,n] of W.bau)await rkBau({r,n});
  for(const k of W.sec||[]){const kk=k==='rnd'?RKSECP[(Math.random()*RKSECP.length)|0]:k;rkGiveSp(kk);await rkSpWin(kk)}
  if(RKV)rkView(RKV);rkRewards()}
function rkRewards(){const c=rkG('rwc2',[]),ri=rkRank(rkG('rp',0));
  rkModal(`<div class="twM"><h3>🎁 RECOMPENSAS DE RANK</h3><p class="twH">Suba de rank com XP ranqueado: vitória dá XP, derrota tira (pode cair de rank). Cada rank novo dá diamantes, baús, tickets, sementes e um título — os últimos dão CAIXA SECRETA!</p><div class="rkRw">${RKR.map((R,i)=>{const got=c.includes(i)||i===0,can=i<=ri&&!got;return `<div class="${i<=ri?'ok':''} ${i>=6?'top':''}" style="--c:${R.c}">${rkEmb(i,'xs')}<b style="color:${R.c}">${R.n}</b><small>${rkFmtN(R.min)} XP</small><span>${i?rkRwTxt(RKRW[i],i):'—'}</span>${can?`<button class="btn main" data-i="${i}">RESGATAR</button>`:`<em>${got&&i<=ri?(i?'✔ RESGATADO':'✔'):'🔒'}</em>`}</div>`}).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>{rkModal(null);if(RKV==='menu')rkView('menu')};document.querySelectorAll(RKMS()+'.rkRw button').forEach(b=>b.onclick=()=>rkRwClaim(+b.dataset.i))}
const rkPl=S=>(S.wins||0)+(S.loss||0),rkRk=()=>rkRank(rkG('rp',0));
const RKACH=[{k:'p1',n:'Primeiro Desafio',d:'Lute contra o Broly 1 vez',g:30,ok:S=>rkPl(S)>=1},{k:'w1',n:'Primeira Vitória',d:'Derrote o Broly pela 1ª vez',g:50,ok:S=>(S.wins||0)>=1},
  {k:'w5',n:'Caçador de Lendas',d:'Derrote o Broly 5 vezes',g:100,ok:S=>(S.wins||0)>=5},{k:'w10',n:'Guerreiro Z',d:'Derrote o Broly 10 vezes',g:200,tic:1,ok:S=>(S.wins||0)>=10},
  {k:'w20',n:'Pesadelo do Broly',d:'Derrote o Broly 20 vezes',g:300,tic:2,ok:S=>(S.wins||0)>=20},{k:'w50',n:'Lenda Viva',d:'Derrote o Broly 50 vezes',g:600,tic:5,ok:S=>(S.wins||0)>=50},
  {k:'w100',n:'Deus da Destruição',d:'Derrote o Broly 100 vezes',g:1000,tic:10,ok:S=>(S.wins||0)>=100},
  {k:'p10',n:'Persistente',d:'Lute 10 vezes no Modo Boss',g:80,ok:S=>rkPl(S)>=10},{k:'p50',n:'Incansável',d:'Lute 50 vezes no Modo Boss',g:250,tic:2,ok:S=>rkPl(S)>=50},{k:'p200',n:'Veterano',d:'Lute 200 vezes no Modo Boss',g:700,tic:5,ok:S=>rkPl(S)>=200},
  {k:'t1',n:'Relâmpago',d:'Vença a 1ª fase em menos de 60 s',g:80,ok:S=>S.t1>0&&S.t1<60},{k:'t30',n:'Instinto Superior',d:'Vença a 1ª fase em menos de 30 s',g:200,tic:1,ok:S=>S.t1>0&&S.t1<30},
  {k:'tt',n:'Speedrun Lendário',d:'Derrote o Broly em menos de 3 minutos',g:150,ok:S=>S.tt>0&&S.tt<180},{k:'t2m',n:'Velocidade da Luz',d:'Derrote o Broly em menos de 2 minutos',g:300,tic:2,ok:S=>S.tt>0&&S.tt<120},
  {k:'cl',n:'Intocável',d:'Vença perdendo menos de 25% da vida',g:150,ok:S=>(S.clean||0)>=1},{k:'cl5',n:'Muralha',d:'Vença 5 vezes perdendo menos de 25% da vida',g:400,tic:3,ok:S=>(S.clean||0)>=5},
  {k:'dm',n:'Destruidor',d:'Cause 100.000 de dano no total',g:100,ok:S=>(S.dmgTot||0)>=100000},{k:'dm5',n:'Aniquilador',d:'Cause 500.000 de dano no total',g:250,tic:1,ok:S=>(S.dmgTot||0)>=500000},
  {k:'dm2m',n:'Fim do Universo',d:'Cause 2.000.000 de dano no total',g:700,tic:5,ok:S=>(S.dmgTot||0)>=2000000},{k:'dmx',n:'Golpe Fatal',d:'Cause 20.000 de dano numa luta só',g:200,ok:S=>(S.dmgMax||0)>=20000},
  {k:'sp',n:'Invocador',d:'Faça 50 giros na Invocação',g:100,ok:S=>(S.spins||0)>=50},{k:'sp1',n:'Mestre Invocador',d:'Faça 150 giros na Invocação',g:250,tic:2,ok:S=>(S.spins||0)>=150},{k:'sp3',n:'Viciado no Gacha',d:'Faça 400 giros na Invocação',g:600,tic:5,ok:S=>(S.spins||0)>=400},
  {k:'lg',n:'Primeiro Lendário',d:'Ganhe um personagem lendário no gacha',g:50,ok:S=>(S.legs||0)>=1},{k:'lg5',n:'Colecionador Lendário',d:'Ganhe 5 personagens lendários',g:300,tic:3,ok:S=>(S.legs||0)>=5},
  {k:'own5',n:'Equipe Montada',d:'Tenha 5 personagens',g:150,ok:()=>rkG('own',[]).length>=5},{k:'own10',n:'Exército',d:'Tenha 10 personagens',g:400,tic:3,ok:()=>rkG('own',[]).length>=10},
  {k:'eq4',n:'Bem Equipado',d:'Equipe espada, capacete, armadura e botas',g:100,ok:()=>{const Q=twEqp();return ['esp','cap','arm','bot'].every(k=>Q[k])}},
  {k:'br',n:'Bronze!',d:'Chegue ao rank BRONZE',g:50,ok:()=>rkRk()>=1},{k:'pr',n:'Prata!',d:'Chegue ao rank PRATA',g:80,ok:()=>rkRk()>=2},{k:'gd',n:'Ouro!',d:'Chegue ao rank OURO',g:100,ok:()=>rkRk()>=3},
  {k:'di',n:'Diamante!',d:'Chegue ao rank DIAMANTE',g:200,tic:1,ok:()=>rkRk()>=4},{k:'le',n:'Lendário!',d:'Chegue ao rank LENDÁRIO',g:300,tic:2,ok:()=>rkRk()>=5},{k:'dr',n:'Dragão!',d:'Chegue ao rank DRAGÃO LENDÁRIO',g:400,tic:3,ok:()=>rkRk()>=6},
  {k:'dv',n:'Divino',d:'Chegue ao rank DIVINDADE',g:500,tic:5,ok:()=>rkRk()>=7},
  {k:'dvs',n:'Supremo',d:'Chegue ao rank DIVINDADE SUPREMA',g:800,tic:6,ok:()=>rkRk()>=8},{k:'dvc',n:'Celestial',d:'Chegue ao rank DIVINDADE CELESTIAL',g:1000,tic:8,ok:()=>rkRk()>=9},{k:'dsc',n:'Deus',d:'Chegue ao rank DEUS CELESTIAL',g:1500,tic:10,ok:()=>rkRk()>=10}];
const rkAchPend=()=>{const S=rkSt(),c=rkG('achc',[]);return RKACH.some(A=>A.ok(S)&&!c.includes(A.k))};
function rkAch(){const S=rkSt(),c=rkG('achc',[]);
  rkModal(`<div class="twM"><h3>🎖️ CONQUISTAS <small>${RKACH.filter(A=>c.includes(A.k)).length}/${RKACH.length}</small></h3>${RKACH.some(A=>A.ok(S)&&!c.includes(A.k))?'<div class="row"><button class="btn main" id="rkAcAll">RESGATAR TUDO</button></div>':''}<div class="rkAc">${RKACH.map(A=>{const ok=A.ok(S),got=c.includes(A.k);return `<div class="${ok?'ok':''} ${got?'got':''}"><b>${A.n}</b><span>${A.d}</span><em>💎 ${A.g}${A.tic?' · 🎫 '+A.tic:''}</em>${ok&&!got?`<button class="btn main" data-k="${A.k}">RESGATAR</button>`:`<i>${got?'✔':'🔒'}</i>`}</div>`}).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>{rkModal(null);if(RKV==='menu')rkView('menu')};const take=L=>{const c=rkG('achc',[]);let g=0,t=0;for(const A of L){if(c.includes(A.k)||!A.ok(rkSt()))continue;c.push(A.k);g+=A.g;t+=A.tic||0}rkS('achc',c);if(!g)return;rkAdd('gem',g);if(t)rkAdd('tic',t);rkSfx('powerUp');rkToast('+'+g+' 💎'+(t?' · +'+t+' 🎫':''),'#7fd8ff');rkAch()};
  document.querySelectorAll(RKMS()+'.rkAc button').forEach(b=>b.onclick=()=>take([RKACH.find(x=>x.k===b.dataset.k)]));if($('rkAcAll'))$('rkAcAll').onclick=()=>take(RKACH)}
function rkPos(){const rp=rkG('rp',0),ri=rkRank(rp),S=rkSt();
  rkModal(`<div class="twM rkPos" style="--c:${RKR[ri].c}"><h3>📊 MINHA POSIÇÃO</h3><div class="rkPs">${rkEmb(ri,'big')}<div><b style="color:${RKR[ri].c}">${RKR[ri].n}</b><span>${rkFmtN(rp)} XP${ri<7?' · próximo: '+RKR[ri+1].n+' ('+rkFmtN(RKR[ri+1].min)+')':' · RANK MÁXIMO (sem limite de XP)'} · Boss nível ${ri+1}</span><i class="bar"><s style="width:${rkProg(rp)}%;background:${RKR[ri].c}"></s></i>
    <span id="rkPosN">Posição no ranking: ...</span><span>🏆 ${S.wins||0} vitórias · 💀 ${S.loss||0} derrotas · 💥 recorde ${rkFmtN(S.dmgMax||0)} de dano</span><span>⏱ melhor vitória ${S.tt?twFmt(S.tt):'--:--'} · ⚡ 1ª fase ${S.t1?twFmt(S.t1):'--:--'}</span>${rkCurHTML()}</div></div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);rkLoadRk('rp').then(A=>{A.sort((a,b)=>b.rp-a.rp);const i=A.findIndex(e=>e.uid===twUid()),E=$('rkPosN');if(E)E.textContent=i>=0?'Posição no ranking: #'+(i+1)+' de '+A.length:'Jogue uma partida para entrar no ranking'}).catch(()=>{const E=$('rkPosN');if(E)E.textContent='Posição: sem internet'})}

/* ---------- CAIXA DE DIAMANTES (código para quem já jogou a Torre, 1 vez por pessoa) ---------- */
const TWDIAN=["oqqh4h","13uxsah","x5a5kc","srbzgm","u2go56","10jasju","xq65nl","1g9ac0y","1vaplua","1cuadjd","z7e3m8","zf435s","vhy4to","1gn6q7b","1ry3d2h","io4fdx","8sa57d","1vla1n5","1rn8e9q","1nvlie","1cpy0l3","y5adqo","1twinyn","1mdayar"],TWDIAU=["13vlve8","14wfhw9","wurbwp","11ytymg","1v9nlbt","1off6cc","74xllj","1q475c8","1lgy2bh","xofqbu","1ilefnk","1idoq9v","1u5wgl5","1x8vi6l","1n9cqgu","y3wxz2","ld8n0d"];
const RKDIA=[[100,25],[200,20],[300,16],[400,13],[500,10],[600,7],[700,4],[800,2.5],[900,1.5],[1000,1]];
function rkDiaRoll(){let r=Math.random()*100;for(const [v,w] of RKDIA){if(r<w)return v;r-=w}return 100}
function rkDiaBox(kind){if(kind===4)return rkAdmGift();if(kind===5)return rkInfGift();const v=kind===3||kind===6?100+((Math.random()*901)|0):kind===2?100+((Math.random()*501)|0):rkDiaRoll();rkAdd('gem',v);
  twModal(`<div class="twM gold rkDia"><h3>${kind===6?'💎 CAIXA DE GEMAS':kind===3?'🍀 CAIXA DA SORTE MÁXIMA':kind===2?'🍀 CAIXA DA SORTE':'💎 CAIXA DE DIAMANTES'}</h3><p class="twH">${kind===3||kind===6?'De 100 a 1000 diamantes, totalmente aleatório!':kind===2?'De 100 a 600 diamantes, totalmente aleatório!':'Presente para quem jogou o Modo Torre!'} Toque na caixa.</p><div class="dbx" id="rkDbx"><img class="cf" src="${TWIMG.bf[3]}" alt=""><img class="ca" src="${TWIMG.ba[3]}" alt=""><i class="rays"></i><b id="rkDn"><img src="${RQA.coin[0]}" alt=""><span>0</span></b></div>
    ${kind>=2?'':`<p class="twH">Chances: 100 (25%) · 200 (20%) · 300 (16%) · 400 (13%) · 500 (10%) · 600 (7%) · 700 (4%) · 800 (2,5%) · 900 (1,5%) · 1000 (1%)</p>`}<p class="twH ok" id="rkDt" style="visibility:hidden">Os diamantes já estão no MODO RANQUEADO (Gacha e Loja)!</p><div class="row"><button class="btn main" id="rkDok">ABRIR</button></div></div>`);
  let op=0;const go=()=>{if(op){twModal(null);return}op=1;const X=$('rkDbx');X.classList.add('open');twSfx('boom');setTimeout(()=>twSfx('powerUp'),300);const S=document.querySelector('#rkDn span');let n=0;const st=Math.max(10,v/40);const iv=setInterval(()=>{n=Math.min(v,n+st);S.textContent=Math.round(n);if(n>=v){clearInterval(iv);if(v>=500)twSfx('boom')}},30);$('rkDt').style.visibility='visible';$('rkDok').textContent='PEGAR'};
  $('rkDbx').onclick=go;$('rkDok').onclick=go}

/* ---------- CÓDIGO no ranqueado (mesmos códigos da Torre) ---------- */
function rkCode(){rkModal(`<div class="twM sm"><h3>🎟️ RESGATAR CÓDIGO</h3><p class="twH">Digite o código que você recebeu:</p><input id="rkCdI" class="rkCdI" maxlength="24" autocomplete="off" autocapitalize="characters" placeholder="XXXXX-XXXX-XXXX"><p class="twH" id="rkCdE"></p><div class="row"><button class="btn main" id="rkCdOk">RESGATAR</button><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  const I=$('rkCdI'),E=$('rkCdE');setTimeout(()=>I.focus(),50);$('rkMX').onclick=()=>{rkModal(null);rkView(RKV)};
  const go=async()=>{const c=I.value.trim();if(!c)return;if(twHash(c.toUpperCase())===TWADM){E.className='twH err';E.textContent='Esse código é usado no campo de NOME da Torre.';return}$('rkCdOk').disabled=true;
    const ok=await twCupom(c,E);$('rkCdOk').disabled=false;if(!ok){E.className='twH err';E.textContent='❌ Código inválido.';rkSfx('clang')}};
  $('rkCdOk').onclick=go;I.onkeydown=e=>{if(e.key==='Enter')go()}}
/* abre a Caixa de Diamantes no lugar certo (Torre ou ranqueado) */
function rkDiaShow(kind){if(showScreen.cur==='ranked'){rkModal(null);return rkOverTw(()=>rkDiaBox(kind)).then(()=>rkView(RKV))}rkDiaBox(kind)}
/* entrega automática: quem está na lista da Torre ganha a caixa ao abrir o ranqueado (1 vez, mesmo documento do código) */
async function rkDiaAuto(){acSave();try{if(rkG('dia',0))return;const h='1b2e1xu',nm=String(twLS.g('tw_nome','')||'').toLowerCase().trim(),u=twUid(),oU=TWDIAU.includes(twHash(u)),oN=nm&&TWDIAN.includes(twHash(nm));if(!oU&&!oN)return;
  const used=twLS.g('tw_cup',{});if(used[h]){rkS('dia',1);return}const IV=v=>({integerValue:String(v)}),dk='_'+(oU?'u'+twHash(u):'n'+twHash(nm));
  const f={nome:{stringValue:String(twLS.g('tw_nome','')||'?').slice(0,16)},andar:IV(0),tempo:IV(0),uid:{stringValue:u},cupom:{stringValue:h},v:IV(219)};
  const r=await twFetchT(TWURL+'/torre?documentId=cupom_'+h+dk+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})});
  if(r.ok){rkS('dia',1);used[h]=1;twLS.s('tw_cup',used);rkToast('🎁 Você jogou o Modo Torre: ganhou uma CAIXA DE DIAMANTES!','#7fd8ff');setTimeout(rkDiaShow,900)}else if(r.status===409||r.status===403)rkS('dia',1)}catch(e){}}

/* ---------- CONTA: nome + senha, salva o progresso no servidor (append-only, assinado com a senha) ---------- */
const acTE=s=>new TextEncoder().encode(s),acHex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''),acNL=n=>String(n||'').toLowerCase().trim();
async function acId(n){return acHex(await crypto.subtle.digest('SHA-256',acTE('furia|acc|'+acNL(n)))).slice(0,24)}
async function acKey(n,pw){const b=await crypto.subtle.importKey('raw',acTE(pw),'PBKDF2',false,['deriveBits']);return acHex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:acTE('furia|'+acNL(n)),iterations:60000,hash:'SHA-256'},b,256))}
async function acSig(kh,m){const k=await crypto.subtle.importKey('raw',new Uint8Array(kh.match(/../g).map(h=>parseInt(h,16))),{name:'HMAC',hash:'SHA-256'},false,['sign']);return acHex(await crypto.subtle.sign('HMAC',k,acTE(m)))}
const acData=()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^(tw_|rk_)/.test(k))o[k]=localStorage.getItem(k)}return JSON.stringify(o)};
async function acList(acc){const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:'sv'},op:'EQUAL',value:{stringValue:acc}}},orderBy:[{field:{fieldPath:'__name__'},direction:'DESCENDING'}],limit:15}};
  const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('net');
  return (await r.json()).filter(x=>x.document).map(x=>{const f=x.document.fields||{};return {ts:+((f.ts||{}).integerValue||0),d:(f.d||{}).stringValue||'',sg:(f.sg||{}).stringValue||''}}).sort((a,b)=>b.ts-a.ts)}
async function acFind(acc,k,L){for(const x of L)if(x.sg&&x.sg===await acSig(k,acc+'|'+x.ts+'|'+x.d))return x;return null}
let acLastT=0,acBusy=0;
async function acSave(force){const k=localStorage.getItem('ac_k'),n=localStorage.getItem('ac_n');if(!k||!n||acBusy)return false;const d=acData(),hd=twHash(d);if(hd===localStorage.getItem('ac_h'))return true;if(!force&&Date.now()-acLastT<90000)return false;
  acBusy=1;try{const acc=await acId(n),ts=Date.now(),sg=await acSig(k,acc+'|'+ts+'|'+d),IV=v=>({integerValue:String(v)});
    const f={nome:{stringValue:n.slice(0,16)},andar:IV(0),tempo:IV(0),sv:{stringValue:acc},ts:IV(ts),d:{stringValue:d},sg:{stringValue:sg},v:IV(220)};
    const r=await twFetchT(TWURL+'/torre?documentId=sv_'+acc+'_'+ts.toString(36).padStart(9,'0')+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})});
    if(r.ok){localStorage.setItem('ac_h',hd);localStorage.setItem('ac_t',String(ts));acLastT=Date.now();return true}}catch(e){}finally{acBusy=0}return false}
setInterval(()=>acSave(),300000);document.addEventListener('visibilitychange',()=>{if(document.hidden)acSave(1)});
/* janela própria (funciona em qualquer tela) */
function acM(h){let M=document.getElementById('acM');if(!M){M=document.createElement('div');M.id='acM';document.body.appendChild(M)}if(h==null){M.hidden=true;M.innerHTML='';return}M.innerHTML=h;M.hidden=false}
const acT=t=>{const d=new Date(+t);return isNaN(d)||!+t?'—':d.toLocaleDateString('pt-BR')+' '+d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})};
function acOpen(tab){const n=localStorage.getItem('ac_n'),k=localStorage.getItem('ac_k'),me=String(twLS.g('tw_nome','')||'');tab=tab||(k?'ok':'novo');
  const tabs=`<div class="seg twTab">${k?`<button data-t="ok" aria-pressed="${tab==='ok'}">👤 MINHA CONTA</button>`:`<button data-t="novo" aria-pressed="${tab==='novo'}">✨ CRIAR CONTA</button>`}<button data-t="entrar" aria-pressed="${tab==='entrar'}">🔑 ENTRAR</button></div>`;
  let body='';
  if(tab==='ok')body=`<p class="twH ok">✔ Você JÁ ESTÁ CONECTADO na conta <b>${twEsc(n)}</b> neste aparelho. Não precisa entrar de novo — está tudo aqui e é salvo sozinho (a cada 5 min e ao sair do jogo).</p><p class="twH acRs">${(()=>{const rp=rkG('rp',0),ri=rkRank(rp);return `🏅 ${RKR[ri].n} · ${rkFmtN(rp)} XP · 💎 ${rkFmtN(rkG('gem',0))} · 👤 ${rkG('own',[]).length} personagens · 🪙 ${rkFmtN(twLS.g('tw_moedas',0)|0)} moedas`})()}</p><p class="twH">Último salvamento: <b id="acLt">${acT(localStorage.getItem('ac_t'))}</b></p><p class="twH">Em outro celular, toque em ENTRAR e use o mesmo nome e senha.</p><p class="twH" id="acE"></p><div class="row"><button class="btn main" id="acSv">💾 SALVAR AGORA</button><button class="btn" id="acOut">SAIR DA CONTA</button></div>`;
  else if(tab==='novo')body=me?`<p class="twH">Crie uma senha para o nome <b>${twEsc(me)}</b>. Assim você nunca perde a conta: é só entrar com nome e senha em qualquer aparelho.</p><input id="acP1" class="rkCdI" type="password" maxlength="32" placeholder="SENHA (mín. 4)"><input id="acP2" class="rkCdI" type="password" maxlength="32" placeholder="REPITA A SENHA"><p class="twH" id="acE"></p><div class="row"><button class="btn main" id="acNew">CRIAR CONTA</button></div>`
    :`<p class="twH err">Primeiro escolha seu nome (no Modo Torre, botão do nome). Depois volte aqui para criar a senha.</p><p class="twH">Já tem conta? Toque em ENTRAR.</p>`;
  else body=`<p class="twH">Entre com o nome e a senha da sua conta. O progresso deste aparelho será trocado pelo da conta.</p><input id="acN" class="rkCdI" maxlength="16" placeholder="NOME" value="${twEsc(n||me)}"><input id="acP" class="rkCdI" type="password" maxlength="32" placeholder="SENHA"><p class="twH" id="acE"></p><div class="row"><button class="btn main" id="acIn">ENTRAR</button></div>`;
  acM(`<div class="twM sm"><h3>👤 CONTA</h3>${tabs}${body}<div class="row"><button class="btn" id="acX">FECHAR</button></div></div>`);
  const E=()=>document.getElementById('acE'),msg=(t,c)=>{const e=E();if(e){e.className='twH '+(c||'');e.textContent=t}},B=id=>document.getElementById(id);
  B('acX').onclick=()=>acM(null);document.querySelectorAll('#acM .twTab button').forEach(b=>b.onclick=()=>acOpen(b.dataset.t));
  if(B('acSv'))B('acSv').onclick=async()=>{msg('Salvando...');localStorage.removeItem('ac_h');const ok=await acSave(1);msg(ok?'✔ Salvo!':'Sem internet agora. Tenta de novo.',ok?'ok':'err');if(ok)B('acLt').textContent=acT(localStorage.getItem('ac_t'))};
  if(B('acOut'))B('acOut').onclick=()=>{['ac_k','ac_n','ac_h','ac_t'].forEach(x=>localStorage.removeItem(x));acOpen('entrar')};
  if(B('acNew'))B('acNew').onclick=async()=>{const p=B('acP1').value,p2=B('acP2').value;if(p.length<4)return msg('A senha precisa de pelo menos 4 letras/números.','err');if(p!==p2)return msg('As senhas não são iguais.','err');
    B('acNew').disabled=true;msg('Criando conta...');try{const acc=await acId(me),L=await acList(acc);if(L.length){B('acNew').disabled=false;return msg('Esse nome já tem conta. Se a conta é sua, toque em 🔑 ENTRAR (em cima) e digite a senha.','err')}
      const k=await acKey(me,p);localStorage.setItem('ac_k',k);localStorage.setItem('ac_n',me);localStorage.removeItem('ac_h');const ok=await acSave(1);if(!ok){['ac_k','ac_n'].forEach(x=>localStorage.removeItem(x));B('acNew').disabled=false;return msg('Sem internet agora. Tenta de novo.','err')}
      try{rkSfx('powerUp')}catch(e){}acOpen('ok')}catch(e){B('acNew').disabled=false;msg('Sem internet agora. Tenta de novo.','err')}};
  if(B('acIn'))B('acIn').onclick=async()=>{const nn=B('acN').value.trim(),p=B('acP').value;if(!nn||!p)return msg('Digite o nome e a senha.','err');B('acIn').disabled=true;msg('Entrando...');
    try{const acc=await acId(nn),L=await acList(acc);if(!L.length){B('acIn').disabled=false;return msg('Conta não encontrada. Confira o nome.','err')}const k=await acKey(nn,p),x=await acFind(acc,k,L);if(!x){B('acIn').disabled=false;return msg('Senha errada.','err')}
      const D=JSON.parse(x.d);for(const kk of Object.keys(localStorage))if(/^(tw_|rk_)/.test(kk))localStorage.removeItem(kk);for(const kk in D)localStorage.setItem(kk,D[kk]);
      localStorage.setItem('ac_k',k);localStorage.setItem('ac_n',(()=>{try{return JSON.parse(D.tw_nome)}catch(e){return nn}})()||nn);localStorage.setItem('ac_h',twHash(acData()));localStorage.setItem('ac_t',String(x.ts));
      msg('✔ Conta carregada! Recarregando o jogo...','ok');setTimeout(()=>location.reload(),900)}catch(e){B('acIn').disabled=false;msg('Sem internet agora. Tenta de novo.','err')}}}

/* ================= MODO TORRE RANQUEADA (v228): mesma rank do Boss, dá mais XP, nova tela ================= */
/* v268: no torneio (TWEV.flat) a torre é igual para todos: rank mais baixo, sem bônus de rank */
const rkTwLv=()=>{try{if(TWEV.flat&&twEvSt()==='ao vivo')return 0}catch(e){}return rkLvl()};
const RKTWX={fl:.6,top:2,loss:.5},RKTB=i=>({dano:i*2,def:i*2,vel:i,crit:i,sorte:i*3}),rkSorte=()=>psSum().st+RKTB(rkLvl()).sorte+(twIsAdm()?60:0)+rkEqSt()+(tbOf(twTitOn()).st||0),rkEqSt=()=>{let v=0;try{const o=twEqOn();for(const k in o)v+=(o[k].st||0)*eqNf(o[k])}catch(e){}return Math.round(v)};
function rkTorre(){const s=rkG('sel','goku'),own=rkG('own',['goku']);G.pick=CH[s]&&own.includes(s)?s:'goku';G.gmode='torre';try{audioInit()}catch(e){}try{fsTry()}catch(e){}twOpen()}
/* dificuldade da Torre pelo rank (v231): leve no começo; bem mais difícil para chegar nos 2 últimos ranks */
const RKTD={dm:[1,1.05,1.1,1.15,1.22,1.4,1.55,1.65,1.75,1.85,2],hp:[1,1,1.1,1.15,1.25,1.4,1.55,1.65,1.75,1.85,2],sp:[1,1,1.02,1.04,1.06,1.1,1.14,1.16,1.18,1.2,1.22],ai:[0,0,0,0,0,1,1,1,1,1,1]};
function rkTwDiff(o){const i=rkTwLv();o.mhp=Math.max(1,Math.round(o.mhp/LAYER*RKTD.hp[i]))*LAYER;o.hp=o.hpLag=o.mhp;o.tdm*=RKTD.dm[i];o.tsp*=RKTD.sp[i];G.diff=Math.min(3,(G.diff||1)+RKTD.ai[i]);o.rkTd=i}
const rkTdTxt=i=>i?`Inimigos: dano +${Math.round((RKTD.dm[i]-1)*100)}% · vida +${Math.round((RKTD.hp[i]-1)*100)}% · vel. +${Math.round((RKTD.sp[i]-1)*100)}%${RKTD.ai[i]?' · IA mais esperta':''}`:'Inimigos normais';
function rkTwBuff(p){const B=RKTB(rkTwLv());p.tdm+=B.dano/100;p.tsp+=B.vel/100;p.tdf=p.tdf/(1+B.def/100);p.tcr=(p.tcr||0)+B.crit}
function rkTwXP(won,quit,andar){const lv=rkLvl(),parts=[];let d=0;
  if(andar>0){const a=Math.round(RKXW[lv]*RKTWX.fl)*andar;parts.push(['🏯 '+andar+' andar'+(andar>1?'es':''),a]);d+=a}
  if(won){const t=Math.round(RKXW[lv]*RKTWX.top);parts.push(['👑 TORRE COMPLETA',t]);d+=t}
  if(!andar){const l=-Math.round(RKXL[lv]*RKTWX.loss);parts.push([quit?'Desistiu':'Derrota no 1º andar',l]);d+=l}
  {const ev=rkEvX();if(ev&&d>0){const ex=d*(ev[2]-1);parts.push(['🔥 EVENTO '+ev[3],ex]);d+=ex}}
  const rp0=rkG('rp',0),r0=rkRank(rp0),rp1=Math.max(0,rp0+d);rkS('rp',rp1);const r1=rkRank(rp1);for(let i=0;i<=r1;i++)twGiveTit('rk'+i);try{rkSend({rp:rp1,dmg:0,t1:0,tt:0,won:0})}catch(e){}
  return {d:rp1-rp0,rp0,rp1,r0,r1,parts}}
function rkTwXPH(X){const ri=X.r1,up=X.r1>X.r0,dn=X.r1<X.r0;return `<div class="rkRp rtXpR">${rkEmb(ri,'sm'+(up?' up':dn?' down':''))}<div><b style="color:${RKR[ri].c}">${RKR[ri].n}${up?' ⬆ SUBIU DE RANK!':dn?' ⬇ CAIU DE RANK':''}</b><span>${X.d>=0?'+':''}${X.d} XP RANQUEADO · ${rkFmtN(X.rp1)}${ri<7?' / '+rkFmtN(RKXP[ri+1]):''} XP</span><i class="bar"><s style="width:${rkProg(X.rp1)}%;background:${RKR[ri].c}"></s></i></div></div><div class="rkXb">${X.parts.map(([t,v])=>`<span class="${/COMPLETA/.test(t)?'srv':''}">${t} <b>${v>=0?'+':''}${v}</b></span>`).join('')}</div>`}
const RTW=1671,RTH=941,rtB=(x0,y0,x1,y1)=>`left:${x0/RTW*100}%;top:${y0/RTH*100}%;width:${(x1-x0)/RTW*100}%;height:${(y1-y0)/RTH*100}%`;
const RTSLOT=[[1296,616,1510,687],[1296,532,1510,603],[1296,448,1510,519],[1296,365,1510,436],[1296,282,1510,352],[1296,198,1510,269],[1296,115,1510,187]];
const RTBN=[['dano',140,438,'⚔️'],['bars',312,438,'❤️'],['def',484,438,'🛡️'],['vel',140,488,'⚡'],['crit',312,488,'🎯'],['sorte',484,488,'🍀']];
function rkTwSkin(){const B=$('twBox');if(!B||B.dataset.rk)return;B.dataset.rk=1;B.classList.add('rkT');
  B.querySelector('.twArt').src=RQA.torre_rk;const bg=$('tower').querySelector('.twBg');if(bg)bg.style.backgroundImage=`url(${RQA.torre_rk})`;
  for(let i=0;i<TWN;i++){const [x0,y0,x1,y1]=RTSLOT[i];twSlot(i).setAttribute('style',rtB(x0,y0,x1,y1))}
  $('twGo').setAttribute('style',rtB(560,832,1112,914));$('twBack').setAttribute('style',rtB(36,846,300,914));
  const U=document.createElement('div');U.id='rtUI';
  U.innerHTML=`<button class="twHit" id="rtBack2" style="${rtB(4,8,128,90)}" aria-label="Voltar"></button>
    <button class="rtAv" id="rtAv" style="${rtB(80,188,202,310)}" aria-label="Seu rank"><img alt=""></button>
    <div class="rtNm" id="rtNm" style="${rtB(214,232,532,284)}"></div><button class="twHit" id="rtPick" style="${rtB(538,226,600,286)}" aria-label="Trocar personagem"></button>
    <div class="rtXp" style="${rtB(133,329,581,355)}"><s id="rtXpS"></s><b id="rtXpT"></b></div>
    ${RTBN.map(([k,x,y])=>`<b class="rtBn" id="rtB_${k}" style="${rtB(x+26,y,x+160,y+30)}"></b>`).join('')}
    <button class="twHit" id="rtRank" style="${rtB(65,553,187,646)}" aria-label="Ranking"></button>
    <button class="twHit" id="rtRw" style="${rtB(199,553,321,646)}" aria-label="Recompensas"></button>
    <button class="twHit" id="rtTemp" style="${rtB(333,553,455,646)}" aria-label="Temporada"><i id="rtEvDot"></i></button>
    <button class="twHit" id="rtRanks" style="${rtB(466,553,590,646)}" aria-label="Ranks"></button>
    <div class="rtRow" style="${rtB(48,676,604,770)}">${[['twBagB','🎒','EQUIPAR'],['twShB','🛒','LOJA'],['twTitB','👑','TÍTULOS'],['twChB','💬','CHAT'],['twNameB','✏️','NOME'],['twTrofB','🎖️','TROFÉUS']].map(([id,i,t])=>`<button data-c="${id}"><i>${i}</i><b>${t}</b></button>`).join('')}</div>
    <div class="rtCoin" style="${rtB(1436,10,1664,58)}">🪙 <b id="rtCoins"></b> · 💎 <b id="rtGems"></b></div>`;
  B.appendChild(U);
  const busy=()=>!$('twModal').hidden||TW.busy;
  $('rtBack2').onclick=twBackF;$('rtPick').onclick=()=>{if(busy())return;rkTwPick()};$('rtAv').onclick=()=>{if(busy())return;twSfx('whoosh');rkRewards()};
  $('rtRank').onclick=()=>$('twRankB').click();$('rtTemp').onclick=()=>$('twEvB').click();
  $('rtRw').onclick=()=>{if(busy())return;twSfx('whoosh');rkTwRw()};$('rtRanks').onclick=()=>{if(busy())return;twSfx('whoosh');rkRewards()};
  U.querySelectorAll('.rtRow button').forEach(b=>b.onclick=()=>$(b.dataset.c).click())}
function rkTwRender(){if(!$('rtUI'))return;const id=TW.pick,im=$('rtAv').querySelector('img'),src=RQA.rank[rkRank(rkG('rp',0))];if(im.getAttribute('src')!==src)im.src=src;
  const T=TWTIT[twTitOn()];$('rtNm').innerHTML=`<b class="rtTit" style="--c:${T?T.c:'#9fb0d0'}">${T?(T.i||'🏅')+' '+T.n:'SEM TÍTULO'}</b><small>🥷 ${CH[id]?CH[id].name:''} · toque na 🔍 para trocar</small>`;
  const rp=rkG('rp',0),ri=rkRank(rp);$('rtXpS').style.cssText=`width:${rkProg(rp)}%;background:linear-gradient(90deg,${RKR[ri].c},#fff8)`;$('rtXpT').innerHTML=`<span style="color:${RKR[ri].c}">${RKR[ri].n}</span> · ${rkFmtN(rp)}${ri<7?' / '+rkFmtN(RKXP[ri+1]):''} XP`;
  const B=RKTB(ri),adm=twIsAdm(),cr=(()=>{let c=0;const o=twEqOn();for(const k in o)c+=o[k].crit||0;return c})();
  const V={dano:B.dano+twEqB('dano')+(TW.pas.dano||0)+(adm?20:0),bars:TW.bars,def:B.def+twEqB('vida')+(TW.pas.vida||0),vel:B.vel+twEqB('vel')+(TW.pas.vel||0)+(adm?10:0),crit:5+cr+B.crit,sorte:rkSorte()};
  for(const [k] of RTBN){const e=$('rtB_'+k);if(e)e.innerHTML=k==='bars'?`${V.bars} <small>BARRAS</small>`:`+${V[k]}% <small>${{dano:'DANO',def:'DF',vel:'VEL',crit:'CRÍT',sorte:'ST'}[k]}</small>`}
  $('rtCoins').textContent=rkFmtN(twCoins());$('rtGems').textContent=rkFmtN(rkG('gem',0));
  {const d=$('twEvDot'),e=$('rtEvDot');if(d&&e)e.className=d.className}}
function rkTwPick(){const own=rkG('own',['goku']).filter(id=>CH[id]);if(TW.on){twToast('Desista ou termine a subida para trocar','#ff8080');return}
  twModal(`<div class="twM"><h3>ESCOLHA SEU LUTADOR</h3><p class="twH">Na Torre Ranqueada você luta com os personagens que tem no Ranqueado (ganhe mais no Gacha).</p><div class="rtCP">${own.map(id=>`<button data-c="${id}" class="${id===TW.pick?'on':''}"><img src="${IMG[id]?IMG[id].src:''}" alt=""><span>${CH[id].name}</span></button>`).join('')}</div><div class="row"><button class="btn" id="rtPX">FECHAR</button></div></div>`);
  $('rtPX').onclick=()=>twModal(null);document.querySelectorAll('#twModal .rtCP button').forEach(b=>b.onclick=()=>{const id=b.dataset.c;rkS('sel',id);G.pick=TW.pick=id;twSfx('powerUp');twModal(null);twRender()})}
function rkTwRw(){const ri=rkLvl(),w=RKXW[ri];
  twModal(`<div class="twM"><h3>🎁 RECOMPENSAS DA TORRE RANQUEADA</h3>
    <p class="twH">A Torre usa a <b>mesma rank do Modo Boss</b> e dá <b>mais XP</b>:</p>
    <div class="rkXb"><span>🏯 Cada andar vencido <b>+${Math.round(w*RKTWX.fl)} XP</b></span><span class="srv">👑 Completar os 7 <b>+${Math.round(w*RKTWX.top)} XP</b></span><span>💀 Cair no 1º andar <b>-${Math.round(RKXL[ri]*RKTWX.loss)} XP</b></span>${rkEvX()?`<span class="srv">🔥 EVENTO ${rkEvX()[3]}</span>`:''}</div>
    <p class="twH">Também: 🪙 moedas por vitória, baús e equipamentos, troféus 🏆 e passivas entre os andares.</p>
    <p class="twH">⚠️ <b>Dificuldade no seu rank:</b> ${rkTdTxt(ri)}. Fica um pouco mais difícil a cada rank e <b>bem mais difícil</b> do Lendário para cima (para chegar no Dragão Lendário e na Divindade).</p><h3 style="font-size:1.2em">BÔNUS DE RANK (vale em toda luta da Torre)</h3>
    <table class="rkTx"><tr><th>Rank</th><th>⚔️ Dano</th><th>🛡️ Defesa</th><th>⚡ Vel.</th><th>🎯 Crít.</th><th>🍀 Sorte</th><th>👹 Inimigos</th></tr>${RKR.map((R,i)=>{const B=RKTB(i);return `<tr style="${i===ri?'background:#2a2008':''}"><td style="color:${R.c}">${i===ri?'▶ ':''}${R.n}</td><td>+${B.dano}%</td><td>+${B.def}%</td><td>+${B.vel}%</td><td>+${B.crit}%</td><td>+${B.sorte}%</td><td style="color:${i>=5?'#ff6a6a':'#cdd6ea'}">+${Math.round((RKTD.dm[i]-1)*100)}%</td></tr>`}).join('')}</table>
    <p class="twH">🍀 Sorte = chance de baús, passivas e equipamentos virem de raridade melhor.</p><div class="row"><button class="btn" id="rtRwX">FECHAR</button></div></div>`);$('rtRwX').onclick=()=>twModal(null)}

/* ---------- v230: espadas dos campeões do 1º Torneio viram ITENS ÚNICOS (+25% dano, +15% crít, +5% sorte, brilho) ---------- */
const RKUNQ={v:25,crit:15,st:5,uniq:1};
function rkUniqFix(){try{const I=twInv();let ch=0;for(const x of I){if((x.ev==='ev20261108'||String(x.id).startsWith('evev20261108'))&&!x.uniq){Object.assign(x,RKUNQ);ch=1}}if(ch)twLS.s('tw_inv',I)}catch(e){}}
setTimeout(rkUniqFix,400);
/* loja: poção cabe se tiver pilha da mesma poção com menos de 99, ou espaço livre */
function twPocFits(R){const k='p|'+R.k+'|'+R.v,S=twStacks();return S.some(x=>x.key.split('#')[0]===k&&x.n<99)||S.length<TWBAG}

/* ---------- v232: ECONOMIA DE LEITURAS do servidor (plano grátis: 50 mil leituras/dia) ----------
   cache das consultas (rankings/títulos/recordes guardados por alguns minutos, também no aparelho) + se o servidor disser "limite atingido" (429), para de consultar por 15 min e usa o que tem guardado */
const _twFetchT=twFetchT,RKQC={};let RKQ429=0;
const RKQT=b=>/"(mk[xpsv]?|avs)"/.test(b)?20e3:/"pf[uh]"/.test(b)?300e3:/"claim"/.test(b)?6*3600e3:/"(gh|ch)"/.test(b)?25e3:/"on"/.test(b)?250e3:/"(sv|nome|nomeL|uid)"/.test(b)?0:/"(rkr|orderBy)"/.test(b)?600e3:/"(sem|ev)"/.test(b)?600e3:300e3;
twFetchT=function(url,o,ms){if(!/:runQuery/.test(url)||!o||!o.body)return _twFetchT(url,o,ms);const b=o.body,ttl=RKQT(b),now=Date.now(),mk=t=>new Response(t,{status:200,headers:{'Content-Type':'application/json'}});
  let c=RKQC[b];if(!c&&ttl>=180e3){try{const x=localStorage.getItem('qc_'+twHash(b));if(x)c=RKQC[b]=JSON.parse(x)}catch(e){}}
  if(c&&(now-c.t<ttl||now<RKQ429))return Promise.resolve(mk(c.v));
  if(now<RKQ429)return Promise.resolve(new Response('[]',{status:429}));
  return _twFetchT(url,o,ms).then(async r=>{if(r.status===429){if(!RKQ429)setTimeout(()=>{try{(showScreen.cur==='tower'?twToast:rkToast)('⏳ Servidor no limite de hoje: rankings e chat voltam mais tarde','#ffb060')}catch(e){}},300);RKQ429=Date.now()+15*60e3;if(c)return mk(c.v);return r}
    if(!r.ok||!ttl)return r;const v=await r.text();RKQC[b]={t:Date.now(),v};if(ttl>=180e3){try{localStorage.setItem('qc_'+twHash(b),JSON.stringify(RKQC[b]))}catch(e){}}return mk(v)})};

/* abre vários lotes de baús em sequência (ex.: código com 6 míticos + 7 lendários) */
async function rkBauSeq(L){for(const B of L){if(showScreen.cur==='ranked'||showScreen.cur==='tower'){const t0=Date.now();await rkBau(B);/* espera os baús automáticos do lote anterior terminarem (senão abririam o próximo lote) */const w=t0+1500+B.n*800-Date.now();if(w>0)await new Promise(r=>setTimeout(r,w))}else{twBauOpen(B);break}}}
/* ================= v235: PERFIL + HISTÓRICO (artes do dono, menu principal → Perfil) =================
   Dados só no aparelho (entram no save da conta porque começam com rk_): rk_pf (estatísticas), rk_use (lutas por personagem),
   rk_rkmax (maior rank já alcançado), rk_foto (foto do perfil, jpg pequeno), rk_ped (personagem do pedestal, '' = o mais usado).
   Servidor: só o TOP (mesma consulta em cache do ranking RANK). */
const pfD=()=>{const o=rkG('pf',{});if(o.tw==null){const H=twLS.g('tw_hist',[])||[];o.tw=H.length;o.twc=H.filter(r=>r&&r.andar>=TWN).length}if(o.farm==null)o.farm=Math.round((rkG('gem',0)|0)+(rkG('red',0)|0)*3+(twLS.g('tw_moedas',0)|0)/10+((rkSt().spins||0)*45));return o},pfSv=o=>rkS('pf',o);
const PFF={hit:0,crit:0};
function pfMaxUp(rp){const i=rkRank(rp|0);if(i>(twLS.g('rk_rkmax',-1)|0))twLS.s('rk_rkmax',i)}
const pfRkMax=()=>Math.max(twLS.g('rk_rkmax',0)|0,rkLvl());
function pfFarm(n){const o=pfD();o.farm=(o.farm||0)+n;pfSv(o)}
function pfMoedas(){const m=twLS.g('tw_moedas',0)|0,o=pfD();if(o.mo!=null&&m>o.mo)o.farm=(o.farm||0)+(m-o.mo)/10;o.mo=m;pfSv(o)}
const pfEma=(a,v,k)=>a==null?v:a+(v-a)*k;
function pfFight(x){const o=pfD();o.n=(o.n||0)+1;o.cmb=pfEma(o.cmb,x.cmb||0,.2);if(x.frac!=null)o.df=pfEma(o.df,x.frac,.25);if(x.tw){if(x.won)o.twf=(o.twf||0)+1;else o.twl=(o.twl||0)+1}
  o.hit=(o.hit||0)+PFF.hit;o.crit=(o.crit||0)+PFF.crit;PFF.hit=PFF.crit=0;pfSv(o)}
/* ganchos: lutas por personagem, acertos/críticos do jogador 1, andares e subidas da Torre */
{const _sm=startMatch;startMatch=function(){PFF.hit=PFF.crit=0;try{if(G.gmode!=='treino'&&G.pick&&CH[G.pick]){const U=rkG('use',{});U[G.pick]=(U[G.pick]||0)+1;rkS('use',U)}}catch(e){}return _sm.apply(this,arguments)}}
{const _ah=applyHit;applyHit=function(a,d,h){const r=_ah.apply(this,arguments);if(r&&G.p&&a===G.p[0]&&!a.cpu&&d!==a)PFF.hit++;return r}}
{const _cf=critFx;critFx=function(a,d,h){if(G.p&&a===G.p[0]&&!a.cpu)PFF.crit++;return _cf.apply(this,arguments)}}
{const _ta=twAfter;twAfter=function(w){try{pfFight({cmb:(TW.fs||{}).cmb||0,won:w===0,tw:1})}catch(e){}return _ta.apply(this,arguments)}}
{const _tf=twFinish;twFinish=function(won,quit){try{if(won||TW.fl>0||!quit){const o=pfD();o.tw=(o.tw||0)+1;if(won)o.twc=(o.twc||0)+1;pfSv(o)}pfMoedas()}catch(e){}return _tf.apply(this,arguments)}}
const pfTop3=()=>Object.entries(rkG('use',{})).filter(([id])=>CH[id]).sort((a,b)=>b[1]-a[1]).slice(0,3);
const pfPed=()=>{const p=rkG('ped','');if(p&&CH[p])return p;const t=pfTop3()[0];if(t)return t[0];const s=rkG('sel','goku');return CH[s]?s:'goku'};
const pfCl=v=>Math.max(4,Math.min(100,Math.round(v)));
/* "nível de habilidade" (radar): mistura como ele joga (lutas ranqueadas) com a build (equipamentos + bônus do rank) */
function pfRadar(){const o=pfD(),ri=rkLvl(),rp=rkG('rp',0),B=RKTB(ri),q=twEqOn();let ec=0;for(const k in q)ec+=(q[k]&&q[k].crit)||0;
  const bc=5+ec+B.crit,rc=(o.hit||0)>=30?(o.crit||0)/o.hit*100:bc,crit=(bc+rc)/2;
  const bd=(twEqB('dano')||0)+B.dano,df=o.df!=null?o.df:(rkSt().wins?.5:.2);
  const id=pfTop3()[0]?pfTop3()[0][0]:pfPed(),wk=(CH[id]&&CH[id].walk>2?CH[id].walk:4.4),bv=(twEqB('vel')||0)+B.vel;
  const fm=o.farm||0;
  return [
    {k:'crit',n:'CRÍTICO',v:pfCl(crit/35*100),t:`Chance de crítico da build ${Math.round(bc)}% · críticos de verdade ${(o.hit||0)>=30?Math.round(rc)+'%':'(poucas lutas ainda)'}`},
    {k:'dano',n:'DANO',v:pfCl(df*65+Math.min(1,bd/60)*35),t:`Dano médio no Broly ${Math.round(df*100)}% da vida dele · bônus de dano +${Math.round(bd)}%`},
    {k:'vel',n:'VELOCIDADE',v:pfCl(15+45*Math.max(0,Math.min(1,(wk-3.9)/1))+40*Math.min(1,bv/35)),t:`Velocidade do personagem que mais usa (${CH[id]?CH[id].name:'—'}) · bônus de velocidade +${Math.round(bv)}%`},
    {k:'rank',n:'RANK',v:pfCl((ri+rkProg(rp)/100)/(RKTOP+1)*100),t:`${RKR[ri].n} · ${rkFmtN(rp)} XP`},
    {k:'combo',n:'COMBO',v:pfCl((o.cmb||0)/30*100),t:`Maior combo por luta (média recente): ${Math.round(o.cmb||0)} golpes`},
    {k:'farm',n:'FARM',v:pfCl(Math.log10(1+fm)/Math.log10(30001)*100),t:`Tudo que já juntou: 💎, 🔴 e 🪙 (${rkFmtN(fm)} pontos)`}]}
const PFRV=[[1331,316],[1478,404],[1478,567],[1331,648],[1193,570],[1184,407]],PFRC=[1331,482];
/* dados do perfil (o seu = pfMine; de outro jogador = PFO, vindo do servidor) */
function pfMine(){try{pfMoedas();pfMaxUp(rkG('rp',0))}catch(e){}const S=rkSt(),o=pfD(),rec=Object.entries(S.rec||{}).filter(e=>e[1]>0).sort((a,b)=>a[1]-b[1])[0];
  const n=twLS.g('tw_nome',''),VT=pfVit().map(e=>e&&{t:e.t,r:e.r,v:e.v,nm:e.nm||'',img:e.img||'',uniq:e.uniq?1:0,crit:e.crit||0,dmg:e.dmg||0,vel:e.vel||0,st:e.st||0,def:e.def||0,fdmg:e.fdmg||0,trf:e.trf||0,drop:e.drop||0,yt:e.yt?1:0,ysec:e.ysec?1:0,ps:e.ps||null});
  return {uid:twUid(),mold:mdCur(),nome:n,tit:twTitOn(),rp:rkG('rp',0)|0,mx:pfRkMax(),foto:rkG('foto',''),vit:VT,ped:pfPed(),R:pfRadar().map(r=>({n:r.n,v:r.v,t:r.t})),
    h:{pt:rkPl(S)+(o.twf||0)+(o.twl||0),vw:(S.wins||0)+(o.twf||0),tw:o.tw||0,twc:o.twc||0,twf:o.twf||0,wins:S.wins||0,loss:S.loss||0,own:rkG('own',['goku']).filter(id=>CH[id]).length,tt:S.tt||0,rl:rec?(+rec[0]):-1}}}
let PFO=null,PFRET=null;
const pfCur=()=>PFO||pfMine();
function pfH(){const D=pfCur(),me=!PFO,n=D.nome||'',adm=!!n&&n.toLowerCase()===String(TWADMN).toLowerCase(),t=D.tit,ri=rkRank(D.rp),mx=Math.max(ri,D.mx|0),VT=D.vit||[],ped=CH[D.ped]?D.ped:'goku',foto=PFO&&PFO.fh?'':D.foto;
  const RC=[[397,748],[597,748],[796,748]];
  return `<button class="hs" data-a="back" style="${rkB2(40,0,200,100)}"></button>
  <button class="hs pfTab" data-a="pf" style="${rkB2(10,145,280,225)}"></button><button class="hs pfTab" data-a="hs" style="${rkB2(10,240,262,320)}"></button>
  ${me?'':`<div class="pfOth" style="${rkB2(560,8,1150,70)}">👀 PERFIL DE <b>${twEsc(n||'?')}</b>${PFO.old?'<small>ainda não atualizou o jogo</small>':''}</div>`}
  ${mdH(D.mold,290,170,490,382,438)}<button class="pfFoto${me?'':' ro'}" data-a="pfFoto" style="${rkB2(297,177,483,375)}">${foto?`<img src="${foto}" alt="">${me?'<em>✎</em>':''}`:me?`<span><i>📷</i>FOTO</span>`:`<span class="h"><i>👤</i>${PFO&&PFO.fh?'FOTO<br>ESCONDIDA':''}</span>`}</button>
  <div class="pfNm${adm?' adm':''}" style="${rkB2(515,225,1120,283)}">${n?twEsc(n):'<i>SEM NOME</i>'}</div>
  <button class="pfTi${me?'':' ro'}" data-a="pfTit" style="${rkB2(540,317,1065,376)}">${me||t?pfTitH(t,n,adm):'<i>SEM TÍTULO</i>'}</button>
  ${pfRkH(ri,rkB2(391,465,531,605))}${pfRkH(mx,rkB2(667,465,807,605))}
  <div class="pfCap" style="${rkB2(343,618,578,640)}"><b style="color:${RKR[ri].c}">${RKR[ri].n}</b> · ATUAL</div>
  <div class="pfCap" style="${rkB2(620,618,855,640)}"><b style="color:${RKR[mx].c}">${RKR[mx].n}</b> · MÁXIMO</div>
  ${RC.map(([x,y],i)=>{const e=VT[i],ri2=e?Math.max(0,TWRK.indexOf(e.r)):0,c=e?rkItC(e):'#7a5cc8';return `<button class="pfV${e?' on r'+ri2:''}${e&&e.uniq?' uq':''}${rkYC(e)}" data-a="pfVit" data-i="${i}" style="${rkB2(x-56,y-56,x+56,y+56)};--c:${c}">${e?`<i class="g"></i><i class="ry"></i><img src="${rkItIc(e)}" alt=""><b>+${rkItV(e)}%</b>`:me?'<span>＋</span>':''}</button><div class="pfCap sm" style="${rkB2(x-96,852,x+96,876)}">${e?`<b style="color:${e.uniq?'#fff0a0':c}">${e.uniq?'✦ ':''}${twEsc(rkItNm(e))}${e.nm?'':' '+(TWEQR.find(q=>q.k===e.r)||TWEQR[0]).n}</b>`:me?'toque para mostrar um item':'—'}</div>`}).join('')}
  <button class="pfPed" data-a="${me?'pfPick':''}" style="${rkB2(1070,130,1550,650)}"><img src="${fullSrc(ped)}" alt=""></button>
  <div class="pfPedN" style="${rkB2(1110,860,1510,905)}">${CH[ped]?CH[ped].name:''}</div>
  ${me?`<button class="pfLupa" data-a="pfPick" style="${rkB2(1585,665,1657,737)}" title="Trocar personagem">🔍</button>`:''}`}
function pfOn(){clearInterval(rkView.iv);if(!PFO)setTimeout(()=>pfPub(1),400)}
function hsH(){const D=pfCur(),H=D.h,R=D.R,tot=['yuta',...RK_MIT,...RK_LEG,...RK_EPI].filter(id=>CH[id]).length,tx=H&&H.pt?Math.round(H.vw/H.pt*100):0,N=v=>H?rkFmtN(v||0):'—';
  const pts=R?R.map((r,i)=>{const [vx,vy]=PFRV[i];return [PFRC[0]+(vx-PFRC[0])*r.v/100,PFRC[1]+(vy-PFRC[1])*r.v/100].map(Math.round).join(',')}).join(' '):'';
  const CHP=[[1428,282],[1548,418],[1548,642],[1400,728],[1150,694],[1138,482]];
  return `<button class="hs" data-a="back" style="${rkB2(40,0,200,90)}"></button>
  <button class="hs pfTab" data-a="pf" style="${rkB2(15,160,270,240)}"></button><button class="hs pfTab" data-a="hs" style="${rkB2(15,265,280,350)}"></button>
  ${PFO?`<div class="pfOth hs2" style="${rkB2(800,20,1400,80)}">👀 <b>${twEsc(D.nome||'?')}</b></div>`:''}
  <div class="hsC" style="${rkB2(362,268,542,368)};--c:#ff5ce0"><b>${H?rkFmtN(H.pt):'—'}</b></div>
  <div class="hsC" style="${rkB2(615,268,795,368)};--c:#ffc531"><b>${H?tx+'%':'—'}</b></div>
  <div class="hsC" style="${rkB2(867,268,1047,368)};--c:#2ee6ff"><b id="hsTop">…</b></div>
  <button class="hsV" data-a="hsInfo" data-k="tw" style="${rkB2(572,528,688,594)}">${N(H&&H.tw)}</button>
  <button class="hsV" data-a="hsInfo" data-k="boss" style="${rkB2(950,528,1078,594)}">${N(H&&H.wins)}</button>
  <button class="hsV sm" data-a="hsInfo" data-k="chr" style="${rkB2(612,648,690,714)}">${H?H.own+'<small>/'+tot+'</small>':'—'}</button>
  <button class="hsV sm" data-a="hsInfo" data-k="rec" style="${rkB2(1005,648,1090,714)}">${H&&H.tt?twFmt(H.tt):'--:--'}</button>
  ${R?`<svg class="hsRad" viewBox="0 0 1671 941" preserveAspectRatio="none" style="left:0;top:0;width:100%;height:100%"><polygon points="${pts}"/>${pts.split(' ').map(p=>`<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="7"/>`).join('')}</svg>
  ${R.map((r,i)=>`<div class="hsChip" style="${rkB2(CHP[i][0]-34,CHP[i][1]-17,CHP[i][0]+34,CHP[i][1]+17)}">${r.v|0}</div>`).join('')}
  <button class="hs" data-a="pfRadar" style="${rkB2(1110,240,1620,770)}"></button>`:''}`}
function hsOn(){clearInterval(rkView.iv);const u=pfCur().uid;rkLoadRk('rp').then(A=>{A.sort((a,b)=>b.rp-a.rp);const i=A.findIndex(e=>e.uid===u),E=$('hsTop');if(E)E.textContent=i>=0?'#'+(i+1):A.length>=150?'150+':'—'}).catch(()=>{const E=$('hsTop');if(E)E.textContent='—'})}
function hsInfo(k){const D=pfCur(),H=D.h;if(!H)return rkToast('Esse jogador ainda não atualizou o jogo','#cfd6ea');
  rkToast({tw:`🏯 ${H.tw} subidas · ${H.twc} completas · ${H.twf} andares vencidos`,boss:`💀 ${H.wins} vitórias · ${H.loss} derrotas contra o Broly`,chr:`🧑 ${H.own} personagens no ranqueado`,rec:H.tt?`🏆 Vitória mais rápida no Boss: ${twFmt(H.tt)}${H.rl>=0?' (nível '+(H.rl+1)+')':''}`:'🏆 Ainda não venceu o Broly'}[k]||'','#ffe9a0')}
function pfRadarInfo(){const R=pfCur().R;if(!R)return;rkModal(`<div class="twM pfRI"><h3>📊 NÍVEL DE HABILIDADE</h3><p class="twH">Atualiza sozinho a cada luta ranqueada (Boss e Torre), sem gastar o servidor.</p>${R.map(r=>`<div><b>${r.n}</b><i class="bar"><s style="width:${r.v}%"></s></i><em>${r.v}</em><span>${twEsc(r.t)}</span></div>`).join('')}<div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
function pfFotoM(){const f=rkG('foto','');rkModal(`<div class="twM pfFM"><h3>FOTO DE PERFIL</h3><div class="pfFMb"><button class="btn main" id="pfF1">📷 TROCAR FOTO</button><button class="btn" id="pfF2">🖼️ MOLDURA</button>${f?'<button class="btn" id="pfF3">🗑️ TIRAR FOTO</button>':''}</div><p class="twH">Escolha uma foto do celular. Ela fica pequena para não pesar e vai junto no save da sua conta.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('pfF2').onclick=()=>mdPick();if($('pfF3'))$('pfF3').onclick=()=>{rkS('foto','');rkModal(null);rkView('pf')};
  $('pfF1').onclick=()=>{const I=document.createElement('input');I.type='file';I.accept='image/*';I.style.display='none';document.body.appendChild(I);I.onchange=()=>{const F=I.files&&I.files[0];I.remove();if(F)pfCrop(F)};I.click()}}
function pfFotoLoad(F){const u=URL.createObjectURL(F),im=new Image();im.onload=()=>{try{const w=im.naturalWidth,h=im.naturalHeight,s=Math.min(w,h),c=document.createElement('canvas');c.width=c.height=200;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,200,200);x.drawImage(im,(w-s)/2,(h-s)/2,s,s,0,0,200,200);
    let q=.82,d=c.toDataURL('image/jpeg',q);while(d.length>40000&&q>.35){q-=.12;d=c.toDataURL('image/jpeg',q)}rkS('foto',d);rkModal(null);rkView('pf');rkSfx('powerUp');rkToast('📷 Foto atualizada!','#7dff9a')}catch(e){rkToast('Não deu para usar essa imagem','#ff8080')}URL.revokeObjectURL(u)};
  im.onerror=()=>{URL.revokeObjectURL(u);rkToast('Não deu para abrir essa imagem','#ff8080')};im.src=u}
function pfTitM(){rkOverTw(twTitles).then(()=>{if(RKV==='pf'&&showScreen.cur==='ranked')rkView('pf')})}
function pfPick(){const own=rkG('own',['goku']).filter(id=>CH[id]),cur=rkG('ped',''),U=rkG('use',{});
  rkModal(`<div class="twM"><h3>PERSONAGEM DO PEDESTAL</h3><p class="twH">Escolha quem fica em pé no seu perfil. AUTOMÁTICO = o que você mais usa.</p><div class="rtCP pfCP"><button data-c="" class="${cur?'':'on'}"><i>⭐</i><span>AUTOMÁTICO</span></button>${own.map(id=>`<button data-c="${id}" class="${id===cur?'on':''}"><img src="${IMG[id]?IMG[id].src:''}" alt=""><span>${CH[id].name}</span><small>${U[id]||0} lutas</small></button>`).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);document.querySelectorAll('#rkModal .pfCP button').forEach(b=>b.onclick=()=>{rkS('ped',b.dataset.c);rkSfx('powerUp');rkModal(null);rkView('pf')})}
/* ---------- v236: tela cheia, recorte da foto, vitrine de equipamentos, ranks mais brilhantes, título ADM ---------- */
/* vitrine: 3 equipamentos que o jogador escolhe mostrar (rk_vit = ids da mochila) */
const pfVit=()=>{const I=twInv(),V=rkG('vit',[]);return [0,1,2].map(i=>I.find(x=>x.id===V[i])||null)};
function pfVitPick(slot){const I=twInv(),V=rkG('vit',[]),seen=new Set(),L=[];for(const x of I.slice().sort((a,b)=>(b.uniq?9:0)-(a.uniq?9:0)||(TWRK.indexOf(b.r)-TWRK.indexOf(a.r))||(b.v-a.v))){const k=twStKey(x);if(seen.has(k))continue;seen.add(k);L.push(x)}
  rkModal(`<div class="twM rkEq"><h3>🏅 VITRINE ${slot+1}/3</h3><p class="twH">Escolha um equipamento para mostrar no perfil. Quanto mais raro, mais ele brilha.</p><div class="eqG pfVG">${V[slot]?'<button class="eqI" data-v=""><i style="font-size:2.6em;font-style:normal">✖</i><span>TIRAR</span></button>':''}${L.length?L.map(x=>`<button class="eqI${x.uniq?' uniq':''}${x.id===V[slot]?' sel':''}${rkYC(x)}" data-v="${x.id}" style="--c:${rkItC(x)}"><img src="${rkItIc(x)}" alt=""><b>+${rkItV(x)}%</b><span>${rkItNm(x)}</span></button>`).join(''):'<p class="twH">Você ainda não tem equipamentos. Ganhe no Boss, na Torre e no Gacha!</p>'}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);document.querySelectorAll('#rkModal .pfVG button').forEach(b=>b.onclick=()=>{const V=rkG('vit',[]).slice(0,3);while(V.length<3)V.push(null);const id=b.dataset.v||null;for(let j=0;j<3;j++)if(id&&V[j]===id)V[j]=null;V[slot]=id;rkS('vit',V);rkSfx(id?'powerUp':'whoosh');rkModal(null);rkView('pf')})}
/* rank: quanto mais alto, mais efeitos (0 Madeira … 7 Divindade) */
function pfRkH(i,st){return `<div class="pfRk t${i}${i>7?' t7 tdv':''}" style="${st};--c:${RKR[i].c};--k:${Math.min(1,i/7).toFixed(2)}"><i class="rg"></i>${i>=2?'<i class="ry2"></i>':''}${i>=4?'<i class="orb"><s></s><s></s><s></s></i>':''}${i>=6?'<i class="fl"></i>':''}${rkEmb(i,'ban')}${i>=5?'<i class="sk"><s></s><s></s><s></s><s></s></i>':''}</div>`}
/* título: placa grande; ADM com coroa, ouro animado e brilhos */
function pfTitH(t,n,adm){if(!t)return '<i>SEM TÍTULO · toque para escolher</i>';
  if(t==='adm'){if(!adm)return '<i>SEM TÍTULO · toque para escolher</i>';return `<span class="pfAdm"><i class="cr">👑</i><b>ADM</b><em>ADMINISTRADOR</em><i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✦</i><i class="sw"></i></span>`}
  const T=TWTIT[t];if(!T)return '';return `<span class="pfTt" style="--c:${T.c}">${T.rk!=null?`<img src="${RQA.rank[T.rk]}" alt="">`:`<i>${T.i}</i>`}<b>${T.n}</b><i class="sw"></i></span>`}
/* recorte da foto: arrastar = mover, barra / 2 dedos / roda = zoom */
function pfCrop(F){const u=URL.createObjectURL(F),im=new Image();im.onerror=()=>{URL.revokeObjectURL(u);rkToast('Não deu para abrir essa imagem','#ff8080')};
  im.onload=()=>{const w=im.naturalWidth,h=im.naturalHeight;if(!w||!h){URL.revokeObjectURL(u);return}
    rkModal(`<div class="twM pfCrop"><h3>✂️ RECORTAR FOTO</h3><div class="pfCw"><div class="pfCv"><canvas id="pfCv" width="560" height="560"></canvas><i class="fr"></i></div><div class="pfCs"><p class="twH">Arraste a foto para escolher a parte.<br>Zoom: barra, 2 dedos ou roda do mouse.</p><label>🔍 ZOOM<input type="range" id="pfZ" min="1" max="5" step="0.01" value="1"></label><div class="pfPv"><canvas id="pfPv" width="200" height="200"></canvas><small>assim vai ficar</small></div></div></div><div class="row"><button class="btn main" id="pfCok">✔ USAR ESTA PARTE</button><button class="btn" id="pfCx">CANCELAR</button></div></div>`);
    const C=$('pfCv'),X=C.getContext('2d'),P=$('pfPv'),PX=P.getContext('2d'),Z=$('pfZ'),S=560;let z=1,cx=w/2,cy=h/2;
    const sw=()=>Math.min(w,h)/z,clamp=()=>{const q=sw();cx=Math.max(q/2,Math.min(w-q/2,cx));cy=Math.max(q/2,Math.min(h-q/2,cy))};
    const draw=()=>{clamp();const q=sw();X.fillStyle='#000';X.fillRect(0,0,S,S);X.drawImage(im,cx-q/2,cy-q/2,q,q,0,0,S,S);PX.clearRect(0,0,200,200);PX.drawImage(C,0,0,S,S,0,0,200,200)};
    const zoom=nz=>{z=Math.max(1,Math.min(5,nz));Z.value=z;draw()};draw();
    Z.oninput=()=>zoom(+Z.value);C.onwheel=e=>{e.preventDefault();zoom(z*(e.deltaY<0?1.1:1/1.1))};
    const pts=new Map();let pd=0;C.style.touchAction='none';
    C.onpointerdown=e=>{try{C.setPointerCapture(e.pointerId)}catch(_){}pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===2){const [a,b]=[...pts.values()];pd=Math.hypot(a.x-b.x,a.y-b.y)}};
    C.onpointermove=e=>{const o=pts.get(e.pointerId);if(!o)return;const k=sw()/C.clientWidth;if(pts.size===1){cx-=(e.clientX-o.x)*k;cy-=(e.clientY-o.y)*k;o.x=e.clientX;o.y=e.clientY;draw()}else{o.x=e.clientX;o.y=e.clientY;const [a,b]=[...pts.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pd)zoom(z*d/pd);pd=d}};
    C.onpointerup=C.onpointercancel=e=>{pts.delete(e.pointerId);pd=0};
    $('pfCx').onclick=()=>{URL.revokeObjectURL(u);rkModal(null)};
    $('pfCok').onclick=()=>{try{const c=document.createElement('canvas');c.width=c.height=200;const q=sw(),x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,200,200);x.drawImage(im,cx-q/2,cy-q/2,q,q,0,0,200,200);
      let qq=.85,d=c.toDataURL('image/jpeg',qq);while(d.length>40000&&qq>.35){qq-=.12;d=c.toDataURL('image/jpeg',qq)}rkS('foto',d);URL.revokeObjectURL(u);rkModal(null);rkView('pf');rkSfx('powerUp');rkToast('📷 Foto atualizada!','#7dff9a')}catch(e){rkToast('Não deu para usar essa imagem','#ff8080')}}};
  im.src=u}
/* ================= v237: ver o PERFIL de outros jogadores (toque no ranking do ranqueado ou nos chats) =================
   Publicação: doc torre/pf_<hash uid>_<ts36> com pfu=uid e d=JSON do perfil (as regras só deixam criar; vale o mais novo).
   Publica ao abrir o próprio perfil (se mudou) e no máximo a cada 30 min depois das lutas/ao abrir o jogo.
   Leitura: 1 consulta (pfu==uid, __name__ DESC, limit 1) + 1 do "esconder foto" do ADM (pfh), as duas em cache de 5 min. */
let pfPubBusy=0;
async function pfPub(force){const n=twLS.g('tw_nome','');if(!n||pfPubBusy)return;let D;try{D=pfMine()}catch(e){return}delete D.uid;D.v=237;const s=JSON.stringify(D),h=twHash(s);
  if(h===localStorage.getItem('pfpub_h'))return;const lt=+localStorage.getItem('pfpub_t')||0;if(!force&&Date.now()-lt<30*60e3)return;
  pfPubBusy=1;try{const u=twUid(),ts=Date.now(),IV=v=>({integerValue:String(v)});const f={nome:{stringValue:n.slice(0,16)},andar:IV(0),tempo:IV(0),uid:{stringValue:u},pfu:{stringValue:u},d:{stringValue:s},v:IV(237)};
    const r=await twFetchT(TWURL+'/torre?documentId=pf_'+twHash(u)+'_'+ts.toString(36).padStart(9,'0')+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})});
    if(r.ok){localStorage.setItem('pfpub_h',h);localStorage.setItem('pfpub_t',String(ts))}}catch(e){}finally{pfPubBusy=0}}
setTimeout(()=>pfPub(0),15000);
{const _pf=pfFight;pfFight=function(x){_pf(x);setTimeout(()=>pfPub(0),4000)}}
async function pfLast(field,val){const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:field},op:'EQUAL',value:{stringValue:val}}},orderBy:[{field:{fieldPath:'__name__'},direction:'DESCENDING'}],limit:1}};
  const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);
  const j=await r.json(),x=(Array.isArray(j)?j:[]).find(x=>x&&x.document);if(!x)return null;const F=x.document.fields||{},e={};for(const k in F){const v=F[k];e[k]=v.stringValue!=null?v.stringValue:v.integerValue!=null?+v.integerValue:v.doubleValue}return e}
/* tudo que vem do servidor passa por aqui (nada de HTML/links estranhos) */
const PFIMG=/^(a\/[\w.-]+\.(webp|png|jpg)|data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+\/=]+)$/;
function pfClean(o,uid,nome){const N=(v,mx)=>Math.max(0,Math.min(mx||1e9,+v||0))|0,S=(v,l)=>String(v==null?'':v).slice(0,l||40);
  return {uid,mold:MDL[o.mold]?o.mold:'',nome:S(nome||o.nome,16),tit:TWTIT[o.tit]?o.tit:'',rp:N(o.rp),mx:Math.min(RKTOP,N(o.mx)),foto:/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(o.foto||'')?o.foto:'',
    vit:(Array.isArray(o.vit)?o.vit:[]).slice(0,3).map(e=>e&&(TWRK.includes(e.r)||rkHi(e.r))&&(TWEQ.some(E=>E.k===e.t)||e.t==='anel')?{t:e.t,r:e.r,v:N(e.v,999),nm:S(e.nm,30),img:PFIMG.test(e.img||'')?e.img:'',uniq:e.uniq?1:0,crit:N(e.crit,999),dmg:N(e.dmg,999),vel:N(e.vel,999),st:N(e.st,999),def:N(e.def,999),fdmg:N(e.fdmg,999),trf:N(e.trf,999),ps:e.ps&&RKPR.includes(e.ps.r)&&(e.ps.i|0)>=0&&(e.ps.i|0)<6?{r:e.ps.r,i:e.ps.i|0}:null,drop:N(e.drop,999),yt:e.yt?1:0,ysec:e.ysec?1:0}:null),
    ped:CH[o.ped]?o.ped:'goku',R:Array.isArray(o.R)&&o.R.length===6?o.R.map((r,i)=>({n:['CRÍTICO','DANO','VELOCIDADE','RANK','COMBO','FARM'][i],v:Math.max(4,Math.min(100,N(r&&r.v))),t:S(r&&r.t,160)})):null,
    h:o.h&&typeof o.h==='object'?Object.assign(Object.fromEntries(['pt','vw','tw','twc','twf','wins','loss','own','tt'].map(k=>[k,N(o.h[k])])),{rl:Math.min(RKTOP,Math.max(-1,+o.h.rl|0))}):null}}
async function pfOpenOther(uid,nome,ret){if(!uid)return;if(ret.sc==='tower'){try{twModal(null)}catch(e){}showScreen('ranked')}else rkModal(null);
  if(uid===twUid()){PFO=null;PFRET=ret;return rkView('pf')}
  rkToast('⏳ Carregando perfil...','#cfd6ea');let e=null,hd=null;try{[e,hd]=await Promise.all([pfLast('pfu',uid),pfLast('pfh',uid).catch(()=>null)])}catch(x){}
  let D=null;if(e&&e.d){try{D=pfClean(JSON.parse(e.d),uid,e.nome)}catch(x){}}
  if(!D){let r=null;try{r=(await rkLoadRk('rp')).find(x=>x.uid===uid)}catch(x){}D={uid,nome:String(nome||(r&&r.nome)||'?').slice(0,16),tit:r&&TWTIT[r.tit]?r.tit:'',rp:r?r.rp|0:0,mx:r?rkRank(r.rp|0):0,foto:'',vit:[],ped:r&&CH[r.char]?r.char:'goku',R:null,h:null,old:1}}
  if(hd&&hd.pfa==='h'&&String(hd.nome||'').toLowerCase()===String(TWADMN).toLowerCase())D.fh=1;
  PFO=D;PFRET=ret;rkView('pf')}
function pfBack(){const R=PFRET;PFO=null;PFRET=null;if(R&&R.back)R.back();else rkView('menu')}
/* toque num nome do ranking/chat abre o perfil */
document.addEventListener('click',ev=>{const el=ev.target&&ev.target.closest&&ev.target.closest('[data-pu]');if(!el)return;const u=el.dataset.pu;if(!u)return;
  const inRk=el.closest('#rkModal .twRk'),inGc=el.closest('#rkChL'),inTc=el.closest('#twChL');if(!inRk&&!inGc&&!inTc)return;ev.stopPropagation();
  const sc=showScreen.cur,v=RKV,tab=rkRanking.tab||'rp';rkSfx('whoosh');
  pfOpenOther(u,el.dataset.pn,{sc,back:inTc?()=>{if(sc==='tower'){showScreen('tower');try{twRender();twChat()}catch(e){}}else{rkView(v);rkOverTw(twChat)}}:inRk?()=>{rkView(v);rkRanking(tab)}:()=>rkView(v)})},true);
twChatHTML=function(L){const me=twUid();if(!L.length)return '<p class="twH">Ninguém falou nada ainda hoje. Mande um oi! 👋</p>';
  return L.map(m=>{const t=new Date(m.ct-BRT).toISOString().slice(11,16);return `<div class="cm${m.uid===me?' me':''}${String(m.nome).toLowerCase()===TWADMN.toLowerCase()&&m.tit==='adm'?' adm':''}" data-pu="${twEsc(m.uid||'')}" data-pn="${twEsc(m.nome)}"><span class="ch"><b>${twEsc(m.nome)}</b>${twTitTag(m.tit,m.nome)}<small>${t}</small></span><p>${twEsc(twClean(m.msg))}</p></div>`}).join('')};
/* ADM: esconder/mostrar a foto de alguém (doc pfh; vale o mais novo) */
const pfIsAdm=()=>{try{return twIsAdm()&&String(twLS.g('tw_nome','')).toLowerCase()===String(TWADMN).toLowerCase()}catch(e){return false}};
function pfAdmFoto(){if(!PFO||!pfIsAdm())return;const hid=!!PFO.fh;
  rkModal(`<div class="twM"><h3>👑 FOTO DE ${twEsc(PFO.nome)}</h3><p class="twH">${hid?'A foto deste jogador está ESCONDIDA para todo mundo.':'Se a foto for proibida, esconda para todo mundo (leva até 5 minutos para sumir nos outros celulares).'}</p><div class="row"><button class="btn main" id="pfAh">${hid?'👁️ MOSTRAR FOTO':'🚫 ESCONDER FOTO'}</button><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('pfAh').onclick=async()=>{const u=PFO.uid,ts=Date.now(),IV=v=>({integerValue:String(v)});const f={nome:{stringValue:TWADMN},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},pfh:{stringValue:u},pfa:{stringValue:hid?'s':'h'},v:IV(237)};
    try{const r=await twFetchT(TWURL+'/torre?documentId=pfh_'+twHash(u)+'_'+ts.toString(36).padStart(9,'0')+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})});if(!r.ok)throw 0;
      for(const k in RKQC)if(k.includes('"pfh"'))delete RKQC[k];if(PFO&&PFO.uid===u)PFO.fh=hid?0:1;rkModal(null);rkView('pf');rkToast(hid?'👁️ Foto liberada':'🚫 Foto escondida','#7dff9a')}catch(e){rkToast('Não deu (sem internet?)','#ff8080')}}}
/* ================= v238: PRESENTE DO ADM (código dia:4, 1 vez por conta) =================
   10% personagem que o jogador não tem (qualquer raridade) · 50% 10 tickets de giro · 40% 100–600 💎. Só UM prêmio. */
function rkAdmGift(){const own=rkG('own',['goku']),P=[...RK_MIT,...RK_LEG,...RK_EPI].filter(id=>CH[id]&&!own.includes(id)),r=Math.random();
  let R;if(r<.1&&P.length){const id=P[(Math.random()*P.length)|0];own.push(id);rkS('own',own);R={k:'chr',id}}else if(r<.6){rkAdd('tic',10);R={k:'tic'}}else{const v=100+((Math.random()*501)|0);rkAdd('gem',v);R={k:'gem',v}}
  try{acSave(1)}catch(e){}
  twModal(`<div class="twM gold rkDia rkAg"><h3 class="agH"><i>🎁</i> <span class="agT">PRESENTE DO ADM</span> <i>👑</i></h3><p class="twH">Um presente especial do administrador! Toque na caixa.</p>
    <div class="dbx agB" id="rkDbx"><i class="agR"></i><i class="agR2"></i><i class="agG"></i><img class="cf" src="${TWIMG.bf[4]}" alt=""><img class="ca" src="${TWIMG.ba[4]}" alt=""><i class="rays"></i><i class="agS"><s></s><s></s><s></s><s></s><s></s><s></s></i>
      <b id="rkDn" class="agP${R.k==='chr'?' chr':''}">${R.k==='gem'?`<img src="${RQA.coin[0]}" alt=""><span>0</span>`:R.k==='tic'?`<img src="${RQA.coin[2]}" alt=""><span>x10</span>`:`<img class="agC" src="${fullSrc(R.id)}" alt=""><span>${CH[R.id].name}</span>`}</b></div>
    <p class="twH ok" id="rkDt" style="visibility:hidden">${R.k==='chr'?'✦ NOVO PERSONAGEM: '+CH[R.id].name+'! Já está no Modo Ranqueado.':R.k==='tic'?'🎫 10 TICKETS DE GIRO no Gacha!':'💎 Os diamantes já estão no Modo Ranqueado!'}</p><div class="row"><button class="btn main" id="rkDok">ABRIR</button></div></div>`);
  let op=0;const go=()=>{if(op){twModal(null);return}op=1;const X=$('rkDbx');X.classList.add('open');twSfx('boom');setTimeout(()=>twSfx('powerUp'),300);
    if(R.k==='gem'){const S=document.querySelector('#rkDn span');let n=0;const st=Math.max(10,R.v/40);const iv=setInterval(()=>{n=Math.min(R.v,n+st);S.textContent=Math.round(n);if(n>=R.v){clearInterval(iv);if(R.v>=450)twSfx('boom')}},30)}else setTimeout(()=>twSfx('boom'),500);
    $('rkDt').style.visibility='visible';$('rkDok').textContent='PEGAR'};
  $('rkDbx').onclick=go;$('rkDok').onclick=go}
/* ================= v239: YUTA na Invocação MÍTICA, títulos numerados, ANEL, itens do Yuta (50% em outros), SISTEMA DE NÍVEL dos personagens, sorte nos drops =================
   Dados novos no aparelho (entram no save da conta): rk_lv {id:{lv,t:[escolha por linha]}}, rk_po (pó), rk_cr [5] cristais, rk_el [5] itens de elevação, rk_elp [5] piedade,
   rk_pityY (Yuta, 250), rk_pityYS (itens secretos, 200), rk_yttp (título pendente). Servidor: torre/yttit_N (N=1..10) com documentId fixo = quem pegou o Yuta primeiro. */
let RKBAN=(()=>{try{return localStorage.getItem('rk_ban')||'mit'}catch(e){return 'mit'}})();
const RKRN=['comum','rara','epica','lend','mit'],RKRNM=['COMUM','RARO','ÉPICO','LENDÁRIO','MÍTICO'],RKRC=['#c3c8d2','#3d9bff','#b25bff','#ffc531','#ff2e63'];
/* ---------- equipamento: ANEL + bônus extras + itens do Yuta valem 50% em outros personagens ---------- */
const eqChar=()=>{try{if(typeof TW!=='undefined'&&TW.on&&TW.pick)return TW.pick;if(G.gmode==='boss'&&G.pick)return G.pick}catch(e){}return rkG('sel','goku')};
const eqNf=it=>it&&it.yt&&eqChar()!=='yuta'?.5:1;
twEqOn=function(){const I=twInv(),Q=twEqp(),o={};for(const k of ['esp','arm','bot','cap','anel']){const it=I.find(x=>x.id===Q[k]);if(it)o[k]=it}return o};
const EQMAIN={esp:'dano',arm:'vida',bot:'vel',cap:'trf',anel:'st'};
twEqB=st=>{const o=twEqOn();let v=0;for(const k in o){const it=o[k],n=eqNf(it);if(EQMAIN[k]===st)v+=(it.v||0)*n;if(st==='vel'&&it.vel)v+=it.vel*n;if(st==='dano'&&it.dmg)v+=it.dmg*n;if(st==='vida'&&it.def)v+=it.def*n;if(st==='trf'&&it.trf)v+=it.trf*n}return Math.round(v*10)/10};
const eqCrit=()=>{const o=twEqOn();let c=0;for(const k in o)c+=(o[k].crit||0)*eqNf(o[k]);return c};
const eqDrop=()=>{const o=twEqOn();let c=0;for(const k in o)c+=(o[k].drop||0)*eqNf(o[k]);return c},rkDropF=()=>1+(eqDrop()+RKPDN+psSum().drop)/100;let RKPDN=0;
const eqFdmg=()=>{const o=twEqOn();let c=0;for(const k in o)c+=(o[k].fdmg||0)*eqNf(o[k]);return c};
/* ---------- NÍVEL dos personagens ---------- */
const LVMAX=id=>({mit:50,lend:40,epica:30}[rkRar(id)]||30);
const LVCOST=lv=>lv<10?[150,10]:lv<20?[300,20]:lv<30?[500,35]:lv<40?[900,60]:[1800,120];
const LVROW=[1,10,20,30,40,50];   /* nível em que cada linha da árvore abre */
const LVSTAT={dano:{n:'DANO',i:'⚔️'},cd:{n:'DANO CRÍTICO',i:'💥'},crit:{n:'CRÍTICO',i:'🎯'},vel:{n:'VELOCIDADE',i:'💨'},st:{n:'SORTE',i:'🍀'},ls:{n:'ROUBO DE VIDA',i:'❤️'},uv:{n:'VEL. ULTIMATE',i:'🔥'}};
const LVTREE=[[['dano',3],['crit',2],['vel',2],['st',5]],[['dano',8],['cd',10],['crit',5],['vel',5]],[['ls',4],['st',10],['dano',8],['uv',10]],
  [['cd',10],['crit',5],['vel',5],['ls',4]],[['dano',8],['cd',10],['st',10],['uv',10]],[['dano',10],['cd',15],['crit',7],['ls',5]]];
const LVCRN=[[0,1],[1,1],[2,1],[3,1],[4,1],[4,2]];  /* cristal [raridade, quantidade] para escolher em cada linha */
const lvAll=()=>rkG('lv',{}),lvOf=id=>{const L=lvAll()[id]||{};return {lv:Math.max(1,L.lv|0),t:Array.isArray(L.t)?L.t:[]}},lvSave=(id,o)=>{const A=lvAll();A[id]=o;rkS('lv',A)};
const lvArr=k=>{const a=rkG(k,[0,0,0,0,0]);while(a.length<5)a.push(0);return a};
const lvPo=()=>rkG('po',0)|0;
function lvBonus(id){const L=lvOf(id),B={dano:(L.lv-1)*.4,crit:(L.lv-1)*.15,vel:0,st:0,cd:0,ls:0,uv:0};
  L.t.forEach((c,r)=>{if(c==null||c<0||!LVTREE[r]||!LVTREE[r][c]||L.lv<LVROW[r])return;const [k,v]=LVTREE[r][c];B[k]+=v});return B}
/* sorte total (rank + ADM + equipamento + nível do personagem em uso) e o multiplicador de drops */
const lvSorte=()=>{try{return rkSorte()+lvBonus(eqChar()).st}catch(e){return 0}};
const lvLuck=()=>(1+Math.max(0,lvSorte())/200)*(twIsAdm()?1.6:1)*rkEvL()*rkDropF();
/* ---------- bônus aplicados na luta (Boss e Torre ranqueada) ---------- */
{const _ra=rkApply;rkApply=function(){_ra.apply(this,arguments);try{rkExtra()}catch(e){}try{if(G.gmode==='boss'&&G.p)tbApply(G.p[0])}catch(e){}}}
function rkExtra(){if(!G.p)return;const torre=typeof TW!=='undefined'&&TW.on&&G.gmode==='torre',boss=G.gmode==='boss';if(!torre&&!boss)return;const p=G.p[0],id=p.def.id;
  // crítico de todos os equipamentos (a Torre antiga só contava o capacete) com o corte de 50% dos itens do Yuta
  const o=twEqOn();const already=torre?((o.cap&&o.cap.crit)||0):Object.values(o).reduce((a,x)=>a+(x.crit||0),0);p.tcr=(p.tcr||0)-already+eqCrit();
  p.tfd=eqFdmg();
  const B=lvBonus(id);p.tdm=(p.tdm||1)+B.dano/100;p.tcr=(p.tcr||0)+B.crit;p.tsp=(p.tsp||1)+B.vel/100;p.tcd=B.cd;p.tls=B.ls;p.tki=1+B.uv/100;
  if(twTits().some(k=>/^yt\d+$/.test(k)))p.tdm+=.10}
/* ---------- drops do sistema de nível ---------- */
const LVELC=[15,12,10,5,3],LVELP=[8,20,40,80,150];
function lvGive(o){if(o.po)rkS('po',lvPo()+o.po);if(o.cr){const a=lvArr('cr');a[o.cr[0]]+=o.cr[1]||1;rkS('cr',a)}if(o.el!=null){const a=lvArr('el');a[o.el]++;rkS('el',a)}}
function lvCrRoll(){let q=Math.random()*100;const W=[60,25,10,4,1];for(let i=0;i<5;i++){if((q-=W[i])<0)return i}return 0}
function lvElRoll(mult,np){const p=lvArr('elp');let got=null;for(let i=4;i>=0;i--){if(!np)p[i]++;if(got==null&&(Math.random()*100<LVELC[i]*mult*lvLuck()||p[i]>=LVELP[i])){got=i;p[i]=0}}rkS('elp',p);return got}
const poIco=n=>RQA.lvi.po[n>=150?4:n>=60?3:n>=25?2:n>=10?1:0];
function lvDropsHTML(D){const it=[];if(D.po)it.push(`<span style="--c:#b57bff"><img src="${poIco(D.po)}" alt="">+${D.po} PÓ</span>`);if(D.cr)it.push(`<span style="--c:${RKRC[D.cr[0]]}"><img src="${RQA.lvi.cr[D.cr[0]]}" alt="">CRISTAL ${RKRNM[D.cr[0]]}</span>`);
  if(D.el!=null)it.push(`<span class="spd" style="--c:${RKRC[D.el]}"><img src="${RQA.lvi.el[D.el]}" alt="">✦ ${LVELN[D.el]}</span>`);if(D.gem)it.push(`<span style="--c:#7dff9a"><img src="${RQA.coin[0]}" alt="">🍀 +${D.gem}</span>`);if(D.red)it.push(`<span style="--c:#7dff9a"><img src="${RQA.coin[1]}" alt="">🍀 +${D.red}</span>`);return it.join('')}
const LVELN=['PERGAMINHO DE ELEVAÇÃO','CUBO DE ELEVAÇÃO','MÁSCARA DE ELEVAÇÃO','CHAMA DE ELEVAÇÃO','ORBE DE ELEVAÇÃO'];
const LVPON='PÓ AMALDIÇOADO';
/* Boss: depois da luta (vitória = mais), a sorte aumenta pó, cristais, itens, geminhas e moeda vermelha */
{const _rr=rkResult;rkResult=function(R){const L=lvLuck(),D={};
  const FK=R.farm?.5:1;D.po=Math.round((R.won?8+Math.random()*8:2+Math.random()*3)*L*FK);if(Math.random()<(R.won?.3:.06)*L*FK)D.cr=[lvCrRoll(),1];if(R.won){const e=lvElRoll(FK,!!R.farm);if(e!=null)D.el=e}
  if(R.won&&L>1){D.gem=Math.round((R.gem||0)*(L-1));D.red=Math.round((R.red||0)*(L-1));if(D.gem)rkAdd('gem',D.gem);if(D.red)rkAdd('red',D.red)}
  lvGive(D);const r=_rr.apply(this,arguments);try{const C=document.querySelector(RKMS()+'.rkItems');if(C)C.insertAdjacentHTML('beforeend',lvDropsHTML(D))}catch(e){}return r}}
/* Torre: cada andar vencido dá pó (e às vezes cristal); completar a torre = chance dobrada de item de elevação; sorte aumenta as moedas */
{const _ta2=twAfter;twAfter=function(w){const m0=twLS.g('tw_moedas',0)|0;const r=_ta2.apply(this,arguments);try{if(w===0){const L=lvLuck(),D={po:Math.round((3+Math.random()*4)*L)};if(Math.random()<.1*L)D.cr=[lvCrRoll(),1];lvGive(D);
    const m1=twLS.g('tw_moedas',0)|0,b=Math.round(Math.max(0,m1-m0)*(L-1));if(b>0)twLS.s('tw_moedas',m1+b);TW.lvD=TW.lvD||{po:0};TW.lvD.po+=D.po;if(D.cr)TW.lvD.cr=D.cr}}catch(e){}return r}}
{const _tf2=twFinish;twFinish=function(won,quit){try{if(won){const e=lvElRoll(2);if(e!=null){lvGive({el:e});TW.lvD=TW.lvD||{po:0};TW.lvD.el=e}}const D=TW.lvD;TW.lvD=null;if(D&&(D.po||D.el!=null))setTimeout(()=>{try{twToast('🟣 +'+(D.po||0)+' '+LVPON+(D.el!=null?' · ✦ '+LVELN[D.el]+'!':'')+(D.cr?' · 💎 cristal '+RKRNM[D.cr[0]]:''),'#d8a8ff')}catch(x){}},1600)}catch(e){}return _tf2.apply(this,arguments)}}
/* Gacha: cada giro dá pó; às vezes cristal ou item de elevação */
function lvSpinDrops(n){const L=lvLuck();let po=0,cr=0,el=[];for(let i=0;i<n;i++){po+=Math.round((2+Math.random()*4)*L);if(Math.random()<.06*L){lvGive({cr:[lvCrRoll(),1]});cr++}if(Math.random()<.01*L){const e=Math.random()<.5?0:Math.random()<.6?1:Math.random()<.6?2:Math.random()<.7?3:4;lvGive({el:e});el.push(e)}}
  lvGive({po});setTimeout(()=>rkToast('🟣 +'+po+' '+LVPON+(cr?' · '+cr+' cristal'+(cr>1?'s':''):'')+(el.length?' · ✦ '+el.map(e=>LVELN[e]).join(', '):''),'#d8a8ff'),400)}
/* ================= INVOCAÇÃO MÍTICA (só o Yuta) ================= */
const YTSEC=['yesp','yanel','yrou','yrika'];
const ytOwned=()=>rkG('own',[]).includes('yuta'),ytSecLeft=()=>{const I=twInv();return YTSEC.filter(k=>!I.some(x=>x.nm===RKSP[k].nm))};
function rkRollY(){
  if(!ytOwned()&&!RKMTMP.includes('yuta')){const p=rkG('pityY',0)+1;if(p>=250||Math.random()*100<.4){rkS('pityY',0);RKMTMP.push('yuta');return {k:'chr',r:'mit',id:'yuta'}}rkS('pityY',p)}
  {const L=ytSecLeft().filter(k=>!RKMTMP.includes(k));if(L.length){const p=rkG('pityYS',0)+1;if(p>=200||Math.random()*100<.3){rkS('pityYS',0);const s=L[(Math.random()*L.length)|0];RKMTMP.push(s);return {k:'sp',r:'sec',s}}rkS('pityYS',p)}}
  let r=Math.random()*100;
  if(r<30){let q=Math.random()*100,R='comum';for(const [k,w] of RKEQW){if((q-=w)<0){R=k;break}}return {k:'eq',r:R,E:TWEQ[(Math.random()*TWEQ.length)|0]}}
  return {k:'red',r:'comum',n:1+((Math.random()*5)|0)}}
{const _roll=rkRoll;rkRoll=function(){return RKBAN==='mit'?rkRollY():_roll()}}
{const _tx=rkTaxas;rkTaxas=function(){if(RKBAN!=='mit')return _tx();rkModal(`<div class="twM"><h3>% TAXAS DA INVOCAÇÃO MÍTICA · YUTA</h3><table class="rkTx"><tr><th>Resultado</th><th>Chance</th></tr>
  <tr><td style="color:#c58bff">✦ SSR YUTA (só aqui) · garantido em 250 giros</td><td>0,4%</td></tr><tr><td style="color:#e8f6ff">✦ SECRETO: Espada, Anel, Uniforme ou Rika do Yuta · garantido em 200 giros · nunca repetido</td><td>0,3%</td></tr>
  <tr><td>Equipamento</td><td>30%</td></tr><tr><td style="color:#ff5a5a">Moeda Vermelha (1 a 5)</td><td>69,3%</td></tr></table>
  <p class="twH">Todo giro também dá ${LVPON} (2 a 5) e às vezes cristal (6%) ou item de elevação (1%). A SORTE aumenta esses drops.<br>Só existe 1 Yuta por jogador: depois que você pega, ele para de aparecer. Os 10 primeiros do servidor ganham o título numerado do Yuta (+10% de dano).<br>Itens do Yuta: 100% no Yuta, 50% em outros personagens.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}}
{const _gh=rkGachaH;rkGachaH=function(){const tabs=`<button class="hs ${RKBAN==='mit'?'on':''}" data-a="ban" data-b="mit" style="${rkB(15,115,395,258)}"></button><button class="hs ${RKBAN==='esp'?'on':''}" data-a="ban" data-b="esp" style="${rkB(15,268,380,392)}"></button><button class="hs lk dim" data-a="lock" style="${rkB(15,402,380,518)}">${RKLOCK}</button>`;
  if(RKBAN!=='mit'){const h=_gh();return h.replace(/<button class="hs on" style="[^"]*" data-a="boxinfo"[^>]*><\/button>\s*<button class="hs lk dim" data-a="lock"[^>]*>.*?<\/button><button class="hs lk dim" data-a="lock"[^>]*>.*?<\/button>/,'')+`<div class="gbTabs" style="${rkB(10,110,400,525)}"><button data-a="ban" data-b="mit"><i>✦</i>Invocação<br>Mítica<em>YUTA</em></button><button class="on" data-a="ban" data-b="esp"><i>★</i>Invocação<br>Especial</button><button class="lk" data-a="lock"><i>🔒</i>Invocação<br>Padrão</button></div>`}
  const own=ytOwned(),pY=rkG('pityY',0),pS=rkG('pityYS',0),sl=ytSecLeft().length;
  return `<button class="hs" data-a="back" style="${rkB(15,10,130,85)}"></button><button class="hs" data-a="home" style="${rkB(1740,10,1840,85)}"></button>
  <div class="rkNum" style="${rkB(1240,22,1360,62)}">${rkFmtN(rkG('gem',0))}</div><button class="hs" data-a="shop" style="${rkB(1365,18,1418,68)}"></button>
  <div class="rkNum" style="${rkB(1530,22,1650,62)}">${rkFmtN(rkG('tic',0))}</div><button class="hs" data-a="lock" style="${rkB(1655,18,1710,68)}"></button>${tabs}
  <div class="ytTaxa" style="${rkB(1312,470,1832,615)}"><i class="g"></i><i class="s"><s></s><s></s><s></s><s></s><s></s></i></div>
  <div class="ytEvB" style="${rkB(420,212,862,302)}"></div>
  <button class="hs" data-a="shop" style="${rkB(40,700,125,800)}"></button><button class="hs" data-a="hist" style="${rkB(165,700,265,800)}"></button><button class="hs" data-a="taxas" style="${rkB(300,700,390,800)}"></button>
  <button class="hs" data-a="sum1" style="${rkB(540,690,985,805)}"><span class="shine"></span></button><button class="hs" data-a="sum10" style="${rkB(1030,690,1480,805)}"><span class="shine"></span></button>${(()=>{const c1=rkCost(1),c10=rkCost(10);return (c1.t?`<div class="rkTk" style="${rkB(600,655,925,688)}">🎫 usa 1 ticket (não gasta 💎)</div>`:'')+(c10.t?`<div class="rkTk" style="${rkB(1060,655,1445,688)}">🎫 usa ${c10.t} ticket${c10.t>1?'s':''}${c10.g?' + '+c10.g+' 💎':' (não gasta 💎)'}</div>`:'')})()}
  ${own?`<div class="ytOwn" style="${rkB(420,575,860,640)}">✔ VOCÊ JÁ TEM O YUTA</div>`:''}
  <div class="rkPity" style="${rkB(540,812,1480,845)}">${own?'':`<span style="color:#d8a8ff">✦ Yuta em <b>${250-pY}</b></span> · `}${sl?`✦ Secreto em <b>${200-pS}</b> · `:''}🎟️ 1 ticket = 1 giro · 🟣 +pó</div>`}}
/* ---------- SORTE MÍTICA (tudo roxo) ---------- */
function rkMegaY(){return new Promise(res=>{const O=document.createElement('div');O.className='rkMega ytm';O.innerHTML='<i class="rays"></i><i class="fl"></i><i class="ring"></i><div class="tx"><small>✦ ✦ ✦ ✦ ✦</small><b>SORTE</b><b>MÍTICA!</b><span>O YUTA APARECEU!</span></div>';rkHost().appendChild(O);
  rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),400);setTimeout(()=>rkSfx('boom'),900);setTimeout(()=>rkSfx('powerUp'),1500);setTimeout(()=>rkSfx('boom'),2200);let d=0;const end=()=>{if(d)return;d=1;O.classList.add('out');setTimeout(()=>{O.remove();res()},400)};setTimeout(end,3400);setTimeout(()=>{O.onclick=end},900)})}
/* ---------- TÍTULO numerado dos 10 primeiros que pegaram o Yuta ---------- */
for(let n=1;n<=10;n++)TWTIT['yt'+n]={n:'YUTA Nº'+n,i:'🗡️',c:n===1?'#ffe9a0':n<=3?'#e2b6ff':'#b57bff',d:'Um dos 10 primeiros do servidor a pegar o Yuta · +10% de dano',hid:1,yt:n};
async function ytTitClaim(show){if(twTits().some(k=>/^yt\d+$/.test(k))){rkS('yttp',0);return}rkS('yttp',1);const nm=String(twLS.g('tw_nome','')||'?').slice(0,16),IV=v=>({integerValue:String(v)});
  for(let n=1;n<=10;n++){let r;try{r=await twFetchT(TWURL+'/torre?documentId=yttit_'+n+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{nome:{stringValue:nm},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},ytt:{stringValue:String(n)},v:IV(239)}})})}catch(e){return}
    if(r.ok){rkS('yttp',0);const L=twTits();L.push('yt'+n);twLS.s('tw_tit',L);twLS.s('tw_titOn','yt'+n);try{twTitSync()}catch(e){}if(show)await ytTitWin(n);return}
    if(r.status!==409&&r.status!==403)return}
  rkS('yttp',0)}
function ytTitWin(n){return new Promise(res=>{const O=document.createElement('div');O.className='rkWin end ytw';O.innerHTML=`<div class="t"><b>✦ VOCÊ É O Nº ${n} DO SERVIDOR! ✦</b><span>TÍTULO</span></div><div class="ytTw">${pfTitH('yt'+n,'',false)}</div><i class="rays"></i><div class="t2">Um dos 10 primeiros a pegar o Yuta · +10% de dano em todas as lutas ranqueadas</div>`;rkHost().appendChild(O);rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),300);setTimeout(()=>{O.onclick=()=>{O.remove();res()}},600)})}
{const _op=rkOpen;rkOpen=function(v){const r=_op.apply(this,arguments);if(rkG('yttp',0)&&rkG('own',[]).includes('yuta'))setTimeout(()=>ytTitClaim(1),2500);return r}}
/* título do Yuta na placa do perfil: quanto menor o número, mais brilho */
{const _pt=pfTitH;pfTitH=function(t,n,adm){const T=TWTIT[t];if(T&&T.yt){const k=T.yt===1?1:T.yt<=3?2:T.yt<=6?3:4;return `<span class="pfTt ytt y${k}" style="--c:${T.c}"><i>🗡️</i><b>YUTA</b><em>Nº ${T.yt}</em>${k<=2?'<i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✦</i>':''}<i class="sw"></i></span>`}return _pt.apply(this,arguments)}}
/* ================= BIBLIOTECA → PERSONAGENS (arte nova) + TELA DE NÍVEL ================= */
const lvUltTxt=id=>{const d=(ROS[id]&&ROS[id].d)||'';const m=d.split(/(?<=\.)\s+/).filter(x=>/Ultimate|Super|ULTIMATE/i.test(x));return (m.join(' ')||d).slice(0,170)};
function lvStatRows(id){const B=lvBonus(id);return [['dano','+'+B.dano.toFixed(1)+'%'],['crit',(5+B.crit).toFixed(1)+'%'+(B.cd?' 💥+'+B.cd+'%':'')],['vel','+'+B.vel+'%'],['st','+'+B.st+'%'],['uv','+'+B.uv+'%'+(B.ls?' ❤️'+B.ls+'%':'')]]}
{const _lh=rkLibH;rkLibH=function(){if(RKL.tab!=='chr')return _lh();
  return `<button class="hs" data-a="back" style="${rkB(20,10,145,80)}"></button><button class="hs" data-a="home" style="${rkB(1735,5,1840,80)}"></button>
  ${[['chr',145,225],['eq',240,320],['it',335,410],['col',428,505]].map(([t,a,b])=>`<button class="hs tab ${RKL.tab===t?'on':''}" data-a="tab" data-t="${t}" style="${rkB(10,a,275,b)}"></button>`).join('')}
  <input class="rkSrch" id="rkSrch" placeholder="" autocomplete="off" value="${twEsc(RKL.q)}" style="${rkB(1255,100,1640,150)}"><button class="hs" data-a="filt" style="${rkB(1675,95,1760,155)}"><span class="rkFl" id="rkFl">${['TODOS','TENHO','FALTA'][RKL.f]}</span></button>
  <div id="rkGrid"></div><button class="hs" data-a="up" style="${rkB(1762,178,1812,228)}"></button><button class="hs" data-a="down" style="${rkB(1762,712,1812,762)}"></button>
  <div class="rkPed lbP" id="rkPed" style="${rkB(250,120,880,615)}"></div>
  <div class="lbNm" id="lbNm" style="${rkB(440,642,725,698)}"></div>
  <div class="lbBar" id="lbBar" style="${rkB(282,722,880,750)}"><s></s><b></b></div>
  <div class="lbAt" id="lbAt" style="${rkB(965,232,1075,465)}"></div>
  <div class="lbUl" id="lbUl" style="${rkB(800,522,1058,598)}"></div>
  <div class="rkInfo" id="rkInfo" hidden></div>
  <button class="rkUse" id="rkUse" data-a="libUse" style="${rkB(14,548,268,612)}" hidden></button>
  <button class="lbEvo" id="lbEvo" data-a="evo" style="${rkB(14,625,268,700)}" hidden>⬆ EVOLUIR</button>`}}
{const _lg=rkLibGrid;rkLibGrid=function(){if(RKL.tab!=='chr')return _lg();const L=rkLibItems(),G0=$('rkGrid');if(!G0)return;const pages=Math.max(1,Math.ceil(L.length/16));RKL.pg=Math.min(RKL.pg,pages-1);const X=[1132,1289,1445,1602],Y=[180,330,478,626];
  G0.innerHTML=L.slice(RKL.pg*16,RKL.pg*16+16).map((x,i)=>{const c=(TWEQR.find(R=>R.k===x.r)||TWEQR[0]).c,lv=x.has?lvOf(x.id).lv:0;return `<button class="rkCell lbC ${x.has?'':'no'} ${RKL.cur&&RKL.cur.id===x.id?'on':''}" data-id="${x.id}" style="${rkB(X[i%4],Y[(i/4)|0],X[i%4]+138,Y[(i/4)|0]+132)};--c:${c}"><img src="${x.img}" alt="">${x.has?`<em>Nv ${lv}</em>`:'<span class="lk">🔒</span>'}<b>${twEsc(x.nm)}</b></button>`}).join('')+(pages>1?`<div class="rkPg" style="${rkB(1762,450,1812,480)}">${RKL.pg+1}/${pages}</div>`:'');
  G0.querySelectorAll('.rkCell').forEach(b=>b.onclick=()=>{const x=L.find(y=>y.id===b.dataset.id);if(x){rkSfx('whoosh');rkLibShow(x);rkLibGrid()}})}}
{const _ls=rkLibShow;rkLibShow=function(x){_ls.apply(this,arguments);if(RKL.tab!=='chr'||!$('lbNm'))return;const id=x.id,L=lvOf(id),mx=LVMAX(id),c=(TWEQR.find(R=>R.k===x.r)||TWEQR[0]).c;
  $('lbNm').innerHTML=`<b style="--c:${c}">${twEsc(CH[id].name)}</b>`;const B=$('lbBar');B.querySelector('s').style.width=(L.lv/mx*100)+'%';B.querySelector('b').textContent=x.has?'NÍVEL '+L.lv+' / '+mx:'🔒 BLOQUEADO · '+twEsc(x.d);
  $('lbAt').innerHTML=cbRows(id).map(v=>`<span>${v}</span>`).join('');$('lbUl').textContent=lvUltTxt(id);$('lbEvo').hidden=!x.has;
  if(!$('lbAll')){$('lbAt').insertAdjacentHTML('afterend',`<button class="lbAll" id="lbAll" style="${rkB(840,192,1172,500)}"><i>🔍 TUDO</i></button>`)}$('lbAll').onclick=()=>cbModal(id)}}
function lvOpen(id){if(!id||!CH[id]||!rkG('own',[]).includes(id))return;LVC.id=id;rkView('lvl')}
const LVC={id:null};
function lvH(){const id=LVC.id,L=lvOf(id),mx=LVMAX(id),cr=lvArr('cr'),el=lvArr('el'),c=RKRC[['epica','lend','mit'].indexOf(rkRar(id))+2];
  const need=lvNeed(id),S=lvStatRows(id),RY=[170,277,384,490,597,705],CX=[1215,1350,1485,1620];
  return `<button class="hs" data-a="back" style="${rkB(10,8,125,78)}"></button><button class="hs" data-a="home" style="${rkB(1735,8,1840,78)}"></button>
  <div class="lvPed" style="${rkB(120,40,600,600)};--c:${c}"><i class="glw"></i><img src="${fullSrc(id)}" alt=""></div>
  <div class="lvNm" style="${rkB(640,165,950,222)}">${twEsc(CH[id].name)}<small>${{mit:'MÍTICO',lend:'LENDÁRIO',epica:'ÉPICO'}[rkRar(id)]} · máx. ${mx}</small></div>
  ${S.map(([k,v],i)=>`<div class="lvSt" style="${rkB(722,258+i*67,935,302+i*67)}"><b>${LVSTAT[k].n}</b><span>${v}</span></div>`).join('')}
  <div class="lvBx" style="${rkB(120,680,235,790)}"><small>NÍVEL</small><b>${L.lv}</b></div>
  <div class="lvBx nx" style="${rkB(340,680,455,790)}">${L.lv>=mx?'<small>MÁX.</small><b>★</b>':need.el!=null?`<img src="${RQA.lvi.el[need.el]}" alt=""><small>${el[need.el]}/1</small>`:`<small>NÍVEL</small><b>${L.lv+1}</b>`}</div>
  <button class="lvUp ${need.ok?'':'no'}" data-a="lvUp" style="${rkB(612,698,925,768)}">${L.lv>=mx?'NÍVEL MÁXIMO':need.el!=null?'✦ ELEVAR':'⬆ SUBIR'}<small>${L.lv>=mx?'':`🪙 ${rkFmtN(need.c)} · 🟣 ${need.p}${need.el!=null?' · '+LVELN[need.el]:''}`}</small></button>
  <div class="lvRes" style="${rkB(470,632,950,672)}">🪙 ${rkFmtN(twLS.g('tw_moedas',0)|0)} · 🟣 ${rkFmtN(lvPo())} ${LVPON}<button data-a="lvInfo">?</button></div>
  ${LVTREE.map((row,r)=>{const open=L.lv>=LVROW[r],has=r<lvRows(id),pick=L.t[r];return `<div class="lvRl ${open?'on':''} ${has?'':'x'}" style="${rkB(1028,RY[r]+24,1098,RY[r]+46)}">${has?'Nv '+LVROW[r]:'—'}</div>`+row.map(([k,v],ci)=>`<button class="lvNd ${!has?'x':open?'on':'lk'} ${pick===ci?'sel':''} ${pick!=null&&pick>=0&&pick!==ci?'off':''}" data-a="lvNode" data-r="${r}" data-c="${ci}" style="${rkB(CX[ci],RY[r]-42,CX[ci]+85,RY[r]+42)};--c:${RKRC[Math.min(4,r)]}"><i>${LVSTAT[k].i}</i><b>+${v}%</b></button>`).join('')}).join('')}
  <div class="lvCr" style="${rkB(1150,770,1780,815)}">${cr.map((n,i)=>`<span style="--c:${RKRC[i]}"><img src="${RQA.lvi.cr[i]}" alt="">${n}</span>`).join('')}${el.map((n,i)=>n?`<span style="--c:${RKRC[i]}"><img src="${RQA.lvi.el[i]}" alt="">${n}</span>`:'').join('')}</div>`}
function lvOn(){clearInterval(rkView.iv)}
const lvRows=id=>LVROW.filter(l=>l<=LVMAX(id)).length;
function lvNeed(id){const L=lvOf(id),mx=LVMAX(id);if(L.lv>=mx)return {ok:false,max:1};const [c,p]=LVCOST(L.lv),nx=L.lv+1,ei=[10,20,30,40,50].indexOf(nx),el=ei>=0?ei:null,coins=twLS.g('tw_moedas',0)|0;
  const ok=coins>=c&&lvPo()>=p&&(el==null||lvArr('el')[el]>=1);return {ok,c,p,el}}
function lvUp(){const id=LVC.id,N=lvNeed(id);if(N.max){rkToast('★ Nível máximo!','#ffd84a');return}
  if(!N.ok){rkSfx('clang');const coins=twLS.g('tw_moedas',0)|0;rkToast(coins<N.c?'Faltam 🪙 moedas douradas (ganhe na Torre)':lvPo()<N.p?'Falta '+LVPON+' (Boss, Torre e Gacha)':'Falta o '+LVELN[N.el]+' (drop do Boss, da Torre e do Gacha)','#ff8080');return}
  twLS.s('tw_moedas',(twLS.g('tw_moedas',0)|0)-N.c);rkS('po',lvPo()-N.p);if(N.el!=null){const a=lvArr('el');a[N.el]--;rkS('el',a)}
  const L=lvOf(id);L.lv++;lvSave(id,L);rkSfx('powerUp');if(N.el!=null)setTimeout(()=>rkSfx('boom'),200);rkView('lvl');
  const P=document.querySelector('.lvPed');if(P){P.classList.add('up');if(N.el!=null)P.classList.add('el')}
  const rowOpen=LVROW.indexOf(L.lv);rkToast(N.el!=null?'✦ ELEVADO! '+CH[id].name+' agora é nível '+L.lv+(rowOpen>0?' · nova habilidade liberada!':''):'⬆ Nível '+L.lv+'!',N.el!=null?'#ffd84a':'#7dff9a')}
function lvNode(r,ci){const id=LVC.id,L=lvOf(id);if(r>=lvRows(id)){rkToast('Este personagem vai só até o nível '+LVMAX(id),'#cfd6ea');return}if(L.lv<LVROW[r]){rkSfx('clang');rkToast('🔒 Libera no nível '+LVROW[r],'#cfd6ea');return}
  if(L.t[r]===ci)return;const [k,v]=LVTREE[r][ci],[cr,q]=LVCRN[r],have=lvArr('cr')[cr],troca=L.t[r]!=null&&L.t[r]>=0;
  rkModal(`<div class="twM sm"><h3>${LVSTAT[k].i} ${LVSTAT[k].n} +${v}%</h3><p class="twH">${troca?'Trocar a escolha desta linha':'Escolher esta habilidade'} para <b>${twEsc(CH[id].name)}</b>.</p><p class="twH">Custo: <img src="${RQA.lvi.cr[cr]}" alt="" style="width:1.6em;vertical-align:middle"> ${q} cristal ${RKRNM[cr]} (você tem ${have})</p><div class="row"><button class="btn main" id="lvOk" ${have<q?'disabled':''}>${have<q?'FALTA CRISTAL':'CONFIRMAR'}</button><button class="btn" id="rkMX">CANCELAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('lvOk').onclick=()=>{const a=lvArr('cr');if(a[cr]<q)return;a[cr]-=q;rkS('cr',a);const L2=lvOf(id);while(L2.t.length<=r)L2.t.push(-1);L2.t[r]=ci;lvSave(id,L2);rkModal(null);rkSfx('powerUp');rkView('lvl');rkToast('✔ '+LVSTAT[k].n+' +'+v+'%','#7dff9a')}}
function lvInfo(){rkModal(`<div class="twM"><h3>⬆ COMO EVOLUIR O PERSONAGEM</h3><p class="twH">Cada nível dá um pouco de dano (+0,4%) e de crítico (+0,15%). Épico vai até o 30, lendário até o 40 e mítico até o 50. O bônus é somado à força normal do personagem e vale no Modo Boss e na Torre Ranqueada.</p>
  <table class="rkTx"><tr><th>Níveis</th><th>Custo por nível</th></tr><tr><td>1 → 10</td><td>🪙 150 · 🟣 10</td></tr><tr><td>10 → 20</td><td>🪙 300 · 🟣 20</td></tr><tr><td>20 → 30</td><td>🪙 500 · 🟣 35</td></tr><tr><td>30 → 40</td><td>🪙 900 · 🟣 60</td></tr><tr><td>40 → 50</td><td>🪙 1.800 · 🟣 120</td></tr></table>
  <p class="twH">✦ ELEVAÇÃO: para chegar no nível 10 precisa do Pergaminho (comum), 20 do Cubo (raro), 30 da Máscara (épica), 40 da Chama (lendária) e 50 do Orbe (mítico). Drop por vitória no Boss: 15% · 12% · 10% · 5% · 3% (Torre completa: o dobro). Piedade: garantido em 8 · 20 · 40 · 80 · 150 lutas.</p>
  <p class="twH">🌳 ÁRVORE: cada linha abre num nível (1, 10, 20, 30, 40, 50). Escolha 1 dos 4 bônus usando cristais (linha 1 comum … linha 6 mítico). Dá para trocar depois pagando de novo.</p>
  <p class="twH">🟣 ${LVPON}: vitória no Boss 8–15, derrota 2–4, andar da Torre 3–6, cada giro do Gacha 2–5. 🍀 A SORTE aumenta pó, cristais, itens de elevação, geminhas, moeda vermelha e moedas da Torre (100 de sorte = +50%). Sua sorte agora: <b>${Math.round(lvSorte())}</b>.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
/* itens do sistema de nível na Biblioteca → Itens */
{const _li=rkLibItems;rkLibItems=function(){const R=_li.apply(this,arguments);if(RKL.tab!=='it')return R;const q=RKL.q.toLowerCase(),add=[];
  add.push({id:'po',k:'it',r:'epica',has:lvPo()>0,img:RQA.lvi.po[2],big:RQA.lvi.po[2],nm:LVPON,d:'Você tem '+rkFmtN(lvPo())+' · usado para subir o nível dos personagens'});
  lvArr('cr').forEach((n,i)=>add.push({id:'cr'+i,k:'it',r:RKRN[i],has:n>0,img:RQA.lvi.cr[i],big:RQA.lvi.cr[i],nm:'CRISTAL '+RKRNM[i],d:'Você tem '+n+' · escolhe habilidades da árvore (linha '+(i+1)+(i===4?' e 6':'')+')'}));
  lvArr('el').forEach((n,i)=>add.push({id:'el'+i,k:'it',r:RKRN[i],has:n>0,img:RQA.lvi.el[i],big:RQA.lvi.el[i],nm:LVELN[i],d:'Você tem '+n+' · necessário para chegar ao nível '+(i+1)*10}));
  return add.filter(x=>(!q||x.nm.toLowerCase().includes(q))&&(RKL.f===0||(RKL.f===1?x.has:!x.has))).concat(R)}}
/* ================= v240: vídeo de invocação do Yuta, código do INFLUENCIADOR (1000 💎 + pó + moedas + título) e CAIXA DE GEMAS (100–1000 💎) ================= */
let RKYF=null,RKYP=null;
const rkYPre=()=>{if(!RKYF){const P=rkPre(RQA.invy);RKYF=P.ims;RKYP=P.p}};
{const _go=rkGachaOn;rkGachaOn=function(){_go.apply(this,arguments);if(RKBAN==='mit')rkYPre()}}
{const _pv=rkPlayVid;rkPlayVid=function(cb){if(RKBAN!=='mit')return _pv(cb);rkYPre();const O=document.createElement('div');O.className='rkFx';O.innerHTML='<span>toque para pular</span>';rkHost().appendChild(O);
  const stop=rkPlayFrames(O,RKYF,RKYP,()=>{O.remove();cb()});O.onclick=()=>stop();try{SFX.powerUp()}catch(e){}}}
TWTIT.inf={n:'INFLUENCIADOR',i:'📣',c:'#ff4fd8',d:'Parceiro oficial do Fúria do Templo',hid:1,inf:1};
{const _pt2=pfTitH;pfTitH=function(t,n,adm){if(t==='inf')return `<span class="pfInf"><i class="mc">📣</i><b>INFLUENCIADOR</b><i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✦</i><i class="sw"></i></span>`;return _pt2.apply(this,arguments)}}
function rkInfGift(){const PO=70,MO=900,GM=1000;rkAdd('gem',GM);rkS('po',lvPo()+PO);twLS.s('tw_moedas',(twLS.g('tw_moedas',0)|0)+MO);
  const L=twTits();if(!L.includes('inf')){L.push('inf');twLS.s('tw_tit',L)}twLS.s('tw_titOn','inf');try{twTitSync()}catch(e){}try{acSave(1)}catch(e){}
  twModal(`<div class="twM gold rkDia rkAg rkInfG"><h3 class="agH"><i>📣</i> <span class="agT">PRESENTE DE INFLUENCIADOR</span> <i>✨</i></h3><p class="twH">Obrigado por divulgar o jogo! Toque no baú.</p>
    <div class="dbx agB" id="rkDbx"><i class="agR"></i><i class="agR2"></i><i class="agG"></i><img class="cf" src="${TWIMG.bf[4]}" alt=""><img class="ca" src="${TWIMG.ba[4]}" alt=""><i class="rays"></i><i class="agS"><s></s><s></s><s></s><s></s><s></s><s></s></i>
      <b id="rkDn" class="agP"><img src="${RQA.coin[0]}" alt=""><span>0</span></b></div>
    <div class="rkItems infIt" id="rkDt" style="visibility:hidden"><span style="--c:#5ab8ff"><img src="${RQA.coin[0]}" alt="">+${GM} GEMAS</span><span style="--c:#b57bff"><img src="${RQA.lvi.po[2]}" alt="">+${PO} ${LVPON}</span><span style="--c:#ffd84a">🪙 +${MO} MOEDAS</span></div>
    <div class="infTt" id="rkDt2" style="visibility:hidden">${pfTitH('inf')}<p class="twH">Pó + moedas = o bastante para subir um personagem do nível 1 até o 7 (Biblioteca → Personagens → EVOLUIR). O título já está em uso!</p></div><div class="row"><button class="btn main" id="rkDok">ABRIR</button></div></div>`);
  let op=0;const go=()=>{if(op){twModal(null);return}op=1;$('rkDbx').classList.add('open');twSfx('boom');setTimeout(()=>twSfx('powerUp'),300);setTimeout(()=>twSfx('boom'),800);const S=document.querySelector('#rkDn span');let n=0;const iv=setInterval(()=>{n=Math.min(GM,n+25);S.textContent=n;if(n>=GM)clearInterval(iv)},30);
    $('rkDt').style.visibility='visible';$('rkDt2').style.visibility='visible';$('rkDok').textContent='PEGAR'};$('rkDbx').onclick=go;$('rkDok').onclick=go}
/* v241: na arte nova da Biblioteca os botões 👤 🎵 CÓDIGO ficam exatamente em cima dos desenhados na arte */
{const _lo=rkLibOn;rkLibOn=function(){const A=document.querySelector('#rkWrap .rkA');if(A)A.classList.toggle('lbArt',RKL.tab==='chr');return _lo.apply(this,arguments)}}
/* ================= v243: EVENTO DO YUTA no Modo Boss (7 dias, até domingo 15/11 23:59 de Brasília) =================
   Lobby: 1º espaço = Broly, 2º = Yuta (arte do dono, RQA.boss_yt). INICIAR → tela "yrb" com 2 abas:
   RANQUEADO = igual ao Broly (nível do boss = rank, dá/tira XP de rank, passivas por nível, recordes separados 'Y'+nível).
   FARM DO EVENTO = 5 dificuldades, sem XP de rank, passivas SORTEADAS a cada luta (roleta), Yuta transforma na 2ª fase,
   drops do evento (💎 um pouco, pó, cristais, equipamento) + Yuta 0,5% (Mestre/Super) + itens do Yuta 0,3% (Difícil+). Sorte multiplica tudo. */
const YSEV={ini:Date.UTC(2026,10,9,12,0),fim:Date.UTC(2026,10,16,2,59,59)};
const ysNow=()=>Date.now()+((window.__ysT)||0),ysOn=()=>{const t=ysNow();return t>=YSEV.ini&&t<=YSEV.fim};
const ysLeft=()=>{const ms=Math.max(0,YSEV.fim-ysNow()),d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);return d?d+'d '+h+'h':h+'h '+m+'min'};
let RKYD=null;const YS={tab:'rank',d:1,roll:null};
try{const b=localStorage.getItem('rk_bsel');if(b==='yuta'&&ysOn())RKBID='yuta'}catch(e){}
const YSPN={blk:['🛡️','BLOQUEIO','10% de chance de bloquear'],dge:['💨','ESQUIVA','15% de chance de esquivar'],crit:['🎯','OLHO AMALDIÇOADO','+20% de crítico'],ki:['🔥','ENERGIA CHEIA','começa com 100 de Ki'],
  reg:['💚','REGENERAÇÃO','cura 3% a 40% da vida'],rage:['😡','FÚRIA','+15% de dano por 8 s a 50%'],bar:['🔷','BARREIRA','escudo de 10% a 70%'],curse:['☠️','MALDIÇÃO','+25% de dano nos primeiros 10 s'],
  fury:['⚡','MODO FURIOSO','+15% de velocidade por 10 s a 30%'],sup:['👑','FASE SUPREMA','escudo 15% + 20% de dano a 25%'],rika:['👹','RIKA PROTETORA','a Rika ataca sozinha a 60%'],vamp:['🩸','ROUBO DE VIDA','cura 25% do dano que causa']};
const YSPOOL=[['blk','dge','crit','ki'],['reg','rage','bar','curse'],['fury','sup','rika','vamp']];
const YSDIF=[
  {n:'FÁCIL',c:'#7dff9a',lv:0,ph:[2,3],k:1,np:[1,0,0],gem:[2,4],po:[6,10],eq:.25,er:0},
  {n:'NORMAL',c:'#5ab8ff',lv:2,ph:[3,5],k:1,np:[1,1,0],gem:[3,6],po:[10,16],eq:.3,er:1},
  {n:'DIFÍCIL',c:'#c46aff',lv:4,ph:[4,8],k:1.05,np:[1,1,1],gem:[4,8],po:[15,24],eq:.35,er:1,sec:.3},
  {n:'MESTRE',c:'#ffc531',lv:6,ph:[6,12],k:1.12,np:[0,2,2],gem:[6,10],po:[22,34],eq:.4,er:2,sec:.3,yt:.5},
  {n:'SUPER DIFÍCIL',c:'#ff2e63',lv:7,ph:[8,15],k:1.25,np:[1,2,2],gem:[8,14],po:[30,45],eq:.5,er:2,sec:.3,yt:.5}];
const rkPSlv=lv=>({blk:lv>=1,dge:lv>=2,reg:lv>=3,rage:lv>=4,bar:lv>=5,fury:lv>=6,sup:lv>=7});
const ysRnd=([a,b])=>a+Math.floor(Math.random()*(b-a+1));
function ysRoll(d){const D=YSDIF[d],out=[];D.np.forEach((n,t)=>{const P=YSPOOL[t].slice();for(let i=0;i<n&&P.length;i++)out.push(P.splice((Math.random()*P.length)|0,1)[0])});return out}
/* aplicado no rkApply (só no boss Yuta) */
function ysApply(o){if(RKBID!=='yuta')return;o.rkPS=null;o.ysK=1;if(RKYD==null)return;const D=YSDIF[RKYD];o.ysK=D.k;o.rkPhB=D.ph.slice();o.mhp=o.rkPhB[0]*LAYER;o.hp=o.hpLag=o.mhp;o.rkHp=o.hp;o.rkB.dm*=D.k;o.tdm=o.rkB.dm;
  const L=YS.roll||ysRoll(RKYD);o.rkPS={};for(const k of L)o.rkPS[k]=1;YS.roll=null;
  setTimeout(()=>{try{if(L.length)txt(o.x,o.y-330,L.map(k=>YSPN[k][0]+' '+YSPN[k][1]).join(' · '),'#e2b6ff')}catch(e){}},2200)}
/* passivas novas do farm */
function ysTick(o,PS,t){const P=o.rkP,fr=G.frame;if(!P)return;
  if(PS.crit&&!P.crit){P.crit=1;o.tcr=(o.tcr||0)+20}
  if(PS.ki&&!P.ki){P.ki=1;o.ki=100}
  if(PS.curse&&!P.curse){P.curse=1;P.dmgU=fr+600;P.dmgK=.25;txt(o.x,o.y-300,'☠️ MALDIÇÃO: +25% DANO','#d8a8ff')}
  if(PS.rika&&!P.rika&&t<=.6&&isYt(o)){const p=G.p[0];if(p&&!p.ko&&!G.ws&&!G.trans&&o.state!=='whtS'){P.rika=1;banner('RIKA PROTETORA','#c58bff',70,'A RIKA ATACOU SOZINHA!');ytRika(o,p)}}}
{const _ah2=applyHit;applyHit=function(a,d,h){const h0=d?d.hp:0,r=_ah2.apply(this,arguments);try{if(r&&a&&a.rkPS&&a.rkPS.vamp&&!a.ko&&d&&h0>d.hp){a.hp=Math.min(a.mhp||MAXHP,a.hp+(h0-d.hp)*.25);a.hpLag=Math.max(a.hpLag||0,a.hp)}}catch(e){}return r}}
/* ---------- lobby ---------- */
function ysSlotOld(){const on=ysOn();return `<button class="ysSlot ${on?'':'off'}" data-a="bsel" data-b="yuta" style="${rkB(12,325,415,415)}"><img src="${IMG.yuta?IMG.yuta.src:''}" alt=""><b>Yuta</b><em>${on?'EVENTO · '+ysLeft():'ENCERRADO'}</em></button>`}
function ysLobbyH(){const rp=rkG('rp',0),ri=rkRank(rp),sel=rkG('sel','goku');
  return `<button class="hs" data-a="back" style="${rkB(20,22,140,100)}"></button>
  <button class="hs" data-a="bsel" data-b="broly" style="${rkB(10,190,435,282)}"></button>
  <button class="hs on" data-a="boxinfo" data-t="Yuta do evento: ranqueado no nível do seu rank (${rkPhB(ri)[0]} barras → ${rkPhB(ri)[1]} despertado) · farm com 5 dificuldades" style="${rkB(10,298,440,395)}"></button>
  ${[[410,495],[505,590],[600,690]].map(([a,b])=>`<button class="hs" data-a="lock" style="${rkB(10,a,415,b)}"></button>`).join('')}
  <div class="ysEvT" style="${rkB(480,410,960,452)}">🌸 EVENTO · termina em ${ysLeft()}</div>
  <div class="rkBox" style="${rkB(478,680,588,786)}" data-a="boxinfo" data-t="💎 Ranqueado: 5 a 15 · Farm do evento: 2 a 14 (pela dificuldade)"><img src="${RQA.coin[0]}" alt=""><b>2-15</b></div>
  <div class="rkBox" style="${rkB(605,680,715,786)}" data-a="boxinfo" data-t="🟣 ${LVPON}, cristais e itens de elevação · muito mais no farm do evento"><img src="${RQA.lvi.po[3]}" alt=""><b>PÓ</b></div>
  <div class="rkBox" style="${rkB(732,680,842,786)}" data-a="boxinfo" data-t="🛡️ Equipamentos normais do jogo (25% a 50% no farm, raridade melhor nas dificuldades altas)"><img src="${twIco('arm','epica')}" alt=""><b>EQUIP.</b></div>
  <div class="rkBox ysY" style="${rkB(860,680,970,786)}" data-a="boxinfo" data-t="✦ Farm MESTRE e SUPER DIFÍCIL: 0,5% de ganhar o YUTA · DIFÍCIL para cima: 0,3% de um item secreto do Yuta · a SORTE aumenta as chances"><img src="${RQA.ysp.yesp}" alt=""><b>✦ 0,5%</b></div>
  <div class="rkBan" style="${rkB(1628,50,1772,196)}">${rkEmb(ri,'ban')}</div><div class="rkBanN" style="${rkB(1590,232,1810,268)};color:${RKR[ri].c}">${RKR[ri].n}</div>
  <div class="rkOn ys" style="${rkB(1600,538,1728,570)}"><i></i><span id="rkOnN">...</span></div>
  <div class="rkChL" id="rkChL" style="${rkB(1112,578,1728,654)}"><p class="twH">Carregando...</p></div>
  <input class="rkChI" id="rkChI" maxlength="140" placeholder="" autocomplete="off" style="${rkB(1182,662,1660,700)}">
  <button class="hs" data-a="chat" style="${rkB(1672,660,1722,702)}"></button>
  <button class="rkEqB" data-a="equip" style="${rkB(985,632,1095,716)}"><i>🎒</i><b>EQUIPAR</b></button>
  <button class="rkSel" data-a="sel" style="${rkB(985,722,1175,830)}"><img src="${IMG[sel]?IMG[sel].src:''}" alt=""><span><small>LUTAR COM</small><b>${CH[sel]?CH[sel].name:''}</b><em>trocar ›</em></span></button>
  <button class="hs" data-a="start" style="${rkB(1185,735,1640,825)}"><span class="shine"></span></button>
  ${rkCurHTML().replace('rkCur','rkCur bt')}`}
/* ---------- tela de início do evento (ranqueado / farm) ---------- */
function ysStartH(){const xp=rkG('rp',0),ri=rkRank(xp),L=RKLVS[ri],sel=rkG('sel','goku'),prog=ri>=RKTOP?100:Math.round(100*(xp-RKXP[ri])/(RKXP[ri+1]-RKXP[ri])),lk=lvLuck(),S=rkSorte?Math.round(lvSorte()):0;
  const selB=(x0,y0,x1,y1,c)=>`<button class="ysSelA" data-a="sel" style="${rkB(x0,y0,x1,y1)}"><span><small>LUTAR COM</small><b>${CH[sel]?CH[sel].name:''}</b><em>trocar ›</em></span></button><div class="ysPort" style="${rkB(...c)}"><img src="${IMG[sel]?IMG[sel].src:''}" alt=""></div>`;
  if(YS.tab==='rank'){const pas=[];const PS=rkPSlv(ri);for(const k in PS)if(PS[k])pas.push(k);const CX=[[640,770],[790,918],[937,1067],[1087,1218],[1238,1362],[1380,1505],[1523,1650],[1668,1792]];
    return `<button class="hs" data-a="back" style="${rkB(140,12,240,88)}"></button>
    <div class="ysT2" style="${rkB(240,14,620,86)}"><b>EVENTO · YUTA</b><small>🌸 ${ysLeft()} · até domingo 23:59</small></div>
    <button class="ysTabA" data-a="ytab" data-t="farm" style="${rkB(690,22,1008,82)}">🌸 FARM DO EVENTO<small>sem XP · drops do evento</small></button>
    <div class="ysTabA on" style="${rkB(1040,22,1392,82)}">👑 RANQUEADO<small>dá XP de rank</small></div>
    <div class="ysTabA tm" style="${rkB(1418,22,1740,82)}">⏳ ${ysLeft()}<small>evento do Yuta</small></div>
    <div class="ysEmb" style="${rkB(645,140,770,258)}">${rkEmb(ri,'ban')}</div>
    <div class="ysRkN" style="${rkB(815,140,1300,212)}"><b style="color:${RKR[ri].c}">${RKR[ri].n}</b><span>${rkFmtN(xp)} / ${ri>=RKTOP?'∞':rkFmtN(RKXP[ri+1])} XP</span></div>
    <div class="ysBarA" style="${rkB(820,224,1200,242)}"><s style="width:${prog}%;background:${RKR[ri].c}"></s></div>
    <div class="ysWL w" style="${rkB(1600,165,1683,216)}"><small>VITÓRIA</small><b>+${RKXW[ri]*(rkEvX()?rkEvX()[2]:1)}</b></div><div class="ysWL l" style="${rkB(1699,165,1783,216)}"><small>DERROTA</small><b>-${RKXL[ri]}</b></div>
    ${CX.map(([a,b],j)=>{const i=j+Math.max(0,ri-7);return `<div class="ysLvA ${i===ri?'on':i<ri?'ok':'lk'}" style="${rkB(a,280,b,328)}">${i<ri?'✔ ':i>ri?'🔒 ':'★ '}${i+1}</div>`}).join('')}
    <div class="ysInfoA" style="${rkB(645,360,1780,645)}"><h5>YUTA NÍVEL ${ri+1} · igual ao seu rank</h5><span>❤️ ${rkPhB(ri)[0]} barras → DESPERTAR com ${rkPhB(ri)[1]} barras (3x velocidade, +60% dano)</span><span>💪 resistência ${L.v}% · ⚔️ dano ${L.d}% · 💨 velocidade ${L.s}% · 🧠 ${RKPAS[ri][1]}</span>
      <span>🛡️ Passivas: ${pas.length?pas.map(k=>YSPN[k][0]+' '+YSPN[k][1]).join(' · '):'nenhuma'} · passiva do Yuta: contra-ataque a cada 4 golpes</span>
      <span>🎁 Vitória: 💎 5–15 · 🔴 5–10 · baú · pó · ✦ drops do Boss · bônus de recorde e de combo</span></div>
    ${[['👑',RKR[ri].n,'seu rank'],['🍀','SORTE '+S,'drops ×'+lk.toFixed(2)],['🏆',RKSRV?(RKSRV[ri]?twFmt(RKSRV[ri].tt):'—'):'...','recorde do servidor'],['🏅',rkMyRec(ri)?twFmt(rkMyRec(ri)):'—','seu recorde']].map(([i,b,s],k)=>`<div class="ysHex" style="${rkB(45,295+k*85,250,355+k*85)}"><i>${i}</i><span><b>${b}</b><small>${s}</small></span></div>`).join('')}
    <button class="ysEqA" data-a="equip" style="${rkB(600,705,905,782)}">🎒 EQUIPAMENTOS</button>${selB(1022,705,1212,782,[930,697,1020,785])}
    <button class="ysGoA rk" data-a="fight" style="${rkB(1236,698,1808,786)}"><span class="shine"></span><b>INICIAR RANQUEADA</b></button>`}
  const D=YSDIF[YS.d],DX=[[660,877],[893,1110],[1126,1342],[1357,1573],[1588,1805]];
  return `<button class="hs" data-a="back" style="${rkB(92,22,200,84)}"></button>
  <div class="ysT2" style="${rkB(205,24,615,84)}"><b>EVENTO · YUTA</b><small>🌸 ${ysLeft()} · até domingo 23:59</small></div>
  <button class="ysTabA" data-a="ytab" data-t="rank" style="${rkB(818,24,1092,76)}">👑 RANQUEADO<small>dá XP de rank</small></button>
  <div class="ysTabA on" style="${rkB(1130,22,1480,80)}">🌸 FARM DO EVENTO<small>sem XP · drops do evento</small></div>
  ${YSDIF.map((x,i)=>`<button class="ysDifA ${i===YS.d?'on':''}" data-a="ydif" data-i="${i}" style="${rkB(DX[i][0],138,DX[i][1],288)};--c:${x.c}"><b>${x.n}</b><small>${x.ph[0]}→${x.ph[1]} barras</small><small>${x.np.reduce((a,b)=>a+b,0)} passiva${x.np.reduce((a,b)=>a+b,0)>1?'s':''}</small>${x.yt?'<em class="y">✦ YUTA 0,5%</em>':''}${x.sec?'<em>✦ ITENS 0,3%</em>':''}</button>`).join('')}
  <div class="ysInfoA" style="${rkB(670,318,1790,640)}"><h5 style="color:${D.c}">FARM ${D.n} · sem XP de rank</h5><span>❤️ ${D.ph[0]} barras → DESPERTAR com ${D.ph[1]} barras · força do nível ${D.lv+1}${D.k>1?' +'+Math.round((D.k-1)*100)+'% de dano':''}</span>
    <span>🎰 Passivas sorteadas na roleta a cada luta: ${D.np[0]} fácil · ${D.np[1]} média · ${D.np[2]} difícil</span>
    <span class="ysPool">${YSPOOL.map((P,t)=>D.np[t]?P.map(k=>`<i title="${YSPN[k][2]}">${YSPN[k][0]} ${YSPN[k][1]}</i>`).join(''):'').join('')}</span>
    <span>🎁 Vitória: 💎 ${D.gem[0]}–${D.gem[1]} · 🟣 ${D.po[0]}–${D.po[1]} pó · 🛡️ equipamento ${Math.round(D.eq*100)}% · cristal 35% · 🔴 moeda vermelha${D.sec?` · <b style="color:#e2b6ff">✦ item do Yuta 0,3%</b>`:''}${D.yt?` · <b style="color:#ffd84a">✦ YUTA 0,5%</b>`:''}</span></div>
  ${[['🍀','SORTE '+S,'drops ×'+lk.toFixed(2)],['💎',D.gem[0]+'–'+D.gem[1],'gemas por vitória'],['🟣',D.po[0]+'–'+D.po[1],LVPON.toLowerCase()],['✦',D.yt?'YUTA 0,5%':D.sec?'ITENS 0,3%':'—','drop especial']].map(([i,b,s],k)=>`<div class="ysHex" style="${rkB(60,312+k*78,280,372+k*78)}"><i>${i}</i><span><b>${b}</b><small>${s}</small></span></div>`).join('')}
  <button class="ysEqA" data-a="equip" style="${rkB(628,692,920,762)}">EQUIPAMENTOS</button>${selB(1030,694,1206,768,[945,692,1025,772])}
  <button class="ysGoA" data-a="yfight" style="${rkB(1240,688,1806,776)}"><span class="shine"></span><b>INICIAR FARM</b></button><i class="ysFarmOn"></i>`}
/* ---------- roleta de passivas e luta do farm ---------- */
function ysFight(){if(!ysOn()){rkToast('⏳ O evento do Yuta acabou','#cfd6ea');return}RKYD=YS.d;const L=ysRoll(RKYD);YS.roll=L.slice();const all=Object.keys(YSPN);
  if(!L.length){rkBossStart();return}
  rkModal(`<div class="twM ysRol"><h3>🎰 ROLETA DE PASSIVAS · ${YSDIF[RKYD].n}</h3><div class="ysRs">${L.map((k,i)=>`<div class="s" id="ysR${i}"><i>❔</i><b>...</b></div>`).join('')}</div><p class="twH">O Yuta vai lutar com estas passivas nesta partida.</p></div>`);
  let t=0;const iv=setInterval(()=>{t++;L.forEach((k,i)=>{const el=$('ysR'+i);if(!el)return;const stop=t>10+i*5;const kk=stop?k:all[(Math.random()*all.length)|0];el.innerHTML=`<i>${YSPN[kk][0]}</i><b>${YSPN[kk][1]}</b>${stop?`<small>${YSPN[kk][2]}</small>`:''}`;el.classList.toggle('ok',stop)});
    if(t%2===0)rkSfx('whoosh');if(t>10+(L.length-1)*5+1){clearInterval(iv);rkSfx('powerUp');setTimeout(()=>{rkModal(null);rkBossStart()},1300)}},90)}
/* ---------- drops do evento (farm) e o Yuta / itens secretos ---------- */
{const _rr2=rkResult;rkResult=function(R){if(R.yd==null||R.bn!=='YUTA')return _rr2.apply(this,arguments);const D=YSDIF[R.yd],L=lvLuck(),it=[],after=[];
  if(R.won){const g=Math.round(ysRnd(D.gem)*L*rkEvG());rkAdd('gem',g);it.push(`<span style="--c:#5ab8ff"><img src="${RQA.coin[0]}" alt="">🌸 +${g}</span>`);
    const po=Math.round(ysRnd(D.po)*L);rkS('po',lvPo()+po);it.push(`<span style="--c:#b57bff"><img src="${poIco(po)}" alt="">🌸 +${po} PÓ</span>`);
    if(Math.random()<.35*L){const c=Math.min(4,lvCrRoll()+(D.er>1?1:0));lvGive({cr:[c,1]});it.push(`<span style="--c:${RKRC[c]}"><img src="${RQA.lvi.cr[c]}" alt="">CRISTAL ${RKRNM[c]}</span>`)}
    if(Math.random()<D.eq*L){const E=TWEQ[(Math.random()*TWEQ.length)|0];let Rr=twEqRoll();for(let i=0;i<D.er;i++){const R2=twEqRoll();if(TWEQR.indexOf(R2)>TWEQR.indexOf(Rr))Rr=R2}twAddItem(E,Rr);it.push(`<span style="--c:${Rr.c}"><img src="${twIco(E.k,Rr.k)}" alt="">${E.n} ${Rr.n}</span>`)}
    if(D.sec){const left=ytSecLeft();if(left.length&&Math.random()*100<D.sec*L){const k=left[(Math.random()*left.length)|0];rkGiveSp(k);it.push(`<span class="spd" style="--c:#e2b6ff"><img src="${RKSP[k].img}" alt="">✦ ${RKSP[k].nm}</span>`);after.push(()=>rkSecWin(k))}}
    if(D.yt&&!ytOwned()&&Math.random()*100<D.yt*L){const own=rkG('own',[]);own.push('yuta');rkS('own',own);it.push(`<span class="spd" style="--c:#ffd84a"><img src="${IMG.yuta.src}" alt="">✦ YUTA!</span>`);after.push(()=>rkMegaY().then(()=>rkCharWin('yuta',1,1)).then(()=>ytTitClaim(1)))}}
  else{const po=Math.round(ysRnd([2,5])*L);rkS('po',lvPo()+po);it.push(`<span style="--c:#b57bff"><img src="${poIco(po)}" alt="">🌸 +${po} PÓ</span>`)}
  try{acSave()}catch(e){}
  const r=_rr2.apply(this,arguments);try{const C=document.querySelector(RKMS()+'.rkItems');if(C)C.insertAdjacentHTML('beforeend',it.join(''))}catch(e){}
  if(after.length)setTimeout(async()=>{for(const f of after)await f()},R.won?2200:300);return r}}
/* ================= v244: BÔNUS DOS TÍTULOS (título em uso) e ADM +60% em tudo ================= */
const TBUF={ini:{dano:2},gue:{dano:3,vel:2},con:{dano:5,def:3},sem:{dano:6,crit:5},tor:{dano:8,crit:5,vel:5},inf:{dano:5,st:5},
  rk0:{def:1},rk1:{def:2},rk2:{dano:3},rk3:{dano:4,crit:2},rk4:{dano:5,crit:3},rk5:{dano:6,crit:4,vel:3},rk6:{dano:8,crit:5,def:5},rk7:{dano:10,crit:6,def:6,st:5},rk8:{dano:12,crit:7,def:7,st:6},rk9:{dano:14,crit:8,def:8,st:8},rk10:{dano:16,crit:10,def:10,st:10}};
const tbOf=k=>TBUF[k]||(TWTIT[k]&&TWTIT[k].yt?{crit:5}:{});
const tbTxt=k=>{const B=tbOf(k),o=[];if(B.dano)o.push('+'+B.dano+'% dano');if(B.def)o.push('+'+B.def+'% defesa');if(B.vel)o.push('+'+B.vel+'% velocidade');if(B.crit)o.push('+'+B.crit+'% crítico');if(B.st)o.push('+'+B.st+' sorte');return o.join(' · ')};
for(const k in TWTIT){const t=tbTxt(k);if(k==='adm')TWTIT[k].d='Administrador do jogo · ✦ +60% em TUDO (dano, defesa, velocidade, crítico, energia, sorte e drops)';else if(t)TWTIT[k].d=(TWTIT[k].d||'')+' · ✦ Bônus em uso: '+t}
function tbApply(p){if(!p||p.cpu||p.tbOn)return;p.tbOn=1;const B=tbOf(twTitOn());
  if(B.dano)p.tdm=(p.tdm||1)*(1+B.dano/100);if(B.vel)p.tsp=(p.tsp||1)*(1+B.vel/100);if(B.def)p.tdf=(p.tdf||1)/(1+B.def/100);if(B.crit)p.tcr=(p.tcr||0)+B.crit;
  if(twIsAdm()){p.tdm=(p.tdm||1)*1.6;p.tsp=(p.tsp||1)*1.6;p.tdf=(p.tdf||1)/1.6;p.tcr=(p.tcr||0)+60;p.tki=(p.tki||1)*1.6;p.tsb=(p.tsb||1)*1.6}}
twAdmBuff=function(){try{if(!G.p||G.gmode==='boss')return;tbApply(G.p[0])}catch(e){}};
/* placa nova do título ADM (arte do dono) */
{const _pt3=pfTitH;pfTitH=function(t,n,adm){if(t==='adm'&&adm)return `<span class="pfAdmI"><i class="gl"></i><img src="${RQA.tit_adm}" alt="ADM"><i class="sw"></i><i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✦</i><i class="sp d">✦</i></span>`;return _pt3.apply(this,arguments)}}
/* ================= v245: MOLDURAS da foto do perfil (artes do dono) ================= */
const MDL={adm:{n:'ADMINISTRADOR',d:'Só para quem tem o título ADM',ok:()=>twTits().includes('adm'),cls:'adm'},
  rk0:{n:'MADEIRA',r:0},rk1:{n:'BRONZE',r:1},rk2:{n:'PRATA',r:2},rk3:{n:'OURO',r:3},rk4:{n:'DIAMANTE',r:4},rk5:{n:'LENDÁRIO',r:5},rk6:{n:'DRAGÃO LENDÁRIO',r:6},rk7:{n:'DIVINDADE',r:7},rk8:{n:'DIVINDADE SUPREMA',r:8},rk9:{n:'DIVINDADE CELESTIAL',r:9},rk10:{n:'DEUS CELESTIAL',r:10},
  top1:{n:'TOP 1',d:'1º do ranking de RANK nesta semana',top:1,cls:'top'},top2:{n:'TOP 2',d:'Top 2 do ranking de RANK nesta semana',top:2,cls:'top'},top3:{n:'TOP 3',d:'Top 3 do ranking de RANK nesta semana',top:3,cls:'top'},
  ytob:{n:'YUTA OBTIDO',d:'Ter o Yuta',ok:()=>rkG('own',[]).includes('yuta'),cls:'ev yt'},
  yt100:{n:'YUTA 100%',d:'Vencer o Yuta nas 5 dificuldades do farm do evento',ok:()=>((rkSt().ysW||0)&31)===31,cls:'ev yt',pr:()=>[[0,1,2,3,4].filter(i=>(rkSt().ysW||0)&(1<<i)).length,5]},
  br100:{n:'BROLY 100%',d:'Vencer o Broly nos 8 níveis (o farm conta)',ok:()=>((rkSt().brW||0)&255)===255,cls:'ev br',pr:()=>[[0,1,2,3,4,5,6,7].filter(i=>(rkSt().brW||0)&(1<<i)).length,8]}};
for(const k in MDL){const M=MDL[k];if(M.r!=null){M.d='Chegar ao rank '+M.n+' (rank máximo)';M.ok=()=>pfRkMax()>=M.r;M.cls='rk r'+M.r+(M.r>7?' r7':'')}if(M.top)M.ok=()=>{const T=rkG('topw',null);return !!T&&T.w===twWk(Date.now())&&T.n<=M.top}}
const mdOk=k=>{try{return !!MDL[k]&&MDL[k].ok()}catch(e){return false}},mdCur=()=>{const k=rkG('mold','');return mdOk(k)?k:''};
/* moldura por cima do quadrado da foto (x0,y0,x1,y1 = quadrado na arte); o "buraco" da moldura encaixa no quadrado */
function mdH(k,x0,y0,x1,y1,yMax){const A=k&&RQA.mold[k],M=MDL[k];if(!A||!M)return '';const [hx0,hy0,hx1,hy1]=A.h,cy=(y0+y1)/2;let W=(x1-x0)/(hx1-hx0);let H=W/A.ar;
  if(yMax){const lim=(yMax-cy)/(1-(hy0+hy1)/2);if(H>lim){H=lim;W=H*A.ar}}const X=(x0+x1)/2-(hx0+hx1)/2*W,Y=cy-(hy0+hy1)/2*H;
  return `<div class="pfMold ${M.cls}" style="${rkB2(X,Y,X+W,Y+H)}">${M.r>=7||k==='adm'?'<i class="gr"></i><i class="gh"></i>':''}<i class="gl"></i><img src="${A.src}" alt=""><i class="sw"></i>${M.cls==='adm'||/top|ev/.test(M.cls)||M.r>=5?'<i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✦</i><i class="sp d">✦</i>':''}</div>`}
async function mdTopCheck(){try{const A=(await rkLoadRk('rp')).sort((a,b)=>b.rp-a.rp),i=A.findIndex(e=>e.uid===twUid());if(i<0||i>2)return;const w=twWk(Date.now()),T=rkG('topw',null);if(!T||T.w!==w||i+1<T.n)rkS('topw',{w,n:i+1})}catch(e){}}
function mdPick(){mdTopCheck().then(()=>{if(document.querySelector('#rkModal .mdG'))mdPick0()});mdPick0()}
function mdPick0(){const cur=rkG('mold','');
  rkModal(`<div class="twM mdM"><h3>🖼️ MOLDURA DA FOTO</h3><p class="twH">Toque numa moldura liberada para usar. As de TOP valem durante a semana em que você ficou no top do ranking de RANK.</p><div class="mdG"><button class="mdC ${cur?'':'on'}" data-k=""><span class="no">SEM<br>MOLDURA</span><b>NENHUMA</b></button>${Object.keys(MDL).map(k=>{const M=MDL[k],ok=mdOk(k),pr=M.pr?M.pr():null;return `<button class="mdC ${ok?'':'lk'} ${cur===k&&ok?'on':''}" data-k="${k}"><div class="mdPv ${M.cls}"><img src="${RQA.mold[k].src}" alt=""></div><b>${M.n}</b><small>${ok?(cur===k?'EM USO':'USAR'):'🔒 '+M.d+(pr?' ('+pr[0]+'/'+pr[1]+')':'')}</small></button>`}).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);document.querySelectorAll('#rkModal .mdC').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(k&&!mdOk(k)){rkSfx('clang');rkToast('🔒 '+MDL[k].d,'#cfd6ea');return}rkS('mold',k);rkSfx('powerUp');rkModal(null);rkView('pf');if(k)rkToast('🖼️ Moldura '+MDL[k].n+'!','#ffd84a')})}
/* título ADM: placa feita em código (vermelho/dourado com energia) */
{const _pt4=pfTitH;pfTitH=function(t,n,adm){if(t==='adm'&&adm)return `<span class="pfAdmX"><i class="en"></i><i class="cr">👑</i><b data-t="ADMINISTRADOR">ADMINISTRADOR</b><i class="bolt a"></i><i class="bolt b"></i><i class="sw"></i><i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✦</i></span>`;return _pt4.apply(this,arguments)}}
/* v247: itens do Yuta sempre com os bônus certos (corrige itens já guardados) */
(function(){try{const I=twInv();let ch=0;for(const it of I){const k=Object.keys(RKSP).find(q=>RKSP[q].ysec&&RKSP[q].nm===it.nm);if(!k)continue;const S=RKSP[k];for(const f of ['t','r','v','def','crit','st','trf','fdmg','drop','yt','ysec','img']){if(S[f]!=null&&it[f]!==S[f]){it[f]=S[f];ch=1}else if(S[f]==null&&it[f]!=null&&f!=='img'){delete it[f];ch=1}}}if(ch)twLS.s('tw_inv',I);
  /* v249: item OBSCURO fica sempre equipado */
  const Q=twEqp();let cq=0;for(const it of I)if(rkLock(it)&&!rkLock(I.find(x=>x.id===Q[it.t]))){Q[it.t]=it.id;cq=1}if(cq)twLS.s('tw_eqp',Q)}catch(e){}})();
window.__rk={lvSorte,lvLuck,lvBonus,lvOf,rkExtra,twEqB:s=>twEqB(s)};

/* ================= v250: POÇÕES DE CURA e DE DROP, ANÉIS DE DROP (raridades comum → secreta) =================
   Cura: cura X% da vida máxima 1 vez quando a vida fica abaixo de 35% (próxima luta). Drop: +X% de drop na próxima luta.
   Anel de drop: +X% de drop enquanto equipado (soma com Rika e com a poção). */
const RKPR=['comum','rara','epica','lend','mit','sec'],RKPKV={cura:[3,15,20,45,75,100],drop:[3,15,20,45,75,100]},RKANV=[5,7,10,15,20,35];
const rkPkI=r=>Math.max(0,RKPR.indexOf(r)),rkRarN=r=>(TWEQR.find(q=>q.k===r)||TWEQR[0]).n;
const rkPkTxt=x=>(x.pk==='cura'?'Cura '+x.v+'% da vida quando ela ficar abaixo de 35% (1 vez)':'Drop +'+x.v+'% (itens, anéis, poções, tickets, pó, cristais)')+' · uso único, vale na próxima luta';
function rkPoRoll(){const pk=Math.random()<.5?'cura':'drop';let R=twPoRoll();let k=R.k;if(Math.random()<.01*rkDropF())k='sec';return {k,pk,v:RKPKV[pk][rkPkI(k)]}}
function rkRingRoll(){let r=twEqRoll().k;if(Math.random()<.01*rkDropF())r='sec';return r}
twAddPoc=function(R){const L=twPocs();L.push(Object.assign({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),r:R.k,v:R.v},R.pk?{pk:R.pk}:{}));twLS.s('tw_poc',L);TW.capOut=twCap()};
function rkAddRing(r){const I=twInv(),it={id:'an'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),t:'anel',r,v:0,drop:RKANV[rkPkI(r)],nm:'ANEL DE DROP'};I.push(it);twLS.s('tw_inv',I);
  const Q=twEqp(),cur=I.find(x=>x.id===Q.anel);if(!cur||(!rkIsY(cur)&&(cur.drop||0)<it.drop)){Q.anel=it.id;twLS.s('tw_eqp',Q)}TW.capOut=twCap();return it}
/* começo da luta (Boss e Torre): arma a cura e liga o drop da poção */
{const _ex=rkExtra;rkExtra=function(){const r=_ex.apply(this,arguments);try{if(!G.p)return r;const torre=typeof TW!=='undefined'&&TW.on&&G.gmode==='torre',boss=G.gmode==='boss';if(!torre&&!boss)return r;const p=G.p[0];
  const c=rkG('pk_cura',null),d=rkG('pk_drop',null);p.rkCura=c?c.v:0;RKPDN=d?d.v:0;if(c)rkS('pk_cura',null);if(d)rkS('pk_drop',null);
  if(c||d)setTimeout(()=>{try{txt(p.x,p.y-340,(c?'💚 CURA '+c.v+'% PRONTA':'')+(c&&d?' · ':'')+(d?'🎁 DROP +'+d.v+'%':''),'#7dff9a')}catch(e){}},2200)}catch(e){}return r}}
function rkCuraTick(){const p=G.p&&G.p[0];if(!p||!p.rkCura||p.hp<=0||p.ko)return;const m=p.mhp||MAXHP;if(p.hp>=m*.35)return;
  const h=Math.round(m*p.rkCura/100);p.hp=Math.min(m,p.hp+h);txt(p.x,p.y-300,'💚 POÇÃO DE CURA +'+p.rkCura+'%','#7dff9a');try{ring(p.x,p.y-150,'#7dff9a',220,22,7)}catch(e){}try{rkSfx('powerUp')}catch(e){}p.rkCura=0}
/* o drop da poção vale só para a luta em que foi usada */
{const _r3=rkResult;rkResult=function(){try{return _r3.apply(this,arguments)}finally{RKPDN=0}}}
{const _tf3=twFinish;twFinish=function(){try{return _tf3.apply(this,arguments)}finally{RKPDN=0}}}
/* ================= v251: POÇÕES DE CURA na LOJA DA TORRE (bem caras) ================= */
const TWSHCU=[1000,2000,4000,5000,6000,20000];
{const _sh=twShop;twShop=function(){const r=_sh.apply(this,arguments);try{const L=document.querySelector('#twModal .shL');if(!L)return r;const c=twCoins();
  L.insertAdjacentHTML('afterend',`<h4 class="shCuT">💚 POÇÕES DE CURA</h4><div class="shL shCu">${RKPR.map((k,i)=>{const R=TWEQR.find(q=>q.k===k)||TWEQR[0],v=RKPKV.cura[i];return `<button class="shI ${c<TWSHCU[i]?'off':''}" data-cu="${i}" style="--c:${R.c}"><span class="rr">${R.n}</span><img src="${RQA.pcu[i]}" alt=""><b>CURA ${R.n}</b><span class="ds">💚 Cura +${v}% da vida<br>quando ela ficar<br>abaixo de 35%<br><i>uso único · próxima luta</i></span><em>🪙 ${rkFmtN(TWSHCU[i])}</em></button>`}).join('')}</div>`);
  document.querySelectorAll('#twModal .shCu .shI').forEach(b=>b.onclick=()=>{const i=+b.dataset.cu,E=$('twShE'),P={k:RKPR[i],pk:'cura',v:RKPKV.cura[i]};
    try{if(!twPocFits(P)){E.className='twH err';E.textContent='Mochila cheia (40 espaços com pilhas de 99)! Libere espaço para comprar.';return}}catch(e){}
    if(twCoins()<TWSHCU[i]){E.className='twH err';E.textContent='Moedas insuficientes.';twSfx('clang');return}
    twAddCoins(-TWSHCU[i]);twAddPoc(P);twSfx('powerUp');twToast('💚 POÇÃO DE CURA '+(TWEQR.find(q=>q.k===P.k)||TWEQR[0]).n+' comprada! Está na mochila','#7dff9a');twShop()})}catch(e){}return r}}
twPocFits=function(R){const k='p|'+(R.pk||'')+'|'+R.k+'|'+R.v,S=twStacks();return S.some(x=>x.key.split('#')[0]===k&&x.n<99)||S.length<TWBAG};
/* ================= v252: BAÚS DA TORRE dão poção de CURA/DROP e ANEL DE DROP =================
   Cada baú: 25% poção de cura ou drop, 10% anel de drop (× drop). A raridade é a do baú; 1% × drop vira SECRETA. */
function rkBauX(br){const F=rkDropF(),x=Math.random();let k=TWRK.includes(br)?br:'comum';if(x>=.35*F)return null;if(Math.random()<.01*F)k='sec';const R=TWEQR.find(q=>q.k===k)||TWEQR[0],i=rkPkI(k);
  if(x<.25*F){const pk=Math.random()<.5?'cura':'drop';return {t:'pk',pk:{k,pk,v:RKPKV[pk][i]},R,ic:RQA[pk==='cura'?'pcu':'pdr'][i],nm:pk==='cura'?'CURA':'DROP'}}
  return {t:'ring',ring:k,R,ic:RQA.anel[i],nm:'ANEL'}}

/* ================= v253: PASSIVAS / ENCANTAMENTOS (Joia Negra) — regras do dono em ferramentas/ranqueada_artes/v253/REGRAS_PASSIVAS.txt =================
   1 joia = 1 giro. Raridade: comum 50, rara 27, épica 14, lendária 6, mítica 2,5, secreta 0,5. Depois 1 das 6 passivas da raridade (iguais).
   Alvos: personagem, espada, capacete, anel, armadura, botas — 1 passiva cada. Proteção: 50 sem lendária+ → lendária+; 200 sem mítica+ → mítica+.
   Tudo guardado em rk_ps (uma chave só: joias, contadores, giro pendente, passivas dos personagens, aura). Passiva de item fica no item (it.ps={r,i}). */
const PSW={comum:50,rara:27,epica:14,lend:6,mit:2.5,sec:.5};
const PSV={comum:[['Golpe Preciso','cd',3],['Pele Resistente','def',2],['Punhos Ágeis','spd',2],['Recuperação Leve','reg',.15],['Caçador Iniciante','drop',3],['Pequena Fortuna','st',2]],
  rara:[['Golpe Mortal','cd',6],['Armadura Reforçada','def',4],['Reflexos Rápidos','spd',4],['Regeneração Natural','reg',.3],['Caçador Experiente','drop',7],['Amuleto da Fortuna','st',5]],
  epica:[['Instinto Assassino','cd',10],['Corpo de Aço','def',7],['Velocidade Sobrenatural','spd',7],['Sangue Regenerativo','reg',.5],['Caçador de Tesouros','drop',12],['Bênção da Sorte','st',9]],
  lend:[['Destruidor de Destinos','cd',15],['Proteção Celestial','def',10],['Relâmpago Divino','spd',10],['Coração Imortal','reg',.75],['Imperador dos Tesouros','drop',20],['Fortuna Celestial','st',15]],
  mit:[['Julgamento Divino','cd',21],['Corpo do Deus da Guerra','def',14],['Velocidade da Luz','spd',13],['Regeneração Divina','reg',1],['Soberano dos Drops','drop',30],['Destino Abençoado','st',22]],
  sec:[['Olhos da Destruição','cd',30],['Corpo Absoluto','def',18],['Deus da Velocidade','spd',16],['Coração Eterno','reg',1.5],['Monarca dos Tesouros','drop',45],['Escolhido pelo Destino','st',35]]};
const PSCAP={cd:60,def:35,spd:25,reg:2,drop:100,st:70},PSRC={comum:'#c3c8d2',rara:'#3d9bff',epica:'#b25bff',lend:'#ffc531',mit:'#ff2e63',sec:'#b06bff'},
  PSTC={cd:'#ff3b3b',def:'#9fd0ff',spd:'#3cf0ff',reg:'#5dff8a',drop:'#ffd23a',st:'#c77dff'},PSTI={cd:'💥',def:'🛡️',spd:'⚡',reg:'💚',drop:'🎁',st:'🍀'};
const psRN=r=>({comum:'COMUM',rara:'RARA',epica:'ÉPICA',lend:'LENDÁRIA',mit:'MÍTICA',sec:'SECRETA'}[r]||r),psRI=r=>RKPR.indexOf(r);
const psDef=ps=>{const L=ps&&PSV[ps.r];const d=L&&L[ps.i];return d?{n:d[0],k:d[1],v:d[2],r:ps.r}:null};
const psFx=d=>d.k==='cd'?'+'+d.v+'% de dano crítico':d.k==='def'?'+'+d.v+'% de defesa':d.k==='spd'?'+'+d.v+'% de velocidade de ataque':d.k==='reg'?'regenera '+String(d.v).replace('.',',')+'% da vida a cada 5 s':d.k==='drop'?'+'+d.v+'% de drop':'+'+d.v+'% de sorte';
const psG=()=>Object.assign({jn:0,pl:0,pm:0,pend:null,ch:{},aura:{}},rkG('ps',{})),psS=o=>{rkS('ps',o);try{acSave()}catch(e){}};
function psAddJn(n){const o=psG();o.jn=Math.max(0,(o.jn|0)+n);psS(o)}
const psCls=x=>{const d=x&&x.ps&&psDef(x.ps);return d&&psRI(d.r)>=2?` psg psr_${d.r} pst_${d.k}`:''};
/* soma das passivas do personagem + equipamentos colocados, com os limites globais */
function psSum(id){const o={cd:0,def:0,spd:0,reg:0,drop:0,st:0};try{id=id||eqChar();const L=[psG().ch[id]];const q=twEqOn();for(const k in q)L.push(q[k].ps);for(const ps of L){const d=psDef(ps);if(d)o[d.k]+=d.v}for(const k in o)o[k]=Math.min(PSCAP[k],Math.round(o[k]*100)/100)}catch(e){}return o}
/* sorteio (o resultado sai daqui, não da animação) */
function psRoll(o){const el=o.pm>=200?['mit','sec']:o.pl>=50?['lend','mit','sec']:RKPR;const T=el.reduce((a,k)=>a+PSW[k],0);let x=Math.random()*T,r=el[el.length-1];for(const k of el){if((x-=PSW[k])<0){r=k;break}}
  const ri=psRI(r);o.pl=ri>=3?0:(o.pl|0)+1;o.pm=ri>=4?0:(o.pm|0)+1;return {r,i:(Math.random()*6)|0}}
let PSRET=null,PS={tg:'esp',sel:null,pg:0,busy:0,anim:0};
const PSTG=[['ch','👤','PERSONAGEM'],['esp','🗡️','ESPADA'],['cap','⛑️','CAPACETE'],['anel','💍','ANEL'],['arm','🛡️','ARMADURA'],['bot','🥾','BOTAS']];
function psOpen(){PSRET=RKV==='ps'?PSRET:RKV;const o=psG();if(o.pend){PS.tg=o.pend.tg.k==='ch'?'ch':(twInv().find(x=>x.id===o.pend.tg.id)||{}).t||PS.tg;PS.sel=o.pend.tg.id}rkModal(null);rkView('ps')}
function psList(){if(PS.tg==='ch')return rkG('own',['goku']).filter(id=>CH[id]).map(id=>({k:'ch',id,img:(typeof PTH!=='undefined'&&PTH[id])||fullSrc(id),nm:CH[id].name,ps:psG().ch[id]||null}));
  const I=twInv(),Q=twEqp(),seen=new Map(),L=[];for(const x of I.filter(x=>x.t===PS.tg).sort((a,b)=>(Q[b.t]===b.id)-(Q[a.t]===a.id)||(psRI(b.r)-psRI(a.r))||((b.v||0)-(a.v||0)))){const on=Q[x.t]===x.id,k=on?'#on':twStKey(x);if(seen.has(k)){seen.get(k).n++;continue}const e={k:'it',id:x.id,it:x,img:rkItIc(x),nm:rkItNm(x),ps:x.ps||null,on,n:1};seen.set(k,e);L.push(e)}return L}
function psTarget(){const L=psList();let t=L.find(e=>e.id===PS.sel);if(!t&&PS.tg!=='ch'){const it=twInv().find(x=>x.id===PS.sel&&x.t===PS.tg);if(it)t={k:'it',id:it.id,it,img:rkItIc(it),nm:rkItNm(it),ps:it.ps||null}}return t||null}
const psGemH=(ps,big)=>{const d=psDef(ps);return d?`<div class="psGem ${big?'big':''} psr_${d.r}" style="--rc:${PSRC[d.r]};--pc:${PSTC[d.k]}"><img src="${RQA.jn}" alt=""><i>${PSTI[d.k]}</i></div>`:''};
const psTxtH=ps=>{const d=psDef(ps);return d?`<b style="color:${PSRC[d.r]}">${psRN(d.r)} · ${d.n}</b><small>${PSTI[d.k]} ${psFx(d)}</small>`:'<b class="no">SEM PASSIVA</b>'};
function psH(){const o=psG(),L=psList(),np=Math.max(1,Math.ceil(L.length/9));PS.pg=Math.min(PS.pg,np-1);const t=psTarget(),pend=o.pend,cells=[[1272,212,1385,330],[1396,212,1505,330],[1515,212,1630,330],[1272,343,1385,460],[1396,343,1505,460],[1515,343,1630,460],[1272,472,1385,590],[1396,472,1505,590],[1515,472,1630,590]];
  const pg=L.slice(PS.pg*9,PS.pg*9+9),S=psSum(t&&t.k==='ch'?t.id:undefined);
  return `<button class="hs psBack" data-p="back" style="${rkB2(10,8,130,88)}">⬅</button>
  <div class="psTit" style="${rkB2(150,14,560,74)}">💠 ENCANTAMENTO<small>1 Joia Negra = 1 giro</small></div>
  <div class="psTabs" style="${rkB2(1262,140,1640,200)}">${PSTG.map(([k,i,n])=>`<button data-p="tg" data-k="${k}" class="${PS.tg===k?'on':''}" title="${n}">${i}</button>`).join('')}</div>
  ${cells.map((c,j)=>{const e=pg[j];return `<button class="psCell ${e?'':'empty'} ${e&&t&&e.id===t.id?'sel':''}${e&&e.ps?psCls({ps:e.ps}):''}" ${e?`data-p="sel" data-id="${e.id}"`:''} style="${rkB2(...c)};${e&&e.ps?'--rc:'+PSRC[e.ps.r]:''}">${e?`<img src="${e.img}" alt=""><span>${twEsc(e.nm)}</span>${e.on?'<em class="on">EQUIPADO</em>':''}${e.n>1?`<em class="n">x${e.n}</em>`:''}${e.ps?`<i class="pd" style="background:${PSRC[e.ps.r]}"></i>`:''}`:''}</button>`}).join('')}
  <div class="psPg" style="${rkB2(1300,598,1600,640)}"><button data-p="pg" data-d="-1">◀</button><span>${PS.pg+1}/${np}</span><button data-p="pg" data-d="1">▶</button></div>
  <div class="psSlot" style="${rkB2(486,346,616,481)}">${t?`<img src="${t.img}" alt="">${t.ps?psGemH(t.ps):''}`:'<span>escolha<br>à direita</span>'}</div>
  <div class="psLbl" style="${rkB2(425,492,680,572)}">${t?`<b class="nm">${twEsc(t.nm)}</b>${psTxtH(t.ps)}`:'<small>Escolha o personagem ou o item na lista</small>'}</div>
  <div class="psWheel ${PS.anim?'spin':''}" id="psWheel" style="${rkB2(745,320,931,506)}">${pend&&!PS.anim?psGemH(pend,1):`<img class="jn" src="${RQA.jn}" alt="">`}<b id="psWT">${pend&&!PS.anim?psRN(pend.r):''}</b></div>
  <div class="psSlot nw" style="${rkB2(1059,346,1190,481)}">${pend&&!PS.anim?psGemH(pend):'<span>nova<br>passiva</span>'}</div>
  <div class="psLbl" style="${rkB2(995,492,1250,572)}">${pend&&!PS.anim?`<b class="nm">NOVA</b>${psTxtH(pend)}`:'<small>A passiva sorteada aparece aqui</small>'}</div>
  <div class="psJn" style="${rkB2(512,778,610,848)}"><img src="${RQA.jn}" alt=""><b>${o.jn|0}</b></div>
  <div class="psAct" style="${rkB2(640,770,1040,856)}">${pend&&!PS.anim?`<button data-p="apply" class="ok">✔ APLICAR NOVA</button><button data-p="keep">✖ MANTER ANTIGA</button>`:`<button data-p="spin" class="go" ${!t||(o.jn|0)<1||PS.anim?'disabled':''}>💠 GIRAR · 1 JOIA</button>`}</div>
  <div class="psPity" style="${rkB2(1060,774,1186,852)}"><span>Lendária+ em <b>${Math.max(1,50-(o.pl|0))}</b></span><span>Mítica+ em <b>${Math.max(1,200-(o.pm|0))}</b></span></div>
  <button class="psInfo" data-p="info" style="${rkB2(1590,600,1640,642)}">?</button>
  <div class="psSum" style="${rkB2(30,880,1660,930)}">Total ${t&&t.k==='ch'?'de '+twEsc(t.nm):'do personagem em uso'}: 💥 +${S.cd}% crítico · 🛡️ +${S.def}% defesa · ⚡ +${S.spd}% vel. de ataque · 💚 ${String(S.reg).replace('.',',')}%/5s · 🎁 +${S.drop}% drop · 🍀 +${S.st}% sorte</div>`}
function psOn(){const W=$('rkWrap');W.querySelectorAll('[data-p]').forEach(b=>b.onclick=e=>{e.stopPropagation();psAct(b.dataset.p,b)})}
function psAct(a,b){const o=psG();
  if(a==='back')return rkView(PSRET||'boss');
  if(a==='info')return rkModal(`<div class="twM sm psInfoM"><h3>💠 COMO FUNCIONA</h3><p class="twH">1 Joia Negra = 1 giro. Cada personagem e cada item (espada, capacete, anel, armadura, botas) tem 1 espaço de passiva. Depois do giro você escolhe APLICAR a nova ou MANTER a antiga (a joia é gasta igual).</p><p class="twH">Chances: Comum 50% · Rara 27% · Épica 14% · Lendária 6% · Mítica 2,5% · Secreta 0,5%. Proteção: 50 giros sem Lendária+ garante Lendária+; 200 sem Mítica+ garante Mítica+.</p><p class="twH">Limites somando tudo: crítico +60 · defesa +35% · velocidade +25% · regeneração 2%/5s (máx. 15% da vida por luta) · drop +100% · sorte +70%.</p><p class="twH">Joia Negra: 4% de chance em cada vitória (Boss, farm, evento, andar da Torre); a SORTE aumenta essa chance. Também vem de códigos e do Mercado Negro.</p><div class="row"><button class="btn" id="rkMX">OK</button></div></div>`),$('rkMX').onclick=()=>rkModal(null);
  if(PS.anim||PS.busy)return;
  if(a==='tg'||a==='sel'||a==='pg'){if(o.pend&&(a!=='pg')){rkSfx('clang');rkToast('Primeiro escolha: APLICAR ou MANTER a passiva sorteada','#ff8080');return}
    if(a==='tg'){PS.tg=b.dataset.k;PS.sel=null;PS.pg=0}else if(a==='sel')PS.sel=b.dataset.id;else{const np=Math.max(1,Math.ceil(psList().length/9));PS.pg=(PS.pg+(+b.dataset.d)+np)%np}rkSfx('whoosh');return rkView('ps')}
  if(a==='spin'){const t=psTarget();if(!t||o.pend)return;if((o.jn|0)<1){rkSfx('clang');rkToast('Sem Joia Negra!','#ff8080');return}PS.busy=1;
    const R=psRoll(o);o.jn=(o.jn|0)-1;o.pend={tg:{k:t.k,id:t.id},r:R.r,i:R.i};psS(o);  /* gasta a joia e guarda o resultado juntos (uma gravação só) */
    PS.anim=1;rkView('ps');psAnim(R.r,()=>{PS.anim=0;PS.busy=0;rkView('ps');const d=psDef(R);rkSfx(psRI(R.r)>=3?'boom':'powerUp');if(psRI(R.r)>=4)try{SFX.boom()}catch(e){}rkToast((psRI(R.r)>=3?'✨ ':'')+psRN(R.r)+': '+d.n,PSRC[R.r])});return}
  if(a==='apply'||a==='keep'){const P=o.pend;if(!P)return;PS.busy=1;try{if(a==='apply'){if(P.tg.k==='ch'){o.ch[P.tg.id]={r:P.r,i:P.i}}else{const I=twInv(),it=I.find(x=>x.id===P.tg.id);if(it){it.ps={r:P.r,i:P.i};twLS.s('tw_inv',I)}}}
    o.pend=null;psS(o)}finally{PS.busy=0}rkSfx(a==='apply'?'powerUp':'whoosh');rkToast(a==='apply'?'✔ Passiva aplicada!':'Passiva antiga mantida','#7dff9a');return rkView('ps')}}
function psAnim(r,cb){const W=$('psWheel'),T=$('psWT');if(!W){cb();return}let n=0;const tot=26;const step=()=>{const k=n<tot-1?RKPR[n%6]:r;W.style.setProperty('--rc',PSRC[k]);T.textContent=psRN(k);T.style.color=PSRC[k];try{if(n%2===0)rkSfx('whoosh')}catch(e){}n++;if(n<tot)setTimeout(step,40+n*n*.35);else{W.classList.add('done','psr_'+r);setTimeout(cb,900)}};step()}
/* começo da luta: crítico, defesa, velocidade de ataque, regeneração, aura da passiva secreta */
{const _ex2=rkExtra;rkExtra=function(){const r=_ex2.apply(this,arguments);try{if(!G.p)return r;const torre=typeof TW!=='undefined'&&TW.on&&G.gmode==='torre',boss=G.gmode==='boss';if(!torre&&!boss)return r;const p=G.p[0],id=p.def.id,S=psSum(id);
  p.tcd=(p.tcd||0)+S.cd;if(S.def)p.tdf=(p.tdf||1)/(1+S.def/100);p.pspd=S.spd;p.preg=S.reg;p.pregT=G.frame;p.pregTot=0;p._lhp=p.hp;
  const cp=psG().ch[id],d=psDef(cp);if(d&&d.r==='sec'&&psG().aura[id]!==0){const c=PSTC[d.k];p.def=Object.assign({},p.def,{energy:c,energy2:'#ffffff',fe:c,fe2:'#ffffff',frame:c})}}catch(e){}return r}}
function psRegTick(){const p=G.p&&G.p[0];if(!p||!p.preg||p.hp<=0||p.ko)return;const m=p.mhp||MAXHP;if(p._lhp!=null&&p.hp<p._lhp-.5)p.pregT=G.frame;p._lhp=p.hp;const dt=G.frame-(p.pregT||0);
  if(dt>=300&&dt%300===0&&p.hp<m&&(p.pregTot||0)<m*.15){const h=Math.min(m*p.preg/100,m*.15-(p.pregTot||0),m-p.hp);p.hp+=h;p.pregTot=(p.pregTot||0)+h;p._lhp=p.hp;try{txt(p.x,p.y-300,'💚 +'+String(p.preg).replace('.',',')+'%','#5dff8a')}catch(e){}}}
/* Torre: Joia Negra em cada andar vencido */
{const _ta3=twAfter;twAfter=function(w){const r=_ta3.apply(this,arguments);try{if(w===0&&Math.random()<.04*lvLuck()){psAddJn(1);setTimeout(()=>twToast('💠 JOIA NEGRA!','#c46bff'),1200)}}catch(e){}return r}}
/* mochila: botão ENCANTAR, joias e botão da aura (só com passiva SECRETA no personagem) */
{const _eq=rkEquip;rkEquip=function(){const r=_eq.apply(this,arguments);try{const MS=RKMS(),row=document.querySelector(MS+'.rkEq .row'),sel=eqChar(),o=psG(),d=psDef(o.ch[sel]);if(!row)return r;
  const T=document.querySelector(MS+'.rkEq p.eqT:last-of-type');if(T)T.insertAdjacentHTML('afterbegin',`<b class="eqGr">💠 Joias Negras: ${o.jn|0}</b> · `);
  if(showScreen.cur==='ranked')row.insertAdjacentHTML('afterbegin','<button class="btn main" id="psGo">💠 ENCANTAR</button>');
  if(d&&d.r==='sec')row.insertAdjacentHTML('afterbegin',`<button class="btn" id="psAu">✨ AURA DA PASSIVA: ${o.aura[sel]===0?'DESLIGADA':'LIGADA'}</button>`);
  const g=$('psGo');if(g)g.onclick=()=>{rkModal(null);psOpen()};const au=$('psAu');if(au)au.onclick=()=>{const o2=psG();o2.aura[sel]=o2.aura[sel]===0?1:0;psS(o2);rkSfx('powerUp');rkEquip()}}catch(e){}return r}}

/* ================= v254: MERCADO NEGRO (jogadores vendem por diamantes, preço livre; ADM muda preço ou remove) =================
   Firestore só deixa CRIAR documentos, então:
   - anúncio  mk_<lid>  {mk:'1', mkv:<chave do vendedor>, lid, nome, it(JSON), preco}
   - fechamento (compra / cancelamento / ADM removeu)  mkb_<lid>  {mkx:'1', mks:<chave do vendedor>, lid, tipo:'buy'|'cx'|'rm', preco}  → documentId fixo = só UM consegue (409 para o resto)
   - preço do ADM  mkp_<lid>_<ts>  {mkp:'1', lid, preco}  → vale o mais novo
   - recebimento  mkc_<lid>  → o vendedor recebe 1 vez só (diamantes ou o item de volta) */
const mnKey=()=>twHash(twUid());let MN={tab:'buy',pg:0,sel:null,L:null,C:null,P:null,load:0,busy:0};
const mnIV=v=>({integerValue:String(Math.max(0,Math.round(v)))}),mnSV=v=>({stringValue:String(v)});
async function mnPost(id,f){return twFetchT(TWURL+'/torre?documentId='+id+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:Object.assign({nome:mnSV(String(twLS.g('tw_nome','')||'?').slice(0,16)),andar:mnIV(0),tempo:mnIV(0),uid:mnSV(twUid()),v:mnIV(254)},f)})})}
const mnBadge=()=>{try{return (rkG('mkpend',0)|0)>0}catch(e){return false}};
function mnOpen(){MN.tab='buy';MN.pg=0;MN.sel=null;rkView('mn');mnLoad()}
async function mnLoad(fresh){MN.load=1;if(fresh!==0)for(const k in RKQC)if(k.includes('"mk'))delete RKQC[k];try{const [L,C,P]=await Promise.all([rkQ('mk','1',600),rkQ('mkx','1',1500),rkQ('mkp','1',600)]);MN.L=L;MN.C=new Map(C.map(c=>[c.lid,c]));MN.P={};for(const x of P.sort((a,b)=>a._ct-b._ct))MN.P[x.lid]=x.preco|0;MN.err=0}catch(e){MN.err=1}MN.load=0;if(RKV==='mn')rkView('mn');mnClaim(1)}
const mnPrice=l=>MN.P&&MN.P[l.lid]!=null?MN.P[l.lid]:(l.preco|0);
function mnIt(l){try{return JSON.parse(l.it)}catch(e){return null}}
/* item do anúncio → objeto de vitrine (ícone, nome, cor, texto) */
function mnView(o){if(!o)return null;if(o.k==='jn')return {img:RQA.jn,nm:'JOIA NEGRA',c:'#c46bff',r:'sec',ef:'Usada para girar PASSIVAS (1 joia = 1 giro)',x:null};
  if(o.k==='poc'){const x={t:'poc',r:o.p.r,v:o.p.v,pk:o.p.pk};return {img:rkItIc(x),nm:rkItNm(x),c:rkItC(x),r:x.r,ef:rkItEf(x),x}}
  const x=o.it;return {img:rkItIc(x),nm:rkItNm(x),c:rkItC(x),r:x.r,ef:rkItEf(x),x}}
/* limpa um item vindo de outro jogador */
function mnClean(o){if(!o||typeof o!=='object')return null;const N=(v,m)=>Math.max(0,Math.min(m,+v||0)),R=[...RKPR,'obs'];
  if(o.k==='jn')return {k:'jn'};
  if(o.k==='poc'&&o.p&&R.includes(o.p.r))return {k:'poc',p:{r:o.p.r,v:N(o.p.v,100),...(o.p.pk==='cura'||o.p.pk==='drop'?{pk:o.p.pk}:{})}};
  const x=o.it;if(o.k!=='eq'||!x||!R.includes(x.r)||!['esp','arm','bot','cap','anel'].includes(x.t)||x.uniq)return null;
  const it={t:x.t,r:x.r,v:N(x.v,999)};for(const k of ['crit','dmg','vel','st','def','fdmg','trf','drop'])if(x[k])it[k]=N(x[k],999);if(x.nm)it.nm=String(x.nm).slice(0,30);if(x.img&&/^a\/[0-9a-f]+\.webp$/.test(x.img))it.img=x.img;if(x.yt)it.yt=1;if(x.ysec)it.ysec=1;
  if(x.ps&&PSV[x.ps.r]&&(x.ps.i|0)>=0&&(x.ps.i|0)<6)it.ps={r:x.ps.r,i:x.ps.i|0};return {k:'eq',it}}
function mnGive(o){o=mnClean(o);if(!o)return false;if(o.k==='jn'){psAddJn(1);return true}if(o.k==='poc'){twAddPoc({k:o.p.r,v:o.p.v,pk:o.p.pk});return true}
  const I=twInv();I.push(Object.assign({id:'mk'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)},o.it));twLS.s('tw_inv',I);TW.capOut=twCap();return true}
/* o que eu posso vender */
function mnMine(){const L=[],seen=new Map();const o=psG();if((o.jn|0)>0)L.push({key:'jn',k:'jn',n:o.jn|0,v:mnView({k:'jn'})});
  for(const x of twInv()){if(x.uniq)continue;const k='e|'+twStKey(x);if(seen.has(k)){seen.get(k).n++;seen.get(k).ids.push(x.id);continue}const e={key:k,k:'eq',ids:[x.id],n:1,v:mnView({k:'eq',it:x})};seen.set(k,e);L.push(e)}
  for(const x of twPocs()){const k='p|'+(x.pk||'')+'|'+x.r+'|'+x.v;if(seen.has(k)){seen.get(k).n++;seen.get(k).ids.push(x.id);continue}const e={key:k,k:'poc',ids:[x.id],n:1,v:mnView({k:'poc',p:{r:x.r,v:x.v,pk:x.pk}})};seen.set(k,e);L.push(e)}
  return L}
function mnRows(){const me=mnKey();if(MN.tab==='sell')return mnMine().map(e=>({key:e.key,v:e.v,n:e.n,e}));
  if(!MN.L)return [];const act=MN.L.filter(l=>!MN.C.has(l.lid));
  if(MN.tab==='buy')return act.sort((a,b)=>b._ct-a._ct).map(l=>({key:l.lid,v:mnView(mnIt(l)),preco:mnPrice(l),l,mine:l.mkv===me})).filter(r=>r.v);
  return MN.L.filter(l=>l.mkv===me).sort((a,b)=>b._ct-a._ct).map(l=>{const c=MN.C.get(l.lid);return {key:l.lid,v:mnView(mnIt(l)),preco:c&&c.tipo==='buy'?c.preco|0:mnPrice(l),l,st:c?c.tipo:'on',got:(rkG('mkc',[])).includes(l.lid)}}).filter(r=>r.v)}
function mnH(){const R=mnRows(),np=Math.max(1,Math.ceil(R.length/8));MN.pg=Math.min(MN.pg,np-1);const pg=R.slice(MN.pg*8,MN.pg*8+8),cells=[[475,318,655,548],[677,318,857,548],[878,318,1058,548],[1080,318,1260,548],[475,568,655,798],[677,568,857,798],[878,568,1058,798],[1080,568,1260,798]];
  const X=R.find(r=>r.key===MN.sel)||null,adm=twIsAdm(),ST={on:'À VENDA',buy:'VENDIDO',cx:'CANCELADO',rm:'REMOVIDO PELO ADM'};
  let det='',btn='';if(X){det=`<b style="color:${X.v.c}">${twEsc(X.v.nm)} ${X.v.r?rkRarN(X.v.r):''}</b><small>${twEsc(X.v.ef)}</small>${X.l?`<em>Vendedor: ${twEsc(typeof twAl==='function'?twAl(X.l.nome):X.l.nome)}</em>`:''}${X.n>1?`<em>Você tem ${X.n}</em>`:''}${MN.tab==='mine'?`<em class="st st_${X.st}">${ST[X.st]}${X.st==='buy'?' por '+rkFmtN(X.preco)+' 💎':''}${X.got?' · já recebido':''}</em>`:''}`;
    if(MN.tab==='buy')btn=X.mine?`<button data-m="cancel">CANCELAR ANÚNCIO</button>`:`<button data-m="buy"><span>${rkFmtN(X.preco)}</span> COMPRAR</button>`;
    else if(MN.tab==='sell')btn=`<input id="mnPr" type="number" min="1" max="999999" inputmode="numeric" placeholder="preço"><button data-m="list">ANUNCIAR 1</button>`;
    else btn=X.st==='on'?`<button data-m="cancel">CANCELAR ANÚNCIO</button>`:X.got?`<button disabled>RECEBIDO</button>`:`<button data-m="claim">RECEBER</button>`;
    if(adm&&X.l&&!MN.C.has(X.l.lid))det+=`<div class="mnAdm"><input id="mnAP" type="number" min="1" max="999999" inputmode="numeric" placeholder="novo preço"><button data-m="admP">✏️ MUDAR</button><button data-m="admR">🗑️ REMOVER</button></div>`}
  return `<button class="hs mnBack" data-m="back" style="${rkB2(20,20,170,140)}"></button>
  <div class="mnCur" style="${rkB2(1135,22,1290,68)}">${rkFmtN(rkG('gem',0))}</div><div class="mnCur" style="${rkB2(1440,22,1595,68)}">${rkFmtN(twCoins())}</div>
  ${[['buy',545,815],['sell',840,1100],['mine',1110,1365]].map(([k,a,b])=>`<button class="mnTab ${MN.tab===k?'on':''} t_${k}" data-m="tab" data-k="${k}" style="${rkB2(a,170,b,248)}">${k==='mine'&&rkG('mkpend',0)?'<i class="dot"></i>':''}<small>${{buy:'COMPRAR',sell:'VENDER',mine:'MINHAS VENDAS'}[k]}</small></button>`).join('')}
  ${MN.tab!=='sell'&&!MN.L?`<div class="mnMsg" style="${rkB2(475,318,1260,798)}">${MN.err?'Sem internet. Tente de novo.':'Carregando o mercado...'}</div>`:!R.length?`<div class="mnMsg" style="${rkB2(475,318,1260,798)}">${MN.tab==='buy'?'Nenhum item à venda agora.':MN.tab==='sell'?'Nada para vender (itens ÚNICOS não podem ser vendidos).':'Você ainda não anunciou nada.'}</div>`:''}
  ${cells.map((c,j)=>{const r=pg[j];if(!r)return '';return `<button class="mnCell${r.key===MN.sel?' sel':''}${r.v.x?rkYC(r.v.x):''}" data-m="sel" data-k="${twEsc(r.key)}" style="${rkB2(c[0],c[1],c[2],c[3]-48)};--c:${r.v.c}"><img src="${r.v.img}" alt=""><span>${twEsc(r.v.nm)}</span>${r.n>1?`<em>x${r.n}</em>`:''}${r.st&&r.st!=='on'?`<em class="st st_${r.st}">${{buy:'VENDIDO',cx:'CANCELADO',rm:'REMOVIDO'}[r.st]}</em>`:''}</button><div class="mnPrc" style="${rkB2(c[0]+72,c[3]-46,c[2]-6,c[3]-4)}">${r.preco!=null?rkFmtN(r.preco):'—'}</div>`}).join('')}
  <div class="mnPg" style="${rkB2(620,830,1110,875)}"><button data-m="pg" data-d="-1">◀</button><span>${MN.pg+1}/${np}</span><button data-m="pg" data-d="1">▶</button><button data-m="reload">⟳</button></div>
  <div class="mnBig" style="${rkB2(1398,300,1550,450)}">${X?`<img src="${X.v.img}" alt="">`:''}</div>
  <div class="mnDet" style="${rkB2(1318,512,1634,694)}">${X?det:'<small>Toque num item para ver.</small>'}</div>
  <div class="mnBtn" style="${rkB2(1340,718,1625,800)}">${btn}</div>`}
function mnOn(){try{const w=$('rkWrap');w.scrollLeft=0;w.scrollTop=0;if(document.scrollingElement){document.scrollingElement.scrollLeft=0;document.scrollingElement.scrollTop=0}}catch(e){}$('rkWrap').querySelectorAll('[data-m]').forEach(b=>b.onclick=e=>{e.stopPropagation();mnAct(b.dataset.m,b)})}
async function mnAct(a,b){if(a==='back')return rkView('menu');
  if(a==='tab'){MN.tab=b.dataset.k;MN.pg=0;MN.sel=null;rkSfx('whoosh');rkView('mn');if(MN.tab==='mine')mnClaim();return}
  if(a==='sel'){MN.sel=b.dataset.k;rkSfx('whoosh');return rkView('mn')}
  if(a==='pg'){const np=Math.max(1,Math.ceil(mnRows().length/8));MN.pg=(MN.pg+(+b.dataset.d)+np)%np;return rkView('mn')}
  if(a==='reload'){MN.L=null;rkView('mn');return mnLoad()}
  if(MN.busy)return;const R=mnRows(),X=R.find(r=>r.key===MN.sel);if(!X)return;MN.busy=1;try{
  if(a==='list'){const pr=Math.round(+($('mnPr').value||0));if(!(pr>=1&&pr<=999999)){rkSfx('clang');rkToast('Coloque um preço de 1 a 999.999 💎','#ff8080');return}
    let o;const e=X.e;if(e.k==='jn'){const g=psG();if((g.jn|0)<1)return;g.jn-=1;psS(g);o={k:'jn'}}
    else if(e.k==='poc'){const id=e.ids[0],P=twPocs(),x=P.find(y=>y.id===id);if(!x)return;twLS.s('tw_poc',P.filter(y=>y.id!==id));o={k:'poc',p:{r:x.r,v:x.v,pk:x.pk}}}
    else{const id=e.ids[0],I=twInv(),x=I.find(y=>y.id===id);if(!x||x.uniq)return;const Q=twEqp();for(const k in Q)if(Q[k]===id)delete Q[k];twLS.s('tw_eqp',Q);twLS.s('tw_inv',I.filter(y=>y.id!==id));const c=Object.assign({},x);delete c.id;o={k:'eq',it:c}}
    const lid=mnKey()+'_'+Date.now().toString(36);let ok=false;try{const r=await mnPost('mk_'+lid,{mk:mnSV('1'),mkv:mnSV(mnKey()),lid:mnSV(lid),it:mnSV(JSON.stringify(o)),preco:mnIV(pr)});ok=r.ok}catch(x){}
    if(!ok){mnGive(o);rkSfx('clang');rkToast('Não deu para anunciar (sem internet?). O item voltou.','#ff8080');return}
    try{acSave(1)}catch(x){}rkSfx('powerUp');rkToast('🏷️ Anunciado por '+rkFmtN(pr)+' 💎!','#7dff9a');MN.sel=null;MN.busy=0;return mnLoad()}
  if(a==='buy'){const l=X.l,pr=mnPrice(l);if(rkG('gem',0)<pr){rkSfx('clang');rkToast('Diamantes insuficientes!','#ff8080');return}const o=mnClean(mnIt(l));if(!o){rkToast('Item inválido','#ff8080');return}
    let r;try{r=await mnPost('mkb_'+l.lid,{mkx:mnSV('1'),mks:mnSV(l.mkv),lid:mnSV(l.lid),tipo:mnSV('buy'),preco:mnIV(pr)})}catch(x){rkToast('Precisa de internet.','#ff8080');return}
    if(!r.ok){rkSfx('clang');rkToast(r.status===409||r.status===403?'❌ Alguém comprou antes (ou foi cancelado).':'Erro '+r.status,'#ff8080');MN.busy=0;return mnLoad()}
    rkAdd('gem',-pr);mnGive(o);try{acSave(1)}catch(x){}rkSfx('powerUp');setTimeout(()=>rkSfx('boom'),250);rkToast('🛒 Comprado! Já está na mochila.','#7dff9a');MN.sel=null;MN.busy=0;return mnLoad()}
  if(a==='cancel'||a==='admR'){const l=X.l;let r;try{r=await mnPost('mkb_'+l.lid,{mkx:mnSV('1'),mks:mnSV(l.mkv),lid:mnSV(l.lid),tipo:mnSV(a==='admR'?'rm':'cx'),preco:mnIV(0)})}catch(x){rkToast('Precisa de internet.','#ff8080');return}
    rkToast(r.ok?(a==='admR'?'🗑️ Anúncio removido (o item volta para o vendedor)':'Anúncio cancelado. Pegue o item em MINHAS VENDAS.'):'❌ Já foi vendido.',r.ok?'#7dff9a':'#ff8080');MN.busy=0;if(a==='cancel'&&r.ok){MN.tab='mine'}return mnLoad()}
  if(a==='admP'){const v=Math.round(+(($('mnAP')||{}).value)||0);if(!(v>=1&&v<=999999)){rkToast('Digite o novo preço (1 a 999.999)','#ff8080');return}try{const r=await mnPost('mkp_'+X.l.lid+'_'+Date.now().toString(36),{mkp:mnSV('1'),lid:mnSV(X.l.lid),preco:mnIV(v)});rkToast(r.ok?'✏️ Preço mudado para '+rkFmtN(v)+' 💎':'Erro '+r.status,r.ok?'#7dff9a':'#ff8080')}catch(x){rkToast('Precisa de internet.','#ff8080')}MN.busy=0;return mnLoad()}
  if(a==='claim'){MN.busy=0;return mnClaim()}}finally{MN.busy=0}}
/* vendedor recebe: diamantes (vendido) ou o item de volta (cancelado/removido) — 1 vez só (mkc_<lid>) */
let mnClaiming=0;async function mnClaim(quiet){if(mnClaiming)return;mnClaiming=1;let got=0,gem=0,it=0;try{if(!quiet)for(const k in RKQC)if(k.includes('"mk'))delete RKQC[k];const me=mnKey(),C=await rkQ('mks',me,500),done=rkG('mkc',[]);let pend=0;
  const mine=MN.L?MN.L.filter(l=>l.mkv===me):await rkQ('mkv',me,500);
  for(const c of C){if(done.includes(c.lid))continue;const l=mine.find(x=>x.lid===c.lid);if(!l)continue;let r;try{r=await mnPost('mkc_'+c.lid,{mkc:mnSV('1'),lid:mnSV(c.lid)})}catch(x){pend++;continue}
    if(r.ok){if(c.tipo==='buy'){rkAdd('gem',c.preco|0);gem+=c.preco|0}else{mnGive(mnIt(l));it++}got++}done.push(c.lid)}
  rkS('mkc',done);rkS('mkpend',pend);if(got){try{acSave(1)}catch(x){}rkSfx('powerUp');rkToast('💰 Mercado Negro: '+(gem?'+'+rkFmtN(gem)+' 💎 ':'')+(it?it+' item(ns) de volta':''),'#ffd84a')}else if(!quiet&&RKV==='mn')rkToast('Nada para receber agora.','#bfe8ff')}catch(e){}mnClaiming=0;if(got&&RKV==='mn')rkView('mn')}
/* ao abrir o ranqueado, recebe as vendas sozinho */
{const _o=rkOpen;rkOpen=function(){const r=_o.apply(this,arguments);setTimeout(()=>{try{mnClaim(1)}catch(e){}},4000);return r}}

/* ================= v257: TODOS OS BÔNUS DO PERSONAGEM (Biblioteca → Personagens) =================
   nível + equipamentos + título + passivas + rank + ADM. O painel mostra o total; "🔍 ver tudo" abre a tabela por origem. */
const CBK=[['dano','⚔️ Dano','%'],['def','🛡️ Defesa','%'],['crit','🎯 Chance de crítico','%'],['cd','💥 Dano crítico','%'],['vel','💨 Velocidade','%'],['spd','⚡ Vel. de ataque','%'],['trf','🌀 Transformação','%'],['fdmg','🔥 Dano transformado','%'],['uv','✨ Vel. Ultimate','%'],['ls','❤️ Roubo de vida','%'],['reg','💚 Regeneração','%/5s'],['st','🍀 Sorte',''],['drop','🎁 Drop','%']];
const CBS=[['nv','NÍVEL'],['eq','EQUIP.'],['tit','TÍTULO'],['ps','PASSIVA'],['rk','RANK'],['adm','ADM']];
function cbAll(id){const Z=()=>Object.fromEntries(CBK.map(k=>[k[0],0])),S={};for(const [k] of CBS)S[k]=Z();
  try{const L=lvBonus(id);for(const k of ['dano','crit','vel','st','cd','ls','uv'])S.nv[k]=+L[k]||0}catch(e){}
  try{const q=twEqOn();for(const t in q){const it=q[t],n=it.yt&&id!=='yuta'?.5:1,m=EQMAIN[t];if(m==='dano')S.eq.dano+=(it.v||0)*n;if(m==='vida')S.eq.def+=(it.v||0)*n;if(m==='vel')S.eq.vel+=(it.v||0)*n;if(m==='trf')S.eq.trf+=(it.v||0)*n;
    S.eq.dano+=(it.dmg||0)*n;S.eq.def+=(it.def||0)*n;S.eq.vel+=(it.vel||0)*n;S.eq.trf+=(it.trf||0)*n;S.eq.crit+=(it.crit||0)*n;S.eq.st+=(it.st||0)*n;S.eq.fdmg+=(it.fdmg||0)*n;S.eq.drop+=(it.drop||0)*n}}catch(e){}
  try{const B=tbOf(twTitOn());for(const k of ['dano','def','vel','crit','st'])S.tit[k]=B[k]||0}catch(e){}
  try{const P=psSum(id);S.ps.cd=P.cd;S.ps.def=P.def;S.ps.spd=P.spd;S.ps.reg=P.reg;S.ps.drop=P.drop;S.ps.st=P.st}catch(e){}
  try{const R=RKTB(rkLvl());S.rk.dano=R.dano;S.rk.def=R.def;S.rk.vel=R.vel;S.rk.crit=R.crit;S.rk.st=R.sorte}catch(e){}
  if(twIsAdm()){Object.assign(S.adm,{dano:60,def:60,vel:60,crit:60,uv:60,trf:60,st:60,drop:60})}
  const T=Z();for(const [s] of CBS)for(const [k] of CBK)T[k]+=S[s][k];for(const k in T)T[k]=Math.round(T[k]*100)/100;return {S,T}}
const cbN=v=>{v=Math.round(v*100)/100;return String(v).replace('.',',')};
function cbRows(id){const T=cbAll(id).T;return ['+'+cbN(T.dano)+'%'+(T.def?' 🛡️+'+cbN(T.def)+'%':''),cbN(5+T.crit)+'%'+(T.cd?' 💥+'+cbN(T.cd)+'%':''),'+'+cbN(T.vel)+'%'+(T.spd?' ⚡+'+cbN(T.spd)+'%':''),'+'+cbN(T.st)+(T.drop?' 🎁+'+cbN(T.drop)+'%':''),'+'+cbN(T.uv)+'%'+(T.ls?' ❤️'+cbN(T.ls)+'%':'')]}
function cbModal(id){const {S,T}=cbAll(id),rows=CBK.filter(([k])=>T[k]||k==='dano'||k==='crit');
  rkModal(`<div class="twM cbM"><h3>📊 BÔNUS DE ${twEsc(CH[id]?CH[id].name:id)}</h3><p class="twH">Tudo o que está somando agora: nível do personagem, equipamentos colocados, título em uso, passivas, rank${twIsAdm()?' e ADM':''}. ${id!=='yuta'?'Itens do Yuta valem 50% aqui.':''}</p>
  <div class="cbT"><table><tr><th></th>${CBS.filter(([s])=>s!=='adm'||twIsAdm()).map(([,n])=>`<th>${n}</th>`).join('')}<th class="tt">TOTAL</th></tr>
  ${rows.map(([k,n,u])=>`<tr><td class="nm">${n}</td>${CBS.filter(([s])=>s!=='adm'||twIsAdm()).map(([s])=>`<td class="${S[s][k]?'on':''}">${S[s][k]?'+'+cbN(S[s][k])+u:'—'}</td>`).join('')}<td class="tt">${k==='crit'?cbN(5+T[k])+'%':'+'+cbN(T[k])+u}</td></tr>`).join('')}</table></div>
  <p class="twH cbN">Crítico: a chance começa em 5%. Passivas têm limite somando tudo (crítico +60, defesa +35%, vel. de ataque +25%, regeneração 2%/5s, drop +100%, sorte +70). O RANK vale na Torre; a sorte do rank vale em todo lugar.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}

/* ================= v259: PASSE DE BATALHA (Temporada 1) =================
   20 níveis × 3 trilhas: GRÁTIS, PAGO (código) e PRÊMIO (código; também libera a trilha PAGA). XP do passe vem das MISSÕES (diárias + da temporada).
   Dados: rk_bp = {s, xp, c:{contadores da temporada}, dd:'dia', d:{contadores do dia}, dc:[diárias pegas hoje], sc:[da temporada pegas], cf/cn/cp:[níveis pegos], own:0|1|2}. */
const BPS={n:1,fim:Date.UTC(2026,11,10,2,59,59),xpL:250};
const BPF=[[{g:100}],[{j:1}],[{r:150}],[{g:150}],[{j:2}],[{t:2},{g:300}],[{r:200}],[{g:200}],[{j:2}],[{yb:1}],[{r:250}],[{g:300}],[{j:2}],[{pc:'epica'},{g:300}],[{r:300}],[{g:400}],[{j:3}],[{r:400}],[{g:1250},{j:5}],[{ch:'leg'},{r:700}]];
const BPN=[[{g:300},{t:3}],[{j:2}],[{r:300}],[{g:500},{pd:'rara'}],[{an:'epica'}],[{j:2},{r:300}],[{g:600}],[{bau:'lend'}],[{r:400},{t:5}],[{j:3},{g:700}],[{pc:'lend'}],[{g:800},{r:500}],[{j:3}],[{an:'lend'},{g:900}],[{r:700},{t:5}],[{g:1000},{pd:'lend'}],[{j:4},{r:800}],[{bau:'mit'},{g:1200}],[{g:1500},{r:1000},{j:6}],[{ch:'mit'},{g:2500},{r:1000}]];
const BPP=[[{g:500},{t:5}],[{j:3}],[{r:400},{pc:'lend'}],[{g:800}],[{an:'lend'},{j:3}],[{r:500},{g:800}],[{pd:'mit'},{t:5}],[{j:4},{g:1000}],[{bau:'mit'},{r:500}],[{yb:1},{g:1200}],[{j:4},{r:600}],[{g:1400},{pc:'mit'}],[{an:'mit'},{r:700}],[{j:5},{g:1500}],[{ch:'pick'}],[{g:1800},{r:800},{t:10}],[{j:6},{pc:'sec'}],[{g:2500},{r:1000},{an:'sec'}],[{j:15},{g:3000},{r:1000},{pd:'sec'}],[{sw:1},{g:3500},{r:1500}]];
const BPMD=[['d1','Jogue 3 lutas (Boss ou Torre)','fights',3,60],['d2','Vença 2 lutas no Modo Boss','bossW',2,80],['d3','Vença 5 andares da Torre','floor',5,80],['d4','Gire 5 vezes no Gacha','spin',5,60],['d5','Gire 1 passiva','ps',1,40]];
const BPMS=[['s1','Vença 25 lutas no Modo Boss','bossW',25,400],['s2','Vença 60 andares da Torre','floor',60,400],['s3','Complete a Torre 5 vezes','tower',5,400],['s4','Gire 80 vezes no Gacha','spin',80,300],['s5','Gire 15 passivas','ps',15,300],['s6','Jogue 100 lutas','fights',100,400]];
const bpDay=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
function bpG(){let o=rkG('bp',null);if(!o||o.s!==BPS.n)o={s:BPS.n,xp:0,c:{},dd:'',d:{},dc:[],sc:[],cf:[],cn:[],cp:[],own:0};if(o.dd!==bpDay()){o.dd=bpDay();o.d={};o.dc=[]}if(o.ei!==BPEV.id){o.ei=BPEV.id;o.e={};o.ec=[]}return o}
const bpS=o=>{rkS('bp',o);try{acSave()}catch(e){}};
const bpLv=o=>Math.min(20,Math.floor((o.xp|0)/BPS.xpL)),bpOn2=()=>Date.now()<=BPS.fim;
function bpAdd(k,n){try{if(!bpOn2())return;const o=bpG();o.c[k]=(o.c[k]|0)+n;o.d[k]=(o.d[k]|0)+n;if(bpEvOn())o.e[k]=(o.e[k]|0)+n;bpS(o)}catch(e){}}
function bpUnlock(t){const o=bpG();o.own=Math.max(o.own|0,t);bpS(o)}
function bpPend(){try{const o=bpG(),L=bpLv(o);for(let i=0;i<L;i++){if(!o.cf.includes(i))return true;if(o.own>=1&&!o.cn.includes(i))return true;if(o.own>=2&&!o.cp.includes(i))return true}
  if(bpEvOn()&&bpEvL().some(m=>bpEvV(o,m)>=m[3]&&!o.ec.includes(m[0])))return true;
  return BPMD.some(m=>(o.d[m[2]]|0)>=m[3]&&!o.dc.includes(m[0]))||BPMS.some(m=>(o.c[m[2]]|0)>=m[3]&&!o.sc.includes(m[0]))}catch(e){return false}}
/* ícone e texto de cada prêmio */
const BPRK=['comum','rara','epica','lend','mit','sec'],bpRI=k=>Math.max(0,BPRK.indexOf(k));
function bpIco(x){if(x.g)return [RQA.coin[0],rkFmtN(x.g)+' 💎'];if(x.r)return [RQA.coin[1],rkFmtN(x.r)+' 🔴'];if(x.t)return [RQA.coin[2],x.t+' TICKETS'];if(x.j)return [RQA.jn,x.j+' JOIA'+(x.j>1?'S':'')];
  if(x.pc)return [RQA.pcu[bpRI(x.pc)],'CURA '+rkRarN(x.pc)];if(x.pd)return [RQA.pdr[bpRI(x.pd)],'DROP '+rkRarN(x.pd)];if(x.an)return [RQA.anel[bpRI(x.an)],'ANEL '+rkRarN(x.an)];
  if(x.bau)return [TWIMG.bf[Math.max(0,TWRK.indexOf(x.bau))],'BAÚ '+rkRarN(x.bau).replace(/A$/,'O')];if(x.yb)return [RQA.ysp.yesp,'BAÚ DO YUTA'];
  if(x.ch)return [x.ch==='pick'?TWIMG.bf[4]:TWIMG.bf[x.ch==='mit'?4:3],x.ch==='pick'?'PERSONAGEM À ESCOLHA':x.ch==='mit'?'PERSONAGEM MÍTICO':'PERSONAGEM LENDÁRIO'];
  if(x.sw)return [RQA.sp.espada_secreta,'ESPADA À ESCOLHA'];return ['','?']}
const bpRare=L=>L.some(x=>x.ch||x.sw||x.yb||x.an==='sec'||x.pc==='sec'||x.pd==='sec'||x.bau==='mit');
let BP={pg:0,tr:'n',busy:0};
const bpB=(x0,y0,x1,y1)=>`left:${x0/17.74}%;top:${y0/8.87}%;width:${(x1-x0)/17.74}%;height:${(y1-y0)/8.87}%`;
const BPX=[[268,408],[423,560],[575,710],[724,860],[873,1008],[1021,1155],[1168,1303],[1316,1450],[1463,1597],[1610,1745]];
function bpCard(L,i,got,ok,lock,row){const [im,tx]=bpIco(L[0]),ex=L.slice(1).map(x=>bpIco(x)[1]).join(' + ');const st=got?'got':!ok?'far':lock?'lock':'can';
  return `<button class="bpC ${row} ${st}${bpRare(L)?' rare':''}" data-b="${st==='can'?'claim':'info'}" data-r="${row}" data-i="${i}"><img src="${im}" alt=""><b>${tx}</b>${ex?`<small>+ ${ex}</small>`:''}${got?'<i class="ck">✔</i>':st==='can'?'<i class="go">PEGAR</i>':''}${row!=='f'&&!lock?'<i class="ul">🔓</i>':''}</button>`}
function bpH(){const o=bpG(),L=bpLv(o),p0=BP.pg*10,xpIn=(o.xp|0)-L*BPS.xpL,end=Math.max(0,BPS.fim-Date.now()),dd=Math.floor(end/864e5),hh=Math.floor(end%864e5/36e5);
  const TR=BP.tr==='p'?BPP:BPN,TC=BP.tr==='p'?o.cp:o.cn,own=BP.tr==='p'?o.own>=2:o.own>=1;
  return `<button class="hs bpBk" data-b="back" style="${bpB(8,8,118,88)}">⬅</button>
  <div class="bpLv" style="${bpB(440,40,590,150)}"><b>${L}</b><small>/20</small></div>
  <div class="bpT" style="${bpB(615,118,1240,206)}"><b>PASSE DE BATALHA · TEMPORADA ${BPS.n}</b><div class="bpBar"><s style="width:${L>=20?100:xpIn/BPS.xpL*100}%"></s><span>${L>=20?'MÁXIMO!':xpIn+' / '+BPS.xpL+' XP'}</span></div><small>${bpOn2()?'⏳ termina em '+dd+'d '+hh+'h':'TEMPORADA ENCERRADA'}</small></div>
  <div class="bpBtns" style="${bpB(1262,128,1750,204)}"><button data-b="mis">📋 MISSÕES${(BPMD.some(m=>(o.d[m[2]]|0)>=m[3]&&!o.dc.includes(m[0]))||BPMS.some(m=>(o.c[m[2]]|0)>=m[3]&&!o.sc.includes(m[0])))?'<i class="dot"></i>':''}</button><button data-b="code">🎟️ CÓDIGO</button><button data-b="all">✔ PEGAR TUDO</button></div>
  <div class="bpSide f" style="${bpB(70,430,244,520)}"><b>GRÁTIS</b></div>
  <button class="bpSide p ${BP.tr}" data-b="tr" style="${bpB(66,560,246,820)}"><b>${BP.tr==='p'?'👑 PRÊMIO':'⭐ PAGO'}</b><small>${own?'✔ LIBERADO':'🔒 use o código'}</small><em>trocar ⇄</em></button>
  ${BPX.map(([a,b],j)=>{const i=p0+j;return `<div class="bpCell" style="${bpB(a,296,b,462)}">${bpCard(BPF[i],i,o.cf.includes(i),i<L,false,'f')}</div><div class="bpCell" style="${bpB(a,550,b,740)}">${bpCard(TR[i],i,TC.includes(i),i<L,!own,BP.tr)}</div><div class="bpMk ${i<L?'on':''}" style="${bpB((a+b)/2-28,486,(a+b)/2+28,520)}">${i+1}</div>`}).join('')}
  <button class="hs bpAr" data-b="pg" data-d="-1" style="${bpB(0,450,48,540)}"></button><button class="hs bpAr" data-b="pg" data-d="1" style="${bpB(1726,450,1774,540)}"></button>
  <div class="bpPgI" style="${bpB(780,800,1000,840)}">${BP.pg+1}/2 · níveis ${p0+1}–${p0+10}</div>`}
function bpOn(){$('rkWrap').querySelectorAll('[data-b]').forEach(b=>b.onclick=e=>{e.stopPropagation();bpAct(b.dataset.b,b)})}
async function bpAct(a,b){if(a==='back')return rkView('menu');if(a==='pg'){BP.pg=BP.pg?0:1;rkSfx('whoosh');return rkView('bp')}if(a==='tr'){BP.tr=BP.tr==='p'?'n':'p';rkSfx('whoosh');return rkView('bp')}
  if(a==='code')return rkAct('code');if(a==='mis')return bpMis();
  if(a==='info'){const o=bpG(),r=b.dataset.r,i=+b.dataset.i,L=(r==='f'?BPF:r==='p'?BPP:BPN)[i];const lk=(r==='n'&&o.own<1)||(r==='p'&&o.own<2);
    return rkToast(`Nível ${i+1}: `+L.map(x=>bpIco(x)[1]).join(' + ')+(i>=bpLv(o)?' · faça as MISSÕES para chegar':'')+(lk?' · 🔒 libera com o código do passe':''),'#ffd84a')}
  if(BP.busy)return;BP.busy=1;try{
    if(a==='claim')await bpClaim(b.dataset.r,+b.dataset.i);
    if(a==='all'){const o=bpG(),L=bpLv(o);let n=0;for(let i=0;i<L;i++)for(const r of ['f','n','p']){const o2=bpG(),C=r==='f'?o2.cf:r==='n'?o2.cn:o2.cp;if(C.includes(i)||(r==='n'&&o2.own<1)||(r==='p'&&o2.own<2))continue;const T=(r==='f'?BPF:r==='p'?BPP:BPN)[i];if(T.some(x=>x.ch==='pick'||x.sw))continue;await bpClaim(r,i,1);n++}
      rkToast(n?'✔ '+n+' prêmio(s) pegos!':'Nada para pegar agora (personagem/espada à escolha: toque no quadradinho).','#7dff9a')}}finally{BP.busy=0}if(RKV==='bp')rkView('bp')}
/* entrega um nível (o "pego" só é salvo depois de entregar) */
async function bpClaim(r,i,quiet){const o=bpG(),C=r==='f'?'cf':r==='n'?'cn':'cp';if(o[C].includes(i)||i>=bpLv(o))return;if((r==='n'&&o.own<1)||(r==='p'&&o.own<2))return;
  const T=(r==='f'?BPF:r==='p'?BPP:BPN)[i];for(const x of T)if(x.ch==='pick'||x.sw){const ok=await bpPick(x);if(!ok)return}
  const o2=bpG();if(o2[C].includes(i))return;o2[C].push(i);bpS(o2);const msg=[];
  for(const x of T){if(x.g)rkAdd('gem',x.g);if(x.r)rkAdd('red',x.r);if(x.t)rkAdd('tic',x.t);if(x.j)psAddJn(x.j);
    if(x.pc||x.pd){const pk=x.pc?'cura':'drop',k=x.pc||x.pd;twAddPoc({k,pk,v:RKPKV[pk][rkPkI(k)]})}if(x.an)rkAddRing(x.an);
    if(x.yb){const k=YTSEC[(Math.random()*YTSEC.length)|0];rkGiveSp(k);msg.push('✦ '+RKSP[k].nm)}
    if(x.ch==='leg'||x.ch==='mit'){const own=rkG('own',['goku']),P=(x.ch==='mit'?[...RK_MIT,'yuta']:RK_LEG).filter(id=>CH[id]&&!own.includes(id));
      if(P.length){const id=P[(Math.random()*P.length)|0];own.push(id);rkS('own',own);msg.push('✦ '+CH[id].name+' liberado!')}else{const g=x.ch==='mit'?3000:1500;rkAdd('gem',g);msg.push('Você já tem todos: +'+g+' 💎')}}
    if(x.bau)setTimeout(()=>{try{rkBauSeq([{r:x.bau,n:1}])}catch(e){}},400)}
  try{acSave(1)}catch(e){}rkSfx('powerUp');if(T.some(x=>x.ch||x.sw||x.yb))setTimeout(()=>rkSfx('boom'),250);
  if(!quiet||msg.length)rkToast('🎁 Nível '+(i+1)+': '+T.map(x=>bpIco(x)[1]).join(' + ')+(msg.length?' · '+msg.join(' · '):''),'#7dff9a')}
/* escolher personagem / espada */
function bpPick(x){return new Promise(res=>{let L;if(x.ch==='pick'){const own=rkG('own',['goku']);L=[...RK_MIT,'yuta',...RK_LEG,...RK_EPI].filter(id=>CH[id]&&!own.includes(id)).map(id=>({k:id,img:fullSrc(id),nm:CH[id].name}));
    if(!L.length){rkAdd('gem',5000);rkToast('Você já tem todos os personagens: +5000 💎','#7dff9a');return res(true)}}
  else L=[...Object.keys(RKSP).filter(k=>RKSP[k].t==='esp'&&!RKSP[k].uniq).map(k=>({k,img:RKSP[k].img,nm:RKSP[k].nm})),{k:'_mit',img:twIco('esp','mit'),nm:'ESPADA MÍTICA'}];
  rkModal(`<div class="twM bpPk"><h3>${x.ch?'🎭 ESCOLHA SEU PERSONAGEM':'🗡️ ESCOLHA SUA ESPADA'}</h3><p class="twH">Toque em um para pegar. ${x.sw?'Itens de torneio (ÚNICOS) não entram.':''}</p><div class="bpPkG">${L.map(e=>`<button data-k="${e.k}"><img src="${e.img}" alt=""><b>${twEsc(e.nm)}</b></button>`).join('')}</div><div class="row"><button class="btn" id="rkMX">DEPOIS</button></div></div>`);
  $('rkMX').onclick=()=>{rkModal(null);res(false)};
  document.querySelectorAll(RKMS()+'.bpPkG button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;rkModal(null);
    if(x.ch){const own=rkG('own',['goku']);if(!own.includes(k)){own.push(k);rkS('own',own)}rkToast('✦ '+CH[k].name+' liberado!','#ffd84a')}
    else if(k==='_mit')twAddItem(TWEQ.find(E=>E.k==='esp'),TWEQR.find(R=>R.k==='mit'));else rkGiveSp(k);res(true)})})}
function bpMis(){const o=bpG(),X3=bpEvOn()?3:1,row=(m,c,done)=>{const v=m[2]==='rk'?rkRk():Math.min(m[3],c[m[2]]|0),ok=v>=m[3];return `<div class="bpMi ${done?'got':ok?'ok':''}"><span>${m[1]}</span><em>${m[2]==='rk'?(ok?'✔':'🔒'):v+'/'+m[3]}</em><b>+${m[4]*X3} XP</b>${done?'<i>✔</i>':ok?`<button data-m="${m[0]}">PEGAR</button>`:''}</div>`};
  rkModal(`<div class="twM bpMs"><h3>📋 MISSÕES DO PASSE</h3><p class="twH">Cada ${BPS.xpL} XP = 1 nível. As diárias voltam todo dia.</p>${bpEvOn()?`<h4 class="bpEvH">⚡ EVENTO DO PASSE · 3x XP · termina em ${bpEvLeft()}</h4>${bpEvL().map(m=>row(m,o.e,o.ec.includes(m[0]))).join('')}`:''}<h4>☀️ DIÁRIAS${X3>1?' (3x)':''}</h4>${BPMD.map(m=>row(m,o.d,o.dc.includes(m[0]))).join('')}<h4>🏆 DA TEMPORADA${X3>1?' (3x)':''}</h4>${BPMS.map(m=>row(m,o.c,o.sc.includes(m[0]))).join('')}<div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>{rkModal(null);if(RKV==='bp')rkView('bp')};
  document.querySelectorAll(RKMS()+'.bpMi button').forEach(b=>b.onclick=()=>{const o=bpG(),k=b.dataset.m,m=[...BPMD,...BPMS,...bpEvL()].find(x=>x[0]===k),ty=k[0];if(!m)return;if(ty==='e'||ty==='r'){if(!bpEvOn()||bpEvV(o,m)<m[3]||o.ec.includes(k))return;o.ec.push(k)}else{const d=ty==='d',C=d?o.d:o.c,K=d?'dc':'sc';if((C[m[2]]|0)<m[3]||o[K].includes(k))return;o[K].push(k)}
    const l0=bpLv(o);o.xp=(o.xp|0)+m[4]*(bpEvOn()?3:1);bpS(o);rkSfx('powerUp');const l1=bpLv(o);if(l1>l0)rkToast('⬆ PASSE NÍVEL '+l1+'!','#ffd84a');bpMis()})}
/* contadores das missões */
{const _r4=rkResult;rkResult=function(R){try{bpAdd('fights',1);if(R&&R.won)bpAdd('bossW',1)}catch(e){}return _r4.apply(this,arguments)}}
{const _ta4=twAfter;twAfter=function(w){try{bpAdd('fights',1);if(w===0)bpAdd('floor',1)}catch(e){}return _ta4.apply(this,arguments)}}
{const _tf4=twFinish;twFinish=function(won){try{if(won)bpAdd('tower',1)}catch(e){}return _tf4.apply(this,arguments)}}
{const _sd=lvSpinDrops;lvSpinDrops=function(n){try{bpAdd('spin',n|0)}catch(e){}return _sd.apply(this,arguments)}}
{const _pr=psRoll;psRoll=function(){try{bpAdd('ps',1)}catch(e){}return _pr.apply(this,arguments)}}

/* ================= v261: EVENTO DO PASSE (4 horas) =================
   09/11/2026 17:45 → 21:45 (Brasília). Missões extras fáceis (Torre, Boss, gacha, passiva, rank), 3x XP em TODAS as missões do passe,
   e cada vitória (Boss ou andar da Torre) tem 0,5% de abrir o BAÚ DO EVENTO = PASSE PAGO liberado. Só UMA pessoa no jogo inteiro ganha
   (documento fixo bpev_<id> no servidor: o primeiro cria, o resto recebe 409). Quem já tem o passe pago não participa do sorteio. */
const BPEV={id:'e1',ini:Date.UTC(2026,10,9,20,45),fim:Date.UTC(2026,10,10,0,45)};
const bpEvOn=()=>{const t=Date.now();return t>=BPEV.ini&&t<BPEV.fim},bpEvLeft=()=>{const m=Math.max(0,Math.round((BPEV.fim-Date.now())/6e4));return m>=60?Math.floor(m/60)+'h'+String(m%60).padStart(2,'0'):m+' min'};
const BPME=[['e01','Vença 1 andar da Torre','floor',1,60],['e02','Vença 3 andares da Torre','floor',3,80],['e03','Vença 6 andares da Torre','floor',6,100],['e04','Vença 10 andares da Torre','floor',10,120],['e05','Vença 15 andares da Torre','floor',15,150],['e06','Complete a Torre 1 vez','tower',1,200],
  ['e07','Jogue 2 lutas','fights',2,60],['e08','Jogue 6 lutas','fights',6,100],['e09','Vença 1 luta no Modo Boss','bossW',1,60],['e10','Vença 3 lutas no Modo Boss','bossW',3,100],['e11','Vença 6 lutas no Modo Boss','bossW',6,150],
  ['e12','Gire 3 vezes no Gacha','spin',3,60],['e13','Gire 10 vezes no Gacha','spin',10,100],['e14','Gire 1 passiva','ps',1,60]];
const bpEvL=()=>[...BPME,...RKR.slice(1).map((R,j)=>['r'+(j+1),'Esteja no rank '+R.n+' ou acima','rk',j+1,40+j*10])];
const bpEvV=(o,m)=>m[2]==='rk'?rkRk():(o.e[m[2]]|0);
/* faixa do evento */
function bpEvBan(a){if(!bpEvOn())return '';return `<div class="rkEvX bpEvX${a?' two':''}">🎟️ EVENTO DO PASSE: <b>3x XP</b> nas missões + missões extras + <b>PASSE PAGO</b> no baú (0,5%) · termina em ${bpEvLeft()}</div>`}
/* baú do evento */
let bpEvBusy=0;async function bpEvChest(){try{if(!bpEvOn()||bpEvBusy||rkG('bpev_'+BPEV.id,0)||bpG().own>=1||Math.random()>=.005)return;bpEvBusy=1;
  const r=await mnPost('bpev_'+BPEV.id,{bpe:mnSV('1')});
  if(r.ok){rkS('bpev_'+BPEV.id,2);bpUnlock(1);try{acSave(1)}catch(e){}const msg='🎁 BAÚ DO EVENTO! Você ganhou o PASSE DE BATALHA PAGO! Só 1 pessoa no jogo inteiro ganha!';
    setTimeout(()=>{try{rkSfx('powerUp');setTimeout(()=>rkSfx('boom'),300)}catch(e){}try{if(typeof twToast==='function')twToast(msg,'#ffd84a')}catch(e){}try{rkToast(msg,'#ffd84a')}catch(e){}},1800)}
  else if(r.status===409||r.status===403)rkS('bpev_'+BPEV.id,1)}catch(e){}bpEvBusy=0}
{const _r5=rkResult;rkResult=function(R){try{if(R&&R.won)bpEvChest()}catch(e){}return _r5.apply(this,arguments)}}
{const _ta5=twAfter;twAfter=function(w){try{if(w===0)bpEvChest()}catch(e){}return _ta5.apply(this,arguments)}}
/* aviso na tela do passe para quem ganhou */
{const _bh=bpH;bpH=function(){return _bh()+(rkG('bpev_'+BPEV.id,0)===2?`<div class="bpWin" style="${bpB(615,206,1240,240)}">🎁 Você ganhou o PASSE PAGO no baú do evento!</div>`:bpEvOn()?`<div class="bpWin ev" style="${bpB(615,206,1240,240)}">⚡ EVENTO: 3x XP nas missões · missões extras · passe pago no baú (0,5%) · ${bpEvLeft()}</div>`:'')}}
/* ================= v263: MODO PC (teclado e mouse) =================
   Automático: mouse/sem tela de toque = PC. ft_pc: '1' teclado, '0' toque, sem valor = automático. No PC: sem botões de toque, legenda das teclas na luta (F1),
   teclas extras comuns em jogos de luta de PC, clique esquerdo = soco e direito = chute, Esc volta nos menus do Ranqueado. */
const pcAuto=()=>{try{return matchMedia('(pointer:fine)').matches&&!(navigator.maxTouchPoints>0)}catch(e){return false}};
function pcMode(){let v=null;try{v=localStorage.getItem('ft_pc')}catch(e){}return v==='1'?1:v==='0'?0:-1}
function pcOn(){const m=pcMode();return m===1||(m===-1&&pcAuto())}
const pcLeg=()=>{try{return localStorage.getItem('ft_pcleg')!=='0'}catch(e){return true}};
try{Object.assign(KM,{Space:'up',ShiftLeft:'bl',ShiftRight:'bl',KeyQ:'sp',KeyE:'tr',KeyR:'sr',KeyG:'fly',Tab:'tag'})}catch(e){}
function pcBtnTxt(){const m=pcMode(),t='Controles: '+(m===1?'Teclado (PC)':m===0?'Toque (celular)':'Automático ('+(pcAuto()?'PC':'toque')+')');['pcBtn','pcBtn2'].forEach(id=>{const b=$(id);if(b)b.textContent=t})}
function pcCycle(){const m=pcMode(),n=m===-1?'1':m===1?'0':null;try{if(n==null)localStorage.removeItem('ft_pc');else localStorage.setItem('ft_pc',n)}catch(e){}pcBtnTxt();pcSync()}
function pcHudH(){const k=(a,b)=>`<span><kbd>${a}</kbd>${b}</span>`;return k('WASD','mover')+k('ESPAÇO','pular')+k('J / 🖱️','soco')+k('K / 🖱️','chute')+k('L','ki')+k('I','especial')+k('O','super')+k('U','transformar')+k('F','voar')+k('SHIFT','defender')+k('ESC','pausa')+k('F1','esconder')}
function pcSync(){const h=$('pcHud'),c=$('controls');if(!h||!c)return;const fight=G.mode==='fight',pc=pcOn();
  if(fight){if(pc&&!c.hidden)c.hidden=true;else if(!pc&&c.hidden&&!G.paused){c.hidden=false;try{layoutControls()}catch(e){}}}
  const on=fight&&pc&&!G.paused&&pcLeg();if(on&&!h.innerHTML)h.innerHTML=pcHudH();h.hidden=!on;document.body.classList.toggle('pcMode',pc)}
setInterval(()=>{try{pcSync()}catch(e){}},250);
setTimeout(()=>{try{pcBtnTxt();['pcBtn','pcBtn2'].forEach(id=>{const b=$(id);if(b)b.onclick=pcCycle})}catch(e){}},0);
addEventListener('keydown',e=>{try{
  if(e.code==='F1'){e.preventDefault();try{localStorage.setItem('ft_pcleg',pcLeg()?'0':'1')}catch(x){}pcSync();return}
  if(e.code==='Escape'&&G.mode!=='fight'&&showScreen.cur==='ranked'){const md=$('rkModal');if(md&&!md.hidden&&md.innerHTML){const x=md.querySelector('#rkMX');if(x)x.click();else rkModal(null);return}
    const bk=document.querySelector('#rkWrap [data-a="back"],#rkWrap [data-p="back"],#rkWrap [data-m="back"],#rkWrap [data-b="back"],#rkWrap [data-a="menuBack"]');if(bk)bk.click()}}catch(x){}});
/* mouse na luta: esquerdo = soco, direito = chute */
{const M={0:'punch',2:'kick'};const gm=()=>$('game');
  addEventListener('mousedown',e=>{if(G.mode!=='fight'||G.paused||!pcOn())return;const g=gm();if(!g||!g.contains(e.target)||e.target.closest('button'))return;const k=M[e.button];if(!k)return;latch[k]=1;keys[k]=1;e.preventDefault()});
  addEventListener('mouseup',e=>{const k=M[e.button];if(k)keys[k]=0});}

/* ================= v267: ABAS DE EVENTO =================
   Botão "Abas de Evento" no menu do Ranqueado (brilha + pontinho vermelho quando tem evento ou recado novo). Tela com a arte do dono:
   6 abas à esquerda, título em cima, conteúdo no quadro grande. Eventos: torneio da torre (TWEV), evento 2x (RKEVX), evento do passe (BPEV).
   RECADOS DO ADM: o ADM escreve na própria aba (fica no servidor, documento avs_<ts>); todo mundo vê. Assim os códigos não ficam no GitHub. */
const evFmt=ms=>{const m=Math.max(0,Math.round(ms/6e4));return m>=1440?Math.floor(m/1440)+'d '+Math.floor(m%1440/60)+'h':m>=60?Math.floor(m/60)+'h'+String(m%60).padStart(2,'0'):m+' min'};
const evHr=t=>new Date(t-3*36e5).toISOString().slice(11,16);
let EV={tab:null,av:null,avT:0};
function evTor(){try{const st=twEvSt();if(st==='fim'&&Date.now()>TWEV.fim+6*36e5)return null;return {k:'tor',ic:'🏆',t:'TORNEIO DA TORRE',st:st==='antes'?'EM BREVE':st==='ao vivo'?'AO VIVO':'ENCERRADO',on:st!=='fim',hot:st==='ao vivo',h:()=>{const st=twEvSt(),t=Date.now();
  return `<h2>${twEsc(TWEV.nome)}</h2><div class="evBig ${st.replace(' ','')}">${st==='antes'?'⏳ COMEÇA EM <b>'+evFmt(TWEV.ini-t)+'</b>':st==='ao vivo'?'🔴 AO VIVO · TERMINA EM <b>'+evFmt(TWEV.fim-t)+'</b>':'✔ ENCERRADO · os prêmios são entregues sozinhos'}</div>
  <p>📅 Hoje das <b>${evHr(TWEV.ini)}</b> às <b>${evHr(TWEV.fim)}</b> (horário de Brasília) · ${Math.round((TWEV.fim-TWEV.ini)/6e4)} minutos.</p>
  <p>🏃 <b>CORRIDA NA TORRE:</b> quem chegar <b>mais alto</b> na torre no <b>menor tempo</b> ganha. Empate de andar → vence quem fez em menos tempo. Vale a melhor subida de cada jogador que <b>terminar</b> dentro do horário.</p>
  <div class="evPrz">${TWEV.prem.map(P=>`<div class="pz p${P.pos}"><i>${['🥇','🥈','🥉'][P.pos-1]}</i><img src="${evPrzImg(P)}" alt=""><b>${evPrzNm(P)}</b></div>`).join('')}</div>
  <p>⚖️ Durante o torneio a torre é <b>igual para todos</b>: inimigos do rank mais baixo e sem bônus de rank (itens, passivas e nível continuam valendo).</p><p>🎁 Os prêmios caem <b>sozinhos</b> na conta de quem ganhar (abrindo o jogo depois do fim). <b>Todo mundo que participar ganha ${TWEV.part||0} 💎</b>. ⚠️ O <b>CHEFE FINAL tem ${TWEV.lives||2} vidas</b> durante o torneio.</p>
  <div class="evBtns"><button class="btn main" data-e="torre">🗼 IR PARA A TORRE</button></div>`}}}catch(e){return null}}
function ev2x(){const e=rkEvX();if(!e)return null;return {k:'x2',ic:'🔥',t:'EVENTO '+e[3].split('·')[0].trim(),st:'AO VIVO',on:1,hot:1,h:()=>`<h2>🔥 EVENTO NA RANQUEADA</h2><div class="evBig aovivo">🔴 AO VIVO · TERMINA EM <b>${evFmt(e[1]-Date.now())}</b></div>
  <p>📅 Das <b>${evHr(e[0])}</b> às <b>${evHr(e[1])}</b> (horário de Brasília).</p><ul>${e[3].split('·').map(x=>`<li>✨ <b>${x.trim()}</b></li>`).join('')}</ul>
  <p>Vale no <b>Modo Boss</b> (rank, farm e evento do Yuta) e na <b>Torre</b>. XP de rank, gemas das lutas e sorte (que também aumenta os drops). Códigos não dobram.</p><div class="evBtns"><button class="btn main" data-e="boss">⚔️ IR PARA O MODO BOSS</button></div>`}}
function evBp(){if(!bpEvOn())return null;return {k:'bp',ic:'🎟️',t:'EVENTO DO PASSE',st:'AO VIVO',on:1,hot:1,h:()=>`<h2>🎟️ EVENTO DO PASSE DE BATALHA</h2><div class="evBig aovivo">🔴 AO VIVO · TERMINA EM <b>${bpEvLeft()}</b></div>
  <ul><li>⚡ <b>3x XP</b> em todas as missões do passe</li><li>📋 <b>Missões extras</b> fáceis (Torre, Boss, gacha, passiva e rank)</li><li>🎁 Cada vitória tem <b>0,5%</b> de abrir o <b>BAÚ DO EVENTO</b>: o <b>PASSE PAGO</b> — só <b>1 pessoa</b> no jogo inteiro ganha!</li></ul>
  <div class="evBtns"><button class="btn main" data-e="bp">🎟️ ABRIR O PASSE</button></div>`}}
async function evAvLoad(){try{const L=await rkQ('avs','1',60);EV.av=L.filter(x=>x.txt).sort((a,b)=>b._ct-a._ct).slice(0,20);EV.avT=Date.now()}catch(e){EV.av=EV.av||[]}if(RKV==='ev')rkView('ev');else if(RKV==='menu')rkView('menu')}
const evAvNew=()=>{try{return !!(EV.av&&EV.av[0]&&EV.av[0]._ct>(rkG('avseen',0)|0))}catch(e){return false}};
function evAv(){const n=EV.av?EV.av.length:0;return {k:'av',ic:'📢',t:'RECADOS DO ADM',st:evAvNew()?'NOVO':n?n+' recado'+(n>1?'s':''):'',on:1,hot:evAvNew(),h:()=>{const adm=twIsAdm();
  return `<h2>📢 RECADOS DO ADM</h2>${adm?`<div class="evAdm"><input id="evAvT" maxlength="60" placeholder="Título (ex.: CÓDIGO NOVO!)"><textarea id="evAvX" maxlength="600" placeholder="Escreva o recado para todos (pode colocar códigos aqui)"></textarea><button class="btn main" data-e="avPost">📢 PUBLICAR PARA TODOS</button></div>`:''}
  ${EV.av==null?'<p>Carregando...</p>':!EV.av.length?'<p class="evNo">Nenhum recado ainda.</p>':EV.av.map(a=>`<div class="evMsg"><b>${twEsc(a.tit||'RECADO')}</b><small>${twEsc(a.nome||'ADM')} · ${new Date(a._ct-3*36e5).toISOString().slice(8,10)+'/'+new Date(a._ct-3*36e5).toISOString().slice(5,7)+' '+evHr(a._ct)}</small><p>${twEsc(a.txt).replace(/\n/g,'<br>')}</p></div>`).join('')}`}}}
function evList(){return [evTor(),ev2x(),evBp(),evAv()].filter(Boolean).slice(0,6)}
const evAny=()=>{try{return evList().some(e=>e.k!=='av'&&e.on)||evAvNew()}catch(e){return false}};
function evPrzNm(P){return P.bp===2?'PASSE PRÊMIO':P.bp===1?'PASSE PAGO':P.gem?'CAIXA COM '+rkFmtN(P.gem)+' 💎':P.it?P.it.nm:'?'}
function evPrzImg(P){return P.bp?RQA.coin[2]:P.gem?RQA.coin[0]:P.it?P.it.img:''}
function evOpen(){if(!EV.av||Date.now()-EV.avT>60e3)evAvLoad();const L=evList();if(!EV.tab||!L.some(e=>e.k===EV.tab))EV.tab=L[0].k;rkView('ev')}
function evH(){const L=evList(),T=[[100,258,428,340],[98,366,416,448],[98,473,414,555],[98,578,408,660],[98,683,400,765],[98,788,390,870]],cur=L.find(e=>e.k===EV.tab)||L[0];if(cur.k==='av'&&EV.av&&EV.av[0])rkS('avseen',EV.av[0]._ct);
  return `<button class="hs evBk" data-e="back" style="${bpB0(10,10,120,90)}">⬅</button>
  <div class="evTit" style="${bpB0(640,130,1235,210)}">${cur.ic} ${cur.t}</div>
  ${L.map((e,i)=>`<button class="evTab${e.k===cur.k?' sel':''}${e.hot?' hot':''}" data-e="tab" data-k="${e.k}" style="${bpB0(...T[i])}"><i>${e.ic}</i><span>${e.t}<small>${e.st}</small></span>${e.hot?'<em class="dot"></em>':''}</button>`).join('')}
  <div class="evBody" style="${bpB0(470,262,1545,862)}">${cur.h()}</div>`}
const bpB0=(x0,y0,x1,y1)=>`left:${x0/16.72}%;top:${y0/9.41}%;width:${(x1-x0)/16.72}%;height:${(y1-y0)/9.41}%`;
function evOn(){$('rkWrap').querySelectorAll('[data-e]').forEach(b=>b.onclick=e=>{e.stopPropagation();evAct(b.dataset.e,b)});clearInterval(evOn.iv);evOn.iv=setInterval(()=>{if(RKV!=='ev'||showScreen.cur!=='ranked'){clearInterval(evOn.iv);return}const a=document.activeElement;if(a&&(a.id==='evAvT'||a.id==='evAvX'))return;const sc=(document.querySelector('.evBody')||{}).scrollTop;rkView('ev');const b=document.querySelector('.evBody');if(b&&sc)b.scrollTop=sc},15000)}
async function evAct(a,b){if(a==='back')return rkView('menu');if(a==='tab'){EV.tab=b.dataset.k;rkSfx('whoosh');return rkView('ev')}
  if(a==='torre')return rkAct('torre');if(a==='boss')return rkView('boss');if(a==='bp')return rkView('bp');
  if(a==='avPost'){if(!twIsAdm())return;const t=($('evAvT').value||'').trim().slice(0,60),x=($('evAvX').value||'').trim().slice(0,600);if(!x){rkToast('Escreva o recado','#ff8080');return}
    try{const r=await mnPost('avs_'+Date.now().toString(36),{avs:mnSV('1'),tit:mnSV(t||'RECADO'),txt:mnSV(x)});if(!r.ok)throw 0;rkToast('📢 Recado publicado para todos!','#7dff9a');for(const k in RKQC)if(k.includes('"avs'))delete RKQC[k];evAvLoad()}catch(e){rkToast('Não deu para publicar (sem internet?)','#ff8080')}}}
{const _o2=rkOpen;rkOpen=function(){const r=_o2.apply(this,arguments);setTimeout(()=>{try{evAvLoad()}catch(e){}try{if(typeof twClaims==='function')twClaims()}catch(e){}},2500);return r}}
