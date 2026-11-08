import sys
# v197: Poção vira item de USO ÚNICO (bônus de transformação, comum→mítico 1–10%, mais fácil de achar); no lugar dela entram as BOTAS (velocidade)
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("{k:'poc',n:'POÇÃO',i:'🧪',s:'vel',d:'Aumenta a VELOCIDADE'}];",
r"""{k:'bot',n:'BOTAS',i:'🥾',s:'vel',d:'Aumenta a VELOCIDADE'}];
/* poção: uso único, bônus na transformação (enche a energia mais rápido e já começa com uma parte) — vale para a PRÓXIMA luta da torre */
const TWPOC={k:'poc',n:'POÇÃO',i:'🧪',d:'Transforma mais rápido · uso único (próxima luta)'};
const TWPOR=[{k:'comum',n:'COMUM',c:'#c3c8d2',w:60,v:1},{k:'rara',n:'RARA',c:'#3d9bff',w:30,v:4},{k:'epica',n:'ÉPICA',c:'#b25bff',w:7.5,v:5},{k:'lend',n:'LENDÁRIA',c:'#ffc531',w:2,v:7},{k:'mit',n:'MÍTICA',c:'#ff2e63',w:.5,v:10}];
const TWPOP=.4;/* chance de vir poção num baú (por andar vencido) */
function twPoRoll(){let r=Math.random()*100;for(const R of TWPOR){if((r-=R.w)<0)return R}return TWPOR[0]}
const twPocs=()=>twLS.g('tw_poc',[]),twPocOn=()=>twLS.g('tw_pocOn',null);
function twAddPoc(R){const L=twPocs();L.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),r:R.k,v:R.v});twLS.s('tw_poc',L.slice(-40))}
/* poções antigas (v196 eram equipamento de velocidade) viram poções de uso único */
(function(){try{const I=twLS.g('tw_inv',[]),old=I.filter(x=>x.t==='poc');if(old.length){twLS.s('tw_inv',I.filter(x=>x.t!=='poc'));const L=twLS.g('tw_poc',[]);for(const x of old)L.push({id:x.id,r:x.r,v:x.v});twLS.s('tw_poc',L);const Q=twLS.g('tw_eqp',{});delete Q.poc;twLS.s('tw_eqp',Q)}}catch(e){}})();""")
# efeito: poção soma na transformação e é gasta ao começar a luta
rep("p.tsb=1+(TW.pas.trf||0)/100;if(TW.pas.trf)p.sb=Math.max(p.sb||0,Math.min(SB_COST*.9,SB_COST*TW.pas.trf/200));",
    "const pon=twPocOn(),trf=(TW.pas.trf||0)+(pon?pon.v:0);p.tsb=1+trf/100;if(trf)p.sb=Math.max(p.sb||0,Math.min(SB_COST*.9,SB_COST*trf/200));if(pon){twLS.s('tw_pocOn',null);TW.pocMsg='🧪 POÇÃO +'+pon.v+'% TRANSFORMAÇÃO'}")
rep("function twBossGo(){","function twBossGo(){if(TW.pocMsg&&G.p){txt(G.p[0].x,G.p[0].y-300,TW.pocMsg,'#7dff9a');TW.pocMsg=null}")
# baús: poção também pode vir (mais fácil)
rep("const inC=[[0,1],[2],[3]];twShuf(inC);",
    "const pdrop=Math.random()<(window.__twPo!=null?window.__twPo:TWPOP)?{R:twPoRoll(),c:(Math.random()*3)|0}:null;\n  const inC=[[0,1],[2],[3]];twShuf(inC);")
rep("${drop&&drop.c===i?`<span class=\"it\" style=\"--c:${drop.R.c}\">${drop.E.i}</span>`:''}</div></div>`};",
    "${drop&&drop.c===i?`<span class=\"it\" style=\"--c:${drop.R.c}\">${drop.E.i}</span>`:''}${pdrop&&pdrop.c===i?`<span class=\"it\" style=\"--c:${pdrop.R.c}\">🧪</span>`:''}</div></div>`};")
rep("""<div class="twDrop" id="twDrop" hidden></div>""","""<div class="twDrops"><div class="twDrop" id="twDrop" hidden></div><div class="twDrop" id="twDropP" hidden></div></div>""")
rep("      if(inC[i].some(j=>opts[j].R.k==='sec'))",
    "      if(pdrop&&pdrop.c===i){twAddPoc(pdrop.R);const D=$('twDropP');D.hidden=false;D.style.setProperty('--c',pdrop.R.c);D.innerHTML=`<b>🧪 POÇÃO ${pdrop.R.n} +${pdrop.R.v}%</b><span>Foi para a 🎒 MOCHILA (beba antes de uma luta)</span>`;setTimeout(()=>twSfx('powerUp'),300)}\n      if(inC[i].some(j=>opts[j].R.k==='sec'))")
# mochila: coluna de poções com BEBER
rep("""<div class="bgw">${TWEQ.map(col).join('')}</div>""",
    """<div class="bgw">${TWEQ.map(col).join('')}${(()=>{const L=twPocs().slice().sort((a,b)=>b.v-a.v),on=twPocOn();return `<div class="bgc"><h5>🧪 POÇÕES<small>Uso único · transforma mais rápido na próxima luta</small></h5>${on?`<div class="bgi on" style="--c:${twRarOf(on.r).c}"><b>🧪 +${on.v}%</b><span>BEBIDA · vale na próxima luta</span><em>ATIVA</em></div>`:''}${L.length?L.map(x=>{const R=twRarOf(x.r);return `<button class="bgi bgp" data-id="${x.id}" style="--c:${R.c}" ${on?'disabled':''}><b>🧪 +${x.v}%</b><span>${R.n}</span><em>BEBER</em></button>`}).join(''):on?'':'<p class="twH">Nenhuma ainda.<br>Vem nos baús da torre!</p>'}</div>`})()}</div>""")
rep("Equipamentos achados nos baús. Nunca expiram. Toque para equipar (1 de cada tipo). Vale em todas as subidas da torre.",
    "Equipamentos nunca expiram: toque para equipar (1 de cada tipo). Poção é de uso único: beba antes da luta (só uma por vez).")
rep("document.querySelectorAll('#twModal .bgi').forEach(b=>b.onclick=()=>{const Q=twEqp();",
    "document.querySelectorAll('#twModal .bgp').forEach(b=>b.onclick=()=>{if(twPocOn())return;const L=twPocs(),j=L.findIndex(x=>x.id===b.dataset.id);if(j<0)return;const x=L.splice(j,1)[0];twLS.s('tw_poc',L);twLS.s('tw_pocOn',x);twSfx('powerUp');twToast('🧪 POÇÃO +'+x.v+'% BEBIDA! Vale na próxima luta','#7dff9a');twBag()});\n  document.querySelectorAll('#twModal .bgi[data-t]').forEach(b=>b.onclick=()=>{const Q=twEqp();")
# painel: mostra poção ativa
rep("""`<i class="no">${E.i}—</i>`}).join('')})()}</span>`;""","""`<i class="no">${E.i}—</i>`}).join('')})()}${twPocOn()?`<i style="color:#7dff9a">🧪+${twPocOn().v}%</i>`:''}</span>`;""")
rep("\n.twBag .bgw{","\n.twDrops{display:flex;gap:.8em;justify-content:center;flex-wrap:wrap}.bgi[disabled]{opacity:.45}\n.twBag .bgw{")
open(P,'w').write(s);print('ok',len(s))
