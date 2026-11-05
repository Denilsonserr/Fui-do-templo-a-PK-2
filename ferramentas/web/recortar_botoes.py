import numpy as np,sys,json
from PIL import Image
from scipy import ndimage as nd
a=np.asarray(Image.open('/home/claude/cen/hud.png').convert('RGB')).astype(np.float32)
B={'fly':(127,321,70),'tr':(127,467,72),'joy':(190,705,165),'bl':(1334,441,80),'ki':(1346,607,86),'kick':(1280,784,100),'sr':(1533,392,108),'sp':(1548,598,92),'punch':(1510,787,105)}
def disk_fit(cx,cy,r):
    # acha o anel (borda clara) para estimar o raio interno
    y,x=np.ogrid[-r:r+1,-r:r+1];return cx,cy,r
out={}
for k,(cx,cy,r) in B.items():
    R=int(r*1.12);c=a[cy-R:cy+R,cx-R:cx+R].copy();H=c.shape[0]
    yy,xx=np.mgrid[0:H,0:H]-R;d=np.sqrt(xx*xx+yy*yy)
    lum=c.max(2)/255.;al=np.clip(lum*1.6,0,1)
    inner=np.clip((r*.86-d)/3,0,1);al=np.maximum(al,inner)
    al*=np.clip((R-2-d)/6,0,1)
    rgb=np.where(al[...,None]>.01,c/np.maximum(al[...,None],.01)*np.where(inner[...,None]>0,1,1),0)
    rgb=np.where(inner[...,None]>=1,c,np.clip(c/np.maximum(al[...,None],.02),0,255))
    im=Image.fromarray(np.dstack([rgb,al*255]).clip(0,255).astype(np.uint8),'RGBA').resize((256,256),Image.LANCZOS)
    im.save(f'/home/claude/cen/btn_{k}.png');out[k]=f'btn_{k}.png'
sheet=Image.new('RGBA',(256*9,256),(90,110,140,255))
for i,k in enumerate(B):sheet.alpha_composite(Image.open(f'/home/claude/cen/btn_{k}.png'),(i*256,0))
sheet.convert('RGB').save('/home/claude/cen/btn_sheet.png')
