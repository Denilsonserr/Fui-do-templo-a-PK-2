# v473: os 6 portais (E D C B A S) da folha do dono → www/a + portais_rank.json (tela VERSUS e tela dos portais)
import os,json,hashlib,numpy as np
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,'../..')
src=open(os.path.join(D,'npc/cortar.py')).read().split('def splits')[0];g={'__file__':os.path.join(D,'npc/cortar.py')};exec(src,g)
I=Image.open(os.path.join(D,'recebido/portais_ranks.png'));I=I.convert('RGBA');a4=np.array(I);a=a4[...,:3];A=a4[...,3] if a4[...,3].min()<250 else g['alpha'](a);H,W=A.shape;out=[]  # a folha já vem sem fundo
cp=(A>40).sum(0);xs=np.where(cp>0)[0];lo,hi=xs[0],xs[-1]+1
for i in range(6):
  x0=int(lo+(hi-lo)*i/6);x1=int(lo+(hi-lo)*(i+1)/6);blk=A[:,x0:x1];ys,xx=np.where(blk>30);bb=(xx.min(),ys.min(),xx.max()+1,ys.max()+1)
  im=Image.fromarray(np.dstack([a[:,x0:x1],blk]),'RGBA').crop(bb);im.thumbnail((520,520))
  t='/tmp/_p.webp';im.save(t,'WEBP',quality=88);h=hashlib.sha256(open(t,'rb').read()).hexdigest()[:14];os.replace(t,os.path.join(R,'www/a',h+'.webp'));out.append('a/'+h+'.webp')
json.dump(out,open(os.path.join(D,'portais_rank.json'),'w'));print(out)
