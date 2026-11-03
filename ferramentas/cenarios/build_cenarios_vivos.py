import numpy as np,json,hashlib,io,os,sys
from PIL import Image
from scipy import ndimage as nd
os.makedirs('out',exist_ok=True)
def basic(a):
    R,G,B=a[...,0],a[...,1],a[...,2];mx=a.max(2);mn=a.min(2);sat=(mx-mn)/np.maximum(mx,1);return R,G,B,mx,mn,sat
def flood(cand,maxy,fillsmall=50):
    H=cand.shape[0];Y=np.arange(H)[:,None];cand=cand&(Y<maxy)
    lab,k=nd.label(cand);top=set(np.unique(lab[:6]))-{0};sky=np.isin(lab,list(top))
    holes=nd.binary_fill_holes(sky)&~sky;hl,hk=nd.label(holes)
    if hk:
        hs=nd.sum(holes,hl,range(1,hk+1));sky|=np.isin(hl,[i+1 for i,v in enumerate(hs) if v<fillsmall])
    return sky
def sky_city(a):
    R,G,B,mx,mn,sat=basic(a);H=a.shape[0];skyc=(B>R+50)&(B>G+15)&(B>140);cloud=(mx>190)&(sat<.28)&(B>=R+4)
    sky=flood(skyc|cloud,H*.62);return sky,sky&cloud&~skyc
def sky_waste(a):
    R,G,B,mx,mn,sat=basic(a);H=a.shape[0];skyc=(R>90)&(R>B+30)&(R>G+20);return flood(skyc,H*.62),None
def sky_look(a):
    R,G,B,mx,mn,sat=basic(a);H,W=a.shape[:2];warm=(R>170)&(R>B+20)&~((G>R)&(G>B+30))
    yy,xx=np.mgrid[0:H,0:W];dome=(((xx-700)/312)**2+((yy-489)/345)**2<1)&(yy<495)
    warm&=~dome;return flood(warm,H*.72),None
def sky_snow(a):
    R,G,B,mx,mn,sat=basic(a);H=a.shape[0];skyc=(B>R+80)&(B>G+40)&(sat>.35);return flood(skyc,H*.5),None
CFG={
 'city':dict(f=sky_city,cut=527,feet=652,holes=(150,8000,0,300),crown=420,keep=[(726,14),(1015,122),(1286,158),(1382,216)],name='CIDADE DO FUTURO'),
 'waste':dict(f=sky_waste,cut=565,feet=641,holes=(60,20000,0,480),crown=0,name='PLANETA DAS BOLHAS'),
 'look':dict(f=sky_look,cut=510,feet=608,holes=None,crown=440,gmin=50,cmin=20000,ringf=.12,name='MIRANTE CELESTE'),
 'snow':dict(f=sky_snow,cut=632,feet=672,holes=None,crown=0,name='PICOS GELADOS'),
}
def save(arr,alpha=False,q=86,res=None):
    im=Image.fromarray(np.clip(arr,0,255).astype(np.uint8),'RGBA' if alpha else 'RGB')
    if res:im=im.resize(res,Image.LANCZOS)
    b=io.BytesIO();im.save(b,'WEBP',quality=q,alpha_quality=90,method=6);d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14]
    open(f'out/{h}.webp','wb').write(d);return 'a/'+h+'.webp',len(d)//1024
def fill(img,m,sg):
    w=nd.gaussian_filter(m.astype(np.float32),sg)
    return np.dstack([nd.gaussian_filter(img[...,c]*m,sg) for c in range(3)])/np.maximum(w,1e-4)[...,None],w
