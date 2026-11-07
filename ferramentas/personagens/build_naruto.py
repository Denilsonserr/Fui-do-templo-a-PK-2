# Montagem do Naruto: sid nr (normal, folhas nNN) e nrk (Modo Kurama, folhas kNN). Uso: python3 build_naruto.py [ai]
import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image
AI=len(sys.argv)>1 and sys.argv[1]=='ai'
TGT=270.0;RES=2.6;T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
GU=.92  # guarda / em pe
S={'n01':635/GU,'n02':689,'n03':670,'n04':712,'n05':600,'n06':584/GU,'n07':548/GU,'n08':567/GU,'n09':381/GU,'n10':492/GU,'n11':405/GU,'n12':426/GU,'n13':462/GU,'n14':341/GU,'n15':683,'n16':645/GU,'n17':316/GU,'n18':268/GU,
   'k01':690,'k02':626/GU,'k03':673,'k04':421/GU,'k05':468/GU,'k06':466/GU,'k07':383/.82,'k08':458,'k09':482/.72,'k10':438/GU,'k11':721,'k12':553/.8,'k13':593,'k14':631,'k15':698,'k16':641/GU,'k17':311/GU,'k18':264/GU}
for k in [x for x in S if x[0]=='k']:S[k]*=1.04   # cabelo de chama mais alto
def G(p,t,ix):return [(f'{p}{t:02d}',i) for i in ix]
n=lambda t,ix:G('n',t,ix);k=lambda t,ix:G('k',t,ix)
A={'nr':{'relax':n(15,[0]*8),'gin':n(15,[0])+n(16,[0,1,2,3]),'idle':n(1,range(6)),'walk':n(2,[0,1,1,2,3,4,4,5]),'run':n(3,[0,1,2,2,3,4,5,5]),
  'dashf':n(5,[0,1,2,3,3,4,4,5]),'dash2':n(5,[0,1,2,3,3,4,4,5]),'dashb':n(9,range(8)),'dodge':n(9,range(8)),
  'jab':n(6,[0,1,2,3,4,4,5,5]),'cross':n(17,[1,2,3,3,4,4,5,5]),'str':n(17,[5,6,6,7,7,7,8,8]),'upper':n(8,[0,1,2,3,4,4,5,5]),
  'kick':n(17,[8,9,9,10,10,11,11,12]),'hkick':n(8,[0,1,2,3,4,4,5,5]),'sweep':n(12,[0,2,3,4,5,5,6,7]),
  'block':n(16,[0,1,2,3,4,5,5,5]),'cblock':n(12,[3]*8),'crouch':n(12,[0,1,2,3,3,3,3,3]),
  'hit':n(11,[0,1,1,2,2,1,1,0]),'hhit':n(14,[0,1,2,2,2,2,1,0]),'launch':n(11,range(8)),'fall':n(11,[3,4,4,5,5]),'drop':n(11,[5,6,7]),
  'getup':n(14,[7,6,5])+n(12,[2,1,0])+n(1,[0,0]),'win':n(15,[0,1,1,2,2,3,3,3]),'lose':n(14,range(8)),
  'pw':n(10,[0,1,2,3,4,4,5,5]),'ki1':n(13,[0,1,2,3,4,5,5,0]),'ki2':n(13,[0,1,2,3,4,5,5,0]),'seals':n(7,[0,1,1,1,1,1,1,1]),'subst':n(7,range(6)),
  'palm':n(6,[0,1,2,3,4,4,5,5]),'cmb':n(18,range(16)),'cmb1':n(17,range(16)),
  'jumpv':n(4,[0,1,2,3,3,4,5,5]),'jumpd':n(4,[0,1,2,3,3,4,5,5]),'hover':n(4,[3,3,4,4,3,3]),'land':n(4,[5]*8),
  'ajab':n(4,[3])+n(6,[2,3,4,4])+n(4,[4,4,4]),'akick':n(4,[3])+n(8,[3,4,4,4])+n(4,[4,4,4])},
 'nrk':{'relax':k(1,[0]*8),'gin':k(1,[0])+k(2,[0,1,2,3]),'idle':k(2,[0,1,2,3]),'walk':k(3,[0,0,1,1,2,2,3,3]),'run':k(7,[0,1,2,2,3,4,5,5]),
  'dashf':k(8,[0,1,2,3,3,4,4,5]),'dash2':k(8,[0,1,2,3,3,4,4,5]),'dashb':k(7,[0,1,2,3,3,4,4,5]),'dodge':k(8,[0,1,2,3,3,4,4,5]),
  'jab':k(5,[0,1,2,3,4,4,5,5]),'cross':k(17,[1,2,3,4,4,5,5,6]),'str':k(16,[0,1,2,2,3,3,3,3]),'upper':k(18,[6,6,7,7,7,8,8,8]),
  'kick':k(6,[0,1,2,3,4,4,5,5]),'hkick':k(17,[8,9,10,11,11,12,12,13]),'sweep':k(13,[0,1,2,3,3,3,2,0]),
  'block':k(11,[0,1,2,3,3,3,3,3]),'cblock':k(12,[3]*8),'crouch':k(12,[0,0,1,1,2,2,3,3]),
  'hit':k(10,[0,1,1,2,2,1,1,0]),'hhit':k(10,[0,1,2,2,2,2,1,0]),'launch':k(10,[0,1,2,3,3,4,4,5]),'fall':k(10,[2,3,3,4,4]),'drop':k(10,[4,5,5]),
  'getup':k(10,[5,5,4])+k(12,[0,1,2])+k(2,[0,0]),'win':k(1,[0,0,2,2,3,3,3,3]),'lose':k(10,[0,1,2,3,4,5,5,5]),
  'pw':k(1,[1,1,2,2,2,2,2,2]),'ki1':k(4,[0,1,2,3,4,4,5,5]),'ki2':k(16,[0,1,2,2,3,3,3,3]),'seals':k(15,[0,1,2,3,3,3,3,3]),'subst':k(14,[0,1,2,3]),
  'palm':k(16,[0,1,2,2,3,3,3,3]),'cmb':k(18,range(16)),'cmb1':k(17,range(16)),
  'jumpv':k(9,[0,0,1,2,3,3,3,3]),'jumpd':k(9,[0,0,1,2,3,3,3,3]),'hover':k(9,[3]*6),'land':k(9,[0]*8),
  'ajab':k(9,[3])+k(5,[3,4,5,5])+k(9,[3,3,3]),'akick':k(9,[3])+k(6,[3,4,4,5])+k(9,[3,3,3])}}
