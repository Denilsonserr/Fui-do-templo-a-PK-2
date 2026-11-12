# v387 (TESTE): separa a juba solta do Shaka (pose parada) em 2 camadas: corpo (sem a juba) + cabelo (só a juba).
# Polígonos feitos à mão em cima de cada quadro (coordenadas do PNG do quadro); dentro do polígono = cabelo.
# No jogo o cabelo balança com o vento (rk.js "v387"): parado na raiz (cabeça), mais solto na ponta.
import json,io,hashlib,os,numpy as np
from PIL import Image,ImageDraw,ImageFilter
R=os.path.dirname(os.path.abspath(__file__))+'/../../../../';W=R+'www/'
P={389:[(215,10),(150,4),(95,24),(40,58),(8,115),(0,170),(2,220),(15,265),(30,300),(55,305),(75,325),(110,335),(130,330),(132,290),(100,280),(85,268),(82,245),(95,215),(105,192),(98,180),(98,117),(150,108),(195,104),(215,92)],
   391:[(210,10),(150,8),(100,28),(45,58),(12,105),(2,160),(5,215),(20,260),(35,300),(60,315),(90,322),(115,318),(128,300),(122,280),(122,230),(118,200),(100,187),(100,117),(150,108),(195,104),(212,92)],
   396:[(212,10),(150,10),(100,30),(50,58),(18,105),(4,160),(8,215),(25,265),(45,300),(75,312),(105,315),(135,305),(140,280),(140,205),(130,192),(113,187),(113,117),(155,108),(198,104),(214,92)]}
d=json.load(open(R+'ferramentas/personagens/shaka/build/sk.json'))['sk']['idle'];OUT={};S=os.path.dirname(os.path.abspath(__file__))
def webp(im):
    b=io.BytesIO();im.save(b,'WEBP',quality=90,method=6,alpha_quality=95);x=b.getvalue();n='a/'+hashlib.md5(x).hexdigest()[:14]+'.webp';open(W+n,'wb').write(x);return n
for f in d:
    src=f['src']
    if src in OUT:continue
    im=Image.open(W+src).convert('RGBA');w,h=im.size;poly=P[w]
    m=Image.new('L',im.size,0);ImageDraw.Draw(m).polygon(poly,fill=255);pass  # máscara DURA: corpo + cabelo somam 100% (com borda suave aparecia uma linha onde as camadas se encontram)
    a=np.array(im).astype(np.float32);k=np.array(m).astype(np.float32)/255
    from scipy import ndimage as nd
    kd=nd.binary_dilation(k>.5,iterations=3).astype(np.float32);ke=nd.binary_erosion(k>.5,iterations=3).astype(np.float32)
    # as camadas se SOBREPÕEM 3 px na borda (o cabelo por cima): sem a linha clara que o filtro da imagem deixava onde as duas se encontravam
    hair=a.copy();hair[...,3]*=kd;body=a.copy();body[...,3]*=(1-ke)
    hi=Image.fromarray(hair.clip(0,255).astype(np.uint8));bi=Image.fromarray(body.clip(0,255).astype(np.uint8))
    hi.save(f'{S}/cabelo_{w}.png');bi.save(f'{S}/corpo_{w}.png')
    rx=max(x for x,y in poly);OUT[src.split('/')[-1]]={'b':webp(bi),'h':webp(hi),'rx':round(150/w if w<392 else 160/w,4),'ry':round(60/h,4)}
J=R+'ferramentas/web/ranqueada/rk_assets.json';A=json.load(open(J));A['skhair']=OUT;json.dump(A,open(J,'w'),ensure_ascii=False,separators=(',',':'));print(OUT)
