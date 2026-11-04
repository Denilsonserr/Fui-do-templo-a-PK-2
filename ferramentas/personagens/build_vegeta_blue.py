import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image
from scipy import ndimage as nd
AI=len(sys.argv)>1 and sys.argv[1]=='ai'
K=0.40;RES=2.6;T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
S=lambda t,ix:[f'{t}_{i}' for i in ix];R8=range(8)
A={'idle':S('f02',R8),'walk':S('f00',R8),'run':S('f03',R8),'dashf':S('f04',R8),'dashb':S('f05',R8),
 'jab':S('f06',R8),'str':S('f07',R8),'upper':S('f08',R8),'kick':S('f09',R8),'hkick':S('f10',R8),'jkick':S('f11',R8),'sweep':S('f12',R8),
 'rapid':S('f13',R8),'pk':S('f14',R8),'block':S('f15',R8),'cblock':S('r12',R8),'hit':S('r13',R8),'hhit':S('r19',R8),'dodge':S('f17',R8),
 'jumpv':S('f18',R8),'jumpd':S('f19',R8),'hover':S('f20',R8),'ajab':S('f21',R8),'akick':S('f22',R8),'launch':S('f23',R8),
 'fall':['f24_0','f24_1','f24_2','f23_6','f25_0'],'getup':S('f25',R8),'win':S('f26',R8),'lose':S('r23',R8),'pw':S('f27',R8),'ki1':S('f28',R8),'ki2':S('f29',R8)}
tags=sorted({r.split('_')[0] for L in A.values() for r in L})
GL={t:max(np.load(f)[1] for f in glob.glob(f'cut/{t}_*.y.npy')) for t in tags}
def hgt(t,i):y=np.load(f'cut/{t}_{i}.y.npy');return y[1]-y[0]
HF=650;SC={}
for t in tags:
    if t[0]=='r':SC[t]={'r13':591/464,'r19':591/466,'r12':591/468,'r23':664/498}[t]
    elif t in('f21','f22','f23'):SC[t]=HF/hgt('f20',0)
    elif t in('f24','f25'):SC[t]=HF/hgt(t,7)
    else:SC[t]=HF/hgt(t,0)
PLANT={'f01','f02','f06','f07','f08','f13','f15','f26','f27','f28','f29','r12','r23'}
KICK={'f09','f10','f14'};HEAD={'f21','f22'};PERFRAME={'f18','f19','f20'}
def geo(t,i):
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');al=np.asarray(Image.open(f'cut/{t}_{i}.png'))[...,3]/255.
    cen=x0+(al.sum(0)*np.arange(al.shape[1])).sum()/al.sum()
    g=GL[t]-y0;band=al[max(0,int(g-14)):int(g)]>.5;cols=np.where(band.any(0))[0]
    rear=x0+cols.min() if len(cols) else cen
    H=al.shape[0];hb=al[int(H*.16):int(H*.30)];head=x0+(hb.sum(0)*np.arange(al.shape[1])).sum()/max(hb.sum(),1)
    return cen,rear,head
def anchor(t,i):
    cen,rear,head=geo(t,i);c0,r0,h0=geo(t,0)
    if t in PLANT:return rear+(c0-r0)
    if t in KICK:
        if i in (0,7):return cen
        D=np.mean([geo(t,j)[0]-geo(t,j)[1] for j in range(1,7)]);return rear+D
    if t in HEAD:return head+(c0-h0)
    return cen
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
cache={}
def frame(r):
    if r in cache:return cache[r]
    t,i=r.split('_');i=int(i);y0,y1,x0,x1=np.load(f'cut/{r}.y.npy')
    im=Image.open(f'cut/{r}.png');a4=np.asarray(im).copy();m=a4[...,3]>20;lb,n=nd.label(m)
    if n>1:
        z=nd.sum(m,lb,range(1,n+1));bad=[q+1 for q in range(n) if z[q]<z.max()*.03];a4[np.isin(lb,bad),3]=0;im=Image.fromarray(a4,'RGBA')
    al=a4[...,3]/255.
    slot=anchor(t,i)-x0;ay=(y1-y0) if t in PERFRAME else (GL[t]-y0)
    cols=np.where((al>.5).any(0))[0];rx=cols.max();ry=np.where(al[:,rx-3:rx+1].max(1)>.5)[0].mean()
    k=K*SC[t];gw,gh=im.width*k,im.height*k
    if AI:o=esr.sr_rgba(im,2).resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    else:o=im.resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(slot*k,1),'ay':round(ay*k,1),'rx':round((rx-slot)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[r]=fr
    if AI:print(r,round(time.time()-T0),flush=True)
    return fr
J={'vgf':{a:[frame(r) for r in L] for a,L in A.items()}}
json.dump(J,open('vgf_ai.json' if AI else 'vgf_fast.json','w'),separators=(',',':'));print('DONE',len(cache),round(time.time()-T0))
