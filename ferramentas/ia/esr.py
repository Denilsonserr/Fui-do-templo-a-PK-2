"""Real-ESRGAN realesr-animevideov3 (SRVGGNetCompact) em numpy, pesos lidos do .bin do ncnn."""
import numpy as np, re, os
from PIL import Image
from numpy.lib.stride_tricks import sliding_window_view
D=os.path.dirname(os.path.abspath(__file__))+'/re/models/'
def load(name='realesr-animevideov3-x4'):
    P=open(D+name+'.param').read().split('\n')[2:]
    B=np.fromfile(D+name+'.bin',dtype=np.uint8);off=0
    def raw(n):
        nonlocal off;a=B[off:off+4*n].view(np.float32).copy();off+=4*n;return a
    L=[]
    for ln in P:
        t=ln.split()
        if not t:continue
        if t[0]=='Convolution':
            kv=dict(x.split('=') for x in t[6:]);oc=int(kv['0']);n=int(kv['6']);ic=n//(oc*9)
            flag=int(B[off:off+4].view(np.uint32)[0]);off+=4
            if flag==0x01306B47:
                w=B[off:off+2*n].view(np.float16).astype(np.float32).copy();off+=(2*n+3)//4*4
            else:
                assert flag==0,flag;w=raw(n)
            w=w.reshape(oc,ic,3,3);b=raw(oc);L.append(('c',w,b))
        elif t[0]=='PReLU':
            kv=dict(x.split('=') for x in t[6:]);L.append(('p',raw(int(kv['0']))))
    assert off==len(B),(off,len(B))
    return [(k,)+tuple(x) for k,*x in L]
NET=None
def conv(x,w,b):  # x HxWxC
    H,W,C=x.shape;xp=np.pad(x,((1,1),(1,1),(0,0)),mode='edge')
    win=sliding_window_view(xp,(3,3),axis=(0,1))  # H,W,C,3,3
    oc=w.shape[0];Wm=w.reshape(oc,-1).T  # (C*9, oc) in order C,kh,kw
    out=np.empty((H,W,oc),np.float32);step=max(1,4000000//(W*C*9))
    for y in range(0,H,step):
        blk=win[y:y+step].reshape(-1,C*9);out[y:y+step]=(blk@Wm+b).reshape(-1,W,oc)
    return out
def run(x):
    global NET
    if NET is None:NET=load()
    h=x
    for L in NET:
        if L[0]=='c':h=conv(h,L[1],L[2])
        else:s=L[1];h=np.where(h>0,h,h*s)
    H,W,_=h.shape;r=4
    h=h.reshape(H,W,3,r,r).transpose(0,3,1,4,2).reshape(H*r,W*r,3)
    up=np.repeat(np.repeat(x,r,0),r,1)
    return h+up
def sr_rgb(rgb,scale=2,tile=200,pad=10):
    """rgb uint8/float 0..255 HxWx3 -> upscaled (x4 net, resized to scale) float 0..255"""
    x=rgb.astype(np.float32)/255.;H,W,_=x.shape;out=np.zeros((H*4,W*4,3),np.float32)
    for y0 in range(0,H,tile):
        for x0 in range(0,W,tile):
            y1,x1=min(H,y0+tile),min(W,x0+tile);ya,xa=max(0,y0-pad),max(0,x0-pad);yb,xb=min(H,y1+pad),min(W,x1+pad)
            o=run(x[ya:yb,xa:xb])
            out[(y0)*4:(y1)*4,(x0)*4:(x1)*4]=o[(y0-ya)*4:(y0-ya+y1-y0)*4,(x0-xa)*4:(x0-xa+x1-x0)*4]
    im=Image.fromarray(np.clip(out*255,0,255).astype(np.uint8))
    if scale!=4:im=im.resize((round(W*scale),round(H*scale)),Image.LANCZOS)
    return np.asarray(im)
def sr_rgba(im,scale=2):
    """PIL RGBA -> PIL RGBA upscaled; fills hidden RGB to avoid dark halos"""
    a=np.asarray(im.convert('RGBA')).astype(np.float32);rgb,al=a[...,:3],a[...,3]
    from scipy import ndimage as nd
    m=al>8
    if (~m).any() and m.any():
        idx=nd.distance_transform_edt(~m,return_distances=False,return_indices=True)
        rgb=rgb[idx[0],idx[1]]
    o=sr_rgb(rgb,scale)
    A=Image.fromarray(al.astype(np.uint8)).resize((o.shape[1],o.shape[0]),Image.LANCZOS)
    return Image.fromarray(np.dstack([o,np.asarray(A)]).astype(np.uint8),'RGBA')