ALL={}
for n in sys.argv[1:]:
    C=CFG[n];a=np.asarray(Image.open(n+'.png').convert('RGB')).astype(np.float32);h0,w0=a.shape[:2]
    sky,cl=C['f'](a);R,G,B,mx,mn,sat=basic(a)
    if cl is not None:
        holes=nd.binary_fill_holes(sky)&~sky;hl,hk=nd.label(holes)
        for i,o in enumerate(nd.find_objects(hl)):
            m=hl[o]==i+1;k=m.sum()
            if ((mx[o]>185)&(sat[o]<.32)&m).sum()/k>.45:sky[o]|=m;cl[o]|=m
    spr=np.zeros_like(sky);sprites=[]
    if C['holes']:
        lo,hi,y0,y1=C['holes'];holes=nd.binary_fill_holes(sky)&~sky;hl,hk=nd.label(holes)
        for i,o in enumerate(nd.find_objects(hl)):
            m=hl[o]==i+1;k=m.sum()
            hh=o[0].stop-o[0].start;ww=o[1].stop-o[1].start
            whitef=((mx[o]>190)&(sat[o]<.3)&m).sum()/k
            if C.get('keep') and not any(abs(o[1].start-x)<40 and abs(o[0].start-y)<40 for x,y in C['keep']):continue
            if lo<=k<=hi and o[0].start>=y0 and o[0].stop<=y1 and hh<2.2*ww and ww<3.5*hh and whitef<.45:spr[o]|=m;sprites.append(('fly',o))
    if C['crown']:
        green=(G>R+18)&(G>B+8)&(G>C.get('gmin',80))&(np.arange(h0)[:,None]<C['crown']);green=nd.binary_closing(green,iterations=2);gl,gk=nd.label(green)
        for i,o in enumerate(nd.find_objects(gl)):
            m=gl[o]==i+1;k=m.sum()
            if k<C.get('cmin',300):continue
            big=np.zeros_like(sky);big[o]=nd.binary_fill_holes(m);ring=nd.binary_dilation(big,iterations=4)&~big;f=(sky&ring).sum()/max(ring.sum(),1)
            if f>C.get('ringf',.4):spr|=big;sprites.append(('crown',o))
    # viz
    v=a.copy();v[sky]=v[sky]*.4+np.array([255,0,255])*.6;v[spr]=[255,255,0]
    if cl is not None:v[cl]=v[cl]*.5+np.array([0,255,255])*.5
    Image.fromarray(v.astype(np.uint8)).resize((1086,362)).save('v2_'+n+'.png')
    # up-res
    U=np.asarray(Image.open(n+'_up.png').convert('RGB')).astype(np.float32);H,W=U.shape[:2];s=W/w0
    def up(m):return np.asarray(Image.fromarray((m*255).astype(np.uint8)).resize((W,H),Image.BILINEAR)).astype(np.float32)/255
    skyU=up(sky);sprU=up(nd.binary_dilation(spr,iterations=2));clU=up(cl)>.3 if cl is not None else np.zeros((H,W),bool)
    skyb=skyU>.5;clean=skyb&~clU&~(sprU>.05)
    f1,w1=fill(U,clean,9);f2,w2=fill(U,clean,45)
    idx=nd.distance_transform_edt(~clean,return_distances=False,return_indices=True);nn=U[idx[0],idx[1]]
    nn=np.dstack([nd.gaussian_filter(nn[...,c],25) for c in range(3)])
    skyfill=np.where((w1>.25)[...,None],f1,np.where((w2>.05)[...,None],f2,nn))
    skyimg=U.copy();rep=~clean;skyimg[rep]=skyfill[rep]
    ys=np.where(skyb.any(1))[0];skyH=min(H,int(ys.max())+30)
    M={'W':W,'H':H,'name':C['name'],'skyH':skyH,'cut':int(C['cut']*s),'feet':C['feet']*s,'L':{}}
    M['L']['sky'],kb=save(skyimg[:skyH],res=(W//2,skyH//2),q=84)
    if cl is not None:
        white=np.array([250,252,255],np.float32)
        al=np.clip(np.abs(U-skyfill).sum(2)/np.maximum(np.abs(white-skyfill).sum(2),1)*1.25,0,1)*clU
        al=nd.gaussian_filter(al,1.0)*clU;A=al[...,None];col=np.clip((U-(1-A)*skyfill)/np.maximum(A,.05),0,255)
        cy=np.where(clU.any(1))[0];c0,c1=int(cy.min()),int(cy.max())+1;M['c0'],M['c1']=c0,c1
        M['L']['clouds'],_=save(np.dstack([col,al*255])[c0:c1],True,82,(W*3//4,(c1-c0)*3//4))
    la=np.clip(1-skyU,0,1);la=np.where(sprU>.5,0,la*(1-np.clip(sprU*2,0,1)))
    CUT=M['cut'];ly=np.where((la>.02).any(1))[0];l0=int(ly.min());M['l0']=l0
    M['L']['land'],_=save(np.dstack([U,la*255])[l0:CUT+14],True)
    fl=np.dstack([U[CUT:],np.full((H-CUT,W),255.)]);fl[:16,:,3]=np.linspace(0,255,16)[:,None]
    M['L']['floor'],_=save(fl,True)
    M['spr']=[]
    for kind,o in sprites:
        y0,y1,x0,x1=[int(v*s) for v in (o[0].start,o[0].stop,o[1].start,o[1].stop)];y0=max(0,y0-3);x0=max(0,x0-3);y1=min(H,y1+3);x1=min(W,x1+3)
        m=sprU[y0:y1,x0:x1]
        # alpha: mask of this sprite only (exclude other sprites overlapping roughly ok)
        al=np.clip(m*1.6,0,1)
        if kind=='fly':al=np.clip(al*(1-skyU[y0:y1,x0:x1]*0+1),0,1)
        src,_=save(np.dstack([U[y0:y1,x0:x1],al*255]),True,88);M['spr'].append([kind,src,x0,y0,x1-x0,y1-y0])
    ALL[n]=M;print(n,len(M['spr']),M['skyH'],M['l0'],CUT,flush=True)
old=json.load(open('st4.json')) if os.path.exists('st4.json') else {}
old.update(ALL);json.dump(old,open('st4.json','w'),separators=(',',':'))
