# v459: recorta as artes do dono (itens do Sung, manopla, poções, carta) → webp em www/a (nome = hash). Saída: itens.json
import json,hashlib,os,numpy as np
from PIL import Image
from scipy import ndimage
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,'../../../..')
def boxes(p,n):
  a=np.asarray(Image.open(p).convert('RGB')).astype(int);m=a.max(2)>40;m=ndimage.binary_closing(m,iterations=6);lb,k=ndimage.label(m)
  F=ndimage.find_objects(lb);S=sorted([(int((lb==i+1).sum()),F[i]) for i in range(k)],reverse=True)[:n]
  B=[(s[1].start,s[0].start,s[1].stop,s[0].stop) for _,s in S];return sorted(B,key=lambda b:(round(b[1]/300),b[0]))
def save(im,w):
  im=im.convert('RGB');im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS);t='/tmp/_c.webp';im.save(t,'WEBP',quality=86,method=6)
  h=hashlib.sha256(open(t,'rb').read()).hexdigest()[:14];os.replace(t,os.path.join(R,'www/a',h+'.webp'));return 'a/'+h+'.webp'
out={}
A=Image.open(os.path.join(D,'folha_set.png'));B1=[(6,74,416,612),(420,74,834,612),(838,74,1248,612),(173,618,584,1159),(670,618,1081,1159)]  # 3 de cima encostados: corte manual nas colunas vazias
for k,b in zip(['sjcap','sjarm','sjesp','sjbot','sjcol'],B1):out[k]=save(A.crop(b),220)
B=Image.open(os.path.join(D,'folha_extra.png'));B2=boxes(os.path.join(D,'folha_extra.png'),4)
for k,b in zip(['sjane','sjman','pvida','psomb'],B2):out[k]=save(B.crop(b),220)
C=Image.open(os.path.join(D,'carta_sung.png'));out['carta']=save(C.resize((700,1020),Image.LANCZOS),700)
P=Image.open(os.path.join(R,'ferramentas/ranqueada_artes/passe_s2/passe_solo_leveling.png'));out['passe']=save(P,1847)
json.dump(out,open(os.path.join(D,'itens.json'),'w'),indent=1);print(json.dumps(out),B1,B2)
