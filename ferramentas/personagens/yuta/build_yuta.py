# Montagem do Yuta (v239): sid yt (normal) e ytd (despertar, mesmas poses + combos com a Rika). Uso: python3 build_yuta.py [ai]  (rodar na pasta com cut/)
import json,numpy as np,os,hashlib,sys,time
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image,ImageFilter
AI=len(sys.argv)>1 and sys.argv[1]=='ai';T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
TGT=285.0;RES=2.6
# altura "em pé" equivalente de cada folha (px da folha)
U={'01':720,'03':735,'05':443,'06':446,'07':418,'08':430,'09':312,'10':392,'11':438,'12':430,'13':470,'14':430,'15':450,'16':410,'17':423,'18':320,'19':320,'20':323}
def G(t,ix):return [(t,i) for i in ix]
Y={'relax':G('19',[0]*8),'gin':G('19',[0,0,1,2,3]),'idle':G('01',range(6)),'walk':G('03',[0,1,1,2,3,4,4,5]),'run':G('05',[1,2,2,2,2,2,2,2]),
  'dashf':G('05',[0,1,2,3,3,2,2,2]),'dash2':G('05',[1,2,3,4,4,3,2,2]),'dashb':G('10',[0,1,2,3,4,5,5,5]),'dodge':G('10',[0,1,2,3,4,5,5,5]),
  'jab':G('07',[0,1,2,2,2,4,5,5]),'cross':G('08',[0,1,2,2,2,5,5,5]),'jab2':G('08',[2,3,3,4,4,4,5,5]),'str':G('07',[0,3,3,4,4,4,5,5]),
  'upper':G('11',[0,1,2,2,3,3,5,5]),'kick':G('16',[0,1,2,2,2,1,0,0]),'hkick':G('16',[1,3,3,3,3,6,0,0]),'sweep':G('16',[4,5,5,5,5,5,7,7]),
  'kick2':G('17',[0,1,2,2,2,6,6,7]),'kick3':G('17',[3,4,5,5,5,6,7,7]),
  'block':G('11',[0,4,4,4,4,4,4,4]),'cblock':G('14',[4]*8),'crouch':G('14',[0,1,6,6,6,6,6,6]),
  'hit':G('12',[0,1,2,2,1,1,0,0]),'hhit':G('12',[1,2,3,3,4,4,0,0]),'launch':G('12',[2,3,3])+G('13',[0,0,1,1,1]),'fall':G('13',[1,2,2,3,3]),'drop':G('13',[5,6,7]),
  'getup':G('13',[7,5,4])+G('12',[5,6,7])+G('01',[0,0]),'win':G('19',[0]*8),'lose':G('13',range(8)),
  'pw':G('15',range(8)),'ki1':G('05',[1,2,3])+G('09',[6,6,6,7,7]),'ki2':G('07',[0,1,2,2,2,2,5,5]),'seals':G('15',[4]*8),'subst':G('10',range(6)),
  'palm':G('06',[0,1,2,3,3,4,4,5]),'roxo':G('06',[0,1,2,3,4,5]),'cmb':G('18',range(16)),'cmb1':G('18',range(16)),
  'jumpv':G('09',[0,1,2,3,3,3,3,3]),'jumpd':G('09',[0,1,2,3,3,3,3,3]),'hover':G('09',[3,3,3,3,3,3]),'land':G('09',[6,7,7,7,7,7,7,7]),
  'ajab':G('09',[3])+G('09',[4,4,4,4])+G('09',[5,5,5]),'akick':G('09',[3])+G('16',[2,2,2,2])+G('09',[3,3,3]),
  # Rika: rkY = Yuta (folha 19, parte dele), rka = Rika soca (19), rkb = Rika sai do chão e ataca (20), rkp = soco rápido da Rika (ajuda)
  'rkY':G('19',range(1,8)),'rka':G('19',range(8,15)),'rkb':G('20',[1,2,3,4,5,6,7,8,9,10,12,13,14,15]),'rkp':G('19',[9,10,11,12,13,14])}
AIR={'jumpv','jumpd','hover','ajab','akick'}
NF={t:(16 if t in('18','19','20') else 8 if t in('09','12','13','14','15','16','17') else 6) for t in U}
ROWS={t:(1 if t in('01','03','05') else 2) for t in U}
GL={}
for t in U:
    per=NF[t]//ROWS[t]
    for r in range(ROWS[t]):GL[(t,r)]=max(np.load(f'cut/{t}_{i}.y.npy')[1] for i in range(r*per,(r+1)*per))
def gl(t,i):return GL[(t,i//(NF[t]//ROWS[t]))]
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=90,alpha_quality=92,method=6)
    return f'a/{h}.webp'
def anchor(a,air,lying,rika):
    al=a[...,3]>140;ys=np.where(al.any(1))[0];top,bot=ys.min(),ys.max()
    if lying or rika:return (np.where(al)[1]).mean()
    if air:hb=al[top:top+int((bot-top)*.2)];return np.where(hb)[1].mean()
    band=al[int(top+(bot-top)*.55):int(top+(bot-top)*.75)];return np.median(np.where(band)[1]) if band.any() else a.shape[1]/2
cache={}
CF=f'cache_{"ai" if AI else "fast"}.json'
if os.path.exists(CF):
    for k_,v_ in json.load(open(CF)).items():t_,i_,a_=k_.split(',');cache[(t_,int(i_),bool(int(a_)))]=v_
def frame(t,i,air,rika=False):
    key=(t,i,air)
    if key in cache:return cache[key]
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');im=Image.open(f'cut/{t}_{i}.png');a=np.asarray(im).astype(int)
    lying=t=='13' and i>=3
    ax=anchor(a,air,lying,rika);ay=(y1-y0) if air else (gl(t,i)-y0)
    k=TGT/U[t];gw,gh=im.width*k,im.height*k;W,H=round(gw*RES),round(gh*RES)
    o=(esr.sr_rgba(im,2) if AI else im).resize((W,H),Image.LANCZOS)
    if AI:o=o.filter(ImageFilter.UnsharpMask(radius=1.0,percent=40,threshold=2))
    al=a[...,3]>40;cols=np.where(al.any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-4):rx+1].any(1))[0].mean()
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(ax*k,1),'ay':round(ay*k,1),'rx':round((rx-ax)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[key]=fr
    if AI and len(cache)%5==0:
        print(t,i,len(cache),round(time.time()-T0),flush=True);json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
    return fr
J={'yt':{an:[frame(t,i,an in AIR,an in('rka','rkb','rkp')) for t,i in L] for an,L in Y.items()}}
J['ytd']=dict(J['yt']);J['ytd']['cmb']=J['yt']['rkY']+J['yt']['rka'];J['ytd']['cmb1']=J['yt']['rkb']
json.dump(J,open('yt_ai.json' if AI else 'yt_fast.json','w'),separators=(',',':'))
json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
print('DONE',len(cache),round(time.time()-T0))
