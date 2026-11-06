import numpy as np
from PIL import Image
from scipy import ndimage as nd
import sys;sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/personagens')
from seg_gogeta_fundo import mask_of as mask_dark
def mask_of(path):
    im=Image.open(path)
    if im.mode=='RGBA' and np.asarray(im)[...,3].min()<100:return mask_dark(path)
    a=np.asarray(im.convert('RGB')).astype(np.float32)
    bg=np.median(np.concatenate([a[:6].reshape(-1,3),a[-6:].reshape(-1,3),a[:,:6].reshape(-1,3),a[:,-6:].reshape(-1,3)]),0)
    if bg.mean()<30:return mask_dark(path)
    d=np.sqrt(((a-bg)**2).sum(2));near=d<16
    nO=nd.binary_opening(near,iterations=2);lab,_=nd.label(nO)
    edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg0=np.isin(lab,list(edge));bg0=nd.binary_dilation(bg0,iterations=3,mask=near)
    fg=nd.binary_opening(~bg0,iterations=1)
    l2,k=nd.label(fg);sz=nd.sum(fg,l2,range(1,k+1));fg=np.isin(l2,[i+1 for i in range(k) if sz[i]>400])
    e=fg&~nd.binary_erosion(fg,iterations=2);al=np.where(fg,1.,0.);al[e]=np.clip((d[e]-8)/40,0,1)
    al=np.clip(nd.gaussian_filter(al,.6)*fg,0,1)
    A=al[...,None];a=np.clip(np.where(A>.02,(a-(1-A)*bg)/np.maximum(A,.02),0),0,255)
    return a,al
