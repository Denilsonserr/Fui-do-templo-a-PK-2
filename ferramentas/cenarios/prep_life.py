# "Mini vida" dos cenários: copas de árvore recortadas (para balançar), pontos de brilho na água e centros do fogo desenhado.
# Uso: python3 prep_life.py <pasta_com_B0..Bn.png ou A2..C2> <modo:namek|cupula> <saida.json> <arquivos...>
import numpy as np,hashlib,json,os,sys
from PIL import Image
from scipy import ndimage as nd
OUT='/home/claude/fui-do-templo-a-pk-2/www/a'
mode=sys.argv[1];OJ=sys.argv[2];files=sys.argv[3:]
def save(im):
    b=im.tobytes();h=hashlib.md5(b).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=86,alpha_quality=90,method=6)
    return f'a/{h}.webp'
R=[]
for f in files:
    im=Image.open(f).convert('RGB').resize((3000,1000),Image.LANCZOS);o=np.asarray(im).astype(float);r,g,b=o[...,0],o[...,1],o[...,2];H,W=r.shape;Y,X=np.mgrid[0:H,0:W];s=3000/2172
    if mode=='namek':
        tree=(b>r+70)&(b>g+35)&(b>110)&(r<60)&(g<175)&(Y<760)
        water=(g>120)&(b>80)&(r<110)&(np.abs(g-b)<75)&(Y>520)&(Y<740)
    elif mode=='vale':
        tree=(g>r+30)&(g>b+15)&(g>90)&(Y<900)&(Y>80)
        water=(b>r+45)&(b>110)&(Y>835)&(Y<990)
    elif mode=='folha':
        tree=(g>r+18)&(g>b+12)&(g>80)&(Y<700)&(Y>380)
        water=np.zeros_like(tree)
    else:
        tree=(g>r+18)&(g>b+12)&(g>80)&(Y<470)&~((X>2100)&(X<2380)&(Y<230))
        water=np.zeros_like(tree)
    tree=nd.binary_opening(tree,iterations=1);tree=nd.binary_closing(tree,iterations=2)
    lab,k=nd.label(tree);objs=nd.find_objects(lab);sz=nd.sum(tree,lab,range(1,k+1))
    items=[(i,objs[i]) for i in range(k) if sz[i]>(500 if mode=='namek' else 900)]
    # atlas em prateleiras
    sh=[];x=y=rowh=0;AW=2048
    for i,sl in items:
        h=sl[0].stop-sl[0].start+4;w=sl[1].stop-sl[1].start+4
        if x+w>AW:x=0;y+=rowh;rowh=0
        sh.append((i,sl,x,y,w,h));x+=w;rowh=max(rowh,h)
    AH=y+rowh;atl=np.zeros((max(AH,1),AW,4),np.uint8);T=[]
    for i,sl,ax,ay,w,h in sh:
        y0,x0=sl[0].start-2,sl[1].start-2;m=(lab[y0:y0+h,x0:x0+w]==i+1)
        m=nd.binary_dilation(m,iterations=1);a=nd.gaussian_filter(m.astype(float),.8)
        c=o[y0:y0+h,x0:x0+w];atl[ay:ay+h,ax:ax+w]=np.dstack([c,a*255]).clip(0,255).astype(np.uint8)
        # pivô: base do recorte (centro em x). u,v,w,h em unidades da imagem 2172
        T.append([ax,ay,w,h,round(x0/s,1),round(y0/s,1),round(w/s,1),round(h/s,1)])
    tI=save(Image.fromarray(atl,'RGBA')) if T else None
    ys,xs=np.where(nd.binary_erosion(water,iterations=3));wp=[]
    if len(xs):
        sel=np.random.default_rng(3).choice(len(xs),min(70,len(xs)),replace=False);wp=[[round(xs[i]/s),round(ys[i]/s)] for i in sel]
    R.append({'trees':tI,'tr':T,'wp':wp});print(f,len(T),AH,len(wp),flush=True)
json.dump(R,open(OJ,'w'))
