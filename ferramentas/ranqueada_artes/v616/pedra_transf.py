# v616: PEDRA DA TRANSFERÊNCIA — a Joia Negra recolorida para vermelho-rubi (combina com a tela do dono) (gira o matiz), com brilho. -> www/a
import numpy as np,io,hashlib,os,colorsys
from PIL import Image,ImageFilter
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,'..','..','..','www')
im=Image.open(os.path.join(R,'a','d4f9c205df1c7c.webp')).convert('RGBA');a=np.asarray(im).astype(float)/255
import matplotlib.colors as mc
hsv=mc.rgb_to_hsv(a[...,:3]);sat=(hsv[...,1]>.25)&(hsv[...,0]>.62)&(hsv[...,0]<.97)
hsv[...,0]=np.where(sat,(hsv[...,0]+0.19)%1,hsv[...,0]);hsv[...,1]=np.where(sat,np.clip(hsv[...,1]*1.1,0,1),hsv[...,1])
rgb=mc.hsv_to_rgb(hsv);out=np.dstack([rgb,a[...,3]])
I=Image.fromarray((out*255).astype(np.uint8),'RGBA')
b=io.BytesIO();I.save(b,'WEBP',quality=90,method=6);d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14]
open(os.path.join(R,'a',h+'.webp'),'wb').write(d);I.save('/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/jt.png');print('a/'+h+'.webp')
