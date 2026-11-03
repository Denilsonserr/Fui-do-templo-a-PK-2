import numpy as np,json,hashlib,io,os
from PIL import Image
from scipy import ndimage as nd
U=np.asarray(Image.open('up.png').convert('RGB')).astype(np.float32);H,W,_=U.shape
F=json.load(open('feat.json'));s=W/F['W']
def up(m):return np.asarray(Image.fromarray((m*255).astype(np.uint8)).resize((W,H),Image.BILINEAR)).astype(np.float32)/255
sky=up(np.load('sky.npy'));cl=up(np.load('cl.npy'))>.3;cr=up(np.load('crown.npy'))
skyb=sky>.5;crb=cr>.3
clean=skyb&~cl&~nd.binary_dilation(crb,iterations=3)
def fill(img,m,sg):
    w=nd.gaussian_filter(m.astype(np.float32),sg)
    return np.dstack([nd.gaussian_filter(img[...,c]*m,sg) for c in range(3)])/np.maximum(w,1e-4)[...,None],w
f1,w1=fill(U,clean,9);f2,_=fill(U,clean,45)
skyfill=np.where((w1>0.25)[...,None],f1,f2)
skyimg=U.copy();rep=~clean;skyimg[rep]=skyfill[rep]
out={}
def save(arr,name,q=86,alpha=False,res=None):
    im=Image.fromarray(np.clip(arr,0,255).astype(np.uint8),'RGBA' if alpha else 'RGB')
    if res:im=im.resize(res,Image.LANCZOS)
    b=io.BytesIO();im.save(b,'WEBP',quality=q,alpha_quality=90,method=6);d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14]
    os.makedirs('out',exist_ok=True);open(f'out/{h}.webp','wb').write(d);out[name]='a/'+h+'.webp';print(name,im.size,len(d)//1024,'KB')
# sky: only rows down to horizon
ys=np.where(skyb.any(1))[0];skyH=int(ys.max())+20
save(skyimg[:skyH],'sky',84,res=(W//2,skyH//2))
# clouds
white=np.array([245,255,235],np.float32)
al=np.clip(np.abs(U-skyfill).sum(2)/np.maximum(np.abs(white-skyfill).sum(2),1)*1.25,0,1)*cl
al=nd.gaussian_filter(al,1.0)*cl;A=al[...,None];col=np.clip((U-(1-A)*skyfill)/np.maximum(A,.05),0,255)
cy=np.where(cl.any(1))[0];c0,c1=int(cy.min()),int(cy.max())+1
save(np.dstack([col,al*255])[c0:c1],'clouds',82,True,(W*3//4,(c1-c0)*3//4))
# land alpha: not sky, crowns removed
la=np.clip((1-sky)*1.0,0,1);la=np.where(crb,0,la)
CUT=int(540*s)
la2=la.copy()
land=np.dstack([U,la2*255])
ly=np.where((la2>.02).any(1))[0];l0=int(ly.min())
save(land[l0:CUT+12],'land',86,True)
# floor (opaque) from CUT-? with feather top 12px
fl=np.dstack([U[CUT:],np.full((H-CUT,W),255.)]);fl[:16,:,3]=np.linspace(0,255,16)[:,None]
save(fl,'floor',86,True)
# crowns
crowns=[]
lab,k=nd.label(crb)
for i,o in enumerate(nd.find_objects(lab)):
    m=(lab[o]==i+1);n=m.sum()
    if n<200:continue
    y0,y1,x0,x1=o[0].start,o[0].stop,o[1].start,o[1].stop
    a=np.zeros((y1-y0,x1-x0,4),np.float32);a[...,:3]=U[o];a[...,3]=np.where(m,cr[o],0)*255
    save(a,'cr%d'%i,88,True);crowns.append([out.pop('cr%d'%i),x0,y0,x1-x0,y1-y0])
meta={'W':W,'H':H,'skyH':skyH,'c0':c0,'c1':c1,'l0':l0,'cut':CUT,'L':out,'crowns':crowns,
 'suns':[[x*s,y*s,r*s] for x,y,r in F['suns'] if y<230],'wp':[[x*s,y*s] for x,y in F['wpts']]}
json.dump(meta,open('nmk.json','w'),separators=(',',':'))
# preview composite
pv=Image.fromarray(skyimg.astype(np.uint8))
print('ok',c0,c1,l0,CUT,len(crowns))
