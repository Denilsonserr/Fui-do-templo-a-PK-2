import numpy as np
from scipy import ndimage as nd
def layers(rgba,hair=True):
    """rgba HxWx4 (alpha 0..1). Rabo = parte fina atrás das costas; cabelo = topo."""
    rgb,al=rgba[...,:3],rgba[...,3];h,w=al.shape;R,G,B=rgb[...,0],rgb[...,1],rgb[...,2]
    solid=al>0.05;ys,xs=np.where(solid);top=ys.min();bot=ys.max();hh=bot-top
    r=max(4,int(hh*0.05))
    core=nd.binary_opening(solid,structure=np.ones((3,3)),iterations=r)
    lab,k=nd.label(core)
    if k:
        sz=nd.sum(core,lab,range(1,k+1));core=lab==(int(np.argmax(sz))+1)
    core=nd.binary_dilation(core,iterations=max(2,r//3))&solid
    be=np.full(h,w,float)
    for y in range(h):
        q=np.where(core[y])[0]
        if len(q):be[y]=q.min()
    be=nd.median_filter(be,size=max(5,int(h*0.04)))
    X=np.arange(w)[None,:]
    cand=solid&~core&(X<be[:,None]+2)
    cand[:int(top+hh*.22)]=False;cand[int(top+hh*.88):]=False
    lab,k=nd.label(cand);tail=np.zeros_like(solid)
    lum=R*.3+G*.55+B*.15
    tl=(lum<80)|((B>R+30)&(B>80))
    skin=(R>160)&(G>100)&(B>55)&(R>G)&(G>B)
    for i in range(1,k+1):
        m=lab==i;n=m.sum()
        if n<hh*hh*0.004:continue
        if (tl&m).sum()<n*0.55 or (skin&m).sum()>n*0.08:continue
        yy,xx=np.where(m)
        if yy.mean()>top+hh*0.75:continue
        tail|=m
    tail=nd.binary_dilation(tail,iterations=1)&solid&~nd.binary_erosion(core,iterations=1)
    # ponto de fixação do rabo: pixel do rabo mais próximo do corpo (maior x)
    anchor=None
    if tail.any():
        yy,xx=np.where(tail);j=np.argmax(xx);anchor=(float(xx[j]),float(yy[j]))
    hm=np.zeros_like(solid);root=None
    if hair:
        root=int(top+hh*0.17);hm[:root]=solid[:root];hm&=~tail
    return tail,hm,dict(top=int(top),root=root,anchor=anchor)
