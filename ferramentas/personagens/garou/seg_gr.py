# Recorte das folhas do Garou (v193). Normal gNN, monstro tNN, combos c01/c02/c03 (2 linhas x 8).
# Fundo: transparente (usa como está), branco (some o que liga na borda + buracos grandes), xadrez cinza (t12).
import numpy as np,os,sys,glob
from PIL import Image
from scipy import ndimage as nd
from skimage.segmentation import watershed
SRC='/home/claude/novo_gr'
SH={f'g{i:02d}':(f'g{i:02d}.png',1,6) for i in range(1,21)}
SH.update({f't{i:02d}':(f't{i:02d}.png',1,6) for i in range(1,17)})
SH.update({'c01':('c01_combo_normal.png',2,8),'c02':('c02_combo_normal_aura.png',2,8),'c03':('c03_combo_transf.png',2,8)})
os.makedirs('cut',exist_ok=True)
def alpha(fn,tag):
    im=Image.open(os.path.join(SRC,fn));a=np.asarray(im.convert('RGBA')).astype(float)
    if (a[...,3]<10).mean()>.3:return a
    a[...,3]=255
    rgb=a[...,:3];mn=rgb.min(2);mx=rgb.max(2);sat=mx-mn;lum=rgb.mean(2)
    if tag=='t12':bgish=(sat<14)&(lum>172)
    elif tag=='g12':bgish=(mn>=218)&(sat<=32)
    else:bgish=(mn>=232)&(sat<=12)
    lab,k=nd.label(bgish);sz=nd.sum(bgish,lab,range(1,k+1))
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    keep=[i+1 for i in range(k) if (i+1 in border) or (tag!='g12' and sz[i]>(2500 if tag[0] not in 'tc' or tag in('c01','c02') else (60 if tag=='t12' else 150)))]
    bg=np.isin(lab,keep)
    al=np.where(bg,0.,1.)
    band=nd.binary_dilation(bg,iterations=3)&~bg
    if tag=='t12':
        al[band]=np.clip((200-lum[band])/90,0,1)
        out=np.dstack([rgb,al*255]);return out
    A=np.clip(np.max((255-rgb)/255.,axis=-1),0,1)
    eff=(sat>45)&(lum>110)          # brilhos azuis/vermelhos que somem no branco
    sel=(band|eff)&~bg
    al[sel]=np.minimum(1,A[sel]*1.2)
    safe=np.maximum(al,1e-3)[...,None]
    col=np.where(sel[...,None],np.clip((rgb-(1-al[...,None])*255)/safe,0,255),rgb)
    return np.dstack([col,al*255])
def rows_of(al,nr):
    if nr==1:return [(0,al.shape[0])]
    rs=nd.uniform_filter1d((al>20).sum(1).astype(float),9);H=al.shape[0];lo,hi=int(H*.35),int(H*.65);ym=lo+int(np.argmin(rs[lo:hi]));return [(0,ym),(ym,H)]
def run(tag):
    fn,nr,N=SH[tag];a=alpha(fn,tag);H,W=a.shape[:2]
    for ri,(y0,y1) in enumerate(rows_of(a[...,3],nr)):
        A=a[y0:y1];rgb=A[...,:3];al=A[...,3]/255.;m=al>.06;cw=W/N
        g,r,b=rgb[...,1],rgb[...,0],rgb[...,2];sat=rgb.max(2)-rgb.min(2)
        eff=(sat>60)&(rgb.mean(2)>120)&(al<.95)
        body=(al>.6)&~eff
        er=nd.binary_erosion(body,iterations=4);lab,k=nd.label(er);sz=nd.sum(er,lab,range(1,k+1));com=nd.center_of_mass(er,lab,range(1,k+1))
        mk=np.zeros(m.shape,np.int32)
        for c in range(N):
            cand=[i for i in range(k) if c*cw<=com[i][1]<(c+1)*cw]
            if not cand:
                S=np.zeros_like(m);S[:, int((c+.4)*cw):int((c+.6)*cw)]=True;S&=body
                if not S.any():print('VAZIO',tag,ri,c);continue
                mk[S]=c+1;continue
            i=max(cand,key=lambda q:sz[q]);mk[lab==i+1]=c+1
        lum=rgb.mean(2);cost=nd.gaussian_filter(255-lum,1.0)*(al>.5)+(al<=.5)*300
        ws=watershed(cost,mk,mask=m)
        col=np.clip((np.arange(W)//cw).astype(int),0,N-1)+1
        own=np.where(ws>0,ws,np.broadcast_to(col,(y1-y0,W)))*m
        for n in range(N):
            M=own==n+1
            lb,kk=nd.label(M);
            if kk==0:print('SEM',tag,n);continue
            szs=nd.sum(M,lb,range(1,kk+1));M=np.isin(lb,[i+1 for i in range(kk) if szs[i]>=max(60,szs.max()*.01)])
            ys,xs=np.where(M);Y0,Y1,X0,X1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
            o=np.dstack([rgb[Y0:Y1,X0:X1],(al*M)[Y0:Y1,X0:X1]*255]).clip(0,255).astype(np.uint8)
            idx=ri*N+n;Image.fromarray(o,'RGBA').save(f'cut/{tag}_{idx}.png');np.save(f'cut/{tag}_{idx}.y.npy',np.array([Y0+y0,Y1+y0,X0,X1]))
    print(tag,end=' ',flush=True)
for t in SH:
    if len(sys.argv)>1 and t not in sys.argv[1:]:continue
    run(t)
print()
