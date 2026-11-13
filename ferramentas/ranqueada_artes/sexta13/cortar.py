# v400: Sexta-feira 13 — recorta moeda de abóbora, caixa fechada e aberta (fundo branco) e a abóbora negra da arte da loja -> www/a + sx.json
import numpy as np,io,hashlib,json,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));A=os.path.join(D,'..','..','..','www','a')
src=open(os.path.join(D,'..','..','personagens','shaka','seg_sk.py'),encoding='utf8').read();src=src[:src.index("COMP={")].replace("SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)),'poses');os.makedirs('cut',exist_ok=True)","");exec(src)
def save(im,q=88):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,alpha_quality=90,method=6);d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14];open(f'{A}/{h}.webp','wb').write(d);return 'a/'+h+'.webp'
C=alpha(D+'/itens.png');o={}
for k,(x0,x1),mx in [('moeda',(0,690),160),('caixa',(690,1420),420),('aberta',(1420,2172),420)]:
    c=C[:,x0:x1];m=c[...,3]>20;ys,xs=np.where(m);c=c[ys.min():ys.max()+1,xs.min():xs.max()+1]
    im=Image.fromarray(c.clip(0,255).astype(np.uint8),'RGBA');im.thumbnail((mx,mx),Image.LANCZOS);im.save(D+f'/{k}.png');o[k]=save(im);print(k,im.size)
L=Image.open(D+'/loja.png').convert('RGB');o['loja']=save(L,86)
ab=L.crop((1525,375,1785,545));ab.save(D+'/abobora_negra.png');o['negra']=save(ab)
json.dump(o,open(D+'/sx.json','w'),indent=1);print(o)
