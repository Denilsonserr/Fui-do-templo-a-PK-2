import sys
# v195: Torre — 4 cartas, carta SECRETA (0,4%), carta TRANSFORMAÇÃO (só lendária/mítica), drop de EQUIPAMENTOS (espada/armadura/poção, comum→mítico)
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
# --- dados ---
rep("const TWBAR={k:'barra',n:'BARRA DE VIDA',i:'💚',d:'+1 barra de vida (máx. 7)'};",
"""const TWBAR={k:'barra',n:'BARRA DE VIDA',i:'💚',d:'+1 barra de vida (máx. 7)'};
/* v195: carta de TRANSFORMAÇÃO (só lendária/mítica): energia de transformar enche mais rápido e já começa a luta com uma parte */
const TWTRF={k:'trf',n:'TRANSFORMAÇÃO',i:'🔥',d:'Transforma mais cedo (energia enche mais rápido)'};const TWTRV={lend:40,mit:75};
/* v195: carta SECRETA (0,4% por escolha): bônus absurdo */
const TWSECR={k:'sec',n:'SECRETA',c:'#ffffff'};const TWSEC={k:'sec',n:'PODER PROIBIDO',i:'👁️',d:'+80% vida, dano e velocidade · transforma muito mais cedo · +2 barras e vida cheia'};const TWSECP=.4;
/* v195: EQUIPAMENTOS — ficam até o fim da torre (guarda o melhor de cada tipo) */
const TWEQ=[{k:'esp',n:'ESPADA',i:'🗡️',s:'dano',d:'Aumenta o ATAQUE'},{k:'arm',n:'ARMADURA',i:'🛡️',s:'vida',d:'Aumenta a DEFESA'},{k:'poc',n:'POÇÃO',i:'🧪',s:'vel',d:'Aumenta a VELOCIDADE'}];
const TWEQR=[{k:'comum',n:'COMUM',c:'#c3c8d2',w:70,v:1},{k:'rara',n:'RARA',c:'#3d9bff',w:22.5,v:4},{k:'epica',n:'ÉPICA',c:'#b25bff',w:6,v:5},{k:'lend',n:'LENDÁRIA',c:'#ffc531',w:1.3,v:7},{k:'mit',n:'MÍTICA',c:'#ff2e63',w:.2,v:10}];
function twEqRoll(){let r=Math.random()*100;for(const R of TWEQR){if((r-=R.w)<0)return R}return TWEQR[0]}
const twEqB=st=>{let v=0;for(const E of TWEQ)if(E.s===st&&TW.eq[E.k])v+=TW.eq[E.k].v;return v};""")
rep("lend:{n:'Bênção Lendária',i:'🌟',d:'Ganhar uma passiva lendária',p:1}};",
    "lend:{n:'Bênção Lendária',i:'🌟',d:'Ganhar uma passiva lendária',p:1},sec:{n:'Carta Secreta',i:'👁️',d:'Encontrar a carta SECRETA (menos de 0,5%)',p:10},eqm:{n:'Equipamento Mítico',i:'🗡️',d:'Pegar um equipamento mítico',p:4}};")
rep("pas:{vida:0,dano:0,vel:0},time:0,tr:[],fs:null,","pas:{vida:0,dano:0,vel:0,trf:0},eq:{},time:0,tr:[],fs:null,")
rep("TW.pas={vida:0,dano:0,vel:0};TW.time=0;TW.tr=[];TW.busy=false;TW.last=null;","TW.pas={vida:0,dano:0,vel:0,trf:0};TW.eq={};TW.time=0;TW.tr=[];TW.busy=false;TW.last=null;")
rep("TW.pas={vida:0,dano:0,vel:0};TW.time=0;TW.tr=[];TW.sent=false;","TW.pas={vida:0,dano:0,vel:0,trf:0};TW.eq={};TW.time=0;TW.tr=[];TW.sent=false;")
# --- aplicar na luta ---
rep("p.tdm=1+TW.pas.dano/100;p.tsp=1+TW.pas.vel/100;p.tdf=1/(1+TW.pas.vida/100);",
    "p.tdm=1+(TW.pas.dano+twEqB('dano'))/100;p.tsp=1+(TW.pas.vel+twEqB('vel'))/100;p.tdf=1/(1+(TW.pas.vida+twEqB('vida'))/100);p.tsb=1+(TW.pas.trf||0)/100;if(TW.pas.trf)p.sb=Math.max(p.sb||0,Math.min(SB_COST*.9,SB_COST*TW.pas.trf/200));")
