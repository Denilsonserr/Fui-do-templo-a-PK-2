# Montagem do ALUCARD (v594): sid al (copiado do build_sung). Lógica de espadachim do Yuta (yt.js), sprites próprios. Uso (na pasta work/ com cut/): python3 ../build_sung.py [ai]
# "ai" = Real-ESRGAN anime (ferramentas/ia/esr.py) 2x antes de reduzir -> traço mais limpo e nítido.
import json,numpy as np,os,hashlib,sys,time
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image,ImageFilter,ImageEnhance
AI=len(sys.argv)>1 and sys.argv[1]=='ai';T0=time.time()
OUT='/home/claude/fui-do-templo-a-pk-2/www/a';TGT=290.0;RES=2.6
# altura "em pé" equivalente de cada folha (px da folha)
U={'01':538,'02':528,'03':533,'04':535,'05':588,'06':521,'07':650,'08':1300,'09':570,'10':580,'11':470,'12':477,'13a':280,'13b':280}
NF={'01':6,'02':6,'03':6,'04':6,'05':6,'06':6,'07':6,'08':1,'09':4,'10':4,'11':6,'12':6,'13a':8,'13b':8}
ROWS={t:2 if t=='07' else 1 for t in NF}
def G(t,ix):return [(t,i) for i in ix]
# v594: ALUCARD (sid al). Pistoleiro rápido: socos (04), tiros (03), chutes com a arma (05), rasteira atirando (12), super combo numerado (13a+13b).
Y={'relax':G('01',[0]*6),'gin':G('04',[0]*5),'idle':G('03',[0]*6),'walk':G('02',[0,1,2,3,4,5,0,1]),'run':G('09',[0,1,2,3,0,1,2,3]),
  'dashf':G('09',[1,2,3,3,3,3,3,3]),'dash2':G('09',[2,3,3,3,3,3,3,3]),'dashb':G('10',[0,1,1,3,3,3,3,3]),'dodge':G('10',[0,1,1,3,3,3,3,3]),
  'jab':G('04',[0,2,3,3,3,4,5,5]),'cross':G('04',[2,3,3,3,3,4,5,5]),'jab2':G('03',[1,2,4,4,4,4,5,5]),'str':G('03',[2,3,3,3,3,4,5,5]),
  'upper':G('05',[1,2,3,3,3,4,5,5]),'kick':G('05',[0,1,2,2,2,1,0,0]),'hkick':G('05',[1,2,3,3,3,4,5,5]),'sweep':G('12',[1,2,3,4,4,4,5,5]),
  'kick2':G('05',[1,2,2,2,2,4,5,5]),'kick3':G('05',[2,3,3,3,3,4,5,5]),
  'block':G('06',[1,2,3,3,3,3,3,3]),'cblock':G('07',[0,1,1,1,1,1,1,1]),'crouch':G('12',[1,2,2,2,2,2,2,2]),
  'hit':G('11',[0,1,1,1,1,0,0,0]),'hhit':G('11',[1,2,2,2,2,1,0,0]),'launch':G('11',[1,2,2,3,3,3]),'fall':G('11',[3,3,4,4,4]),'drop':G('11',[5,5,5]),
  'getup':G('11',[4,4])+G('12',[5,5,2])+G('03',[0,0]),'win':G('07',[1]*8),'lose':G('11',[0,1,2,3,4,5,5,5]),
  'pw':G('06',[0,1,2,3,4,5,5,5]),'ki1':G('03',[1,2,3,4,4,4,4,5]),'ki2':G('03',[4]*8),'seals':G('07',[0]*8),'subst':G('10',[0,1,2,3,3,3]),
  'palm':G('04',[2,3,3,3,3,3,5,5]),'roxo':G('05',[1,2,3,3,4,5]),'cmb':G('13a',range(8))+G('13b',range(8)),'cmb1':G('13a',range(8))+G('13b',range(8)),
  'jumpv':G('10',[0,1,2,2,2,2,2,2]),'jumpd':G('10',[0,1,2,2,2,2,2,2]),'hover':G('10',[2]*6),'land':G('10',[3]*8),
  'ajab':G('10',[1])+G('03',[4,4,4,4,4])+G('10',[2,2]),'akick':G('10',[1])+G('05',[3,3,3,3])+G('10',[2,2,2]),
  'rkY':G('04',range(6)),'rka':G('04',range(6)),'rkb':G('04',range(6)),'rkp':G('04',range(6)),'pose':G('08',[0])}
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
    im=Image.open('cut/03_0.png');w,h=im.size;s=1+.012*np.sin(i/6*2*np.pi);hh=round(h*s);o=im.resize((w,hh),Image.LANCZOS);return o,hh-h
cache={};CF=f'cache_{"ai" if AI else "fast"}.json'
if os.path.exists(CF):
    for k_,v_ in json.load(open(CF)).items():t_,i_,a_=k_.split(',');cache[(t_,int(i_),bool(int(a_)))]=v_
def frame(t,i,air):
    key=(t,i,air)
    if key in cache:return cache[key]
    if t=='id':
        y0,y1,x0,x1=np.load('cut/03_0.y.npy');im,dh=idle_img(i);y0-=dh;tt,ii='03',0
    else:
        y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');im=Image.open(f'cut/{t}_{i}.png');tt,ii=t,i
    a=np.asarray(im).astype(int);lying=(tt=='11' and ii>=4)
    ax=anchor(a,air,lying,tt in ('01','02'));ay=(y1-y0) if air else (gl(tt,ii)-y0)
    k=TGT/U[tt];gw,gh=im.width*k,im.height*k;W,H=round(gw*RES),round(gh*RES)
    o=(esr.sr_rgba(im,2) if AI else im).resize((W,H),Image.LANCZOS)
    if AI:o=o.filter(ImageFilter.UnsharpMask(radius=1.0,percent=45,threshold=2))
    al=a[...,3]>40;cols=np.where(al.any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-4):rx+1].any(1))[0].mean()
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(ax*k,1),'ay':round(ay*k,1),'rx':round((rx-ax)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[key]=fr
    if len(cache)%5==0:
        print(t,i,len(cache),round(time.time()-T0),flush=True);json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
    return fr
J={'al':{an:[frame(t,i,an in AIR) for t,i in L] for an,L in Y.items()}}
json.dump(J,open('../build/al_ai.json' if AI else '../build/al_fast.json','w'),separators=(',',':'))
json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
print('DONE',len(cache),round(time.time()-T0))
