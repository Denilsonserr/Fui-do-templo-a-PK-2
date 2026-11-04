import numpy as np,glob,os,sys
from PIL import Image
from scipy import ndimage as nd
def disk(r):
    y,x=np.ogrid[-r:r+1,-r:r+1];return x*x+y*y<=r*r
def mask_of(path):
    im=Image.open(path)
    if im.mode=='RGBA':
        a=np.asarray(im).astype(np.float32);rgb,al=a[...,:3],a[...,3]
        solid=al>200;solid=nd.binary_opening(solid,iterations=1)
        keep=nd.binary_dilation(solid,iterations=3)&(al>30)
        return rgb,np.where(keep,al,0)/255.
    a=np.asarray(im.convert('RGB')).astype(np.float32);s=a.sum(2)
    fg0=s>45
    fg1=nd.binary_closing(np.pad(fg0,12),structure=disk(6))[12:-12,12:-12]|fg0
    # holes: fill only if they are not background-like
    holes=nd.binary_fill_holes(fg1)&~fg1;lab,k=nd.label(holes)
    if k:
        dark=nd.mean((s<=8).astype(float),lab,range(1,k+1));sz=nd.sum(holes,lab,range(1,k+1))
        sat=a.max(2)-a.min(2);hairpx=(s<330)&(sat<70)
        fill=[]
        for i in range(k):
            H=lab==i+1;ring=nd.binary_dilation(H,iterations=4)&~H&fg1
            hf=hairpx[ring].mean() if ring.any() else 0
            if dark[i]<.55 or sz[i]<60 or hf>.6:fill.append(i+1)
        fg1|=np.isin(lab,fill)
    lab,k=nd.label(fg1);sz=nd.sum(fg1,lab,range(1,k+1));fg1=np.isin(lab,[i+1 for i in range(k) if sz[i]>400])
    fg=fg1|(nd.binary_dilation(fg1,iterations=2)&(s>12))
    al=nd.gaussian_filter(fg.astype(np.float32),.7)*fg
    return a,np.clip(al*1.15,0,1)
