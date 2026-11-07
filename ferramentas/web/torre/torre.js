/* ================= v171: MODO TORRE (7 andares, passivas, troféus, ranking online) ================= */
const TWA=__TWA__;
const TWC=['naruto','rengoku','luffy','gojo','madara','aokiji','goku','gogeta','zoro'];
const TWN=7;
const TWFB={apiKey:'AIzaSyDXTjvRMcKtJ5vq2vl-F2B_w2M-7hd_QY0',projectId:'furia-do-templo'};
const TWURL='https://firestore.googleapis.com/v1/projects/'+TWFB.projectId+'/databases/(default)/documents';
/* janelas pretas da torre (pixels da arte 1671x941): andar 1 embaixo → andar 7 (chefe) em cima */
const TWSLOT=[[986,710,1346,805],[986,610,1345,697],[986,511,1344,594],[986,412,1343,495],[986,312,1343,396],[986,212,1342,296],[987,102,1341,197]];
const TWRAR=[{k:'comum',n:'COMUM',c:'#c3c8d2',w:55,v:[8,5,4]},{k:'rara',n:'RARA',c:'#3d9bff',w:28,v:[15,10,8]},{k:'epica',n:'ÉPICA',c:'#b25bff',w:13,v:[25,18,13]},{k:'lend',n:'LENDÁRIA',c:'#ffc531',w:4,v:[40,30,20]}];
const TWPT=[{k:'vida',n:'VIDA',i:'❤️',d:'Aguenta mais dano'},{k:'dano',n:'DANO',i:'⚔️',d:'Golpes mais fortes'},{k:'vel',n:'VELOCIDADE',i:'💨',d:'Anda e corre mais rápido'}];
const TWTR={win:{n:'Vitória',i:'🏆',d:'Vencer um andar',p:1},rap:{n:'Relâmpago',i:'⚡',d:'Vencer em menos de 30 segundos',p:2},int:{n:'Intocável',i:'🛡️',d:'Vencer sem perder vida',p:3},
  fio:{n:'Por um Fio',i:'🩸',d:'Vencer com menos de 15% de vida',p:2},cmb:{n:'Mestre do Combo',i:'👊',d:'Fazer um combo de 10 golpes ou mais',p:1},ult:{n:'Ultimate!',i:'💥',d:'Usar uma Ultimate na luta',p:1},
  boss:{n:'Caçador de Chefe',i:'👑',d:'Derrotar o chefe final',p:3},bossr:{n:'Rei Relâmpago',i:'🔥',d:'Derrotar o chefe em menos de 60 segundos',p:4},
  tor:{n:'Torre Conquistada',i:'🏯',d:'Vencer os 7 andares',p:5},spd:{n:'Speedrun',i:'⏱️',d:'Completar a torre em menos de 6 minutos',p:5},lend:{n:'Bênção Lendária',i:'🌟',d:'Ganhar uma passiva lendária',p:1}};
