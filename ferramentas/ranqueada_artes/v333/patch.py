# v333: tira o nome e a foto gravados no vídeo novo do menu (cada jogador vê o próprio) -> remendo.png (RGBA) para sobrepor em todos os quadros
import cv2,numpy as np,subprocess,os
D=os.path.dirname(os.path.abspath(__file__));V=D+'/menu_pvp_original.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-ss','0','-i',V,'-frames:v','1',D+'/q0.png'],check=True)
im=cv2.imread(D+'/q0.png');H,W=im.shape[:2]
# texto: pixels claros dentro da barra roxa
x0,y0,x1,y1=138,12,340,64;roi=im[y0:y1,x0:x1];g=cv2.cvtColor(roi,cv2.COLOR_BGR2GRAY);hsv=cv2.cvtColor(roi,cv2.COLOR_BGR2HSV)
m=((g>150)|((hsv[...,1]<90)&(g>110))|((hsv[...,0]>10)&(hsv[...,0]<35)&(hsv[...,1]>80)&(g>90))).astype(np.uint8)*255
m=cv2.dilate(m,np.ones((5,5),np.uint8),2)
M=np.zeros((H,W),np.uint8);M[y0:y1,x0:x1]=m
out=cv2.inpaint(im,M,9,cv2.INPAINT_TELEA)
# leve desfoque só onde tinha texto (fica uma faixa roxa lisa)
bl=cv2.GaussianBlur(out,(0,0),4);mm=cv2.GaussianBlur(M,(0,0),3)[...,None]/255.;out=(out*(1-mm)+bl*mm).astype(np.uint8)
# foto: círculo escuro
cx,cy,r=78,39,31;yy,xx=np.mgrid[0:H,0:W];d=np.sqrt((xx-cx)**2+(yy-cy)**2)
circ=np.zeros((H,W,3),np.float32);t=np.clip(d/r,0,1)[...,None];circ[:]=(np.array([40,18,24])*(1-t)+np.array([20,8,12])*t)
ca=np.clip((r-d)/2.5,0,1)[...,None];out=(out*(1-ca)+circ*ca).astype(np.uint8)
# alfa: só a área do texto (macia) + círculo
A=np.zeros((H,W),np.float32);A[y0:y1,x0:x1]=1;A=cv2.GaussianBlur(A,(0,0),2.5);A=np.maximum(A*(cv2.GaussianBlur(M,(0,0),6)>8),ca[...,0])
A=np.maximum(A,cv2.GaussianBlur((M>0).astype(np.float32),(0,0),3))
rgba=np.dstack([out,(np.clip(A,0,1)*255).astype(np.uint8)]);cv2.imwrite(D+'/remendo.png',rgba);cv2.imwrite(D+'/q0_limpo.png',(out*A[...,None]+im*(1-A[...,None])).astype(np.uint8))
print('ok')
