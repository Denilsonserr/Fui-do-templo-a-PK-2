# Recorte das folhas do Shaka (v280). Fundo branco; brilho dourado vira semi-transparente. Uso (na pasta de trabalho): python3 seg_sk.py -> cut/<tag>_<i>.png + .y.npy
import numpy as np,os,sys,glob
from PIL import Image
from scipy import ndimage as nd
SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)),'poses');os.makedirs('cut',exist_ok=True)
def border_lab(m):
    lab,k=nd.label(m);b=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0};return np.isin(lab,list(b))
def alpha(p):
    a=np.asarray(Image.open(p).convert('RGB')).astype(float);mn=a.min(2);mx=a.max(2);sat=mx-mn;lum=a.mean(2)
    bgish=(mn>=232)&(sat<=14);bg=border_lab(bgish)
    lab,k=nd.label(bgish&~bg)
    if k:
        sz=nd.sum(np.ones_like(mn),lab,range(1,k+1));mm=nd.mean(mn,lab,range(1,k+1));bg|=np.isin(lab,[i+1 for i in range(k) if sz[i]>400 and mm[i]>=245])
    A=np.clip(np.max((255-a)/255.,axis=-1),0,1)
    core=nd.binary_fill_holes(nd.binary_closing((A>.55)&~bg,iterations=4))   # contorno preto fechado -> rosto/cabelo claro ficam OPACOS
    al=np.where(bg,0.,1.)
    band=nd.binary_dilation(bg,iterations=3)&~bg
    eff=(~bg)&~nd.binary_dilation(core,iterations=3)&(sat>30)
    sel=band|eff
    al[sel]=np.minimum(1,A[sel]*1.35)
    safe=np.maximum(al,1e-3)[...,None];col=np.where(sel[...,None],np.clip((a-(1-al[...,None])*255)/safe,0,255),a)
    return np.dstack([col,al*255])
COMP={'11','13'}
for p in sorted(glob.glob(SRC+'/*.png')):
    tag=os.path.basename(p)[:2]
    if len(sys.argv)>1 and tag not in sys.argv[1:]:continue
    A=alpha(p);H,W=A.shape[:2];al=A[...,3]
    if tag in COMP:
        m=al>12;lb,kk=nd.label(nd.binary_dilation(m,iterations=3));sz=nd.sum(m,lb,range(1,kk+1));cm=nd.center_of_mass(m,lb,range(1,kk+1))
        big=sorted([i for i in range(kk) if sz[i]>sz.max()*.12],key=lambda i:cm[i][1])[:6]
        if len(big)==6:
            own={i:[i] for i in big}
            for i in range(kk):
                if i in big or sz[i]<60:continue
                j=min(big,key=lambda b:abs(cm[b][1]-cm[i][1])+abs(cm[b][0]-cm[i][0]));own[j].append(i)
            for n,b in enumerate(big):
                M=np.isin(lb,[q+1 for q in own[b]])&m;S=A.copy();S[...,3]*=M
                ys,xs=np.where(S[...,3]>12);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
                Image.fromarray(S[y0:y1,x0:x1].clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{tag}_{n}.png');np.save(f'cut/{tag}_{n}.y.npy',np.array([y0,y1,x0,x1]))
            print(tag,'comp');continue
        print(tag,'comp falhou',len(big))
        from skimage.segmentation import watershed
        for it in (6,10,14,18,24):
            er=nd.binary_erosion(al>120,iterations=it);lb2,k2=nd.label(er)
            if k2<6:continue
            sz2=nd.sum(er,lb2,range(1,k2+1));top=sorted(np.argsort(sz2)[::-1][:6],key=lambda i:nd.center_of_mass(er,lb2,i+1)[1])
            if sz2[top].min()<sz2.max()*.08:continue
            mk=np.zeros(al.shape,np.int32)
            for n,i in enumerate(top):mk[lb2==i+1]=n+1
            ws=watershed(-nd.distance_transform_edt(al>12),mk,mask=al>12)
            for n in range(6):
                M=ws==n+1;S=A.copy();S[...,3]*=M
                ys,xs=np.where(S[...,3]>12);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
                Image.fromarray(S[y0:y1,x0:x1].clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{tag}_{n}.png');np.save(f'cut/{tag}_{n}.y.npy',np.array([y0,y1,x0,x1]))
            print(tag,'watershed',it);break
        else:print(tag,'watershed falhou')
        continue
    cols=(al>40).sum(0);sm=nd.uniform_filter1d(cols.astype(float),15)
    # cortes nos vales entre os 6 quadros
    cuts=[0]
    for c in range(1,6):
        x0=int(W*c/6-W/14);x1=int(W*c/6+W/14);cuts.append(x0+int(np.argmin(sm[x0:x1])))
    cuts.append(W)
    for n in range(6):
        X0,X1=cuts[n],cuts[n+1];S=A[:,X0:X1].copy();m=S[...,3]>12
        lb,kk=nd.label(nd.binary_dilation(m,iterations=2));
        if kk==0:print('VAZIO',tag,n);continue
        sz=nd.sum(m,lb,range(1,kk+1));keep=[i+1 for i in range(kk) if sz[i]>=max(80,sz.max()*.02)]
        M=np.isin(lb,keep)&m;S[...,3]*=M
        ys,xs=np.where(S[...,3]>12);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        Image.fromarray(S[y0:y1,x0:x1].clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{tag}_{n}.png');np.save(f'cut/{tag}_{n}.y.npy',np.array([y0,y1,X0+x0,X0+x1]))
    print(tag,cuts,flush=True)