const TWOB=[2,3,3,4,5,6,7],TWPB=4,TWMB=7;
const TW={on:false,pick:null,opps:[],fl:0,rev:false,hp:1,bars:TWPB,hpv:TWPB*LAYER,pas:{vida:0,dano:0,vel:0},time:0,tr:[],fs:null,busy:false,sent:false,diff0:1,last:null};
window.__TW=TW;
const twLS={g:(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const twEsc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const twFmt=s=>{s=Math.max(0,Math.round(s));return String((s/60)|0).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const twPts=r=>r.andar*1e7+r.trof*1e4+Math.max(0,9999-Math.min(9999,r.tempo|0));
const twTrofP=()=>TW.tr.reduce((a,t)=>a+TWTR[t.k].p,0);
const twShuf=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function twSfx(k){try{SFX[k]&&SFX[k]()}catch(e){}}
/* ---------- montagem da tela ---------- */
function twBuild(){if(twBuild.ok)return;twBuild.ok=1;const S=$('tower');
  let sl='';for(let i=0;i<TWN;i++){const [x0,y0,x1,y1]=TWSLOT[i];sl+=`<div class="tws${i===TWN-1?' boss':''}" data-i="${i}" style="left:${x0/16.71}%;top:${y0/9.41}%;width:${(x1-x0)/16.71}%;height:${(y1-y0)/9.41}%"><span class="twq">?</span><img class="twc" alt=""><svg class="twx" viewBox="0 0 360 95" preserveAspectRatio="none"><line x1="24" y1="12" x2="336" y2="83" pathLength="100"/><line x1="336" y1="12" x2="24" y2="83" pathLength="100"/></svg><b class="twn"></b><em class="twf">${i===TWN-1?'CHEFE FINAL':'ANDAR '+(i+1)}</em><span class="twl">DERROTA</span></div>`}
  S.innerHTML=`<div class="twBg" style="background-image:url(${TWA._bg})"></div><div id="twBox"><img class="twArt" src="${TWA._bg}" alt=""><div id="twSlots">${sl}</div>
    <div id="twMe"><img alt=""></div>
    <div id="twInfo"><div class="r1"><span id="twFl">ANDAR 0/7</span><span>⏱ <b id="twTm">00:00</b></span><span>🏆 <b id="twTr">0</b></span></div>
      <div class="hp"><span>VIDA</span><i><s id="twHp"></s></i><b id="twHpT">100%</b></div>
      <div class="ps" id="twPs"></div><div class="rec" id="twRec"></div>
      <div class="bt"><button id="twRankB">🏆 RANKING</button><button id="twTrofB">🎖️ TROFÉUS</button></div></div>
    <span id="twGoL"></span><button id="twGo" class="twHit" aria-label="Iniciar torre"></button><button id="twBack" class="twHit" aria-label="Voltar"></button>
    <div id="twToast"></div></div><div id="twModal" hidden></div>`;
  $('twGo').onclick=twGo;$('twBack').onclick=twBackF;$('twRankB').onclick=()=>twRank();$('twTrofB').onclick=twTrofList;
  for(const k of TWC){const im=new Image();im.src=TWA[k]}}
function twSlot(i){return document.querySelector('#twSlots .tws[data-i="'+i+'"]')}
function twRender(){twBuild();
  for(let i=0;i<TWN;i++){const el=twSlot(i),id=TW.opps[i],dead=TW.on||TW.last?i<TW.fl:false;
    el.classList.remove('cur','rev','dead','xan','anim','lost');
    const lost=TW.last&&!TW.last.won&&i===TW.fl&&!TW.on;
    const show=id&&(dead||lost||(TW.on&&i===TW.fl&&TW.rev));
    if(show){el.querySelector('.twc').src=TWA[id];el.querySelector('.twn').textContent=CH[id]?CH[id].name:''}
    if(dead)el.classList.add('dead');else if(lost)el.classList.add('lost');else if(show)el.classList.add('rev');else if(TW.on&&i===TW.fl)el.classList.add('cur')}
  const me=$('twMe').querySelector('img');const src=fullSrc(TW.pick);if(me.getAttribute('src')!==src)me.src=src;
  $('twFl').textContent=(TW.on&&TW.fl===TWN-1?'CHEFE':'ANDAR '+Math.min(TWN,TW.fl+(TW.on?1:0))+'/'+TWN);
  $('twTm').textContent=twFmt(TW.time);$('twTr').textContent=twTrofP();
  TW.hp=TW.hpv/(TW.bars*LAYER);const hp=Math.round(TW.hp*100);$('twHp').style.width=hp+'%';$('twHpT').textContent=TW.bars+' barras';$('twHp').className=hp<30?'lo':hp<60?'md':'';
  $('twPs').innerHTML=TWPT.map(p=>`<span>${p.i} ${p.n==='VELOCIDADE'?'VEL.':p.n} <b>+${TW.pas[p.k]}%</b></span>`).join('');
  const R=twLS.g('tw_rec',null);$('twRec').innerHTML=R?`Recorde: <b>${R.andar}/7</b> andares · ${twFmt(R.tempo)} · 🏆${R.trof}`:'Recorde: nenhum ainda';
  const L=$('twGoL');L.textContent=!TW.on?'':TW.busy?'...':TW.rev?(TW.fl===TWN-1?'LUTAR: CHEFE!':'LUTAR: ANDAR '+(TW.fl+1)):'';L.hidden=!TW.on;
  $('twGo').classList.toggle('off',TW.busy)}
function twOpen(){if(!G.pick||G.pick==='random'||!CH[G.pick])G.pick=ALLC[(Math.random()*ALLC.length)|0];
  TW.pick=G.pick;TW.on=false;TW.opps=[];TW.fl=0;TW.rev=false;TW.hp=1;TW.bars=TWPB;TW.hpv=TWPB*LAYER;TW.pas={vida:0,dano:0,vel:0};TW.time=0;TW.tr=[];TW.busy=false;TW.last=null;
  twBuild();twRender();twModal(null);showScreen('tower');layoutTw()}
function layoutTw(){}
function twToast(t,c){const T=$('twToast');if(!T)return;T.textContent=t;T.style.color=c||'#ffd23f';T.classList.remove('on');void T.offsetWidth;T.classList.add('on')}
/* ---------- fluxo ---------- */
function twGo(){if(TW.busy||!$('twModal').hidden)return;audioInit();
  if(!TW.on){twStart();return}
  if(TW.rev)twFight()}
function twStart(){TW.opps=twShuf(TWC.filter(x=>x!==TW.pick)).slice(0,TWN);TW.on=true;TW.fl=0;TW.rev=false;TW.hp=1;TW.bars=TWPB;TW.hpv=TWPB*LAYER;TW.pas={vida:0,dano:0,vel:0};TW.time=0;TW.tr=[];TW.sent=false;TW.last=null;TW.diff0=G.diff;
  twSfx('whoosh');try{nv('vMChallenge',.05,1)}catch(e){}twRender();setTimeout(()=>twReveal(0),350)}
function twReveal(i){TW.rev=true;twRender();const el=twSlot(i);el.classList.add('anim');twSfx('boom');
  twToast((i===TWN-1?'👑 CHEFE FINAL: ':'ANDAR '+(i+1)+': ')+CH[TW.opps[i]].name+' · '+TWOB[i]+' BARRAS',i===TWN-1?'#ffc531':'#ff5a5a');try{fsTry()}catch(e){}}
function twFight(){if(TW.busy)return;TW.busy=true;twRender();twSfx('whoosh');
  G.gmode='torre';G.opp=TW.opps[TW.fl];G.diff=[0,0,1,1,2,2,3][TW.fl];
  const sk=Object.keys(STG).filter(k=>!STG[k].hid);G.nextStg=sk[(Math.random()*sk.length)|0];
  try{nv('vCOK',0,1)}catch(e){}
  const PM=prepMatch([G.pick,G.opp],G.nextStg);showVS(()=>PM.then(()=>{vsLoadEnd();TW.busy=false;startMatch()}),PM)}
/* chamado no fim do setupFighters: vida que sobrou, passivas e dificuldade do andar */
function twApply(){if(!(TW.on&&G.gmode==='torre'))return;const [p,o]=G.p,b=TW.fl===TWN-1;
  p.mhp=TW.bars*LAYER;p.hp=p.hpLag=Math.max(1,Math.min(p.mhp,Math.round(TW.hpv)));p.tdm=1+TW.pas.dano/100;p.tsp=1+TW.pas.vel/100;p.tdf=1/(1+TW.pas.vida/100);
  o.mhp=TWOB[TW.fl]*LAYER;o.hp=o.hpLag=o.mhp;o.tdm=b?1.6:1+.08*TW.fl;o.tdf=b?.85:1;if(TW.fl>=3)o.ki=60;if(b){o.ki=100;o.sb=Math.max(o.sb||0,SB_COST);o.tsp=1.12}
  TW.fs={t:0,cmb:0,ult:0,hp0:p.hp/p.mhp}}
function twTick(){const F=TW.fs;if(!F||!G.p)return;F.t++;const c=G.p[0].combo||0;if(c>F.cmb)F.cmb=c}
function twBossGo(){if(!(TW.on&&G.gmode==='torre'&&G.p))return;if(G.tlim!==0)G.timer=Math.min(240,60+20*TWOB[TW.fl]);if(TW.fl!==TWN-1)return;const o=G.p[1];
  banner('CHEFE FINAL','#ffc531',90,o.def.name+' · TRANSFORMADO');if(o.form)return;o.sb=Math.max(o.sb||0,SB_COST);try{startTransform(o)}catch(e){}}
function twAfter(w){G.mode='tower';$('controls').hidden=true;$('pauseBtn').hidden=true;rainSound(0);G.paused=false;
  const F=TW.fs||{t:0,cmb:0,ult:0,hp0:TW.hp},secs=F.t/60,p=G.p[0];TW.time+=secs;
  if(w!==0){twFinish(false);return}
  const hpE=Math.max(.01,p.hp/(p.mhp||MAXHP)),boss=TW.fl===TWN-1,ks=['win'];
  if(secs<30)ks.push('rap');if(F.hp0-hpE<=.02)ks.push('int');if(hpE<.15)ks.push('fio');if(F.cmb>=10)ks.push('cmb');if(F.ult>0)ks.push('ult');
  if(boss){ks.push('boss');if(secs<60)ks.push('bossr')}
  TW.hpv=Math.max(1,p.hp);TW.hp=TW.hpv/(TW.bars*LAYER);const won=TW.fl;TW.fl++;TW.rev=false;
  if(TW.fl>=TWN){ks.push('tor');if(TW.time<360)ks.push('spd')}
  for(const k of ks)TW.tr.push({k,fl:won});
  try{nv(TW.fl>=TWN?'vCongratulations':['vEWin','vEWinner','vEVictory'][(Math.random()*3)|0],.2,1)}catch(e){}
  showScreen('tower');twRender();const el=twSlot(won);el.classList.remove('dead');el.classList.add('rev');
  setTimeout(()=>{el.classList.remove('rev');el.classList.add('dead','xan');twSfx('clang');twSfx('boom')},450);
  setTimeout(()=>{if(TW.fl>=TWN)twFinish(true,false,ks);else twPassive(ks,won)},1500)}
function twTrofHTML(ks){return ks.map((k,i)=>`<span class="twT" style="animation-delay:${i*.12}s"><i>${TWTR[k].i}</i><b>${TWTR[k].n}</b><span>+${TWTR[k].p}</span></span>`).join('')}
function twRoll(){let r=Math.random()*100;for(const R of TWRAR){if((r-=R.w)<0)return R}return TWRAR[0]}
const TWBAR={k:'barra',n:'BARRA DE VIDA',i:'💚',d:'+1 barra de vida (máx. 7)'};
function twPassive(ks,won){const opts=twShuf(TWPT.slice()).map((p,i)=>{const R=twRoll();return {p,R,v:R.v[TWPT.indexOf(p)]}});
  if(TW.bars<TWMB&&Math.random()<.3){const i=(Math.random()*3)|0;opts[i]={p:TWBAR,R:Math.random()<.35?TWRAR[3]:TWRAR[2],v:1}}
  twModal(`<div class="twM"><h3>ANDAR ${won+1} VENCIDO!</h3><div class="twTs">${twTrofHTML(ks)}</div>
    <h4>ESCOLHA UMA PASSIVA</h4><div class="twPs">${opts.map((o,i)=>`<button class="twp ${o.R.k}" data-i="${i}" style="--c:${o.R.c};animation-delay:${.25+i*.15}s"><span class="rr">${o.R.n}</span><span class="ic">${o.p.i}</span><b>+${o.v}${o.p.k==='barra'?'':'%'}</b><span class="nm">${o.p.n}</span><span class="ds">${o.p.d}</span></button>`).join('')}</div>
    <p class="twH">Você vai recuperar <b>60%</b> da vida antes da próxima luta. Próximo rival: <b>${TWOB[won+1]||7} barras</b>.</p></div>`);
  if(opts.some(o=>o.R.k==='lend'))twSfx('powerUp');
  document.querySelectorAll('#twModal .twp').forEach(b=>b.onclick=()=>{const o=opts[+b.dataset.i];if(o.p.k==='barra'){TW.bars=Math.min(TWMB,TW.bars+1);TW.hpv+=LAYER}else TW.pas[o.p.k]+=o.v;if(o.R.k==='lend'&&!TW.tr.some(t=>t.k==='lend'))TW.tr.push({k:'lend',fl:won});
    twSfx('powerUp');b.classList.add('pick');setTimeout(()=>{twModal(null);const M=TW.bars*LAYER,h0=TW.hpv;TW.hpv=Math.min(M,TW.hpv+.6*M);twRender();twToast(o.p.k==='barra'?'💚 +1 BARRA DE VIDA ('+TW.bars+')':'+'+Math.round((TW.hpv-h0)/M*100)+'% VIDA · '+o.p.i+' +'+o.v+'% '+o.p.n,'#7dff9a');
      setTimeout(()=>twReveal(TW.fl),900)},380)})}
function twFinish(won,quit,ks){const andar=won?TWN:TW.fl,rec={andar,tempo:Math.round(TW.time),trof:twTrofP(),char:TW.pick,d:Date.now()};
  TW.on=false;TW.busy=false;G.diff=TW.diff0;if(!won&&!quit)try{nv('vGameOver',.3,1)}catch(e){}
  const tc=twLS.g('tw_tc',{});for(const t of TW.tr)tc[t.k]=(tc[t.k]||0)+1;twLS.s('tw_tc',tc);
  const R=twLS.g('tw_rec',null),best=andar>0&&(!R||twPts(rec)>twPts(R));if(best)twLS.s('tw_rec',rec);
  if(andar>0){const H=twLS.g('tw_hist',[]);H.push(rec);H.sort((a,b)=>twPts(b)-twPts(a));twLS.s('tw_hist',H.slice(0,15))}
  TW.last={won,quit,rec,best,ks:ks||null};showScreen('tower');twRender();twEndModal();
  if(andar>0&&twLS.g('tw_nome',''))twSubmit(rec)}
function twEndModal(){const L=TW.last;if(!L)return twModal(null);const {won,quit,rec,best,ks}=L,andar=rec.andar;
  const name=twLS.g('tw_nome',''),cnt={};for(const t of TW.tr)cnt[t.k]=(cnt[t.k]||0)+1;
  const tl=Object.keys(cnt).map(k=>`<span class="twT"><i>${TWTR[k].i}</i><b>${TWTR[k].n}</b><span>×${cnt[k]}</span></span>`).join('')||'<p class="twH">Nenhum troféu nesta subida.</p>';
  twModal(`<div class="twM ${won?'gold':''}"><h3>${won?'TORRE CONQUISTADA!':quit?'VOCÊ DESISTIU':TW.fl===TWN-1?'O CHEFE VENCEU!':'VOCÊ CAIU NO ANDAR '+(TW.fl+1)}</h3>
    ${won&&ks?`<div class="twTs">${twTrofHTML(ks)}</div>`:''}
    <div class="twSt"><div><small>ANDARES</small><b>${andar}/${TWN}</b></div><div><small>TEMPO</small><b>${twFmt(rec.tempo)}</b></div><div><small>TROFÉUS</small><b>🏆 ${rec.trof}</b></div></div>
    ${best?'<div class="twNew">⭐ NOVO RECORDE! ⭐</div>':''}
    <div class="twTs sm">${tl}</div>
    <div class="twSend">${andar>0?`<input id="twName" maxlength="16" placeholder="Seu nome no ranking" value="${twEsc(name)}"><button class="btn main" id="twSendB">ENVIAR</button><span id="twSendS"></span>`:'<span class="twH">Vença pelo menos 1 andar para entrar no ranking.</span>'}</div>
    <div class="row"><button class="btn main" id="twAgain">TENTAR DE NOVO</button><button class="btn" id="twRk">RANKING</button><button class="btn" id="twOut">SAIR</button></div></div>`);
  $('twAgain').onclick=()=>{twModal(null);twStart()};$('twRk').onclick=()=>twRank();$('twOut').onclick=()=>{twModal(null);TW.last=null;menuSetupKeep();showScreen('title')};
  if(andar>0){$('twSendB').onclick=()=>twSubmit(rec);if(TW.sent){$('twSendS').textContent=TW.sendOk?'✓ Enviado para o ranking!':'Enviando...';$('twSendS').className='ok';$('twSendB').disabled=true}}}
async function twSubmit(rec){if(TW.sent)return;const I=$('twName'),S=$('twSendS')||{};const nome=(I?I.value:twLS.g('tw_nome','')).replace(/[<>]/g,'').trim().slice(0,16);
  if(!nome){S.textContent='Digite seu nome';S.className='err';I&&I.focus();return}twLS.s('tw_nome',nome);TW.sent=true;TW.sendOk=false;S.textContent='Enviando...';S.className='';if($('twSendB'))$('twSendB').disabled=true;
  try{await twSend(rec,nome);TW.sendOk=true;const S2=$('twSendS');if(S2){S2.textContent='✓ Enviado para o ranking!';S2.className='ok'}}
  catch(e){TW.sent=false;const S2=$('twSendS'),B=$('twSendB');if(B)B.disabled=false;if(S2){S2.textContent='Sem internet — tente de novo';S2.className='err'}}}
function twFetchT(url,o,ms){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms||9000);return fetch(url,Object.assign({signal:c.signal},o)).finally(()=>clearTimeout(t))}
async function twSend(rec,nome){const I=v=>({integerValue:String(Math.max(0,Math.round(v)))});
  const f={nome:{stringValue:nome},andar:I(rec.andar),tempo:I(rec.tempo),trof:I(rec.trof),pontos:I(twPts(rec)),char:{stringValue:rec.char},v:I(171)};
  const r=await twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})});if(!r.ok)throw new Error('http '+r.status)}
