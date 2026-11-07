# Recorte das folhas do Naruto (normal nNN, Kurama kNN). Fundos: transparente, preto, cinza, fumaça. Combos de 2 linhas = grade 8x2.
import numpy as np,glob,os,sys
from PIL import Image
from scipy import ndimage as nd
from skimage.segmentation import watershed
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/personagens')
from seg_gogeta_fundo import mask_of as mask_go
SRC={**{f'n{i:02d}':f'/home/claude/novo_nr/sh/n{i:02d}.png' for i in range(1,17)},'n17':'/home/claude/novo_nr/sh/n17_combo.png','n18':'/home/claude/novo_nr/sh/n18_clones.png',
     **{f'k{i:02d}':f'/home/claude/novo_nr/k/k{i:02d}.png' for i in range(1,18)},'k18':'/home/claude/novo_nr/k/k18_combo2.png'}
NF={'n09':8,'n11':8,'n12':8,'n13':8,'n14':8,'n15':4,'k01':4,'k02':4,'k03':4,'k09':4,'k11':4,'k12':4,'k13':5,'k14':4,'k15':4,'k16':4}
GRID={'n17','n18','k17','k18'}
def mask(t,p):
    im=Image.open(p);a=np.asarray(im.convert('RGBA')).astype(np.float32);rgb=a[...,:3];al=a[...,3]
    mx=rgb.max(2);mn=rgb.min(2);sat=(mx-mn)/np.maximum(mx,1);lum=rgb.mean(2)
    if t in('k05','k14'):
        body=(al>170)&((sat>.3)|(lum<70))
        body=nd.binary_closing(body,iterations=2);body=nd.binary_fill_holes(body)
        lab,k=nd.label(body);sz=nd.sum(body,lab,range(1,k+1));body=np.isin(lab,[i+1 for i in range(k) if sz[i]>300])
        A=nd.gaussian_filter(body.astype(np.float32),.7)*(al/255.);return rgb,np.clip(A,0,1)
    if im.mode=='RGBA' and (al<10).mean()>.3:return mask_go(p)
    bg=np.median(np.concatenate([rgb[:6].reshape(-1,3),rgb[-6:].reshape(-1,3),rgb[:,:6].reshape(-1,3),rgb[:,-6:].reshape(-1,3)]),0)
    if bg.mean()<25:
        r,A=mask_go(p);return r,A
    d=np.sqrt(((rgb-bg)**2).sum(2));near=d<22;lab,_=nd.label(near);edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bgm=np.isin(lab,list(edge));fg=~bgm;fg=nd.binary_opening(fg,iterations=1)
    A=np.where(fg,np.clip((d-10)/40,0,1),0);A=np.maximum(A,nd.binary_erosion(fg,iterations=2));A=nd.gaussian_filter(A,.6)*fg
    o=np.clip((rgb-(1-A[...,None])*bg)/np.maximum(A[...,None],.05),0,255)
    return o,np.clip(A,0,1)
def save(tag,n,rgb,al,M):
    M=M&(al>.03);ys,xs=np.where(M);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    A=(al*M)[y0:y1,x0:x1];c=rgb[y0:y1,x0:x1]
    Image.fromarray(np.dstack([c,A*255]).clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{tag}_{n}.png')
    np.save(f'cut/{tag}_{n}.y.npy',np.array([y0,y1,x0,x1]))
def run(tag):
    rgb,al=mask(tag,SRC[tag]);H,W=al.shape
    if tag=='k13':al[:,1795:1825]=0
    if tag=='k18':
        rs0=nd.uniform_filter1d((al>.06).sum(1).astype(float),9);ym0=int(H*.35)+int(np.argmin(rs0[int(H*.35):int(H*.65)]))
        for ya0 in (0,ym0):
            for c in range(8):x=int(W*c/8);al[ya0:ya0+58,max(0,x-4):x+80]=0
    m=al>.06
    if tag in GRID:
        # linhas: separa pela faixa mais vazia perto do meio
        rs=nd.uniform_filter1d(m.sum(1).astype(float),9);lo,hi=int(H*.35),int(H*.65);ym=lo+int(np.argmin(rs[lo:hi]))
        n=0
        for r,(ya,yb) in enumerate([(0,ym),(ym,H)]):
            band=m[ya:yb];cs=nd.uniform_filter1d(band.sum(0).astype(float),15);cuts=[0]
            for c in range(1,8):
                x=int(W*c/8);w=int(W/16*.6);cuts.append(x-w+int(np.argmin(cs[x-w:x+w])))
            cuts.append(W)
            for c in range(8):
                M=np.zeros_like(m);M[ya:yb,cuts[c]:cuts[c+1]]=m[ya:yb,cuts[c]:cuts[c+1]]
                lab,k=nd.label(nd.binary_dilation(M,iterations=2));sz=nd.sum(M,lab,range(1,k+1))
                if tag=='k18':  # tira o numero do canto
                    for i,sl in enumerate(nd.find_objects(lab)):
                        if sl[0].stop-ya<int((yb-ya)*.2) and sz[i]<5000:M[lab==i+1]=0
                    lab,k=nd.label(nd.binary_dilation(M,iterations=2));sz=nd.sum(M,lab,range(1,k+1))
                objs=nd.find_objects(lab);keep=[]
                for i in range(k):
                    if sz[i]<=max(150,sz.max()*.02):continue
                    if sz[i]<sz.max()*.15 and (objs[i][1].start<=cuts[c]+3 or objs[i][1].stop>=cuts[c+1]-3) and c not in(0,):  # pedaço do quadro vizinho
                        cx=(objs[i][1].start+objs[i][1].stop)/2
                        if cx<cuts[c]+40:continue
                    keep.append(i+1)
                M&=np.isin(lab,keep)
                save(tag,n,rgb,al,M);n+=1
        print(tag,n,end=' ',flush=True);return
    N=NF.get(tag,6)
    er=nd.binary_erosion(al>.5,iterations=7);lab,k=nd.label(er);sz=nd.sum(er,lab,range(1,k+1));big=sz.max()
    seeds=[lab==i+1 for i in range(k) if sz[i]>big*.08]
    while len(seeds)>N:
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
    cxs=[np.where(own==n+1)[1].mean() for n in range(N)]
    l3,k3=nd.label(m&(own==0))
    for i,s in enumerate(nd.find_objects(l3)):
        P=l3[s]==i+1;x=(s[1].start+s[1].stop)/2;n=int(np.argmin([abs(x-c) for c in cxs]));own[s][P]=n+1
    for n in range(N):save(tag,n,rgb,al,own==n+1)
    print(tag,N,end=' ',flush=True)
if __name__=='__main__':
    for t in SRC:
        if len(sys.argv)>1 and t not in sys.argv[1:]:continue
        run(t)
    print()
