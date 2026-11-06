# Montagem das poses do Luffy (sid lf = normal, folhas lNN; sid lfs = Snakeman, folhas sNN). Uso: python3 build_luffy.py [ai]  (pasta com cut/lNN_i.png e cut/sNN_i.png)
# Antes: recortar as folhas (mNN.png) -> cut/mNN_i.png. Escala por folha: altura da guarda = TARGET (folhas sem guarda: pose em pé / 1.07).
import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','ia'));import esr
from PIL import Image
from scipy import ndimage as nd
AI=len(sys.argv)>1 and sys.argv[1]=='ai'
TARGET=250.0;RES=2.6;T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
G=lambda t,ix:[(t,i) for i in ix];R8=range(8);RL=1.07
RL=1.10;SK=.87
REF={'l01':483/RL,'l02':493,'l03':489/RL,'l04':430,'l05':429,'l06':453,'l07':473,'l08':428,'l09':429,'l10':433,'l11':434,'l12':430,'l13':430,'l14':425,'l15':440,
 'l16':429,'l17':427,'l18':441/RL,'l19':469/RL,'l20':485/RL,'l21':475/RL,'l22':437/RL,'l23':463/RL,'l24':510/RL,'l25':488/RL,'l26':511/RL,'l27':429,'l28':426,'l29':414}
for k,v in {'s01':415,'s02':415,'s03':430,'s04':405,'s05':425,'s06':417,'s07':415,'s08':418,'s09':418,'s10':421,'s11':422,'s12':424,'s13':425,'s14':421,'s15':423,
 's16':425,'s17':433,'s18':400,'s19':384,'s20':426,'s21':439,'s22':467,'s23':434,'s24':440,'s25':405}.items():REF[k]=v*SK
# v149: tamanho igual pela cabeça/chapéu (folhas de luta 1774px vinham ~10% maiores; l02 menor)
for _k in ['l05','l06','l07','l08','l09','l10','l11','l12','l13','l14','l15','l16','l17','l27','l28']:REF[_k]*=1.11
REF['l02']/=1.03;REF['l04']*=1.03
NOPLANT={'l18','l19','l21','l22','l24','s18','s19','s22','s23','s24','l13','s13'}
HEADA={'l13','s13'}
SUPPORT=set()
def N(p):  # animações iguais nos dois (p='l' normal, 's' Snakeman)
    G2=lambda t,ix:[(f'{p}{t:02d}',i) for i in ix]
    if p=='l':
        return {'relax':G2(1,R8),'gin':G2(1,[0,4])+G2(2,[0,1,0]),'idle':G2(2,R8),'walk':G2(3,R8),'run':G2(4,R8),'dashf':G2(5,R8),'dash2':G2(6,R8),'dashb':G2(6,R8),'dodge':G2(17,R8),
         'jab':G2(10,R8),'cross':G2(7,R8),'str':G2(8,R8),'upper':G2(9,R8),'kick':G2(11,R8),'hkick':G2(12,R8),'sweep':G2(13,R8),'block':G2(14,R8),'cblock':G2(15,[4]*8),'crouch':G2(15,R8),
         'hit':G2(16,R8),'hhit':G2(20,R8),'launch':G2(21,R8),'fall':G2(21,[2,3,4,5,6]),'drop':G2(21,[5,6,7]),'getup':G2(22,R8),'win':G2(23,R8),'lose':G2(24,R8),
         'pw':G2(26,R8),'ki1':G2(7,R8),'ki2':G2(8,R8),'seals':G2(25,R8),'gatling':G2(27,R8),'cmb':G2(28,R8),'jumpv':G2(18,R8),'jumpd':G2(18,R8),'hover':G2(18,[4,5,4,5,4,5]),'land':G2(19,R8),
         'ajab':G2(18,[4])+G2(7,[3,4,4,5])+G2(18,[5,6,6]),'akick':G2(18,[4])+G2(11,[3,4,4,5])+G2(18,[5,6,6]),'trans':G2(29,R8)}
    return {'relax':G2(1,R8),'gin':G2(2,[0,1,2,3,4]),'idle':G2(2,R8),'walk':G2(3,R8),'run':G2(4,R8),'dashf':G2(5,R8),'dash2':G2(6,R8),'dashb':G2(6,R8),'dodge':G2(17,R8),
         'jab':G2(7,R8),'cross':G2(8,R8),'str':G2(10,R8),'upper':G2(9,R8),'kick':G2(11,R8),'hkick':G2(12,R8),'sweep':G2(13,R8),'block':G2(14,R8),'cblock':G2(15,[4]*8),'crouch':G2(15,R8),
         'hit':G2(16,R8),'hhit':G2(21,R8),'launch':G2(22,R8),'fall':G2(22,[2,3,4,5,6]),'drop':G2(22,[5,6,7]),'getup':G2(23,R8),'win':G2(1,R8),'lose':G2(24,R8),
         'pw':G2(2,R8),'ki1':G2(10,R8),'ki2':G2(8,R8),'seals':G2(1,R8),'gatling':G2(10,R8),'cmb':G2(25,R8),'jumpv':G2(18,R8),'jumpd':G2(18,R8),'hover':G2(18,[3,4,3,4,3,4]),'land':G2(19,R8),
         'ajab':G2(18,[3])+G2(7,[3,4,4,5])+G2(18,[4,5,5]),'akick':G2(18,[3])+G2(11,[3,4,4,5])+G2(18,[4,5,5]),'trans':G2(2,R8)}
