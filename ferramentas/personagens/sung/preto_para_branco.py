# v424: folha com FUNDO PRETO (20_parado_espada_chao) -> recorta o fundo (preto ligado à borda) e grava sobre BRANCO para o seg_sj.py.
# O casaco é quase preto: o fundo é só o preto (<=T) ligado à borda; buracos pretos grandes (entre braço/espada/fita) também viram fundo.
import sys,numpy as np
from PIL import Image
from scipy import ndimage as nd
src,dst=sys.argv[1],sys.argv[2];T=int(sys.argv[3]) if len(sys.argv)>3 else 3
a=np.asarray(Image.open(src).convert('RGB')).astype(float);mx=a.max(2)
dark=mx<=T;lab,k=nd.label(dark);b=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
sz0=nd.sum(dark,lab,range(1,k+1));big=[i+1 for i in range(k) if sz0[i]>=250]
bg=np.isin(lab,list(b|set(big)))  # fundo da borda + buracos pretos grandes (entre braço, espada e fita)
fg=~bg;fg=nd.binary_opening(fg,iterations=2)
lab2,k2=nd.label(fg);sz=nd.sum(fg,lab2,range(1,k2+1));fg=np.isin(lab2,[i+1 for i in range(k2) if sz[i]>800])
al=fg.astype(float);edge=fg&~nd.binary_erosion(fg,iterations=2)
al[edge]=np.clip(mx[edge]/18,0.35,1)
al=nd.gaussian_filter(al,.5)*fg
o=a*al[...,None]+255*(1-al[...,None])
Image.fromarray(o.clip(0,255).astype(np.uint8)).save(dst);print('ok',fg.mean().round(3))
