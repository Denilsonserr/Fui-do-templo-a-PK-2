#!/usr/bin/env python3
"""v171 — Modo Torre novo. Uso: python3 patch_torre.py <index.html> <pasta_torre>
pasta_torre precisa de: torre.js, torre.css, assets.json e out/ (arquivos já com nome md5)."""
import sys,json,os,shutil
P,D=sys.argv[1],sys.argv[2]
s=open(P).read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:80]);s=s.replace(a,b)
A=json.load(open(os.path.join(D,'assets.json')))
www=os.path.dirname(os.path.abspath(P))
for k,f in A.items():shutil.copy(os.path.join(D,'out',f),os.path.join(www,'a',f))
TWA={k:'a/'+f for k,f in A.items()}
js=open(os.path.join(D,'torre.js')).read().replace('__TWA__',json.dumps(TWA))
css=open(os.path.join(D,'torre.css')).read()
# CSS: antes do 2º </style>
i=s.index('</style>',s.index('</style>')+1);s=s[:i]+css+s[i:]
# HTML
rep('<section id="result"','<section id="tower" class="screen" hidden></section>\n\n  <section id="result"')
# JS
rep("const screens=['title','config','modes','select','stages','how','pause','result','vs'];",js+"\nconst screens=['title','config','modes','select','stages','how','pause','result','vs','tower'];")
rep("sc==='select'||sc==='stages'||sc==='title'||sc==='vs'||sc==='modes'","sc==='select'||sc==='stages'||sc==='title'||sc==='vs'||sc==='modes'||sc==='tower'")
rep("$('goStage').onclick=()=>{renderStages();showScreen('stages')};","$('goStage').onclick=()=>{if(G.gmode==='torre'){twOpen();return}renderStages();showScreen('stages')};")
rep("$('toMenu').onclick=()=>{","$('toMenu').onclick=()=>{if(G.gmode==='torre'&&TW.on&&G.mode==='fight'){twQuitFight();return}")
rep("function renderSel(){","function renderSel(){$('select').classList.toggle('twsel',G.gmode==='torre');")
rep("selT=T2?'p2':'c'","selT=T2?'p2':G.gmode==='torre'?'p':'c'")
rep("if(G.phaseT>=104)G.phase='fight'","if(G.phaseT>=104){G.phase='fight';twBossGo()}")
rep("else if(G.phase==='fight'){","else if(G.phase==='fight'){if(TW.on&&G.gmode==='torre')twTick();")
rep("G.ring={title:tw?","G.ring={title:(TW.on&&G.gmode==='torre')?(TW.fl===TWN-1?'CHEFE FINAL':'ANDAR '+(TW.fl+1)+' / '+TWN):tw?")
rep("const i=MSEL==='auto'?","const i=(MSEL==='auto'||(TW.on&&G.gmode==='torre'))?")
rep("if(G.wsel!=='auto')return G.wsel","if(G.wsel!=='auto'&&!(TW.on&&G.gmode==='torre'))return G.wsel")
rep("*(aylMagic(a)&&h.kind==='melee'?1.12:1);","*(aylMagic(a)&&h.kind==='melee'?1.12:1)*(a.tdm||1)*(d.tdf||1);")
rep("(f.slowT>0?.55:1)}","(f.slowT>0?.55:1)*(f.tsp||1)}")
rep("MAXHP=LAYER*(G.lives||2);G.teams=G.gmode==='torre'?[[G.pick],G.tower.slice()]:","MAXHP=LAYER*(G.gmode==='torre'?2:(G.lives||2));G.teams=G.gmode==='torre'?null:")
rep("function endRound(){\n  const w=G.koWinner;","function endRound(){\n  const w=G.koWinner;if(G.gmode==='torre'&&TW.on){twAfter(w);return}")
rep("if(G.gmode==='treino'){G.p[0].sb=6;G.p[0].ki=100}","if(G.gmode==='treino'){G.p[0].sb=6;G.p[0].ki=100}twApply();")
open(P,'w').write(s);print('ok',len(s))
