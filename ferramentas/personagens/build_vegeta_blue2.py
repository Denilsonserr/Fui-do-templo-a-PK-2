import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image
from scipy import ndimage as nd
AI=len(sys.argv)>1 and sys.argv[1]=='ai'
K=0.40;RES=2.6;T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
def L(t,ix):return [f'n{t:02d}_{i}' for i in ix]
J_=lambda i:f'n19_{i}'
A={'idle':L(2,[3,4,5,4]),'relax':L(1,range(6)),'gin':L(2,range(6)),'walk':L(0,range(8)),'run':L(4,range(8)),
 'dashf':['n05_0','n18_1','n05_1','n18_2','n05_2','n18_3','n05_3','n05_3'],'dashb':L(6,[0,1,2,2,2,2,3,3]),
 'jab':L(7,[0,1,2,3]),'str':L(8,range(6)),'upper':L(9,range(5)),'upper2':L(10,range(5)),'kick':L(11,range(4)),'kick2':L(12,range(5)),
 'hkick':L(13,range(5)),'sweep':L(14,range(6)),'block':L(15,[0,1,2,3,3,2,1,0]),'cblock':L(16,[0,1,1,3,2,2,1,0]),
 'hit':L(17,[0,1,2,3,3,2,1,0]),'hhit':L(21,[0,1,2,3,3,3,2,1]),'launch':L(22,[0,1,2,2,3,3,3,3]),
 'jumpv':[J_(0),J_(1),J_(2),J_(3),J_(3),'n20_2','n20_4','n20_5'],'jumpd':[J_(0),J_(1),J_(2),J_(3),J_(4),'n20_2','n20_4','n20_5'],
 'hover':['n20_0','n20_0','n20_1','n20_0','n20_1','n20_0','n20_1','n20_0'],
 'fall':L(23,[0,1,2,3,4,5]),'getup':L(24,[0,0,1,2,3,4,5,5]),'win':L(25,[0,0,1,1,2,2,3,3]),'lose':L(26,[0,0,1,1,2,2,3,3]),
 'pw':L(25,[0,1,1,1,1,2,2,1]),'ki1':L(7,[0,1,1,2,2,2,1,0]),'ki2':L(8,[0,1,2,3,4,4,4,5]),
 'dodge':['n05_0','n05_1','n18_2','n18_2','n05_2','n05_3']}
tags=sorted({r.split('_')[0] for Lr in A.values() for r in Lr})
GL={t:max(np.load(f)[1] for f in glob.glob(f'cut/{t}_*.y.npy')) for t in tags}
def hgt(r):y=np.load(f'cut/{r}.y.npy');return y[1]-y[0]
HG=650;HS=HG*hgt('n02_0')/hgt('n02_5')
REL={'n00':'n00_0','n01':'n01_0','n02':'n02_0','n03':'n03_0','n04':'n04_0','n18':'n18_0','n25':'n25_0','n26':'n26_0','n24':'n24_5'}
SC={}
for t in tags:
    if t in REL:SC[t]=HS/hgt(REL[t])
    elif t=='n20':SC[t]=HG/hgt('n20_5')
    else:SC[t]=HG/hgt(t+'_0')
PLANT={'n02','n07','n08','n09','n10','n11','n12','n13','n14','n15','n16','n25','n01'}
KICK=set();PERFRAME={'n19','n20','n22','n23'}
def geo(t,i):
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');al=np.asarray(Image.open(f'cut/{t}_{i}.png'))[...,3]/255.
    cen=x0+(al.sum(0)*np.arange(al.shape[1])).sum()/al.sum()
    g=GL[t]-y0;band=al[max(0,int(g-14)):int(g)]>.5;cols=np.where(band.any(0))[0]
    rear=x0+cols.min() if len(cols) else cen
    return cen,rear
NF={}
def anchor(t,i):
    cen,rear=geo(t,i);c0,r0=geo(t,0)
    if t in PLANT:return rear+(c0-r0)
    if t in KICK:
        n=len(glob.glob(f'cut/{t}_*.png'))
        if i==0:return cen
        D=c0-r0;return rear+D
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
        z=nd.sum(m,lb,range(1,n+1));bad=[q+1 for q in range(n) if z[q]<z.max()*.03];a4[np.isin(lb,bad),3]=0
    # remove saturated red/colored glow fringe from edges
    rgb=a4[...,:3].astype(int);edge=(a4[...,3]>0)&~nd.binary_erosion(a4[...,3]>128,iterations=3)
    red=(rgb[...,0]>rgb[...,2]+40)&(rgb[...,0]>140)&(rgb[...,1]<120)
    a4[edge&red,3]=0;im=Image.fromarray(a4,'RGBA')
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
J={'vgf':{a:[frame(r) for r in Lr] for a,Lr in A.items()}}
json.dump(J,open('vgf_ai.json' if AI else 'vgf_fast.json','w'),separators=(',',':'));print('DONE',len(cache),round(time.time()-T0),HS)