AIR={'jumpv','jumpd','hover','ajab','akick'}
NOPLANT={'n05','n09','n11','n14','n04','n12','n18','k07','k08','k09','k10','k13','k12','k18'}
GL={t:max(np.load(f)[1] for f in glob.glob(f'cut/{t}_*.y.npy')) for t in S}
GRID={'n17','n18','k17','k18'}
GLR={(t,r):max(np.load(f'cut/{t}_{i}.y.npy')[1] for i in range(r*8,r*8+8)) for t in GRID for r in (0,1)}
def gl(t,i):return GLR[(t,i//8)] if t in GRID else GL[t]
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def ld(t,i):
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');al=np.asarray(Image.open(f'cut/{t}_{i}.png'))[...,3]/255.;return y0,y1,x0,x1,al
def geo(t,i):
    y0,y1,x0,x1,al=ld(t,i);cen=x0+(al.sum(0)*np.arange(al.shape[1])).sum()/al.sum()
    g=gl(t,i)-y0;band=al[max(0,int(g-16)):int(g)]>.5;cols=np.where(band.any(0))[0];cl=[]
    for c in cols:
        if cl and c-cl[-1][1]<=10:cl[-1][1]=c
        else:cl.append([c,c])
    return cen,[(a+x0,b+x0) for a,b in cl if 6<=b-a<=160]
def head(t,i):
    y0,y1,x0,x1,al=ld(t,i);H=al.shape[0];hb=al[int(H*.02):int(H*.22)];return x0+(hb.sum(0)*np.arange(al.shape[1])).sum()/max(hb.sum(),1)
def anchor(t,i,air):
    if air:return head(t,i)
    cen,feet=geo(t,i)
    if t not in NOPLANT:
        c0,f0=geo(t,0)
        if f0 and feet:
            off=c0-f0[0][0];exp=cen-off;best=min(feet,key=lambda q:abs(q[0]-exp))
            if abs(best[0]-exp)<45:return best[0]+off
    if t in('n09','n11','n14','k10','k13','n12','k12'):return head(t,i)*.5+cen*.5
    return cen
cache={}
if AI and os.path.exists('cache_ai.json'):
    for k_,v_ in json.load(open('cache_ai.json')).items():t_,i_,a_=k_.split(',');cache[(t_,int(i_),bool(int(a_)))]=v_
def frame(t,i,air):
    key=(t,i,air)
    if key in cache:return cache[key]
    r=f'{t}_{i}';y0,y1,x0,x1=np.load(f'cut/{r}.y.npy')
    im=Image.open(f'cut/{r}.png');al=np.asarray(im)[...,3]/255.
    slot=anchor(t,i,air)-x0;ay=(y1-y0) if air else (gl(t,i)-y0)
    cols=np.where((al>.5).any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-3):rx+1].max(1)>.5)[0].mean()
    kk=TGT/S[t];gw,gh=im.width*kk,im.height*kk
    if AI:o=esr.sr_rgba(im,2).resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    else:o=im.resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(slot*kk,1),'ay':round(ay*kk,1),'rx':round((rx-slot)*kk),'ry':round((ay-ry)*kk),'src':sv(np.asarray(o).astype(float))}
    cache[key]=fr
    if AI:print(r,len(cache),round(time.time()-T0),flush=True)
    return fr
J={sid:{a:[frame(t,i,a in AIR) for t,i in L] for a,L in M.items()} for sid,M in A.items()}
json.dump(J,open('nr_ai.json' if AI else 'nr_fast.json','w'),separators=(',',':'))
json.dump({f'{k[0]},{k[1]},{int(k[2])}':v for k,v in cache.items()},open('cache_ai.json' if AI else 'cache_fast.json','w'))
print('DONE',len(cache),round(time.time()-T0))
