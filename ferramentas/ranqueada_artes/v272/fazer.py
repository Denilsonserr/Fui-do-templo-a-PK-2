# v272: nova arte "Modos de Jogo" do dono -> tira o "!" vermelho pintado (o ponto do evento é do jogo) -> webp -> RQA.menu_ranqueado
import cv2,numpy as np,io,hashlib,json,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));R=D+'/../../..'
im=Image.open(D+'/modos_original.png').convert('RGB').resize((1847,851),Image.LANCZOS)
a=cv2.cvtColor(np.asarray(im),cv2.COLOR_RGB2BGR)
hsv=cv2.cvtColor(a,cv2.COLOR_BGR2HSV);m=np.zeros(a.shape[:2],np.uint8)
y0,y1,x0,x1=240,300,1770,1835
reg=hsv[y0:y1,x0:x1];red=(((reg[...,0]<10)|(reg[...,0]>170))&(reg[...,1]>120)&(reg[...,2]>120))|((reg[...,1]<60)&(reg[...,2]>200))
sub=np.zeros(red.shape,np.uint8);sub[red]=255
n,lab,st,_=cv2.connectedComponentsWithStats(sub)
big=1+int(np.argmax(st[1:,4]));ys,xs=np.where(lab==big);cx,cy=int(xs.mean()),int(ys.mean())
cv2.circle(m,(x0+cx,y0+cy),int(max(np.ptp(xs),np.ptp(ys))/2+7),255,-1)
out=cv2.inpaint(a,m,9,cv2.INPAINT_TELEA);cv2.imwrite(D+'/modos_sem_ponto.png',out)
b=io.BytesIO();Image.fromarray(cv2.cvtColor(out,cv2.COLOR_BGR2RGB)).save(b,'WEBP',quality=86,method=6);d=b.getvalue()
n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(R+'/www/'+n,'wb').write(d)
P=R+'/ferramentas/web/ranqueada/rk_assets.json';A=json.load(open(P));old=A['menu_ranqueado'];A['menu_ranqueado']=n
json.dump(A,open(P,'w'),ensure_ascii=False,separators=(',',':'));print(old,'->',n,len(d)//1024,'KB',(x0+cx,y0+cy))
