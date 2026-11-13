# v389: recorta as camadas do cenário do SHAKA (arte do dono em recebido/) → camadas/*.png com transparência
# fundo branco/xadrez (falsa transparência) ou preto: some quem encosta na borda OU é uma área grande (aberturas dos arcos)
import numpy as np,os
from PIL import Image,ImageFilter
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__));R=D+'/recebido/';O=D+'/camadas/';os.makedirs(O,exist_ok=True)
def save(a,nm):Image.fromarray(a).save(O+nm+'.png');print(nm,a.shape[1],a.shape[0])
def cut(src,nm,kind,big=3000):
    a=np.array(Image.open(R+src).convert('RGB')).astype(int);mx=a.max(2);mn=a.min(2)
    if kind=='w':bg=(mn>=236)&(mx-mn<=6)
    else:bg=mx<=10
    lab,n=nd.label(bg);keep=np.zeros(n+1,bool)
    edge=np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]);keep[edge]=True
    sz=nd.sum(np.ones_like(lab),lab,range(n+1));keep|=sz>big;keep[0]=False
    m=keep[lab];m=nd.binary_dilation(m,iterations=1)          # come a franja clara/escura de 1 px
    al=(~m).astype(np.uint8)*255;al=np.array(Image.fromarray(al).filter(ImageFilter.GaussianBlur(.8)))
    al[~m]=255
    out=np.dstack([a.astype(np.uint8),al]);save(out,nm)
def rgba(src,nm,opaque=False):
    a=np.array(Image.open(R+src).convert('RGBA'))
    if opaque:a[...,3]=255
    save(a,nm)
rgba('c1_ceu.png','c1_ceu',1);rgba('c1_meio.png','c1_meio');rgba('c1_chao.png','c1_chao');rgba('c1_templo.png','c1_templo');rgba('c1_estatua.png','c1_estatua')
rgba('c2_ceu.png','c2_ceu',1);cut('c2_meio.png','c2_meio','w');cut('c2_templo.png','c2_templo','w');cut('c2_estatua.png','c2_estatua','k');cut('c2_chao.png','c2_chao','k')
rgba('c3_ceu.png','c3_ceu',1);cut('c3_meio.png','c3_meio','w');cut('c3_ruinas.png','c3_ruinas','w');cut('c3_estatua.png','c3_estatua','k');cut('c3_chao.png','c3_chao','w')
cut('c3_estatuaB.png','c3_estatuaB','w');cut('c3_chaoB.png','c3_chaoB','k');cut('c3_meioB.png','c3_meioB','w')
