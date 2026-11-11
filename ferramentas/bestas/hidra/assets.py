# Hidra: quadros -> www/a/*.webp e RQA.hidra no rk_assets.json = {seq:[[src,ax,ay,k,1(olha p/ direita)],...], por, vs, tela, mapas:[7]}
import json,io,hashlib,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));W=D+'/../../../www/';I=json.load(open(D+'/info.json'))
ALT=200   # um pouco maior que o lobo (160)
REF={'parado':326,'garras':326,'pulo':326,'cai':326,'anda':326,'furia':326,'combo':153,'patada':244}
PICK={'patada':[1,2,3,4,5,7],'combo':[0,2,4,5,6,7,8,9,10,11,12,13,14,16,18,21]}
def webp(im,q=84,alpha=True):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,method=6,**({'alpha_quality':90} if alpha else {}));d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(W+n,'wb').write(d);return n
out={}
for k,L in I.items():
    idx=PICK.get(k,range(len(L)));out[k]=[]
    for i in idx:
        m=L[i];im=Image.open(f'{D}/quadros/{k}{i}.png');s=min(1,1.35*ALT/REF[k]);im2=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
        out[k].append([webp(im2),round(m['ax']*s,1),round(m['ay']*s,1),round(ALT/REF[k]/s,4),1])
R=D+'/recebido/'
out['por']=webp(Image.open(R+'01_retrato.png').convert('RGB').resize((256,256),Image.LANCZOS),88,False)
out['vs']=webp(Image.open(D+'/quadros/em_pe.png'),88)   # recortado (fundo branco tirado) no v355
out['tela']=webp(Image.open(R+'00_tela_caca.png').convert('RGB'),86,False)
out['mapas']=[webp(Image.open(R+f'mapa{i}.png').convert('RGB'),84,False) for i in range(1,8)]
A=json.load(open(D+'/../../web/ranqueada/rk_assets.json'));A['hidra']=out
json.dump(A,open(D+'/../../web/ranqueada/rk_assets.json','w'),ensure_ascii=False,separators=(',',':'))
print({k:len(v) for k,v in out.items() if isinstance(v,list)},out['por'])
