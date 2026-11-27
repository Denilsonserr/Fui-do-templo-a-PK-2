# v649: 5 emblemas novos do dono (já com fundo transparente) → webp 384px em www/a/<md5[:14]>.webp
import hashlib,io,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));W=os.path.join(D,'../../../www/a')
for nm in ['deus_ancestral','deus_originario','deus_infinito','deus_criacao','deus_genesis']:
    I=Image.open(f'{D}/{nm}.png').convert('RGBA');bb=I.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox();I=I.crop(bb)
    s=384/max(I.size);I=I.resize((round(I.width*s),round(I.height*s)),Image.LANCZOS);b=io.BytesIO();I.save(b,'WEBP',quality=88,method=6);d=b.getvalue()
    h=hashlib.md5(d).hexdigest()[:14];open(f'{W}/{h}.webp','wb').write(d);print(nm,f'a/{h}.webp',I.size,len(d))
