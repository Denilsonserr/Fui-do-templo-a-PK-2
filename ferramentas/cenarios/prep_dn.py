# Cenário com dia/noite e destruição em níveis (genérico). Uso: python3 prep_dn.py <pasta> <saida.json> <horizonte>
# Pasta com L0.png..Ln.png (do inteiro ao mais destruído, mesmo enquadramento) e B0.png..Bn.png (IA, 3000x1000).
# Gera por nível: imagem do cenário, céu da noite e do pôr do sol (pequenos, só no céu), estrelas, fogo desenhado (pisca) e pontos de fagulha.
import numpy as np,hashlib,json,os,sys,glob
from PIL import Image
from scipy import ndimage as nd
D=sys.argv[1];OUTJ=sys.argv[2];HZ=int(sys.argv[3]);FMIN=int(os.environ.get('FMIN','-1'));SKYD=int(os.environ.get('SKYD','200'));SKYL=os.environ.get('SKYL','1')=='1'
OUT='/home/claude/fui-do-templo-a-pk-2/www/a'
def save(im,q=86):
    b=im.tobytes();h=hashlib.md5(b).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=q,alpha_quality=88,method=6)
    return f'a/{h}.webp'
N=len(glob.glob(f'{D}/L*.png'));R={'L':[]}
ld=lambda n:np.asarray(Image.open(f'{D}/L{n}.png').convert('RGB').resize((2172,724),Image.LANCZOS)).astype(float)
A0=ld(0);fA=(A0[...,0]>200)&(A0[...,1]>70)&(A0[...,1]<215)&(A0[...,2]<110)
rng=np.random.default_rng(7)
for n in range(N):
    big=Image.open(f'{D}/B{n}.png').convert('RGB');far=save(big,84)
    o=ld(n);r,g,b=o[...,0],o[...,1],o[...,2];Hh,Ww=r.shape;Y,X=np.mgrid[0:Hh,0:Ww]
    top=np.median(o[:12].reshape(-1,3),0)
    # ceu: parecido com a cor do topo (ou nuvens claras), ligado ao topo, acima do horizonte
    dist=np.sqrt(((o-top)**2).sum(2));lum=o.mean(2)
    cand=((dist<SKYD)|(SKYL&(lum>170)&(Y<HZ-40)))&(Y<HZ)
    cand=nd.binary_opening(cand,iterations=2);lab,_=nd.label(cand);edge=set(np.unique(lab[0]))-{0}
    sky=np.isin(lab,list(edge));sky=nd.binary_closing(sky,iterations=3)&(Y<HZ)
    hol=nd.binary_fill_holes(sky)&~sky;lh,kh=nd.label(hol);szh=nd.sum(hol,lh,range(1,kh+1));sky|=np.isin(lh,[i+1 for i in range(kh) if szh[i]<14000])
    sm=nd.gaussian_filter(sky.astype(float),2.5);v=np.clip(Y/HZ,0,1)
    skyN=np.dstack([8+26*v,12+30*v,38+52*v,sm*235]).astype(np.uint8)
    skyS=np.dstack([np.full_like(r,255),80+100*v,110-50*v,sm*200]).astype(np.uint8)
    st=np.zeros((Hh,Ww,4),np.uint8);sky_in=nd.binary_erosion(sky,iterations=6)
    for x,y in rng.random((900,2))*[Ww,HZ]:
        x,y=int(x),int(y)
        if sky_in[y,x]:
            s=1 if rng.random()<.8 else 2;st[max(0,y-s+1):y+s,max(0,x-s+1):x+s]=[255,255,240,int(150+rng.random()*105)]
    fire=(r>215)&(g>80)&(g<200)&(b<90)&(Y<HZ+120)&~nd.binary_dilation(fA,iterations=6)&(n>=(FMIN if FMIN>=0 else N-1))
    fire=nd.binary_opening(fire,iterations=1);lab2,k2=nd.label(nd.binary_dilation(fire,iterations=3));sz2=nd.sum(fire,lab2,range(1,k2+1))
    fire&=np.isin(lab2,[i+1 for i in range(k2) if sz2[i]>120]);fI=None;fp=[]
    if fire.sum()>300:
        fa=nd.gaussian_filter(fire.astype(float),1.5);fI=save(Image.fromarray(np.dstack([r,g,b*.6,np.clip(fa*255*1.4,0,255)]).astype(np.uint8),'RGBA'),82)
        ys,xs=np.where(fire);sel=rng.choice(len(xs),min(40,len(xs)),replace=False);fp=[[int(xs[i]),int(ys[i])] for i in sel]
    R['L'].append({'far':far,'win':None,'stars':save(Image.fromarray(st,'RGBA'),90),'skyN':save(Image.fromarray(skyN,'RGBA').resize((543,181),Image.LANCZOS),80),
        'skyS':save(Image.fromarray(skyS,'RGBA').resize((543,181),Image.LANCZOS),80),'fire':fI,'fp':fp})
    print(n,'sky',int(sky.sum()),'fire',int(fire.sum()),flush=True)
    if n==0:R['top']='#%02x%02x%02x'%tuple(top.astype(int))
t=Image.open(f'{D}/L0.png').convert('RGB').resize((2172,724)).crop((506,0,1666,724)).resize((360,225),Image.LANCZOS);R['thumb']=save(t,82)
json.dump(R,open(OUTJ,'w'),indent=1)
