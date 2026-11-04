# Montagem das poses do Gogeta Super Saiyajin Blue (sid ggf). Uso: python3 build_gogeta_blue.py [ai]
# Antes: recortar as folhas (fNN_*.png) com seg_gogeta.py -> cut/fNN_i.png.
# Escala por folha: altura da pose relaxada (1o quadro) = TARGET.
import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','ia'));import esr
from PIL import Image
from scipy import ndimage as nd
AI=len(sys.argv)>1 and sys.argv[1]=='ai'
TARGET=262.0;RES=2.6;T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
G=lambda t,ix:[(t,i) for i in ix];R8=range(8)
REF={1:593,2:593,3:463,4:441,5:525,6:506,7:481,8:496,9:481,10:504,11:521,12:485,13:517,14:501,15:488,16:480,17:475,18:454,
     19:495,20:496,21:418,22:469,23:576,24:507}
PLANT={1,6,7,9,13,14,15,19,23,24}
SUPPORT={10,11,20}
HEADA={12}
A={'relax':[(1,0),(1,0),(1,1),(1,1),(1,0),(1,0)],'gin':G(1,range(5)),'idle':G(1,[5,6,7]),'walk':G(2,R8),'run':G(3,R8),'dashf':G(4,R8),'dash2':G(16,R8),'dashb':G(5,R8),
 'jab':[(6,0),(6,1),(6,2),(6,3),(6,5),(7,2),(7,5),(6,7)],'jab3':G(7,R8),
 'str':[(9,0),(9,1),(9,2),(7,3),(9,2),(9,3),(9,4),(9,0)],'cross':[(9,0),(9,1),(9,2),(9,2),(9,2),(9,3),(9,4),(9,0)],
 'upper':G(8,R8),'kick':[(10,0),(10,1),(10,2),(10,3),(10,5),(10,5),(10,6),(10,7)],'hkick':G(11,R8),'sweep':G(12,R8),
 'block':G(13,R8),'cblock':G(14,R8),'bpush':G(15,R8),'hit':G(19,R8),'hhit':G(20,R8),'dodge':G(4,R8),
 'jumpv':G(17,R8),'jumpd':[(17,1),(17,2),(17,3),(17,4),(17,5),(18,0),(18,1),(18,3)],
 'hover':[(18,0),(18,1),(18,2),(18,0),(18,1),(18,2)],
 'ajab':[(18,0),(4,3),(4,3),(4,3),(4,4),(4,4),(18,1),(18,0)],
 'akick':[(18,0),(8,3),(8,3),(8,4),(8,5),(8,5),(8,6),(18,0)],
 'launch':G(20,R8),'fall':[(21,1),(21,2),(21,3),(21,4),(21,7)],'drop':G(21,[5,6,7]),'getup':G(22,R8),
 'win':G(23,R8),'lose':G(24,R8),
 'pw':[(23,0),(23,1),(23,2),(23,3),(23,4),(23,3),(23,4),(23,3)],'ki1':[(7,0),(7,1),(7,1),(7,2),(7,4),(7,4),(7,5),(7,7)],'ki2':[(9,0),(9,1),(9,2),(9,3),(9,3),(9,3),(9,4),(9,7)]}
AIR={'jumpv','jumpd','hover','ajab','akick'}   # ancora vertical no proprio pe
GL={}
for t in range(1,25):GL[t]=max(np.load(f)[1] for f in glob.glob(f'cut/f{t:02d}_*.y.npy'))
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def geo(t,i):
    y0,y1,x0,x1=np.load(f'cut/f{t:02d}_{i}.y.npy');al=np.asarray(Image.open(f'cut/f{t:02d}_{i}.png'))[...,3]/255.
    cen=x0+(al.sum(0)*np.arange(al.shape[1])).sum()/al.sum()
    g=GL[t]-y0;band=al[max(0,int(g-16)):int(g)]>.5;cols=np.where(band.any(0))[0];cl=[]
    for c in cols:
        if cl and c-cl[-1][1]<=10:cl[-1][1]=c
        else:cl.append([c,c])
    feet=[(a+x0,b+x0) for a,b in cl if b-a>=6]
    return cen,feet
def head(t,i):
    y0,y1,x0,x1=np.load(f'cut/f{t:02d}_{i}.y.npy');al=np.asarray(Image.open(f'cut/f{t:02d}_{i}.png'))[...,3]/255.
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
    r=f'f{t:02d}_{i}';y0,y1,x0,x1=np.load(f'cut/{r}.y.npy')
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
J={'ggf':{a:[frame(t,i,a in AIR) for t,i in L] for a,L in A.items()}}
json.dump(J,open('ggf_ai.json' if AI else 'ggf_fast.json','w'),separators=(',',':'));print('DONE',len(cache),round(time.time()-T0))
