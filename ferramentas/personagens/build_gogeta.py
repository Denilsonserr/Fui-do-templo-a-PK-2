# Montagem das poses do Gogeta (forma normal). Uso:  python3 build_gogeta.py [ai]
# Antes: recortar as folhas com seg_gogeta.py (gera cut/gNN_i.png + .y.npy).
# Cada folha tem escala propria: normalizada pela altura da pose de guarda (REF).
import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','ia'));import esr
from PIL import Image
from scipy import ndimage as nd
AI=len(sys.argv)>1 and sys.argv[1]=='ai'
TARGET=248.0;RES=2.6;T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
G=lambda t,ix:[(t,i) for i in ix];R8=range(8)
# guarda de referencia de cada folha (altura em px da folha). Folhas sem guarda: pela pose relaxada (relaxado/guarda = 656/622)
RX=622/656
REF={1:701*RX,2:622,3:670*RX,4:469,5:469,6:494,7:556,8:499,9:526,10:490,11:506,12:496,13:485,14:504,15:501,16:488,17:479,
     18:482,19:479,20:488,21:487,22:454,23:465,24:565*RX}
PLANT={1,2,6,7,8,10,11,12,13,14,15,20,21,24}   # pe de tras parado no chao
A={'relax':G(1,R8),'gin':G(2,range(5)),'idle':G(2,[3,4,5]),'walk':G(3,R8),'run':G(4,R8),'dashf':G(5,R8),'dash2':G(17,R8),'dashb':G(16,R8),
 'jab':G(6,R8),'jab3':G(7,R8),'str':G(8,R8),'upper':G(9,R8),'cross':G(10,R8),'kick':G(11,R8),'hkick':G(12,R8),'sweep':G(13,R8),
 'block':G(14,R8),'cblock':G(15,R8),'hit':G(20,R8),'hhit':G(21,R8),'dodge':G(17,R8),
 'jumpv':G(18,R8),'jumpd':[(18,1),(18,2),(18,3),(19,0),(19,1),(19,3),(19,4),(19,7)],
 'hover':[(19,0),(19,1),(19,2),(19,0),(19,1),(19,2)],
 'ajab':[(19,0),(5,3),(5,3),(5,3),(5,4),(5,4),(19,1),(19,0)],
 'akick':[(19,0),(9,3),(9,3),(9,4),(9,5),(9,5),(9,6),(19,0)],
 'launch':G(21,R8),'fall':[(22,1),(22,2),(22,3),(22,4),(22,7)],'drop':G(22,[5,6,7]),'getup':G(23,R8),
 'win':G(24,R8),'lose':[(20,0),(20,1),(20,2),(20,5),(21,6),(21,5),(21,5),(21,5)],
 'pw':G(24,R8),'ki1':[(10,0),(10,1),(10,1),(10,1),(10,2),(10,2),(10,3),(10,7)],'ki2':[(8,0),(8,2),(8,3),(8,4),(8,5),(8,5),(8,6),(8,7)]}
AIR={'jumpv','jumpd','hover','ajab','akick'}   # ancora vertical no proprio pe
GL={}
for t in range(1,25):GL[t]=max(np.load(f)[1] for f in glob.glob(f'cut/g{t:02d}_*.y.npy'))
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def geo(t,i):
    y0,y1,x0,x1=np.load(f'cut/g{t:02d}_{i}.y.npy');al=np.asarray(Image.open(f'cut/g{t:02d}_{i}.png'))[...,3]/255.
    cen=x0+(al.sum(0)*np.arange(al.shape[1])).sum()/al.sum()
    g=GL[t]-y0;band=al[max(0,int(g-16)):int(g)]>.5;cols=np.where(band.any(0))[0];cl=[]
    for c in cols:
        if cl and c-cl[-1][1]<=10:cl[-1][1]=c
        else:cl.append([c,c])
    feet=[(a+x0,b+x0) for a,b in cl if b-a>=6]
    return cen,feet
SUPPORT={11,12,21}   # chutes/rasteira/golpe forte: perna de apoio muda -> media do deslocamento
def head(t,i):
    y0,y1,x0,x1=np.load(f'cut/g{t:02d}_{i}.y.npy');al=np.asarray(Image.open(f'cut/g{t:02d}_{i}.png'))[...,3]/255.
    H=al.shape[0];hb=al[int(H*.08):int(H*.35)];return x0+(hb.sum(0)*np.arange(al.shape[1])).sum()/max(hb.sum(),1)
def anchor(t,i):
    cen,feet=geo(t,i)
    if t==13:   # rasteira: segue a cabeca/tronco
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
    r=f'g{t:02d}_{i}';y0,y1,x0,x1=np.load(f'cut/{r}.y.npy')
    im=Image.open(f'cut/{r}.png');a4=np.asarray(im).copy();al=a4[...,3]/255.
    slot=anchor(t,i)-x0
    ay=(y1-y0) if air else (GL[t]-y0)
    cols=np.where((al>.5).any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-3):rx+1].max(1)>.5)[0].mean()
    k=TARGET/REF[t];gw,gh=im.width*k,im.height*k
    if AI:o=esr.sr_rgba(im,2).resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    else:o=im.resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(slot*k,1),'ay':round(ay*k,1),'rx':round((rx-slot)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[key]=fr
    if AI:print(r,len(cache),round(time.time()-T0),flush=True)
    return fr
J={'gg':{a:[frame(t,i,a in AIR) for t,i in L] for a,L in A.items()}}
json.dump(J,open('gg_ai.json' if AI else 'gg_fast.json','w'),separators=(',',':'));print('DONE',len(cache),round(time.time()-T0))
