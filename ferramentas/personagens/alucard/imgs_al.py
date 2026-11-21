# v594: retrato/ícone/corpo inteiro do ALUCARD a partir de referencia.jpg (fundo branco) -> www/a + build/imgs.json
import numpy as np,io,hashlib,json,os,sys
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image,ImageFilter
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__));A=os.path.join(D,'..','..','..','www','a')
a=np.asarray(Image.open(os.path.join(D,'referencia.jpg')).convert('RGB')).astype(float)
mn=a.min(2);sat=a.max(2)-mn
bgish=(mn>=228)&(sat<=16);lab,k=nd.label(bgish);brd=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
bg=np.isin(lab,list(brd));bg=nd.binary_opening(bg,iterations=1)
al=np.where(bg,0,1.).astype(float);band=nd.binary_dilation(bg,iterations=2)&~bg
al[band]=np.clip((245-mn[band])/50,0,1)
al=nd.gaussian_filter(al,.6)*(~bg|band)
rgba=np.dstack([a,al*255]).clip(0,255).astype(np.uint8);I=Image.fromarray(rgba,'RGBA')
ys,xs=np.where(al>.1);I=I.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1));I.save(os.path.join(D,'build','alucard_recorte.png'))
def save(im,ext='webp',q=88):
    b=io.BytesIO()
    if ext=='jpg':im.convert('RGB').save(b,'JPEG',quality=q)
    else:im.save(b,'WEBP',quality=q,method=6)
    d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14];open(f'{A}/{h}.{ext}','wb').write(d);return f'a/{h}.{ext}'
full=esr.sr_rgba(I,2);full.thumbnail((420,980),Image.LANCZOS)
# rosto: ~ topo da cabeça até o peito
W,H=I.size;S=int(H*.30);cx=int(W*.6);top=int(H*.2);x0=max(0,cx-S//2)
face=esr.sr_rgba(I.crop((x0,top,x0+S,top+S)),2);S=face.size[0]
bgc=Image.new('RGBA',face.size);g=np.zeros((S,S,4),np.uint8);yy,xx=np.mgrid[0:S,0:S];r=np.hypot(xx-S/2,yy-S*.45)/S
g[...,0]=(170*(1-r)+30).clip(0,255);g[...,1]=(20*(1-r)+6).clip(0,255);g[...,2]=(30*(1-r)+10).clip(0,255);g[...,3]=255
bgc=Image.fromarray(g,'RGBA');bgc.alpha_composite(face)
port=bgc.resize((640,640),Image.LANCZOS);pth=bgc.resize((220,220),Image.LANCZOS)
o={'port':save(port,'jpg',90),'pth':save(pth.convert('RGB')),'full':save(full)}
json.dump(o,open(os.path.join(D,'build','imgs.json'),'w'));print(o,full.size)
port.convert('RGB').save('/tmp/al_port.jpg');full.save('/tmp/al_full.png')
