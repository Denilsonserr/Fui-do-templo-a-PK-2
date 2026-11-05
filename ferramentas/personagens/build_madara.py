# Montagem das poses do Madara (sid md). Uso: python3 build_madara.py [ai]
# Antes: recortar as folhas (mNN.png) -> cut/mNN_i.png. Escala por folha: altura da guarda = TARGET (folhas sem guarda: pose em pé / 1.07).
import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','ia'));import esr
from PIL import Image
from scipy import ndimage as nd
AI=len(sys.argv)>1 and sys.argv[1]=='ai'
TARGET=250.0;RES=2.6;T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
G=lambda t,ix:[(t,i) for i in ix];R8=range(8);RL=1.07
REF={1:387,2:427,3:437,4:417,5:428,6:425,7:443,8:419,9:435,10:457,11:446,12:439,13:400,14:422,15:489,16:468/RL,17:427,18:384,
     19:432,20:463,21:519/RL,22:502/RL,23:511/RL,24:549/RL,25:575/RL,26:379,27:407}
PLANT={1,5,6,11,12,15,19,20,21,22,23,27,25,16}
SUPPORT={2,3}
HEADA={4}
A={'relax':G(25,R8),'gin':[(25,0),(21,0),(5,0),(2,0),(1,0)],'idle':[(2,0),(2,7),(3,0)],'walk':G(24,R8),'run':[(8,3),(8,4),(8,5),(8,6),(8,3),(8,4),(8,5),(8,6)],
 'dashf':G(8,R8),'dash2':G(8,R8),'dashb':G(7,R8),'jab':G(1,R8),'kick':G(2,R8),'hkick':G(3,R8),'upper':G(3,R8),'str':G(1,R8),'cross':G(1,R8),'sweep':G(4,R8),
 'block':G(5,R8),'cblock':G(6,R8),'hit':G(11,R8),'hhit':G(12,R8),'launch':G(12,R8),'dodge':G(7,R8),
 'jumpv':G(9,R8),'jumpd':G(18,R8),'hover':[(10,0),(10,1),(10,2),(10,0),(10,1),(10,2)],
 'ajab':[(17,0),(17,1),(17,2),(17,3),(17,3),(17,6),(17,7),(17,7)],'akick':[(17,0),(17,4),(17,4),(17,5),(17,5),(17,6),(17,7),(17,7)],
 'fall':[(13,1),(13,2),(13,3),(13,4),(13,7)],'drop':G(13,[5,6,7]),'getup':G(14,R8),'win':G(15,R8),'lose':G(16,R8),
 'pw':G(23,R8),'ki1':G(20,R8),'ki2':G(22,R8),'kunai':G(19,R8),'throw':G(20,R8),'seals':G(21,R8),'fire':G(22,R8),'cmb':G(26,R8),'grab':[(27,0),(27,1),(27,2),(27,3),(27,4),(27,5),(26,6),(26,7)]}
AIR={'jumpv','jumpd','hover','ajab','akick'}   # ancora vertical no proprio pe
GL={}
for t in range(1,28):GL[t]=max(np.load(f)[1] for f in glob.glob(f'cut/m{t:02d}_*.y.npy'))
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def geo(t,i):
    y0,y1,x0,x1=np.load(f'cut/m{t:02d}_{i}.y.npy');al=np.asarray(Image.open(f'cut/m{t:02d}_{i}.png'))[...,3]/255.
    cen=x0+(al.sum(0)*np.arange(al.shape[1])).sum()/al.sum()
    g=GL[t]-y0;band=al[max(0,int(g-16)):int(g)]>.5;cols=np.where(band.any(0))[0];cl=[]
    for c in cols:
        if cl and c-cl[-1][1]<=10:cl[-1][1]=c
        else:cl.append([c,c])
    feet=[(a+x0,b+x0) for a,b in cl if b-a>=6]
    return cen,feet
def head(t,i):
    y0,y1,x0,x1=np.load(f'cut/m{t:02d}_{i}.y.npy');al=np.asarray(Image.open(f'cut/m{t:02d}_{i}.png'))[...,3]/255.
    H=al.shape[0];hb=al[int(H*.08):int(H*.35)];return x0+(hb.sum(0)*np.arange(al.shape[1])).sum()/max(hb.sum(),1)
def anchor(t,i):
    cen,feet=geo(t,i)
    if t in HEADA:   # rasteira: segue a cabeca/tronco
        c0,_=geo(t,0);return head(t,i)+(c0-head(t,0))
    if t in SUPPORT:
        if i in (0,7) or not feet:return cen
        D=[];
        for j in range(1,7):
            c,f=geo(t,j)
            if f:D.append(c-f[0][0])
        return feet[0][0]+np.mean(D)
    if t in PLANT:
        c0,f0=geo(t,0)
        if f0 and feet:
            off=c0-f0[0][0];exp=cen-off
            best=min(feet,key=lambda q:abs(q[0]-exp))
            if abs(best[0]-exp)<45:return best[0]+off
    return cen
cache={}
def frame(t,i,air):
    key=(t,i,air)
    if key in cache:return cache[key]
    r=f'm{t:02d}_{i}';y0,y1,x0,x1=np.load(f'cut/{r}.y.npy')
    im=Image.open(f'cut/{r}.png');a4=np.asarray(im).copy();al=a4[...,3]/255.
    slot=anchor(t,i)-x0
    ay=(y1-y0) if air else (GL[t]-y0)
    cols=np.where((al>.5).any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-3):rx+1].max(1)>.5)[0].mean()
    k=TARGET/REF[t];gw,gh=im.width*k,im.height*k
    if AI:o=esr.sr_rgba(im,2).resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    else:o=im.resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    mo=None
    if t==22:
        H_=al.shape[0];band=al[int(H_*.12):int(H_*.32)]>.5;ys_,xs_=np.where(band)
        if len(xs_):k_=np.argmax(xs_);mo=[round((xs_[k_]-4-slot)*TARGET/REF[t],1),round((ay-(ys_[k_]+int(H_*.12)))*TARGET/REF[t],1)]
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(slot*k,1),'ay':round(ay*k,1),'rx':round((rx-slot)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    if mo:fr['mo']=mo
    cache[key]=fr
    if AI:print(r,len(cache),round(time.time()-T0),flush=True)
    return fr
J={'md':{a:[frame(t,i,a in AIR) for t,i in L] for a,L in A.items()}}
json.dump(J,open('md_ai.json' if AI else 'md_fast.json','w'),separators=(',',':'));print('DONE',len(cache),round(time.time()-T0))
