# v394: montagem do SHAKA DIVINO (sid skv) a partir de cut/ do seg_skv.py. Uso (na pasta /home/claude/skv_build): python3 build_skv.py
# Mesmas animações do sk (build_sk.py) para encaixar no código do Shaka; IA 2x (Real-ESRGAN) com cache.
import json,numpy as np,os,hashlib
from PIL import Image,ImageFilter
import sys;sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
OUT='/home/claude/fui-do-templo-a-pk-2/www/a';TGT=320.0;RES=2.4   # 320 = em pé com o elmo (o normal tem 292)
REF={'d01':435,'d02':435,'d03':196,'d04':357,'d05':352,'d06':272,'d07':218,'d08':437,'d09':437,'d10':304,'d11':338,'d12':398,'d13':378}   # altura EM PÉ em cada folha
def G(t,ix):return [(t,i) for i in ix]
Y={'relax':G('d13',[0,1,2,3,3,2,1,0]),'gin':G('d13',[4,5,6,7])+G('d01',[1,2,3]),'idle':G('d01',[1,2,3,2,1,2,3,2]),
  'walk':G('d10',[2,4,6,8,10,12,13,14]),'run':G('d10',[3,4,5,6,7,8,9,10]),
  'dashf':G('d11',[1,2,3,4,5,5,6,7]),'dash2':G('d11',[2,3,4,5,5,6,6,7]),'dashb':G('d02',[1,2,3,3,2,1,1,1]),'dodge':G('d02',[1,2,3,3,2,1,1,1]),
  'jab':G('d04',[1,2,3,3,4,4,5,5]),'cross':G('d04',[2,3,4,4,4,5,5,1]),'jab2':G('d04',[3,4,4,4,4,5,5,5]),'str':G('d03',[3,4,5,6,6,7,8,9]),
  'upper':G('d01',[3,4,5,5,5,5,1,1]),'kick':G('d05',[1,2,3,3,3,2,1,1]),'hkick':G('d05',[1,2,3,3,3,4,4,5]),'sweep':G('d07',[13,14,14,14,14,14,17,17]),
  'kick2':G('d05',[1,2,3,3,4,4,5,5]),'kick3':G('d07',[5,6,6,6,6,6,7,7]),
  'block':G('d08',[3,4,5,5,5,5,5,5]),'cblock':G('d09',[5]*8),'crouch':G('d09',[0,1,1,1,1,1,1,1]),
  'hit':G('d12',[0,1,2,2,1,1,0,0]),'hhit':G('d12',[1,2,3,3,2,2,0,0]),'launch':G('d12',[3,4,4,4,4,4,4,4]),'fall':G('d12',[4,5,5,5,5]),'drop':G('d12',[7,7,7]),
  'getup':G('d12',[6,5])+G('d01',[1,1,1,1,1,1]),'win':G('d13',[4,5,6,7,7,7,7,7]),'lose':G('d12',[0,1,2,3,4,5,6,7]),
  'pw':G('d13',[0,1,2,3,4,5,6,7]),'ki1':G('d06',[1,2,3,4,5,6,7,8]),'ki2':G('d03',[1,2,3,4,5,6,7,8]),'seals':G('d09',[5]*8),'subst':G('d02',[0,1,2,3,4,5]),
  'palm':G('d01',[1,2,3,4,5,5,5,5]),'roxo':G('d03',[3,4,5,6,7,8]),
  'cmb':G('d07',list(range(1,17))),'cmb2':G('d03',list(range(16))),
  'jumpv':G('d02',[1,2,3,3,4,4,4,4]),'jumpd':G('d02',[1,2,3,3,4,4,4,4]),'hover':G('d02',[3]*6),'land':G('d02',[5,5,0,0,0,0,0,0]),
  'ajab':G('d02',[2])+G('d07',[10]*7),'akick':G('d02',[2])+G('d07',[6]*4)+G('d02',[4,4,4])}
AIR={'jumpv','jumpd','hover','ajab','akick'}
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=90,alpha_quality=92,method=6)
    return f'a/{h}.webp'
def anchor(a,air,lying):
    al=a[...,3]>140;ys=np.where(al.any(1))[0];top,bot=ys.min(),ys.max()
    if lying:return (np.where(al)[1]).mean()
    if air:hb=al[top:top+int((bot-top)*.25)];return np.where(hb)[1].mean()
    band=al[int(top+(bot-top)*.55):int(top+(bot-top)*.78)];return np.median(np.where(band)[1]) if band.any() else a.shape[1]/2
CF='cache_ai.json';cache={}
if os.path.exists(CF):
    for k_,v_ in json.load(open(CF)).items():t_,i_,a_=k_.split(',');cache[(t_,int(i_),bool(int(a_)))]=v_
def frame(t,i,air):
    key=(t,i,air)
    if key in cache:return cache[key]
    y0,y1,x0,x1,gl=np.load(f'cut/{t}_{i}.y.npy');im=Image.open(f'cut/{t}_{i}.png');a=np.asarray(im).astype(int)
    lying=(t=='d12' and i>=5)
    ax=anchor(a,air,lying);ay=(y1-y0) if air else (gl-y0)
    k=TGT/REF[t];gw,gh=im.width*k,im.height*k;o=esr.sr_rgba(im,2).resize((round(gw*RES),round(gh*RES)),Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.0,percent=40,threshold=2))
    al=a[...,3]>40;cols=np.where(al.any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-4):rx+1].any(1))[0].mean()
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(ax*k,1),'ay':round(ay*k,1),'rx':round((rx-ax)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[key]=fr;print(t,i,flush=True)
    json.dump({f'{k_[0]},{k_[1]},{int(k_[2])}':v for k_,v in cache.items()},open(CF,'w'));return fr
J={'skv':{an:[frame(t,i,an in AIR) for t,i in L] for an,L in Y.items()}}
B=os.path.dirname(os.path.abspath(__file__))+'/build';os.makedirs(B,exist_ok=True);json.dump(J,open(B+'/skv.json','w'),separators=(',',':'));print('ok',len(cache))
