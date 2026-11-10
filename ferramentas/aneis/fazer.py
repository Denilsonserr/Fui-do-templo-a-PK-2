# v277: anéis do dono (fundo preto) -> transparentes (alfa = brilho) -> webp; arte da aba Anéis da Biblioteca. Saída: RQA.anel2 = [5 anéis], RQA.aneis = arte
import numpy as np,io,hashlib,json,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));R=D+'/../..'
def webp(im,q=88):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,alpha_quality=90,method=6);d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(R+'/www/'+n,'wb').write(d);return n
out=[]
for i in range(5):
    a=np.asarray(Image.open(f'{D}/recebido/anel{i}.png').convert('RGB')).astype(float)
    al=a.max(2);al=np.clip((al-14)/(255-14),0,1)            # preto vira transparente
    col=np.clip(a/np.maximum(al[...,None],1e-3),0,255)
    t=np.dstack([col,al*255]).astype(np.uint8);ys,xs=np.where(t[...,3]>8);t=t[max(0,ys.min()-4):ys.max()+5,max(0,xs.min()-4):xs.max()+5]
    im=Image.fromarray(t);im=im.resize((640,round(640*im.height/im.width)),Image.LANCZOS);out.append(webp(im))
    print(i,im.size)
P=R+'/ferramentas/web/ranqueada/rk_assets.json';A=json.load(open(P));A['anel2']=out
bg=Image.open(D+'/recebido/biblioteca_aneis.png').convert('RGB').resize((1847,851),Image.LANCZOS);A['aneis']=webp(bg,86)
json.dump(A,open(P,'w'),ensure_ascii=False,separators=(',',':'));print(out,A['aneis'])
