# v389: simula a câmera do jogo (WW=2400, VW=960, H=540) para acertar as camadas do cenário do Shaka
import json,os,sys
from PIL import Image,ImageDraw
D=os.path.dirname(os.path.abspath(__file__));L=json.load(open(D+'/layout.json'))
WW,VW,H,FLOOR=2400,960,540,486
def view(ph,cx,z,out):
    c=Image.new('RGBA',(VW,H),(0,0,0,255));camx=cx-VW/(2*z)
    for nm,p,sc,dy,*ox in ph:
        im=Image.open(D+'/camadas/'+nm+'.png').convert('RGBA');w=im.width*sc;h=im.height*sc
        x=(WW-w)/2+(cx-WW/2)*(1-p)+(ox[0] if ox else 0)
        sx=(x-camx)*z;sy=H+(dy-H)*z;im=im.resize((max(1,round(w*z)),max(1,round(h*z))));t=Image.new('RGBA',c.size,(0,0,0,0));t.paste(im,(round(sx),round(sy)));c=Image.alpha_composite(c,t)
    d=ImageDraw.Draw(c);fy=H+(FLOOR-H)*z;d.line([(0,fy),(VW,fy)],fill=(0,255,0,255))
    for fx in (VW*.35,VW*.65):d.rectangle([fx-35,fy-230*z,fx+35,fy],outline=(255,255,0,255),width=2)
    return c
out=Image.new('RGB',(VW*2,H*3))
for i,ph in enumerate(L):
    for j,(cx,z) in enumerate([(1200,1),(VW/2/.9,.9)]):
        out.paste(view(ph,cx,z,None).convert('RGB'),(j*VW,i*H))
out.save(sys.argv[1]);print('ok')
