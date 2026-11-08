import sys,json
# v198: artes do dono na Torre — tela "ANDAR VENCIDO!" (baús ganhos pelo desempenho + troféus + 4 cartas), MOCHILA com 20 espaços e 5 de equipados,
#       ícones de espada/armadura/botas/poção e baús por raridade. Troféus novos de desempenho.
P=sys.argv[1];s=open(P).read();IT=json.load(open('/home/claude/mo_build/items.json'))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
IMG={'esp':IT['espadas'],'arm':IT['armaduras'],'bot':IT['botas'],'poc':IT['pocoes'],'bf':IT['bau_f'],'ba':IT['bau_a'],'av':IT['andar_vencido'],'mo':IT['mochila']}
# --- troféus novos de desempenho ---
rep("sec:{n:'Carta Secreta',","rap2:{n:'Raio',i:'🌩️',d:'Vencer em menos de 15 segundos',p:3},perf:{n:'Perfeito',i:'💎',d:'Vencer em menos de 30 s sem perder vida',p:5},mur:{n:'Muralha',i:'🧱',d:'Vencer perdendo menos de 10% da vida',p:2},cmb2:{n:'Combo Insano',i:'🌀',d:'Fazer um combo de 20 golpes ou mais',p:3},sec:{n:'Carta Secreta',")
rep("if(secs<30)ks.push('rap');if(F.hp0-hpE<=.02)ks.push('int');",
    "if(secs<30)ks.push('rap');if(secs<15)ks.push('rap2');const lost=Math.max(0,F.hp0-hpE);if(lost<=.02)ks.push('int');else if(lost<.1)ks.push('mur');if(lost<=.02&&secs<30)ks.push('perf');if(F.cmb>=20)ks.push('cmb2');TW.lastSt={secs,lost,cmb:F.cmb};")
# --- dados das artes + mochila de 20 espaços ---
rep("const TWEQP=.2;/* chance de vir equipamento num dos baús (por andar vencido) */",
"const TWEQP=.2;/* (v196, não usado desde a v198) */\nconst TWIMG="+json.dumps(IMG,separators=(',',':'))+r""";const TWRK=['comum','rara','epica','lend','mit'];
const twIco=(t,r)=>TWIMG[t][Math.max(0,TWRK.indexOf(r))];const TWBAG=20;
for(const k of ['esp','arm','bot','poc'])for(const p of TWIMG[k]){const im=new Image();im.src=p}
/* baús por desempenho: pontos de troféu do andar 2+ = 1 baú, 5+ = 2, 9+ = 3. Dentro: poção (60%) ou equipamento (40%, raridade difícil) */
function twChests(ks){const P=ks.reduce((a,k)=>a+TWTR[k].p,0),n=window.__twCh!=null?window.__twCh:P>=9?3:P>=5?2:P>=2?1:0,L=[];
  for(let i=0;i<n;i++){if(Math.random()<.6){const R=twPoRoll();L.push({t:'poc',R})}else{const E=TWEQ[(Math.random()*3)|0];L.push({t:E.k,E,R:twEqRoll()})}}return L}
function twBagItems(){const Q=twEqp(),on=Object.values(Q);return twInv().filter(x=>!on.includes(x.id)).map(x=>Object.assign({k:'eq'},x)).concat(twPocs().map(x=>Object.assign({k:'poc',t:'poc'},x)))}
function twCap(){let L=twBagItems(),out=null;while(L.length>TWBAG){const w=L.slice().sort((a,b)=>a.v-b.v)[0];if(w.k==='poc'){twLS.s('tw_poc',twPocs().filter(x=>x.id!==w.id))}else{twLS.s('tw_inv',twInv().filter(x=>x.id!==w.id))}out=w;L=twBagItems()}return out}
function twFit(el,W0,H0){if(!el)return;const W=Math.min(innerWidth*.97,innerHeight*.97*W0/H0);el.style.width=W+'px';el.style.height=(W*H0/W0)+'px';el.style.fontSize=(W/100)+'px'}
addEventListener('resize',()=>{twFit(document.querySelector('#twModal .twAV'),1847,851);twFit(document.querySelector('#twModal .twMO'),1846,852)});
const twBx=(x0,y0,x1,y1,W,H)=>`left:${x0/W*100}%;top:${y0/H*100}%;width:${(x1-x0)/W*100}%;height:${(y1-y0)/H*100}%`;""")
rep("I.push(it);\n  while(I.length>60){const Q=twEqp(),j=I.findIndex(x=>x.r==='comum'&&!Object.values(Q).includes(x.id));I.splice(j>=0?j:0,1)}twLS.s('tw_inv',I);",
    "I.push(it);twLS.s('tw_inv',I);")
