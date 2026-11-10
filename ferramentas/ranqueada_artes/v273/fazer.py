# v273: arte nova do MENU PRINCIPAL (Batalha Aventura/Treino/História/Configuração) e arte nova do Modos de Jogo (Perfil no lugar de Minha Posição)
import cv2,numpy as np,io,hashlib,json,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));R=D+'/../../..'
def webp(img,q=86):
    b=io.BytesIO();img.save(b,'WEBP',quality=q,method=6);d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(R+'/www/'+n,'wb').write(d);return n,len(d)//1024
def sem_ponto(im,box):   # apaga o "!" vermelho pintado (o pontinho de evento é do jogo)
    a=cv2.cvtColor(np.asarray(im),cv2.COLOR_RGB2BGR);hsv=cv2.cvtColor(a,cv2.COLOR_BGR2HSV);x0,y0,x1,y1=box;reg=hsv[y0:y1,x0:x1]
    red=(((reg[...,0]<10)|(reg[...,0]>170))&(reg[...,1]>120)&(reg[...,2]>120))|((reg[...,1]<60)&(reg[...,2]>200))
    sub=np.zeros(red.shape,np.uint8);sub[red]=255;n,lab,st,_=cv2.connectedComponentsWithStats(sub);big=1+int(np.argmax(st[1:,4]));ys,xs=np.where(lab==big)
    m=np.zeros(a.shape[:2],np.uint8);cv2.circle(m,(x0+int(xs.mean()),y0+int(ys.mean())),int(max(np.ptp(xs),np.ptp(ys))/2+7),255,-1)
    out=cv2.inpaint(a,m,9,cv2.INPAINT_TELEA);return Image.fromarray(cv2.cvtColor(out,cv2.COLOR_BGR2RGB))
P=R+'/ferramentas/web/ranqueada/rk_assets.json';A=json.load(open(P))
mp=Image.open(D+'/menu_principal_original.png').convert('RGB').resize((1847,851),Image.LANCZOS)
mo=sem_ponto(Image.open(D+'/modos_original.png').convert('RGB').resize((1847,851),Image.LANCZOS),(1770,235,1840,300));mo.save(D+'/modos_sem_ponto.png')
for k,img in [('menu_principal',mp),('menu_ranqueado',mo)]:
    old=A.get(k);n,kb=webp(img);A[k]=n;print(k,old,'->',n,kb,'KB')
    if old and old!=n and os.path.exists(R+'/www/'+old):os.remove(R+'/www/'+old)
json.dump(A,open(P,'w'),ensure_ascii=False,separators=(',',':'))
