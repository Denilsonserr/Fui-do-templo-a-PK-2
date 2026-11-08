# Montagem do Garou (v193): sid gr (normal, folhas gNN + combos c01/c02) e grm (monstro, tNN + c03). Uso: python3 build_garou.py [ai]
import json,numpy as np,os,hashlib,sys,time
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image,ImageFilter
AI=len(sys.argv)>1 and sys.argv[1]=='ai';T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
TGT=282.0;TGTM=300.0;RES=2.6
# altura "em pé" equivalente de cada folha (px da folha) = altura medida / fator da pose do quadro de referência
U={'g01':682,'g02':703,'g03':566/.85,'g04':551/.92,'g05':580/.92,'g06':600/.92,'g07':609/.92,'g08':581/.92,'g09':560/.92,'g10':592/.92,'g11':557/.92,
   'g12':666/.97,'g13':663/.97,'g14':638/.92,'g15':577/.92,'g16':622/.92,'g17':622/.92,'g18':654/.95,'g19':646/.97,'g20':654/.95,'c01':327/.92,'c02':329/.92,
   't01':657,'t02':551/.82,'t03':534/.82,'t04':518/.82,'t05':520/.82,'t06':663,'t07':563/.86,'t08':416/.66,'t09':425/.66,'t10':656,'t11':506/.78,'t12':389/.62,
   't13':491/.76,'t14':564/.86,'t15':457/.7,'t16':616/.97,'c03':327/.82}
def G(t,ix):return [(t,i) for i in ix]
A={'gr':{'relax':G('g01',[0]*8),'gin':G('g19',[0,1,2,3,4]),'idle':G('g01',range(6)),'walk':G('g02',[0,1,1,2,3,4,4,5]),'run':G('g03',[0,1,2,2,3,4,5,5]),
  'dashf':G('g04',[0,1,2,3,3,4,4,5]),'dash2':G('g15',[0,1,2,3,3,4,4,5]),'dashb':G('g14',[0,1,2,3,3,4,4,5]),'dodge':G('g14',[0,1,2,3,3,4,4,5]),
  'jab':G('g06',[0,1,2,3,3,4,5,5]),'cross':G('g07',[0,1,1,2,2,3,3,0]),'str':G('g08',[2,3,3,4,4,4,5,5]),'upper':G('g09',[0,1,2,3,4,5,5,5]),
  'jab2':G('g07',[3,3,4,4,4,5,5,0]),'kick':G('g10',[0,1,2,2,2,3,0,0]),'hkick':G('g10',[0,3,3,4,4,4,5,5]),'sweep':G('g11',[0,1,2,3,3,4,4,5]),
  'block':G('g12',[1,2,3,3,3,3,3,3]),'cblock':G('g13',[3]*8),'crouch':G('g13',[0,1,2,3,3,3,3,3]),
  'hit':G('g18',[0,1,2,2,1,1,0,0]),'hhit':G('g18',[0,1,2,3,3,2,1,0]),'launch':G('g18',[2,3,3])+G('g20',[0,0,1,1,1]),'fall':G('g20',[1,2,2,3,3]),'drop':G('g20',[3,4,5]),
  'getup':G('g20',[5,4,3])+G('g13',[3,2,1])+G('g01',[0,0]),'win':G('g19',[0,1,2,3,3,3,3,3]),'lose':G('g20',[0,1,2,3,4,5,5,5]),
  'pw':G('g19',[1,2,3,3,4,4,3,3]),'ki1':G('g07',[0,1,2,3,4,4,5,0]),'ki2':G('g06',[0,1,2,3,3,4,5,5]),'seals':G('g19',[2]*8),'subst':G('g14',range(6)),
  'palm':G('g09',[0,1,2,3,4,4,5,5]),'cmb':G('c02',range(16)),'cmb1':G('c01',range(16)),
  'jumpv':G('g16',[0,1,2,3,3,3,3,3]),'jumpd':G('g16',[0,1,2,3,3,3,3,3]),'hover':G('g16',[3,3,4,4,3,3]),'land':G('g17',[2,3,3,4,4,5,5,5]),
  'ajab':G('g16',[3])+G('g07',[2,2,2,2])+G('g16',[4,4,4]),'akick':G('g16',[3])+G('g10',[4,4,4,4])+G('g16',[4,4,4])},
 'grm':{'relax':G('t01',[0]*8),'gin':G('t16',[0,1,2,3,4]),'idle':G('t01',range(6)),'walk':G('t08',[0,0,1,1,2,2,3,3]),'run':G('t09',[0,1,2,3,3,4,5,5]),
  'dashf':G('t09',[0,1,2,3,3,4,5,5]),'dash2':G('t08',[0,1,2,3,3,4,5,5]),'dashb':G('t12',[0,1,2,2,3,3,4,5]),'dodge':G('t12',[0,1,2,2,3,3,4,5]),
  'jab':G('t03',[0,1,2,3,3,4,5,5]),'cross':G('t02',[0,1,2,3,3,4,5,5]),'str':G('t04',[0,1,2,5,5,5,5,0]),'upper':G('t04',[0,3,3,4,4,4,0,0]),
  'jab2':G('t04',[1,2,2,2,2,0,0,0]),'kick':G('t05',[0,1,2,3,3,3,5,5]),'hkick':G('t05',[0,1,2,4,4,4,5,5]),'sweep':G('t11',[0,1,2,3,4,4,5,5]),
  'block':G('t06',[1,2,3,3,4,4,4,4]),'cblock':G('t07',[4]*8),'crouch':G('t07',[0,1,2,3,3,4,4,4]),
  'hit':G('t14',[0,1,2,2,1,1,0,0]),'hhit':G('t14',[0,1,2,3,4,4,2,0]),'launch':G('t14',[3,4,4])+G('t15',[1,1,2,2,2]),'fall':G('t15',[2,3,3,4,4]),'drop':G('t15',[4,5,5]),
  'getup':G('t15',[5,4,3])+G('t07',[3,2,1])+G('t01',[0,0]),'win':G('t16',[0,1,2,3,4,5,5,5]),'lose':G('t15',[0,1,2,3,4,5,5,5]),
  'pw':G('t10',[0,1,2,3,4,5,5,5]),'ki1':G('t03',[0,1,2,3,3,4,5,0]),'ki2':G('t02',[0,1,2,3,3,4,5,5]),'seals':G('t10',[5]*8),'subst':G('t12',range(6)),
  'palm':G('t02',[0,1,2,3,3,4,5,5]),'cmb':G('c03',range(16)),'cmb1':G('c03',range(16)),
  'jumpv':G('t13',[1,2,3,3,4,4,4,4]),'jumpd':G('t13',[1,2,3,3,4,4,4,4]),'hover':G('t13',[3,3,4,4,3,3]),'land':G('t13',[5]*8),
  'ajab':G('t13',[3])+G('t03',[3,3,3,3])+G('t13',[4,4,4]),'akick':G('t13',[3])+G('t05',[4,4,4,4])+G('t13',[4,4,4])}}
