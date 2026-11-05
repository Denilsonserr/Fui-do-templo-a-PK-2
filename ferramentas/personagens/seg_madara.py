import numpy as np,glob,os,sys
from PIL import Image
from scipy import ndimage as nd
from skimage.segmentation import watershed
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from madara_fundo import mask_of
def run(path,tag,N=8):
    rgb,al=mask_of(path);m=al>.12
    er=nd.binary_erosion(m,iterations=7);lab,k=nd.label(er);sz=nd.sum(er,lab,range(1,k+1));big=sz.max()
    seeds=[lab==i+1 for i in range(k) if sz[i]>big*.10]
    while len(seeds)<N:
        w=[np.where(S.any(0))[0] for S in seeds];i=max(range(len(seeds)),key=lambda q:w[q][-1]-w[q][0])
        S=seeds[i];x0,x1=w[i][0],w[i][-1];cs=S.sum(0).astype(float);a0=x0+(x1-x0)//4;a1=x1-(x1-x0)//4
        cut=a0+int(np.argmin(cs[a0:a1]));L=S.copy();L[:,cut-6:]=0;R=S.copy();R[:,:cut+6]=0;seeds[i:i+1]=[L,R]
    seeds.sort(key=lambda S:np.where(S.any(0))[0].mean())
    mk=np.zeros(m.shape,np.int32)
    for n,S in enumerate(seeds):mk[nd.binary_erosion(S,iterations=4)|(S&~nd.binary_dilation(mk>0,iterations=1))]=n+1
    lum=rgb.mean(2);cost=nd.gaussian_filter(255-lum,1.0)
    own=watershed(cost,mk,mask=m)
    # correcoes pontuais onde as poses se encostam
    H_,W_=m.shape;Y,X=np.mgrid[0:H_,0:W_];r,g,b=rgb[...,0],rgb[...,1],rgb[...,2]
    skin=(r>140)&(r>g+20)&(g>b);nearskin=nd.binary_dilation(skin,iterations=3);hair=(lum<120)&((rgb.max(2)-rgb.min(2))<80)&~nearskin
    teal=(b>r+15)
    FIX={'m02':[(5,4,(X>=1288)&(X<=1385)&(Y>325)&(Y<405)&(lum>10)),(4,5,(X>=1296)&((Y<325)|((Y<348)&(lum<75)))),(6,5,(X>=1595)&(X<=1650)&(Y>255)&(Y<350)&(lum>10))],'g20':[(3,4,(X>=1045)&hair)],'g22':[(1,2,(X>=428)&(Y<350)&hair)],'g13':[(6,5,(X<1706)&(Y>500)&(Y<585)&~teal)]}
    for a_,b_,cond in FIX.get(tag,[]):own[(own==a_+1)&cond]=b_+1
    if tag in('m26','m27'):own[((rgb.max(2)-rgb.min(2))<16)&(lum>55)&(lum<185)&(tag=='m26')]=0
    # 2) pedacos soltos: vao para o vizinho que encostam
    for _ in range(2):
        for n in range(1,len(seeds)+1):
            M=own==n;l2,k2=nd.label(M)
            if k2<2:continue
            z=nd.sum(M,l2,range(1,k2+1));zm=z.max()
            for i in range(k2):
                if z[i]>=zm*.10:continue
                P=l2==i+1;ring=nd.binary_dilation(P,iterations=2)&~P&m;nb=own[ring];nb=nb[(nb!=n)&(nb>0)]
                own[P]=np.bincount(nb).argmax() if len(nb) else 0
    print(tag,len(seeds),end=' ',flush=True)
    for n in range(len(seeds)):
        M=own==n+1;l2,k2=nd.label(M)
        if k2>1:
            z=nd.sum(M,l2,range(1,k2+1));M=np.isin(l2,[i+1 for i in range(k2) if z[i]>=max(150,z.max()*.02)])
        ys,xs=np.where(M);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        A=(al*M)[y0:y1,x0:x1];c=rgb[y0:y1,x0:x1]
        Image.fromarray(np.dstack([c,A*255]).clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{tag}_{n}.png')
        np.save(f'cut/{tag}_{n}.y.npy',np.array([y0,y1,x0,x1]))
if __name__=='__main__':
    for f in sorted(glob.glob('sh/*.png')):
        t=os.path.basename(f)[:3]
        if len(sys.argv)>1 and t not in sys.argv[1:]:continue
        run(f,t)
