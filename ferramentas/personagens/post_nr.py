# Modo Kurama: camada só das chamas laranja desenhadas (fl) + pontos de fagulha (fp) em cada quadro do nrk.
import json,sys,numpy as np,hashlib,os
from PIL import Image
from scipy import ndimage as nd
src,dst,OUT=sys.argv[1],sys.argv[2],sys.argv[3]
code=open('build_naruto.py').read();ns={'json':json};exec(code[code.find('def G('):code.find('AIR=')],ns);A=ns['A']
J=json.load(open(src));memo={};rng=np.random.default_rng(5)
def layer(t,i,w,h):
    a=np.asarray(Image.open(f'cut/{t}_{i}.png')).astype(float);r,g,b,al=[a[...,c] for c in range(4)]
    m=((r>215)&(g>95)&(g<205)&(b<75)&(al>60)).astype(float);m=nd.gaussian_filter(m,1.2)
    o=np.dstack([r,g*.9,b*.5,np.clip(m*al,0,255)]).clip(0,255).astype(np.uint8)
    im=Image.fromarray(o,'RGBA').resize((max(1,round(w*1.3)),max(1,round(h*1.3))),Image.LANCZOS)
    hh=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{hh}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=78,alpha_quality=80)
    ys,xs=np.where(m>.5)
    pts=[] if not len(xs) else [[int(xs[j]),int(ys[j])] for j in rng.choice(len(xs),min(24,len(xs)),replace=False)]
    return f'a/{hh}.webp',pts
n=0
for an,L in A['nrk'].items():
    for k,(t,i) in enumerate(L):
        F=J['nrk'][an][k];key=f'{t}_{i}'
        if key not in memo:
            y0,y1,x0,x1=np.load(f'cut/{key}.y.npy');kk=F['w']/(x1-x0);slot=F['ax']/kk;ay=F['ay']/kk
            fl,P=layer(t,i,F['w'],F['h']);memo[key]=(fl,[[round((x-slot)*kk),round((ay-y)*kk)] for x,y in P])
        F['fl'],F['fp']=memo[key];n+=1
json.dump(J,open(dst,'w'),separators=(',',':'));print('ok',n,len(memo))
