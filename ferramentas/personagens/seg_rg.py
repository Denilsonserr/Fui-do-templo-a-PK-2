# Recorte das folhas do Rengoku (fundo transparente). Uso: python3 seg_rg.py [rNN ...]
import numpy as np,glob,os,sys
from PIL import Image
from scipy import ndimage as nd
from skimage.segmentation import watershed
NF={'r14':12,'r18':16}
def run(path,tag,N):
    a=np.asarray(Image.open(path).convert('RGBA')).astype(float);rgb=a[...,:3];al=a[...,3]/255.;m=al>.06
    er=nd.binary_erosion(al>.5,iterations=7);lab,k=nd.label(er);sz=nd.sum(er,lab,range(1,k+1));big=sz.max()
    seeds=[lab==i+1 for i in range(k) if sz[i]>big*.10]
    while len(seeds)>N:  # junta sementes muito proximas (mesma pose partida)
        cx=[np.where(S.any(0))[0].mean() for S in seeds];o=np.argsort(cx);d=[cx[o[i+1]]-cx[o[i]] for i in range(len(o)-1)];i=int(np.argmin(d))
        seeds[o[i]]=seeds[o[i]]|seeds[o[i+1]];del seeds[o[i+1]]
    while len(seeds)<N:
        w=[np.where(S.any(0))[0] for S in seeds];i=max(range(len(seeds)),key=lambda q:w[q][-1]-w[q][0])
        S=seeds[i];x0,x1=w[i][0],w[i][-1];cs=S.sum(0).astype(float);a0=x0+(x1-x0)//4;a1=x1-(x1-x0)//4
        cut=a0+int(np.argmin(cs[a0:a1]));L=S.copy();L[:,cut-6:]=0;R=S.copy();R[:,:cut+6]=0;seeds[i:i+1]=[L,R]
    seeds.sort(key=lambda S:np.where(S.any(0))[0].mean())
    mk=np.zeros(m.shape,np.int32)
    for n,S in enumerate(seeds):mk[nd.binary_erosion(S,iterations=4)]=n+1
    lum=rgb.mean(2);cost=nd.gaussian_filter(255-lum,1.0)*(al>.5)+(al<=.5)*300
    own=watershed(cost,mk,mask=m)
    # pedacos soltos (fagulhas): vao para a pose mais perto em x
    cxs=[np.where(own==n+1)[1].mean() for n in range(N)]
    l3,k3=nd.label(m&(own==0))
    for i,s in enumerate(nd.find_objects(l3)):
        P=l3[s]==i+1;x=(s[1].start+s[1].stop)/2;n=int(np.argmin([abs(x-c) for c in cxs]));own[s][P]=n+1
    print(tag,len(seeds),end=' ',flush=True)
    for n in range(N):
        M=own==n+1;ys,xs=np.where(M);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        A=(al*M)[y0:y1,x0:x1];c=rgb[y0:y1,x0:x1]
        Image.fromarray(np.dstack([c,A*255]).clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{tag}_{n}.png')
        np.save(f'cut/{tag}_{n}.y.npy',np.array([y0,y1,x0,x1]))
if __name__=='__main__':
    for f in sorted(glob.glob('sh/*.png')):
        t=os.path.basename(f)[:3]
        if len(sys.argv)>1 and t not in sys.argv[1:]:continue
        run(f,t,NF.get(t,6))
    print()
