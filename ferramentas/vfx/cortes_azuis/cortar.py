# v419: cortes de espada azuis (artes do dono, fundo verde) -> sem fundo -> www/a/*.webp + cortes.json (usado no MODO TESTE do ADM)
import numpy as np,io,hashlib,json,os
from PIL import Image
from scipy import ndimage
D=os.path.dirname(os.path.abspath(__file__));A=os.path.join(D,'..','..','..','www','a')
def key(p):
    a=np.asarray(Image.open(os.path.join(D,p)).convert('RGB')).astype(float);r,g,b=a[...,0],a[...,1],a[...,2]
    al=np.clip(1-(g-np.maximum(r,b)-10)/120,0,1);al[al<.04]=0
    o=a.copy();o[...,1]=np.minimum(g,np.maximum(r,b));return np.dstack([o,al*255])
def save(c,mx):
    m=c[...,3]>8;ys,xs=np.where(m);c=c[max(0,ys.min()-4):ys.max()+5,max(0,xs.min()-4):xs.max()+5]
    im=Image.fromarray(c.clip(0,255).astype(np.uint8),'RGBA');im.thumbnail((mx,mx),Image.LANCZOS)
    b=io.BytesIO();im.save(b,'WEBP',quality=86,alpha_quality=85,method=6);d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14]
    open(f'{A}/{h}.webp','wb').write(d);return {'s':'a/'+h+'.webp','w':im.size[0],'h':im.size[1]}
o={'grande':[save(key('corte_grande1.png'),640),save(key('corte_grande2.png'),640)],'peq':[]}
C=key('cortes_folha.png');m=ndimage.binary_dilation(C[...,3]>30,iterations=14);L,n=ndimage.label(m)
for i,sl in sorted(enumerate(ndimage.find_objects(L)),key=lambda t:(t[1][0].start//300,t[1][1].start)):
    if (sl[0].stop-sl[0].start)*(sl[1].stop-sl[1].start)<30000:continue
    c=C[sl].copy();c[...,3]*=(L[sl]==i+1);o['peq'].append(save(c,460))
json.dump(o,open(os.path.join(D,'cortes.json'),'w'),indent=1);print(len(o['peq']),'cortes pequenos',o)
