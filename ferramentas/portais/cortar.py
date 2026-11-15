# Portais (v460): tela, 6 cartas (E D C B A S) e 5 cenários do dono → webp em www/a (nome = hash) → portais.json
import json,hashlib,os,numpy as np
from PIL import Image
from scipy import ndimage
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,'../..');RC=os.path.join(D,'recebido')
def save(im,q=82,mode='RGB'):
  im=im.convert(mode);t='/tmp/_p.webp';im.save(t,'WEBP',quality=q,method=6);h=hashlib.sha256(open(t,'rb').read()).hexdigest()[:14];os.replace(t,os.path.join(R,'www/a',h+'.webp'));return 'a/'+h+'.webp'
out={'tela':save(Image.open(os.path.join(RC,'tela.png')),84)}
C=Image.open(os.path.join(RC,'cartas.png'));a=np.asarray(C.convert('RGB')).astype(int);m=a.max(2)>35;m=ndimage.binary_closing(m,iterations=3);lb,k=ndimage.label(m);F=ndimage.find_objects(lb)
B=sorted([(int((lb==i+1).sum()),F[i]) for i in range(k)],reverse=True)[:6];B=sorted([(s[1].start,s[0].start,s[1].stop,s[0].stop) for _,s in B])
out['cartas']=[save(C.crop(b).resize((300,round((b[3]-b[1])*300/(b[2]-b[0]))),Image.LANCZOS),86) for b in B];out['_box']=B
out['mapas']=[save(Image.open(os.path.join(RC,'mapa%d.png'%i)),80) for i in range(1,6)]
json.dump(out,open(os.path.join(D,'portais.json'),'w'),indent=1);print(json.dumps(out))
