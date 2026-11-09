# v250: recorta poções de cura/drop, anéis de drop, emblemas dos ranks 8-10 e molduras rk8-rk10 -> www/a/*.webp + saida.json
import numpy as np,json,hashlib,io,os
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__));W=os.path.join(D,'..','..','..','www')+'/'
def webp(im,q=88):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,alpha_quality=92);d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(W+n,'wb').write(d);return n
def fit(im,m):
    k=m/max(im.size);return im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
OUT={}
BB=[]
def grid(f,key,rgb):
    im=Image.open(D+'/'+f).convert('RGBA');a=np.asarray(im);H,Wd=a.shape[:2];L=[]
    for i in range(6):
        r,c=divmod(i,3);x0,y0=c*Wd//3,r*H//2;t=a[y0:y0+H//2,x0:x0+Wd//3]
        m=(t[...,:3].max(2)>45) if rgb else (t[...,3]>200)
        m=nd.binary_opening(m,iterations=2);lab,k=nd.label(m);sz=nd.sum(m,lab,range(1,k+1));ys,xs=np.where(lab==1+int(np.argmax(sz)))
        bb=(x0+xs.min(),y0+ys.min(),x0+xs.max()+1,y0+ys.max()+1)
        if rgb: bb=BB[i]  # poções de drop: fundo preto sem transparência, usa o mesmo quadro das poções de cura
        elif key=='pcu': BB.append(bb)
        L.append(webp(fit(im.crop(bb),240)))
    OUT[key]=L
grid('pocoes_cura.png','pcu',0);grid('pocoes_drop.png','pdr',1);grid('aneis_drop.png','anel',0)
OUT['rank']=[]
for f in ['rank8_divindade_suprema.png','rank9_divindade_celestial.png','rank10_deus_celestial.png']:
    im=Image.open(D+'/'+f).convert('RGBA');a=np.array(im);a[a[...,3]<20,3]=0;im=Image.fromarray(a);im=im.crop(im.getbbox());OUT['rank'].append(webp(fit(im,420)))
def center_flood(cand):
    lab,_=nd.label(cand);H,Wd=cand.shape;c=lab[H//2,Wd//2]
    if c==0:
        win=lab[H//2-40:H//2+40,Wd//2-40:Wd//2+40];v=np.bincount(win[win>0].ravel());c=int(np.argmax(v)) if len(v)>1 else 0
    return lab==c if c else np.zeros_like(cand)
def save_frame(a,inn):
    im=Image.fromarray(a.clip(0,255).astype(np.uint8),'RGBA');bb=im.getbbox();im=im.crop(bb);x0,y0,x1,y1=bb;w,h=x1-x0,y1-y0
    ys,xs=np.where(inn);hole=[round((xs.min()-x0)/w,3),round((ys.min()-y0)/h,3),round((xs.max()-x0)/w,3),round((ys.max()-y0)/h,3)]
    im=fit(im,420);return {'src':webp(im,90),'h':hole,'ar':round(im.width/im.height,4)}
OUT['mold']={}
for k,f in [('rk8','moldura_rk8.png'),('rk10','moldura_rk10.png')]:
    a=np.asarray(Image.open(D+'/'+f).convert('RGBA')).astype(float);inn=center_flood(a[...,3]<40);a[inn,3]=0;OUT['mold'][k]=save_frame(a,inn)
# rk9: fundo preto (sem transparência)
t=np.asarray(Image.open(D+'/moldura_rk9.png').convert('RGB')).astype(float);mx=t.max(2);dark=mx<22
lab,_=nd.label(dark);bd=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0};bg=np.isin(lab,list(bd));inn=center_flood(dark&~bg);bgall=bg|inn
near=nd.binary_dilation(bgall,iterations=22)&~bgall;al=np.where(bgall,0.,255.);dim=near&(mx<110);al[dim]=np.clip(mx[dim]/110*255,0,255)
safe=np.maximum(al/255,1e-3)[...,None];col=np.where(dim[...,None],np.clip(t/safe,0,255),t);OUT['mold']['rk9']=save_frame(np.dstack([col,al]),inn)
json.dump(OUT,open(D+'/saida.json','w'),indent=0);print(json.dumps(OUT)[:2000])
