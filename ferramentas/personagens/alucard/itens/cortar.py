# v607: corta os itens do Alucard (artes do dono): 3 exclusivos do PASSE premium e 6 do SET (invocação). Fundo preto ligado à borda -> transparente.
import numpy as np,json,hashlib,os
from PIL import Image
from scipy import ndimage as nd
OUT='/home/claude/fui-do-templo-a-pk-2/www/a'
def cut(src,box):
    im=Image.open(src).convert('RGB').crop(box);a=np.asarray(im).astype(float);mx=a.max(2)
    bgish=mx<28;lab,k=nd.label(bgish);br=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0};bg=np.isin(lab,list(br))
    al=np.where(bg,0.,1.);band=nd.binary_dilation(bg,iterations=3)&~bg;al[band]=np.clip(mx[band]/90,0,1);al=nd.gaussian_filter(al,.6)*np.where(bg,0,1)+np.where(bg,0,0)
    al[~bg]=np.maximum(al[~bg],np.where(band[~bg],al[~bg],1))
    rgba=np.dstack([a,al*255]).clip(0,255).astype(np.uint8);im=Image.fromarray(rgba,'RGBA')
    w,h=im.size;S=max(w,h);c=Image.new('RGBA',(S,S),(0,0,0,0));c.paste(im,((S-w)//2,(S-h)//2));c=c.resize((256,256),Image.LANCZOS)
    p=hashlib.md5(c.tobytes()).hexdigest()[:14];c.save(f'{OUT}/{p}.webp','WEBP',quality=90,alpha_quality=92,method=6);return f'a/{p}.webp'
R={}
R['alpluv']=cut('itens_passe.png',(15,0,614,640));R['alpane']=cut('itens_passe.png',(640,0,1241,640));R['alpcap']=cut('itens_passe.png',(293,640,931,1254))
X=[(12,411),(429,830),(848,1250)];Y=[(110,623),(624,1137)]
for n,(xi,yi) in zip(['alcap','alarm','alesp','alluv','alane','albot'],[(0,0),(1,0),(2,0),(0,1),(1,1),(2,1)]):R[n]=cut('itens_set.png',(X[xi][0],Y[yi][0],X[xi][1],Y[yi][1]))
im=Image.open('passe_alucard.png').convert('RGB');im.save('/tmp/tf/p.webp','WEBP',quality=88);h=hashlib.md5(open('/tmp/tf/p.webp','rb').read()).hexdigest()[:14];os.replace('/tmp/tf/p.webp',f'{OUT}/{h}.webp');R['passe']=f'a/{h}.webp'
json.dump(R,open('itens.json','w'));print(R)
S=Image.new('RGBA',(9*130,140),(40,90,40,255))
for i,k in enumerate([k for k in R if k!='passe']):S.alpha_composite(Image.open('/home/claude/fui-do-templo-a-pk-2/www/'+R[k]).convert('RGBA').resize((128,128)),(i*130,6))
S.convert('RGB').save('/tmp/tf/itens_al.png')
