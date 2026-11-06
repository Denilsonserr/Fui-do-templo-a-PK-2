import numpy as np,json
from PIL import Image
from scipy import ndimage as nd
FR=[('r04',i) for i in (2,3,4,5)]+[('r05',i) for i in (1,2,3,4,5)]+[('r18',i) for i in range(2,15)]+[('r14',i) for i in (1,2,3,4,7,8,9,10)]
def pts(t,i,n=18):
    a=np.asarray(Image.open(f'cut/{t}_{i}.png')).astype(float);r,g,b,al=[a[...,c] for c in range(4)];H,W=al.shape
    fire=(r>235)&(g>130)&(g<225)&(b<90)&(al>80)
    # tira cabelo: regiao do topo do corpo (cabelo e opaco e cercado de contorno escuro); fogo tem brilho suave em volta
    body=al>250;bodyc=nd.binary_closing(body,iterations=3)
    soft=nd.binary_dilation((al>20)&(al<200),iterations=6)
    lum=(r+g+b)/3;dark=(lum<90)&(al>120);near=nd.binary_dilation(dark,iterations=10)
    f2=fire&~near
    ys,xs=np.where(f2)
    if len(xs)<30:return []
    rng=np.random.default_rng(1);k=rng.choice(len(xs),min(n,len(xs)),replace=False)
    return [[int(xs[j]),int(ys[j])] for j in k]
if __name__=='__main__':
    O={f'{t}_{i}':pts(t,i) for t,i in FR}
    json.dump(O,open('firepts.json','w'))
    from PIL import ImageDraw
    out=[]
    for key,P in O.items():
        im=Image.open(f'cut/{key}.png').convert('RGBA');bg=Image.new('RGBA',im.size,(30,30,40,255));bg.alpha_composite(im);d=ImageDraw.Draw(bg)
        for x,y in P:d.ellipse([x-7,y-7,x+7,y+7],outline=(0,255,255,255),width=3)
        bg=bg.convert('RGB');bg.thumbnail((170,170));out.append(bg)
    C=Image.new('RGB',(8*174,4*174),'white')
    for n,im in enumerate(out):C.paste(im,((n%8)*174,(n//8)*174))
    C.save('/tmp/opt/firepts.png')
