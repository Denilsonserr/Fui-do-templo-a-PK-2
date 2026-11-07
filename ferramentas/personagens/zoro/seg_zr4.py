# fundo xadrez claro da folha 4 do Zoro -> transparente (componentes grandes quase brancos = fundo, mesmo dentro dos arcos)
from PIL import Image
import numpy as np
from scipy import ndimage as nd
a=np.asarray(Image.open('z04_combo_transf.png').convert('RGB')).astype(float)
mn=a.min(2);mx=a.max(2)
bgish=(mn>=236)&((mx-mn)<=10)
lab,k=nd.label(bgish);sz=nd.sum(bgish,lab,range(1,k+1))
border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
keep=[i+1 for i in range(k) if (i+1 in border) or sz[i]>600]
bg=np.isin(lab,keep)
al=np.where(bg,0.,1.)
band=nd.binary_dilation(bg,iterations=3)&~bg
A=np.clip(np.max((255-a)/255.,axis=-1),0,1)
g=a[...,1];r=a[...,0];b=a[...,2]
eff=(g>r+25)&(g>b+15)&(g>150)
sel=(band|eff)&~bg
al[sel]=np.minimum(1,A[sel]*1.15)
safe=np.maximum(al,1e-3)[...,None]
col=np.where(sel[...,None],np.clip((a-(1-al[...,None])*255)/safe,0,255),a)
out=np.dstack([col,al*255]).clip(0,255).astype(np.uint8)
Image.fromarray(out,'RGBA').save('z04_alpha.png')
im=Image.fromarray(out,'RGBA');bgc=Image.new('RGBA',im.size,(30,30,60,255));bgc.alpha_composite(im);bgc.convert('RGB').resize((1085,362)).save('/tmp/z4prev.jpg')
