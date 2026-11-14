# Montagem do Sung (v421): sid sj. Lógica de espadachim do Yuta (yt.js), sprites próprios. Uso (na pasta work/ com cut/): python3 ../build_sung.py [ai]
# "ai" = Real-ESRGAN anime (ferramentas/ia/esr.py) 2x antes de reduzir -> traço mais limpo e nítido.
import json,numpy as np,os,hashlib,sys,time
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image,ImageFilter,ImageEnhance
AI=len(sys.argv)>1 and sys.argv[1]=='ai';T0=time.time()
OUT='/home/claude/fui-do-templo-a-pk-2/www/a';TGT=290.0;RES=2.6
# altura "em pé" equivalente de cada folha (px da folha)
U={'01':690,'02':515,'03':600,'04':610,'05':390,'06':380,'07':460,'08':460,'09':490,'10':500,'11':480,'12':560,'13':540,'14':510,'15':655,'16':535,'17':575,'18':470,'19':590,'20':625}
NF={t:6 for t in U};NF.update({'13':5,'14':5,'15':5,'19':5,'20':5})
ROWS={t:2 if t in('05','06') else 1 for t in NF}
def G(t,ix):return [(t,i) for i in ix]
# v423: folhas novas do dono (estilo novo, olhos azuis). Escolha das melhores para cada movimento.
Y={'relax':G('20',[0,1,2,3,4,3]),'idle2':G('20',range(5)),'gin':G('19',[0]*6),'saca':G('03',range(6)),'idle':[('id',i) for i in range(6)],'walk':G('19',[0,1,2,3,4,1,2,3]),'run':G('11',[0,1,2,3,3,4,5,5]),
  'dashf':G('09',[1,2,3,4,4,5,5,5]),'dash2':G('09',[2,3,4,4,4,5,5,5]),'dashb':G('02',[0,1,1,5,5,5,5,5]),'dodge':G('02',[0,1,1,5,5,5,5,5]),
  'jab':G('05',[0,1,1,1,1,1,5,5]),'cross':G('05',[5,4,4,4,4,4,5,5]),'jab2':G('05',[0,2,2,2,2,2,5,5]),'str':G('14',[1,2,3,3,3,4,4,4]),
  'upper':G('06',[0,4,4,4,4,4,5,5]),'kick':G('08',[0,1,2,2,2,1,0,0]),'hkick':G('07',[1,3,3,3,3,4,5,5]),'sweep':G('16',[1,2,3,4,4,4,5,5]),
  'kick2':G('07',[0,2,3,3,3,4,5,5]),'kick3':G('08',[0,3,4,4,4,4,5,5]),
  'block':G('04',[2,3,4,4,4,4,4,4]),'cblock':G('12',[2,3,3,3,3,3,3,3]),'crouch':G('12',[0,1,1,1,1,1,1,1]),
  'hit':G('10',[0,1,1,1,1,0,0,0]),'hhit':G('10',[1,2,2,2,2,1,0,0]),'launch':G('10',[1,2,2,3,3,3]),'fall':G('10',[3,3,4,4,4]),'drop':G('10',[5,5,5]),
  'getup':G('10',[4,4])+G('12',[1,1,0])+G('04',[5,5]),'win':G('03',[5]*8),'lose':G('10',[0,1,2,3,4,5,5,5]),
  'pw':G('04',[0,1,2,3,4,5,5,5]),'ki1':G('09',[1,2,3,4])+G('06',[2,2,2,2]),'ki2':G('14',[0,1,2,2,3,3,4,4]),'seals':G('04',[5]*8),'subst':G('02',range(6)),
  'palm':G('05',[0,1,1,2,2,2,5,5]),'roxo':G('05',range(6)),'cmb':G('14',[0,1,2,3,4])+G('05',[0,1,2,3,4,5])+G('07',[1,2,3,4,5]),'cmb1':G('06',range(6))+G('05',range(6))+G('07',[3,4,5,5]),
  'jumpv':G('02',[0,1,2,3,3,3,3,3]),'jumpd':G('02',[0,1,2,3,3,3,3,3]),'hover':G('02',[3]*6),'land':G('02',[5]*8),
  'ajab':G('02',[2])+G('05',[3,3,3,3,3])+G('02',[4,4]),'akick':G('02',[3])+G('08',[3,3,3,3])+G('02',[4,4,4]),
  'rkY':G('05',range(6)),'rka':G('06',range(6)),'rkb':G('05',range(6)),'rkp':G('06',[0,1,2,3,4,5])}
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
def anchor(a,air,lying):
    al=a[...,3]>140;ys=np.where(al.any(1))[0];top,bot=ys.min(),ys.max()
    if lying:return (np.where(al)[1]).mean()
    if air:hb=al[top:top+int((bot-top)*.2)];return np.where(hb)[1].mean()
    band=al[int(top+(bot-top)*.55):int(top+(bot-top)*.75)];return np.median(np.where(band)[1]) if band.any() else a.shape[1]/2
# respiração do "parado" (v424: em pé com a espada no ombro, 19_0 — a 'melhorzinha' do dono) esticando de leve o tronco
def idle_img(i):
    im=Image.open('cut/19_0.png');w,h=im.size;s=1+.012*np.sin(i/6*2*np.pi);hh=round(h*s);o=im.resize((w,hh),Image.LANCZOS);return o,hh-h
cache={};CF=f'cache_{"ai" if AI else "fast"}.json'
if os.path.exists(CF):
    for k_,v_ in json.load(open(CF)).items():t_,i_,a_=k_.split(',');cache[(t_,int(i_),bool(int(a_)))]=v_
def frame(t,i,air):
    key=(t,i,air)
    if key in cache:return cache[key]
    if t=='id':
        y0,y1,x0,x1=np.load('cut/19_0.y.npy');im,dh=idle_img(i);y0-=dh;tt,ii='19',0
    else:
        y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');im=Image.open(f'cut/{t}_{i}.png');tt,ii=t,i
    a=np.asarray(im).astype(int);lying=(tt=='10' and ii>=3)
    ax=anchor(a,air,lying);ay=(y1-y0) if air else (gl(tt,ii)-y0)
    k=TGT/U[tt];gw,gh=im.width*k,im.height*k;W,H=round(gw*RES),round(gh*RES)
    o=(esr.sr_rgba(im,2) if AI else im).resize((W,H),Image.LANCZOS)
    if AI:o=o.filter(ImageFilter.UnsharpMask(radius=1.0,percent=45,threshold=2))
    al=a[...,3]>40;cols=np.where(al.any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-4):rx+1].any(1))[0].mean()
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(ax*k,1),'ay':round(ay*k,1),'rx':round((rx-ax)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[key]=fr
    if len(cache)%5==0:
        print(t,i,len(cache),round(time.time()-T0),flush=True);json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
    return fr
J={'sj':{an:[frame(t,i,an in AIR) for t,i in L] for an,L in Y.items()}}
json.dump(J,open('../build/sj_ai.json' if AI else '../build/sj_fast.json','w'),separators=(',',':'))
json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
print('DONE',len(cache),round(time.time()-T0))
