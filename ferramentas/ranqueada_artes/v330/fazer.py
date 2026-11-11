# v330: cartas do gacha (artes do dono) -> www/a/<md5>.webp, todas no mesmo tamanho 700x1020
import hashlib,glob,os,json,io
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));OUT=os.path.join(D,'../../../www/a');W,H=700,1020
M={}
for f in sorted(glob.glob(D+'/*.png')):
    k=os.path.basename(f)[:-4]
    if k=='modelo_10':continue
    im=Image.open(f).convert('RGBA').resize((W,H),Image.LANCZOS)
    b=io.BytesIO();im.save(b,'WEBP',quality=86,method=6);b=b.getvalue()
    h=hashlib.md5(b).hexdigest()[:14];open(f'{OUT}/{h}.webp','wb').write(b);M[k]=f'a/{h}.webp'
print(json.dumps(M,separators=(',',':')))