rep("const Q=twEqp(),cur=I.find(x=>x.id===Q[E.k]);if(!cur||it.v>cur.v){Q[E.k]=it.id;twLS.s('tw_eqp',Q)}return it}",
    "const Q=twEqp(),cur=I.find(x=>x.id===Q[E.k]);if(!cur||it.v>cur.v){Q[E.k]=it.id;twLS.s('tw_eqp',Q)}TW.capOut=twCap();return it}")
rep("twLS.s('tw_poc',L.slice(-40))}","twLS.s('tw_poc',L);TW.capOut=twCap()}")
# --- MOCHILA nova (arte do dono) ---
i=s.index("function twBag(){");j=s.index("function twPassive(")
s=s[:i]+r"""const TWMOG=[];for(let r=0;r<2;r++)for(let c=0;c<10;c++){const x0=[125,287,448,610,771,934,1095,1257,1419,1580][c],y0=r?288:127;TWMOG.push([x0,y0,x0+142,y0+138])}
const TWMOE=[['arm',278,562,476,750],['bot',558,562,755,751],['cap',827,562,1024,751],['esp',1094,563,1291,750],['poc',1374,562,1571,751]];
function twBag(sel){if(!$('twModal').hidden&&!$('twModal').querySelector('.twMO'))return;const Q=twEqp(),I=twInv(),on=twPocOn(),L=twBagItems().sort((a,b)=>b.v-a.v||(a.k>b.k?1:-1)),W=1846,H=852;
  const nm=x=>x.t==='poc'?'POÇÃO':TWEQ.find(E=>E.k===x.t).n,ef=x=>x.t==='poc'?'Transformação +'+x.v+'% (uso único, próxima luta)':{esp:'Ataque',arm:'Defesa',bot:'Velocidade'}[x.t]+' +'+x.v+'% (permanente)';
  const cell=(x,b,extra)=>`<button class="moS ${extra||''}" style="${b};--c:${twRarOf(x.r).c}" data-id="${x.id}" data-k="${x.k||'eq'}"><img src="${twIco(x.t,x.r)}" alt=""><b>+${x.v}%</b></button>`;
  let g='';TWMOG.forEach((b,i)=>{const x=L[i],bx=twBx(...b,W,H);g+=x?cell(x,bx):`<span class="moS em" style="${bx}"></span>`});
  let e='';for(const [k,...b] of TWMOE){const bx=twBx(...b,W,H);if(k==='cap'){e+=`<span class="moS lock" style="${bx}"><i>EM BREVE</i></span>`;continue}
    const x=k==='poc'?(on?Object.assign({t:'poc',k:'on'},on):null):I.find(y=>y.id===Q[k]);e+=x?cell(Object.assign({},x,{k:k==='poc'?'on':'eqd'}),bx,'eqd'):`<span class="moS em eqe" style="${bx}"></span>`}
  const tot={esp:0,arm:0,bot:0};for(const E of TWEQ){const x=I.find(y=>y.id===Q[E.k]);if(x)tot[E.k]=x.v}
  twModal(`<div class="twMO" style="background-image:url(${TWIMG.mo})">${g}${e}
    <div class="moT l">⚔️ ATAQUE <b>+${tot.esp}%</b> · 🛡️ DEFESA <b>+${tot.arm}%</b></div><div class="moT r">🥾 VEL. <b>+${tot.bot}%</b> · 🧪 <b>${on?'+'+on.v+'% ATIVA':'nenhuma'}</b></div>
    <div class="moT c">🎒 MOCHILA ${L.length}/${TWBAG}</div><button class="moX" id="twBagX">✕</button><div class="moD" id="twMoD" hidden></div></div>`);
  twFit(document.querySelector('#twModal .twMO'),W,H);$('twBagX').onclick=()=>{twModal(null);twRender()};
  const det=(x,src)=>{const D=$('twMoD'),R=twRarOf(x.r);let bt='';
      if(src==='eq')bt=`<button class="btn main" data-a="eq">EQUIPAR</button><button class="btn" data-a="del">DESCARTAR</button>`;
      else if(src==='poc')bt=`<button class="btn main" data-a="beber" ${on?'disabled':''}>${on?'JÁ TEM UMA ATIVA':'BEBER'}</button><button class="btn" data-a="del">DESCARTAR</button>`;
      else if(src==='eqd')bt=`<button class="btn main" data-a="tirar">DESEQUIPAR</button>`;
      D.innerHTML=`<div class="mdI" style="--c:${R.c}"><img src="${twIco(x.t,x.r)}" alt=""><div><span style="color:${R.c}">${R.n}</span><b>${nm(x)}</b><em>${ef(x)}</em>${src==='on'?'<em>Bebida: vale na próxima luta da torre</em>':''}</div></div><div class="row">${bt}<button class="btn" data-a="x">FECHAR</button></div>`;D.hidden=false;
      D.querySelectorAll('button[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;
        if(a==='eq'){const Q=twEqp();Q[x.t]=x.id;twLS.s('tw_eqp',Q);twSfx('clang');TW.capOut=twCap()}
        else if(a==='tirar'){const Q=twEqp();delete Q[x.t];twLS.s('tw_eqp',Q);twSfx('whoosh');const o=twCap();if(o)twToast('Mochila cheia: '+nm(o)+' +'+o.v+'% descartado','#ff8080')}
        else if(a==='beber'){if(twPocOn())return;twLS.s('tw_poc',twPocs().filter(y=>y.id!==x.id));twLS.s('tw_pocOn',{id:x.id,r:x.r,v:x.v});twSfx('powerUp');twToast('🧪 POÇÃO +'+x.v+'% BEBIDA! Vale na próxima luta','#7dff9a')}
        else if(a==='del'){if(x.t==='poc')twLS.s('tw_poc',twPocs().filter(y=>y.id!==x.id));else twLS.s('tw_inv',twInv().filter(y=>y.id!==x.id));twSfx('boom')}
        if(a==='x'){D.hidden=true;return}twBag()})};
  document.querySelectorAll('#twModal .moS[data-id]').forEach(b=>b.onclick=()=>{const k=b.dataset.k,id=b.dataset.id;
    if(k==='on')return det(Object.assign({t:'poc'},twPocOn()),'on');
    if(k==='eqd'){const x=twInv().find(y=>y.id===id);return x&&det(x,'eqd')}
    const x=L.find(y=>y.id===id);if(x)det(x,x.k==='poc'?'poc':'eq')})}
"""+s[j:]
# --- tela ANDAR VENCIDO (arte do dono): baús por desempenho em cima, troféus à direita, 4 cartas embaixo ---
i=s.index("  const drop=Math.random()<(window.__twEq");j=s.index("  document.querySelectorAll('#twModal .twp').forEach(b=>b.onclick=()=>{const o=opts[+b.dataset.i];",i)
s=s[:i]+r"""  const W=1847,H=851,CH=twChests(ks),CS=[[385,215,575,401],[640,215,832,401],[897,215,1089,401]],CA=[[276,547,556,750],[618,547,899,750],[959,547,1239,751],[1298,547,1576,750]],P=ks.reduce((a,k)=>a+TWTR[k].p,0),St=TW.lastSt||{secs:0,lost:0,cmb:0};
  const chest=(i)=>{const c=CH[i],bx=twBx(...CS[i],W,H);if(!c)return `<div class="avC none" style="${bx}"><i>SEM BAÚ</i></div>`;const ri=TWRK.indexOf(c.R.k);
    return `<div class="avC" data-i="${i}" style="${bx};--c:${c.R.c};animation-delay:${.2+i*.18}s"><img class="cf" src="${TWIMG.bf[ri]}" alt=""><img class="ca" src="${TWIMG.ba[ri]}" alt=""><img class="it" src="${twIco(c.t,c.R.k)}" alt=""><b class="lb">${c.t==='poc'?'POÇÃO':c.E.n} +${c.R.v}%</b></div>`};
  twModal(`<div class="twAV" style="background-image:url(${TWIMG.av})">
    <div class="avN">ANDAR ${won+1} · ⏱ ${twFmt(St.secs)} · 💔 perdeu ${Math.round(St.lost*100)}% da vida · 👊 combo ${St.cmb}</div>
    ${[0,1,2].map(chest).join('')}
    <div class="avTr" style="${twBx(1300,212,1565,330,W,H)}">${ks.map((k,i)=>`<span style="animation-delay:${.3+i*.1}s" title="${TWTR[k].n}">${TWTR[k].i}<small>+${TWTR[k].p}</small></span>`).join('')}</div>
    <div class="avP" style="${twBx(1312,333,1553,393,W,H)}">+${P} 🏆</div>
    <div class="avTn" style="${twBx(1290,398,1575,420,W,H)}">${ks.map(k=>TWTR[k].n).join(' · ')}</div>
    ${opts.map((o,i)=>`<button class="twp avp ${o.R.k}" data-i="${i}" style="${twBx(...CA[i],W,H)};--c:${o.R.c};animation-delay:${.25+i*.15}s"><span class="rr">${o.R.n}</span><span class="ic">${o.p.i}</span><b>${o.p.k==='sec'?'???':'+'+o.v+(o.p.k==='barra'?'':'%')}</b><span class="nm">${o.p.n}</span><span class="ds">${o.p.d}</span></button>`).join('')}
    <div class="avH">Recupera <b>60%</b> da vida · Próximo rival: <b>${TWOB[won+1]||7} barras</b>${CH.length?' · Toque nos baús!':' · Faça troféus para ganhar baús'}</div></div>`);
  twFit(document.querySelector('#twModal .twAV'),W,H);
  if(opts.some(o=>o.R.k==='lend'||o.R.k==='mit'||o.R.k==='sec'))twSfx('powerUp');if(opts.some(o=>o.R.k==='sec'))setTimeout(()=>{twToast('👁️ UMA CARTA SECRETA APARECEU!','#ffffff');twSfx('boom')},300);
  const openC=el=>{if(!el||el.classList.contains('open'))return;el.classList.add('open');const c=CH[+el.dataset.i];twSfx('boom');
    if(c.t==='poc')twAddPoc(c.R);else{twAddItem(c.E,c.R);if(c.R.k==='mit'&&!TW.tr.some(t=>t.k==='eqm'))TW.tr.push({k:'eqm',fl:won})}
    if(c.R.k!=='comum')setTimeout(()=>twSfx('powerUp'),250);if(TW.capOut){const o=TW.capOut;TW.capOut=null;twToast('Mochila cheia: o mais fraco (+'+o.v+'%) foi descartado','#ff8080')}};
  document.querySelectorAll('#twModal .avC[data-i]').forEach(el=>el.onclick=()=>openC(el));
  CH.forEach((c,i)=>setTimeout(()=>openC(document.querySelector('#twModal .avC[data-i="'+i+'"]')),2200+i*800));
"""+s[j:]
rep("const o=opts[+b.dataset.i];if(o.p.k==='barra')","document.querySelectorAll('#twModal .avC[data-i]').forEach(el=>openC(el));const o=opts[+b.dataset.i];if(o.p.k==='barra')")
# --- estilos ---
rep("\n.twBag .bgw{",r"""
.twAV,.twMO{position:relative;background-size:100% 100%;flex:none;color:#fff;font-family:var(--f-ui);animation:twIn .35s both}
.twAV>*,.twMO>*{position:absolute}
.avN{left:0;right:0;top:22.3%;text-align:center;font:900 .95em var(--f-ui);letter-spacing:.06em;color:#ffcf4a;text-shadow:0 0 .4em #ff3000}
.avSt{left:0;right:0;bottom:1.2%;text-align:center;font:700 1em var(--f-ui);color:#ffe2c8;text-shadow:0 1px 2px #000}
.avH{left:0;right:0;top:90.4%;text-align:center;font:700 .95em var(--f-ui);color:#e8d8e0;text-shadow:0 1px 3px #000}.avH b{color:#7dff9a}
.avC{animation:twCard .55s cubic-bezier(.2,1.4,.4,1) both,twChShk .5s 1.2s ease-in-out 3;cursor:pointer}
.avC img{position:absolute;inset:3%;width:94%;height:94%;object-fit:contain}.avC .ca,.avC .it,.avC .lb{opacity:0}
.avC .it{inset:14% 22% 30%;width:56%;height:56%;transform:scale(.2);transition:.5s .15s cubic-bezier(.2,1.6,.4,1);filter:drop-shadow(0 0 .6em var(--c))}
.avC .lb{position:absolute;left:-10%;right:-10%;bottom:-11%;text-align:center;font:900 1em var(--f-ui);color:var(--c);text-shadow:0 0 .3em #000,0 1px 2px #000;transition:.3s .4s}
.avC.open{animation:twCard .3s both}.avC.open .cf{opacity:0}.avC.open .ca{opacity:1}.avC.open .it{opacity:1;transform:translateY(-38%) scale(1.05)}.avC.open .lb{opacity:1}
.avC.none{display:flex;align-items:center;justify-content:center;cursor:default}.avC.none i{font:900 .9em var(--f-ui);font-style:normal;color:#6a4a40;letter-spacing:.15em}
.avTr{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.2em;pointer-events:none}
.avTr span{display:flex;flex-direction:column;align-items:center;font-size:1.2em;line-height:1;animation:twCard .4s both;filter:drop-shadow(0 0 .2em #000)}.avTr small{font:900 .45em var(--f-ui);color:#7dff9a}
.avP{display:flex;align-items:center;justify-content:center;font:900 2.4em var(--f-display);color:#ffd84a;text-shadow:0 0 .3em #ff6a00,0 2px 3px #000}
.avTn{text-align:center;font:700 .62em var(--f-ui);color:#ffe9b0;line-height:1.1;overflow:hidden}
.twp.avp{width:auto;padding:.4em .3em;border-radius:.6em;border:.18em solid var(--c);background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--c) 32%,transparent),rgba(10,5,10,.6) 75%);font-size:1em;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.05em}
.twp.avp .rr{font-size:.85em}.twp.avp .ic{font-size:2.6em;line-height:1.05}.twp.avp b{font-size:1.9em}.twp.avp .nm{font-size:.95em}.twp.avp .ds{font-size:.68em;line-height:1.15;padding:0 .3em}
.moS{display:flex;align-items:center;justify-content:center;background:none;border:0;padding:0;cursor:pointer;border-radius:.6em}
.moS:not(.em):not(.lock){box-shadow:inset 0 0 1.2em color-mix(in srgb,var(--c) 70%,transparent);background:radial-gradient(circle,color-mix(in srgb,var(--c) 30%,transparent),transparent 70%)}
.moS img{width:86%;height:86%;object-fit:contain;filter:drop-shadow(0 0 .3em var(--c))}.moS b{position:absolute;right:6%;bottom:4%;font:900 1em var(--f-ui);color:#fff;text-shadow:0 0 .2em #000,0 0 .4em var(--c)}
.moS.eqd img{width:80%;height:80%}.moS.lock{display:flex;align-items:flex-end;justify-content:center}.moS.lock i{font:900 .9em var(--f-ui);font-style:normal;color:#ffcf4a;margin-bottom:10%;text-shadow:0 0 .3em #000}
.moT{top:61.2%;font:800 1.15em var(--f-ui);color:#ffe7c0;text-shadow:0 1px 3px #000}.moT b{color:#7dff9a}.moT.l{left:12%}.moT.r{right:12%}.moT.c{top:1%;left:4%;right:auto;text-align:left;font:900 1.4em var(--f-ui);color:#ffcf4a;letter-spacing:.1em}
.moX{top:7%;right:2.2%;width:3.6em;height:3.6em;border-radius:50%;border:.2em solid #e2a93b;background:#3a0a0a;color:#ffcf4a;font:900 1.8em var(--f-ui);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.8em;width:2em;height:2em}
.moD{left:25%;right:25%;top:22%;padding:1em;background:linear-gradient(160deg,#2a0a0e,#0a0610);border:.2em solid #e2a93b;border-radius:.8em;box-shadow:0 0 3em #000;font-size:1.2em;z-index:5}
.moD .mdI{display:flex;gap:1em;align-items:center;text-align:left}.moD .mdI img{width:7em;height:7em;object-fit:contain;filter:drop-shadow(0 0 .5em var(--c))}.moD .mdI div{display:flex;flex-direction:column;gap:.2em}.moD .mdI b{font-size:1.4em}.moD .mdI em{font-style:normal;font-size:.85em;color:#e0d0d8}.moD .mdI span{font:900 .9em var(--f-ui);letter-spacing:.2em}
.moD .row{display:flex;gap:.6em;justify-content:center;margin-top:.8em}.moD .btn{font-size:.9em}
.twBag .bgw{""")
open(P,'w').write(s);print('ok',len(s))
