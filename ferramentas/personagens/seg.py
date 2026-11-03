import numpy as np,glob,os
from PIL import Image
from scipy import ndimage as nd
TWO=set()
def run(path,tag):
    a=np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    border=np.concatenate([a[:6].reshape(-1,3),a[-6:].reshape(-1,3),a[:,:6].reshape(-1,3),a[:,-6:].reshape(-1,3)]);bg=np.median(border,0)
    d=np.sqrt(((a-bg)**2).sum(2));near=d<10
    nO=nd.binary_opening(near,iterations=3);lab,_=nd.label(nO);edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg0=np.isin(lab,list(edge));bg0=nd.binary_dilation(bg0,iterations=5,mask=near);fg=~bg0;fg=nd.binary_opening(fg,iterations=1)
    lab,k=nd.label(fg);sl=nd.find_objects(lab);sz=nd.sum(fg,lab,range(1,k+1));big=max(sz)
    B=[(s[1].start,s[0].start,s[1].stop,s[0].stop,i+1) for i,(s,z) in enumerate(zip(sl,sz)) if z>big*0.2]
    if tag in TWO:
        mid=a.shape[0]/2;B=sorted([b for b in B if (b[1]+b[3])/2<mid],key=lambda b:b[0])+sorted([b for b in B if (b[1]+b[3])/2>=mid],key=lambda b:b[0])
    else:B=sorted(B,key=lambda b:b[0])
    print(tag,len(B),bg)
    for i,(x0,y0,x1,y1,lid) in enumerate(B):
        m=4;X0,Y0,X1,Y1=max(0,x0-m),max(0,y0-m),min(a.shape[1],x1+m),min(a.shape[0],y1+m)
        c=a[Y0:Y1,X0:X1];L=lab[Y0:Y1,X0:X1];dd=d[Y0:Y1,X0:X1]
        b0=(L==lid);holes=nd.binary_fill_holes(b0)&~b0;body=b0|holes
        pk=(dd<0)&body;pl,pn=nd.label(pk)
        if pn:
            ps=nd.sum(pk,pl,range(1,pn+1));body&=~nd.binary_dilation(np.isin(pl,[q+1 for q,v in enumerate(ps) if v>1500]),iterations=1)
        e=body&~nd.binary_erosion(body,iterations=2);al=np.where(body,1.,0.);al[e]=np.clip((dd[e]-8)/40,0,1);al=np.clip(nd.gaussian_filter(al,.6)*body,0,1)
        A=al[...,None];rgb=np.clip(np.where(A>.02,(c-(1-A)*bg)/np.maximum(A,.02),0),0,255)
        Image.fromarray(np.dstack([rgb,al*255]).astype(np.uint8),'RGBA').save(f'cut/{tag}_{i}.png')
for f in sorted(glob.glob('sh/*.png')):run(f,os.path.basename(f)[:3])
