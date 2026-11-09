# v258: camada "neon" da noite (letreiros e telões acendem) para cada nível do Shibuya → campo 'win' do shib.json
import numpy as np,json,hashlib,os,sys
from PIL import Image
from scipy import ndimage as nd
D='/home/claude/shib';J=os.path.join(os.path.dirname(os.path.abspath(__file__)),'shib.json');OUT='/home/claude/fui-do-templo-a-pk-2/www/a'
R=json.load(open(J))
def save(im):
    b=im.tobytes();h=hashlib.md5(b).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=82,alpha_quality=85,method=6)
    return f'a/{h}.webp'
for n in range(6):
    o=np.asarray(Image.open(f'{D}/L{n}.png').convert('RGB').resize((2172,724))).astype(float);r,g,b=o[...,0],o[...,1],o[...,2]
    mx=o.max(2);mn=o.min(2);sat=(mx-mn)/(mx+1);Y=np.mgrid[0:724,0:2172][0]
    neon=(sat>.45)&(mx>150)&(Y<560)&~((r>200)&(g>70)&(g<200)&(b<90)&(n>=2))   # letreiros coloridos (sem o fogo)
    lit=(mx>215)&(mn>170)&(Y<560)&(Y>120)                                  # partes brancas dos letreiros/janelas
    bl=(b>r+25)&(b>=g-10)|(mn>175)&(mx-mn<40)            # céu azul e nuvens
    lab,_=nd.label(bl);sky=np.isin(lab,list(set(np.unique(lab[0]))-{0}));sky=nd.binary_dilation(sky,iterations=6)
    m=nd.binary_opening((neon|lit)&~sky,iterations=1)
    if n>=4:m&=(Y>9999)  # tudo destruído: sem neon
    a=np.clip(nd.gaussian_filter(m.astype(float),2.2)*1.6,0,1)*255
    col=np.clip(o*1.15,0,255)
    R['L'][n]['win']=save(Image.fromarray(np.dstack([col,a]).astype(np.uint8),'RGBA')) if m.sum()>500 else None
    print(n,int(m.sum()))
json.dump(R,open(J,'w'),indent=1)
