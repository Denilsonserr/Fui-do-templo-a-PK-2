# v280: retrato (HUD), miniatura (roster) e corpo inteiro (VS/biblioteca) do Shaka
import numpy as np,io,hashlib,json,os,sys
from PIL import Image
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))+'/../../bestas/lobo');from cortar import cut_rgb
D=os.path.dirname(os.path.abspath(__file__));W='/home/claude/fui-do-templo-a-pk-2/www/'
def save(im,ext,**kw):
    b=io.BytesIO();im.save(b,ext,**kw);d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.'+('jpg' if ext=='JPEG' else 'webp');open(W+n,'wb').write(d);return n
src=Image.open(D+'/recebido/04_corpo_inteiro_b.png').convert('RGB')
t=cut_rgb(np.asarray(src));ys,xs=np.where(t[...,3]>20);t=t[ys.min():ys.max()+1,xs.min():xs.max()+1];full=Image.fromarray(t)
full=full.resize((round(952*full.width/full.height),952),Image.LANCZOS)
face=src.crop((465,18,765,318)).resize((640,640),Image.LANCZOS)   # rosto
bg=Image.new('RGB',face.size,(40,24,4));port=face
I={'full':save(full,'WEBP',quality=88,alpha_quality=92,method=6),'port':save(port,'JPEG',quality=88),'pth':save(face.resize((220,220),Image.LANCZOS),'WEBP',quality=86)}
json.dump(I,open(D+'/build/imgs.json','w'));print(I);face.save('/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/skface.png')
