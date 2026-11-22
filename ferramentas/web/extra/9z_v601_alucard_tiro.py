import json,sys,os
import numpy as np
from PIL import Image
# v601: ALUCARD (🧪 TESTE do ADM) — pedidos do dono:
#  - tira os MORCEGOS: o Ki (foguinho) vira UM tiro especial forte, cor diferente (roxo): JACKAL — atravessa, explode e lança (nas duas formas);
#  - o tiro SAI DA PONTA DA ARMA: ponta medida em cada quadro do sprite (pixel mais à frente na altura do braço);
#  - botão ULTIMATE (poder máximo) funciona como o do Sung: transformado + 100 de Ki (sem precisar da faísca).
P=sys.argv[1];s=open(P,encoding='utf8').read()
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','..')
D=os.path.join(ROOT,'ferramentas','personagens','alucard','build')
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
cj=lambda o:json.dumps(o,separators=(',',':'))
# ponta da arma por quadro (coordenadas normalizadas da imagem)
TIP={}
# v602: SÓ os quadros em que a arma está APONTADA pra frente (conferidos um a um nas folhas). Fora deles não sai tiro.
AIM={'al':{'sA':range(1,8),'sB':range(2,6),'sD':range(1,7),'sE':range(0,8),'ki1':range(2,7),'str':range(1,6),'ajab':range(1,6)},
     'ald':{'sA':range(1,6),'sB':range(1,6),'sC':range(0,8),'sD':range(0,6),'sE':range(0,6),'ki1':range(2,7),'ajab':range(1,6)}}
MAN={('al','sE'):(0.92,0.34)}  # Alucard normal, base larga com 2 armas: a detecção pegava o pé
for nm,k in [('al_ai','al'),('ald_ai','ald')]:
    d=json.load(open(os.path.join(D,nm+'.json')))[k]
    for an,ix in AIM[k].items():
        for i in ix:
            fr=d[an][i]
            if fr['src'] in TIP:continue
            if (k,an) in MAN:TIP[fr['src']]=list(MAN[(k,an)]);continue
            im=np.asarray(Image.open(os.path.join(ROOT,'www',fr['src'])).convert('RGBA'));a=im[...,3]>128;H,W=a.shape
            y0,y1=int(H*.08),int(H*.72)
            band=a[y0:y1];cols=np.where(band.any(0))[0]
            if not len(cols):continue
            xr=cols.max();ys=np.where(a[y0:y1,max(0,xr-5):xr+1].any(1))[0]+y0
            TIP[fr['src']]=[round(xr/W,4),round(float(ys.mean())/H,4)]
# Ki = JACKAL (sem morcegos)
rep("if(k===4&&f.aucK!==k&&f.form){f.aucK=k;aucBats(f)}","if(k>=3&&f.aucK!==-2&&(aucTip(f)||k>=6)){f.aucK=-2;aucJackal(f)}")
# paleta roxa + tipo 'jk'
rep("const AUCPAL={n:{","const aucPal=v=>AUCPAL[v==='p'?'p':v?'r':'n'];const AUCPAL={p:{core:'250,236,255',mid:'190,80,255',out:'92,0,170'},n:{")
rep("const P=AUCPAL[b.rd?'r':'n'],h=b.h","const P=aucPal(b.rd),h=b.h")
rep("const p=e.t/e.life,P=AUCPAL[e.rd?'r':'n'];","const p=e.t/e.life,P=aucPal(e.rd);")
rep("w=b.kind==='big'?19:","w=b.kind==='jk'?24:b.kind==='big'?19:")
rep("if(b.kind==='big'){ctx.lineWidth=3;","if(b.kind==='jk'){ctx.strokeStyle=`rgba(${P.core},.85)`;ctx.lineWidth=2;for(let z=0;z<3;z++){ctx.beginPath();let xx=0,yy=0;ctx.moveTo(0,0);for(let i=0;i<7;i++){xx-=L/7;yy=rand(-w*1.6,w*1.6);ctx.lineTo(xx,yy)}ctx.stroke()}}\n    if(b.kind==='big'||b.kind==='jk'){ctx.lineWidth=3;")
# aucFire: sai da ponta da arma; tipo jackal
rep("function aucFire(f,dmg,dy,O){O=O||{};const o=ytOpp(f);if(!o)return;const x=f.x+f.facing*(O.big?150:120),y=f.y-(dy||188);\n  const kind=O.big?'big':O.fast?'fast':dmg>=26?'mid':'weak',rd=!!f.form;",
    "function aucFire(f,dmg,dy,O){O=O||{};const o=ytOpp(f);if(!o)return;let x=f.x+f.facing*(O.big||O.jk?150:120),y=f.y-(dy||188);const T=aucTip(f);if(T){x=T[0];y=T[1]+(O.dy2||0)}\n  const kind=O.jk?'jk':O.big?'big':O.fast?'fast':dmg>=26?'mid':'weak',rd=O.jk?'p':!!f.form;if(O.jk)O.big=1;")
