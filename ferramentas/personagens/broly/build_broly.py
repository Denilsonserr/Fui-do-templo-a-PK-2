# Socos e combo novos do Broly (v191). Folhas b1 (8 socos) e b2 (16 do combo). Postura do quadro 0 = 272 unidades (antes do SZK .95/.94).
# Gera 2 versões: transformado (cabelo verde, original) e normal (cabelo recolorido para preto).
import json,numpy as np,os,hashlib,sys,time
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image
RES=2.4;OUT='out';os.makedirs(OUT,exist_ok=True);NF={'b1':8,'b2':16,'n1':8,'n2':16};T0=time.time()
def eff(a):g,r,b=a[...,1],a[...,0],a[...,2];return (g>r+25)&(g>b+15)
def body(a):return (a[...,3]>140)&~eff(a)
S={}
for t in NF:
    a=np.asarray(Image.open(f'cut/{t}_0.png')).astype(int);al=a[...,3]>140;ys=np.where(al.any(1))[0];S[t]=272.0/(ys.max()-ys.min())
def low(t,i):
    a=np.asarray(Image.open(f'cut/{t}_{i}.png')).astype(int);y0=np.load(f'cut/{t}_{i}.y.npy')[0];d=(a[...,3]>160)&(a[...,:3].mean(2)<90);return y0+np.where(d.any(1))[0].max()
GR={(t,r):max(low(t,i) for i in range(r*NF[t]//2,(r+1)*NF[t]//2)) for t in NF for r in (0,1)}
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def hair_black(o):
    from scipy import ndimage as nd
    a=o.copy();H=a.shape[0];al=a[...,3]>40;ys=np.where(al.any(1))[0];top,bot=ys.min(),ys.max();lim=int(top+(bot-top)*.45)
    r,g,b=a[...,0],a[...,1],a[...,2];Y=np.arange(H)[:,None]
    gm=al&(Y<lim)&(g>r-25)&(g>b+45)&~((r>g)&(r>b+40)&(g<r))
    gm=nd.binary_closing(gm,iterations=2);lab,k=nd.label(gm)
    if k==0:return a
    sl=nd.find_objects(lab);sz=nd.sum(gm,lab,range(1,k+1))
    keep=[i+1 for i in range(k) if sl[i][0].start<=top+(bot-top)*.08 and sz[i]>200]
    m=np.isin(lab,keep)&(g>r-25)&(g>b+45)
    xs=np.where(al[top:top+12].any(0))[0];hx=int(np.median(xs));X=np.arange(a.shape[1])[None,:];m&=X<hx+int((bot-top)*.2)
    lum=(r*.3+g*.59+b*.11)/255.
    a[...,0]=np.where(m,14+lum*60,r);a[...,1]=np.where(m,13+lum*55,g);a[...,2]=np.where(m,24+lum*80,b)
    return a
def frame(t,i):
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');im=Image.open(f'cut/{t}_{i}.png');a=np.asarray(im).astype(int)
    B=body(a);ys=np.where(B.any(1))[0];top,bot=ys.min(),ys.max();band=B[int(top+(bot-top)*.6):int(top+(bot-top)*.78)]
    ax=np.median(np.where(band)[1]) if band.any() else a.shape[1]/2;row=0 if i<NF[t]//2 else 1;ay=GR[(t,row)]-y0
    k=S[t];gw,gh=im.width*k,im.height*k;W,H=round(gw*RES),round(gh*RES)
    o=np.asarray(esr.sr_rgba(im,2).resize((W,H),Image.LANCZOS)).astype(float)
    al=a[...,3]>40;cols=np.where(al.any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-4):rx+1].any(1))[0].mean()
    base={'w':round(gw,1),'h':round(gh,1),'ax':round(ax*k,1),'ay':round(ay*k,1),'rx':round((rx-ax)*k),'ry':round((ay-ry)*k)}
    F=dict(base,src=sv(o));N=dict(base,src=sv(hair_black(o)))
    print(t,i,round(time.time()-T0),flush=True);return F,N
R={'f':{},'n':{}}
for an,t,tn in [('bpn','b1','n1'),('bcm','b2','n2')]:
    R['f'][an]=[frame(t,i)[0] for i in range(NF[t])];R['n'][an]=[frame(tn,i)[0] for i in range(NF[tn])]
json.dump(R,open('br_new.json','w'),separators=(',',':'));print('DONE',S)
