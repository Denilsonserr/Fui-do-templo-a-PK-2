# v472: retratos (Igris inimigo e Igris sombra) sem fundo → www/a + refs.json
import os,json,hashlib,numpy as np,importlib.util
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,'../../..')
sp=importlib.util.spec_from_file_location('c',os.path.join(D,'cortar.py'))
src=open(os.path.join(D,'cortar.py')).read().split('out={}')[0];g={'__file__':os.path.join(D,'cortar.py')};exec(src,g)
out={}
for k,f in [('ig','ig_ref.jpg'),('igs','igs_ref.jpg')]:
  a=np.array(Image.open(os.path.join(D,'recebido',f)).convert('RGB'));A=g['alpha'](a,1)
  im=Image.fromarray(np.dstack([a,A]),'RGBA');bb=im.getbbox();im=im.crop(bb);im.thumbnail((520,700))
  t='/tmp/_r.webp';im.save(t,'WEBP',quality=88);h=hashlib.sha256(open(t,'rb').read()).hexdigest()[:14];os.replace(t,os.path.join(R,'www/a',h+'.webp'));out[k]='a/'+h+'.webp'
json.dump(out,open(os.path.join(D,'refs.json'),'w'));print(out)
