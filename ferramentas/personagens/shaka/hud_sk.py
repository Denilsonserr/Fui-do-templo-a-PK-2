# v282: botões do Shaka (normal e olhos abertos) a partir das artes do dono (1670x942, fundo preto). Só os botões (sem HUD de vida).
import numpy as np,json,hashlib,os,sys
from PIL import Image
from scipy import ndimage as nd
OUTD='/home/claude/fui-do-templo-a-pk-2/www/a'
def save(im,q=88):
    b=im.tobytes();h=hashlib.md5(b).hexdigest()[:14];p=f'{OUTD}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=q,alpha_quality=92,method=6)
    return f'a/{h}.webp'
def load(p):
    im=Image.open(p).convert('RGBA').resize((1670,942),Image.LANCZOS);a=np.asarray(im).astype(float)
    rgb,al=a[...,:3],a[...,3]
    if (al<10).mean()>.3:return rgb,al/255.,None
    bg=np.median(np.concatenate([rgb[:4].reshape(-1,3),rgb[-4:].reshape(-1,3)]),0)
    d=np.sqrt(((rgb-bg)**2).sum(2));fg=d>40;fg=nd.binary_closing(fg,iterations=2);fg=nd.binary_fill_holes(fg)
    A=np.where(nd.binary_erosion(fg,iterations=2),1.,np.clip(d/140,0,1)*nd.binary_dilation(fg,iterations=3))
    A=np.maximum(A,np.clip((d-15)/120,0,1));A=nd.gaussian_filter(A,.5)
    rgb=np.clip((rgb-(1-A[...,None])*bg)/np.maximum(A[...,None],.05),0,255)
    return rgb,A,bg

D=os.path.dirname(os.path.abspath(__file__))
C=[{'bFly':[105,315,92],'bTr':[105,495,92],'joyBase':[185,745,172],'bSr':[1515,375,140],'bBl':[1278,432,88],'bKi':[1288,615,98],'bSp':[1512,615,95],'bKick':[1210,808,104],'bPunch':[1450,808,104]},
   {'bFly':[120,322,100],'bTr':[118,490,95],'joyBase':[205,735,180],'bSr':[1478,378,150],'bBl':[1222,435,92],'bKi':[1225,615,100],'bSp':[1465,615,100],'bKick':[1130,795,110],'bPunch':[1380,795,110]}]
OUT=[]
for f,CC in zip(['normal.png','olhos_abertos.png'],C):
    rgb,A,bg=load(D+'/botoes/'+f);btn={}
    def cut(x,y,r,s=256):
        x0,y0,x1,y1=int(x-r),int(y-r),int(x+r),int(y+r);im=Image.fromarray(np.dstack([rgb[max(0,y0):y1,max(0,x0):x1],A[max(0,y0):y1,max(0,x0):x1]*255]).clip(0,255).astype(np.uint8),'RGBA')
        im=im.resize((s,s),Image.LANCZOS);a=np.asarray(im).copy();Y,X=np.mgrid[0:s,0:s];d=np.hypot(X-s/2+.5,Y-s/2+.5)/(s/2)
        a[...,3]=(a[...,3]*np.clip((1-d)/.04,0,1)).astype(np.uint8);return Image.fromarray(a,'RGBA')   # recorte redondo (sem pedaço do vizinho)
    for k,(x,y,r) in CC.items():
        if k=='joyBase':
            base=np.asarray(cut(x,y,r,329)).copy();Y,X=np.mgrid[0:329,0:329];m=np.hypot(X-164.5,Y-164.5)<329*.2;base[...,3][m]=0
            btn['joy']=save(Image.fromarray(base,'RGBA'));btn['knob']=save(cut(x,y,r*.42,134))
        else:btn[k]=save(cut(x,y,r))
    OUT.append({'btn':btn,'circ':CC})
json.dump(OUT,open(D+'/build/hud_shaka.json','w'));print('ok')
im=Image.new('RGBA',(1300,600),(30,30,60,255))
for j,O in enumerate(OUT):
    for i,(k,v) in enumerate(O['btn'].items()):
        b=Image.open('/home/claude/fui-do-templo-a-pk-2/www/'+v).convert('RGBA').resize((120,120));im.alpha_composite(b,(i*128,j*300+20))
im.convert('RGB').save('/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/hudsk.png')
