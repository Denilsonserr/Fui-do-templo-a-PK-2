# Botões e HUD por personagem a partir das artes do dono (1670x942, tela inteira). Uso: python3 prep_hud.py
import numpy as np,json,hashlib,os,sys
from PIL import Image
from scipy import ndimage as nd
OUT='/home/claude/fui-do-templo-a-pk-2/www/a'
ARTS={'naruto':['naruto/normal.png','naruto/kurama.png'],'rengoku':['rengoku/normal.png','rengoku/trans.png'],'gojo':['gojo/normal.png','gojo/trans.png']}
def save(im,q=88):
    b=im.tobytes();h=hashlib.md5(b).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=q,alpha_quality=92,method=6)
    return f'a/{h}.webp'
def load(p):
    im=Image.open(p).convert('RGBA').resize((1670,942),Image.LANCZOS);a=np.asarray(im).astype(float)
    rgb,al=a[...,:3],a[...,3]
    if (al<10).mean()>.3:return rgb,al/255.,None
    bg=np.median(np.concatenate([rgb[:4].reshape(-1,3),rgb[-4:].reshape(-1,3)]),0)
    d=np.sqrt(((rgb-bg)**2).sum(2));fg=d>40;fg=nd.binary_closing(fg,iterations=2);fg=nd.binary_fill_holes(fg)
    A=np.where(nd.binary_erosion(fg,iterations=2),1.,np.clip(d/140,0,1)*nd.binary_dilation(fg,iterations=3))
    A=np.maximum(A,np.clip((d-15)/120,0,1));A=nd.gaussian_filter(A,.5)
    rgb=np.clip((rgb-(1-A[...,None])*bg)/np.maximum(A[...,None],.05),0,255)
    return rgb,A,bg
def crop(rgb,A,x0,y0,x1,y1):
    return Image.fromarray(np.dstack([rgb[y0:y1,x0:x1],A[y0:y1,x0:x1]*255]).clip(0,255).astype(np.uint8),'RGBA')
from skimage.feature import canny
from skimage.transform import hough_circle,hough_circle_peaks
def circles2(rgb,A):
    lum=rgb.mean(2)*A;e=canny(lum/255.,sigma=2.5);e[:235]=False
    out=[]
    for side,(x0,x1) in [('L',(0,420)),('R',(1100,1670))]:
        E=e[:,x0:x1];rad=np.arange(55,175,3);hs=hough_circle(E,rad)
        acc,cx,cy,r=hough_circle_peaks(hs,rad,min_xdistance=60,min_ydistance=60,total_num_peaks=14,threshold=.25)
        for a,x,y,rr in zip(acc,cx,cy,r):
            x+=x0
            if any(np.hypot(x-c[0],y-c[1])<max(rr,c[2])*.8 for c in out):continue
            out.append([float(x),float(y),float(rr)])
    return out
def circles(A):
    solid=A>.85;solid[:240]=False;solid=nd.binary_opening(solid,iterations=3);solid=nd.binary_fill_holes(solid)
    er=nd.binary_erosion(solid,iterations=10);lab,k=nd.label(er);out=[]
    for i,sl in enumerate(nd.find_objects(lab)):
        m=lab[sl]==i+1;area=m.sum()
        if area<1500:continue
        cy,cx=nd.center_of_mass(lab==i+1);r=np.sqrt(area/np.pi)+10
        out.append([cx,cy,r])
    return out
def assign(C):
    L=sorted([c for c in C if c[0]<835],key=lambda c:c[1]);R=[c for c in C if c[0]>=835]
    m={}
    if len(L)>=3:j=max(L,key=lambda c:c[1]);m['bFly'],m['bTr']=L[0],L[1];m['joyBase']=[j[0],j[1],155,j[2] if j[2]<100 else 56]
    big=max(R,key=lambda c:c[2]);m['bSr']=big;rest=sorted([c for c in R if c is not big],key=lambda c:c[1])
    rows=[];
    for c in rest:
        if rows and abs(rows[-1][0][1]-c[1])<60:rows[-1].append(c)
        else:rows.append([c])
    rows=[sorted(r,key=lambda c:c[0]) for r in rows]
    m['bBl']=rows[0][0];m['bKi'],m['bSp']=rows[1][0],rows[1][-1];m['bKick'],m['bPunch']=rows[2][0],rows[2][-1]
    return m
