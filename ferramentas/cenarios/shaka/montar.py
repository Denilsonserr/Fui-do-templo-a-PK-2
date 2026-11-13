# v389: monta as camadas finais do cenário do Shaka (3 estados: inteiro → rachado → destruído) em www/a/*.webp + shk.json
# cada estado: céu (p .03), meio (p .25-.3), fundo = templo+estátua juntos (p .6), chão (p 1). Coordenadas = layout.json (sim.py mostra a câmera)
import io,os,json,hashlib
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));A=os.path.join(D,'..','..','..','www','a')
L=json.load(open(D+'/layout.json'));WW=2400
def im(n):return Image.open(D+'/camadas/'+n+'.png').convert('RGBA')
def save(img,q=84,alpha=True):
    b=io.BytesIO();(img if alpha else img.convert('RGB')).save(b,'WEBP',quality=q,alpha_quality=88,method=6);d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14]
    open(f'{A}/{h}.webp','wb').write(d);return 'a/'+h+'.webp',len(d)//1024
out=[];tot=0
for ph in L:
    R=[]
    by={}
    for nm,p,sc,dy in ph:by.setdefault(p,[]).append((nm,sc,dy))
    for p in sorted(by):
        G=by[p];nm0,sc0,dy0=G[0];base=im(nm0);W0=base.width*sc0
        if len(G)>1:   # junta camadas do mesmo parallax numa imagem só (na escala da 1ª)
            c=base.copy()
            for nm,sc,dy in G[1:]:
                o=im(nm);w=o.width*sc;k=sc/sc0;o=o.resize((round(o.width*k),round(o.height*k)),Image.LANCZOS)
                t=Image.new('RGBA',c.size,(0,0,0,0));t.paste(o,(round((W0-w)/2/sc0),round((dy-dy0)/sc0)));c=Image.alpha_composite(c,t)
            base=c
        sky=p<.1;src=base
        if sky:src=base.resize((base.width*2//3,base.height*2//3),Image.LANCZOS)
        u,kb=save(src,q=80 if sky else 84,alpha=not sky);tot+=kb
        R.append([u,p,round(W0),round(base.height*sc0),dy0]);print(nm0,u,kb,'KB')
    out.append(R)
json.dump(out,open(D+'/shk.json','w'));print('total',tot,'KB')
