# v378: baús de novo — fundo = grama (verde domina) + GrabCut com caixa larga; maior pedaço, sem buracos, borda suave
import numpy as np,cv2,os
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__));a=np.array(Image.open(D+'/recebido/props3d.png').convert('RGB'))
B={'bau_f':(40,90,355,355),'bau_ouro':(350,40,625,320),'bau_roxo':(630,50,905,310)}
for k,(x0,y0,x1,y1) in B.items():
    c=a[y0:y1,x0:x1].astype(int);r,g,b=c[...,0],c[...,1],c[...,2]
    green=(g>r+6)&(g>b-4)
    m=np.full(c.shape[:2],cv2.GC_PR_FGD,np.uint8);m[green]=cv2.GC_PR_BGD;m[(g>r+25)]=cv2.GC_BGD
    m[:4,:]=cv2.GC_BGD;m[-4:,:]=cv2.GC_BGD;m[:,:4]=cv2.GC_BGD;m[:,-4:]=cv2.GC_BGD
    bg=np.zeros((1,65),np.float64);fg=np.zeros((1,65),np.float64)
    cv2.grabCut(np.ascontiguousarray(c.astype(np.uint8)),m,None,bg,fg,6,cv2.GC_INIT_WITH_MASK)
    fgm=(m==cv2.GC_FGD)|(m==cv2.GC_PR_FGD);fgm&=~(g>r+18)
    lb,n=nd.label(fgm);sz=nd.sum(fgm,lb,range(1,n+1));fgm=lb==(np.argmax(sz)+1);fgm=nd.binary_fill_holes(fgm);fgm=nd.binary_opening(fgm,iterations=1)
    al=cv2.GaussianBlur((fgm*255).astype(np.uint8),(3,3),0)
    o=np.dstack([a[y0:y1,x0:x1],al]);ys,xs=np.where(al>10);o=o[ys.min():ys.max()+1,xs.min():xs.max()+1]
    # tira o verde que sobrou na borda (despill)
    rgb=o[...,:3].astype(int);edge=(o[...,3]<250);sp=np.maximum(0,rgb[...,1]-np.maximum(rgb[...,0],rgb[...,2]));rgb[...,1]-=np.where(edge,sp,0);o[...,:3]=np.clip(rgb,0,255)
    Image.fromarray(o.astype(np.uint8)).save(f'{D}/sp/{k}.png');print(k,o.shape)
