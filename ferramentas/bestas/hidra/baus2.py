# v359: recorte dos baús refeito com GrabCut (o v357 deixava pedaços do brilho e buracos)
import numpy as np,os,cv2
TX=float(os.environ.get("TX",14));IT=int(os.environ.get("IT",2))
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__))
def cell(img,x0,y0,x1,y1):
    c=img[y0:y1,x0:x1].copy();H,W=c.shape[:2]
    # quase nada do fundo é preto puro: semente de fundo = bordas + pixels pouco saturados e escuros
    m=np.full((H,W),cv2.GC_PR_BGD,np.uint8);m[8:H-8,8:W-8]=cv2.GC_PR_FGD
    hsv=cv2.cvtColor(c,cv2.COLOR_BGR2HSV);v=hsv[...,2].astype(int);s=hsv[...,1].astype(int)
    m[:4,:]=m[-4:,:]=cv2.GC_BGD;m[:,:4]=m[:,-4:]=cv2.GC_BGD
    m[(v<35)]=cv2.GC_PR_BGD
    bg=np.zeros((1,65),np.float64);fg=np.zeros((1,65),np.float64)
    cv2.grabCut(c,m,None,bg,fg,6,cv2.GC_INIT_WITH_MASK)
    k=(m==cv2.GC_FGD)|(m==cv2.GC_PR_FGD)
    lab,n=nd.label(k);sz=nd.sum(k,lab,range(1,n+1));k=lab==(1+int(np.argmax(sz)))
    k=nd.binary_fill_holes(nd.binary_closing(k,iterations=3));k=nd.binary_opening(k,iterations=2)
    lab,n=nd.label(k);sz=nd.sum(k,lab,range(1,n+1));k=lab==(1+int(np.argmax(sz)));k=nd.binary_fill_holes(k)
    # v359b: brilho = região lisa (pouca textura) fora do baú; o baú tem detalhe e contorno.
    g=cv2.cvtColor(c,cv2.COLOR_BGR2GRAY).astype(np.float32)
    sd=np.sqrt(np.maximum(cv2.blur(g*g,(7,7))-cv2.blur(g,(7,7))**2,0))
    kt=k&(sd>TX);kt=nd.binary_closing(kt,iterations=IT);kt=nd.binary_fill_holes(kt)
    kt=nd.binary_opening(kt,iterations=3)
    lab,n=nd.label(kt);sz=nd.sum(kt,lab,range(1,n+1));kt=lab==(1+int(np.argmax(sz)))
    k=nd.binary_fill_holes(kt)&k|nd.binary_fill_holes(kt)&nd.binary_erosion(k,iterations=0) if False else nd.binary_fill_holes(kt)&nd.binary_fill_holes(k)
    al=cv2.GaussianBlur(k.astype(np.float32),(3,3),0)
    ys,xs=np.where(al>.1);rgb=cv2.cvtColor(c,cv2.COLOR_BGR2RGB)
    return Image.fromarray(np.dstack([rgb,al*255]).astype(np.uint8)[ys.min():ys.max()+1,xs.min():xs.max()+1])
# v359b: as colunas da folha NÃO são iguais; limites medidos à mão (linha de baixo = a usada no jogo)
XB={'f':[5,204,414,625,842,1059,1285,1531],'a':[8,222,432,637,842,1059,1285,1530]}
YB={'f':(585,800),'a':(532,830)}
def cut(f,pref):
    img=cv2.imread(D+'/recebido/'+f);xb=XB[pref];y0,y1=YB[pref]
    for k in range(7):cell(img,xb[k],y0,xb[k+1],y1).save(f'{D}/baus/{pref}2_{k}.png')
cut('baus_fechados.png','f');cut('baus_abertos.png','a')
