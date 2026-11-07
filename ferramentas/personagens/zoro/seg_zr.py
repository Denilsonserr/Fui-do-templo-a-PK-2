# Recorte das folhas novas do Zoro (v179). Folha -> linhas -> N colunas iguais. Corpo: watershed com 1 semente por coluna; efeito verde: fica com a coluna onde esta.
import numpy as np,os,sys
from PIL import Image
from scipy import ndimage as nd
from skimage.segmentation import watershed
SH={'z1':('z01_corte1.png',[(0,445),(445,887)],3),'z2':('z02_corte2.png',[(0,450),(450,887)],3),'z3':('z03_investida.png',[(0,490),(490,887)],3),'z4':('z04_alpha.png',[(0,365),(365,725)],10)}
def run(a,tag,N,off,yoff):
    rgb=a[...,:3];al=a[...,3]/255.;m=al>.06;H,W=m.shape;cw=W/N
    g,r,b=rgb[...,1],rgb[...,0],rgb[...,2];eff=(g>r+25)&(g>b+15)
    body=(al>.6)&~eff
    er=nd.binary_erosion(body,iterations=4);lab,k=nd.label(er);sz=nd.sum(er,lab,range(1,k+1));com=nd.center_of_mass(er,lab,range(1,k+1))
    mk=np.zeros(m.shape,np.int32)
    for c in range(N):
        cand=[i for i in range(k) if c*cw<=com[i][1]<(c+1)*cw]
        assert cand,(tag,c)
        i=max(cand,key=lambda q:sz[q]);mk[lab==i+1]=c+1
    lum=rgb.mean(2);cost=nd.gaussian_filter(255-lum,1.0)*(al>.5)+(al<=.5)*300
    ws=watershed(cost,mk,mask=m&~eff)
    col=np.clip((np.arange(W)//cw).astype(int),0,N-1)+1
    grid=np.broadcast_to(col,(H,W))
    own=np.where(ws>0,ws,grid)*m
    # pedaco de corpo (nao-efeito) solto e longe: vai para a coluna dele
    for n in range(N):
        M=own==n+1;ys,xs=np.where(M);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        A=(al*M)[y0:y1,x0:x1];c=rgb[y0:y1,x0:x1]
        Image.fromarray(np.dstack([c,A*255]).clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{tag}_{off+n}.png')
        np.save(f'cut/{tag}_{off+n}.y.npy',np.array([y0+yoff,y1+yoff,x0,x1]))
for tag,(fn,rows,N) in SH.items():
    if len(sys.argv)>1 and tag not in sys.argv[1:]:continue
    A=np.asarray(Image.open(fn).convert('RGBA')).astype(float)
    for ri,(y0,y1) in enumerate(rows):run(A[y0:y1],tag,N,ri*N,y0)
    print(tag,flush=True)
