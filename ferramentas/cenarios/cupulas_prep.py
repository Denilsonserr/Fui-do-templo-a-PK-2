# Cenário "Cidade das Cúpulas": camadas (longe = imagem inteira; chão = parte de baixo), 3 níveis de destruição (A,B,C), estrelas, janelas acesas, fogo piscando.
import numpy as np,hashlib,json,os
from PIL import Image,ImageFilter
from scipy import ndimage as nd
OUT='/home/claude/fui-do-templo-a-pk-2/www/a'
def save(im,q=86):
    b=im.tobytes();h=hashlib.md5(b).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=q,alpha_quality=88,method=6)
    return f'a/{h}.webp'
F0,F1=552,586   # comeco do chao (linha da imagem original) e fim do degrade
R={'L':[]}
for n in ['A','B','C']:
    big=Image.open(n+'2.png').convert('RGB');W,H=big.size;s=W/2172
    far=save(big.resize((3000,1000),Image.LANCZOS).convert('RGB'),84)
    fl=np.asarray(big.convert('RGBA')).copy();y0=int(F0*s);y1=int(F1*s)
    fl=fl[y0:].copy();a=np.ones(fl.shape[0]);a[:y1-y0]=np.linspace(0,1,y1-y0);fl[...,3]=(a[:,None]*255).astype(np.uint8)
    floor=None
    o=np.asarray(Image.open(n+'.png').convert('RGB')).astype(float);r,g,b=o[...,0],o[...,1],o[...,2];Hh,Ww=r.shape
    Y,X=np.mgrid[0:Hh,0:Ww]
    # janelas (vidro azul/ciano dos predios) -> luz amarela a noite (so parte das janelas)
    glass=(r<150)&(g>110)&(b>g-12)&((b-g)<45)&(b>r+55)&(Y>40)&(Y<545)
    sky=(b>150)&(b>r+70)&(b>g+25)&(Y<520)
    lab,k=nd.label(sky);edge=set(np.unique(lab[0]))-{0}
    skyc=np.isin(lab,list(edge))   # ceu ligado ao topo
    glass&=~nd.binary_dilation(skyc,iterations=3)
    rng=np.random.default_rng(7);glass=nd.binary_opening(glass,iterations=1);lw,kw=nd.label(glass);on=np.concatenate([[False],rng.random(kw)<.6])
    win=on[lw]&glass;wa=nd.gaussian_filter(win.astype(float),1.2)
    wl=np.dstack([np.full_like(r,255),np.full_like(r,214),np.full_like(r,130),np.clip(wa*255*1.6,0,255)]).astype(np.uint8)
    winI=save(Image.fromarray(wl,'RGBA'),80)
    # estrelas so no ceu azul
    st=np.zeros((Hh,Ww,4),np.uint8);pts=rng.random((900,2))*[Ww,520]
    for x,y in pts:
        x,y=int(x),int(y)
        if skyc[y,x]:
            sz=1 if rng.random()<.8 else 2;v=int(150+rng.random()*105);st[max(0,y-sz+1):y+sz,max(0,x-sz+1):x+sz]=[255,255,240,v]
    skyall=skyc|(sky&((b-g)>70)&(r<90));sm=nd.gaussian_filter(skyall.astype(float),2)
    v=np.clip(Y/520,0,1);skyI=np.dstack([8+30*v,12+36*v,40+60*v,sm*235]).astype(np.uint8)  # ceu de noite (azul escuro)
    stI=save(Image.fromarray(st,'RGBA'),90);skyN=save(Image.fromarray(skyI,'RGBA').resize((543,181),Image.LANCZOS),80)
    sunI=np.dstack([np.full_like(r,255),80+100*v,110-50*v,sm*200]).astype(np.uint8);skyS=save(Image.fromarray(sunI,'RGBA').resize((543,181),Image.LANCZOS),80)
    # fogo desenhado (cenario destruido) -> camada que pisca
    fire=(r>215)&(g>80)&(g<200)&(b<90)&(Y<560)
    a0=np.asarray(Image.open('A.png').convert('RGB')).astype(float);fA=(a0[...,0]>200)&(a0[...,1]>70)&(a0[...,1]<215)&(a0[...,2]<110)
    fire&=~nd.binary_dilation(fA,iterations=6);fire=nd.binary_opening(fire,iterations=1)
    lab2,k2=nd.label(nd.binary_dilation(fire,iterations=3));sz2=nd.sum(fire,lab2,range(1,k2+1));fire&=np.isin(lab2,[i+1 for i in range(k2) if sz2[i]>120])
    fa=nd.gaussian_filter(fire.astype(float),1.5);fI=None;fp=[]
    if fire.sum()>300:
        fl2=np.dstack([r,g,b*.6,np.clip(fa*255*1.4,0,255)]).astype(np.uint8);fI=save(Image.fromarray(fl2,'RGBA'),82)
        ys,xs=np.where(fire);sel=rng.choice(len(xs),min(40,len(xs)),replace=False);fp=[[int(xs[i]),int(ys[i])] for i in sel]
    R['L'].append({'far':far,'floor':floor,'win':winI,'stars':stI,'skyN':skyN,'skyS':skyS,'fire':fI,'fp':fp})
    print(n,'ok',int(win.sum()),int(skyc.sum()),int(fire.sum()),flush=True)
# miniatura
t=Image.open('A.png').convert('RGB').crop((506,0,1666,724)).resize((360,225),Image.LANCZOS);R['thumb']=save(t,82)
R['top']='#%02x%02x%02x'%tuple(np.asarray(Image.open('A.png').convert('RGB'))[:4].reshape(-1,3).mean(0).astype(int));json.dump(R,open('cup.json','w'),indent=1)
