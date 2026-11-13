# v394: recorte das folhas do SHAKA DIVINO (folhas/dNN_*.png, grades diferentes) -> cut/<tag>_<n>.png + .y.npy [y0,y1,x0,x1,chao_da_linha]
# fundo: branco/xadrez claro (usa o alpha() do seg_sk.py) ou transparência de verdade (d07)
import numpy as np,os,sys,glob
from PIL import Image
from scipy import ndimage as nd
H=os.path.dirname(os.path.abspath(__file__))
src=open(os.path.join(H,'..','seg_sk.py'),encoding='utf8').read();src=src[:src.index("COMP={")]
src=src.replace("SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)),'poses');os.makedirs('cut',exist_ok=True)","")
exec(src)
GRID={'d01':(2,3),'d02':(2,3),'d03':(4,4),'d04':(2,3),'d05':(2,3),'d06':(2,8),'d07':(3,6),'d08':(2,3),'d09':(2,3),'d10':(2,8),'d11':(2,4),'d12':(2,4),'d13':(2,4)}
os.makedirs('cut',exist_ok=True)
def valley(prof,c,w):
    sm=nd.uniform_filter1d(prof.astype(float),9);x0=max(0,int(c-w));x1=min(len(prof),int(c+w));return x0+int(np.argmin(sm[x0:x1]))
for p in sorted(glob.glob(H+'/folhas/d*.png')):
    tag=os.path.basename(p)[:3]
    if len(sys.argv)>1 and tag not in sys.argv[1:]:continue
    im=Image.open(p)
    if im.mode=='RGBA' and (np.asarray(im)[...,3]<10).mean()<.05:im.convert('RGB').save('/tmp/_skv.png');p2='/tmp/_skv.png'
    else:p2=p
    A=alpha(p2);Hh,W=A.shape[:2];al=A[...,3];R,C=GRID[tag]
    rows=[0]+[valley((al>40).sum(1),Hh*r/R,Hh/(R*3.2)) for r in range(1,R)]+[Hh]
    n=0
    for r in range(R):
        Y0,Y1=rows[r],rows[r+1];band=al[Y0:Y1]
        cols=[0]+[valley((band>40).sum(0),W*c/C,W/(C*3.2)) for c in range(1,C)]+[W]
        cells=[]
        for c in range(C):
            X0,X1=cols[c],cols[c+1];S=A[Y0:Y1,X0:X1].copy();m=S[...,3]>12
            lb,kk=nd.label(nd.binary_dilation(m,iterations=3))
            if kk==0:print('VAZIO',tag,n);n+=1;continue
            sz=nd.sum(m,lb,range(1,kk+1));keep=[i+1 for i in range(kk) if sz[i]>=max(120,sz.max()*.03)]
            M=np.isin(lb,keep)&m;S[...,3]*=M;ys,xs=np.where(S[...,3]>12)
            cells.append((n,S,ys.min(),ys.max()+1,xs.min(),xs.max()+1,Y0,X0));n+=1
        gl=max(c[3] for c in cells)+0   # chão da linha (pés mais baixos)
        for (k,S,y0,y1,x0,x1,Y0,X0) in cells:
            Image.fromarray(S[y0:y1,x0:x1].clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{tag}_{k}.png');np.save(f'cut/{tag}_{k}.y.npy',np.array([y0,y1,X0+x0,X0+x1,gl]))
    print(tag,n,rows,flush=True)
