import numpy as np,glob,os
from PIL import Image
from scipy import ndimage as nd
def mask_of(path):
    im=Image.open(path)
    if im.mode=='RGBA':
        a=np.asarray(im).astype(np.float32);rgb,al=a[...,:3],a[...,3]
        solid=al>200;solid=nd.binary_opening(solid,iterations=1)
        keep=nd.binary_dilation(solid,iterations=3)&(al>30)
        alpha=np.where(keep,al,0)/255.
        return rgb,alpha
    a=np.asarray(im.convert('RGB')).astype(np.float32)
    bg=np.median(np.concatenate([a[:6].reshape(-1,3),a[-6:].reshape(-1,3),a[:,:6].reshape(-1,3),a[:,-6:].reshape(-1,3)]),0)
    d=np.sqrt(((a-bg)**2).sum(2));near=d<14
    nO=nd.binary_opening(near,iterations=3);lab,_=nd.label(nO)
    edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg0=np.isin(lab,list(edge));bg0=nd.binary_dilation(bg0,iterations=4,mask=near)
    fg=nd.binary_opening(~bg0,iterations=1)
    e=fg&~nd.binary_erosion(fg,iterations=2);al=np.where(fg,1.,0.);al[e]=np.clip((d[e]-6)/40,0,1)
    al=np.clip(nd.gaussian_filter(al,.6)*fg,0,1)
    if bg.mean()>5:
        A=al[...,None];a=np.clip(np.where(A>.02,(a-(1-A)*bg)/np.maximum(A,.02),0),0,255)
    return a,al
def run(path,tag):
    rgb,al=mask_of(path);m=al>.12
    if tag=='v05':
        hsv=rgb.max(2)-rgb.min(2);thin=m&~nd.binary_opening(m,iterations=3)
        streak=thin&(hsv<40)&(rgb.mean(2)>90);streak=nd.binary_dilation(streak,iterations=1)&(hsv<50)
        al=al*~streak;m=al>.12
    er=nd.binary_erosion(m,iterations=5);lab,k=nd.label(er);sz=nd.sum(er,lab,range(1,k+1));big=sz.max()
    keep=[i+1 for i in range(k) if sz[i]>big*.12];seed=np.where(np.isin(lab,keep),lab,0)
    idx=nd.distance_transform_edt(seed==0,return_distances=False,return_indices=True)
    own=seed[idx[0],idx[1]]*m
    xs={q:np.where((own==q).any(0))[0].mean() for q in keep};keep.sort(key=lambda q:xs[q])
    MS=[]
    for q in keep:
        M=own==q;l2,k2=nd.label(M);
        if k2>1:
            z=nd.sum(M,l2,range(1,k2+1));M=np.isin(l2,[i+1 for i in range(k2) if z[i]>=120])
        MS.append(M)
    N={'v00':4,'v02':6}.get(tag,8)
    while len(MS)<N:
        w=[(np.where(M.any(0))[0]) for M in MS];i=max(range(len(MS)),key=lambda q:w[q][-1]-w[q][0])
        M=MS[i];xs=w[i];x0,x1=xs[0],xs[-1];cs=M.sum(0).astype(float);a0=x0+(x1-x0)//4;a1=x1-(x1-x0)//4
        cut=a0+int(np.argmin(cs[a0:a1]));L=M.copy();L[:,cut:]=0;R=M.copy();R[:,:cut]=0
        MS[i:i+1]=[L,R]
    print(tag,len(MS))
    for n,mm in enumerate(MS):
        ys,xs=np.where(mm);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        A=(al*mm)[y0:y1,x0:x1];c=rgb[y0:y1,x0:x1]
        Image.fromarray(np.dstack([c,A*255]).clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{tag}_{n}.png')
        np.save(f'cut/{tag}_{n}.y.npy',np.array([y0,y1,x0,x1]))
for f in sorted(glob.glob('sh/*.png')):run(f,os.path.basename(f)[:3])
