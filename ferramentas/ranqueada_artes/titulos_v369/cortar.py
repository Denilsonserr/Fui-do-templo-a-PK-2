# v369: recorta as 21 placas de título da folha do dono. O fundo é um xadrez DESENHADO (não é transparência).
# Faixa manual por placa + GrabCut: semente de fundo = cinza claro sem cor ligado à borda da faixa; semente de frente = pixels coloridos.
import numpy as np,cv2,os
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__));os.makedirs(D+'/placas',exist_ok=True)
im=cv2.imread(D+'/folha.png');f=im.astype(int);sat=f.max(2)-f.min(2);v=f.mean(2)
L=(85,840);R=(938,1685)
P=[('adm',L,8,124),('deus_celestial',L,110,224),('divindade',L,222,322),('imortal',L,333,420),('lenda_viva',L,408,498),('mestre_supremo',L,488,578),
   ('conquistador',L,563,658),('veterano',L,648,728),('elite',L,718,802),('campeao_servidor',L,795,875),
   ('top1_servidor',R,6,106),('top2_servidor',R,96,182),('top3_servidor',R,173,260),('top10_servidor',R,253,337),('top1_pvp',R,327,412),('top2_pvp',R,402,482),
   ('top3_pvp',R,472,554),('top1_caca',R,546,620),('top1_torre',R,612,692),('top1_aventura',R,685,768),('deus',R,758,866)]
for nm,(x0,x1),y0,y1 in P:
    c=im[y0:y1,x0:x1].copy();s=sat[y0:y1,x0:x1];g=v[y0:y1,x0:x1]
    cand=(s<=14)&(g>=198);lab,n=nd.label(cand);bd=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg=np.isin(lab,list(bd))
    M=np.full(s.shape,cv2.GC_PR_FGD,np.uint8);M[bg]=cv2.GC_PR_BGD;M[nd.binary_erosion(bg,iterations=2)]=cv2.GC_BGD;M[(s>=60)&(g<235)]=cv2.GC_FGD
    M[0,:]=M[-1,:]=cv2.GC_BGD;M[:,0]=M[:,-1]=cv2.GC_BGD
    bm=np.zeros((1,65),np.float64);fm=np.zeros((1,65),np.float64);cv2.grabCut(c,M,None,bm,fm,5,cv2.GC_INIT_WITH_MASK)
    m=(M==cv2.GC_FGD)|(M==cv2.GC_PR_FGD);m=nd.binary_opening(m,iterations=1)
    lab,n=nd.label(m);sz=nd.sum(m,lab,range(1,n+1));m=lab==(1+int(np.argmax(sz)))
    # fecha TODOS os buracos (miolo das letras) e depois tira só o que tem o padrão de 2 tons do xadrez
    m=nd.binary_fill_holes(m)
    if nm in ('imortal','top1_aventura'):  # resto claro do xadrez colado em cima (tingido pelo brilho da placa de cima)
        top=np.zeros_like(m);top[:30]=True;m&=~(top&(s<60)&(g>150))
    dk=(cand&(g>=200)&(g<=232)).astype(np.float32);lt=(cand&(g>=240)).astype(np.float32)
    fd=cv2.blur(dk,(13,13));fl=cv2.blur(lt,(13,13));chk=cand&(fd>.18)&(fl>.18)&((fd+fl)>.7)
    m&=~nd.binary_dilation(chk,iterations=1);m=nd.binary_opening(m,iterations=1)
    lab,n=nd.label(m);sz=nd.sum(m,lab,range(1,n+1));m=lab==(1+int(np.argmax(sz)));m=nd.binary_fill_holes(m)&~chk
    # linhas finas (pedaço da placa vizinha) nas bordas de cima/baixo: abertura vertical só nas 16 linhas das pontas
    ys,xs=np.where(m);t0,t1=ys.min(),ys.max()+1;ov=nd.binary_opening(m,structure=np.ones((7,1)))
    m[t0:t0+16]=ov[t0:t0+16];m[t1-16:t1]=ov[t1-16:t1];lab,n=nd.label(m);sz=nd.sum(m,lab,range(1,n+1));m=lab==(1+int(np.argmax(sz)))
    ys,xs=np.where(m);a0,a1,b0,b1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    a=cv2.GaussianBlur((m*255).astype(np.uint8),(3,3),0)[a0:a1,b0:b1]
    cv2.imwrite(f'{D}/placas/{nm}.png',np.dstack([c[a0:a1,b0:b1],a]));print(nm,b1-b0,a1-a0)
