# v375: folha de armadilhas (xadrez DESENHADO de 2 tons 253/236): fundo = cinza claro sem cor ligado à borda; peças por faixa, da esquerda p/ direita
import numpy as np,os,cv2
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__))
a=np.array(Image.open(D+'/recebido/armadilhas.png').convert('RGB'));f=a.astype(int);g=f.mean(2);s=f.max(2)-f.min(2)
cand=(s<14)&(g>=226);lab,n=nd.label(cand);bd=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
# o xadrez é quebrado em ilhas pelas peças → pega todas as ilhas grandes de xadrez também
sz=nd.sum(cand,lab,range(1,n+1));big={i+1 for i,v in enumerate(sz) if v>4000}
bg=np.isin(lab,list(bd|big));fg=~bg;fg=nd.binary_opening(fg,iterations=1)
BANDS=[('poca',(20,140),3),('spl',(20,140),5),('met',(150,365),5),('exp',(150,365),1),('crat',(150,365),2),('esp',(390,485),6),('ped',(500,690),5),('mach',(500,690),4),('lobo',(705,865),5),('serra',(705,865),4),('lava',(885,995),9)]
done={}
for (nm,(y0,y1),cnt) in BANDS:
    m=fg[y0:y1];lb,k=nd.label(nd.binary_dilation(m,iterations=5));objs=[]
    for i,sl in enumerate(nd.find_objects(lb)):
        ar=((lb[sl]==i+1)&m[sl]).sum()
        if ar>600:objs.append((sl[1].start,sl[1].stop,sl[0].start,sl[0].stop,i+1))
    objs.sort();done.setdefault((y0,y1),0)
    st=done[(y0,y1)];take=objs[st:st+cnt];done[(y0,y1)]+=cnt
    print(nm,len(objs),[(o[0],o[1]) for o in take])
    for j,(xa,xb,ya,yb,i) in enumerate(take):
        mm=(lb[ya:yb,xa:xb]==i)&m[ya:yb,xa:xb];mm=nd.binary_fill_holes(mm)
        al=cv2.GaussianBlur((mm*255).astype(np.uint8),(3,3),0)
        Image.fromarray(np.dstack([a[y0+ya:y0+yb,xa:xb],al])).save(f'{D}/sp/tr_{nm}{j}.png')
