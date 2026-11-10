# Montagem do Shaka (v280): sid sk (normal) e skd (olhos abertos, mesmas poses). Uso: python3 build_sk.py (na pasta com cut/ do seg_sk.py)
import json,numpy as np,os,hashlib
from PIL import Image,ImageFilter
import sys;sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
OUT='/home/claude/fui-do-templo-a-pk-2/www/a';TGT=292.0;RES=2.4
U={'01':664,'02':519,'03':535,'04':450,'05':602,'06':527,'07':560,'08':473,'09':579,'10':583,'11':550,'12':623,'13':530,'14':600,'15':589,'16':643,'17':645}
def G(t,ix):return [(t,i) for i in ix]
Y={'relax':G('16',[0,1,2,3,4,5,4,3]),'gin':G('16',[0,2])+G('15',[0,1,2]),'idle':G('15',[2,2,3,3,4,4,3,3]),'walk':G('13',[0,1,2,3,4,5,0,1]),'run':G('13',[0,1,2,3,4,5,0,1]),
  'dashf':G('04',[1,2,3,3,3,4,4,4]),'dash2':G('04',[1,2,3,3,4,4,4,4]),'dashb':G('03',[1,2,3,3,2,1,1,1]),'dodge':G('03',[1,2,3,3,2,1,1,1]),
  'jab':G('14',[1,2,3,4,4,4,5,5]),'cross':G('14',[2,3,4,4,4,5,5,1]),'jab2':G('14',[3,4,4,4,4,5,5,5]),'str':G('02',[0,4,4,4,4,4,5,5]),
  'upper':G('02',[1,2,3,3,3,3,0,0]),'kick':G('05',[1,2,3,3,3,2,1,1]),'hkick':G('05',[1,2,4,4,4,4,5,5]),'sweep':G('08',[1,2,3,4,4,4,5,5]),
  'kick2':G('06',[1,2,3,3,3,5,5,5]),'kick3':G('06',[2,3,4,4,4,5,5,5]),
  'block':G('15',[4,5,5,5,5,5,5,5]),'cblock':G('07',[1]*8),'crouch':G('07',[0,1,1,1,1,1,1,1]),
  'hit':G('09',[0,1,2,2,1,1,0,0]),'hhit':G('09',[1,2,3,3,2,2,0,0]),'launch':G('09',[3,4,4,4,4,4,4,4]),'fall':G('09',[4,4,4,4,4]),'drop':G('09',[5,5,5]),
  'getup':G('11',[4,4,3])+G('15',[2,2,2,2,2]),'win':G('17',[0,1,2,3,4,5,5,5]),'lose':G('11',[0,1,2,3,4,5,5,5]),
  'pw':G('07',[0,1,2,3,4,5,5,5]),'ki1':G('04',[0,1,2,3,3,4,4,4]),'ki2':G('02',[0,1,2,4,4,4,5,5]),'seals':G('07',[4]*8),'subst':G('03',[0,1,2,3,4,5]),
  'palm':G('02',[0,1,2,3,4,4,5,5]),'roxo':G('02',[0,4,4,4,5,5]),
  'cmb':G('04',[1,2,3])+G('14',[3,4])+G('05',[2,4])+G('06',[3,4])+G('08',[3,4])+G('14',[4])+G('02',[2,3,4,5]),
  'jumpv':G('03',[0,1,2,3,4,5,5,5]),'jumpd':G('03',[0,1,2,3,4,5,5,5]),'hover':G('03',[5]*6),'land':G('03',[2,1,1,0,0,0,0,0]),
  'ajab':G('03',[4,5,5,5,5,5,5,5]),'akick':G('03',[4])+G('06',[4,4,4,4])+G('03',[5,5,5])}
AIR={'jumpv','jumpd','hover','ajab','akick'}
GL={t:max(np.load(f'cut/{t}_{i}.y.npy')[1] for i in range(6)) for t in U}
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
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');im=Image.open(f'cut/{t}_{i}.png');a=np.asarray(im).astype(int)
    lying=(t=='11' and i>=3) or (t=='09' and i==5)
    ax=anchor(a,air,lying);ay=(y1-y0) if air else (GL[t]-y0)
    k=TGT/U[t];gw,gh=im.width*k,im.height*k;o=esr.sr_rgba(im,2).resize((round(gw*RES),round(gh*RES)),Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.0,percent=40,threshold=2))   # v282: IA 2x (mais nítido)
    al=a[...,3]>40;cols=np.where(al.any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-4):rx+1].any(1))[0].mean()
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(ax*k,1),'ay':round(ay*k,1),'rx':round((rx-ax)*k),'ry':round((ay-ry)*k),'src':sv(np.asarray(o).astype(float))}
    cache[key]=fr;print(t,i,flush=True);return fr
J={'sk':{an:[frame(t,i,an in AIR) for t,i in L] for an,L in Y.items()}};J['skd']=J['sk']
B=os.path.dirname(os.path.abspath(__file__))+'/build';json.dump(J,open(B+'/sk.json','w'),separators=(',',':'));json.dump({f'{k[0]},{k[1]},{int(k[2])}':v for k,v in cache.items()},open(CF,'w'));print('ok',len(cache))