async function twFetch(){const body={structuredQuery:{from:[{collectionId:'torre'}],orderBy:[{field:{fieldPath:'pontos'},direction:'DESCENDING'}],limit:150}};
  const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);
  const j=await r.json(),out=[],seen=new Set();
  for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F)continue;const g=k=>F[k]?(F[k].stringValue!=null?F[k].stringValue:F[k].integerValue!=null?F[k].integerValue:F[k].doubleValue):undefined;
    const e={nome:String(g('nome')||'?').slice(0,16),andar:+g('andar')||0,tempo:+g('tempo')||0,trof:+g('trof')||0,char:String(g('char')||'')};const k=e.nome.toLowerCase();if(seen.has(k))continue;seen.add(k);out.push(e)}
  return out.slice(0,50)}
function twRows(L,me){if(!L.length)return '<p class="twH">Ninguém no ranking ainda. Seja o primeiro!</p>';
  return '<div class="twRk">'+L.map((e,i)=>{const im=CH[e.char]&&IMG[e.char]?IMG[e.char].src:'';return `<div class="rw${me&&e.nome.toLowerCase()===me.toLowerCase()?' me':''}${i<3?' t'+(i+1):''}"><span class="ps">${i<3?['🥇','🥈','🥉'][i]:i+1}</span>${im?`<img src="${im}" alt="">`:'<i></i>'}<span class="nm">${twEsc(e.nome)}</span><span class="an">${e.andar>=TWN?'👑 7/7':'🏯 '+e.andar+'/7'}</span><span class="tr">🏆 ${e.trof}</span><span class="tm">${twFmt(e.tempo)}</span></div>`}).join('')+'</div>'}
