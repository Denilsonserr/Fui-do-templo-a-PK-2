# v598: vídeos do ALUCARD (do dono) → quadros webp (www/a) + build/videos.json {t:[transformação], u:[ultimate]}.
# "Melhorar a qualidade": 960x540 com lanczos + nitidez (unsharp) + um pouco mais de contraste/saturação. 12 quadros/s.
import os,subprocess,tempfile,hashlib,json,glob
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));OUT=os.path.join(D,'..','..','..','..','www','a')
def vid(fn,fps=12):
    T=tempfile.mkdtemp();subprocess.run(['ffmpeg','-v','error','-i',os.path.join(D,fn),'-vf',f'fps={fps},scale=960:540:flags=lanczos,unsharp=5:5:0.9:5:5:0.0,eq=contrast=1.06:saturation=1.12',f'{T}/v_%03d.png'],check=True)
    L=[]
    for f in sorted(glob.glob(f'{T}/v_*.png')):
        im=Image.open(f).convert('RGB');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
        if not os.path.exists(p):im.save(p,'WEBP',quality=80,method=5)
        L.append('a/'+h+'.webp')
    return L
os.makedirs(os.path.join(D,'..','build'),exist_ok=True)
J={'t':vid('transformacao_alucard.mp4'),'u':vid('ultimate_alucard.mp4')}
json.dump(J,open(os.path.join(D,'..','build','videos.json'),'w'),separators=(',',':'));print({k:len(v) for k,v in J.items()})