def bars(rgb,A,x0,x1):
    r,g,b=rgb[...,0],rgb[...,1],rgb[...,2];sub=lambda M:M&(A>.5)
    Y,X=np.mgrid[0:942,0:1670];reg=(Y<150)&(X>=x0+150)&(X<x1-40) if x0==0 else (Y<150)&(X>=x0+40)&(X<x1-150)
    green=sub((g>150)&(g>r+50)&(g>b+30))&reg
    if green.sum()<500:green=sub((b>200)&(g>150)&(r<170)&(b>r+60))&reg&(Y<106)
    yel=(sub((r>215)&(g>190)&(b<110)&(np.abs(r-g)<55))|sub((b>200)&(g>170)&(r<170)))&reg
    out={}
    lab,k=nd.label(nd.binary_dilation(green,iterations=2));objs=nd.find_objects(lab);sz=nd.sum(green,lab,range(1,k+1))
    comps=sorted([(sz[i],objs[i]) for i in range(k) if sz[i]>40],key=lambda q:-q[0])
    if comps:
        hp=comps[0][1];out['hp']=[hp[1].start,hp[0].start,hp[1].stop,hp[0].stop]
        sm=[c[1] for c in comps[1:] if c[1][0].stop<=hp[0].stop+4]
        if sm:out['w']=[min(s[1].start for s in sm),min(s[0].start for s in sm),max(s[1].stop for s in sm),max(s[0].stop for s in sm)]
    lum=rgb.mean(2);M=green.copy()
    if 'hp' in out:
        a,b_,c,d=out['hp'];ym=(b_+d)//2
        light=sub((lum>150)|((g>150)&(g>r+30)))&reg
        lab2,_=nd.label(light|green);ids=set(np.unique(lab2[b_:d,a:c]))-{0};hpm=np.isin(lab2,list(ids))&(Y>=b_-3)&(Y<=d+3)
        xs=np.where(hpm.any(0))[0];out['hp']=[int(xs.min()),b_,int(xs.max())+1,d];M|=hpm
        yy=yel&(Y>=d-3)&(Y<=d+34)
    else:yy=yel
    lab3,k3=nd.label(nd.binary_dilation(yy,iterations=2));sz3=nd.sum(yy,lab3,range(1,k3+1));yy&=np.isin(lab3,[i+1 for i in range(k3) if sz3[i]>60])
    ys,xs=np.where(yy)
    if len(xs):out['ki']=[int(np.percentile(xs,1)),int(ys.min()),int(np.percentile(xs,99))+1,int(ys.max())+1];M|=yy
    if 'w' in out:a,b_,c,d=out['w'];M|=green&(Y>=b_)&(Y<d)&(X>=a)&(X<c)
    return out,M
R={}
for cid,(pn,pt) in ARTS.items():
    R[cid]=[]
    for p in (pn,pt):
        rgb,A,bg=load(p)
        m=assign(circles2(rgb,A));btn={}
        for k,v in m.items():
            cx,cy,r=v[:3];rr=r*1.06;x0,y0,x1,y1=int(cx-rr),int(cy-rr),int(cx+rr),int(cy+rr)
            if k=='joyBase':
                im=crop(rgb,A,x0,y0,x1,y1);a=np.asarray(im).astype(float);h,w=a.shape[:2];Yy,Xx=np.mgrid[0:h,0:w];dd=np.hypot(Xx-w/2,Yy-h/2)
                kr=m['joyBase'][3]*1.05;kn=a.copy();kn[...,3]*=(dd<kr*1.02);kn=Image.fromarray(kn[int(h/2-kr):int(h/2+kr),int(w/2-kr):int(w/2+kr)].clip(0,255).astype(np.uint8),'RGBA')
                ring=(dd>=kr*1.02)&(dd<kr*1.35);fillc=np.median(a[ring][:,:3],0) if ring.any() else np.array([10,10,10])
                inner=dd<kr*1.08;a[inner,:3]=fillc;a[inner,3]=np.maximum(a[inner,3],230)
                btn['joy']=save(Image.fromarray(a.clip(0,255).astype(np.uint8),'RGBA'));btn['knob']=save(kn)
            else:btn[k]=save(crop(rgb,A,x0,y0,x1,y1).resize((256,256),Image.LANCZOS))
        hud={}
        for side,(x0,x1) in {'L':(0,745),'R':(925,1670)}.items():
            B,M=bars(rgb,A,x0,x1)
            ys,xs=np.where(A[:240,x0:x1]>.08);yb=int(ys.max())+2
            full=crop(rgb,A,x0,0,x1,yb);fa=np.asarray(full).astype(float);Mm=M[:yb,x0:x1]
            emp=fa.copy();L=emp[...,:3].mean(2,keepdims=True);emp[...,:3]=np.where(Mm[...,None],L*.16+8,emp[...,:3])
            # bordas do topo para o fogo animado
            top=[]
            for xx in range(0,x1-x0,14):
                col=np.where(fa[:,xx,3]>140)[0]
                if len(col):top.append([xx,int(col[0])])
            hud[side]={'x0':x0,'w':x1-x0,'h':yb,'full':save(Image.fromarray(fa.clip(0,255).astype(np.uint8),'RGBA')),'empty':save(Image.fromarray(emp.clip(0,255).astype(np.uint8),'RGBA')),
                'bars':{k:[v[0]-x0,v[1],v[2]-x0,v[3]] for k,v in B.items()},'top':top}
        # timer central sem o infinito
        cx0,cx1=745,925;ys,xs=np.where(A[:200,cx0:cx1]>.08);cb=int(ys.max())+2
        c=np.asarray(crop(rgb,A,cx0,0,cx1,cb)).astype(float);lum=c[...,:3].mean(2);h,w=lum.shape;Yy,Xx=np.mgrid[0:h,0:w]
        core=(np.abs(Xx-w/2)<w*.30)&(np.abs(Yy-ys.mean())<(ys.max()-ys.min())*.30)
        dark=np.median(c[core&(lum<60)][:,:3],0) if (core&(lum<60)).any() else np.array([12,12,16])
        c[core,:3]=dark
        hud['T']={'x0':cx0,'w':cx1-cx0,'h':cb,'img':save(Image.fromarray(c.clip(0,255).astype(np.uint8),'RGBA')),'cy':float(ys.mean())}
        R[cid].append({'btn':btn,'hud':hud,'circ':{k:[round(v[0]),round(v[1]),round(v[2])] for k,v in m.items()}})
        print(cid,p,sorted(btn),{s:hud[s]['bars'] for s in 'LR'},flush=True)
json.dump(R,open('hud.json','w'))