rep("f.sb=Math.min(6,o0+1/SB_FR);","f.sb=Math.min(6,o0+(f.tsb||1)/SB_FR);")
# --- painel ---
rep("$('twPs').innerHTML=TWPT.map(p=>`<span>${p.i} ${p.n==='VELOCIDADE'?'VEL.':p.n} <b>+${TW.pas[p.k]}%</b></span>`).join('');",
    "$('twPs').innerHTML=TWPT.map(p=>`<span>${p.i} ${p.n==='VELOCIDADE'?'VEL.':p.n} <b>+${TW.pas[p.k]}%</b></span>`).join('')+(TW.pas.trf?`<span>🔥 TRANSF. <b>+${TW.pas.trf}%</b></span>`:'')+`<span class=\"eq\">${TWEQ.map(E=>{const q=TW.eq[E.k];return q?`<i style=\"color:${q.c}\" title=\"${E.n} ${q.n}\">${E.i}+${q.v}%</i>`:`<i class=\"no\">${E.i}—</i>`}).join('')}</span>`;")
# --- 4 cartas + transformação + secreta ---
rep("""function twPassive(ks,won){const opts=twShuf(TWPT.slice()).map((p,i)=>{const R=twRoll();return {p,R,v:R.v[TWPT.indexOf(p)]}});
  if(TW.bars<TWMB&&Math.random()<.3){const i=(Math.random()*3)|0;opts[i]={p:TWBAR,R:Math.random()<.35?TWRAR[3]:TWRAR[2],v:1}}""",
"""function twPassive(ks,won){const pt=TWPT.slice();pt.push(pt[(Math.random()*3)|0]);const opts=twShuf(pt).map((p,i)=>{const R=twRoll();return {p,R,v:R.v[TWPT.indexOf(p)]}});
  if(TW.bars<TWMB&&Math.random()<.3){const i=(Math.random()*4)|0;opts[i]={p:TWBAR,R:Math.random()<.35?TWRAR[3]:TWRAR[2],v:1}}
  for(const o of opts)if((o.R.k==='lend'||o.R.k==='mit')&&o.p!==TWBAR&&Math.random()<.45&&!opts.some(q=>q.p===TWTRF)){o.p=TWTRF;o.v=TWTRV[o.R.k]}
  if(Math.random()*100<(window.__twSec!=null?window.__twSec:TWSECP)){const i=(Math.random()*4)|0;opts[i]={p:TWSEC,R:TWSECR,v:80}}""")
rep("<h4>ESCOLHA UMA PASSIVA</h4><div class=\"twPs\">","<h4>ESCOLHA UMA PASSIVA</h4><div class=\"twPs q4\">")
rep("<b>+${o.v}${o.p.k==='barra'?'':'%'}</b>","<b>${o.p.k==='sec'?'???':'+'+o.v+(o.p.k==='barra'?'':'%')}</b>")
rep("if(opts.some(o=>o.R.k==='lend'||o.R.k==='mit'))twSfx('powerUp');","if(opts.some(o=>o.R.k==='lend'||o.R.k==='mit'||o.R.k==='sec'))twSfx('powerUp');if(opts.some(o=>o.R.k==='sec'))setTimeout(()=>{twToast('👁️ UMA CARTA SECRETA APARECEU!','#ffffff');twSfx('boom')},300);")
rep("const o=opts[+b.dataset.i];if(o.p.k==='barra'){TW.bars=Math.min(TWMB,TW.bars+1);TW.hpv+=LAYER}else TW.pas[o.p.k]+=o.v;if((o.R.k==='lend'||o.R.k==='mit')&&",
    "const o=opts[+b.dataset.i];if(o.p.k==='barra'){TW.bars=Math.min(TWMB,TW.bars+1);TW.hpv+=LAYER}else if(o.p.k==='sec'){for(const k of ['vida','dano','vel'])TW.pas[k]+=80;TW.pas.trf+=100;TW.bars=Math.min(TWMB,TW.bars+2);TW.hpv=TW.bars*LAYER;TW.tr.push({k:'sec',fl:won})}else TW.pas[o.p.k]+=o.v;if((o.R.k==='lend'||o.R.k==='mit')&&")
