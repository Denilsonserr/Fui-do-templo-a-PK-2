import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,'/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/sr');import esr
from PIL import Image
from scipy import ndimage as nd
K=0.40;RES=2.6;T0=time.time()
# remove trapped background pockets
for f in sorted(glob.glob('sh/*.png')):
    tag=os.path.basename(f)[:3];a0=np.asarray(Image.open(f).convert('RGB')).astype(np.float32)
    bg=np.median(np.concatenate([a0[:6].reshape(-1,3),a0[-6:].reshape(-1,3)]),0)
    for c in glob.glob(f'cut/{tag}_*.png'):
        a=np.asarray(Image.open(c)).astype(np.float32);rgb,al=a[...,:3],a[...,3]
        d=np.sqrt(((rgb-bg)**2).sum(2));near=(d<16)&(al>0);lab,k=nd.label(near);rm=np.zeros_like(near)
        if k:
            sz=nd.sum(near,lab,range(1,k+1))
            for i,v in enumerate(sz):
                if v>=60:rm|=lab==i+1
        if rm.any():
            rm=nd.binary_dilation(rm,iterations=1)&(d<36);al=al*(1-np.clip(nd.gaussian_filter(rm.astype(np.float32),.8)*1.3,0,1))
            Image.fromarray(np.dstack([rgb,al]).clip(0,255).astype(np.uint8),'RGBA').save(c)
A={'br':{'idle':['n01_0','n01_1','n01_2','n01_3'],'walk':['n12_0','n12_1','n12_2','n12_3'],'combo':['n03_1','n03_2','n03_4','n03_5'],
 'kick':['n04_0','n04_1','n04_2','n04_3'],'low':['n05_1','n05_2','n05_1','n05_3'],'jump':['n09_0','n09_1','n09_2','n10_3'],
 'block':['n06_1','n06_3'],'hit':['n07_0','n07_1','n08_0'],'fall':['n08_1','n08_2','n08_3','n08_4'],'trans':['n13_2','n13_3','n13_3','n13_2'],
 'win':['n03_7','n01_3','n03_7'],'pw':['n13_2','n13_3'],'fly':['n02_0','n02_1','n02_2','n02_3'],'sp':['n13_0','n13_1','n13_1'],'dash':['n11_0','n11_1','n11_2'],'up':['n03_6','n03_7']},
 'brf':{'idle':['t01_0','t01_1','t01_2','t01_1'],'walk':['t02_0','t02_1','t02_2','t02_3'],'combo':['t04_0','t04_2','t04_1','t04_3'],
 'kick':['t05_0','t05_1','t05_2','t05_3'],'low':['t07_0','t07_3','t07_1','t07_3'],'jump':['t03_0','t03_1','t03_2','t03_3'],
 'block':['t06_3','t07_2'],'hit':['t09_0','t09_1','t09_0'],'fall':['t09_1','t09_2','t09_2','t09_3'],'trans':['t01_3','t01_3','t01_2','t01_3'],
 'win':['t01_3','t01_2','t01_3'],'pw':['t01_3','t01_2'],'fly':['t08_1','t08_1','t08_2','t08_1'],'sp':['t06_1','t06_2','t06_2'],'dash':['t08_1','t08_2','t08_3'],'up':['t08_3','t08_2']}}
os.makedirs('out',exist_ok=True)
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'out/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
cache={}
def frame(r):
    if r in cache:return cache[r]
    im=np.asarray(Image.open(f'cut/{r}.png')).astype(np.float32);rgb,al=im[...,:3],im[...,3]/255
    ys,xs=np.where(al>.05);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1;rgb,al=rgb[y0:y1,x0:x1],al[y0:y1,x0:x1]
    hh=al.shape[0];fb=al[int(hh*.88):];cx=(fb.sum(0)*np.arange(al.shape[1])).sum()/max(fb.sum(),1)
    o=Image.fromarray(np.dstack([rgb,al*255]).clip(0,255).astype(np.uint8),'RGBA');gw,gh=o.width*K,o.height*K
    o=esr.sr_rgba(o,2).resize((max(1,round(gw*RES)),max(1,round(gh*RES))),Image.LANCZOS)
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(cx*K,1),'ay':round(gh-.5,1),'src':sv(np.asarray(o).astype(float))}
    cache[r]=fr;print(r,round(time.time()-T0),flush=True);return fr
J={sid:{a:[frame(r) for r in L] for a,L in an.items()} for sid,an in A.items()}
json.dump(J,open('br.json','w'),separators=(',',':'));print('DONE',{a:[f['h'] for f in L] for a,L in J['br'].items()})
