# v407: os quadros do Shaka divino (skv) estavam em resolução 2,4x (271 MB de memória no celular) → 1,45x (~100 MB). Vídeos 800x450 → 640x360.
import json,os,io,hashlib
from PIL import Image
W='/home/claude/fui-do-templo-a-pk-2/www/';B=os.path.dirname(os.path.abspath(__file__))+'/build/skv.json'
J=json.load(open(B));K=1.45/2.4;done={}
def sv(im,q):
    b=io.BytesIO();im.save(b,'WEBP',quality=q,alpha_quality=88,method=6);d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14];open(f'{W}a/{h}.webp','wb').write(d);return 'a/'+h+'.webp'
for L in J['skv'].values():
    for f in L:
        s=f['src']
        if s not in done:im=Image.open(W+s);done[s]=sv(im.resize((max(1,round(im.width*K)),max(1,round(im.height*K))),Image.LANCZOS),86)
        f['src']=done[s]
json.dump(J,open(B,'w'),separators=(',',':'))
P='/home/claude/fui-do-templo-a-pk-2/ferramentas/web/ranqueada/rk_assets.json';A=json.load(open(P))
for k in ['t','u']:A['skdv'][k]=[sv(Image.open(W+x).resize((640,360),Image.LANCZOS),78) for x in A['skdv'][k]]
json.dump(A,open(P,'w'),separators=(',',':'),ensure_ascii=False)
px=sum(Image.open(W+v).width*Image.open(W+v).height for v in set(done.values()));print('skv memória MB',round(px*4/1e6),'arquivo MB',round(sum(os.path.getsize(W+v) for v in set(done.values()))/1e6,1))
