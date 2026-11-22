# Montagem do ALUCARD (v594): sid al (copiado do build_sung). Lógica de espadachim do Yuta (yt.js), sprites próprios. Uso (na pasta work/ com cut/): python3 ../build_sung.py [ai]
# "ai" = Real-ESRGAN anime (ferramentas/ia/esr.py) 2x antes de reduzir -> traço mais limpo e nítido.
import json,numpy as np,os,hashlib,sys,time
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image,ImageFilter,ImageEnhance
AI=len(sys.argv)>1 and sys.argv[1]=='ai';T0=time.time()
OUT='/home/claude/fui-do-templo-a-pk-2/www/a';TGT=290.0;RES=2.6
# v598: FORMA TRANSFORMADA (sid ald). Folhas f02..f15 do dono (f08 e f11 tinham números embaixo: apagados; f11 dividida em f11a/f11b).
U={'f02':690,'f03':520,'f04':545,'f05':610,'f06':572,'f07':495,'f08':500,'f09':520,'f10':550,'f11a':305,'f11b':285,'f12':598,'f13':528,'f14':515,'f15':528}
NF={'f02':5,'f03':5,'f04':5,'f05':5,'f06':5,'f07':6,'f08':6,'f09':6,'f10':6,'f11a':8,'f11b':8,'f12':5,'f13':6,'f14':6,'f15':6}
ROWS={t:1 for t in NF}
def G(t,ix):return [(t,i) for i in ix]
Y={'relax':G('f12',[0]*6),'gin':G('f09',[0]*5),'idle':G('f12',[0]*6),'walk':G('f02',[0,1,2,3,4,0,1,2]),'run':G('f04',[0,1,2,3,4,0,1,2]),
  'dashf':G('f03',[1,2,3,3,3,3,3,3]),'dash2':G('f04',[2,3,3,3,3,3,3,3]),'dashb':G('f05',[0,1,1,4,4,4,4,4]),'dodge':G('f05',[0,1,1,4,4,4,4,4]),
  'jab':G('f09',[0,2,3,3,3,4,5,5]),'cross':G('f09',[2,3,3,3,3,4,5,5]),'jab2':G('f07',[1,2,2,2,2,2,0,0]),'str':G('f08',[3,3,3,3,3,0,0,0]),
  'upper':G('f14',[1,2,3,3,3,4,5,5]),'kick':G('f14',[0,1,2,2,2,1,0,0]),'hkick':G('f14',[1,2,3,3,3,4,5,5]),'sweep':G('f15',[1,2,3,3,3,3,2,1]),
  'kick2':G('f14',[1,2,2,2,2,4,5,5]),'kick3':G('f14',[2,3,3,3,3,4,5,5]),
  'block':G('f10',[1,2,3,3,3,3,3,3]),'cblock':G('f15',[3,4,5,5,5,5,5,5]),'crouch':G('f15',[1,2,3,3,3,3,3,3]),
  'hit':G('f13',[0,1,1,1,1,0,0,0]),'hhit':G('f13',[1,2,2,2,2,1,0,0]),'launch':G('f13',[1,2,2,3,3,3]),'fall':G('f13',[4,4,5,5,5]),'drop':G('f13',[5,5,5]),
  'getup':G('f13',[5,4])+G('f15',[2,1])+G('f12',[0,0,0]),'win':G('f12',[0,1,2,2,2,2,2,2]),'lose':G('f13',[0,1,2,3,4,5,5,5]),
  'pw':G('f08',[0,4,4,4,4,4,4,4]),'ki1':G('f07',[0,1,2,3,3,3,3,4]),'ki2':G('f07',[3]*8),'seals':G('f10',[3]*8),'subst':G('f05',[0,1,2,3,4,4]),
  'palm':G('f09',[2,3,3,3,3,3,5,5]),'roxo':G('f14',[1,2,3,3,4,5]),'cmb':G('f11a',range(8))+G('f11b',range(8)),'cmb1':G('f11a',range(8))+G('f11b',range(8)),
  'jumpv':G('f05',[0,1,2,2,2,2,2,2]),'jumpd':G('f05',[0,1,2,2,2,2,2,2]),'hover':G('f05',[2]*6),'land':G('f05',[4]*8),
  'ajab':G('f05',[1])+G('f06',[1]*5)+G('f05',[2,2]),'akick':G('f05',[1])+G('f14',[3]*4)+G('f05',[2,2,2]),
  'rkY':G('f09',range(6)),'rka':G('f09',range(6)),'rkb':G('f09',range(6)),'rkp':G('f09',range(6)),'pose':G('f12',[2]),
  'sA':G('f07',[1,2,3,3,3,3,0,0]),'sB':G('f06',[0,1,1,1,1,1,0,0]),'sC':G('f06',[3,4,4,4,4,4,4,3]),'sD':G('f07',[4,5,5,5,5,5,4,4]),'sE':G('f11b',[3,4,5,5,6,6,7,7])}
