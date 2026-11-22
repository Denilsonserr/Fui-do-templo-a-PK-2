# v613: corpo inteiro do ALUCARD (arte do dono, corpo_inteiro.png, fundo branco) -> www/a ; imprime o caminho
import numpy as np,io,hashlib,os
from PIL import Image
from scipy import ndimage as nd
D=os.path.dirname(os.path.abspath(__file__));A=os.path.join(D,'..','..','..','www','a')
a=np.asarray(Image.open(os.path.join(D,'corpo_inteiro.png')).convert('RGB')).astype(float)
mn=a.min(2);sat=a.max(2)-mn
bgish=(mn>=228)&(sat<=16);lab,k=nd.label(bgish)
brd=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
# fundo = branco ligado à borda + buracos brancos grandes entre os rasgos da capa
sz=nd.sum(np.ones_like(mn),lab,range(k+1));big=[i for i in range(1,k+1) if sz[i]>1500]
bg=np.isin(lab,list(brd|set(big)));bg=nd.binary_opening(bg,iterations=1)
al=np.where(bg,0,1.);band=nd.binary_dilation(bg,iterations=2)&~bg
al[band]=np.clip((245-mn[band])/50,0,1);al=nd.gaussian_filter(al,.6)*(~bg|band)
I=Image.fromarray(np.dstack([a,al*255]).clip(0,255).astype(np.uint8),'RGBA')
ys,xs=np.where(al>.1);I=I.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1));I.thumbnail((420,980),Image.LANCZOS)
b=io.BytesIO();I.save(b,'WEBP',quality=88,method=6);d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14]
open(f'{A}/{h}.webp','wb').write(d);I.save('/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/al_full.png');print(f'a/{h}.webp',I.size)
