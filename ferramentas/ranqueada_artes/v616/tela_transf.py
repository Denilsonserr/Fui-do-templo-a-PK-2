# v616: tela TRANSFERIR (arte do dono) — limpa os 2 quadros de passiva e o diamante do custo (fica marrom como o fundo) -> www/a
import numpy as np,io,hashlib,os
from PIL import Image,ImageDraw,ImageFilter
D=os.path.dirname(os.path.abspath(__file__));A=os.path.join(D,'..','..','..','www','a')
im=Image.open(os.path.join(D,'tela_transferir.png')).convert('RGB');a=np.asarray(im).astype(float);b=a.copy()
M=Image.new('L',im.size,0);dr=ImageDraw.Draw(M)
def fill(x0,y0,x1,y1,feather=4):
    top=a[y0-2,x0+20:x1-20].mean(0);bot=a[y1+1,x0+20:x1-20].mean(0)
    for y in range(y0-6,y1+6):
        t=min(1,max(0,(y-y0)/max(1,y1-y0)));b[y,x0-6:x1+6]=top*(1-t)+bot*t
    dr.rectangle((x0,y0,x1,y1),fill=255)
fill(444,437,746,523);fill(1152,440,1440,524)
# diamante do custo
y0,y1=664,738;L=a[y0:y1,790:805].mean((0,1));R=a[y0:y1,925:940].mean((0,1))
for x in range(808,922):t=(x-808)/114;b[y0:y1,x]=L*(1-t)+R*t
dr.rectangle((814,666,916,736),fill=255)
m=np.asarray(M.filter(ImageFilter.GaussianBlur(3))).astype(float)[...,None]/255
o=(a*(1-m)+b*m).clip(0,255).astype(np.uint8);I=Image.fromarray(o)
bb=io.BytesIO();I.save(bb,'WEBP',quality=86,method=6);d=bb.getvalue();h=hashlib.md5(d).hexdigest()[:14];open(f'{A}/{h}.webp','wb').write(d)
I.save('/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/tela_limpa.png');print(f'a/{h}.webp')
