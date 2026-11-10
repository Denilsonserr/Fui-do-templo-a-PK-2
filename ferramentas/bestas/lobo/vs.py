# v275: foto do LOBO NEGRO em pé (tela do VS) -> fundo branco tirado -> webp -> RQA.lobo.vs
import numpy as np,io,hashlib,json,os,sys
from PIL import Image
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from cortar import cut_rgb
D=os.path.dirname(os.path.abspath(__file__));R=D+'/../../..'
a=np.asarray(Image.open(D+'/recebido/08_em_pe_vs.jpg').convert('RGB'))
t=cut_rgb(a);ys,xs=np.where(t[...,3]>20);t=t[ys.min():ys.max()+1,xs.min():xs.max()+1]
im=Image.fromarray(t);im=im.resize((round(im.width*1.6),round(im.height*1.6)),Image.LANCZOS);im.save(D+'/quadros/vs.png')
b=io.BytesIO();im.save(b,'WEBP',quality=88,alpha_quality=92,method=6);d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(R+'/www/'+n,'wb').write(d)
P=R+'/ferramentas/web/ranqueada/rk_assets.json';A=json.load(open(P));A['lobo']['vs']=n;json.dump(A,open(P,'w'),ensure_ascii=False,separators=(',',':'));print(n,im.size)
