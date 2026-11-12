# v370: emblemas de rank do dono (fundo preto com brilho) → transparência pela luminosidade (mantém o brilho)
import numpy as np,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));os.makedirs(D+'/emb',exist_ok=True)
def cut(src,cols,ysplit,names):
    im=np.array(Image.open(D+'/'+src).convert('RGB')).astype(np.float32)/255;H,W,_=im.shape;cw=W/cols
    for k,nm in enumerate(names):
        if nm is None:continue
        r,c=divmod(k,cols);y0,y1=(0,ysplit) if r==0 else (ysplit,H);x0,x1=int(c*cw),int((c+1)*cw)
        a=im[y0:y1,x0:x1];v=a.max(2);al=np.clip((v-.03)/.25,0,1)**1.1
        rgb=np.clip(a/np.maximum(al[...,None],1e-3),0,1)*(al[...,None]>0)
        ys,xs=np.where(al>.06);b=8;yy0,yy1,xx0,xx1=max(0,ys.min()-b),min(al.shape[0],ys.max()+b),max(0,xs.min()-b),min(al.shape[1],xs.max()+b)
        out=np.dstack([rgb,al])[yy0:yy1,xx0:xx1];I=Image.fromarray((out*255).astype(np.uint8),'RGBA');s=256/max(I.size);I=I.resize((round(I.width*s),round(I.height*s)),Image.LANCZOS)
        I.save(f'{D}/emb/{nm}.png');print(nm,I.size)
cut('folha1.png',4,376,['bronze','prata','ouro','diamante','lendario','dragao','divindade','div_suprema'])
cut('folha2.png',3,391,['div_celestial','extra_guardado','deus_celestial','deus_cosmico','deus_primordial','deus_absoluto'])
