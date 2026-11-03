import numpy as np,json,hashlib,os
from PIL import Image,ImageSequence
os.makedirs('fxo',exist_ok=True)
def grad(l):  # l 0..1 -> purple ramp
    c0=np.array([40,0,80.]);c1=np.array([150,40,255.]);c2=np.array([225,150,255.]);c3=np.array([255,245,255.])
    l=l[...,None]
    return np.where(l<.35,c0+(c1-c0)*(l/.35),np.where(l<.75,c1+(c2-c1)*((l-.35)/.4),c2+(c3-c2)*((l-.75)/.25)))
OUT={}
for i in range(1,6):
    im=Image.open(f'fx/e{i}.gif');fr=[f.convert('RGB') for f in ImageSequence.Iterator(im)]
    step=1 if len(fr)<=14 else (2 if len(fr)<=34 else 3)
    fr=fr[::step];W,H=fr[0].size;sc=min(1,520/max(W,H));w,h=round(W*sc),round(H*sc)
    sheet=Image.new('RGBA',(w*len(fr),h))
    for k,f in enumerate(fr):
        a=np.asarray(f.resize((w,h),Image.LANCZOS)).astype(np.float32);lum=(a[...,0]*.3+a[...,1]*.59+a[...,2]*.11)/255;mx=a.max(2)/255;mn=a.min(2)/255
        if i==1:   # purple/black on white
            al=np.clip((1-mn)*1.4,0,1);rgb=a.copy();rgb=np.where((mx-mn)[...,None]<.12,rgb*.6,rgb)
            o=np.dstack([rgb,al*255])
        elif i==5: # red bg fullscreen
            g=grad(np.clip(lum*1.6,0,1));o=np.dstack([g,np.full((h,w),255.)])
        else:      # black bg additive
            g=grad(np.clip(mx,0,1));al=np.clip(mx*1.25,0,1);o=np.dstack([g,al*255])
        sheet.paste(Image.fromarray(o.clip(0,255).astype(np.uint8),'RGBA'),(k*w,0))
    p=f'fxo/e{i}.webp';sheet.save(p,'WEBP',quality=84,alpha_quality=88,method=6)
    d=open(p,'rb').read();hh=hashlib.md5(d).hexdigest()[:14];open('/home/claude/fui-do-templo-a-pk-2/www/a/'+hh+'.webp','wb').write(d)
    OUT['e%d'%i]={'src':'a/'+hh+'.webp','w':w,'h':h,'n':len(fr),'fps':round(1000/((im.info.get('duration') or 90)*step))}
    print(i,len(fr),w,h,len(d)//1024)
json.dump(OUT,open('fx.json','w'),separators=(',',':'))
for i in range(1,6):
    s=Image.open(f'fxo/e{i}.webp');n=OUT['e%d'%i]['n'];w=OUT['e%d'%i]['w'];h=OUT['e%d'%i]['h']
    c=Image.new('RGBA',(w*3,h),(40,40,40,255));[c.alpha_composite(s.crop((k*w,0,k*w+w,h)),(j*w,0)) for j,k in enumerate([0,n//2,n-2])];c.convert('RGB').save(f'fxo/p{i}.png')
