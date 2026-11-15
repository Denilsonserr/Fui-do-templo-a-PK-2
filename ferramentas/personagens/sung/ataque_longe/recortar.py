# v453: recorta o vídeo do dono (lança/espada de energia em fundo verde) → quadros webp transparentes (12 quadros, 1 s do meio = loop)
# uso: python3 recortar.py <pasta_com_pngs> <saida>
import sys,os,glob,hashlib,json,numpy as np
from PIL import Image
src,out=sys.argv[1],sys.argv[2];os.makedirs(out,exist_ok=True);L=[]
for p in sorted(glob.glob(src+'/*.png')):
  a=np.asarray(Image.open(p).convert('RGB')).astype(np.float32);r,g,b=a[...,0],a[...,1],a[...,2]
  m=np.maximum(r,b);gs=g-m                      # quanto de "verde a mais"
  al=np.clip(1-(gs-25)/70,0,1)                  # verde forte = transparente, borda suave
  g2=np.minimum(g,m+10)                         # tira o verde que vazou na borda
  rgba=np.dstack([r,g2,b,al*255]).clip(0,255).astype(np.uint8);im=Image.fromarray(rgba,'RGBA')
  bb=im.getbbox();L.append((im,bb))
x0=min(b[0] for _,b in L);y0=min(b[1] for _,b in L);x1=max(b[2] for _,b in L);y1=max(b[3] for _,b in L)
names=[]
for im,_ in L:
  c=im.crop((x0,y0,x1,y1));w=640;c=c.resize((w,round(c.height*w/c.width)),Image.LANCZOS)
  tmp=out+'/t.webp';c.save(tmp,'WEBP',quality=72,method=6);h=hashlib.sha256(open(tmp,'rb').read()).hexdigest()[:14];os.replace(tmp,out+'/'+h+'.webp');names.append('a/'+h+'.webp')
print(json.dumps({'w':c.width,'h':c.height,'f':names}))
