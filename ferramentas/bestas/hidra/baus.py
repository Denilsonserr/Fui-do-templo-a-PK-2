# v357: baús do dono (fundo escuro com brilho) -> PNG transparentes, por célula da grade.
# fechados: linha 1 = animação do baú vermelho (6), linha 2 = 7 tipos; abertos: idem
import numpy as np,os
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__))
def cell(a,x0,y0,x1,y1):
    c=a[y0:y1,x0:x1];H,W=c.shape[:2]
    bl=np.concatenate([c[:,:6],c[:,-6:]],1);bgr=np.median(bl,1)          # fundo de cada linha (bordas esquerda/direita)
    d=np.sqrt(((c-bgr[:,None,:])**2).sum(2));mx=c.max(2)
    m=(d>55)|((mx<40)&(np.abs(c-bgr[:,None,:]).sum(2)>25))
    m=nd.binary_opening(m,iterations=1);lab,n=nd.label(nd.binary_closing(m,iterations=3))
    if n==0:return None
    sz=nd.sum(m,lab,range(1,n+1));big=1+int(np.argmax(sz));keep=lab==big
    for i in range(1,n+1):
        if sz[i-1]>sz[big-1]*.06:
            xs=np.where((lab==i).any(0))[0]
            if i!=big and (xs.min()<=1 or xs.max()>=W-2):continue
            keep|=lab==i
    keep=nd.binary_fill_holes(nd.binary_closing(keep,iterations=4));al=nd.gaussian_filter(keep.astype(float),.8)
    col=(al>.5).sum(0);ok=np.where(col>col.max()*.25)[0];al[:,:ok.min()]=0;al[:,ok.max()+1:]=0
    ys,xs=np.where(al>.1);yy0,yy1,xx0,xx1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    return Image.fromarray(np.dstack([c,al*255]).astype(np.uint8)[yy0:yy1,xx0:xx1])
def cut(f,pref):
    a=np.asarray(Image.open(D+'/recebido/'+f).convert('RGB')).astype(float)
    for r,(y0,y1,n) in enumerate([(250,560,6),(575,820,7)],1):
        w=1536/n
        for k in range(n):
            im=cell(a,int(k*w)+2,y0,int((k+1)*w)-2,y1)
            if im:im.save(f'{D}/baus/{pref}{r}_{k}.png')
cut('baus_fechados.png','f');cut('baus_abertos.png','a')
