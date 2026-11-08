import sys,re
# v196: Torre — 3 BAÚS abrem depois de cada andar (dentro: as 4 cartas e, às vezes, um EQUIPAMENTO) + MOCHILA permanente (equipamentos nunca expiram)
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
# --- mochila salva no aparelho ---
rep("const twEqB=st=>{let v=0;for(const E of TWEQ)if(E.s===st&&TW.eq[E.k])v+=TW.eq[E.k].v;return v};",
r"""const TWEQP=.2;/* chance de vir equipamento num dos baús (por andar vencido) */
const twInv=()=>twLS.g('tw_inv',[]),twEqp=()=>twLS.g('tw_eqp',{});
function twEqOn(){const I=twInv(),Q=twEqp(),o={};for(const E of TWEQ){const it=I.find(x=>x.id===Q[E.k]);if(it)o[E.k]=it}return o}
const twEqB=st=>{const o=twEqOn();let v=0;for(const E of TWEQ)if(E.s===st&&o[E.k])v+=o[E.k].v;return v};
const twRarOf=k=>TWEQR.find(r=>r.k===k)||TWEQR[0];
function twAddItem(E,R){const I=twInv(),it={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:E.k,r:R.k,v:R.v};I.push(it);
  while(I.length>60){const Q=twEqp(),j=I.findIndex(x=>x.r==='comum'&&!Object.values(Q).includes(x.id));I.splice(j>=0?j:0,1)}twLS.s('tw_inv',I);
  const Q=twEqp(),cur=I.find(x=>x.id===Q[E.k]);if(!cur||it.v>cur.v){Q[E.k]=it.id;twLS.s('tw_eqp',Q)}return it}
function twBag(){if(!$('twModal').hidden&&!$('twModal').querySelector('.twBag'))return;const I=twInv(),Q=twEqp();
  const col=E=>{const L=I.filter(x=>x.t===E.k).sort((a,b)=>b.v-a.v);return `<div class="bgc"><h5>${E.i} ${E.n}<small>${E.d}</small></h5>${L.length?L.map(x=>{const R=twRarOf(x.r),on=Q[E.k]===x.id;return `<button class="bgi ${on?'on':''}" data-id="${x.id}" data-t="${E.k}" style="--c:${R.c}"><b>${E.i} +${x.v}%</b><span>${R.n}</span><em>${on?'EQUIPADO':'EQUIPAR'}</em></button>`}).join(''):'<p class="twH">Nenhum ainda.<br>Ache nos baús da torre!</p>'}</div>`};
  twModal(`<div class="twM twBag"><h3>🎒 MOCHILA</h3><p class="twH">Equipamentos achados nos baús. Nunca expiram. Toque para equipar (1 de cada tipo). Vale em todas as subidas da torre.</p><div class="bgw">${TWEQ.map(col).join('')}</div><div class="row"><button class="btn main" id="twBagX">FECHAR</button></div></div>`);
  $('twBagX').onclick=()=>{twModal(null);twRender()};
  document.querySelectorAll('#twModal .bgi').forEach(b=>b.onclick=()=>{const Q=twEqp();Q[b.dataset.t]=Q[b.dataset.t]===b.dataset.id?null:b.dataset.id;twLS.s('tw_eqp',Q);twSfx('clang');twBag()})}""")
# painel: equipados vêm da mochila
rep("""class="eq">${TWEQ.map(E=>{const q=TW.eq[E.k];return q?`<i style="color:${q.c}" title="${E.n} ${q.n}">${E.i}+${q.v}%</i>`:`<i class="no">${E.i}—</i>`}).join('')}</span>`;""",
    """class="eq">${(()=>{const o=twEqOn();return TWEQ.map(E=>{const q=o[E.k];return q?`<i style="color:${twRarOf(q.r).c}" title="${E.n} ${twRarOf(q.r).n}">${E.i}+${q.v}%</i>`:`<i class="no">${E.i}—</i>`}).join('')})()}</span>`;""")
