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
for nm,k in [('al_ai','al'),('ald_ai','ald')]:
    d=json.load(open(os.path.join(D,nm+'.json')))[k]
    for an in ['sA','sB','sC','sD','sE','ki1','ki2','jab','cross','jab2','str','sweep','ajab','palm']:
        for fr in d.get(an,[]):
            if fr['src'] in TIP:continue
            im=np.asarray(Image.open(os.path.join(ROOT,'www',fr['src'])).convert('RGBA'));a=im[...,3]>128;H,W=a.shape
            y0,y1=(int(H*.3),int(H*.95)) if an in('sC','sweep') else (int(H*.08),int(H*.72))
            band=a[y0:y1];cols=np.where(band.any(0))[0]
            if not len(cols):continue
            xr=cols.max();ys=np.where(a[y0:y1,max(0,xr-5):xr+1].any(1))[0]+y0
            TIP[fr['src']]=[round(xr/W,4),round(float(ys.mean())/H,4)]
# Ki = JACKAL (sem morcegos)
rep("if(k===4&&f.aucK!==k&&f.form){f.aucK=k;aucBats(f)}","if(k===4&&f.aucK!==k){f.aucK=k;aucJackal(f)}")
# paleta roxa + tipo 'jk'
rep("const AUCPAL={n:{","const aucPal=v=>AUCPAL[v==='p'?'p':v?'r':'n'];const AUCPAL={p:{core:'250,236,255',mid:'190,80,255',out:'92,0,170'},n:{")
rep("const P=AUCPAL[b.rd?'r':'n'],h=b.h","const P=aucPal(b.rd),h=b.h")
rep("const p=e.t/e.life,P=AUCPAL[e.rd?'r':'n'];","const p=e.t/e.life,P=aucPal(e.rd);")
rep("w=b.kind==='big'?19:","w=b.kind==='jk'?24:b.kind==='big'?19:")
rep("if(b.kind==='big'){ctx.lineWidth=3;","if(b.kind==='jk'){ctx.strokeStyle=`rgba(${P.core},.85)`;ctx.lineWidth=2;for(let z=0;z<3;z++){ctx.beginPath();let xx=0,yy=0;ctx.moveTo(0,0);for(let i=0;i<7;i++){xx-=L/7;yy=rand(-w*1.6,w*1.6);ctx.lineTo(xx,yy)}ctx.stroke()}}\n    if(b.kind==='big'||b.kind==='jk'){ctx.lineWidth=3;")
# aucFire: sai da ponta da arma; tipo jackal
rep("function aucFire(f,dmg,dy,O){O=O||{};const o=ytOpp(f);if(!o)return;const x=f.x+f.facing*(O.big?150:120),y=f.y-(dy||188);\n  const kind=O.big?'big':O.fast?'fast':dmg>=26?'mid':'weak',rd=!!f.form;",
    "function aucFire(f,dmg,dy,O){O=O||{};const o=ytOpp(f);if(!o)return;let x=f.x+f.facing*(O.big||O.jk?150:120),y=f.y-(dy||188);const T=aucTip(f);if(T){x=T[0];y=T[1]+(O.dy2||0)}\n  const kind=O.jk?'jk':O.big?'big':O.fast?'fast':dmg>=26?'mid':'weak',rd=O.jk?'p':!!f.form;if(O.jk)O.big=1;")
rep("AUCB.push({x,y,vx:f.facing*(O.big?30:O.fast?50:38)*(f.form?1.3:1),","AUCB.push({x,y,vx:f.facing*(O.jk?40:O.big?30:O.fast?50:38)*(f.form?1.3:1),")
rep("function aucMuzzle(x,y,dir,kind,rd){","""const AUTIP=__TIP__;
/* ponta da arma do quadro que está na tela; se o quadro não tem a arma esticada, usa a ponta mais à frente da mesma animação */
function aucTip(f){try{const k=spriteKey(f),A=SPRH[ssid(f)][k[0]];if(!A)return null;let S=A[Math.min(A.length-1,k[1])],T=S&&AUTIP[S.src],ext=T?T[0]*S.w-S.ax:0;
  if(!T||ext<60){let best=null,be=60;for(const q of A){const u=AUTIP[q.src];if(!u)continue;const e=u[0]*q.w-q.ax;if(e>be){be=e;best=q}}if(!best)return null;S=best;T=AUTIP[S.src];ext=be}
  return [f.x+f.facing*(ext+6),f.y+T[1]*S.h-S.ay]}catch(e){return null}}
/* Ki = JACKAL: um tiro só, roxo, grosso, atravessa e explode (transformado mais forte) */
function aucJackal(f){aucFire(f,f.form?95:60,192,{jk:1});txt(f.x,f.y-320,'JACKAL!','#d9a8ff');G.shake=Math.max(G.shake,12);f.vx-=f.facing*8;G.flash=Math.max(G.flash||0,4);G.flashCol='#c08aff';try{SFX.boom()}catch(e){}}
function aucMuzzle(x,y,dir,kind,rd){""".replace('__TIP__',cj(TIP)))
rep("const pw=kind==='big'?2:","const pw=kind==='jk'?2.4:kind==='big'?2:")
rep("if(kind==='big'){const J=[];","if(kind==='big'||kind==='jk'){const J=[];")
rep("const o=b.o;if(o&&!o.ko&&o.inv<=0&&Math.abs(o.x-b.x)<(b.big?64:46)","const o=b.o;if(o&&!o.ko&&!b.hitO&&o.inv<=0&&Math.abs(o.x-b.x)<(b.big?64:46)")
# o jackal atravessa: acerta uma vez, explode e segue
rep("if(applyHit(b.f,o,h)){aucImpact(b.x,b.y,b.big,b.rd);","if(b.kind==='jk'){b.hitO=1;h.launch=-9;h.kb=10;h.hs=18}if(applyHit(b.f,o,h)){aucImpact(b.x,b.y,b.big,b.rd);if(b.kind==='jk'){ring(b.x,b.y,'#b060ff',220,22,7);flashL(b.x,b.y,'#a040ff',380,.9,16)}")
rep("if(o.hp<=0)ko(b.f,o);b.life=0;break}}","if(o.hp<=0)ko(b.f,o);if(b.kind!=='jk'){b.life=0;break}}}")
# botão ULTIMATE (poder máximo): como o Sung — transformado + 100 Ki, sem faísca
rep("function srReady(f){if(f.def.sid==='sj')return sjSRok(f);","function srReady(f){if(f.def.sid==='sj')return sjSRok(f);if(f.def.sid==='al')return !!f.form&&f.ki>=100&&!G.trans;")
rep("function trySR(f,o){if(f.def.sid==='sj')return _trySR(f,o);","function trySR(f,o){if(f.def.sid==='sj'||f.def.sid==='al')return _trySR(f,o);")
open(P,'w',encoding='utf8').write(s);print('alucard tiro ok',len(TIP),len(s))