AIR={'jumpv','jumpd','hover','ajab','akick'}
GL={}
for t in REF:GL[t]=max(np.load(f)[1] for f in glob.glob(f'cut/{t}_*.y.npy'))
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def geo(t,i):
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');al=np.asarray(Image.open(f'cut/{t}_{i}.png'))[...,3]/255.
    cen=x0+(al.sum(0)*np.arange(al.shape[1])).sum()/al.sum()
    g=GL[t]-y0;band=al[max(0,int(g-16)):int(g)]>.5;cols=np.where(band.any(0))[0];cl=[]
    for c in cols:
        if cl and c-cl[-1][1]<=10:cl[-1][1]=c
        else:cl.append([c,c])
    feet=[(a+x0,b+x0) for a,b in cl if b-a>=6]
    return cen,feet
def head(t,i):
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');al=np.asarray(Image.open(f'cut/{t}_{i}.png'))[...,3]/255.
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
    if t not in NOPLANT:
        c0,f0=geo(t,0)
        if f0 and feet:
            off=c0-f0[0][0];exp=cen-off
            best=min(feet,key=lambda q:abs(q[0]-exp))
            if abs(best[0]-exp)<45:return best[0]+off
    return cen
cache={}
if AI and os.path.exists('cache_ai.json'):
    for k_,v_ in json.load(open('cache_ai.json')).items():t_,i_,a_=k_.split(',');cache[(t_,int(i_),bool(int(a_)))]=v_
def frame(t,i,air):
    key=(t,i,air)
    if key in cache:return cache[key]
    r=f'{t}_{i}';y0,y1,x0,x1=np.load(f'cut/{r}.y.npy')
    im=Image.open(f'cut/{r}.png');a4=np.asarray(im).copy();al=a4[...,3]/255.
    slot=anchor(t,i)-x0
    ay=(y1-y0) if air else (GL[t]-y0)
    cols=np.where((al>.5).any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-3):rx+1].max(1)>.5)[0].mean()
    k=TARGET/REF[t];gw,gh=im.width*k,im.height*k
    if AI:o=esr.sr_rgba(im,2).resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    else:o=im.resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    mo=None
    if False:
        H_=al.shape[0];band=al[int(H_*.12):int(H_*.32)]>.5;ys_,xs_=np.where(band)
        if len(xs_):k_=np.argmax(xs_);mo=[round((xs_[k_]-4-slot)*TARGET/REF[t],1),round((ay-(ys_[k_]+int(H_*.12)))*TARGET/REF[t],1)]
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(slot*k,1),'ay':round(ay*k,1),'rx':round((rx-slot)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    if mo:fr['mo']=mo
    cache[key]=fr
    if AI:print(r,len(cache),round(time.time()-T0),flush=True)
    return fr
J={'lf':{a:[frame(t,i,a in AIR) for t,i in L] for a,L in N('l').items()},'lfs':{a:[frame(t,i,a in AIR) for t,i in L] for a,L in N('s').items()}}
json.dump(J,open('lf_ai.json' if AI else 'lf_fast.json','w'),separators=(',',':'))
json.dump({f'{k[0]},{k[1]},{int(k[2])}':v for k,v in cache.items()},open('cache_ai.json' if AI else 'cache_fast.json','w'))
print('DONE',len(cache),round(time.time()-T0))