rep("twToast(o.p.k==='barra'?'💚 +1 BARRA DE VIDA ('+TW.bars+')':","twToast(o.p.k==='sec'?'👁️ PODER PROIBIDO DESPERTADO!':o.p.k==='barra'?'💚 +1 BARRA DE VIDA ('+TW.bars+')':")
# depois da passiva -> drop de equipamento -> próximo andar
rep("      setTimeout(()=>twReveal(TW.fl),900)},380)})}","      setTimeout(()=>twEquip(won),900)},380)})}\n"+r"""function twEquip(won){const opts=TWEQ.map(E=>({E,R:twEqRoll()}));
  twModal(`<div class="twM"><h3>DROP DE EQUIPAMENTO!</h3><p class="twH">Escolha 1. Equipamento fica até o fim da torre (se já tiver um do mesmo tipo, fica o melhor).</p><div class="twPs">${opts.map((o,i)=>{const q=TW.eq[o.E.k];return `<button class="twp eqc ${o.R.k}" data-i="${i}" style="--c:${o.R.c};animation-delay:${.15+i*.15}s"><span class="rr">${o.R.n}</span><span class="ic">${o.E.i}</span><b>+${o.R.v}%</b><span class="nm">${o.E.n}</span><span class="ds">${o.E.d}${q?`<br>Atual: +${q.v}%`:''}</span></button>`}).join('')}</div></div>`);
  if(opts.some(o=>o.R.k==='lend'||o.R.k==='mit'))twSfx('powerUp');
  document.querySelectorAll('#twModal .twp').forEach(b=>b.onclick=()=>{const o=opts[+b.dataset.i],q=TW.eq[o.E.k],up=!q||o.R.v>q.v;if(up)TW.eq[o.E.k]={v:o.R.v,c:o.R.c,n:o.R.n};if(o.R.k==='mit'&&!TW.tr.some(t=>t.k==='eqm'))TW.tr.push({k:'eqm',fl:won});
    twSfx('powerUp');b.classList.add('pick');setTimeout(()=>{twModal(null);twRender();twToast(up?o.E.i+' '+o.E.n+' '+o.R.n+' +'+o.R.v+'% EQUIPADA':'Você já tem um(a) '+o.E.n+' melhor',up?o.R.c:'#cdbfcf');setTimeout(()=>twReveal(TW.fl),900)},380)})}""")
# --- estilos ---
rep(".twp .ds{font-size:.7em;color:#cdbfcf}",".twp .ds{font-size:.7em;color:#cdbfcf}\n.twPs.q4{gap:.8em}.twPs.q4 .twp{width:12.6em}\n.twp.sec{--c:#fff;border-color:#fff;background:radial-gradient(circle at 50% 10%,#3b3b4a,#000 70%);animation:twCard .55s cubic-bezier(.2,1.4,.4,1) both,twSec 1.2s linear infinite}.twp.sec .rr{background:linear-gradient(90deg,#fff,#a0f,#0ff,#ff0,#fff);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:1em}\n@keyframes twSec{0%{box-shadow:0 0 1.5em #fff,0 0 3em #a0f;filter:hue-rotate(0)}50%{box-shadow:0 0 3em #0ff,0 0 5em #fff}100%{box-shadow:0 0 1.5em #fff,0 0 3em #a0f;filter:hue-rotate(360deg)}}\n.twp.eqc .ic{font-size:3em}\n#twInfo .ps .eq{display:flex;gap:.5em}#twInfo .ps .eq i{font-style:normal;font-weight:900}#twInfo .ps .eq i.no{opacity:.45}")
open(P,'w').write(s);print('ok',len(s))
