import json,os,sys,time,hashlib,io
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
import esr
HERE=os.path.dirname(os.path.abspath(__file__));WWW='/home/claude/fui-do-templo-a-pk-2/www/'
OUT=HERE+'/out';os.makedirs(OUT,exist_ok=True)
mp=HERE+'/map.json';M=json.load(open(mp)) if os.path.exists(mp) else {}
def save(im,q,alpha):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,alpha_quality=92 if alpha else 100,method=5);d=b.getvalue()
    h=hashlib.md5(d).hexdigest()[:14];open(f'{OUT}/{h}.webp','wb').write(d);return f'a/{h}.webp'
kind=sys.argv[1]
jobs=json.load(open(HERE+('/jobs_spr.json' if kind=='spr' else '/jobs_st.json')))
RAT=json.load(open(HERE+'/rat.json')) if os.path.exists(HERE+'/rat.json') else {}
t0=time.time()
for n,src in enumerate(jobs):
    if src in M:continue
    im=Image.open(WWW+src)
    if kind=='spr':
        o=esr.sr_rgba(im,2)
        r=1.6/RAT.get(src,1.0)  # alvo: 1.6x a resolução de exibição (igual Denilson/Lin)
        o=o.resize((round(im.size[0]*r),round(im.size[1]*r)),Image.LANCZOS);M[src]=save(o,88,True)
    else:
        rgb=np.asarray(im.convert('RGB'));o=Image.fromarray(esr.sr_rgb(rgb,1.5));M[src]=save(o,86,False)
    json.dump(M,open(mp,'w'))
    print(kind,n+1,'/',len(jobs),round(time.time()-t0),'s',flush=True)
print('DONE',kind,flush=True)