rep("AUCB.push({x,y,vx:f.facing*(O.big?30:O.fast?50:38)*(f.form?1.3:1),","AUCST[T?0:1]++;AUCB.push({x,y,vx:f.facing*(O.jk?40:O.big?30:O.fast?50:38)*(f.form?1.3:1),")
rep("n:()=>({b:AUCB.length,fx:AUCFX.length,bat:AUCBAT.length})","n:()=>({b:AUCB.length,fx:AUCFX.length,bat:AUCBAT.length,arma:AUCST[0],semArma:AUCST[1]}),k:()=>{const f=G.p[0],k=spriteKey(f),A=SPRH[ssid(f)][k[0]],S=A&&A[Math.min(A.length-1,k[1])];return [k,ssid(f),S&&aucSrc(S),S&&!!AUTIP[aucSrc(S)]]}")
rep("function aucMuzzle(x,y,dir,kind,rd){","""const AUTIP=__TIP__,AUCST=[0,0];
function aucSrc(S){if(S._as)return S._as;const u=S.src||(S.img&&(S.img.currentSrc||S.img.src))||'',i=u.lastIndexOf('a/');const r=i>=0?u.slice(i):'';if(r)S._as=r;return r}
/* ponta da arma do quadro que está na tela; null = o quadro NÃO está com a arma apontada (aí não atira) */
function aucTip(f){try{const k=spriteKey(f),A=SPRH[ssid(f)][k[0]];if(!A)return null;const S=A[Math.min(A.length-1,k[1])],T=S&&AUTIP[aucSrc(S)];if(!T)return null;
  return [f.x+f.facing*(T[0]*S.w-S.ax+6),f.y+T[1]*S.h-S.ay]}catch(e){return null}}
/* Ki = JACKAL: um tiro só, roxo, grosso, atravessa e explode (transformado mais forte) */
function aucJackal(f){aucFire(f,f.form?95:60,192,{jk:1});txt(f.x,f.y-320,'JACKAL!','#d9a8ff');G.shake=Math.max(G.shake,12);f.vx-=f.facing*8;G.flash=Math.max(G.flash||0,4);G.flashCol='#c08aff';try{SFX.boom()}catch(e){}}
function aucMuzzle(x,y,dir,kind,rd){""".replace('__TIP__',cj(TIP)))
rep("const pw=kind==='big'?2:","const pw=kind==='jk'?2.4:kind==='big'?2:")
rep("if(kind==='big'){const J=[];","if(kind==='big'||kind==='jk'){const J=[];")
rep("const o=b.o;if(o&&!o.ko&&o.inv<=0&&Math.abs(o.x-b.x)<(b.big?64:46)","const o=b.o;if(o&&!o.ko&&!b.hitO&&o.inv<=0&&Math.abs(o.x-b.x)<(b.big?64:46)")
# o jackal atravessa: acerta uma vez, explode e segue
rep("if(applyHit(b.f,o,h)){aucImpact(b.x,b.y,b.big,b.rd);","if(b.kind==='jk'){b.hitO=1;h.launch=-9;h.kb=10;h.hs=18}if(applyHit(b.f,o,h)){aucImpact(b.x,b.y,b.big,b.rd);if(b.kind==='jk'){ring(b.x,b.y,'#b060ff',220,22,7);flashL(b.x,b.y,'#a040ff',380,.9,16)}")
rep("if(o.hp<=0)ko(b.f,o);b.life=0;break}}","if(o.hp<=0)ko(b.f,o);if(b.kind!=='jk'){b.life=0;break}}}")
# tiros do combo só saem com a arma apontada (esperam o quadro certo)
rep("if(f.aucN<SH.n&&f.mf>=f.move.su+f.aucN*(SH.gap||0)){","if(f.aucN<SH.n&&f.mf>=f.move.su+f.aucN*(SH.gap||0)&&aucTip(f)){")
rep("if(f.mf>=f.move.su&&f.aucS!==f.move){f.aucS=f.move;","if(f.mf>=f.move.su&&f.aucS!==f.move&&aucTip(f)){f.aucS=f.move;")
# normal: a rajada agachada usava a folha com as armas PRA CIMA -> agora a base larga com 2 armas pra frente; o tiro grosso usa a folha com clarão
rep("aj3:['sC',[0],[1,2,3,4,5,6],[7]],aj4:","aj3:['sE',[0],[1,2,3,4,5,6],[7]],aj4:")
rep("aj5:['sE',[0,1],[2,3,4],[5,6,7]]})","aj5:['sA',[0,1,2],[3,4,5],[6,7]]})")
rep("aj3:{n:6,gap:2,d:10,dy:118,alt:1,fast:1}","aj3:{n:6,gap:2,d:10,dy:118,fast:1}")
# ULTIMATE: na cena final ele MIRA (folha de tiro) a cada disparo e o tiro sai da arma; entre um e outro, ri
rep("f.rushKey=['win',Math.floor(e/5)%8];f.y=FLOOR;","f.rushKey=(e%11>=1&&e%11<=7&&e>=12&&e<AUBL-20)||(e>=AUBL-18&&e<=AUBL-8)?['sA',3]:['win',Math.floor(e/5)%8];f.y=FLOOR;")
rep("T.n++;const gx=f.x+f.facing*110,gy=FLOOR-190;","T.n++;const tp=aucTip(f)||[f.x+f.facing*110,FLOOR-190],gx=tp[0],gy=tp[1];")
rep("if(e===AUBL-14){aucMuzzle(f.x+f.facing*130,FLOOR-170,f.facing,'big',1);","if(e===AUBL-14){const tp=aucTip(f)||[f.x+f.facing*130,FLOOR-170];aucMuzzle(tp[0],tp[1],f.facing,'big',1);")
# botão ULTIMATE (poder máximo): como o Sung — transformado + 100 Ki, sem faísca
rep("function srReady(f){if(f.def.sid==='sj')return sjSRok(f);","function srReady(f){if(f.def.sid==='sj')return sjSRok(f);if(f.def.sid==='al')return !!f.form&&f.ki>=100&&!G.trans;")
rep("function trySR(f,o){if(f.def.sid==='sj')return _trySR(f,o);","function trySR(f,o){if(f.def.sid==='sj'||f.def.sid==='al')return _trySR(f,o);")
# v603: o botão SUPER/ULTIMATE (o de 100, em cima de tudo) só aparecia para quem está nessas listas -> entra o Alucard (ALLC fica de fora: ele continua só no TESTE)
rep("'garou','yuta','shaka','sung'].includes(inn.def.id);","'garou','yuta','shaka','sung','alucard'].includes(inn.def.id);")
rep("'garou','yuta','shaka','sung'].includes(id);camReset(1.25)}","'garou','yuta','shaka','sung','alucard'].includes(id);camReset(1.25)}")
rep("G.pick==='shaka'||G.pick==='sung');","G.pick==='shaka'||G.pick==='sung'||G.pick==='alucard');")
# v604: entra na lista de personagens (ALLC); o rk.js (alRelChk) esconde/tira antes de 22/11 13:00 — o ADM vê sempre
rep("'garou','yuta','shaka','sung'];const ROS={","'garou','yuta','shaka','sung','alucard'];const ROS={")
open(P,'w',encoding='utf8').write(s);print('alucard tiro ok',len(TIP),len(s))
