import sys,json
# v200: TÍTULOS (5), ranking SEMANAL (reseta segunda 00:00 de Brasília), MODO EVENTO com horário (ranking só do evento, prêmios na mochila do 1º e 2º)
P=sys.argv[1];s=open(P).read();EV=json.load(open('/home/claude/mo_build/evento.json'))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
JS=r"""
/* ================= v200: títulos, semana, evento ================= */
const twUid=()=>{let u=twLS.g('tw_uid','');if(!u){u=(Date.now().toString(36)+Math.random().toString(36).slice(2,10)).slice(0,16);twLS.s('tw_uid',u)}return u};
const BRT=3*3600e3,twWk=t=>{const d=new Date(t-BRT),dw=(d.getUTCDay()+6)%7;return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-dw)+BRT},twWkKey=t=>{const d=new Date(twWk(t)-BRT);return 'w'+d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,'0')+String(d.getUTCDate()).padStart(2,'0')};
const TWTIT={ini:{n:'INICIANTE',i:'🔰',c:'#9fe0a0',d:'Vencer 1 andar da torre'},gue:{n:'GUERREIRO',i:'⚔️',c:'#4fb0ff',d:'Vencer 4 andares numa subida'},con:{n:'CONQUISTADOR',i:'🏯',c:'#ffc531',d:'Vencer os 7 andares da torre'},
  sem:{n:'CAMPEÃO DA SEMANA',i:'📅',c:'#ff7a2a',d:'1º lugar no ranking SEMANAL (reseta toda segunda)'},tor:{n:'CAMPEÃO DO TORNEIO',i:'🏆',c:'#ff2e63',d:'1º lugar num EVENTO da torre'}};
const twTits=()=>twLS.g('tw_tit',[]),twTitOn=()=>{const t=twLS.g('tw_titOn','');return twTits().includes(t)?t:''};
function twGiveTit(k){const L=twTits();if(L.includes(k))return false;L.push(k);twLS.s('tw_tit',L);if(!twLS.g('tw_titOn',''))twLS.s('tw_titOn',k);setTimeout(()=>twToast('👑 TÍTULO NOVO: '+TWTIT[k].n,TWTIT[k].c),600);return true}
const twTitTag=k=>k&&TWTIT[k]?`<em class="twTit" style="--c:${TWTIT[k].c}">${TWTIT[k].i} ${TWTIT[k].n}</em>`:'';
/* EVENTO: horário de Brasília. Vale o horário do servidor (createTime) para entrar no ranking. */
const TWEV={id:'ev20261108',nome:'1º TORNEIO DA TORRE',ini:Date.parse('2026-11-08T15:00:00-03:00'),fim:Date.parse('2026-11-08T15:45:00-03:00'),
  prem:[{pos:1,it:{t:'esp',r:'mit',v:11,vel:5,nm:'LÂMINA SOMBRIA',img:'__MIT__'},tit:'tor'},{pos:2,it:{t:'esp',r:'lend',v:6,vel:2,nm:'LÂMINA DOURADA',img:'__LEND__'}}]};
if(window.__twEvT){TWEV.ini=Date.now()+window.__twEvT[0];TWEV.fim=Date.now()+window.__twEvT[1]}
const twEvSt=(t)=>{t=t||Date.now();return t<TWEV.ini?'antes':t<TWEV.fim?'ao vivo':'fim'};
const twDur=ms=>{ms=Math.max(0,ms);const h=(ms/3600e3)|0,m=((ms%3600e3)/60e3)|0,s=((ms%60e3)/1e3)|0;return (h?h+'h ':'')+String(m).padStart(2,'0')+'m '+String(s).padStart(2,'0')+'s'};
async function twQ(where){const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:where[0]},op:'EQUAL',value:{stringValue:where[1]}}},limit:800}};
  const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);const j=await r.json(),out=[];
  for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F)continue;const g=k=>F[k]?(F[k].stringValue!=null?F[k].stringValue:F[k].integerValue!=null?F[k].integerValue:F[k].doubleValue):undefined;
    out.push({nome:String(g('nome')||'?').slice(0,16),andar:+g('andar')||0,tempo:+g('tempo')||0,trof:+g('trof')||0,char:String(g('char')||''),uid:String(g('uid')||''),tit:String(g('tit')||''),ct:Date.parse(x.document.createTime||'')||0})}return out}
/* melhor subida de cada jogador (uid; quem não tem uid conta pelo nome) */
function twBestU(L){const S=L.slice().sort((a,b)=>b.andar-a.andar||b.trof-a.trof||a.tempo-b.tempo),o=[],seen=new Set();for(const e of S){const k=e.uid||('n:'+e.nome.toLowerCase());if(seen.has(k))continue;seen.add(k);o.push(e)}return o}
async function twWeekL(off){const t=Date.now()-(off||0)*7*864e5,a=twWk(t),b=a+7*864e5;return twBestU((await twQ(['sem',twWkKey(t)])).filter(e=>e.ct>=a&&e.ct<b))}
async function twEvL(){return twBestU((await twQ(['ev',TWEV.id])).filter(e=>e.ct>=TWEV.ini&&e.ct<=TWEV.fim+60e3))}
function twRowsU(L,tab){const me=twUid();if(!L.length)return `<p class="twH">${tab==='e'?'Ninguém pontuou no evento ainda.':'Ninguém no ranking desta semana ainda. Seja o primeiro!'}</p>`;
  return '<div class="twRk '+tab+'">'+L.map((e,i)=>{const im=CH[e.char]&&IMG[e.char]?IMG[e.char].src:'';return `<div class="rw${e.uid===me?' me':''}${i<3?' t'+(i+1):''}"><span class="ps">${i<3?['🥇','🥈','🥉'][i]:i+1}</span>${im?`<img src="${im}" alt="">`:'<i></i>'}<span class="nm">${twEsc(e.nome)}${twTitTag(e.tit)}<small>${CH[e.char]?CH[e.char].name:''}</small></span><span class="an">${e.andar>=TWN?'👑 7/7':'🏯 '+e.andar+'/7'}</span><span class="tr">🏆 ${e.trof}</span><span class="tm">⏱ ${twFmt(e.tempo)}</span></div>`}).join('')+'</div>'}
/* prêmios: confere quem ganhou (semana passada / evento encerrado) e entrega na mochila deste aparelho */
async function twClaims(){if(twClaims.busy)return;twClaims.busy=1;const me=twUid();
  try{const wk=twWkKey(Date.now()-7*864e5),dn=twLS.g('tw_wkc',{});if(!dn[wk]){const L=await twWeekL(1);dn[wk]=1;twLS.s('tw_wkc',dn);if(L[0]&&L[0].uid===me)twGiveTit('sem')}}catch(e){}
  try{const ec=twLS.g('tw_evc',{});if(twEvSt()==='fim'&&!ec[TWEV.id]&&Date.now()>TWEV.fim+90e3){const L=await twEvL();ec[TWEV.id]={pos:0};
      const i=L.findIndex(e=>e.uid===me);if(i>=0&&i<TWEV.prem.length){const P=TWEV.prem[i];ec[TWEV.id].pos=i+1;const it=Object.assign({id:'ev'+TWEV.id+i,ev:TWEV.id},P.it),I=twInv();if(!I.some(x=>x.id===it.id)){I.push(it);twLS.s('tw_inv',I)}if(P.tit)twGiveTit(P.tit);
        twLS.s('tw_evc',ec);twEvWin(i+1,it)}else twLS.s('tw_evc',ec)}}catch(e){}
  twClaims.busy=0;try{twRender()}catch(e){}}
function twEvWin(pos,it){if(!$('twModal').hidden)return setTimeout(()=>twEvWin(pos,it),1500);twSfx('powerUp');
  twModal(`<div class="twM gold"><h3>${pos===1?'🥇 VOCÊ GANHOU O EVENTO!':'🥈 2º LUGAR NO EVENTO!'}</h3><p class="twH">${TWEV.nome}</p><div class="evPz big"><img src="${it.img}" alt=""><div><b>${it.nm}</b><span>+${it.v}% DANO · +${it.vel}% VELOCIDADE · permanente</span><em>Já está na sua 🎒 MOCHILA${pos===1?' + título 🏆 CAMPEÃO DO TORNEIO':''}</em></div></div><div class="row"><button class="btn main" id="twEvOk">PEGAR!</button></div></div>`);$('twEvOk').onclick=()=>{twModal(null);twRender()}}
/* tela do EVENTO */
function twEvent(){const st=twEvSt(),t=Date.now(),fmtH=x=>new Date(x-BRT).toISOString().slice(11,16);
  twModal(`<div class="twM rk ev"><h3>🎉 ${TWEV.nome}</h3>
    <div class="evSt ${st.replace(' ','')}"><b>${st==='antes'?'COMEÇA EM <span id="twEvC">'+twDur(TWEV.ini-t)+'</span>':st==='ao vivo'?'🔴 AO VIVO · TERMINA EM <span id="twEvC">'+twDur(TWEV.fim-t)+'</span>':'ENCERRADO'}</b><span>Hoje das ${fmtH(TWEV.ini)} às ${fmtH(TWEV.fim)} (horário de Brasília)</span></div>
    <div class="evPzs">${TWEV.prem.map(P=>`<div class="evPz" style="--c:${twRarOf(P.it.r).c}"><i>${P.pos===1?'🥇':'🥈'}</i><img src="${P.it.img}" alt=""><div><b>${P.it.nm}</b><span>${twRarOf(P.it.r).n} · +${P.it.v}% DANO · +${P.it.vel}% VEL.</span>${P.tit?`<em>+ título ${TWTIT[P.tit].i} ${TWTIT[P.tit].n}</em>`:''}</div></div>`).join('')}</div>
    <p class="twH">Durante o horário do evento, toda subida da torre que <b>terminar</b> até ${fmtH(TWEV.fim)} entra neste ranking (vale a melhor de cada jogador: mais andares, depois mais troféus, depois menos tempo). O 1º e o 2º recebem o prêmio na mochila sozinhos quando abrirem a torre depois do fim.</p>
    <div id="twRkL"><p class="twH">${st==='antes'?'O ranking aparece quando o evento começar.':'Carregando...'}</p></div><div class="row"><button class="btn main" id="twEvGo" ${st==='ao vivo'?'':'hidden'}>JOGAR AGORA</button><button class="btn" id="twEvX">FECHAR</button></div></div>`);
  $('twEvX').onclick=()=>{clearInterval(twEvent.iv);twModal(null)};$('twEvGo').onclick=()=>{clearInterval(twEvent.iv);twModal(null);if(!TW.on)twGo()};
  const load=()=>twEvL().then(L=>{if($('twRkL')&&$('twModal').querySelector('.ev'))$('twRkL').innerHTML=twRowsU(L,'e')}).catch(()=>{if($('twRkL'))$('twRkL').innerHTML='<p class="twH err">Sem internet agora.</p>'});
  if(st!=='antes')load();clearInterval(twEvent.iv);let n=0;
  twEvent.iv=setInterval(()=>{if(!$('twModal').querySelector('.ev')){clearInterval(twEvent.iv);return}const s2=twEvSt();if(s2!==st){twEvent();return}const C=$('twEvC');if(C)C.textContent=twDur((s2==='antes'?TWEV.ini:TWEV.fim)-Date.now());if(s2==='ao vivo'&&++n%20===0)load()},1000)}
/* tela dos TÍTULOS */
function twTitles(){const got=twTits(),on=twTitOn();
  twModal(`<div class="twM"><h3>👑 TÍTULOS</h3><p class="twH">Toque num título conquistado para usar. Ele aparece embaixo do seu nome na torre e nos rankings.</p><div class="twTits">${Object.keys(TWTIT).map(k=>{const T=TWTIT[k],g=got.includes(k);return `<button class="tt ${g?'got':''} ${on===k?'on':''}" data-k="${k}" style="--c:${T.c}" ${g?'':'disabled'}><i>${T.i}</i><b>${T.n}</b><span>${T.d}</span><em>${on===k?'EM USO':g?'USAR':'🔒 BLOQUEADO'}</em></button>`}).join('')}</div>
    <div class="row"><button class="btn" id="twTitX">FECHAR</button></div></div>`);
  $('twTitX').onclick=()=>{twModal(null);twRender()};document.querySelectorAll('#twModal .tt.got').forEach(b=>b.onclick=()=>{twLS.s('tw_titOn',twTitOn()===b.dataset.k?'':b.dataset.k);twSfx('clang');twTitles()})}
"""
JS=JS.replace('__MIT__',EV['mit']).replace('__LEND__',EV['lend'])
rep("function twTrofList(){",JS+"function twTrofList(){")
# envio: uid, título, semana e evento
rep("char:{stringValue:rec.char},v:I(180)};","char:{stringValue:rec.char},v:I(200),uid:{stringValue:twUid()},tit:{stringValue:twTitOn()},sem:{stringValue:twWkKey(Date.now())}};if(twEvSt()==='ao vivo')f.ev={stringValue:TWEV.id};")
# títulos por andares
rep("const tc=twLS.g('tw_tc',{});for(const t of TW.tr)","if(andar>=1)twGiveTit('ini');if(andar>=4)twGiveTit('gue');if(won)twGiveTit('con');\n  const tc=twLS.g('tw_tc',{});for(const t of TW.tr)")
# botões + selo do evento + título no painel
rep('<button id="twBagB">🎒 MOCHILA</button>','<button id="twEvB">🎉 EVENTO<i id="twEvDot"></i></button><button id="twTitB">👑 TÍTULOS</button><button id="twBagB">🎒 MOCHILA</button>')
rep("$('twBagB').onclick=","$('twEvB').onclick=()=>{if(!$('twModal').hidden||TW.busy)return;twSfx('whoosh');twEvent()};$('twTitB').onclick=()=>{if(!$('twModal').hidden||TW.busy)return;twSfx('whoosh');twTitles()};$('twBagB').onclick=")
rep("$('twNm').innerHTML=n?'Jogador: <b>'+twEsc(n)+'</b>':'Jogador: <i>sem nome</i>'}",
    "$('twNm').innerHTML=(n?'Jogador: <b>'+twEsc(n)+'</b>':'Jogador: <i>sem nome</i>')+twTitTag(twTitOn())}\n  {const st=twEvSt(),D=$('twEvDot');if(D){D.className=st==='ao vivo'?'live':st==='antes'?'soon':''}}")
