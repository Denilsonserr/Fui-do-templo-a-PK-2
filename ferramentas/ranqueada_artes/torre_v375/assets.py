# v375: Torre nova -> RQA.torre5 {menu, mapas{}, frente, sp{}}
import json,io,hashlib,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));W=D+'/../../../www/';J=D+'/../../web/ranqueada/rk_assets.json'
def webp(im,q=86,alpha=True):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,method=6,**({'alpha_quality':90} if alpha else {}));d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(W+n,'wb').write(d);return n
def sm(f,mx):
    im=Image.open(f).convert('RGBA');bb=im.getchannel('A').point(lambda v:255 if v>8 else 0).getbbox();im=im.crop(bb);s=min(1,mx/max(im.size));return im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
A=json.load(open(J));T={}
T['menu']=webp(Image.open(D+'/recebido/menu.png').convert('RGB'),84,False)
T['mapas']={k:webp(Image.open(f'{D}/recebido/m_{k}.png').convert('RGB'),82,False) for k in ['ruinas','azul','lava','gelo','assombrada','cristal','dourado','pantano','destruida','arvore']}
T['frente']=webp(Image.open(D+'/recebido/frente.png').convert('RGBA').resize((1448,483),Image.LANCZOS),80)
MX={'portao_f':420,'portao_a':420,'est_anjo':300,'est_cavaleiro':300,'est_lanterna':260,'coluna_p':300,'coluna_hera':300,'muro':360,'tr_crat0':520,'tr_exp0':300,'tr_ped0':350,'tr_lobo3':441}
S={}
for f in sorted(os.listdir(D+'/sp')):
    k=f[:-4];S[k]=webp(sm(D+'/sp/'+f,MX.get(k,240)))
T['sp']=S;A['torre5']=T
json.dump(A,open(J,'w'),ensure_ascii=False,separators=(',',':'));print(len(S),T['menu'])