AIR={'jumpv','jumpd','hover','ajab','akick'}
NF={t:(16 if t[0]=='c' else 6) for t in U}
GL={}
for t in U:
    per=NF[t]//(2 if t[0]=='c' else 1)
    for r in range(NF[t]//per):GL[(t,r)]=max(np.load(f'cut/{t}_{i}.y.npy')[1] for i in range(r*per,(r+1)*per))
def gl(t,i):return GL[(t,i//8)] if t[0]=='c' else GL[(t,0)]
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=90,alpha_quality=92,method=6)
    return f'a/{h}.webp'
def anchor(a,air,lying):
    al=a[...,3]>140;ys=np.where(al.any(1))[0];top,bot=ys.min(),ys.max()
    if lying:return (np.where(al)[1]).mean()
    if air:hb=al[top:top+int((bot-top)*.2)];return np.where(hb)[1].mean()
    band=al[int(top+(bot-top)*.55):int(top+(bot-top)*.75)];return np.median(np.where(band)[1]) if band.any() else a.shape[1]/2
cache={}
CF=f'cache_{"ai" if AI else "fast"}.json'
if os.path.exists(CF):
    for k_,v_ in json.load(open(CF)).items():t_,i_,a_=k_.split(',');cache[(t_,int(i_),bool(int(a_)))]=v_
def sharpen(o):  # traço mais firme no monstro
    return o.filter(ImageFilter.UnsharpMask(radius=1.2,percent=55,threshold=2))
def frame(t,i,air,mon):
    key=(t,i,air)
    if key in cache:return cache[key]
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');im=Image.open(f'cut/{t}_{i}.png');a=np.asarray(im).astype(int)
    lying=t in('g20','t15') and i>=2
    ax=anchor(a,air,lying);ay=(y1-y0) if air else (gl(t,i)-y0)
    k=(TGTM if mon else TGT)/U[t];gw,gh=im.width*k,im.height*k;W,H=round(gw*RES),round(gh*RES)
    o=(esr.sr_rgba(im,2) if AI else im).resize((W,H),Image.LANCZOS)
    if mon and AI:o=sharpen(o)
    al=a[...,3]>40;cols=np.where(al.any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-4):rx+1].any(1))[0].mean()
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(ax*k,1),'ay':round(ay*k,1),'rx':round((rx-ax)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[key]=fr
    if AI and len(cache)%10==0:
        print(t,i,len(cache),round(time.time()-T0),flush=True);json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
    return fr
J={sid:{an:[frame(t,i,an in AIR,sid=='grm') for t,i in L] for an,L in M.items()} for sid,M in A.items()}
json.dump(J,open('gr_ai.json' if AI else 'gr_fast.json','w'),separators=(',',':'))
json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'))
print('DONE',len(cache),round(time.time()-T0))
