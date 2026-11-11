# v333: tela do PVP (arte do dono 1849x851), emblemas dos ranks recortados da própria arte (IA 2x), vídeo novo do menu -> www/a
import hashlib,io,os,sys,json,shutil
import numpy as np
from PIL import Image,ImageEnhance
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,'../../..');OUT=R+'/www/a';sys.path.insert(0,R+'/ferramentas/ia');import esr
M={}
def put(b,ext,k):
    h=hashlib.md5(b).hexdigest()[:14];open(f'{OUT}/{h}.{ext}','wb').write(b);M[k]=f'a/{h}.{ext}'
def webp(im,k,q=84):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,method=6);put(b.getvalue(),'webp',k)
art=Image.open(D+'/pvp_tela.png').convert('RGB');webp(art,'tela')
# emblemas: Bronze..Divino (linhas da lista da direita); fundo escuro vira transparente
Y=[188,250,308,368,427,487,550,612];N=['bronze','prata','ouro','platina','diamante','mestre','lendario','divino']
E=[]
for i,(y,n) in enumerate(zip(Y,N)):
    w=58 if i<7 else 66;c=np.asarray(art.crop((1635-w,y-34,1635+w,y+34))).astype(np.float32)
    mx=c.max(2);a=np.clip((mx-58)/45,0,1);sat=c.max(2)-c.min(2);a=np.maximum(a,np.clip((sat-40)/40,0,1)*np.clip((mx-30)/40,0,1))
    hh,ww=a.shape;yy,xx=np.mgrid[0:hh,0:ww];el=((xx-ww/2)/(ww/2-4))**2+((yy-hh/2)/(hh/2-5))**2;a=a*np.clip((1-el)/.18,0,1)
    im=Image.fromarray(np.dstack([c,a*255]).astype(np.uint8),'RGBA');im=esr.sr_rgba(im,2);E.append(im);webp(im,'e_'+n,90)
# madeira: bronze escurecido e marrom
b=np.asarray(E[0]).astype(np.float32);g=b[...,:3].mean(2,keepdims=True);wd=np.concatenate([g*.62+28,g*.42+12,g*.24+4],2);wd=np.clip(wd*1.05,0,255)
webp(Image.fromarray(np.dstack([wd,b[...,3]]).astype(np.uint8),'RGBA'),'e_madeira',90)
for f,k,e in [('out.webm','wm','webm'),('out.mp4','v','mp4')]:put(open(D+'/'+f,'rb').read(),e,k)
put(open(D+'/out_poster.webp','rb').read(),'webp','p')
print(json.dumps(M,separators=(',',':')))
