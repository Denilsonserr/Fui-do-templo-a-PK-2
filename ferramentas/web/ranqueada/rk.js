
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
  {n:'DIVINDADE SUPREMA',c:'#ffd86b',min:50000,rw:1500},{n:'DIVINDADE CELESTIAL',c:'#6fc8ff',min:70000,rw:2000},{n:'DEUS CELESTIAL',c:'#e0a0ff',min:100000,rw:3000},
  /* v370: 3 ranks novos (o último pede 500 mil XP) */
  {n:'DEUS CÓSMICO',c:'#8f7bff',min:180000,rw:4000},{n:'DEUS PRIMORDIAL',c:'#ff7ad9',min:300000,rw:6000},{n:'DEUS ABSOLUTO',c:'#ffe27a',min:500000,rw:10000}];
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
  {id:'yuta',n:'YUTA',sub:'Feiticeiro de Jujutsu',ph:[[3,4],[3,5],[4,6],[4,7],[5,9],[6,11],[7,13],[8,15],[9,17],[10,19],[11,21]],b1:{dm:.78,df:1.12,sp:.96},b2:{dm:.72,df:1,sp:.62},c:'#b57bff'},
  /* v389: SHAKA — evento especial de 5 dias (mais barras e mais forte que o Yuta) */
  {id:'shaka',n:'SHAKA',sub:'O Cavaleiro de Virgem',ph:[[5,6],[5,8],[6,9],[6,11],[8,14],[9,17],[11,20],[12,23],[14,26],[15,29],[17,32]],b1:{dm:.82,df:1.15,sp:1},b2:{dm:.76,df:1.02,sp:.66},c:'#ffd84a'}];
/* v243: boss atual (Broly ou Yuta do evento) */
let RKBID='broly';const rkBoss=()=>RKBOSS.find(b=>b.id===RKBID)||RKBOSS[0],rkBP=()=>RKBID==='yuta'?'Y':RKBID==='shaka'?'S':'L';
const rkPhB=lv=>rkBoss().ph[Math.max(0,Math.min(RKTOP,lv))];
/* IA por nível (react = tempo de reação, agg = agressividade, blk = defesa, combo = continuar combos) */
const RKAI=[{react:24,agg:.42,blk:.18,combo:.35,idle:24},{react:18,agg:.52,blk:.3,combo:.5,idle:16},{react:13,agg:.62,blk:.45,combo:.66,idle:11},{react:8,agg:.77,blk:.62,combo:.86,idle:6},
  {react:6,agg:.86,blk:.68,combo:.9,idle:4},{react:5,agg:.9,blk:.74,combo:.94,idle:3},{react:4,agg:.94,blk:.82,combo:.97,idle:2},{react:3,agg:.97,blk:.86,combo:1,idle:1}];
RKR.forEach((R,i)=>{TWTIT['rk'+i]={n:R.n,i:'',c:R.c,d:'Chegar ao rank '+R.n+' no Modo Ranqueado',rk:i}});
const rkG=(k,d)=>twLS.g('rk_'+k,d),rkS=(k,v)=>{twLS.s('rk_'+k,v);if(k==='rp')pfMaxUp(v)};
const RK_MIT=['naruto','madara','garou'],RK_LEG=['goku','aokiji','zoro','broly','vegeta','gogeta','gojo','luffy','rengoku'],RK_EPI=['aylla','zedry','zaykon','qingqing'];
const rkRar=id=>id==='yuta'||id==='shaka'||RK_MIT.includes(id)?'mit':RK_LEG.includes(id)?'lend':'epica';
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
const RKD={ca:[1672,941],ev:[1672,941],bp:[1774,887],mn:[1672,941],ps:[1672,941],rb:[1672,941],lvl:[1847,851],pf:[1672,941],hs:[1671,941]};const rkB2=(x0,y0,x1,y1)=>`left:${x0/16.72}%;top:${y0/9.41}%;width:${(x1-x0)/16.72}%;height:${(y1-y0)/9.41}%`;
function rkView(v){RKV=v;const W=$('rkWrap');if(!W)return;clearInterval(rkView.iv);rkModal(null);
  const H={ca:caH,menu:rkMenuH,boss:rkBossH,gacha:rkGachaH,shop:rkShopH,lib:rkLibH,rb:rkRbH,pf:pfH,hs:hsH,lvl:lvH,yb:ysLobbyH,yrb:ysStartH,sb:skLobbyH,skp:skPickH,ps:psH,mn:mnH,bp:bpH,ev:evH}[v]();const dm=RKD[v]||[RKW,RKH];W.innerHTML=`<div class="rkA rk_${v}" data-w="${dm[0]}" data-h="${dm[1]}"${['pf','hs','boss','rb','yb','yrb','sb','skp','ps','mn','bp','ev','ca'].includes(v)?' data-full="1"':''} style="background-image:url(${RQA[{ca:'caca_menu',menu:'menu_ranqueado',boss:'modo_boss',gacha:(RKBAN==='mit'?'gacha_yt':'gacha'),shop:'loja_gemas',lib:(RKL.tab==='chr'?'bib_pf':RKL.tab==='an'?'aneis':'biblioteca'),rb:'ranqueada_boss',pf:'perfil',hs:'historico',lvl:'lv_ed',yb:'boss_yt',sb:'boss_sk',skp:'shk_pick',yrb:(YS.tab==='rank'?'ys_rank':'ys_farm'),ps:'passiva',mn:'mercado',bp:'passe',ev:'abas_ev'}[v]]})">${H}${rkEvTxt()}<div id="rkToast"></div><button class="rkMusB" data-a="music" title="Música">🎵</button><button class="rkCodB" data-a="code">🎟️ CÓDIGO</button><button class="rkAcB" data-a="conta" title="Conta">👤</button></div>`;
  rkFit();W.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)});({boss:rkBossOn,yb:rkBossOn,sb:rkBossOn,gacha:rkGachaOn,lib:rkLibOn,pf:pfOn,hs:hsOn,lvl:lvOn,ps:psOn,mn:mnOn,bp:bpOn,ev:evOn,yrb:()=>{clearInterval(rkView.iv);if(!RKSRV)rkSrvLoad()}}[v]||(()=>{}))()}
function rkLocked(){rkSfx('clang');rkToast('🔒 Em breve!','#cfd6ea')}
function rkAct(a,b){rkSfx('whoosh');
  switch(a){case 'caca':return rkView('ca');case 'caGo':return caStart();case 'lsSet':return lsOpen();case 'caInfo':return caInfo();case 'caLk':rkSfx('clang');return rkToast('🔒 Nova besta em breve!','#d9b3ff');case 'caStg':return rkToast('🌲 FLORESTA SOMBRIA · fica mais destruída a cada nível do lobo','#9fd8ff');case 'caRing':{const r=CARING[+b.dataset.i];return rkToast('💍 Anel '+r[1]+' · '+r[2]+' · '+['cai em qualquer nível','cai do nível 3','cai do nível 5','cai do nível 7 (50 mil+ no 9 e 10)','só nos níveis 9 e 10 · 0,5%'][+b.dataset.i],'#ffffff')}case 'perfil':PFO=null;PFRET={back:()=>rkView('menu')};return rkView('pf');case 'cacaLk':rkSfx('clang');return rkToast('🔒 Modo Caçador em teste · só quem tem o título ADM','#d9b3ff');case 'evMenu':return evOpen();case 'bpMenu':return rkView('bp');case 'psMenu':PSRET='menu';return rkView('ps');case 'mnMenu':return mnOpen();case 'back':if(RKV==='ps')return rkView(PSRET||'boss');if(RKV==='mn')return rkView('menu');if(RKV==='lvl')return rkView('lib');if(RKV==='yrb')return rkView('yb');if(RKV==='yb'||RKV==='sb')return rkView('menu');if(RKV==='skp')return rkView('sb');if(RKV==='pf'||RKV==='hs'){if(PFO||PFRET)return pfBack();return showScreen('title')}return rkView(RKV==='shop'?'gacha':RKV==='rb'?'boss':'menu');case 'pf':return rkView('pf');case 'hs':return rkView('hs');case 'pfFoto':return PFO?pfAdmFoto():pfFotoM();case 'pfTit':return PFO?0:pfTitM();case 'pfPick':return PFO?0:pfPick();case 'pfRadar':return pfRadarInfo();case 'pfVit':if(PFO){const e=(PFO.vit||[])[+b.dataset.i];if(e)rkToast(rkItNm(e)+': '+rkItEf(e),rkItC(e));return}return pfVitPick(+b.dataset.i);case 'hsInfo':return hsInfo(b.dataset.k);case 'home':return showScreen('title');case 'menuBack':return showScreen('title');
    case 'boss':return rkView(RKBID==='shaka'&&skOn()?'sb':RKBID==='yuta'&&ysOn()?'yb':(RKBID='broly','boss'));case 'gacha':return rkView('gacha');case 'shop':return rkView('shop');case 'lib':return rkView('lib');case 'lock':return rkLocked();
    case 'ranking':return rkRanking();case 'rewards':return rkRewards();case 'ach':return rkAch();case 'pos':return rkPos();
    case 'start':if(!RKSRV)rkSrvLoad();if(RKBID==='shaka')return skStart();return rkView(RKBID==='yuta'?'yrb':'rb');case 'skgo':return skGo(b.dataset.i,b.dataset.l);case 'bsel':if(b.dataset.b==='yuta'&&!ysOn())return rkToast('⏳ O evento do Yuta acabou','#cfd6ea');if(b.dataset.b==='shaka'&&!skOn())return rkToast(skAntes()?'⏳ O boss SHAKA libera hoje ao MEIO-DIA (12:00)!':'⏳ O evento do Shaka acabou','#ffd84a');RKBID=b.dataset.b;RKYD=null;RKSRV=null;try{localStorage.setItem('rk_bsel',RKBID)}catch(e){}return rkView(RKBID==='yuta'?'yb':RKBID==='shaka'?'sb':'boss');case 'ytab':YS.tab=b.dataset.t;return rkView('yrb');case 'ydif':YS.d=+b.dataset.i;return rkView('yrb');case 'yfight':return ysFight();case 'equip':return rkEquip();case 'music':return rkMusic();case 'code':return rkCode();case 'torre':return rkTorre();case 'conta':return acOpen();case 'fight':RKYD=null;return rkBossStart();case 'lvp':return rkRbSel(-1);case 'lvn':return rkRbSel(1);case 'lvc':return rkRbSel(0,+b.dataset.i);case 'sel':return rkView('lib');case 'hist':return rkHist();case 'taxas':return rkTaxas();case 'pool':return rkTaxas();
    case 'sum1':return rkSummon(1);case 'sum10':return rkSummon(10);case 'chat':return rkChatSend();
    case 'buy':return rkBuy(+b.dataset.i);case 'tab':return rkLibTab(b.dataset.t);case 'anSlot':return anSlot(+b.dataset.i);case 'anUp':AN.pg=Math.max(0,AN.pg-1);return anGrid();case 'anDn':AN.pg++;return anGrid();case 'anFilt':AN.f=(AN.f+1)%6;AN.pg=0;$('anFl').textContent=ANFL[AN.f];return anGrid();case 'up':return rkLibPage(-1);case 'down':return rkLibPage(1);case 'filt':return rkLibFilt();case 'libUse':return rkLibUse();
    case 'boxinfo':return rkToast(b.dataset.t,'#bfe8ff');
    case 'ban':RKBAN=b.dataset.b;try{localStorage.setItem('rk_ban',RKBAN)}catch(e){}return rkView('gacha');case 'evo':return lvOpen(RKL.cur&&RKL.cur.id);case 'lvUp':return lvUp();case 'lvX':return lvX();case 'lvNode':return lvNode(+b.dataset.r,+b.dataset.c);case 'lvInfo':return lvInfo()}}
/* ---------------- MENU DO RANQUEADO ---------------- */
function rkMenuH(){const rp=rkG('rp',0),ri=rkRank(rp),adm=(()=>{try{return twIsAdm()}catch(e){return false}})();
  return `${rkMenuFx()}<button class="hs" data-a="menuBack" style="${rkB(5,20,110,95)}"></button>
  <button class="hs mB r" data-a="boss" style="${rkB(10,140,535,250)}"><span class="mSw"></span><span class="mGl"></span></button>
  <button class="hs mB g" data-a="torre" style="${rkB(15,262,522,368)}"><span class="mSw"></span><span class="mGl"></span></button>
  <button class="hs mB p" data-a="caca" style="${rkB(15,380,525,482)}"><span class="mSw"></span><span class="mGl"></span></button>
  <button class="hs mB b" data-a="gacha" style="${rkB(15,498,532,602)}"><span class="mSw"></span><span class="mGl"></span></button>
  <button class="hs rd" data-a="psMenu" style="${rkB(1588,98,1708,234)}"></button><button class="hs rd evMb${evAny()?' on':''}" data-a="evMenu" style="${rkB(1678,248,1815,385)}">${evAny()?'<i class="dot"></i>':''}</button><button class="hs rd" data-a="bpMenu" style="${rkB(1678,398,1820,535)}">${bpPend()?'<i class="dot"></i>':''}</button><button class="hs rd" data-a="mnMenu" style="${rkB(1710,98,1842,244)}">${mnBadge()?'<i class="dot"></i>':''}</button>
  <button class="hs" data-a="ranking" style="${rkB(250,670,488,790)}"></button><button class="hs" data-a="rewards" style="${rkB(500,670,780,790)}">${rkRwPend()?'<i class="dot"></i>':''}</button>
  <button class="hs" data-a="ach" style="${rkB(800,670,1062,790)}">${rkAchPend()?'<i class="dot"></i>':''}</button><button class="hs" data-a="lib" style="${rkB(1080,670,1352,790)}"></button><button class="hs" data-a="perfil" style="${rkB(1360,670,1640,790)}"></button>
  <div class="rkTop">${rkEmb(ri,'sm')}<div><b style="color:${RKR[ri].c}">${RKR[ri].n}</b><small>${rkFmtN(rp)} XP · Boss Nv.${ri+1}</small></div>${rkCurHTML()}</div>`}
/* v272: tela "Modos de Jogo" viva — névoa no fundo, vaga-lumes roxos, brilho dourado no cabelo do Shaka, olhos do lobo e das serpentes, orbe do Yuta, lua e raio roxo */
function rkMenuFx(){const P=(x,y)=>`left:${x/RKW*100}%;top:${y/RKH*100}%`,R=(a,b)=>a+Math.random()*(b-a);let h='<div class="mfx">';
  h+='<i class="fog f1"></i><i class="fog f2"></i><i class="fog f3"></i><i class="mMoon" style="'+P(1012,24)+'"></i><i class="mFl"></i>';
  for(const [x,y,c] of [[584,262,'r'],[624,261,'r'],[1530,70,'v'],[1432,165,'v'],[1615,242,'v']])h+=`<i class="mEye ${c}" style="${P(x,y)};animation-delay:${R(0,2).toFixed(2)}s"></i>`;
  h+=`<i class="mOrb" style="${P(1386,272)}"></i>`;
  for(let i=0;i<16;i++)h+=`<i class="mGd" style="${P(R(700,1080),R(170,640))};animation-delay:${R(0,6).toFixed(2)}s;animation-duration:${R(3.5,6).toFixed(2)}s"></i>`;
  for(let i=0;i<22;i++){const x=Math.random()<.5?R(0,560):R(1080,1847);h+=`<i class="mFf" style="${P(x,R(80,840))};animation-delay:${R(0,8).toFixed(2)}s;animation-duration:${R(6,11).toFixed(2)}s"></i>`}
  return h+'</div>'}
/* ---------------- MODO BOSS ---------------- */
function rkBossH(){const rp=rkG('rp',0),ri=rkRank(rp),sel=rkG('sel','goku'),eqI=TWIMG.esp[3];
  return `<button class="hs" data-a="back" style="${rkB(25,25,135,100)}"></button>
  <button class="hs on" data-a="boxinfo" data-t="Broly nível ${ri+1}: ${rkPhB(ri)[0]} barras · depois se transforma com ${rkPhB(ri)[1]} barras!" style="${rkB(10,200,445,300)}"></button>
  ${ysSlotOld()}${skSlot(440,530)}${[[555,650]].map(([a,b])=>`<button class="hs" data-a="lock" style="${rkB(10,a,415,b)}"></button>`).join('')}
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
function rkBossOn(){rkSrvLoad();const I=$('rkChI');if(I)I.onkeydown=e=>{if(e.key==='Enter')rkChatSend()};rkChatLoad();rkOnline();let n=0;rkView.iv=setInterval(()=>{if((RKV!=='boss'&&RKV!=='yb'&&RKV!=='sb')||showScreen.cur!=='ranked'){clearInterval(rkView.iv);return}n++;rkChatLoad();if(n%10===0)rkOnline()},60000)}
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
  <div class="rbPas" style="${rkB2(1122,330,1645,452)}"><h5>PASSIVAS DO BOSS · NÍVEL ${lv+1}</h5>${bsAntiTx(lv)?`<span style="color:#ff8a8a">✦ ANTI-ITENS: ${bsAntiTx(lv)}</span>`:''}${pas.length?pas.map(p=>`<span>✦ ${p}</span>`).join(''):'<span>Nenhuma passiva especial</span>'}</div>
  ${cells.map((c,j)=>{const s0=Math.max(0,lv-7),i=j+s0;return `<button class="rbCell ${i===lv?'sel':''} ${i===ri?'cur':''} ${i>ri?'lock':''}${s0?' ov':''}" data-a="lvc" data-i="${i}" style="${rkB2(...c)}">${s0?`<span class="rbO">${rkEmb(i,'xs')}<em>Nível ${i+1}</em></span>`:''}${i>ri?'<i>🔒</i>':i<ri?'<i class="ok farm">🌾<small>FARM</small></i>':'<i class="now">ATUAL</i>'}</button>`}).join('')}${lv<ri?`<div class="rbFarm" style="${rkB2(1122,458,1645,498)}">🌾 MODO FARM · NÍVEL ${lv+1}</div>`:''}
  <div class="rbCov rbLvT" style="${rkB2(62,727,232,762)}">Nível ${lv+1}</div>
  <div class="rbDesc" style="${rkB2(62,768,550,895)}"><span>❤️ ${rkPhB(lv)[0]} barras → transformado ${rkPhB(lv)[1]} · ⚔️ ATK ${rkFmtN(bsSt(lv).atk)} · 🛡️ DEF ${rkFmtN(bsSt(lv).def)} · 💨 VEL ${bsSt(lv).spd}</span><span>🧠 ${RKPAS[lv][1]}</span>${lv<ri?'':`<span>⭐ Rank ${RKR[lv].n} · vitória +${RKXW[lv]} XP · derrota −${RKXL[lv]} XP</span>`}${lv<ri?'':`<span class="rec">🏆 Recorde do servidor: ${RKSRV?(RKSRV[lv]?twFmt(RKSRV[lv].tt)+' ('+twEsc(RKSRV[lv].nome)+')':'ninguém ainda!'):'carregando...'} · 🏅 Seu: ${rkMyRec(lv)?twFmt(rkMyRec(lv)):'—'}</span><span class="rec2">Bater recorde: servidor +${RKXB.srv} XP · seu +${RKXB.me} XP · dano diminui a derrota</span>`}${lv>ri?`<em>🔒 Suba de rank para chegar neste nível (seu nível é ${ri+1})</em>`:lv<ri?`<em class="farm">🌾 FARM: sem XP de rank · 💎🔴 normais · resto menor</em>`:''}</div>
  <div class="rbNx" style="${rkB2(632,785,716,868)}">${ri<RKTOP?rkEmb(nx,'ban'):''}</div><div class="rbCov rbNxT" style="${rkB2(728,790,880,860)}">${ri<RKTOP?`<b style="color:${RKR[nx].c}">${RKR[nx].n}</b><small>(Nível ${nx+1} · ${rkFmtN(RKXP[nx])} XP)</small>`:'<b style="color:#fff4c0">RANK MÁXIMO</b>'}</div>
  <button class="rkEqB wide" data-a="equip" style="${rkB2(1235,694,1600,750)}"><i>🎒</i><b>EQUIPAMENTOS</b></button>
  <button class="hs" data-a="fight" style="${rkB2(1185,758,1645,872)}"><span class="shine"></span></button>`}
function rkRbSel(d,i){const ri=rkLvl();let v=RKSEL==null?ri:RKSEL;v=i!=null?i:Math.max(0,Math.min(RKTOP,v+d));RKSEL=v;rkView('rb')}
/* ---------- EQUIPAR: personagem no meio com os espaços equipados em volta + itens da mochila ---------- */
const RKSLOT=[['esp','🗡️','ESPADA'],['cap','⛑️','CAPACETE'],['anel','💍','ANEL'],['arm','🛡️','ARMADURA'],['bot','🥾','BOTAS'],['poc','🧪','POÇÃO']];
/* pilhas: itens iguais ocupam 1 espaço (até 99 por espaço) */
const twStKey=x=>x.k==='poc'?'p|'+(x.pk||'')+'|'+x.r+'|'+x.v:[x.t,x.r,x.v,x.crit||0,x.dmg||0,x.vel||0,x.nm||'',x.ps?x.ps.r+x.ps.i:''].join('|');
function twStacks(){const M=new Map();for(const x of twBagItems()){const k=twStKey(x);if(!M.has(k))M.set(k,[]);M.get(k).push(x)}const out=[];for(const [k,L] of M)for(let i=0;i<L.length;i+=99){const g=L.slice(i,i+99);out.push(Object.assign({},g[0],{key:k+'#'+i,ids:g.map(y=>y.id),n:g.length}))}return out}
twCap=function(){let S=twStacks(),out=null;while(S.length>TWBAG){const C=S.filter(x=>!(x.ev||x.uniq||x.ysec||x.sk||rkHi(x.r)));if(!C.length)break;const w=C.sort((a,b)=>rkItV(a)-rkItV(b))[0],ids=new Set(w.ids);if(w.k==='poc')twLS.s('tw_poc',twPocs().filter(x=>!ids.has(x.id)));else twLS.s('tw_inv',twInv().filter(x=>!ids.has(x.id)));out=w;S=twStacks()}return out};
twBag=function(){rkEquip()};
const rkItNm=x=>x.nm||(x.t==='poc'?(x.pk==='cura'?'POÇÃO DE CURA':x.pk==='drop'?'POÇÃO DE DROP':'POÇÃO'):x.t==='anel'?'ANEL':(TWEQ.find(E=>E.k===x.t)||{}).n||''),rkItIc=x=>x.img||(x.t==='poc'?(x.pk?RQA[x.pk==='cura'?'pcu':'pdr'][rkPkI(x.r)]:TWIMG.poc[Math.max(0,TWRK.indexOf(x.r))]):x.t==='anel'?RQA.anel[rkPkI(x.r)]:twIco(x.t,x.r)),rkItC=x=>x.r==='obs'?'#c46bff':rkHi(x.r)?'#e2b6ff':(TWEQR.find(q=>q.k===x.r)||TWEQR[0]).c;
const rkHi=r=>r==='sec'||r==='obs',rkLock=x=>false /* v292: Rika (obscura) agora pode tirar */,rkYC=x=>(rkIsY(x)?' ysec'+(x.r==='obs'?' yobs':''):'')+psCls(x);
const rkIsY=x=>!!x&&(x.ysec||(x.yt&&rkHi(x.r))),rkItV=x=>Math.max(x.v||0,x.def||0,x.crit||0,x.dmg||0,x.st||0,x.fdmg||0,x.drop||0);
const rkItEf=x=>rkItEf0(x)+(x&&x.ps&&psDef(x.ps)?' · ✦ PASSIVA '+psRN(x.ps.r)+': '+psDef(x.ps).n+' ('+psFx(psDef(x.ps))+')':'');const rkItEf0=x=>x.t==='poc'&&x.pk?rkPkTxt(x):x.yt||x.t==='anel'?rkSpTxt(x):x.uniq?'✦ ITEM ÚNICO ✦ '+({esp:'Ataque',arm:'Defesa',bot:'Velocidade',cap:'Transformação'}[x.t]||'Bônus')+' +'+x.v+'%'+(x.dmg?' · Dano +'+x.dmg+'%':'')+(x.crit?' · Crítico +'+x.crit+'%':'')+(x.st?' · Sorte +'+x.st+'%':'')+(x.vel?' · Velocidade +'+x.vel+'%':'')+' (permanente)':x.img&&(x.crit||x.dmg)?rkSpTxt(x):x.t==='cap'?'Transformação +'+x.v+'% mais rápida · Crítico +'+(x.crit||0)+'%':x.vel?'Ataque +'+x.v+'% · Velocidade +'+x.vel+'%':x.t==='poc'?twPoTxt(x.r)+' (uso único, próxima luta)':({esp:'Ataque',arm:'Defesa',bot:'Velocidade'}[x.t]||'Bônus')+' +'+x.v+'%';
function rkEquip(f,sk){f=f||'all';const sel=showScreen.cur==='tower'&&TW.pick?TW.pick:rkG('sel','goku'),I=twInv(),Q=twEqp(),on=twPocOn(),SA=twStacks(),L=SA.filter(x=>f==='all'||x.t===f).sort((a,b)=>(TWRK.indexOf(b.r)-TWRK.indexOf(a.r))||(b.v-a.v)||(a.t>b.t?1:-1)),X=sk?SA.find(x=>x.key===sk):null;
  const slot=([k,i,n])=>{const x=k==='poc'?on&&Object.assign({t:'poc'},on):I.find(y=>y.id===Q[k]);return `<button class="eqS ${x?'on':''}${x&&x.uniq?' uniq':''}${rkYC(x)}" data-s="${k}" style="--c:${x?rkItC(x):'#556'}">${x?`<img src="${rkItIc(x)}" alt=""><b>+${rkItV(x)}%</b>`:`<i>${i}</i>`}<span>${x?rkItNm(x):n}</span></button>`};
  const tot=`⚔️ +${twEqB('dano')}% · 🛡️ +${twEqB('vida')}% · 💨 +${twEqB('vel')}% · 💥 +${Math.round(eqCrit())}% · ⚡ +${twEqB('trf')}%${eqFdmg()?' · 🔥 +'+Math.round(eqFdmg())+'%':''} · <b class="eqGr">🍀 Sorte +${rkEqSt()} · 🎁 Drop +${Math.round(eqDrop())}%</b>${on?' · 🧪 poção ativa':''}${rkG('pk_cura',null)?' · <b class="eqGr">💚 Cura '+rkG('pk_cura').v+'% pronta</b>':''}${rkG('pk_drop',null)?' · <b class="eqGr">🎁 Poção de drop +'+rkG('pk_drop').v+'% pronta</b>':''}`;
  const pr=x=>TWSELL[x.r]||100;
  const det=X?`<div class="eqD${X.uniq?' uniq':''}${rkYC(X)}" style="--c:${rkItC(X)}"><img src="${rkItIc(X)}" alt=""><div><span style="color:${rkItC(X)}">${X.uniq?'✦ ÚNICA ✦':(TWEQR.find(q=>q.k===X.r)||TWEQR[0]).n}${X.n>1?' · x'+X.n:''}</span><b>${rkItNm(X)} +${rkItV(X)}%</b><em>${rkItEf(X)}</em></div><div class="eqDb">${X.k==='poc'?`<button class="btn main" data-d="beber" ${(X.pk?rkG('pk_'+X.pk,null):on)?'disabled':''}>${(X.pk?rkG('pk_'+X.pk,null):on)?'JÁ TEM UMA ATIVA':'🧪 BEBER'}</button><button class="btn" data-d="del">DESCARTAR 1</button>`:`<button class="btn main" data-d="eq">EQUIPAR</button>${X.uniq?'<em class="eqUq">item único · não pode vender</em>':''}${rkIsY(X)&&!X.uniq?'<em class="eqUq">item secreto · não pode vender</em>':''}<button class="btn sell" data-d="sell" ${X.uniq||rkIsY(X)?'hidden':''}>VENDER 1 · 🪙 ${pr(X)}</button>${X.n>1&&!rkIsY(X)?`<button class="btn sell" data-d="sellAll">VENDER ${X.n} · 🪙 ${pr(X)*X.n}</button>`:''}`}</div></div>`:'<p class="twH eqT">Toque num item para ver e equipar / vender. Itens iguais ficam juntos no mesmo espaço (até 99).</p>';
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
    if(d==='sell'||d==='sellAll'){if(rkIsY(X)||X.uniq)return;if(!b.dataset.ok){b.dataset.ok=1;b.textContent='CONFIRMAR? 🪙 '+(d==='sell'?pr(X):pr(X)*X.n);return}const ids=new Set(d==='sell'?[id]:X.ids);twLS.s('tw_inv',twInv().filter(y=>!ids.has(y.id)));twAddCoins(pr(X)*ids.size);rkSfx('powerUp');rkToast('🪙 +'+pr(X)*ids.size+' moedas!','#ffd84a');return re(d==='sell'&&X.n>1?X.key:null)}});
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
async function rkChatLoad(){try{const hs=[0,1,2].map(i=>'h'+(Math.floor(Date.now()/36e5)-i));let L=[];for(const d of hs)L=L.concat(await rkQ('gh',d,100));
    L=L.filter(m=>m.msg).map(m=>({nome:String(m.nome||'?').slice(0,16),tit:m.tit||'',uid:m.uid||'',msg:String(m.msg).slice(0,140),ct:m._ct})).sort((a,b)=>a.ct-b.ct).slice(-60);
    const pend=(rkChatLoad.p||[]).filter(m=>!L.some(y=>y.uid===m.uid&&y.msg===m.msg));L=L.concat(pend);rkChatLoad.L=L;const E=$('rkChL');if(E){const st=E.scrollTop+E.clientHeight>=E.scrollHeight-20;E.innerHTML=twChatHTML(L);if(st||!rkChatLoad.d){E.scrollTop=E.scrollHeight;rkChatLoad.d=1}}}
  catch(e){const E=$('rkChL');if(E&&!(rkChatLoad.L||[]).length)E.innerHTML='<p class="twH err">'+rkNetMsg()+'</p>'}}
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
function rkBossStart(){rkInit();const sel=rkG('sel','goku');if(!SPR_OK)return;fsTry();RKFL=RKYD!=null?YSDIF[RKYD].lv:(RKBID==='broly'||RKBID==='shaka')&&RKSEL!=null&&RKSEL<rkLvl()?RKSEL:null;G.pick=sel;G.opp=RKBID;G.gmode='boss';RKB.diff0=G.diff;{const lv=rkBL();G.diff=lv<2?1:lv<4?2:3}
  const sk=Object.keys(STG).filter(k=>!STG[k].hid);G.nextStg=RKBID==='shaka'&&STG.shk?'shk':sk[(Math.random()*sk.length)|0];try{nv('vMChallenge',.05,1)}catch(e){}
  const PM=prepMatch([G.pick,G.opp],G.nextStg);showVS(()=>PM.then(()=>{vsLoadEnd();startMatch()}),PM)}
function rkApply(){if(G.gmode!=='boss'||!G.p)return;const [p,o]=G.p;p.tdm=(p.tdm||1)+twEqB('dano')/100;p.tsp=(p.tsp||1)+twEqB('vel')/100;p.tdf=1/(1/(p.tdf||1)+twEqB('vida')/100);{const q=twEqOn();p.tcr=0;for(const k in q)p.tcr+=q[k].crit||0}{const t=twEqB('trf');if(t)p.tsb=1+t/100}{const pon=twPocOn();if(pon){const E=twPoE(pon.r);p.tdm+=E[1]/100;p.tcr=(p.tcr||0)+E[2];p.tsb=(p.tsb||1)+E[0]/100;twLS.s('tw_pocOn',null);setTimeout(()=>{try{txt(p.x,p.y-300,'🧪 POÇÃO: +'+E[1]+'% DANO +'+E[2]+'% CRÍT.','#7dff9a')}catch(e){}},1500)}}const lv=rkBL(),L=RKLVS[lv],B=rkBoss();o.rkL=lv;o.rkB={dm:B.b1.dm*L.d/100,df:B.b1.df*100/L.v,sp:B.b1.sp*L.s/100};o.rkPhB=rkPhB(lv);ysApply(o);o.mhp=o.rkPhB[0]*LAYER;o.hp=o.hpLag=o.mhp;o.tdm=o.rkB.dm;o.tdf=o.rkB.df;o.tsp=o.rkB.sp;o.sb=0;o.rkPh=1;o.rkP={};o.rkSh=0;o.rkHp=o.hp;
  RKB.fs={t:0,t1:0,cmb:0,hp0:p.hp/(p.mhp||MAXHP)}}
function rkBossGo(){if(G.gmode!=='boss'||!G.p)return;if(G.tlim!==0)G.timer=300;const o=G.p[1],P=o.rkPhB||[7,14];banner(RKYD!=null?'EVENTO · FARM':'MODO BOSS',RKBID==='yuta'?'#c58bff':RKBID==='shaka'?'#ffd84a':'#ff3030',100,RKYD!=null?rkBoss().n+' '+YSDIF[RKYD].n+' · '+P[0]+' BARRAS':rkBoss().n+' NÍVEL '+((o.rkL||0)+1)+' · '+P[0]+' BARRAS')}
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
function rkPhase2(a,d){d.rkPh=2;if(RKB.fs)RKB.fs.t1=RKB.fs.t;d.ko=false;{const L=RKLVS[d.rkL||0],B=rkBoss();d.rkB={dm:B.b2.dm*(d.ysK||1)*L.d/100,df:B.b2.df*100/L.v,sp:B.b2.sp*L.s/100};try{bsStApply(d,2)}catch(e){}d.mhp=(d.rkPhB||rkPhB(d.rkL||0))[1]*LAYER;d.hp=d.hpLag=d.mhp;d.rkHp=d.hp;d.tdm=d.rkB.dm;d.tdf=d.rkB.df;d.tsp=d.rkB.sp}d.state='idle';d.st=0;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;d.move=null;d.hitstun=0;d.inv=60;
  a.vx=-a.facing*10;G.hitstop=Math.max(G.hitstop,20);G.shake=30;G.flash=12;G.flashCol='#d8ffc8';for(const r of [380,250,130])ring(d.x,d.y-150,r===130?'#ffffff':rkBoss().c,r,28,8);
  banner(RKBID==='shaka'?'O SHAKA ABRIU OS OLHOS!':'O '+rkBoss().n+' DESPERTOU!',rkBoss().c,120,'2ª FASE · '+(d.rkPhB||[0,14])[1]+' BARRAS');d.sb=SB_COST;try{startTransform(d)}catch(e){d.form=1;d.formT=FORM_T}buzz(200)}
/* EVENTOS de XP (hora de Brasília, UTC-3): [início, fim, multiplicador, nome] */
const RKEVX=[[Date.UTC(2026,10,8,23,0),Date.UTC(2026,10,9,1,0),3,'3x XP'],
  /* v248: EVENTO DE ATUALIZAÇÃO — 10 horas (12:30 até 22:30 de Brasília, 09/11/2026): 2x XP de rank, 2x gemas, 2x sorte */
  [Date.UTC(2026,10,9,15,30),Date.UTC(2026,10,10,1,30),2,'2x XP · 2x GEMAS · 2x SORTE',{gem:2,luck:2}],
  /* v293: EVENTO 7 HORAS (15:30 até 22:30 de Brasília, 10/11/2026): 3x DROP, 2x SORTE, 2x XP de rank */
  [Date.UTC(2026,10,10,18,30),Date.UTC(2026,10,11,1,30),2,'3x DROP · 2x SORTE · 2x XP · 2x GEMAS',{luck:2,drop:3,gem:2}],
  /* v382: EVENTO 2x XP DE RANK — de 12/11 16:30 até 15/11 23:59 (Brasília) */
  [Date.UTC(2026,10,12,19,30),Date.UTC(2026,10,16,2,59),2,'2x XP DE RANK']];
const rkEvX=()=>{const t=Date.now();return RKEVX.find(e=>t>=e[0]&&t<e[1])||null};
const rkAdm2=()=>{try{return twIsAdm()?2:1}catch(e){return 1}};
const rkEvG=()=>((e=>(e&&e[4]&&e[4].gem)||1)(rkEvX()))*rkAdm2(),rkEvL=()=>((e=>(e&&e[4]&&e[4].luck)||1)(rkEvX()))+rkAdm2()-1,rkEvD=()=>((e=>(e&&e[4]&&e[4].drop)||1)(rkEvX()))+rkAdm2()-1; /* v344: somado (evento 3x = +200%, título ADM 2x = +100%) */
const rkEvTxt=()=>'';const rkEvTxt0=()=>{const e=rkEvX();if(!e)return '';const m=Math.max(0,Math.round((e[1]-Date.now())/60000));return `<div class="rkEvX">🔥 EVENTO <b>${e[3]}</b> NA RANQUEADA! · termina em ${m>=60?Math.floor(m/60)+'h'+String(m%60).padStart(2,'0'):m+' min'}</div>`};
let R_SRV=0;
function rkAfter(w){G.mode='ranked';$('controls').hidden=true;$('pauseBtn').hidden=true;rainSound(0);G.paused=false;G.diff=RKB.diff0;
  const F=RKB.fs||{t:0,t1:0,cmb:0,hp0:1},o=G.p[1],p=G.p[0],won=w===0,secs=Math.round(F.t/60);
  const PB=o.rkPhB||[7,14],dmg=Math.round(o.rkPh===2?PB[0]*LAYER+(PB[1]*LAYER-Math.max(0,o.hp)):(PB[0]*LAYER-Math.max(0,o.hp))),frac=Math.min(1,dmg/((PB[0]+PB[1])*LAYER)),lost=Math.max(0,1-Math.max(0,p.hp)/(p.mhp||MAXHP));
  let red,gem=0,tic=0,eq=null,chest=null,drp,poc=null,sp=null,pk2=null,ring=null;
  if(won){const q=Math.min(1,Math.max(0,(300-secs)/220))*.6+(1-lost)*.4;red=Math.round(5+5*q);gem=Math.round(5+rkBL()*5.5+Math.random()*10)*(RKFL!=null&&RKYD==null?.5:1);chest=secs<150&&lost<.4?'lend':secs<220?'epica':'rara';const FM=RKFL!=null&&RKYD==null;if(FM)chest=chest==='lend'?'epica':'rara';
    if(Math.random()<(chest==='lend'?.4:chest==='epica'?.2:.12)*(FM?.5:1)*rkDropF())tic=1;if(Math.random()<(chest==='lend'?.2:.08)*(FM?.5:1)*rkDropF()){const E=TWEQ[(Math.random()*TWEQ.length)|0];eq={E,R:twEqRoll()}}drp=RKXW[rkLvl()];
    if(Math.random()<.3&&!['rara','lend','mit'].includes(chest))poc=twPoRoll();
    /* v250: poção de CURA/DROP e ANEL DE DROP (drop do Boss, fora do baú; o drop aumenta a chance) */
    if(Math.random()<.04*lvLuck()){psAddJn(1);setTimeout(()=>rkToast('💠 JOIA NEGRA!','#c46bff'),1500)}if(Math.random()<(FM?.12:.22)*rkDropF())pk2=rkPoRoll();if(Math.random()<(FM?.04:.07)*rkDropF())ring=rkRingRoll();  /* v240: baú raro/lendário/mítico não dá poção */
    /* drops especiais do boss (bem difíceis) + piedade: garantido em 25 vitórias sem drop especial */
    const bp=rkG('bpity',0)+(FM?0:1),rr=Math.random()*100*(FM?2:1);let sk=null;if(rr<1.5)sk=['kam','gun'][(Math.random()*2)|0];else if(rr<5.5)sk=['band','bots','senzu'][(Math.random()*3)|0];else if(bp>=25)sk=['band','bots','senzu','band','bots','senzu','kam','gun'][(Math.random()*8)|0];
    if(sk){rkS('bpity',0);sp=sk}else rkS('bpity',bp)}
  else{red=frac>.5?2:frac>.2?1:0;gem=0;drp=-RKXL[rkLvl()]}
  const lvB=rkBL(),xb=[];if(won&&RKFL==null){xb.push(['Vitória',drp]);const cb=Math.min(RKXB.cmb,(F.cmb||0)*2);if(cb>0){xb.push(['👊 Combo '+F.cmb,cb]);drp+=cb}
    const me=rkMyRec(lvB),sx=Math.max(1,secs);if(!me||sx<me){xb.push([me?'🏅 SEU RECORDE ('+twFmt(me)+' → '+twFmt(sx)+')':'🏅 1ª vitória neste nível',RKXB.me]);drp+=RKXB.me;const S=rkSt();S[rkRecK()]=Object.assign({},S[rkRecK()],{[lvB]:sx});rkS('st',S)}
    if(RKSRV){const sv=RKSRV[lvB];if(!sv||sx<sv.tt){xb.push(['🏆 RECORDE DO SERVIDOR!',RKXB.srv]);drp+=RKXB.srv;RKSRV[lvB]={tt:sx,nome:twLS.g('tw_nome','')||'Você'};R_SRV=1}}}
  else{const db=Math.round(RKXL[lvB]*RKXB.dmg*frac);xb.push(['Derrota',drp]);if(db>0){xb.push(['💥 Dano '+Math.round(frac*100)+'%','+'+db]);drp+=db}}
  {const ev=rkEvX();if(ev&&won){const ex=drp*(ev[2]-1);xb.push(['🔥 EVENTO '+ev[3],'+'+ex]);drp+=ex}if(won&&rkAdm2()>1)drp*=2}
  if(RKFL!=null){xb.length=0;xb.push([RKYD!=null?'🌸 FARM DO EVENTO · '+YSDIF[RKYD].n+' · sem XP de rank':'🌾 MODO FARM · nível '+(RKFL+1)+' · sem XP de rank','0']);drp=0;R_SRV=0}
  gem=Math.min(GEMCAP,Math.round(gem*Math.min(3,rkEvG())));rkAdd('red',red);rkAdd('gem',gem);rkAdd('tic',tic);if(eq)twAddItem(eq.E,eq.R);if(poc)twAddPoc(poc);if(pk2)twAddPoc(pk2);if(ring)rkAddRing(ring);if(sp){if(sp==='senzu')rkAddSenzu(1);else rkGiveSp(sp)}
  const rp0=rkG('rp',0),r0=rkRank(rp0);let rp1=Math.max(0,rp0+drp);rkS('rp',rp1);const r1=rkRank(rp1);for(let i=0;i<=r1;i++)twGiveTit('rk'+i);
  rkStAdd(won?'wins':'loss',1);pfFight({cmb:F.cmb||0,frac,won});rkStAdd('dmgTot',dmg);rkStAdd('dmgMax',dmg,1);if(F.t1){const S=rkSt();if(!S.t1||F.t1/60<S.t1){S.t1=Math.round(F.t1/60);rkS('st',S)}}if(won){const S=rkSt();if(!S.tt||secs<S.tt){S.tt=secs;rkS('st',S)}if(lost<.25)rkStAdd('clean',1)}
  if(RKFL==null)rkSend({rp:rp1,dmg,t1:F.t1?Math.round(F.t1/60):0,tt:won?secs:0,won:won?1:0});
  {const S=rkSt();if(won){if(RKBID==='broly')S.brW=(S.brW||0)|(1<<rkBL());else if(RKYD!=null){const k=RKBID==='shaka'?'skW':'ysW';S[k]=(S[k]||0)|(1<<RKYD)}rkS('st',S)}}
  const R={bn:rkBoss().n,yd:RKYD,farm:RKFL!=null?RKFL+1:0,won,secs,dmg,frac,red,gem,tic,eq,chest,poc,pk2,ring,sp,drp,rp0,rp1,r0,r1,t1:F.t1?Math.round(F.t1/60):0,lost,cmb:F.cmb,xb,srv:R_SRV};R_SRV=0;
  {const fs=RKFL;rkOpen(RKBID==='yuta'?'yb':RKBID==='shaka'&&skOn()?'sb':'boss');if(fs!=null&&RKYD==null)RKSEL=fs}setTimeout(()=>rkResult(R),200)}
/* recordes de tempo por nível do Boss: servidor (RKSRV) e seu (st.rec) */
let RKSRV=null;
async function rkSrvLoad(){try{const lv0=rkLvl(),L=(await rkQ('rkr',rkBP()+lv0,300)).map(e=>({nome:e.nome,tt:e.tt|0,won:1,rp:e.rp|0,lv:lv0})),M={};for(const e of L){if(!e.won||!e.tt)continue;const lv=e.lv!=null?e.lv:rkRank(e.rp||0);if(!M[lv]||e.tt<M[lv].tt)M[lv]={tt:e.tt,nome:e.nome}}RKSRV=M;if(RKV==='rb'&&showScreen.cur==='ranked'&&!$('rkModal').innerHTML)rkView('rb')}catch(e){}}
async function rkLoadRkAll(){const L=await rkQ('rk','1',1000);return L.map(e=>({nome:e.nome,tt:e.tt|0,won:e.won|0,rp:e.rp|0,lv:e.lv!=null&&e.lv!==''?(e.lv|0):null}))}
const rkRecK=()=>RKBID==='yuta'?'recY':RKBID==='shaka'?'recS':'rec',rkMyRec=lv=>(rkSt()[rkRecK()]||{})[lv]||0;
function rkSend(x){const n=twLS.g('tw_nome','');if(!n)return;const IV=v=>({integerValue:String(Math.max(0,Math.round(v)))});
  const f={nome:{stringValue:n},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},tit:{stringValue:twTitOn()},rk:{stringValue:'1'},rp:IV(x.rp),lv:IV(x.lv!=null?x.lv:rkLvl()),dmg:IV(x.dmg),...(x.won&&x.tt>0?{rkr:{stringValue:rkBP()+(x.lv!=null?x.lv:rkLvl())},tw:IV(x.tt)}:{}),...(x.t1>0?{t1w:IV(x.t1)}:{}),t1:IV(x.t1),tt:IV(x.tt),won:IV(x.won),char:{stringValue:G.pick||''},v:IV(213)};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(()=>{})}
function rkResult(R){const it=[];it.push(`<span><img src="${RQA.coin[1]}" alt="">+${R.red}</span>`);if(R.gem)it.push(`<span><img src="${RQA.coin[0]}" alt="">+${R.gem}</span>`);if(R.tic)it.push(`<span><img src="${RQA.coin[2]}" alt="">+1 TICKET</span>`);
  if(R.poc)it.push(`<span style="--c:${R.poc.c}"><img src="${TWIMG.poc[TWRK.indexOf(R.poc.k)]}" alt="">POÇÃO ${R.poc.n}</span>`);
  for(const x of [R.pk2&&{t:'poc',pk:R.pk2.pk,r:R.pk2.k,v:R.pk2.v},R.ring&&{t:'anel',r:R.ring,drop:RKANV[rkPkI(R.ring)],v:0}])if(x)it.push(`<span style="--c:${rkItC(x)}"><img src="${rkItIc(x)}" alt="">${x.t==='anel'?'ANEL DE DROP':rkItNm(x)} ${rkRarN(x.r)} +${rkItV(x)}%</span>`);
  if(R.sp){const S=R.sp==='senzu'?{nm:'SEMENTE DOS DEUSES',img:RQA.sp.senzu,r:'lend'}:RKSP[R.sp];it.push(`<span class="spd" style="--c:${TWEQR.find(q=>q.k===S.r).c}"><img src="${S.img}" alt="">✦ ${S.nm}</span>`)}
  if(R.eq)it.push(`<span style="--c:${R.eq.R.c}"><img src="${twIco(R.eq.E.k,R.eq.R.k)}" alt="">${R.eq.E.n} ${R.eq.R.n}</span>`);
  const up=R.r1>R.r0,down=R.r1<R.r0,ri=R.r1,ci=R.chest?TWRK.indexOf(R.chest):0;
  rkModal(`<div class="twM rkRes ${R.won?'gold':''}"><h3>${R.won?'🏆 '+(R.bn||'BROLY')+' DERROTADO!':'💀 O '+(R.bn||'BROLY')+' VENCEU'}${R.yd!=null?' <small style="color:#e2b6ff">🌸 EVENTO</small>':R.farm?' <small style="color:#9fff5a">🌾 FARM</small>':''}</h3>
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
  yrou:{t:'arm',r:'sec',v:60,trf:10,nm:'UNIFORME DO YUTA',img:RQA.ysp.yrou,yt:1,ysec:1},yrika:{t:'cap',r:'obs',v:0,def:40,crit:20,st:30,drop:30,nm:'RIKA',img:RQA.ysp.yrika,yt:1,ysec:1},
  /* v280: itens SECRETOS do Shaka (Invocação Ilimitada); 50% em quem não é o Shaka; Shaka com o set completo = +10% em cada item */
  skcap:{t:'cap',r:'sec',v:0,def:90,crit:60,st:20,nm:'ELMO DE VIRGEM',img:RQA.ssp.skcap,sk:1,ysec:1},skarm:{t:'arm',r:'sec',v:0,dmg:60,crit:45,nm:'ARMADURA DE VIRGEM',img:RQA.ssp.skarm,sk:1,ysec:1},
  skluv:{t:'anel',r:'sec',v:0,dmg:45,vel:70,st:75,nm:'LUVAS DE VIRGEM',img:RQA.ssp.skluv,sk:1,ysec:1},skbot:{t:'bot',r:'sec',v:50,dmg:40,nm:'BOTAS DE VIRGEM',img:RQA.ssp.skbot,sk:1,ysec:1},
  skros:{t:'esp',r:'sec',v:0,st:70,drop:40,nm:'ROSÁRIO DE SHAKA',img:RQA.ssp.skros,sk:1,ysec:1}};
/* Semente dos Deuses: quando você morre (Modo Boss e Torre), volta com a vida cheia (usa 1) */
const rkSenzu=()=>twLS.g('tw_senzu',0)|0,rkAddSenzu=n=>twLS.s('tw_senzu',Math.max(0,rkSenzu()+n));
function rkSenzuRevive(d){if(rkSenzu()<=0||d.cpu||d.rkSz)return false;d.rkSz=1;rkAddSenzu(-1);d.ko=false;d.hp=d.hpLag=(d.mhp||MAXHP);d.state='idle';d.st=0;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;d.move=null;d.hitstun=0;d.inv=90;
  G.flash=10;G.flashCol='#d8ffb0';G.hitstop=Math.max(G.hitstop,16);for(const r of [300,180])ring(d.x,d.y-150,'#9fff5a',r,24,7);banner('SEMENTE DOS DEUSES!','#9fff5a',100,'VIDA RESTAURADA');rkSfx('powerUp');return true}
const rkSpTxt=x=>[x.v?(x.t==='esp'?'Ataque +'+x.v+'%':x.t==='arm'?'Defesa +'+x.v+'%':x.t==='anel'?'Sorte +'+x.v+'%':x.t==='bot'?'Velocidade +'+x.v+'%':'Transformação +'+x.v+'%'):'',x.def?'Defesa +'+x.def+'%':'',x.dmg?'Dano +'+x.dmg+'%':'',x.vel?'Velocidade +'+x.vel+'%':'',x.crit?'Crítico +'+x.crit+'%':'',x.st&&x.t!=='anel'?'Sorte +'+x.st+'%':'',x.trf?'Transformação +'+x.trf+'%':'',x.fdmg?'Dano na transformação +'+x.fdmg+'%':'',x.drop?'Drop +'+x.drop+'%':'',x.yt?'(50% em quem não é o Yuta)':'',x.sk?'(50% em quem não é o Shaka · Shaka com o set completo: +10%)':''].filter(Boolean).join(' · ');
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
let rkCost=n=>{const t=Math.min(n,rkG('tic',0)|0),g=n===1?(t?0:50):(n-t)*45;return {t,g}};
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
  O.innerHTML=`<div class="rkCards ${one?'one':''}">${L.map((x,i)=>`<div class="rkCd r_${x.r}${x.id==='shaka'?' skCd':''}" data-i="${i}" style="--c:${(TWEQR.find(R=>R.k===x.r)||TWEQR[0]).c}"><div class="bk"></div><div class="fr"><img class="frm" src="${RQA.card[rkHi(x.r)?'lend':x.r]||RQA.card.comum}" alt=""><div class="in">${rkCardInner(x)}</div></div></div>`).join('')}</div>
    <div class="row"><button class="btn" id="rkCdAll">REVELAR TUDO</button><button class="btn main" id="rkCdOk" hidden>OK</button></div>`;
  rkHost().appendChild(O);const C=[...O.querySelectorAll('.rkCd')];let k=0;
  const rev=async el=>{if(!el||el.classList.contains('rv')||el.dataset.b)return;el.dataset.b=1;const x=L[+el.dataset.i];
    if(x.k==='chr'&&x.r==='mit')try{await (x.id==='yuta'?rkMegaY():x.id==='shaka'?rkMegaS():rkMega())}catch(e){} /* v374: erro 'hidden' de null travava a revelação */
    if((x.r==='lend'&&x.k==='chr')||rkHi(x.r)){O.classList.add('dim');await new Promise(r=>setTimeout(r,500));O.classList.remove('dim')}
    el.classList.add('rv');rkSfx(x.r==='lend'||x.r==='mit'?'boom':'whoosh');if(x.r==='lend'||x.r==='mit'||rkHi(x.r))setTimeout(()=>rkSfx('powerUp'),200);if(rkHi(x.r)){await new Promise(r=>setTimeout(r,400));await rkSecWin(x.s||'sec')}
    if(x.k==='chr'&&x.r==='mit'){await new Promise(r=>setTimeout(r,500));await rkCharWin(x.id,1,x.nw);if(x.id==='yuta'&&x.nw)await ytTitClaim(1);if(x.id==='shaka'&&x.nw)await skTitClaim(1)}
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
  if(RKL.tab==='chr'){for(const id of ['shaka','yuta'].concat(RK_MIT,RK_LEG,RK_EPI).filter(i=>CH[i]))R.push({id,k:'chr',r:rkRar(id),has:own.includes(id),img:IMG[id]?IMG[id].src:'',big:fullSrc(id),nm:CH[id].name,d:(id==='shaka'?'✦ PERSONAGEM SECRETO · ILIMITADO':{mit:'✦ PERSONAGEM MÍTICO',lend:'PERSONAGEM LENDÁRIO'}[rkRar(id)]||'PERSONAGEM ÉPICO')+(rkG('sel','goku')===id?' · EM USO NA RANQUEADA':'')})}
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
function rkLibTab(t){if(t==='an'&&RKL.tab==='chr'&&RKL.cur&&RKL.cur.has)AN.ch=RKL.cur.id;RKL.tab=t;RKL.pg=0;RKL.cur=null;rkView('lib')}
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
    E.innerHTML=L.length?'<p class="twH pfHint">👆 Toque num jogador para ver o perfil</p><div class="twRk">'+L.map((e,i)=>{const ri=rkRank(e.rp);return `<div class="rw${e.uid===me?' me':''}${i<3?' t'+(i+1):''}" data-pu="${twEsc(e.uid||'')}" data-pn="${twEsc(e.nome||'')}"><span class="ps">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><img src="${RQA.rank[ri]}" alt=""><span class="nm">${twEsc(e.nome)}${twTitTag(twTN(e),e.nome)}<small style="color:${RKR[ri].c}">${RKR[ri].n}</small></span><span class="an">${tab==='rp'?'⭐ '+rkFmtN(e.rp)+' XP':tab==='dmg'?'💥 '+rkFmtN(e.dmg):'⏱ '+twFmt(e[tab])}</span></div>`}).join('')+'</div>':'<p class="twH">Ninguém no ranking ainda. Seja o primeiro!</p>'}).catch(()=>{const E=$('rkRkL');if(E)E.innerHTML='<p class="twH err">'+rkNetMsg()+'</p>'})}
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
  if(B('acSv'))B('acSv').onclick=async()=>{msg('Salvando...');localStorage.removeItem('ac_h');const ok=await acSave(1);msg(ok?'✔ Salvo!':rkNetMsg()+' Tenta de novo.',ok?'ok':'err');if(ok&&B('acLt'))B('acLt').textContent=acT(localStorage.getItem('ac_t'))};
  if(B('acOut'))B('acOut').onclick=()=>{['ac_k','ac_n','ac_h','ac_t'].forEach(x=>localStorage.removeItem(x));acOpen('entrar')};
  if(B('acNew'))B('acNew').onclick=async()=>{const p=B('acP1').value,p2=B('acP2').value;if(p.length<4)return msg('A senha precisa de pelo menos 4 letras/números.','err');if(p!==p2)return msg('As senhas não são iguais.','err');
    B('acNew').disabled=true;msg('Criando conta...');try{const acc=await acId(me),L=await acList(acc);if(L.length){B('acNew').disabled=false;return msg('Esse nome já tem conta. Se a conta é sua, toque em 🔑 ENTRAR (em cima) e digite a senha.','err')}
      const k=await acKey(me,p);localStorage.setItem('ac_k',k);localStorage.setItem('ac_n',me);localStorage.removeItem('ac_h');const ok=await acSave(1);if(!ok){['ac_k','ac_n'].forEach(x=>localStorage.removeItem(x));B('acNew').disabled=false;return msg(rkNetMsg()+' Tenta de novo.','err')}
      try{rkSfx('powerUp')}catch(e){}acOpen('ok')}catch(e){B('acNew').disabled=false;msg(rkNetMsg()+' Tenta de novo.','err')}};
  if(B('acIn'))B('acIn').onclick=async()=>{const nn=B('acN').value.trim(),p=B('acP').value;if(!nn||!p)return msg('Digite o nome e a senha.','err');B('acIn').disabled=true;msg('Entrando...');
    try{const acc=await acId(nn),L=await acList(acc);if(!L.length){B('acIn').disabled=false;return msg('Conta não encontrada. Confira o nome.','err')}const k=await acKey(nn,p),x=await acFind(acc,k,L);if(!x){B('acIn').disabled=false;return msg('Senha errada.','err')}
      const D=JSON.parse(x.d);for(const kk of Object.keys(localStorage))if(/^(tw_|rk_)/.test(kk))localStorage.removeItem(kk);for(const kk in D)localStorage.setItem(kk,D[kk]);
      localStorage.setItem('ac_k',k);localStorage.setItem('ac_n',(()=>{try{return JSON.parse(D.tw_nome)}catch(e){return nn}})()||nn);localStorage.setItem('ac_h',twHash(acData()));localStorage.setItem('ac_t',String(x.ts));
      msg('✔ Conta carregada! Recarregando o jogo...','ok');setTimeout(()=>location.reload(),900)}catch(e){B('acIn').disabled=false;msg(rkNetMsg()+' Tenta de novo.','err')}}}

/* ================= MODO TORRE RANQUEADA (v228): mesma rank do Boss, dá mais XP, nova tela ================= */
/* v268: no torneio (TWEV.flat) a torre é igual para todos: rank mais baixo, sem bônus de rank */
const rkTwLv=()=>{try{if(TWEV.flat&&twEvSt()==='ao vivo')return 0}catch(e){}return rkLvl()};
const RKTWX={fl:.6,top:2,loss:.5},RKTB=i=>({dano:i*2,def:i*2,vel:i,crit:i,sorte:i*3}),rkSorte=()=>psSum().st+RKTB(rkLvl()).sorte+(twIsAdm()?70:0)+rkEqSt()+(tbOf(twTitOn()).st||0),rkEqSt=()=>{let v=0;try{const o=twEqOn();for(const k in o)v+=(o[k].st||0)*eqNf(o[k])}catch(e){}return Math.round(v)};
function rkTorre(){const s=rkG('sel','goku'),own=rkG('own',['goku']);G.pick=CH[s]&&own.includes(s)?s:'goku';G.gmode='torre';try{audioInit()}catch(e){}try{fsTry()}catch(e){}twOpen()}
/* dificuldade da Torre pelo rank (v231): leve no começo; bem mais difícil para chegar nos 2 últimos ranks */
const RKTD={dm:[1,1.1,1.2,1.32,1.45,1.6,1.8,2,2.2,2.45,2.7,3,3.3,3.6],hp:[1,1.1,1.2,1.32,1.45,1.6,1.8,2,2.2,2.45,2.7,3,3.3,3.6],sp:[1,1,1.02,1.04,1.06,1.1,1.14,1.16,1.18,1.2,1.22,1.24,1.26,1.28],ai:[0,0,0,0,1,1,1,1,1,1,1,1,1,1]};
function rkTwDiff(o){const i=rkTwLv();o.mhp=Math.max(1,Math.round(o.mhp/LAYER*RKTD.hp[i]))*LAYER;o.hp=o.hpLag=o.mhp;o.tdm*=RKTD.dm[i];o.tsp*=RKTD.sp[i];G.diff=Math.min(3,(G.diff||1)+RKTD.ai[i]);o.rkTd=i}
const rkTdTxt=i=>i?`Inimigos: dano +${Math.round((RKTD.dm[i]-1)*100)}% · vida +${Math.round((RKTD.hp[i]-1)*100)}% · vel. +${Math.round((RKTD.sp[i]-1)*100)}%${RKTD.ai[i]?' · IA mais esperta':''}`:'Inimigos normais';
function rkTwBuff(p){const B=RKTB(rkTwLv());p.tdm+=B.dano/100;p.tsp+=B.vel/100;p.tdf=1/(1/(p.tdf||1)+B.def/100);p.tcr=(p.tcr||0)+B.crit}
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
const RKQH=b=>{const m=b.match(/"stringValue":"h(\d+)"/);return m&&+m[1]<Math.floor(Date.now()/36e5)};
/* 11/11 (plano pago): quase tudo atualiza a cada 1 minuto; títulos e horas velhas do chat continuam 6 h; chat da hora atual 30 s */
const RKQT=b=>/"(gh|ch)"/.test(b)&&RKQH(b)?6*3600e3:/"(mk[xpsv]?|avs)"/.test(b)?20e3:/"claim"/.test(b)?6*3600e3:/"(gh|ch)"/.test(b)?30e3:/"(sv|nome|nomeL|uid)"/.test(b)?0:60e3;
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
const skSetFull=()=>{const o=twEqOn();return ['cap','arm','esp','bot','anel'].every(k=>o[k]&&o[k].sk)};
const eqNf=it=>it&&it.yt&&eqChar()!=='yuta'?.5:it&&it.sk?(eqChar()!=='shaka'?.5:skSetFull()?1.1:1):1;
twEqOn=function(){const I=twInv(),Q=twEqp(),o={};for(const k of ['esp','arm','bot','cap','anel']){const it=I.find(x=>x.id===Q[k]);if(it)o[k]=it}return o};
const EQMAIN={esp:'dano',arm:'vida',bot:'vel',cap:'trf',anel:'st'};
twEqB=st=>{const o=twEqOn();let v=0;for(const k in o){const it=o[k],n=eqNf(it);if(EQMAIN[k]===st)v+=(it.v||0)*n;if(st==='vel'&&it.vel)v+=it.vel*n;if(st==='dano'&&it.dmg)v+=it.dmg*n;if(st==='vida'&&it.def)v+=it.def*n;if(st==='trf'&&it.trf)v+=it.trf*n}return Math.round(v*10)/10};
const eqCrit=()=>{const o=twEqOn();let c=0;for(const k in o)c+=(o[k].crit||0)*eqNf(o[k]);return c};
const eqDrop=()=>{const o=twEqOn();let c=0;for(const k in o)c+=(o[k].drop||0)*eqNf(o[k]);return c},rkDropF=()=>1+(eqDrop()+RKPDN+psSum().drop)/100+(rkEvD()-1);let RKPDN=0;
const eqFdmg=()=>{const o=twEqOn();let c=0;for(const k in o)c+=(o[k].fdmg||0)*eqNf(o[k]);return c};
/* v348: no máximo 150 gemas por luta (Boss/evento), com sorte e evento somados */
const GEMCAP=150;
/* ---------- NÍVEL dos personagens ---------- */
const LVMAX=id=>id==='shaka'?70:({mit:50,lend:40,epica:30}[rkRar(id)]||30);
const LVCOST=lv=>lv<10?[150,10]:lv<20?[300,20]:lv<30?[500,35]:lv<40?[900,60]:lv<50?[1800,120]:[3000,200];
const LVROW=[1,10,20,30,40,50,60,70];   /* nível em que cada linha da árvore abre */
const LVSTAT={dano:{n:'DANO',i:'⚔️'},cd:{n:'DANO CRÍTICO',i:'💥'},crit:{n:'CRÍTICO',i:'🎯'},vel:{n:'VELOCIDADE',i:'💨'},st:{n:'SORTE',i:'🍀'},ls:{n:'ROUBO DE VIDA',i:'❤️'},uv:{n:'VEL. ULTIMATE',i:'🔥'}};
const LVTREE=[[['dano',3],['crit',2],['vel',2],['st',5]],[['dano',8],['cd',10],['crit',5],['vel',5]],[['ls',4],['st',10],['dano',8],['uv',10]],
  [['cd',10],['crit',5],['vel',5],['ls',4]],[['dano',8],['cd',10],['st',10],['uv',10]],[['dano',10],['cd',15],['crit',7],['ls',5]],
  /* v280: linhas SECRETAS (só o Shaka, nível 60 e 70) */
  [['dano',18],['crit',12],['cd',25],['vel',10]],[['dano',25],['crit',15],['cd',35],['ls',8]]];
const LVCRN=[[0,1],[1,1],[2,1],[3,1],[4,1],[4,2],[4,3],[4,4]];  /* cristal [raridade, quantidade] para escolher em cada linha */
const lvAll=()=>rkG('lv',{}),lvOf=id=>{const L=lvAll()[id]||{};return {lv:Math.max(1,L.lv|0),t:Array.isArray(L.t)?L.t:[],c:Array.isArray(L.c)?L.c:[]}},lvSave=(id,o)=>{const A=lvAll();A[id]=o;rkS('lv',A)};
const lvArr=k=>{const a=rkG(k,[0,0,0,0,0]);while(a.length<5)a.push(0);return a};
const lvPo=()=>rkG('po',0)|0;
function lvBonus(id){const L=lvOf(id),B={dano:(L.lv-1)*.4,crit:(L.lv-1)*.15,vel:0,st:0,cd:0,ls:0,uv:0};
  L.t.forEach((c,r)=>{if(c==null||c<0||!LVTREE[r]||!LVTREE[r][c]||L.lv<LVROW[r])return;const [k,v]=LVTREE[r][c];B[k]+=v});return B}
/* sorte total (rank + ADM + equipamento + nível do personagem em uso) e o multiplicador de drops */
const lvSorte=()=>{try{return rkSorte()+lvBonus(eqChar()).st}catch(e){return 0}};
const lvLuck=()=>1+Math.max(0,lvSorte())/100+(rkEvL()-1); /* v344: +100% de sorte = dobra a chance (tudo somado) */
/* ---------- bônus aplicados na luta (Boss e Torre ranqueada) ---------- */
{const _ra=rkApply;rkApply=function(){_ra.apply(this,arguments);try{rkExtra()}catch(e){}try{if(G.gmode==='boss'&&G.p)tbApply(G.p[0])}catch(e){}}}
function rkExtra(){if(!G.p)return;const torre=typeof TW!=='undefined'&&TW.on&&G.gmode==='torre',boss=G.gmode==='boss';if(!torre&&!boss)return;const p=G.p[0],id=p.def.id;
  // crítico de todos os equipamentos (a Torre antiga só contava o capacete) com o corte de 50% dos itens do Yuta
  const o=twEqOn();const already=torre?((o.cap&&o.cap.crit)||0):Object.values(o).reduce((a,x)=>a+(x.crit||0),0);p.tcr=(p.tcr||0)-already+eqCrit();
  p.tfd=eqFdmg();
  const B=lvBonus(id);p.tdm=(p.tdm||1)+B.dano/100;p.tcr=(p.tcr||0)+B.crit;p.tsp=(p.tsp||1)+B.vel/100;p.tcd=B.cd;p.tls=B.ls;p.tki=(p.tki||1)+B.uv/100;
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
  if(R.won&&L>1){D.gem=Math.max(0,Math.min(GEMCAP-(R.gem||0),Math.round((R.gem||0)*(Math.min(3,L)-1)*.5)));D.red=Math.round((R.red||0)*(L-1));if(D.gem)rkAdd('gem',D.gem);if(D.red)rkAdd('red',D.red)}
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
  <button class="rkUse" id="rkUse" data-a="libUse" style="${rkB(14,603,268,660)}" hidden></button>
  <button class="lbEvo" id="lbEvo" data-a="evo" style="${rkB(14,670,268,740)}" hidden>⬆ EVOLUIR</button>`}}
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
  ${LVMAX(id)>50?`<button class="lvX" data-a="lvX" style="${rkB(1150,722,1780,766)}">✦ HABILIDADES SECRETAS · NÍVEL 60 E 70</button>`:''}${LVTREE.slice(0,6).map((row,r)=>{const open=L.lv>=LVROW[r],has=r<lvRows(id),pick=L.t[r];return `<div class="lvRl ${open?'on':''} ${has?'':'x'}" style="${rkB(1028,RY[r]+24,1098,RY[r]+46)}">${has?'Nv '+LVROW[r]:'—'}</div>`+row.map(([k,v],ci)=>`<button class="lvNd ${!has?'x':open?'on':'lk'} ${pick===ci?'sel':''} ${pick!=null&&pick>=0&&pick!==ci?'off':''}" data-a="lvNode" data-r="${r}" data-c="${ci}" style="${rkB(CX[ci],RY[r]-42,CX[ci]+85,RY[r]+42)};--c:${RKRC[Math.min(4,r)]}"><i>${LVSTAT[k].i}</i><b>+${v}%</b></button>`).join('')}).join('')}
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
/* v389: evento do SHAKA (5 dias) — de 13/11 09:30 até 18/11 23:59 (Brasília) */
const SKEV={ini:Date.UTC(2026,10,13,15,0),fim:Date.UTC(2026,10,19,2,59,59)}; /* v392: libera ao MEIO-DIA de 13/11 (ADM entra antes para testar) */
const skAntes=()=>ysNow()<SKEV.ini,skOn=()=>{const t=ysNow();if(t>SKEV.fim)return false;if(t>=SKEV.ini)return true;try{return twIsAdm()}catch(e){return false}},skLeft=()=>{const ms=Math.max(0,SKEV.fim-ysNow()),d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);return d?d+'d '+h+'h':h+'h '+m+'min'};
try{if(localStorage.getItem('rk_bsel')==='shaka'&&skOn())RKBID='shaka'}catch(e){}
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
  ${skSlot(410,495)}${[[505,590],[600,690]].map(([a,b])=>`<button class="hs" data-a="lock" style="${rkB(10,a,415,b)}"></button>`).join('')}
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
  if(R.won){const g=Math.min(GEMCAP,Math.round(ysRnd(D.gem)*(1+(Math.min(3,L)-1)*.5)*Math.min(3,rkEvG())));rkAdd('gem',g);it.push(`<span style="--c:#5ab8ff"><img src="${RQA.coin[0]}" alt="">🌸 +${g}</span>`);
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
for(const k in TWTIT){const t=tbTxt(k);if(k==='adm')TWTIT[k].d='Administrador do jogo · ✦ +70% em TUDO (dano, defesa, velocidade, crítico, energia, sorte e drops) · 🔥 2x XP, gemas, sorte, drop e anel, sempre';else if(t)TWTIT[k].d=(TWTIT[k].d||'')+' · ✦ Bônus em uso: '+t}
function tbApply(p){if(!p||p.cpu||p.tbOn)return;p.tbOn=1;const B=tbOf(twTitOn());
  if(B.dano)p.tdm=(p.tdm||1)+B.dano/100;if(B.vel)p.tsp=(p.tsp||1)+B.vel/100;if(B.def)p.tdf=1/(1/(p.tdf||1)+B.def/100);if(B.crit)p.tcr=(p.tcr||0)+B.crit;
  if(twIsAdm()){p.tdm=(p.tdm||1)+.7;p.tsp=(p.tsp||1)+.7;p.tdf=1/(1/(p.tdf||1)+.7);p.tcr=(p.tcr||0)+70;p.tki=(p.tki||1)+.7;p.tsb=(p.tsb||1)+.7}}
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
async function mdTopCheck(){try{const A=(await rkLoadRk('rp')).filter(e=>!e.bot).sort((a,b)=>b.rp-a.rp),i=A.findIndex(e=>e.uid===twUid());if(i<0||i>2)return;const w=twWk(Date.now()),T=rkG('topw',null);if(!T||T.w!==w||i+1<T.n)rkS('topw',{w,n:i+1})}catch(e){}}
function mdPick(){mdTopCheck().then(()=>{if(document.querySelector('#rkModal .mdG'))mdPick0()});mdPick0()}
function mdPick0(){const cur=rkG('mold','');
  rkModal(`<div class="twM mdM"><h3>🖼️ MOLDURA DA FOTO</h3><p class="twH">Toque numa moldura liberada para usar. As de TOP valem durante a semana em que você ficou no top do ranking de RANK.</p><div class="mdG"><button class="mdC ${cur?'':'on'}" data-k=""><span class="no">SEM<br>MOLDURA</span><b>NENHUMA</b></button>${Object.keys(MDL).map(k=>{const M=MDL[k],ok=mdOk(k),pr=M.pr?M.pr():null;return `<button class="mdC ${ok?'':'lk'} ${cur===k&&ok?'on':''}" data-k="${k}"><div class="mdPv ${M.cls}"><img src="${RQA.mold[k].src}" alt=""></div><b>${M.n}</b><small>${ok?(cur===k?'EM USO':'USAR'):'🔒 '+M.d+(pr?' ('+pr[0]+'/'+pr[1]+')':'')}</small></button>`}).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);document.querySelectorAll('#rkModal .mdC').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(k&&!mdOk(k)){rkSfx('clang');rkToast('🔒 '+MDL[k].d,'#cfd6ea');return}rkS('mold',k);rkSfx('powerUp');rkModal(null);rkView('pf');if(k)rkToast('🖼️ Moldura '+MDL[k].n+'!','#ffd84a')})}
/* título ADM: placa feita em código (vermelho/dourado com energia) */
{const _pt4=pfTitH;pfTitH=function(t,n,adm){if(t==='adm'&&adm)return `<span class="pfAdmX"><i class="en"></i><i class="cr">👑</i><b data-t="ADMINISTRADOR">ADMINISTRADOR</b><i class="bolt a"></i><i class="bolt b"></i><i class="sw"></i><i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✦</i></span>`;return _pt4.apply(this,arguments)}}
/* v247: itens do Yuta sempre com os bônus certos (corrige itens já guardados) */
(function(){try{const I=twInv();let ch=0;for(const it of I){const k=Object.keys(RKSP).find(q=>RKSP[q].ysec&&RKSP[q].nm===it.nm);if(!k)continue;const S=RKSP[k];for(const f of ['t','r','v','def','crit','dmg','vel','st','trf','fdmg','drop','yt','sk','ysec','img']){if(S[f]!=null&&it[f]!==S[f]){it[f]=S[f];ch=1}else if(S[f]==null&&it[f]!=null&&f!=='img'){delete it[f];ch=1}}}if(ch)twLS.s('tw_inv',I);
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
{const _ex=rkExtra;rkExtra=function(){const r=_ex.apply(this,arguments);try{if(!G.p)return r;const torre=typeof TW!=='undefined'&&TW.on&&G.gmode==='torre',boss=G.gmode==='boss'||G.gmode==='caca'||G.gmode==='dsf'||G.gmode==='pve'; /* v374: passivas valem também na Caça, Hidra, Desafio e Versus */if(!torre&&!boss)return r;const p=G.p[0];
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
const PSW={comum:50,rara:27,epica:14,lend:6,mit:2.5,sec:.5,div:.1,pri:.02};
const PSRK=['comum','rara','epica','lend','mit','sec','div','pri']; /* v363: DIVINA (acima da secreta) e PRIMORDIAL (acima da divina) */
const PSV={comum:[['Golpe Preciso','cd',3],['Pele Resistente','def',2],['Punhos Ágeis','spd',2],['Recuperação Leve','reg',.15],['Caçador Iniciante','drop',3],['Pequena Fortuna','st',2]],
  rara:[['Golpe Mortal','cd',6],['Armadura Reforçada','def',4],['Reflexos Rápidos','spd',4],['Regeneração Natural','reg',.3],['Caçador Experiente','drop',7],['Amuleto da Fortuna','st',5]],
  epica:[['Instinto Assassino','cd',10],['Corpo de Aço','def',7],['Velocidade Sobrenatural','spd',7],['Sangue Regenerativo','reg',.5],['Caçador de Tesouros','drop',12],['Bênção da Sorte','st',9]],
  lend:[['Destruidor de Destinos','cd',15],['Proteção Celestial','def',10],['Relâmpago Divino','spd',10],['Coração Imortal','reg',.75],['Imperador dos Tesouros','drop',20],['Fortuna Celestial','st',15]],
  mit:[['Julgamento Divino','cd',21],['Corpo do Deus da Guerra','def',14],['Velocidade da Luz','spd',13],['Regeneração Divina','reg',1],['Soberano dos Drops','drop',30],['Destino Abençoado','st',22]],
  sec:[['Olhos da Destruição','cd',30],['Corpo Absoluto','def',18],['Deus da Velocidade','spd',16],['Coração Eterno','reg',1.5],['Monarca dos Tesouros','drop',45],['Escolhido pelo Destino','st',35]],
  div:[['Fúria dos Deuses','cd',42],['Égide Divina','def',25],['Asas Divinas','spd',22],['Sangue dos Deuses','reg',2],['Bênção de Buda','mx',{cd:25,def:15,spd:12,reg:1,drop:40,st:30}]],
  pri:[['Caos Primordial','cd',60],['Muralha do Princípio','def',35],['Antes do Tempo','spd',30],['Fonte da Criação','reg',3],['ORIGEM DE TUDO','mx',{cd:50,def:30,spd:25,reg:2.5,drop:100,st:80}]]};
const PSCAP={cd:90,def:50,spd:35,reg:3,drop:150,st:110},PSRC={comum:'#c3c8d2',rara:'#3d9bff',epica:'#b25bff',lend:'#ffc531',mit:'#ff2e63',sec:'#b06bff',div:'#ffe680',pri:'#ff5ef2'},
  PSTC={cd:'#ff3b3b',def:'#9fd0ff',spd:'#3cf0ff',reg:'#5dff8a',drop:'#ffd23a',st:'#c77dff',mx:'#fff3b0'},PSTI={cd:'💥',def:'🛡️',spd:'⚡',reg:'💚',drop:'🎁',st:'🍀',mx:'✴️'};
const psRN=r=>({comum:'COMUM',rara:'RARA',epica:'ÉPICA',lend:'LENDÁRIA',mit:'MÍTICA',sec:'SECRETA',div:'DIVINA',pri:'PRIMORDIAL'}[r]||r),psRI=r=>PSRK.indexOf(r);
const psDef=ps=>{const L=ps&&PSV[ps.r];const d=L&&L[ps.i];return d?{n:d[0],k:d[1],v:d[2],r:ps.r}:null};
const psFx=d=>d.k==='mx'?['cd','def','spd','reg','drop','st'].filter(k=>d.v[k]).map(k=>psFx({k,v:d.v[k]})).join(' · '):d.k==='cd'?'+'+d.v+'% de dano crítico':d.k==='def'?'+'+d.v+'% de defesa':d.k==='spd'?'+'+d.v+'% de velocidade de ataque':d.k==='reg'?'regenera '+String(d.v).replace('.',',')+'% da vida a cada 5 s':d.k==='drop'?'+'+d.v+'% de drop':'+'+d.v+'% de sorte';
const psG=()=>Object.assign({jn:0,pl:0,pm:0,pend:null,ch:{},aura:{}},rkG('ps',{})),psS=o=>{rkS('ps',o);try{acSave()}catch(e){}};
function psAddJn(n){const o=psG();o.jn=Math.max(0,(o.jn|0)+n);psS(o)}
const psCls=x=>{const d=x&&x.ps&&psDef(x.ps);return d&&psRI(d.r)>=2?` psg psr_${d.r} pst_${d.k}`:''};
/* soma das passivas do personagem + equipamentos colocados, com os limites globais */
function psSum(id){const o={cd:0,def:0,spd:0,reg:0,drop:0,st:0};try{id=id||eqChar();const L=[psG().ch[id]];const q=twEqOn();for(const k in q)L.push(q[k].ps);for(const ps of L){const d=psDef(ps);if(d){if(d.k==='mx'){for(const q in d.v)o[q]+=d.v[q]}else o[d.k]+=d.v}}for(const k in o)o[k]=Math.min(PSCAP[k],Math.round(o[k]*100)/100)}catch(e){}return o}
/* sorteio (o resultado sai daqui, não da animação) */
function psRoll(o){const el=(o.pd|0)>=1000?['div','pri']:o.pm>=200?['mit','sec','div','pri']:o.pl>=50?['lend','mit','sec','div','pri']:PSRK;const T=el.reduce((a,k)=>a+PSW[k],0);let x=Math.random()*T,r=el[el.length-1];for(const k of el){if((x-=PSW[k])<0){r=k;break}}
  const ri=psRI(r);o.pl=ri>=3?0:(o.pl|0)+1;o.pm=ri>=4?0:(o.pm|0)+1;o.pd=ri>=6?0:(o.pd|0)+1;return {r,i:ri>=6?(Math.random()<.1?4:(Math.random()*4)|0):(Math.random()*6)|0}}
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
  <div class="psAct" style="${rkB2(640,770,1040,856)}">${pend&&!PS.anim?(o.pendL&&o.pendL.length>1?`<button data-p="pick" class="ok">📋 ESCOLHER (${o.pendL.length})</button><button data-p="keep">✖ MANTER ANTIGA</button>`:`<button data-p="apply" class="ok">✔ APLICAR NOVA</button><button data-p="keep">✖ MANTER ANTIGA</button>`):`<button data-p="spin" class="go" ${!t||(o.jn|0)<1||PS.anim?'disabled':''}>💠 GIRAR x1</button><button data-p="spin5" class="go x5" ${!t||(o.jn|0)<2||PS.anim?'disabled':''}>💠 GIRAR x${Math.min(5,Math.max(2,o.jn|0))}</button>`}</div>
  <div class="psPity" style="${rkB2(1060,774,1186,852)}"><span>Lendária+ em <b>${Math.max(1,50-(o.pl|0))}</b></span><span>Mítica+ em <b>${Math.max(1,200-(o.pm|0))}</b></span><span>Divina+ em <b>${Math.max(1,1000-(o.pd|0))}</b></span></div>
  <button class="psInfo" data-p="info" style="${rkB2(1590,600,1640,642)}">?</button>
  <div class="psSum" style="${rkB2(30,880,1660,930)}">Total ${t&&t.k==='ch'?'de '+twEsc(t.nm):'do personagem em uso'}: 💥 +${S.cd}% crítico · 🛡️ +${S.def}% defesa · ⚡ +${S.spd}% vel. de ataque · 💚 ${String(S.reg).replace('.',',')}%/5s · 🎁 +${S.drop}% drop · 🍀 +${S.st}% sorte</div>`}
function psOn(){const W=$('rkWrap');W.querySelectorAll('[data-p]').forEach(b=>b.onclick=e=>{e.stopPropagation();psAct(b.dataset.p,b)})}
function psAct(a,b){const o=psG();
  if(a==='back')return rkView(PSRET||'boss');
  if(a==='info')return rkModal(`<div class="twM sm psInfoM"><h3>💠 COMO FUNCIONA</h3><p class="twH">1 Joia Negra = 1 giro. Cada personagem e cada item (espada, capacete, anel, armadura, botas) tem 1 espaço de passiva. Depois do giro você escolhe APLICAR a nova ou MANTER a antiga (a joia é gasta igual).</p><p class="twH">Chances: Comum 50% · Rara 27% · Épica 14% · Lendária 6% · Mítica 2,5% · Secreta 0,5% · <b style="color:#ffe680">Divina 0,1%</b> · <b style="color:#ff5ef2">Primordial 0,02%</b>. Na Divina e na Primordial a 5ª passiva (a mais forte, que dá TUDO junto) sai só 1 em cada 10. Proteção: 50 giros sem Lendária+ garante Lendária+; 200 sem Mítica+ garante Mítica+; 1000 sem Divina+ garante Divina+.</p><p class="twH">Limites somando tudo: crítico +90 · defesa +50% · velocidade +35% · regeneração 3%/5s (máx. 15% da vida por luta) · drop +150% · sorte +110%.</p><p class="twH">Joia Negra: 4% de chance em cada vitória (Boss, farm, evento, andar da Torre); a SORTE aumenta essa chance. Também vem de códigos e do Mercado Negro.</p><div class="row"><button class="btn" id="rkMX">OK</button></div></div>`),$('rkMX').onclick=()=>rkModal(null);
  if(PS.anim||PS.busy)return;
  if(a==='tg'||a==='sel'||a==='pg'){if(o.pend&&(a!=='pg')){rkSfx('clang');rkToast('Primeiro escolha: APLICAR ou MANTER a passiva sorteada','#ff8080');return}
    if(a==='tg'){PS.tg=b.dataset.k;PS.sel=null;PS.pg=0}else if(a==='sel')PS.sel=b.dataset.id;else{const np=Math.max(1,Math.ceil(psList().length/9));PS.pg=(PS.pg+(+b.dataset.d)+np)%np}rkSfx('whoosh');return rkView('ps')}
  if(a==='spin'){const t=psTarget();if(!t||o.pend)return;if((o.jn|0)<1){rkSfx('clang');rkToast('Sem Joia Negra!','#ff8080');return}PS.busy=1;
    const R=psRoll(o);o.jn=(o.jn|0)-1;o.pend={tg:{k:t.k,id:t.id},r:R.r,i:R.i};psS(o);  /* gasta a joia e guarda o resultado juntos (uma gravação só) */
    PS.anim=1;rkView('ps');psAnim(R.r,()=>{PS.anim=0;PS.busy=0;rkView('ps');const d=psDef(R);rkSfx(psRI(R.r)>=3?'boom':'powerUp');if(psRI(R.r)>=4)try{SFX.boom()}catch(e){}rkToast((psRI(R.r)>=3?'✨ ':'')+psRN(R.r)+': '+d.n,PSRC[R.r])});return}
  if(a==='apply'||a==='keep'){const P=o.pend;if(!P)return;PS.busy=1;try{if(a==='apply'){if(P.tg.k==='ch'){o.ch[P.tg.id]={r:P.r,i:P.i}}else{const I=twInv(),it=I.find(x=>x.id===P.tg.id);if(it){it.ps={r:P.r,i:P.i};twLS.s('tw_inv',I)}}}
    o.pend=null;o.pendL=null;psS(o)}finally{PS.busy=0}rkSfx(a==='apply'?'powerUp':'whoosh');rkToast(a==='apply'?'✔ Passiva aplicada!':'Passiva antiga mantida','#7dff9a');return rkView('ps')}}
function psAnim(r,cb){const W=$('psWheel'),T=$('psWT');if(!W){cb();return}let n=0;const tot=26;const step=()=>{const k=n<tot-1?PSRK[n%8]:r;W.style.setProperty('--rc',PSRC[k]);T.textContent=psRN(k);T.style.color=PSRC[k];try{if(n%2===0)rkSfx('whoosh')}catch(e){}n++;if(n<tot)setTimeout(step,40+n*n*.35);else{W.classList.add('done','psr_'+r);setTimeout(cb,900)}};step()}
/* começo da luta: crítico, defesa, velocidade de ataque, regeneração, aura da passiva secreta */
{const _ex2=rkExtra;rkExtra=function(){const r=_ex2.apply(this,arguments);try{if(!G.p)return r;const torre=typeof TW!=='undefined'&&TW.on&&G.gmode==='torre',boss=G.gmode==='boss'||G.gmode==='caca'||G.gmode==='dsf'||G.gmode==='pve'; /* v374: passivas valem também na Caça, Hidra, Desafio e Versus */if(!torre&&!boss)return r;const p=G.p[0],id=p.def.id,S=psSum(id);
  p.tcd=(p.tcd||0)+S.cd;if(S.def)p.tdf=1/(1/(p.tdf||1)+S.def/100);p.pspd=S.spd;p.preg=S.reg;p.pregT=G.frame;p.pregTot=0;p._lhp=p.hp;
  const cp=psG().ch[id],d=psDef(cp);if(d&&psRI(d.r)>=5&&psG().aura[id]!==0){const c=PSTC[d.k];p.def=Object.assign({},p.def,{energy:c,energy2:'#ffffff',fe:c,fe2:'#ffffff',frame:c})}}catch(e){}return r}}
function psRegTick(){const p=G.p&&G.p[0];if(!p||!p.preg||p.hp<=0||p.ko)return;const m=p.mhp||MAXHP;if(p._lhp!=null&&p.hp<p._lhp-.5)p.pregT=G.frame;p._lhp=p.hp;const dt=G.frame-(p.pregT||0);
  if(dt>=300&&dt%300===0&&p.hp<m&&(p.pregTot||0)<m*.15){const h=Math.min(m*p.preg/100,m*.15-(p.pregTot||0),m-p.hp);p.hp+=h;p.pregTot=(p.pregTot||0)+h;p._lhp=p.hp;try{txt(p.x,p.y-300,'💚 +'+String(p.preg).replace('.',',')+'%','#5dff8a')}catch(e){}}}
/* Torre: Joia Negra em cada andar vencido */
{const _ta3=twAfter;twAfter=function(w){const r=_ta3.apply(this,arguments);try{if(w===0&&Math.random()<.04*lvLuck()){psAddJn(1);setTimeout(()=>twToast('💠 JOIA NEGRA!','#c46bff'),1200)}}catch(e){}return r}}
/* mochila: botão ENCANTAR, joias e botão da aura (só com passiva SECRETA no personagem) */
{const _eq=rkEquip;rkEquip=function(){const r=_eq.apply(this,arguments);try{const MS=RKMS(),row=document.querySelector(MS+'.rkEq .row'),sel=eqChar(),o=psG(),d=psDef(o.ch[sel]);if(!row)return r;
  const T=document.querySelector(MS+'.rkEq p.eqT:last-of-type');if(T)T.insertAdjacentHTML('afterbegin',`<b class="eqGr">💠 Joias Negras: ${o.jn|0}</b> · `);
  if(showScreen.cur==='ranked')row.insertAdjacentHTML('afterbegin','<button class="btn main" id="psGo">💠 ENCANTAR</button>');
  if(d&&psRI(d.r)>=5)row.insertAdjacentHTML('afterbegin',`<button class="btn" id="psAu">✨ AURA DA PASSIVA: ${o.aura[sel]===0?'DESLIGADA':'LIGADA'}</button>`);
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
  if(x.ps&&PSV[x.ps.r]&&(x.ps.i|0)>=0&&(x.ps.i|0)<PSV[x.ps.r].length)it.ps={r:x.ps.r,i:x.ps.i|0};return {k:'eq',it}}
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
const CBS=[['an','ANÉIS'],['nv','NÍVEL'],['eq','EQUIP.'],['tit','TÍTULO'],['ps','PASSIVA'],['rk','RANK'],['adm','ADM']];
function cbAll(id){const Z=()=>Object.fromEntries(CBK.map(k=>[k[0],0])),S={};for(const [k] of CBS)S[k]=Z();
  try{const L=lvBonus(id);for(const k of ['dano','crit','vel','st','cd','ls','uv'])S.nv[k]=+L[k]||0}catch(e){}
  try{const q=twEqOn();for(const t in q){const it=q[t],n=it.yt&&id!=='yuta'?.5:it.sk?(id!=='shaka'?.5:skSetFull()?1.1:1):1,m=EQMAIN[t];if(m==='dano')S.eq.dano+=(it.v||0)*n;if(m==='vida')S.eq.def+=(it.v||0)*n;if(m==='vel')S.eq.vel+=(it.v||0)*n;if(m==='trf')S.eq.trf+=(it.v||0)*n;
    S.eq.dano+=(it.dmg||0)*n;S.eq.def+=(it.def||0)*n;S.eq.vel+=(it.vel||0)*n;S.eq.trf+=(it.trf||0)*n;S.eq.crit+=(it.crit||0)*n;S.eq.st+=(it.st||0)*n;S.eq.fdmg+=(it.fdmg||0)*n;S.eq.drop+=(it.drop||0)*n}}catch(e){}
  try{const B=tbOf(twTitOn());for(const k of ['dano','def','vel','crit','st'])S.tit[k]=B[k]||0}catch(e){}
  try{const P=psSum(id);S.ps.cd=P.cd;S.ps.def=P.def;S.ps.spd=P.spd;S.ps.reg=P.reg;S.ps.drop=P.drop;S.ps.st=P.st}catch(e){}
  try{const R=RKTB(rkLvl());S.rk.dano=R.dano;S.rk.def=R.def;S.rk.vel=R.vel;S.rk.crit=R.crit;S.rk.st=R.sorte}catch(e){}
  if(twIsAdm()){Object.assign(S.adm,{dano:60,def:60,vel:60,crit:60,uv:60,trf:60,st:60,drop:60})}
  try{const A=anSum(id);for(const k in A)if(k in S.an)S.an[k]=A[k]}catch(e){}
  const T=Z();for(const [s] of CBS)for(const [k] of CBK)T[k]+=(S[s]||{})[k]||0;for(const k in T)T[k]=Math.round(T[k]*100)/100;return {S,T}}
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
  <p>Vale no <b>Modo Boss</b> (rank, farm e evento do Yuta), na <b>Torre</b> e no <b>Modo Caça</b>. XP de rank, gemas das lutas, sorte e drop. Códigos não dobram.</p><div class="evBtns"><button class="btn main" data-e="boss">⚔️ IR PARA O MODO BOSS</button></div>`}}
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

/* ================= v270: MODO CAÇA (TESTE) — BESTA DE ALMA: LOBO NEGRO =================
   A besta é o G.p[1] criado como um lutador normal e depois "virado" besta (f.beast). Ela não usa ki/energia/especiais:
   só ataque físico (garradas, patada, bote no ar, pulo alto por cima). IA, física, desenho, caixa de dano e reações são próprios (bsStep/bsDraw).
   Quadros: RQA.lobo (ferramentas/bestas/lobo/). Cada quadro: [src, âncoraX, âncoraY(pés), escala]. Os quadros olham para a ESQUERDA. */
const BSI={};function bsImg(src){let i=BSI[src];if(!i){i=new Image();i.src=src;BSI[src]=i}return i}
function bsPre(){try{for(const k in RQA.lobo)if(k!=='por')for(const q of RQA.lobo[k])bsImg(q[0])}catch(e){}}
/* v271: lobo do tamanho de um lobo (ALT 160), bem mais rápido, AUTO COMBO do dono (16 quadros, folha 07_auto_combo) com dash veloz e rastro,
   aviso no olho antes do combo, BRECHA (ofegante, toma +30%) depois do combo ou se o começo errar, quadros novos de dano (folha 06_derrubado = 'cai'). */
const BSD={name:'LOBO NEGRO',hp:5,spd:17,grav:1.1};
const isBs=f=>!!(f&&f.beast);
function bsMake(f){const d=Object.assign({},f.def,{id:'lobo',name:BSD.name,cn:'BESTA DE ALMA · 1.000 ANOS',energy:'#ff2a3a',energy2:'#ffd0d0',fe:'#ff2a3a',fe2:'#ffd0d0',frame:'#ff2a3a',power:1});
  f.def=d;f.beast=1;f.mhp=BSD.hp*LAYER;f.hp=f.hpLag=f.mhp;f.ki=0;f.sb=0;f.tdm=1;f.tdf=1;f.tsp=1;f.state='idle';f.st=0;f.bs='idle';f.bt=0;f.bcd=50;f.bfx=[];f.btr=[];f.bCcd=90;f.bEye=0;f.bk=['garras',0];f.flying=false;
  try{if(!IMG.lobo){IMG.lobo=new Image();IMG.lobo.src=RQA.lobo.por}}catch(e){}bsPre()}
/* ---- física e IA ---- */
function bsSet(f,s){f.bs=s;f.bt=0;f.bHit=0}
function bsFace(f,o){if(o&&Math.abs(o.x-f.x)>10)f.facing=o.x>f.x?1:-1}
function bsLand(f){if(f.y>=FLOOR){f.y=FLOOR;f.vy=0;f.grounded=true;return true}return false}
function bsHitbox(f){const fw=f.facing,k=f.bSc||1;return (x0,x1,y0,y1)=>(x0*=k,x1*=k,y0*=k,y1*=k,{x:fw>0?f.x+x0:f.x-x1,y:f.y-y1,w:x1-x0,h:y1-y0})}
function bsTry(f,o,box,h){if(!o||o.ko||f.bHit>=(h.n||1))return false;const hb=hurtbox(o);if(!hb||!overlap(box,hb))return false;f.bHit++;
  const H=Object.assign({kind:'melee',px:o.x-f.facing*30,py:o.y-150},h);const ok=applyHit(f,o,H);
  if(ok){const real=o.state!=='blockstun';if(real)f.bCnt=(f.bCnt||0)+1;G.hitstop=Math.max(G.hitstop,h.hs2||6);G.shake=Math.max(G.shake,h.sh||7);try{SFX.slash();SFX.hit(1,h.T||1)}catch(e){}
    f.bfx.push({x:o.x,y:o.y-150,t:0,big:h.big?1:0,fw:f.facing,up:h.up?1:0});for(let i=0;i<12;i++)spark(o.x,o.y-150,i%3?'#b34dff':'#ffffff',1,rand(5,13));
    if(o.hp<=0)ko(f,o)}return ok}
function bsTrail(f){if(G.frame%2===0){f.btr.push({x:f.x,y:f.y,k:f.bk[0],i:f.bk[1],fw:f.facing,a:1});if(f.btr.length>7)f.btr.shift()}}
/* AUTO COMBO: [quadro, duração] por fase; a lógica de cada fase fica em bsCombo */
const BSC=[[0,11],[1,5],[2,3],[3,16],[4,4],[5,5],[6,4],[7,7],[8,5],[9,6],[10,30],[11,9],[12,3],[13,7],[14,8]];
function bsCombo(f,o,HB,dist){const P=f.bp,ph=BSC[P],t=f.bpt++,fw=f.facing;f.bk=['combo',ph[0]];f.state='attack';
  const next=()=>{f.bp++;f.bpt=0;f.bHit=0;if(f.bp>=BSC.length){bsSet(f,'tired');f.bp=0}};
  switch(P){
  case 0:{f.vx=0;bsFace(f,o);if(t===0){f.bEye=22;f.bCnt=0;G.shake=Math.max(G.shake,3)}break}               /* aviso: olho brilha */
  case 1:{f.vx=0;if(t===0)try{dust(f.x+f.facing*-40,FLOOR,5)}catch(e){}break}
  case 2:{f.vx=fw*22;bsTrail(f);if(t===0)try{SFX.zip();dust(f.x,FLOOR,10)}catch(e){}break}
  case 3:{f.vx=fw*31;bsTrail(f);bsTry(f,o,HB(-10,175,10,150),{dmg:70,kb:2,hs:14,n:1,T:1});if(f.bHit||dist<95||t>=ph[1]-1){f.vx*=.35;next();return}break}  /* dash veloz + mordida */
  case 4:{f.vx*=.5;break}
  case 5:{f.vx*=.5;if(t===0)try{SFX.whoosh()}catch(e){}bsTry(f,o,HB(-30,200,0,120),{dmg:60,kb:3,hs:14,n:1,T:1,low:1});
    if(t>=ph[1]-1&&!f.bCnt){bsSet(f,'tired');f.bp=0;f.bTd=46;return}break}                                  /* errou o começo -> BRECHA */
  case 6:{f.vx=0;bsFace(f,o);break}
  case 7:{f.vx=fw*3;if(t===0)try{SFX.whoosh()}catch(e){}bsTry(f,o,HB(-10,175,30,270),{dmg:90,kb:3,hs:18,launch:-17,n:1,T:2,up:1,sh:9});break}  /* garra pra cima: lança */
  case 8:{if(t===0){f.grounded=false;f.y-=2;f.vy=-21;f.vx=clamp((o.x-f.x)/16,-17,17);try{SFX.zip();dust(f.x,FLOOR,10)}catch(e){}}f.vy+=BSD.grav;f.y+=f.vy;bsTrail(f);break}
  case 9:{f.vy+=BSD.grav*.5;f.y+=f.vy;bsTrail(f);bsTry(f,o,HB(-30,185,-60,190),{dmg:60,kb:2,hs:12,launch:-8,n:1,T:1});break}            /* mordida no ar */
  case 10:{if(t===0){f.vy=24;f.vx=clamp((o.x-f.x)/9,-18,18);try{SFX.zip()}catch(e){}}f.y+=f.vy;f.vy+=.6;bsTrail(f);                     /* mergulho girando */
    bsTry(f,o,HB(-70,110,-40,170),{dmg:70,kb:3,hs:12,n:1,T:1});if(bsLand(f)){f.vx=0;next();return}break}
  case 11:{f.vx=0;if(t===0){G.shake=Math.max(G.shake,16);try{SFX.thud();SFX.boom();dust(f.x,FLOOR,20);ring(f.x,FLOOR-10,'#b34dff',170,16,5);ring(f.x,FLOOR-10,'#ffffff',110,12,3)}catch(e){}}
    if(t<4){f.bHit=0;bsTry(f,o,{x:f.x-190,y:f.y-120,w:380,h:120},{dmg:110,kb:10,hs:20,launch:-11,n:1,T:2,big:1,sh:14})}break}         /* pancada no chão (onda) */
  case 12:{bsFace(f,o);f.vx=fw*20;bsTrail(f);if(t===0)try{SFX.zip()}catch(e){}break}
  case 13:{f.vx=fw*32;bsTrail(f);if(t===0)try{SFX.whoosh()}catch(e){}bsTry(f,o,HB(-20,190,0,150),{dmg:80,kb:4,hs:14,n:1,T:1});if(dist<80&&f.bHit)f.vx*=.4;break}  /* dash cortando */
  case 14:{f.vx*=.55;if(t===2)try{SFX.whoosh()}catch(e){}if(t>=2)bsTry(f,o,HB(-10,215,0,210),{dmg:140,kb:13,hs:24,launch:-13,n:1,T:2,big:1,sh:16});break}   /* patada final */
  }
  f.x+=f.vx;if(f.x<60||f.x>WW-60){f.x=clamp(f.x,60,WW-60);f.vx=0}
  if(P!==3&&P!==10&&f.bpt>=ph[1])next()}
function bsStep(f,o){f.bt++;f.st++;if(f.flash>0)f.flash--;if(f.inv>0)f.inv--;if(f.bEye>0)f.bEye--;for(const q of f.bfx)q.t++;f.bfx=f.bfx.filter(q=>q.t<16);
  for(const q of f.btr)q.a-=.12;f.btr=f.btr.filter(q=>q.a>0);if(f.bs!=='tired')f.tdf=f.bDf||1;
  /* morte */
  if(f.ko){if(f.bs!=='dead'){bsSet(f,'dead')}f.vy+=BSD.grav;f.y+=f.vy;f.x+=f.vx;f.vx*=.92;if(bsLand(f)){f.vx*=.8;f.state='down'}f.x=clamp(f.x,60,WW-60);return}
  /* reações do motor (apanhou) */
  if(f.state==='lose')f.state='idle';
  if(!['idle','walk','attack','jump','win'].includes(f.state)){
    if(f.bs!=='hurt'){bsSet(f,'hurt');f.hurtT=0;f.bp=0}
    f.hurtT++;if(!f.grounded||f.state==='airhit'){f.vy+=BSD.grav;f.y+=f.vy;f.x+=f.vx;if(bsLand(f)){f.state='down';f.downT=0;f.hitstun=Math.max(f.hitstun||0,24);G.shake=Math.max(G.shake,6);try{dust(f.x,FLOOR,10)}catch(e){}}}
    else{f.x+=f.vx;f.vx*=.82;if(f.state==='down')f.downT=(f.downT||0)+1;f.hitstun=(f.hitstun||0)-1;
      if(f.hitstun<=0||f.hurtT>90){const wasDown=f.state==='down';f.state='idle';f.inv=Math.max(f.inv,10);
        /* levanta com raiva: às vezes já pula pra trás ou contra-ataca na hora */
        if(wasDown&&Math.random()<.5){bsSet(f,'back')}else{bsSet(f,'idle');f.bcd=3+((Math.random()*6)|0)}}}
    f.x=clamp(f.x,60,WW-60);return}
  if(G.phase==='ko'&&f.state==='win'){f.bs='win';return}
  if(G.phase!=='fight'){f.state='idle';if(f.bs!=='idle')bsSet(f,'idle');bsFace(f,o);f.vx=0;if(!f.grounded){f.vy+=BSD.grav;f.y+=f.vy;bsLand(f)}return}
  const dx=o.x-f.x,dist=Math.abs(dx),HB=bsHitbox(f),fw=f.facing,t=f.bt;
  if(f.bCcd>0&&f.bs!=='combo')f.bCcd--;
  switch(f.bs){
  case 'idle':{f.state='idle';f.vx*=.6;f.x+=f.vx;bsFace(f,o);if(!f.grounded||f.y<FLOOR){f.grounded=false;f.vy+=BSD.grav;f.y+=f.vy;bsLand(f);break}if(--f.bcd>0)break;bsThink(f,o,dist);break}
  case 'run':{f.state='walk';bsFace(f,o);f.vx=f.facing*BSD.spd;f.x+=f.vx;if(G.frame%5===0)try{dust(f.x-f.facing*50,FLOOR,3)}catch(e){}
    if(dist<200||t>60){f.vx*=.4;bsSet(f,'idle');f.bcd=0;f.bRun=1}break}
  /* rodeia: dá uns pulinhos de lado/trás como bicho, pra não ficar parado */
  case 'back':{f.state='jump';if(t===1){f.vy=-11;f.vx=-fw*13;f.grounded=false;try{SFX.whoosh()}catch(e){}}f.vy+=BSD.grav;f.y+=f.vy;f.x+=f.vx;if(t>3&&bsLand(f)){f.vx=0;bsSet(f,'idle');f.bcd=4+((Math.random()*10)|0)}break}
  case 'combo':{bsCombo(f,o,HB,dist);break}
  /* ofegante depois do combo: BRECHA, toma +30% */
  case 'tired':{f.state='idle';f.vx*=.7;f.x+=f.vx;f.bk=['combo',15];f.tdf=(f.bDf||1)*1.3;const T=f.bTd||38;
    if(t===1){txt(f.x,f.y-190,'BRECHA!','#ffd34a');f.bCcd=(200+((Math.random()*120)|0))*(f.bCdm||1)}
    if(t>=T){f.bTd=0;f.tdf=f.bDf||1;bsSet(f,'idle');f.bcd=2;bsFace(f,o)}break}
  /* garradas (2 golpes) */
  case 'a_claw':{f.state='attack';const T=[6,4,3,4,4,9],sum=a=>T.slice(0,a).reduce((x,y)=>x+y,0);
    if(t<sum(2))f.vx=0;else if(t<sum(4)){f.vx=fw*11}else f.vx*=.6;f.x+=f.vx;
    if(t===sum(2))try{SFX.whoosh()}catch(e){}
    if(t>=sum(3)&&t<sum(4))bsTry(f,o,HB(-10,185,10,165),{dmg:110,kb:3,hs:16,n:1,T:1});
    if(t>=sum(4)&&t<sum(5)){if(f.bHit<1)f.bHit=1;bsTry(f,o,HB(-10,200,0,190),{dmg:140,kb:9,hs:22,n:2,T:2,big:1,sh:11})}
    {const j=T.findIndex((_,i)=>t<sum(i+1));f.bk=['garras',j<0?5:j]}if(t>=sum(6)){bsSet(f,'idle');f.bcd=o.state==='hit'||o.state==='airhit'?1:6+((Math.random()*10)|0)}break}
  /* patada forte (derruba) */
  case 'a_swipe':{f.state='attack';const T=[5,4,4,3,4,9],sum=a=>T.slice(0,a).reduce((x,y)=>x+y,0);
    if(t>=sum(1)&&t<sum(3))f.vx=fw*9;else f.vx*=.6;f.x+=f.vx;if(t===sum(3)-1)try{SFX.whoosh()}catch(e){}
    if(t>=sum(3)&&t<sum(5))bsTry(f,o,HB(-10,195,0,150),{dmg:160,kb:12,hs:24,launch:-14,n:1,T:2,big:1,sh:13});
    f.bk=['patada',Math.max(0,T.findIndex((_,i)=>t<sum(i+1)))];if(t>=sum(6)){bsSet(f,'idle');f.bcd=6+((Math.random()*10)|0)}break}
  /* bote: agacha, salta alto em cima do inimigo, garras no ar, pouso com impacto */
  case 'a_pounce':{const C=f.bHigh?7:9;
    if(t<=C){f.state='attack';f.vx=0;f.bk=['pulo',t<C/2?0:1];if(t===C){f.grounded=false;f.y-=2;const T=f.bHigh?42:30;f.vy=f.bHigh?-26:-18;f.vx=clamp((o.x-f.x)/T,-22,22);try{SFX.zip();dust(f.x,FLOOR,12)}catch(e){}}break}
    f.state='jump';f.vy+=BSD.grav;f.y+=f.vy;f.x+=f.vx;bsTrail(f);if(f.bHigh&&f.vy>-4)bsFace(f,o);f.bk=['pulo',f.vy<-6?2:3];
    if(f.vy>-8)bsTry(f,o,HB(-30,170,-20,170),{dmg:170,kb:8,hs:22,launch:-12,n:1,T:2,big:1,sh:14});
    if(f.x<60||f.x>WW-60){f.x=clamp(f.x,60,WW-60);f.vx=0}
    if(bsLand(f)){G.shake=Math.max(G.shake,f.bHigh?12:8);try{SFX.thud();dust(f.x,FLOOR,14);ring(f.x,FLOOR-14,'#ffb0a0',110,14,4)}catch(e){}bsSet(f,'a_land');f.vx*=.3}break}
  case 'a_land':{f.state='attack';f.x+=f.vx;f.vx*=.7;f.bk=['pulo',t<5?4:5];if(t>=9){bsSet(f,'idle');bsFace(f,o);f.bcd=dist<220?0:4;f.bChain=dist<220}break}
  }
  f.x=clamp(f.x,60,WW-60);
  if(f.bs==='idle'||f.bs==='run')f.bk=f.bs==='run'?['anda',Math.floor(G.frame/2)%6]:['garras',0];
  if(f.bs==='back')f.bk=['pulo',4]}
function bsThink(f,o,dist){const r=Math.random(),oh=o.state==='hit'||o.state==='airhit'||o.state==='blockstun',cb=f.bCcd<=0;f.bHigh=0;
  const go=s=>{bsSet(f,s);if(s==='combo'){f.bp=0;f.bpt=0;f.bCcd=(240+((Math.random()*120)|0))*(f.bCdm||1)}};
  if(f.bChain&&dist<240){f.bChain=0;go(cb&&r<.45?'combo':r<.7?'a_claw':'a_swipe');return}
  if(dist>650){if(cb&&r<.3){go('combo');return}if(r<.55){go('a_pounce');return}go('run');return}
  if(dist>220){if(cb&&r<.42){go('combo');return}if(r<.6){go('a_pounce');return}if(r<.78){f.bHigh=1;go('a_pounce');return}if(r<.93){go('run');return}go('back');return}
  if(oh&&r<.7){go('a_claw');return}
  if(cb&&r<.3){go('combo');return}
  if(r<.45){go('a_claw');return}if(r<.72){go('a_swipe');return}if(r<.86){f.bHigh=1;go('a_pounce');return}go('back')}
/* ---- desenho ---- */
function bsFrame(f){if(f.bs==='dead')return ['cai',Math.min(5,2+Math.floor(f.bt/8))];
  if(f.bs==='hurt'){if(f.state==='down')return ['cai',(f.downT||0)<8?4:5];if(!f.grounded)return ['cai',f.vy<0?2:3];return ['cai',Math.floor(f.hurtT/5)%2]}
  if(f.bs==='win')return ['patada',0];return f.bk}
function bsPut(f,k,i,x,y,fw,al,fil){const L=RQA.lobo&&RQA.lobo[k];if(!L)return null;const q=L[Math.min(i,L.length-1)],im=bsImg(q[0]);if(!im.complete||!im.naturalWidth)return null;
  const s=q[3],w=im.naturalWidth*s,h=im.naturalHeight*s;ctx.save();ctx.globalAlpha=al;ctx.translate(x,y);ctx.scale(-fw*(q[4]?-1:1)*(f.bSc||1),f.bSc||1);if(fil)ctx.filter=fil;ctx.drawImage(im,-q[1]*s,-q[2]*s,w,h);ctx.restore();return {q,s,w,h}}
function bsDraw(f,reflect){const [k,i]=bsFrame(f);
  if(!reflect)for(const r of f.btr)bsPut(f,r.k,r.i,r.x,r.y,r.fw,r.a*.4,'brightness(.5) sepia(1) hue-rotate(225deg) saturate(5)');
  const br=f.bs==='idle'||f.bs==='tired'?1+Math.sin(G.frame*(f.bs==='tired'?.3:.14))*(f.bs==='tired'?.03:.015):1;
  const L=RQA.lobo&&RQA.lobo[k];if(!L)return;const q=L[Math.min(i,L.length-1)],im=bsImg(q[0]);if(!im.complete||!im.naturalWidth)return;
  const s=q[3],w=im.naturalWidth*s,h=im.naturalHeight*s;
  ctx.save();ctx.translate(f.x+(f.flash>0&&G.hitstop>0?(G.frame%2?3:-3):0),f.y);ctx.scale(-f.facing*(q[4]?-1:1)*(f.bSc||1),f.bSc||1);ctx.scale(1,br);
  if(f.flash>0&&!reflect)ctx.filter='brightness(2.6) saturate(.4)';
  ctx.drawImage(im,-q[1]*s,-q[2]*s,w,h);ctx.filter='none';
  if(!reflect&&!f.ko&&k!=='cai'){const ex=-q[1]*s+w*(q[4]?.86:.14),ey=-h*.66,eg=.5+.5*Math.sin(G.frame*.2),EL=f.bLv||1,R=f.bEye>0?70:EL>=7?34+EL*3:30;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=f.bEye>0?.9:EL>=7?.6+.3*eg:.22+.18*eg;
    const g=ctx.createRadialGradient(ex,ey,0,ex,ey,R);g.addColorStop(0,'rgba(255,60,80,.95)');g.addColorStop(1,'rgba(255,40,60,0)');ctx.fillStyle=g;ctx.fillRect(ex-R,ey-R,R*2,R*2);
    if(f.bEye>0||EL>=8){ctx.strokeStyle='rgba(255,230,230,.95)';ctx.lineWidth=f.bEye>0?3:2;const L2=f.bEye>0?20+f.bEye*2.2:14+EL*2+eg*8;ctx.beginPath();ctx.moveTo(ex-L2,ey);ctx.lineTo(ex+L2,ey);ctx.moveTo(ex,ey-L2*.45);ctx.lineTo(ex,ey+L2*.45);ctx.stroke()}}
  ctx.restore();
  if(reflect)return;
  /* rastros das garras (roxo, igual aos desenhos do combo) */
  for(const c of f.bfx){const u=c.t/16;ctx.save();ctx.translate(c.x,c.y);ctx.scale(c.fw,1);if(c.up)ctx.rotate(-1.1);ctx.globalAlpha=(1-u);ctx.lineCap='round';
    for(let j=0;j<(c.big?4:3);j++){ctx.strokeStyle=j%2?'#b34dff':'#ffffff';ctx.lineWidth=(c.big?11:7)*(1-u*.6);ctx.shadowColor='#b34dff';ctx.shadowBlur=16;ctx.beginPath();const oy=(j-1.5)*24;ctx.arc(-30,oy-40,100+u*30,Math.PI*.15,Math.PI*.55);ctx.stroke()}ctx.restore()}}
/* ---- ganchos no motor ---- */
{const _u=updFighter;updFighter=function(f,o){if(isBs(f)){f.bAcc=(f.bAcc||0)+bsSpd(f,o);let n=0;while(f.bAcc>=1&&n<3){bsStep(f,o);f.bAcc-=1;n++}return}return _u.apply(this,arguments)}}
{const _a=aiThink;aiThink=function(f,o){if(isBs(f)){for(const k in f.inp)f.inp[k]=0;return}return _a.apply(this,arguments)}}
{const _r=renderFighter;renderFighter=function(f,reflect){if(isBs(f))return bsDraw(f,reflect);return _r.apply(this,arguments)}}
{const _h=hurtbox;hurtbox=function(f){if(isBs(f)){if(f.ko)return null;if(f.bs==='rev')return null;const k=f.bSc||1;if(f.state==='down')return {x:f.x-115*k,y:f.y-80*k,w:230*k,h:80*k};return {x:f.x-105*k,y:f.y-205*k,w:210*k,h:200*k}}return _h.apply(this,arguments)}}
{const _c=drawCastShadow;drawCastShadow=function(f){if(isBs(f))return;return _c.apply(this,arguments)}}
{const _d=drawContact;drawContact=function(f){if(isBs(f)){const a=clamp(1-(FLOOR-f.y)/400,.2,1);ctx.save();ctx.globalAlpha=.45*a;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(f.x,FLOOR+4,115*a,15*a,0,0,TAU);ctx.fill();ctx.restore();return}return _d.apply(this,arguments)}}
{const _au=drawAura;drawAura=function(f){if(isBs(f))return;return _au.apply(this,arguments)}}
{const _k=spriteKey;spriteKey=function(f){if(isBs(f))return ['idle',0];return _k.apply(this,arguments)}}
{const _ib=drawIceBody;drawIceBody=function(f){if(isBs(f))return;return _ib.apply(this,arguments)}}
/* ---- início, fim ---- */
let CA={on:0};
function caStart(){rkInit();if(!SPR_OK)return;const sel=rkG('sel','goku');fsTry();CA={on:1};G.pick=sel;G.opp='goku';G.gmode='caca';RKB.diff0=G.diff;G.diff=3;
  const sk=Object.keys(STG).filter(k=>!STG[k].hid);G.nextStg=STG.flo?'flo':sk[(Math.random()*sk.length)|0];bsPre();
  const PM=prepMatch([G.pick,G.opp],G.nextStg);showVS(()=>PM.then(()=>{vsLoadEnd();startMatch()}),PM)}
{const _ap=rkApply;rkApply=function(){if(G.gmode==='caca'&&G.p){const [p,o]=G.p;p.tdm=(p.tdm||1)+twEqB('dano')/100;p.tsp=(p.tsp||1)+twEqB('vel')/100;p.tdf=1/(1/(p.tdf||1)+twEqB('vida')/100);{const q=twEqOn();p.tcr=0;for(const k in q)p.tcr+=q[k].crit||0}caPoc(p);
  bsMake(o);o.bLv=1;o.bPas=[];caLvApply(o);o.hp=o.hpLag=o.mhp;CA.lv=1;CA.pas=[];G.timer=180;return}return _ap.apply(this,arguments)}}
{const _rg=rkBossGo;rkBossGo=function(){if(G.gmode==='caca'&&G.p){if(G.tlim!==0)G.timer=180;banner('MODO CAÇA · TESTE','#ff2a3a',100,BSD.name+' · BESTA DE ALMA');return}return _rg.apply(this,arguments)}}
{const _er=endRound;endRound=function(){if(G.gmode==='caca'){caEnd(G.koWinner);return}return _er.apply(this,arguments)}}
function caEnd(w){const o=G.p&&G.p[1],won=!!(o&&o.ko&&(o.bLv||1)>=10),lv=(o&&o.bLv)||1,dft=won?10:lv-1,pas=((o&&o.bPas)||[]).map(k=>CAPS[k][0]);
  const rec=rkG('caRec',0);if(dft>rec)rkS('caRec',dft);
  G.mode='ranked';$('controls').hidden=true;$('pauseBtn').hidden=true;try{$('pcHud').hidden=true}catch(e){}rainSound(0);G.paused=false;G.diff=RKB.diff0;G.gmode='pve';CA.on=0;
  rkOpen('ca');CA.rs=1;const sh=()=>{if(!CA.rs||showScreen.cur!=='ranked'||!$('rkModal').hidden)return;rkModal(`<div class="twM ${won?'gold':''}"><h3>${won?'👑 VOCÊ CAÇOU O REI DA FLORESTA!':dft?'🐺 VOCÊ DERROTOU O LOBO '+dft+'X':'💀 O LOBO NEGRO VENCEU'}</h3><p class="twH">Chegou no <b>NÍVEL ${lv} de 10</b>${dft>rec?' · <b style="color:#ffd34a">NOVO RECORDE!</b>':''}</p>${pas.length?'<p class="twH">Passivas que o lobo ganhou: '+pas.join(' · ')+'</p>':''}<div class="row"><button class="btn main" id="caAg">⚔️ CAÇAR DE NOVO</button><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>{CA.rs=0;rkModal(null)};$('caAg').onclick=()=>{CA.rs=0;rkModal(null);caStart()}};for(const t of [300,1800,3500,6000])setTimeout(sh,t)}

/* ================= v273: MENU PRINCIPAL novo (arte do dono) =================
   BATALHA AVENTURA = entra no modo Ranqueado (Modos de Jogo) · Batalha Treino = luta normal (escolher lutadores) · História = em breve · Configuração.
   O Online saiu (já existe na ranqueada) e o Perfil foi para dentro do Modos de Jogo (botão "Perfil" na barra de baixo). */
(function(){try{const mm=$('mm');if(!mm)return;mm.classList.add('mm273');for(const id of ['mPerfil','mOnline','mTorre'])if($(id))$(id).hidden=true;
  const sw=c=>`<span class="mSw ${c}"></span>`;$('mRank').insertAdjacentHTML('beforeend',sw('o')+'<i class="mmSpk"></i>');$('goSelect').insertAdjacentHTML('beforeend',sw('b'));$('mCfg').insertAdjacentHTML('beforeend',sw('b'));
  const P=(x,y)=>`left:${x/18.47}%;top:${y/8.51}%`,R=(a,b)=>a+Math.random()*(b-a);let h='<div class="mmfx2">';
  h+=`<i class="mDoor" style="${P(1015,318)}"></i><i class="mNar" style="${P(1330,470)}"></i><i class="mRen" style="${P(980,560)}"></i><i class="mWall"></i><i class="mPlan" style="${P(860,40)}"></i>`;
  for(let i=0;i<20;i++)h+=`<i class="mEmb" style="${P(R(880,1480),R(330,800))};animation-delay:${R(0,6).toFixed(2)}s;animation-duration:${R(3,5.5).toFixed(2)}s"></i>`;
  for(let i=0;i<10;i++)h+=`<i class="mStar" style="${P(R(90,620),R(110,190))};animation-delay:${R(0,4).toFixed(2)}s"></i>`;
  mm.insertAdjacentHTML('beforeend',h+'</div>')}catch(e){}})();

/* ================= v274: CAÇA AO MONSTRO — tela do modo + LOBO com 10 NÍVEIS =================
   Cada vez que o lobo é derrotado (até o nível 10) ele cai, junta energia, a floresta se destrói mais, e ele levanta com um UIVO:
   vida cheia de novo, mais vida/força/defesa/velocidade, maior, aura mais forte e uma PASSIVA nova (sorteada, sem repetir). Nível 10 derrotado = vitória. */
const CALV={hp:[3,3.5,4,4.5,5,6,7,8,9,10],dm:[.6,.75,.9,1.05,1.2,1.4,1.6,1.85,2.1,2.4],df:[1,.9,.82,.74,.66,.58,.4,.31,.24,.17],sp:[1,1,1.05,1.1,1.16,1.22,1.28,1.35,1.42,1.5],cd:[1.3,1.2,1.1,1,.9,.8,.7,.6,.5,.45]};
const CAPS={reg:['🩸 REGENERAÇÃO','recupera vida sozinho'],def:['🛡️ COURO DE AÇO','toma 15% menos dano'],cri:['🗡️ PRESAS CRÍTICAS','+15% de crítico'],lif:['🧛 SEDE DE SANGUE','rouba 15% do dano que causa'],arm:['🌑 COURAÇA SOMBRIA','não para no dash nem no bote'],vel:['⚡ INSTINTO SELVAGEM','+10% de velocidade'],frc:['🔥 FÚRIA LUPINA','+15% de dano'],cmb:['🌀 CAÇADOR INCANSÁVEL','auto combo volta 2x mais rápido'],esq:['💨 ESQUIVA ANIMAL','12% de chance de desviar']};
const CASC=[0,1,1,2,2,3,3,4,4,4];
const CARING=[['#eef0ff','BRANCO','100 anos'],['#ffc928','AMARELO','1.000 anos'],['#c27aff','ROXO','10.000 anos'],['#b9b2c8','PRETO','25 a 75 mil anos'],['#ff3b4a','VERMELHO','100.000 anos']];
const CACOL=['','170,70,255','190,60,255','255,50,90','255,40,60','255,30,40','255,20,30','230,10,20','200,0,20','150,0,30'];
const cHex=c=>'#'+c.split(',').map(v=>(+v).toString(16).padStart(2,'0')).join('');
function caLvApply(f){const i=f.bLv-1,P=f.bPas||[],has=k=>P.includes(k);
  f.mhp=CALV.hp[i]*LAYER;f.tdm=CALV.dm[i]*(has('frc')?1.15:1);f.bDf=CALV.df[i]*(has('def')?.85:1);f.tdf=f.bDf;f.bsp=CALV.sp[i]*(has('vel')?1.1:1);f.tcr=has('cri')?15:0;f.bSc=1+.028*i;f.bCdm=CALV.cd[i]*(has('cmb')?.5:1);
  f.def=Object.assign({},f.def,{name:BSD.name+' · NV '+f.bLv})}
function caLvUp(a,d){if(d.bs==='rev')return;d.hp=0;d.hpLag=0;d.inv=999;d.bs='rev';d.bt=0;d.bRt=0;d.bp=0;d.bfx=[];d.btr=[];d.bA=a;d.vy=d.grounded?-9:d.vy;d.vx=(a.facing||1)*7;d.grounded=false;d.state='idle';
  G.slow=Math.max(G.slow||0,50);G.hitstop=Math.max(G.hitstop,16);G.shake=Math.max(G.shake,14);try{SFX.ko()}catch(e){}banner('NÍVEL '+d.bLv+' DERROTADO!','#ffd34a',70,'...ele ainda não morreu')}
function caRevStep(f,o){const t=++f.bRt;f.st++;if(f.flash>0)f.flash--;f.inv=999;
  if(!f.grounded){f.vy+=BSD.grav;f.y+=f.vy;f.x+=f.vx;f.vx*=.97;if(bsLand(f)){f.vx=0;G.shake=Math.max(G.shake,8);try{dust(f.x,FLOOR,14)}catch(e){}}}
  f.x=clamp(f.x,90,WW-90);
  if(t===45){/* escolhe a passiva e sobe o nível */const pool=Object.keys(CAPS).filter(k=>!(f.bPas||[]).includes(k));const k=pool[(Math.random()*pool.length)|0];f.bPas=[...(f.bPas||[]),k];f.bNew=k;f.bLv++;caLvApply(f);CA.lv=f.bLv;
    const sc=CASC[f.bLv-1];try{if(STAGE.dn&&sc>DN.lv)dnBreak(sc)}catch(e){}}
  if(t>45&&t<=115){f.hp=f.hpLag=f.mhp*(t-45)/70;if(t%3===0)for(let i=0;i<2;i++){const an=Math.random()*TAU,r=rand(160,320);caEmb(f,f.x+Math.cos(an)*r,f.y-70+Math.sin(an)*r*.6,(f.x-(f.x+Math.cos(an)*r))/22,(f.y-70-(f.y-70+Math.sin(an)*r*.6))/22,26,1)}if(t%20===0)G.shake=Math.max(G.shake,4)}
  if(t===115){f.bEye=40}
  if(t===128){const A=f.bA||o,c=caCol(f.bLv).join(',');G.flash=12;G.flashCol=cHex(c);G.shake=34;G.hitstop=Math.max(G.hitstop,10);
    for(const r of [420,280,150])ring(f.x,f.y-80,r===150?'#ffffff':cHex(c),r,30,8);for(let i=0;i<50;i++)spark(f.x,f.y-80,i%3?cHex(c):'#ffffff',1,rand(6,18));try{flashL(f.x,f.y-80,cHex(c),700,1,30);SFX.transform();SFX.boom();dust(f.x,FLOOR,24)}catch(e){}buzz(200);
    if(A&&!A.ko){const dir=Math.sign(A.x-f.x)||1;if(Math.abs(A.x-f.x)<520){A.vx=dir*15;A.vy=-6;A.grounded=false;A.state='airhit';A.hitstun=18}A.hp=Math.min(MAXHP,A.hp+MAXHP*.1);try{txt(A.x,A.y-260,'+10% VIDA','#7dff9a')}catch(e){}}
    const P=CAPS[f.bNew]||['',''];banner('NÍVEL '+f.bLv+(f.bLv>=10?' · REI DA FLORESTA':''),cHex(c),140,'NOVA PASSIVA: '+P[0]+' — '+P[1]);G.timer=180}
  if(t>=160){f.bs='idle';f.bt=0;f.state='idle';f.inv=24;f.bcd=6;f.bCcd=Math.min(f.bCcd||0,40);f.hp=f.hpLag=f.mhp;bsFace(f,o)}}
function caEmb(f,x,y,vx,vy,l,g){(f.bEm=f.bEm||[]).push({x,y,vx,vy,l,m:l,g})}
{const _bs=bsStep;bsStep=function(f,o){if(f.bs==='rev')return caRevStep(f,o);
  if(G.gmode==='caca'&&!f.ko&&G.phase==='fight'&&f.hp>0&&f.hp<f.mhp&&(f.bPas||[]).includes('reg'))f.hp=Math.min(f.mhp,f.hp+f.mhp*.0045/60);
  return _bs.apply(this,arguments)}}
{const _t=bsTry;bsTry=function(f,o,box,h){const hp0=o.hp,r=_t.apply(this,arguments);if(r&&(f.bPas||[]).includes('lif')&&o.hp<hp0&&!f.ko)f.hp=Math.min(f.mhp,f.hp+(hp0-o.hp)*.15);return r}}
{const _ah=applyHit;applyHit=function(a,d,h){if(isBs(d)&&G.gmode==='caca'){if(d.bs==='rev')return false;const P=d.bPas||[];
    if(P.includes('esq')&&!h.lock&&!d.ko&&!(d.inv>0)&&Math.random()<.12){d.inv=24;try{txt(d.x,d.y-200,'ESQUIVOU!','#d9b3ff');SFX.whoosh()}catch(e){}if(d.grounded&&d.bs!=='combo')bsSet(d,'back');return false}
    if(P.includes('arm')&&((d.bs==='combo'&&[2,3,8,9,10,12,13].includes(d.bp))||(d.bs==='a_pounce'&&!d.grounded))){const K={state:d.state,bs:d.bs,bp:d.bp,bpt:d.bpt,bt:d.bt,vx:d.vx,vy:d.vy,grounded:d.grounded,y:d.y,x:d.x};const r=_ah.apply(this,arguments);if(r&&!d.ko&&d.bs!=='rev'){Object.assign(d,K);d.hitstun=0;try{spark(d.x,d.y-90,'#b34dff',1,8)}catch(e){}}return r}}
  return _ah.apply(this,arguments)}}
{const _ko=ko;ko=function(a,d){if(G.gmode==='caca'&&isBs(d)){if(d.bs==='rev')return;if(G.phase==='fight'&&(d.bLv||1)<10){caLvUp(a,d);return}}return _ko.apply(this,arguments)}}
/* desenho: aura por nível, brasas, energia voltando */
{const _f=bsFrame;bsFrame=function(f){if(f.bs==='rev'){const t=f.bRt;if(!f.grounded)return ['cai',f.vy<0?2:3];if(t<115)return ['cai',t<60?4:5];return ['combo',t<128?1:0]}return _f.apply(this,arguments)}}
function bsSpd(f,o){const lv=f.bLv||1,adv=lv>=7?[1.15,1.2,1.25,1.3][lv-7]:1,ps=G.gmode==='caca'&&o?Math.max(1,o.tsp||1):1;return Math.max(.85,(f.bsp||1)*adv/ps)}
function caCol(lv){const u=(lv-1)/9,A=[70,170,255],M=[170,80,255],B=[255,25,40],m=(x,y,k)=>Math.round(x+(y-x)*k);return u<.5?A.map((v,i)=>m(v,M[i],u*2)):M.map((v,i)=>m(v,B[i],(u-.5)*2))}
function caBolts(f){const lv=f.bLv||1,k=f.bSc||1,n=1+Math.floor(lv*1.4),cx=f.x,cy=f.y-75*k,B=[];
  for(let i=0;i<n;i++){if(Math.random()<.25)continue;const an=Math.random()*TAU,rx=105*k,ry=58*k;let x=cx+Math.cos(an)*rx*rand(.3,.9),y=cy+Math.sin(an)*ry*rand(.3,.9);const dir=an+rand(-.9,.9),P=[[x,y]],seg=4+((Math.random()*3)|0),L=(10+lv*1.6)*k;
    for(let j=0;j<seg;j++){const d=dir+rand(-1,1);x+=Math.cos(d)*L*rand(.6,1.3);y+=Math.sin(d)*L*rand(.6,1.3);P.push([x,y])}B.push({P,w:rand(.7,1.2)*(1+lv*.08)})}
  return B}
const CA_RAIOS=0;
function caAura(f,top){if(G.gmode!=='caca')return;const lv=f.bLv||1,run=G.hitstop<=0&&!G.paused;
  if(!top)return;
  /* v276: o dono pediu para TIRAR os raios (CA_RAIOS=0); os olhos vermelhos continuam */
  if(CA_RAIOS&&(!f.ko&&f.bs!=='rev'||f.bs==='rev'&&f.bRt>115)){if(run&&(G.frame%3===0||!f.bBo))f.bBo=caBolts(f);const C=caCol(lv),c=C.join(',');ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
    for(const b of f.bBo||[]){ctx.beginPath();ctx.moveTo(b.P[0][0],b.P[0][1]);for(let j=1;j<b.P.length;j++)ctx.lineTo(b.P[j][0],b.P[j][1]);
      ctx.globalAlpha=.4;ctx.strokeStyle=`rgb(${c})`;ctx.lineWidth=6*b.w;ctx.stroke();ctx.globalAlpha=.95;ctx.strokeStyle=`rgb(${c})`;ctx.lineWidth=2.4*b.w;ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=1*b.w;ctx.stroke()}
    if(lv>=5){const k=f.bSc||1,R=(80+lv*6)*k,cy=f.y-75*k,p=.5+.5*Math.sin(G.frame*.25);ctx.globalAlpha=(.05+.012*lv)*p;const g=ctx.createRadialGradient(f.x,cy,0,f.x,cy,R);g.addColorStop(0,`rgba(${c},.9)`);g.addColorStop(1,`rgba(${c},0)`);ctx.fillStyle=g;ctx.fillRect(f.x-R,cy-R,R*2,R*2)}
    ctx.restore()}
  const L=f.bEm||[];if(!L.length)return;ctx.save();ctx.globalCompositeOperation='lighter';
  for(const e of L){if(run){e.x+=e.vx;e.y+=e.vy;e.l--}const a=Math.max(0,Math.min(1,e.l/e.m*1.6));ctx.globalAlpha=a;const r=4.5;const g=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,r*3);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(200,80,255,.9)');g.addColorStop(1,'rgba(200,80,255,0)');ctx.fillStyle=g;ctx.fillRect(e.x-r*3,e.y-r*3,r*6,r*6)}
  ctx.restore();f.bEm=L.filter(e=>e.l>0)}
{const _d=bsDraw;bsDraw=function(f,reflect){if(!reflect)caAura(f,0);_d.apply(this,arguments);if(!reflect)caAura(f,1)}}
/* ---- tela "Caça ao Monstro" ---- */
function caH(){const rec=rkG('caRec',0),P=(x,y)=>`left:${x/16.72}%;top:${y/9.41}%`,R=(a,b)=>a+Math.random()*(b-a);
  let fx='<div class="mfx"><i class="fog f1"></i><i class="fog f2"></i><i class="fog f3"></i><i class="mMoon" style="'+P(520,52)+'"></i><i class="mFl"></i>';
  for(const [x,y,c] of [[466,492,'r'],[528,490,'r'],[942,350,'v'],[1062,262,'v'],[1120,398,'v'],[226,262,'r']])fx+=`<i class="mEye ${c}" style="${P(x,y)};animation-delay:${R(0,2).toFixed(2)}s"></i>`;
  for(let i=0;i<24;i++)fx+=`<i class="mFf" style="${P(R(320,1660),R(120,930))};animation-delay:${R(0,8).toFixed(2)}s;animation-duration:${R(6,11).toFixed(2)}s"></i>`;fx+='</div>';
  return `${fx}<button class="hs" data-a="back" style="${rkB2(0,0,160,75)}"></button>
  <button class="hs caSl" data-a="caInfo" style="${rkB2(25,205,360,345)}"><b class="caSlT">LOBO NEGRO</b><b class="caSlI">?</b></button>
  ${[365,480,595,710].map(y=>`<button class="hs" data-a="caLk" style="${rkB2(40,y,300,y+105)}"></button>`).join('')}
  <button class="hs caStg" data-a="caStg" style="${rkB2(1145,190,1650,465)}"><b>FLORESTA SOMBRIA</b></button>
  ${CARING.map((r,i)=>{const x=[1100,1208,1318,1428,1530][i];return `<button class="hs caRg" data-a="caRing" data-i="${i}" style="${rkB2(x,535,x+110,662)}"></button><b class="caRgT" style="${rkB2(x-14,660,x+124,694)};color:${r[0]}">${r[2]}</b>`}).join('')}
  <button class="hs caGo" data-a="caGo" style="${rkB2(1140,750,1595,875)}"><span class="mSw"></span></button>
  <div class="caBar" style="${rkB2(370,884,1070,932)}">🐺 LOBO NEGRO · 10 NÍVEIS · RECORDE: <b>${rec?(rec>=10?'👑 CAÇOU OS 10':'DERROTOU '+rec+'X'):'—'}</b></div>`}
function caInfo(){rkModal(`<div class="twM"><h3>🐺 LOBO NEGRO · 10 NÍVEIS</h3><p class="twH">Cada vez que você derruba o lobo, ele <b>levanta de novo</b> com a vida cheia: mais forte, mais rápido, mais resistente, maior e com uma <b>passiva nova</b>. A floresta vai sendo destruída a cada nível. Você ganha +10% de vida a cada nível que vence.</p>
  <p class="twH">Passivas que ele pode ganhar: ${Object.values(CAPS).map(p=>p[0]).join(' · ')}</p><p class="twH">Derrote o NÍVEL 10 para caçar o Rei da Floresta.<br>💍 Cada nível derrotado pode soltar um ANEL: branco em qualquer nível, amarelo do nível 3, roxo do 5, preto do 7 (50 mil anos ou mais só no 9 e 10) e vermelho só no 9 e 10. Nota E até SSS (S, SS e SSS são raríssimas).</p><div class="row"><button class="btn main" id="rkMX">ENTENDI</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}

/* v275: VS do modo caça mostra o LOBO NEGRO em pé (foto do dono) no lugar do adversário usado por baixo (Goku) */
{const _sv=showVS;showVS=function(cb,PM){const r=_sv.apply(this,arguments);if(G.gmode==='caca'){try{$('vs2').src=RQA.lobo.vs;$('vsn2').textContent=BSD.name;$('vs').style.setProperty('--c2','#ff2a3a')}catch(e){}}return r}}

/* ================= v277: ANÉIS DO PODER (inspirado em Soul Land) =================
   Aba "Anéis" na Biblioteca (arte do dono `RQA.aneis`). 8 vagas por personagem: abre 1 a cada 10 níveis do personagem (nv10=1 ... nv80=8; hoje o máximo é nv50 mítico).
   Anel = cor/idade (ANC) + atributo sorteado (ANS) + nota E..SSS (ANG, pesos ANW) → valor ANV[cor][nota]. Dados: rk_an (lista), rk_anEq {personagem:[8 ids]}.
   Os anéis equipados giram/flutuam em volta do corpo do personagem (metade de trás atrás do corpo, metade da frente na frente).
   Bônus valem no Boss, Torre e Caça (rkApply) e aparecem no "TUDO" da Biblioteca (coluna ANÉIS). Drop: só do LOBO NEGRO (modo Caça), por nível derrotado. */
const ANC=[['BRANCO','#eef0ff','100 anos'],['AMARELO','#ffc928','1.000 anos'],['ROXO','#c27aff','10.000 anos'],['PRETO','#8a6fc0','25.000 a 75.000 anos'],['VERMELHO','#ff3b4a','100.000 anos']];
const ANG=['E','D','C','B','A','S','SS','SSS'],ANW=[30,20,12,10,9,8,7,4]; /* v294: notas do dono */
const ANV=[[1,2,3,4,5,7,10,15],[3,5,7,9,12,16,22,30],[6,9,13,17,22,30,40,55],[12,18,25,33,42,55,75,100],[25,35,50,65,85,110,150,200]];
const ANS=[['dano','⚔️ Dano','%'],['crit','🎯 Crítico','%'],['vel','💨 Velocidade','%'],['st','🍀 Sorte',''],['drop','🎁 Drop','%'],['uv','✨ Vel. Ultimate','%']];
const ANFL=['TODOS','BRANCO','AMARELO','ROXO','PRETO','VERMELHO'];
const AN={pg:0,f:0,q:'',ch:null,sel:null};
const anL=()=>rkG('an',[]),anEqAll=()=>rkG('anEq',{}),anEq=id=>{const e=(anEqAll()[id]||[]).slice(0,8);while(e.length<8)e.push(null);return e};
const anSlots=id=>Math.min(8,Math.floor(lvOf(id).lv/10));
const anAge=r=>r.c===3||(r.c===4&&r.a)?(r.a||25000).toLocaleString('pt-BR')+' anos':ANC[r.c][2];
const anSt=k=>ANS.find(x=>x[0]===k)||ANS[0];
const anTxt=r=>{const S=anSt(r.s);return S[1]+' +'+anV(r)+S[2]};
function anSum(id){const o={dano:0,crit:0,vel:0,st:0,drop:0,uv:0};const L=anL(),E=anEq(id);for(const i of E){if(!i)continue;const r=L.find(x=>x.i===i);if(r)o[r.s]+=anV(r)}for(const k in o)o[k]=Math.round(o[k]*10)/10;return o}
function anWho(r){const A=anEqAll();for(const id in A)if((A[id]||[]).includes(r.i))return id;return null}
/* sorteio de um anel */
function anRoll(c,lv){let q=Math.random()*100,g=0;for(let i=0;i<8;i++){if((q-=ANW[i])<0){g=i;break}}const s=ANS[(Math.random()*ANS.length)|0][0];
  const a=c===3?(lv>=9?50000+((Math.random()*25001)|0):25000+((Math.random()*25000)|0)):0;return {i:Date.now().toString(36)+Math.random().toString(36).slice(2,6),c,g,s,v:ANV[c][g],a}}
function anGive(r){const L=anL();L.push(r);rkS('an',L);return r}
/* drop do Lobo Negro: L = nível que acabou de ser derrotado */
function anDropLobo(L){const ch=[.25,.3,.35,.4,.45,.5,.55,.6,.7,.8][L-1]*Math.min(4,lvLuck());if(Math.random()>=Math.min(.95,ch))return null;
  const W=[[0,70],[1,L>=3?25:0],[2,L>=5?6:0],[3,L>=7?(L>=9?1.6:.8):0],[4,L>=9?(L>=10?.35:.15):0]];let t=W.reduce((a,x)=>a+x[1],0),c=0;for(let n=0;n<=lkK();n++){let q=Math.random()*t,cc=0;for(const [k,w] of W){if((q-=w)<0){cc=k;break}}if(cc>c)c=cc}
  return anGive(anRoll(c,L))}
/* tela */
function anH(){const id=AN.ch&&(rkG('own',['goku']).includes(AN.ch))?AN.ch:(AN.ch=rkG('sel','goku'));const E=anEq(id),n=anSlots(id),L=anL(),lv=lvOf(id).lv,T=anSum(id),SP=[[583,163],[720,232],[775,352],[720,477],[583,532],[445,477],[390,352],[445,232]];
  const tabs=[['chr',138,212],['an',225,298],['eq',310,383],['it',395,468],['col',482,555]].map(([t,a,b])=>`<button class="hs tab ${t==='an'?'on':''}" data-a="tab" data-t="${t}" style="${rkB(10,a,278,b)}"></button>`).join('');
  const slots=SP.map(([x,y],i)=>{const r=E[i]&&L.find(z=>z.i===E[i]);return `<button class="hs anSl ${i<n?'':'lk'} ${r?'on':''}" data-a="anSlot" data-i="${i}" style="${rkB(x-42,y-40,x+42,y+40)};${r?'--c:'+ANC[r.c][1]:''}">${r?`<img src="${RQA.anel2[r.c]}" alt=""><b>${ANG[r.g]}</b>`:i<n?'<i>+</i>':`<i>🔒</i><small>NV ${(i+1)*10}</small>`}</button>`}).join('');
  const eqR=E.map(x=>x&&L.find(z=>z.i===x)).filter(Boolean);
  const rings=eqR.map((r,k)=>{const y=488-k*40,w=230+k*3;return `<i class="anR b" style="${rkB(583-w/2,y-36,583+w/2,y+36)};animation-delay:${(k*.37).toFixed(2)}s"><img src="${RQA.anel2[r.c]}" alt=""></i><i class="anR f" style="${rkB(583-w/2,y-36,583+w/2,y+36)};animation-delay:${(k*.37).toFixed(2)}s"><img src="${RQA.anel2[r.c]}" alt=""></i>`}).join('');
  const nx=n>=8?'TODAS AS VAGAS ABERTAS':'PRÓXIMA VAGA NO NÍVEL '+(n+1)*10;
  return `<button class="hs" data-a="back" style="${rkB(18,8,145,75)}"></button><button class="hs" data-a="home" style="${rkB(1735,5,1842,75)}"></button>${tabs}
  <div class="anPed" style="${rkB(475,205,690,505)}"><img class="anCh" src="${fullSrc(id)}" alt=""></div>${rings}${slots}
  ${[['dano',235],['crit',281],['vel',326],['st',371],['uv',416]].map(([k,y])=>`<b class="anV" style="${rkB(985,y,1095,y+30)}">+${cbN(T[k])}${k==='st'?'':'%'}</b>`).join('')}
  <div class="anBx" style="${rkB(852,505,1098,590)}"><span>🎁 Drop +${cbN(T.drop)}%</span><span>💍 ${eqR.length}/${n} anéis · ${n}/8 vagas</span></div>
  <div class="anNm" style="${rkB(420,638,745,690)}">${twEsc(CH[id]?CH[id].name:id)}</div>
  <div class="anBar" style="${rkB(280,716,862,748)}"><i style="width:${n>=8?100:(lv%10)*10}%"></i><span>NÍVEL ${lv} · ${nx}</span></div>
  <input class="rkSrch anSrch" id="anSrch" placeholder="Buscar anel..." autocomplete="off" value="${twEsc(AN.q)}" style="${rkB(1255,100,1655,148)}"><button class="hs" data-a="anFilt" style="${rkB(1685,98,1765,152)}"><span class="rkFl" id="anFl">${ANFL[AN.f]}</span></button>
  <div id="anGrid"></div><button class="hs" data-a="anUp" style="${rkB(1778,180,1822,228)}"></button><button class="hs" data-a="anDn" style="${rkB(1778,708,1822,756)}"></button>`}
function anItems(){const q=AN.q.toLowerCase();return anL().filter(r=>(AN.f===0||r.c===AN.f-1)&&(!q||(ANC[r.c][0]+' '+anSt(r.s)[1]+' '+ANG[r.g]).toLowerCase().includes(q))).sort((a,b)=>b.c-a.c||b.g-a.g||b.v-a.v)}
function anGrid(){const G0=$('anGrid');if(!G0)return;const L=anItems(),pages=Math.max(1,Math.ceil(L.length/16));AN.pg=Math.min(AN.pg,pages-1);const X=[1160,1318,1473,1626],Y=[180,325,472,618];
  G0.innerHTML=L.length?L.slice(AN.pg*16,AN.pg*16+16).map((r,i)=>{const w=anWho(r);return `<button class="anCell" data-i="${r.i}" style="${rkB(X[i%4],Y[(i/4)|0],X[i%4]+142,Y[(i/4)|0]+130)};--c:${ANC[r.c][1]}"><img src="${RQA.anel2[r.c]}" alt=""><b class="g g${r.g}">${ANG[r.g]}</b><span>${anSt(r.s)[1].split(' ')[0]} +${anV(r)}${anSt(r.s)[2]}</span><i class="anLv">Nv ${anLvl(r)}/${ANMX[r.c]}</i>${w?`<em>${w===AN.ch?'EM USO':'✔ '+twEsc((CH[w]||{}).name||w)}</em>`:''}</button>`}).join('')+(pages>1?`<div class="rkPg" style="${rkB(1776,450,1824,480)}">${AN.pg+1}/${pages}</div>`:'')
    :`<div class="anVz" style="${rkB(1160,330,1765,470)}">Você ainda não tem anéis.<br>Eles caem do <b>LOBO NEGRO</b> no modo Caça.</div>`;
  G0.querySelectorAll('.anCell').forEach(b=>b.onclick=()=>{const r=anL().find(x=>x.i===b.dataset.i);if(r){rkSfx('whoosh');anInfo(r)}})}
function anOn(){const S=$('anSrch');if(S)S.oninput=()=>{AN.q=S.value;AN.pg=0;anGrid()};anGrid()}
function anCard(r){return `<div class="anCard" style="--c:${ANC[r.c][1]}"><img src="${RQA.anel2[r.c]}" alt=""><div><b>ANEL ${ANC[r.c][0]} · ${anAge(r)}</b><span>Nota <b class="g g${r.g}">${ANG[r.g]}</b> · Nível ${anLvl(r)}/${ANMX[r.c]} · ${anTxt(r)}</span></div></div>`}
function anInfo(r){const id=AN.ch,E=anEq(id),n=anSlots(id),w=anWho(r),free=E.slice(0,n).indexOf(null);
  rkModal(`<div class="twM">${anCard(r)}${w?`<p class="twH">Equipado em ${twEsc((CH[w]||{}).name||w)}.</p>`:''}<div class="row">${w===id?'<button class="btn main" id="anOut">TIRAR</button>':`<button class="btn main" id="anIn">${w?'TRAZER PARA ':'EQUIPAR EM '}${twEsc((CH[id]||{}).name||id)}</button>`}<button class="btn main" id="anUp">⬆️ EVOLUIR</button><button class="btn" id="anDel">🗑️ JOGAR FORA</button><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('anUp').onclick=()=>anUpM(r.i);
  if($('anOut'))$('anOut').onclick=()=>{anPut(id,E.indexOf(r.i),null);rkModal(null)};
  if($('anIn'))$('anIn').onclick=()=>{if(!n){rkSfx('clang');return rkToast('🔒 A 1ª vaga abre no nível 10 do personagem','#d9b3ff')}if(free<0){rkSfx('clang');return rkToast('Todas as '+n+' vagas estão ocupadas: tire um anel primeiro','#ffb0b0')}if(w)anPut(w,anEq(w).indexOf(r.i),null);anPut(id,free,r.i);rkModal(null)};
  $('anDel').onclick=()=>{rkModal(`<div class="twM sm"><h3>JOGAR FORA?</h3>${anCard(r)}<p class="twH">O anel some para sempre.</p><div class="row"><button class="btn" id="rkMX">NÃO</button><button class="btn main" id="anOk">JOGAR FORA</button></div></div>`);$('rkMX').onclick=()=>rkModal(null);
    $('anOk').onclick=()=>{const w2=anWho(r);if(w2)anPut(w2,anEq(w2).indexOf(r.i),null,1);rkS('an',anL().filter(x=>x.i!==r.i));rkModal(null);rkView('lib');rkToast('Anel jogado fora','#cfd6ea')}}}
function anPut(id,slot,ring,quiet){if(slot<0)return;const A=anEqAll(),E=anEq(id);E[slot]=ring;A[id]=E;rkS('anEq',A);if(!quiet){rkSfx(ring?'powerUp':'whoosh');rkView('lib');rkToast(ring?'💍 Anel equipado!':'Anel guardado','#7dff9a')}}
function anSlot(i){const id=AN.ch,n=anSlots(id),E=anEq(id);if(i>=n){rkSfx('clang');return rkToast('🔒 Essa vaga abre no nível '+(i+1)*10+' do personagem','#d9b3ff')}
  const r=E[i]&&anL().find(x=>x.i===E[i]);if(r)return anInfo(r);
  const free=anL().filter(x=>!anWho(x));if(!free.length)return rkToast('Nenhum anel livre · eles caem do Lobo Negro (Caça)','#d9b3ff');rkToast('Escolha um anel na lista da direita','#d9b3ff')}
{const _h=rkLibH;rkLibH=function(){if(RKL.tab==='an')return anH();const pf=RKL.tab==='chr';let h=_h.apply(this,arguments);if(!pf)h=h.split(rkB(18,600,268,668)).join(rkB(18,652,268,716));
  return h+`<button class="hs anTabB" data-a="tab" data-t="an" style="${pf?rkB(12,515,276,590):rkB(8,555,279,640)}"><img src="${RQA.anel2[0]}" alt=""><span>Anéis</span></button>`}}
{const _o=rkLibOn;rkLibOn=function(){if(RKL.tab==='an')return anOn();return _o.apply(this,arguments)}}
/* bônus na luta (Boss, Torre e Caça): personagem em uso */
{const _ra=rkApply;rkApply=function(){_ra.apply(this,arguments);try{const tw=typeof TW!=='undefined'&&TW.on&&G.gmode==='torre';if(!G.p||!(tw||G.gmode==='boss'||G.gmode==='caca'))return;const p=G.p[0],A=anSum(p.def.id);
  p.tdm=(p.tdm||1)+A.dano/100;p.tcr=(p.tcr||0)+A.crit;p.tsp=(p.tsp||1)+A.vel/100;p.tki=(p.tki||1)+A.uv/100}catch(e){}}}
/* sorte e drop: somados onde a soma geral é feita (psSum() sem personagem = personagem em uso) */
{const _ps=psSum;psSum=function(id){const o=_ps.apply(this,arguments);if(id)return o;try{const A=anSum(eqChar());o.st+=A.st;o.drop+=A.drop}catch(e){}return o}}
/* drops na Caça */
{const _lu=caLvUp;caLvUp=function(a,d){const L=d.bLv||1,was=d.bs==='rev';_lu.apply(this,arguments);if(was)return;const r=anDropLobo(L);if(r){(CA.an=CA.an||[]).push(r);anFx(r,d)}}}
{const _k=ko;ko=function(a,d){if(G.gmode==='caca'&&isBs(d)&&G.phase==='fight'&&(d.bLv||1)>=10&&d.bs!=='rev'&&!d.ko){const r=anDropLobo(10);if(r){(CA.an=CA.an||[]).push(r);anFx(r,d)}}return _k.apply(this,arguments)}}
function anFx(r,d){try{txt(d.x,d.y-240,'💍 ANEL '+ANC[r.c][0]+' ('+ANG[r.g]+')',ANC[r.c][1]);if(r.c>=3||r.g>=5){G.flash=8;G.flashCol=ANC[r.c][1];banner('💍 ANEL '+ANC[r.c][0]+'!',ANC[r.c][1],110,ANG[r.g]+' · '+anTxt(r))}SFX.powerUp&&SFX.powerUp()}catch(e){}}
{const _cs=caStart;caStart=function(){CA.an=[];const r=_cs.apply(this,arguments);CA.an=[];return r}}
{const _ce=caEnd;caEnd=function(w){const got=(CA.an||[]).slice();_ce.apply(this,arguments);const add=()=>{const M=$('rkModal');if(!M||M.hidden||M.querySelector('.anGot'))return;const p=M.querySelector('.twM .row');if(!p)return;
    p.insertAdjacentHTML('beforebegin',`<div class="anGot">${got.length?'<p class="twH">💍 Anéis que caíram:</p>'+got.map(anCard).join(''):'<p class="twH">Nenhum anel caiu desta vez.</p>'}</div>`)};for(const t of [400,1900,3600,6100])setTimeout(add,t)}}

/* ================= v279: CAÇA LIBERADA + LOOT DA CAÇA + NÍVEL DOS ANÉIS + PEDRAS DAS ALMAS + SET DO LOBO =================
   Sorte (caLuck) multiplica CHANCES (0,5% → 1% → 2%, até 4x). Drop (caDropF) multiplica QUANTIDADES (10 💎 → 20 💎). */
const ANMX=[10,20,30,40,50];
const anLvl=r=>Math.max(1,Math.min(ANMX[r.c],r.l|0||1));
const anV=r=>{const mx=ANMX[r.c],l=anLvl(r);return Math.round(r.v*(.1+.9*(l-1)/(mx-1))*10)/10};
const PDN=['COMUM','RARA','ÉPICA','LENDÁRIA','MÍTICA','SECRETA','DIVINA'],PDC=['#d9dde8','#3aa0ff','#b45cff','#ffc928','#ff3b4a','#9a5cff','#ffe27a'];
const pdA=()=>{const a=rkG('pdr2',[0,0,0,0,0,0,0]);while(a.length<7)a.push(0);return a},pdAdd=(t,n)=>{const a=pdA();a[t]=Math.max(0,a[t]+n);rkS('pdr2',a)};
/* custo para ir do nível l para l+1 */
function anCost(l){const t=l<10?0:l<20?1:l<30?2:l<40?3:l<45?4:l<49?5:6;return {t,n:1+Math.floor((l%10)/4),g:0}} /* v324: evoluir anel não gasta diamante (só Pedra das Almas) */
/* ---- SET DO LOBO (só vale no modo Caça) ---- */
const LST=[['cap','CAPACETE','crit','🎯 Crítico','%'],['arm','ARMADURA','def','🛡️ Defesa','%'],['bot','BOTAS','vel','💨 Velocidade','%'],['col','COLAR','st','🍀 Sorte na caça',''],['anl','ANEL','drop','🎁 Drop na caça','%'],['capa','CAPA','dano','⚔️ Dano','%']];
const LSR=['COMUM','RARO','ÉPICO','LENDÁRIO','MÍTICO','SECRETO','DIVINO'],LSC=['#d9dde8','#3aa0ff','#b45cff','#ffc928','#ff3b4a','#9a5cff','#ffe27a'];
const LSV={crit:[3,5,8,12,18,26,38],def:[4,7,11,16,23,32,45],vel:[3,5,8,12,17,24,34],st:[5,10,18,28,42,62,90],drop:[5,10,18,28,42,62,90],dano:[4,7,11,16,24,35,50]};
const lsInv=()=>rkG('ls',{}),lsEq=()=>rkG('lsEq',{});
function lsB(k){const E=lsEq();let v=0;for(const T of LST)if(T[2]===k&&E[T[0]]!=null)v+=LSV[k][E[T[0]]];return v}
const caLuck=()=>{let st=0;try{st=lvSorte()}catch(e){}return Math.min(4,1+Math.max(0,st+lsB('st'))/100)};
const caDropF=()=>{let d=1;try{d=rkDropF()}catch(e){}return d+lsB('drop')/100};
const caPick=(W)=>{let t=W.reduce((a,x)=>a+x,0),q=Math.random()*t;for(let i=0;i<W.length;i++){if((q-=W[i])<0)return i}return 0};
const caRnd=x=>Math.floor(x)+(Math.random()<x%1?1:0);
/* drop de anel (substitui o da v277): do mais raro para o mais comum, sorte multiplica */
anDropLobo=function(L){const k=caLuck(),C=[[4,L>=10?.005:L>=9?.004:0],[3,L>=9?.02:L>=7?.012:0],[2,L>=5?.04:0],[1,L>=3?.09:0],[0,.22]];let r=null;
  for(const [c,p] of C){if(p&&Math.random()<p*k){r=anGive(anRoll(c,L));break}}caLoot(L);return r};
function caLoot(L){const k=caLuck(),d=caDropF(),X=CA.loot||(CA.loot={gem:0,red:0,tic:0,pd:[0,0,0,0,0,0,0],set:[],bau:[]});const msg=[];
  const g=Math.max(0,Math.min(500-X.gem,caRnd((2+L*1.5+Math.random()*3)*Math.min(2,d)*rkEvG())));if(g)rkAdd('gem',g); /* v301: nerf — máx. 500 💎 por caçada, drop dobra no máximo 2x */X.gem+=g;msg.push('+'+g+'💎');
  if(L>=4&&Math.random()<.2){const n=1+(Math.random()<.4?1:0);rkAdd('red',n);X.red+=n;msg.push('+'+n+'🔴')}
  if(Math.random()<.01*k){rkAdd('tic',1);X.tic++;msg.push('🎟️ TICKET!')}
  if(Math.random()<.4+.03*L){const W=[55,26*(1+L*.05),12*(1+L*.05),5*k*(1+L*.08),1.5*k*(1+L*.08),.35*k*(1+L*.08),.08*k*(1+L*.08)],t=caPick(W),n=Math.max(1,caRnd([3,2,1.4,1,1,1,1][t]*(.7+Math.random()*.6)*d));pdAdd(t,n);X.pd[t]+=n;msg.push('🎒 Pedra '+PDN[t]+' x'+n)}
  if(Math.random()<.1+.01*L){const W=[50,28,14,6*k*(1+L*.1),1.5*k*(1+L*.1),.3*k*(1+L*.1),.07*k*(1+L*.1)],r=caPick(W),T=LST[(Math.random()*LST.length)|0],I=lsInv(),key=T[0]+r;I[key]=(I[key]||0)+1;rkS('ls',I);X.set.push([T[0],r]);msg.push('🐺 '+T[1]+' '+LSR[r])}
  if(L>=4){if(Math.random()<.006*k){X.bau.push('mit');msg.push('📦 BAÚ MÍTICO')}else if(Math.random()<.02*k){X.bau.push('lend');msg.push('📦 BAÚ LENDÁRIO')}}
  try{const f=G.p[1];txt(f.x,f.y-200,msg.join(' · '),'#ffe27a');if(X.set.length&&X.set[X.set.length-1][1]>=4||msg.some(m=>m.includes('BAÚ M')||m.includes('DIVINA')||m.includes('SECRETA')))banner('DROP RARO!','#ffe27a',90,msg.slice(1).join(' · '))}catch(e){}}
{const _cs=caStart;caStart=function(){const r=_cs.apply(this,arguments);CA.loot={gem:0,red:0,tic:0,pd:[0,0,0,0,0,0,0],set:[],bau:[]};return r}}
{const _ce=caEnd;caEnd=function(w){const X=CA.loot;CA.loot=null;_ce.apply(this,arguments);if(!X)return;const bau=X.bau.slice();
  const it=[];if(X.gem)it.push(`<span style="--c:#7fd8ff"><img src="${RQA.coin[0]}" alt="">+${X.gem}</span>`);if(X.red)it.push(`<span style="--c:#ff5a5a"><img src="${RQA.coin[1]}" alt="">+${X.red}</span>`);if(X.tic)it.push(`<span style="--c:#ffd34a"><img src="${RQA.coin[2]}" alt="">+${X.tic}</span>`);
  X.pd.forEach((n,t)=>{if(n)it.push(`<span style="--c:${PDC[t]}"><img src="${RQA.pedra[t]}" alt="">${PDN[t]} x${n}</span>`)});
  for(const [k,r] of X.set){const ti=LST.findIndex(T=>T[0]===k);it.push(`<span style="--c:${LSC[r]}"><img src="${RQA.lset[ti][r]}" alt="">${LST[ti][1]} ${LSR[r]}</span>`)}
  for(const b of bau)it.push(`<span style="--c:${b==='mit'?'#ff3b4a':'#ffc928'}">📦 BAÚ ${b==='mit'?'MÍTICO':'LENDÁRIO'}</span>`);
  const add=()=>{const M=$('rkModal');if(!M||M.hidden||M.querySelector('.caLoot'))return;const p=M.querySelector('.twM .row');if(!p)return;p.insertAdjacentHTML('beforebegin',`<div class="caLoot rkItems">${it.join('')||'<span>Nada</span>'}</div>`);
    if(bau.length){const go=async(next)=>{CA.rs=0;rkModal(null);const B=bau.splice(0);await rkBauSeq(B.map(r=>({r,n:1})));if(next)caStart()};$('rkMX').onclick=()=>go(0);$('caAg').onclick=()=>go(1)}};
  for(const t of [450,1950,3650,6150])setTimeout(add,t)}}
/* ---- EVOLUIR ANEL ---- */
function anUpM(id,fx){const r=anL().find(x=>x.i===id);if(!r)return rkModal(null);const l=anLvl(r),mx=ANMX[r.c],top=l>=mx,C=anCost(l),P=pdA(),ok=!top&&P[C.t]>=C.n&&rkG('gem',0)>=C.g,nx=Object.assign({},r,{l:l+1});
  rkModal(`<div class="twM anUpM" style="--c:${ANC[r.c][1]}"><h3>⬆️ EVOLUIR ANEL ${ANC[r.c][0]}</h3><div class="anBig ${fx?'up':''}"><img src="${RQA.anel2[r.c]}" alt=""><b>${l}</b></div>
    <div class="anLvB"><i style="width:${l/mx*100}%"></i><span>NÍVEL ${l} / ${mx}</span></div>
    <p class="twH">Nota <b class="g g${r.g}">${ANG[r.g]}</b> · ${anSt(r.s)[1]} <b>+${anV(r)}${anSt(r.s)[2]}</b>${top?' · <b style="color:#ffd34a">NÍVEL MÁXIMO!</b>':` → <b style="color:#7dff9a">+${anV(nx)}${anSt(r.s)[2]}</b> · no máx: +${r.v}${anSt(r.s)[2]}`}</p>
    ${top?'':`<div class="anCost"><span style="--c:${PDC[C.t]}" class="${P[C.t]>=C.n?'':'no'}"><img src="${RQA.pedra[C.t]}" alt="">${PDN[C.t]} ${P[C.t]}/${C.n}</span>${C.g?`<span class="${rkG('gem',0)>=C.g?'':'no'}"><img src="${RQA.coin[0]}" alt="">${rkFmtN(rkG('gem',0))}/${C.g}</span>`:''}</div>`}
    <p class="twH" style="font-size:.8em">Pedras das Almas caem no modo Caça (Lobo Negro).</p>
    <div class="row">${top?'':`<button class="btn main" id="anGo" ${ok?'':'disabled'}>⬆️ EVOLUIR</button>`}<button class="btn" id="rkMX">VOLTAR</button></div></div>`);
  $('rkMX').onclick=()=>{rkModal(null);if(RKV==='lib')rkView('lib')};
  if($('anGo'))$('anGo').onclick=()=>{const P2=pdA();if(P2[C.t]<C.n||rkG('gem',0)<C.g){rkSfx('clang');return}pdAdd(C.t,-C.n);rkAdd('gem',-C.g);const L=anL(),x=L.find(z=>z.i===id);x.l=l+1;rkS('an',L);rkSfx('powerUp');anUpM(id,1)}}
/* ---- tela do SET DO LOBO ---- */
function lsOpen(){const I=lsInv(),E=lsEq();
  const slots=LST.map((T,i)=>{const r=E[T[0]];return `<button class="lsSl" data-k="${T[0]}" style="--c:${r!=null?LSC[r]:'#4a5a7a'}">${r!=null?`<img src="${RQA.lset[i][r]}" alt="">`:`<i>${T[1]}</i>`}<small>${r!=null?T[3].split(' ')[0]+' +'+LSV[T[2]][r]+T[4]:'vazio'}</small></button>`}).join('');
  const own=[];LST.forEach((T,i)=>{for(let r=6;r>=0;r--){const n=I[T[0]+r]|0;if(n)own.push(`<button class="lsIt ${E[T[0]]===r?'on':''}" data-k="${T[0]}" data-r="${r}" style="--c:${LSC[r]}"><img src="${RQA.lset[i][r]}" alt="">${n>1?`<b>x${n}</b>`:''}</button>`)}});
  const tot=LST.map(T=>{const v=lsB(T[2]);return v?`<span>${T[3]} +${v}${T[4]}</span>`:''}).join('');
  rkModal(`<div class="twM lsM"><h3>🐺 SET DO LOBO</h3><p class="twH">Só vale no modo <b>Caça</b>: ótimo para matar o Lobo Negro e farmar anéis. Cai nos drops da caçada (comum → divino).</p>
    <div class="lsSls">${slots}</div><div class="lsTot">${tot||'<span>Nenhuma peça equipada</span>'}</div>
    <div class="lsGrid">${own.join('')||'<p class="twH">Você ainda não tem peças. Cace o Lobo Negro!</p>'}</div>
    <div class="lsPd">${pdA().map((n,t)=>`<span style="--c:${PDC[t]}"><img src="${RQA.pedra[t]}" alt="">${n}</span>`).join('')}</div>
    <div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);
  document.querySelectorAll('#rkModal .lsIt').forEach(b=>b.onclick=()=>{const E2=lsEq();E2[b.dataset.k]=+b.dataset.r;rkS('lsEq',E2);rkSfx('powerUp');lsOpen()});
  document.querySelectorAll('#rkModal .lsSl').forEach(b=>b.onclick=()=>{const E2=lsEq();if(E2[b.dataset.k]==null)return;delete E2[b.dataset.k];rkS('lsEq',E2);rkSfx('whoosh');lsOpen()})}
{const _h=caH;caH=function(){return _h.apply(this,arguments)+`<button class="hs caSet" data-a="lsSet" style="${rkB2(1130,882,1600,934)}">🐺 SET DO LOBO · 🎒 PEDRAS · 🧪 POÇÕES</button>`}}
/* bônus do set na luta da caça */
{const _ra=rkApply;rkApply=function(){_ra.apply(this,arguments);try{if(G.gmode!=='caca'||!G.p)return;const p=G.p[0];p.tdm=(p.tdm||1)+lsB('dano')/100;p.tcr=(p.tcr||0)+lsB('crit');p.tsp=(p.tsp||1)+lsB('vel')/100;p.tdf=(p.tdf||1)/(1+lsB('def')/100)}catch(e){}}}
/* pedras e set na Biblioteca (aba Itens) */
{const _li=rkLibItems;rkLibItems=function(){const R=_li.apply(this,arguments);if(RKL.tab!=='it')return R;const q=RKL.q.toLowerCase(),P=pdA(),I=lsInv(),add=[];
  PDN.forEach((n,t)=>add.push({id:'pd'+t,k:'it',r:['comum','rara','epica','lend','mit','sec','obs'][t],has:P[t]>0,img:RQA.pedra[t],big:RQA.pedra[t],nm:'PEDRA '+n,d:'Você tem '+P[t]+' · Pedra das Almas: evolui os anéis · cai no modo Caça'}));
  LST.forEach((T,i)=>{for(let r=0;r<7;r++)add.push({id:'ls'+T[0]+r,k:'it',r:['comum','rara','epica','lend','mit','sec','obs'][r],has:(I[T[0]+r]|0)>0,img:RQA.lset[i][r],big:RQA.lset[i][r],nm:T[1]+' DO LOBO '+LSR[r],d:T[3]+' +'+LSV[T[2]][r]+T[4]+' · só no modo Caça · você tem '+(I[T[0]+r]|0)})});
  return R.concat(add.filter(x=>(!q||x.nm.toLowerCase().includes(q))&&(RKL.f===0||(RKL.f===1?x.has:!x.has))))}}

/* ================= v280: SHAKA — Invocação ILIMITADA (3ª aba, no lugar da do Madara) + nível 70 =================
   Abre 10/11/2026 13:20 (Brasília) e fica 7 dias. 70 💎 / 700 💎 (aceita tickets), Shaka 0,35% garantido em 170 (rk_pityS),
   itens secretos do Shaka 0,25% garantido em 220 (rk_pitySS, nunca repetido). */
const SKG0=Date.UTC(2026,10,10,16,20),SKG1=SKG0+7*864e5;
const skgOpen=()=>{const n=Date.now();return n>=SKG0&&n<SKG1},skgHHMM=()=>'13:20';
const skOwned=()=>rkG('own',[]).includes('shaka');const SKSEC=['skcap','skarm','skluv','skbot','skros'];
const skSecLeft=()=>{const I=twInv();return SKSEC.filter(k=>!I.some(x=>x.nm===RKSP[k].nm||x.skb===k))};
function rkRollS(){
  if(!skOwned()&&!RKMTMP.includes('shaka')){const p=rkG('pityS',0)+1;if(p>=170||Math.random()*100<.35){rkS('pityS',0);RKMTMP.push('shaka');return {k:'chr',r:'mit',id:'shaka'}}rkS('pityS',p)}
  {const L=skSecLeft().filter(k=>!RKMTMP.includes(k));if(L.length){const p=rkG('pitySS',0)+1;if(p>=220||Math.random()*100<.25){rkS('pitySS',0);const s=L[(Math.random()*L.length)|0];RKMTMP.push(s);return {k:'sp',r:'sec',s}}rkS('pitySS',p)}}
  if(Math.random()*100<30){let q=Math.random()*100,R='comum';for(const [k,w] of RKEQW){if((q-=w)<0){R=k;break}}return {k:'eq',r:R,E:TWEQ[(Math.random()*TWEQ.length)|0]}}
  return {k:'red',r:'comum',n:1+((Math.random()*5)|0)}}
{const _r=rkRoll;rkRoll=function(){return RKBAN==='sk'?rkRollS():_r()}}
{const _c=rkCost;rkCost=function(n){if(RKBAN!=='sk')return _c(n);const t=Math.min(n,rkG('tic',0)|0);return {t,g:n===1?(t?0:70):(n-t)*70}}}
{const _sm=rkSummon;rkSummon=function(n){if(RKBAN==='sk'&&!skgOpen()){rkSfx('clang');return rkToast(Date.now()<SKG0?'🔒 A Invocação do Shaka abre hoje às '+skgHHMM()+' (Brasília)':'A Invocação Ilimitada do Shaka acabou','#ffd84a')}return _sm.apply(this,arguments)}}
{const _tx=rkTaxas;rkTaxas=function(){if(RKBAN!=='sk')return _tx();rkModal(`<div class="twM"><h3>% TAXAS · INVOCAÇÃO ILIMITADA · SHAKA</h3><table class="rkTx"><tr><th>Resultado</th><th>Chance</th></tr>
  <tr><td style="color:#ffd84a">✦ SECRETO: SHAKA DE VIRGEM · garantido em 170 giros</td><td>0,35%</td></tr><tr><td style="color:#fff3b0">✦ SECRETO: Elmo, Armadura, Luvas, Botas ou Rosário do Shaka · garantido em 220 giros · nunca repetido</td><td>0,25%</td></tr>
  <tr><td>Equipamento</td><td>30%</td></tr><tr><td style="color:#ff5a5a">Moeda Vermelha (1 a 5)</td><td>69,4%</td></tr></table>
  <p class="twH">70 💎 por giro (10 giros = 700 💎) · 1 ticket = 1 giro. Fica 7 dias: depois não dá mais para pegar.<br>Itens do Shaka: 100% no Shaka (+10% com o set completo), 50% em outros personagens.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}}
function rkMegaS(){return new Promise(res=>{const O=document.createElement('div');O.className='rkMega skm';O.innerHTML='<i class="rays"></i><i class="fl"></i><i class="ring"></i><div class="tx"><small>✦ ✦ ✦ ✦ ✦ ✦</small><b>SORTE</b><b>SECRETA!</b><span>O SHAKA DE VIRGEM APARECEU!</span></div>';rkHost().appendChild(O);
  rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),400);setTimeout(()=>rkSfx('boom'),900);setTimeout(()=>rkSfx('powerUp'),1500);setTimeout(()=>rkSfx('boom'),2200);let d=0;const end=()=>{if(d)return;d=1;O.classList.add('out');setTimeout(()=>{O.remove();res()},400)};setTimeout(end,3600);setTimeout(()=>{O.onclick=end},900)})}
function skgLeft(){const n=Date.now();if(n<SKG0)return 'ABRE ÀS '+skgHHMM();if(n>=SKG1)return 'ENCERRADA';const m=Math.floor((SKG1-n)/6e4);return 'TERMINA EM '+Math.floor(m/1440)+'d '+Math.floor(m%1440/60)+'h'}
{const _gh=rkGachaH;rkGachaH=function(){
  if(RKBAN!=='sk'){let h=_gh.apply(this,arguments);
    h=h.replace(`<button class="hs lk dim" data-a="lock" style="${rkB(15,402,380,518)}">${RKLOCK}</button>`,`<button class="hs skTab" data-a="ban" data-b="sk" style="${rkB(15,402,380,518)}"><img src="${IMG.shaka?IMG.shaka.src:''}" alt=""><span>Invocação<br><b>Ilimitada</b></span><em>${skgLeft()}</em></button>`);
    h=h.replace('<button class="lk" data-a="lock"><i>🔒</i>Invocação<br>Padrão</button>',`<button class="skT" data-a="ban" data-b="sk"><i>✦</i>Invocação<br>Ilimitada<em>SHAKA</em></button>`);return h}
  const own=skOwned(),pS=rkG('pityS',0),pI=rkG('pitySS',0),sl=skSecLeft().length,op=skgOpen();
  return `<button class="hs" data-a="back" style="${rkB(15,10,130,85)}"></button><button class="hs" data-a="home" style="${rkB(1740,10,1840,85)}"></button>
  <div class="rkNum" style="${rkB(1240,22,1360,62)}">${rkFmtN(rkG('gem',0))}</div><button class="hs" data-a="shop" style="${rkB(1365,18,1418,68)}"></button>
  <div class="rkNum" style="${rkB(1530,22,1650,62)}">${rkFmtN(rkG('tic',0))}</div><button class="hs" data-a="lock" style="${rkB(1655,18,1710,68)}"></button>
  <button class="hs" data-a="ban" data-b="mit" style="${rkB(15,120,390,255)}"></button><button class="hs" data-a="ban" data-b="esp" style="${rkB(15,268,380,392)}"></button><button class="hs on skOn" data-a="ban" data-b="sk" style="${rkB(15,405,385,525)}"></button>
  <div class="ytTaxa skTaxa" style="${rkB(1312,470,1832,615)}"><i class="g"></i><i class="s"><s></s><s></s><s></s><s></s><s></s></i></div><i class="skLotus" style="${rkB(860,560,1140,720)}"></i>
  <div class="skLeft ${op?'':'off'}" style="${rkB(420,250,880,300)}">${op?'⏳ ':'🔒 '}${skgLeft()}</div>
  <button class="hs" data-a="shop" style="${rkB(40,700,125,800)}"></button><button class="hs" data-a="hist" style="${rkB(165,700,265,800)}"></button><button class="hs" data-a="taxas" style="${rkB(300,700,390,800)}"></button>
  <button class="hs ${op?'':'skNo'}" data-a="sum1" style="${rkB(540,690,985,805)}"><span class="shine"></span></button><button class="hs ${op?'':'skNo'}" data-a="sum10" style="${rkB(1030,690,1480,805)}"><span class="shine"></span></button>${(()=>{const c1=rkCost(1),c10=rkCost(10);return (c1.t?`<div class="rkTk" style="${rkB(600,655,925,688)}">🎫 usa 1 ticket (não gasta 💎)</div>`:'')+(c10.t?`<div class="rkTk" style="${rkB(1060,655,1445,688)}">🎫 usa ${c10.t} ticket${c10.t>1?'s':''}${c10.g?' + '+c10.g+' 💎':' (não gasta 💎)'}</div>`:'')})()}
  ${own?`<div class="ytOwn skOwn" style="${rkB(420,610,860,660)}">✔ VOCÊ JÁ TEM O SHAKA</div>`:''}
  <div class="rkPity" style="${rkB(540,812,1480,845)}">${own?'':`<span style="color:#ffd84a">✦ Shaka em <b>${170-pS}</b></span> · `}${sl?`✦ Item secreto em <b>${220-pI}</b> · `:''}🎟️ 1 ticket = 1 giro · 🟣 +pó</div>`}}
{const _bg=rkView;rkView=function(v){const r=_bg.apply(this,arguments);if(v==='gacha'&&RKBAN==='sk'){const A=document.querySelector('#rkWrap .rkA');if(A)A.style.backgroundImage=`url(${RQA.gacha_sk})`}return r}}
function lvX(){const id=LVC.id,L=lvOf(id);rkModal(`<div class="twM lvXm"><h3>✦ HABILIDADES SECRETAS DO SHAKA</h3><p class="twH">Só o Shaka passa do nível 50. Escolha 1 bônus em cada linha (cristal MÍTICO).</p>
  ${[6,7].map(r=>`<div class="lvXr"><b>NÍVEL ${LVROW[r]}${L.lv<LVROW[r]?' 🔒':''}</b>${LVTREE[r].map(([k,v],ci)=>`<button class="lvNd ${L.lv>=LVROW[r]?'on':'lk'} ${L.t[r]===ci?'sel':''}" data-r="${r}" data-c="${ci}" style="--c:#ffd84a"><i>${LVSTAT[k].i}</i><b>+${v}%</b><small>${LVSTAT[k].n}</small></button>`).join('')}</div>`).join('')}
  <p class="twH">Custo: nível 60 = 3 cristais míticos · nível 70 = 4 cristais míticos.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);document.querySelectorAll('#rkModal .lvXr .lvNd').forEach(b=>b.onclick=()=>lvNode(+b.dataset.r,+b.dataset.c))}

/* ================= v287: Invocação do Shaka com o VÍDEO do dono (com som, tela cheia), SUPER MEGA SORTE SECRETA (branco dourado) + animação dele ABRINDO OS OLHOS; anéis brilham pelo nível ================= */
const SKINV='a/d99e2dad783e30.mp4';
try{RKUV.shaka=()=>SKV}catch(e){}
{const _pv=rkPlayVid;rkPlayVid=function(cb){if(RKBAN!=='sk')return _pv(cb);const O=document.createElement('div');O.className='rkFx skFx';O.innerHTML='<video playsinline preload="auto"></video><span>toque para pular</span>';rkHost().appendChild(O);
  const v=O.querySelector('video');let d=0;const end=()=>{if(d)return;d=1;try{v.pause()}catch(e){}O.remove();cb()};v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.src=SKINV;v.onended=end; /* v367: sem áudio (o dono pediu: a música do lobby continua bonita no giro) */v.onerror=end;O.onclick=end;
  const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{v.play().catch(end)});setTimeout(end,12000)}}
rkMegaS=function(){return new Promise(res=>{const O=document.createElement('div');O.className='rkMega skm2';O.innerHTML='<i class="rays"></i><i class="fl"></i><i class="ring"></i><i class="ring r2"></i><div class="tx"><small>✦ ✦ ✦ ✦ ✦ ✦ ✦</small><b>SUPER MEGA</b><b>SORTE SECRETA!</b><span>O SHAKA DE VIRGEM APARECEU!</span></div>';rkHost().appendChild(O);
  rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),350);setTimeout(()=>rkSfx('boom'),800);setTimeout(()=>rkSfx('powerUp'),1300);setTimeout(()=>rkSfx('boom'),1900);setTimeout(()=>rkSfx('powerUp'),2500);let d=0;const end=()=>{if(d)return;d=1;O.classList.add('out');setTimeout(()=>{O.remove();res()},400)};setTimeout(end,4200);setTimeout(()=>{O.onclick=end},900)})};
{const _cw=rkCharWin;rkCharWin=function(id,mit,nw){const r=_cw.apply(this,arguments);if(id==='shaka'){const O=[...document.querySelectorAll('.rkWin')].pop();if(O){O.classList.add('skw');const b=O.querySelector('.t b');if(b)b.textContent=nw?'✦ SECRETO · SHAKA DE VIRGEM ✦':'✦ SHAKA ✦'}}return r}}
/* anéis: brilho da cor do anel, mais forte a cada 10 níveis */
const anGl=r=>Math.min(5,1+Math.floor(anLvl(r)/12)+(r.c>=3?1:0)+(r.g>=6?1:0)); /* v293: todo anel brilha */
{const _h=anH;anH=function(){let h=_h.apply(this,arguments);const L=anL(),E=anEq(AN.ch);
  E.filter(Boolean).forEach(i=>{const r=L.find(z=>z.i===i);if(!r)return;const g=anGl(r);if(!g)return;const src=RQA.anel2[r.c];h=h.split(`<img src="${src}" alt=""></i>`).join(`<img src="${src}" alt="" class="gl g${g}" style="--c:${ANC[r.c][1]}"></i>`)});return h}}
{const _g=anGrid;anGrid=function(){_g.apply(this,arguments);document.querySelectorAll('#anGrid .anCell').forEach(b=>{const r=anL().find(x=>x.i===b.dataset.i);if(!r)return;const g=anGl(r);if(g){const im=b.querySelector('img');im.classList.add('gl','g'+g);im.style.setProperty('--c',ANC[r.c][1])}})}}

/* ================= v288: carta DIVINA do Shaka + TÍTULO numerado dos 10 primeiros que pegarem o Shaka (+20% de dano COM o Shaka) =================
   Servidor: torre/sktit_N (documentId fixo; 409 = já tem dono). Pendente sem internet: rk_sktp. */
for(let n=1;n<=10;n++)TWTIT['sk'+n]={n:'SHAKA Nº'+n,i:'🪷',c:n===1?'#ffffff':n<=3?'#fff3c0':'#ffd76a',d:'Um dos 10 primeiros do servidor a pegar o Shaka · +20% de dano com o Shaka',hid:1,sk:n};
async function skTitClaim(show){if(twTits().some(k=>/^sk\d+$/.test(k))){rkS('sktp',0);return}rkS('sktp',1);const nm=String(twLS.g('tw_nome','')||'?').slice(0,16),IV=v=>({integerValue:String(v)});
  for(let n=1;n<=10;n++){let r;try{r=await twFetchT(TWURL+'/torre?documentId=sktit_'+n+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{nome:{stringValue:nm},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},skt:{stringValue:String(n)},v:IV(288)}})})}catch(e){return}
    if(r.ok){rkS('sktp',0);const L=twTits();L.push('sk'+n);twLS.s('tw_tit',L);twLS.s('tw_titOn','sk'+n);try{twTitSync()}catch(e){}try{acSave(1)}catch(e){}if(show)await skTitWin(n);return}
    if(r.status!==409&&r.status!==403)return}
  rkS('sktp',0)}
function skTitWin(n){return new Promise(res=>{const O=document.createElement('div');O.className='rkWin end skTw';O.innerHTML=`<div class="t"><b>✦ VOCÊ É O Nº ${n} DO SERVIDOR! ✦</b><span>TÍTULO DIVINO</span></div><div class="ytTw">${pfTitH('sk'+n,'',false)}</div><i class="rays"></i><i class="skHalo"></i><div class="t2">Um dos 10 primeiros a pegar o Shaka · +20% de dano quando você luta com o Shaka</div>`;rkHost().appendChild(O);rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),300);setTimeout(()=>{O.onclick=()=>{O.remove();res()}},600)})}
{const _op=rkOpen;rkOpen=function(v){const r=_op.apply(this,arguments);if(rkG('sktp',0)&&rkG('own',[]).includes('shaka'))setTimeout(()=>skTitClaim(1),3000);return r}}
{const _pt=pfTitH;pfTitH=function(t,n,adm){const T=TWTIT[t];if(T&&T.sk){const k=T.sk===1?1:T.sk<=3?2:T.sk<=6?3:4;return `<span class="pfTt skt s${k}"><i>🪷</i><b>SHAKA</b><em>Nº ${T.sk}</em>${k<=3?'<i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✦</i>':''}</span>`}return _pt.apply(this,arguments)}}
/* +20% de dano só lutando com o Shaka (Boss, Torre, Caça) */
const skTitOn=()=>twTits().some(k=>/^sk\d+$/.test(k));
{const _ra=rkApply;rkApply=function(){_ra.apply(this,arguments);try{const tw=typeof TW!=='undefined'&&TW.on&&G.gmode==='torre';if(!G.p||!(tw||G.gmode==='boss'||G.gmode==='caca'))return;const p=G.p[0];if(p.def.id==='shaka'&&skTitOn())p.tdm=(p.tdm||1)+.20}catch(e){}}}

/* ================= v291: Rosário do Shaka vai no lugar da ARMA e as Luvas no do ANEL; itens do Shaka brilhando dourado; anéis da alma flutuando no personagem do PERFIL ================= */
(function(){try{const I=twInv(),Q=twEqp();let ch=0;for(const it of I){if(it.nm==='ROSÁRIO DE SHAKA'&&it.t!=='esp'){if(Q.anel===it.id)delete Q.anel;Object.assign(it,{t:'esp',v:0,st:60,drop:30});ch=1}if(it.nm==='LUVAS DE VIRGEM'&&it.t!=='anel'){if(Q.esp===it.id)delete Q.esp;Object.assign(it,{t:'anel',v:0,dmg:10,vel:40});ch=1}}if(ch){twLS.s('tw_inv',I);twLS.s('tw_eqp',Q)}}catch(e){}})();
(function(){try{const L=Object.values(RQA.ssp||{}).map(x=>x.split('/').pop());const st=document.createElement('style');
  st.textContent=L.map(f=>`img[src$="${f}"]`).join(',')+'{animation:skItG 1.8s ease-in-out infinite;border-radius:14%}'+
  '@keyframes skItG{0%,100%{filter:drop-shadow(0 0 .25em #fff) drop-shadow(0 0 .6em #ffd76a) brightness(1.05)}50%{filter:drop-shadow(0 0 .45em #fff) drop-shadow(0 0 1.3em #ffc21f) drop-shadow(0 0 2.2em rgba(255,215,110,.8)) brightness(1.3)}}';document.head.appendChild(st)}catch(e){}})();
{const _h=pfH;pfH=function(){let h=_h.apply(this,arguments);if(PFO)return h;try{const D=pfCur(),ped=CH[D.ped]?D.ped:'goku',L=anL(),E=anEq(ped).map(i=>i&&L.find(z=>z.i===i)).filter(Boolean);if(!E.length)return h;
  const R=E.map((r,k)=>{const y=560-k*72,w=290+k*6,g=anGl(r),gl=g?` class="gl g${g}" style="--c:${ANC[r.c][1]}"`:'';return `<i class="pfAnR b" style="${rkB2(1310-w/2,y-40,1310+w/2,y+40)};animation-delay:${(k*.37).toFixed(2)}s"><img src="${RQA.anel2[r.c]}" alt=""${gl}></i><i class="pfAnR f" style="${rkB2(1310-w/2,y-40,1310+w/2,y+40)};animation-delay:${(k*.37).toFixed(2)}s"><img src="${RQA.anel2[r.c]}" alt=""${gl}></i>`}).join('');
  h=h.replace('<button class="pfPed"',R+'<button class="pfPed"')}catch(e){}return h}}

/* v292: devolve itens do Shaka que sumiram (a mochila cheia descartava item com valor 0). Usa o histórico do gacha. */
(function(){try{if(rkG('skfix292',0))return;const H=rkG('hist',[]),I=twInv();let ch=0;
  for(const h of H){if(h.k!=='sp'||!RKSP[h.s]||!RKSP[h.s].sk)continue;const S=RKSP[h.s];if(I.some(x=>x.nm===S.nm||x.skb===h.s))continue;I.push(Object.assign({id:'fx'+h.s+Date.now().toString(36)},S));ch++}
  if(ch){twLS.s('tw_inv',I);setTimeout(()=>{try{rkToast('✦ '+ch+' item(ns) do Shaka devolvido(s)!','#ffd84a')}catch(e){}},2500)}rkS('skfix292',1)}catch(e){}})();

/* ================= v293: BAÚ DA CAÇA + CÓDIGOS + ITENS NO ESPAÇO CERTO + QUADRADOS DA MOCHILA =================
   Cada nível do boss da Caça derrotado: 100% de anel (não dá para saber qual) + o loot daquele nível.
   A luta PAUSA (G.hold): baú fechado treme → abre → o anel sobe do baú → quadro com os itens → CONTINUAR. Cor do baú = nível e raridade do anel. */
TWCUP['ypw8yf']={nm:'TODOS OS EQUIPAMENTOS DO SHAKA',it:Object.keys(RKSP).filter(k=>RKSP[k].sk).map(k=>Object.assign({},RKSP[k])),eq:1};
TWCUP['1r1gpju']={nm:'DIAMANTES PARA TODOS',ev:1,rnd:[1000,4000]};
/* itens equipados no espaço errado (ex.: Rosário que era anel e virou espada) */
(function(){try{const Q=twEqp(),I=twInv();let ch=0;for(const k of Object.keys(Q)){if(k==='poc')continue;const it=I.find(x=>x.id===Q[k]);if(!it){continue}if(it.t!==k){delete Q[k];if(!Q[it.t])Q[it.t]=it.id;ch=1}}if(ch)twLS.s('tw_eqp',Q)}catch(e){}})();
/* quadrados da mochila */
(function(){try{const st=document.createElement('style');st.textContent=`.eqI:not(.uniq):not(.ysec){border:0!important;background:url(${RQA.bauc.slot}) center/100% 100% no-repeat!important;box-shadow:inset 0 -1.4em 1.3em -.8em color-mix(in srgb,var(--c) 60%,transparent)}.eqI:not(.uniq):not(.ysec).sel{outline:3px solid #fff}.eqS:not(.on){border:0!important;background:url(${RQA.bauc.slot}) center/100% 100% no-repeat!important}`;document.head.appendChild(st)}catch(e){}})();
/* anel 100%: tenta do mais raro ao mais comum (sorte multiplica); se nada, BRANCO */
anDropLobo=function(L){const k=caLuck()*(cevOn()?3:1),C=[[4,[0,0,0,0,0,0,.003,.005,.01,.015][L-1]||0],[3,[0,0,0,0,0,.01,.02,.03,.04,.05][L-1]||0],[2,L>=5?.06:L>=3?.02:0],[1,L>=3?.2:.08]];let c=0; /* v294: vermelho e preto do dono */
  for(const [q,p] of C){if(p&&Math.random()<p*k){c=q;break}}const r=anGive(anRoll(c,L));
  const X0=JSON.parse(JSON.stringify(CA.loot||{gem:0,red:0,tic:0,pd:[0,0,0,0,0,0,0],set:[],bau:[]}));caLoot(L);const X=CA.loot||X0;
  const it=[];const d=(a,b)=>(a||0)-(b||0);
  if(d(X.gem,X0.gem))it.push([RQA.coin[0],'+'+d(X.gem,X0.gem),'#7fd8ff']);if(d(X.red,X0.red))it.push([RQA.coin[1],'+'+d(X.red,X0.red),'#ff5a5a']);if(d(X.tic,X0.tic))it.push([RQA.coin[2],'+'+d(X.tic,X0.tic),'#ffd34a']);
  X.pd.forEach((n,t)=>{const m=n-(X0.pd[t]||0);if(m>0)it.push([RQA.pedra[t],'x'+m,PDC[t]])});
  for(const [kk,rr] of X.set.slice(X0.set.length)){const ti=LST.findIndex(T=>T[0]===kk);it.push([RQA.lset[ti][rr],LSR[rr],LSC[rr]])}
  for(const b of X.bau.slice(X0.bau.length))it.push([TWIMG.bf[Math.max(0,TWRK.indexOf(b))],'BAÚ',b==='mit'?'#ff3b4a':'#ffc928']);
  BCQ.push({r,L,it});return r};
const BCQ=[];
const bcTier=(L,r)=>Math.min(5,Math.max([0,0,1,1,1,2,2,2,3,3][Math.max(0,Math.min(9,L-1))],[0,3,4,5,5][r.c]));
anFx=function(r,d){const B=BCQ.shift();if(!B)return;bcShow(B)};
function bcShow(B){if(document.querySelector('.bcO')){setTimeout(()=>bcShow(B),400);return}
  const t=bcTier(B.L,B.r),A=RQA.bauc,col=['#d9dde8','#3aa0ff','#b45cff','#ffc928','#c27aff','#ff3b4a'][t],rc=ANC[B.r.c][1];G.hold=1;
  const O=document.createElement('div');O.className='bcO t'+t;O.style.setProperty('--c',col);O.style.setProperty('--rc',rc);
  const cells=[`<div class="bcS an" style="--c:${rc}"><img src="${RQA.anel2[B.r.c]}" alt=""><b class="g g${B.r.g}">${ANG[B.r.g]}</b></div>`].concat(B.it.slice(0,4).map(([im,tx,c])=>`<div class="bcS" style="--c:${c}"><img src="${im}" alt=""><span>${tx}</span></div>`));while(cells.length<5)cells.push('<div class="bcS vz"></div>');
  O.innerHTML=`<div class="bcTt">NÍVEL ${B.L} DERROTADO!</div><div class="bcB"><i class="ray"></i><img class="cl" src="${A.c[t]}" alt=""><img class="op" src="${A.o[t]}" alt=""><img class="rg" src="${RQA.anel2[B.r.c]}" alt=""></div>
  <div class="bcI"><b style="color:${rc}">💍 ANEL ${ANC[B.r.c][0]} · ${ANG[B.r.g]}</b><span>${anTxt(B.r)}</span></div>
  <div class="bcP"><img src="${A.p[t]}" alt=""><div class="bcR">${cells.join('')}</div></div><div class="bcBt"><button class="bcGo">CONTINUAR ▶</button>${B.L<10?'<button class="bcGo bcSair">🏳️ SAIR E GUARDAR</button>':''}</div><small class="bcH">toque no baú para abrir</small>`;
  document.body.appendChild(O);let st=0;const open=()=>{if(st)return;st=1;O.classList.add('open');try{SFX.boom&&SFX.boom()}catch(e){}setTimeout(()=>{try{SFX.powerUp&&SFX.powerUp()}catch(e){}O.classList.add('ring')},450);setTimeout(()=>O.classList.add('pan'),1300)};
  O.querySelector('.bcB').onclick=open;setTimeout(open,1500);try{SFX.whoosh&&SFX.whoosh()}catch(e){}
  O.querySelector('.bcGo:not(.bcSair)').onclick=e=>{e.stopPropagation();if(!O.classList.contains('pan'))return;O.classList.add('out');setTimeout(()=>{O.remove();if(!document.querySelector('.bcO'))G.hold=0},250)}}
{const _cs=caStart;caStart=function(){BCQ.length=0;document.querySelectorAll('.bcO').forEach(x=>x.remove());G.hold=0;return _cs.apply(this,arguments)}}
{const _tp=togglePause;togglePause=function(){if(document.querySelector('.bcO'))return;return _tp.apply(this,arguments)}}
/* v294: código de PERSONAGEM (1 pessoa no jogo todo): C.chr = id do personagem */
TWCUP['1g9z05']={nm:'GOJO',it:[],chr:'gojo'};
{const _cp=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];const r=await _cp.apply(this,arguments);
  if(C&&C.chr&&E&&/\bok\b/.test(E.className)){const own=rkG('own',['goku']);if(!own.includes(C.chr)){own.push(C.chr);rkS('own',own)}try{acSave(1)}catch(x){}E.textContent='🎁 Código aceito! Você ganhou o '+C.nm+'! (já está nos seus personagens)'}return r}}

/* ================= v295: POÇÃO NA CAÇA + RANKING DA CAÇA + TÍTULOS DA CAÇA ================= */
/* poção: a normal (dano/crítico/energia), a de CURA e a de DROP valem na Caça; o drop da poção vale só nessa caçada */
function caPoc(p){try{const pon=twPocOn();let m=[];if(pon){const E=twPoE(pon.r);p.tdm+=E[1]/100;p.tcr=(p.tcr||0)+E[2];p.tsb=(p.tsb||1)+E[0]/100;twLS.s('tw_pocOn',null);m.push('🧪 +'+E[1]+'% DANO +'+E[2]+'% CRÍT.')}
  const c=rkG('pk_cura',null),d=rkG('pk_drop',null);p.rkCura=c?c.v:0;RKPDN=d?d.v:0;if(c){rkS('pk_cura',null);m.push('💚 CURA '+c.v+'% PRONTA')}if(d){rkS('pk_drop',null);m.push('🎁 DROP +'+d.v+'%')}
  if(m.length)setTimeout(()=>{try{txt(p.x,p.y-320,m.join(' · '),'#7dff9a')}catch(e){}},1800)}catch(e){}}
{const _ce=caEnd;caEnd=function(){try{return _ce.apply(this,arguments)}finally{setTimeout(()=>{RKPDN=0},100)}}}
{const _lo=lsOpen;lsOpen=function(){const r=_lo.apply(this,arguments);try{const row=document.querySelector('#rkModal .lsM .row');if(row){row.insertAdjacentHTML('afterbegin','<button class="btn main" id="caPocB">🧪 POÇÕES</button>');$('caPocB').onclick=()=>{rkSfx('whoosh');rkEquip('poc')}}}catch(e){}return r}}
/* estatísticas da caçada: dano no lobo, críticos, tempo (quadros, para fora do baú) */
{const _ah=applyHit;applyHit=function(a,d,h){if(G.gmode!=='caca'||!G.p||d!==G.p[1]||a!==G.p[0])return _ah.apply(this,arguments);const h0=d.hp;const r=_ah.apply(this,arguments);try{if(d.hp<h0)CA.dmg=(CA.dmg||0)+(h0-d.hp)}catch(e){}return r}}
{const _cf=critFx;critFx=function(a,d,h){try{if(G.gmode==='caca'&&G.p&&a===G.p[0])CA.crt=(CA.crt||0)+1}catch(e){}return _cf.apply(this,arguments)}}
{const _ap2=rkApply;rkApply=function(){const r=_ap2.apply(this,arguments);if(G.gmode==='caca'){CA.dmg=0;CA.crt=0;CA.f0=G.frame}return r}}
const caRingBest=()=>{let b=-1;for(const r of anL())b=Math.max(b,r.c*10+r.g);return b};
const caRingN=v=>v<0?'—':'ANEL '+ANC[Math.floor(v/10)][0]+' '+ANG[v%10];
/* títulos da Caça */
const CATIT={cc1:{n:'CAÇADOR',i:'🐺',c:'#cfd6ea',d:'Derrotar o Lobo Negro 1 vez',b:{dano:3},ok:S=>S.lv>=1},
  cc5:{n:'MATADOR DE LOBOS',i:'🩸',c:'#ff6a6a',d:'Derrotar o Lobo Negro 5 vezes na mesma caçada',b:{dano:5,crit:3},ok:S=>S.lv>=5},
  cc10:{n:'REI DA FLORESTA',i:'👑',c:'#7dff9a',d:'Caçar os 10 níveis do Lobo Negro',b:{dano:8,crit:5,vel:3},ok:S=>S.lv>=10},
  ccrap:{n:'CAÇADOR VELOZ',i:'⚡',c:'#7fd8ff',d:'Caçar os 10 níveis em menos de 4 minutos',b:{vel:6,dano:4},ok:S=>S.tt>0&&S.tt<240},
  cccr:{n:'OLHO DO PREDADOR',i:'🎯',c:'#ffb347',d:'Fazer 60 críticos numa caçada',b:{crit:8},ok:S=>S.crt>=60},
  ccpr:{n:'ALMA NEGRA',i:'🖤',c:'#b9b2c8',d:'Conseguir um anel PRETO',b:{dano:4,st:5},ok:S=>S.ring>=30},
  ccvm:{n:'ALMA DE SANGUE',i:'❤️‍🔥',c:'#ff3b4a',d:'Conseguir um anel VERMELHO',b:{dano:6,st:10},ok:S=>S.ring>=40},
  ccsss:{n:'NOTA SSS',i:'💠',c:'#ffd34a',d:'Conseguir um anel com nota SSS',b:{crit:6,st:8},ok:S=>S.ring>=0&&S.ring%10===7}};
for(const k in CATIT){const T=CATIT[k];TBUF[k]=T.b;TWTIT[k]={n:T.n,i:T.i,c:T.c,d:T.d+' · ✦ Bônus em uso: '+tbTxt(k)}}
function caTitCheck(S){for(const k in CATIT){try{if(CATIT[k].ok(S))twGiveTit(k)}catch(e){}}}
setTimeout(()=>{try{caTitCheck({lv:rkG('caRec',0),tt:rkG('caBest',{}).tt||0,crt:rkG('caBest',{}).crt||0,ring:caRingBest()})}catch(e){}},4000);
/* fim da caçada: guarda os recordes e manda para o ranking quando bate algum */
{const _ce2=caEnd;caEnd=function(w){const o=G.p&&G.p[1],won=!!(o&&o.ko&&(o.bLv||1)>=10),lv=won?10:Math.max(0,((o&&o.bLv)||1)-1);
  const S={lv,dmg:Math.round(CA.dmg||0),crt:CA.crt|0,tt:won&&CA.f0!=null?Math.round((G.frame-CA.f0)/60):0,ring:caRingBest()};
  const r=_ce2.apply(this,arguments);try{const B=rkG('caBest',{});let up=0;
    if(S.lv>(B.lv||0)){B.lv=S.lv;up=1}if(S.dmg>(B.dmg||0)){B.dmg=S.dmg;up=1}if(S.crt>(B.crt||0)){B.crt=S.crt;up=1}if(S.tt&&(!B.tt||S.tt<B.tt)){B.tt=S.tt;up=1}if(S.ring>(B.ring==null?-1:B.ring)){B.ring=S.ring;up=1}
    rkS('caBest',B);caTitCheck(S);if(up)caSend(B)}catch(e){}return r}}
function caSend(B){const n=twLS.g('tw_nome','');if(!n)return;const IV=v=>({integerValue:String(Math.max(0,Math.round(v||0)))});
  const f={nome:{stringValue:String(n).slice(0,16)},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},tit:{stringValue:twTitOn()},ca:{stringValue:'1'},clv:IV(B.lv),cdm:IV(B.dmg),ccr:IV(B.crt),ctt:IV(B.tt),crg:IV((B.ring==null?-1:B.ring)+1),char:{stringValue:rkG('sel','goku')},v:IV(311)};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(()=>{})}
/* tela do ranking */
const CARK=[['clv','🐺 MAIS LONGE',v=>v>=10?'👑 10 NÍVEIS':'NÍVEL '+v,1],['cdm','⚔️ MAIS DANO',v=>rkFmtN(v),1],['ccr','🎯 MAIS CRÍTICOS',v=>v+' críticos',1],['ctt','⏱️ MAIS RÁPIDO',v=>Math.floor(v/60)+':'+String(v%60).padStart(2,'0'),0],['crg','💍 ANEL MAIS RARO',v=>caRingN(v-1),1]];
let CARKT='clv',CARKL=null;
async function caRank(){caRankH();try{const L=await rkQ('ca','1',1000),M={};for(const e of L){if((e.v|0)<311)continue;const k=e.uid||e.nome;const m=M[k]||(M[k]={nome:e.nome,tit:e.tit,uid:e.uid,clv:0,cdm:0,ccr:0,ctt:0,crg:0,_ct:0});
    if((e._ct||0)>=m._ct){m.nome=e.nome;m.tit=e.tit;m._ct=e._ct||0}for(const [f,,,hi] of CARK){const v=e[f]|0;if(!v)continue;if(hi?v>m[f]:(!m[f]||v<m[f]))m[f]=v}}CARKL=Object.values(M)}catch(e){CARKL='err'}caRankH()}
function caRankH(){const T=CARK.find(x=>x[0]===CARKT),f=T[0],hi=T[3];let rows='<p class="twH">Carregando...</p>';
  if(CARKL==='err')rows='<p class="twH err">'+rkNetMsg()+'</p>';else if(CARKL){const L=CARKL.filter(e=>e[f]>0).sort((a,b)=>hi?b[f]-a[f]:a[f]-b[f]);const me=L.findIndex(e=>e.uid===twUid());
    rows=L.length?L.slice(0,30).map((e,i)=>`<div class="caRkR ${e.uid===twUid()?'me':''} p${i+1}"><b>${i<3?['🥇','🥈','🥉'][i]:i+1+'º'}</b><span>${String(e.nome||'?').replace(/[<>&]/g,'')}${e.tit&&TWTIT[e.tit]?` <small style="color:${TWTIT[e.tit].c}">${TWTIT[e.tit].i||'🏅'} ${TWTIT[e.tit].n}</small>`:''}</span><em ${f==='crg'?`style="color:${ANC[Math.floor((e[f]-1)/10)][1]}"`:''}>${T[2](e[f])}</em></div>`).join('')+(me>=30?`<div class="caRkR me"><b>${me+1}º</b><span>VOCÊ</span><em>${T[2](L[me][f])}</em></div>`:''):'<p class="twH">Ninguém ainda. Seja o primeiro!</p>'}
  const B=rkG('caBest',{});
  rkModal(`<div class="twM caRkM"><h3>🏆 RANKING DA CAÇA · LOBO NEGRO</h3><div class="caRkT">${CARK.map(x=>`<button data-f="${x[0]}" class="${x[0]===CARKT?'on':''}">${x[1]}</button>`).join('')}</div>
    <div class="caRkL">${rows}</div><p class="twH caRkMe">Seus recordes: 🐺 ${B.lv?CARK[0][2](B.lv):'—'} · ⚔️ ${B.dmg?rkFmtN(B.dmg):'—'} · 🎯 ${B.crt||'—'} · ⏱️ ${B.tt?CARK[3][2](B.tt):'—'} · 💍 ${caRingN(caRingBest())}</p>
    <p class="twH" style="font-size:.75em">O ranking atualiza quando você bate um recorde seu. Mais rápido = caçar os 10 níveis.</p><div class="row"><button class="btn" id="caTitB">🏅 TÍTULOS DA CAÇA</button><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('caTitB').onclick=caTits;document.querySelectorAll('#rkModal .caRkT button').forEach(b=>b.onclick=()=>{CARKT=b.dataset.f;rkSfx('whoosh');caRankH()})}
function caTits(){const tt=twTits();rkModal(`<div class="twM caRkM"><h3>🏅 TÍTULOS DA CAÇA</h3><div class="caTl">${Object.keys(CATIT).map(k=>{const T=CATIT[k],has=tt.includes(k);return `<div class="caTi ${has?'on':''}" style="--c:${T.c}"><i>${has?T.i:'🔒'}</i><div><b>${T.n}</b><span>${T.d}</span><small>✦ ${tbTxt(k)}</small></div>${has?`<button class="btn" data-k="${k}">${twTitOn()===k?'EM USO':'USAR'}</button>`:''}</div>`}).join('')}</div>
  <div class="row"><button class="btn" id="caBk">VOLTAR</button></div></div>`);$('caBk').onclick=caRankH;document.querySelectorAll('#rkModal .caTi button').forEach(b=>b.onclick=()=>{twLS.s('tw_titOn',b.dataset.k);try{twTitSync()}catch(e){}rkSfx('powerUp');caTits()})}
{const _h2=caH;caH=function(){return _h2.apply(this,arguments)+`<button class="hs caRkB" data-a="caRank" style="${rkB2(985,770,1125,872)}"><i>🏆</i><b>RANKING</b></button>`}}
{const _ac=rkAct;rkAct=function(a,b){if(a==='caRank'){rkSfx('whoosh');return caRank()}return _ac.apply(this,arguments)}}

/* v297: SAIR da caçada depois de vencer um nível (o que fez conta para o recorde, ranking e títulos) */
{const _bs=bcShow;bcShow=function(B){_bs.apply(this,arguments);const O=[...document.querySelectorAll('.bcO')].pop(),b=O&&O.querySelector('.bcSair');if(!b)return;
  b.onclick=e=>{e.stopPropagation();if(!O.classList.contains('pan'))return;BCQ.length=0;document.querySelectorAll('.bcO').forEach(x=>x.remove());G.hold=0;
    try{const o=G.p[1];o.bLv=B.L+1;o.ko=false;caEnd(0)}catch(x){}rkSfx('whoosh')}}}
TWCUP['fah9en']={nm:'30 JOIAS NEGRAS',jn:30};
/* v298: RECUPERAR CONTA (senha esquecida). Código de 1 uso (só o dono entrega): carrega o último salvamento da conta
   e pede uma SENHA NOVA; o próximo salvamento é assinado com a senha nova, então "ENTRAR" passa a funcionar com ela. */
TWCUP['zmyqa8']={nm:'RECUPERAR CONTA',it:[],rec:'Breno'};
{const _cp2=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];const r=await _cp2.apply(this,arguments);
  if(C&&C.rec&&E&&/\bok\b/.test(E.className)){localStorage.setItem('ac_rec',C.rec);E.textContent='🔑 Código aceito! Agora crie uma SENHA NOVA para a conta '+C.rec+'.';setTimeout(acRecOpen,700)}return r}}
function acRecOpen(){const nm=localStorage.getItem('ac_rec');if(!nm)return;
  acM(`<div class="twM sm"><h3>🔑 RECUPERAR CONTA</h3><p class="twH">Conta <b>${twEsc(nm)}</b>. Crie uma senha nova (e anote!). O progresso salvo da conta vai voltar para este aparelho.</p><input id="arP1" class="rkCdI" type="password" maxlength="32" placeholder="SENHA NOVA (mín. 4)"><input id="arP2" class="rkCdI" type="password" maxlength="32" placeholder="REPITA A SENHA"><p class="twH" id="arE"></p><div class="row"><button class="btn main" id="arGo">SALVAR SENHA NOVA</button></div></div>`);
  const E=document.getElementById('arE'),msg=(t,c)=>{E.className='twH '+(c||'');E.textContent=t},B=document.getElementById('arGo');
  B.onclick=async()=>{const p=document.getElementById('arP1').value,p2=document.getElementById('arP2').value;if(p.length<4)return msg('A senha precisa de pelo menos 4 letras/números.','err');if(p!==p2)return msg('As senhas não são iguais.','err');
    B.disabled=true;msg('Recuperando a conta...');try{const acc=await acId(nm),L=await acList(acc);if(!L.length){B.disabled=false;return msg('Conta não encontrada.','err')}const x=L[0],D=JSON.parse(x.d);
      for(const kk of Object.keys(localStorage))if(/^(tw_|rk_)/.test(kk))localStorage.removeItem(kk);for(const kk in D)localStorage.setItem(kk,D[kk]);
      const n2=(()=>{try{return JSON.parse(D.tw_nome)}catch(e){return nm}})()||nm,k=await acKey(n2,p);localStorage.setItem('ac_k',k);localStorage.setItem('ac_n',n2);localStorage.removeItem('ac_h');
      const ok=await acSave(1);if(!ok){B.disabled=false;return msg(rkNetMsg()+' Tenta de novo.','err')}localStorage.removeItem('ac_rec');msg('✔ Conta recuperada! Use a senha nova para entrar. Recarregando...','ok');setTimeout(()=>location.reload(),1500)}
    catch(e){B.disabled=false;msg(rkNetMsg()+' Tenta de novo.','err')}}}
setTimeout(()=>{try{if(localStorage.getItem('ac_rec'))acRecOpen()}catch(e){}},3000);
/* v299: mais 2 contas para recuperar (texto do código só com o dono) */
TWCUP['170s7ti']={nm:'RECUPERAR CONTA',it:[],rec:'Vini_junior10'};TWCUP['1db5so5']={nm:'RECUPERAR CONTA',it:[],rec:'xdarwinzinn'};
/* v300: Shaka de presente (1 pessoa no jogo todo; texto do código só com o dono) */
TWCUP['jo9vs1']={nm:'SHAKA DE VIRGEM',it:[],chr:'shaka'};
/* v302: TÍTULO ADM NOVO — "ADMINISTRADOR" divino/galáctico: galáxia girando, ouro pulsando, rachaduras que se espalham (quebrando a realidade), estilhaços e glitch */
const ADMCK=['M0,30 L38,26 L62,34 L90,22 L118,31','M400,28 L366,33 L340,24 L312,35 L290,27','M120,0 L128,14 L119,24 L131,36','M282,60 L274,46 L286,37 L276,24','M200,0 L196,10 L206,17','M210,60 L214,50 L203,44','M60,0 L66,12 L56,20','M340,60 L334,49 L345,41'];
const ADMOUT=['M0,30 L-30,24 L-55,34 L-80,20','M400,30 L430,36 L452,25 L478,38','M90,0 L84,-14 L96,-26','M310,60 L318,74 L306,88','M30,60 L22,72 L34,84','M370,0 L378,-12 L368,-24'];
{const _pt5=pfTitH;pfTitH=function(t,n,adm){if(t!=='adm'||!adm)return _pt5.apply(this,arguments);
  const ck=(L,c)=>L.map((d,i)=>`<path class="${c}" d="${d}" style="animation-delay:${(i*.37).toFixed(2)}s"/>`).join('');
  return `<span class="pfAdmG"><i class="bg"><i class="gx"></i><i class="neb"></i><i class="st"></i><i class="ring"></i><svg class="ck" viewBox="0 0 400 60" preserveAspectRatio="none">${ck(ADMCK,'c')}</svg><i class="sw"></i></i><svg class="ck out" viewBox="-100 -40 600 140" preserveAspectRatio="none">${ck(ADMOUT,'o')}</svg>
  <i class="cr">♛</i><b data-t="ADMINISTRADOR">ADMINISTRADOR</b>${[1,2,3,4,5,6].map(i=>`<i class="sh s${i}"></i>`).join('')}<i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✦</i><i class="sp d">✦</i></span>`}}
/* v303: código de 1 pessoa: PASSE MÁXIMO (passe prêmio/elite + nível 20) + 18.000 💎 (texto do código só com o dono) */
TWCUP['gs2l5f']={nm:'PASSE MÁXIMO + 18.000 💎',it:[],bpx:1,gx:18000};
{const _cp3=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];const r=await _cp3.apply(this,arguments);
  if(C&&(C.bpx||C.gx)&&E&&/\bok\b/.test(E.className)){try{if(C.bpx){bpUnlock(2);const o=bpG();o.xp=Math.max(o.xp|0,20*BPS.xpL);bpS(o)}if(C.gx)rkAdd('gem',C.gx);acSave(1)}catch(e){}
    E.textContent='👑 Código aceito! PASSE MÁXIMO liberado (nível 20)'+(C.gx?' + '+rkFmtN(C.gx)+' 💎':'')+'! Abra o Passe de Batalha para pegar os prêmios.';try{rkSfx('boom')}catch(e){}}return r}}
/* v304: código de 1 pessoa: PASSE FULL (passe prêmio + nível 20), sem gemas extras */
TWCUP['2rq1y4']={nm:'PASSE FULL',it:[],bpx:1};
/* v306: código de 1 pessoa: 70.000 💎 (texto só com o dono) */
TWCUP['h5wrl3']={nm:'70.000 DIAMANTES',gem:70000};
/* v307: código SEM SERVIDOR e SEM CONTA (off:1): confere só no aparelho (1 vez por aparelho). O de 70.000 💎 passa a ser assim. */
TWCUP['h5wrl3'].off=1;
{const _cp4=twCupom;twCupom=async function(code,E){const h=twHash(String(code).toUpperCase()),C=TWCUP[h];if(!C||!C.off)return _cp4.apply(this,arguments);
  const used=twLS.g('tw_cup',{});if(used[h]){E.className='twH err';E.textContent='Você já usou esse código.';return true}used[h]=1;twLS.s('tw_cup',used);
  let t='🎁 Código aceito! '+C.nm;
  if(C.gem>0){const gq=C.gem;rkAdd('gem',gq);t='🎁 Código aceito! +'+rkFmtN(gq)+' 💎'}
  if(C.chr){const own=rkG('own',['goku']);if(!own.includes(C.chr)){own.push(C.chr);rkS('own',own)}t='🎁 Código aceito! Você ganhou o '+C.nm+'!'}
  if(C.bpx){try{bpUnlock(2);const o=bpG();o.xp=Math.max(o.xp|0,20*BPS.xpL);bpS(o)}catch(e){}}if(C.gx)rkAdd('gem',C.gx);
  try{acSave(1)}catch(e){}E.className='twH ok';E.textContent=t;try{twSfx('powerUp');setTimeout(()=>twSfx('boom'),300)}catch(e){}return true}}

/* v308: servidor no LIMITE DE LEITURAS do dia (erro 429) — avisar certo em vez de "sem internet" */
function rkNetMsg(){try{if(Date.now()<RKQ429)return '⏳ O servidor chegou no limite de hoje (rankings, chat e entrar na conta voltam às 05:00 de Brasília). O jogo funciona normal.'}catch(e){}return 'Sem internet agora.'}
/* v309: servidor novo (Cloudflare D1): quem já está logado no aparelho tem a conta copiada sozinha (salvamento assinado com a mesma senha) */
setTimeout(()=>{try{if(!/\/fs\/v1\//.test(TWURL))return;if(localStorage.getItem('ac_k')&&localStorage.getItem('ac_n')&&!localStorage.getItem('ac_mig309')){localStorage.removeItem('ac_h');acSave(1).then(ok=>{if(ok)localStorage.setItem('ac_mig309','1')})}}catch(e){}},8000);
/* v310: servidor novo começou vazio → cada jogador manda o rank atual (e os recordes da Caça) 1 vez ao abrir o jogo, para o ranking encher na hora */
setTimeout(()=>{try{if(!/\/fs\/v1\//.test(TWURL)||rkG('pub310',0))return;const n=twLS.g('tw_nome','');if(!n)return;const IV=v=>({integerValue:String(Math.max(0,Math.round(v||0)))}),rp=rkG('rp',0);
  const f={nome:{stringValue:String(n).slice(0,16)},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},tit:{stringValue:twTitOn()},rp:IV(rp),lv:IV(rkRank(rp)),char:{stringValue:rkG('sel','goku')},v:IV(310)};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).then(r=>{if(r.ok)rkS('pub310',1)}).catch(()=>{});
  const B=rkG('caBest',null);if(B&&(B.lv||B.dmg))caSend(B);try{pfPub(1)}catch(e){}}catch(e){}},6000);
/* v310: servidor novo começou vazio — cada jogador que abre o jogo manda 1 vez o seu RANK atual (e os recordes da Caça) para o ranking voltar a encher na hora */
setTimeout(()=>{try{if(!/\/fs\/v1\//.test(TWURL)||localStorage.getItem('rk_rksync310'))return;if(!twLS.g('tw_nome',''))return;
  rkSend({rp:rkG('rp',0),dmg:0,t1:0,tt:0,won:0});localStorage.setItem('rk_rksync310','1')}catch(e){}},6000);
/* v311: dono: o ranking do RANK continua (vem do celular de cada um); os OUTROS rankings (Boss dano/tempo, Caça, Torre) começam do zero.
   Caça: recordes guardados no aparelho zeram 1 vez e só contam documentos da v311 em diante. */
try{if(!localStorage.getItem('rk_carst311')){rkS('caBest',{});localStorage.setItem('rk_carst311','1')}}catch(e){}
/* v312: conta que ainda não está no servidor novo → busca no Firebase antigo (só na hora de ENTRAR/recuperar). Depois de entrar, o salvamento vai para o servidor novo. */
{const _al=acList;acList=async function(acc){const L=await _al.apply(this,arguments);if(L.length||!/\/fs\/v1\//.test(TWURL))return L;
  try{const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:'sv'},op:'EQUAL',value:{stringValue:acc}}},orderBy:[{field:{fieldPath:'__name__'},direction:'DESCENDING'}],limit:15}};
    const r=await fetch('https://firestore.googleapis.com/v1/projects/'+TWFB.projectId+'/databases/(default)/documents:runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)return L;
    return (await r.json()).filter(x=>x.document).map(x=>{const f=x.document.fields||{};return {ts:+((f.ts||{}).integerValue||0),d:(f.d||{}).stringValue||'',sg:(f.sg||{}).stringValue||''}}).sort((a,b)=>b.ts-a.ts)}catch(e){return L}}}
/* ================= v313/v314: BOTS (ideia dos amigos do dono: ter com quem competir). Para tirar: BOTON=false. =================
   v314 (pedido do dono): nomes novos, jogam como gente NORMAL (medianos; alguns se esforçam mais), sobem rank só enquanto estão ONLINE
   (cada um fica online 1 ou 2 horas, sai 1 hora e volta), e NUNCA passam o 1º, 2º e 3º lugar dos jogadores de verdade (em nenhum ranking).
   Aparecem no ranking do RANK, do Boss (dano/tempo/1ª fase), da Caça e no contador de online. Não abrem perfil. Nada vai para o servidor. */
const BOTON=true,BOT0=Date.UTC(2026,10,10,23,0);
/* [nome, XP inicial, XP por hora online, horas online por vez (1 ou 2), deslocamento em minutos] */
const BOTS=[['Samuel pera',6200,70,2,0],['Rangel',4100,55,1,40],['Goku black32',15800,140,2,90],['Tatayra',8800,80,1,15],['Marcos56',3000,50,2,120],
  ['Ninguém',11200,95,1,70],['Furiosos',17500,150,2,30],['Darkalfe',9900,85,2,150],['Andtref',5300,60,1,100],['Andares',2400,45,1,55],
  ['Thzin',7200,65,2,170],['Vitin_God',12900,120,1,25],['NightFox',4700,55,2,140],['Lipe_Zero',3600,50,1,85],['Davizao',6800,70,2,10]];
const botR=(i,s)=>{let h=2166136261^(i*7919+s*104729);h=Math.imul(h^(h>>>13),16777619);h^=h>>>15;return (h>>>0)/4294967296};
/* minutos online desde o começo e se está online agora (ciclo: on horas online + 1 hora fora) */
function botOn(i){const B=BOTS[i],on=B[3]*60,cyc=on+60,t=Math.max(0,(Date.now()-BOT0)/6e4+B[4]),k=Math.floor(t/cyc),r=t-k*cyc;return {now:r<on,min:k*on+Math.min(r,on)}}
function botList(real){if(!BOTON)return [];real=real||[];const ids=Object.keys(CH||{}).filter(k=>!/adm|treino|cpu/i.test(k)),N=ids.length||1;
  const R=real.filter(e=>!e.bot).map(e=>e.rp||0).sort((a,b)=>b-a),cap=R.length>=3?R[2]-40:R.length?Math.max(0,R[R.length-1]-40):30000;
  return BOTS.map(([nome,rp0,ph],i)=>{const o=botOn(i);let rp=Math.round(rp0+ph*o.min/60*(.85+.3*botR(i,Math.floor(o.min/600))));rp=Math.max(0,Math.min(rp,cap-i*9));const lvl=rkRank(rp);
    const b={bot:1,nome,uid:'',tit:'',rp,char:ids[Math.floor(botR(i,1)*N)]||'goku',ct:0,on:o.now,
      dmg:Math.round(4000+lvl*2000+botR(i,2)*4000),tt:Math.round(300-lvl*14-botR(i,3)*40),t1:Math.round(140-lvl*7-botR(i,4)*20),
      clv:Math.min(9,1+Math.floor(lvl*.7+botR(i,5)*2)),cdm:Math.round(15000+lvl*22000+botR(i,6)*30000),ccr:Math.round(8+lvl*5+botR(i,7)*12),ctt:0,crg:0};
    const c=b.clv>=7&&botR(i,10)<.35?3:b.clv>=5?2:b.clv>=3?1:0;b.crg=c*10+Math.floor(botR(i,11)*5)+1;return b})}
/* nunca na frente do 3º lugar de verdade: ajusta cada medida ao 3º jogador real */
function botCap(L,f,hi){const R=L.filter(e=>!e.bot&&e[f]>0).map(e=>e[f]).sort((a,b)=>hi?b-a:a-b);if(R.length<3)return L;const lim=R[2];
  let j=0;for(const e of L)if(e.bot&&e[f]>0){j++;const q=botR(j,f.length);if(hi&&e[f]>=lim)e[f]=Math.max(1,Math.floor(lim*(.78+.17*q)));if(!hi&&e[f]<=lim)e[f]=Math.round(lim*(1.08+.2*q))}return L}
{const _lr=rkLoadRk;rkLoadRk=async function(tab){const A=await _lr.apply(this,arguments);const L=A.concat(botList(A));botCap(L,'dmg',1);botCap(L,'tt',0);botCap(L,'t1',0);return L}}
{const _cr=caRank;caRank=async function(){await _cr.apply(this,arguments);if(Array.isArray(CARKL)){const real=CARKL.filter(e=>!e.bot);CARKL=real.concat(botList([]).map(b=>({nome:b.nome,uid:'',tit:'',bot:1,clv:b.clv,cdm:b.cdm,ccr:b.ccr,ctt:b.ctt,crg:b.crg})));
  botCap(CARKL,'clv',1);botCap(CARKL,'cdm',1);botCap(CARKL,'ccr',1);botCap(CARKL,'ctt',0);botCap(CARKL,'crg',1);caRankH()}}}
{const _on=rkOnline;rkOnline=async function(){await _on.apply(this,arguments);if(!BOTON)return;const E=$('rkOnN');if(!E)return;const n=parseInt(String(E.textContent).replace(/\D/g,''))||0;E.textContent=rkFmtN(n+BOTS.filter((b,i)=>botOn(i).now).length)}}
/* v314: bots com PERFIL (pedido do dono): tocar no nome abre perfil com rank atual e máximo, personagem no pedestal, itens na vitrine,
   nível de habilidade e histórico — tudo calculado a partir do rank/tempo online do bot, para o jogo parecer mais vivo. */
{const _bl=botList;botList=function(real){return _bl.apply(this,arguments).map((b,i)=>Object.assign(b,{uid:'bt'+(9301+i*37).toString(36)+'x'+i}))}}
function botProf(uid){const L=botList([]),i=L.findIndex(b=>b.uid===uid);if(i<0)return null;const b=L[i],lvl=rkRank(b.rp),o=botOn(i),hrs=o.min/60;
  const rar=lvl<=2?'rara':lvl<=4?'epica':lvl<=6?'lend':'mit',T=['esp','arm','cap','bot'];
  const vit=[0,1,2].map(k=>k<1+Math.floor(botR(i,20)*3)?{t:T[(i+k)%4],r:k===0&&lvl>=5&&botR(i,21)<.5?'mit':rar,v:4+lvl+Math.floor(botR(i,22+k)*4),nm:'',img:'',uniq:0,crit:k===2?Math.floor(botR(i,25)*6):0,dmg:0,vel:0,st:0,def:0,fdmg:0,trf:0,ps:null,drop:0,yt:0,ysec:0}:null);
  const pt=Math.round(40+hrs*9+lvl*25),vw=Math.round(pt*(.45+lvl*.03+botR(i,30)*.08)),R=[['CRÍTICO',30+lvl*6],['DANO',28+lvl*6.5],['VELOCIDADE',35+lvl*5],['RANK',12+lvl*8],['COMBO',25+lvl*6],['FARM',20+hrs*.4]].map(([n,v],k)=>({n,v:Math.max(4,Math.min(96,Math.round(v+botR(i,40+k)*12-6))),t:''}));
  return {uid,mold:'',nome:b.nome,tit:'',rp:b.rp,mx:Math.min(RKTOP,lvl+(botR(i,31)<.3?1:0)),foto:'',vit,ped:CH[b.char]?b.char:'goku',R,
    h:{pt,vw,tw:Math.round(hrs*1.5+lvl*4),twc:Math.round(lvl*1.2+hrs*.2),twf:Math.round(hrs*6+lvl*15),wins:Math.round(vw*.55),loss:Math.round((pt-vw)*.55),own:Math.min(25,3+lvl*2+Math.floor(botR(i,32)*4)),tt:b.tt,rl:Math.max(-1,lvl-1)}}}
{const _po=pfOpenOther;pfOpenOther=async function(uid,nome,ret){if(BOTON&&/^bt/.test(uid||'')){const D=botProf(uid);if(D){if(ret.sc==='tower'){try{twModal(null)}catch(e){}showScreen('ranked')}else rkModal(null);rkToast('⏳ Carregando perfil...','#cfd6ea');await new Promise(r=>setTimeout(r,350+Math.random()*400));PFO=D;PFRET=ret;return rkView('pf')}}return _po.apply(this,arguments)}}

/* ================= v315: EVENTO DA CAÇA AO VIVO — 10/11/2026 21:15 até 21:30 (Brasília) =================
   Durante o evento: anéis da Caça com chance de cor rara 3x. Quem participar (terminar uma caçada no horário) ganha ANEL AMARELO SS de Dano.
   Ranking do evento = quem foi mais longe (desempate: mais dano). 1º: ANEL PRETO 75.000 anos nota S de Dano · 2º e 3º: ANEL PRETO 75.000 anos nota A de Dano.
   Prêmios automáticos ao abrir o jogo depois do fim (1 vez por aparelho/conta). Bots não participam. */
const CEV={id:'cev1115',ini:Date.UTC(2026,10,11,0,15),fim:Date.UTC(2026,10,11,0,30)};
function cevOn(){const t=Date.now();return t>=CEV.ini&&t<CEV.fim}
const cevMin=ms=>{const m=Math.max(0,Math.ceil(ms/6e4));return m+' min'};
function cevSend(lv,dmg){const n=twLS.g('tw_nome','');if(!n)return;const IV=v=>({integerValue:String(Math.max(0,Math.round(v||0)))});
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{nome:{stringValue:String(n).slice(0,16)},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},cev:{stringValue:CEV.id},clv:IV(lv),cdm:IV(dmg),v:IV(315)}})}).catch(()=>{})}
{const _ce3=caEnd;caEnd=function(w){const t=Date.now(),o=G.p&&G.p[1],won=!!(o&&o.ko&&(o.bLv||1)>=10),lv=won?10:Math.max(0,((o&&o.bLv)||1)-1),dmg=Math.round(CA.dmg||0);
  const r=_ce3.apply(this,arguments);try{if(t>=CEV.ini&&t<CEV.fim+3*6e4){localStorage.setItem(CEV.id+'_part','1');cevSend(lv,dmg);setTimeout(()=>{try{rkToast('🔥 Caçada do EVENTO registrada! Prêmios no fim (21:30)','#ffb347')}catch(e){}},2500)}}catch(e){}return r}}
async function cevRank(){const L=await rkQ('cev',CEV.id,2000),M={};for(const e of L){if(!e.uid)continue;const m=M[e.uid]||(M[e.uid]={uid:e.uid,nome:e.nome,lv:0,dmg:0});if((e.clv|0)>m.lv||((e.clv|0)===m.lv&&(e.cdm|0)>m.dmg)){m.lv=e.clv|0;m.dmg=e.cdm|0}m.nome=e.nome}
  return Object.values(M).sort((a,b)=>b.lv-a.lv||b.dmg-a.dmg)}
function cevRing(c,g,a){return anGive({i:Date.now().toString(36)+Math.random().toString(36).slice(2,6),c,g,s:'dano',v:ANV[c][g],a:a||0})}
async function cevClaim(){if(Date.now()<CEV.fim+60e3)return;const K=CEV.id+'_cl';if(localStorage.getItem(K))return;localStorage.setItem(K,'1');let msg=[];
  try{if(localStorage.getItem(CEV.id+'_part')){cevRing(1,6);msg.push('💍 ANEL AMARELO SS (Dano) por participar')}
    const R=await cevRank(),i=R.findIndex(e=>e.uid===twUid());if(i===0){cevRing(3,5,75000);msg.push('🥇 1º LUGAR: ANEL PRETO 75.000 anos nota S (Dano)')}else if(i===1||i===2){cevRing(3,4,75000);msg.push((i===1?'🥈 2º':'🥉 3º')+' LUGAR: ANEL PRETO 75.000 anos nota A (Dano)')}
  }catch(e){localStorage.removeItem(K);return}
  if(msg.length){try{acSave(1)}catch(e){}rkModal(`<div class="twM gold"><h3>🔥 PRÊMIOS DO EVENTO DA CAÇA</h3>${msg.map(m=>`<p class="twH" style="font-size:1.05em">${m}</p>`).join('')}<p class="twH">Os anéis já estão na aba Anéis (Biblioteca).</p><div class="row"><button class="btn main" id="rkMX">PEGAR!</button></div></div>`);try{rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),300)}catch(e){}$('rkMX').onclick=()=>rkModal(null)}}
setTimeout(()=>{try{cevClaim()}catch(e){}},7000);setInterval(()=>{try{if(Date.now()>CEV.fim+60e3&&Date.now()<CEV.fim+7*864e5&&showScreen.cur==='ranked'&&!$('rkModal').innerHTML)cevClaim()}catch(e){}},30000);
/* faixa do evento na tela da Caça */
{const _h3=caH;caH=function(){const t=Date.now();let b='';if(t<CEV.fim+3600e3&&t>CEV.ini-6*3600e3){const on=cevOn(),fut=t<CEV.ini;
  b=`<button class="hs cevB ${on?'on':''}" data-a="cevInfo" style="${rkB2(400,92,1120,170)}"><b>🔥 EVENTO DA CAÇA ${fut?'· COMEÇA ÀS 21:15':on?'· AO VIVO · ACABA EM '+cevMin(CEV.fim-t):'· ACABOU'}</b><small>anel raro 3x · participe = Anel SS · Top 3 = Anel Preto 75 mil anos</small></button>`}
  return _h3.apply(this,arguments)+b}}
function cevInfo(){const t=Date.now();rkModal(`<div class="twM gold"><h3>🔥 EVENTO DA CAÇA AO VIVO</h3><p class="twH">📅 Hoje das <b>21:15</b> às <b>21:30</b> (Brasília) · ${t<CEV.ini?'começa em '+cevMin(CEV.ini-t):cevOn()?'<b style="color:#ff6a3a">AO VIVO</b> · acaba em '+cevMin(CEV.fim-t):'acabou'}</p>
  <p class="twH">🍀 Anéis da Caça com chance de cor rara <b>3x</b>.<br>💍 Participou (terminou uma caçada no horário) = <b>ANEL AMARELO nota SS de Dano</b>.<br>🥇 1º lugar: <b>ANEL PRETO 75.000 anos nota S de Dano</b><br>🥈🥉 2º e 3º: <b>ANEL PRETO 75.000 anos nota A de Dano</b></p>
  <p class="twH">Ranking: quem foi mais longe (desempate: mais dano). Os prêmios caem sozinhos quando você abrir o jogo depois das 21:30.</p><div class="caRkL" id="cevL"><p class="twH">Carregando...</p></div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null);
  cevRank().then(R=>{const E=$('cevL');if(!E)return;E.innerHTML=R.length?R.slice(0,20).map((e,i)=>`<div class="caRkR ${e.uid===twUid()?'me':''} p${i+1}"><b>${i<3?['🥇','🥈','🥉'][i]:i+1+'º'}</b><span>${twEsc(e.nome||'?')}</span><em>${e.lv>=10?'👑 10 NÍVEIS':'NÍVEL '+e.lv} · ${rkFmtN(e.dmg)}</em></div>`).join(''):'<p class="twH">Ninguém ainda. Seja o primeiro!</p>'}).catch(()=>{const E=$('cevL');if(E)E.innerHTML='<p class="twH err">'+rkNetMsg()+'</p>'})}
{const _ac2=rkAct;rkAct=function(a,b){if(a==='cevInfo'){rkSfx('whoosh');return cevInfo()}return _ac2.apply(this,arguments)}}
/* ================= v316: ANÉIS DA ALMA NO CHÃO, EM VOLTA DO PERSONAGEM (estilo pedido pelo dono) =================
   Em qualquer tela onde o personagem aparece EM PÉ (perfil, equipamentos, nível, biblioteca...): os anéis equipados nele ficam em volta dos pés,
   um dentro do outro (o primeiro anel é o de dentro), metade atrás e metade na frente do corpo, pulsando com a cor/brilho do anel,
   com ondas de energia saindo pelo chão e de vez em quando um anel subindo pelo corpo. No perfil dos outros aparecem os anéis DELES (vão no perfil público). */
const SRC2ID=()=>{const M={};try{for(const id in CH){const s=fullSrc(id);if(s)M[s]=id}}catch(e){}return M};
function anOfChar(id){try{const L=anL();return anEq(id).map(i=>i&&L.find(z=>z.i===i)).filter(Boolean).map(r=>({c:r.c,g:r.g,l:anLvl(r),k:anGl(r)}))}catch(e){return []}}
/* perfil público leva os anéis do personagem do pedestal */
{const _pm=pfMine;pfMine=function(){const D=_pm.apply(this,arguments);try{D.an=anOfChar(CH[D.ped]?D.ped:'goku').slice(0,8)}catch(e){}return D}}
{const _pc=pfClean;pfClean=function(o,uid,nome){const D=_pc.apply(this,arguments);try{D.an=(Array.isArray(o.an)?o.an:[]).slice(0,8).map(r=>({c:Math.max(0,Math.min(4,r.c|0)),g:Math.max(0,Math.min(7,r.g|0)),l:Math.max(1,Math.min(50,r.l|0)),k:Math.max(0,Math.min(5,r.k|0))}))}catch(e){D.an=[]}return D}}
/* v317/v318: anéis EMPILHADOS (do chão até a cabeça, espaço igual), cada um GIRANDO devagar no lugar (3D).
   v318: cada anel CENTRALIZADO no corpo na altura dele e com a largura do corpo naquela altura (+ folga, sem encostar) — mede a silhueta do personagem. */
const ANSIL={};
function anSil(img){const k=img.getAttribute('src');if(ANSIL[k])return ANSIL[k];try{const H=120,W=Math.max(8,Math.round(H*img.naturalWidth/img.naturalHeight)),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(img,0,0,W,H);
  const d=x.getImageData(0,0,W,H).data,R=[];for(let y=0;y<H;y++){let mn=-1,mx=-1,sx=0,n=0;for(let i=0;i<W;i++){if(d[(y*W+i)*4+3]>60){if(mn<0)mn=i;mx=i;sx+=i;n++}}R.push(n?{c:sx/n/W,l:mn/W,r:(mx+1)/W}:null)}
  let top=0;while(top<H&&!R[top])top++;let bot=H-1;while(bot>0&&!R[bot])bot--;return ANSIL[k]={R,top:top/H,bot:(bot+1)/H}}catch(e){return null}}
function anFtHTML(R,P){let b='',f='';R.forEach((r,k)=>{const {x,y,w}=P[k],col=ANC[r.c][1];
  const sty=`width:${w}px;height:${w}px;left:${Math.round(x-w/2)}px;top:${Math.round(y-w/2)}px;--c:${col};--k:${Math.max(1,r.k||1)}`,dl=`animation-delay:${(-k*1.7).toFixed(2)}s;animation-duration:${(13+k*1.3).toFixed(1)}s${k%2?';animation-direction:reverse':''}`;
  const ring=`<i class="sp" style="${dl}"><img src="${RQA.anel2[r.c]}" alt=""></i>`;b+=`<i class="ar" style="${sty}">${ring}</i>`;f+=`<i class="ar" style="${sty}">${ring}</i>`});
  const p0=P[0],ww=Math.round(p0.w*1.25);return [`<i class="aw" style="left:${Math.round(p0.x)}px;top:${Math.round(p0.y)}px;width:${ww}px;height:${Math.round(ww*.3)}px;--c:${ANC[R[0].c][1]}"></i>`+b,f]}
function anDecor(){try{const M=SRC2ID(),H=innerHeight;document.querySelectorAll('#rkWrap img,#rkModal img,#twMe img').forEach(img=>{const id=M[img.getAttribute('src')];if(!id)return;
  const Pa=img.parentElement;if(!Pa||img.closest('.pfMold,.rkCard,.eqI,.anCell,button.lk'))return;
  if(!img.complete||!img.naturalWidth){img.addEventListener('load',()=>setTimeout(anDecor,30),{once:true});return}
  const bw=img.offsetWidth,bh=img.offsetHeight;if(bh<H*.28)return;
  const inPf=!!img.closest('.pfPed'),R=inPf&&PFO?(PFO.an||[]):anOfChar(id);Pa.querySelectorAll(':scope>.anFt').forEach(x=>x.remove());if(!R.length)return;
  const ar=img.naturalWidth/img.naturalHeight,ch=Math.min(bh,bw/ar),cw=ch*ar,ox=img.offsetLeft+(bw-cw)/2,oy=img.offsetTop+bh-ch,S=anSil(img);
  const top=S?S.top:0,bot=S?S.bot:1,n=R.length,P=[];
  for(let k=0;k<n;k++){const t=n>1?k/(n-1):0,fy=bot-.02-(bot-top)*.9*t;let c=.5,l=.3,rr=.7;
    if(S){const r0=Math.round(fy*S.R.length);let sc=0,sl=1,sr=0,m=0;for(let q=r0-6;q<=r0+6;q++){const e=S.R[q];if(!e)continue;sc+=e.c;sl=Math.min(sl,e.l);sr=Math.max(sr,e.r);m++}if(m){c=sc/m;l=sl;rr=sr}}
    const half=Math.max(c-l,rr-c)*cw,w=Math.round(Math.max(cw*.55,Math.min(cw*1.6,half*2*1.3+ch*.06)));P.push({x:ox+c*cw,y:oy+fy*ch,w})}
  {const md=P.map(p=>p.w).sort((a,b)=>a-b)[Math.floor(n/2)];for(const p of P)p.w=Math.round(Math.min(p.w,md*1.18,cw*1.25))}
  const cs=getComputedStyle(Pa);if(cs.position==='static')Pa.style.position='relative';const [hb,hf]=anFtHTML(R,P);
  const B=document.createElement('div'),F=document.createElement('div');B.className='anFt b';F.className='anFt f';for(const E of [B,F]){E.style.left='0px';E.style.top='0px';E.style.setProperty('--ch',Math.round(ch)+'px')}
  B.innerHTML=hb;F.innerHTML=hf;Pa.insertBefore(B,img);img.after(F);img.classList.add('anOn')})}catch(e){}}
{const _v=rkView;rkView=function(){const r=_v.apply(this,arguments);setTimeout(anDecor,80);setTimeout(anDecor,700);return r}}
{const _m=rkModal;rkModal=function(h){const r=_m.apply(this,arguments);if(h)setTimeout(anDecor,80);return r}}
addEventListener('resize',()=>setTimeout(anDecor,200));
/* equipar os anéis pelo PERFIL: botão no seu perfil abre os anéis do personagem do pedestal */
{const _h=pfH;pfH=function(){let h=_h.apply(this,arguments);if(PFO)return h;try{const ped=CH[pfCur().ped]?pfCur().ped:'goku';h+=`<button class="hs pfAnB" data-a="pfAnEq" data-c="${ped}" style="${rkB2(1390,22,1640,74)}">💍 ANÉIS DA ALMA</button>`}catch(e){}return h}}
{const _ac3=rkAct;rkAct=function(a,b){if(a==='pfAnEq'){AN.ch=b.dataset.c;rkView('lib');try{rkLibTab('an')}catch(e){}return}return _ac3.apply(this,arguments)}}

/* ================= v319: ANÉIS NO CHÃO, UM DENTRO DO OUTRO (igual à imagem do dono) =================
   Todos deitados no chão em volta dos pés, atrás do personagem (ele fica em pé em cima). Ordem pela RARIDADE: o mais raro é o maior (por fora),
   os 3 mais fracos ficam bem pequenos perto dos pés. Girando devagar no lugar. Brilho mais fraco para não ficar estranho. */
function anGround(R,cx,cy,cw){const L=R.map((r,i)=>({r,i})).sort((a,b)=>(a.r.c-b.r.c)||(a.r.g-b.r.g)),n=L.length,small=Math.min(3,Math.max(0,n-2));let h='';
  L.forEach(({r},k)=>{const w=Math.round(cw*(k<small?.42+k*.13:.95+(n-small>1?(k-small)/(n-small-1):1)*1.55)),col=ANC[r.c][1];
    const hh=Math.round(w*.32);h+=`<i class="ag" style="width:${w}px;height:${hh}px;left:${Math.round(cx-w/2)}px;top:${Math.round(cy-hh/2)}px;--c:${col}"><i class="sp" style="animation-delay:${(-k*1.3).toFixed(1)}s">${anRingSvg(r,k)}</i></i>`});return h}
/* anel desenhado (linha fina + espinhos, igual à imagem do dono): o espinho gira em volta = anel girando no lugar */
function anRingSvg(r,k){const col=ANC[r.c][1],hi=['#ffffff','#fff3b0','#f0d8ff','#d8c8ff','#ffd0d0'][r.c],N=10+r.c*3+(r.g>=5?4:0),dur=(22+k*3).toFixed(0),dir=k%2?-1:1;let sp='';
  for(let i=0;i<N;i++){const a=i/N*360,big=i%(r.c>=3?2:3)===0;sp+=`<path d="M-2.2,0 L0,-${big?11:6} L2.2,0 L0,${big?5:3}Z" transform="rotate(${a}) translate(0,-46)" fill="${hi}" opacity="${big?1:.75}"/>`}
  return `<svg viewBox="-60 -60 120 120" preserveAspectRatio="none"><g fill="none"><circle r="46" stroke="${col}" stroke-width="2.6"/><circle r="46" stroke="${hi}" stroke-width=".9"/><circle r="40.5" stroke="${col}" stroke-width=".7" opacity=".55" stroke-dasharray="2 3"/></g><g>${sp}<animateTransform attributeName="transform" type="rotate" from="0" to="${360*dir}" dur="${dur}s" repeatCount="indefinite"/></g></svg>`}
anDecor=function(){try{const M=SRC2ID(),H=innerHeight;document.querySelectorAll('#rkWrap img,#rkModal img,#twMe img').forEach(img=>{const id=M[img.getAttribute('src')];if(!id)return;
  const Pa=img.parentElement;if(!Pa||img.closest('.pfMold,.rkCard,.eqI,.anCell,button.lk'))return;
  if(!img.complete||!img.naturalWidth){img.addEventListener('load',()=>setTimeout(anDecor,30),{once:true});return}
  const bw=img.offsetWidth,bh=img.offsetHeight;if(bh<H*.28)return;
  const inPf=!!img.closest('.pfPed'),R=inPf&&PFO?(PFO.an||[]):anOfChar(id);Pa.querySelectorAll(':scope>.anFt').forEach(x=>x.remove());if(!R.length)return;
  const ar=img.naturalWidth/img.naturalHeight,ch=Math.min(bh,bw/ar),cw=ch*ar,ox=img.offsetLeft+(bw-cw)/2,oy=img.offsetTop+bh-ch,S=anSil(img);
  let cx=ox+cw/2,fy=1;if(S){fy=S.bot;const r0=Math.round(S.bot*S.R.length)-1;let sc=0,m=0;for(let q=r0-8;q<=r0;q++){const e=S.R[q];if(e){sc+=(e.l+e.r)/2;m++}}if(m)cx=ox+sc/m*cw}
  const cy=oy+fy*ch-ch*.01,cs=getComputedStyle(Pa);if(cs.position==='static')Pa.style.position='relative';
  const B=document.createElement('div');B.className='anFt b g';B.style.left='0px';B.style.top='0px';B.innerHTML=anGround(R,cx,cy,Math.min(cw,ch*.55));Pa.insertBefore(B,img);img.classList.add('anOn')})}catch(e){}};

/* ================= v320: ANÉIS MAIS FORTES (pedido do dono, imagem de referência) =================
   Vermelho vivo e grosso com espinhos grandes (estilo arame farpado), preto BEM preto, roxo BEM roxo,
   brilho maior e o anel inteiro girando devagar no lugar (cada um num sentido). */
const ANRP=[{m:'#ffffff',h:'#ffffff',g:'#bfe2ff'},{m:'#ffc400',h:'#fff3a8',g:'#ffae00'},{m:'#8f00ff',h:'#e3b0ff',g:'#9a10ff'},{m:'#030104',h:'#3d2950',g:'#2a0a3a'},{m:'#ff0a1e',h:'#ffb0b0',g:'#ff0018'}];
anRingSvg=function(r,k){const P=ANRP[r.c]||ANRP[0],red=r.c===4,blk=r.c===3,N=10+r.c*2+(r.g>=5?2:0),dur=(40+k*6).toFixed(0),dir=k%2?-1:1;let sp='';
  const L=red?10:blk?8:r.c===2?8:6;
  for(let i=0;i<N;i++){const a=i/N*360,big=i%2===0,len=big?L:L*.5;
    sp+=`<path d="M-3,0 L0,-${len} L3,0 L0,${big?5:3}Z" transform="rotate(${a}) translate(0,-48.5)" fill="${P.m}" stroke="${P.h}" stroke-width="${blk?.5:.6}"/>`;
    if(false)sp+=`<path d="M-1.6,0 L0,6 L1.6,0Z" transform="rotate(${a+180/N}) translate(0,-43)" fill="${P.m}"/>`}
  const glow=blk?`drop-shadow(0 0 1.5px ${P.h}) drop-shadow(0 0 4px rgba(0,0,0,.95)) drop-shadow(0 0 7px ${P.g})`:`drop-shadow(0 0 1.5px ${P.h}) drop-shadow(0 0 5px ${P.g})`;
  return `<svg viewBox="-66 -66 132 132" preserveAspectRatio="none" style="filter:${glow}"><g>`+
   `<circle r="47" fill="none" stroke="${P.g}" stroke-width="${blk?4:5}" opacity="${blk?.45:.2}"/>`+
   `<circle r="47" fill="none" stroke="${P.m}" stroke-width="${red?3.6:3.2}"/>`+
   `<circle r="47" fill="none" stroke="${P.h}" stroke-width="${blk?.8:1.2}" opacity="${blk?.8:1}"/>`+
   `<circle r="50" fill="none" stroke="${P.m}" stroke-width=".9" opacity=".8"/>`+
   `<circle r="43.6" fill="none" stroke="${P.m}" stroke-width="1.3" stroke-dasharray="3 3.5"/>`+
   
   sp+((red||blk)?`<circle r="47" fill="none" stroke="${red?'#fff2f2':'#d9b8ff'}" stroke-width="2" stroke-linecap="round" stroke-dasharray="9 138.6" opacity="0"><animate attributeName="opacity" values="0;${red?.9:.75};0" dur="3.4s" begin="${(k*.7).toFixed(1)}s" repeatCount="indefinite"/></circle>`+`<g opacity="0" transform="translate(0,-47)"><path d="M0,-6 L1.2,-1.2 L6,0 L1.2,1.2 L0,6 L-1.2,1.2 L-6,0 L-1.2,-1.2Z" fill="#fff"/><animate attributeName="opacity" values="0;0;1;0;0" dur="4.2s" begin="${(k*.9).toFixed(1)}s" repeatCount="indefinite"/></g>`:'')+`<animateTransform attributeName="transform" type="rotate" from="0" to="${360*dir}" dur="${dur}s" repeatCount="indefinite"/></g></svg>`};

/* v321: anéis do chão um pouco maiores (+15%) e girando bem devagar (70 s + 9 s por anel) */
{const _g=anGround;anGround=function(R,cx,cy,cw){return _g(R,cx,cy,cw*1.15)}}

/* ================= v323: 3 códigos de USO ÚNICO (1 pessoa no jogo inteiro). Texto só com o dono. ================= */
TWCUP['kdc5bt']={nm:'40.000 DIAMANTES',gem:40000};
TWCUP['e8a07j']={nm:'10.000 DIAMANTES',gem:10000};
TWCUP['yuirz0']={nm:'ZORO E SHAKA',it:[],chrs:['zoro','shaka']};
{const _cp5=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];const r=await _cp5.apply(this,arguments);
  if(C&&C.chrs&&E&&/\bok\b/.test(E.className)){const own=rkG('own',['goku']);for(const c of C.chrs)if(!own.includes(c))own.push(c);rkS('own',own);try{acSave(1)}catch(x){}E.textContent='🎁 Código aceito! Você ganhou o ZORO e o SHAKA! (já estão nos seus personagens)'}return r}}

/* ================= v326: MENU NOVO "MODOS DE JOGO" (vídeo do dono no fundo: cabelo mexendo, dragão) =================
   Arte 1408x640 com os botões desenhados; aqui só ficam as áreas de toque, os textos (nome, rank, moedas) e os brilhos.
   Foto (em cima, moldura dourada) = PERFIL · barra roxa = nome + rank · 🎵 música · moedas: ticket, diamante, moeda da torre, vermelha · ⚙️ = código/configuração/menu principal */
const MN2={wm:'a/94ef9d958f9ca1.webm',v:'a/5949fec92d3bbf.mp4',p:'a/58584baf8fe032.webp',W:1408,H:640} /* v333: vídeo novo com o botão PVP Ranqueada */;RKD.menu=[MN2.W,MN2.H];
const mnB=(x0,y0,x1,y1)=>`left:${x0/MN2.W*100}%;top:${y0/MN2.H*100}%;width:${(x1-x0)/MN2.W*100}%;height:${(y1-y0)/MN2.H*100}%`;
let MN2V=null;
function mn2Vid(){if(!MN2V){const v=document.createElement('video');v.className='mn2v';v.src=(v.canPlayType&&v.canPlayType('video/webm; codecs="vp9"'))?MN2.wm:MN2.v;v.onerror=()=>{if(v.src.indexOf(MN2.v)<0){v.src=MN2.v;v.play().catch(()=>{})}};v.poster=MN2.p;v.muted=true;v.defaultMuted=true;v.loop=true;v.autoplay=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.setAttribute('muted','');v.preload='auto';MN2V=v}return MN2V}
rkMenuH=function(){const rp=rkG('rp',0),ri=rkRank(rp),R=RKR[ri],nm=(twLS.g('tw_nome','')||'Jogador'),ft=rkG('foto','');
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const L=(a,cls,b,d)=>`<button class="hs mn2L ${cls}" data-a="${a}" style="${mnB(...b)}"><span class="sw" style="animation-delay:${d}s"></span><span class="ed" style="animation-delay:${d}s"></span></button>`;
  const Q=(a,b,d,dot)=>`<button class="hs mn2Q" data-a="${a}" style="${mnB(...b)}"><span class="sw" style="animation-delay:${d}s"></span>${dot?'<i class="dot"></i>':''}</button>`;
  const Rr=(a,b,d,dot)=>`<button class="hs mn2R" data-a="${a}" style="${mnB(...b)}"><span class="gl" style="animation-delay:${d}s"></span>${dot?'<i class="dot"></i>':''}</button>`;
  const C=(b,v)=>`<div class="mn2C" style="${mnB(...b)}">${rkFmtN(v)}</div>`;
  return `<button class="hs mn2Av" data-a="perfil" style="${mnB(47,8,109,70)}">${ft?`<img src="${esc(ft)}" alt="">`:''}</button>
  <button class="hs mn2Nm" data-a="perfil" style="${mnB(140,12,340,62)}"><b>${esc(nm)}</b><small>${rkEmb(ri,'sm')}<span style="color:${R.c}">${R.n}</span> · ${rkFmtN(rp)} XP</small></button>
  <button class="hs" data-a="menuBack" style="${mnB(30,86,330,138)}"></button>
  ${L('boss','r',[20,160,328,224],0)}${L('torre','g',[20,228,328,292],.35)}${L('caca','p',[20,295,328,359],.7)}${L('gacha','b',[20,362,328,426],1.05)}${L('pvp','p',[20,430,328,494],1.4)}
  <button class="hs mn2Mu" data-a="music" style="${mnB(738,0,792,48)}"></button>
  ${C([845,6,925,42],rkG('tic',0))}${C([988,6,1070,42],rkG('gem',0))}${C([1132,6,1212,42],twLS.g('tw_moedas',0))}${C([1270,6,1342,42],rkG('red',0))}
  <button class="hs" data-a="shop" style="${mnB(940,4,1075,44)}"></button><button class="hs" data-a="mn2Cfg" style="${mnB(1354,0,1408,48)}"></button>
  ${Rr('psMenu',[1242,68,1394,172],0)}${Rr('mnMenu',[1246,176,1390,274],.6,mnBadge())}${Rr('evMenu',[1248,278,1390,372],1.2,evAny())}${Rr('bpMenu',[1248,376,1390,482],1.8,bpPend())}
  ${Q('ranking',[358,474,500,572],0)}${Q('rewards',[516,474,658,572],.3,rkRwPend())}${Q('ach',[677,474,818,572],.6,rkAchPend())}${Q('lib',[836,474,976,572],.9)}${Q('conta',[994,474,1132,572],1.2)}`};
function mn2Cfg(){rkModal(`<div class="twM mn2CM"><h3>⚙️ OPÇÕES</h3><div class="mn2CB"><button class="btn main" id="mnC1">🎟️ CÓDIGO</button><button class="btn" id="mnC2">⚙️ CONFIGURAÇÃO</button><button class="btn" id="mnC3">🏠 MENU PRINCIPAL</button></div><div class="row"><button class="btn" id="rkMX">VOLTAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('mnC1').onclick=()=>rkCode();$('mnC2').onclick=()=>{rkModal(null);audioInit();showScreen('config')};$('mnC3').onclick=()=>{rkModal(null);showScreen('title')}}
{const _a=rkAct;rkAct=function(a,b){if(a==='mn2Cfg'){rkSfx('whoosh');return mn2Cfg()}return _a.apply(this,arguments)}}
{const _v=rkView;rkView=function(v){const r=_v.apply(this,arguments);if(v==='menu'){const A=document.querySelector('#rkWrap .rk_menu');if(A){A.style.backgroundImage=`url(${MN2.p})`;const vid=mn2Vid();A.insertBefore(vid,A.firstChild);const pl=vid.play();if(pl&&pl.catch)pl.catch(()=>{})}}else if(MN2V)try{MN2V.pause()}catch(e){}return r}}
document.addEventListener('visibilitychange',()=>{if(!MN2V)return;if(document.hidden)MN2V.pause();else if(RKV==='menu'&&MN2V.isConnected)MN2V.play().catch(()=>{})});

/* ================= v328: BIBLIOTECA NOVA (artes do dono, 1846x852) — Personagem · Equipamentos · Itens · Coleções · Anéis =================
   Uma arte por aba (LB2.bg). Áreas de toque em pixels da arte (lbB). Centro (#lbCtr) e grade (#rkGrid/#anGrid) redesenham sem recarregar a tela.
   Personagem e Equipamentos: o personagem flutua no meio com os anéis do chão (anDecor); os quadradinhos do lado equipam (equipamento é do jogador, vale para todos).
   Evoluir = sobe o nível do personagem (na aba Anéis: evolui o anel escolhido). Equipar = usa o personagem / equipa o item / o anel / o título. */
const LB2={W:1846,H:852,bg:{chr:'a/c1a2a7ad89428e.webp',an:'a/8520024d4bec40.webp',eq:'a/ff525611dbae3b.webp',it:'a/263a52872a169f.webp',col:'a/ffb598dd740e15.webp'},cat:{it:null,col:null},ef:null,es:null,ic:null};
RKD.lib=[LB2.W,LB2.H];
const lbB=(x0,y0,x1,y1)=>`left:${x0/LB2.W*100}%;top:${y0/LB2.H*100}%;width:${(x1-x0)/LB2.W*100}%;height:${(y1-y0)/LB2.H*100}%`;
const LBTAB=[['chr',110,195],['eq',213,298],['it',315,400],['col',418,503],['an',520,605]];
const LBX=[1235,1350,1465,1580,1693],LBY=[200,323,448,573];
const lbSel=()=>{const o=rkG('own',['goku']),s=rkG('sel','goku');return o.includes(s)?s:(o[0]||'goku')};
const lbC=r=>(TWEQR.find(R=>R.k===r)||TWEQR[0]).c;
const lbEsc=s=>twEsc(String(s==null?'':s));
const LBSLN={esp:'ESPADA',cap:'CAPACETE',anel:'ANEL / LUVAS',arm:'ARMADURA',bot:'BOTAS',poc:'POÇÃO'};
const LBSLC=[['esp',320,225],['arm',320,337],['bot',320,450],['cap',726,225],['anel',726,337],['poc',726,450]];
const LBSLE=[['cap',322,227],['arm',322,330],['anel',322,428],['bot',322,522],['esp',728,227],['poc',728,330],['x1',728,428],['x2',728,522]];
function lbEqOf(k){if(k==='poc'){const o=twPocOn();return o?Object.assign({t:'poc'},o):null}const Q=twEqp();return Q[k]?twInv().find(y=>y.id===Q[k])||null:null}
function lbSlot(k,x,y,w,h){if(k[0]==='x')return `<button class="hs lbSl lk" data-a="lbSl" data-s="${k}" style="${lbB(x,y,x+w,y+h)}"><span class="lbSn">🔒 EM BREVE</span></button>`;
  const it=lbEqOf(k);return `<button class="hs lbSl ${it?'on':''}" data-a="lbSl" data-s="${k}" style="${lbB(x,y,x+w,y+h)};${it?'--c:'+rkItC(it):''}">${it?`<img src="${rkItIc(it)}" alt=""><b>+${rkItV(it)}%</b>`:''}<span class="lbSn">${LBSLN[k]}</span></button>`}
function lbAtt(vals,col){const Y=col?[281,338,393,450,505]:[286,342,397,451,506],X=col?[836,948]:[1074,1192];
  return `<button class="hs lbAtB" data-a="lbAt" style="${col?lbB(612,255,950,535):lbB(858,258,1198,535)}"></button>`+vals.map((v,i)=>`<b class="lbV" style="${lbB(X[0],Y[i]-21,X[1],Y[i]+21)}">${v}</b>`).join('')}
const lbTot=id=>cbRows(id).map(v=>String(v).split(' ')[0]);
function lbHead(t){return `<button class="hs" data-a="back" style="${lbB(38,8,158,72)}"></button><button class="hs" data-a="home" style="${lbB(1690,8,1810,72)}"></button>`+
  LBTAB.map(([k,a,b])=>`<button class="hs lbTab ${t===k?'on':''}" data-a="tab" data-t="${k}" style="${lbB(10,a,292,b)}"><i class="sw"></i></button>`).join('')+
  `<button class="hs lbBt" data-a="lbEvo2" style="${lbB(285,658,605,725)}"><i class="sw"></i></button><button class="hs lbBt" data-a="lbEq2" style="${lbB(625,658,975,725)}"><i class="sw" style="animation-delay:1.6s"></i></button>`}
function lbSearch(t){if(t==='an')return `<input class="rkSrch lbSr" id="anSrch" placeholder="Buscar anel..." autocomplete="off" value="${lbEsc(AN.q)}" style="${lbB(1305,128,1672,176)}"><button class="hs" data-a="anFilt" style="${lbB(1700,125,1785,178)}"><span class="rkFl" id="anFl">${ANFL[AN.f]}</span></button><div id="anGrid"></div><button class="hs" data-a="anUp" style="${lbB(1793,180,1832,230)}"></button><button class="hs" data-a="anDn" style="${lbB(1793,655,1832,702)}"></button>`;
  const fl=t==='eq'?(LB2.ef?LBSLN[LB2.ef].split(' ')[0]:'TUDO'):['TODOS','TENHO','FALTA'][RKL.f];
  return `<input class="rkSrch lbSr" id="rkSrch" placeholder="Buscar..." autocomplete="off" value="${lbEsc(RKL.q)}" style="${lbB(1305,128,1672,176)}"><button class="hs" data-a="filt" style="${lbB(1700,125,1785,178)}"><span class="rkFl" id="rkFl">${fl}</span></button><div id="rkGrid"></div><button class="hs" data-a="up" style="${lbB(1793,180,1832,230)}"></button><button class="hs" data-a="down" style="${lbB(1793,655,1832,702)}"></button>`}
/* ---------- listas ---------- */
function lbChrList(){const t=RKL.tab;RKL.tab='chr';try{return rkLibItems()}finally{RKL.tab=t}}
function lbEqList(){const q=RKL.q.toLowerCase();return twStacks().filter(x=>x.k!=='poc'&&(!LB2.ef||x.t===LB2.ef)&&(!q||rkItNm(x).toLowerCase().includes(q))).sort((a,b)=>(TWRK.indexOf(b.r)-TWRK.indexOf(a.r))||(rkItV(b)-rkItV(a)))}
const LBIC=[['poc',222,312],['el',315,402],['cr',405,495],['bau',495,580],['bag',578,655]],LBIN={poc:'POÇÕES',el:'ITENS DE ELEVAÇÃO',cr:'CRISTAIS E PEDRAS',bau:'TESOUROS E SET DO LOBO',bag:'MOEDAS'};
function lbItCat(x){const i=x.id;if(i==='senzu'||i==='jn'||/^ls/.test(i))return 'bau';if(/^el/.test(i))return 'el';if(i==='po'||/^cr/.test(i)||/^pd/.test(i))return 'cr';if(i==='gem'||i==='tic'||i==='red'||i==='mo')return 'bag';if(/^p/.test(i))return 'poc';return 'bag'}
function lbItList(){const t=RKL.tab;RKL.tab='it';let L;try{L=rkLibItems()}finally{RKL.tab=t}const q=RKL.q.toLowerCase(),ex=[];
  ex.push({id:'mo',k:'it',r:'lend',has:1,ico:'🪙',bigI:'🪙',nm:'MOEDAS DA TORRE',d:'Você tem '+rkFmtN(twLS.g('tw_moedas',0)|0)+' · ganhe na Torre · sobe o nível dos personagens e compra na loja da Torre'});
  try{const n=psG().jn|0;ex.push({id:'jn',k:'it',r:'obs',has:n>0,img:RQA.jn,big:RQA.jn,nm:'JOIA NEGRA',d:'Você tem '+n+' · 1 joia = 1 giro de Passiva'})}catch(e){}
  L=L.concat(ex.filter(x=>(!q||x.nm.toLowerCase().includes(q))&&(RKL.f===0||(RKL.f===1?x.has:!x.has))));
  L=L.map((x,i)=>[x,i]).sort((a,b)=>(b[0].has?1:0)-(a[0].has?1:0)||a[1]-b[1]).map(z=>z[0]);return LB2.cat.it?L.filter(x=>lbItCat(x)===LB2.cat.it):L}
const LBCC=[['bau',190,285],['tr',292,378],['as',380,460],['mk',460,540],['dr',545,630]],LBCN={bau:'ITENS ESPECIAIS',tr:'TÍTULOS DE RANK',as:'TÍTULOS',mk:'TÍTULOS ESPECIAIS',dr:'PERSONAGENS'};
function lbColCat(x){if(x.k==='chr')return 'dr';if(!x.tit)return 'bau';const T=TWTIT[x.tit]||{};if(T.rk!=null)return 'tr';if(T.yt||T.inf||T.hid)return 'mk';return 'as'}
function lbColList(){const t=RKL.tab;RKL.tab='col';let L;try{L=rkLibItems()}finally{RKL.tab=t}L=L.concat(lbChrList());return LB2.cat.col?L.filter(x=>lbColCat(x)===LB2.cat.col):L}
/* ---------- centro ---------- */
function lbPed(id,lock,box){return `<div class="lbPd ${lock?'no':''}" style="${lbB(...(box||[405,90,745,640]))}"><img src="${fullSrc(id)}" alt=""></div>`}
function lbInfo(x,box){if(!x)return '';const c=x.r?lbC(x.r):'#ffd84a';return `<div class="lbInf" style="${lbB(...box)};--c:${c}"><b>${lbEsc(x.nm)}</b><span>${x.has===0||x.has===false?'🔒 ':''}${lbEsc(x.d||'')}</span></div>`}
function lbCtrH(){const t=RKL.tab;
  if(t==='chr'){let x=RKL.cur;if(!x||x.k!=='chr'){const L=lbChrList();x=RKL.cur=L.find(y=>y.id===lbSel())||L[0]}if(!x)return '';const id=x.id,L=lvOf(id),mx=LVMAX(id),c=lbC(x.r),use=rkG('sel','goku')===id;
    return lbPed(id,!x.has,[405,95,745,598])+`<div class="lbNm2 top" style="${lbB(425,22,725,86)};--c:${c}"><b>${lbEsc(CH[id].name)}</b><small>${x.has?'NÍVEL '+L.lv+' / '+mx+(use?' · ✔ EM USO':''):'🔒 '+lbEsc(x.d)}</small></div>`+LBSLC.map(([k,a,b])=>lbSlot(k,a,b,92,93)).join('')+lbAtt(lbTot(id))}
  if(t==='eq'){const id=lbSel(),X=LB2.es&&twStacks().find(y=>y.key===LB2.es);
    return lbPed(id,0,[425,90,725,572])+LBSLE.map(([k,a,b])=>lbSlot(k,a,b,94,90)).join('')+lbAtt(lbTot(id))+
      (X?`<div class="lbInf" style="${lbB(425,560,725,648)};--c:${rkItC(X)}"><b>${lbEsc(rkItNm(X))} +${rkItV(X)}%${X.n>1?' · x'+X.n:''}</b><span>${lbEsc(rkItEf(X))} · toque de novo para vender</span></div>`:`<div class="lbHint" style="${lbB(425,600,725,648)}">Toque num item da lista e depois em EQUIPAR</div>`)}
  if(t==='it'){const L=lbItList();let x=RKL.cur;if(!x||x.k!=='it'||!L.find(y=>y.id===x.id))x=RKL.cur=L[0]||null;
    return LBIC.map(([k,a,b])=>`<button class="hs lbCt ${LB2.cat.it===k?'on':''}" data-a="lbCat" data-c="${k}" style="${lbB(322,a,422,b)}"></button>`).join('')+
      (x?`<div class="lbBig ${x.has?'':'no'}" style="${lbB(470,150,690,480)};--c:${lbC(x.r)}"><i class="glw"></i>${x.big||x.img?`<img src="${x.big||x.img}" alt="">`:`<em>${x.bigI||x.ico||''}</em>`}</div>`+lbInfo(x,[430,505,730,648]):`<div class="lbHint" style="${lbB(430,560,730,640)}">Nada aqui ainda</div>`)+
      `<div class="lbCatN" style="${lbB(430,96,730,140)}">${LB2.cat.it?LBIN[LB2.cat.it]:'TODOS OS ITENS'}</div>`+lbAtt(lbTot(lbSel()))}
  if(t==='col'){const L=lbColList();let x=RKL.cur;if(!x||!L.find(y=>y.id===x.id))x=RKL.cur=L[0]||null;
    return LBCC.map(([k,a,b])=>`<button class="hs lbCt ${LB2.cat.col===k?'on':''}" data-a="lbCat" data-c="${k}" style="${lbB(318,a,430,b)}"></button>`).join('')+
      `<div class="lbCatN cl" style="${lbB(1150,186,1650,212)}">${LB2.cat.col?LBCN[LB2.cat.col]:'COLEÇÃO'} · ${L.filter(y=>y.has).length}/${L.length}</div>`+
      (x?`<div class="lbInf cl" style="${lbB(1040,576,1640,652)};--c:${x.r?lbC(x.r):'#ffd84a'}"><b>${lbEsc(x.nm)}</b><span>${x.has?'':'🔒 '}${lbEsc(x.d||'')}</span></div>`:'')+lbAtt(lbTot(lbSel()),1)}
  if(t==='an'){const id=AN.ch&&rkG('own',['goku']).includes(AN.ch)?AN.ch:(AN.ch=lbSel()),E=anEq(id),n=anSlots(id),L=anL(),T=anSum(id),lv=lvOf(id).lv;
    const SP=[[453,192],[697,192],[770,305],[750,435],[653,528],[500,528],[403,435],[383,305]];
    const sl=SP.map(([x,y],i)=>{const r=E[i]&&L.find(z=>z.i===E[i]);return `<button class="hs lbAs ${i<n?'':'lk'} ${r?'on':''} ${r&&AN.sel===r.i?'sel':''}" data-a="anSlot" data-i="${i}" style="${lbB(x-50,y-50,x+50,y+50)};${r?'--c:'+ANC[r.c][1]:''}">${r?`<img src="${RQA.anel2[r.c]}" alt=""><b>${ANG[r.g]}</b>`:i<n?'':`<i>🔒</i><small>NV ${(i+1)*10}</small>`}</button>`}).join('');
    const S=AN.sel&&L.find(z=>z.i===AN.sel);
    return lbPed(id,0,[497,225,653,505])+sl+`<button class="hs lbNm2 an" data-a="lbNm" style="${lbB(425,572,725,652)}"><b>${lbEsc(CH[id]?CH[id].name:id)} ⇄</b><small>NÍVEL ${lv} · ${E.filter(Boolean).length}/${n} anéis${n<8?' · próxima vaga no '+(n+1)*10:''}</small></button>`+
      (S?`<div class="lbInf an" style="${lbB(1235,712,1790,760)};--c:${ANC[S.c][1]}"><b>ANEL ${ANC[S.c][0]} · ${ANG[S.g]} · Nv ${anLvl(S)}/${ANMX[S.c]}</b><span>${lbEsc(anTxt(S))}</span></div>`:'')+
      lbAtt(['+'+cbN(T.dano)+'%','+'+cbN(T.crit)+'%','+'+cbN(T.vel)+'%','+'+cbN(T.st),'+'+cbN(T.uv)+'%'])}
  return ''}
function lbBind(el){el.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)})}
function lbRef(){const C=$('lbCtr');if(C){C.innerHTML=lbCtrH();lbBind(C)}rkLibGrid();setTimeout(anDecor,40)}
/* ---------- grades ---------- */
function lbCellH(i,x,cur,X,Y,w,h){const c=x.r?lbC(x.r):'#ffd84a';return `<button class="rkCell lbCl ${x.has?'':'no'} ${cur?'on':''}" data-id="${lbEsc(x.id)}" style="${lbB(X,Y,X+w,Y+h)};--c:${c}">${x.img?`<img src="${x.img}" alt="">`:`<i>${x.ico||x.bigI||''}</i>`}${x.has?(x.k==='chr'?`<em>Nv ${lvOf(x.id).lv}</em>`:''):'<span class="lk">🔒</span>'}<b>${lbEsc(String(x.nm).replace('TÍTULO ',''))}</b></button>`}
function lbPgH(pg,pages,box){return pages>1?`<div class="rkPg lbPg" style="${lbB(...box)}">${pg+1}/${pages}</div>`:''}
rkLibGrid=function(){const t=RKL.tab;if(t==='an')return anGrid();const G0=$('rkGrid');if(!G0)return;
  if(t==='col'){const L=lbColList(),N=18,pages=Math.max(1,Math.ceil(L.length/N));RKL.pg=Math.min(RKL.pg,pages-1);
    G0.innerHTML=L.slice(RKL.pg*N,RKL.pg*N+N).map((x,i)=>lbCellH(i,x,RKL.cur&&RKL.cur.id===x.id,1042+(i%6)*122,212+((i/6)|0)*120,112,112)).join('')+
      `<button class="hs lbPgB" data-a="up" style="${lbB(1652,588,1702,640)}">◀</button><button class="hs lbPgB" data-a="down" style="${lbB(1712,588,1762,640)}">▶</button>`+lbPgH(RKL.pg,pages,[1652,548,1762,580]);
    G0.querySelectorAll('.rkCell').forEach(b=>b.onclick=()=>{const x=L.find(y=>y.id===b.dataset.id);if(x){rkSfx('whoosh');RKL.cur=x;lbRef()}});lbBind(G0);return}
  if(t==='eq'){const L=lbEqList(),N=20,pages=Math.max(1,Math.ceil(L.length/N));RKL.pg=Math.min(RKL.pg,pages-1);
    G0.innerHTML=L.length?L.slice(RKL.pg*N,RKL.pg*N+N).map((x,i)=>`<button class="rkCell lbCl eq ${LB2.es===x.key?'on':''}${x.uniq?' uniq':''}" data-k="${lbEsc(x.key)}" style="${lbB(LBX[i%5],LBY[(i/5)|0],LBX[i%5]+100,LBY[(i/5)|0]+110)};--c:${rkItC(x)}"><img src="${rkItIc(x)}" alt=""><em>+${rkItV(x)}%</em>${x.n>1?`<i class="lbN">x${x.n}</i>`:''}<b>${lbEsc(rkItNm(x))}</b></button>`).join('')+lbPgH(RKL.pg,pages,[1793,425,1832,455])
      :`<div class="lbVz" style="${lbB(1250,330,1780,470)}">${LB2.ef?'Nenhum item desse tipo na mochila.':'Mochila vazia.'}<br>Ganhe equipamentos no Boss, na Torre e no Gacha!</div>`;
    G0.querySelectorAll('.rkCell').forEach(b=>b.onclick=()=>{rkSfx('whoosh');if(LB2.es===b.dataset.k)return rkEquip(null,b.dataset.k);LB2.es=b.dataset.k;lbRef()});return}
  const L=t==='it'?lbItList():lbChrList(),N=20,pages=Math.max(1,Math.ceil(L.length/N));RKL.pg=Math.min(RKL.pg,pages-1);
  G0.innerHTML=L.slice(RKL.pg*N,RKL.pg*N+N).map((x,i)=>lbCellH(i,x,RKL.cur&&RKL.cur.id===x.id,LBX[i%5],LBY[(i/5)|0],100,110)).join('')+lbPgH(RKL.pg,pages,[1793,425,1832,455]);
  G0.querySelectorAll('.rkCell').forEach(b=>b.onclick=()=>{const x=L.find(y=>y.id===b.dataset.id);if(x){rkSfx('whoosh');RKL.cur=x;lbRef()}})};
anGrid=function(){const G0=$('anGrid');if(!G0)return;const L=anItems(),N=20,pages=Math.max(1,Math.ceil(L.length/N));AN.pg=Math.min(AN.pg,pages-1);
  G0.innerHTML=L.length?L.slice(AN.pg*N,AN.pg*N+N).map((r,i)=>{const w=anWho(r),g=anGl(r);return `<button class="anCell lbCl ${AN.sel===r.i?'on':''}" data-i="${r.i}" style="${lbB(LBX[i%5],LBY[(i/5)|0],LBX[i%5]+100,LBY[(i/5)|0]+110)};--c:${ANC[r.c][1]}"><img src="${RQA.anel2[r.c]}" alt=""${g?` class="gl g${g}" style="--c:${ANC[r.c][1]}"`:''}><b class="g g${r.g}">${ANG[r.g]}</b><span>${anSt(r.s)[1].split(' ')[0]} +${anV(r)}${anSt(r.s)[2]}</span><i class="anLv">Nv ${anLvl(r)}</i>${w?`<em>${w===AN.ch?'EM USO':'✔ '+lbEsc((CH[w]||{}).name||w)}</em>`:''}</button>`}).join('')+lbPgH(AN.pg,pages,[1793,425,1832,455])
    :`<div class="lbVz" style="${lbB(1250,330,1780,470)}">Você ainda não tem anéis.<br>Eles caem do <b>LOBO NEGRO</b> no modo Caça.</div>`;
  G0.querySelectorAll('.anCell').forEach(b=>b.onclick=()=>{const r=anL().find(x=>x.i===b.dataset.i);if(!r)return;rkSfx('whoosh');if(AN.sel===r.i)return anInfo(r);AN.sel=r.i;lbRef()})};
/* ---------- tela ---------- */
rkLibH=function(){const t=RKL.tab;return lbHead(t)+`<div id="lbCtr" class="lbCtr">${lbCtrH()}</div>`+(t==='col'?'<div id="rkGrid"></div>':lbSearch(t))};
rkLibOn=function(){const S=$('rkSrch'),A=$('anSrch');if(S)S.oninput=()=>{RKL.q=S.value;RKL.pg=0;rkLibGrid()};if(A)A.oninput=()=>{AN.q=A.value;AN.pg=0;anGrid()};rkLibGrid()};
rkLibShow=function(x){RKL.cur=x;lbRef()};
{const _t=rkLibTab;rkLibTab=function(t){LB2.es=null;if(t!=='eq')LB2.ef=null;return _t.apply(this,arguments)}}
function lbEquipX(X){const Q=twEqp();if(rkLock(twInv().find(y=>y.id===Q[X.t]))&&!rkLock(X)){rkSfx('clang');rkToast('🌑 Item OBSCURO fica sempre equipado','#c46bff');return false}Q[X.t]=X.ids[0];twLS.s('tw_eqp',Q);TW.capOut=twCap();rkSfx('powerUp');return true}
function lbUnequip(k){if(k==='poc'){const o=twPocOn();if(o){const P=twPocs();P.push(o);twLS.s('tw_poc',P);twLS.s('tw_pocOn',null)}}else{const Q=twEqp();if(rkLock(twInv().find(y=>y.id===Q[k]))){rkSfx('clang');rkToast('🌑 Item OBSCURO fica sempre equipado','#c46bff');return false}delete Q[k];twLS.s('tw_eqp',Q);const c=twCap();if(c)rkToast('Mochila cheia: o item mais fraco foi descartado','#ff8080')}rkSfx('whoosh');return true}
function lbAct(a,b){const t=RKL.tab;
  if(a==='lbSl'){const k=b.dataset.s;if(k[0]==='x'){rkSfx('clang');return rkToast('🔒 Esse espaço chega em breve','#d9b3ff')}
    if(lbEqOf(k)){if(lbUnequip(k)){rkToast('Guardado na mochila','#cfd6ea');lbRef()}return}
    if(k==='poc')return rkEquip('poc');if(t!=='eq'){LB2.ef=k;LB2.es=null;return rkLibTab('eq')}LB2.ef=k;RKL.pg=0;const F=$('rkFl');if(F)F.textContent=LBSLN[k].split(' ')[0];rkLibGrid();return rkToast('Escolha '+LBSLN[k].toLowerCase()+' na lista ➜','#d9b3ff')}
  if(a==='lbCat'){const c=b.dataset.c,o=LB2.cat[t]===c?null:c;LB2.cat[t]=o;RKL.cur=null;RKL.pg=0;return lbRef()}
  if(a==='lbAt')return cbModal(t==='chr'&&RKL.cur?RKL.cur.id:t==='an'?AN.ch:lbSel());
  if(a==='lbNm'){const o=rkG('own',['goku']);AN.ch=o[(o.indexOf(AN.ch)+1)%o.length];AN.sel=null;return lbRef()}
  if(a==='lbEvo2'){if(t==='an'){const r=AN.sel&&anL().find(z=>z.i===AN.sel);if(!r){rkSfx('clang');return rkToast('Escolha um anel na lista para evoluir','#d9b3ff')}return anUpM(r.i)}
    const id=t==='chr'&&RKL.cur?RKL.cur.id:lbSel();if(!rkG('own',['goku']).includes(id)){rkSfx('clang');return rkToast('🔒 Você ainda não tem esse personagem','#cfd6ea')}return lvOpen(id)}
  if(a==='lbEq2'){
    if(t==='chr'){const x=RKL.cur;if(!x||!x.has){rkSfx('clang');return rkToast('🔒 Ganhe esse personagem no Gacha','#cfd6ea')}if(rkG('sel','goku')===x.id)return rkToast('✔ '+CH[x.id].name+' já está em uso','#7dff9a');return rkLibUse()}
    if(t==='eq'){const X=LB2.es&&twStacks().find(y=>y.key===LB2.es);if(!X){rkSfx('clang');return rkToast('Toque num item da lista primeiro','#d9b3ff')}if(lbEquipX(X)){rkToast('✔ '+rkItNm(X)+' equipado!','#7dff9a');LB2.es=null;lbRef()}return}
    if(t==='it'){const x=RKL.cur;if(x&&lbItCat(x)==='poc'&&x.id!=='senzu')return rkEquip('poc');rkSfx('clang');return rkToast(x&&x.id==='senzu'?'🌱 A Semente é usada sozinha quando você cai no Boss e na Torre':'Esse item é usado sozinho onde ele serve','#cfd6ea')}
    if(t==='col'){const x=RKL.cur;if(!x||!x.has){rkSfx('clang');return rkToast('🔒 Você ainda não tem isso','#cfd6ea')}if(x.k==='chr'){rkS('sel',x.id);rkSfx('powerUp');rkToast('✔ '+CH[x.id].name+' vai lutar na ranqueada','#7dff9a');return lbRef()}if(x.tit){twLS.s('tw_titOn',x.tit);try{twTitSync()}catch(e){}rkSfx('powerUp');rkToast('✔ Título em uso','#7dff9a');return lbRef()}return rkToast('Item da coleção','#cfd6ea')}
    if(t==='an'){const id=AN.ch,r=AN.sel&&anL().find(z=>z.i===AN.sel);if(!r){rkSfx('clang');return rkToast('Escolha um anel na lista','#d9b3ff')}const E=anEq(id),n=anSlots(id),w=anWho(r);
      if(w===id)return anPut(id,E.indexOf(r.i),null);if(!n){rkSfx('clang');return rkToast('🔒 A 1ª vaga abre no nível 10 do personagem','#d9b3ff')}const free=E.slice(0,n).indexOf(null);if(free<0){rkSfx('clang');return rkToast('Todas as '+n+' vagas estão ocupadas: toque num anel do círculo para tirar','#ffb0b0')}if(w)anPut(w,anEq(w).indexOf(r.i),null,1);return anPut(id,free,r.i)}}
  return null}
{const _a=rkAct;rkAct=function(a,b){if(RKV==='lib'&&/^lb/.test(a)){rkSfx('whoosh');return lbAct(a,b)}
  if(RKV==='lib'&&a==='filt'&&RKL.tab==='eq'){const L=[null,'esp','cap','anel','arm','bot'];LB2.ef=L[(L.indexOf(LB2.ef)+1)%L.length];RKL.pg=0;$('rkFl').textContent=LB2.ef?LBSLN[LB2.ef].split(' ')[0]:'TUDO';rkSfx('whoosh');return rkLibGrid()}
  return _a.apply(this,arguments)}}
{const _a=rkAct;rkAct=function(a,b){if(RKV==='lib'&&a==='anSlot'&&RKL.tab==='an'){const i=+b.dataset.i,id=AN.ch,E=anEq(id),r=AN.sel&&anL().find(z=>z.i===AN.sel);
    if(r&&!E[i]&&i<anSlots(id)){const w=anWho(r);if(w)anPut(w,anEq(w).indexOf(r.i),null,1);return anPut(id,i,r.i)}}return _a.apply(this,arguments)}}
{const _v=rkView;rkView=function(v){const r=_v.apply(this,arguments);if(v==='lib'){const A=document.querySelector('#rkWrap .rk_lib');if(A){A.style.backgroundImage=`url(${LB2.bg[RKL.tab]||LB2.bg.chr})`;A.classList.add('lb2');A.classList.remove('lbArt')}}return r}}
{const _m=rkModal;rkModal=function(h){const r=_m.apply(this,arguments);if(h==null&&RKV==='lib'&&$('lbCtr')&&showScreen.cur==='ranked')lbRef();return r}}

/* ================= v328: CONQUISTAS, RECOMPENSAS DE RANK, CONTA e RANKING com as artes do dono ================= */
const ARI={ach:'a/02e61493fd5842.webp',rw:'a/80819e624bec84.webp',conta:'a/8271c159f959ab.webp',rank:'a/be246db3158b2a.webp'};
const arBx=(W,H)=>(x0,y0,x1,y1)=>`left:${x0/W*100}%;top:${y0/H*100}%;width:${(x1-x0)/W*100}%;height:${(y1-y0)/H*100}%`;
const arB16=arBx(1672,941);
const arP=(img,cls,inner)=>`<div class="arP ${cls}" style="background-image:url(${img})">${inner}</div>`;
/* ---------- CONQUISTAS ---------- */
rkAch=function(){const S=rkSt(),c=rkG('achc',[]),pend=RKACH.filter(A=>A.ok(S)&&!c.includes(A.k)),got=RKACH.filter(A=>c.includes(A.k)).length;
  const L=RKACH.slice().sort((a,b)=>{const o=A=>c.includes(A.k)?2:A.ok(S)?0:1;return o(a)-o(b)});
  rkModal(arP(ARI.ach,'arAch',`<button class="arX" id="rkMX" style="${arB16(1555,22,1650,112)}">✕</button>
    <div class="arCnt" style="${arB16(640,196,1032,236)}">${got} / ${RKACH.length} CONCLUÍDAS</div>
    ${pend.length?`<button class="arBtn gold" id="rkAcAll" style="${arB16(1240,180,1570,236)}">RESGATAR TUDO · ${pend.length}</button>`:''}
    <div class="arList" style="${arB16(75,250,1597,832)}">${L.map(A=>{const ok=A.ok(S),g=c.includes(A.k);return `<div class="arRow ${g?'got':ok?'ok':'lk'}"><i class="arIc">${g?'🏅':ok?'🎖️':'🔒'}</i><div class="arTx"><b>${twEsc(A.n)}</b><span>${twEsc(A.d)}</span></div><em class="arRw"><img src="${RQA.coin[0]}" alt="">${A.g}${A.tic?` <img src="${RQA.coin[2]}" alt="">${A.tic}`:''}</em>${ok&&!g?`<button class="arBtn gold" data-k="${A.k}">RESGATAR</button>`:`<span class="arSt">${g?'✔ FEITO':'BLOQUEADA'}</span>`}</div>`}).join('')}</div>`));
  $('rkMX').onclick=()=>{rkModal(null);if(RKV==='menu')rkView('menu')};
  const take=Lk=>{const c=rkG('achc',[]);let g=0,t=0;for(const A of Lk){if(c.includes(A.k)||!A.ok(rkSt()))continue;c.push(A.k);g+=A.g;t+=A.tic||0}rkS('achc',c);if(!g)return;rkAdd('gem',g);if(t)rkAdd('tic',t);rkSfx('powerUp');rkToast('+'+g+' 💎'+(t?' · +'+t+' 🎫':''),'#7fd8ff');rkAch()};
  document.querySelectorAll(RKMS()+'.arAch .arRow button').forEach(b=>b.onclick=()=>take([RKACH.find(x=>x.k===b.dataset.k)]));if($('rkAcAll'))$('rkAcAll').onclick=()=>take(RKACH)};
/* ---------- RECOMPENSAS DE RANK ---------- */
rkRewards=function(){const c=rkG('rwc2',[]),ri=rkRank(rkG('rp',0));
  rkModal(arP(ARI.rw,'arRwd',`<button class="arX" id="rkMX" style="${arB16(1555,22,1650,112)}">✕</button>
    <div class="arCnt" style="${arB16(560,214,1112,248)}">Seu rank: <b style="color:${RKR[ri].c}">${RKR[ri].n}</b> · ${rkFmtN(rkG('rp',0))} XP</div>
    <div class="arList" style="${arB16(82,262,1590,790)}">${RKR.map((R,i)=>{const got=c.includes(i)||i===0,can=i<=ri&&!got;return `<div class="arRow rw ${i<=ri?'ok':'lk'} ${got&&i<=ri?'got':''}" style="--c:${R.c}">${rkEmb(i,'xs')}<div class="arTx"><b style="color:${R.c}">${R.n}</b><span>${rkFmtN(R.min)} XP</span></div><div class="arRwT">${i?rkRwTxt(RKRW[i],i):'Rank inicial'}</div>${can?`<button class="arBtn gold" data-i="${i}">RESGATAR</button>`:`<span class="arSt">${got&&i<=ri?(i?'✔ RESGATADO':'✔'):'🔒 '+rkFmtN(R.min)+' XP'}</span>`}</div>`}).join('')}</div>`));
  $('rkMX').onclick=()=>{rkModal(null);if(RKV==='menu')rkView('menu')};document.querySelectorAll(RKMS()+'.arRwd .arRow button').forEach(b=>b.onclick=()=>rkRwClaim(+b.dataset.i));
  setTimeout(()=>{const e=document.querySelector(RKMS()+'.arRwd .arRow.ok:not(.got)')||document.querySelectorAll(RKMS()+'.arRwd .arRow.ok')[Math.max(0,ri-1)];if(e)e.scrollIntoView({block:'center'})},60)};
/* ---------- CONTA (a lógica continua no acOpen; aqui só troca o desenho) ---------- */
{const _m=acM;acM=function(h){if(h&&/id="acX"/.test(h)&&!/arAcc/.test(h)){const tab=/id="acSv"/.test(h)?'ok':/id="acIn"/.test(h)?'entrar':'novo';h=acArtH(tab,h)}return _m.call(this,h)}}
function acArtH(tab,old){const n=localStorage.getItem('ac_n'),k=localStorage.getItem('ac_k'),me=String(twLS.g('tw_nome','')||''),rp=rkG('rp',0),ri=rkRank(rp);
  const tabs=`<div class="twTab acTabs"><button data-t="${k?'ok':'novo'}" class="acTb l ${tab!=='entrar'?'on':'off'}" style="${arB16(490,230,826,306)}">${k?'':'<span>✨ CRIAR CONTA</span>'}</button><button data-t="entrar" class="acTb r ${tab==='entrar'?'on':'off'}" style="${arB16(874,230,1216,306)}"></button></div>`;
  let mid='',bot='';
  if(tab==='ok'){mid=`<div class="acMid ok" style="${arB16(540,352,1310,462)}"><b>Conectado: <i>${twEsc(n)}</i></b><span>Salvo sozinho · último: <i id="acLt">${acT(localStorage.getItem('ac_t'))}</i></span><span>Outro celular? ENTRAR com o mesmo nome e senha</span></div>`;
    bot=`<button class="acHb" id="acSv" style="${arB16(385,640,826,722)}"></button><button class="acHb" id="acOut" style="${arB16(856,640,1296,722)}"></button>`}
  else if(tab==='novo'){mid=`<div class="acMid cv" style="${arB16(352,340,1330,476)}">${me?`<span>Senha para o nome <i>${twEsc(me)}</i> (assim você nunca perde a conta)</span><div class="acIn2"><input id="acP1" class="rkCdI" type="password" maxlength="32" placeholder="SENHA (mín. 4)"><input id="acP2" class="rkCdI" type="password" maxlength="32" placeholder="REPITA A SENHA"></div>`:`<span class="err">Primeiro escolha seu nome (Modo Torre, botão do nome). Depois volte aqui.</span><span>Já tem conta? Toque em ENTRAR.</span>`}</div>`;
    bot=`<div class="acCov" style="${arB16(378,632,1304,730)}">${me?'<button class="arBtn gold big" id="acNew">✨ CRIAR CONTA</button>':''}</div>`}
  else{mid=`<div class="acMid cv" style="${arB16(352,340,1330,476)}"><span>Entre com o nome e a senha. O progresso deste aparelho será trocado pelo da conta.</span><div class="acIn2"><input id="acN" class="rkCdI" maxlength="16" placeholder="NOME" value="${twEsc(n||me)}"><input id="acP" class="rkCdI" type="password" maxlength="32" placeholder="SENHA"></div></div>`;
    bot=`<div class="acCov" style="${arB16(378,632,1304,730)}"><button class="arBtn gold big" id="acIn">🔑 ENTRAR</button></div>`}
  const st=`<div class="acSt" style="${arB16(500,500,722,575)}"><b style="color:${RKR[ri].c}">${RKR[ri].n}</b><small>${rkFmtN(rp)} XP</small></div><div class="acSt gm" style="${arB16(862,500,950,575)}"><b>${rkFmtN(rkG('gem',0))}</b></div><div class="acSt" style="${arB16(1090,500,1166,575)}"><b>${rkG('own',[]).length}</b></div><div class="acSt" style="${arB16(1290,500,1392,575)}"><b>${rkFmtN(twLS.g('tw_moedas',0)|0)}</b></div>`;
  return `<div class="arAcc">${arP(ARI.conta,'arAc',tabs+mid+st+bot+`<p class="twH acMsg" id="acE" style="${arB16(300,585,1372,632)}"></p><button class="acHb" id="acX" style="${arB16(708,750,966,820)}"></button>`)}</div>`}
/* ---------- RANKING (tela cheia) ---------- */
const RG2={W:1846,H:852,tab:'rp',pg:0,L:null,err:0},rgB=arBx(1846,852);
const RGT=[['rp','RANK',330,615],['dmg','DANO NO BROLY',630,925],['tt','MAIS RÁPIDO',940,1240],['t1','1ª FASE',1252,1528]];
const RGY=[[296,380],[385,468],[472,553],[558,638],[642,723]];
rkRanking=function(tab){RG2.tab=tab||'rp';RG2.pg=0;RG2.L=null;RG2.err=0;rkModal(null);rkView('rkg');
  rkLoadRk(RG2.tab).then(A=>{let L=A.slice();const t=RG2.tab;if(t==='rp')L.sort((a,b)=>b.rp-a.rp);else if(t==='dmg')L.sort((a,b)=>b.dmg-a.dmg);else L=L.filter(e=>e[t]>0).sort((a,b)=>a[t]-b[t]);RG2.L=L.slice(0,50);if(RKV==='rkg'&&RG2.tab===t)rgDraw()}).catch(()=>{RG2.err=1;if(RKV==='rkg')rgDraw()})};
function rgH(){return `<button class="hs" data-a="back" style="${rgB(30,12,172,80)}"></button><button class="hs" data-a="home" style="${rgB(1672,12,1816,80)}"></button>
  <div class="rgTit" style="${rgB(640,18,1206,92)}">RANKING</div>
  ${RGT.map(([k,n,a,b])=>`<button class="hs rgTb ${RG2.tab===k?'on':''}" data-a="rgTab" data-t="${k}" style="${rgB(a,118,b,184)}"><span>${n}</span></button>`).join('')}
  <div id="rgBody"></div>`}
/* título no ranking: só a escrita com brilho (sem caixa) */
function rgTit(k,nm){if(!k)return '';if(k==='adm'){if(nm!=null&&String(nm).toLowerCase()!==TWADMN.toLowerCase())return '';return '<em class="rgT" style="--c:#ff4a4a">👑 ADMINISTRADOR</em>'}const T=TWTIT[k];if(!T)return '';
  const n=T.yt?'YUTA Nº '+T.yt:T.n;return `<em class="rgT" style="--c:${T.c||'#ffd84a'}">${T.rk!=null?'':(T.i||'')+' '}${twEsc(n)}</em>`}
function rgDraw(){const B=$('rgBody');if(!B)return;const L=RG2.L,t=RG2.tab,me=twUid();
  if(!L){B.innerHTML=`<div class="rgMsg" style="${rgB(160,420,1690,600)}">${RG2.err?rkNetMsg():'Carregando...'}</div>`;return}
  const pages=Math.max(1,Math.ceil(L.length/5));RG2.pg=Math.min(RG2.pg,pages-1);const mi=L.findIndex(e=>e.uid===me);
  const val=e=>t==='rp'?rkFmtN(e.rp)+' XP':t==='dmg'?rkFmtN(e.dmg)+' DE DANO':twFmt(e[t]);
  B.innerHTML=`<div class="rgHd" style="${rgB(160,244,1690,292)}"><span>TOP ${L.length} · ${RGT.find(x=>x[0]===t)[1]}</span><span>${mi>=0?'VOCÊ: <b>#'+(mi+1)+'</b>':'Jogue para entrar no ranking'} · toque num jogador para ver o perfil</span></div>`+
    (L.length?L.slice(RG2.pg*5,RG2.pg*5+5).map((e,k)=>{const i=RG2.pg*5+k,ri=rkRank(e.rp);return `<div class="rgRw p${k}${RG2.pg?' pg':''}${e.uid===me?' me':''}" data-pu="${twEsc(e.uid||'')}" data-pn="${twEsc(e.nome||'')}" style="${rgB(150,RGY[k][0],1696,RGY[k][1])}"><b class="ps">${i<3?['🥇','🥈','🥉'][i]:'#'+(i+1)}</b><img src="${RQA.rank[ri]}" alt=""><span class="nm"><b>${twEsc(e.nome)}</b>${rgTit(twTN(e),e.nome)}</span><span class="vl">${val(e)}</span></div>`}).join('')
      :`<div class="rgMsg" style="${rgB(160,420,1690,600)}">Ninguém no ranking ainda. Seja o primeiro!</div>`)+
    `<button class="hs rgPg" data-a="rgPrev" style="${rgB(738,760,820,828)}" ${RG2.pg?'':'disabled'}>◀</button><div class="rgPn" style="${rgB(820,760,1020,828)}">${RG2.pg+1} / ${pages}</div><button class="hs rgPg" data-a="rgNext" style="${rgB(1020,760,1102,828)}" ${RG2.pg<pages-1?'':'disabled'}>▶</button>`;
  B.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)})}
{const _v=rkView;rkView=function(v){if(v!=='rkg'){if(MN2V&&v!=='menu')try{MN2V.pause()}catch(e){}return _v.apply(this,arguments)}
  RKV='rkg';const W=$('rkWrap');if(!W)return;clearInterval(rkView.iv);rkModal(null);
  W.innerHTML=`<div class="rkA rk_rkg" data-w="1846" data-h="852" style="background-image:url(${ARI.rank})">${rgH()}<div id="rkToast"></div></div>`;rkFit();
  W.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)});rgDraw()}}
{const _a=rkAct;rkAct=function(a,b){if(a==='rgTab'){rkSfx('whoosh');return rkRanking(b.dataset.t)}if(a==='rgPrev'||a==='rgNext'){rkSfx('whoosh');RG2.pg=Math.max(0,RG2.pg+(a==='rgNext'?1:-1));return rgDraw()}
  if(RKV==='rkg'&&a==='back')return rkView('menu');return _a.apply(this,arguments)}}

/* ================= v330: GACHA COM CARTAS (artes do dono) — carta de costas, vira e mostra o personagem; itens na carta prata ================= */
const CRT={bk:'a/a026770f8f7f6a.webp',it:'a/edd27632976e32.webp',chr:{aokiji:'a/0a098fa695642e.webp',aylla:'a/6ccef38861c12b.webp',broly:'a/b50ec01de304e7.webp',garou:'a/1153f60fd2534a.webp',gogeta:'a/3b6e662b4656af.webp',gojo:'a/54f2e8cb75d85a.webp',goku:'a/dc7ffa3d455519.webp',luffy:'a/58a4c5ee6a535f.webp',madara:'a/415275a74f441a.webp',naruto:'a/1aac141047dc70.webp',qingqing:'a/218e313507e907.webp',rengoku:'a/ffb9cd6d0075e2.webp',shaka:'a/01406711aaca1e.webp',vegeta:'a/fdbf12bb9602dd.webp',yuta:'a/d4b37c9906976a.webp',zaykon:'a/105d9294df3dc4.webp',zedry:'a/2a60d060ca8d21.webp',zoro:'a/241a16a1f4a5bf.webp'}};
let CRTP=null;{const _go=rkGachaOn;rkGachaOn=function(){_go.apply(this,arguments);if(!CRTP)CRTP=rkPre([CRT.bk,CRT.it])}}
const crtCor=x=>x.id==='shaka'?'#fff0b0':x.r==='sec'||x.r==='obs'?'#bfe8ff':x.k==='sp'?'#ff2e63':(TWEQR.find(R=>R.k===x.r)||TWEQR[0]).c;
/* nível do brilho: 3 = mítico/limitado (o mais forte), 2 = lendário, 1 = épico, 0 = comum */
const crtLv=x=>x.id==='shaka'||(x.k==='chr'&&x.r==='mit')||rkHi(x.r)?3:x.r==='mit'||x.k==='sp'||x.r==='lend'?2:x.r==='epica'?1:0;
function crtFront(x){const a=x.k==='chr'&&CRT.chr[x.id];if(a)return `<img class="cf" src="${a}" alt="" draggable="false">`;
  let ic='',nm='';if(x.k==='chr'){ic=IMG[x.id]?IMG[x.id].src:'';nm=CH[x.id]?CH[x.id].name:x.id}else if(x.k==='eq'){ic=twIco(x.E.k,x.r);nm=x.E.n}else if(x.k==='sp'){const S=RKSP[x.s]||RKSP.sec;ic=S.img;nm=S.nm}else{ic=RQA.coin[1];nm='+'+x.n+' MOEDA VERMELHA'}
  return `<img class="cf" src="${CRT.it}" alt="" draggable="false"><div class="ci"><img src="${ic}" alt="" draggable="false"></div><b class="cn">${nm}</b>`}
function crtTag(x){if(x.k==='chr')return x.nw?'<i class="tg nw">NOVO!</i>':`<i class="tg">REPETIDO +${x.dup}💎</i>`;
  if(x.k==='eq')return `<i class="tg" style="color:${crtCor(x)}">${(TWEQR.find(R=>R.k===x.r)||TWEQR[0]).n}</i>`;if(x.k==='sp')return `<i class="tg" style="color:${crtCor(x)}">${rkHi(x.r)?'✦ SECRETO ✦':'MÍTICO ESPECIAL'}</i>`;return ''}
const crtW=ms=>new Promise(r=>setTimeout(r,ms));
rkCards=function(L){const O=document.createElement('div');O.className='rkRes2 crO'+(document.body.classList.contains('lowfx')?' lo':'');const one=L.length===1;
  const sp=()=>Array.from({length:9},(_,j)=>`<s style="--x:${8+j*10.5}%;--d:${(j*.37)%1.6}s;--t:${1.6+(j%3)*.5}s"></s>`).join('');
  O.innerHTML=`<i class="crFog"></i><i class="crFog f2"></i><div class="crG ${one?'one':''}">${L.map((x,i)=>{const lv=crtLv(x);return `<div class="crC lv${lv}${x.id==='shaka'?' sk':''}${x.k==='chr'?' ch':' it'}" data-i="${i}" style="--c:${crtCor(x)};--i:${i}">
    <i class="ry"></i><i class="gl"></i><div class="bk"><img src="${CRT.bk}" alt="" draggable="false"><i class="sh"></i></div><div class="fr">${crtFront(x)}<i class="ho"></i><i class="sh"></i></div><i class="fl"></i>${lv>=3?`<span class="spk">${sp()}</span>`:''}${crtTag(x)}</div>`}).join('')}</div>
    <div class="row"><button class="btn" id="rkCdAll"${one?' hidden':''}>REVELAR TUDO</button><button class="btn main" id="rkCdOk" hidden>OK</button></div>`;
  rkHost().appendChild(O);const C=[...O.querySelectorAll('.crC')];
  const fr=rkPre(L.map(x=>x.k==='chr'&&CRT.chr[x.id]).filter(Boolean).concat([CRT.bk,CRT.it]));const ready=Promise.race([fr.p,crtW(2500)]);
  const rev=async el=>{if(!el||el.classList.contains('rv')||el.dataset.b)return;el.dataset.b=1;const x=L[+el.dataset.i],lv=crtLv(x);await ready;
    if(x.k==='chr'&&x.r==='mit')try{await (x.id==='yuta'?rkMegaY():x.id==='shaka'?rkMegaS():rkMega())}catch(e){} /* v374: erro 'hidden' de null travava a revelação */
    if(lv>=2){el.classList.add('chg');rkSfx(lv>=3?'powerUp':'whoosh');await crtW(lv>=3?900:550);el.classList.remove('chg')}
    el.classList.add('rv');rkSfx(lv>=2?'boom':'whoosh');if(lv>=2)setTimeout(()=>rkSfx('powerUp'),220);
    if(rkHi(x.r)){await crtW(500);try{await rkSecWin(x.s||'sec')}catch(e){}}
    if(x.k==='chr'&&x.r==='mit'){await crtW(one?1700:1200);await rkCharWin(x.id,1,x.nw);if(x.id==='yuta'&&x.nw)await ytTitClaim(1);if(x.id==='shaka'&&x.nw)await skTitClaim(1)}
    else if(x.k==='chr'&&x.nw&&x.r==='lend'){await crtW(one?1500:1000);await rkCharWin(x.id)}
    if(C.every(c=>c.classList.contains('rv'))){$('rkCdAll').hidden=true;$('rkCdOk').hidden=false}};
  C.forEach(el=>el.onclick=()=>rev(el));
  const auto=async()=>{await ready;for(const el of C){if(!O.isConnected)return;await rev(el);await crtW(one?300:230)}};setTimeout(auto,one?700:L.length*60+650);
  $('rkCdAll').onclick=async()=>{for(const el of C)await rev(el)};$('rkCdOk').onclick=()=>{O.remove();rkView('gacha')}};
/* v331: 3 códigos para todos, só com CONTA e 1 vez por conta (texto só com o dono) */
TWCUP['cf2w82']={nm:'50 GIROS DE PASSIVA',acc:1,jn:50};
TWCUP['1gvgw6x']={nm:'DIAMANTES DA SORTE',acc:1,rnd:[1000,4000]};
TWCUP['1laos4r']={nm:'TICKETS DA SORTE',acc:1,rtic:[10,40]};
/* v332: código só para UMA conta (campo so = twHash do nome da conta em minúsculas) */
{const _cp6=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];
  if(C&&C.so){const an=String(localStorage.getItem('ac_n')||'').toLowerCase().trim();if(!an||!localStorage.getItem('ac_k')||twHash(an)!==C.so){E.className='twH err';E.textContent='❌ Esse código é de outro jogador.';try{twSfx('clang')}catch(e){}return true}}
  return _cp6.apply(this,arguments)}}
TWCUP['1n4nhbj']={nm:'GAROU',it:[],chr:'garou',acc:1,so:'ymstjo'};

/* ================= v333: PVP RANQUEADA "SOMBRA" =================
   Cada jogador tem uma SOMBRA: o jogo grava o jeito que ele luta (em todas as lutas: golpes por situação, combos, defesa, tempo de reação)
   e os bônus reais do personagem (nível, equipamentos, anéis, passivas). No PVP você luta contra a sombra de outro jogador (IA que copia o estilo dele).
   Ranks por ESTRELA: Madeira 1-3 … Lendário 1-3 → Divino. Ganhou = +1 estrela (3 vitórias seguidas = +1 extra), perdeu = -1 (Madeira não perde).
   ADM liga/desliga o PVP (documento pvc_<ts> no servidor; desligado = ninguém busca nem envia nada).
   Servidor: sombra = documento pvs_<conta>_<ts> (no máx. 1 a cada 4 min) · aviso para o dono da sombra = pvr_<ts> · tudo da temporada do mês. */
const PVA={tela:'a/bbc5a551ec39e7.webp',e:{madeira:'a/0bd6de170a631d.webp',bronze:'a/22b6302ff619a9.webp',prata:'a/30f6b827ac50a2.webp',ouro:'a/045b38798470bc.webp',platina:'a/8995ae8c27d64f.webp',diamante:'a/5e424ef5f21f9f.webp',mestre:'a/5b3c28746a56f1.webp',lendario:'a/f8f1de7b753d92.webp',divino:'a/0e7f89a842c6cb.webp'},W:1849,H:851};
/* [nome, cor, estrelas para subir cada divisão, emblema, prêmio ao chegar a 1ª vez (💎, 🎫)] */
const PVT=[['MADEIRA','#c48a52',2,'madeira',0,0],['BRONZE','#e09a5c',3,'bronze',300,0],['PRATA','#dfe6ef',4,'prata',600,2],['OURO','#ffd34a',5,'ouro',1000,3],['PLATINA','#7fd0ff',7,'platina',1500,5],['DIAMANTE','#c79bff',10,'diamante',2500,8],['MESTRE','#ff9cf2',15,'mestre',4000,10],['LENDÁRIO','#ff5a5a',25,'lendario',6000,15],['DIVINO','#fff0b0',0,'divino',10000,25]];
const PVDIV=8,pvB=arBx(PVA.W,PVA.H),PVW=8,PVFREE=['idle','walk','crouch','cblock','jump','charge'];
const PV={on:null,onT:0,opp:null,srch:0,fight:null,last:''};
const pvG=()=>{const o=Object.assign({t:0,d:0,s:0,w:0,l:0,sq:0,bt:0,bd:0,rw:[],h:[]},rkG('pvp',{}));if(o.rz!==PVRZ){Object.assign(o,{t:0,d:0,s:0,w:0,l:0,sq:0,bt:0,bd:0,h:[],rz:PVRZ});rkS('pvp',o);rkS('pvup',0)}return o},pvSv=o=>{rkS('pvp',o);try{acSave()}catch(e){}};
const pvNeed=t=>PVT[t][2];
const pvRkName=(t,d)=>PVT[t][0]+(t<PVDIV?' '+(d+1):'');
/* pontuação contínua para o ranking: estrelas somadas de todas as divisões abaixo + as atuais */
const pvScore=o=>{let n=0;for(let t=0;t<o.t;t++)n+=pvNeed(t)*3;return n+o.d*pvNeed(o.t)+o.s};
/* v337: PVRZ = número do reset do PVP (zera o rank de todo mundo e separa as sombras no servidor) */
const PVRZ=1;const pvMon=()=>{const d=new Date(Date.now()-3*3600e3);return 'm'+d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,'0')+'r'+PVRZ};
const pvAcc=()=>{const n=String(localStorage.getItem('ac_n')||'').toLowerCase().trim();return n&&localStorage.getItem('ac_k')?twHash(n):''};
const pvEsc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pvChar=()=>{const own=rkG('own',['goku']),c=rkG('pvch','')||rkG('sel','goku');return own.includes(c)&&CH[c]?c:(own.find(i=>CH[i])||'goku')};
const pvPortrait=id=>(IMG[id]&&IMG[id].src)||fullSrc(id);
/* v336: time de 3 personagens (ordem = ordem de entrada). Quem tem menos de 3 repete. */
const pvTeam=()=>{const own=rkG('own',['goku']).filter(i=>CH[i]);let T=(rkG('pvt',null)||[pvChar()]).filter(i=>own.includes(i));T=[...new Set(T)].slice(0,3);for(const i of own){if(T.length>=3)break;if(!T.includes(i))T.push(i)}if(!T.length)T=['goku'];while(T.length<3)T.push(T[T.length-1]);return T};

/* ---------- 1) GRAVAR O ESTILO (todas as lutas do jogador, menos treino) ---------- */
function pvCtx(f,o){const dist=Math.abs(o.x-f.x),d=dist<130?0:dist<220?1:dist<360?2:3;
  const os=o.ko||!['idle','walk','crouch','cblock','jump','attack','fly','charge','super','block'].includes(o.state)?'v':(o.state==='attack'||o.state==='super')?'a':!o.grounded?'j':'n';
  let r='-';try{r=srReady(f)?'S':(f.ki>=100&&(f.sb||0)>=1)?'P':'-'}catch(e){}return d+os+(f.grounded?0:1)+r}
const pvThr=(f,o)=>{const dist=Math.abs(o.x-f.x);return (o.state==='attack'&&dist<230&&o.mf<4)||(o.state==='super'&&o.st>30&&o.st<56)||(G.projs||[]).some(p=>p.o===o&&Math.sign(p.vx)===Math.sign(f.x-p.x)&&Math.abs(p.x-f.x)<320)};
let PVR=null,PVF=null;
const pvProfAll=()=>{if(!PVF)PVF=rkG('pvf',{});return PVF};
const pvProf=id=>{const A=pvProfAll();return A[id]||(A[id]={c:{},ch:{},th:{},rd:[0,0],n:0})};
function pvRec(f){if(!G.p||f!==G.p[0]||G.phase!=='fight'||G.gmode==='treino'||G.gmode==='pvp'&&!PV.fight||G.paused||G.sr||G.ws||G.trans)return;const o=G.p[1];if(!o||f.cpu)return;
  let R=PVR;if(!R||R.g!==G.p){if(R)pvRecEnd();R=PVR={g:G.p,id:f.def.id,P:pvProf(f.def.id),pv:{},w:null,wf:0,ch:'',chL:-99,th:0,thT:0,thR:null}}
  const I=f.inp,Pv=R.pv,dx=o.x-f.x,tw=dx>0?'right':'left',aw=dx>0?'left':'right',pr=k=>I[k]&&!Pv[k],P=R.P;
  if(!R.w)R.w={c:pvCtx(f,o),free:PVFREE.includes(f.state),a:null,pri:0,ki:0,tw:0,aw:0,dn:0};const w=R.w,set=(p,a)=>{if(p>=w.pri){w.pri=p;w.a=a}};
  if(pr('sr'))set(9,'SR');if(pr('sp'))set(8,'SP');if(pr('tr'))set(7,'TR');
  const pp=pr('punch'),pk=pr('kick');if(pp||pk){set(6,pp?'P':'K');const k=pp?'P':'K';if(G.frame-R.chL<45&&R.ch.length<8)R.ch+=k;else{pvChainSave(R);R.ch=k}R.chL=G.frame}
  if(pr('up'))set(5,'J');if(I.ki)w.ki++;if(I[tw])w.tw++;if(I[aw]||I.bl)w.aw++;if(I.down)w.dn++;
  if(R.ch&&G.frame-R.chL>=45){pvChainSave(R);R.ch=''}
  /* reação quando o rival ataca: defendeu (B), pulou (J), contra-atacou (C), avançou (F) ou nada (N) + tempo */
  const thr=pvThr(f,o);if(thr&&!R.th){R.th=1;R.thT=G.frame;R.thR=null}
  if(R.th&&!R.thR){const dt=G.frame-R.thT;let r=null;if(I[aw]||I.bl)r='B';else if(pr('up'))r='J';else if(pp||pk)r='C';else if(I[tw]&&dt>2)r='F';
    if(r||dt>=30){R.thR=r||'N';P.th[R.thR]=(P.th[R.thR]||0)+1;if(r){P.rd[0]+=dt;P.rd[1]++}}}
  if(R.th&&!thr&&R.thR)R.th=0;
  for(const k in I)Pv[k]=I[k];
  if(++R.wf>=PVW){R.wf=0;R.w=null;if(!w.free)return;
    let a=w.a||(w.ki>=PVW*.75?'KC':w.ki>0?'KI':w.aw>=4?(R.th?'BL':'BK'):w.tw>=4?'FW':w.dn>=4?'DN':'ID');
    const T=P.c[w.c]||(P.c[w.c]={});T[a]=(T[a]||0)+1;P.n++;let s=0;for(const k in T)s+=T[k];if(s>240)for(const k in T)T[k]=Math.round(T[k]/2)}}
function pvChainSave(R){if(!R.ch)return;const C=R.P.ch;C[R.ch]=(C[R.ch]||0)+1;const ks=Object.keys(C);if(ks.length>24){ks.sort((a,b)=>C[a]-C[b]);delete C[ks[0]]}let s=0;for(const k in C)s+=C[k];if(s>300)for(const k in C){C[k]=Math.floor(C[k]/2);if(!C[k])delete C[k]}}
function pvRecEnd(){const R=PVR;if(!R)return;pvChainSave(R);R.ch='';if(R.P.n>4000)R.P.n=4000;rkS('pvf',pvProfAll());PVR=null}
{const _hi=humanInput;humanInput=function(f){_hi.apply(this,arguments);try{pvRec(f)}catch(e){}}}
{const _er=endRound;endRound=function(){try{pvRecEnd()}catch(e){}if(G.gmode==='pvp'){const w=G.koWinner;if(!G.teams)return pvEnd(w);
  const L=w<0?(G.p[0].hp<=G.p[1].hp?0:1):1-w,W2=1-L;G.ti[L]++;if(G.ti[L]>=G.teams[L].length)return pvEnd(W2);
  G.keep={side:W2,hp:Math.max(1,G.p[W2].hp),ki:G.p[W2].ki,sb:G.p[W2].sb||0};G.round++;startRound();const lf=G.teams[0].length-G.ti[0],rf=G.teams[1].length-G.ti[1];
  try{banner(L?'SOMBRA: PRÓXIMO':'SEU PRÓXIMO','#ffd23f',100,CH[G.teams[L][G.ti[L]]].name+' · VOCÊ '+lf+' x '+rf+' SOMBRA')}catch(e){}return}return _er.apply(this,arguments)}}
/* perfil enviado: o do personagem (se ainda tem pouco, junta com o estilo dos outros personagens) */
function pvProfOut(id){const A=pvProfAll(),P=A[id]||{c:{},ch:{},th:{},rd:[0,0],n:0};if(P.n>=300)return P;
  const M={c:{},ch:{},th:{},rd:[0,0],n:0};for(const k in A){const Q=A[k],wq=k===id?3:1;for(const c in Q.c){const T=M.c[c]||(M.c[c]={});for(const a in Q.c[c])T[a]=(T[a]||0)+Q.c[c][a]*wq}
    for(const c in Q.ch)M.ch[c]=(M.ch[c]||0)+Q.ch[c]*wq;for(const t in Q.th)M.th[t]=(M.th[t]||0)+Q.th[t]*wq;M.rd[0]+=Q.rd[0];M.rd[1]+=Q.rd[1];M.n+=Q.n}return M}

/* ---------- 2) BÔNUS REAIS do personagem (os mesmos do Modo Boss: nível, equipamentos, anéis, passivas, títulos) ---------- */
function pvDelta(id){const keep={p:G.p,gm:G.gmode,pk:G.pick,poc:localStorage.getItem('tw_pocOn'),c:localStorage.getItem('rk_pk_cura'),dr:localStorage.getItem('rk_pk_drop'),fs:RKB.fs,pdn:typeof RKPDN!=='undefined'?RKPDN:0};const out={};
  try{localStorage.removeItem('tw_pocOn');localStorage.removeItem('rk_pk_cura');localStorage.removeItem('rk_pk_drop');G.pick=id;const p=mkFighter(id,WW/2-210,1,false),o=mkFighter(id==='goku'?'vegeta':'goku',WW/2+210,-1,true),b={};
    for(const k in p){const v=p[k];if(typeof v==='number'||typeof v==='boolean')b[k]=v}G.p=[p,o];G.gmode='boss';rkApply();
    for(const k in p){const v=p[k];if((typeof v==='number'&&isFinite(v)||typeof v==='boolean')&&v!==b[k]&&!/^(x|y|vx|vy|st|mf|facing|pregT|pregTot|rkCura|hpLag|_.*)$/.test(k))out[k]=typeof v==='number'?Math.round(v*1e4)/1e4:v}
    if(p.def!==CH[id]){const D={};for(const k of ['energy','energy2','fe','fe2','frame'])if(p.def[k]!==CH[id][k])D[k]=p.def[k];if(Object.keys(D).length)out._def=D}}catch(e){}
  finally{G.p=keep.p;G.gmode=keep.gm;G.pick=keep.pk;if(keep.poc!=null)localStorage.setItem('tw_pocOn',keep.poc);if(keep.c!=null)localStorage.setItem('rk_pk_cura',keep.c);if(keep.dr!=null)localStorage.setItem('rk_pk_drop',keep.dr);try{RKPDN=keep.pdn}catch(e){}RKB.fs=keep.fs}return out}
const pvPow=d=>Math.round(100*((d.tdm||1)*(d.tsp||1)/(d.tdf||1))*(1+(d.tcr||0)/100));

/* ---------- 3) SERVIDOR (liga/desliga, enviar sombra, buscar, avisos, ranking) ---------- */
const pvIV=v=>({integerValue:String(Math.max(0,Math.round(v||0)))});
const pvPost=(id,f)=>twFetchT(TWURL+'/torre?documentId='+id+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})});
async function pvQ(field,val,lim,ob,dir){const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:field},op:'EQUAL',value:{stringValue:val}}},orderBy:[{field:{fieldPath:ob||'__name__'},direction:dir||'DESCENDING'}],limit:lim||40}};
  const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);const j=await r.json(),o=[];
  for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F)continue;const e={_id:x.document.name.split('/').pop()};for(const k in F){const v=F[k];e[k]=v.stringValue!=null?v.stringValue:v.integerValue!=null?+v.integerValue:v.doubleValue}o.push(e)}return o}
async function pvCfgLoad(force){if(!force&&PV.on!=null&&Date.now()-PV.onT<120e3)return PV.on;try{const L=await pvQ('pvc','1',1);PV.on=L.length?!!L[0].on:true;PV.onT=Date.now()}catch(e){if(PV.on==null)PV.on=true}return PV.on}
async function pvCfgSet(on){const ts=Date.now();const r=await pvPost('pvc_'+ts.toString(36).padStart(9,'0'),{nome:{stringValue:twLS.g('tw_nome','')||'ADM'},andar:pvIV(0),tempo:pvIV(0),pvc:{stringValue:'1'},on:pvIV(on?1:0),ts:pvIV(ts)});if(!r.ok)throw new Error('net');PV.on=on;PV.onT=Date.now()}
async function pvUp(force){const acc=pvAcc();if(!acc||PV.on===false)return false;const o=pvG(),id=pvTeam()[0],nm=twLS.g('tw_nome','')||'Jogador';
  const last=rkG('pvup',0);if(!force&&Date.now()-last<240e3)return true;
  const TM=pvTeam(),team=TM.map(c=>({ch:c,p:pvProfOut(c),s:pvDelta(c),lv:(()=>{try{return lvOf(c).lv}catch(e){return 1}})()}));const d={team,p:team[0].p,s:team[0].s,ch:TM[0],t:o.t,dv:o.d,st:o.s,w:o.w,l:o.l,lv:(()=>{try{return lvOf(id).lv}catch(e){return 1}})()};
  const ts=Date.now(),f={nome:{stringValue:nm.slice(0,16)},andar:pvIV(0),tempo:pvIV(0),pvk:{stringValue:pvMon()},pvg:{stringValue:'g'+o.t+'_'+pvMon()},pvs:pvIV(pvScore(o)),pvn:{stringValue:String(nm).toLowerCase().trim()},pva:{stringValue:acc},ch:{stringValue:id},tit:{stringValue:(()=>{try{return twTitOn()}catch(e){return ''}})()},d:{stringValue:JSON.stringify(d)},v:pvIV(333)};
  try{const r=await pvPost('pvs_'+acc+'_'+ts.toString(36).padStart(9,'0'),f);if(r.ok){rkS('pvup',ts);return true}}catch(e){}return false}
const pvParse=e=>{try{const d=JSON.parse(e.d||'{}');if(!d.p||!d.ch||!CH[d.ch])return null;let team=(Array.isArray(d.team)?d.team:[{ch:d.ch,p:d.p,s:d.s||{}}]).filter(x=>x&&CH[x.ch]&&x.p).slice(0,3);if(!team.length)return null;while(team.length<3)team.push(team[team.length-1]);
  return {nome:e.nome,acc:e.pva,ch:team[0].ch,team,t:d.t|0,dv:d.dv|0,st:d.st|0,w:d.w|0,l:d.l|0,lv:d.lv|0,tit:e.tit||'',p:d.p,s:d.s||{}}}catch(x){return null}};
/* busca: mesmo rank → ranks vizinhos → qualquer um da temporada; nunca você mesmo; evita repetir o último */
async function pvFind(){const o=pvG(),me=pvAcc(),seen=new Set(),pool=[];const add=L=>{for(const e of L){if(!e.pva||e.pva===me||seen.has(e.pva))continue;seen.add(e.pva);const x=pvParse(e);if(x)pool.push(x)}};
  for(const t of [o.t,o.t-1,o.t+1,o.t-2,o.t+2]){if(t<0||t>PVDIV)continue;add(await pvQ('pvg','g'+t+'_'+pvMon(),40));if(pool.length>=4)break}
  if(pool.length<2)add(await pvQ('pvk',pvMon(),60));if(!pool.length)return null;
  const S=pvScore(o);pool.sort((a,b)=>Math.abs(pvScore({t:a.t,d:a.dv,s:a.st})-S)-Math.abs(pvScore({t:b.t,d:b.dv,s:b.st})-S));
  const top=pool.slice(0,Math.min(5,pool.length)).filter(x=>x.acc!==PV.last);const L=top.length?top:pool;return L[(Math.random()*L.length)|0]}
async function pvFindName(n){const L=await pvQ('pvn',String(n).toLowerCase().trim(),5);for(const e of L){const x=pvParse(e);if(x)return x}return null}
function pvNotify(opp,won){if(!opp||!opp.acc)return;const ts=Date.now(),nm=twLS.g('tw_nome','')||'Jogador';pvPost('pvr_'+ts.toString(36).padStart(9,'0')+'_'+Math.random().toString(36).slice(2,6),{nome:{stringValue:nm.slice(0,16)},andar:pvIV(0),tempo:pvIV(0),pvo:{stringValue:opp.acc},ch:{stringValue:G.pick||''},won:pvIV(won?1:0),ts:pvIV(ts)}).catch(()=>{})}

/* ---------- 4) A SOMBRA LUTANDO (IA que copia o estilo gravado) ---------- */
const pvPick=T=>{let s=0;for(const k in T)s+=T[k];if(s<=0)return null;let r=Math.random()*s;for(const k in T){if((r-=T[k])<0)return k}return null};
function pvPrep(P){if(P._ok)return P;const c2={},c1={};for(const c in P.c){const k2=c.slice(0,2),k1=c[0]+'.'+c.slice(2);for(const [K,M] of [[k2,c2],[k1,c1]]){const T=M[K]||(M[K]={});for(const a in P.c[c])T[a]=(T[a]||0)+P.c[c][a]}}
  P.c2=c2;P.c1=c1;let s=0;for(const k in P.th)s+=P.th[k];P.thS=s;P.rdA=P.rd&&P.rd[1]?P.rd[0]/P.rd[1]:9;P._ok=1;return P}
function pvThink(f,o){const P=pvPrep(f.pvP),A=f.ai,I=f.inp,dx=o.x-f.x,dist=Math.abs(dx),tw=dx>0?'right':'left',aw=dx>0?'left':'right';
  I.punch=I.kick=I.sp=I.sw=I.tr=I.sr=I.fly=0;I.left=I.right=I.up=I.down=0;I.ki=0;
  if(A.kc>0){A.kc--;I.ki=1;if(f.ki>=100||dist<170)A.kc=0}else if(A.kt>0){A.kt--;I.ki=1}
  /* reação ao ataque do rival: igual ao jogador (defesa/pulo/contra-ataque), com o tempo de reação dele (mínimo de um humano rápido) */
  const thr=pvThr(f,o);if(thr&&!A.pr){A.pr=1;const r=P.thS>3?pvPick(P.th):(Math.random()<.5?'B':'N');A.prT=G.frame+Math.max(6,Math.round(P.rdA*(.8+Math.random()*.4)));A.prR=r;A.prL=!!(o.move&&o.move.low)}
  if(!thr&&A.pr&&!A.prR)A.pr=0;
  if(A.prR&&G.frame>=A.prT){const r=A.prR;A.prR=null;if(r==='B'){A.hold={[aw]:1,down:A.prL?1:0};A.holdT=14+(Math.random()*10|0)}else if(r==='J'){A.hold={up:1,[aw]:1};A.holdT=4}else if(r==='C'&&PVFREE.includes(f.state)){A.press=pvPick(Object.fromEntries(Object.entries(P.ch).map(([k,v])=>[k[0],v])))==='K'?'kick':'punch'}else if(r==='F'){A.hold={[tw]:1};A.holdT=8}}
  if(A.press){I[A.press]=1;A.press=null;return}
  if(A.holdT>0){A.holdT--;Object.assign(I,A.hold);return}
  /* combo: segue a sequência que o jogador costuma fazer (um botão por golpe, no tempo certo) */
  if(f.state==='attack'){if(A.chn&&A.chi<A.chn.length&&f.move&&f.move!==A.chM&&f.mf>=f.move.su+1){I[A.chn[A.chi]==='P'?'punch':'kick']=1;A.chi++;A.chM=f.move}return}
  if(!PVFREE.includes(f.state))return;
  if(A.wt>0){A.wt--;if(A.walk)I[A.walk]=1;return}
  A.walk=null;A.wt=PVW-1;const c=pvCtx(f,o);let T=P.c[c];let tot=0;for(const k in T||{})tot+=T[k];
  if(tot<4){T=P.c2[c.slice(0,2)];tot=0;for(const k in T||{})tot+=T[k];if(tot<4)T=P.c1[c[0]+'.'+c.slice(2)]}
  let a=T&&pvPick(T)||(dist>220?'FW':'P');
  if(a==='SR'&&!srReady(f))a='FW';if(a==='SP'&&!(f.ki>=100&&(f.sb||0)>=1))a='P';
  if(a==='P'||a==='K'){const C={};for(const k in P.ch)if(k[0]===a)C[k]=P.ch[k];A.chn=pvPick(C)||a;A.chi=1;A.chM=null;I[a==='P'?'punch':'kick']=1;if(dist>200){A.hold={[tw]:1};A.holdT=4}}
  else if(a==='SR')I.sr=1;else if(a==='SP')I.sp=1;else if(a==='TR')I.tr=1;
  else if(a==='J'){A.hold={up:1,[tw]:Math.random()<.6?1:0};A.holdT=4}
  else if(a==='KI'){A.kt=2}else if(a==='KC'){A.kc=40+(Math.random()*40|0);A.wt=Math.min(A.kc,30)}
  else if(a==='BL'||a==='BK')A.walk=aw;else if(a==='FW')A.walk=tw;else if(a==='DN'){A.hold={down:1};A.holdT=PVW}}
/* v338: SOMBRA COMBISTA — emenda todos os golpes no tempo certo (soco→soco→…→chute que lança), persegue no ar, fecha com especial/super.
   Defesa e aproximação = máquina no nível máximo. O estilo gravado escolhe a sequência do combo e às vezes a jogada. */
function pvCmbSeq(f){const P=f.pvP,C=P&&P.ch||{};let best=null,bn=0;for(const k in C)if(k.length>=3&&C[k]>bn){bn=C[k];best=k}
  const base=best&&Math.random()<.5?best:'PPPPK';return (base+'PPKK').slice(0,7).split('').map(c=>c==='K'?'kick':'punch')}
function pvCombo(f,o,_a){const A=f.ai,I=f.inp,dx=o.x-f.x,dist=Math.abs(dx),dy=o.y-f.y,tw=dx>0?'right':'left';
  const tap=k=>{if(A.tf===G.frame-1&&A.tk===k)return false;I[k]=1;A.tf=G.frame;A.tk=k;return true};
  const stun=o.hitstun>0||['hit','fall','down','launch','air'].includes(o.state)&&!o.ko;
  for(const k of ['punch','kick','sp','sr','up','left','right','down','ki'])I[k]=0;
  /* no meio do golpe: emenda o próximo assim que dá */
  if(f.state==='attack'&&f.move){if(f.mf>=f.move.su+1&&f.hasHit&&A.cm!==f.move){A.cm=f.move;const sq=A.sq||(A.sq=pvCmbSeq(f));if(A.si<sq.length){tap(sq[A.si]);A.si++}
      else{if(srReady(f)&&Math.abs(dy)<200)I.sr=1;else if(f.ki>=100&&(f.sb||0)>=1&&dist<200)I.sp=1;A.sq=null;A.si=0}}return true}
  if(!PVFREE.includes(f.state))return false;
  /* limite: depois de ~22 golpes seguidos solta o rival (igual jogador de verdade, sem combo infinito) */
  if((f.combo||0)>=22){A.rest2=G.frame+40}if(G.frame<(A.rest2||0))return false;
  /* rival tonto/caído no ar: persegue e recomeça */
  if(stun&&dist<230){A.sq=null;A.si=1;if(!o.grounded&&o.y<FLOOR-80&&f.grounded&&dy<-60){I.up=1;I[tw]=1;return true}if(dist>110)I[tw]=1;tap('punch');A.cm=null;A.sq=pvCmbSeq(f);return true}
  /* perto e o rival não está atacando: abre o combo */
  if(dist<120&&Math.abs(dy)<90&&!pvThr(f,o)&&Math.random()<.55){A.sq=pvCmbSeq(f);A.si=1;A.cm=null;tap(A.sq[0]);return true}
  /* super pronto e perto: solta */
  if(srReady(f)&&dist<260&&Math.abs(dy)<150&&!pvThr(f,o)&&Math.random()<.04){I.sr=1;return true}
  return false}
{const _a=aiThink;aiThink=function(f,o){if((G.gmode==='pvp'||G.gmode==='dsf')&&f.pvN){if(pvCombo(f,o,_a))return;
    if(f.pvP&&f.pvP.n>=60){const A=f.ai;if(G.frame>=(A.pvSw||0)){A.pvSw=G.frame+PVW*2;A.pvM=Math.random()<.25}if(A.pvM&&!pvThr(f,o)&&!(A.holdT>0))return pvThink(f,o)}}
  return _a.apply(this,arguments)}}
/* v336: na PVP a máquina usa o nível mais difícil da Torre (reação, defesa e combos máximos) */
{const _lv=twLV;twLV=function(){if(G.gmode==='pvp'||G.gmode==='dsf')return TWLV[TWLV.length-1];return _lv.apply(this,arguments)}}
/* bônus dos dois lados na luta */
{const _ra=rkApply;rkApply=function(){const r=_ra.apply(this,arguments);if(G.gmode==='pvp'&&G.p&&PV.fight){const [p,o]=G.p,F=PV.fight,ap=(f,D)=>{D=D||{};for(const k in D)if(k!=='_def')f[k]=D[k];if(D._def)f.def=Object.assign({},f.def,D._def);if(f.preg){f.pregT=G.frame;f.pregTot=0;f._lhp=f.hp}};ap(p,F.my[p.def.id]);const ot=F.opp.team.find(x=>x.ch===o.def.id)||F.opp.team[0];ap(o,ot.s);o.tdm=(o.tdm||1)+.1;o.tdf=1/(1/(o.tdf||1)+.1);if(F.opp.tit==='adm'){o.tdm*=1.5;o.tdf/=1.5;o.tcr=(o.tcr||0)+30;o.admS=1}o.pvP=ot.p;o.pvN=F.opp.nome}return r}}

/* ---------- 5) LUTA: começar e terminar ---------- */
function pvStart(opp,friendly){rkInit();if(!SPR_OK)return;const TM=pvTeam(),sel=TM[0];try{fsTry()}catch(e){}
  const my={};for(const c of TM)if(!my[c])my[c]=pvDelta(c);PV.fight={opp,friendly:!!friendly,my,teams:[TM.slice(),opp.team.map(x=>x.ch)]};PV.last=opp.acc;G.pick=sel;G.opp=opp.ch;G.gmode='pvp';PV.diff0=G.diff;G.diff=2;PV.lives0=G.lives;G.lives=2;
  const sk=Object.keys(STG).filter(k=>!STG[k].hid);G.nextStg=sk[(Math.random()*sk.length)|0];
  const PM=prepMatch([...new Set(PV.fight.teams[0].concat(PV.fight.teams[1]))],G.nextStg);showVS(()=>PM.then(()=>{vsLoadEnd();startMatch();setTimeout(()=>{try{banner(friendly?'SALA PERSONALIZADA':'PVP RANQUEADA','#c58bff',100,'SOMBRA DE '+String(opp.nome).toUpperCase())}catch(e){}},300)}),PM)}
function pvStep(o,won){const b={t:o.t,d:o.d,s:o.s},need=pvNeed(o.t);let gain=0;
  if(won){o.w++;o.sq=Math.max(0,o.sq)+1;gain=1+(o.sq>=3&&o.t<PVDIV?1:0);for(let i=0;i<gain;i++){if(o.t>=PVDIV){o.s++;continue}o.s++;if(o.s>=pvNeed(o.t)){o.s=0;if(o.d<2)o.d++;else{o.t++;o.d=0}}}}
  else{o.l++;o.sq=0;if(o.t===0){}else if(o.s>0)o.s--;else if(o.t>=PVDIV){o.t=PVDIV-1;o.d=2;o.s=pvNeed(o.t)-1}else if(o.d>0){o.d--;o.s=pvNeed(o.t)-1}else if(o.t>1){o.t--;o.d=2;o.s=pvNeed(o.t)-1}}
  if(o.t>o.bt||o.t===o.bt&&o.d>o.bd){o.bt=o.t;o.bd=o.d}return {b,gain,up:o.t>b.t||o.t===b.t&&o.d>b.d,down:o.t<b.t||o.t===b.t&&o.d<b.d}}
function pvEnd(w){const F=PV.fight;G.mode='ranked';$('controls').hidden=true;$('pauseBtn').hidden=true;try{rainSound(0)}catch(e){}G.paused=false;G.diff=PV.diff0;G.lives=PV.lives0;G.gmode='pve';PV.fight=null;if(!F)return rkOpen('pvp');
  const won=w===0,o=pvG();let st=null,rw=[];
  if(!F.friendly){st=pvStep(o,won);for(let t=1;t<=o.t;t++)if(!o.rw.includes(t)){o.rw.push(t);rw.push(t);const T=PVT[t];if(T[4])rkAdd('gem',T[4]);if(T[5])rkAdd('tic',T[5])}if(won)rkAdd('gem',15)}
  o.h.unshift({n:F.opp.nome,c:F.opp.ch,my:G.pick,w:won?1:0,f:F.friendly?1:0,r:pvRkName(o.t,o.d),d:Date.now()});o.h=o.h.slice(0,30);pvSv(o);
  if(!F.friendly){pvNotify(F.opp,won);pvUp(1)}
  rkOpen('pvp');setTimeout(()=>pvResult(F,won,st,rw,o),350)}
function pvResult(F,won,st,rw,o){const T=PVT[o.t],stars=st?(won?'+'+st.gain+' ⭐'+(st.gain>1?' (SEQUÊNCIA DE 3!)':''):(st.b.t===0?'sem perder estrela (Madeira)':'-1 ⭐')):'';
  rkModal(`<div class="twM pvRes ${won?'win':'lose'}"><h3>${won?'🏆 VITÓRIA!':'💀 DERROTA'}</h3><p class="twH">${F.friendly?'Sala personalizada (não vale estrela)':'Você '+(won?'venceu':'perdeu para')+' a sombra de <b>'+pvEsc(F.opp.nome)+'</b>'}</p>
    ${st?`<div class="pvResR"><img src="${PVA.e[T[3]]}" alt=""><div><b style="color:${T[1]}">${pvRkName(o.t,o.d)}</b><span>${stars}${won?' · +15 💎':''}</span>${st.up?'<em class="up">⬆ SUBIU DE RANK!</em>':st.down?'<em class="dn">⬇ caiu de rank</em>':''}</div></div>`:''}
    ${rw.map(t=>`<p class="twH pvRw">🎁 Primeira vez em <b style="color:${PVT[t][1]}">${PVT[t][0]}</b>: +${rkFmtN(PVT[t][4])} 💎${PVT[t][5]?' +'+PVT[t][5]+' 🎫':''}</p>`).join('')}
    <div class="row"><button class="btn main" id="pvAg">⚔️ BUSCAR OUTRA</button><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  rkSfx(won?'powerUp':'clang');$('rkMX').onclick=()=>{rkModal(null);rkView('pvp')};$('pvAg').onclick=()=>{rkModal(null);rkView('pvp');pvSearch()}}

/* ---------- 6) TELA DO PVP (arte do dono) ---------- */
const PVRY=[188,250,308,368,427,487,550,612];
function pvStars(o){const n=pvNeed(o.t);if(o.t>=PVDIV)return `<div class="pvSt big">⭐ ${o.s}</div>`;if(n>7)return `<div class="pvSt big">⭐ ${o.s} / ${n}</div>`;return `<div class="pvSt">${Array.from({length:n},(_,i)=>`<i class="${i<o.s?'on':''}">★</i>`).join('')}</div>`}
function pvH(){const o=pvG(),T=PVT[o.t],me=pvTeam()[0],off=PV.on===false,acc=pvAcc(),opp=PV.opp;
  return `<button class="hs" data-a="back" style="${pvB(8,4,135,88)}"></button><button class="hs" data-a="pvRules" style="${pvB(1672,10,1744,78)}"></button><button class="hs" data-a="pvCfg" style="${pvB(1760,10,1834,78)}"></button>
  <div class="pvMe" style="${pvB(26,160,298,428)}"><img src="${PVA.e[T[3]]}" alt=""><b style="color:${T[1]}">${pvRkName(o.t,o.d)}</b>${pvStars(o)}<small>${o.w} V · ${o.l} D${o.sq>=2?' · 🔥 '+o.sq+' seguidas':''}</small></div>
  <button class="hs pvL" data-a="pvRw" style="${pvB(32,452,288,514)}"></button><button class="hs pvL" data-a="pvRank" style="${pvB(32,518,288,580)}"></button><button class="hs pvL" data-a="pvHist" style="${pvB(32,584,288,646)}"></button><button class="hs pvL" data-a="pvRules" style="${pvB(32,650,288,712)}"></button>
  <button class="hs pvP p1" data-a="pvForm" style="${pvB(478,408,688,584)}"><img src="${pvPortrait(me)}" alt=""><span>${pvEsc(CH[me].name)}</span></button><div class="pvSm" style="${pvB(694,430,760,584)}">${pvTeam().slice(1).map(c=>`<img src="${pvPortrait(c)}" alt="">`).join('')}</div>
  <div class="pvNm" style="${pvB(440,590,730,640)}">${pvEsc(twLS.g('tw_nome','')||'Você')}</div>
  ${opp?`<div class="pvSm r" style="${pvB(1116,430,1182,584)}">${opp.team.slice(1).map(x=>`<img src="${pvPortrait(x.ch)}" alt="">`).join('')}</div>`:''}<div class="hs pvP p2 ${opp?'on':''} ${PV.srch?'srch':''}" style="${pvB(1182,408,1392,584)}">${opp?`<img src="${pvPortrait(opp.ch)}" alt=""><span>${pvEsc(CH[opp.ch].name)}</span>`:PV.srch?'<i class="pvSpin"></i>':''}</div>
  <div class="pvNm" style="${pvB(1140,590,1430,640)}">${opp?`<img src="${PVA.e[PVT[opp.t][3]]}" alt="">${pvEsc(opp.nome)} <small style="color:${PVT[opp.t][1]}">${pvRkName(opp.t,opp.dv)}</small>`:PV.srch?'PROCURANDO...':''}</div>
  ${PVRY.map((y,i)=>(i+1===o.t?`<div class="pvRkOn" style="${pvB(1574,y-30,1826,y+30)}"></div>`:'')+`<button class="hs pvTr" data-a="pvTier" data-t="${i+1}" style="${pvB(1576,y-28,1824,y+28)}">${(()=>{const n=PV.all?PV.all.filter(e=>e.t===i+1).length:0;return n?`<b>${n}</b>`:''})()}</button>`).join('')}<button class="hs pvTr tt" data-a="pvTier" data-t="all" style="${pvB(1600,104,1800,152)}">${PV.all?`<b>${PV.all.length}</b>`:''}</button>
  <button class="hs pvL" data-a="pvForm" style="${pvB(404,734,700,798)}"></button><button class="hs pvGo ${PV.srch||opp?'busy':''}" data-a="pvGo" style="${pvB(728,706,1140,822)}"><span class="sw"></span></button><button class="hs pvL" data-a="pvRoom" style="${pvB(1164,734,1486,798)}"></button>
  ${off?`<div class="pvOff" style="${pvB(470,150,1400,330)}"><b>⛔ PVP DESLIGADO</b><span>O ADM desligou o PVP por enquanto. Volte mais tarde!</span></div>`:!acc?`<div class="pvOff soft" style="${pvB(520,180,1350,320)}"><b>👤 PRECISA DE CONTA</b><span>Crie ou entre na sua conta (botão Conta) para jogar o PVP.</span></div>`:''}`}
{const _v=rkView;rkView=function(v){if(v!=='pvp')return _v.apply(this,arguments);
  RKV='pvp';const W=$('rkWrap');if(!W)return;clearInterval(rkView.iv);rkModal(null);try{if(MN2V)MN2V.pause()}catch(e){}
  W.innerHTML=`<div class="rkA rk_pvp" data-w="${PVA.W}" data-h="${PVA.H}" style="background-image:url(${PVA.tela})">${pvH()}<div id="rkToast"></div></div>`;rkFit();
  W.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)})}}
const pvRe=()=>{if(RKV==='pvp'&&showScreen.cur==='ranked'&&!PV.fight)rkView('pvp')};
async function pvOpen(){PV.opp=null;PV.srch=0;rkView('pvp');const was=PV.on;await pvCfgLoad();if(PV.on!==was)pvRe();if(PV.on){if(pvAcc())pvUp((rkG('pvupv',0)|0)<352?(rkS('pvupv',352),1):0);pvLoadAll().then(()=>{const M=$('rkModal');if(!M||!M.innerHTML)pvRe()}).catch(()=>{})}}
async function pvSearch(){if(PV.srch||PV.opp)return;if(!pvAcc())return rkToast('👤 Entre na sua CONTA para jogar o PVP','#ffb060');
  await pvCfgLoad();if(!PV.on){pvRe();return rkToast('⛔ O PVP está desligado pelo ADM','#ff8080')}
  PV.srch=1;pvRe();rkSfx('whoosh');const t0=Date.now();let opp=null,err=0;try{await pvUp(1);opp=await pvFind()}catch(e){err=1}
  await new Promise(r=>setTimeout(r,Math.max(0,1600-(Date.now()-t0))));PV.srch=0;
  if(!opp){pvRe();return rkToast(err?rkNetMsg():'Nenhuma sombra encontrada ainda. Chame os amigos para jogar o PVP!','#ffb060')}
  PV.opp=opp;pvRe();rkSfx('boom');let n=3;const tick=()=>{if(RKV!=='pvp'||PV.opp!==opp)return;const b=document.querySelector('.rk_pvp .pvGo');if(b)b.dataset.n=n;if(n<=0){PV.opp=null;pvStart(opp,0);return}n--;rkSfx('whoosh');setTimeout(tick,900)};setTimeout(tick,600)}
async function pvRoom(){if(!pvAcc())return rkToast('👤 Entre na sua CONTA para jogar o PVP','#ffb060');
  rkModal(`<div class="twM sm"><h3>🛡️ SALA PERSONALIZADA</h3><p class="twH">Lute contra a sombra de um amigo pelo nome dele. Não vale estrela.</p><input id="pvRn" class="rkCdI" maxlength="16" autocomplete="off" placeholder="NOME DO JOGADOR"><p class="twH" id="pvRe"></p><div class="row"><button class="btn main" id="pvRok">LUTAR</button><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);const go=async()=>{const n=$('pvRn').value.trim(),E=$('pvRe');if(!n)return;if(n.toLowerCase()===String(twLS.g('tw_nome','')).toLowerCase()){E.textContent='Esse é você 😅';return}
    await pvCfgLoad();if(!PV.on){E.textContent='⛔ O PVP está desligado pelo ADM';return}E.textContent='Procurando...';$('pvRok').disabled=true;
    try{const x=await pvFindName(n);if(!x){E.textContent='❌ Esse jogador ainda não tem sombra no PVP.';$('pvRok').disabled=false;return}rkModal(null);pvStart(x,1)}catch(e){E.textContent=rkNetMsg();$('pvRok').disabled=false}};
  $('pvRok').onclick=go;$('pvRn').onkeydown=e=>{if(e.key==='Enter')go()}}
function pvForm(){const own=rkG('own',['goku']).filter(id=>CH[id]),TM=pvTeam(),A=pvProfAll();
  rkModal(`<div class="twM pvFm"><h3>👥 FORMAÇÃO · TIME DE 3</h3><p class="twH">Escolha 3 personagens (toque na ordem: 1º entra primeiro). Para ganhar, tem que derrotar os 3 do rival. A sua SOMBRA usa este time.</p><div class="pvFg">${own.map(id=>{const n=(A[id]&&A[id].n)||0,p=Math.min(100,Math.round(n/3));const k=TM.indexOf(id);return `<button class="pvFc ${k>=0?'on':''}" data-id="${id}">${k>=0?`<em class="pvFn">${k+1}</em>`:''}<img src="${pvPortrait(id)}" alt=""><b>${pvEsc(CH[id].name)}</b><small>${p>=100?'✔ estilo gravado':'estilo '+p+'%'}</small><i style="width:${p}%"></i></button>`}).join('')}</div>
    <p class="twH">O estilo é gravado sozinho em todas as suas lutas (Boss, Torre, Caça, PVP). Quanto mais você joga com o personagem, mais a sombra fica parecida com você.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>{rkModal(null);rkView('pvp')};document.querySelectorAll('#rkModal .pvFc').forEach(b=>b.onclick=()=>{const id=b.dataset.id;let T=(rkG('pvt',null)||pvTeam()).filter(i=>own.includes(i));T=[...new Set(T)];if(T.includes(id))T=T.filter(i=>i!==id);else{if(T.length>=3)T.shift();T.push(id)}rkS('pvt',T);rkS('pvch',T[0]||id);rkS('pvup',0);rkSfx('whoosh');pvForm()})}
function pvRules(){rkModal(`<div class="twM pvRu"><h3>📖 REGRAS DO PVP SOMBRA</h3><div class="pvRuB">
  <p>⚔️ Cada jogador tem uma <b>SOMBRA</b>. O jogo grava o seu jeito de lutar (golpes, combos, defesa, quando solta o super e o tempo de reação) e os bônus reais do personagem (nível, equipamentos, anéis, passivas).</p>
  <p>🔎 <b>Buscar Partida</b>: você enfrenta a sombra de alguém do seu rank. Ela luta igual ao dono dela.</p>
  <p>⭐ Ganhou = <b>+1 estrela</b> (3 vitórias seguidas = +1 estrela extra). Perdeu = <b>-1 estrela</b>. Na Madeira você não perde estrela.</p>
  <p>🏅 Cada rank tem 3 divisões (1, 2, 3). Estrelas para subir: ${PVT.slice(0,PVDIV).map(T=>`<b style="color:${T[1]}">${T[0]} ${T[2]}</b>`).join(' · ')} → <b style="color:${PVT[PVDIV][1]}">DIVINO</b> (estrelas sem limite).</p>
  <p>🎁 Primeira vez em cada rank = prêmio (veja em Recompensas). Cada vitória = +15 💎.</p>
  <p>🛡️ <b>Sala Personalizada</b>: lute contra a sombra de um amigo pelo nome. Não vale estrela.</p>
  <p>👥 <b>Formação</b>: escolha o seu TIME DE 3. Quando um cai, entra o próximo (quem ganhou continua com a vida que sobrou). Para vencer, derrote os 3 da sombra.</p><p>💪 A sombra luta com TODOS os bônus do dono (título, anéis, equipamentos, nível, passivas) e a máquina no nível máximo, com um pouco do estilo dele.</p>
  <p>📜 O dono da sombra vê no Histórico quem lutou contra ela.</p></div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
function pvRewards(){const o=pvG();rkModal(`<div class="twM pvRwM"><h3>🎁 RECOMPENSAS DO PVP</h3><p class="twH">Prêmio na primeira vez que chegar em cada rank (entra sozinho).</p><div class="pvRwL">${PVT.slice(1).map((T,i)=>{const t=i+1,ok=o.rw.includes(t);return `<div class="${ok?'ok':''}"><img src="${PVA.e[T[3]]}" alt=""><b style="color:${T[1]}">${T[0]}</b><span>+${rkFmtN(T[4])} 💎${T[5]?' · +'+T[5]+' 🎫':''}</span><em>${ok?'✔ PEGO':'🔒'}</em></div>`}).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
async function pvHist(){const o=pvG(),row=h=>`<div class="${h.w?'w':'l'}"><b>${h.w?'VITÓRIA':'DERROTA'}</b><span>${pvEsc(CH[h.my]?CH[h.my].name:'')} x sombra de <b>${pvEsc(h.n)}</b> (${pvEsc(CH[h.c]?CH[h.c].name:h.c)})${h.f?' · sala':''}</span><small>${new Date(h.d).toLocaleString('pt-BR').slice(0,17)}</small></div>`;
  const draw=D=>{if(RKV!=='pvp')return;rkModal(`<div class="twM pvHi"><h3>📜 HISTÓRICO</h3><h4>⚔️ SUAS LUTAS</h4><div class="pvHl">${o.h.length?o.h.map(row).join(''):'<p class="twH">Nenhuma luta ainda.</p>'}</div><h4>🛡️ QUEM ENFRENTOU A SUA SOMBRA</h4><div class="pvHl">${D==null?'<p class="twH">Carregando...</p>':D===0?'<p class="twH">'+rkNetMsg()+'</p>':D.length?D.map(e=>`<div class="${e.won?'l':'w'}"><b>${e.won?'PERDEU':'DEFENDEU'}</b><span><b>${pvEsc(e.nome)}</b> (${pvEsc(CH[e.ch]?CH[e.ch].name:e.ch)}) ${e.won?'venceu':'perdeu para'} a sua sombra</span><small>${new Date(e.ts).toLocaleString('pt-BR').slice(0,17)}</small></div>`).join(''):'<p class="twH">Ninguém enfrentou a sua sombra ainda.</p>'}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)};
  draw(null);const acc=pvAcc();if(!acc)return draw([]);try{draw(await pvQ('pvo',acc,15))}catch(e){draw(0)}}
async function pvLoadAll(force){if(!force&&PV.all&&Date.now()-PV.allT<60e3)return PV.all;const R=await pvQ('pvk',pvMon(),300,'pvs','DESCENDING'),M={};for(const e of R){if(!e.pva||M[e.pva]&&M[e.pva]._id>e._id)continue;let d={};try{d=JSON.parse(e.d)}catch(x){}M[e.pva]=Object.assign(e,{t:Math.min(PVDIV,d.t|0),dv:d.dv|0,st:d.st|0,ch:d.ch||e.ch,w:d.w|0,l:d.l|0})}
  PV.all=Object.values(M).sort((a,b)=>b.pvs-a.pvs);PV.allT=Date.now();return PV.all}
async function pvRanking(){const draw=L=>{if(RKV!=='pvp')return;const me=pvAcc();rkModal(`<div class="twM pvRk"><h3>🏆 RANKING PVP · TEMPORADA ${pvMon().slice(5,7)}/${pvMon().slice(1,5)}</h3><div class="pvRkL">${L==null?'<p class="twH">Carregando...</p>':L===0?'<p class="twH">'+rkNetMsg()+'</p>':L.length?L.map((e,i)=>{const T=PVT[Math.min(PVDIV,e.t|0)];return `<div class="${e.pva===me?'me':''}"><b class="ps">${i<3?['🥇','🥈','🥉'][i]:'#'+(i+1)}</b><img src="${PVA.e[T[3]]}" alt=""><span><b>${pvEsc(e.nome)}</b>${rgTit(e.tit,e.nome)}</span><em style="color:${T[1]}">${pvRkName(e.t|0,e.dv|0)}${e.t>=PVDIV?' · ⭐'+e.st:''}</em></div>`}).join(''):'<p class="twH">Ninguém no ranking ainda. Seja o primeiro!</p>'}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)};
  draw(null);try{draw((await pvLoadAll()).slice(0,50))}catch(e){draw(0)}}
/* v335: quem está em cada rank (toque no rank da direita; no título "Ranks" = todos, com a Madeira) */
async function pvTier(t){const me=pvAcc(),row=e=>{const T=PVT[e.t];return `<div class="${e.pva===me?'me':''}"><img class="pt" src="${pvPortrait(CH[e.ch]?e.ch:'goku')}" alt=""><span><b>${pvEsc(e.nome)}</b>${rgTit(e.tit,e.nome)}</span><em style="color:${T[1]}">${pvRkName(e.t,e.dv)} · ⭐${e.st}</em><small>${e.w}V ${e.l}D</small></div>`};
  const draw=L=>{if(RKV!=='pvp')return;const T=t==='all'?null:PVT[t];rkModal(`<div class="twM pvTi"><h3>${T?`<img src="${PVA.e[T[3]]}" alt=""> <span style="color:${T[1]}">${T[0]}</span>`:'🏅 TODOS OS RANKS'}</h3><p class="twH">Quem está jogando a Ranqueada PVP nesta temporada${T?' neste rank':''}.</p><div class="pvTl">${L==null?'<p class="twH">Carregando...</p>':L===0?'<p class="twH">'+rkNetMsg()+'</p>':!L.length?'<p class="twH">Ninguém neste rank ainda.</p>':t==='all'?PVT.map((T,i)=>({T,i,G:L.filter(e=>e.t===i)})).filter(x=>x.G.length).reverse().map(x=>`<h4 style="color:${x.T[1]}"><img src="${PVA.e[x.T[3]]}" alt=""> ${x.T[0]} · ${x.G.length}</h4>`+x.G.map(row).join('')).join(''):L.map(row).join('')}</div><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)};
  draw(null);try{const A=await pvLoadAll();draw(t==='all'?A:A.filter(e=>e.t===t))}catch(e){draw(0)}}
function pvCfgM(){if(!twIsAdm())return mn2Cfg();const on=PV.on!==false;rkModal(`<div class="twM sm"><h3>⚙️ PVP · ADM</h3><p class="twH">Agora o PVP está <b style="color:${on?'#7dff9a':'#ff6060'}">${on?'LIGADO':'DESLIGADO'}</b>. Desligado: ninguém busca partida nem envia sombra (não gasta servidor).</p><p class="twH" id="pvCe"></p><div class="row"><button class="btn main" id="pvCt">${on?'⛔ DESLIGAR PVP':'✅ LIGAR PVP'}</button><button class="btn" id="pvCo">⚙️ OPÇÕES</button><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('pvCo').onclick=()=>mn2Cfg();$('pvCt').onclick=async()=>{$('pvCt').disabled=true;$('pvCe').textContent='Salvando...';try{await pvCfgSet(!on);rkModal(null);pvRe();rkToast(on?'⛔ PVP DESLIGADO para todos':'✅ PVP LIGADO para todos',on?'#ff8080':'#7dff9a')}catch(e){$('pvCe').textContent=rkNetMsg();$('pvCt').disabled=false}}}
{const _a=rkAct;rkAct=function(a,b){
  if(a==='pvp'){rkSfx('whoosh');return pvOpen()}
  if(RKV==='pvp'){if(a==='back'){PV.opp=null;PV.srch=0;return rkView('menu')}
    const M={pvTier:()=>pvTier(b.dataset.t==='all'?'all':+b.dataset.t),pvGo:pvSearch,pvRoom:pvRoom,pvForm:pvForm,pvRules:pvRules,pvRw:pvRewards,pvHist:pvHist,pvRank:pvRanking,pvCfg:pvCfgM};if(M[a]){if(a!=='pvGo')rkSfx('whoosh');if(PV.on===false&&['pvGo','pvRoom'].includes(a)&&!twIsAdm())return rkToast('⛔ O PVP está desligado pelo ADM','#ff8080');return M[a]()}}
  return _a.apply(this,arguments)}}

/* v334: no PVP a regeneração das passivas vale para os dois lutadores (você e a sombra) */
{const _rt=psRegTick;psRegTick=function(){if(G.gmode!=='pvp'||!G.p)return _rt.apply(this,arguments);const P0=G.p[0];for(const f of G.p){G.p[0]=f;try{_rt.apply(this,arguments)}catch(e){}}G.p[0]=P0}}

/* ================= v337: EVENTO DE DESCULPAS (11/11/2026, 13:00 até 20:00 de Brasília): 3x XP, GEMAS, SORTE, DROP e 3x ANEL DA ALMA na Caça ================= */
RKEVX.push([Date.UTC(2026,10,11,16,0),Date.UTC(2026,10,11,23,0),3,'DESCULPAS · 3x XP · 3x GEMAS · 3x SORTE · 3x DROP · 3x ANEL NA CAÇA',{gem:3,luck:3,drop:3,anel:3}]);
const rkEvA=()=>{const e=rkEvX();return ((e&&e[4]&&e[4].anel)||1)*rkAdm2()};
{const _dl=anDropLobo;anDropLobo=function(L){const m=rkEvA();if(m<=1)return _dl.apply(this,arguments);for(let i=0;i<m;i++){const r=_dl.apply(this,arguments);if(r)return r}return null}}
/* código com vários prêmios: jn pelo código normal + pk:{gem,tic} entregue depois que o servidor aceitou */
{const _cp7=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];const r=await _cp7.apply(this,arguments);
  if(C&&C.pk&&r&&E&&/ok/.test(E.className||'')){if(C.pk.gem)rkAdd('gem',C.pk.gem);if(C.pk.tic)rkAdd('tic',C.pk.tic);try{acSave(1)}catch(e){}E.textContent='🎁 '+C.nm+'! +'+rkFmtN(C.pk.gem||0)+' 💎 · +'+(C.jn||0)+' 💠 giros de passiva · +'+(C.pk.tic||0)+' 🎫 tickets'}return r}}
TWCUP['973bb8']={nm:'PEDIDO DE DESCULPAS',acc:1,jn:40,pk:{gem:5000,tic:20}};

/* v341: o 2x do ADM é do TÍTULO (não é evento e não aparece em lugar nenhum): rkAdm2() multiplica gemas, sorte, drop, anel e XP de rank */
/* v340: FAIXA DE EVENTO ATIVO em todas as telas de modo (menu, Boss, Torre, Caça, Gacha, PVP, Loja...) com o tempo que falta */
function evBarTick(){let B=document.getElementById('evBar');const t=Date.now();let e=null;e=rkEvX();
  let cur='';try{cur=showScreen.cur}catch(x){}const show=!!e&&cur==='ranked'&&RKV==='menu'&&!(typeof PV!=='undefined'&&PV.fight)&&![...document.querySelectorAll('#rkModal,#twModal,#acM')].some(m=>!m.hidden&&m.innerHTML.trim()&&m.offsetParent!==null);
  if(!show){if(B)B.hidden=true;return}
  if(!B){B=document.createElement('div');B.id='evBar';B.innerHTML='<i class="f">🔥</i><div><b></b><u></u><span><em></em></span></div><i class="f">🔥</i>';document.body.appendChild(B)}
  const ms=e[1]-t,h=Math.floor(ms/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3),tm=(h?h+'h ':'')+String(m).padStart(2,'0')+'min '+String(s).padStart(2,'0')+'s';
  const adm='';
  const nm=String(e[3]).split('·').map(x=>x.trim()),ttl=nm[0],rest=nm.slice(1).join(' · ');
  B.querySelector('b').textContent='🎉 EVENTO ATIVO: '+ttl+adm;B.querySelector('u').textContent='⏳ TERMINA EM '+tm;const em=B.querySelector('em'),rt=rest||'APROVEITE!';if(em.textContent!==rt)em.textContent=rt;B.hidden=false}
setInterval(evBarTick,1000);setTimeout(evBarTick,500);

/* v342: GIRAR ATÉ 5 PASSIVAS DE UMA VEZ — gasta até 5 joias, mostra todas e você escolhe qual aplicar (ou mantém a antiga) */
function psPick(){const o=psG(),L=o.pendL||[];if(!o.pend||L.length<2)return;const best=L.reduce((m,x,i)=>psRI(x.r)>psRI(L[m].r)?i:m,0);
  rkModal(`<div class="twM psPk"><h3>💠 ESCOLHA A PASSIVA (${L.length} GIROS)</h3><div class="psPkL">${L.map((x,i)=>`<button class="psPkI${i===best?' best':''}" data-i="${i}" style="--rc:${PSRC[x.r]}">${psGemH(x)}<span>${psTxtH(x)}</span><em>ESCOLHER</em></button>`).join('')}</div><div class="row"><button class="btn" id="psPkK">✖ MANTER ANTIGA</button><button class="btn" id="rkMX">DEPOIS</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('psPkK').onclick=()=>{rkModal(null);psAct('keep')};
  document.querySelectorAll('#rkModal .psPkI').forEach(b=>b.onclick=()=>{const o2=psG(),x=(o2.pendL||[])[+b.dataset.i];if(!x||!o2.pend)return rkModal(null);o2.pend={tg:o2.pend.tg,r:x.r,i:x.i};psS(o2);rkModal(null);psAct('apply')})}
{const _pa=psAct;psAct=function(a,b){
  if(a==='pick'){if(PS.anim||PS.busy)return;return psPick()}
  if(a==='spin5'){if(PS.anim||PS.busy)return;const o=psG(),t=psTarget();if(!t||o.pend)return;const n=Math.min(5,o.jn|0);if(n<2){rkSfx('clang');return rkToast('Precisa de pelo menos 2 Joias Negras','#ff8080')}PS.busy=1;
    const L=[];for(let k=0;k<n;k++)L.push(psRoll(o));const best=L.reduce((m,x)=>psRI(x.r)>psRI(m.r)?x:m,L[0]);o.jn=(o.jn|0)-n;o.pend={tg:{k:t.k,id:t.id},r:best.r,i:best.i};o.pendL=L.map(x=>({r:x.r,i:x.i}));psS(o);
    PS.anim=1;rkView('ps');psAnim(best.r,()=>{PS.anim=0;PS.busy=0;rkView('ps');rkSfx(psRI(best.r)>=3?'boom':'powerUp');psPick()});return}
  return _pa.apply(this,arguments)}}
{const _po=psOpen;psOpen=function(){const r=_po.apply(this,arguments);try{const o=psG();if(o.pend&&o.pendL&&o.pendL.length>1)setTimeout(psPick,400)}catch(e){}return r}}
/* v342: código só para o ADM (campo adm:1) */
{const _cp8=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];if(C&&C.adm&&!twIsAdm()){E.className='twH err';E.textContent='❌ Esse código é só para quem tem o título de ADMINISTRADOR.';try{twSfx('clang')}catch(e){}return true}return _cp8.apply(this,arguments)}}
TWCUP['115nx35']={nm:'700 GIROS DE PASSIVA',jn:700,uni:1,adm:1};

/* v343: SORTE e DROP também melhoram a RARIDADE (antes só aumentavam quantidade/chance, que já ficava em 100%).
   lkK = giros extras "pega o melhor": sorte x2 = +1, x4 = +2, x8 = +3 ... (máx. +5). Vale para equipamento, poção, cristal e Anel da Alma. */
const lkK=()=>{let L=1;try{L=lvLuck()}catch(e){}return Math.max(0,Math.min(5,Math.floor(Math.log2(Math.max(1,L)))))};
{const _er=twEqRoll;twEqRoll=function(){let R=_er.apply(this,arguments);const k=lkK();for(let i=0;i<k;i++){const B=twEqRoll0();if(TWEQR.indexOf(B)>TWEQR.indexOf(R))R=B}return R}}
{const _cr=lvCrRoll;lvCrRoll=function(){let r=_cr.apply(this,arguments);const k=lkK();for(let i=0;i<k;i++)r=Math.max(r,_cr.apply(this,arguments));return r}}
{const _pr=twPoRoll;twPoRoll=function(){let R=_pr.apply(this,arguments);const k=lkK(),ix=x=>TWPOR.indexOf(x);for(let i=0;i<k;i++){const B=_pr.apply(this,arguments);if(ix(B)>ix(R))R=B}return R}}

/* ================= v346: SISTEMA RPG — atributos em PONTOS (ataque, defesa, velocidade) + CONSTELAÇÃO =================
   Cada personagem tem ATK/DEF/VEL base (épico fraco … Shaka o mais forte). Nível: +3% do base por nível (vel +2%).
   Equipamento agora dá PONTOS (valor do item x raridade: comum 10, rara 15, épica 20, lendária 40, mítica 100 por ponto).
   Porcentagens (anéis, passivas, título, ADM, poções, evento, constelação %) continuam somadas por cima.
   Na luta: dano = (ATK/150)^0,55 x (1 + %); defesa: 1/tdf = 1 + DEF/900 + %; velocidade = (VEL/80)^0,2 + % (máx. 2,2).
   Inimigos de Boss/Torre/Caça: +30% de vida efetiva e +15% de dano para equilibrar. */
const CST={aylla:[55,15,70],zedry:[50,10,55],zaykon:[60,12,50],qingqing:[45,10,90],
  goku:[150,50,80],vegeta:[155,55,75],gogeta:[175,60,80],broly:[185,70,55],zoro:[165,50,70],luffy:[150,55,80],gojo:[180,60,85],rengoku:[160,55,75],aokiji:[170,65,60],
  naruto:[270,90,95],madara:[290,100,80],garou:[360,120,90],yuta:[300,100,100],shaka:[470,150,110]};
const cstBase=id=>{const b=CST[id];if(b)return {atk:b[0],def:b[1],spd:b[2]};const r=rkRar(id);return r==='mit'?{atk:280,def:95,spd:90}:r==='lend'?{atk:150,def:50,spd:75}:{atk:100,def:30,spd:70}};
const EQRF={comum:10,rara:15,epica:20,lend:40,mit:100,sec:120,obs:150};
function eqFlat(){const o=twEqOn(),R={atk:0,def:0,spd:0};for(const k in o){const it=o[k],n=eqNf(it),f=EQRF[it.r]||10,m=EQMAIN[k];
  if(m==='dano')R.atk+=(it.v||0)*n*f;if(m==='vida')R.def+=(it.v||0)*n*f;if(m==='vel')R.spd+=(it.v||0)*n*f;R.atk+=(it.dmg||0)*n*f;R.def+=(it.def||0)*n*f;R.spd+=(it.vel||0)*n*f}
  for(const k in R)R[k]=Math.round(R[k]);return R}
/* ---------- CONSTELAÇÃO: 5 ramos x 12 estrelas (tronco de 6 + 2 caminhos de 3 com estrela-mestra no fim) ---------- */
const CNB=[{k:'atk',n:'ATAQUE',i:'⚔️',c:'#ff4a5a',s:{atk:20},m:{atk:45},A:['DESTRUIÇÃO',{atk:20},{atk:45},{dano:20}],B:['LÂMINA SANGRENTA',{cd:6},{cd:12},{cd:30,ls:2}]},
  {k:'def',n:'DEFESA',i:'🛡️',c:'#4aa8ff',s:{def:15},m:{def:35},A:['MURALHA',{def:15},{def:35},{defp:20}],B:['SANGUE ETERNO',{ls:1},{ls:2},{ls:4,defp:5}]},
  {k:'spd',n:'VELOCIDADE',i:'💨',c:'#4aff9a',s:{spd:10},m:{spd:25},A:['RELÂMPAGO',{spd:10},{spd:25},{vel:15}],B:['DESPERTAR',{uv:5},{uv:10},{uv:25}]},
  {k:'crit',n:'CRÍTICO',i:'🎯',c:'#ffd84a',s:{crit:1.5},m:{crit:3},A:['OLHO DE ÁGUIA',{crit:1.5},{crit:3},{crit:8}],B:['EXECUÇÃO',{cd:6},{cd:12},{cd:35}]},
  {k:'esp',n:'ESPÍRITO',i:'✨',c:'#c77dff',s:{st:4},m:{st:8},A:['FORTUNA',{st:4},{st:8},{st:25}],B:['ALMA DE FOGO',{uv:4},{uv:8},{uv:20,dano:5}]}];
const CNF={atk:['ATAQUE',''],def:['DEFESA',''],spd:['VELOCIDADE',''],dano:['DANO','%'],defp:['DEFESA','%'],vel:['VELOCIDADE','%'],crit:['CRÍTICO','%'],cd:['DANO CRÍTICO','%'],ls:['ROUBO DE VIDA','%'],uv:['VEL. ULTIMATE','%'],st:['SORTE','']};
const CNC={x:620,y:452};
const CNN=(()=>{const N={};CNB.forEach((B,b)=>{const ang=(-90+b*72)*Math.PI/180,pos=(r,da)=>({x:CNC.x+Math.cos(ang+da)*r,y:CNC.y+Math.sin(ang+da)*r});
  for(let i=0;i<6;i++){const m=i===2||i===5;N[b+'-'+i]={b,i,p:i?b+'-'+(i-1):null,cost:m?2:1,t:m?'m':'s',e:m?B.m:B.s,...pos(64+i*38,0)}}
  [['A',6,-.23],['B',9,.23]].forEach(([f,o,da])=>{const F=B[f];for(let j=0;j<3;j++){const id=b+'-'+(o+j),K=j===2;N[id]={b,i:o+j,p:j?b+'-'+(o+j-1):b+'-5',cost:K?4:j===1?2:1,t:K?'k':j===1?'m':'s',e:F[j+1],f:F[0],...pos(64+(6+j)*38,da*(1+j*.15))}}});});return N})();
const cnsEff=e=>Object.entries(e).map(([k,v])=>'+'+String(v).replace('.',',')+(CNF[k][1]?CNF[k][1]+' ':' ')+CNF[k][0]).join(' · ');
const cnsUsed=id=>lvOf(id).c.reduce((a,n)=>a+((CNN[n]||{}).cost||0),0),cnsPts=id=>lvOf(id).lv,cnsFree=id=>cnsPts(id)-cnsUsed(id);
function cnsSum(id){const T={atk:0,def:0,spd:0,dano:0,defp:0,vel:0,crit:0,cd:0,ls:0,uv:0,st:0};for(const n of lvOf(id).c){const N=CNN[n];if(N)for(const k in N.e)T[k]+=N.e[k]}return T}
/* bônus de nível agora = constelação (% e pontos) + crítico do nível */
lvBonus=function(id){const L=lvOf(id),C=cnsSum(id);return {dano:C.dano,crit:(L.lv-1)*.1+C.crit,vel:C.vel,st:C.st,cd:C.cd,ls:C.ls,uv:C.uv,def:C.defp}};
function cstStats(id){const B=cstBase(id),L=lvOf(id),C=cnsSum(id),E=eqFlat(),lv=L.lv-1;return {atk:Math.round(B.atk*(1+.03*lv)+C.atk+E.atk),def:Math.round(B.def*(1+.03*lv)+C.def+E.def),spd:Math.round(B.spd*(1+.02*lv)+C.spd+E.spd),base:B,eq:E,cn:C}}
/* ---------- conversão final na luta (por último na cadeia do rkApply) ---------- */
{const _ra=rkApply;rkApply=function(){const r=_ra.apply(this,arguments);try{
  const tw=typeof TW!=='undefined'&&TW.on&&G.gmode==='torre',ok=G.p&&(tw||G.gmode==='boss'||G.gmode==='caca');if(!ok)return r;const [p,o]=G.p;
  if(p&&!p.cpu&&!p._cst){p._cst=1;const id=p.def.id,S=cstStats(id),E={d:twEqB('dano'),v:twEqB('vida'),s:twEqB('vel')};
    let pd=(p.tdm||1)*100-100-E.d,pf=(1/(p.tdf||1)-1)*100-E.v,pv=(p.tsp||1)*100-100-E.s;
    if(G.gmode==='caca'){const B=lvBonus(id);pd+=B.dano;pv+=B.vel;p.tcr=(p.tcr||0)+B.crit;p.tcd=(p.tcd||0)+B.cd;p.tls=(p.tls||0)+B.ls;p.tki=(p.tki||1)+B.uv/100}
    pf+=lvBonus(id).def||0;pd=Math.max(-50,pd);pf=Math.max(-50,pf);pv=Math.max(-50,pv);
    p.tdm=Math.pow(Math.max(10,S.atk)/150,.55)*(1+pd/100);p.tdf=1/Math.max(.3,1+S.def/900+pf/100);p.tsp=Math.min(2.2,Math.max(.6,Math.pow(Math.max(20,S.spd)/80,.2)+pv/100));p.cst=S}
  if(o&&o.cpu&&!o._cst&&tw){o._cst=1;const fl=(TW.fl|0);o.tdf=(o.tdf||1)/(1.3*(1+fl*.25));o.tdm=(o.tdm||1)*1.15*(1+fl*.15)}
  if(o&&o.cpu&&!o._cst&&G.gmode==='boss'){o._cst=1;bsStApply(o,1)}if(p&&!p.cpu&&G.gmode==='boss')bsAntiItens(p,G.p[1])}catch(e){}return r}}
/* ---------- RESET de todo mundo (1 vez): volta ao nível 1 e devolve moedas, pó, itens de elevação e cristais ---------- */
const LVRZ=1;
function lvResetAll(){if((rkG('lvrz',0)|0)>=LVRZ)return;const A=lvAll();let coins=0,po=0;const el=[0,0,0,0,0],cr=[0,0,0,0,0];let n=0;
  for(const id in A){const L=A[id]||{},lv=Math.max(1,L.lv|0);if(lv>1)n++;for(let l=1;l<lv;l++){const [c,pp]=LVCOST(l);coins+=c;po+=pp}[10,20,30,40,50].forEach((t,i)=>{if(lv>=t)el[i]++});
    (Array.isArray(L.t)?L.t:[]).forEach((c,r)=>{if(c!=null&&c>=0&&LVCRN[r]){cr[LVCRN[r][0]]+=LVCRN[r][1]}});A[id]={lv:1,t:[],c:[]}}
  rkS('lv',A);if(coins)twLS.s('tw_moedas',(twLS.g('tw_moedas',0)|0)+coins);if(po)rkS('po',lvPo()+po);{const a=lvArr('el');el.forEach((v,i)=>a[i]+=v);rkS('el',a)}{const a=lvArr('cr');cr.forEach((v,i)=>a[i]+=v);rkS('cr',a)}
  rkS('lvrz',LVRZ);try{acSave(1)}catch(e){}
  if(n)setTimeout(()=>{try{const M=document.createElement('div');M.id='lvrzM';M.innerHTML=(`<div class="twM"><h3>✦ NOVO SISTEMA RPG!</h3><p class="twH">Os personagens agora têm <b>ATAQUE, DEFESA e VELOCIDADE</b> em pontos e uma <b>CONSTELAÇÃO</b> nova. Todos voltaram ao nível 1 e você recebeu de volta tudo o que gastou:</p><p class="twH" style="font-size:1.1em">🪙 ${rkFmtN(coins)} moedas · 🟣 ${rkFmtN(po)} ${LVPON}${el.some(x=>x)?' · ✦ '+el.map((v,i)=>v?v+'x '+LVELN[i]:'').filter(Boolean).join(', '):''}${cr.some(x=>x)?' · 💎 '+cr.map((v,i)=>v?v+' '+RKRNM[i]:'').filter(Boolean).join(', ')+' (cristais)':''}</p><div class="row"><button class="btn main" id="rkMX">VAMOS LÁ!</button></div></div>`).replace('id="rkMX"','id="lvrzOk"');document.body.appendChild(M);$('lvrzOk').onclick=()=>M.remove()}catch(e){}},2500)}
{const _o=rkOpen;rkOpen=function(){const r=_o.apply(this,arguments);try{lvResetAll()}catch(e){}return r}}
/* ---------- telas ---------- */
Object.assign(LVSTAT,{atk:{n:'ATAQUE',i:'⚔️'},def:{n:'DEFESA',i:'🛡️'},spd:{n:'VELOCIDADE',i:'💨'},pts:{n:'PONTOS',i:'✦'}});
lvStatRows=function(id){const S=cstStats(id),B=lvBonus(id);return [['atk',rkFmtN(S.atk)+(B.dano?' +'+B.dano+'%':'')],['def',rkFmtN(S.def)+(B.def?' +'+B.def+'%':'')],['spd',rkFmtN(S.spd)+(B.vel?' +'+B.vel+'%':'')],['crit',(5+B.crit).toFixed(1)+'%'+(B.cd?' 💥+'+B.cd+'%':'')],['pts',cnsFree(id)+' livres / '+cnsPts(id)]]};
{const _lh=lvH;lvH=function(){let h=_lh.apply(this,arguments);const id=LVC.id,i=h.indexOf('<div class="lvRl'),j=h.indexOf('<div class="lvCr"');if(i>0&&j>i){const T=cnsSum(id),fr=cnsFree(id);
    h=h.slice(0,i)+`<div class="cnsPv" style="${rkB(1030,118,1790,712)}"><b>✦ CONSTELAÇÃO</b><span>${fr>0?`<i class="nw">${fr} ponto${fr>1?'s':''} livre${fr>1?'s':''}!</i>`:'Cada nível = 1 ponto'}</span>
      <div class="cnsBr">${CNB.map((B,b)=>{const n=lvOf(id).c.filter(x=>x.startsWith(b+'-')).length;return `<div style="--c:${B.c}"><em>${B.i} ${B.n}</em><s><u style="width:${n/12*100}%"></u></s><small>${n}/12</small></div>`}).join('')}</div>
      <small class="cnsTt">${['atk','def','spd'].filter(k=>T[k]).map(k=>'+'+T[k]+' '+CNF[k][0]).join(' · ')||'Nenhuma estrela ainda'}</small><button class="cnsGo" data-a="cnsOpen">✦ ABRIR CONSTELAÇÃO</button></div>`+h.slice(j)}
  return h.replace(/<button class="lvX"[^>]*>[^<]*<\/button>/,'')}}
lvInfo=function(){rkModal(`<div class="twM"><h3>⬆ PERSONAGEM (SISTEMA RPG)</h3><p class="twH">Cada personagem tem <b>ATAQUE, DEFESA e VELOCIDADE</b> próprios (épico mais fraco, Shaka o mais forte). Cada nível aumenta 3% do ataque e da defesa base (velocidade 2%), dá +0,1% de crítico e <b>1 ponto de CONSTELAÇÃO</b>.</p>
  <p class="twH">Equipamento agora dá PONTOS: espada = ataque, armadura = defesa, botas = velocidade (comum ~10, rara ~60, épica ~100, lendária ~280, mítica ~1000). Anéis, passivas, título e evento dão % por cima (somados: +100% = dobra).</p>
  <table class="rkTx"><tr><th>Níveis</th><th>Custo por nível</th></tr><tr><td>1 → 10</td><td>🪙 150 · 🟣 10</td></tr><tr><td>10 → 20</td><td>🪙 300 · 🟣 20</td></tr><tr><td>20 → 30</td><td>🪙 500 · 🟣 35</td></tr><tr><td>30 → 40</td><td>🪙 900 · 🟣 60</td></tr><tr><td>40 → 50</td><td>🪙 1.800 · 🟣 120</td></tr><tr><td>50 → 70 (Shaka)</td><td>🪙 3.000 · 🟣 200</td></tr></table>
  <p class="twH">✦ ELEVAÇÃO nos níveis 10, 20, 30, 40 e 50 (Pergaminho, Cubo, Máscara, Chama, Orbe). Estrela-mestra da constelação: 1 cristal ÉPICO.</p><div class="row"><button class="btn" id="rkMX">OK</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)};
cbRows=function(id){const T=cbAll(id).T,S=cstStats(id);return ['⚔️ '+rkFmtN(S.atk)+' · 🛡️ '+rkFmtN(S.def)+(T.dano?' · +'+cbN(T.dano)+'%':''),cbN(5+T.crit)+'%'+(T.cd?' 💥+'+cbN(T.cd)+'%':''),'💨 '+rkFmtN(S.spd)+(T.vel?' · +'+cbN(T.vel)+'%':''),'+'+cbN(T.st)+(T.drop?' 🎁+'+cbN(T.drop)+'%':''),'+'+cbN(T.uv)+'%'+(T.ls?' ❤️'+cbN(T.ls)+'%':'')]};
/* tela da CONSTELAÇÃO */
const CNV={sel:null};
function cnsState(id,n){const L=lvOf(id),N=CNN[n];if(L.c.includes(n))return 'on';if(!N.p||L.c.includes(N.p))return 'av';return 'lk'}
function cnsH(){const id=LVC.id,L=lvOf(id),fr=cnsFree(id),S=cstStats(id),sel=CNV.sel&&CNN[CNV.sel]?CNV.sel:null,B=(x0,y0,x1,y1)=>`left:${x0/1846*100}%;top:${y0/852*100}%;width:${(x1-x0)/1846*100}%;height:${(y1-y0)/852*100}%`;
  const lines=Object.entries(CNN).map(([n,N])=>{const P=N.p?CNN[N.p]:CNC,on=L.c.includes(n);return `<line x1="${P.x}" y1="${P.y}" x2="${N.x}" y2="${N.y}" class="${on?'on':cnsState(id,n)==='av'?'av':''}" style="--c:${CNB[N.b].c}"/>`}).join('');
  const nodes=Object.entries(CNN).map(([n,N])=>{const st=cnsState(id,n),sz=N.t==='k'?54:N.t==='m'?40:30;return `<button class="cnsN ${N.t} ${st}${sel===n?' sel':''}" data-a="cnsSel" data-n="${n}" style="left:${(N.x-sz/2)/1846*100}%;top:${(N.y-sz/2)/852*100}%;width:${sz/1846*100}%;height:${sz/852*100}%;--c:${CNB[N.b].c}">${N.t==='k'?'★':N.t==='m'?CNB[N.b].i:''}</button>`}).join('');
  const lbl=CNB.map((Bb,b)=>{const P=CNN[b+'-5'],a=(-90+b*72)*Math.PI/180,x=CNC.x+Math.cos(a)*120,y=CNC.y+Math.sin(a)*120;return `<div class="cnsBl" style="left:${(x+Math.cos(a+Math.PI/2)*60-70)/1846*100}%;top:${(y+Math.sin(a+Math.PI/2)*60-14)/852*100}%;--c:${Bb.c}">${Bb.i} ${Bb.n}</div>`}).join('');
  let info='<p class="cnsHelp">Toque numa estrela para ver o bônus.<br>Cada nível do personagem = 1 ponto. A estrela ligada ao centro (ou a uma estrela acesa) pode ser ativada.</p>';
  if(sel){const N=CNN[sel],st=cnsState(id,sel),Bb=CNB[N.b],crok=N.t!=='k'||lvArr('cr')[2]>=1;info=`<div class="cnsIf" style="--c:${Bb.c}"><small>${Bb.i} ${Bb.n}${N.f?' · '+N.f:''}</small><b>${N.t==='k'?'★ ESTRELA-MESTRA':N.t==='m'?'ESTRELA MAIOR':'ESTRELA'}</b><p>${cnsEff(N.e)}</p><em>Custo: ${N.cost} ponto${N.cost>1?'s':''}${N.t==='k'?' + 1 cristal ÉPICO ('+lvArr('cr')[2]+')':''}</em>
    ${st==='on'?'<i class="ok">✔ ATIVADA</i>':st==='lk'?'<i>🔒 Ative a estrela anterior primeiro</i>':`<button data-a="cnsAct" ${fr<N.cost||!crok?'disabled':''}>${fr<N.cost?'FALTAM PONTOS':!crok?'FALTA CRISTAL':'✦ ATIVAR'}</button>`}</div>`}
  return `<button class="hs" data-a="cnsBack" style="${B(16,14,150,86)}">⬅</button>
  <svg class="cnsSv" viewBox="0 0 1846 852" preserveAspectRatio="none">${lines}</svg>
  <div class="cnsCt" style="${B(CNC.x-52,CNC.y-52,CNC.x+52,CNC.y+52)}"><img src="${(IMG[id]&&IMG[id].src)||fullSrc(id)}" alt=""></div>${lbl}${nodes}
  <div class="cnsPn" style="${B(1180,24,1816,830)}"><div class="cnsTit">✦ CONSTELAÇÃO · ${twEsc(CH[id].name)}</div><div class="cnsPt"><b>${fr}</b><span>PONTOS LIVRES<br><small>${cnsUsed(id)} usados de ${cnsPts(id)} · nível ${L.lv}</small></span></div>
    <div class="cnsSt"><span>⚔️ <b>${rkFmtN(S.atk)}</b></span><span>🛡️ <b>${rkFmtN(S.def)}</b></span><span>💨 <b>${rkFmtN(S.spd)}</b></span></div>${info}
    <button class="cnsRs" data-a="cnsReset" ${L.c.length?'':'disabled'}>↺ RESETAR ESTRELAS · 200 💎</button></div>`}
{const _v=rkView;rkView=function(v){if(v!=='cns')return _v.apply(this,arguments);RKV='cns';const W=$('rkWrap');if(!W)return;clearInterval(rkView.iv);rkModal(null);
  W.innerHTML=`<div class="rkA rk_cns" data-w="1846" data-h="852">${cnsH()}<div id="rkToast"></div></div>`;rkFit();W.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)})}}
{const _a=rkAct;rkAct=function(a,b){
  if(a==='cnsOpen'){rkSfx('whoosh');CNV.sel=null;return rkView('cns')}
  if(RKV==='cns'){const id=LVC.id;
    if(a==='cnsBack'||a==='back'){rkSfx('whoosh');return rkView('lvl')}
    if(a==='cnsSel'){CNV.sel=b.dataset.n;rkSfx('whoosh');return rkView('cns')}
    if(a==='cnsAct'){const n=CNV.sel,N=CNN[n];if(!N||cnsState(id,n)!=='av'||cnsFree(id)<N.cost)return;if(N.t==='k'){const c=lvArr('cr');if(c[2]<1)return;c[2]--;rkS('cr',c)}
      const L=lvOf(id);L.c.push(n);lvSave(id,L);try{acSave()}catch(e){}rkSfx(N.t==='k'?'boom':'powerUp');rkView('cns');rkToast('✦ '+cnsEff(N.e),CNB[N.b].c);return}
    if(a==='cnsReset'){rkModal(`<div class="twM sm"><h3>↺ RESETAR ESTRELAS</h3><p class="twH">Apaga todas as estrelas de <b>${twEsc(CH[id].name)}</b> e devolve os pontos (os cristais das estrelas-mestras voltam). Custa 200 💎.</p><div class="row"><button class="btn main" id="cnR" ${rkG('gem',0)<200?'disabled':''}>${rkG('gem',0)<200?'FALTA 💎':'RESETAR'}</button><button class="btn" id="rkMX">CANCELAR</button></div></div>`);
      $('rkMX').onclick=()=>rkModal(null);$('cnR').onclick=()=>{if(rkG('gem',0)<200)return;rkAdd('gem',-200);const L=lvOf(id),k=L.c.filter(n=>CNN[n]&&CNN[n].t==='k').length;if(k){const c=lvArr('cr');c[2]+=k;rkS('cr',c)}L.c=[];lvSave(id,L);try{acSave(1)}catch(e){}rkModal(null);CNV.sel=null;rkSfx('whoosh');rkView('cns')};return}}
  return _a.apply(this,arguments)}}

/* ================= v347: BOSSES COM ATRIBUTOS (mesmo sistema do jogador) + passivas contra itens + Caça mais forte + recompensa diária ================= */
/* Broly por nível do Boss: começa fraco (igual épico) e termina com 38.000 de ataque. Yuta = +20% de ataque. */
const BSST=[[50,0,60],[70,0,70],[100,0,80],[150,0,95],[390,0,110],[1190,160,130],[3150,620,155],[10600,1250,185],[17700,3000,220],[29000,4500,265],[46000,6300,320]]; /* v351/v352: pelo TEMPO de luta (51 de vida/s com dano x1). Nível 11: Vini (dano x22, crít. 100%) ~3 min, ADM ~2 min, ZEUS ~7 min */
const bsSt=lv=>{const r=BSST[Math.max(0,Math.min(BSST.length-1,lv|0))],y=RKBID==='yuta',z=RKBID==='shaka';return {atk:Math.round(r[0]*(z?3.6:y?1.2:1)),def:Math.round(r[1]*(z?4.05:y?1.35:1)),spd:r[2]}};
function bsStApply(o,ph){const S=bsSt(o.rkL||0),B=rkBoss(),f=ph===2?B.b2:B.b1,b1=B.b1;o.bst=S;
  o.rkB={dm:Math.pow(S.atk/150,.3)*(f.dm/b1.dm)*(o.ysK||1),df:1/(1+S.def/900)*(f.df/b1.df),sp:Math.pow(S.spd/80,.2)*(f.sp/b1.sp)};o.tdm=o.rkB.dm;o.tdf=o.rkB.df;o.tsp=o.rkB.sp}
/* passivas do Boss contra os itens do jogador (por nível) */
const BSANTI=[null,null,null,null,{cr:5},{cr:8},{cr:10,ls:.5},{cr:12,ls:.5},{cr:15,ls:.5,pd:.2},{cr:20,ls:.4,pd:.3},{cr:25,ls:.25,pd:.4}];
function bsAntiItens(p,o){if(!o||p._bsa)return;p._bsa=1;const A=BSANTI[o.rkL||0];if(!A)return;if(A.cr)p.tcr=Math.max(-5,(p.tcr||0)-A.cr);if(A.ls)p.tls=(p.tls||0)*A.ls;if(A.pd){const d=1/(p.tdf||1)-1;p.tdf=1/(1+d*(1-A.pd))}}
function bsAntiTx(lv){const A=BSANTI[lv],t=[];if(A){if(A.cr)t.push('-'+A.cr+'% do seu crítico');if(A.ls)t.push('seu roubo de vida x'+String(A.ls).replace('.',','));if(A.pd)t.push('ignora '+Math.round(A.pd*100)+'% da sua defesa')}return t.join(' · ')}
/* CAÇA: lobo nível 1-4 normal (+15% dano, +30% vida efetiva), 5-8 dobro de ataque e defesa, 9-10 triplo de ataque, defesa e crítico, velocidade x1,5 */
{const _cl=caLvApply;caLvApply=function(f){_cl.apply(this,arguments);const L=f.bLv||1,k=L>=9?3:L>=5?2:1;
  f.tdm=(f.tdm||1)*(k===1?1.15:k);f.bDf=(f.bDf||1)/(k===1?1.3:k);f.tdf=f.bDf;if(k===3){f.tcr=((f.tcr||0)+5)*3-5;f.bsp=(f.bsp||1)*1.5}}}
/* ---------- RECOMPENSA DIÁRIA (7 dias seguidos; se pular um dia, volta ao dia 1) + 1ª VITÓRIA DO DIA em dobro ---------- */
const DLR=[[{g:300}],[{t:2}],[{j:3}],[{g:500},{r:50}],[{t:3}],[{j:5},{c:2}],[{g:1500},{t:5},{j:5}]];
const dlDay=(o)=>{const d=new Date(Date.now()-3*3600e3+(o||0)*864e5);return d.toISOString().slice(0,10)};
const dlTx=x=>x.g?'💎 '+rkFmtN(x.g):x.t?'🎫 '+x.t:x.j?'💠 '+x.j:x.r?'🔴 '+x.r:x.c!=null?'💎 cristal ÉPICO':'';
function dlCheck(force){const o=rkG('dl',{d:'',s:-1});const today=dlDay();if(o.d===today&&!force)return;const nx=o.d===dlDay(-1)?(o.s+1)%7:0,got=o.d===today;
  rkModal(`<div class="twM dlM"><h3>🎁 RECOMPENSA DIÁRIA</h3><p class="twH">Entre todo dia para ganhar mais! ${o.d===dlDay(-1)?'🔥 Sequência de '+(nx+1)+' dia'+(nx?'s':''):nx===0&&o.d?'Você perdeu a sequência, começou do dia 1.':''}</p>
    <div class="dlG">${DLR.map((R,i)=>`<div class="dlC ${i<nx||got&&i<=o.s?'ok':''} ${i===nx&&!got?'hoje':''} ${i===6?'big':''}"><small>DIA ${i+1}</small>${R.map(x=>`<b>${dlTx(x)}</b>`).join('')}${i<nx||got&&i<=o.s?'<i>✔</i>':''}</div>`).join('')}</div>
    <div class="row">${got?'<button class="btn" id="rkMX">FECHAR</button>':'<button class="btn main" id="dlOk">PEGAR DIA '+(nx+1)+'</button>'}</div></div>`);
  if(got){$('rkMX').onclick=()=>rkModal(null);return}
  $('dlOk').onclick=()=>{const o2=rkG('dl',{d:'',s:-1});if(o2.d===dlDay())return rkModal(null);for(const x of DLR[nx]){if(x.g)rkAdd('gem',x.g);if(x.t)rkAdd('tic',x.t);if(x.j)psAddJn(x.j);if(x.r)rkAdd('red',x.r);if(x.c!=null){const a=lvArr('cr');a[2]++;rkS('cr',a)}}
    rkS('dl',{d:dlDay(),s:nx});try{acSave(1)}catch(e){}rkSfx('powerUp');setTimeout(()=>rkSfx('boom'),250);rkModal(null);rkToast('🎁 DIA '+(nx+1)+': '+DLR[nx].map(dlTx).join(' · '),'#ffd84a');try{if(RKV==='menu')rkView('menu')}catch(e){}}}
{const _o=rkOpen;rkOpen=function(){const r=_o.apply(this,arguments);setTimeout(()=>{try{if(showScreen.cur==='ranked'&&!document.getElementById('lvrzM')&&(!$('rkModal')||!$('rkModal').innerHTML.trim()))dlCheck()}catch(e){}},3200);return r}}
/* 1ª vitória do dia no Boss: gemas e moedas vermelhas em dobro */
{const _rr=rkResult;rkResult=function(R){try{if(R&&R.won&&!R.farm&&R.yd==null&&rkG('fwd','')!==dlDay()){rkS('fwd',dlDay());const g=Math.min(R.gem||0,70),rd=R.red||0;if(g)rkAdd('gem',g);if(rd)rkAdd('red',rd);setTimeout(()=>rkToast('⭐ 1ª VITÓRIA DO DIA: +'+g+' 💎 +'+rd+' 🔴 em dobro!','#ffd84a'),1800)}}catch(e){}return _rr.apply(this,arguments)}}

/* ================= v349: DESAFIO DO DIA =================
   Todo dia (Brasília) um rival diferente com um MODIFICADOR do dia. O rival tem a SUA força (+10%), então quem decide é a habilidade (não é pay to win).
   3 tentativas por dia. Vitória: joias, pó, cristal, ticket e gemas; 7 dias seguidos vencendo = baú grande. IA combista no máximo. */
const DSFM=[{k:'furia',n:'🔥 FÚRIA',d:'Rival +40% de dano · você +20% de crítico',o:{dm:1.4},p:{cr:20}},{k:'tanque',n:'🛡️ TANQUE',d:'Rival com o dobro de defesa',o:{df:2}},
  {k:'veloz',n:'⚡ VELOCIDADE',d:'Os dois 40% mais rápidos',o:{sp:1.4},p:{sp:1.4}},{k:'vampiro',n:'🩸 VAMPIRO',d:'Rival rouba 15% do dano como vida',o:{ls:15}},
  {k:'vidro',n:'💎 CANHÃO DE VIDRO',d:'Os dois com +60% de dano e -30% de defesa',o:{dm:1.6,df:.7},p:{dm:1.6,df:.7}},{k:'mestre',n:'👑 MESTRE',d:'Rival +20% em tudo',o:{dm:1.2,df:1.2,sp:1.1}},
  {k:'critico',n:'🎯 CRÍTICO',d:'Os dois +30% de chance de crítico',o:{cr:30},p:{cr:30}}];
const DSFC=['shaka','yuta','garou','madara','naruto','gojo','gogeta','broly','vegeta','zoro','luffy','rengoku','aokiji','goku'];
const dsfSeed=()=>{const d=dlDay();let h=0;for(const c of d)h=(h*31+c.charCodeAt(0))>>>0;return h};
const dsfToday=()=>{const h=dsfSeed();return {d:dlDay(),ch:DSFC[h%DSFC.length],m:DSFM[(h>>>4)%DSFM.length]}};
const dsfG=()=>{const T=dsfToday(),o=Object.assign({d:'',left:3,won:0,str:0,last:''},rkG('dsf',{}));if(o.d!==T.d){o.d=T.d;o.left=3;o.won=0}return o};
let DSF=null;
function dsfOpen(){const T=dsfToday(),o=dsfG(),id=pvTeam()[0],S=cstStats(id);
  rkModal(`<div class="twM dsfM"><h3>⚔️ DESAFIO DO DIA</h3><div class="dsfV"><div><img src="${pvPortrait(id)}" alt=""><b>${twEsc(CH[id].name)}</b><small>⚔️ ${rkFmtN(S.atk)} · 🛡️ ${rkFmtN(S.def)}</small></div><em>VS</em><div class="r"><img src="${pvPortrait(T.ch)}" alt=""><b>${twEsc(CH[T.ch].name)}</b><small>SUA FORÇA +10%</small></div></div>
    <p class="dsfMod"><b>${T.m.n}</b> ${T.m.d}</p><p class="twH">Vitória: 💠 2 · 🟣 120 pó · 💎 1 cristal (raridade sobe com a sequência) · 🎫 1 · 💎 40 gemas. Derrota: 🟣 20 pó.<br>🔥 Sequência de vitórias: <b>${o.str}</b> dia${o.str===1?'':'s'} · 7 seguidos = 🎁 BAÚ LENDÁRIO + 💠 10 + 🎫 5</p>
    <p class="twH">Lutador: o 1º do seu time do PVP (Formação). Tentativas hoje: <b>${o.won?'✔ VENCIDO':o.left}</b></p>
    <div class="row"><button class="btn main" id="dsfGo" ${o.won||o.left<1?'disabled':''}>${o.won?'✔ JÁ VENCEU HOJE':o.left<1?'VOLTE AMANHÃ':'⚔️ LUTAR'}</button><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);$('dsfGo').onclick=()=>{rkModal(null);dsfStart()}}
function dsfStart(){rkInit();if(!SPR_OK)return;const o=dsfG();if(o.won||o.left<1)return;o.left--;rkS('dsf',o);try{acSave()}catch(e){}
  const T=dsfToday(),id=pvTeam()[0],me=pvDelta(id);DSF={T,me,diff0:G.diff,lives0:G.lives};try{fsTry()}catch(e){}
  G.pick=id;G.opp=T.ch===id?(id==='goku'?'vegeta':'goku'):T.ch;G.gmode='dsf';G.diff=2;G.lives=2;const sk=Object.keys(STG).filter(k=>!STG[k].hid);G.nextStg=sk[(Math.random()*sk.length)|0];
  const PM=prepMatch([G.pick,G.opp],G.nextStg);showVS(()=>PM.then(()=>{vsLoadEnd();startMatch();setTimeout(()=>{try{banner('DESAFIO DO DIA','#ff9a3a',100,T.m.n)}catch(e){}},300)}),PM)}
{const _ra=rkApply;rkApply=function(){const r=_ra.apply(this,arguments);if(G.gmode==='dsf'&&G.p&&DSF){const [p,o]=G.p,M=DSF.T.m;for(const k in DSF.me)if(k!=='_def'&&typeof DSF.me[k]==='number')p[k]=DSF.me[k];
    o.tdm=(p.tdm||1)*1.1*((M.o||{}).dm||1);o.tdf=(p.tdf||1)/1.1/((M.o||{}).df||1);o.tsp=(p.tsp||1)*((M.o||{}).sp||1);o.tcr=(p.tcr||0)+((M.o||{}).cr||0);o.tcd=p.tcd||0;o.tls=((M.o||{}).ls||0);o.pvN='DESAFIO';
    const P=M.p||{};if(P.dm)p.tdm*=P.dm;if(P.df)p.tdf/=P.df;if(P.sp)p.tsp*=P.sp;if(P.cr)p.tcr=(p.tcr||0)+P.cr;if(p.preg){p.pregT=G.frame;p.pregTot=0;p._lhp=p.hp}}return r}}
{const _er=endRound;endRound=function(){if(G.gmode==='dsf')return dsfEnd(G.koWinner);return _er.apply(this,arguments)}}
function dsfEnd(w){G.mode='ranked';$('controls').hidden=true;$('pauseBtn').hidden=true;try{rainSound(0)}catch(e){}G.paused=false;const D=DSF||{};G.diff=D.diff0!=null?D.diff0:G.diff;G.lives=D.lives0||G.lives;G.gmode='pve';DSF=null;
  const won=w===0,o=dsfG(),R=[];if(won){o.won=1;o.str=o.last===dlDay(-1)?o.str+1:1;o.last=dlDay();psAddJn(2);rkS('po',lvPo()+120);const cr=Math.min(4,Math.floor((o.str-1)/2));{const a=lvArr('cr');a[cr]++;rkS('cr',a)}rkAdd('tic',1);rkAdd('gem',40);
    R.push('💠 +2','🟣 +120 pó','💎 cristal '+RKRNM[cr],'🎫 +1','💎 +40');if(o.str>0&&o.str%7===0){psAddJn(10);rkAdd('tic',5);setTimeout(()=>{try{rkOverTw(()=>twBauOpen({r:'lend',n:1}))}catch(x){try{twBauOpen({r:'lend',n:1})}catch(y){}}},2500);R.push('🎁 7 DIAS SEGUIDOS: BAÚ LENDÁRIO · 💠 +10 · 🎫 +5')}}
  else{rkS('po',lvPo()+20);R.push('🟣 +20 pó')}
  rkS('dsf',o);try{acSave(1)}catch(e){}rkOpen('menu');setTimeout(()=>{const M=document.createElement('div');M.id='lvrzM';document.body.appendChild(M);const rkModal=h=>{M.innerHTML=h};rkModal(`<div class="twM ${won?'gold':''}"><h3>${won?'🏆 DESAFIO VENCIDO!':'💀 O RIVAL VENCEU'}</h3><p class="twH">${R.join(' · ')}</p><p class="twH">${won?'🔥 Sequência: '+o.str+' dia'+(o.str>1?'s':''):'Tentativas que sobraram hoje: '+o.left}</p><div class="row">${!won&&o.left>0?'<button class="btn main" id="dsfAg">⚔️ TENTAR DE NOVO</button>':''}<button class="btn" id="rkMX">FECHAR</button></div></div>`);rkSfx(won?'powerUp':'clang');M.querySelector('#rkMX').onclick=()=>M.remove();const a=M.querySelector('#dsfAg');if(a)a.onclick=()=>{M.remove();dsfStart()}},900)}
/* botão no menu Modos de Jogo */
{const _mh=rkMenuH;rkMenuH=function(){const o=dsfG();return _mh.apply(this,arguments)+`<button class="hs dsfB ${o.won?'ok':''}" data-a="dsf" style="${mnB(28,506,318,566)}"><b>⚔️ DESAFIO DO DIA</b><small>${o.won?'✔ vencido hoje':o.left>0?o.left+' tentativa'+(o.left>1?'s':'')+' · '+dsfToday().m.n:'volte amanhã'}</small></button>`}}
{const _a=rkAct;rkAct=function(a,b){if(a==='dsf'){rkSfx('whoosh');return dsfOpen()}return _a.apply(this,arguments)}}

/* só para testes de equilíbrio: window.__autoP = jogador controlado pela IA combista */
{const _hi2=humanInput;humanInput=function(f){_hi2.apply(this,arguments);try{if(window.__autoP&&G.p&&f===G.p[0]){const o=G.p[1];if(!pvCombo(f,o,null)){const c=f.cpu;f.cpu=true;try{aiThink(f,o)}finally{f.cpu=c}}}}catch(e){}}}

/* v353: sombra do ADM sem limite de combo e reação mais rápida */
{const _pc=pvCombo;pvCombo=function(f,o,_a){if(f.admS&&(f.combo||0)>=22)f.combo=21;return _pc.apply(this,arguments)}}
/* sombra também atualiza sozinha ao entrar no jogo (1 vez por versão), sem precisar abrir o PVP */
{const _o=rkOpen;rkOpen=function(){const r=_o.apply(this,arguments);setTimeout(()=>{try{if(pvAcc()&&(rkG('pvupv',0)|0)<352){pvCfgLoad().then(on=>{if(on){rkS('pvupv',352);pvUp(1)}})}}catch(e){}},6000);return r}}

/* ================= v354: CAÇA · HIDRA (só ADM por enquanto) =================
   Parte 1 (floresta): lobinhos coloridos · Parte 2 (floresta funda): clones da Hidra + lobos · Parte 3 (cachoeira): ondas de clones e lobos que vão nascendo
   · CHEFE: a Hidra de verdade, 5 níveis (cada vez que cai, levanta mais forte e o cenário vai sendo destruído). Caixa de prêmios a cada parte/nível.
   Mobs extras ficam em HY.mobs (não estão no G.p): andam com bsStep e o golpe do jogador acerta neles (hyHitMobs). G.p[1] = inimigo principal (quando cai, outro assume). */
const HYR=RQA.hidra||{};
const HYK=['hy1','hy2','hy3','hy4','hy5','hy6','hy7'];
try{HYK.forEach((k,i)=>{if(!HYR.mapas)return;STG[k]=Object.assign({},STG.flo,{name:'TERRA DA HIDRA',src:HYR.mapas[i],src0:HYR.mapas[i],dn:0,hid:1,_ld:null,img:new Image(),far:null,near:null});try{LT[k]=LT.flo}catch(e){}})}catch(e){}
const HYW={vermelho:'brightness(1.9) sepia(1) saturate(7) hue-rotate(-35deg)',verde:'brightness(1.9) sepia(1) saturate(6) hue-rotate(55deg)',azul:'brightness(1.9) sepia(1) saturate(6) hue-rotate(170deg)',preto:'brightness(.75) contrast(1.2)'};
/* atributos (mesmas contas do Boss: dano=(ATK/150)^0,3, defesa=1/(1+DEF/900)) */
const HYS={lobo:{atk:9000,def:400,hp:1.6,sp:1.22,sc:.72},clone:{atk:24000,def:900,hp:3,sp:1.15,sc:.85},hidra:[{atk:60000,def:1500,hp:9},{atk:85000,def:1850,hp:11},{atk:115000,def:2300,hp:13},{atk:150000,def:2850,hp:16},{atk:195000,def:3500,hp:19},{atk:250000,def:4300,hp:22},{atk:320000,def:5200,hp:26},{atk:400000,def:6200,hp:30}]};
const HYP=[{n:'PARTE 1',d:'MATE OS LOBOS',need:8,cap:3,sp:70,k:['lobo']},{n:'PARTE 2',d:'CLONES DA HIDRA',need:12,cap:4,sp:60,k:['clone','lobo','lobo','clone']},{n:'PARTE 3',d:'A HORDA DA CACHOEIRA',need:16,cap:5,sp:50,k:['clone','lobo','clone','lobo','clone']}],HYMAX=8;
let HY={on:0};
const hyAdm=()=>{try{return twIsAdm()}catch(e){return false}};
function hySetup(f,kind,lv){f.hyK=kind;f.bPas=[];f.bLv=1;f.bCdm=1;
  if(kind==='lobo'){const cs=Object.keys(HYW),c=cs[(Math.random()*cs.length)|0],S=HYS.lobo;f.bR=null;f.bFil=HYW[c];f.bSc=S.sc;f.bsp=S.sp;f.def=Object.assign({},f.def,{id:'lobo',name:'LOBO '+c.toUpperCase()});f.hyAtk=S.atk;f.hyDef=S.def;f.mhp=S.hp*LAYER}
  else if(kind==='clone'){const S=HYS.clone;f.bR=HYR;f.bFil='saturate(1.5) brightness(.8) hue-rotate(-20deg)';f.bSc=S.sc;f.bsp=S.sp;f.def=Object.assign({},f.def,{id:'hidra',name:'CLONE DA HIDRA'});f.hyAtk=S.atk;f.hyDef=S.def;f.mhp=S.hp*LAYER;f.hyB=1}
  else{const S=HYS.hidra[lv-1];f.bR=HYR;f.bFil=lv>=4?'saturate(1.25) brightness(1.08)':'';f.bSc=1+(lv-1)*.05;f.bsp=1.1+(lv-1)*.08;f.def=Object.assign({},f.def,{id:'hidra',name:'HIDRA · NÍVEL '+lv,cn:'BESTA DE ALMA · 500.000 ANOS'});f.hyAtk=S.atk;f.hyDef=S.def;f.mhp=S.hp*LAYER;f.hyB=1;f.hyLv=lv;f.bCdm=Math.max(.45,1-(lv-1)*.13)}
  f.tdm=Math.pow(f.hyAtk/150,.3);f.bDf=1/(1+f.hyDef/900);f.tdf=f.bDf;f.tcr=kind==='hidra'?10+lv*4:5;f.hp=f.hpLag=f.mhp;f.ko=false;f.bs='idle';f.bt=0;f.bcd=20+((Math.random()*30)|0)}
function hyMk(kind,x,lv){const f=mkFighter('goku',x,-1,true);bsMake(f);hySetup(f,kind,lv);f.y=FLOOR;f.grounded=true;return f}
try{if(HYR.por){IMG.hidra=new Image();IMG.hidra.src=HYR.por}}catch(e){}
/* desenho/movimento com os quadros certos (Hidra usa RQA.hidra; lobinhos coloridos com filtro) */
{const _bd=bsDraw;bsDraw=function(f,reflect){const L=RQA.lobo;if(f.bR)RQA.lobo=f.bR;ctx.save();if(f.bFil&&!reflect)ctx.filter=f.bFil;try{return _bd.apply(this,arguments)}finally{ctx.restore();RQA.lobo=L}}}
{const _bf=bsFrame;bsFrame=function(f){const r=_bf.apply(this,arguments);if(f.hyB&&r&&r[0]==='garras'&&r[1]===0&&(f.bs==='idle'||f.bs==='win'))return ['parado',Math.floor(G.frame/6)%6];if(f.hyB&&f.bs==='a_slam')return ['furia',f.bSlF|0];return r}}
{const _bs=bsStep;bsStep=function(f,o){if(f.hyIdle){const d=HY.dir||1;f.x=clamp(o.x+d*320,40,WW-40);if(Math.abs(f.x-o.x)<2)f.x=o.x+d*2;f.y=FLOOR;f.state='down';f.vx=0;f.facing=f.x>o.x?-1:1;return}if(f.bs==='a_slam')return hySlam(f,o);const L=RQA.lobo;if(f.bR)RQA.lobo=f.bR;try{return _bs.apply(this,arguments)}finally{RQA.lobo=L}}}
/* Hidra: GOLPE DA FÚRIA (bate no chão, onda roxa): atordoa; do nível 3 em diante CONGELA */
{const _bt=bsThink;bsThink=function(f,o,dist){if(f.hyB&&dist<330&&Math.random()<(f.hyK==='hidra'?.2+(f.hyLv||1)*.03:f.hyK==='filhote'?.035:.1)){bsSet(f,'a_slam');return}return _bt.apply(this,arguments)}}
function hySlam(f,o){f.bt++;f.st++;if(f.flash>0)f.flash--;if(f.inv>0)f.inv--;f.tdf=f.bDf||1;
  if(f.ko||!['idle','walk','attack','jump','win'].includes(f.state)){f.bs='idle';return}
  const t=f.bt,T=[10,6,5,6,8,12],sum=a=>T.slice(0,a).reduce((x,y)=>x+y,0),HB=bsHitbox(f);f.state='attack';bsFace(f,o);f.vx=t<sum(1)?0:t<sum(3)?f.facing*9:f.vx*.6;f.x=clamp(f.x+f.vx,60,WW-60);
  {const j=T.findIndex((_,i)=>t<sum(i+1));f.bSlF=j<0?5:j}
  if(t===sum(1))try{SFX.whoosh();txt(f.x,f.y-260,'⚠️','#ff4dff')}catch(e){}
  if(t===sum(4)){G.shake=Math.max(G.shake,16);try{SFX.thud();ring(f.x+f.facing*150,FLOOR-20,'#c050ff',260,20,8);dust(f.x+f.facing*150,FLOOR,18)}catch(e){}}
  if(t>=sum(4)&&t<sum(5)){const ok=bsTry(f,o,HB(-40,330,0,170),{dmg:150,kb:6,hs:20,n:1,T:2,big:1,sh:14});
    if(ok&&!o.ko&&o.state!=='blockstun'){const fr=f.hyK==='hidra'&&(f.hyLv||1)>=3&&Math.random()<.5;
      if(fr){o.state='iced';o.st=0;o.iceLeft=70+(f.hyLv||3)*12;o.vx=0;o.vy=0;txt(o.x,o.y-300,'❄️ CONGELADO!','#bfeaff')}else{o.state='hit';o.hitstun=Math.max(o.hitstun||0,55);o.stunFx=55;txt(o.x,o.y-300,'💫 ATORDOADO!','#ffe14a')}}}
  if(t>=sum(6)){bsSet(f,'idle');f.bcd=8+((Math.random()*10)|0)}}
/* ---------- começar ---------- */
function hyStart(){rkInit();if(!SPR_OK)return;const sel=rkG('sel','goku');fsTry();
  CA={on:1};HY={on:1,st:0,lv:0,kills:0,mobs:[],dead:[],items:[],gate:0,spawnT:60,loot:{gem:0,jn:0,po:0,cr:[0,0,0,0,0],an:[]},chests:0,t0:Date.now(),busy:0};
  G.pick=sel;G.opp='goku';G.gmode='caca';RKB.diff0=G.diff;G.diff=3;G.nextStg='hy1';bsPre();try{for(const k in HYR)if(Array.isArray(HYR[k])&&k!=='mapas')for(const q of HYR[k])bsImg(q[0])}catch(e){}
  const PM=Promise.all([prepMatch([G.pick,G.opp],'hy1')].concat(HYK.slice(1).map(k=>stageLoad(k))));showVS(()=>PM.then(()=>{vsLoadEnd();startMatch()}),PM)}
/* depois do rkApply da Caça (que monta o lobo), troca pelo inimigo da parte 1 */
{const _ra=rkApply;rkApply=function(){const r=_ra.apply(this,arguments);try{if(HY.on&&G.gmode==='caca'&&G.p&&!G.p[1].hyK){const o=G.p[1];hySetup(o,'lobo');o.x=WW/2+260;o.facing=-1}}catch(e){}return r}}
{const _rg=rkBossGo;rkBossGo=function(){const r=_rg.apply(this,arguments);if(HY.on){G.timer=99;stageLoad('hy2');stageLoad('hy3');const P=HYP[0];banner('CAÇA · HIDRA','#c050ff',110,P.n+' · '+P.d)}return r}}
{const _sv=showVS;showVS=function(cb,PM){const r=_sv.apply(this,arguments);if(HY.on){try{$('vs2').src=HYR.vs;$('vsn2').textContent='HIDRA'}catch(e){}}return r}}
/* ---------- a cada quadro ---------- */
function hyNeed(){return HY.st<3?HYP[HY.st].need:0}
function hySpawn(){const P=HYP[HY.st];if(!P)return;const p=G.p[0],side=Math.random()<.5?-1:1;let x=p.x+side*(520+Math.random()*200);if(x<120||x>WW-120)x=p.x-side*(520+Math.random()*200);x=clamp(x,100,WW-100);
  const m=hyMk(P.k[(Math.random()*P.k.length)|0],x);m.facing=m.x<p.x?1:-1;m.inv=30;HY.mobs.push(m);try{ring(m.x,m.y-120,'#c050ff',140,16,5);dust(m.x,FLOOR,12)}catch(e){}}
function hyHitMobs(p){const mv=p.move;if(p.state!=='attack'||!mv||!mv.hb||!(p.mf>mv.su&&p.mf<=mv.su+mv.ac))return;const key=G.frame-p.mf;
  for(const m of HY.mobs){if(m.ko||(m.hyLM===mv&&m.hyLK===key))continue;const hu=hurtbox(m);if(!hu)continue;const hb=hitbox(p,mv);if(!overlap(hb,hu))continue;m.hyLM=mv;m.hyLK=key;
    const px=p.x+p.facing*(mv.hb[0]+mv.hb[2]*.6),py=clamp(p.y+mv.hb[1]+mv.hb[3]/2,hu.y+20,hu.y+hu.h-20);applyHit(p,m,{smash:mv.smash,launcher:mv.launcher,dmg:mv.dmg,kb:mv.kb,hs:Math.min(8,mv.hs||8),launch:mv.launch,heavy:mv.heavy,low:mv.low,px,py,kind:mv.sword?'sword':'melee',ang:0})}}
function hyTick(){if(!HY.on||!G.p||G.mode!=='fight')return;const p=G.p[0];if(G.timer<60)G.timer=99;try{hyItemsTick(p)}catch(e){}if(HY.gate&&p.x>WW-170&&G.phase==='fight')hyNext();if(HY.gate){const I=p.inp||{};if(I.right&&!I.left)HY.dir=1;else if(I.left&&!I.right)HY.dir=-1}
  for(const d of HY.dead){d.hyDT=(d.hyDT||0)+1;try{bsStep(d,p)}catch(e){}}HY.dead=HY.dead.filter(d=>d.hyDT<70);
  if(G.phase!=='fight'||G.paused||HY.busy)return;
  for(const m of HY.mobs){if(m.ko)continue;try{updFighter(m,p)}catch(e){}}
  try{hyHitMobs(p)}catch(e){}
  if(HY.st<3&&!HY.gate){const alive=HY.mobs.filter(m=>!m.ko).length,left=hyNeed()-HY.kills-1-alive;if(alive<HYP[HY.st].cap&&left>0&&--HY.spawnT<=0){hySpawn();HY.spawnT=HYP[HY.st].sp}}
  else if(!HY.fil&&(HY.lv||1)>=2){const alive=HY.mobs.filter(m=>!m.ko).length;if(alive<Math.min(3,HY.lv-1)&&--HY.spawnT<=0){hySpawn2();HY.spawnT=420}}}
function hySpawn2(){const p=G.p[0],x=clamp(p.x+(Math.random()<.5?-560:560),100,WW-100),m=hyMk('lobo',x);m.facing=m.x<p.x?1:-1;HY.mobs.push(m)}
{const _u=update;update=function(){_u.apply(this,arguments);try{hyTick()}catch(e){}}}
{const _rf=renderFighter;renderFighter=function(f,reflect){if(f&&f.hyIdle)return;if(HY.on&&!reflect&&G.p&&f===G.p[0]){try{hyItemsDraw()}catch(e){}}if(HY.on&&!reflect&&G.p&&f===G.p[1]){for(const d of HY.dead){ctx.save();ctx.globalAlpha=Math.max(0,1-(d.hyDT||0)/70);try{_rf.call(this,d)}catch(e){}ctx.restore()}for(const m of HY.mobs)if(!m.ko)try{_rf.call(this,m)}catch(e){}}return _rf.apply(this,arguments)}}
/* ---------- quem cai ---------- */
{const _ko=ko;ko=function(a,d){if(!HY.on||!G.p||d===G.p[0])return _ko.apply(this,arguments);if(G.phase!=='fight'&&d!==G.p[1]){d.ko=true;return}
  if(d!==G.p[1]&&!HY.mobs.includes(d)){d.ko=true;d.hp=0;return}
  if(HY.mobs.includes(d)){d.ko=true;d.hp=0;d.vy=-8;d.vx=(a&&a.facing||1)*6;d.grounded=false;HY.mobs=HY.mobs.filter(m=>m!==d);HY.dead.push(d);hyKill(d);return}
  if(d===G.p[1]){if(HY.st<3){d.ko=true;d.hp=0;d.vy=-8;d.vx=(a&&a.facing||1)*6;d.grounded=false;HY.dead.push(d);const nx=HY.mobs.find(m=>!m.ko);
      if(nx){HY.mobs=HY.mobs.filter(m=>m!==nx);G.p[1]=nx}else{const p=G.p[0];G.p[1]=hyMk(HYP[HY.st].k[0],clamp(p.x+(p.x<WW/2?600:-600),120,WW-120));G.p[1].inv=40}hyKill(d);return}
    if(HY.busy||d.hyRev){d.hp=Math.max(1,d.hp);d.ko=false;return}
    if(HY.lv<HYMAX){d.hyRev=1;hyBossUp(a,d);return}
    const gm=G.gmode;G.gmode='pve';try{return _ko.apply(this,arguments)}finally{G.gmode=gm}}
  return _ko.apply(this,arguments)}}
function hyKill(d){HY.kills++;if(Math.random()<.14)hyDrop('cura',d.x);try{txt(d.x,d.y-230,'+1','#ffd84a')}catch(e){}if(HY.st<3&&HY.kills>=hyNeed())hyClear()}
/* ---------- prêmios (caixa) ---------- */
function hyRedAge(){return Math.round(100*Math.pow(5000,Math.pow(Math.random(),1.6))/100)*100||100}
function hyRing(lv){const W=lv<=1?[25,30,25,15,5]:lv===2?[15,28,28,20,9]:lv===3?[8,22,30,26,14]:lv===4?[3,15,28,32,22]:lv===5?[0,8,22,35,35]:lv===6?[0,4,18,36,42]:[0,0,14,36,50];let q=Math.random()*W.reduce((a,b)=>a+b,0),c=0;for(let i=0;i<5;i++){if((q-=W[i])<0){c=i;break}}
  const r=anRoll(c,Math.min(10,4+lv*1.2|0));if(c===4){r.a=hyRedAge();const k=.5+1.5*Math.log10(r.a/100)/Math.log10(5000);r.v=Math.round(r.v*k*10)/10;r.hy=1}return r}
function hyChest(tier,x){if(x!=null&&HY.on){hyDrop('bau',x,{tier});return []}return hyChestOpen(tier,null)}
function hyChestOpen(tier,at,ng){const L=HY.loot,R=[],it=[];const give=(k,o,tx)=>{if(ng&&k==='gem')return;R.push(tx);if(at!=null)it.push(Object.assign({k},o));else hyGrant(Object.assign({k},o))};const g=[15,18,20,0,20,0,24,0,25,28][tier]||0;if(g)give('gem',{n:g},'💎 +'+g);
  const j=tier>=3?2:1;give('jn',{n:j},'💠 +'+j);const po=150+tier*60;give('po',{n:po},'🟣 +'+po);
  const cr=Math.min(4,Math.floor(tier/2));give('cr',{n:cr},'💎 cristal '+RKRNM[cr]);
  const n=tier>=9?4:tier>=6?3:tier>=3?2:1;for(let i=0;i<n;i++){const r=hyRing(Math.max(1,tier-2));give('an',{r},'💍 '+ANC[r.c][0]+(r.c===4?' ('+anAge(r)+')':''))}give('cura',{},'');R.pop();
  HY.chests++;hyBox(R);if(at!=null)it.forEach((o,i)=>{const a=(i/it.length)*Math.PI-Math.PI;hyDrop(o.k,at,o,Math.cos(a)*(6+Math.random()*5),-12-Math.random()*6)});return R}
function hyBox(R){let B=document.getElementById('hyBox');if(!B){B=document.createElement('div');B.id='hyBox';document.body.appendChild(B)}B.innerHTML=`<b>🎁 CAIXA ${HY.chests}</b>${R.map(x=>`<span>${x}</span>`).join('')}`;B.className='on';clearTimeout(hyBox.t);hyBox.t=setTimeout(()=>{B.className=''},3800);try{rkSfx('powerUp')}catch(e){}}
/* ---------- passar de parte ---------- */
function hyStg(k){const S=STG[k];const go=()=>{try{setStage(k)}catch(e){}};if(S&&S.img&&S.img.naturalWidth)go();else stageLoad(k).then(go);const i=HYK.indexOf(k);if(HYK[i+1])stageLoad(HYK[i+1])}
function hyFade(mid){let F=document.getElementById('hyFade');if(!F){F=document.createElement('div');F.id='hyFade';document.body.appendChild(F)}F.className='on';setTimeout(()=>{try{mid()}catch(e){}setTimeout(()=>{F.className=''},250)},650)}
function hyClear(){if(HY.gate||HY.busy)return;const st=HY.st,p=G.p[0];banner(HYP[st].n+' CONCLUÍDA!','#ffd84a',90,'🎁 BAÚ NO CHÃO · ➡ SIGA EM FRENTE');hyChest(st,clamp(p.x+220,160,WW-260));
  for(const m of HY.mobs){m.ko=true;HY.dead.push(m)}HY.mobs=[];const o=G.p[1];o.hyIdle=1;o.inv=99999;o.def=Object.assign({},o.def,{name:'➡ SIGA EM FRENTE'});HY.gate=1}
function hyNext(){const p=G.p[0];hyCollectAll();HY.gate=0;HY.busy=1;HY.kills=0;hyFade(()=>{HY.busy=0;HY.st++;HY.kills=0;HY.spawnT=40;HY.items=[];const k=HYK[Math.min(2,HY.st)];hyStg(k);p.x=180;p.y=FLOOR;p.vx=0;p.facing=1;
    if(HY.st<3){G.p[1]=hyMk(HYP[HY.st].k[0],720);banner('CAÇA · HIDRA','#c050ff',100,HYP[HY.st].n+' · '+HYP[HY.st].d)}
    else{HY.lv=1;G.p[1]=hyMk('hidra',900,1);G.p[1].bEye=60;banner('A HIDRA APARECEU!','#ff4dff',130,'NÍVEL 1 DE '+HYMAX);G.shake=24;try{SFX.boom()}catch(e){}}},300)}
function hyBossUp(a,d){HY.busy=1;const lv=HY.lv;banner('HIDRA NÍVEL '+lv+' DERROTADA!','#ffd84a',80,lv%2===0?'🎁 BAÚ NO CHÃO':'ELA VAI LEVANTAR...');if(lv%2===0)hyChest(2+lv,clamp(d.x+(d.x<G.p[0].x?-120:120),160,WW-160));
  d.hp=1;d.inv=999;bsSet(d,'hurt');d.state='down';d.downT=0;G.slow=40;G.flash=10;G.flashCol='#c050ff';G.shake=26;
  setTimeout(()=>{if(!HY.on)return;HY.lv=lv+1;try{hyStg(HYK[Math.min(6,2+HY.lv-1)])}catch(e){}hyDrop('cura',d.x+(Math.random()<.5?-160:160));const x=d.x;hySetup(d,'hidra',HY.lv);d.hyRev=0;d.x=x;d.inv=40;d.state='idle';d.bEye=70;d.ko=false;
    G.flash=14;G.flashCol='#ffffff';G.shake=30;try{SFX.boom();for(const r of [420,280,150])ring(d.x,d.y-150,r===150?'#ffffff':'#c050ff',r,26,8)}catch(e){}banner('A HIDRA LEVANTOU!','#ff4dff',120,'NÍVEL '+HY.lv+' DE '+HYMAX+' · MAIS FORTE');HY.busy=0},1700)}
/* ---------- fim ---------- */
{const _er=endRound;endRound=function(){if(!HY.on)return _er.apply(this,arguments);hyEnd(G.p&&G.p[1]&&G.p[1].ko&&HY.st>=3&&HY.lv>=HYMAX)}}
function hyEnd(won){const L=HY.loot,secs=Math.round((Date.now()-HY.t0)/1000),st=HY.st,lv=HY.lv;if(won)hyChest(9);hyCollectAll();
  G.mode='ranked';$('controls').hidden=true;$('pauseBtn').hidden=true;try{$('pcHud').hidden=true}catch(e){}try{rainSound(0)}catch(e){}G.paused=false;G.diff=RKB.diff0;G.gmode='pve';CA.on=0;HY.on=0;HY.mobs=[];HY.dead=[];
  if(won){const b=rkG('hyRec',0);rkS('hyRec',Math.max(b,99))}else{const pr=st<3?st:3+lv-1;rkS('hyRec',Math.max(rkG('hyRec',0),pr))}try{acSave(1)}catch(e){}
  rkOpen('ca');setTimeout(()=>{const M=document.createElement('div');M.id='lvrzM';document.body.appendChild(M);
    M.innerHTML=`<div class="twM ${won?'gold':''}"><h3>${won?'🐉 VOCÊ CAÇOU A HIDRA!':'💀 A HIDRA VENCEU'}</h3><p class="twH">${st<3?'Chegou na '+HYP[st].n:'Chegou no NÍVEL '+lv+' de '+HYMAX+' da Hidra'} · ${Math.floor(secs/60)}min ${secs%60}s · ${HY.chests} caixa${HY.chests===1?'':'s'}</p>
    <p class="twH">💎 ${L.gem} · 💠 ${L.jn} · 🟣 ${L.po} pó · cristais ${L.cr.map((n,i)=>n?n+' '+RKRNM[i]:'').filter(Boolean).join(', ')||'—'}</p><div class="hyAn">${L.an.map(r=>`<span style="--c:${ANC[r.c][1]}">💍 ${ANC[r.c][0]} · ${ANG[r.g]}${r.c>=3?' · '+anAge(r):''}<small>${anTxt(r)}</small></span>`).join('')||'<span>nenhum anel</span>'}</div>
    <div class="row"><button class="btn main" id="hyAg">⚔️ CAÇAR DE NOVO</button><button class="btn" id="hyX">FECHAR</button></div></div>`;
    M.querySelector('#hyX').onclick=()=>M.remove();M.querySelector('#hyAg').onclick=()=>{M.remove();hyStart()}},900)}
/* ---------- tela da Caça: escolher LOBO ou HIDRA ---------- */
let CASEL='lobo';
{const _ch=caH;caH=function(){let h=_ch.apply(this,arguments);const adm=true,rec=rkG('hyRec',0);
  if(CASEL==='hidra'&&adm){h=h.replace(/<i class="mEye[^>]*><\/i>/g,'').replace(/data-a="caInfo"([^>]*)><b class="caSlT">LOBO NEGRO<\/b><b class="caSlI">\?<\/b>/,'data-a="caLobo"$1>').replace(/data-a="caGo"/,'data-a="hyGo"').replace(/<div class="caBar"[\s\S]*?<\/div>/,`<div class="caBar" style="${rkB2(370,884,1070,932)}">🐉 HIDRA · 3 PARTES + 8 NÍVEIS · RECORDE: <b>${rec>=99?'👑 CAÇOU A HIDRA':rec?(rec<3?'PARTE '+rec:'NÍVEL '+(rec-2)):'—'}</b></div>`).replace(/<b>FLORESTA SOMBRIA<\/b>/,'<b>TERRA DA HIDRA</b>')
    h=h.replace(/(<button class="hs" data-a="caLk" style="[^"]*"><\/button>)/,'')+`<button class="hs caSl hySl on" data-a="hyInfo" style="${rkB2(25,350,345,488)}"><b class="caSlT">HIDRA</b><b class="caSlI">?</b></button>`}
  else h=h.replace(/(<button class="hs" data-a="caLk" style="[^"]*"><\/button>)/,`<button class="hs caSl hySl" data-a="${adm?'hySel':'caLk'}" style="${rkB2(25,350,345,488)}">${adm?'<b class="caSlT">🐉 HIDRA</b>':''}</button>`);
  return h}}
{const _v=rkView;rkView=function(v){const r=_v.apply(this,arguments);if(v==='ca'&&CASEL==='hidra'&&HYR.tela){const A=document.querySelector('#rkWrap .rkA');if(A)A.style.backgroundImage=`url(${HYR.tela})`}return r}}
function hyInfo(){rkModal(`<div class="twM"><h3>🐉 HIDRA · CAÇA AO MONSTRO</h3><p class="twH"><b>PARTE 1</b> (floresta): lobinhos coloridos. <b>PARTE 2</b>: clones da Hidra e lobos. <b>PARTE 3</b> (cachoeira): a horda — enquanto você bate, nascem mais. Depois vem a <b>HIDRA</b> de verdade: cada vez que você derrota ela, ela SOME e solta uma ninhada de FILHOTES (mini bosses). Mate todos e ela volta mais forte — isso acontece 7 vezes (8 níveis), e o cenário vai sendo destruído.</p>
  <p class="twH">Ataques: mordida, rabada, bote, investida de garras e GOLPE DA FÚRIA (atordoa; do nível 3 em diante pode CONGELAR).</p><p class="twH">🎁 Uma CAIXA a cada parte e a cada nível da Hidra: gemas, joias negras, pó, cristal e ANÉIS (até 4 na última). 💍 Anel VERMELHO de 100 até 500.000 anos — quanto mais velho, mais forte.</p><div class="row"><button class="btn main" id="rkMX">ENTENDI</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
{const _a=rkAct;rkAct=function(a,b){if(a==='hySel'){rkSfx('whoosh');CASEL='hidra';return rkView('ca')}if(a==='caLobo'){rkSfx('whoosh');CASEL='lobo';return rkView('ca')}if(a==='hyGo')return hyStart();if(a==='hyInfo')return hyInfo();return _a.apply(this,arguments)}}

/* ================= v355: itens no CHÃO (baús, prêmios flutuando, poção de cura), caminho sem parar, cores dos lobinhos em cache ================= */
const HYIC={gem:()=>RQA.coin[0],jn:()=>RQA.jn,po:o=>poIco(o.n||10),cr:o=>RQA.lvi.cr[o.n|0],an:o=>RQA.anel2[o.r.c],cura:()=>TWIMG.poc[1],bau:o=>TWIMG.bf[Math.min(4,Math.floor((o.tier|0)/2))]};
const HYGL={gem:'#7fd8ff',jn:'#c46bff',po:'#b57bff',cr:'#ffd84a',an:'#ff6080',cura:'#7dff9a',bau:'#ffd84a'};
function hyDrop(k,x,o,vx,vy){const it=Object.assign({k,x:clamp(x,90,WW-90),y:FLOOR-260,vx:vx||0,vy:vy==null?-6:vy,t:0,land:0},o||{});(HY.items=HY.items||[]).push(it);try{bsImg(HYIC[k](it))}catch(e){}return it}
function hyGrant(it){const L=HY.loot,p=G.p&&G.p[0];let tx='',c=HYGL[it.k];
  if(it.k==='gem'){L.gem+=it.n;rkAdd('gem',it.n);tx='💎 +'+it.n}else if(it.k==='jn'){L.jn+=it.n;psAddJn(it.n);tx='💠 +'+it.n}else if(it.k==='po'){L.po+=it.n;rkS('po',lvPo()+it.n);tx='🟣 +'+it.n}
  else if(it.k==='cr'){const a=lvArr('cr');a[it.n]++;rkS('cr',a);L.cr[it.n]++;tx='💎 '+RKRNM[it.n]}else if(it.k==='an'){anGive(it.r);L.an.push(it.r);tx='💍 '+ANC[it.r.c][0]+(it.r.c===4?' '+anAge(it.r):'');c=ANC[it.r.c][1]}
  else if(it.k==='cura'&&p){const m=p.mhp||MAXHP,h=m*.1;p.hp=Math.min(m,p.hp+h);p.hpLag=Math.max(p.hpLag||0,p.hp);tx='💚 +10% VIDA'}
  if(p&&tx&&HY.on)try{txt(p.x,p.y-300,tx,c);rkSfx('powerUp')}catch(e){}}
function hyItemsTick(p){const I=HY.items||[];for(const it of I){it.t++;if(!it.land){it.vy+=.9;it.x=clamp(it.x+it.vx,90,WW-90);it.y+=it.vy;it.vx*=.97;if(it.y>=FLOOR-(it.k==='bau'?0:70)){it.y=FLOOR-(it.k==='bau'?0:70);it.land=1;it.vx=0;if(it.k==='bau'){G.shake=Math.max(G.shake,6);try{dust(it.x,FLOOR,10);SFX.thud()}catch(e){}}}}
    if(it.done||!it.land||it.t<18)continue;if(Math.abs(p.x-it.x)<(it.k==='bau'?110:80)&&p.y>FLOOR-260){it.done=1;
      if(it.k==='bau'){try{SFX.boom();ring(it.x,FLOOR-60,'#ffd84a',180,18,6)}catch(e){}hyChestOpen(it.tier|0,it.x);it.open=1;it.done=1;it.ot=0}else hyGrant(it)}}
  HY.items=I.filter(it=>!(it.done&&!(it.k==='bau'&&(it.ot=(it.ot||0)+1)<90)))}
function hyCollectAll(){for(const it of HY.items||[]){if(it.done)continue;it.done=1;if(it.k==='bau'){if(!it.open)hyChestOpen(it.tier|0,null,it.ng)}else if(it.k!=='cura')hyGrant(it)}HY.items=[];hyBtn(0)}
function hyItemsDraw(){const I=HY.items||[];for(const it of I){const src=HYIC[it.k](it),im=bsImg(src);if(!im.complete||!im.naturalWidth)continue;const big=it.k==='bau',sz=big?150:it.k==='an'?70:62,bob=it.land&&!big?Math.sin((G.frame+it.x)*.08)*10:0,y=it.y-sz/2-(big?sz/2:0)+bob;
    ctx.save();ctx.globalAlpha=it.done&&big?Math.max(0,1-(it.ot||0)/90):1;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(it.x,y+sz/2,0,it.x,y+sz/2,sz*.9);g.addColorStop(0,(it.k==='an'?ANC[it.r.c][1]:HYGL[it.k])+'aa');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(it.x-sz,y-sz*.4,sz*2,sz*1.8);
    ctx.globalCompositeOperation='source-over';ctx.drawImage(im,it.x-sz/2,y,sz,sz*im.naturalHeight/im.naturalWidth);ctx.restore()}
  if(HY.gate&&G.p){const x=WW-120,y=FLOOR-170,a=.6+.4*Math.sin(G.frame*.15);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#ffd84a';ctx.font='900 64px sans-serif';ctx.textAlign='center';ctx.fillText('➡',x,y);ctx.font='900 26px sans-serif';ctx.fillText('SIGA',x,y+36);ctx.restore()}}
/* lobinhos coloridos e clones: quadros pintados uma vez (filtro em tempo real é pesado no celular) */
const HYTC={};
function hyTinted(base,fil){const key=fil+'|'+(base===HYR?'h':'l');if(HYTC[key])return HYTC[key];const out={};let ok=true;
  for(const k in base){if(!Array.isArray(base[k])||k==='mapas')continue;out[k]=base[k].map(q=>{const im=bsImg(q[0]);if(!im.complete||!im.naturalWidth){ok=false;return q}const id='t'+key+q[0];if(!BSI[id]){const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.filter=fil;x.drawImage(im,0,0);c.complete=true;c.naturalWidth=c.width;c.naturalHeight=c.height;BSI[id]=c}return [id].concat(q.slice(1))})}
  if(!ok)return null;HYTC[key]=out;return out}
{const _hs=hySetup;hySetup=function(f,kind,lv){_hs.apply(this,arguments);if(f.bFil&&kind!=='hidra'){try{if(!(typeof ctx!=='undefined'&&'filter' in ctx))return;const T=hyTinted(kind==='lobo'?RQA.lobo:HYR,f.bFil);if(T){f.bR=T;f.bFil=''}}catch(e){}}}}

/* ================= v357: BAÚS DE RPG (artes do dono) com botão ABRIR BAÚ + EXPLORAÇÃO sem inimigos entre as partes ================= */
try{['hx1','hx2'].forEach((k,i)=>{if(!HYR.ex)return;STG[k]=Object.assign({},STG.flo,{name:'TERRA DA HIDRA',src:HYR.ex[i],src0:HYR.ex[i],dn:0,hid:1,_ld:null,img:new Image(),far:null,near:null});try{LT[k]=LT.flo}catch(e){}})}catch(e){}
const hyBT=it=>it.bt!=null?it.bt:[0,1,2,3,3,4,4,5,5,6][Math.min(9,it.tier|0)];
HYIC.bau=o=>(o.open?(HYR.bo||[])[hyBT(o)]:(HYR.bc||[])[hyBT(o)])||TWIMG.bf[Math.min(4,Math.floor((o.tier|0)/2))];
const HYBC=['#c8a070','#9ad0ff','#4aa8ff','#c46bff','#ff5a5a','#bfe8ff','#ffe27a'];
function hyBtn(on){let B=document.getElementById('hyOpen');if(!B){B=document.createElement('button');B.id='hyOpen';B.innerHTML='🎁 ABRIR BAÚ';B.onclick=e=>{e.stopPropagation();e.preventDefault();hyOpenNear()};B.ontouchstart=e=>{e.stopPropagation();e.preventDefault();hyOpenNear()};document.body.appendChild(B)}B.hidden=!on}
function hyOpenNear(){const it=HY.near;if(!it||it.open||it.opening)return;it.opening=1;it.ot=0;hyBtn(0);try{SFX.whoosh()}catch(e){}}
addEventListener('keydown',e=>{if(HY.on&&(e.code==='KeyE'||e.code==='Enter')&&HY.near)hyOpenNear()});
hyItemsTick=function(p){const I=HY.items||[];let near=null,nd=1e9;
  for(const it of I){it.t++;
    if(!it.land){it.vy+=.9;it.x=clamp(it.x+it.vx,90,WW-90);it.y+=it.vy;it.vx*=.97;const fl=FLOOR-(it.k==='bau'?0:70);
      if(it.y>=fl){it.y=fl;if(it.k==='bau'&&!it.bn&&it.vy>6){it.bn=1;it.vy=-it.vy*.32;G.shake=Math.max(G.shake,7);try{dust(it.x,FLOOR,14);SFX.thud()}catch(e){}}else{it.land=1;it.vx=0;it.vy=0;if(it.k==='bau')try{dust(it.x,FLOOR,8)}catch(e){}}}}
    if(it.k==='bau'){if(it.opening){it.ot++;if(it.ot===22){it.open=1;it.opening=0;it.ot=0;G.shake=Math.max(G.shake,8);try{SFX.boom();ring(it.x,FLOOR-80,HYBC[hyBT(it)],220,20,7)}catch(e){}hyChestOpen(it.tier|0,it.x,it.ng)}continue}
      if(it.open){it.ot=(it.ot||0)+1;continue}
      if(it.land){const d=Math.abs(p.x-it.x);if(d<150&&d<nd){nd=d;near=it}}continue}
    if(it.done||!it.land||it.t<18)continue;if(Math.abs(p.x-it.x)<80&&p.y>FLOOR-260){it.done=1;hyGrant(it)}}
  HY.near=near;hyBtn(!!near&&G.phase==='fight'&&!G.paused);
  HY.items=I.filter(it=>!(it.done&&it.k!=='bau')&&!(it.k==='bau'&&it.open&&it.ot>420))};
hyItemsDraw=function(){const I=HY.items||[];for(const it of I){const src=HYIC[it.k](it),im=bsImg(src);if(!im.complete||!im.naturalWidth)continue;const big=it.k==='bau',sz=big?(hyBT(it)>=5?190:165):it.k==='an'?70:62,bob=it.land&&!big?Math.sin((G.frame+it.x)*.08)*10:0;
    const h=sz*im.naturalHeight/im.naturalWidth,y=big?it.y-h+8:it.y-sz/2+bob,sh=big&&it.opening?(G.frame%2?4:-4)*(1+it.ot/10):0,col=big?HYBC[hyBT(it)]:it.k==='an'?ANC[it.r.c][1]:HYGL[it.k];
    ctx.save();ctx.globalAlpha=big&&it.open&&it.ot>300?Math.max(0,1-(it.ot-300)/120):1;
    ctx.globalCompositeOperation='lighter';const pul=big&&!it.open?.75+.25*Math.sin(G.frame*.12):1,g=ctx.createRadialGradient(it.x,y+h/2,0,it.x,y+h/2,sz*(big?.85:.9)*pul);g.addColorStop(0,col+(big?'99':'aa'));g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(it.x-sz,y-sz*.5,sz*2,h+sz);
    ctx.globalCompositeOperation='source-over';if(big){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(it.x,FLOOR+2,sz*.42,10,0,0,Math.PI*2);ctx.fill()}
    ctx.drawImage(im,it.x-sz/2+sh,y,sz,h);
    if(big&&it===HY.near&&!it.open&&!it.opening){ctx.fillStyle='#fff3b0';ctx.font='900 26px sans-serif';ctx.textAlign='center';ctx.fillText('▼',it.x,y-14+Math.sin(G.frame*.2)*5)}ctx.restore()}
  if(HY.gate&&G.p){const x=WW-120,y=FLOOR-170,a=.6+.4*Math.sin(G.frame*.15);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#ffd84a';ctx.font='900 64px sans-serif';ctx.textAlign='center';ctx.fillText('➡',x,y);ctx.font='900 26px sans-serif';ctx.fillText('SIGA',x,y+36);ctx.restore()}};
/* exploração: depois da Parte 1 e da Parte 2, um mapa sem inimigos com baús escondidos pelo caminho */
const HYEX=[{k:'hx1',n:'TRILHA DA FLORESTA',b:[[1500,2]]},{k:'hx2',n:'ÁRVORE ANCESTRAL',b:[[1300,4]]}];
{const _nx=hyNext;hyNext=function(){if(HY.busy)return;if(HY.ex||HY.st>1||!HYR.ex||!STG.hx1)return (HY.ex=0,_nx.apply(this,arguments));
  const p=G.p[0],E=HYEX[HY.st];hyCollectAll();HY.busy=1;HY.ex=1;HY.gate=0;HY.kills=0;hyFade(()=>{HY.busy=0;HY.items=[];hyStg(E.k);p.x=180;p.y=FLOOR;p.vx=0;p.facing=1;HY.gate=1;
    E.b.forEach(([x,bt],i)=>{const it=hyDrop('bau',x,{tier:bt+1,bt,ng:1},0,-2);it.y-=i*120});
    banner('EXPLORAÇÃO','#7dff9a',110,E.n+' · PROCURE OS BAÚS')},300)}}
{const _hs=hyStg;hyStg=function(k){const r=_hs.apply(this,arguments);try{if(k==='hy1')stageLoad('hx1');if(k==='hy2')stageLoad('hx2')}catch(e){}return r}}
{const _rg=rkBossGo;rkBossGo=function(){const r=_rg.apply(this,arguments);if(HY.on)try{stageLoad('hx1')}catch(e){}return r}}
{const _e=hyEnd;hyEnd=function(){hyBtn(0);HY.ex=0;return _e.apply(this,arguments)}}
/* ================= v360: HIDRA LIBERADA PARA TODOS + NINHADAS DE FILHOTES =================
   Cada vez que a Hidra cai ela SOME e solta uma ninhada de filhotes (mini bosses pequenos). Matou todos: ela VOLTA mais forte.
   7 ninhadas (HYMAX=8 níveis). Códigos novos: 80.000 💎 (1 pessoa) e 3.000–6.000 💎 (1 vez por conta). */
const HYFN=[3,4,4,5,5,6,7];
{const _hs2=hySetup;hySetup=function(f,kind,lv){if(kind!=='filhote')return _hs2.apply(this,arguments);
  _hs2.call(this,f,'hidra',lv);const S=HYS.hidra[lv-1];f.hyK='filhote';f.bSc=.42;f.bsp=1.45;f.bFil='';f.bR=HYR;
  try{const T=hyTinted(HYR,'hue-rotate(55deg) saturate(1.35) brightness(1.1)');if(T)f.bR=T}catch(e){}
  f.def=Object.assign({},f.def,{id:'hidra',name:'FILHOTE DA HIDRA',cn:'NINHADA '+lv+' DE '+(HYMAX-1)});f.hyAtk=S.atk*.45;f.hyDef=S.def*.5;f.mhp=(1.3+lv*.25)*LAYER;f.bCdm=.8;
  f.tdm=Math.pow(f.hyAtk/150,.3);f.bDf=1/(1+f.hyDef/900);f.tdf=f.bDf;f.tcr=8;f.hp=f.hpLag=f.mhp;f.ko=false}}
function hyFilMk(x){const p=G.p[0],m=hyMk('filhote',clamp(x,100,WW-100),HY.fil.lv);m.facing=m.x<p.x?1:-1;m.inv=30;try{ring(m.x,m.y-60,'#9dff6a',110,14,5);dust(m.x,FLOOR,10)}catch(e){}return m}
function hyFilCap(){return HY.fil&&HY.fil.lv>=4?4:3}
hyBossUp=function(a,d){HY.busy=1;const lv=HY.lv;banner('HIDRA NÍVEL '+lv+' DERROTADA!','#ffd84a',80,lv%2===0?'🎁 BAÚ NO CHÃO · ELA ESTÁ SUMINDO...':'ELA ESTÁ SUMINDO...');
  if(lv%2===0)hyChest(2+lv,clamp(d.x+(d.x<G.p[0].x?-120:120),160,WW-160));
  d.hp=1;d.inv=99999;bsSet(d,'hurt');d.state='down';d.downT=0;G.slow=40;G.flash=10;G.flashCol='#c050ff';G.shake=26;
  for(const m of HY.mobs){m.ko=true;HY.dead.push(m)}HY.mobs=[];
  setTimeout(()=>{if(!HY.on)return;const bx=d.x;HY.boss=d;d.hyRev=1;const N=HYFN[lv-1]||5;HY.fil={left:N,tot:N,lv,t:40,k:0};
    try{SFX.boom();for(const r of [380,240,120])ring(bx,FLOOR-150,r===120?'#ffffff':'#9dff6a',r,24,8);dust(bx,FLOOR,30)}catch(e){}G.flash=12;G.flashCol='#9dff6a';G.shake=22;
    const off=[0,-280,280,-440];G.p[1]=hyFilMk(bx);HY.fil.left--;for(let i=1;i<Math.min(hyFilCap(),N);i++){HY.mobs.push(hyFilMk(bx+off[i]));HY.fil.left--}
    banner('A HIDRA SUMIU!','#ff4dff',130,'MATE OS '+N+' FILHOTES · NINHADA '+lv+' DE '+(HYMAX-1));HY.busy=0},1500)};
function hyFilBack(){const b=HY.boss,p=G.p[0];HY.busy=1;HY.fil=null;if(!b){HY.busy=0;return}G.p[1]=b;b.hyIdle=1;b.inv=99999;b.hp=1;b.ko=false;b.def=Object.assign({},b.def,{name:'🐉 A HIDRA ESTÁ VOLTANDO...'});
  banner('NINHADA DESTRUÍDA!','#7dff9a',90,'A HIDRA ESTÁ VOLTANDO...');G.shake=14;
  setTimeout(()=>{if(!HY.on)return;const lv=HY.lv+1;HY.lv=lv;try{hyStg(HYK[Math.min(6,2+lv-1)])}catch(e){}const dir=HY.dir||(p.x<WW/2?1:-1),x=clamp(p.x+dir*460,140,WW-140);
    hySetup(b,'hidra',lv);b.hyIdle=0;b.hyRev=0;b.x=x;b.y=FLOOR;b.vx=0;b.vy=0;b.grounded=true;b.inv=40;b.state='idle';b.bs='idle';b.bt=0;b.ko=false;b.bEye=70;b.facing=b.x<p.x?1:-1;HY.boss=null;
    hyDrop('cura',x+(x<p.x?160:-160));G.flash=14;G.flashCol='#ffffff';G.shake=30;try{SFX.boom();for(const r of [420,280,150])ring(x,FLOOR-150,r===150?'#ffffff':'#c050ff',r,26,8)}catch(e){}
    banner('A HIDRA VOLTOU!','#ff4dff',130,'NÍVEL '+lv+' DE '+HYMAX+' · MAIS FORTE');HY.busy=0},1400)}
{const _ko3=ko;ko=function(a,d){if(!(HY.on&&HY.fil&&G.p&&d&&d!==G.p[0]&&d!==HY.boss&&(d===G.p[1]||HY.mobs.includes(d))))return _ko3.apply(this,arguments);
  if(d.ko)return;d.ko=true;d.hp=0;d.vy=-8;d.vx=(a&&a.facing||1)*6;d.grounded=false;HY.dead.push(d);HY.mobs=HY.mobs.filter(m=>m!==d);HY.fil.k++;
  if(Math.random()<.18)hyDrop('cura',d.x);try{txt(d.x,d.y-150,HY.fil.k+'/'+HY.fil.tot,'#9dff6a')}catch(e){}
  if(d===G.p[1]){const nx=HY.mobs.find(m=>!m.ko),p=G.p[0];if(nx){HY.mobs=HY.mobs.filter(m=>m!==nx);G.p[1]=nx}else if(HY.fil.left>0){HY.fil.left--;G.p[1]=hyFilMk(p.x+(p.x<WW/2?520:-520))}else hyFilBack()}}}
function hyFilTick(){if(!HY.on||!HY.fil||HY.busy||!G.p||G.mode!=='fight'||G.phase!=='fight'||G.paused)return;const F=HY.fil,p=G.p[0];
  const alive=HY.mobs.filter(m=>!m.ko).length+(G.p[1]&&!G.p[1].ko?1:0);if(alive<hyFilCap()&&F.left>0&&--F.t<=0){const side=Math.random()<.5?-1:1;let x=p.x+side*(480+Math.random()*180);if(x<120||x>WW-120)x=p.x-side*(480+Math.random()*180);HY.mobs.push(hyFilMk(x));F.left--;F.t=55}}
{const _u3=update;update=function(){_u3.apply(this,arguments);try{hyFilTick()}catch(e){}}}
{const _e2=hyEnd;hyEnd=function(){HY.fil=null;HY.boss=null;return _e2.apply(this,arguments)}}
/* códigos v360 */
{const _cp9=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];const r=await _cp9.apply(this,arguments);
  if(C&&C.gm&&r&&E&&/ok/.test(E.className||'')){rkAdd('gem',C.gm);try{acSave(1)}catch(e){}E.textContent='💎 '+C.nm+'! Você ganhou +'+rkFmtN(C.gm)+' 💎';try{setTimeout(()=>twSfx('boom'),300)}catch(e){}}return r}}
TWCUP['l0xbdi']={nm:'TESOURO DE 80.000 DIAMANTES',it:[],gm:80000};
TWCUP['c4riff']={nm:'DIAMANTES DA SORTE',acc:1,rnd:[3000,6000]};
TWCUP['kzru11']={nm:'TORRE NOVA',acc:1,rnd:[1000,1000]};
TWCUP['1kxa24y']={nm:'DOBRO DE XP',acc:1,rnd:[1000,4000]}; /* v382: 1.000 a 4.000 gemas, 1 vez por conta */ /* v380: código da atualização da torre (1 vez por conta) */
/* v361: código único 30.000 💎 + 20.000 moedas de ouro + 1 equipamento aleatório do Shaka de Virgem (campos mo e rsk) */
{const _cp10=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];const r=await _cp10.apply(this,arguments);
  if(C&&(C.mo||C.rsk)&&r&&E&&/ok/.test(E.className||'')){let nm='';if(C.mo)twAddCoins(C.mo);
    if(C.rsk){const K=Object.keys(RKSP).filter(k=>RKSP[k].sk),k=K[(Math.random()*K.length)|0];rkGiveSp(k);nm=RKSP[k].nm;TWCUP._sp=nm}try{acSave(1)}catch(e){}
    E.textContent='🎁 '+C.nm+'! +'+rkFmtN(C.gm||0)+' 💎 · +'+rkFmtN(C.mo||0)+' 🪙 moedas de ouro'+(nm?' · ✦ '+nm+' (na 🎒 MOCHILA)':'');try{twSfx('boom')}catch(e){}}return r}}
TWCUP['mc90e4']={nm:'PRESENTE DO SHAKA',it:[],gm:30000,mo:20000,rsk:1};
/* v362: DEVOLUÇÃO para TODOS (gasto de gemas nos anéis): +5.000 💎 e +100.000 moedas de ouro, automático, 1 vez (marca rk_gf362 vai junto na conta) */
function gfDev(){if(rkG('gf362',0))return;rkS('gf362',1);rkAdd('gem',5000);twAddCoins(100000);try{acSave(1)}catch(e){}
  const show=()=>{if(document.getElementById('lvrzM'))return setTimeout(show,1500);const M=document.createElement('div');M.id='lvrzM';
    M.innerHTML=`<div class="twM gold"><h3>🎁 DEVOLUÇÃO PARA TODOS!</h3><p class="twH">Os anéis gastaram gemas demais para upar. Como pedido de desculpas, todo mundo recebeu:</p><p class="twH" style="font-size:1.25em"><b>💎 +5.000 gemas</b> · <b>🪙 +100.000 moedas de ouro</b></p><p class="twH">Já está na sua conta. Bom jogo! — Denilson ADM</p><div class="row"><button class="btn main" id="gfOk">PEGAR</button></div></div>`;
    document.body.appendChild(M);try{rkSfx('powerUp')}catch(e){}M.querySelector('#gfOk').onclick=()=>{M.remove();try{rkView(RKV)}catch(e){}}};setTimeout(show,1200)}
/* v385: devolução do v362 ENCERRADA a pedido do dono — quem entra agora não ganha mais os 5.000 💎 + 100.000 moedas */
/* v363: revelação especial quando sai DIVINA ou PRIMORDIAL */
{const _pa=psAnim;psAnim=function(r,cb){return _pa.call(this,r,function(){const x=cb.apply(this,arguments);try{if(psRI(r)>=6){const O=document.createElement('div');O.className='psRev psr_'+r;
  O.innerHTML=`<i></i><b>${r==='pri'?'✴ PASSIVA PRIMORDIAL ✴':'☀ PASSIVA DIVINA ☀'}</b><small>${r==='pri'?'ACIMA DOS DEUSES':'ACIMA DA SECRETA'}</small>`;document.body.appendChild(O);try{SFX.boom();setTimeout(()=>SFX.boom(),350)}catch(e){}setTimeout(()=>O.remove(),2600)}}catch(e){}return x})}}
/* ================= v364: MERCADO NEGRO vende JOIAS NEGRAS (giros de passiva) em QUANTIDADE e ANÉIS DA ALMA (inclusive o vermelho) =================
   jn: {k:'jn',n} (anúncio antigo sem n = 1). anel: {k:'an',r:{c,g,s,v,l,a}} — sai da lista do vendedor (e do personagem, se estava equipado). */
MN.q=1;
const mnRK=r=>[r.c,r.g,r.s,anLvl(r),r.a||0].join('|');
{const _v=mnView;mnView=function(o){if(!o)return null;
  if(o.k==='jn'){const n=Math.max(1,o.n|0);return {img:RQA.jn,nm:'JOIA NEGRA'+(n>1?' x'+rkFmtN(n):''),c:'#c46bff',r:'sec',ef:n>1?rkFmtN(n)+' giros de PASSIVA (1 joia = 1 giro)':'Usada para girar PASSIVAS (1 joia = 1 giro)',x:null,n}}
  if(o.k==='an'){const r=o.r;if(!r||!ANC[r.c])return null;return {img:RQA.anel2[r.c],nm:'ANEL '+ANC[r.c][0],c:ANC[r.c][1],r:null,ef:anAge(r)+' · Nota '+ANG[r.g]+' · Nível '+anLvl(r)+'/'+ANMX[r.c]+' · '+anTxt(r),x:null,an:1}}
  if(o.k!=='poc'&&!o.it)return null;return _v.apply(this,arguments)}}
{const _c=mnClean;mnClean=function(o){if(!o||typeof o!=='object')return null;const N=(v,a,b)=>Math.max(a,Math.min(b,Math.round(+v||0)));
  if(o.k==='jn')return {k:'jn',n:N(o.n||1,1,99999)};
  if(o.k==='an'){const r=o.r;if(!r||!(r.c>=0&&r.c<ANC.length)||!(r.g>=0&&r.g<ANG.length)||!ANS.some(x=>x[0]===r.s))return null;
    return {k:'an',r:{c:r.c|0,g:r.g|0,s:r.s,v:ANV[r.c|0][r.g|0],l:N(r.l||1,1,ANMX[r.c|0]),a:N(r.a||0,0,500000)}}}
  return _c.apply(this,arguments)}}
{const _g=mnGive;mnGive=function(o){const c=mnClean(o);if(c&&c.k==='jn'){psAddJn(c.n);return true}
  if(c&&c.k==='an'){anGive(Object.assign({i:Date.now().toString(36)+Math.random().toString(36).slice(2,6)},c.r));return true}return _g.apply(this,arguments)}}
{const _m=mnMine;mnMine=function(){const L=_m.apply(this,arguments),seen=new Map();
  for(const r of anL().slice().sort((a,b)=>b.c-a.c||b.g-a.g||anLvl(b)-anLvl(a))){const k='a|'+mnRK(r);if(seen.has(k)){const e=seen.get(k);e.n++;e.ids.push(r.i);continue}
    const e={key:k,k:'an',ids:[r.i],n:1,v:mnView({k:'an',r})};seen.set(k,e);L.push(e)}return L}}
{const _h=mnH;mnH=function(){let h=_h.apply(this,arguments);try{if(MN.tab!=='sell')return h;const X=mnRows().find(r=>r.key===MN.sel);if(!X)return h;
  if(X.e.k==='jn'){MN.q=Math.max(1,Math.min(X.n,MN.q|0||1));
    h=h.replace('<button data-m="list">ANUNCIAR 1</button>','<button data-m="list">ANUNCIAR</button>').replace('placeholder="preço"','placeholder="preço total"');
    h=h.replace('<div class="mnBtn"','<div class="mnQ" style="'+rkB2(1318,668,1634,716)+'"><span>QTD</span><button data-m="q" data-d="-10">-10</button><button data-m="q" data-d="-1">−</button><input id="mnQ" type="number" min="1" max="'+X.n+'" value="'+MN.q+'" inputmode="numeric"><button data-m="q" data-d="1">+</button><button data-m="q" data-d="10">+10</button><button data-m="q" data-d="max">MÁX</button></div><div class="mnBtn"')}
  else if(X.e.k==='an'){const w=X.e.ids.map(i=>anL().find(r=>r.i===i)).find(r=>r&&!anWho(r));if(!w)h=h.replace('<em>Você tem','<em class="st st_cx">Equipado: ao anunciar, sai do personagem</em><em>Você tem')}}catch(e){}return h}}
{const _a=mnAct;mnAct=async function(a,b){
  if(a==='q'){const X=mnRows().find(r=>r.key===MN.sel);if(!X)return;const I=$('mnQ');let q=Math.round(+(I&&I.value)||MN.q||1);const d=b.dataset.d;q=d==='max'?X.n:q+(+d);MN.q=Math.max(1,Math.min(X.n,q));if(I)I.value=MN.q;rkSfx('whoosh');return}
  if(a==='sel')MN.q=1;
  if(a!=='list'||MN.tab!=='sell')return _a.apply(this,arguments);const X=mnRows().find(r=>r.key===MN.sel);if(!X||(X.e.k!=='jn'&&X.e.k!=='an'))return _a.apply(this,arguments);
  if(MN.busy)return;const pr=Math.round(+(($('mnPr')||{}).value||0));if(!(pr>=1&&pr<=999999)){rkSfx('clang');rkToast('Coloque um preço de 1 a 999.999 💎','#ff8080');return}
  MN.busy=1;let o;try{
    if(X.e.k==='jn'){const g=psG(),q=Math.max(1,Math.min(g.jn|0,Math.round(+(($('mnQ')||{}).value)||MN.q||1)));if((g.jn|0)<1)return;g.jn-=q;psS(g);o={k:'jn',n:q}}
    else{const L=anL(),r=X.e.ids.map(i=>L.find(z=>z.i===i)).filter(Boolean).sort((x,y)=>(anWho(x)?1:0)-(anWho(y)?1:0))[0];if(!r)return;const A=anEqAll();for(const id in A)A[id]=(A[id]||[]).map(i=>i===r.i?null:i);rkS('anEq',A);rkS('an',L.filter(z=>z.i!==r.i));o={k:'an',r:{c:r.c,g:r.g,s:r.s,v:r.v,l:anLvl(r),a:r.a||0}}}
    const lid=mnKey()+'_'+Date.now().toString(36);let ok=false;try{const r=await mnPost('mk_'+lid,{mk:mnSV('1'),mkv:mnSV(mnKey()),lid:mnSV(lid),it:mnSV(JSON.stringify(o)),preco:mnIV(pr)});ok=r.ok}catch(x){}
    if(!ok){mnGive(o);rkSfx('clang');rkToast('Não deu para anunciar (sem internet?). Voltou para você.','#ff8080');return rkView('mn')}
    try{acSave(1)}catch(x){}rkSfx('powerUp');rkToast('🏷️ '+mnView(o).nm+' anunciado por '+rkFmtN(pr)+' 💎!','#7dff9a');MN.sel=null;MN.q=1}finally{MN.busy=0}return mnLoad()}}
/* ================= v365: EVENTO SAINT SEIYA — músicas do lobby =================
   No lobby (tela do Ranqueado, fora da luta, inclusive no giro do Shaka) tocam SÓ as 3 músicas do evento, nas partes mais fortes
   (cortes com fade: Lost Canvas inteira, Pelo Mundo 0:28–2:16, Laços de Flor 3:06–4:04 até o fim, v366). Quando uma acaba entra a próxima. Não dá para trocar.
   As músicas completas estão no MUS (18, 19, 20): rádio do Ranqueado e música da luta. EVMUS=0 desliga o evento. */
const EVMUS=1,EVMS=[[18,'a/636a17e61ad5f8.mp3','LOST CANVAS – ABERTURA'],[19,'a/bdf54fec7a8981.mp3','PELO MUNDO'],[20,'a/1e36ad6d822ca1.mp3','LAÇOS DE FLOR']];let EVMI=-1;
function evMusOn(){return EVMUS&&showScreen.cur==='ranked'&&G.mode!=='fight'}
function evMusPlay(next){if(!EVMUS||!MUS[EVMS[0][0]])return;const i=next&&EVMI>=0?(EVMI+1)%EVMS.length:EVMI>=0?EVMI:(Math.random()*EVMS.length)|0;const nw=i!==EVMI||!MEL.src.endsWith(EVMS[i][1]);EVMI=i;
  const [mi,src,nm]=EVMS[i];MCUR=mi;MEL.loop=false;if(nw){MEL.src=src;try{MEL.currentTime=0}catch(e){}try{rkToast('🎶 EVENTO SAINT SEIYA · '+nm,'#ffd84a')}catch(e){}}
  if(AU.on&&!document.hidden){const p=MEL.play();if(p&&p.catch)p.catch(()=>{})}}
MEL.addEventListener('ended',()=>{if(EVMI>=0&&evMusOn())evMusPlay(1)});
{const _o=rkOpen;rkOpen=function(){const r=_o.apply(this,arguments);try{if(EVMUS)evMusPlay()}catch(e){}return r}}
/* luta: volta ao normal (música em loop escolhida na rádio / aleatória) */
{const _mp=musPick;musPick=function(){MEL.loop=true;if(EVMI>=0){EVMI=-1;MCUR=-1;try{MEL.pause();MEL.removeAttribute('src')}catch(e){}}if(G.gmode!=='torre'&&rkG('mus','auto')!=='auto')return rkMusPlay();return _mp.apply(this,arguments)}}
/* rádio: no lobby continua o evento; a escolha vale para as LUTAS */
{const _rm=rkMusic;rkMusic=function(){const r=_rm.apply(this,arguments);if(!EVMUS)return r;try{const M=document.querySelector(RKMS()+'.rkMu');if(M){M.insertAdjacentHTML('beforebegin','<p class="twH evMuN">🎶 <b>EVENTO SAINT SEIYA</b>: no lobby tocam só as 3 músicas do evento. A música que você escolher aqui toca nas suas <b>LUTAS</b>.</p>');
  M.querySelectorAll('button').forEach(b=>b.onclick=()=>{rkS('mus',b.dataset.m);rkSfx('whoosh');rkMusic()})}}catch(e){}return r}}
/* ================= v368: PERFIL NOVO (artes do dono) + BATALHAS + ÁLBUM DE CARTAS + COLEÇÃO =================
   Artes 1847×851 (ferramentas/ranqueada_artes/perfil_v368). Coordenadas em pixels da arte com rkB3.
   Registro de lutas: rk_bt (últimas 120) e rk_btc (contadores; começa com os números antigos do Boss+Torre). */
const P3A={pf:'a/4ccadcfbf82270.webp',al:'a/a2419864b10f52.webp',co:'a/e7c2d8ba316c82.webp',bt:'a/e9aba664acd0fc.webp'};
const rkB3=(x0,y0,x1,y1)=>`left:${x0/18.47}%;top:${y0/8.51}%;width:${(x1-x0)/18.47}%;height:${(y1-y0)/8.51}%`;
const p3X=x=>x*1672/1847,p3Y=y=>y*941/851;
/* ---------- registro de lutas ---------- */
const BTM={pvp:['PVP','⚔️'],boss:['BOSS','👹'],dsf:['DESAFIO','🔥'],pve:['VERSUS','🥊'],torre:['TORRE','🏰'],caca:['CAÇA','🐺'],hidra:['HIDRA','🐉']};
const BTF={todas:null,pvp:['pvp'],pve:['boss','dsf','pve'],torre:['torre'],caca:['caca','hidra']};
function btC(){const c=Object.assign({pt:0,w:0,l:0,pf:0,sq:0,bs:0,m:{},ch:{}},rkG('btc',{}));
  if(!c.b0){try{const S=rkSt(),o=pfD();c.pt=rkPl(S)+(o.twf||0)+(o.twl||0);c.w=(S.wins||0)+(o.twf||0);c.l=Math.max(0,c.pt-c.w)}catch(e){}c.b0=1;rkS('btc',c)}return c}
function btRec(m,w,x){try{x=x||{};if(G._btT&&Date.now()-G._btT<4000)return;G._btT=Date.now();const p=G.p&&G.p[0],o=G.p&&G.p[1];if(!p||!p.def)return;
  const e={m,w:w?1:0,c:p.def.id,o:x.o||(o&&o.def&&o.def.id)||'',on:String(x.on||(o&&o.def&&o.def.name)||'?').slice(0,24),pf:w&&p.hp>=(p.mhp||MAXHP)?1:0,d:Date.now(),x:String(x.x||'').slice(0,30)};
  const L=rkG('bt',[]);L.unshift(e);rkS('bt',L.slice(0,120));const c=btC();c.pt++;if(e.w){c.w++;c.sq++;c.bs=Math.max(c.bs,c.sq)}else{c.l++;c.sq=0}if(e.pf)c.pf++;
  c.m[m]=(c.m[m]||0)+1;if(e.c)c.ch[e.c]=(c.ch[e.c]||0)+1;rkS('btc',c)}catch(err){}}
{const _f=rkAfter;rkAfter=function(w){btRec('boss',w===0);return _f.apply(this,arguments)}}
{const _f=twAfter;twAfter=function(w){btRec('torre',w===0,{x:'ANDAR '+((TW.fl|0)+1)});return _f.apply(this,arguments)}}
{const _f=caEnd;caEnd=function(w){const o=G.p&&G.p[1],lv=(o&&o.bLv)||1;btRec('caca',!!(o&&o.ko&&lv>=10),{o:'lobo',on:'LOBO',x:'NÍVEL '+lv});return _f.apply(this,arguments)}}
{const _f=pvEnd;pvEnd=function(w){const F=PV.fight;if(F)btRec('pvp',w===0,{on:(F.opp&&F.opp.nome||'SOMBRA')+(F.friendly?' (amistoso)':''),x:F.friendly?'AMISTOSO':'RANQUEADA'});return _f.apply(this,arguments)}}
{const _f=dsfEnd;dsfEnd=function(w){btRec('dsf',w===0);return _f.apply(this,arguments)}}
{const _f=hyEnd;hyEnd=function(won){btRec('hidra',!!won,{o:'hidra',on:'HIDRA',x:'NÍVEL '+(HY.lv||1)});return _f.apply(this,arguments)}}
{const _f=showResult;showResult=function(){if(G.gmode!=='treino'&&!(G.gmode==='torre'&&TW.on))btRec(G.gmode==='torre'?'torre':'pve',G.wins&&G.wins[0]>=2);return _f.apply(this,arguments)}}
/* ---------- números do jogador ---------- */
function p3Lv(c){c=c||btC();const xp=c.w*30+Math.max(0,c.pt-c.w)*12+c.pf*10,lv=Math.min(99,Math.floor(Math.sqrt(xp/25))+1),a=(lv-1)*(lv-1)*25,b=lv*lv*25;return {lv,f:lv>=99?1:Math.max(0,Math.min(1,(xp-a)/(b-a)))}}
function p3Id(uid,nome){if(nome&&String(nome).toLowerCase()===String(TWADMN).toLowerCase())return '10000001';const h=parseInt(String(twHash(String(uid||'?'))).slice(0,7),36)||7;return String(10000002+h%89999990)}
function p3Top(c){const M=(c||btC()).ch||{};return Object.keys(M).filter(id=>CH[id]).sort((a,b)=>M[b]-M[a]).slice(0,3)}
const p3Port=id=>(CRT.chr&&CRT.chr[id])||pvPortrait(id);
function p3Fotos(){const F=rkG('pft',[]);return [0,1,2].map(i=>typeof F[i]==='string'?F[i]:'')}
{const _m=pfMine;pfMine=function(){const D=_m.apply(this,arguments);try{const c=btC(),P=pvG();D.lv=p3Lv(c).lv;D.bc={pt:c.pt,w:c.w,pf:c.pf};D.top=p3Top(c);D.ft=p3Fotos();D.pvt=P.t|0;D.pvbt=Math.max(P.t|0,P.bt|0)}catch(e){}return D}}
{const _c=pfClean;pfClean=function(o,uid,nome){const r=_c.apply(this,arguments);if(!r||!o)return r;const N=(v,mx)=>Math.max(0,Math.min(mx||1e9,+v||0))|0;
  r.lv=N(o.lv,99);r.bc=o.bc&&typeof o.bc==='object'?{pt:N(o.bc.pt),w:N(o.bc.w),pf:N(o.bc.pf)}:null;r.top=(Array.isArray(o.top)?o.top:[]).filter(id=>CH[id]).slice(0,3);
  r.ft=(Array.isArray(o.ft)?o.ft:[]).slice(0,3).map(s=>typeof s==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(s)&&s.length<60000?s:'');r.pvt=Math.min(PVT.length-1,N(o.pvt));r.pvbt=Math.min(PVT.length-1,N(o.pvbt));return r}}
/* ---------- curtidas e visitas (servidor) ---------- */
const P3S={};
function p3Post(f){const IV=v=>({integerValue:String(v)}),F={nome:{stringValue:String(twLS.g('tw_nome','')||'?').slice(0,16)},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()}};
  for(const k in f)F[k]={stringValue:String(f[k])};return twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:F})}).catch(()=>{})}
async function p3Soc(uid,force){const C=P3S[uid];if(C&&!force&&Date.now()-C.t<180e3)return C;const o={t:Date.now(),lk:0,lkMe:0,vis:0,uv:0,rec:[]};
  try{const L=await rkQ('lkt',uid,500),U=new Set(L.map(e=>e.uid));o.lk=U.size;o.lkMe=U.has(twUid())?1:0}catch(e){}
  try{const V=(await rkQ('vst',uid,500)).filter(e=>e.uid!==uid).sort((a,b)=>b._ct-a._ct),U=new Set();o.vis=V.length;for(const e of V){if(U.has(e.uid))continue;U.add(e.uid);if(o.rec.length<3)o.rec.push({uid:e.uid,nome:e.nome,ft:/^data:image\/jpeg;base64,/.test(e.ft||'')?e.ft:''})}o.uv=U.size}catch(e){}
  try{if(rkG('lks',{})[uid])o.lkMe=1}catch(e){}P3S[uid]=o;return o}
function p3Thumb(){return new Promise(res=>{const f=rkG('foto','');if(!f)return res('');const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=64;c.getContext('2d').drawImage(im,0,0,64,64);res(c.toDataURL('image/jpeg',.7))};im.onerror=()=>res('');im.src=f})}
async function p3Visit(uid){if(!uid||uid===twUid()||!twLS.g('tw_nome',''))return;const V=rkG('vsd',{}),d=new Date().toISOString().slice(0,10);if(V[uid]===d)return;V[uid]=d;rkS('vsd',V);p3Post({vst:uid,ft:await p3Thumb()})}
{const _o=pfOpenOther;pfOpenOther=async function(uid){const r=await _o.apply(this,arguments);try{p3Visit(uid)}catch(e){}return r}}
/* Top 1 de um personagem = quem está mais alto no PVP (rank, divisão, estrelas) entre os que usam aquele personagem */
async function p3Top1(nome){try{const A=await pvLoadAll(),B={};for(const e of A){const id=e.ch;if(!CH[id])continue;const k=(e.t|0)*1e6+(e.dv|0)*1e3+(e.st|0);if(!B[id]||k>B[id].k)B[id]={k,n:String(e.nome||'').toLowerCase()}}
  return Object.keys(B).filter(id=>B[id].n&&B[id].n===String(nome||'').toLowerCase()&&B[id].k>0)}catch(e){return []}}
/* ---------- menu lateral (igual nas 4 artes) ---------- */
function p3Side(){return [['pf',110,190],['hs',192,258],['p3al',262,326],['p3co',330,396],['p3bt',400,466],['p3st',470,536],['p3so',540,606],['conta',608,672]].map(([a,y0,y1])=>`<button class="hs" data-a="${a}" style="${rkB3(20,y0,252,y1)}"></button>`).join('')+`<button class="hs" data-a="back" style="${rkB3(40,0,232,86)}"></button>`}
/* ---------- PERFIL ---------- */
/* v370: medalhas do perfil = rank do MODO BOSS (Ranqueado), com os efeitos do rank */
function p3Rk(i,st){i=Math.max(0,Math.min(RKTOP,i|0));return `<div class="p3RkB" style="${st}">${pfRkH(i,'')}<em style="color:${RKR[i].c}">${RKR[i].n}</em></div>`}
/* placa do título (modelo da referência do dono; quando ele mandar as artes dos títulos, troca aqui) */
function p3Plate(t,n,adm,me){let ic='',nm='',c='#ffd84a';
  if(t==='adm'&&adm){ic='👑';nm='Administrador'}else if(TWTIT[t]){const T=TWTIT[t];ic=T.rk!=null?`<img src="${RQA.rank[T.rk]}" alt="">`:T.i;nm=T.n;c=T.c||c}
  if(!nm)return me?'<span class="p3Pl none"><b>SEM TÍTULO · toque para escolher</b></span>':'<span class="p3Pl none"><b>SEM TÍTULO</b></span>';
  return `<span class="p3Pl${t==='adm'?' adm':''}" style="--c:${c}"><i class="w l"></i><b><em>${ic}</em>${twEsc(nm)}<s></s></b><i class="w r"></i></span>`}
RKD.pf=[1847,851];
pfH=function(){const D=pfCur(),me=!PFO,n=D.nome||'',adm=!!n&&n.toLowerCase()===String(TWADMN).toLowerCase(),ped=CH[D.ped]?D.ped:'goku',foto=PFO&&PFO.fh?'':D.foto;
  const c=me?btC():null,bc=me?{pt:c.pt,w:c.w,pf:c.pf}:(D.bc||(D.h?{pt:D.h.pt,w:D.h.vw,pf:0}:null)),lv=me?p3Lv(c):D.bc?p3Lv({w:D.bc.w,pt:D.bc.pt,pf:D.bc.pf}):{lv:D.lv||1,f:0},tx=bc&&bc.pt?(bc.w/bc.pt*100):0,P=me?pvG():null,pt=me?P.t|0:D.pvt|0,pb=me?Math.max(P.t|0,P.bt|0):Math.max(D.pvt|0,D.pvbt|0);
  const own=me?rkG('own',['goku']).filter(id=>CH[id]).length:(D.h?D.h.own:0),top=me?p3Top(c):(D.top||[]),FT=me?p3Fotos():(D.ft||[]),uid=me?twUid():D.uid,S=P3S[uid]||null;
  const tops=top.length?top:[ped];const N=v=>v==null?'—':rkFmtN(v);
  const md=D.mold?mdH(D.mold,p3X(296),p3Y(104),p3X(461),p3Y(269),p3Y(330)):'';
  const med=(t,b)=>`<div class="p3Md" style="${b};--c:${PVT[t][1]}"><i class="g"></i><img src="${PVA.e[PVT[t][3]]}" alt=""><em>${PVT[t][0]}</em></div>`;
  return `${p3Side()}
  <div class="p3Bk" style="${rkB3(430,0,1240,330)}"><img src="${fullSrc(ped)}" alt=""></div>
  <button class="hs p3Cfg" data-a="mn2Cfg" style="${rkB3(1650,15,1830,68)}"></button>
  ${me?'':`<div class="pfOth p3Oth" style="${rkB3(470,8,1100,58)}">👀 PERFIL DE <b>${twEsc(n||'?')}</b>${PFO.old?'<small>ainda não atualizou o jogo</small>':''}</div>`}
  ${md}<button class="pfFoto p3Ft${me?'':' ro'}" data-a="pfFoto" style="${rkB3(304,112,453,261)}">${foto?`<img src="${foto}" alt="">`:me?`<span><i>📷</i>FOTO</span>`:`<span class="h"><i>👤</i></span>`}</button>
  ${adm?`<div class="p3Adm" style="${rkB3(338,246,420,276)}">ADM</div>`:''}
  <div class="p3Nm${adm?' adm':''}" style="${rkB3(490,96,880,148)}"><b>${n?twEsc(n):'<i>SEM NOME</i>'}</b>${me?'<button class="p3Ed" data-a="p3nm" title="Trocar nome">✎</button>':''}</div>
  <div class="p3Id" style="${rkB3(495,152,880,188)}">ID: <b>${p3Id(uid,n)}</b><button class="p3Cp" data-a="p3id" data-v="${p3Id(uid,n)}" title="Copiar">⧉</button></div>
  <div class="p3Lv" style="${rkB3(495,192,880,228)}">Nv. <b>${lv.lv}</b><i><s style="width:${(lv.f*100).toFixed(1)}%"></s></i></div>
  <button class="p3So lk${S&&S.lkMe?' on':''}" data-a="p3lk" style="${rkB3(860,130,962,232)}"><em id="p3Lk">${S?N(S.lk):'…'}</em></button>
  <button class="p3So" data-a="p3pop" style="${rkB3(964,130,1062,232)}"><em id="p3Pop">${S?N(S.lk*10+S.vis):'…'}</em></button>
  <button class="p3So" data-a="p3uv" style="${rkB3(1064,130,1166,232)}"><em id="p3Uv">${S?N(S.uv):'…'}</em></button>
  <button class="p3Ti${me?'':' ro'}" data-a="pfTit" style="${rkB3(494,232,900,280)}">${p3Plate(D.tit,n,adm,me)}</button>
  ${me?`<button class="p3Ed2" data-a="pfTit" style="${rkB3(1122,234,1168,276)}" title="Trocar título">✎</button>`:''}
  <div class="p3T1" id="p3T1" style="${rkB3(500,290,1165,316)}"></div>
  ${p3Rk(rkRank(D.rp),rkB3(386,378,506,470))}${p3Rk(Math.max(rkRank(D.rp),D.mx|0),rkB3(691,378,811,470))}
  <div class="p3Nb" style="${rkB3(352,500,515,552)}">${bc?N(bc.pt):'—'}</div><div class="p3Nb" style="${rkB3(590,500,744,552)}">${bc?tx.toFixed(1).replace('.',',')+'%':'—'}</div>
  <div class="p3Nb" style="${rkB3(820,500,972,552)}">${N(own)}</div><div class="p3Nb" style="${rkB3(1050,500,1199,552)}" title="Vitórias PERFEITAS (sem tomar dano)">${bc?N(bc.pf):'—'}</div>
  ${tops.map((id,i)=>{const x=[375,508,641][i];return `<div class="p3He" style="${rkB3(x-52,616,x+52,720)}"><img src="${p3Port(id)}" alt=""><i>★</i><em>${CH[id].name}</em></div>`}).join('')}
  <div class="p3Vi" id="p3Vi" style="${rkB3(492,762,690,814)}">${S?S.rec.map(v=>`<span title="${twEsc(v.nome||'')}">${v.ft?`<img src="${v.ft}" alt="">`:'👤'}</span>`).join(''):''}</div>
  <div class="p3Nb sm" style="${rkB3(872,764,975,810)}">${bc?N(bc.pt):'—'}</div><div class="p3Nb sm" id="p3Lk2" style="${rkB3(1126,764,1199,810)}">${S?N(S.lk):'…'}</div>
  <button class="p3Ch${me?'':' ro'}" data-a="${me?'pfPick':''}" style="${rkB3(1300,60,1730,600)}"><img src="${fullSrc(ped)}" alt=""></button>
  ${[[1272,630,1438,782],[1459,652,1588,764],[1609,652,1738,764]].map(([x0,y0,x1,y1],i)=>`<button class="p3Ph${FT[i]?' on':''}${me?'':' ro'}" data-a="p3ph" data-i="${i}" style="${rkB3(x0,y0,x1,y1)}">${FT[i]?`<img src="${FT[i]}" alt="">`:''}</button>`).join('')}`};
pfOn=function(){clearInterval(rkView.iv);const D=pfCur(),me=!PFO,uid=me?twUid():D.uid;if(me)setTimeout(()=>pfPub(1),400);
  p3Soc(uid).then(S=>{if(RKV!=='pf'||pfCur().uid!==D.uid&&!me)return;const N=v=>rkFmtN(v),set=(id,v)=>{const e=$(id);if(e)e.textContent=v};set('p3Lk',N(S.lk));set('p3Lk2',N(S.lk));set('p3Pop',N(S.lk*10+S.vis));set('p3Uv',N(S.uv));
    const L=document.querySelector('#rkWrap .p3So.lk');if(L)L.classList.toggle('on',!!S.lkMe);const V=$('p3Vi');if(V)V.innerHTML=S.rec.map(v=>`<span title="${twEsc(v.nome||'')}">${v.ft?`<img src="${v.ft}" alt="">`:'👤'}</span>`).join('')||'<small>ninguém ainda</small>'});
  p3Top1(D.nome).then(L=>{const E=$('p3T1');if(!E||RKV!=='pf')return;E.innerHTML=(L.length?`<span class="t1">🏆 Top 1 <b>${L.map(id=>CH[id].name).join(', ')}</b> · Fúria do Templo</span>`:me?'<span class="t0">🏆 Seja o melhor do PVP com um personagem para virar Top 1</span>':'')+'<span class="cl">🛡️ Não possui Clã</span>'});
  const E=$('p3T1');if(E)E.innerHTML='<span class="cl">🛡️ Não possui Clã</span>'};
{const _v=rkView;rkView=function(v){const r=_v.apply(this,arguments);if(v==='pf'){const A=document.querySelector('#rkWrap .rk_pf');if(A)A.style.backgroundImage=`url(${P3A.pf})`}return r}}
function p3PhotoPick(i){const I=document.createElement('input');I.type='file';I.accept='image/*';I.onchange=()=>{const f=I.files&&I.files[0];if(!f)return;const u=URL.createObjectURL(f),im=new Image();
  im.onload=()=>{const m=480,s=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
    let q=.82,d=c.toDataURL('image/jpeg',q);while(d.length>30000&&q>.3){q-=.1;d=c.toDataURL('image/jpeg',q)}if(d.length>45000){const c2=document.createElement('canvas');c2.width=c.width/2;c2.height=c.height/2;c2.getContext('2d').drawImage(c,0,0,c2.width,c2.height);d=c2.toDataURL('image/jpeg',.7)}
    const F=p3Fotos();F[i]=d;rkS('pft',F);URL.revokeObjectURL(u);rkSfx('powerUp');rkToast('🖼️ Foto colocada no seu perfil!','#7dff9a');rkView('pf')};im.onerror=()=>rkToast('Não deu para abrir essa imagem','#ff8080');im.src=u};I.click()}
function p3PhotoView(i){const me=!PFO,F=me?p3Fotos():(pfCur().ft||[]),src=F[i];if(!src){if(me)p3PhotoPick(i);return}
  rkModal(`<div class="twM p3PV"><img src="${src}" alt=""><div class="row">${me?'<button class="btn" id="p3Tr">🔄 TROCAR</button><button class="btn" id="p3Rm">🗑️ TIRAR</button>':''}<button class="btn main" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);if(me){$('p3Tr').onclick=()=>{rkModal(null);p3PhotoPick(i)};$('p3Rm').onclick=()=>{const F2=p3Fotos();F2[i]='';rkS('pft',F2);rkModal(null);rkView('pf')}}}
/* ---------- BATALHAS ---------- */
const BTV={f:'todas',pg:0};
function btList(){const F=BTF[BTV.f];return rkG('bt',[]).filter(e=>!F||F.includes(e.m))}
function btOppImg(e){if(e.o==='hidra')return RQA.hidra&&RQA.hidra.por||'';if(e.o==='lobo')return RQA.lobo&&RQA.lobo.por||'';return CH[e.o]?pvPortrait(e.o):''}
const btWhen=d=>{const s=(Date.now()-d)/1000;return s<60?'agora':s<3600?Math.floor(s/60)+' min':s<86400?Math.floor(s/3600)+' h':Math.floor(s/86400)+' d'};
function btH(){const L=btList(),pages=Math.max(1,Math.ceil(L.length/5));BTV.pg=Math.min(BTV.pg,pages-1);const c=btC(),Y=[240,344,448,552,655];
  const mm=Object.entries(c.m||{}).sort((a,b)=>b[1]-a[1])[0];const tabs=[['todas',312,540],['pvp',558,758],['pve',778,978],['torre',997,1195],['caca',1215,1415]];
  return `${p3Side()}<div class="p3Tt" style="${rkB3(262,10,560,64)}">BATALHAS</div>
  ${tabs.map(([k,x0,x1])=>`<button class="p3Tab${BTV.f===k?' on':''}${k==='todas'&&BTV.f!=='todas'?' dim':''}" data-a="btF" data-f="${k}" style="${rkB3(x0,125,x1,198)}"></button>`).join('')}
  ${Y.map((y,i)=>{const e=L[BTV.pg*5+i];if(!e)return `<div class="btE" style="${rkB3(312,y+4,1412,y+82)}">${i===0&&!L.length?'Nenhuma luta registrada ainda. Jogue qualquer modo e ela aparece aqui!':''}</div>`;const M=BTM[e.m]||['?','?'],oi=btOppImg(e);
    return `<div class="btSq${e.w?' w':' l'}" style="${rkB3(342,y+3,428,y+83)}"><img src="${pvPortrait(CH[e.c]?e.c:'goku')}" alt=""></div>
    <div class="btPl" style="${rkB3(480,y+12,668,y+72)}"><i>${M[1]}</i>${M[0]}</div>
    <div class="btSq o" style="${rkB3(940,y+3,1027,y+83)}">${oi?`<img src="${oi}" alt="">`:'<b>?</b>'}</div>
    <div class="btTx" style="${rkB3(1046,y+8,1318,y+78)}"><b class="${e.w?'w':'l'}">${e.w?(e.pf?'✨ PERFEITO':'🏆 VITÓRIA'):'💀 DERROTA'}</b><span>${twEsc(e.on)}${e.x?' · '+twEsc(e.x):''}</span><small>${CH[e.c]?CH[e.c].name:''} · há ${btWhen(e.d)}</small></div>
    <button class="hs" data-a="btD" data-i="${BTV.pg*5+i}" style="${rkB3(1326,y+12,1392,y+74)}"></button>`}).join('')}
  <button class="hs" data-a="btPg" data-d="-1" style="${rkB3(632,778,746,830)}"></button><button class="hs" data-a="btPg" data-d="1" style="${rkB3(990,778,1106,830)}"></button>
  <div class="p3Dots" style="${rkB3(762,784,972,824)}">${BTV.pg+1} / ${pages}</div>
  ${[['pt',c.pt],['tx',c.pt?(c.w/c.pt*100).toFixed(1).replace('.',',')+'%':'—'],['w',c.w],['l',c.l],['sq',c.sq],['bs',c.bs]].map(([k,v],i)=>`<div class="btSv" style="${rkB3(1690,220+i*49.5,1812,266+i*49.5)}">${typeof v==='number'?rkFmtN(v):v}</div>`).join('')}
  <div class="btMm" style="${rkB3(1478,700,1812,762)}">${mm?`<b>${(BTM[mm[0]]||['?','?'])[1]} ${(BTM[mm[0]]||['?'])[0]}</b><small>${rkFmtN(mm[1])} lutas</small>`:'<small>jogue para descobrir</small>'}</div>`}
function btDet(i){const e=rkG('bt',[])[i];if(!e)return;const M=BTM[e.m]||['?','?'];const dt=new Date(e.d);
  rkModal(`<div class="twM sm btDM"><h3>${M[1]} ${M[0]} · ${e.w?(e.pf?'✨ VITÓRIA PERFEITA':'🏆 VITÓRIA'):'💀 DERROTA'}</h3><div class="btDV"><span><img src="${pvPortrait(CH[e.c]?e.c:'goku')}" alt=""><b>${CH[e.c]?CH[e.c].name:'?'}</b><small>você</small></span><em>VS</em><span>${btOppImg(e)?`<img src="${btOppImg(e)}" alt="">`:'<i>?</i>'}<b>${twEsc(e.on)}</b><small>${e.x?twEsc(e.x):M[0]}</small></span></div>
  <p class="twH">📅 ${dt.toLocaleDateString('pt-BR')} às ${dt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</p><div class="row"><button class="btn main" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
/* ---------- ÁLBUM DE CARTAS ---------- */
const ALB=[['db','DRAGON BALL',['goku','vegeta','gogeta','broly']],['nr','NARUTO',['naruto','madara']],['op','ONE PIECE',['luffy','zoro','aokiji']],['jjk','JUJUTSU KAISEN',['gojo','yuta']],
  ['ds','DEMON SLAYER',['rengoku']],['cdz','CAVALEIROS DO ZODÍACO',['shaka']],['opm','ONE PUNCH MAN',['garou']],['ex','EXCLUSIVOS · FÚRIA DO TEMPLO',['aylla','zedry','zaykon','qingqing']]].map(([k,n,L])=>({k,n,L:L.filter(id=>CH[id]&&CRT.chr&&CRT.chr[id])}));
const ALV={i:0,mode:''};const ALREW=300;
function alG(){return Object.assign({},rkG('alb',{}))}
function alA(k){const G0=alG(),a=G0[k]||{};return {nm:a.nm||'',p:Array.isArray(a.p)?a.p:[],o:Array.isArray(a.o)?a.o:null,rw:a.rw|0}}
function alSv(k,a){const G0=alG();G0[k]=a;rkS('alb',G0);try{acSave()}catch(e){}}
function alOrder(A,a){const L=A.L.slice();if(a.o){const o=a.o.filter(id=>L.includes(id));for(const id of L)if(!o.includes(id))o.push(id);return o}return L}
function alPend(A){const own=rkG('own',['goku']),a=alA(A.k);return A.L.filter(id=>own.includes(id)&&!a.p.includes(id))}
function alH(){const A=ALB[ALV.i],a=alA(A.k),O=alOrder(A,a),own=rkG('own',['goku']),pend=alPend(A),X=[[645,825],[866,1050],[1168,1348],[1373,1553],[1573,1753]],Y=[[152,386],[418,652]];
  return `${p3Side()}
  <div class="alLs" style="${rkB3(262,138,546,796)}">${ALB.map((B,i)=>{const b=alA(B.k),pd=alPend(B).length;return `<button class="alIt${i===ALV.i?' on':''}${b.p.length&&b.p.length===B.L.length?' ok':''}" data-a="alSel" data-i="${i}"><span class="ic">${B.L[0]?`<img src="${p3Port(B.L[0])}" alt="">`:'📖'}</span><span class="tx"><b>${twEsc(b.nm||B.n)}</b><small>${b.p.length}/${B.L.length} cartas${pd?` · <em>${pd} para colar</em>`:''}</small></span></button>`}).join('')}</div>
  <div class="alNm" style="${rkB3(850,40,1262,92)}">${twEsc(a.nm||A.n)}</div><button class="hs" data-a="alRen" style="${rkB3(1262,42,1312,90)}"></button>
  <div class="alCt" style="${rkB3(1588,74,1722,124)}">${a.p.length} / ${A.L.length}</div>
  ${pend.length?`<button class="alCol" data-a="alAll" style="${rkB3(1330,46,1520,92)}">📥 COLAR ${pend.length}</button>`:''}
  ${ALV.mode?`<div class="alMo" style="${rkB3(650,662,1750,700)}">${ALV.mode==='rm'?'🗑️ Toque numa carta para TIRAR do álbum':ALV.sw!=null?'⇄ Agora toque onde ela vai ficar':'⇄ Toque numa carta para TROCAR de lugar'}</div>`:''}
  ${[0,1,2,3,4,5,6,7,8,9].map(s=>{const [x0,x1]=X[s%5],[y0,y1]=Y[s/5|0],id=O[s],st=rkB3(x0+6,y0+6,x1-6,y1-6);
    if(!id)return `<div class="alSl x" style="${st}"><small>EM BREVE</small></div>`;
    if(a.p.includes(id))return `<button class="alSl c${ALV.sw===s?' sel':''}" data-a="alSlot" data-s="${s}" style="${st}"><img src="${CRT.chr[id]}" alt=""><i class="sh"></i></button>`;
    if(own.includes(id))return `<button class="alSl n" data-a="alSlot" data-s="${s}" style="${st}"><b>＋</b><em>COLAR</em><small>${CH[id].name}</small></button>`;
    return `<button class="alSl q" data-a="alSlot" data-s="${s}" style="${st}"><img src="${CRT.bk}" alt=""><b>?</b><small>${CH[id].name}</small></button>`}).join('')}
  <button class="hs" data-a="alRen" style="${rkB3(635,725,788,788)}"></button><button class="hs${ALV.mode==='rm'?' p3On':''}" data-a="alRm" style="${rkB3(820,725,972,788)}"></button>
  <button class="hs" data-a="alPg" data-d="-1" style="${rkB3(1030,725,1132,788)}"></button><button class="hs" data-a="alPg" data-d="1" style="${rkB3(1323,725,1425,788)}"></button>
  <button class="hs" data-a="alPg" data-d="-1" style="${rkB3(538,330,584,430)}"></button><button class="hs" data-a="alPg" data-d="1" style="${rkB3(1778,330,1824,430)}"></button>
  <div class="p3Dots al" style="${rkB3(1136,738,1320,778)}">${ALB.map((B,i)=>`<i class="${i===ALV.i?'on':''}"></i>`).join('')}</div>
  <button class="hs${ALV.mode==='sw'?' p3On':''}" data-a="alSw" style="${rkB3(1484,725,1667,788)}"></button>`}
function alPlace(A,id){const a=alA(A.k);if(a.p.includes(id))return;a.p.push(id);alSv(A.k,a);rkSfx('powerUp');
  if(a.p.length===A.L.length&&!a.rw){a.rw=1;alSv(A.k,a);rkAdd('gem',ALREW);try{acSave(1)}catch(e){}setTimeout(()=>{rkSfx('boom');rkToast('🏆 ÁLBUM '+A.n+' COMPLETO! +'+ALREW+' 💎','#ffd84a')},350)}else rkToast('✨ '+CH[id].name+' colado no álbum!','#7dff9a')}
function alCardView(id){rkModal(`<div class="twM sm alCV"><img src="${CRT.chr[id]}" alt=""><b>${CH[id].name}</b><div class="row"><button class="btn main" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
function alSlot(s){const A=ALB[ALV.i],a=alA(A.k),O=alOrder(A,a),id=O[s];if(!id)return;const own=rkG('own',['goku']);
  if(ALV.mode==='sw'){if(ALV.sw==null){ALV.sw=s;rkSfx('whoosh');return rkView('p3al')}const t=O[ALV.sw];O[ALV.sw]=O[s];O[s]=t;a.o=O;alSv(A.k,a);ALV.sw=null;rkSfx('powerUp');return rkView('p3al')}
  if(a.p.includes(id)){if(ALV.mode==='rm'){a.p=a.p.filter(x=>x!==id);alSv(A.k,a);rkSfx('whoosh');rkToast('Carta tirada do álbum (pode colar de novo quando quiser)','#cfd6ea');return rkView('p3al')}return alCardView(id)}
  if(own.includes(id)){alPlace(A,id);return rkView('p3al')}
  rkSfx('clang');rkToast('🔒 Você ainda não tem a carta de '+CH[id].name+'. Pegue no Gacha!','#cfd6ea')}
/* ---------- COLEÇÃO ---------- */
const COV={t:'all',c:'all',pg:0,sel:null};
function coItems(){const sv=[RKL.tab,RKL.q,RKL.f],R=[];RKL.q='';RKL.f=0;
  try{for(const tab of ['eq','it','col']){RKL.tab=tab;for(const x of rkLibItems()){const e=Object.assign({},x);const id=String(x.id);
    if(tab==='eq'){if(id.startsWith('sp')){const S=RKSP[id.slice(2)]||{};e.c='esp';e.t=S.sk?'lot':/arm|cap|bot|capa|elmo|luv/i.test(S.t||S.s||'')?'def':'atk'}else{e.c='eq';e.t=id.startsWith('esp')?'atk':'def'}}
    else if(tab==='it'){e.c=id.startsWith('p')||id==='senzu'?'con':'mat';e.t='bau'}else{e.c='out';e.t='bau'}R.push(e)}}}catch(err){}
  RKL.tab=sv[0];RKL.q=sv[1];RKL.f=sv[2];
  try{const L=anL();ANC.forEach((C,i)=>{const has=L.some(r=>r.c===i);R.push({id:'an'+i,c:'eq',t:'ring',r:['comum','rara','epica','lend','mit'][i]||'mit',has,img:RQA.anel2[i],big:RQA.anel2[i],nm:'ANEL '+C[0],d:'Anel da Alma · cor '+C[0].toLowerCase()+(i===4?' · o VERMELHO sai na Caça da Hidra (100 a 500.000 anos)':'')})})}catch(err){}
  try{const g=psG();R.push({id:'jn',c:'mat',t:'lot',r:'sec',has:(g.jn|0)>0,img:RQA.jn,big:RQA.jn,nm:'JOIA NEGRA',d:'Você tem '+rkFmtN(g.jn|0)+' · 1 joia = 1 giro de PASSIVA'})}catch(err){}
  try{R.push({id:'mo',c:'mat',t:'bau',r:'lend',has:1,img:'',big:'',ico:'🪙',bigI:'🪙',nm:'MOEDAS DE OURO',d:'Você tem '+rkFmtN(twCoins())})}catch(err){}
  return R}
function coList(){return coItems().filter(e=>(COV.t==='all'||e.t===COV.t)&&(COV.c==='all'||e.c===COV.c))}
function coH(){const all=coItems(),L=coList(),pages=Math.max(1,Math.ceil(L.length/24));COV.pg=Math.min(COV.pg,pages-1);const X=[582,717,852,987,1122,1257],Y=[277,408,540,672];
  const sel=L.find(e=>e.id===COV.sel)||L[0];if(sel)COV.sel=sel.id;const RC=r=>(TWEQR.find(q=>q.k===r)||{}).c||RKRC&&RKRC[['comum','rara','epica','lend','mit','sec','obs'].indexOf(r)]||'#c46bff';
  return `${p3Side()}
  ${[['all',540,752],['atk',770,888],['def',905,1022],['ring',1037,1152],['lot',1167,1282],['bau',1297,1412]].map(([k,x0,x1])=>`<button class="p3Tab sq${COV.t===k?' on':''}${k==='all'&&COV.t!=='all'?' dim':''}" data-a="coT" data-k="${k}" style="${rkB3(x0,155,x1,222)}"></button>`).join('')}
  ${[['all',302],['eq',378],['mat',450],['con',522],['esp',597],['out',670]].map(([k,y])=>`<button class="p3Tab l${COV.c===k?' on':''}${k==='all'&&COV.c!=='all'?' dim':''}" data-a="coC" data-k="${k}" style="${rkB3(298,y,538,y+64)}"></button>`).join('')}
  <div class="coCt l" style="${rkB3(1585,178,1652,218)}"><b>${all.filter(e=>e.has).length}</b></div><div class="coCt r" style="${rkB3(1672,178,1752,218)}">${all.length}</div>
  ${X.flatMap((x,i)=>Y.map((y,j)=>[x,y,j*6+i])).sort((a,b)=>a[2]-b[2]).map(([x,y,k])=>{const e=L[COV.pg*24+k];if(!e)return '';const c=RC(e.r);
    return `<button class="coCl${e.has?'':' no'}${sel&&sel.id===e.id?' on':''}" data-a="coSel" data-id="${twEsc(e.id)}" style="${rkB3(x+3,y+3,x+113,y+111)};--c:${c}">${e.img?`<img src="${e.img}" alt="">`:`<i>${e.ico||'?'}</i>`}${e.has?'':'<em>🔒</em>'}</button>`}).join('')}
  ${L.length?'':`<div class="coE" style="${rkB3(582,420,1372,520)}">Nada nessa combinação de filtros</div>`}
  <div class="coPg" style="${rkB3(860,792,1100,826)}"><button data-a="coPg" data-d="-1">◀</button><span>${COV.pg+1}/${pages}</span><button data-a="coPg" data-d="1">▶</button></div>
  ${sel?`<div class="coBig${sel.has?'':' no'}" style="${rkB3(1540,300,1684,452)};--c:${RC(sel.r)}">${sel.big||sel.img?`<img src="${sel.big||sel.img}" alt="">`:`<i>${sel.bigI||sel.ico||'?'}</i>`}</div>
  <div class="coNm" style="${rkB3(1446,496,1778,538)};color:${RC(sel.r)}">${twEsc(sel.nm||'?')}</div>
  <div class="coDs" style="${rkB3(1438,570,1788,744)}"><b class="${sel.has?'y':'n'}">${sel.has?'✔ VOCÊ TEM':'🔒 AINDA NÃO TEM'}</b><p>${twEsc(sel.d||'')}</p></div>`:''}`}
/* ---------- telas novas (al, co, bt) ---------- */
{const _v=rkView;rkView=function(v){if(!['p3al','p3co','p3bt'].includes(v))return _v.apply(this,arguments);RKV=v;const W=$('rkWrap');if(!W)return;clearInterval(rkView.iv);rkModal(null);
  const k=v.slice(2);W.innerHTML=`<div class="rkA rk_${v} p3V" data-w="1847" data-h="851" data-full="1" style="background-image:url(${P3A[k]})">${({al:alH,co:coH,bt:btH})[k]()}<div id="rkToast"></div></div>`;rkFit();
  W.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)})}}
{const _a=rkAct;rkAct=function(a,b){
  if(['p3al','p3co','p3bt'].includes(a)){if(PFO){rkSfx('clang');return rkToast('Essa parte só aparece no SEU perfil','#cfd6ea')}rkSfx('whoosh');ALV.mode='';ALV.sw=null;return rkView(a)}
  if(a==='p3st'||a==='p3so'){rkSfx('clang');return rkToast(a==='p3st'?'📺 STREAM em breve!':'👥 SOCIAL em breve!','#d9b3ff')}
  if(a==='back'&&['p3al','p3co','p3bt'].includes(RKV)){rkSfx('whoosh');return rkView('pf')}
  if(a==='p3nm'){rkSfx('whoosh');return rkOverTw(()=>twAskName(()=>{})).then(()=>{try{pfPub(1)}catch(e){}if(RKV==='pf')rkView('pf')})}
  if(a==='p3id'){const v=b.dataset.v;try{navigator.clipboard.writeText(v)}catch(e){}rkSfx('whoosh');return rkToast('ID '+v+' copiado!','#7dff9a')}
  if(a==='p3lk'){const D=pfCur(),uid=PFO?D.uid:twUid(),S=P3S[uid];if(!PFO)return rkToast('👍 '+rkFmtN(S?S.lk:0)+' pessoas curtiram seu perfil','#ffd84a');
    const M=rkG('lks',{});if(M[uid]||(S&&S.lkMe))return rkToast('Você já curtiu esse perfil 👍','#cfd6ea');if(!twLS.g('tw_nome',''))return rkToast('Coloque um nome para curtir','#ff8080');
    M[uid]=1;rkS('lks',M);p3Post({lkt:uid});if(S){S.lk++;S.lkMe=1}rkSfx('powerUp');rkToast('👍 Você curtiu o perfil de '+(D.nome||'?')+'!','#7dff9a');for(const k of ['p3Lk','p3Lk2']){const e=$(k);if(e&&S)e.textContent=rkFmtN(S.lk)}if(b)b.classList.add('on');return}
  if(a==='p3pop')return rkToast('🔥 POPULARIDADE = curtidas × 10 + visitas no perfil','#ffb347');
  if(a==='p3uv')return rkToast('👥 Pessoas diferentes que visitaram o perfil','#d9b3ff');
  if(a==='p3ph'){const i=+b.dataset.i;if(!PFO&&!p3Fotos()[i])return p3PhotoPick(i);return p3PhotoView(i)}
  if(a==='btF'){BTV.f=b.dataset.f;BTV.pg=0;rkSfx('whoosh');return rkView('p3bt')}
  if(a==='btPg'){const n=Math.max(1,Math.ceil(btList().length/5));BTV.pg=(BTV.pg+(+b.dataset.d)+n)%n;rkSfx('whoosh');return rkView('p3bt')}
  if(a==='btD')return btDet(+b.dataset.i);
  if(a==='alSel'){ALV.i=+b.dataset.i;ALV.mode='';ALV.sw=null;rkSfx('whoosh');return rkView('p3al')}
  if(a==='alPg'){ALV.i=(ALV.i+(+b.dataset.d)+ALB.length)%ALB.length;ALV.mode='';ALV.sw=null;rkSfx('whoosh');return rkView('p3al')}
  if(a==='alSlot')return alSlot(+b.dataset.s);
  if(a==='alAll'){const A=ALB[ALV.i];for(const id of alPend(A))alPlace(A,id);return rkView('p3al')}
  if(a==='alRm'){ALV.mode=ALV.mode==='rm'?'':'rm';ALV.sw=null;rkSfx('whoosh');return rkView('p3al')}
  if(a==='alSw'){ALV.mode=ALV.mode==='sw'?'':'sw';ALV.sw=null;rkSfx('whoosh');return rkView('p3al')}
  if(a==='alRen'){const A=ALB[ALV.i],ad=alA(A.k);rkModal(`<div class="twM sm"><h3>✎ NOME DO ÁLBUM</h3><input id="alNmI" maxlength="24" value="${twEsc(ad.nm||A.n)}"><div class="row"><button class="btn" id="alNmR">PADRÃO</button><button class="btn main" id="alNmOk">SALVAR</button></div></div>`);
    $('alNmOk').onclick=()=>{ad.nm=String($('alNmI').value||'').trim().slice(0,24);alSv(A.k,ad);rkModal(null);rkView('p3al')};$('alNmR').onclick=()=>{ad.nm='';alSv(A.k,ad);rkModal(null);rkView('p3al')};return}
  if(a==='coT'){COV.t=b.dataset.k;COV.pg=0;COV.sel=null;rkSfx('whoosh');return rkView('p3co')}
  if(a==='coC'){COV.c=b.dataset.k;COV.pg=0;COV.sel=null;rkSfx('whoosh');return rkView('p3co')}
  if(a==='coSel'){COV.sel=b.dataset.id;rkSfx('whoosh');return rkView('p3co')}
  if(a==='coPg'){const n=Math.max(1,Math.ceil(coList().length/24));COV.pg=(COV.pg+(+b.dataset.d)+n)%n;COV.sel=null;rkSfx('whoosh');return rkView('p3co')}
  return _a.apply(this,arguments)}}

/* ================= v369: PLACAS DE TÍTULO (artes do dono) + títulos de TOP automáticos + HISTÓRICO NOVO (estatísticas, temporada, radar) ================= */
const TPL={"adm":["a/00523d62094050.webp",6.469],"campeao_servidor":["a/399fb7683b19b4.webp",9.312],"conquistador":["a/fb70c1212d69d9.webp",7.76],"deus":["a/73cc4d7252bb50.webp",6.729],"deus_celestial":["a/13dedc317213a1.webp",6.729],"divindade":["a/d1bcdc4e0aa28c.webp",7.479],"elite":["a/7b99144fdf7d60.webp",8.812],"imortal":["a/a1eadcde820639.webp",8.573],"lenda_viva":["a/f2a29895001ad6.webp",8.135],"mestre_supremo":["a/ed0e0335c597eb.webp",8.458],"top10_servidor":["a/3a5b0cc8c9ea2e.webp",8.76],"top1_aventura":["a/b7d042078e013e.webp",9.385],"top1_caca":["a/5332da73bf319f.webp",9.885],"top1_pvp":["a/de08a12cd6c611.webp",8.625],"top1_servidor":["a/83cd635aaa4eaf.webp",7.406],"top1_torre":["a/69698497a86b38.webp",9.01],"top2_pvp":["a/c6d689a2a059ba.webp",9.177],"top2_servidor":["a/731edae9967586.webp",8.573],"top3_pvp":["a/bba5ac51861e6b.webp",9.0],"top3_servidor":["a/01560f78fcde8e.webp",8.677],"veterano":["a/334bef2adddec1.webp",9.177]};
/* títulos de TOP (dinâmicos: entram e saem sozinhos quando você entra no jogo) */
const TPD=[['tps1','top1_servidor','TOP 1 DO SERVIDOR','🥇','#ffd84a','1º lugar no ranking do Ranqueado'],['tpp1','top1_pvp','TOP 1 DO PVP','⚔️','#ff4a4a','1º lugar no PVP'],
  ['tps2','top2_servidor','TOP 2 DO SERVIDOR','🥈','#9fd0ff','2º lugar no ranking do Ranqueado'],['tpp2','top2_pvp','TOP 2 DO PVP','⚔️','#7fb0ff','2º lugar no PVP'],
  ['tps3','top3_servidor','TOP 3 DO SERVIDOR','🥉','#ff9a4a','3º lugar no ranking do Ranqueado'],['tpp3','top3_pvp','TOP 3 DO PVP','⚔️','#e08a4a','3º lugar no PVP'],
  ['tpc1','top1_caca','TOP 1 DO MODO CAÇA','🐺','#c46bff','1º lugar no ranking da Caça (mais longe)'],['tpt1','top1_torre','TOP 1 DA TORRE','🏰','#ffd84a','1º lugar no ranking da Torre da semana'],
  ['tpa1','top1_aventura','TOP 1 DA AVENTURA','🛡️','#5ab8ff','1º lugar no ranking de DANO do Modo Boss'],['tps10','top10_servidor','TOP 10 DO SERVIDOR','🔟','#d36bff','Entre os 10 primeiros do Ranqueado']];
for(const [k,,n,i,c,d] of TPD)TWTIT[k]={n,i,c,d:d+' · atualiza sozinho quando você entra no jogo',dyn:1};
TWTIT.deus={n:'DEUS',i:'🕊️',c:'#ffffff',d:'Título especial dado pelo ADM',hid:1};
/* qual placa cada título usa (ranks do Ranqueado: Bronze=Elite … Deus Celestial) */
const TPRK=['','elite','veterano','conquistador','mestre_supremo','lenda_viva','imortal','divindade','divindade','divindade','deus_celestial'];
function tplOf(k){if(!k)return '';if(k==='adm'||k==='deus')return k;if(/^rk\d+$/.test(k))return TPRK[+k.slice(2)]||'';if(k==='con')return 'conquistador';if(k==='sem'||k==='tor')return 'campeao_servidor';const D=TPD.find(x=>x[0]===k);return D?D[1]:''}
const TPGL={adm:'adm',deus:'deus',deus_celestial:'g3',top1_servidor:'g3',top1_pvp:'g3',divindade:'g2',imortal:'g2',top2_servidor:'g2',top2_pvp:'g2',top1_caca:'g2',top1_torre:'g2',top1_aventura:'g2',lenda_viva:'g1',mestre_supremo:'g1',top3_servidor:'g1',top3_pvp:'g1',top10_servidor:'g1'};
function tplH(k,big){const p=tplOf(k),A=TPL[p];if(!A)return '';const gl=TPGL[p]||'g0';
  return `<span class="tpl ${gl} tp_${p}${big?' big':''}" style="--ar:${A[1]}">${gl==='adm'?'<i class="ra"></i><i class="sw1"></i><i class="sw2"></i><i class="ck"></i>':''}${gl==='deus'?'<i class="hl"></i>':''}<img src="${A[0]}" alt="">${gl!=='g0'?'<i class="sh"></i>':''}${gl==='adm'?'<i class="cr"></i><i class="sp a">✦</i><i class="sp b">✦</i><i class="sp c">✧</i><i class="sp d">✦</i><i class="lt l1"></i><i class="lt l2"></i>':''}${gl==='deus'?'<i class="wg l"></i><i class="wg r"></i>':''}</span>`}
/* perfil: usa a placa quando existe */
{const _p=p3Plate;p3Plate=function(t,n,adm,me){if(t==='adm'&&!adm)return _p.apply(this,arguments);const h=tplH(t,1);return h||_p.apply(this,arguments)}}
/* rankings / listas: placa pequena */
{const _r=rgTit;rgTit=function(k,nm){if(k==='adm'&&nm!=null&&String(nm).toLowerCase()!==TWADMN.toLowerCase())return '';const h=tplH(k);return h?h.replace('class="tpl ','class="tpl sm '):_r.apply(this,arguments)}}
/* ---------- títulos de TOP + título do rank: atualiza quando entra no jogo (no máx. a cada 20 min) ---------- */
async function tplSync(force){const last=rkG('tsync',0);if(!force&&Date.now()-last<20*60e3)return;rkS('tsync',Date.now());const me=twUid(),nm=String(twLS.g('tw_nome','')||'').toLowerCase();if(!nm)return;
  const isMe=e=>e&&((e.uid&&e.uid===me)||String(e.nome||'').toLowerCase()===nm);const W=new Set();let ok=0;
  try{const L=(await rkLoadRk('rp')).filter(e=>!e.bot).sort((a,b)=>(b.rp|0)-(a.rp|0));const i=L.findIndex(isMe);ok++;if(i===0)W.add('tps1');else if(i===1)W.add('tps2');else if(i===2)W.add('tps3');else if(i>=3&&i<10)W.add('tps10')}catch(e){}
  try{const L=(await pvLoadAll()).slice().sort((a,b)=>((b.t|0)*1e6+(b.dv|0)*1e3+(b.st|0))-((a.t|0)*1e6+(a.dv|0)*1e3+(a.st|0)));const i=L.findIndex(e=>e.pva===pvAcc()||isMe(e));ok++;if(i===0)W.add('tpp1');else if(i===1)W.add('tpp2');else if(i===2)W.add('tpp3')}catch(e){}
  try{const L=await rkQ('ca','1',1000),M={};for(const e of L){const k=e.uid||e.nome;const m=M[k]||(M[k]={uid:e.uid,nome:e.nome,lv:0,dm:0});m.lv=Math.max(m.lv,e.clv|0);m.dm=Math.max(m.dm,e.cdm|0)}
    const S=Object.values(M).filter(m=>m.lv>0).sort((a,b)=>b.lv-a.lv||b.dm-a.dm);ok++;if(S[0]&&isMe(S[0]))W.add('tpc1')}catch(e){}
  try{const L=await twWeekL(0);ok++;if(L[0]&&isMe(L[0]))W.add('tpt1')}catch(e){}
  try{const L=(await rkLoadRk('dmg')).filter(e=>!e.bot);ok++;if(L[0]&&isMe(L[0]))W.add('tpa1')}catch(e){}
  if(!ok)return;let T=twTits().filter(k=>!(TWTIT[k]&&TWTIT[k].dyn)||W.has(k));for(const k of W)if(!T.includes(k))T.push(k);twLS.s('tw_tit',T);
  const cur=twLS.g('tw_titOn',''),auto=!cur||/^rk\d+$/.test(cur)||(TWTIT[cur]&&TWTIT[cur].dyn)||!T.includes(cur);
  if(auto){const best=TPD.map(x=>x[0]).find(k=>W.has(k))||T.filter(k=>/^rk\d+$/.test(k)).sort((a,b)=>+b.slice(2)-+a.slice(2))[0]||'';if(best!==cur){twLS.s('tw_titOn',best);if(best&&TWTIT[best]&&TWTIT[best].dyn)setTimeout(()=>rkToast('🏆 Novo título: '+TWTIT[best].n+'!','#ffd84a'),1500)}}
  try{acSave()}catch(e){}try{pfPub(1)}catch(e){}if(RKV==='pf'&&showScreen.cur==='ranked')rkView('pf')}
{const _o=rkOpen;rkOpen=function(){const r=_o.apply(this,arguments);setTimeout(()=>{try{tplSync()}catch(e){}},2500);return r}}
/* ================= HISTÓRICO NOVO ================= */
P3A.hs='a/0f0abd15d2fbd7.webp';
const TEMP={id:1,n:'TEMPORADA 1',ini:'2026-11-12'}; /* reiniciar a temporada = TEMP.id+1 */
const BTAGG=()=>({pt:0,n:0,w:0,l:0,pf:0,mvp:0,sq:0,bs:0,t:0,k:0,dd:0,dr:0,g:0,gm:0,hp:0,xdpm:0,xrpm:0,xgpm:0,tm:0,tw:0,bf:0,bc:0,bh:0});
function btSea(){let s=rkG('bts',null);if(!s||s.sid!==TEMP.id){s=Object.assign(BTAGG(),{sid:TEMP.id,mm:{}});rkS('bts',s)}return s}
/* medição durante a luta: tempo, dano causado/recebido, abates, ouro/gemas */
{const _s=startMatch;startMatch=function(){G._bs={f:0,dd:0,dr:0,k:0,g0:twCoins(),m0:rkG('gem',0)|0};return _s.apply(this,arguments)}}
{const _u=update;update=function(){_u.apply(this,arguments);const B=G._bs;if(!B||G.mode!=='fight'||G.phase!=='fight'||G.paused||!G.p)return;B.f++;
  const T=[G.p[1]].concat(typeof HY!=='undefined'&&HY.on?HY.mobs:[]);for(const f of T){if(!f)continue;if(f._lh!=null&&f.hp<f._lh)B.dd+=f._lh-f.hp;f._lh=f.hp}
  const p=G.p[0];if(p){if(p._lh!=null&&p.hp<p._lh)B.dr+=p._lh-p.hp;p._lh=p.hp}}}
{const _k=ko;ko=function(a,d){try{if(G._bs&&G.p&&d&&d!==G.p[0]&&!d.ko)G._bs.k++}catch(e){}return _k.apply(this,arguments)}}
function btAdd(A,e){A.pt++;A.n++;if(e.w){A.w++;A.sq++;A.bs=Math.max(A.bs,A.sq)}else{A.l++;A.sq=0}if(e.pf)A.pf++;if(e.mvp)A.mvp++;A.t+=e.t;A.k+=e.k;A.dd+=e.dd;A.dr+=e.dr;A.hp+=e.hp;
  const mn=Math.max(e.t,20)/60;A.xdpm=Math.max(A.xdpm,e.dd/mn);A.xrpm=Math.max(A.xrpm,e.dr/mn);if(e.tm){A.tm++;if(e.w)A.tw++}if(e.n){if(e.m==='torre')A.bf=Math.max(A.bf,e.n);if(e.m==='caca')A.bc=Math.max(A.bc,e.n);if(e.m==='hidra')A.bh=Math.max(A.bh,e.n)}}
function btAddG(A,g,gm,t){A.g+=g;A.gm+=gm;A.xgpm=Math.max(A.xgpm,g/(Math.max(t,20)/60))}
{const _r=btRec;btRec=function(m,w,x){const before=btC().pt;_r.apply(this,arguments);const L=rkG('bt',[]),e=L[0];if(!e||btC().pt===before)return;const B=G._bs||{f:0,dd:0,dr:0,k:0},p=G.p&&G.p[0];
  e.t=Math.round(B.f/60);e.k=B.k|0;e.dd=Math.round(B.dd);e.dr=Math.round(B.dr);e.hp=e.w&&p?Math.max(0,Math.min(1,p.hp/(p.mhp||MAXHP))):0;e.mvp=e.w&&(e.pf||e.hp>=.5)?1:0;e.tm=G.teams?1:0;
  const mt=String(e.x||'').match(/(\d+)/);e.n=mt?+mt[1]:0;L[0]=e;rkS('bt',L);
  const c=btC(),s=btSea();for(const A of [c,s]){for(const f in BTAGG())if(A[f]==null)A[f]=0;const z=A.pt,zw=A.w,zl=A.l,zpf=A.pf,zsq=A.sq,zbs=A.bs;btAdd(A,e);if(A===c){A.pt=z;A.w=zw;A.l=zl;A.pf=zpf;A.sq=zsq;A.bs=zbs}
    A.mm=A.mm||{};const M=A.mm[m]=Object.assign(BTAGG(),A.mm[m]||{});btAdd(M,e)}
  rkS('btc',c);rkS('bts',s);const g0=B.g0,m0=B.m0,t=e.t,d=e.d;G._bs=null;
  setTimeout(()=>{try{const g=Math.max(0,twCoins()-(g0||0)),gm=Math.max(0,(rkG('gem',0)|0)-(m0||0));const L2=rkG('bt',[]),i=L2.findIndex(q=>q.d===d);if(i>=0){L2[i].g=g;L2[i].gm=gm;rkS('bt',L2)}
    const c2=btC(),s2=btSea();for(const A of [c2,s2]){btAddG(A,g,gm,t);if(A.mm&&A.mm[m])btAddG(A.mm[m],g,gm,t)}rkS('btc',c2);rkS('bts',s2)}catch(err){}},5000)}}
const HSV={sea:1,m:'all'};
const HSM=[['all','TODOS OS MODOS'],['pvp','PVP'],['boss','BOSS'],['dsf','DESAFIO'],['pve','VERSUS'],['torre','TORRE'],['caca','CAÇA'],['hidra','HIDRA']];
function hsData(D){const S=D?(HSV.sea?D.sea:D.all):(HSV.sea?btSea():btC());if(!S)return null;const A=Object.assign(BTAGG(),HSV.m==='all'?S:(S.mm&&S.mm[HSV.m])||{});return A}
const hsK=v=>v>=1e9?(v/1e9).toFixed(1).replace('.',',')+'B':v>=1e6?(v/1e6).toFixed(1).replace('.',',')+'M':v>=1e4?(v/1e3).toFixed(1).replace('.',',')+'K':rkFmtN(Math.round(v));
const hsK2=v=>v>=1e9?Math.round(v/1e9)+'B':v>=1e6?Math.round(v/1e6)+'M':v>=1e3?Math.round(v/1e3)+'K':String(Math.round(v));
const hsT=s=>{s=Math.round(s);if(s<60)return s+'s';if(s<3600)return Math.floor(s/60)+'min '+String(s%60).padStart(2,'0')+'s';return Math.floor(s/3600)+'h '+Math.floor(s%3600/60)+'min'};
function hsRadar(A,me){const n=Math.max(1,A.n),mn=Math.max(1,A.t)/60,lg=(v,r)=>Math.max(0,Math.min(100,100*Math.log10(1+v)/Math.log10(1+r)));
  let av=0;try{const P=me?pvG():{bt:0};av=Math.round(100*((Math.max(P.t|0,P.bt|0))/(PVT.length-1)+Math.min(1,A.bf/TWN)+Math.min(1,A.bc/10)+Math.min(1,A.bh/HYMAX))/4)}catch(e){}
  return [['AVANÇAR',av,'Quanto você já avançou: rank do PVP, andar da Torre, nível da Caça e da Hidra'],['KDA',Math.min(100,Math.round(((A.k+A.w)/Math.max(1,A.l))*12)),'(abates + vitórias) ÷ derrotas'],
    ['SOBREVIVÊNCIA',Math.round(A.hp/n*100),'Vida que sobra no fim das lutas (média)'],['LUTA EM EQUIPE',A.tm?Math.round(A.tw/A.tm*100):0,'Vitórias nas lutas de time (PVP 3x3)'],
    ['FARM',Math.round(lg((A.g+A.gm*10)/mn,2000)),'Ouro e diamantes ganhos por minuto'],['DANO',Math.round(lg(A.dd/LAYER/mn,30)),'Dano causado por minuto']]}
function hsH3(){const D=PFO?(PFO.hs||null):null,A=hsData(D)||BTAGG(),n=Math.max(1,A.n),me=!PFO,own=me?rkG('own',['goku']).filter(id=>CH[id]).length:(PFO&&PFO.h?PFO.h.own:0);
  const R=hsRadar(A,me),cx=1465,cy=428,V=[[1465,243],[1628,335],[1628,520],[1465,615],[1302,520],[1302,335]];
  const pts=R.map((r,i)=>[cx+(V[i][0]-cx)*Math.max(4,r[1])/100,cy+(V[i][1]-cy)*Math.max(4,r[1])/100]);
  const L=[[A.w,408],[A.l,459],[hsT(A.t),510],[(A.k/n).toFixed(1).replace('.',','),561],[A.bs,612],[hsK2(A.xdpm),664,1],[hsK2(A.xgpm),716]],Rr=[[hsK(A.gm),408],[own,459],[A.mvp,510],[hsT(A.t/n),561],[A.k?hsT(A.t/A.k):'—',612],[hsK2(A.xrpm),664,1]];
  const P=v=>`${(v[0]/18.47).toFixed(3)}% ${(v[1]/8.51).toFixed(3)}%`;
  return `${p3Side()}${PFO?`<div class="pfOth p3Oth" style="${rkB3(560,8,1150,58)}">👀 HISTÓRICO DE <b>${twEsc(PFO.nome||'?')}</b></div>`:''}
  <button class="p3Tab${HSV.sea?' on':''}" data-a="hsSea" data-v="1" style="${rkB3(610,98,874,150)}"></button><button class="p3Tab${HSV.sea?'':' on'}" data-a="hsSea" data-v="0" style="${rkB3(888,98,1136,150)}"></button>
  ${HSV.sea?'':`<div class="hsDim" style="${rkB3(612,100,872,148)}"></div>`}<div class="hsSeaN" style="${rkB3(612,150,872,172)}">${TEMP.n}</div>
  <button class="hsMd" data-a="hsMode" style="${rkB3(1410,98,1726,150)}"><b>${(HSM.find(x=>x[0]===HSV.m)||HSM[0])[1]}</b></button>
  <div class="hsCi" style="${rkB3(415,256,575,312)}">${hsK(A.pt)}</div><div class="hsCi" style="${rkB3(670,256,830,312)}">${A.pt?(A.w/A.pt*100).toFixed(1).replace('.',',')+'%':'—'}</div><div class="hsCi" style="${rkB3(930,256,1090,312)}">${hsK(A.mvp)}</div>
  ${L.map(([v,y,t])=>`<div class="hsV${t?' t':''}" style="${rkB3(560,y+2,730,y+42)}">${v}</div>`).join('')}${Rr.map(([v,y,t])=>`<div class="hsV${t?' t':''}" style="${rkB3(1010,y+2,1170,y+42)}">${v}</div>`).join('')}
  <svg class="hsRd" viewBox="0 0 100 100" preserveAspectRatio="none" style="left:0;top:0;width:100%;height:100%"><polygon points="${pts.map(p=>(p[0]/18.47).toFixed(2)+','+(p[1]/8.51).toFixed(2)).join(' ')}"/></svg>
  ${R.map((r,i)=>{const [x,y]=V[i],dx=x<cx-5?-1:x>cx+5?1:0,dy=y<cy?-1:1;return `<div class="hsRv" style="${rkB3(x-40+dx*58,y-16+(dx?0:dy*0)+(i===0?40:i===3?-62:28),x+40+dx*58,y+14+(i===0?40:i===3?-62:28))}">${r[1]}</div>`}).join('')}
  <button class="hs" data-a="hsDet" style="${rkB3(1312,688,1648,758)}"></button>
  ${A.n?'':`<div class="hsE" style="${rkB3(340,775,1180,800)}">${PFO?'Esse jogador ainda não tem estatísticas nesta versão.':'Os números novos (tempo, dano, abates, ouro) começam a contar a partir das suas próximas lutas.'}</div>`}`}
function hsDet(){const D=PFO?(PFO.hs||null):null,A=hsData(D)||BTAGG(),R=hsRadar(A,!PFO);
  rkModal(`<div class="twM sm hsDM"><h3>ℹ️ DETALHES DO GRÁFICO</h3><p class="twH">${HSV.sea?TEMP.n:'TUDO'} · ${(HSM.find(x=>x[0]===HSV.m)||HSM[0])[1]}</p>${R.map(r=>`<div class="hsDr"><b>${r[0]}</b><i><s style="width:${r[1]}%"></s></i><em>${r[1]}</em><small>${r[2]}</small></div>`).join('')}
  <p class="twH">MVP = vitória terminando com mais da metade da vida · Estrela Solitária = vitória PERFEITA (sem tomar dano)</p><div class="row"><button class="btn main" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}
/* publica um resumo das estatísticas no perfil (outros jogadores veem) */
{const _m=pfMine;pfMine=function(){const D=_m.apply(this,arguments);try{const pick=A=>{const o={};for(const f in BTAGG())o[f]=Math.round(+A[f]||0);return o};D.hs={all:pick(btC()),sea:pick(btSea())}}catch(e){}return D}}
{const _c=pfClean;pfClean=function(o){const r=_c.apply(this,arguments);if(!r||!o||!o.hs||typeof o.hs!=='object')return r;const N=v=>Math.max(0,Math.min(1e12,+v||0));const cl=A=>{if(!A||typeof A!=='object')return null;const q={};for(const f in BTAGG())q[f]=N(A[f]);return q};r.hs={all:cl(o.hs.all),sea:cl(o.hs.sea)};return r}}
{const _v=rkView;rkView=function(v){if(v!=='hs')return _v.apply(this,arguments);RKV='hs';const W=$('rkWrap');if(!W)return;clearInterval(rkView.iv);rkModal(null);
  W.innerHTML=`<div class="rkA rk_hs3 p3V" data-w="1847" data-h="851" data-full="1" style="background-image:url(${P3A.hs})">${hsH3()}<div id="rkToast"></div></div>`;rkFit();W.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();rkAct(b.dataset.a,b)})}}
{const _a=rkAct;rkAct=function(a,b){
  if(a==='hsSea'){HSV.sea=+b.dataset.v;rkSfx('whoosh');return rkView('hs')}
  if(a==='hsDet')return hsDet();
  if(a==='hsMode'){rkModal(`<div class="twM sm"><h3>MODO</h3><div class="hsML">${HSM.map(([k,n])=>`<button class="btn${HSV.m===k?' main':''}" data-k="${k}">${n}</button>`).join('')}</div></div>`);
    document.querySelectorAll('#rkModal .hsML button').forEach(x=>x.onclick=()=>{HSV.m=x.dataset.k;rkModal(null);rkSfx('whoosh');rkView('hs')});return}
  if(a==='back'&&RKV==='hs'&&!PFO){rkSfx('whoosh');return rkView('pf')}
  return _a.apply(this,arguments)}}

/* ================= v370: 3 RANKS NOVOS (Deus Cósmico 180k, Deus Primordial 300k, Deus Absoluto 500k) + emblemas novos do dono + brilho do rank no perfil =================
   Tudo que é "por nível do Boss" ganhou 3 níveis a mais (Boss nível 12, 13 e 14, mais fortes). */
RKXP.push(180000,300000,500000);RKXW.push(680,800,950);RKXL.push(360,430,520);
RKLVS.push({v:650,d:290,s:155},{v:780,d:320,s:160},{v:950,d:355,s:165});
RKPAS.push(['DEUS CÓSMICO: barreira de 20% + regenera 5% ao chegar a 35%','IA perfeita: lê seus combos e contra-ataca'],['DEUS PRIMORDIAL: 2 fases supremas, +30% de dano e velocidade','Nunca para de atacar, combos infinitos'],['DEUS ABSOLUTO: 3 barreiras, fúria eterna e cura no fim','O boss mais forte do jogo: só os melhores vencem']);
for(const B0 of RKBOSS){const L=B0.ph[B0.ph.length-1];B0.ph.push([L[0]+1,L[1]+2],[L[0]+2,L[1]+4],[L[0]+3,L[1]+6])}
BSST.push([70000,8500,380],[105000,11000,450],[160000,14500,540]);BSANTI.push({cr:28,ls:.2,pd:.45},{cr:32,ls:.15,pd:.5},{cr:36,ls:.1,pd:.55});
RKRW.push({g:10000,tic:40,bau:[['mit',6]],sz:25,sec:['rnd','rnd']},{g:15000,tic:60,bau:[['mit',8]],sz:30,sec:['sec','rnd','rnd']},{g:25000,tic:100,bau:[['mit',10]],sz:50,sec:['sec','rnd','rnd','rnd']});
/* presentes extras dos ranks novos: joias negras (giros de passiva) + moedas de ouro */
const RKRWX={11:{jn:50,mo:200000},12:{jn:100,mo:500000},13:{jn:250,mo:1000000}};
{const _c=rkRwClaim;rkRwClaim=async function(i){const had=rkG('rwc2',[]).includes(i);const r=await _c.apply(this,arguments);const X=RKRWX[i];
  if(X&&!had&&rkG('rwc2',[]).includes(i)){try{psAddJn(X.jn)}catch(e){}try{twAddCoins(X.mo)}catch(e){}try{acSave(1)}catch(e){}setTimeout(()=>rkToast('🎁 PRESENTE EXTRA: +'+X.jn+' Joias Negras · +'+rkFmtN(X.mo)+' 🪙','#ffd84a'),1200)}return r}}
for(let k=11;k<=13;k++){TWTIT['rk'+k]={n:RKR[k].n,i:'',c:RKR[k].c,d:'Chegar ao rank '+RKR[k].n+' no Modo Ranqueado',rk:k}}
TPRK.push('deus_celestial','deus_celestial','deus_celestial'); /* o dono vai fazer as placas desses 3 */
/* brilho do perfil pelo rank: quanto mais alto, mais forte (classe pa0..pa5 no perfil) */
function p3Tier(i){return i>=13?5:i>=11?4:i>=10?3:i>=7?2:i>=5?1:0}
{const _v=rkView;rkView=function(v){const r=_v.apply(this,arguments);if(v==='pf'){const A=document.querySelector('#rkWrap .rk_pf');if(A){const D=pfCur(),i=Math.max(rkRank(D.rp),D.mx|0),t=p3Tier(i);
  A.classList.add('pa'+t);A.style.setProperty('--rc',RKR[i].c);if(t>=2)A.insertAdjacentHTML('afterbegin',`<div class="p3Au" style="${rkB3(296,96,465,272)}"><i></i><i></i></div>`);
  if(t>=4)A.insertAdjacentHTML('afterbegin','<div class="p3Cos">'+'<s></s>'.repeat(18)+'</div>');if(t>=3){const N=A.querySelector('.p3Nm');if(N)N.insertAdjacentHTML('beforeend',`<em class="p3Mer">✦ ${RKR[i].n} ✦</em>`)}}}return r}}
/* v371: código único: 10.000 💎 + 5.000 moedas vermelhas + CAIXA DE PERSONAGEM MÍTICO aleatório (campos red e rmc; se já tiver todos os míticos: +5.000 💎) */
{const _cp11=twCupom;twCupom=async function(code,E){const C=TWCUP[twHash(String(code).toUpperCase())];const r=await _cp11.apply(this,arguments);
  if(C&&(C.red||C.rmc)&&r&&E&&/ok/.test(E.className||'')){if(C.red)rkAdd('red',C.red);let nm='';
    if(C.rmc){const own=rkG('own',['goku']),L=RK_MIT.filter(id=>CH[id]&&!own.includes(id));if(L.length){const id=L[(Math.random()*L.length)|0];own.push(id);rkS('own',own);nm=CH[id].name;setTimeout(()=>{try{rkCharWin(id,1,1)}catch(e){}},600)}else{rkAdd('gem',5000);nm='(você já tem todos os míticos: +5.000 💎)'}}
    try{acSave(1)}catch(e){}E.textContent='🎁 '+C.nm+'! +'+rkFmtN(C.gm||0)+' 💎'+(C.red?' · +'+rkFmtN(C.red)+' 🔴 moedas vermelhas':'')+' · ✦ MÍTICO: '+nm+(C.rsk&&TWCUP._sp?' · ✦ '+TWCUP._sp+' (na 🎒 MOCHILA)':'');try{twSfx('boom')}catch(e){}}return r}}
TWCUP['1ilnmg2']={nm:'BAÚ MÍTICO',it:[],gm:10000,red:5000,rmc:1};
TWCUP['1k4a4is']={nm:'TESOURO SUPREMO',it:[],gm:40000,rsk:1,rmc:1}; /* v386: código único do dono — 40.000 💎 + personagem mítico + equipamento do Shaka */
/* ================= v374: CORREÇÃO "ZUMBI" =================
   Quem saía da Caça da Hidra (ou do Lobo) pelo menu de pausa deixava HY.on/CA.on ligados e G.diff=3 (dificuldade da caça).
   O wrapper do ko da Hidra continuava ativo nas lutas seguintes (Torre, Boss…) → inimigos não morriam. Agora tudo desliga
   sempre que começa uma luta que não é a caçada, e ao voltar para o menu. */
function hyReset(){try{if(HY&&HY.on){HY.on=0;HY.fil=null;HY.boss=null;HY.mobs=[];HY.items=[];HY.gate=0;HY.busy=0}}catch(e){}try{if(CA&&CA.on&&G.gmode!=='caca')CA.on=0}catch(e){}}
{const _sm=startMatch;startMatch=function(){if(G.gmode!=='caca')hyReset();return _sm.apply(this,arguments)}}
{const _cs=caStart;caStart=function(){try{HY.on=0;HY.fil=null}catch(e){}return _cs.apply(this,arguments)}}
{const _u4=update;update=function(){if(HY&&HY.on&&G.mode==='fight'&&G.gmode!=='caca')hyReset();return _u4.apply(this,arguments)}}
{const _o4=rkOpen;rkOpen=function(){if(G.mode!=='fight'){try{if(HY.on){HY.on=0;HY.fil=null}if(CA.on)CA.on=0}catch(e){}}return _o4.apply(this,arguments)}}
/* ================= v375: TORRE NOVA (Torre Principal 6 andares + Torre Extrema 5 andares) =================
   Andar = lobinhos + armadilhas + meteoros -> BOSS com passivas -> baú cai do céu (sem pausar) + estátua do anjo (escolher passiva)
   -> puxar alavanca (ou estátua do cavaleiro na passagem para a Extrema) -> portão abre -> atravessar = SUBINDO A TORRE.
   Mantém a essência da torre antiga: vida carrega entre andares, equipamentos/poções/rank da torre, troféus, tempo e ranking. */
const TNA=RQA.torre5||{},TNS=TNA.sp||{};
const TNMAP={ruinas:'RUÍNAS ANTIGAS',azul:'FLORESTA AZUL',lava:'NÚCLEO DE LAVA',gelo:'PICO CONGELADO',assombrada:'SALÃO ASSOMBRADO',cristal:'CAVERNA DE CRISTAL',dourado:'TEMPLO DOURADO',pantano:'PÂNTANO VENENOSO',destruida:'CIDADE DESTRUÍDA',arvore:'ÁRVORE ANCESTRAL'};
/* andares (g = 0..10): tr = armadilhas do andar, th = tema da decoração */
const TNF=[{m:'azul',tr:['poca','serra'],th:'flo'},{m:'ruinas',tr:['esp','mach'],th:'rui'},{m:'arvore',tr:['poca','pedra','chama'],th:'flo'},{m:'dourado',tr:['esp','serra','chama'],th:'rui'},{m:'destruida',tr:['pedra','esp','mach'],th:'rui'},{m:'assombrada',tr:['mach','serra','chama','esp'],th:'som'},
  {m:'pantano',tr:['poca','poca','serra','chama'],th:'flo'},{m:'gelo',tr:['poca','esp','pedra','mach'],th:'som'},{m:'cristal',tr:['serra','mach','esp','chama'],th:'som'},{m:'lava',tr:['esp','chama','pedra','esp'],th:'lav'},{m:'lava',tr:['esp','chama','pedra','mach','serra'],th:'lav',fim:1}];
const TNP=6,TNT=TNF.length,TNBARS=[3,4,4,5,5,6,6,7,7,8,10],TNDM=[1.1,1.15,1.2,1.3,1.4,1.55,1.6,1.7,1.8,1.9,2.1],TNNP=[1,2,2,3,3,4,4,5,5,6,7];
const TNBP={fur:['🔥','FÚRIA','abaixo de 50% de vida bate 40% mais forte'],esc:['🛡️','ESCUDO','a cada 9s fica com escudo por 3s'],reg:['💚','REGENERAÇÃO','recupera vida aos poucos'],esp:['🌵','ESPINHOS','devolve 12% do dano que recebe'],vel:['⚡','VELOZ','+20% de velocidade'],
  vam:['🩸','VAMPIRO','cura 35% do dano que causa'],gig:['🗿','GIGANTE','+50% de vida'],imp:['💀','IMPLACÁVEL','energia sempre cheia e IA no máximo']};
const TNBL=[{k:'dano',i:'⚔️',n:'FÚRIA DO GUERREIRO',b:7,d:v=>`+${v}% de dano`},{k:'vel',i:'⚡',n:'PASSOS DO VENTO',b:4,d:v=>`+${v}% de velocidade`},{k:'def',i:'🛡️',n:'PELE DE AÇO',b:7,d:v=>`+${v}% de defesa`},
  {k:'crit',i:'🎯',n:'OLHO DO FALCÃO',b:4,d:v=>`+${v}% de crítico`},{k:'cura',i:'💚',n:'BÊNÇÃO DA VIDA',b:20,d:v=>`cura ${v}% da vida agora`},{k:'vamp',i:'🩸',n:'VAMPIRISMO',b:2,d:v=>`cura ${v}% do dano que você causa`},
  {k:'esp',i:'🌵',n:'ESPINHOS',b:8,d:v=>`devolve ${v}% do dano que você leva`},{k:'fur',i:'🔥',n:'ÚLTIMO SUSPIRO',b:12,d:v=>`+${v}% de dano com menos de 35% de vida`},{k:'trf',i:'🌟',n:'TRANSFORMAÇÃO',b:10,d:v=>`transforma ${v}% mais rápido`},
  {k:'ima',i:'🪙',n:'IMÃ DE OURO',b:15,d:v=>`+${v}% de moedas`},{k:'barra',i:'❤️',n:'BARRA DE VIDA',b:1,d:()=>'+1 barra de vida (cheia)'}];
const TNRM=[1,1.6,2.4,3.5,5];
/* v376: DESAFIO de cada andar (antes do boss) e DESAFIO BÔNUS (cumpriu = baú especial) */
const TNCH=[['lobos',3],['met'],['duelo'],['lobos',3],['met'],['duelo'],['lobos',4],['met'],['duelo'],['met'],['duelo']];
const TNCN={lobos:['🐺','CAÇADA','derrote os lobos'],met:['☄️','CHUVA DE METEOROS','sobreviva 20 segundos'],duelo:['⚔️','DUELO DIRETO','o boss vem na hora com +1 passiva']};
const TNBO=[['rap','⏱️','vença o boss em até 60s'],['vida','💚','perca menos de 30% da vida no andar'],['cmb','👊','faça um combo de 12 golpes'],['arm','🛡️','não leve dano de armadilha nem meteoro']];
let TN={on:0},TNSEL=0;try{TNSEL=+(localStorage.getItem('tn_sel')||0)||0}catch(e){}
/* v376: visual de cada mapa — luz do personagem (LT), partículas no ar, clima, neblina no chão, raios de luz e cor */
const TNST={azul:{lt:{rim:'#9fd8ff',lx:-.3,ly:-.9,amb:'#1a4a8a',aa:.2,bnc:'#4ab0c8',ba:.16,pt:'glint',mote:'#bff0ff'},am:'ff',fc:'#7ff0ff',fog:'40,120,170',ray:'150,220,255',gr:'#2a6aa8'},
  ruinas:{lt:{rim:'#ffe2a8',lx:-.55,ly:-.8,amb:'#3a5a3a',aa:.12,bnc:'#d8a860',ba:.16,pt:'dust',mote:'#fff0c0'},am:'gold',fc:'#ffe6a0',fog:'160,150,110',ray:'255,230,160',gr:'#c89a50'},
  arvore:{lt:{rim:'#d8ffb0',lx:-.4,ly:-.85,amb:'#2a6a3a',aa:.16,bnc:'#a8d060',ba:.15,pt:'dust',mote:'#e8ffc0'},am:'ff',fc:'#c8ff7a',fog:'60,120,70',ray:'220,255,170',gr:'#3a8a3a'},
  dourado:{lt:{rim:'#fff0b0',lx:.5,ly:-.8,amb:'#8a6a20',aa:.14,bnc:'#ffc850',ba:.2,pt:'dust',mote:'#ffe7a0'},am:'gold',fc:'#ffd860',fog:'200,160,80',ray:'255,220,120',gr:'#e0a830'},
  destruida:{lt:{rim:'#ffb880',lx:.6,ly:-.7,amb:'#4a3030',aa:.2,bnc:'#ff7a3a',ba:.16,pt:'ember',mote:'#ffb070'},am:'ash',fc:'#d8c8c0',fog:'120,100,95',ray:null,gr:'#a05a40'},
  assombrada:{lt:{rim:'#d8b0ff',lx:-.3,ly:-.9,amb:'#3a1a6a',aa:.26,bnc:'#9a5aff',ba:.2,pt:'glint',mote:'#e0c8ff'},am:'fog',fc:'#c890ff',fog:'110,60,170',ray:null,gr:'#6a3ab8',wx:'storm'},
  pantano:{lt:{rim:'#d0ffb0',lx:-.3,ly:-.9,amb:'#2a4a2a',aa:.24,bnc:'#7ac850',ba:.18,pt:'dust',mote:'#d8ffb0'},am:'ff',fc:'#b8ff6a',fog:'70,120,60',ray:null,gr:'#4a7a3a',wx:'rain'},
  gelo:{lt:LT.gelo||LT.ice,am:'snow',fc:'#e6f6ff',fog:'190,225,255',ray:'220,240,255',gr:'#7ab0e8',wx:'snow'},
  cristal:{lt:{rim:'#e0c0ff',lx:-.3,ly:-.9,amb:'#4a2a9a',aa:.24,bnc:'#c060ff',ba:.22,pt:'glint',mote:'#f0d8ff'},am:'spk',fc:'#e0b0ff',fog:'130,80,200',ray:'210,160,255',gr:'#8a4ae0'},
  lava:{lt:{rim:'#ffb070',lx:.5,ly:-.6,amb:'#5a1a10',aa:.26,bnc:'#ff5a10',ba:.24,pt:'ember',mote:'#ffa050'},am:'emb',fc:'#ffa040',fog:'200,70,20',ray:null,gr:'#e04a10'}};
try{for(const k in TNMAP){const src=(TNA.mapas||{})[k];if(!src||!STG.flo)continue;STG['tn_'+k]=Object.assign({},STG.flo,{key:'tn_'+k,name:TNMAP[k],src,src0:src,dn:0,hid:1,_ld:null,img:new Image(),far:null,near:null,w:[(TNST[k]&&TNST[k].wx)||'clear']});LT['tn_'+k]=(TNST[k]&&TNST[k].lt)||LT.flo}}catch(e){}
const tnImg=k=>bsImg(TNS[k]||'');
function tnDI(k,x,y,w,h,flip,sx){const im=tnImg(k);if(!im.complete||!im.naturalWidth)return 0;const iw=im.naturalWidth*(sx||1);h=h||w*im.naturalHeight/iw;
  if(flip){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.drawImage(im,0,0,iw,im.naturalHeight,-w/2,y,w,h);ctx.restore()}else ctx.drawImage(im,0,0,iw,im.naturalHeight,x-w/2,y,w,h);return h}
function tnGlow(x,y,r,c,a){if(G.qlv===0)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a==null?.5:a;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore()}
const tnBest=()=>{try{return +(localStorage.getItem('tn_best')||0)||0}catch(e){return 0}};
const tnFl=g=>g<TNP?{t:'PRINCIPAL',n:g+1,N:TNP}:{t:'EXTREMA',n:g-TNP+1,N:TNT-TNP};
/* ---------- começar ---------- */
/* v380: como a torre antiga — cada andar é uma luta e depois VOLTA PARA A TELA DA TORRE (dá para usar poção, equipar...).
   A subida fica SALVA (rk 'tnrun'): saiu para outro lugar, fechou o jogo, saiu da luta pelo pause → continua do andar onde parou. */
const TNRK=[{k:0,i:'🛡️',n:'SEGURO',d:'boss -25% · prêmios pela metade',hp:.75,dm:.75,rw:.5},{k:1,i:'⚔️',n:'NORMAL',d:'como sempre',hp:1,dm:1,rw:1},{k:2,i:'🔥',n:'ARRISCADO',d:'boss +40% e +1 passiva · prêmios x2 e baú raro',hp:1.4,dm:1.35,rw:2}];
let TNUX=0;try{TNUX=+(localStorage.getItem('tn_ux')||0)?1:0}catch(e){}
const tnUxOn=()=>TN&&TN.on&&TN.ux&&G.gmode==='torre';
let TNRISK=1;try{TNRISK=+(localStorage.getItem('tn_risk')||1);if(!(TNRISK>=0&&TNRISK<=2))TNRISK=1}catch(e){}
const tnRun=()=>{const r=rkG('tnrun',null);return r&&r.pick&&Array.isArray(r.bosses)?r:null};
function tnSave(){try{rkS('tnrun',{g:TN.g,g0:TN.g0,pick:TW.pick,bosses:TN.bosses,stg:TN.stg,hp:Math.round(TW.hpv),bars:TW.bars,bl:TN.bl,ux:TN.ux?1:0,nextPas:TN.nextPas||null,coins:TN.coins,loot:(TN.loot||[]).slice(-30),fr:TN.fr|0,tr:TW.tr||[],coinRun:TW.coinRun||0});acSave&&acSave(1)}catch(e){}}
function tnRestore(R){TN={on:0,g:R.g|0,g0:R.g0|0,bosses:R.bosses,stg:R.stg,mobs:[],dead:[],traps:[],dec:[],items:[],mets:[],fx:[],cr:[],bl:R.bl||{},fr:R.fr|0,coins:R.coins|0,clear:0,busy:0,hcd:0,loot:R.loot||[],pk:0,ux:R.ux?1:0,nextPas:R.nextPas||null};
  TW.pick=R.pick;G.pick=R.pick;TW.on=true;TW.fl=TN.g;TW.bars=R.bars||TWPB;TW.hpv=Math.max(1,R.hp||TW.bars*LAYER);TW.hp=TW.hpv/(TW.bars*LAYER);TW.tr=R.tr||[];TW.coinRun=R.coinRun|0;TW.time=TN.fr/60;TW.pas={vida:0,dano:0,vel:0,trf:0};TW.sent=false;TW.last=null;TW.busy=false}
function tnGo(){if(TW.busy)return;if(!SPR_OK)return;const R=tnRun();if(R){tnRestore(R);tnFight();return}const b=tnBest(),g0=TNSEL===1&&b>=TNP?TNP:0;tnStart(g0)}
function tnStart(g0){rkInit&&rkInit();g0=g0|0;const sel=TW.pick||rkG('sel','goku');
  TW.pick=sel;G.pick=sel;TW.on=true;TW.fl=0;TW.rev=false;TW.hp=1;TW.bars=TWPB;TW.hpv=TWPB*LAYER;TW.pas={vida:0,dano:0,vel:0,trf:0};TW.time=0;TW.tr=[];TW.coinRun=0;TW.sent=false;TW.last=null;
  const pool=TWC.filter(x=>x!==sel&&CH[x]),bs=[];while(bs.length<TNT){const s=twShuf(pool.slice());for(const x of s)if(bs.length<TNT)bs.push(x)}
  TN={on:0,g:g0,g0,bosses:bs,mobs:[],dead:[],traps:[],dec:[],items:[],mets:[],fx:[],cr:[],bl:{},fr:0,coins:0,clear:0,busy:0,hcd:0,loot:[],pk:0,ux:TNUX};
  let sk=Object.keys(STG).filter(k=>!STG[k].hid);if(!sk.length)sk=['cupula'];const st=[];while(st.length<TNT){const q=twShuf(sk.slice());if(st.length&&q[0]===st[st.length-1])q.push(q.shift());st.push(...q)}TN.stg=st.slice(0,TNT);
  tnSave();tnFight()}
function tnFight(){if(TN.ux){TN._st={po:twLS.g('tw_pocOn',null),c:rkG('pk_cura',null),d:rkG('pk_drop',null)};twLS.s('tw_pocOn',null);rkS('pk_cura',null);rkS('pk_drop',null)}else TN._st=null;fsTry();try{audioInit()}catch(e){}TN.on=1;TN.risk=TNRISK;TW.on=true;TW.busy=true;TW.diff0=G.diff;TW.fl=TN.g;G.pick=TW.pick;G.gmode='torre';G.opp=TN.bosses[TN.g];G.nextStg=TN.stg[TN.g];
  try{twSfx('whoosh')}catch(e){}const PM=prepMatch([G.pick,G.opp],G.nextStg);showVS(()=>PM.then(()=>{vsLoadEnd();TW.busy=false;startMatch()}),PM)}
function tnGiveUp(){const R=tnRun();if(!R)return;tnRestore(R);TN.on=1;TN.ph='x';tnFinish(false,true)}
/* depois do twApply/rkApply: o inimigo da largada vira um lobinho e monta o andar */
{const _ra=rkApply;rkApply=function(){const r=_ra.apply(this,arguments);try{if(TN.on&&G.gmode==='torre'&&G.p&&TN._st){const S=TN._st;TN._st=null;if(S.po)twLS.s('tw_pocOn',S.po);if(S.c)rkS('pk_cura',S.c);if(S.d)rkS('pk_drop',S.d)}
  if(TN.on&&TN.ux&&G.gmode==='torre'&&G.p){const p=G.p[0];/* v381 ULTRA EXTREMO: força pura do personagem — sem equipamentos, anéis, joias/passivas, bônus de rank, títulos, poção e ADM */
    p.tdm=1;p.tsp=1;p.tdf=1;p.tcr=5;p.tsb=1;p.tcd=0;p.tfd=0;p.pspd=0;p.preg=0;p.tki=1;p.rkCura=0;p.mhp=TW.bars*LAYER;p.hp=p.hpLag=Math.max(1,Math.min(p.mhp,Math.round(TW.hpv)))}
  if(TN.on&&G.gmode==='torre'&&G.p&&!G.p[1].hyK)tnFloorInit()}catch(e){console.warn(e)}return r}}
{const _ps=psSum;psSum=function(){const o=_ps.apply(this,arguments);if(tnUxOn()&&o&&typeof o==='object'){const z={};for(const k in o)z[k]=typeof o[k]==='number'?0:o[k];return z}return o}}
{const _as=anSum;anSum=function(){const o=_as.apply(this,arguments);if(tnUxOn()&&o&&typeof o==='object'){const z={};for(const k in o)z[k]=typeof o[k]==='number'?0:o[k];return z}return o}}
function tnWolf(x){const p=G.p[0],g=TN.g,m=hyMk('lobo',clamp(x,100,WW-100));const k=RKTD.dm[rkTwLv()]||1;m.mhp=Math.round((.8+g*.18)*LAYER/50)*50;m.hp=m.hpLag=m.mhp;m.tdm*=(.42+g*.07)*k;m.facing=m.x<p.x?1:-1;m.inv=30;m.tnW=1;return m}
function tnFloorInit(){const g=TN.g,p=G.p[0];TN.wd=null;TN.ph='boss';TN.mobs=[];TN.dead=[];TN.items=[];TN.mets=[];TN.fx=[];TN.cr=[];TN.dec=[];TN.traps=[];TN.boss=null;TN.chest=null;TN.statue=null;TN.lever=null;TN.gate=null;TN.ft=0;TN.metT=1e9;TN.hp0=p.hp/(p.mhp||1);TN.fs={cmb:0};TN.done=0;
  tnApplyBl(p);TN.bossId=TN.bosses[g];tnBossCfg(G.p[1]);tnHud()}
function tnApplyBl(p){const B=TN.bl||{};for(const k in B){const v=B[k];if(k==='dano')p.tdm+=v/100;else if(k==='vel')p.tsp+=v/100;else if(k==='def')p.tdf=1/(1/(p.tdf||1)+v/100);else if(k==='crit')p.tcr=(p.tcr||0)+v;else if(k==='trf')p.tsb=(p.tsb||1)+v/100}p._tnd=p.hp;p._tnF=0}
function tnPh(nm){const p=G.p[0],ph=hyMk('lobo',p.x+300);ph.hyIdle=1;ph.inv=99999;ph.def=Object.assign({},ph.def,{name:nm});return ph}
function tnBossLoad(){const g=TN.g,id=TN.bosses[g];TN.bossId=id;if(TN.preP&&TN.preP.id===id){TN.bossReady=TN.preP.ok?1:0;TN.preP.P.then(()=>{if(TN.on&&TN.bossId===id)TN.bossReady=1});return}if(G.p&&G.p[0]&&G._mids&&G._mids.includes(id)){TN.bossReady=1;return}TN.bossReady=0;const P=prepMatch([G.pick,id]);P.then(()=>{if(TN.on&&TN.bossId===id)TN.bossReady=1}).catch(()=>{TN.bossReady=1})}
/* ---------- decoração do cenário ---------- */
const TNDEC={flo:[['rocha_g',250],['tocha',150,'L'],['tronco',280],['rocha_m',190],['est_lanterna',150,'N'],['coluna_hera',90],['fogueira',170,'F'],['rocha_p',140],['tronco_q',240]],
  rui:[['coluna',120],['braseiro',100,'B'],['est_cavaleiro',140],['muro',270],['bandeira',100],['tocha',150,'L'],['coluna_p',120],['rocha_runa',170,'R'],['arco',260]],
  som:[['est_lanterna',150,'N'],['cristal',170,'C'],['coluna_p',120],['braseiro',100,'B'],['rocha_runa',180,'R'],['coluna',120],['tocha',150,'L'],['bandeira',100]],
  lav:[['braseiro',100,'B'],['rocha_runa',180,'R'],['coluna_p',120],['est_cavaleiro',140],['bandeira',100],['tocha',150,'L'],['muro',260]]};
function tnDecor(F){const L=TNDEC[F.th]||TNDEC.flo,D=[],xs=[90,430,760,1080,1290];let s=TN.g*7+3;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280};
  for(let i=0;i<xs.length;i++){const d=L[Math.floor(rnd()*L.length)];D.push({k:d[0],w:d[1],l:d[2]||'',x:xs[i]+rnd()*90-45,ph:rnd()*6})}
  D.push({k:'tocha',w:140,l:'L',x:WW-430,ph:1},{k:'tocha',w:140,l:'L',x:WW-70,ph:2});TN.dec=D;
  const bk=[['caixa',88],['barril',66],['caixas',84]];TN.cr=[0,1,2].map(i=>{const b=bk[Math.floor(rnd()*3)];return {k:b[0],w:b[1],x:520+i*360+rnd()*120,hp:1,t:0}})}
/* ---------- armadilhas ---------- */
function tnTraps(F){const T=[],slots=[620,980,1340,1600,860,1180];let i=0;for(const k of F.tr){const x=slots[i++%slots.length];
    if(k==='esp')T.push({k,x,t:(i*57)%200});else if(k==='poca')T.push({k,x,w:230,sp:0,in:0});else if(k==='mach')T.push({k,x,ph:i*1.7});else if(k==='serra')T.push({k,x0:x-220,x1:x+220,x,d:1,a:0});
    else if(k==='chama')T.push({k,x:i%2?140:WW-140,d:i%2?1:-1,t:(i*80)%260});else if(k==='pedra')T.push({k,t:300+i*120,on:0,x:0,d:1,a:0})}TN.traps=T}
function tnHurt(dmg,dir,kn,src){const p=G.p[0];if(!p||p.ko||TN.hcd>0||TN.busy||G.phase!=='fight')return 0;if(TN.ph!=='clear')TN.th=1;let d=dmg*(1-Math.min(70,TN.bl.pedra||0)/100)*LAYER/100;d=Math.round(d);
  p.hp=Math.max(0,p.hp-d);p.flash=8;TN.hcd=45;G.shake=Math.max(G.shake,kn?10:5);try{txt(p.x,p.y-260,'-'+d+(src?' '+src:''),'#ff7a4a');SFX.thud()}catch(e){}
  if(kn&&p.state!=='iced'){p.state='hit';p.hitstun=Math.max(p.hitstun||0,20);p.vx=dir*9}
  if(p.hp<=0)ko(G.p[1],p);return 1}
function tnTrapTick(p){const g=TN.g,dmK=1+g*.12,gr=p.y>FLOOR-40,act=TN.ph!=='clear';
  for(const T of TN.traps){
    if(T.k==='esp'){T.t=(T.t+1)%200;if(act&&T.t>=158&&T.t<195&&gr&&Math.abs(p.x-T.x)<70)tnHurt(9*dmK,p.x<T.x?-1:1,1,'🔺');if(T.t===150&&Math.abs(p.x-T.x)<700)try{SFX.whoosh()}catch(e){}}
    else if(T.k==='poca'){const inn=gr&&Math.abs(p.x-T.x)<T.w*.42;if(inn){const dx=p.x-(TN.px==null?p.x:TN.px);p.x-=dx*.45;if(Math.abs(dx)>1&&G.frame%9===0)TN.fx.push({k:'spl',x:p.x,y:FLOOR+6,t:0});
        if(!T.in&&act){const F=TNF[TN.g];if(F.m==='gelo'&&Math.random()<.35&&p.state!=='iced'){p.state='iced';p.st=0;p.iceLeft=45;p.vx=0;txt(p.x,p.y-300,'❄️ CONGELOU!','#bfeaff')}else if(F.m==='pantano')tnHurt(4*dmK,0,0,'☠️')}}T.in=inn}
    else if(T.k==='mach'){const a=Math.sin(G.frame*.032+T.ph)*1.05,L=270,piv=FLOOR-380,bx=T.x+Math.sin(a)*L,by=piv+Math.cos(a)*L;T.a=a;if(act&&Math.hypot(p.x-bx,(p.y-120)-by)<95)tnHurt(12*dmK,Math.cos(a)>0&&a>0?1:-1,1,'🪓')}
    else if(T.k==='serra'){T.x+=T.d*3.4;if(T.x>T.x1||T.x<T.x0)T.d*=-1;T.a+=.35;if(act&&Math.abs(p.x-T.x)<70&&p.y>FLOOR-150)tnHurt(10*dmK,p.x<T.x?-1:1,1,'⚙️')}
    else if(T.k==='chama'){T.t=(T.t+1)%260;if(T.t>=200){if(G.frame%3===0)TN.fx.push({k:'fogo',x:T.x+T.d*60,y:FLOOR-95,vx:T.d*(11+Math.random()*4),vy:-Math.random()*1.5,t:0});
        const a=T.x+T.d*40,b=T.x+T.d*330;if(act&&p.x>Math.min(a,b)&&p.x<Math.max(a,b)&&p.y>FLOOR-230)tnHurt(8*dmK,T.d,1,'🔥')}}
    else if(T.k==='pedra'){if(!T.on){if(act&&--T.t<=0){T.on=1;T.d=Math.random()<.5?1:-1;T.x=T.d>0?-150:WW+150;T.w=60}}else if(T.w>0)T.w--;else{T.x+=T.d*(9+g*.4);T.a+=T.d*.12;if(Math.abs(p.x-T.x)<95&&p.y>FLOOR-170&&act)tnHurt(14*dmK,T.d,1,'🪨');if(G.frame%6===0)TN.fx.push({k:'po',x:T.x-T.d*60,y:FLOOR-10,t:0});
        if(T.x<-200||T.x>WW+200){T.on=0;T.t=420-g*15+Math.random()*200}}}}
  /* meteoros */
  const metX=(TN.boss&&!TN.boss.ko&&TN.boss.tnPas.includes('met'))?2.2:1;if(TN.ph==='met'){if(--TN.mt2>0);else{TN.mt2=Math.max(26,56-g*3)+Math.random()*20;TN.mets.push({x:clamp(p.x+(Math.random()*2-1)*(Math.random()<.5?60:320),80,WW-80),t:0})}}else if(act&&(TN.metT-=metX)<=0){TN.metT=Math.max(260,700-g*35)+Math.random()*200;const n=1;for(let i=0;i<n;i++)TN.mets.push({x:clamp(p.x+(Math.random()*2-1)*260,80,WW-80),t:-i*25})}
  for(const M of TN.mets){M.t++;if(M.t===95){G.shake=Math.max(G.shake,14);try{SFX.boom();ring(M.x,FLOOR-30,'#ff8a2a',180,18,8);dust(M.x,FLOOR,16)}catch(e){}TN.fx.push({k:'exp',x:M.x,y:FLOOR,t:0},{k:'crat',x:M.x,y:FLOOR,t:0});
      if(Math.abs(p.x-M.x)<150&&p.y>FLOOR-260)tnHurt(16*dmK,p.x<M.x?-1:1,1,'☄️');for(const m of TN.mobs)if(!m.ko&&Math.abs(m.x-M.x)<150){m.hp=Math.max(1,m.hp-LAYER*.3)}}}
  TN.mets=TN.mets.filter(M=>M.t<100);TN.px=p.x}
/* ---------- lobos, caixas, orbes ---------- */
function tnSpawn(){const p=G.p[0],side=Math.random()<.5?-1:1;let x=p.x+side*(560+Math.random()*180);if(x<120||x>WW-120)x=p.x-side*(560+Math.random()*180);const m=tnWolf(x);TN.mobs.push(m);try{ring(m.x,m.y-120,'#ff4a4a',140,16,5);dust(m.x,FLOOR,12)}catch(e){}return m}
function tnHitMobs(p){const mv=p.move;if(p.state!=='attack'||!mv||!mv.hb||!(p.mf>mv.su&&p.mf<=mv.su+mv.ac))return;const key=G.frame-p.mf,hb=hitbox(p,mv);
  for(const m of TN.mobs){if(m.ko||(m.hyLM===mv&&m.hyLK===key))continue;const hu=hurtbox(m);if(!hu||!overlap(hb,hu))continue;m.hyLM=mv;m.hyLK=key;
    const px=p.x+p.facing*(mv.hb[0]+mv.hb[2]*.6),py=clamp(p.y+mv.hb[1]+mv.hb[3]/2,hu.y+20,hu.y+hu.h-20);applyHit(p,m,{smash:mv.smash,launcher:mv.launcher,dmg:mv.dmg,kb:mv.kb,hs:Math.min(8,mv.hs||8),launch:mv.launch,heavy:mv.heavy,low:mv.low,px,py,kind:mv.sword?'sword':'melee',ang:0})}
  for(const c of TN.cr){if(c.hp<=0)continue;const r={x:c.x-c.w/2,y:FLOOR-c.w,w:c.w,h:c.w};if(!overlap(hb,r))continue;c.hp=0;c.t=0;G.shake=Math.max(G.shake,5);try{SFX.thud();dust(c.x,FLOOR,10)}catch(e){}
    const q=Math.random();if(q<.7)TN.items.push({k:q<.35?'orbe_verde':q<.55?'orbe_vermelho':'orbe_azul',x:c.x,y:FLOOR-120,vy:-9,t:0});else{const n=6+TN.g*2;tnCoins(n);txt(c.x,FLOOR-160,'🪙 +'+n,'#ffd84a')}}}
function tnCoins(n){n=Math.round(n*(1+(TN.bl.ima||0)/100));twAddCoins(n);TN.coins+=n;TW.coinRun=(TW.coinRun||0)+n;return n}
function tnItemsTick(p){for(const it of TN.items){it.t++;if(it.vy!=null){it.vy+=.6;it.y+=it.vy;if(it.y>=FLOOR-70){it.y=FLOOR-70;it.vy=null}}
    if(!it.done&&it.t>20&&Math.abs(p.x-it.x)<80&&p.y>FLOOR-280){it.done=1;try{rkSfx('powerUp');ring(it.x,it.y,'#fff',90,12,4)}catch(e){}
      if(it.k==='orbe_verde'){const h=(p.mhp||MAXHP)*.12;p.hp=Math.min(p.mhp,p.hp+h);p.hpLag=Math.max(p.hpLag||0,p.hp);txt(p.x,p.y-300,'💚 +12% VIDA','#7dff9a')}
      else if(it.k==='orbe_vermelho'){if(!TN.rb)p.tdm+=.25;TN.rb=720;txt(p.x,p.y-300,'🔴 +25% DANO (12s)','#ff6a6a')}
      else{p.ki=Math.max(p.ki||0,100);p.sb=Math.max(p.sb||0,SB_COST*.5);txt(p.x,p.y-300,'🔵 ENERGIA CHEIA','#7fd8ff')}}}
  TN.items=TN.items.filter(it=>!it.done);if(TN.rb&&--TN.rb<=0){TN.rb=0;p.tdm-=.25}}
/* ---------- boss ---------- */
function tnBossCfg(o){const g=TN.g,id=o.def.id,RK=TNRK[TN.risk==null?1:TN.risk];
  let pas=twShuf(Object.keys(TNBP));if(TN.nextPas){pas=[TN.nextPas].concat(pas.filter(k=>k!==TN.nextPas));TN.nextPas=null}pas=pas.slice(0,Math.min(8,TNNP[g]+(RK.k===2?1:0)));o.tnBoss=1;o.tnPas=pas;o.mhp=TNBARS[g]*LAYER*(pas.includes('gig')?1.5:1);o.mhp=Math.round(o.mhp/LAYER*2)/2*LAYER;o.hp=o.hpLag=o.mhp;
  o.tdm=TNDM[g];o.tsp=Math.min(1.45,1.08+.035*g)*(pas.includes('vel')?1.2:1);o.tdf=Math.max(.55,.9-g*.035);o.tcr=10+g*3;o.ki=g>=2?100:50;if(g>=3)o.sb=Math.max(o.sb||0,SB_COST);
  if(!TN.ux)try{rkTwDiff(o)}catch(e){}G.diff=g===0&&!pas.includes('imp')?2:3;o._tdf0=o.tdf;o._tnh=o.hp;const fin=g>=TNT-1;o.tnFin=fin;o.tnL=fin?3:g>=TNP&&Math.random()<.75?2:1;o.tnLN=o.tnL;if(fin){o.mhp=Math.round(o.mhp/LAYER*.6)*LAYER}o.mhp=Math.max(LAYER,Math.round(o.mhp/LAYER*RK.hp*2)/2*LAYER);o.hp=o.hpLag=o.mhp;o._tnh=o.hp;o.tdm*=RK.dm;o.def=Object.assign({},o.def,{name:(fin?'☠️ BOSS FINAL · ':'👑 ')+CH[id].name});
  TN.boss=o;TN.ph='boss';TN.bt=0;TN.bt0=0;const T=tnFl(g);
  setTimeout(()=>{if(TN.on&&TN.boss===o)banner((o.tnFin?'☠️ BOSS FINAL: ':'👑 BOSS: ')+CH[id].name,'#ff4a4a',150,(o.tnL>1?'❤️ '+o.tnL+' VIDAS · ':'')+pas.map(k=>TNBP[k][0]+' '+TNBP[k][1]).join(' · ')+(RK.k!==1?' · '+RK.i+' '+RK.n:''))},900);setTimeout(()=>{if(TN.on&&TN.boss===o)banner((T.t==='EXTREMA'?'☠️ TORRE EXTREMA':'🏯 TORRE PRINCIPAL')+' · ANDAR '+T.n,T.t==='EXTREMA'?'#ff4a4a':'#ffd23f',80)},100);if(o.tnFin){G.flash=16;G.flashCol='#ff0000'}tnHud()}
function tnBossTick(o,p){if(o.ko)return;TN.bt++;const P=o.tnPas;
  if(P.includes('fur')){const lo=o.hp<o.mhp*.5;if(lo&&!o._fu){o._fu=1;o.tdm*=1.4;txt(o.x,o.y-300,'🔥 FÚRIA!','#ff5a3a')}}
  if(P.includes('esc')){const c=TN.bt%540;o.tdf=c<180&&TN.bt>200?o._tdf0*.3:o._tdf0;if(c===0&&TN.bt>200)try{ring(o.x,o.y-140,'#7fd8ff',160,16,6)}catch(e){}}
  if(P.includes('reg')&&o.hp<o.mhp)o.hp=Math.min(o.mhp,o.hp+o.mhp*.0055/60*(TN.g>=TNP?1.6:1));
  if(P.includes('inv')&&TN.bt%540===300&&TN.mobs.filter(m=>!m.ko).length<2){tnSpawn();txt(o.x,o.y-300,'🐺 INVOCOU!','#ff9a4a')}
  if(P.includes('imp')&&TN.bt%300===0)o.ki=100;
  const dl=(o._tnh||o.hp)-o.hp;if(dl>0&&P.includes('esp'))p.hp=Math.max(1,p.hp-dl*.12);o._tnh=o.hp}
function tnBossRev(a,d){d.tnL--;d.ko=false;d.hp=d.hpLag=d.mhp;d._tnh=d.hp;d._tnd=d.hp;d.tdm=Math.min(14,d.tdm*1.5);d._tdf0*=.6;d.tdf=d._tdf0;d.tsp*=1.08;d.ki=100;d.sb=SB_COST;
  d.state='idle';d.st=0;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;d.move=null;d.hitstun=0;d.inv=60;if(a)a.vx=-(a.facing||1)*10;
  G.hitstop=Math.max(G.hitstop||0,20);G.shake=30;G.flash=12;G.flashCol=d.tnFin?'#ff2020':'#ffe0a0';try{for(const r of [380,250,130])ring(d.x,d.y-150,r===130?'#ffffff':'#ff4a2a',r,28,8)}catch(e){}
  banner(CH[d.def.id].name+' TRANSFORMOU!','#ff4a2a',120,'3X MAIS FORTE · VIDA '+(d.tnLN-d.tnL+1)+' DE '+d.tnLN);try{startTransform(d)}catch(e){d.form=1;d.formT=FORM_T}try{buzz(200)}catch(e){}tnHud()}
/* v383: VIGIA — nunca deixar o andar travado depois que o boss morre (ultimates/transformações que trocam o lutador, erro no meio, baú final não aberto) */
function tnWatch(p){const W=TN.wd||(TN.wd={b:0,c:0,f:0});const o=G.p[1],B=TN.boss;
  if(TN.ph==='boss'&&B){if(o&&o!==B&&!o.tnBoss&&!o.hyIdle&&o.def&&B.def&&o.def.id===B.def.id){for(const k of ['tnBoss','tnPas','tnL','tnLN','tnFin','_tdf0'])o[k]=B[k];TN.boss=o}
    const X=TN.boss;if((X.hp<=0||X.ko)&&!p.ko){if(++W.b>45){W.b=0;tnBossDown(p,X)}}else W.b=0;
    if(TN.boss&&o&&o!==TN.boss&&(o.hyIdle||o.ko)&&!TN.boss.ko&&TN.boss.hp>0)G.p[1]=TN.boss}
  else if(TN.ph==='boss'&&!B&&!p.ko){if(++W.b>120){W.b=0;if(o&&!o.hyIdle&&!o.ko){tnBossCfg(o)}else{TN.ph='clear';TN.done=0;TN.statue={on:1,used:0,x:-9999};tnPick()}}}
  if(TN.ph==='clear'&&!TN.done){W.c++;const fim=TN.g>=TNT-1,M=document.getElementById('tnPick');
    if(fim){if(TN.chest&&TN.chest.land&&!TN.chest.open&&W.c>240)tnChestOpen();if(W.c>600&&!W.f){W.f=1;tnFinish(true,false)}}
    else if(W.c>300&&!(M&&M.classList.contains('on'))&&!(TN.statue&&TN.statue.used)){W.c=0;TN.statue={on:1,used:0,x:-9999};tnPick()}}else W.c=0}
function tnFloorEnd(){if(!TN.on||TN.done)return;TN.done=1;if(TN.chest&&!TN.chest.open)tnChestOpen();const p=G.p[0],g=TN.g;
  setTimeout(()=>{if(!TN.on)return;TN.g=g+1;TW.fl=TN.g;TW.hpv=Math.max(1,Math.min(p.mhp,p.hp+p.mhp*.4));TW.hp=TW.hpv/(TW.bars*LAYER);tnSave();try{if(TN.g>tnBest())localStorage.setItem('tn_best',TN.g)}catch(e){}
    TN.on=0;G.diff=TW.diff0;G.mode='tower';$('controls').hidden=true;$('pauseBtn').hidden=true;try{rainSound(0)}catch(e){}G.paused=false;tnHud();try{const b=document.getElementById('tnAct');if(b)b.hidden=true}catch(e){}
    showScreen('tower');twRender();const T=tnFl(TN.g);twToast('✅ ANDAR '+tnFl(g).n+' CONQUISTADO! · próximo: '+(T.t==='EXTREMA'?'EXTREMA ':'')+'ANDAR '+T.n,'#7dff9a')},1600)}
function tnBossDown(a,d){d.ko=true;d.hp=0;d.vy=-12;d.vx=(a&&a.facing||1)*7;TN.dead.push(d);TN.boss=null;const g=TN.g,p=G.p[0];
  G.slow=40;G.flash=12;G.flashCol='#ffffff';G.shake=28;try{SFX.boom();for(const r of [420,280,150])ring(d.x,d.y-150,r===150?'#ffffff':'#ffd84a',r,26,8)}catch(e){}
  for(const m of TN.mobs){m.ko=true;m.hp=0;TN.dead.push(m)}TN.mobs=[];TN.mets=[];
  G.p[1]=tnPh('✨ ESCOLHA SUA PASSIVA');TN.ph='clear';TN.clear=g+1-TN.g0;TN.bok=0;

  const secs=TN.ft/60,lost=Math.max(0,TN.hp0-p.hp/(p.mhp||1)),ks=['win','boss'];if(secs<60)ks.push('rap');if(secs<35)ks.push('rap2');if(lost<=.02)ks.push('int');else if(lost<.1)ks.push('mur');if(p.hp/(p.mhp||1)<.15)ks.push('fio');if(g===TNP-1){ks.push('tor');if(TN.fr/60<480)ks.push('spd')}
  for(const k of ks)if(TWTR[k])TW.tr.push({k,fl:g});try{nv(['vEWin','vEWinner','vEVictory'][(Math.random()*3)|0],.2,1)}catch(e){}
  const T=tnFl(g),fim=g>=TNT-1;banner(fim?'👑 TORRE EXTREMA CONQUISTADA!':'ANDAR '+T.n+' CONQUISTADO!','#ffd84a',130,fim?'🎁 ABRA O BAÚ LENDÁRIO':'🎁 BAÚ CAINDO DO CÉU · ✨ ESCOLHA SUA PASSIVA');
  const cx=clamp(p.x+(p.x<WW/2?230:-230),200,WW-200);setTimeout(()=>{if(TN.on)tnChestDrop(cx)},700);if(!fim){TN.nextPas=Object.keys(TNBP)[(Math.random()*Object.keys(TNBP).length)|0];setTimeout(()=>{if(TN.on&&TN.g===g){TN.statue={on:1,used:0,x:-9999};tnPick()}},1900)}tnHud()}
/* ---------- baú caindo do céu (sem pausar) ---------- */
function tnChestDrop(x){const g=TN.g,rk=TN.risk==null?1:TN.risk,ex=g>=TNP||rk===2;TN.chest={x,y:-300,vy:6,t:0,land:0,open:0,ex:ex||!!TN.ux,sp:rk===2,rw:TNRK[rk].rw*(TN.ux?2.5:1),fim:g>=TNT-1};try{SFX.whoosh()}catch(e){}}
function tnChestOpen(){const C=TN.chest;if(!C||C.open)return;C.open=1;C.ot=0;const g=TN.g,R=[];G.shake=Math.max(G.shake,8);try{SFX.boom();ring(C.x,FLOOR-80,C.ex?'#c46bff':'#ffd84a',220,20,8)}catch(e){}
  const c=tnCoins((80+g*30)*(C.fim?4:1)*(C.rw||1));R.push('🪙 +'+c);
  if(C.ex||C.fim||Math.random()<.35*(C.rw||1)){const n=Math.max(1,Math.round(((C.fim?60:C.ex?12:5)+g*2)*(C.rw||1)));rkAdd('gem',n);R.push('💎 +'+n)}
  const nI=C.rw<1&&!C.fim?(Math.random()<.5?1:0):(C.fim?4:C.ex?2:1)+(C.sp?1:0);if(C.fim)setTimeout(()=>{if(TN.on)tnFinish(true,false)},3800);for(let i=0;i<nI;i++){if(Math.random()<.6){const E=TWEQ[(Math.random()*TWEQ.length)|0],Rr=twEqRoll();twAddItem(E,Rr);R.push(E.i+' '+E.n+' '+(Rr.n||Rr.k))}else{const Rr=twPoRoll();twAddPoc(Rr);R.push('🧪 POÇÃO '+(Rr.n||Rr.k))}}
  if(C.ex||C.fim){const j=C.fim?3:1;try{psAddJn(j);R.push('💠 +'+j+' JOIA NEGRA')}catch(e){}}
  TN.loot.push(...R);R.forEach((t,i)=>setTimeout(()=>{try{txt(C.x+(i%2?60:-60),FLOOR-220-i*34,t,'#ffe27a')}catch(e){}},i*180));tnBox(R)}
function tnBox(R){let B=document.getElementById('hyBox');if(!B){B=document.createElement('div');B.id='hyBox';document.body.appendChild(B)}B.innerHTML=`<b>🎁 BAÚ DA TORRE</b>${R.map(x=>`<span>${x}</span>`).join('')}`;B.className='on';clearTimeout(tnBox.t);tnBox.t=setTimeout(()=>{B.className=''},3800);try{rkSfx('powerUp')}catch(e){}}
/* ---------- estátua do anjo: escolher 1 de 3 passivas ---------- */
const TNRL=TNBL.filter(b=>b.k!=='ima');
function tnRoleta(){if(!TN.on||TN.rol)return;TN.rol=1;const p=G.p[0];
  const L=TNRL.filter(b=>b.k!=='barra'||TW.bars<TWMB),pi=(Math.random()*L.length)|0,B=L[pi],Rr=twRoll();let ri=Math.max(0,TWRAR.indexOf(Rr));if(B.k==='barra')ri=Math.max(ri,2);const v=B.k==='barra'?1:Math.round(B.b*TNRM[ri]),RR=TWRAR[ri];
  const EK=Object.keys(TNBP),ei=(Math.random()*EK.length)|0,ek=EK[ei];
  const wheel=(items,col)=>{const n=items.length,seg=360/n;return `<div class="tnW"><div class="tnWh" style="background:conic-gradient(${items.map((_,i)=>`${col[i%2]} ${i*seg}deg ${(i+1)*seg}deg`).join(',')})">${items.map((it,i)=>`<i style="transform:rotate(${i*seg+seg/2}deg)"><b style="transform:rotate(${-(i*seg+seg/2)}deg)">${it}</b></i>`).join('')}</div><em></em></div>`};
  let M=document.getElementById('tnRol');if(!M){M=document.createElement('div');M.id='tnRol';document.body.appendChild(M)}
  M.innerHTML=`<div class="tnRb"><div class="tnRc"><h4>🎰 SUA PASSIVA</h4>${wheel(L.map(b=>b.i),['#3a2a08','#5a4210'])}<div class="tnRr" id="tnRr1"></div></div><div class="tnRc ex"><h4>👹 PASSIVA DO PRÓXIMO BOSS</h4>${wheel(EK.map(k=>TNBP[k][0]),['#3a0808','#5a1010'])}<div class="tnRr" id="tnRr2"></div></div></div>`;M.className='on';
  const W=M.querySelectorAll('.tnWh'),spin=(el,i,n,t)=>{const seg=360/n,rot=360*6+(360-(i*seg+seg/2))+(Math.random()-.5)*seg*.6;el.style.transition=`transform ${t}s cubic-bezier(.12,.75,.16,1)`;requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.transform=`rotate(${rot}deg)`}))};
  try{SFX.whoosh()}catch(e){}spin(W[0],pi,L.length,3.2);spin(W[1],ei,EK.length,3.8);let tk=0;const ti=setInterval(()=>{try{if(++tk<30)SFX.tick?SFX.tick():0}catch(e){}},110);
  setTimeout(()=>{clearInterval(ti);if(!TN.on)return;tnBless(B.k,v);const e=$('tnRr1');if(e){e.style.setProperty('--c',RR.c);e.innerHTML=`<small>${RR.n}</small><b>${B.i} ${B.n}</b><span>${B.d(v)}</span>`;e.className='tnRr on'}try{rkSfx('powerUp');txt(p.x,p.y-320,B.i+' '+B.n,RR.c);ring(p.x,p.y-140,RR.c,170,18,6)}catch(_){}tnHud()},3350);
  setTimeout(()=>{if(!TN.on)return;TN.nextPas=ek;const e=$('tnRr2');if(e){e.innerHTML=`<small>PRÓXIMO BOSS</small><b>${TNBP[ek][0]} ${TNBP[ek][1]}</b><span>${TNBP[ek][2]}</span>`;e.className='tnRr on ex'}try{SFX.thud()}catch(_){}},3950);
  setTimeout(()=>{M.className='';if(TN.on)tnClimb()},6600)}
function tnPick(){const S=TN.statue;if(!S||S.used||!S.on)return;S.used=1;try{rkSfx('powerUp')}catch(e){}const p=G.p[0];
  let L=twShuf(TNRL.filter(b=>b.k!=='barra'||TW.bars<TWMB)).slice(0,4);const O=L.map(b=>{const R=twRoll();let ri=Math.max(0,TWRAR.indexOf(R));if(b.k==='barra')ri=Math.max(ri,2);return {b,R:TWRAR[ri],ri,v:b.k==='barra'?1:Math.round(b.b*TNRM[ri])}});
  let M=document.getElementById('tnPick');if(!M){M=document.createElement('div');M.id='tnPick';document.body.appendChild(M)}
  M.innerHTML=`<div class="tnPk"><h3>✨ ESCOLHA SUA PASSIVA</h3><p>Vale até o fim da subida</p><div class="tnCs">${O.map((o,i)=>`<button class="tnC r${o.ri}" data-i="${i}" style="--c:${o.R.c}"><i>${o.b.i}</i><small>${o.R.n}</small><b>${o.b.n}</b><span>${o.b.d(o.v)}</span></button>`).join('')}</div></div>`;M.className='on';
  M.querySelectorAll('.tnC').forEach(b=>{const f=e=>{e.preventDefault();e.stopPropagation();const o=O[+b.dataset.i];tnBless(o.b.k,o.v);M.className='';setTimeout(()=>{if(TN.on)tnFloorEnd()},1100);setTimeout(()=>{M.innerHTML=''},300);try{txt(p.x,p.y-320,o.b.i+' '+o.b.n,o.R.c);ring(p.x,p.y-140,o.R.c,170,18,6)}catch(e){}tnHud()};b.onclick=f;b.ontouchend=f})}
function tnBless(k,v){const p=G.p[0];TN.bl[k]=(TN.bl[k]||0)+v;TN.pk++;
  if(k==='dano')p.tdm+=v/100;else if(k==='vel')p.tsp+=v/100;else if(k==='def')p.tdf=1/(1/(p.tdf||1)+v/100);else if(k==='crit')p.tcr=(p.tcr||0)+v;
  else if(k==='cura'){p.hp=Math.min(p.mhp,p.hp+p.mhp*v/100);p.hpLag=Math.max(p.hpLag||0,p.hp)}else if(k==='trf'){p.tsb=(p.tsb||1)+v/100}
  else if(k==='barra'){TW.bars++;p.mhp+=LAYER;p.hp=p.mhp;p.hpLag=p.hp}}
function tnBlessTick(p){const o=G.p[1],tot=[o].concat(TN.mobs).filter(f=>f&&!f.hyIdle);let dealt=0;for(const f of tot){if(f._tnd!=null&&f.hp<f._tnd)dealt+=f._tnd-f.hp;f._tnd=f.hp}
  if(TN.bl.vamp&&dealt>0){p.hp=Math.min(p.mhp,p.hp+dealt*TN.bl.vamp/100)}
  const took=(p._tnd!=null?p._tnd-p.hp:0);if(took>0){if(TN.bl.esp&&o&&!o.hyIdle&&!o.ko)o.hp=Math.max(1,o.hp-took*TN.bl.esp/100);if(TN.boss&&!TN.boss.ko&&TN.boss.tnPas.includes('vam'))TN.boss.hp=Math.min(TN.boss.mhp,TN.boss.hp+took*.35)}p._tnd=p.hp;
  if(TN.bl.fur){const lo=p.hp<p.mhp*.35;if(lo&&!p._tnF){p._tnF=1;p.tdm+=TN.bl.fur/100;txt(p.x,p.y-300,'🔥 ÚLTIMO SUSPIRO!','#ff6a3a')}else if(!lo&&p._tnF){p._tnF=0;p.tdm-=TN.bl.fur/100}}}
/* ---------- botão de ação (baú / estátua / alavanca / cavaleiro) ---------- */
function tnNear(p){const C=TN.chest,S=TN.statue,L=TN.lever;if(C&&C.land&&!C.open&&Math.abs(p.x-C.x)<150)return ['bau','🎁 ABRIR BAÚ'];if(S&&S.on&&!S.used&&Math.abs(p.x-S.x)<170)return ['est',TN.g===TNP-1?'✨ ESTÁTUA · IR PARA A TORRE EXTREMA':'✨ ESTÁTUA · PASSIVA E SUBIR'];
  return null}
function tnAct(){const p=G.p&&G.p[0];if(!TN.on||!p)return;const n=tnNear(p);if(!n)return;if(n[0]==='bau')tnChestOpen();else if(n[0]==='est')tnPick();
  else{const L=TN.lever;L.on=1;L.t=0;try{SFX.clang?SFX.clang():SFX.thud()}catch(e){}setTimeout(()=>{if(!TN.on)return;TN.gate.open=1;TN.gate.t=0;G.shake=Math.max(G.shake,14);try{SFX.boom();dust(TN.gate.x,FLOOR,20)}catch(e){}banner(L.k==='cav'?'⚔️ PORTAL DA TORRE EXTREMA ABERTO!':'🚪 PORTÃO ABERTO!',L.k==='cav'?'#ff4a4a':'#ffd23f',100,'➡ ATRAVESSE PARA SUBIR')},500)}tnBtn()}
function tnBtn(){let B=document.getElementById('tnAct');if(!B){B=document.createElement('button');B.id='tnAct';const f=e=>{e.stopPropagation();e.preventDefault();tnAct()};B.onclick=f;B.ontouchstart=f;document.body.appendChild(B)}
  const p=G.p&&G.p[0],n=TN.on&&p&&G.mode==='fight'&&!G.paused?tnNear(p):null;B.hidden=!n;if(n&&B.textContent!==n[1])B.textContent=n[1]}
addEventListener('keydown',e=>{if(TN.on&&(e.key==='e'||e.key==='E'||e.key==='Enter')&&G.mode==='fight'){const B=document.getElementById('tnAct');if(B&&!B.hidden){e.preventDefault();tnAct()}}});
/* ---------- subir a torre ---------- */
function tnClimb(){if(TN.busy)return;const p=G.p[0];TN.busy=1;const g=TN.g;if(TN.chest&&!TN.chest.open)tnChestOpen();
  if(g>=TNT-1){TN.clear=TNT-TN.g0;setTimeout(()=>tnFinish(true,false),300);return}
  const ng=g+1,T0=tnFl(g),T1=tnFl(ng);let C=document.getElementById('tnClimb');if(!C){C=document.createElement('div');C.id='tnClimb';document.body.appendChild(C)}
  const N=T1.N,cells=Array.from({length:N},(_,i)=>`<i class="${i<T1.n-1?'ok':i===T1.n-1?'go':''}"></i>`).reverse().join('');
  C.innerHTML=`<div class="tnCl ${T1.t==='EXTREMA'?'ex':''}" style="background-image:url(${TNA.subir||TNA.menu})"><div class="tnClT"><small>${ng===TNP?'⚔️ ENTRANDO NA':'SUBINDO A'}</small><b>TORRE ${T1.t}</b><div class="tnClB">${cells}</div><em>ANDAR ${T1.n} DE ${N}</em><span>${(STG[TN.stg[ng]]||{}).name||''}</span></div></div>`;
  C.className='on';try{SFX.whoosh();rkSfx('powerUp')}catch(e){}
  setTimeout(()=>{if(!TN.on)return;TN.g=ng;TW.fl=ng;TW.hpv=p.hp;const k=TN.stg[ng],nk=TN.stg[ng+1];const go=()=>{try{setStage(k);if(STAGE.dn&&DN.key!==STAGE.key){dnSet(STAGE.key);DN.key=STAGE.key;DN.ph=CUP.ph0!=null?CUP.ph0:.955;DN.rn=null;DN.lv=0;DN.from=0;DN.k=1;DN.pts=0;DN.pend=0;DN.smk=[];DN.deb=[];DN.ult=0;DN.tr=0;DN.ults=0}setWeather(pickWeather())}catch(e){console.warn(e)}};if(STG[k].img&&STG[k].img.naturalWidth)go();else stageLoad(k).then(go);
    if(nk)stageLoad(nk);try{stageFree(['cupula',k,nk].filter(Boolean))}catch(e){}
    p.hp=Math.min(p.mhp,p.hp+p.mhp*.2);p.hpLag=p.hp;p.y=FLOOR;p.vx=0;p.state='idle';for(const d of TN.dead)d.hyDT=999;TN.dead=[];tnFloorInit()},900);
  setTimeout(()=>{C.className='';TN.busy=0},1900)}
/* ---------- a cada quadro ---------- */
function tnTick(){if(!TN.on||!G.p||G.mode!=='fight')return;const p=G.p[0];G.timer=99;tnBtn();if(!G.paused)try{tnWatch(p)}catch(e){console.warn(e)}
  for(const d of TN.dead){d.hyDT=(d.hyDT||0)+1;if(d.tnBoss){d.vy+=.8;d.x=clamp(d.x+d.vx,40,WW-40);d.y=Math.min(FLOOR,d.y+d.vy);d.vx*=.95;d.state='down'}else try{bsStep(d,p)}catch(e){}}TN.dead=TN.dead.filter(d=>d.hyDT<80);
  for(const f of TN.fx)f.t++;TN.fx=TN.fx.filter(f=>f.t<(f.k==='crat'?300:f.k==='exp'?30:f.k==='spl'?20:f.k==='fogo'?24:f.k==='brasa'?70:30));
  if(G.qlv!==0&&G.frame%7===0&&TN.fx.length<90)for(const d of TN.dec)if(d.l&&'LBF'.includes(d.l)&&Math.random()<.5)TN.fx.push({k:'brasa',x:d.x+(Math.random()-.5)*30,y:FLOOR-40-d.w*(d.l==='F'?.3:1.2),vx:(Math.random()-.5)*.6,vy:-1-Math.random(),t:0});
  if(TN.chest){const C=TN.chest;C.t++;if(!C.land){C.vy+=.55;C.y+=C.vy;if(C.y>=FLOOR){C.y=FLOOR;C.land=1;G.shake=Math.max(G.shake,12);try{SFX.thud();dust(C.x,FLOOR,18);ring(C.x,FLOOR-40,'#ffd84a',200,18,6)}catch(e){}}}if(C.open)C.ot++}
  
  if(G.phase!=='fight'||G.paused||TN.busy)return;TN.fr++;TN.ft++;if(TN.hcd>0)TN.hcd--;TW.time=TN.fr/60;
  for(const m of TN.mobs){if(m.ko)continue;try{updFighter(m,p)}catch(e){}}
  try{tnItemsTick(p)}catch(e){}try{tnBlessTick(p)}catch(e){}if(TN.boss)try{tnBossTick(TN.boss,p)}catch(e){}
  TN.cmax=Math.max(TN.cmax,p.combo||0);
  if(TN.ph==='mob'){const alive=TN.mobs.filter(m=>!m.ko).length+(G.p[1]&&!G.p[1].ko&&G.p[1].tnW?1:0),left=TN.need-TN.kills-alive;if(alive<TN.cap&&left>0&&--TN.spawnT<=0){tnSpawn();TN.spawnT=150}
    if(TN.kills>=TN.need&&TN.bossReady&&(!G.p[1]||G.p[1].ko||G.p[1].tnW||G.p[1].hyIdle))tnBossUp()}
  else if(TN.ph==='met'){TN.mt--;if(TN.mt<=0&&TN.bossReady){TN.mets=[];banner('VOCÊ SOBREVIVEU!','#7dff9a',70);tnBossUp()}}
  else if(TN.ph==='duelo'){if(--TN.dt<=0&&TN.bossReady)tnBossUp()}
  if(G.frame%15===0)tnHud()}
{const _u=update;update=function(){_u.apply(this,arguments);try{tnTick()}catch(e){console.warn(e)}}}
/* ---------- quem cai ---------- */
{const _ko=ko;ko=function(a,d){if(!TN.on||!G.p||d===G.p[0])return _ko.apply(this,arguments);
  if(TN.mobs.includes(d)){d.ko=true;d.hp=0;d.vy=-8;d.vx=(a&&a.facing||1)*6;d.grounded=false;TN.mobs=TN.mobs.filter(m=>m!==d);TN.dead.push(d);tnKill(d);return}
  if(d===G.p[1]){if(d.tnBoss){if(d.tnL>1){tnBossRev(a,d);return}tnBossDown(a,d);return}if(d.hyIdle){d.hp=d.mhp;d.ko=false;return}
    d.ko=true;d.hp=0;d.vy=-8;d.vx=(a&&a.facing||1)*6;d.grounded=false;TN.dead.push(d);tnKill(d);
    if(TN.ph==='mob'&&TN.kills>=TN.need&&TN.bossReady){tnBossUp();return}
    const nx=TN.mobs.find(m=>!m.ko);if(nx){TN.mobs=TN.mobs.filter(m=>m!==nx);G.p[1]=nx}else if(TN.ph==='mob'&&TN.kills<TN.need){const p=G.p[0];G.p[1]=tnWolf(clamp(p.x+(p.x<WW/2?600:-600),120,WW-120));G.p[1].inv=40}else G.p[1]=tnPh(TN.boss?'👑':'⏳ O BOSS ESTÁ VINDO');return}
  d.ko=true;d.hp=0}}
function tnKill(d){TN.kills++;const c=tnCoins(3+TN.g);try{txt(d.x,d.y-230,'+1 🐺  🪙'+c,'#ffd84a')}catch(e){}if(Math.random()<.12)TN.items.push({k:'orbe_verde',x:d.x,y:FLOOR-140,vy:-8,t:0});
  if(TN.ph==='mob'&&TN.kills===TN.need&&!TN.bossReady)banner('O BOSS ESTÁ CHEGANDO...','#ff4a4a',90)}
{const _er=endRound;endRound=function(){if(TN.on){tnFinish(false,false);return}return _er.apply(this,arguments)}}
{const _q=twQuitFight;twQuitFight=function(){if(TN.on){G.paused=false;rainSound(0);$('controls').hidden=true;$('pauseBtn').hidden=true;TN.on=0;G.diff=TW.diff0;G.mode='tower';tnHud();showScreen('tower');twRender();twToast('💾 Subida salva no ANDAR '+tnFl(TN.g).n+' · continue quando quiser','#ffd23f');return}return _q.apply(this,arguments)}}
{const _h=twHudT;twHudT=function(){if(TN.on)return '';return _h.apply(this,arguments)}}
/* ---------- HUD ---------- */
function tnHud(){let E=document.getElementById('tnHud');if(!TN.on||G.mode!=='fight'){if(E)E.hidden=true;return}if(!E){E=document.createElement('div');E.id='tnHud';document.body.appendChild(E)}E.hidden=false;
  const T=tnFl(TN.g),b=TN.boss,bl=Object.keys(TN.bl).map(k=>{const B=TNBL.find(x=>x.k===k);return B?B.i:''}).join('');
  const h=`${TN.ux?'<b class="ex">💀 ULTRA</b>':''}<b class="${T.t==='EXTREMA'?'ex':''}">${T.t==='EXTREMA'?'☠️':'🏯'} ${T.t} · ANDAR ${T.n}/${T.N}</b><span>${TN.ph==='mob'?'🐺 '+Math.min(TN.kills,TN.need)+'/'+TN.need:TN.ph==='duelo'?'⏳ BOSS VINDO':TN.ph==='boss'&&b?(b.tnFin?'☠️ FINAL ':'👑 BOSS ')+(b.tnLN>1?'❤️'+(b.tnL)+' ':'')+b.tnPas.map(k=>TNBP[k][0]).join(''):'✅ LIVRE'}</span><span>⏱ ${twFmt(TN.fr/60)}</span><span>🪙 ${TN.coins}</span>${bl?`<span>${bl}</span>`:''}`;
  if(E._h!==h){E._h=h;E.innerHTML=h}}
/* ---------- desenho ---------- */
function tnDrawBack(){const f=G.frame;
  for(const d of TN.dec){const h=d.k==='tocha'||d.k==='braseiro'?d.w*1.45:0;const y0=FLOOR-36;const im=tnImg(d.k);if(!im.naturalWidth)continue;const H=d.w*im.naturalHeight/im.naturalWidth;tnDI(d.k,d.x,y0-H,d.w,H);
    if(d.l==='L'||d.l==='B')tnGlow(d.x,y0-H*.88,190+Math.sin(f*.2+d.ph)*14,'rgba(255,150,60,1)',.38);else if(d.l==='F')tnGlow(d.x,y0-H*.45,230+Math.sin(f*.2+d.ph)*16,'rgba(255,140,50,1)',.42);
    else if(d.l==='N')tnGlow(d.x+d.w*.28,y0-H*.6,120,'rgba(255,200,90,1)',.4);else if(d.l==='C')tnGlow(d.x,y0-H*.5,170,'rgba(170,90,255,1)',.35);else if(d.l==='R')tnGlow(d.x,y0-H*.5,140,'rgba(80,190,255,1)',.28)}
  /* estátua do anjo */
  const S=TN.statue;if(S){const im=tnImg('est_anjo');if(im.naturalWidth){const w=150,hh=w*im.naturalHeight/im.naturalWidth;ctx.save();if(!S.on||S.used)ctx.filter='grayscale(.7) brightness(.75)';ctx.drawImage(im,S.x-w/2,FLOOR-30-hh,w,hh);ctx.restore();
      if(S.on&&!S.used){tnGlow(S.x,FLOOR-30-hh*.6,220+Math.sin(f*.1)*30,'rgba(255,240,160,1)',.55);ctx.save();ctx.font='900 30px sans-serif';ctx.textAlign='center';ctx.fillText('✨',S.x,FLOOR-hh-60+Math.sin(f*.12)*8);ctx.restore()}}}
  /* alavanca / cavaleiro + portão */
  const L=TN.lever,Gt=TN.gate;if(L){if(L.k==='cav'){const im=tnImg('est_cavaleiro');if(im.naturalWidth){const w=150,hh=w*im.naturalHeight/im.naturalWidth;ctx.save();if(TN.ph!=='clear')ctx.filter='brightness(.7)';ctx.drawImage(im,L.x-w/2,FLOOR-30-hh,w,hh);ctx.restore();if(TN.ph==='clear')tnGlow(L.x,FLOOR-hh*.5,200+Math.sin(f*.13)*25,L.on?'rgba(255,60,60,1)':'rgba(255,120,80,1)',.5)}}
    else{tnDI(L.on?'alavanca_b':'alavanca_c',L.x,FLOOR-(L.on?100:150)-10,L.on?240:170);if(TN.ph==='clear'&&!L.on)tnGlow(L.x,FLOOR-80,130+Math.sin(f*.15)*20,'rgba(255,220,120,1)',.45)}}
  if(Gt){const k=Gt.open?'portao_a':'portao_f',w=470,im=tnImg(k);if(im.naturalWidth){const hh=w*im.naturalHeight/im.naturalWidth;ctx.drawImage(im,Gt.x-w/2,FLOOR-hh+8,w,hh);
      tnGlow(Gt.x-w*.36,FLOOR-hh*.42,110+Math.sin(f*.2)*10,'rgba(255,150,60,1)',.35);tnGlow(Gt.x+w*.36,FLOOR-hh*.42,110+Math.sin(f*.2+1)*10,'rgba(255,150,60,1)',.35);
      if(Gt.open){const ex=TN.g===TNP-1;tnGlow(Gt.x,FLOOR-hh*.35,200+Math.sin(f*.1)*30,ex?'rgba(255,40,40,1)':'rgba(255,230,140,1)',.6);ctx.save();ctx.font='900 34px sans-serif';ctx.textAlign='center';ctx.fillText('➡',Gt.x,FLOOR-hh-10+Math.sin(f*.15)*8);ctx.restore()}}}
  /* armadilhas de chão */
  for(const T of TN.traps){if(T.k==='esp'){const t=T.t,k=t<120?'tr_lava0':t<150?(t%10<5?'tr_lava1':'tr_lava6'):t<155?'tr_lava2':t<160?'tr_lava3':t<195?'tr_lava4':'tr_lava5';const im=tnImg(k);if(im.naturalWidth){const w=170,hh=w*im.naturalHeight/im.naturalWidth;ctx.drawImage(im,T.x-w/2,FLOOR+30-hh,w,hh)}if(t>=158&&t<195)tnGlow(T.x,FLOOR-40,120,'rgba(255,80,30,1)',.4)}
    else if(T.k==='poca'){const im=tnImg('tr_poca0');if(im.naturalWidth){ctx.save();const F=TNF[TN.g];if(F.m==='pantano')ctx.filter='hue-rotate(-90deg) saturate(1.3)';else if(F.m==='lava')ctx.filter='hue-rotate(160deg) saturate(2)';ctx.globalAlpha=.85;ctx.drawImage(im,T.x-T.w/2,FLOOR-24,T.w,T.w*.32);ctx.restore()}}
    else if(T.k==='serra'){ctx.save();ctx.fillStyle='rgba(20,14,10,.75)';ctx.fillRect(T.x0-60,FLOOR-8,T.x1-T.x0+120,10);ctx.translate(T.x,FLOOR-50);ctx.rotate(T.a);const im=tnImg('tr_lobo4');if(im.naturalWidth)ctx.drawImage(im,-66,-66,132,132);ctx.restore()}
    else if(T.k==='chama'){const t=T.t,k=t<170?'tr_lobo0':t<200?'tr_lobo1':'tr_lobo2';const im=tnImg(k);if(im.naturalWidth){const hh=170,w=hh*im.naturalWidth/im.naturalHeight,bw=hh*111/144;ctx.save();ctx.translate(T.x,0);ctx.scale(T.d,1);ctx.drawImage(im,-bw/2,FLOOR+6-hh,w,hh);ctx.restore()}if(t>=200)tnGlow(T.x+T.d*180,FLOOR-100,220,'rgba(255,120,30,1)',.45)}}}
function tnDrawFront(){const f=G.frame;
  for(const c of TN.cr){if(c.hp<=0){c.t++;if(c.k==='caixa'&&c.t<400){ctx.save();ctx.globalAlpha=Math.max(0,1-c.t/400);tnDI('caixa_q',c.x,FLOOR-c.w*.55,c.w*1.4);ctx.restore()}continue}const im=tnImg(c.k);if(im.naturalWidth){const hh=c.w*im.naturalHeight/im.naturalWidth;ctx.drawImage(im,c.x-c.w/2,FLOOR+6-hh,c.w,hh)}}
  for(const T of TN.traps){if(T.k==="mach"){const piv=FLOOR-380,im=tnImg("tr_ped4");if(!im.naturalWidth)continue;const iw=im.naturalWidth,ih=im.naturalHeight,bh=ih*.17,sc=270/(ih-bh);
      ctx.drawImage(im,0,0,iw,bh,T.x-iw*sc*.9,piv-bh*sc*1.3,iw*sc*1.8,bh*sc*1.3);ctx.save();ctx.translate(T.x,piv);ctx.rotate(-T.a);ctx.drawImage(im,0,bh,iw,ih-bh,-iw*sc/2,0,iw*sc,(ih-bh)*sc);ctx.restore()}
    else if(T.k==='pedra'&&T.on){if(T.w>0){const sx=T.d>0?CAM.x+60:CAM.x+VW-60;ctx.save();ctx.globalAlpha=.6+.4*Math.sin(f*.5);ctx.font='900 46px sans-serif';ctx.textAlign='center';ctx.fillText(T.d>0?'⚠️➡':'⬅⚠️',sx,FLOOR-160);ctx.restore()}else{const k=['tr_ped1','tr_ped2','tr_ped3'][((f/5)|0)%3];tnDI(k,T.x,FLOOR+10-190,220,190,T.d<0)}}}
  for(const F of TN.fx){const t=F.t;if(F.k==='spl'){const k='tr_spl'+Math.min(4,(t/4)|0);tnDI(k,F.x,F.y-60,120,70)}
    else if(F.k==='fogo'){F.x+=F.vx;F.y+=F.vy;F.vx*=.97;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.max(0,1-t/24);const r=28+t*2.2,g2=ctx.createRadialGradient(F.x,F.y,0,F.x,F.y,r);g2.addColorStop(0,'rgba(255,240,150,1)');g2.addColorStop(.4,'rgba(255,120,30,.8)');g2.addColorStop(1,'rgba(120,20,0,0)');ctx.fillStyle=g2;ctx.fillRect(F.x-r,F.y-r,r*2,r*2);ctx.restore()}
    else if(F.k==='brasa'){F.x+=F.vx+Math.sin((t+F.y)*.1)*.4;F.y+=F.vy;ctx.save();ctx.globalAlpha=Math.max(0,1-t/70);ctx.fillStyle='#ffb04a';ctx.fillRect(F.x,F.y,3,3);ctx.restore()}
    else if(F.k==='po'){ctx.save();ctx.globalAlpha=Math.max(0,.5-t/60);ctx.fillStyle='#8a7a66';ctx.beginPath();ctx.arc(F.x,F.y-t,18+t,0,7);ctx.fill();ctx.restore()}
    else if(F.k==='exp'){ctx.save();ctx.globalAlpha=Math.max(0,1-t/30);tnDI('tr_exp0',F.x,F.y-230+t,300+t*3);ctx.restore();tnGlow(F.x,F.y-80,300,'rgba(255,140,40,1)',Math.max(0,.8-t/30))}}
  /* meteoros caindo + sombra de aviso */
  for(const M of TN.mets){if(M.t<0)continue;const k=Math.min(1,M.t/70);ctx.save();ctx.fillStyle=`rgba(255,60,20,${.15+.35*k})`;ctx.beginPath();ctx.ellipse(M.x,FLOOR+4,40+110*k,10+20*k,0,0,7);ctx.fill();ctx.strokeStyle=`rgba(255,200,80,${.4+.5*Math.sin(f*.4)})`;ctx.lineWidth=3;ctx.stroke();ctx.restore();
    if(M.t>=70){const u=(M.t-70)/25,x=M.x+(1-u)*420,y=FLOOR-80-(1-u)*700;tnGlow(x,y,160,'rgba(255,140,40,1)',.6);tnDI('tr_met3',x+40,y-110,190)}}
  /* baú */
  const C=TN.chest;if(C){const k=C.open?(C.ex||C.fim?'bau_roxo':'bau_ouro'):'bau_f',w=C.fim?135:105,im=tnImg(k);if(im.naturalWidth){const hh=w*im.naturalHeight/im.naturalWidth;
      if(!C.land){ctx.save();ctx.globalCompositeOperation='lighter';const gr=ctx.createLinearGradient(C.x,C.y-hh-500,C.x,C.y-hh);gr.addColorStop(0,'rgba(255,220,120,0)');gr.addColorStop(1,'rgba(255,220,120,.7)');ctx.fillStyle=gr;ctx.fillRect(C.x-30,C.y-hh-500,60,500);ctx.restore()}
      tnGlow(C.x,C.y-hh*.5,170+Math.sin(f*.12)*20,C.ex||C.fim?'rgba(190,100,255,1)':'rgba(255,210,90,1)',C.open?.3:.5);ctx.save();if(!C.open&&(C.ex||C.fim))ctx.filter='hue-rotate(230deg) saturate(1.5)';ctx.globalAlpha=C.open?Math.max(0,1-Math.max(0,C.ot-150)/60):1;ctx.drawImage(im,C.x-w/2,C.y-hh+6,w,hh);ctx.restore();if(C.open&&C.ot>210)TN.chest=null}}
  /* orbes */
  for(const it of TN.items){const s=44,b=Math.sin((f+it.x)*.08)*8;tnGlow(it.x,it.y+b,80,it.k==='orbe_verde'?'rgba(80,255,120,1)':it.k==='orbe_vermelho'?'rgba(255,60,60,1)':'rgba(70,170,255,1)',.5);tnDI(it.k,it.x,it.y-s/2+b,s,s)}
  /* escudo do boss */
  const o=TN.boss;if(o&&!o.ko&&o.tnPas.includes('esc')&&o.tdf<o._tdf0*.5){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(120,200,255,.7)';ctx.lineWidth=6;ctx.fillStyle='rgba(80,160,255,.12)';ctx.beginPath();ctx.ellipse(o.x,o.y-140,110,170,0,0,7);ctx.fill();ctx.stroke();ctx.restore()}}
{const _dc=drawCracks;drawCracks=function(){const r=_dc.apply(this,arguments);if(TN.on)try{tnDrawBack()}catch(e){}return r}}
{const _wf=drawWeatherFront;drawWeatherFront=function(){const r=_wf.apply(this,arguments);if(TN.on&&G.mode==='fight'){try{worldOn();tnDrawFront();ctx.restore()}catch(e){try{ctx.restore()}catch(_){}}
    }return r}}
function tnAmbInit(F){const S=TNST[F.m]||{},q=G.qlv==null?2:G.qlv,n=q===0?0:q===1?16:q===2?28:42,A=[];for(let i=0;i<n;i++)A.push({x:Math.random()*VW,y:Math.random()*H,s:.6+Math.random()*1.2,ph:Math.random()*6.3,v:.3+Math.random()*.7});TN.am=A;TN.ams=S}
function tnAmbDraw(){const S=TN.ams||{},q=G.qlv==null?2:G.qlv,f=G.frame,cx=(CAM.x||0);if(q===0)return;ctx.save();
  if(S.ray&&q>=2){ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const x0=((i*VW*.38+VW*.15-cx*.12)%(VW*1.2)+VW*1.2)%(VW*1.2)-VW*.1,a=.05+.035*Math.sin(f*.012+i*2);const g=ctx.createLinearGradient(x0,0,x0-120,H*.85);g.addColorStop(0,`rgba(${S.ray},${a*1.6})`);g.addColorStop(1,`rgba(${S.ray},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0-30,0);ctx.lineTo(x0+50,0);ctx.lineTo(x0-60,H*.85);ctx.lineTo(x0-230,H*.85);ctx.closePath();ctx.fill()}ctx.globalCompositeOperation='source-over'}
  if(S.fog){const g=ctx.createLinearGradient(0,H*.62,0,H);g.addColorStop(0,`rgba(${S.fog},0)`);g.addColorStop(1,`rgba(${S.fog},${S.am==='fog'?.38:.24})`);ctx.fillStyle=g;ctx.fillRect(0,H*.62,VW,H*.38)}
  const c=S.fc||'#fff',T=S.am;
  for(const P of TN.am||[]){if(T==='ff'){P.x+=Math.sin(f*.01*P.v+P.ph)*.5-(cx-(TN.amx||cx))*.3;P.y+=Math.cos(f*.013*P.v+P.ph)*.35;const a=.35+.55*Math.max(0,Math.sin(f*.05*P.v+P.ph));ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;const r=7*P.s,g=ctx.createRadialGradient(P.x,P.y,0,P.x,P.y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(P.x-r,P.y-r,r*2,r*2);ctx.fillStyle='#fff';ctx.fillRect(P.x-1,P.y-1,2,2)}
    else if(T==='emb'||T==='gold'){P.y-=P.v*(T==='emb'?1.4:.45);P.x+=Math.sin(f*.02+P.ph)*.4-(cx-(TN.amx||cx))*.35;if(P.y<-10){P.y=H+10;P.x=Math.random()*VW}ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5+.4*Math.sin(f*.08+P.ph);ctx.fillStyle=c;const r=(T==='emb'?2.2:1.8)*P.s;ctx.beginPath();ctx.arc(P.x,P.y,r,0,7);ctx.fill()}
    else if(T==='ash'||T==='snow'){P.y+=P.v*(T==='snow'?.9:.5);P.x+=Math.sin(f*.015+P.ph)*.5-(cx-(TN.amx||cx))*.35;if(P.y>H+10){P.y=-10;P.x=Math.random()*VW}ctx.globalCompositeOperation='source-over';ctx.globalAlpha=T==='snow'?.75:.45;ctx.fillStyle=c;ctx.fillRect(P.x,P.y,2.2*P.s,2.2*P.s)}
    else if(T==='spk'){const a=Math.max(0,Math.sin(f*.04*P.v+P.ph));if(a<.05)continue;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.strokeStyle=c;ctx.lineWidth=1.5;const r=6*P.s*a;ctx.beginPath();ctx.moveTo(P.x-r,P.y);ctx.lineTo(P.x+r,P.y);ctx.moveTo(P.x,P.y-r);ctx.lineTo(P.x,P.y+r);ctx.stroke()}
    else if(T==='fog'){P.x+=P.v*.35-(cx-(TN.amx||cx))*.2;if(P.x>VW+200)P.x=-200;if(P.x<-220)P.x=VW+180;const yy=H*.55+(P.y/H)*H*.4,r=140*P.s;ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.1;const g=ctx.createRadialGradient(P.x,yy,0,P.x,yy,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(P.x-r,yy-r,r*2,r*2)}
    if(P.x<-20&&T!=='fog')P.x+=VW+40;else if(P.x>VW+20&&T!=='fog')P.x-=VW+40}
  TN.amx=cx;ctx.globalAlpha=1;
  if(q>=3&&S.gr){ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=.22;ctx.fillStyle=S.gr;ctx.fillRect(0,0,VW,H);ctx.globalAlpha=1}
  ctx.globalCompositeOperation='source-over';const v=ctx.createRadialGradient(VW/2,H*.55,H*.45,VW/2,H*.55,VW*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.42)');ctx.fillStyle=v;ctx.fillRect(0,0,VW,H);ctx.restore()}
{const _rf=renderFighter;renderFighter=function(f,reflect){if(f&&f.hyIdle&&TN.on)return;if(TN.on&&!reflect&&G.p&&f===G.p[1]){for(const d of TN.dead){ctx.save();ctx.globalAlpha=Math.max(0,1-(d.hyDT||0)/80);try{_rf.call(this,d)}catch(e){}ctx.restore()}for(const m of TN.mobs)if(!m.ko)try{_rf.call(this,m)}catch(e){}}return _rf.apply(this,arguments)}}
/* ---------- fim ---------- */
function tnFinish(won,quit){if(!TN.on)return;const p=G.p&&G.p[0],andar=Math.max(0,won?TNT:TN.g0+(TN.ph==='clear'?TN.g+1-TN.g0:TN.g-TN.g0))|0;
  const rec={andar,tempo:Math.round(TN.fr/60),trof:twTrofP(),char:TW.pick,d:Date.now()};TN.on=0;try{rkS('tnrun',null)}catch(e){}TW.on=false;TW.busy=false;G.diff=TW.diff0;
  for(const id of ['tnAct','tnHud','tnPick'])try{const e=document.getElementById(id);if(e){e.hidden=true;if(id==='tnPick'){e.className='';e.innerHTML=''}}}catch(e){}
  G.mode='tower';$('controls').hidden=true;$('pauseBtn').hidden=true;try{rainSound(0)}catch(e){}G.paused=false;if(!won&&!quit)try{nv('vGameOver',.3,1)}catch(e){}else if(won)try{nv('vCongratulations',.3,1)}catch(e){}
  if(andar>=1)twGiveTit('ini');if(andar>=4)twGiveTit('gue');if(andar>=TNP)twGiveTit('con');
  const tc=twLS.g('tw_tc',{});for(const t of TW.tr)tc[t.k]=(tc[t.k]||0)+1;twLS.s('tw_tc',tc);
  const R0=twLS.g('tw_rec',null),best=andar>0&&(!R0||twPts(rec)>twPts(R0));if(best)twLS.s('tw_rec',rec);
  if(andar>0){const Hh=twLS.g('tw_hist',[]);Hh.push(rec);Hh.sort((a,b)=>twPts(b)-twPts(a));twLS.s('tw_hist',Hh.slice(0,15))}
  try{if(andar>tnBest())localStorage.setItem('tn_best',andar)}catch(e){}try{btRec('torre',!!won,{x:'ANDAR '+andar})}catch(e){}
  TW.fl=andar;TW.last={won,quit,rec,best,xp:rkTwXP(won,quit,Math.max(0,andar-TN.g0)),tn:1};showScreen('tower');twRender();tnEndModal();if(andar>0&&twLS.g('tw_nome',''))twSubmit(rec);try{acSave(1)}catch(e){}}
function tnEndModal(){const L=TW.last;if(!L)return;const {won,quit,rec,best}=L,a=rec.andar,T=a>=TNP?'EXTREMA '+(a-TNP)+'/'+(TNT-TNP):'PRINCIPAL '+a+'/'+TNP,name=twLS.g('tw_nome','');
  const cnt={};for(const t of TW.tr)cnt[t.k]=(cnt[t.k]||0)+1;const tl=Object.keys(cnt).map(k=>`<span class="twT"><i>${TWTR[k].i}</i><b>${TWTR[k].n}</b><span>×${cnt[k]}</span></span>`).join('')||'<p class="twH">Nenhum troféu nesta subida.</p>';
  const bl=Object.keys(TN.bl||{}).map(k=>{const B=TNBL.find(x=>x.k===k);return B?`<span>${B.i} ${B.n}</span>`:''}).join('');
  twModal(`<div class="twM ${won?'gold':''}"><h3>${TN.ux?'💀 ULTRA EXTREMO · ':''}${won?'👑 VOCÊ CONQUISTOU AS DUAS TORRES!':quit?'VOCÊ DESISTIU':'VOCÊ CAIU NA TORRE'}</h3>
    <div class="twSt"><div><small>MOEDAS</small><b class="coin">🪙 +${TW.coinRun||0}</b></div><div><small>PERSONAGEM</small><b class="twCh"><img src="${IMG[rec.char]?IMG[rec.char].src:''}" alt="">${CH[rec.char]?CH[rec.char].name:''}</b></div><div><small>ANDARES</small><b>${a}/${TNT}</b><small>${T}</small></div><div><small>TEMPO</small><b>${twFmt(rec.tempo)}</b></div><div><small>TROFÉUS</small><b>🏆 ${rec.trof}</b></div></div>
    ${L.xp?rkTwXPH(L.xp):''}${best?'<div class="twNew">⭐ NOVO RECORDE DA TORRE ⭐</div>':''}${bl?`<div class="tnBlL">${bl}</div>`:''}${(TN.loot||[]).length?`<div class="tnBlL">${TN.loot.slice(0,14).map(x=>`<span>${x}</span>`).join('')}</div>`:''}
    <div class="twTs sm">${tl}</div>
    <div class="twSend">${a>0?`<input id="twName" maxlength="16" placeholder="Seu nome no ranking" value="${twEsc(name)}" readonly><button class="btn main" id="twSendB">ENVIAR</button><span id="twSendS"></span>`:'<span class="twH">Vença pelo menos 1 andar para entrar no ranking.</span>'}</div>
    <div class="row"><button class="btn main" id="twAgain">SUBIR DE NOVO</button><button class="btn" id="twRk">RANKING</button><button class="btn" id="twOut">SAIR</button></div></div>`);
  $('twAgain').onclick=()=>{twModal(null);tnGo()};$('twRk').onclick=()=>twRank();$('twOut').onclick=()=>{twModal(null);TW.last=null;rkOpen('menu')};
  if(a>0){$('twSendB').onclick=()=>twSubmit(rec);if(TW.sent){$('twSendS').textContent=TW.sendOk?'✓ Enviado para o ranking!':'Enviando...';$('twSendS').className='ok';$('twSendB').disabled=true}}}
{const _em=twEndModal;twEndModal=function(){if(TW.last&&TW.last.tn)return tnEndModal();return _em.apply(this,arguments)}}
{const _o=rkOpen;rkOpen=function(){if(TN.on&&G.mode!=='fight'){TN.on=0;TW.on=false;tnHud()}try{const b=document.getElementById('tnAct');if(b)b.hidden=true}catch(e){}return _o.apply(this,arguments)}}
/* ---------- tela nova do MODO TORRE (arte do dono 1847x851) ---------- */
const TNW=1847,TNH=851,tnB=(x0,y0,x1,y1)=>`left:${x0/TNW*100}%;top:${y0/TNH*100}%;width:${(x1-x0)/TNW*100}%;height:${(y1-y0)/TNH*100}%`;
const TNSP=[[1203,487,1373,536],[1203,427,1373,474],[1203,365,1373,413],[1203,303,1373,350],[1203,242,1373,291],[1203,180,1373,228]],TNSE=[[1600,519,1740,561],[1600,469,1740,511],[1600,419,1740,461],[1600,369,1740,411],[1600,319,1740,362]];
function tnSkin(){const B=$('twBox');if(!B||!TNA.menu||B.dataset.tn||!B.dataset.rk)return;B.dataset.tn=1;B.classList.add('tn5');B.querySelector('.twArt').src=TNA.menu;const bg=$('tower').querySelector('.twBg');if(bg)bg.style.backgroundImage=`url(${TNA.menu})`;
  const P=(id,b)=>{const e=$(id);if(e)e.setAttribute('style',tnB(...b))};
  P('twGo',[592,722,1194,820]);P('twBack',[34,736,370,820]);P('rtBack2',[0,8,165,100]);P('rtAv',[100,162,224,286]);P('rtNm',[238,192,524,262]);P('rtPick',[528,180,606,236]);
  const xp=B.querySelector('.rtXp');if(xp)xp.setAttribute('style',tnB(136,293,614,320));
  const BN={dano:[142,402],bars:[323,402],def:[500,402],vel:[142,447],crit:[323,447],sorte:[500,447]};for(const k in BN){const [x,y]=BN[k];P('rtB_'+k,[x+24,y-17,x+160,y+17])}
  P('rtRank',[72,494,208,574]);P('rtRw',[219,494,351,574]);P('rtTemp',[364,494,497,574]);P('rtRanks',[510,494,630,574]);
  const row=B.querySelector('.rtRow');if(row)row.setAttribute('style',tnB(63,601,637,682));const co=B.querySelector('.rtCoin');if(co)co.setAttribute('style',tnB(680,22,1010,66));
  const U=document.createElement('div');U.id='tnUI';
  U.innerHTML=`<button class="twHit tnTw" id="tnTP" style="${tnB(1010,0,1400,600)}" aria-label="Torre Principal"></button><button class="twHit tnTw" id="tnTE" style="${tnB(1440,110,1795,600)}" aria-label="Torre Extrema"></button>
    ${TNSP.map((b,i)=>`<div class="tnSl" id="tnSP${i}" style="${tnB(...b)}"></div>`).join('')}${TNSE.map((b,i)=>`<div class="tnSl ex" id="tnSE${i}" style="${tnB(...b)}"></div>`).join('')}
    <div class="tnSelT" id="tnSelT" style="${tnB(600,662,1190,716)}"></div><button class="tnQuit" id="tnQuit" style="${tnB(1215,742,1405,806)}">✖ DESISTIR</button><button class="tnUx" id="tnUx" style="${tnB(382,742,588,806)}"></button>`;B.appendChild(U);
  $('tnUx').onclick=()=>{if(!$('twModal').hidden)return;if(tnRun()){twToast('Termine ou desista da subida para trocar o modo','#ff8080');return}TNUX=TNUX?0:1;try{localStorage.setItem('tn_ux',TNUX)}catch(e){}twSfx(TNUX?'boom':'whoosh');twToast(TNUX?'💀 ULTRA LIGADO · só a força do personagem · prêmios x2,5':'Modo normal: seus itens contam',TNUX?'#ff5a4a':'#cfd6ea');tnMenu()};
  $('tnQuit').onclick=()=>{if(!tnRun()||!$('twModal').hidden)return;twModal(`<div class="twM sm"><h3>DESISTIR DA SUBIDA?</h3><p class="twH">Conta até o andar ${tnRun().g} e começa de novo do 1º.</p><div class="row"><button class="btn" id="tnQN">CONTINUAR</button><button class="btn main" id="tnQY">DESISTIR</button></div></div>`);$('tnQN').onclick=()=>twModal(null);$('tnQY').onclick=()=>{twModal(null);tnGiveUp()}};
  $('tnTP').onclick=()=>{TNSEL=0;try{localStorage.setItem('tn_sel',0)}catch(e){}twSfx('whoosh');tnMenu()};
  $('tnTE').onclick=()=>{if(tnBest()<TNP){twToast('🔒 Conquiste os 6 andares da TORRE PRINCIPAL para liberar a EXTREMA','#ff8080');return}TNSEL=1;try{localStorage.setItem('tn_sel',1)}catch(e){}twSfx('whoosh');tnMenu()};
  const go=$('twGo');go.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(!$('twModal').hidden||TW.busy)return;tnGo()},true)}
function tnMenu(){if(!$('tnUI'))return;const b=tnBest(),ex=b>=TNP,RN=tnRun();if(TNSEL===1&&!ex)TNSEL=0;
  TNSP.forEach((_,i)=>{const e=$('tnSP'+i);if(e){e.className='tnSl'+(b>i?' ok':'')+(TNSEL===0?' sel':'');e.innerHTML=`<b>${i+1}</b>${b>i?'<i>✔</i>':i===TNP-1?'<i>👑</i>':''}`}});
  TNSE.forEach((_,i)=>{const e=$('tnSE'+i);if(e){e.className='tnSl ex'+(b>TNP+i?' ok':'')+(!ex?' lock':'')+(TNSEL===1?' sel':'');e.innerHTML=`<b>${i+1}</b>${!ex?'<i>🔒</i>':b>TNP+i?'<i>✔</i>':i===TNT-TNP-1?'<i>☠️</i>':''}`}});
  $('tnTP').classList.toggle('on',TNSEL===0);$('tnTE').classList.toggle('on',TNSEL===1);
  const cur=RN?(RN.g<TNP?$('tnSP'+RN.g):$('tnSE'+(RN.g-TNP))):null;if(cur)cur.classList.add('cur');$('tnQuit').hidden=!RN;{const ux=RN?!!RN.ux:!!TNUX,e=$('tnUx');e.className='tnUx'+(ux?' on':'')+(RN?' lk':'');e.innerHTML=ux?'💀 ULTRA<br><small>LIGADO</small>':'💀 ULTRA<br><small>EXTREMO</small>'}
  const info=RN?`▶ <b>${RN.g>=TNP?'EXTREMA':'PRINCIPAL'} · ANDAR ${tnFl(RN.g).n}</b> ❤️${Math.round(100*RN.hp/((RN.bars||TWPB)*LAYER))}%`:(TNSEL===1?'☠️ <b>EXTREMA</b>':'🏯 <b>PRINCIPAL</b>');
  $('tnSelT').innerHTML=`<span class="tnInf">${info}</span>`+TNRK.map(r=>`<button class="tnRk${r.k===TNRISK?' on':''} r${r.k}" data-k="${r.k}" title="${r.d}">${r.i} ${r.n}</button>`).join('');
  $('tnSelT').querySelectorAll('.tnRk').forEach(b=>b.onclick=e=>{e.stopPropagation();TNRISK=+b.dataset.k;try{localStorage.setItem('tn_risk',TNRISK)}catch(_){}twSfx('whoosh');twToast(TNRK[TNRISK].i+' '+TNRK[TNRISK].n+': '+TNRK[TNRISK].d,'#ffd23f');tnMenu()})}
{const _op=twOpen;twOpen=function(){const r=_op.apply(this,arguments);try{const R=tnRun();if(R){tnRestore(R);twRender()}}catch(e){}return r}}
{const _bk=twBackF;twBackF=function(){if(tnRun()&&!TN.on){if(!$('twModal').hidden)return;twSfx('whoosh');TW.last=null;TW.on=false;rkOpen('menu');return}return _bk.apply(this,arguments)}}
{const _dn=drawDN;drawDN=function(S){let l,f,fix=0;try{dnSet(S.key);const n=CUP&&CUP.L?CUP.L.length:0;if(n&&!(DN.lv>=0&&DN.lv<n&&DN.from>=0&&DN.from<n)){l=DN.lv;f=DN.from;fix=1;DN.lv=Math.max(0,Math.min(n-1,DN.lv|0));DN.from=Math.max(0,Math.min(n-1,DN.from|0))}}catch(e){}
  try{return _dn.apply(this,arguments)}finally{if(fix&&DN.key!==S.key){DN.lv=l;DN.from=f}}}}
/* v384: (1) botão de COMBO do Shaka ignorava a espera de 3 s (o bloqueio existia para os outros, faltava o isSk);
   (2) a ENERGIA da transformação parava de encher enquanto o combo rodava (o updFighter sai antes da linha que enche) */
{const _tc=tryCommon;tryCommon=function(f,o){if(f&&bufd(f,'sp')&&(f.spCD||0)>G.frame&&isSk(f)){use(f,'sp');if(!f.cpu)say(f,'COMBO EM '+Math.ceil((f.spCD-G.frame)/60)+'s');return false}return _tc.apply(this,arguments)}}
{const _uf=updFighter;updFighter=function(f,o){const s0=f?f.sb||0:0;const r=_uf.apply(this,arguments);try{if(f&&!f.ko&&!G.trans&&(G.phase==='fight'||G.phase==='cine')&&(CMBS[f.state]||f.inCmb)&&(f.sb||0)===s0&&s0<6){const o0=s0;f.sb=Math.min(6,o0+(f.tsb||1)/SB_FR);if(Math.floor(f.sb)>Math.floor(o0)){txt(f.x,f.y-240,'ENERGIA '+Math.floor(f.sb)+'/6','#7ff3ff');if(!f.cpu)SFX.praise()}}}catch(e){}return r}}
{const _up=update;update=function(){const hs=G.hitstop>0;const r=_up.apply(this,arguments);try{if(hs&&G.p&&!G.trans&&(G.phase==='fight'||G.phase==='cine'))for(const f of G.p){if(f&&!f.ko&&(CMBS[f.state]||f.inCmb)&&(f.sb||0)<6)f.sb=Math.min(6,(f.sb||0)+(f.tsb||1)/SB_FR)}}catch(e){}return r}}
/* v387 (TESTE): CABELO DO SHAKA COM VENTO — pose parada separada em corpo + juba (ferramentas/personagens/shaka/cabelo/separar.py, RQA.skhair).
   A juba é desenhada em fatias verticais: presa na raiz (perto da cabeça) e cada vez mais solta para a ponta; balança sozinha e reage a andar/correr/pular/transformar. */
const SKH=RQA.skhair||{},SKHI={};let SKHF=null,SKHON=1;try{SKHON=localStorage.getItem('sk_hair')==='0'?0:1}catch(e){}
const skhAdm=()=>{if(skhAdm.v!=null&&G.frame-skhAdm.t<600)return skhAdm.v;skhAdm.t=G.frame;try{return skhAdm.v=twIsAdm()}catch(e){return skhAdm.v=false}};
const skhImg=src=>SKHI[src]||(SKHI[src]=Object.assign(new Image(),{src}));
{const _rf=renderFighter;renderFighter=function(f){const o=SKHF;SKHF=f;try{return _rf.apply(this,arguments)}finally{SKHF=o}}}
{const _bd=blitD;blitD=function(im,S,e){const f=SKHF;if(SKHON&&f&&f.def&&f.def.id==='shaka'&&(SKHON===2||skhAdm())&&im&&im.tagName==='IMG'&&!(e&&e.cape)){let k=im._skh;if(k===undefined){const n=(im.getAttribute('src')||'').split('/').pop();k=im._skh=SKH[n]||0}
    if(k){const B=skhImg(k.b),Hi=skhImg(k.h);if(B.naturalWidth&&Hi.naturalWidth){_bd.call(this,B,S,e);try{const R0=Math.max(0,k.rx*S.w-3);ctx.save();ctx.beginPath();ctx.rect(-S.ax+R0,-S.ay-80,S.w+80,S.h+160);ctx.clip();_bd.call(this,Hi,S,e);ctx.restore();skhDraw(Hi,S,e||{},f,k)}catch(_){}return}}}
  return _bd.apply(this,arguments)}}
function skhDraw(im,S,e,f,k){const kU=e.kU||0,kH=e.kH||0,R=k.rx*S.w,rx=im.width/S.w,t=G.frame+(f.x||0)*.01;ctx.save();
  if(Math.abs(kU)>=.0015||Math.abs(kH)>=.0015){const yb1=-S.ay+Math.round(S.h*.56);ctx.transform(1,0,-kU,1,kU*yb1,0)}
  
  const m=Math.min(1,Math.abs(f.vx||0)/6),air=!f.grounded&&f.state!=='idle',st=f.state,pw=st==='transform'||st==='charge'||st==='pw'?1:0,
    A=(1+m*.9+pw*1.4),lift=air?((f.vy||0)<0?4:-3):0,step=G.hq?2:3;
  for(let x=0;x<R;x+=step){const w=Math.min(step,R-x),d=R-(x+w/2),q=Math.pow(d/R,1.35),
    dy=(Math.sin(t*.07-d*.05)*2.4+Math.sin(t*.029-d*.018)*1.6)*q*A+lift*q-pw*q*3*Math.abs(Math.sin(t*.2-d*.04)),
    dx=-(1.2+Math.sin(t*.041)*.9+m*4+pw*3)*q*q;
    if(x>=R-3&&Math.abs(dx)<.05&&Math.abs(dy)<.05)continue;ctx.drawImage(im,x*rx,0,(w+1)*rx,im.height,-S.ax+x+dx,-S.ay+dy,w+1,S.h)}
  ctx.restore()}
/* v388: NARRAÇÃO EM PORTUGUÊS (voz do dono, ElevenLabs) — RQA.vozpt {chave: [arquivos]}; escolha em Configuração (Português / Inglês original).
   Troca no smp(): todo áudio de VOZ (nv, rounds, nomes) com versão PT toca a PT; o que não tem PT continua em inglês. Extras só em PT: provocações, tempo esgotado, novo recorde. */
const VPT={};let VOZ='pt';try{VOZ=localStorage.getItem('voz')==='en'?'en':'pt'}catch(e){}
try{const P=RQA.vozpt||{};for(const k in P){VPT[k]=P[k].map((src,i)=>{const kk='pt'+i+'_'+k;SMP[kk]=src;return kk})}if(VPT.nS1&&!VPT.nS2)VPT.nS2=VPT.nS1;if(P.nm_shaka&&!SMP.nm_shaka)SMP.nm_shaka=P.nm_shaka[0]}catch(e){}
{const _sm=smp;smp=function(k,vol,o){if(VOZ==='pt'&&o&&o.vox&&VPT[k]){const L=VPT[k].filter(x=>SB[x]);if(L.length)return _sm.call(this,L[(Math.random()*L.length)|0],vol,o)}return _sm.apply(this,arguments)}}
const vozX=(k,at)=>{if(VOZ!=='pt'||!VPT[k])return;try{nv(k,at||0,1)}catch(e){}};
{const _kc=koCall;koCall=function(a,d){let last=1;try{const w=G.p.indexOf(a);last=(G.wins[w]||0)+1>=2}catch(e){}const r=_kc.apply(this,arguments);try{if(VOZ==='pt'&&a&&!a.cpu&&!last&&Math.random()<.7)setTimeout(()=>vozX('xProv'),1700)}catch(e){}return r}}
{const _to=timeOver;timeOver=function(){vozX('xTempo');return _to.apply(this,arguments)}}
{const _bd2=tnBossDown;tnBossDown=function(a,d){const r=_bd2.apply(this,arguments);if(TN.g<TNT-1)setTimeout(()=>{if(TN.on)vozX('xProv')},1500);return r}}
{const _em2=tnEndModal;tnEndModal=function(){const r=_em2.apply(this,arguments);try{if(TW.last&&TW.last.best)setTimeout(()=>vozX('xRecorde'),1400)}catch(e){}return r}}
function vozBtn(){const R=document.querySelector('#config .row.cfg');if(!R||document.getElementById('vozBtn'))return;const b=document.createElement('button');b.className='btn';b.id='vozBtn';
  const t=()=>{b.textContent='Narração: '+(VOZ==='pt'?'Português 🇧🇷':'Inglês (original)')};t();b.onclick=()=>{VOZ=VOZ==='pt'?'en':'pt';try{localStorage.setItem('voz',VOZ)}catch(e){}t();try{smpLoad();nv('vMChallenge',0,1)}catch(e){}};R.insertBefore(b,R.children[1]||null)}
try{vozBtn()}catch(e){}document.addEventListener('DOMContentLoaded',()=>{try{vozBtn()}catch(e){}});
/* ================= v389: EVENTO DO SHAKA no Modo Boss (5 dias) + cenário TEMPLO DE VIRGEM (inteiro → rachado → destruído) ================= */
const SKA=RQA.shk||{};if(SKA.lobby)RQA.boss_sk=SKA.lobby;if(SKA.pick)RQA.shk_pick=SKA.pick;
function skSlot(a,b){const on=skOn();return `<button class="ysSlot skSlot ${on?'':'off'}" data-a="bsel" data-b="shaka" style="${rkB(12,a,415,b)}"><img src="${IMG.shaka?IMG.shaka.src:''}" alt=""><b>Shaka</b><em>${on&&!skAntes()?'EVENTO · '+skLeft():skAntes()?'LIBERA 12:00':'ENCERRADO'}</em></button>`}
function skLobbyH(){const sel=rkG('sel','goku'),ri=rkRank(rkG('rp',0)),P=rkPhB(ri);let cn=0;try{cn=twCoins()}catch(e){}
  const RW=[[RQA.coin[0],'2-15','💎 Ranqueado: 5 a 15 · Farm do evento: 2 a 14 (pela dificuldade)'],[RQA.lvi.po[3],'PÓ','🟣 '+LVPON+' e cristais de elevação · muito mais no farm do evento'],[twIco('arm','epica'),'EQUIP.','🛡️ Equipamentos do jogo (25% a 50% no farm, raridade melhor nas dificuldades altas)'],
    [(SKA.v2&&SKA.v2.skros)||RQA.ssp.skros,'V2',`✦ EVOLUÇÃO V2: vencendo o Shaka, um item de Virgem que você JÁ TEM pode evoluir para V2 (+35% em tudo + efeito especial) · chance ${String(skV2Ch()).replace(".",",")}% no seu rank (0,3% no 1º rank até 3% no mais alto) · itens de Virgem: 0,3% no farm DIFÍCIL+, 0,2% no ranqueado`],[IMG.shaka?IMG.shaka.src:'','✦ 0,5%','✦ Farm MESTRE e SUPER DIFÍCIL: 0,5% de ganhar o SHAKA · a SORTE aumenta a chance']];
  const RX=[[470,565],[573,665],[673,765],[773,868],[875,970]];
  return `<button class="hs" data-a="back" style="${rkB(15,18,640,105)}"></button>
  <div class="skCur" style="${rkB(1384,17,1428,50)}">${rkFmtN(rkG('gem',0))}</div><div class="skCur" style="${rkB(1477,17,1522,50)}">${rkFmtN(cn)}</div><div class="skCur" style="${rkB(1574,17,1618,50)}">${rkFmtN(rkG('tic',0))}</div>
  <button class="hs" data-a="bsel" data-b="broly" style="${rkB(15,188,432,282)}"></button>
  <button class="hs ${ysOn()?'':'skOff'}" data-a="bsel" data-b="yuta" style="${rkB(15,293,425,388)}"></button>
  <button class="hs on" data-a="boxinfo" data-t="Shaka do evento: ranqueado no nível do seu rank (${P[0]} barras → abre os olhos com ${P[1]}) · farm com 5 dificuldades" style="${rkB(15,396,432,490)}"></button>
  ${[[505,598],[607,698],[700,745]].map(([a,b])=>`<button class="hs" data-a="lock" style="${rkB(15,a,420,b)}"></button>`).join('')}
  <div class="skEvT" style="${rkB(800,414,955,450)}">${skLeft()}</div>
  <button class="hs" data-a="boxinfo" data-t="🪷 SHAKA · O Cavaleiro de Virgem · ${P[0]} barras → ${P[1]} barras · o TEMPLO DE VIRGEM desmorona durante a luta" style="${rkB(490,462,905,585)}"></button>
  ${RW.map(([im,t,d],i)=>`<div class="rkBox skRw ${i>2?'ysY':''}" data-a="boxinfo" data-t="${d}" style="${rkB(RX[i][0]+4,676,RX[i][1]-4,778)}"><img src="${im}" alt=""${i===4?' class="pt"':''}><b>${t}</b></div>`).join('')}
  <div class="rkOn ys skOn" style="${rkB(1602,536,1700,568)}"><i></i><span id="rkOnN">...</span></div>
  <div class="rkChL" id="rkChL" style="${rkB(1112,578,1735,652)}"><p class="twH">Carregando...</p></div>
  <input class="rkChI skChI" id="rkChI" maxlength="140" placeholder="" autocomplete="off" style="${rkB(1186,662,1684,697)}">
  <button class="hs" data-a="chat" style="${rkB(1688,658,1732,702)}"></button>
  <button class="hs" data-a="equip" style="${rkB(988,622,1097,712)}"></button>
  <div class="skPort" style="${rkB(997,733,1083,814)}"><img src="${IMG[sel]?IMG[sel].src:''}" alt=""></div><div class="skPN" style="${rkB(1086,738,1170,768)}">${CH[sel]?CH[sel].name:''}</div>
  <button class="hs" data-a="sel" style="${rkB(990,725,1172,822)}"></button>
  <button class="hs skGo" data-a="start" style="${rkB(1192,732,1640,824)}"><span class="shine"></span></button>`}
/* escolher: ranqueado (dá XP) ou farm do evento (5 dificuldades, sem XP) */
/* v393: tela de escolha com a arte do dono (`skp`, RQA.shk.pick, 1847×851): ranqueado, 11 níveis mais baixos, 5 dificuldades do farm */
function skStart(){if(!skOn()){rkToast('⏳ O evento do Shaka acabou','#cfd6ea');RKBID='broly';return rkView('boss')}rkView('skp')}
function skPickH(){const ri=rkLvl(),P=rkPhB(ri),v2=String(skV2Ch()).replace('.',','),s0=Math.max(0,ri-11);
  const LV=[[543,318,682,398],[698,318,836,398],[852,318,990,398],[1007,318,1149,398],[1165,318,1308,398],[1324,318,1464,398],[1480,318,1622,398],[762,413,908,490],[922,413,1070,490],[1086,413,1232,490],[1248,413,1396,490]];
  const DF=[[502,548,720,688],[737,548,953,688],[972,548,1190,688],[1207,548,1423,688],[1441,548,1660,688]];
  return `<button class="hs" data-a="back" style="${rkB(890,722,1242,798)}"></button>
  <div class="skpT" style="${rkB(1440,128,1690,160)}">⏳ ${skLeft()}</div>
  <button class="hs skpRk" data-a="skgo" data-i="-1" style="${rkB(522,166,1644,288)}"><span>NÍVEL ${ri+1} · ${P[0]} → ${P[1]} barras · dá XP de rank · ✦ V2 ${v2}%</span></button>
  <div class="skpH" style="${rkB(540,292,1625,318)}">⬇️ Ficou difícil? Lute num nível mais baixo · mais fácil · drops menores · sem XP de rank</div>
  ${LV.map((c,k)=>{const l=s0+k,ok=l<ri,me=l===ri;return `<button class="hs skpLv ${ok?'':me?'me':'lk'}" ${ok?`data-a="skgo" data-i="-1" data-l="${l}"`:`data-a="boxinfo" data-t="${me?'Este é o seu rank: use o RANQUEADO':'🔒 Acima do seu rank'}"`} style="${rkB(...c)};--c:${(RKR[l]||RKR[0]).c}"><b>${me?'★ ':ok?'':'🔒 '}NÍV. ${l+1}</b><small>${l<=RKTOP?rkPhB(l)[0]+'→'+rkPhB(l)[1]:''}</small></button>`}).join('')}
  <div class="skpH" style="${rkB(540,522,1000,546)}">🪷 FARM DO EVENTO · sem XP · passivas sorteadas</div><div class="skpH dv" style="${rkB(1080,522,1625,546)}">✦ 5 itens V2 = ARMADURA DIVINA → FORMA DIVINA do Shaka</div>
  ${YSDIF.map((x,i)=>`<button class="hs skpDf" data-a="skgo" data-i="${i}" style="${rkB(...DF[i])};--c:${x.c}"><span><b>${x.n}</b><small>${skFph(x)[0]}→${skFph(x)[1]} barras</small>${x.yt?'<em>✦ SHAKA 0,5%</em>':x.sec?'<em>✦ ITENS 0,3%</em>':''}</span></button>`).join('')}`}
function skGo(i,l){i=+i;rkModal(null);if(!skOn()){rkToast('⏳ O evento do Shaka acabou','#cfd6ea');return}RKBID='shaka';RKYD=i>=0?i:null;RKSEL=i<0&&l!=null?+l:null;skPpPick()}
const skFph=D=>D.ph.map(x=>Math.round(x*1.5));
/* passivas do farm do Shaka (sorteadas, sem roleta) */
const SKPOOL=[['blk','dge','crit','ki'],['reg','rage','bar','curse'],['fury','sup','vamp']],SKPN={crit:['👁️','SEXTO SENTIDO'],curse:['🌸','TESOURO DO CÉU']};
const skPn=k=>SKPN[k]||YSPN[k];
function skRoll(d){const D=YSDIF[d],out=[];D.np.forEach((n,t)=>{const P=SKPOOL[t].slice();for(let i=0;i<n&&P.length;i++)out.push(P.splice((Math.random()*P.length)|0,1)[0])});return out}
{const _ya=ysApply;ysApply=function(o){if(RKBID!=='shaka')return _ya.apply(this,arguments);o.rkPS=null;o.ysK=1;if(RKYD==null)return;const D=YSDIF[RKYD];o.ysK=D.k;o.rkPhB=skFph(D);o.mhp=o.rkPhB[0]*LAYER;o.hp=o.hpLag=o.mhp;o.rkHp=o.hp;o.rkB.dm*=D.k;o.tdm=o.rkB.dm;
  const L=skRoll(RKYD);o.rkPS={};for(const k of L)o.rkPS[k]=1;setTimeout(()=>{try{if(L.length)txt(o.x,o.y-330,L.map(k=>skPn(k)[0]+' '+skPn(k)[1]).join(' · '),'#ffe08a')}catch(e){}},2200)}}
/* drops do Shaka: farm (igual ao do Yuta) + itens de Virgem e o próprio Shaka */
{const _rr3=rkResult;rkResult=function(R){if(R.bn!=='SHAKA')return _rr3.apply(this,arguments);const L=lvLuck(),it=[],after=[];
  const sec=pct=>{const left=skSecLeft();if(left.length&&Math.random()*100<pct*L){const k=left[(Math.random()*left.length)|0];rkGiveSp(k);it.push(`<span class="spd" style="--c:#ffd84a"><img src="${RKSP[k].img}" alt="">✦ ${RKSP[k].nm}</span>`);after.push(()=>rkSecWin(k))}};
  if(R.yd!=null){const D=YSDIF[R.yd];
    if(R.won){const g=Math.min(GEMCAP,Math.round(ysRnd(D.gem)*(1+(Math.min(3,L)-1)*.5)*Math.min(3,rkEvG())));rkAdd('gem',g);it.push(`<span style="--c:#5ab8ff"><img src="${RQA.coin[0]}" alt="">🪷 +${g}</span>`);
      const po=Math.round(ysRnd(D.po)*L);rkS('po',lvPo()+po);it.push(`<span style="--c:#b57bff"><img src="${poIco(po)}" alt="">🪷 +${po} PÓ</span>`);
      if(Math.random()<.35*L){const c=Math.min(4,lvCrRoll()+(D.er>1?1:0));lvGive({cr:[c,1]});it.push(`<span style="--c:${RKRC[c]}"><img src="${RQA.lvi.cr[c]}" alt="">CRISTAL ${RKRNM[c]}</span>`)}
      if(Math.random()<D.eq*L){const E=TWEQ[(Math.random()*TWEQ.length)|0];let Rr=twEqRoll();for(let i=0;i<D.er;i++){const R2=twEqRoll();if(TWEQR.indexOf(R2)>TWEQR.indexOf(Rr))Rr=R2}twAddItem(E,Rr);it.push(`<span style="--c:${Rr.c}"><img src="${twIco(E.k,Rr.k)}" alt="">${E.n} ${Rr.n}</span>`)}
      if(D.sec)sec(D.sec);
      if(D.yt&&!skOwned()&&Math.random()*100<D.yt*L){const own=rkG('own',[]);own.push('shaka');rkS('own',own);it.push(`<span class="spd" style="--c:#ffd84a"><img src="${IMG.shaka.src}" alt="">✦ SHAKA!</span>`);after.push(()=>rkMegaS().then(()=>rkCharWin('shaka',1,1)).then(()=>skTitClaim(1)))}}
    else{const po=Math.round(ysRnd([2,5])*L);rkS('po',lvPo()+po);it.push(`<span style="--c:#b57bff"><img src="${poIco(po)}" alt="">🪷 +${po} PÓ</span>`)}}
  else if(R.won)sec(R.farm?.1:.2);
  try{acSave()}catch(e){}
  const r=_rr3.apply(this,arguments);try{const C=document.querySelector(RKMS()+'.rkItems');if(C&&it.length)C.insertAdjacentHTML('beforeend',it.join(''))}catch(e){}
  if(after.length)setTimeout(async()=>{for(const f of after)await f()},R.won?2200:300);return r}}
/* ---------- cenário TEMPLO DE VIRGEM (`shk`, só no boss Shaka): 3 estados × 4 camadas com parallax (céu, meio, templo+estátua, chão) ---------- */
const SHK={ph:0,from:0,k:1,I:[],pet:[]};
try{if(SKA.L){STG.shk={lit:.9,bloom:.4,dust:'#e8d0ff',peb:'#8a7aa0',name:'TEMPLO DE VIRGEM',ww:2400,dw:2606,dh:869,dy:-186,refl:.14,w:['clear'],nw:1,hid:1,camMax:1.15,camMin:.9,key:'shk',src0:SKA.L[0][3][0],img:new Image(),shk:1};
  try{LT.shk={rim:'#ffe6b8',lx:-.2,ly:-.9,amb:'#4a2a6a',aa:.12,bnc:'#8a6a9a',ba:.12,pt:'dust',mote:'#ffd0ec'}}catch(e){}}}catch(e){}
function shkImgs(i){if(!SKA.L||!SKA.L[i])return Promise.resolve();if(SHK.I[i])return SHK.I[i].P;const im=SKA.L[i].map(()=>new Image());
  const P=Promise.all(im.map((m,j)=>new Promise(r=>{m.decoding='async';m.onload=()=>{(m.decode?m.decode():Promise.resolve()).catch(()=>{}).then(r)};m.onerror=()=>r();m.src=SKA.L[i][j][0]})));SHK.I[i]={im,P};return P}
{const _sl=stageLoad;stageLoad=function(k){const S=STG[k];if(k==='shk'&&S){if(S._ld)return S._ld;S.img=new Image();S.img.src=S.src0;return S._ld=shkImgs(0).then(()=>{setTimeout(()=>{shkImgs(1).then(()=>shkImgs(2))},1200)})}return _sl.apply(this,arguments)}}
{const _sf=stageFree;stageFree=function(keep){try{if(!keep||!keep.includes('shk'))SHK.I=[]}catch(e){}return _sf.apply(this,arguments)}}
function shkLay(i){const L=SKA.L[i],O=SHK.I[i];if(!O)return 0;let n=0;for(let j=0;j<L.length;j++){const m=O.im[j];if(!m||!m.complete||!m.naturalWidth)continue;const [,p,w,h,dy]=L[j];ctx.drawImage(m,lx18(p,w),dy,w,h);n++}return n}
function shkDraw(){if(!shkLay(SHK.k<1?SHK.from:SHK.ph)&&SHK.ph)shkLay(0);if(SHK.k<1){ctx.save();ctx.globalAlpha=SHK.k;shkLay(SHK.ph);ctx.restore()}shkFx()}
/* pétalas (inteiro), pétalas + poeira (rachado), brasas (destruído) */
function shkFx(){const P=SHK.pet,vl=CAM.x-40,vw=VW/CAM.z+80,n=G.hq===false?10:22;while(P.length<n)P.push({x:vl+Math.random()*vw,y:-60+Math.random()*560,v:.4+Math.random()*.9,s:3+Math.random()*4,ph:Math.random()*6.3});
  const em=SHK.ph===2;ctx.save();if(em)ctx.globalCompositeOperation='lighter';
  for(const q of P){if(!(G.paused||G.hitstop>0)){q.ph+=.04;q.y+=em?-q.v*1.3:q.v;q.x+=em?Math.sin(q.ph)*.6:Math.sin(q.ph)*1.1-.3}
    if(q.y>560||q.y<-80||q.x<vl-40||q.x>vl+vw+40){q.x=vl+Math.random()*vw;q.y=em?540:-60}
    ctx.globalAlpha=em?.55+.35*Math.sin(q.ph*3):.75;ctx.fillStyle=em?(q.s>5?'#ffb040':'#ff6a20'):(SHK.ph===1&&q.s<4?'#cfc2d8':'#ffb8de');
    ctx.beginPath();ctx.ellipse(q.x,q.y,em?q.s*.45:q.s,em?q.s*.45:q.s*.55,q.ph,0,TAU);ctx.fill()}
  ctx.restore()}
{const _ds=drawStageLayers;drawStageLayers=function(){if(STAGE&&STAGE.shk&&SKA.L)return shkDraw();return _ds.apply(this,arguments)}}
function shkSet(n){if(n<=SHK.ph||SHK.want>=n)return;SHK.want=n;const go=()=>{if(!STAGE||!STAGE.shk||n<=SHK.ph)return;SHK.from=SHK.ph;SHK.ph=n;SHK.k=0;G.shake=Math.max(G.shake,n===2?34:24);G.flash=Math.max(G.flash||0,8);G.flashCol=n===2?'#ffb070':'#fff2d0';
    for(let i=0;i<(n===2?46:28);i++)addP({x:CAM.cx+rand(-520,520),y:rand(-40,260),vx:rand(-1.5,1.5),vy:rand(2,6),life:60,max:60,c:i%3?'#d8c8e8':'#9a8aa8',type:'glow',sz:rand(4,10),g:.12});
    try{SFX.boom&&SFX.boom()}catch(e){}buzz(n===2?260:160);
    if(n===2)banner('O TEMPLO DE VIRGEM DESMORONOU!','#ffb040',110,'O SHAKA ESTÁ NO LIMITE');else txt(CAM.cx,170,'O TEMPLO ESTÁ RACHANDO!','#ffe08a')};
  if(SHK.I[n])SHK.I[n].P.then(go);else shkImgs(n).then(go)}
{const _rt=rkTick;rkTick=function(){const r=_rt.apply(this,arguments);try{if(STAGE&&STAGE.shk&&G.p){if(SHK.k<1)SHK.k=Math.min(1,SHK.k+1/45);const o=G.p[1];if(o&&o.rkB){const w=o.rkPh===2?(o.hp/(o.mhp||1)<=.45?2:1):0;if(w>SHK.ph)shkSet(w)}}}catch(e){}return r}}
{const _ap=rkApply;rkApply=function(){SHK.want=0;SHK.ph=0;SHK.from=0;SHK.k=1;SHK.pet=[];return _ap.apply(this,arguments)}}
/* ================= v390: SHAKA — passiva antes da luta (comum → primordial), +20% jogando COM o Shaka, 7 min de luta, EVOLUÇÃO V2 do equipamento de Virgem ================= */
const SKV2=(SKA.v2)||{};
const SKPPT=[['dano','💥','FÚRIA DE VIRGEM','de dano',[5,8,12,17,23,30,40,55]],['def','🛡️','ESCUDO DO KAN','de defesa',[5,8,12,17,23,30,40,55]],['vel','⚡','PASSOS DE BUDA','de velocidade',[3,5,8,11,15,19,24,30]],
  ['crit','🎯','SEXTO SENTIDO','de crítico',[4,7,10,14,19,25,32,42]],['vamp','🩸','RODA DA REENCARNAÇÃO','de roubo de vida',[2,3,5,7,10,13,17,22]],['trf','🔥','COSMO DESPERTO','de energia de transformação',[5,8,12,17,23,30,40,55]]];
const SKPPW=[38,26,17,10,5.5,2.5,.8,.2];let SKPP=null;
function skPpRoll(){let t=Math.random()*SKPPW.reduce((a,b)=>a+b,0),i=0;for(;i<SKPPW.length-1;i++){t-=SKPPW[i];if(t<0)break}return i}
function skPpPick(){SKPP=null;const T=twShuf(SKPPT.slice()).slice(0,3),O=T.map(t=>{const ri=skPpRoll();return {t,ri,r:PSRK[ri],v:t[4][ri]}}),me=rkG('sel','goku')==='shaka';
  rkModal(`<div class="twM skPp"><h3>🪷 ESCOLHA SUA PASSIVA <small>vale só nesta luta contra o Shaka · comum até primordial</small></h3>
    <div class="skPpC">${O.map((o,i)=>`<button data-i="${i}" class="${o.ri>=6?'hi':''}" style="--c:${PSRC[o.r]}"><small>${psRN(o.r)}</small><i>${o.t[1]}</i><b>${o.t[2]}</b><span>+${o.v}% ${o.t[3]}</span></button>`).join('')}</div>
    <p class="twH">${me?'🪷 Lutando COM o Shaka: <b style="color:#ffd84a">+20% de dano e de defesa</b> no evento':'🪷 Lute COM o Shaka para ganhar +20% de dano e de defesa no evento'}</p></div>`);
  if(O.some(o=>o.ri>=6))try{rkSfx('powerUp')}catch(e){}
  document.querySelectorAll('.skPp [data-i]').forEach(b=>b.onclick=e=>{e.stopPropagation();const o=O[+b.dataset.i];SKPP={k:o.t[0],v:o.v,r:o.r,n:o.t[2],i:o.t[1]};rkSfx('whoosh');rkModal(null);rkBossStart()})}
{const _ap=rkApply;rkApply=function(){const r=_ap.apply(this,arguments);try{if(G.gmode==='boss'&&G.p&&RKBID==='shaka'){const p=G.p[0],L=[];
    if(G.pick==='shaka'){p.tdm=(p.tdm||1)+.2;p.tdf=1/(1/(p.tdf||1)+.2);L.push('🪷 SHAKA NO EVENTO +20%')}
    const P=SKPP;if(P){const v=P.v;if(P.k==='dano')p.tdm=(p.tdm||1)+v/100;else if(P.k==='def')p.tdf=1/(1/(p.tdf||1)+v/100);else if(P.k==='vel')p.tsp=(p.tsp||1)+v/100;else if(P.k==='crit')p.tcr=(p.tcr||0)+v;else if(P.k==='vamp')p.skVamp=v/100;else if(P.k==='trf')p.tsb=(p.tsb||1)+v/100;
      L.push(P.i+' '+P.n+' +'+v+'% ('+psRN(P.r)+')')}
    if(L.length)setTimeout(()=>{try{txt(p.x,p.y-300,L.join(' · '),SKPP?PSRC[SKPP.r]:'#ffd84a')}catch(e){}},1600)}}catch(e){}return r}}
{const _ah=applyHit;applyHit=function(a,d,h){const h0=d?d.hp:0,r=_ah.apply(this,arguments);try{if(r&&a&&a.skVamp&&!a.ko&&d&&h0>d.hp){a.hp=Math.min(a.mhp||MAXHP,a.hp+(h0-d.hp)*a.skVamp);a.hpLag=Math.max(a.hpLag||0,a.hp)}}catch(e){}return r}}
{const _bg=rkBossGo;rkBossGo=function(){const r=_bg.apply(this,arguments);try{if(RKBID==='shaka'&&G.gmode==='boss'&&G.tlim!==0)G.timer=420}catch(e){}return r}}
/* EVOLUÇÃO V2: vencendo o Shaka, um item de Virgem que você JÁ TEM evolui (não vem item novo). Chance 0,3% (rank 1) → 3% (rank mais alto). V2 = +35% em todos os atributos + efeito especial */
const skV2Ch=lv=>+(0.3+2.7*Math.min(1,(lv==null?rkLvl():lv)/RKTOP)).toFixed(2);
function skV2Evo(it){const k=SKSEC.find(q=>RKSP[q].nm===it.nm);if(!k)return false;for(const f of ['v','dmg','crit','def','vel','st','drop','trf','fdmg'])if(typeof it[f]==='number'&&it[f])it[f]=Math.round(it[f]*1.35);
  it.v2=1;it.skb=k;it.nm=(SKDN[k]||RKSP[k].nm)+' V2';if(SKV2[k])it.img=SKV2[k];return true}
function skV2Win(it){return new Promise(res=>{const O=document.createElement('div');O.className='rkWin end sec skV2W';O.innerHTML=`<div class="t"><b>✦ EVOLUÇÃO V2! ✦</b><span>${it.nm}</span></div><img class="fl" src="${it.img}" alt=""><i class="rays"></i><div class="t2">+35% em tudo · ${rkSpTxt(it)}</div>`;rkHost().appendChild(O);rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),300);setTimeout(()=>{O.onclick=()=>{O.remove();res()}},500)})}
{const _rr4=rkResult;rkResult=function(R){if(R.bn!=='SHAKA'||!R.won)return _rr4.apply(this,arguments);let ev=null;
  try{if(Math.random()*100<skV2Ch(R.farm?R.farm-1:null)){const I=twInv(),C=I.filter(x=>x&&!x.v2&&SKSEC.some(q=>RKSP[q].nm===x.nm));if(C.length){const it=C[(Math.random()*C.length)|0];if(skV2Evo(it)){twLS.s('tw_inv',I);ev=Object.assign({},it);try{acSave()}catch(e){}}}}}catch(e){}
  const r=_rr4.apply(this,arguments);if(ev){try{const C=document.querySelector(RKMS()+'.rkItems');if(C)C.insertAdjacentHTML('beforeend',`<span class="spd" style="--c:#ffd84a"><img src="${ev.img}" alt="">✦ ${ev.nm}</span>`)}catch(e){}setTimeout(()=>{skV2Win(ev)},2700)}return r}}
/* efeito especial dos itens V2: brilho dourado/roxo em todo lugar que o ícone aparece + faíscas na luta para quem usa V2 */
try{const st=document.createElement('style');st.textContent=Object.values(SKV2).map(u=>`img[src="${u}"]`).join(',')+'{animation:skv2g 1.6s ease-in-out infinite!important}';document.head.appendChild(st)}catch(e){}
const skV2n=()=>{try{const q=twEqOn();let n=0;for(const k in q)if(q[k]&&q[k].v2)n++;return n}catch(e){return 0}};
{const _up=update;update=function(){const r=_up.apply(this,arguments);try{if(G.mode==='fight'&&G.p&&G.p[0]){if(G.frame%120===1)G.skV2=skV2n();const p=G.p[0];if(G.skV2&&!p.ko&&G.frame%Math.max(2,7-G.skV2)===0&&!G.paused)addP({x:p.x+rand(-55,55),y:p.y-rand(20,250),vx:rand(-.6,.6),vy:-rand(.8,2.2),life:34,max:34,c:Math.random()<.5?'#ffd84a':'#c45bff',type:'glow',sz:rand(3,6),g:0})}}catch(e){}return r}}
/* ================= v394: SHAKA — FORMA DIVINA (Armadura Divina = os 5 itens de Virgem V2 EQUIPADOS)
   Jogando com o Shaka, de OLHOS ABERTOS e com 1 barra de vida (≤ LAYER) → vídeo da transformação divina → sprites skv.
   Divina: velocidade 3,3 (olhos abertos 1,82 ≈ +80%; normal 1,3 ≈ +150%… o dono pediu "180%"), +120% dano (×2,2), combo a cada 2 s, inimigo paralisado 3 s.
   Ultimate divina: vídeo do dono; depois PURIFICAÇÃO: o inimigo sobe, fica CONGELADO 4 s tomando só golpes CRÍTICOS e cai. ================= */
const SKDA=RQA.skdv||{},SKDV=SKDA.t||[],SKDU=SKDA.u||[],SKDVF=[],SKDUF=[],SKDVD=Math.min(5,192/Math.max(1,SKDV.length)),SKDVE=Math.round(SKDV.length*SKDVD);let SKDP=null;
function skDvLoad(){if(SKDP)return SKDP;const L=(A,F)=>A.map((p,i)=>new Promise(r=>{const im=new Image();im.decoding='async';im.onload=()=>{F[i]=im;r()};im.onerror=()=>r();im.src=p}));SKDP=Promise.all(L(SKDV,SKDVF));L(SKDU,SKDUF);return SKDP}
const SKDN={skcap:'ELMO DIVINO',skarm:'ARMADURA DIVINA',skluv:'LUVAS DIVINAS',skbot:'BOTAS DIVINAS',skros:'ROSÁRIO DIVINO'};
function skDivSet(){try{if(typeof SPRH==='undefined'||!SPRH.skv)return false;const q=twEqOn();return ['cap','arm','esp','bot','anel'].every(k=>q[k]&&q[k].v2)}catch(e){return false}}
/* v395: ADM testa na BATALHA TREINO: a forma divina ativa logo depois de abrir os olhos, sem itens V2 e sem precisar de 1 barra */
const skDivTreino=()=>{try{return G.gmode==='treino'&&twIsAdm()&&!!SPRH.skv}catch(e){return false}},skDivLd=()=>{try{return skDivSet()||(twIsAdm()&&!!SPRH.skv)}catch(e){return false}};
const skDivHave=()=>{try{const I=twInv();return SKSEC.every(k=>I.some(x=>x&&x.v2&&x.skb===k))}catch(e){return false}};
/* itens V2 viram a ARMADURA DIVINA (nome e ícone novos) */
(function(){try{const I=twInv();let ch=0;for(const it of I){if(it&&it.v2&&it.skb&&SKDN[it.skb]){const nm=SKDN[it.skb]+' V2';if(it.nm!==nm){it.nm=nm;ch=1}if(SKV2[it.skb]&&it.img!==SKV2[it.skb]){it.img=SKV2[it.skb];ch=1}}}if(ch)twLS.s('tw_inv',I)}catch(e){}})();
/* começar a forma divina */
function skDivTry(f){if(!isSk(f)||f.cpu||f.skDiv||f.skDivT||!f.form||f.ko||G.trans||G.ws||G.phase!=='fight'||!G.p||f!==G.p[0])return;
  if(!skDivTreino()&&(f.hp>LAYER||!skDivSet()))return;if(!f.grounded||['transform','whtS','rushed','hit','airhit','down','getup','skc','skk','skcn','attack','blockstun'].includes(f.state))return;
  f.skDivT=1;skDvLoad();f.state='transform';f.st=0;f.vx=0;f.vy=0;f.move=null;f.inv=999;G.trans={f,t:0,skv:1};try{SFX.powerUp()}catch(e){}buzz(80)}
function updSKDV(T,f,t){G.tz=1.15;G.tzx=sxs(f.x);G.tzy=sys(f.y-150);if(t<SKDVE)return;
  if(t===SKDVE){f.skDiv=1;f.form=1;f.formT=FORM_T;f.flick=0;f.tdm=(f.tdm||1)*2.2;G.flash=16;G.flashCol='#fff6d0';G.shake=30;
    for(const r of [460,330,210,110])ring(f.x,f.y-150,r===110?'#ffffff':'#ffd84a',r,28,8);for(let i=0;i<70;i++)spark(f.x,f.y-150,pick(SKC),1,rand(6,18));
    const o=skOpp(f);if(o&&!o.ko){o.skPar=180;o.state='rushed';o.st=0;o.vx=0;o.move=null;txt(o.x,o.y-300,'PARALISADO!','#ffe27a')}
    try{SFX.transform()}catch(e){}banner('FORMA DIVINA!','#ffd84a',120,'+180% VELOCIDADE · +120% DANO · COMBO A CADA 2 s');buzz(220)}
  if(t>SKDVE&&t%2===0)addP({x:f.x+rand(-90,90),y:f.y-rand(30,280),vx:0,vy:-rand(1,3),life:24,max:24,c:pick(SKC),type:'glow',sz:rand(3,7),g:0});
  if(t>=SKDVE+36){G.trans=null;f.inv=20;neutral(f);G.tz=1}}
/* ultimate divina */
{const _ss=skSuper;skSuper=function(f,o){const r=_ss.apply(this,arguments);if(r&&f.skDiv&&G.ws&&G.ws.sk){G.ws.skv=1;skDvLoad();banner('TESOURO DO CÉU DIVINO','#fff3b0',60,'ULTIMATE DIVINA')}return r}}
{const _su=updSKU;updSKU=function(){const R=G.ws,dv=R&&R.skv,a=R&&R.a,d=R&&R.d;const r=_su.apply(this,arguments);
  if(dv&&G.ws!==R&&a&&a.skInv){a.skInv=null;a.skPur={o:d,t:0};banner('PURIFICAÇÃO DIVINA','#fff3b0',70,'CONGELADO POR 4 s · SÓ GOLPES CRÍTICOS')}return r}}
function skPurTick(f){const P=f.skPur,d=P&&P.o;if(!d||d.ko||G.phase!=='fight'){f.skPur=null;if(d&&!d.ko&&d.y<FLOOR){d.state='airhit';d.grounded=false;d.vy=2}return}
  const t=++P.t,UP=30,HOLD=240,LIFT=150,ly=t<UP?LIFT*(1-Math.pow(1-t/UP,2)):LIFT+Math.sin(t*.07)*6;
  d.state='rushed';d.st=0;d.vx=0;d.vy=0;d.move=null;d.guard=false;d.flying=false;d.grounded=true;d.y=FLOOR-ly;d.skPar=0;
  if(G.hitstop<=0){for(let i=0;i<2;i++)addP({x:d.x+rand(-60,60),y:FLOOR-rand(0,40),vx:0,vy:-rand(3,7),life:30,max:30,c:Math.random()<.5?'#fff6d0':'#ffd84a',type:'glow',sz:rand(3,7),g:0});
    if(t%3===0)addP({x:d.x+rand(-80,80),y:d.y-rand(0,260),vx:rand(-.4,.4),vy:-rand(.2,.8),life:26,max:26,c:Math.random()<.5?'#e8f6ff':'#ffffff',type:'glow',sz:rand(2,4),g:0})}
  if(t%18===0){ring(d.x,FLOOR-6,'#ffd84a',150,16,3);ring(d.x,d.y-150,'#e8f6ff',120,14,3)}
  if(t===UP){txt(d.x,d.y-310,'CONGELADO!','#e8f6ff');G.flash=6;G.flashCol='#ffffff'}
  if(t>UP&&t<UP+HOLD&&(t-UP)%7===0){const x=d.x+rand(-55,55),y=d.y-rand(60,240),h={dmg:34,kb:0,hs:3,px:x,py:y,kind:'blast',lock:1,ycrit:1};applyHit(f,d,h);
    spark(x,y,'#ffffff',1,12);ring(x,y,'#fff3b0',70,8,4);txt(x,y-30,'CRÍTICO!','#fff3b0');G.shake=Math.max(G.shake,6);try{SFX.hit&&SFX.hit()}catch(e){}if(d.hp<=0){ko(f,d);f.skPur=null;return}}
  if(t>=UP+HOLD){f.skPur=null;const h={dmg:220,kb:0,hs:20,heavy:1,px:d.x,py:d.y-140,kind:'blast',lock:1,ycrit:1};applyHit(f,d,h);skBurst(d.x,d.y-150,1);try{SFX.crater();SFX.boom()}catch(e){}
    if(d.hp<=0)ko(f,d);else{d.state='airhit';d.grounded=false;d.vy=3;d.vx=f.facing*4;txt(d.x,d.y-220,'PURIFICADO!','#fff3b0')}}}
/* aura divina: auréola dourada com raios girando atrás do Shaka */
{const _sa=skAura;skAura=function(f,k){_sa.apply(this,arguments);if(!f.skDiv)return;const t=G.frame,cx=f.x,cy=f.y-175;ctx.save();ctx.globalCompositeOperation='lighter';
  const g=ctx.createRadialGradient(cx,cy,10,cx,cy,250);g.addColorStop(0,'rgba(255,244,190,.34)');g.addColorStop(.45,'rgba(255,205,70,.16)');g.addColorStop(1,'rgba(255,200,60,0)');ctx.fillStyle=g;ctx.fillRect(cx-260,cy-260,520,520);
  ctx.strokeStyle='rgba(255,226,120,.6)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,150+Math.sin(t*.06)*6,0,TAU);ctx.stroke();
  ctx.strokeStyle='rgba(255,246,200,.3)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,176,0,TAU);ctx.stroke();
  ctx.translate(cx,cy);ctx.rotate(t*.012);ctx.strokeStyle='rgba(255,236,170,.42)';ctx.lineWidth=2.4;for(let i=0;i<16;i++){ctx.rotate(TAU/16);ctx.beginPath();ctx.moveTo(0,-182);ctx.lineTo(0,i%2?-206:-226);ctx.stroke()}
  ctx.restore();if(G.hitstop<=0&&t%3===0){const an=Math.random()*TAU;addP({x:cx+Math.cos(an)*160,y:cy+Math.sin(an)*160,vx:Math.cos(an)*.6,vy:Math.sin(an)*.6-.3,life:24,max:24,c:pick(SKC),type:'glow',sz:rand(2.5,5),g:0})}}}
/* por quadro: tenta transformar, mantém a forma, combo a cada 2 s, purificação, botões brilhando */
{const _up=update;update=function(){const r=_up.apply(this,arguments);try{if(G.mode==='fight'&&G.p)for(const f of G.p){if(!f||!isSk(f))continue;
    skDivTry(f);if(f.skDiv){f.form=1;f.formT=Math.max(f.formT||0,FORM_T*.5);if((f.spCD||0)-G.frame>120)f.spCD=G.frame+120;if(!f.cpu){const C=$('controls');if(C&&!C.classList.contains('skdv'))C.classList.add('skdv')}}
    if(f.skPur)skPurTick(f)}else{const C=$('controls');if(C&&C.classList.contains('skdv'))C.classList.remove('skdv')}}catch(e){console.warn(e)}return r}}
/* carrega os vídeos quando o jogador entra com o Shaka e a armadura divina */
{const _ap=rkApply;rkApply=function(){const r=_ap.apply(this,arguments);try{if(G.pick==='shaka'&&skDivSet())skDvLoad()}catch(e){}return r}}
{const _sm=startMatch;startMatch=function(){const r=_sm.apply(this,arguments);try{if(G.p&&G.p.some(f=>f&&isSk(f)&&!f.cpu)&&(skDivSet()||skDivTreino()))skDvLoad();const C=$('controls');if(C)C.classList.remove('skdv')}catch(e){}return r}}
/* tela "ARMADURA DIVINA COMPLETA" quando o 5º item vira V2 */
function skDivWin(){return new Promise(res=>{const O=document.createElement('div');O.className='rkWin end sec skDvW';O.innerHTML=`<div class="t"><b>✦ ARMADURA DIVINA COMPLETA! ✦</b><span>FORMA DIVINA DO SHAKA LIBERADA</span></div><img class="fl" src="${SKDA.corpo||''}" alt=""><i class="rays"></i><div class="t2">Equipe os 5 itens V2 e jogue com o SHAKA: de olhos abertos e com 1 barra de vida ele vira a FORMA DIVINA · +180% velocidade · +120% dano · combo a cada 2 s · ultimate PURIFICAÇÃO DIVINA</div>`;rkHost().appendChild(O);rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),300);setTimeout(()=>{O.onclick=()=>{O.remove();res()}},600)})}
{const _w=skV2Win;skV2Win=function(it){const had=rkG('skdvok',0);return _w.apply(this,arguments).then(()=>{if(!had&&skDivHave()){rkS('skdvok',1);return skDivWin()}})}}
{const _sk=rkTwSkin;rkTwSkin=function(){const r=_sk.apply(this,arguments);try{tnSkin()}catch(e){console.warn(e)}return r}}
{const _lv2=twLV;twLV=function(){if(TN.on&&G.gmode==='torre'){const B=G.p&&G.p[1];if(B&&B.tnBoss)return TWLV[Math.min(TWLV.length-1,3+Math.floor(TN.g/2))]}return _lv2.apply(this,arguments)}}
try{RKTWX.fl=1;RKTWX.top=3.2}catch(e){}
{const _rr=twRender;twRender=function(){const r=_rr.apply(this,arguments);try{tnSkin();tnMenu();clearTimeout(twRender.at);twRender.at=setTimeout(()=>{try{if(showScreen.cur==='tower'||!$('tower').hidden)anDecor()}catch(e){}},250)}catch(e){}return r}}

try{window.__pvT={G:()=>G,ko:(a,d)=>ko(a,d),ev:()=>rkEvX(),m:()=>[rkEvG(),rkEvL(),rkEvD(),rkEvA()],lk:()=>{const c={};for(let i=0;i<4000;i++){const r=twEqRoll().k;c[r]=(c[r]||0)+1}const a=[0,0,0,0,0];for(let i=0;i<4000;i++)a[lvCrRoll()]++;return {luck:+lvLuck().toFixed(2),drop:+rkDropF().toFixed(2),extra:lkK(),equip:c,cristal:a}},dl:id=>pvDelta(id),cs:id=>cstStats(id),hy:()=>HY,hyS:()=>hyStart(),fil:()=>HY.fil,rv:v=>rkView(v),tn:()=>TN,skdv:()=>{const f=G.p&&G.p[0];return f?{div:!!f.skDiv,form:f.form,hp:f.hp,set:skDivSet(),trans:!!G.trans,ws:!!(G.ws&&G.ws.skv),pur:f.skPur?f.skPur.t:0,sid:ssid(f),sp:+speedMul(f).toFixed(2),tdm:+(f.tdm||1).toFixed(2),cd:(f.spCD||0)-G.frame,vf:SKDVF.filter(Boolean).length,uf:SKDUF.filter(Boolean).length}:null},skSup:()=>skSuper(G.p[0],G.p[1]),treino:(x,y)=>{G.pick=x;G.opp=y;G.gmode='treino';const PM=prepMatch([x,y],'cupula');showVS(()=>PM.then(()=>{vsLoadEnd();startMatch()}),PM)},shk:()=>({ph:SHK.ph,k:SHK.k,stg:STAGE&&STAGE.key,I:SHK.I.map(x=>!!x),bid:RKBID,yd:RKYD}),voz:()=>({VOZ,keys:Object.keys(VPT).length,loaded:Object.keys(SB).filter(k=>/^pt\d_/.test(k)).length}),skh:v=>{SKHON=v?2:0},cmbT:()=>({cmbs:Object.keys(CMBS).slice(0,40)}),dnB:()=>{DN.lv=99;DN.from=99},tnO:()=>rkTorre(),anT:id=>{const E=[];for(const c of [1,3,4]){const r=anRoll(c,10);anGive(r);E.push(r.i)}const A=anEqAll();A[id]=E;rkS("anEq",A)},tnS:g=>{try{rkS('tnrun',null)}catch(e){}tnStart(g)},tnRun:()=>tnRun(),tnK:()=>{const o=G.p[1];if(o)ko(G.p[0],o)},tnA:()=>tnAct(),tnC:()=>tnClimb(),tws:()=>{TW.pick=G.pick=rkG('sel','goku');twStart();setTimeout(()=>twFight(),1200)},hyon:()=>[HY.on,CA.on,G.diff,G.gmode],setQ:l=>setQ(l),prof2:N=>{window.__T=window.__T||{};for(const n of N){try{eval(`{const f=${n};${n}=function(){const t=performance.now();const r=f.apply(this,arguments);window.__T['${n}']=(window.__T['${n}']||0)+performance.now()-t;return r}}`)}catch(e){console.log('x',n)}}},prof:()=>{window.__T={};const W=(n,f,set)=>{set(function(){const t=performance.now();const r=f.apply(this,arguments);window.__T[n]=(window.__T[n]||0)+performance.now()-t;return r})};W('render',render,f=>render=f);W('drawBloom',drawBloom,f=>drawBloom=f);W('grade',grade,f=>grade=f);W('drawLights',drawLights,f=>drawLights=f);W('drawLit',drawLit,f=>drawLit=f);W('drawCastShadow',drawCastShadow,f=>drawCastShadow=f)},tsync:()=>tplSync(1),hsd:()=>[btC(),btSea()],pfo:(u,n)=>pfOpenOther(u,n,{sc:'ranked'}),bt:{rec:(m,w,x)=>btRec(m,w,x),c:()=>btC(),lv:()=>p3Lv()},al:()=>ALB,ch:id=>CH[id],skVid:cb=>{RKBAN='sk';rkPlayVid(cb||(()=>{}))},evm:()=>({EVMI,MCUR,src:MEL.src,loop:MEL.loop,paused:MEL.paused}),evNext:()=>evMusPlay(1),mn:{open:()=>mnOpen(),mine:()=>mnMine(),clean:o=>mnClean(o),give:o=>mnGive(o),view:o=>mnView(o),M:()=>MN},ps:{roll:o=>psRoll(o),def:psDef,sum:psSum,G:psG,S:psS,anim:(r,cb)=>psAnim(r,cb||(()=>{}))},hyBoss:()=>{HY.st=3;HY.lv=1;HY.mobs=[];G.p[1]=hyMk('hidra',900,1)},hyI:()=>(HY.items||[]).map(i=>[i.k,Math.round(i.x),Math.round(i.y),i.land,(()=>{const m=bsImg(HYIC[i.k](i));return m.complete+':'+m.naturalWidth})()]),stg:()=>[STAGE.name,STAGE.src0,STAGE.img&&STAGE.img.naturalWidth,!!STAGE.far],lvo:id=>lvOpen(id),bs:lv=>bsSt(lv),dc:f=>dlCheck(f),ds:()=>dsfOpen()}}catch(e){} /* só para os testes */