function twRank(tab){tab=tab||'w';const me=twLS.g('tw_nome','');
  const H=twLS.g('tw_hist',[]).map(r=>Object.assign({nome:me||'Você'},r));
  twModal(`<div class="twM rk"><h3>🏆 RANKING DA TORRE</h3><div class="seg twTab"><button data-t="w" aria-pressed="${tab==='w'}">MUNDIAL</button><button data-t="m" aria-pressed="${tab==='m'}">MEUS RECORDES</button></div>
    <div id="twRkL">${tab==='w'?'<p class="twH">Carregando...</p>':twRows(H,'')}</div><div class="row"><button class="btn" id="twRkX">FECHAR</button></div></div>`);
  document.querySelectorAll('#twModal .twTab button').forEach(b=>b.onclick=()=>twRank(b.dataset.t));
  $('twRkX').onclick=()=>{if(TW.last&&!TW.on){twFinishBack()}else twModal(null)};
  if(tab==='w')twFetch().then(L=>{if($('twRkL'))$('twRkL').innerHTML=twRows(L,me)}).catch(()=>{if($('twRkL'))$('twRkL').innerHTML='<p class="twH err">Sem internet agora. Veja seus recordes na outra aba.</p>'})}
function twFinishBack(){twEndModal()}
function twTrofList(){const tc=twLS.g('tw_tc',{}),run={};for(const t of TW.tr)run[t.k]=(run[t.k]||0)+1;
  twModal(`<div class="twM"><h3>🎖️ TROFÉUS</h3><div class="twTL">${Object.keys(TWTR).map(k=>{const T=TWTR[k];return `<div class="${tc[k]||run[k]?'got':''}"><i>${T.i}</i><b>${T.n}</b><span>${T.d}</span><em>+${T.p} 🏆</em><small>${run[k]?'nesta subida: '+run[k]+' · ':''}total: ${(tc[k]||0)}</small></div>`}).join('')}</div>
    <p class="twH">Cada troféu soma pontos 🏆 no ranking. Quem sobe mais andares fica na frente; empate = mais troféus, depois menos tempo.</p><div class="row"><button class="btn" id="twTx">FECHAR</button></div></div>`);
  $('twTx').onclick=()=>{if(TW.last&&!TW.on)twFinishBack();else twModal(null)}}