rep('<button id="twNameB">✏️ NOME</button>','<button id="twBagB">🎒 MOCHILA</button><button id="twNameB">✏️ NOME</button>')
rep("$('twNameB').onclick=","$('twBagB').onclick=()=>{if(!$('twModal').hidden||TW.busy)return;twSfx('whoosh');twBag()};$('twNameB').onclick=")
# --- baús ---
rep("""  twModal(`<div class="twM"><h3>ANDAR ${won+1} VENCIDO!</h3><div class="twTs">${twTrofHTML(ks)}</div>
    <h4>ESCOLHA UMA PASSIVA</h4><div class="twPs q4">""",
r"""  const drop=Math.random()<(window.__twEq!=null?window.__twEq:TWEQP)?{E:TWEQ[(Math.random()*3)|0],R:twEqRoll(),c:(Math.random()*3)|0}:null;
  const inC=[[0,1],[2],[3]];twShuf(inC);const chest=i=>{const cs=inC[i].map(j=>opts[j]),best=[drop&&drop.c===i?drop.R:null,...cs.map(o=>o.R)].filter(Boolean).reduce((a,R)=>TWRAR.findIndex(x=>x.k===R.k)>TWRAR.findIndex(x=>x.k===a.k)||R.k==='sec'?R:a,cs[0].R);
    return `<div class="twCh" data-i="${i}" style="--c:${best.c}"><div class="lid"></div><div class="box"><i class="lock"></i></div><div class="glow"></div><div class="loot">${cs.map(o=>`<span>${o.p.i}</span>`).join('')}${drop&&drop.c===i?`<span class="it" style="--c:${drop.R.c}">${drop.E.i}</span>`:''}</div></div>`};
  twModal(`<div class="twM"><h3>ANDAR ${won+1} VENCIDO!</h3><div class="twTs">${twTrofHTML(ks)}</div>
    <div class="twChs">${[0,1,2].map(chest).join('')}</div><p class="twH" id="twChT">Toque nos baús para abrir!</p>
    <div class="twDrop" id="twDrop" hidden></div>
    <div id="twCards" hidden><h4>ESCOLHA UMA PASSIVA</h4><div class="twPs q4">""")
rep("""<span class="ds">${o.p.d}</span></button>`).join('')}</div>
    <p class="twH">Você vai recuperar""","""<span class="ds">${o.p.d}</span></button>`).join('')}</div></div>
    <p class="twH">Você vai recuperar""")
rep("""  if(opts.some(o=>o.R.k==='lend'||o.R.k==='mit'||o.R.k==='sec'))twSfx('powerUp');if(opts.some(o=>o.R.k==='sec'))setTimeout(()=>{twToast('👁️ UMA CARTA SECRETA APARECEU!','#ffffff');twSfx('boom')},300);""",
r"""  let nOpen=0;const openC=el=>{if(el.classList.contains('open'))return;el.classList.add('open');twSfx('boom');nOpen++;const i=+el.dataset.i;
      if(drop&&drop.c===i){const it=twAddItem(drop.E,drop.R);if(drop.R.k==='mit'&&!TW.tr.some(t=>t.k==='eqm'))TW.tr.push({k:'eqm',fl:won});const D=$('twDrop');D.hidden=false;D.style.setProperty('--c',drop.R.c);
        D.innerHTML=`<b>${drop.E.i} ${drop.E.n} ${drop.R.n} +${drop.R.v}%</b><span>Foi para a 🎒 MOCHILA${twEqp()[drop.E.k]===it.id?' e já está EQUIPADO':''}</span>`;setTimeout(()=>twSfx('powerUp'),250)}
      if(inC[i].some(j=>opts[j].R.k==='sec'))setTimeout(()=>{twToast('👁️ UMA CARTA SECRETA APARECEU!','#ffffff');twSfx('boom')},300);
      if(nOpen>=3)setTimeout(()=>{$('twChT').hidden=true;$('twCards').hidden=false;if(opts.some(o=>o.R.k==='lend'||o.R.k==='mit'||o.R.k==='sec'))twSfx('powerUp')},650)};
  document.querySelectorAll('#twModal .twCh').forEach(el=>el.onclick=()=>openC(el));
  [0,1,2].forEach(i=>setTimeout(()=>{const el=document.querySelector('#twModal .twCh[data-i="'+i+'"]');if(el)openC(el)},1400+i*700));""")
