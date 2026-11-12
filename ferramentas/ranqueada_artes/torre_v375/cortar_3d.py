# v375: recorta a folha 3D (fundo de grama) com GrabCut: retângulo à mão + grama verde marcada como fundo provável
import numpy as np,os,cv2
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__))
im=cv2.imread(D+'/recebido/props3d.png')
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
B={'bau_f':(55,70,345,350),'bau_ouro':(355,25,615,315),'bau_roxo':(635,45,895,310),'est_lanterna':(875,0,1150,410),'est_cavaleiro':(1160,0,1410,410),'est_anjo':(1405,0,1665,415),
   'rocha_runa':(375,345,665,595),'cristal':(695,360,910,575),'arco':(1235,395,1650,685),'coluna':(25,575,175,935),'coluna_p':(155,640,305,935),'coluna_hera':(310,570,445,905),
   'muro':(445,585,775,905),'braseiro':(775,560,905,905),'bandeira':(895,555,1055,905),'barril':(1050,680,1185,895),'caixas':(1175,640,1340,915),'fogueira':(1355,675,1625,895)}
for nm,(x0,y0,x1,y1) in B.items():
    c=im[y0:y1,x0:x1].copy();h=hsv[y0:y1,x0:x1];M=np.full(c.shape[:2],cv2.GC_PR_FGD,np.uint8)
    green=(h[...,0]>=30)&(h[...,0]<=85)&(h[...,1]>70)
    M[green]=cv2.GC_PR_BGD;M[nd.binary_erosion(green,iterations=4)]=cv2.GC_BGD
    M[:3,:]=M[-3:,:]=cv2.GC_BGD;M[:,:3]=M[:,-3:]=cv2.GC_BGD
    bg=np.zeros((1,65));fg=np.zeros((1,65));cv2.grabCut(c,M,None,bg,fg,6,cv2.GC_INIT_WITH_MASK)
    m=(M==cv2.GC_FGD)|(M==cv2.GC_PR_FGD);m=nd.binary_opening(m,iterations=2)
    lab,n=nd.label(m);sz=nd.sum(m,lab,range(1,n+1));keep=np.isin(lab,[i+1 for i,s in enumerate(sz) if s>=.15*sz.max()]);m=nd.binary_fill_holes(keep)
    ys,xs=np.where(m);a=cv2.GaussianBlur((m*255).astype(np.uint8),(3,3),0)
    rgba=np.dstack([c[...,::-1],a])[ys.min():ys.max()+1,xs.min():xs.max()+1]
    Image.fromarray(rgba).save(f'{D}/sp/{nm}.png');print(nm,rgba.shape[1],rgba.shape[0])
