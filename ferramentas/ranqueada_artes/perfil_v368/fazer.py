# v368: artes do novo Perfil/Álbum/Coleção/Batalhas (dono). Apaga textos fixos que o jogo escreve por cima.
import cv2,numpy as np,os
D=os.path.dirname(os.path.abspath(__file__))
def inp(src,out,boxes,r=7):
    # mistura linear entre a coluna da esquerda e a da direita de cada caixa (fundo é degradê suave)
    im=cv2.imread(D+'/'+src).astype(np.float32)
    for x0,y0,x1,y1 in boxes:
        L=im[y0:y1,x0-2:x0].mean(1,keepdims=True);R=im[y0:y1,x1:x1+2].mean(1,keepdims=True)
        t=np.linspace(0,1,x1-x0)[None,:,None];im[y0:y1,x0:x1]=L*(1-t)+R*t
    cv2.imwrite(D+'/'+out,np.clip(im,0,255).astype(np.uint8))
inp('perfil.png','perfil_limpo.png',[(490,150,650,192),(490,196,862,230),(728,98,780,148),(494,233,722,283),(1122,228,1172,276)])
inp('batalhas.png','batalhas_limpo.png',[(262,12,512,62)])
