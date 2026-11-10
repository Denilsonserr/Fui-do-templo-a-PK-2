# v279: ícones do SET DO LOBO (6 peças x 7 raridades) e das PEDRAS DAS ALMAS (7) -> webp -> RQA.lset[peça][raridade], RQA.pedra[7]
import io,hashlib,json,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));R=D+'/../../../..'
def webp(im):
    b=io.BytesIO();im.save(b,'WEBP',quality=86,method=6);d=b.getvalue();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.webp';open(R+'/www/'+n,'wb').write(d);return n
S=Image.open(D+'/set_lobo.png').convert('RGB')
X=[(116,306),(316,505),(513,705),(712,906),(913,1107),(1115,1310),(1319,1508)];Y=[(3,185),(189,365),(369,535),(539,700),(704,852),(856,1016)]
lset=[[webp(S.crop((x0,y0,x1,y1)).resize((160,round(160*(y1-y0)/(x1-x0))),Image.LANCZOS)) for (x0,x1) in X] for (y0,y1) in Y]
P=Image.open(D+'/pedras.png').convert('RGB')
PB=[(13,51,371,465),(395,51,757,468),(779,50,1142,467),(1164,44,1526,468),(108,499,532,960),(557,500,976,962),(1001,470,1426,964)]
pedra=[webp(P.crop(b).resize((170,round(170*(b[3]-b[1])/(b[2]-b[0]))),Image.LANCZOS)) for b in PB]
J=R+'/ferramentas/web/ranqueada/rk_assets.json';A=json.load(open(J));A['lset']=lset;A['pedra']=pedra;json.dump(A,open(J,'w'),ensure_ascii=False,separators=(',',':'));print('ok')
