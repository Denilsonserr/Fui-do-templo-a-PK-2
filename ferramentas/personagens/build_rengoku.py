# Montagem das poses do Rengoku (sid rg). Uso: python3 build_rengoku.py [ai]   (pasta com cut/rNN_i.png, S.json, sword.json)
# Escala por folha pelo tamanho do rosto (S = altura de pe equivalente); sword.json = guarda e ponta da espada marcadas a mao.
import json,numpy as np,os,hashlib,sys,time,glob
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image
AI=len(sys.argv)>1 and sys.argv[1]=='ai'
TGT=285.0;RES=2.6;T0=time.time()
OUT='out_ai' if AI else 'out_fast';os.makedirs(OUT,exist_ok=True)
S=json.load(open('S.json'));S.update({'r07':450,'r13':465,'r16':514,'r15':395,'r17':624,'r06':496})
SW=json.load(open('sword.json'))
def G(t,ix):return [(f'r{t:02d}',i) for i in ix]
A={'relax':G(16,[0]*8),'gin':G(16,[0])+G(7,[1,2,4,5]),'idle':G(3,range(6)),'walk':G(6,[0,1,1,2,3,4,4,5]),'run':G(12,[0,1,2,2,3,4,5,5]),
 'dashf':G(14,[0,1,2,3,3,4,4,5]),'dash2':G(14,[6,7,8,9,9,10,10,11]),'dashb':G(11,[0,1,2,3,3,4,5,5]),'dodge':G(10,[0,1,2,3,3,4,5,5]),
 'jab':G(1,[0,1,2,2,3,4,5,5]),'cross':G(2,[0,1,2,2,3,4,5,5]),'str':G(4,[0,1,2,3,4,4,5,5]),'upper':G(5,[0,1,2,3,4,4,5,5]),
 'kick':G(13,[0,1,2,3,4,4,5,5]),'hkick':G(13,[0,1,2,3,4,4,5,5]),'sweep':G(10,[0,1,2,3,3,3,4,5]),
 'block':G(9,[0,1,2,3,4,5,5,5]),'cblock':G(10,[5]*8),'crouch':G(10,[0,0,1,1,5,5,5,5]),
 'hit':G(15,[0,1,1,2,2,1,1,0]),'hhit':G(15,[0,1,2,2,2,2,1,0]),'launch':G(15,[0,1,2,3,3,4,4,5]),'fall':G(15,[2,3,3,3,4]),'drop':G(15,[4,5,5]),
 'getup':G(15,[5,5])+G(10,[2,2,1,0,0])+G(9,[0]),'win':G(17,[0,1,2,3,4,4,5,5]),'lose':G(15,[0,1,2,3,4,5,5,5]),
 'pw':G(16,[0,1,2,3,4,4,5,5]),'ki1':G(4,[0,1,2,3,4,4,5,5]),'ki2':G(5,[0,1,2,3,4,4,5,5]),'seals':G(9,[0,1,2,3,4,5,5,5]),'palm':G(4,[0,1,2,3,4,4,5,5]),
 'cmb':G(18,range(16)),'jumpv':G(8,[0,1,2,3,4,5,0,0]),'jumpd':G(8,[0,1,2,3,4,5,0,0]),'hover':G(8,[4,5,4,5,4,5]),'land':G(8,[0]*8),
 'ajab':G(8,[4])+G(18,[11,12,12,13])+G(8,[5,5,5]),'akick':G(8,[4])+G(13,[3,4,4,5])+G(8,[5,5,5])}
AIR={'jumpv','jumpd','hover','ajab','akick'}
NOPLANT={'r08','r11','r15','r10','r12','r14','r17','r16'}
GL={}
for t in S:GL[t]=max(np.load(f)[1] for f in glob.glob(f'cut/{t}_*.y.npy'))
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def ld(t,i):
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');al=np.asarray(Image.open(f'cut/{t}_{i}.png'))[...,3]/255.;return y0,y1,x0,x1,al
def geo(t,i):
    y0,y1,x0,x1,al=ld(t,i);cen=x0+(al.sum(0)*np.arange(al.shape[1])).sum()/al.sum()
    g=GL[t]-y0;band=al[max(0,int(g-16)):int(g)]>.5;cols=np.where(band.any(0))[0];cl=[]
    for c in cols:
        if cl and c-cl[-1][1]<=10:cl[-1][1]=c
        else:cl.append([c,c])
    return cen,[(a+x0,b+x0) for a,b in cl if 6<=b-a<=140]
def head(t,i):
    y0,y1,x0,x1,al=ld(t,i);H=al.shape[0];hb=al[int(H*.02):int(H*.22)];return x0+(hb.sum(0)*np.arange(al.shape[1])).sum()/max(hb.sum(),1)
def anchor(t,i,air):
    if t=='r18' or air:  # combo e golpes no ar: segue a cabeca (o fogo nao puxa o centro)
        return head(t,i)-12
    cen,feet=geo(t,i)
    if t not in NOPLANT:
        c0,f0=geo(t,0)
        if f0 and feet:
            off=c0-f0[0][0];exp=cen-off;best=min(feet,key=lambda q:abs(q[0]-exp))
            if abs(best[0]-exp)<45:return best[0]+off
    if t in ('r15','r10','r11','r08','r14','r12'):  # tronco/cabeca para poses deitadas e corrida
        return head(t,i)*.5+cen*.5
    return cen
cache={}
if AI and os.path.exists('cache_ai.json'):
    for k_,v_ in json.load(open('cache_ai.json')).items():t_,i_,a_=k_.split(',');cache[(t_,int(i_),bool(int(a_)))]=v_
def frame(t,i,air):
    key=(t,i,air)
    if key in cache:return cache[key]
    r=f'{t}_{i}';y0,y1,x0,x1=np.load(f'cut/{r}.y.npy')
    im=Image.open(f'cut/{r}.png');al=np.asarray(im)[...,3]/255.
    slot=anchor(t,i,air)-x0
    ay=(y1-y0) if air else (GL[t]-y0)
    cols=np.where((al>.5).any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-3):rx+1].max(1)>.5)[0].mean()
    k=TGT/S[t];gw,gh=im.width*k,im.height*k
    if AI:o=esr.sr_rgba(im,2).resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    else:o=im.resize((round(gw*RES),round(gh*RES)),Image.LANCZOS)
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(slot*k,1),'ay':round(ay*k,1),'rx':round((rx-slot)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    if r in SW:hx,hy,tx,ty=SW[r];fr['sw']=[round((hx-slot)*k),round((ay-hy)*k),round((tx-slot)*k),round((ay-ty)*k)]
    cache[key]=fr
    if AI:print(r,len(cache),round(time.time()-T0),flush=True)
    return fr
J={'rg':{a:[frame(t,i,a in AIR) for t,i in L] for a,L in A.items()}}
json.dump(J,open('rg_ai.json' if AI else 'rg_fast.json','w'),separators=(',',':'))
json.dump({f'{k[0]},{k[1]},{int(k[2])}':v for k,v in cache.items()},open('cache_ai.json' if AI else 'cache_fast.json','w'))
print('DONE',len(cache),round(time.time()-T0))