function twModal(html){const M=$('twModal');if(!M)return;if(html==null){M.hidden=true;M.innerHTML='';return}M.innerHTML=html;M.hidden=false}
function twBackF(){if(!$('twModal').hidden)return;twSfx('whoosh');
  if(!TW.on){TW.last=null;showScreen('select');return}
  twModal(`<div class="twM sm"><h3>DESISTIR DA TORRE?</h3><p class="twH">Seu progresso conta até o andar ${TW.fl+1}.</p><div class="row"><button class="btn" id="twNo">CONTINUAR</button><button class="btn main" id="twYes">DESISTIR</button></div></div>`);
  $('twNo').onclick=()=>twModal(null);$('twYes').onclick=()=>{twModal(null);twFinish(false,true)}}
function twQuitFight(){G.paused=false;rainSound(0);$('controls').hidden=true;$('pauseBtn').hidden=true;G.mode='tower';TW.time+=(TW.fs?TW.fs.t:0)/60;twFinish(false,true)}
/* ultimates usadas pelo jogador (troféu) */
{const _sr=trySR;trySR=function(f,o){const r=_sr(f,o);if(r&&TW.on&&TW.fs&&G.p&&f===G.p[0])TW.fs.ult++;return r}}
LV[3]={react:3,agg:.97,blk:.88,combo:1,idle:1};