# depois de escolher a carta -> direto para o próximo andar (sem tela de drop)
rep("setTimeout(()=>twEquip(won),900)},380)})}","setTimeout(()=>twReveal(TW.fl),900)},380)})}")
i=s.index("function twEquip(won){");j=s.index("\n",s.index("setTimeout(()=>twReveal(TW.fl),900)},380)})}",i))+1;s=s[:i]+s[j:]
# remove TW.eq da subida (agora vem da mochila)
rep("TW.eq={};","",2);rep("eq:{},","")
# --- estilos ---
rep("\n.twp.eqc .ic{font-size:3em}",r"""
.twChs{display:flex;justify-content:center;gap:3em;margin:2.6em 0 .2em}
.twCh{--c:#c3c8d2;position:relative;width:9em;height:8em;cursor:pointer;animation:twChIn .5s cubic-bezier(.2,1.4,.4,1) both,twChShk .5s 1s ease-in-out infinite}
.twCh:nth-child(2){animation-delay:.12s,1.1s}.twCh:nth-child(3){animation-delay:.24s,1.2s}
.twCh .box{position:absolute;left:0;right:0;bottom:0;height:4.6em;border-radius:.3em .3em .5em .5em;background:linear-gradient(180deg,#8a4a1c,#4a2309);border:.25em solid #e2a93b;box-shadow:inset 0 0 0 .35em #5a2c0b,0 .4em 1em rgba(0,0,0,.6)}
.twCh .box:before{content:'';position:absolute;left:44%;top:-.3em;width:12%;height:110%;background:#e2a93b}
.twCh .lock{position:absolute;left:50%;top:.3em;width:1.4em;height:1.6em;margin-left:-.7em;background:#ffd56a;border-radius:.3em;box-shadow:0 0 .6em #ffcf4a}
.twCh .lid{position:absolute;left:-.2em;right:-.2em;bottom:4.2em;height:2.8em;border-radius:3em 3em .3em .3em;background:linear-gradient(180deg,#a65a22,#5e2d0c);border:.25em solid #e2a93b;transform-origin:50% 100%;transition:transform .45s cubic-bezier(.3,1.6,.5,1);z-index:2}
.twCh .glow{position:absolute;left:50%;bottom:3.5em;width:12em;height:12em;margin-left:-6em;border-radius:50%;background:radial-gradient(circle,var(--c),transparent 65%);opacity:0;transform:scale(.2);transition:.5s;pointer-events:none}
.twCh .loot{position:absolute;left:50%;bottom:4em;transform:translate(-50%,1em) scale(.3);opacity:0;display:flex;gap:.3em;font-size:2em;transition:.5s .15s cubic-bezier(.2,1.6,.4,1);z-index:3}
.twCh .loot .it{filter:drop-shadow(0 0 .3em var(--c))}
.twCh.open{animation:twChIn .5s both}.twCh.open .lid{transform:translateY(-1.2em) rotate(-35deg)}.twCh.open .glow{opacity:.9;transform:scale(1)}.twCh.open .loot{opacity:1;transform:translate(-50%,-1.6em) scale(1)}.twCh.open .lock{display:none}
@keyframes twChIn{from{transform:scale(.3) translateY(2em);opacity:0}}
@keyframes twChShk{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
.twDrop{--c:#fff;margin:.3em auto;padding:.4em 1.2em;border:2px solid var(--c);border-radius:.6em;display:inline-flex;flex-direction:column;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--c) 45%,transparent),#0b0710 80%);box-shadow:0 0 1.5em var(--c);animation:twCard .55s cubic-bezier(.2,1.4,.4,1) both}
.twDrop b{color:var(--c);font-size:1.1em}.twDrop span{font-size:.75em;color:#e6dbe8}.twDrop[hidden]{display:none}
.twBag .bgw{display:flex;gap:1em;justify-content:center;align-items:flex-start;margin:.4em 0}
.twBag .bgc{flex:1;max-width:16em;display:flex;flex-direction:column;gap:.4em;max-height:52vh;overflow:auto;padding:.2em}
.twBag h5{margin:0 0 .2em;font:900 1em var(--f-ui);letter-spacing:.1em;color:#ffcf4a;display:flex;flex-direction:column}.twBag h5 small{font-size:.65em;color:#cdbfcf;letter-spacing:0}
.bgi{--c:#ccc;display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto;align-items:center;padding:.35em .6em;border:2px solid var(--c);border-radius:.5em;background:#120a14;color:#fff;font:700 .9em var(--f-ui);cursor:pointer;text-align:left}
.bgi b{color:var(--c)}.bgi span{font-size:.7em;color:var(--c);grid-row:2}.bgi em{grid-row:1/3;grid-column:2;font-style:normal;font-size:.7em;padding:.3em .5em;border-radius:.3em;background:#2a1a30}
.bgi.on{box-shadow:0 0 1em var(--c);background:radial-gradient(circle at 0% 50%,color-mix(in srgb,var(--c) 35%,transparent),#120a14 70%)}.bgi.on em{background:var(--c);color:#000}
#twInfo .bt{flex-wrap:wrap}""")
open(P,'w').write(s);print('ok',len(s))
