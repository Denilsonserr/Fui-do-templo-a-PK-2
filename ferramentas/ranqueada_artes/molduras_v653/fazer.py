# v653: molduras da foto do perfil dos 5 ranks novos (fundo já transparente) → www/a/*.webp + buraco da foto em fração (mesmo jeito da do ADM no v245)
import numpy as np,json,hashlib,io,os,glob
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__));W=os.path.join(D,'../../../www/')
def save(a):
    m=a[...,3]>25;lab,k=nd.label(nd.binary_dilation(m,iterations=4))
    if k>1:
        sz=nd.sum(m,lab,range(1,k+1));keep=np.isin(lab,[i+1 for i in range(k) if sz[i]>=sz.max()*.08]);a=a.copy();a[~keep,3]=0
    im=Image.fromarray(a.clip(0,255).astype(np.uint8),'RGBA');bb=im.getbbox();im=im.crop(bb)
    k=420/max(im.size);im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
    b=io.BytesIO();im.save(b,'WEBP',quality=90,alpha_quality=92);d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(W+n,'wb').write(d);return n,bb,im.size
def hole(mask,bb):
    ys,xs=np.where(mask);x0,y0,x1,y1=bb;w,h=x1-x0,y1-y0
    return [round((xs.min()-x0)/w,3),round((ys.min()-y0)/h,3),round((xs.max()-x0)/w,3),round((ys.max()-y0)/h,3)]
def center_flood(cand):
    lab,_=nd.label(cand);H,Wd=cand.shape;c=lab[int(H*.42),Wd//2]
    return lab==c if c else np.zeros_like(cand)
OUT={}
for f in sorted(glob.glob(D+'/rk1*.png')):
    k=os.path.basename(f).split('_')[0];a=np.asarray(Image.open(f).convert('RGBA')).astype(float)
    inn=center_flood(nd.binary_opening(a[...,3]<90,iterations=2));inn=nd.binary_fill_holes(nd.binary_closing(inn,iterations=4));a[inn,3]=0
    n,bb,sz=save(a);OUT[k]={'src':n,'h':hole(inn,bb),'ar':round(sz[0]/sz[1],3)};print(k,OUT[k])
json.dump(OUT,open(D+'/molduras.json','w'))
