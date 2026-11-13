# v390: recorta os 5 ícones V2 do equipamento de Virgem (folha do dono, fundo preto) → www/a/skv2_<k>.webp
import numpy as np,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));A=os.path.join(D,'..','..','..','..','www','a')
a=np.array(Image.open(D+'/v2_folha.png').convert('RGB')).astype(np.float32)
B={'cap':(0,0,512,476),'arm':(512,0,1024,476),'luv':(1024,0,1536,476),'bot':(262,480,770,1024),'ros':(774,480,1282,1024)}
for k,(x0,y0,x1,y1) in B.items():
    c=a[y0:y1,x0:x1];m=c.max(2);al=np.clip((m-14)*4,0,255)
    ys,xs=np.where(al>40);c=c[ys.min():ys.max()+1,xs.min():xs.max()+1];al=al[ys.min():ys.max()+1,xs.min():xs.max()+1]
    # desfaz o preto misturado na borda (cor = cor/alpha)
    f=np.clip(al/255,1e-3,1)[...,None];rgb=np.clip(c/np.maximum(f,.25),0,255)
    im=Image.fromarray(np.dstack([rgb,al]).astype(np.uint8),'RGBA');im.thumbnail((256,256),Image.LANCZOS)
    im.save(D+f'/skv2_{k}.png');print(k,im.size)
# depois: os .png viram www/a/<hash>.webp e vão para rk_assets.json em shk.v2 (ver GUIA v390)
