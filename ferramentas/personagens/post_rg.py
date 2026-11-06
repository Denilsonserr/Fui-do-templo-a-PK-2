# acrescenta ao JSON do Rengoku: 'fl' (camada so do fogo desenhado, para piscar) e 'fp' (pontos de fogo para fagulhas)
import json,sys,numpy as np,hashlib,os
from PIL import Image
from scipy import ndimage as nd
sys.argv=[sys.argv[0]]+sys.argv[1:]
src=sys.argv[1];dst=sys.argv[2];OUT=sys.argv[3]
exec(open('build_rengoku.py').read().split("AIR=")[0].split("SW=json.load")[0].replace("import json","import json"))
S=json.load(open('S.json'));S.update({'r07':450,'r13':465,'r16':514,'r15':395,'r17':624,'r06':496})
A=eval(open('build_rengoku.py').read().split("A={",1)[1].split("\nAIR=")[0].join(['{','']) ) if False else None
code=open('build_rengoku.py').read();ns={'json':json};exec(code[code.find('def G('):code.find('AIR=')],ns);A=ns['A']
from firepts import pts,FR
FRS={f'{t}_{i}' for t,i in FR}
J=json.load(open(src))
def layer(t,i,w,h):
    a=np.asarray(Image.open(f'cut/{t}_{i}.png')).astype(float);r,g,b,al=[a[...,c] for c in range(4)]
    lum=(r+g+b)/3;dark=(lum<90)&(al>120);near=nd.binary_dilation(dark,iterations=3)
    m=((r>215)&(g>80)&(b<160)&(al>50)&~near).astype(float);m=nd.gaussian_filter(m,1.2)
    o=np.dstack([r,g*.92,b*.7,np.clip(m*al,0,255)]).clip(0,255).astype(np.uint8)
    im=Image.fromarray(o,'RGBA').resize((max(1,round(w*1.3)),max(1,round(h*1.3))),Image.LANCZOS)
    hh=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{hh}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=80,alpha_quality=80)
    return f'a/{hh}.webp'
n=0;memo={}
for an,L in A.items():
    for k,(t,i) in enumerate(L):
        key=f'{t}_{i}'
        if key not in FRS:continue
        F=J['rg'][an][k]
        if key not in memo:
            y0,y1,x0,x1=np.load(f'cut/{key}.y.npy');kk=F['w']/(x1-x0)
            slot=F['ax']/kk;ay=F['ay']/kk
            P=pts(t,i,24);memo[key]=(layer(t,i,F['w'],F['h']),[[round((x-slot)*kk),round((ay-y)*kk)] for x,y in P])
        F['fl'],F['fp']=memo[key];n+=1
json.dump(J,open(dst,'w'),separators=(',',':'));print('ok',n,len(memo))
