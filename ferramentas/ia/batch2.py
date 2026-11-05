"""v124: segunda passada de IA (Real-ESRGAN) nos lutadores antigos e nos cenários.
spr: poses com menos de 2 pixels por unidade -> 2.4 px/unidade (mais nítido em celular de tela fina)
st : fundos dos cenários -> 1.8x (no máximo 4096 de largura, limite de textura de celular)
Retoma de onde parou (map2.json). Uso: python3 batch2.py spr|st jobs.json"""
import json,os,sys,time,hashlib,io
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
import esr
HERE=os.path.dirname(os.path.abspath(__file__));WWW=os.path.join(HERE,'..','..','www')+'/'
OUT=HERE+'/out2';os.makedirs(OUT,exist_ok=True)
kind=sys.argv[1];jobs=json.load(open(sys.argv[2]))
mp=HERE+f'/map2_{kind}.json';M=json.load(open(mp)) if os.path.exists(mp) else {}
def save(im,q,alpha):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,alpha_quality=92 if alpha else 100,method=5);d=b.getvalue()
    h=hashlib.md5(d).hexdigest()[:14];open(f'{OUT}/{h}.webp','wb').write(d);return f'a/{h}.webp'
t0=time.time();todo=[s for s in jobs if s not in M]
for n,src in enumerate(todo):
    im=Image.open(WWW+src)
    if kind=='spr':
        r=2.4/jobs[src];o=esr.sr_rgba(im,2)
        o=o.resize((round(im.size[0]*r),round(im.size[1]*r)),Image.LANCZOS);M[src]=save(o,90,True)
    else:
        f=min(1.8,4096/im.size[0]);rgb=np.asarray(im.convert('RGB'));o=Image.fromarray(esr.sr_rgb(rgb,f))
        if im.mode=='RGBA':
            A=im.split()[3].resize(o.size,Image.LANCZOS);o=o.convert('RGBA');o.putalpha(A);M[src]=save(o,88,True)
        else:M[src]=save(o,88,False)
    if n%5==0 or n==len(todo)-1:json.dump(M,open(mp,'w'))
    print(kind,n+1,'/',len(todo),round(time.time()-t0),'s',flush=True)
json.dump(M,open(mp,'w'));print('DONE',kind,flush=True)
