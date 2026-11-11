# v357: baús e mapas de exploração -> RQA.hidra.bc (7 fechados), bo (7 abertos), ex (2 mapas)
import json,io,hashlib,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));W=D+'/../../../www/'
def webp(im,q=86,alpha=True):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,method=6,**({'alpha_quality':90} if alpha else {}));d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(W+n,'wb').write(d);return n
def sm(f):im=Image.open(f);s=min(1,240/im.width);return im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
A=json.load(open(D+'/../../web/ranqueada/rk_assets.json'));H=A['hidra']
H['bc']=[webp(sm(f'{D}/baus/f2_{i}.png')) for i in range(7)];H['bo']=[webp(sm(f'{D}/baus/a2_{i}.png')) for i in range(7)]
H['ex']=[webp(Image.open(f'{D}/recebido/mapa_ex{i}.png').convert('RGB'),84,False) for i in (1,2)]
json.dump(A,open(D+'/../../web/ranqueada/rk_assets.json','w'),ensure_ascii=False,separators=(',',':'));print(H['bc'][0],H['ex'])
