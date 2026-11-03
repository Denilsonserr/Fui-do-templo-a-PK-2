import json,numpy as np,os,hashlib
from PIL import Image
from scipy import ndimage as nd
K=0.40;RES=1.6
n=lambda s:'n'+s;t=lambda s:'t'+s
A={'qq':{'idle':['n09_0','n09_1','n09_0'],'walk':['n02_0','n02_1','n02_2','n02_3'],'combo':['n05_0','n05_3','n06_3','n06_2'],
  'kick':['n07_0','n07_1','n07_2','n07_3'],'low':['n12_1','n12_2','n12_3','n12_4'],'jump':['n04_0','n04_1','n04_2','n04_3'],
  'block':['n11_3','n12_5'],'hit':['n10_0','n10_1','n10_2'],'fall':['n10_1','n10_2','n10_3','n10_4'],'trans':['n08_0','n08_1','n08_2','n08_3'],
  'win':['n08_3','n08_2','n09_3'],'pw':['n08_1','n08_3'],'fly':['t14_0','t14_1','t14_2','t14_3'],'sp':['n08_1','n08_2','n08_3'],'dodge':['t14_5','t14_6','t14_7']},
 'qqf':{'idle':['t01_0','t01_1','t01_3'],'walk':['t02_0','t02_1','t02_2','t02_3'],'combo':['t03_1','t03_3','t04_2','t03_2'],
  'kick':['t05_0','t05_1','t05_2','t05_3'],'low':['t08_1','t08_2','t08_3','t08_2'],'jump':['t06_0','t06_1','t06_2','t06_3'],
  'block':['t07_3','t08_3'],'hit':['n10_0','n10_1','n10_2'],'fall':['n10_1','n10_2','n10_3','n10_4'],'trans':['t10_0','t10_1','t10_2','t10_3'],
  'win':['t01_0','t10_3','t09_3'],'pw':['t09_1','t09_3'],'fly':['t12_1','t12_2','t11_2','t11_3'],'sp':['t09_1','t09_2','t09_3'],'dodge':['t12_1','t08_2','t08_3']}}
NOLAY={'block','fall','hit','jump','low','fly','dodge'}
os.makedirs('qq/out',exist_ok=True)
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'qq/out/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def layers(al):
    solid=al>.05;h,w=al.shape;ys,xs=np.where(solid);top=ys.min();bot=ys.max();hh=bot-top
    fr=np.array([np.where(solid[y])[0].max() if solid[y].any() else 0 for y in range(h)])
    tor=fr[int(top+hh*.20):int(top+hh*.60)];front=np.percentile(tor[tor>0],22)
    cut=front-hh*.24;X=np.arange(w)[None,:];Y=np.arange(h)[:,None]
    tail=solid&(X<cut)&(Y>top+hh*.06)&(Y<top+hh*.80)
    lab,k=nd.label(tail)
    if k:
        sz=nd.sum(tail,lab,range(1,k+1));tail=np.isin(lab,[i+1 for i,s in enumerate(sz) if s>hh*hh*.01])
    anchor=float(cut)
    hm=np.zeros_like(solid);root=int(top+hh*.15);hm[:root]=solid[:root];hm&=~tail
    return tail,hm,root,anchor
cache={}
def frame(r,akey):
    k=(r,akey in NOLAY)
    if k in cache:return cache[k]
    s=K*(1.0 if r[0]=='n' else 1.0)
    im=np.asarray(Image.open(f'qq/cut/{r}.png')).astype(np.float32);rgb,al=im[...,:3],im[...,3]/255
    ys,xs=np.where(al>.05);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1;rgb,al=rgb[y0:y1,x0:x1],al[y0:y1,x0:x1]
    hh=al.shape[0];fb=al[int(hh*.88):];cx=(fb.sum(0)*np.arange(al.shape[1])).sum()/max(fb.sum(),1)
    out=Image.fromarray(np.dstack([rgb,al*255]).clip(0,255).astype(np.uint8),'RGBA');gw,gh=out.width*s,out.height*s
    out=out.resize((max(1,round(gw*RES)),max(1,round(gh*RES))),Image.LANCZOS);arr=np.asarray(out).astype(float)
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(cx*s,1),'ay':round(gh-.5,1),'src':sv(arr)}
    if akey not in NOLAY:
        tail,hm,root,anc=layers(arr[...,3]/255)
        if tail.sum()>400:
            base=arr.copy();base[...,3]=np.where(tail|hm,0,base[...,3]);fr['b']=sv(base)
            def crop(mask):
                ys,xs=np.where(mask);a0,a1,b0,b1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
                lay=arr.copy();lay[...,3]=np.where(mask,lay[...,3],0);return lay[a0:a1,b0:b1],b0,a0,b1,a1
            c,X0,Y0,X1,Y1=crop(tail);fr['rl']={'src':sv(c),'x':round(X0/RES,1),'y':round(Y0/RES,1),'w':round((X1-X0)/RES,1),'h':round((Y1-Y0)/RES,1),'a':round(X1/RES,1)}
            if hm.sum()>300:
                c,X0,Y0,X1,Y1=crop(hm);fr['hl']={'src':sv(c),'x':round(X0/RES,1),'y':round(Y0/RES,1),'w':round((X1-X0)/RES,1),'h':round((Y1-Y0)/RES,1),'r':round(root/RES,1)}
    cache[k]=fr;return fr
J={sid:{a:[frame(r,a) for r in L] for a,L in an.items()} for sid,an in A.items()}
json.dump(J,open('qq/qq.json','w'),separators=(',',':'))
tiles=[]
for sid in J:
  for a,L in J[sid].items():
    for fr in L:
      W,H=int(fr['w']*RES),int(fr['h']*RES);c=Image.new('RGBA',(W,H),(60,60,60,255))
      c.alpha_composite(Image.open('qq/out/'+(fr.get('b') or fr['src'])[2:]))
      for kk,col in (('rl',(255,40,40,255)),('hl',(40,210,60,255))):
        if kk in fr:
          L2=fr[kk];im=Image.open('qq/out/'+L2['src'][2:]);so=Image.new('RGBA',im.size,col);so.putalpha(im.getchannel('A'));c.alpha_composite(so,(round(L2['x']*RES),round(L2['y']*RES)))
      c=c.convert('RGB');c.thumbnail((140,140));tiles.append(c)
cols=14;G=Image.new('RGB',(cols*140,((len(tiles)+cols-1)//cols)*140),'white')
for i,t in enumerate(tiles):G.paste(t,((i%cols)*140,(i//cols)*140))
G.save('qq/layers.png');print(len(tiles),len(os.listdir('qq/out')))
print({s:J[s]['idle'][0]['h'] for s in J}, J['zyk' if 0 else 'qq']['walk'][0]['h'])