rep("twBuild();twRender();twModal(null);showScreen('tower');layoutTw()}","twBuild();twRender();twModal(null);showScreen('tower');layoutTw();setTimeout(twClaims,800);if(twEvSt()==='ao vivo'&&!twOpen.evShown){twOpen.evShown=1;setTimeout(()=>twToast('🎉 EVENTO AO VIVO! Suas subidas valem para o ranking do evento','#ffcf4a'),900)}}")
# ranking: aba SEMANA
rep('<button data-t="t" aria-pressed="${tab===\'t\'}">⏱ TEMPO</button>','<button data-t="w" aria-pressed="${tab===\'w\'}">📅 SEMANA</button><button data-t="t" aria-pressed="${tab===\'t\'}">⏱ TEMPO</button>')
rep("const sub={t:'Quem sobe","const sub={w:'Ranking da SEMANA: melhor subida de cada jogador (mais andares, troféus e menos tempo). Reseta toda segunda 00:00. O 1º da semana ganha o título 📅 CAMPEÃO DA SEMANA.',t:'Quem sobe")
rep("  if(tab==='c'){twFetchC(cid).then(","  if(tab==='w'){twWeekL(0).then(L=>{if($('twRkL'))$('twRkL').innerHTML=twRowsU(L.slice(0,50),'w')}).catch(()=>{if($('twRkL'))$('twRkL').innerHTML='<p class=\"twH err\">Sem internet agora.</p>'});return}\n  if(tab==='c'){twFetchC(cid).then(")
# itens especiais (prêmio do evento): imagem própria, nome e velocidade extra
rep("const twEqB=st=>{const o=twEqOn();let v=0;for(const E of TWEQ)if(E.s===st&&o[E.k])v+=o[E.k].v;return v};",
    "const twEqB=st=>{const o=twEqOn();let v=0;for(const E of TWEQ){if(!o[E.k])continue;if(E.s===st)v+=o[E.k].v;if(st==='vel'&&o[E.k].vel)v+=o[E.k].vel}return v};")