AIR={'jumpv','jumpd','hover','ajab','akick'}
GL={}
for t in NF:
    per=NF[t]//ROWS[t]
    for r in range(ROWS[t]):GL[(t,r)]=max(np.load(f'cut/{t}_{i}.y.npy')[1] for i in range(r*per,(r+1)*per))
def gl(t,i):return GL[(t,i//(NF[t]//ROWS[t]))]
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=90,alpha_quality=92,method=6)
    return f'a/{h}.webp'
def anchor(a,air,lying,head=False):
    al=a[...,3]>140;ys=np.where(al.any(1))[0];top,bot=ys.min(),ys.max()
    if lying:return (np.where(al)[1]).mean()
    if air:hb=al[top:top+int((bot-top)*.2)];return np.where(hb)[1].mean()
    if head:  # v426 parado/andar: tronco (25-45% da altura) sem a espada azul -> personagem fixo, sem tremer
        m=al&~((a[...,2]-a[...,1]>25)&(a[...,2]>120));ys2=np.where(m.any(1))[0];t2,b2=ys2.min(),ys2.max();return np.median(np.where(m[t2+int((b2-t2)*.25):t2+int((b2-t2)*.45)])[1])
    band=al[int(top+(bot-top)*.55):int(top+(bot-top)*.75)];return np.median(np.where(band)[1]) if band.any() else a.shape[1]/2
# respiração do "parado" (v424: em pé com a espada no ombro, 19_0 — a 'melhorzinha' do dono) esticando de leve o tronco
def idle_img(i):
    im=Image.open('cut/f12_0.png');w,h=im.size;s=1+.012*np.sin(i/6*2*np.pi);hh=round(h*s);o=im.resize((w,hh),Image.LANCZOS);return o,hh-h
cache={};CF=f'cache_ald_{"ai" if AI else "fast"}.json'
if os.path.exists(CF):
    for k_,v_ in json.load(open(CF)).items():t_,i_,a_=k_.split(',');cache[(t_,int(i_),bool(int(a_)))]=v_
def frame(t,i,air):
    key=(t,i,air)
    if key in cache:return cache[key]
    if t=='id':
        y0,y1,x0,x1=np.load('cut/f12_0.y.npy');im,dh=idle_img(i);y0-=dh;tt,ii='f12',0
    else:
        y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');im=Image.open(f'cut/{t}_{i}.png');tt,ii=t,i
    a=np.asarray(im).astype(int);lying=False
    ax=anchor(a,air,lying,tt in ('f02',));ay=(y1-y0) if air else (gl(tt,ii)-y0)
    k=TGT/U[tt];gw,gh=im.width*k,im.height*k;W,H=round(gw*RES),round(gh*RES)
    o=(esr.sr_rgba(im,2) if AI else im).resize((W,H),Image.LANCZOS)
    if AI:o=o.filter(ImageFilter.UnsharpMask(radius=1.0,percent=45,threshold=2))
    al=a[...,3]>40;cols=np.where(al.any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-4):rx+1].any(1))[0].mean()
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(ax*k,1),'ay':round(ay*k,1),'rx':round((rx-ax)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[key]=fr
    if len(cache)%5==0:
        print(t,i,len(cache),round(time.time()-T0),flush=True);json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
    return fr
J={'ald':{an:[frame(t,i,an in AIR) for t,i in L] for an,L in Y.items()}}
json.dump(J,open('../build/ald_ai.json' if AI else '../build/ald_fast.json','w'),separators=(',',':'))
json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
print('DONE',len(cache),round(time.time()-T0))
