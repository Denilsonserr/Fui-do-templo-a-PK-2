# Lobo Sombrio (besta de alma, modo teste da caça): recorta as folhas do dono em quadros transparentes -> quadros/*.png + info.json
import numpy as np,json,os
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__));R=D+'/recebido/';O=D+'/quadros/'
def cut_rgb(a):
    a=a.astype(float);mn=a.min(2);mx=a.max(2)
    white=(mn>228)&(mx-mn<30)
    lab,n=nd.label(white);bd=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    sz=nd.sum(white,lab,range(1,n+1));holes=[i+1 for i in range(n) if sz[i]>40]   # buracos brancos entre as pernas também somem
    bg=np.isin(lab,list(bd)+holes)
    near=nd.binary_dilation(bg,iterations=2)&~bg
    al=np.where(bg,0.,1.)
    lum=a.mean(2);al[near]=np.clip((255-lum[near])/110,0,1)
    safe=np.maximum(al,1e-3)[...,None];col=np.where(near[...,None],np.clip((a-255*(1-al[...,None]))/safe,0,255),a)
    return np.dstack([col,al*255]).astype(np.uint8)
def frames(f,cols,rows,rgb=True):
    im=Image.open(R+f);a=np.asarray(im.convert('RGBA' if not rgb else 'RGB'))
    H,W=a.shape[:2];L=[]
    for r in range(rows):
        for c in range(cols):
            t=a[r*H//rows:(r+1)*H//rows,c*W//cols:(c+1)*W//cols]
            t=cut_rgb(t) if rgb else t.copy()
            al=t[...,3]>40;lab,n=nd.label(nd.binary_closing(al,iterations=3));sz=nd.sum(al,lab,range(1,n+1));big=1+int(np.argmax(sz))
            body=lab==big;keep=np.zeros_like(al);by0,bx0=np.where(body);BB=(bx0.min()-30,by0.min()-30,bx0.max()+30,by0.max()+30)
            for i in range(1,n+1):
                if sz[i-1]<=60:continue
                yy,xx=np.where(lab==i)
                if xx.max()<BB[0] or xx.min()>BB[2] or yy.max()<BB[1] or yy.min()>BB[3]:continue
                if (xx.min()==0 or xx.max()==t.shape[1]-1 or yy.min()==0) and sz[i-1]<sz[big-1]*.2:continue   # pedaço do quadro vizinho
                keep|=lab==i
            t[...,3]=np.where(nd.binary_dilation(keep,iterations=2),t[...,3],0)
            ys,xs=np.where(t[...,3]>20);x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min(),ys.max()+1
            by,bx=np.where(body);foot=int(by.max());cx=float(bx.mean())
            L.append((Image.fromarray(t[y0:y1,x0:x1]),{'ax':float(cx-x0),'ay':int(foot-y0),'bh':int(foot-by.min()),'bw':int(bx.max()-bx.min())}))
    return L
S={'garras':frames('01_ataque_garras.png',3,2),'pulo':frames('02_pulo_bote.png',3,2),'ferido':frames('03_ferido_morte.png',3,2),'patada':frames('04_ataque_patada.png',3,2),'anda':frames('05_andando.png',6,1,False)}
info={}
for k,L in S.items():
    info[k]=[]
    for i,(im,m) in enumerate(L):im.save(O+f'{k}{i}.png');info[k].append(m)
json.dump(info,open(D+'/info.json','w'),indent=1)
for k,v in info.items():print(k,[(m['bw'],m['bh']) for m in v])
