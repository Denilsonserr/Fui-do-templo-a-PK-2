# Lobo: quadros -> www/a/*.webp e entra no rk_assets.json como RQA.lobo = {seq:[[src,ax,ay,k],...], por}
import json,io,hashlib,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));W=D+'/../../../www/';I=json.load(open(D+'/info.json'))
REF={'garras':323,'pulo':323,'ferido':335,'patada':332,'anda':372,'cai':351,'combo':213};ALT=160   # v271: lobo do tamanho de um lobo (antes 275)
VIRA={'combo':range(6,16)}   # quadros desenhados olhando para a DIREITA (o resto olha para a esquerda)
def webp(im,q=84):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,alpha_quality=90,method=6);d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(W+n,'wb').write(d);return n
out={}
for k,L in I.items():
    out[k]=[]
    for i,m in enumerate(L):
        im=Image.open(f'{D}/quadros/{k}{i}.png');s=min(1,1.3*ALT/REF[k]);im2=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
        q=[webp(im2),round(m['ax']*s,1),round(m['ay']*s,1),round(ALT/REF[k]/s,4)]
        if i in VIRA.get(k,()):q.append(1)
        out[k].append(q)
r=Image.open(D+'/recebido/00_referencia.jpg').convert('RGB').crop((110,20,400,310)).resize((256,256),Image.LANCZOS);out['por']=webp(r,88)
A=json.load(open(D+'/../../web/ranqueada/rk_assets.json'));A['lobo']=out
json.dump(A,open(D+'/../../web/ranqueada/rk_assets.json','w'),ensure_ascii=False,separators=(',',':'))
print({k:len(v) for k,v in out.items() if k!='por'},out['por'])
