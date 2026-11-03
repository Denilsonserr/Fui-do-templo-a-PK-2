import json,numpy as np,os,hashlib
from PIL import Image
from scipy import ndimage as nd
import sys;sys.path.insert(0,'/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/sr');import esr,time;K=0.42;RES=2.6;T0=time.time()
A={'idle':['n01_0','n01_0','n01_0'],'walk':['n01_0','n01_1','n01_2','n01_3'],'combo':['n02_0','n02_1','n02_2','n02_3'],
 'kick':['n03_0','n02_3','n03_2','n07_2'],'low':['n10_0','n10_2','n10_0','n10_2'],'kk':['n11_0','n11_1','n11_2','n11_3'],'jump':['n04_0','n04_1','n04_2','n05_0'],
 'block':['n07_0','n10_1'],'hit':['n08_0','n08_1','n08_0'],'fall':['n08_1','n08_2','n08_2','n08_3'],'trans':['n06_0','n06_2','n06_2','n06_0'],
 'win':['n07_3','n06_3','n07_3'],'pw':['n07_1','n07_1'],'fly':['n05_1','n05_1','n05_2','n05_1'],'sp':['n06_2','n07_2','n05_2'],'air':['n05_1','n05_2','n05_3']}
os.makedirs('out',exist_ok=True)
AI=1
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'out/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def blade(rgb,al,pre=False):
    mx=rgb.max(2);mn=rgb.min(2);sat=(mx-mn)/np.maximum(mx,1);R,G,B=rgb[...,0],rgb[...,1],rgb[...,2]
    if pre:m=(B>170)&(R>120)&(G<140)&(B>G+60)&(al>.3)
    else:m=(sat<.22)&(mx>125)&(al>.5)
    lab,k=nd.label(m);keep=np.zeros_like(m)
    for i,o in enumerate(nd.find_objects(lab)):
        mm=lab[o]==i+1;n=mm.sum();hh=o[0].stop-o[0].start;ww=o[1].stop-o[1].start
        if n>(60 if pre else 250) and max(hh,ww)>(25 if pre else 70) and n<0.45*hh*ww:keep[o]|=mm
    if not pre:
        near=nd.binary_dilation(keep,iterations=3)&(sat<.3)&(al>.5)&(mx<200)&(mx>25)
        keep=keep|near
    return keep
PUR=lambda l:np.where(l[...,None]<.5,np.array([70,10,130.])+(np.array([170,60,255.])-np.array([70,10,130.]))*(l[...,None]/.5),np.array([170,60,255.])+(np.array([250,215,255.])-np.array([170,60,255.]))*((l[...,None]-.5)/.5))
cache={}
def frame(r,form):
    key=(r,form)
    if key in cache:return cache[key]
    im=np.asarray(Image.open(f'cut/{r}.png')).astype(np.float32);rgb,al=im[...,:3],im[...,3]/255
    ys,xs=np.where(al>.05);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1;rgb,al=rgb[y0:y1,x0:x1],al[y0:y1,x0:x1]
    hh=al.shape[0];fb=al[int(hh*.88):];cx=(fb.sum(0)*np.arange(al.shape[1])).sum()/max(fb.sum(),1)
    gl=None;pts=[]
    if form:
        pre=r.startswith('n09');m=blade(rgb,al,pre)
        if not pre:
            l=(rgb[...,0]*.3+rgb[...,1]*.59+rgb[...,2]*.11)/255;rgb=np.where(m[...,None],PUR(np.clip(l*1.05,0,1)),rgb)
        if m.sum()>50:
            g=nd.gaussian_filter(nd.binary_dilation(m,iterations=2).astype(np.float32),5);g=g/max(g.max(),1e-3)
            gl=np.dstack([np.full_like(g,190),np.full_like(g,70),np.full_like(g,255),np.clip(g*1.4,0,1)*255])
            yy,xx=np.where(m);idx=np.random.RandomState(len(yy)).choice(len(yy),min(14,len(yy)),replace=False);pts=[[round(float(xx[i])*K,1),round(float(yy[i])*K,1)] for i in idx]
    def up(a,ai=False):
        o=Image.fromarray(a.clip(0,255).astype(np.uint8),'RGBA');W2,H2=max(1,round(o.width*K*RES)),max(1,round(o.height*K*RES))
        if ai:o=esr.sr_rgba(o,2)
        return np.asarray(o.resize((W2,H2),Image.LANCZOS)).astype(float)
    gw,gh=rgb.shape[1]*K,rgb.shape[0]*K
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(cx*K,1),'ay':round(gh-.5,1),'src':sv(up(np.dstack([rgb,al*255]),True))};print(r,form,round(time.time()-T0),flush=True)
    if gl is not None:fr['gl']=sv(up(gl));fr['pt']=pts
    cache[key]=fr;return fr
J={'zr':{a:[frame(r,0) for r in L] for a,L in A.items()}}
AF=dict(A);AF['walk']=['n09_0','n09_1','n09_2','n09_3'];AF['idle']=['n09_0','n09_0','n09_0']
J['zrf']={a:[frame(r,1) for r in L] for a,L in AF.items()}
json.dump(J,open('zr3.json','w'),separators=(',',':'))
