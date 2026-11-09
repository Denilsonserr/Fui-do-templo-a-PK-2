# v245: recorta as molduras do dono -> www/a/*.webp e molduras.json (src + buraco da foto em fração)
import numpy as np,json,hashlib,io,os
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__));W='/home/claude/fui-do-templo-a-pk-2/www/'
def save(a):
    m=a[...,3]>25;lab,k=nd.label(nd.binary_dilation(m,iterations=4))
    if k>1:
        sz=nd.sum(m,lab,range(1,k+1));keep=np.isin(lab,[i+1 for i in range(k) if sz[i]>=sz.max()*.08]);a=a.copy();a[~keep,3]=0
    im=Image.fromarray(a.clip(0,255).astype(np.uint8),'RGBA');bb=im.getbbox();im=im.crop(bb)
    k=420/max(im.size);im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
    b=io.BytesIO();im.save(b,'WEBP',quality=90,alpha_quality=92);d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(W+n,'wb').write(d);return n,bb
def hole(mask,bb):
    ys,xs=np.where(mask);x0,y0,x1,y1=bb;w,h=x1-x0,y1-y0
    return [round((xs.min()-x0)/w,3),round((ys.min()-y0)/h,3),round((xs.max()-x0)/w,3),round((ys.max()-y0)/h,3)]
def center_flood(cand):
    lab,_=nd.label(cand);H,Wd=cand.shape;c=lab[H//2,Wd//2]
    if c==0:
        win=lab[H//2-40:H//2+40,Wd//2-40:Wd//2+40];v=np.bincount(win[win>0].ravel());c=int(np.argmax(v)) if len(v)>1 else 0
    return lab==c if c else np.zeros_like(cand)
OUT={}
# ADM (já transparente)
a=np.asarray(Image.open(D+'/adm.png').convert('RGBA')).astype(float)
inn=center_flood(a[...,3]<40);a[inn,3]=0;n,bb=save(a);OUT['adm']={'src':n,'h':hole(inn,bb)}
# ranks (fundo preto) 2x4
R=np.asarray(Image.open(D+'/ranks.png').convert('RGB')).astype(float);H,Wd=R.shape[:2]
for i in range(8):
    r,c=divmod(i,4);t=R[r*H//2:(r+1)*H//2,c*Wd//4:(c+1)*Wd//4].copy();t[-(18 if r==0 else 1):]=0;mx=t.max(2)
    dark=mx<22;lab,_=nd.label(dark);bd=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg=np.isin(lab,list(bd));inn=center_flood(dark&~bg);bgall=bg|inn
    near=nd.binary_dilation(bgall,iterations=22)&~bgall
    al=np.where(bgall,0.,255.);dim=near&(mx<110);al[dim]=np.clip(mx[dim]/110*255,0,255)
    safe=np.maximum(al/255,1e-3)[...,None];col=np.where(dim[...,None],np.clip(t/safe,0,255),t)
    n,bb=save(np.dstack([col,al]));OUT['rk'+str(i)]={'src':n,'h':hole(inn,bb)}
# eventos 2x3 (fundo já transparente, miolo branco semi-transparente)
E=np.asarray(Image.open(D+'/eventos.png').convert('RGBA')).astype(float);H,Wd=E.shape[:2]
for i,k in enumerate(['yt100','br100','top1','top2','top3','ytob']):
    r,c=divmod(i,3);t=E[r*H//2:(r+1)*H//2,c*Wd//3:(c+1)*Wd//3].copy();rgb=t[...,:3];mn=rgb.min(2);sat=rgb.max(2)-mn
    cand=(mn>150)&(sat<55)|(t[...,3]<130)&(sat<70);inn=center_flood(cand);inn=nd.binary_closing(inn,iterations=3);inn=nd.binary_fill_holes(inn)
    edge=nd.binary_dilation(inn,iterations=3)&~inn;t[inn,3]=0;t[edge,3]*=.5
    n,bb=save(t);OUT[k]={'src':n,'h':hole(inn,bb)}
json.dump(OUT,open(D+'/molduras.json','w'));print(json.dumps({k:v['h'] for k,v in OUT.items()}))
