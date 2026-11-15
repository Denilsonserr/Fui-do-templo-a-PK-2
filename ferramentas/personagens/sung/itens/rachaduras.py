# v461: ícones do Monarca com RACHADURAS vermelhas brilhando (pedido do dono) → www/a/<hash>.webp → itens_rachados.json
import json,hashlib,os,random,math
from PIL import Image,ImageDraw,ImageFilter,ImageChops
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,'../../../..');J=json.load(open(os.path.join(D,'itens.json')));out={}
for k in ['sjcap','sjarm','sjesp','sjbot','sjcol','sjane','sjman']:
  im=Image.open(os.path.join(R,'www',J[k])).convert('RGB');W,H=im.size;random.seed(k)
  L=Image.new('L',(W,H),0);d=ImageDraw.Draw(L)
  for n in range(7):
    # rachadura: nasce na borda interna e entra em zigue-zague, com galhos
    side=random.choice([0,1,2,3]);x,y=[(random.uniform(.18,.82)*W,.12*H),(random.uniform(.18,.82)*W,.88*H),(.12*W,random.uniform(.2,.8)*H),(.88*W,random.uniform(.2,.8)*H)][side]
    ang=math.atan2(H/2-y,W/2-x)+random.uniform(-.6,.6);w=random.choice([2,2,3]);P=[(x,y)]
    for s in range(random.randint(4,7)):
      ang+=random.uniform(-.7,.7);ln=random.uniform(.04,.09)*W;x+=math.cos(ang)*ln;y+=math.sin(ang)*ln;P.append((x,y))
      if random.random()<.35:
        a2=ang+random.choice([-1,1])*random.uniform(.6,1.2);x2,y2=x+math.cos(a2)*ln*.8,y+math.sin(a2)*ln*.8;d.line([(x,y),(x2,y2)],fill=200,width=max(1,w-1))
    d.line(P,fill=255,width=w,joint='curve')
  glow=L.filter(ImageFilter.GaussianBlur(4))
  red=Image.new('RGB',(W,H),(255,30,45));core=Image.new('RGB',(W,H),(255,210,190))
  im=Image.composite(red,im,glow.point(lambda v:min(255,int(v*1.6))));im=Image.composite(core,im,L.point(lambda v:int(v*.85)))
  t='/tmp/_r.webp';im.save(t,'WEBP',quality=88,method=6);h=hashlib.sha256(open(t,'rb').read()).hexdigest()[:14];os.replace(t,os.path.join(R,'www/a',h+'.webp'));out[k]='a/'+h+'.webp'
json.dump(out,open(os.path.join(D,'itens_rachados.json'),'w'),indent=1);print(json.dumps(out))