rep("<button class=\"moS ${extra||''}\" style=\"${b};--c:${twRarOf(x.r).c}\" data-id=\"${x.id}\" data-k=\"${x.k||'eq'}\"><img src=\"${twIco(x.t,x.r)}\" alt=\"\">",
    "<button class=\"moS ${extra||''}\" style=\"${b};--c:${twRarOf(x.r).c}\" data-id=\"${x.id}\" data-k=\"${x.k||'eq'}\"><img src=\"${x.img||twIco(x.t,x.r)}\" alt=\"\">")
rep("<div class=\"mdI\" style=\"--c:${R.c}\"><img src=\"${twIco(x.t,x.r)}\" alt=\"\">","<div class=\"mdI\" style=\"--c:${R.c}\"><img src=\"${x.img||twIco(x.t,x.r)}\" alt=\"\">")
rep("const nm=x=>x.t==='poc'?'POÇÃO':TWEQ.find(E=>E.k===x.t).n,ef=x=>x.t==='poc'?","const nm=x=>x.nm||(x.t==='poc'?'POÇÃO':TWEQ.find(E=>E.k===x.t).n),ef=x=>x.vel?'Ataque +'+x.v+'% · Velocidade +'+x.vel+'% (permanente)':x.t==='poc'?")
rep("const w=L.slice().sort((a,b)=>a.v-b.v)[0];","const w=L.slice().sort((a,b)=>(a.ev?99:0)+a.v-(b.ev?99:0)-b.v)[0];")
# estilos
rep("\n.twBag .bgw{",r"""
.twTit{--c:#ffc531;display:inline-block;margin-left:.4em;padding:0 .4em;border:1px solid var(--c);border-radius:.3em;color:var(--c);font:900 .62em var(--f-ui);font-style:normal;letter-spacing:.06em;vertical-align:middle;background:color-mix(in srgb,var(--c) 15%,transparent)}
#twEvB{position:relative}#twEvDot{position:absolute;top:-.25em;right:-.25em;width:.7em;height:.7em;border-radius:50%;display:none}#twEvDot.live{display:block;background:#ff2e2e;box-shadow:0 0 .6em #ff2e2e;animation:twBlink 1s infinite}#twEvDot.soon{display:block;background:#ffcf4a}
@keyframes twBlink{50%{opacity:.25}}
.evSt{display:flex;flex-direction:column;gap:.15em;margin:.2em auto .5em;padding:.4em 1em;border-radius:.6em;background:#1a0a10;border:1px solid #5a2a30;width:fit-content}.evSt b{font-size:1.15em;color:#ffcf4a}.evSt.aovivo b{color:#ff5a5a}.evSt span{font-size:.75em;color:#cdbfcf}
.evPzs{display:flex;gap:1em;justify-content:center;flex-wrap:wrap}.evPz{--c:#ffc531;display:flex;align-items:center;gap:.6em;padding:.4em .8em;border:2px solid var(--c);border-radius:.7em;background:radial-gradient(circle at 0% 50%,color-mix(in srgb,var(--c) 30%,transparent),#0b0710 70%);text-align:left}
.evPz i{font-size:1.8em;font-style:normal}.evPz img{width:4.2em;height:4.2em;object-fit:contain}.evPz div{display:flex;flex-direction:column}.evPz b{color:var(--c)}.evPz span{font-size:.72em}.evPz em{font-size:.7em;color:#ffcf4a;font-style:normal}
.evPz.big img{width:8em;height:8em}.evPz.big{margin:.6em auto;width:fit-content}
.twTits{display:grid;grid-template-columns:repeat(5,1fr);gap:.6em;margin:.5em 0}.tt{--c:#888;display:flex;flex-direction:column;align-items:center;gap:.2em;padding:.6em .4em;border:2px solid #3a2a30;border-radius:.7em;background:#120a12;color:#8a7a80;font:700 .9em var(--f-ui);cursor:pointer}
.tt i{font-size:2.2em;font-style:normal;filter:grayscale(1) opacity(.5)}.tt b{font-size:.95em}.tt span{font-size:.65em}.tt em{font-style:normal;font-size:.7em;padding:.2em .5em;border-radius:.3em;background:#2a1a24}
.tt.got{border-color:var(--c);color:#fff;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--c) 30%,transparent),#120a12 70%)}.tt.got i{filter:none}.tt.got b{color:var(--c)}.tt.on{box-shadow:0 0 1.2em var(--c)}.tt.on em{background:var(--c);color:#000}
.twBag .bgw{""")
rep("function twRank(tab,cid){tab=tab||'t';","function twRank(tab,cid){tab=tab||'w';")
open(P,'w').write(s);print('ok',len(s))
