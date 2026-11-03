import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image
from scipy import ndimage as nd
AI=len(sys.argv)>1 and sys.argv[1]=='ai'
K=0.40;RES=2.6;T0=time.time();SW=2172
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
S=lambda t,ix:[f'v{t:02d}_{i}' for i in ix]
R8=range(8)
A={'idle':S(2,range(6)),'walk':S(1,R8),'run':S(3,R8),'dashf':S(4,R8),'dashb':S(5,R8),
 'jab':S(6,R8),'str':S(7,R8),'kick':S(8,R8),'hkick':S(9,R8),'sweep':S(10,R8),
 'block':S(11,R8),'cblock':S(12,R8),'hit':S(13,R8),'dodge':S(14,R8),'jumpv':S(15,R8),'jumpd':S(16,R8),
 'ajab':S(17,R8),'akick':S(18,R8),'hhit':S(19,R8),'fall':S(20,range(5)),'getup':S(21,R8),'win':S(22,R8),'lose':S(23,R8),
 'pw':S(24,R8),'ki1':S(25,R8),'ki2':S(26,R8),'launch':S(27,R8)}
NPS={2:6}
PERFRAME={15,16}   # jump arcs: anchor at own feet
FOOTX={20,21}      # uneven spacing: anchor x on feet/hips
# sheet ground lines
GL={}
for t in range(1,28):
    ys=[np.load(f)[1] for f in glob.glob(f'cut/v{t:02d}_*.y.npy')];GL[t]=max(ys)
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
ST={4:413,5:437,6:470,7:455,8:448,9:442,10:430,11:483,12:468,13:464,14:452,15:460,16:474,19:466,20:414,21:437,27:461,3:413}
SC={t:591/v for t,v in ST.items()};SC.update({2:1.0,1:1.02,22:664/501,23:664/498,24:664/488,25:664/478,26:664/498,17:1.15,18:1.15})
PLANT={2,6,7,10,11,12,22,23,24,25,26}
def geo(t,i):
    y0,y1,x0,x1=np.load(f'cut/v{t:02d}_{i}.y.npy');al=np.asarray(Image.open(f'cut/v{t:02d}_{i}.png'))[...,3]/255.
    cen=x0+(al.sum(0)*np.arange(al.shape[1])).sum()/al.sum()
    g=GL[t]-y0;band=al[max(0,int(g-14)):int(g)]>.5;cols=np.where(band.any(0))[0]
    rear=x0+cols.min() if len(cols) else cen;front=x0+cols.max() if len(cols) else cen
    H=al.shape[0];hb=al[int(H*.16):int(H*.30)];head=x0+(hb.sum(0)*np.arange(al.shape[1])).sum()/max(hb.sum(),1)
    return cen,rear,front,head
def anchor(t,i):
    cen,rear,front,head=geo(t,i);c0,r0,f0,h0=geo(t,0)
    if t in PLANT:return rear+(c0-r0)
    if t in (8,9):
        if i in (0,7):return cen
        D=np.mean([geo(t,j)[0]-geo(t,j)[1] for j in range(1,7)]);return rear+D
    if t in (17,18):return head+(c0-h0)
    return cen
cache={}
def frame(r):
    if r in cache:return cache[r]
    t=int(r[1:3]);i=int(r.split('_')[1]);y0,y1,x0,x1=np.load(f'cut/{r}.y.npy')
    im=Image.open(f'cut/{r}.png');a4=np.asarray(im).copy();m=a4[...,3]>20;lb,n=nd.label(m)
    if n>1:
        z=nd.sum(m,lb,range(1,n+1));bad=[q+1 for q in range(n) if z[q]<z.max()*.03];a4[np.isin(lb,bad),3]=0;im=Image.fromarray(a4,'RGBA')
    al=a4[...,3]/255.
    slot=anchor(t,i)-x0
    ay=(y1-y0) if t in PERFRAME else (GL[t]-y0)
    # forward reach (for hitboxes): rightmost solid column and its height
    cols=np.where((al>.5).any(0))[0];rx=cols.max();ry=np.where(al[:,rx-3:rx+1].max(1)>.5)[0].mean()
    k=K*SC[t];gw,gh=im.width*k,im.height*k
    if AI:o=esr.sr_rgba(im,2).resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    else:o=im.resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(slot*k,1),'ay':round(ay*k,1),'rx':round((rx-slot)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[r]=fr
    if AI:print(r,round(time.time()-T0),flush=True)
    return fr
J={'vg':{a:[frame(r) for r in L] for a,L in A.items()}}
json.dump(J,open('vg_ai.json' if AI else 'vg_fast.json','w'),separators=(',',':'));print('DONE',len(cache),round(time.time()-T0))
